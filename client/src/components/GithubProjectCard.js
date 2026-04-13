import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Star, GitFork, Eye, Calendar } from 'lucide-react';
export function GithubProjectCard({ project }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("div", { className: "flex-1", children: _jsx("a", { href: project.url, target: "_blank", rel: "noopener noreferrer", className: "text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline", children: project.name }) }), project.language && (_jsx("span", { className: "ml-2 px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full", children: project.language }))] }), project.description && (_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2", children: project.description })), _jsxs("div", { className: "flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { size: 16, className: "text-yellow-500" }), _jsx("span", { children: project.stars.toLocaleString() })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(GitFork, { size: 16, className: "text-gray-500" }), _jsx("span", { children: project.forks.toLocaleString() })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Eye, { size: 16, className: "text-blue-500" }), _jsx("span", { children: project.watchers.toLocaleString() })] })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400", children: [_jsx(Calendar, { size: 14 }), _jsxs("span", { children: ["Updated ", formatDate(project.lastUpdated)] })] })] }));
}
