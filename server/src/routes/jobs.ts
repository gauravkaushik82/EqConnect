import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getSupabase } from '../lib/supabase.js'

const router = Router()

// GET all jobs with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const { search, jobType, experience, status = 'active', limit = 20, offset = 0 } = req.query
    let query = supabase.from('job_postings').select('*')

    // Filter by status
    query = query.eq('status', status)

    // Search by title or company
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,company_name.ilike.%${search}%,description.ilike.%${search}%`
      )
    }

    // Filter by job type
    if (jobType) {
      query = query.eq('job_type', jobType)
    }

    // Filter by experience level
    if (experience) {
      query = query.eq('experience_level', experience)
    }

    // Pagination
    query = query.order('posted_at', { ascending: false }).range(offset as number, (offset as number) + (limit as number) - 1)

    const { data, error, count } = await query

    if (error) throw error

    res.json({ jobs: data, total: count, offset, limit })
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET single job with application count
router.get('/:jobId', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const { jobId } = req.params

    const { data: job, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error) throw error
    if (!job) return res.status(404).json({ error: 'Job not found' })

    // Increment view count
    await supabase
      .from('job_postings')
      .update({ view_count: (job.view_count || 0) + 1 })
      .eq('id', jobId)

    res.json(job)
  } catch (error: any) {
    console.error('Error fetching job:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST create job (recruiter only)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.id
    const userRole = (req as any).user.role

    // Only recruiters can post jobs
    if (userRole !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can post jobs' })
    }

    const {
      title,
      description,
      company_name,
      location,
      job_type,
      experience_level,
      required_skills,
      salary_min,
      salary_max,
      salary_currency,
      deadline,
    } = req.body

    // Validate required fields
    if (!title?.trim() || !description?.trim() || !company_name?.trim() || !job_type || !experience_level) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (title.length > 255 || title.length < 3) {
      return res.status(400).json({ error: 'Title must be between 3 and 255 characters' })
    }

    if (description.length < 20 || description.length > 5000) {
      return res.status(400).json({ error: 'Description must be between 20 and 5000 characters' })
    }

    const { data: job, error } = await supabase.from('job_postings').insert([
      {
        recruiter_id: userId,
        title: title.trim(),
        description: description.trim(),
        company_name: company_name.trim(),
        location: location?.trim() || null,
        job_type,
        experience_level,
        required_skills: required_skills || [],
        salary_min: salary_min || null,
        salary_max: salary_max || null,
        salary_currency: salary_currency || 'USD',
        deadline: deadline || null,
        status: 'active',
      },
    ]).select()

    if (error) throw error

    res.status(201).json({ job: job?.[0], message: 'Job posted successfully' })
  } catch (error: any) {
    console.error('Error creating job:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update job (recruiter only)
router.put('/:jobId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.id
    const { jobId } = req.params
    const { title, description, company_name, location, status, deadline } = req.body

    // Get job
    const { data: job, error: getError } = await supabase.from('job_postings').select('*').eq('id', jobId).single()

    if (getError || !job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    // Verify ownership
    if (job.recruiter_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    // Update job
    const { data: updated, error } = await supabase
      .from('job_postings')
      .update({
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(company_name && { company_name: company_name.trim() }),
        ...(location && { location: location.trim() }),
        ...(status && { status }),
        ...(deadline && { deadline }),
        updated_at: new Date(),
      })
      .eq('id', jobId)
      .select()

    if (error) throw error

    res.json({ job: updated?.[0], message: 'Job updated successfully' })
  } catch (error: any) {
    console.error('Error updating job:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE job (recruiter only)
router.delete('/:jobId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.id
    const { jobId } = req.params

    // Get job
    const { data: job, error: getError } = await supabase.from('job_postings').select('*').eq('id', jobId).single()

    if (getError || !job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    // Verify ownership
    if (job.recruiter_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    // Delete job
    const { error } = await supabase.from('job_postings').delete().eq('id', jobId)

    if (error) throw error

    res.json({ message: 'Job deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting job:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET recruiter's jobs
router.get('/recruiter/my-jobs', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.id
    const { status = 'active' } = req.query

    let query = supabase.from('job_postings').select('*').eq('recruiter_id', userId)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: jobs, error } = await query.order('posted_at', { ascending: false })

    if (error) throw error

    res.json({ jobs })
  } catch (error: any) {
    console.error('Error fetching recruiter jobs:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
