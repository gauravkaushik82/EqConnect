import { useEffect, useState } from 'react'
import { useApplications } from '../../hooks/useApplications'
import { AlertCircle, Briefcase, Calendar, MapPin, Trash2 } from 'lucide-react'

export function MyApplications() {
  const { fetchStudentApplications, deleteApplication, applications, loading, error } =
    useApplications()
  const [filter, setFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchStudentApplications()
  }, [])

  const filteredApps =
    filter === 'all'
      ? applications
      : applications.filter((app: any) => app.status === filter)

  const handleDelete = async (appId: string) => {
    try {
      await deleteApplication(appId)
      await fetchStudentApplications()
      setDeleteConfirm(null)
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'reviewed':
        return 'bg-blue-100 text-blue-700'
      case 'interview':
        return 'bg-purple-100 text-purple-700'
      case 'accepted':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Waiting for recruiter to review'
      case 'reviewed':
        return 'Your application has been reviewed'
      case 'interview':
        return 'You have an interview scheduled'
      case 'accepted':
        return 'Congratulations! You got the job'
      case 'rejected':
        return 'Unfortunately, your application was rejected'
      default:
        return 'Application status unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600 mb-8">Track all your job applications in one place</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
            {['all', 'pending', 'reviewed', 'interview', 'accepted', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
                  filter === status
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No applications yet</p>
              <p className="text-gray-400 text-sm mt-1">
                {filter === 'all'
                  ? 'Start applying to jobs to see them here'
                  : `No applications with status "${filter}"`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app: any) => (
                <div
                  key={app.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {app.job?.title || 'Job Title'}
                      </h3>
                      <p className="text-gray-600">
                        {app.job?.company_name || 'Company'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}
                      >
                        {app.status}
                      </span>
                      <button
                        onClick={() => setDeleteConfirm(app.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{getStatusMessage(app.status)}</p>

                  {app.job?.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      {app.job.location}
                    </div>
                  )}

                  {app.cover_letter && (
                    <div className="bg-gray-50 p-3 rounded mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Your Cover Letter:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{app.cover_letter}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Applied {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                    {app.updated_at && app.updated_at !== app.applied_at && (
                      <div className="flex items-center gap-1">
                        Updated {new Date(app.updated_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === app.id && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 font-medium mb-3">
                        Are you sure you want to withdraw this application?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                        >
                          Yes, Withdraw
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyApplications
