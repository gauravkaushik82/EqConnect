import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getSupabase, getSupabaseAuth } from '../lib/supabase.js'

const router = Router()

/**
 * POST /api/super-admin/register
 * Register a new super admin (requires super admin credentials to verify)
 * Only existing super admins can create new super admins
 */
router.post('/register', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body
    const requestingUserId = (req as any).user?.id
    const supabase = getSupabase()

    // Verify requesting user is super admin
    const { data: adminCheck, error: adminError } = await supabase
      .from('super_admin_accounts')
      .select('*')
      .eq('user_id', requestingUserId)
      .single()

    if (adminError || !adminCheck) {
      return res.status(403).json({
        error: 'Unauthorized. Only super admins can create new super admins.'
      })
    }

    // Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({
        error: 'Email, password, and full name are required'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters'
      })
    }

    // Create new super admin user in auth
    const supabaseAuth = getSupabaseAuth()
    const { data, error } = await supabaseAuth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: 'super_admin'
      }
    })

    if (error) {
      return res.status(400).json({
        error: 'Failed to create super admin user',
        details: error.message
      })
    }

    // Create super admin record in database
    const { error: dbError } = await supabase
      .from('super_admin_accounts')
      .insert({
        user_id: data.user.id,
        admin_level: 'super_admin',
        created_at: new Date().toISOString()
      })

    if (dbError) {
      return res.status(400).json({
        error: 'Failed to create super admin record',
        details: dbError.message
      })
    }

    // Create user record
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: 'super_admin',
        created_at: new Date().toISOString()
      })

    if (userError) {
      console.error('Failed to create user record:', userError)
      // Don't fail completely, user was created in auth
    }

    res.status(201).json({
      message: 'Super admin created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        role: 'super_admin'
      }
    })
  } catch (error: any) {
    console.error('Super admin registration error:', error)
    res.status(500).json({
      error: 'Failed to create super admin',
      details: error.message
    })
  }
})

/**
 * GET /api/super-admin/verify
 * Verify if current user is a super admin
 */
router.get('/verify', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('super_admin_accounts')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return res.status(403).json({
        error: 'User is not a super admin'
      })
    }

    res.json({
      isSuperAdmin: true,
      adminLevel: data.admin_level,
      createdAt: data.created_at
    })
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to verify super admin status',
      details: error.message
    })
  }
})

/**
 * GET /api/super-admin/all-admins
 * Get list of all super admins (only for super admins)
 */
router.get('/all-admins', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const supabase = getSupabase()

    // Verify requesting user is super admin
    const { data: adminCheck } = await supabase
      .from('super_admin_accounts')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!adminCheck) {
      return res.status(403).json({
        error: 'Unauthorized'
      })
    }

    // Get all super admins
    const { data, error } = await supabase
      .from('super_admin_accounts')
      .select('*, users(email, full_name, created_at)')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({
        error: 'Failed to fetch super admins',
        details: error.message
      })
    }

    res.json({
      admins: data,
      totalAdmins: data?.length || 0
    })
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch super admins',
      details: error.message
    })
  }
})

export default router
