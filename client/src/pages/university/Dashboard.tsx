import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function UniversityDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [studentsVerified] = useState(156)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">EqConnect</div>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">Welcome, {user?.full_name || 'Admin'}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:text-red-700 font-medium border border-red-200 rounded-lg hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome Back, {user?.full_name || 'University Admin'}! 👋
              </h1>
              <p className="text-gray-600">Manage student credentials and verification requests</p>
            </div>
            <div className="text-5xl">🏫</div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Students Verified */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Students Verified</h3>
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-indigo-600 font-bold text-2xl mb-2">{studentsVerified}</p>
            <p className="text-sm text-gray-600">Credentials verified and visible to recruiters</p>
            <button
              onClick={() => navigate('/university/verified-students')}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Verified →
            </button>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Verifications</h3>
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-yellow-600 font-bold text-2xl mb-2">12</p>
            <p className="text-sm text-gray-600">Waiting for your review</p>
            <button
              onClick={() => navigate('/university/pending')}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Review Now →
            </button>
          </div>

          {/* Enrolled Students */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Enrolled Students</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-indigo-600 font-bold text-2xl mb-2">2,450</p>
            <p className="text-sm text-gray-600">Total students registered</p>
            <button
              onClick={() => navigate('/university/students')}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Students →
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Verification Queue */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Verification Queue</h3>
            <div className="space-y-3">
              <div className="p-4 border-l-4 border-blue-600 bg-blue-50 rounded">
                <p className="font-semibold text-gray-900">Bachelor's Degree Verification</p>
                <p className="text-sm text-gray-600">8 requests pending</p>
              </div>
              <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded">
                <p className="font-semibold text-gray-900">Transcript Verification</p>
                <p className="text-sm text-gray-600">3 requests pending</p>
              </div>
              <div className="p-4 border-l-4 border-purple-600 bg-purple-50 rounded">
                <p className="font-semibold text-gray-900">Conduct Certificate</p>
                <p className="text-sm text-gray-600">1 request pending</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/university/pending')}
              className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Process Verifications
            </button>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📁 Recent Document Uploads</h3>
            <div className="space-y-3">
              <div className="p-4 border-l-4 border-indigo-600 bg-indigo-50 rounded">
                <p className="font-semibold text-gray-900">Class of 2021 - Transcripts</p>
                <p className="text-sm text-gray-600">Uploaded 2 hours ago</p>
              </div>
              <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded">
                <p className="font-semibold text-gray-900">Class of 2022 - Degrees</p>
                <p className="text-sm text-gray-600">Uploaded 1 day ago</p>
              </div>
              <div className="p-4 border-l-4 border-orange-600 bg-orange-50 rounded">
                <p className="font-semibold text-gray-900">Class of 2023 - Conduct Certs</p>
                <p className="text-sm text-gray-600">Uploaded 3 days ago</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/university/documents')}
              className="w-full mt-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
            >
              Manage Documents
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Manage Your Institution</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/university/pending')}
              className="py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
            >
              ⏳ Review Pending
            </button>
            <button
              onClick={() => navigate('/university/upload')}
              className="py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 font-semibold transition-colors"
            >
              📤 Upload Documents
            </button>
            <button
              onClick={() => navigate('/university/profile')}
              className="py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 font-semibold transition-colors"
            >
              ✏️ Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; 2026 EqConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default UniversityDashboard
