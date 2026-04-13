import { useState, useCallback } from 'react'
import { JobPosting } from './useJobs'

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001'
const API_URL = `${API_BASE}/api/applications`

export interface JobApplication {
  id: string
  job_id: string
  student_id: string
  cover_letter?: string
  status: 'pending' | 'reviewed' | 'rejected' | 'interview' | 'accepted'
  applied_at: string
  updated_at?: string
  job?: JobPosting
  student?: any
}

export const useApplications = () => {
  const token = localStorage.getItem('auth_token')
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [recruiterApplications, setRecruiterApplications] = useState<JobApplication[]>([])
  const [currentApplication, setCurrentApplication] = useState<JobApplication | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Apply for job (student)
  const applyForJob = useCallback(
    async (jobId: string, coverLetter?: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            job_id: jobId,
            cover_letter: coverLetter,
          }),
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Failed to apply for job')
        }

        const data = await response.json()
        setApplications([data.application, ...applications])
        return data.application
      } catch (err: any) {
        setError(err.message)
        console.error('Error applying for job:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [token, applications]
  )

  // Fetch student's applications
  const fetchStudentApplications = useCallback(
    async (status?: string) => {
      try {
        setLoading(true)
        setError(null)

        const url = new URL(`${API_URL}/student/my-applications`)
        if (status) url.searchParams.append('status', status)

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch applications')

        const data = await response.json()
        setApplications(data.applications)
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching applications:', err)
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  // Fetch recruiter's applications
  const fetchRecruiterApplications = useCallback(
    async (jobId?: string, status?: string) => {
      try {
        setLoading(true)
        setError(null)

        const url = new URL(`${API_URL}/recruiter/applications`)
        if (jobId) url.searchParams.append('job_id', jobId)
        if (status) url.searchParams.append('status', status)

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch applications')

        const data = await response.json()
        setRecruiterApplications(data.applications)
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching recruiter applications:', err)
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  // Get single application
  const fetchApplication = useCallback(
    async (applicationId: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/${applicationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error('Application not found')

        const data = await response.json()
        setCurrentApplication(data)
        return data
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching application:', err)
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  // Update application status (recruiter)
  const updateApplicationStatus = useCallback(
    async (applicationId: string, newStatus: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/${applicationId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Failed to update application')
        }

        const data = await response.json()
        setRecruiterApplications(
          recruiterApplications.map((app) => (app.id === applicationId ? data.application : app))
        )
        return data.application
      } catch (err: any) {
        setError(err.message)
        console.error('Error updating application:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [token, recruiterApplications]
  )

  // Delete application
  const deleteApplication = useCallback(
    async (applicationId: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/${applicationId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Failed to delete application')
        }

        setApplications(applications.filter((app) => app.id !== applicationId))
        setRecruiterApplications(
          recruiterApplications.filter((app) => app.id !== applicationId)
        )
      } catch (err: any) {
        setError(err.message)
        console.error('Error deleting application:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [token, applications, recruiterApplications]
  )

  return {
    applications,
    recruiterApplications,
    currentApplication,
    loading,
    error,
    applyForJob,
    fetchStudentApplications,
    fetchRecruiterApplications,
    fetchApplication,
    updateApplicationStatus,
    deleteApplication,
  }
}
