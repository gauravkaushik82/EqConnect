import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { GithubProjectCard } from '../../components/GithubProjectCard';
import { GithubStatsWidget } from '../../components/GithubStatsWidget';
import { SkillsWidget } from '../../components/SkillsWidget';
import { Github, Loader, AlertCircle, ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
export function ViewStudentProfile() {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const { user, isAuthenticated } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Redirect if not authenticated or not recruiter
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        else if (user?.role !== 'recruiter') {
            navigate('/dashboard');
        }
    }, [isAuthenticated, user?.role, navigate]);
    // Fetch student profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (!studentId)
                return;
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('auth_token');
                if (!token)
                    throw new Error('Not authenticated');
                const response = await fetch(`http://localhost:3001/api/students/${studentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch profile: ${response.statusText}`);
                }
                const data = await response.json();
                if (data.success) {
                    setProfile(data.data);
                }
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch student profile');
            }
            finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [studentId]);
    if (!user || user.role !== 'recruiter') {
        return null;
    }
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Loader, { className: "animate-spin text-blue-600", size: 32 }) }));
    }
    if (error || !profile) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6", children: [_jsx(ArrowLeft, { size: 20 }), "Back"] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-8 text-center", children: [_jsx(AlertCircle, { size: 48, className: "mx-auto mb-4 text-red-600" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400", children: error || 'Student profile not found' })] })] }) }));
    }
    const student = profile.user;
    const prof = profile.profile;
    const repos = profile.repositories || [];
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300", children: [_jsx(ArrowLeft, { size: 20 }), "Back to Talent Discovery"] }), _jsx("button", { onClick: () => navigate('/recruiter/messages'), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium", children: "Message Student" })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start gap-6", children: [student.avatar_url ? (_jsx("img", { src: student.avatar_url, alt: student.full_name, className: "w-24 h-24 rounded-full object-cover" })) : (_jsx("div", { className: "w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl", children: student.full_name?.charAt(0) || '?' })), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: student.full_name || 'Student' }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: student.email }), _jsxs("div", { className: "space-y-2 text-sm text-gray-600 dark:text-gray-400", children: [prof?.university && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(GraduationCap, { size: 16 }), _jsx("span", { children: prof.university })] })), prof?.degree && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BookOpen, { size: 16 }), _jsxs("span", { children: [prof.degree, prof.branch && ` - ${prof.branch}`, prof.year_of_study && ` (Year ${prof.year_of_study})`] })] }))] })] })] }), student.github_username && (_jsxs("a", { href: `https://github.com/${student.github_username}`, target: "_blank", rel: "noopener noreferrer", className: "px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2", children: [_jsx(Github, { size: 18 }), "Visit GitHub"] }))] }), prof?.bio && (_jsx("div", { className: "mt-6 pt-6 border-t border-gray-200 dark:border-gray-700", children: _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: prof.bio }) }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: ["GitHub Repositories (", repos.length, ")"] }), repos.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 gap-4", children: repos.map((repo) => (_jsx(GithubProjectCard, { project: repo }, repo.id))) })) : (_jsxs("div", { className: "text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg", children: [_jsx(Github, { size: 48, className: "mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "No GitHub repositories yet" })] })), _jsx("div", { className: "mt-8", children: _jsx(SkillsWidget, { userId: studentId, isEditable: false }) })] }), student.github_username && repos.length > 0 && (_jsx("div", { children: _jsx(GithubStatsWidget, { stats: {
                                    followers: 0,
                                    following: 0,
                                    publicRepos: repos.length,
                                    bio: prof?.bio || null,
                                    avatarUrl: student.github_avatar_url,
                                    location: null,
                                }, username: student.github_username }) }))] })] }) }));
}
export default ViewStudentProfile;
