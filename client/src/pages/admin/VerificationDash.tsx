import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useVerification } from '../../hooks/useVerification'
import { Check, X, Eye, Loader, AlertCircle } from 'lucide-react'

interface PendingVerification {
  userId: string
  universityName: string
  email: string
  submittedAt: string
  deadline: string
  documents: Array<{ id: string; document_type: string; file_name: string }>
  activityLog: any[]
}

function AdminVerificationDash() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getPendingVerifications, approveVerification, rejectVerification, error } = useVerification()
  
  const [pendingVerifications, setPendingVerifications] = useState<PendingVerification[]>([])
  const [selectedVerification, setSelectedVerification] = useState<PendingVerification | null>(null)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [approvalNotes, setApprovalNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchPendingVerifications()
  }, [])

  const fetchPendingVerifications = async () => {
    const result = await getPendingVerifications()
    if (result) {
      setPendingVerifications(result.verifications || [])
    }
  }

  const handleApprove = async (verification: PendingVerification) => {
    setActionLoading(true)
    const result = await approveVerification(verification.userId, approvalNotes)
    if (result) {
      setApprovalNotes('')
      setSelectedVerification(null)
      await fetchPendingVerifications()
    }
    setActionLoading(false)
  }

  const handleReject = async (verification: PendingVerification) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setActionLoading(true)
    const result = await rejectVerification(verification.userId, rejectReason)
    if (result) {
      setRejectReason('')
      setShowRejectForm(false)
      setSelectedVerification(null)
      await fetchPendingVerifications()
    }
    setActionLoading(false)
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
          <p className="text-red-700 mb-6">Only admins can access this page</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">EqConnect Admin</div>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">{user?.full_name || 'Admin'}</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50"
            >
              Back
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">University Verifications</h1>
          <p className="text-gray-600">Review and approve pending university verifications</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pending List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
                <h2 className="text-lg font-bold">Pending Verifications</h2>
                <p className="text-purple-100 text-sm">{pendingVerifications.length} requests</p>
              </div>

              <div className="max-h-screen overflow-y-auto">
                {pendingVerifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-600">
                    <p>No pending verifications</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {pendingVerifications.map((verification) => (
                      <button
                        key={verification.userId}
                        onClick={() => {
                          setSelectedVerification(verification)
                          setShowRejectForm(false)
                        }}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-l-4 ${
                          selectedVerification?.userId === verification.userId
                            ? 'border-l-purple-600 bg-purple-50'
                            : 'border-l-gray-200'
                        }`}
                      >
                        <p className="font-semibold text-gray-900">{verification.universityName}</p>
                        <p className="text-sm text-gray-600 truncate">{verification.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
                          <p className="text-xs text-gray-600">
                            {new Date(verification.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="lg:col-span-2">
            {selectedVerification ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedVerification.universityName}</h3>
                  <p className="text-gray-600">{selectedVerification.email}</p>
                </div>

                {/* Submission Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedVerification.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Deadline</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedVerification.deadline).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3">Submitted Documents ({selectedVerification.documents.length})</h4>
                  <div className="space-y-2">
                    {selectedVerification.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Eye className="w-4 h-4 text-indigo-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{doc.file_name}</p>
                          <p className="text-xs text-gray-600 capitalize">{doc.document_type.replace(/_/g, ' ')}</p>
                        </div>
                        <a
                          href={`/uploads/verification/${doc.file_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-300 rounded hover:bg-indigo-50"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Log */}
                {selectedVerification.activityLog.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Activity Log</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedVerification.activityLog.map((log, idx) => (
                        <div key={idx} className="text-sm p-2 bg-blue-50 rounded border border-blue-200">
                          <p className="font-medium text-blue-900 capitalize">{log.action}</p>
                          <p className="text-xs text-blue-700">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approval Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Admin Notes (Optional)</label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="Add any notes for the university..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  ></textarea>
                </div>

                {/* Action Buttons */}
                {!showRejectForm ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(selectedVerification)}
                      disabled={actionLoading}
                      className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        actionLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                      }`}
                    >
                      {actionLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowRejectForm(true)}
                      disabled={actionLoading}
                      className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        actionLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                      }`}
                    >
                      <X className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Rejection Reason</label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Explain why the verification is being rejected..."
                      className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
                      rows={3}
                    ></textarea>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReject(selectedVerification)}
                        disabled={actionLoading}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                          actionLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                      </button>
                      <button
                        onClick={() => {
                          setShowRejectForm(false)
                          setRejectReason('')
                        }}
                        className="flex-1 py-3 px-6 rounded-lg font-semibold border border-gray-300 text-gray-900 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">Select a verification request to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminVerificationDash
