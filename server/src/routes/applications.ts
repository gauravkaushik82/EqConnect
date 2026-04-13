import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getSupabase } from '../lib/supabase.js'

const router = Router()

// POST apply for job (student only)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.id
    const userRole = (req as any).user.role

    // Only students can apply
    if (userRole !== 'student') {
      return res.status(403).json({ error: 'Only students can apply for jobs' })
    }

    const { job_id, cover_letter } = req.body

    // Validate job exists
    if (!job_id) {
      return res.status(400).json({ error: 'Job ID is required' })
    }

    const { data: job } = await supabase.from('job_postings').select('*').eq('id', job_id).single()

    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    // Check if already applied
    const { data: existing } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', job_id)
      .eq('student_id', userId)
      .single()

    if (existing) {
      return res.status(409).json({ error: 'You have already applied for this job' })
    }

    // Create application
    const { data: application, error } = await supabase
      .from('job_applications')
      .insert([
        {
          job_id,
          student_id: userId,
          cover_letter: cover_letter?.trim() || null,
          status: 'pending',
        },
      ])
      .select()

    if (error) throw error

    // Update job application count
    await supabase
      .from('job_postings')
      .update({ application_count: (job.application_count || 0) + 1 })
      .eq('id', job_id)

    res.status(201).json({ application: application?.[0], message: 'Application submitted' })
  } catch (error: any) {
    console.error('Error applying for job:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET student's applications
router.get('/student/my-applications', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.id
    const { status } = req.query

    let query = supabase
      .from('job_applications')
      .select('*, job:job_postings(*)')
      .eq('student_id', userId)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: applications, error } = await query.order('applied_at', { ascending: false })

    if (error) throw error

    res.json({ applications })
  } catch (error: any) {
    console.error('Error fetching applications:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET recruiter's job applications
router.get('/recruiter/applications', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.id
    const { job_id, status } = req.query

    let query = supabase
      .from('job_applications')
      .select('*, job:job_postings(*), student:users(*)')
      .eq('job:job_postings.recruiter_id', userId)

    if (job_id) {
      query = query.eq('job_id', job_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: applications, error } = await query.order('applied_at', { ascending: false })

    if (error) throw error

    res.json({ applications })
  } catch (error: any) {
    console.error('Error fetching recruiter applications:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET single application
router.get('/:applicationId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.id
    const { applicationId } = req.params

    const { data: application, error } = await supabase
      .from('job_applications')
      .select('*, job:job_postings(*), student:users(*)')
      .eq('id', applicationId)
      .single()

    if (error || !application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    // Check authorization (student who applied or recruiter who posted job)
    if (
      application.student_id !== userId &&
      (application.job?.recruiter_id !== userId || !application.job)
    ) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    res.json(application)
  } catch (error: any) {
    console.error('Error fetching application:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update application status (recruiter only)
router.put('/:applicationId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.id
    const { applicationId } = req.params
    const { status } = req.body

    if (!status || !['pending', 'reviewed', 'rejected', 'interview', 'accepted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    // Get application
    const { data: application } = await supabase
      .from('job_applications')
      .select('*, job:job_postings(*)')
      .eq('id', applicationId)
      .single()

    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    // Verify recruiter owns the job
    if (application.job?.recruiter_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    // Update application
    const { data: updated, error } = await supabase
      .from('job_applications')
      .update({ status, updated_at: new Date() })
      .eq('id', applicationId)
      .select()

    if (error) throw error

    res.json({ application: updated?.[0], message: 'Application updated' })
  } catch (error: any) {
    console.error('Error updating application:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE application
router.delete('/:applicationId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.id
    const { applicationId } = req.params

    // Get application
    const { data: application } = await supabase
      .from('job_applications')
      .select('*, job:job_postings(*)')
      .eq('id', applicationId)
      .single()

    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    // Verify authorization (student who applied or recruiter)
    if (
      application.student_id !== userId &&
      application.job?.recruiter_id !== userId
    ) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    // Delete application
    const { error } = await supabase.from('job_applications').delete().eq('id', applicationId)

    if (error) throw error

    // Update job application count
    await supabase
      .from('job_postings')
      .update({
        application_count: Math.max(0, (application.job?.application_count || 1) - 1),
      })
      .eq('id', application.job_id)

    res.json({ message: 'Application deleted' })
  } catch (error: any) {
    console.error('Error deleting application:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
