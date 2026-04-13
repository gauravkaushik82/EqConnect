import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getSupabase } from '../lib/supabase.js'

const router = Router()

/**
 * GET /api/skills
 * Get authenticated user's skills
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const supabase = getSupabase()

    // Fetch user's skills
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false })

    if (error) {
      console.error('Error fetching skills:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch skills'
      })
    }

    res.json({
      success: true,
      data: {
        skills: data || [],
        total_endorsements: (data || []).reduce((sum: number, s: any) => sum + (s.endorsements || 0), 0)
      }
    })
  } catch (err: any) {
    console.error('Error in GET /api/skills:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

/**
 * GET /api/skills/:userId
 * Get another user's skills (public view)
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const supabase = getSupabase()

    // Fetch user's skills
    const { data, error } = await supabase
      .from('skills')
      .select('id, name, level, endorsements, added_at')
      .eq('user_id', userId)
      .order('endorsements', { ascending: false })

    if (error) {
      console.error('Error fetching skills:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch skills'
      })
    }

    res.json({
      success: true,
      data: {
        skills: data || [],
        total_endorsements: (data || []).reduce((sum: number, s: any) => sum + (s.endorsements || 0), 0)
      }
    })
  } catch (err: any) {
    console.error('Error in GET /api/skills/:userId:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

/**
 * POST /api/skills
 * Add a new skill for authenticated user
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const { name, level } = req.body

    if (!name || !level) {
      return res.status(400).json({
        success: false,
        message: 'Name and level are required'
      })
    }

    if (!['beginner', 'intermediate', 'advanced', 'expert'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid skill level'
      })
    }

    const supabase = getSupabase()

    // Check if skill already exists
    const { data: existingSkill } = await supabase
      .from('skills')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', name)
      .single()

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: 'This skill already exists'
      })
    }

    // Add new skill
    const { data, error } = await supabase
      .from('skills')
      .insert({
        user_id: user.id,
        name: name.trim(),
        level,
        endorsements: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding skill:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to add skill'
      })
    }

    res.json({
      success: true,
      data
    })
  } catch (err: any) {
    console.error('Error in POST /api/skills:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

/**
 * PUT /api/skills/:skillId
 * Update skill level
 */
router.put('/:skillId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const { skillId } = req.params
    const { level } = req.body

    if (!level) {
      return res.status(400).json({
        success: false,
        message: 'Level is required'
      })
    }

    if (!['beginner', 'intermediate', 'advanced', 'expert'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid skill level'
      })
    }

    const supabase = getSupabase()

    // Verify skill belongs to user
    const { data: skill, error: fetchError } = await supabase
      .from('skills')
      .select('id')
      .eq('id', skillId)
      .eq('user_id', user.id)
      .single()

    if (!skill || fetchError) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      })
    }

    // Update skill
    const { data, error } = await supabase
      .from('skills')
      .update({ level })
      .eq('id', skillId)
      .select()
      .single()

    if (error) {
      console.error('Error updating skill:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to update skill'
      })
    }

    res.json({
      success: true,
      data
    })
  } catch (err: any) {
    console.error('Error in PUT /api/skills/:skillId:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

/**
 * DELETE /api/skills/:skillId
 * Delete a skill
 */
router.delete('/:skillId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const { skillId } = req.params
    const supabase = getSupabase()

    // Verify skill belongs to user
    const { data: skill, error: fetchError } = await supabase
      .from('skills')
      .select('id')
      .eq('id', skillId)
      .eq('user_id', user.id)
      .single()

    if (!skill || fetchError) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      })
    }

    // Delete skill
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', skillId)

    if (error) {
      console.error('Error deleting skill:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to delete skill'
      })
    }

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    })
  } catch (err: any) {
    console.error('Error in DELETE /api/skills/:skillId:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

/**
 * POST /api/skills/:skillId/endorse
 * Endorse a skill (recruiter action)
 */
router.post('/:skillId/endorse', authMiddleware, async (req: Request, res: Response) => {
  try {
    const endorser = (req as any).user
    const { skillId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      })
    }

    // Can't endorse own skills
    if (endorser.id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot endorse your own skills'
      })
    }

    const supabase = getSupabase()

    // Check if already endorsed
    const { data: existing } = await supabase
      .from('skill_endorsements')
      .select('id')
      .eq('skill_id', skillId)
      .eq('endorsed_by', endorser.id)
      .single()

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already endorsed this skill'
      })
    }

    // Add endorsement
    const { error: insertError } = await supabase
      .from('skill_endorsements')
      .insert({
        skill_id: skillId,
        endorsed_by: endorser.id
      })

    if (insertError) {
      console.error('Error endorsing skill:', insertError)
      return res.status(500).json({
        success: false,
        message: 'Failed to endorse skill'
      })
    }

    // Update endorsement count
    const { data, error } = await supabase
      .from('skills')
      .update({ endorsements: (await supabase.from('skill_endorsements').select('*').eq('skill_id', skillId)).data?.length || 0 })
      .eq('id', skillId)
      .select()
      .single()

    if (error) {
      console.error('Error updating endorsement count:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to update endorsement count'
      })
    }

    res.json({
      success: true,
      data,
      message: 'Skill endorsed successfully'
    })
  } catch (err: any) {
    console.error('Error in POST /api/skills/:skillId/endorse:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

export default router
