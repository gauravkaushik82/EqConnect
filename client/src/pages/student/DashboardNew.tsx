import { useState } from 'react'

function StudentDashboard() {
  const [notifications] = useState([
    { id: 1, message: 'TCS shortlisted you!', type: 'success', time: '2 hours ago' },
    { id: 2, message: 'Interview scheduled for tomorrow at 10 AM', type: 'info', time: '4 hours ago' },
    { id: 3, message: 'Your profile is now 85% complete', type: 'info', time: '1 day ago' }
  ])

  const opportunities = [
    {
      id: 1,
      company: 'TCS',
      title: 'Software Developer Intern',
      type: 'Internship',
      matchScore: 92,
      skills: ['Java', 'Python', 'SQL'],
      location: 'Bangalore',
      stipend: '₹50,000/month'
    },
    {
      id: 2,
      company: 'Amazon',
      title: 'SDE-1 (Full-time)',
      type: 'Job',
      matchScore: 87,
      skills: ['C++', 'System Design'],
      location: 'Hyderabad',
      stipend: '₹25,00,000/year'
    },
    {
      id: 3,
      company: 'Microsoft',
      title: 'Data Science Internship',
      type: 'Internship',
      matchScore: 78,
      skills: ['Python', 'ML', 'Statistics'],
      location: 'Remote',
      stipend: '₹60,000/month'
    }
  ]

  const applications = [
    { id: 1, company: 'Google', role: 'Software Engineer', status: 'Interviewing', appliedDate: '5 days ago' },
    { id: 2, company: 'Microsoft', role: 'Product Manager', status: 'Shortlisted', appliedDate: '1 week ago' },
    { id: 3, company: 'Amazon', role: 'Data Scientist', status: 'Applied', appliedDate: '2 weeks ago' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">EqConnect</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">🔔</button>
            <button className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center">
              A
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, Aditya! 👋</h2>
          <p className="text-gray-600 mt-2">Here's what's happening with your applications today</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Applications</p>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-xs text-green-600 mt-2">↑ 3 this week</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Profile Completion</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xl font-bold text-gray-900">85%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Match Score</p>
            <p className="text-3xl font-bold text-indigo-600">82</p>
            <p className="text-xs text-gray-500 mt-2">Average match</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Messages</p>
            <p className="text-3xl font-bold text-gray-900">5</p>
            <p className="text-xs text-red-600 mt-2">2 unread</p>
          </div>
        </div>

        {/* Recommended Opportunities */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Top Matched Opportunities</h3>
            <a href="/student/opportunities" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div key={opp.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">{opp.company}</p>
                    <h4 className="text-lg font-semibold text-gray-900">{opp.title}</h4>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                    {opp.matchScore}% match
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{opp.type} • {opp.location}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {opp.skills.slice(0, 2).map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="font-semibold text-gray-900 mb-4">{opp.stipend}</p>
                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Application Tracker */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Application Pipeline</h3>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">{app.company}</h4>
                    <p className="text-sm text-gray-600">{app.role}</p>
                    <p className="text-xs text-gray-500 mt-1">Applied {app.appliedDate}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      app.status === 'Interviewing' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'Shortlisted' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {app.status}
                    </span>
                    <button className="text-indigo-600 hover:text-indigo-700">→</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h3>
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-4 rounded-lg border-l-4 ${
                  notif.type === 'success' ? 'bg-green-50 border-green-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <p className={`font-medium ${notif.type === 'success' ? 'text-green-900' : 'text-blue-900'}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default StudentDashboard
