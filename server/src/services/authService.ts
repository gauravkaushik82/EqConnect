import { getSupabase, getSupabaseAuth } from '../lib/supabase.js'

interface RegisterPayload {
  email: string
  password: string
  fullName: string
  role: 'student' | 'university' | 'recruiter' | 'super_admin'
  universityName?: string
  degree?: string
  branch?: string
  year?: string
  urn?: string
}

interface LoginPayload {
  email: string
  password: string
}

// Retry logic for rate-limited requests
async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 3, initialDelayMs = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      // Check if it's a rate limit error
      const isRateLimit = 
        error.message?.includes('rate_limit') || 
        error.message?.includes('Too many requests') ||
        error.message?.includes('exceeded')
      
      if (!isRateLimit || i === maxRetries - 1) {
        throw error // Not a rate limit or last retry
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delayMs = initialDelayMs * Math.pow(2, i)
      console.log(`Rate limited. Retrying in ${delayMs}ms... (attempt ${i + 1}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
}

// Register a new user
export async function registerUser(payload: RegisterPayload) {
  try {
    const supabaseAuth = getSupabaseAuth()
    const supabase = getSupabase()

    // 1. Create user in Supabase Auth (using anon key) - with retry for rate limits
    const { data: authData, error: authError } = await retryWithBackoff(() =>
      supabaseAuth.auth.signUp({
        email: payload.email,
        password: payload.password
      })
    )

    if (authError) throw authError
    if (!authData.user) throw new Error('User creation failed')

    const userId = authData.user.id

    // 2. Create base user record
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: payload.email,
        full_name: payload.fullName,
        role: payload.role,
        verification_status: 'unverified',
        verification_score: 0
      })

    if (userError) throw userError

    // 3. Create role-specific profile
    if (payload.role === 'student') {
      const { error: profileError } = await supabase
        .from('student_profiles')
        .insert({
          user_id: userId,
          university_name: payload.universityName,
          degree: payload.degree,
          branch: payload.branch,
          year_of_study: payload.year,
          urn: payload.urn
        })
      if (profileError) throw profileError
    }

    // 4. Generate JWT token
    const token = await generateJWT(userId, payload.email, payload.role)

    return {
      success: true,
      user: {
        id: userId,
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role
      },
      token
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Registration failed'
    }
  }
}

// Login with email and password
export async function loginUser(payload: LoginPayload) {
  try {
    const supabaseAuth = getSupabaseAuth()
    const supabase = getSupabase()

    // 1. Authenticate with Supabase (using anon key) - with retry for rate limits
    const { data: authData, error: authError } = await retryWithBackoff(() =>
      supabaseAuth.auth.signInWithPassword({
        email: payload.email,
        password: payload.password
      })
    )

    if (authError) throw authError
    if (!authData.user) throw new Error('Login failed')

    const userId = authData.user.id

    // 2. Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    // 3. Generate JWT token
    const token = await generateJWT(userId, user.email, user.role)

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        verificationStatus: user.verification_status
      },
      token
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Login failed'
    }
  }
}

// Get current user by ID
export async function getCurrentUser(userId: string) {
  try {
    const supabase = getSupabase()

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        verificationStatus: user.verification_status,
        verificationScore: user.verification_score,
        avatarUrl: user.avatar_url
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get user'
    }
  }
}

// Generate JWT token (you'll need to install 'jsonwebtoken')
async function generateJWT(userId: string, email: string, role: string): Promise<string> {
  // For now, return a simple token
  // In production, use 'jsonwebtoken' package:
  // import jwt from 'jsonwebtoken'
  // const token = jwt.sign({ userId, email, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
  
  const token = Buffer.from(JSON.stringify({ userId, email, role, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64')
  return token
}

// Verify JWT token
export function verifyJWT(token: string): { userId: string; email: string; role: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    if (decoded.exp < Date.now()) {
      return null // Token expired
    }
    return decoded
  } catch {
    return null
  }
}
