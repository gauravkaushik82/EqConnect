import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CheckCircle, XCircle, Clock, Users, LogOut, Settings, Bell, Search } from 'lucide-react'
import { useVerification } from '../../hooks/useVerification'
import { useAuth } from '../../hooks/useAuth'

interface VerificationStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

interface University {
  id: string
  user_id: string
  name: string
  verification_status: string
  submitted_at: string
  documents_count: number
  notes?: string
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { getPendingVerifications } = useVerification()
  
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [universities, setUniversities] = useState<University[]>([])
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'verified' | 'rejected'>('overview')

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    filterUniversities()
  }, [universities, searchTerm, activeTab])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await getPendingVerifications()
      
      // Calculate stats
      const total = data.length
      const pending = data.filter((u: any) => u.verification_status === 'pending').length
      const approved = data.filter((u: any) => u.verification_status === 'approved').length
      const rejected = data.filter((u: any) => u.verification_status === 'rejected').length

      setStats({ total, pending, approved, rejected })
      setUniversities(data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUniversities = () => {
    let filtered = universities

    // Filter by tab
    if (activeTab !== 'overview') {
      filtered = filtered.filter(u => {
        if (activeTab === 'pending') return u.verification_status === 'pending'
        if (activeTab === 'verified') return u.verification_status === 'approved'
        if (activeTab === 'rejected') return u.verification_status === 'rejected'
        return true
      })
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUniversities(filtered)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleViewDetails = (universityId: string) => {
    navigate(`/admin/verifications?university=${universityId}`)
  }

  const chartData = [
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
    { name: 'Approved', value: stats.approved, color: '#10B981' },
    { name: 'Rejected', value: stats.rejected, color: '#EF4444' }
  ]

  const barData = [
    { name: 'Pending', count: stats.pending },
    { name: 'Approved', count: stats.approved },
    { name: 'Rejected', count: stats.rejected }
  ]

  const COLORS = ['#F59E0B', '#10B981', '#EF4444']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-slate-300 mt-2">Welcome, {user?.full_name}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition">
              <Bell size={20} />
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition">
              <Settings size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Universities</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
              </div>
              <Users className="text-blue-400" size={32} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.pending}</p>
              </div>
              <Clock className="text-yellow-400" size={32} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Approved</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{stats.approved}</p>
              </div>
              <CheckCircle className="text-green-400" size={32} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-400 mt-2">{stats.rejected}</p>
              </div>
              <XCircle className="text-red-400" size={32} />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Verification Status Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#E2E8F0' }}
                />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Universities List */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
          {/* Tabs and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex gap-2">
              {(['overview', 'pending', 'verified', 'rejected'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-300">University Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-300">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-300">Documents</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-300">Submitted</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUniversities.length > 0 ? (
                  filteredUniversities.map((university) => (
                    <tr key={university.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium">{university.name}</p>
                          <p className="text-slate-400 text-sm">{university.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            university.verification_status === 'pending'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : university.verification_status === 'approved'
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {university.verification_status.charAt(0).toUpperCase() +
                            university.verification_status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{university.documents_count} files</td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {new Date(university.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewDetails(university.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No universities found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
