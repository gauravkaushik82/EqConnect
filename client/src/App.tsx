import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import SuperAdminRegister from './pages/auth/SuperAdminRegister'
import ProtectedRoute from './components/ProtectedRoute'
import StudentDashboard from './pages/student/Dashboard'
import StudentProfile from './pages/student/Profile'
import Opportunities from './pages/student/Opportunities'
import StudentMessages from './pages/student/Messages'
import RecruiterDashboard from './pages/recruiter/Dashboard'
import PostJob from './pages/recruiter/PostJob'
import RecruiterMessages from './pages/recruiter/Messages'
import UniversityDashboard from './pages/university/Dashboard'
import UniversityVerificationUpload from './pages/university/UniversityVerificationUpload'
import VerificationPending from './pages/university/VerificationPending'
import AdminDashboard from './pages/admin/Dashboard'
import AdminVerificationDash from './pages/admin/VerificationDash'
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard'
import NotFound from './pages/NotFound'
import PostJobForm from './pages/recruiter/PostJobForm'
import ApplicationsManager from './pages/recruiter/ApplicationsManager'
import JobListing from './pages/student/JobListing'
import JobDetails from './pages/student/JobDetails'
import MyApplications from './pages/student/MyApplications'
import NotificationsPage from './pages/NotificationsPage'

function App() {
  useEffect(() => {
    // Check for dark mode preference
    const isDark = localStorage.getItem('theme') === 'dark'
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/super-admin/register" element={<SuperAdminRegister />} />
        
        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/opportunities"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Opportunities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/jobs"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <JobListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:jobId"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <JobDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/messages"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        
        {/* Recruiter Routes */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/post-job"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/new"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <PostJobForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/applications"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <ApplicationsManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/messages"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterMessages />
            </ProtectedRoute>
          }
        />
        
        {/* University Routes */}
        <Route
          path="/university/dashboard"
          element={
            <ProtectedRoute allowedRoles={['university']}>
              <UniversityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/verify"
          element={
            <ProtectedRoute allowedRoles={['university']}>
              <UniversityVerificationUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/verification-pending"
          element={
            <ProtectedRoute allowedRoles={['university']}>
              <VerificationPending />
            </ProtectedRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verifications"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminVerificationDash />
            </ProtectedRoute>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
