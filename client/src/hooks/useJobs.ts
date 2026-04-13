import { useState, useCallback } from 'react'

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001'
const API_URL = `${API_BASE}/api/jobs`

export interface JobPosting {
  id: string
  recruiter_id: string
  title: string
  description: string
  company_name: string
  location?: string
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote'
  experience_level: 'entry' | 'mid' | 'senior' | 'lead'
  required_skills: string[]
  salary_min?: number
  salary_max?: number
  salary_currency: string
  posted_at: string
  deadline?: string
  status: 'active' | 'closed' | 'archived'
  view_count: number
  application_count: number
  created_at: string
  updated_at: string
}

export interface JobFilters {
  search?: string
  jobType?: string
  experience?: string
  status?: string
  limit?: number
  offset?: number
}

export const useJobs = () => {
  const token = localStorage.getItem('auth_token')
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [currentJob, setCurrentJob] = useState<JobPosting | null>(null)
  const [recruiterJobs, setRecruiterJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  // Fetch all jobs with filters
  const fetchJobs = useCallback(
    async (filters: JobFilters = {}) => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (filters.search) params.append('search', filters.search)
        if (filters.jobType) params.append('jobType', filters.jobType)
        if (filters.experience) params.append('experience', filters.experience)
        if (filters.status) params.append('status', filters.status)
        if (filters.limit) params.append('limit', filters.limit.toString())
        if (filters.offset) params.append('offset', filters.offset.toString())

        const response = await fetch(`${API_URL}/jobs?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch jobs')

        const data = await response.json()
        setJobs(data.jobs)
        setTotal(data.total)
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching jobs:', err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Fetch single job
  const fetchJob = useCallback(async (jobId: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/jobs/${jobId}`)
      if (!response.ok) throw new Error('Failed to fetch job')

      const job = await response.json()
      setCurrentJob(job)
      return job
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching job:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create job (recruiter)
  const createJob = useCallback(
    async (jobData: Omit<JobPosting, 'id' | 'posted_at' | 'created_at' | 'updated_at' | 'view_count' | 'application_count'>) => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jobData),
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Failed to create job')
        }

        const data = await response.json()
        setRecruiterJobs([data.job, ...recruiterJobs])
        return data.job
      } catch (err: any) {
        setError(err.message)
        console.error('Error creating job:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [token, recruiterJobs]
  )

  // Update job
  const updateJob = useCallback(
    async (jobId: string, updates: Partial<JobPosting>) => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/jobs/${jobId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Failed to update job')
        }

        const data = await response.json()
        setRecruiterJobs(recruiterJobs.map((j) => (j.id === jobId ? data.job : j)))
        return data.job
      } catch (err: any) {
        setError(err.message)
        console.error('Error updating job:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [token, recruiterJobs]
  )

  // Delete job
  const deleteJob = useCallback(
    async (jobId: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/jobs/${jobId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Failed to delete job')
        }

        setRecruiterJobs(recruiterJobs.filter((j) => j.id !== jobId))
      } catch (err: any) {
        setError(err.message)
        console.error('Error deleting job:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [token, recruiterJobs]
  )

  // Fetch recruiter's jobs
  const fetchRecruiterJobs = useCallback(
    async (status: string = 'active') => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/jobs/recruiter/my-jobs?status=${status}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch recruiter jobs')

        const data = await response.json()
        setRecruiterJobs(data.jobs)
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching recruiter jobs:', err)
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  return {
    jobs,
    currentJob,
    recruiterJobs,
    loading,
    error,
    total,
    fetchJobs,
    fetchJob,
    createJob,
    updateJob,
    deleteJob,
    fetchRecruiterJobs,
  }
}
