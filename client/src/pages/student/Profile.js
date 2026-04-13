import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useGithub } from '../../hooks/useGithub';
import { GithubProjectCard } from '../../components/GithubProjectCard';
import { GithubStatsWidget } from '../../components/GithubStatsWidget';
import { SkillsWidget } from '../../components/SkillsWidget';
import { Github, Loader, AlertCircle, Trash2, RefreshCw, MessageCircle } from 'lucide-react';
export function StudentProfile() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const { githubUser, loading, error, syncRepositories, disconnectGitHub } = useGithub();
    const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);
    // Handle GitHub OAuth callback
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('github_token');
        if (token) {
            // Token from OAuth callback - link account automatically
            // The useGithub hook will auto-sync
            window.history.replaceState({}, document.title, '/profile');
        }
    }, []);
    if (!user) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Loader, { className: "animate-spin text-blue-600", size: 32 }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("div", { className: "flex justify-end gap-3 mb-6", children: _jsxs("button", { onClick: () => navigate('/student/messages'), className: "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium", children: [_jsx(MessageCircle, { size: 18 }), "Messages"] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8", children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex items-start gap-6", children: [user.avatar_url && (_jsx("img", { src: user.avatar_url, alt: user.full_name || 'User', className: "w-24 h-24 rounded-full object-cover" })), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: user.full_name || 'Student' }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: user.email }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-500 mt-1", children: user.role === 'student' ? 'Student' : 'User' })] })] }) }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2", children: [!user.github_username ? (
                                // Not Connected
                                _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center", children: [_jsx(Github, { size: 48, className: "mx-auto mb-4 text-gray-400" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2", children: "Connect GitHub" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: "Showcase your GitHub projects and repositories to recruiters on your profile." }), _jsxs("a", { href: `http://localhost:3001/api/github/connect`, className: "inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors", children: [_jsx(Github, { size: 20 }), "Connect GitHub Account"] })] })) : (
                                // Connected - Show Repositories
                                _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "GitHub Repositories" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => syncRepositories(), disabled: loading, className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors", children: [_jsx(RefreshCw, { size: 16, className: loading ? 'animate-spin' : '' }), "Sync"] }), _jsxs("button", { onClick: () => setShowDisconnectConfirm(true), className: "flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30", children: [_jsx(Trash2, { size: 16 }), "Disconnect"] })] })] }), showDisconnectConfirm && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-4", children: "Disconnect GitHub?" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: "This will remove all your GitHub repositories from your profile. You can reconnect anytime." }), _jsxs("div", { className: "flex gap-3 justify-end", children: [_jsx("button", { onClick: () => setShowDisconnectConfirm(false), className: "px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600", children: "Cancel" }), _jsx("button", { onClick: async () => {
                                                                    await disconnectGitHub();
                                                                    setShowDisconnectConfirm(false);
                                                                }, className: "px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors", children: "Disconnect" })] })] }) })), error && (_jsxs("div", { className: "mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-900 rounded-lg flex gap-3", children: [_jsx(AlertCircle, { size: 20, className: "text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-red-600 dark:text-red-400", children: error })] })), loading && (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader, { className: "animate-spin text-blue-600", size: 32 }) })), !loading && githubUser?.repositories && githubUser.repositories.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 gap-4", children: githubUser.repositories.map((repo) => (_jsx(GithubProjectCard, { project: repo }, repo.id))) })) : !loading ? (_jsx("div", { className: "text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg", children: _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "No repositories found. Try syncing your GitHub profile." }) })) : null] })), _jsx("div", { className: "mt-8", children: _jsx(SkillsWidget, { isEditable: true }) })] }), user.github_username && githubUser?.stats && (_jsx("div", { children: _jsx(GithubStatsWidget, { stats: githubUser.stats, username: user.github_username }) }))] })] }) }));
}
export default StudentProfile;
