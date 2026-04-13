import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useVerification } from '../../hooks/useVerification'
import { Lock, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'

function VerificationPending() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { status, notifications, fetchVerificationStatus, fetchNotifications } = useVerification()
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    fetchVerificationStatus()
    fetchNotifications()
  }, [])

  // Calculate time remaining
  useEffect(() => {
    if (status?.verificationDeadline) {
      const interval = setInterval(() => {
        const deadline = new Date(status.verificationDeadline!).getTime()
        const now = new Date().getTime()
        const diff = deadline - now

        if (diff <= 0) {
          setTimeRemaining('Deadline passed')
          clearInterval(interval)
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`)
        }
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [status?.verificationDeadline])

  if (status?.verificationStatus === 'verified') {
    navigate('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">EqConnect</div>
          <span className="text-gray-600">{user?.full_name || 'University'}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Account Locked Banner */}
        <div className="mb-8 p-6 bg-orange-50 border-2 border-orange-300 rounded-xl flex items-start gap-4">
          <Lock className="w-8 h-8 text-orange-600 mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-orange-900 mb-2">Account Verification Pending</h2>
            <p className="text-orange-800">
              Your account is currently locked pending verification. An admin will review your submitted documents and approve or reject your request.
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Verification Status */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-lg font-bold text-orange-600 capitalize">{status?.verificationStatus || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Documents Submitted</p>
                <p className="text-lg font-bold text-indigo-600">{status?.documentsSubmitted || 0} / 3</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
                <p className="text-lg font-bold text-red-600">{timeRemaining || 'Loading...'}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Timeline</h3>
            <div className="space-y-4">
              {/* Step 1: Submitted */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div className="w-1 h-8 bg-gray-200 mt-1"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Documents Submitted</p>
                  <p className="text-sm text-gray-600">
                    {status?.submittedAt
                      ? new Date(status.submittedAt).toLocaleDateString()
                      : 'Not submitted'}
                  </p>
                </div>
              </div>

              {/* Step 2: Under Review */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                  <div className="w-1 h-8 bg-gray-200 mt-1"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Under Review</p>
                  <p className="text-sm text-gray-600">Admin is reviewing your documents</p>
                </div>
              </div>

              {/* Step 3: Decision */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  {status?.verificationStatus === 'verified' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : status?.verificationStatus === 'rejected' ? (
                    <XCircle className="w-6 h-6 text-red-500" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Decision</p>
                  <p className="text-sm text-gray-600">
                    {status?.approvedAt
                      ? `Approved on ${new Date(status.approvedAt).toLocaleDateString()}`
                      : 'Pending admin decision'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Submitted */}
        {status?.documents && status.documents.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Documents</h3>
            <div className="space-y-3">
              {status.documents.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{doc.fileName}</p>
                    <p className="text-sm text-gray-600 capitalize">{doc.type.replace(/_/g, ' ')}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Notes */}
        {status?.notes && (
          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 mb-8">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">Admin Notes</h4>
                <p className="text-yellow-800">{status.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Notifications */}
        {notifications && notifications.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notif: any) => (
                <div key={notif.id} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-900 capitalize">{notif.type}</p>
                  <p className="text-sm text-blue-800 mt-1">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">What Happens Next?</h4>
          <ul className="space-y-2 text-blue-900 text-sm">
            <li>✓ An admin will review your submitted documents within 24-48 hours</li>
            <li>✓ You will receive notifications about the verification status</li>
            <li>✓ Once verified, your account will be automatically unlocked</li>
            <li>✓ If rejected, you can resubmit documents with corrections</li>
            <li>✓ Verification must be completed within 7 days of submission</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VerificationPending
