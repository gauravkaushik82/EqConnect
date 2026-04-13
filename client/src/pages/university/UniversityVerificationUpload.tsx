import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useVerification } from '../../hooks/useVerification'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface DocumentFile {
  file: File
  type: 'ugc_recognition' | 'accreditation_certificate' | 'degree_certificate'
  label: string
}

function UniversityVerificationUpload() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { submitDocuments, loading, error } = useVerification()
  
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [successMessage, setSuccessMessage] = useState('')

  const requiredDocuments = [
    { type: 'ugc_recognition', label: 'UGC (University Grants Commission) Recognition Letter' },
    { type: 'accreditation_certificate', label: 'Accreditation Certificate' },
    { type: 'degree_certificate', label: 'Degree Certificate' }
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, documentType: 'ugc_recognition' | 'accreditation_certificate' | 'degree_certificate') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    const validMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!validMimes.includes(file.type)) {
      alert('Only PDF and image files (JPEG, PNG, WebP) are allowed')
      return
    }

    // Find the label
    const label = requiredDocuments.find(d => d.type === documentType)?.label || ''

    // Add or replace document
    setDocuments(prev => {
      const existing = prev.findIndex(d => d.type === documentType)
      if (existing >= 0) {
        const newDocs = [...prev]
        newDocs[existing] = { file, type: documentType, label }
        return newDocs
      }
      return [...prev, { file, type: documentType, label }]
    })
  }

  const handleRemoveDocument = (type: 'ugc_recognition' | 'accreditation_certificate' | 'degree_certificate') => {
    setDocuments(prev => prev.filter(d => d.type !== type))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (documents.length === 0) {
      alert('Please upload at least one document')
      return
    }

    const files = documents.map(d => d.file)
    const result = await submitDocuments(files, user?.full_name || 'University')

    if (result) {
      setSuccessMessage('Documents submitted successfully! Your account is now locked pending verification.')
      setTimeout(() => {
        navigate('/university/verification-pending')
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">EqConnect</div>
          <span className="text-gray-600">{user?.full_name || 'University'}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">University Verification</h1>
          <p className="text-gray-600">Upload required documents for verification. Your account will be reviewed within 7 days.</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-3">📋 Required Documents</h3>
          <p className="text-blue-800 mb-4">Please upload the following documents for verification:</p>
          <ul className="space-y-2 text-blue-900">
            <li>✓ UGC (University Grants Commission) Recognition Letter</li>
            <li>✓ Accreditation Certificate</li>
            <li>✓ Degree Certificate</li>
          </ul>
          <p className="text-sm text-blue-700 mt-4">Accepted formats: PDF, JPEG, PNG (Max 10MB each)</p>
        </div>

        {/* Document Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {requiredDocuments.map((doc) => {
            const isUploaded = documents.some(d => d.type === doc.type)
            
            return (
              <div key={doc.type} className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doc.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">Upload PDF or image file (JPG, PNG, WebP)</p>
                  </div>
                  {isUploaded && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>

                {isUploaded && documents.find(d => d.type === doc.type) && (
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          {documents.find(d => d.type === doc.type)?.file.name}
                        </p>
                        <p className="text-sm text-green-700">
                          {((documents.find(d => d.type === doc.type)?.file.size || 0) / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.type as any)}
                      className="px-3 py-1 text-red-600 hover:text-red-700 font-medium text-sm border border-red-300 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <label className="block">
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, doc.type as any)}
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                  />
                  <div className="cursor-pointer border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                    <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                    <p className="font-medium text-indigo-900 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-indigo-700">PDF or image files up to 10MB</p>
                  </div>
                </label>
              </div>
            )
          })}

          {/* Progress */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Documents Uploaded</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${(documents.length / 3) * 100}%` }}
                ></div>
              </div>
              <p className="text-lg font-bold text-indigo-600">{documents.length} / 3</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={documents.length === 0 || loading}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                documents.length === 0 || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/university/dashboard')}
              className="py-3 px-6 rounded-lg font-semibold border border-gray-300 text-gray-900 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">⏰ Timeline & Next Steps</h4>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900">1. Document Review (24-48 hours)</p>
              <p className="text-gray-700 text-sm">An admin will verify your documents</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">2. Decision (Within 7 days)</p>
              <p className="text-gray-700 text-sm">You'll receive approval or rejection notification</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">3. Account Unlock (Upon Approval)</p>
              <p className="text-gray-700 text-sm">Your account will be automatically unlocked</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">4. Resubmit (If Rejected)</p>
              <p className="text-gray-700 text-sm">You can correct and resubmit your documents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UniversityVerificationUpload
