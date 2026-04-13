import { Router, Request, Response } from 'express'
import { registerUser, loginUser, getCurrentUser } from '../services/authService.js'
import { authMiddleware } from '../middleware/auth.js'
import { RegisterSchema, LoginSchema } from '../lib/validation.js'

const router = Router()

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validation = RegisterSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      })
    }

    // Register user
    const result = await registerUser({
      email: validation.data.email,
      password: validation.data.password,
      fullName: (validation.data as any).fullName || (validation.data as any).full_name || '',
      role: validation.data.role,
      universityName: req.body.universityName,
      degree: req.body.degree,
      branch: req.body.branch,
      year: req.body.year,
      urn: req.body.urn
    })

    if (!result.success) {
      // Check if it's a rate limit error
      const isRateLimit = result.error?.includes('rate_limit') || result.error?.includes('Too many')
      const statusCode = isRateLimit ? 429 : 400
      
      return res.status(statusCode).json({ 
        error: result.error,
        isRateLimit: isRateLimit,
        retryAfter: isRateLimit ? 60 : undefined
      })
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token
    })
  } catch (error: any) {
    console.error('Register error:', error)
    const isRateLimit = error.message?.includes('rate_limit') || error.message?.includes('Too many')
    const statusCode = isRateLimit ? 429 : 500
    
    res.status(statusCode).json({ 
      error: 'Registration failed', 
      details: error.message,
      isRateLimit: isRateLimit,
      retryAfter: isRateLimit ? 60 : undefined
    })
  }
})

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validation = LoginSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      })
    }

    // Login user
    const result = await loginUser({
      email: validation.data.email,
      password: validation.data.password
    })

    if (!result.success) {
      // Check if it's a rate limit error
      const isRateLimit = result.error?.includes('rate_limit') || result.error?.includes('Too many')
      const statusCode = isRateLimit ? 429 : 401
      
      return res.status(statusCode).json({ 
        error: result.error,
        isRateLimit: isRateLimit,
        retryAfter: isRateLimit ? 60 : undefined
      })
    }

    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    })
  } catch (error: any) {
    console.error('Login error:', error)
    const isRateLimit = error.message?.includes('rate_limit') || error.message?.includes('Too many')
    const statusCode = isRateLimit ? 429 : 500
    
    res.status(statusCode).json({ 
      error: 'Login failed', 
      details: error.message,
      isRateLimit: isRateLimit,
      retryAfter: isRateLimit ? 60 : undefined
    })
  }
})

/**
 * GET /api/auth/me
 * Get current user (requires authentication)
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const result = await getCurrentUser(req.user.userId)

    if (!result.success) {
      return res.status(404).json({ error: result.error })
    }

    res.json({
      user: result.user
    })
  } catch (error: any) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user', details: error.message })
  }
})

/**
 * POST /api/auth/logout
 * Logout user (just return success, real logout happens on client)
 */
router.post('/logout', authMiddleware, (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' })
})

export default router
