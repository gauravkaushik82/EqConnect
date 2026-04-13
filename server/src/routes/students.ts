import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getSupabase } from '../lib/supabase.js'

const router = Router()

/**
 * GET /api/students
 * Fetch all students with GitHub connected (for recruiter discovery)
 * Query params: search, university, degree, branch, year, min_repos
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    
    // Only recruiters can access this
    if (user.role !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Only recruiters can access student discovery'
      })
    }

    const supabase = getSupabase()

    // Fetch students with their GitHub data
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        github_username,
        github_avatar_url,
        created_at
      `)
      .eq('role', 'student')
      .not('github_username', 'is', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching students:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch students'
      })
    }

    // For each student, fetch their GitHub repositories count and profile info
    const studentsWithRepos = await Promise.all(
      data.map(async (student: any) => {
        // Fetch repository count for this student
        const { count, error: countError } = await supabase
          .from('github_repositories')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', student.id)

        // Fetch student profile info
        const { data: profileData } = await supabase
          .from('student_profiles')
          .select('university, degree, branch, year_of_study, bio')
          .eq('user_id', student.id)
          .single()

        return {
          id: student.id,
          email: student.email,
          full_name: student.full_name,
          avatar_url: student.avatar_url,
          github_username: student.github_username,
          github_avatar_url: student.github_avatar_url,
          repositories_count: countError ? 0 : (count || 0),
          university: profileData?.university || null,
          degree: profileData?.degree || null,
          branch: profileData?.branch || null,
          year_of_study: profileData?.year_of_study || null,
          bio: profileData?.bio || null,
        }
      })
    )

    res.json({
      success: true,
      data: studentsWithRepos,
      count: studentsWithRepos.length
    })
  } catch (err: any) {
    console.error('Error in GET /api/students:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

/**
 * GET /api/students/:studentId
 * Fetch detailed student profile with all GitHub data (for recruiter view)
 */
router.get('/:studentId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const { studentId } = req.params

    // Only recruiters can access this
    if (user.role !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Only recruiters can access student profiles'
      })
    }

    const supabase = getSupabase()

    // Fetch student basic info
    const { data: studentData, error: studentError } = await supabase
      .from('users')
      .select('*')
      .eq('id', studentId)
      .single()

    if (studentError || !studentData) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      })
    }

    // Fetch student profile
    const { data: profileData } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', studentId)
      .single()

    // Fetch student's repositories
    const { data: repos } = await supabase
      .from('github_repositories')
      .select('*')
      .eq('user_id', studentId)
      .order('stars', { ascending: false })

    res.json({
      success: true,
      data: {
        user: studentData,
        profile: profileData,
        repositories: repos || []
      }
    })
  } catch (err: any) {
    console.error('Error in GET /api/students/:studentId:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

export default router
