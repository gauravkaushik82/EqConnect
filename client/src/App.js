import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SuperAdminRegister from './pages/auth/SuperAdminRegister';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import Opportunities from './pages/student/Opportunities';
import StudentMessages from './pages/student/Messages';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import PostJob from './pages/recruiter/PostJob';
import RecruiterMessages from './pages/recruiter/Messages';
import UniversityDashboard from './pages/university/Dashboard';
import UniversityVerificationUpload from './pages/university/UniversityVerificationUpload';
import VerificationPending from './pages/university/VerificationPending';
import AdminDashboard from './pages/admin/Dashboard';
import AdminVerificationDash from './pages/admin/VerificationDash';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import NotFound from './pages/NotFound';
import PostJobForm from './pages/recruiter/PostJobForm';
import ApplicationsManager from './pages/recruiter/ApplicationsManager';
import JobListing from './pages/student/JobListing';
import JobDetails from './pages/student/JobDetails';
import MyApplications from './pages/student/MyApplications';
import NotificationsPage from './pages/NotificationsPage';
function App() {
    useEffect(() => {
        // Check for dark mode preference
        const isDark = localStorage.getItem('theme') === 'dark';
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/super-admin/register", element: _jsx(SuperAdminRegister, {}) }), _jsx(Route, { path: "/student/dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['student'], children: _jsx(StudentDashboard, {}) }) }), _jsx(Route, { path: "/student/profile", element: _jsx(ProtectedRoute, { allowedRoles: ['student'], children: _jsx(StudentProfile, {}) }) }), _jsx(Route, { path: "/student/opportunities", element: _jsx(ProtectedRoute, { allowedRoles: ['student'], children: _jsx(Opportunities, {}) }) }), _jsx(Route, { path: "/student/jobs", element: _jsx(ProtectedRoute, { allowedRoles: ['student'], children: _jsx(JobListing, {}) }) }), _jsx(Route, { path: "/jobs/:jobId", element: _jsx(ProtectedRoute, { allowedRoles: ['student'], children: _jsx(JobDetails, {}) }) }), _jsx(Route, { path: "/student/messages", element: _jsx(ProtectedRoute, { allowedRoles: ['student'], children: _jsx(StudentMessages, {}) }) }), _jsx(Route, { path: "/student/applications", element: _jsx(ProtectedRoute, { allowedRoles: ['student'], children: _jsx(MyApplications, {}) }) }), _jsx(Route, { path: "/notifications", element: _jsx(ProtectedRoute, { children: _jsx(NotificationsPage, {}) }) }), _jsx(Route, { path: "/recruiter/dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['recruiter'], children: _jsx(RecruiterDashboard, {}) }) }), _jsx(Route, { path: "/recruiter/post-job", element: _jsx(ProtectedRoute, { allowedRoles: ['recruiter'], children: _jsx(PostJob, {}) }) }), _jsx(Route, { path: "/recruiter/jobs/new", element: _jsx(ProtectedRoute, { allowedRoles: ['recruiter'], children: _jsx(PostJobForm, {}) }) }), _jsx(Route, { path: "/recruiter/applications", element: _jsx(ProtectedRoute, { allowedRoles: ['recruiter'], children: _jsx(ApplicationsManager, {}) }) }), _jsx(Route, { path: "/recruiter/messages", element: _jsx(ProtectedRoute, { allowedRoles: ['recruiter'], children: _jsx(RecruiterMessages, {}) }) }), _jsx(Route, { path: "/university/dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['university'], children: _jsx(UniversityDashboard, {}) }) }), _jsx(Route, { path: "/university/verify", element: _jsx(ProtectedRoute, { allowedRoles: ['university'], children: _jsx(UniversityVerificationUpload, {}) }) }), _jsx(Route, { path: "/university/verification-pending", element: _jsx(ProtectedRoute, { allowedRoles: ['university'], children: _jsx(VerificationPending, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "/admin/verifications", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminVerificationDash, {}) }) }), _jsx(Route, { path: "/super-admin/dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['super_admin'], children: _jsx(SuperAdminDashboard, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }));
}
export default App;
