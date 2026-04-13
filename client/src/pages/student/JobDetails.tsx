import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useJobs } from '../../hooks/useJobs'
import { useApplications } from '../../hooks/useApplications'
import { AlertCircle, MapPin, TrendingUp, Calendar, DollarSign } from 'lucide-react'

export function JobDetails() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { fetchJob, currentJob, loading: jobLoading, error: jobError } = useJobs()
  const { applyForJob, loading: applyLoading, error: applyError } = useApplications()
  const [coverLetter, setCoverLetter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (jobId) {
      fetchJob(jobId)
    }
  }, [jobId])

  const handleApply = async (e: any) => {
    e.preventDefault()
    try {
      await applyForJob(jobId!, coverLetter)
      setSuccess(true)
      setCoverLetter('')
      setShowForm(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (jobError || !currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
              <p className="text-gray-600 mb-6">This job posting doesn't exist or has been removed.</p>
              <button
                onClick={() => navigate('/student/jobs')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/student/jobs')}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Jobs
        </button>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✓ Application submitted successfully!</p>
          </div>
        )}

        {applyError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{applyError}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium mb-4">
              {currentJob.job_type}
            </span>
            <h1 className="text-4xl font-bold mb-2">{currentJob.title}</h1>
            <p className="text-xl text-blue-100">{currentJob.company_name}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
              {currentJob.location && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Location</p>
                  <div className="flex items-center gap-1 text-gray-900 font-medium">
                    <MapPin className="w-4 h-4" />
                    {currentJob.location}
                  </div>
                </div>
              )}

              <div>
                <p className="text-gray-500 text-sm mb-1">Experience</p>
                <div className="flex items-center gap-1 text-gray-900 font-medium capitalize">
                  <TrendingUp className="w-4 h-4" />
                  {currentJob.experience_level}
                </div>
              </div>

              {currentJob.deadline && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Deadline</p>
                  <div className="flex items-center gap-1 text-gray-900 font-medium">
                    <Calendar className="w-4 h-4" />
                    {new Date(currentJob.deadline).toLocaleDateString()}
                  </div>
                </div>
              )}

              {currentJob.salary_min && currentJob.salary_max && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Salary Range</p>
                  <div className="flex items-center gap-1 text-gray-900 font-medium">
                    <DollarSign className="w-4 h-4" />
                    {currentJob.salary_min.toLocaleString()}-{currentJob.salary_max.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Job</h2>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {currentJob.description}
              </div>
            </div>

            {/* Required Skills */}
            {currentJob.required_skills && currentJob.required_skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {currentJob.required_skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8 flex gap-8">
              <div>
                <p className="text-gray-500 text-sm">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{currentJob.application_count}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Views</p>
                <p className="text-2xl font-bold text-gray-900">{currentJob.view_count}</p>
              </div>
            </div>

            {/* Apply Section */}
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg transition-colors"
              >
                Apply Now
              </button>
            ) : (
              <form onSubmit={handleApply} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Submit Your Application</h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you're a great fit for this role..."
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">1-5000 characters</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={applyLoading || !coverLetter.trim()}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold disabled:bg-gray-400"
                  >
                    {applyLoading ? 'Submitting...' : 'Submit Application'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetails
