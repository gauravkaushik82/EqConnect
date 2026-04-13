import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function RecruiterDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeJobs] = useState(3)

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
            <span className="text-gray-600">Welcome, {user?.full_name || 'Recruiter'}</span>
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
                Welcome Back, {user?.full_name || 'Recruiter'}! 👋
              </h1>
              <p className="text-gray-600">Manage your job postings and find the perfect candidates</p>
            </div>
            <div className="text-5xl">💼</div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Active Jobs */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Job Posts</h3>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-indigo-600 font-bold text-2xl mb-2">{activeJobs}</p>
            <p className="text-sm text-gray-600">Jobs currently open for applications</p>
            <button
              onClick={() => navigate('/recruiter/jobs')}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Jobs →
            </button>
          </div>

          {/* Total Applications */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Applications Received</h3>
              <span className="text-2xl">📬</span>
            </div>
            <p className="text-indigo-600 font-bold text-2xl mb-2">24</p>
            <p className="text-sm text-gray-600">New qualified candidates</p>
            <button
              onClick={() => navigate('/recruiter/applications')}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Review Applications →
            </button>
          </div>

          {/* Shortlisted Candidates */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Shortlisted Candidates</h3>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-indigo-600 font-bold text-2xl mb-2">8</p>
            <p className="text-sm text-gray-600">Ready for interviews</p>
            <button
              onClick={() => navigate('/recruiter/shortlisted')}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Candidates →
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Recent Applications */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📨 Recent Applications</h3>
            <div className="space-y-3">
              <div className="p-4 border-l-4 border-blue-600 bg-blue-50 rounded">
                <p className="font-semibold text-gray-900">Senior Developer</p>
                <p className="text-sm text-gray-600">5 new applications • 2 hours ago</p>
              </div>
              <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded">
                <p className="font-semibold text-gray-900">Product Manager</p>
                <p className="text-sm text-gray-600">3 new applications • 1 day ago</p>
              </div>
              <div className="p-4 border-l-4 border-purple-600 bg-purple-50 rounded">
                <p className="font-semibold text-gray-900">UX Designer</p>
                <p className="text-sm text-gray-600">2 shortlisted • 2 days ago</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/recruiter/applications')}
              className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              View All Applications
            </button>
          </div>

          {/* Scheduled Interviews */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Scheduled Interviews</h3>
            <div className="space-y-3">
              <div className="p-4 border-l-4 border-indigo-600 bg-indigo-50 rounded">
                <p className="font-semibold text-gray-900">Rajesh Kumar</p>
                <p className="text-sm text-gray-600">April 14, 2026 at 3:00 PM</p>
              </div>
              <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded">
                <p className="font-semibold text-gray-900">Priya Sharma</p>
                <p className="text-sm text-gray-600">April 16, 2026 at 2:30 PM</p>
              </div>
              <div className="p-4 border-l-4 border-orange-600 bg-orange-50 rounded">
                <p className="font-semibold text-gray-900">Aisha Patel</p>
                <p className="text-sm text-gray-600">April 18, 2026 at 4:00 PM</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/recruiter/messages')}
              className="w-full mt-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
            >
              Message Candidates
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Ready to Hire?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/recruiter/post-job')}
              className="py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
            >
              ➕ Post New Job
            </button>
            <button
              onClick={() => navigate('/recruiter/find-candidates')}
              className="py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 font-semibold transition-colors"
            >
              🔍 Find Candidates
            </button>
            <button
              onClick={() => navigate('/recruiter/profile')}
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

export default RecruiterDashboard
