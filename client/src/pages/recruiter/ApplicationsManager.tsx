import { useEffect, useState } from 'react'
import { useApplications } from '../../hooks/useApplications'
import { AlertCircle, Mail, Check, X } from 'lucide-react'

export function ApplicationsManager() {
  const { fetchRecruiterApplications, updateApplicationStatus, recruiterApplications, loading, error } =
    useApplications()
  const [filter, setFilter] = useState('all')
  const [selectedApp, setSelectedApp] = useState<any>(null)

  useEffect(() => {
    fetchRecruiterApplications()
  }, [])

  const filteredApps =
    filter === 'all'
      ? recruiterApplications
      : recruiterApplications.filter((app: any) => app.status === filter)

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await updateApplicationStatus(appId, newStatus)
      fetchRecruiterApplications()
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Received Applications</h1>
          <p className="text-gray-600 mb-8">Manage all job applications for your postings</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {['all', 'pending', 'reviewed', 'interview', 'accepted', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 font-medium capitalize border-b-2 transition-colors ${
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
              <p className="text-gray-500 text-lg">No applications yet</p>
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
                      <p className="text-sm text-gray-600">
                        From: <span className="font-medium">{app.student?.fullName || 'Unknown'}</span>
                      </p>
                      {app.student?.email && (
                        <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                          <Mail className="w-4 h-4" />
                          {app.student.email}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {app.cover_letter && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{app.cover_letter}</p>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                      >
                        Read Full Letter
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    {app.status !== 'reviewed' && (
                      <button
                        onClick={() => handleStatusChange(app.id, 'reviewed')}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium"
                      >
                        Mark Reviewed
                      </button>
                    )}

                    {app.status === 'reviewed' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(app.id, 'interview')}
                          className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm font-medium"
                        >
                          Schedule Interview
                        </button>
                      </>
                    )}

                    {['pending', 'reviewed', 'interview'].includes(app.status) && (
                      <>
                        <button
                          onClick={() => handleStatusChange(app.id, 'accepted')}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" /> Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, 'rejected')}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium flex items-center gap-1"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Applied on {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for full cover letter */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Application from {selectedApp.student?.fullName}
              </h2>
              <p className="text-sm text-gray-600 mb-4">For: {selectedApp.job?.title}</p>
              <div className="bg-gray-50 p-4 rounded mb-6 max-h-96 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.cover_letter}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationsManager
