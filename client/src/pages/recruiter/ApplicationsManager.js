import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useApplications } from '../../hooks/useApplications';
import { AlertCircle, Mail, Check, X } from 'lucide-react';
export function ApplicationsManager() {
    const { fetchRecruiterApplications, updateApplicationStatus, recruiterApplications, loading, error } = useApplications();
    const [filter, setFilter] = useState('all');
    const [selectedApp, setSelectedApp] = useState(null);
    useEffect(() => {
        fetchRecruiterApplications();
    }, []);
    const filteredApps = filter === 'all'
        ? recruiterApplications
        : recruiterApplications.filter((app) => app.status === filter);
    const handleStatusChange = async (appId, newStatus) => {
        try {
            await updateApplicationStatus(appId, newStatus);
            fetchRecruiterApplications();
        }
        catch (err) {
            console.error(err);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'reviewed':
                return 'bg-blue-100 text-blue-700';
            case 'interview':
                return 'bg-purple-100 text-purple-700';
            case 'accepted':
                return 'bg-green-100 text-green-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Received Applications" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Manage all job applications for your postings" }), error && (_jsxs("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-red-800", children: error })] })), _jsx("div", { className: "flex gap-2 mb-6 border-b border-gray-200", children: ['all', 'pending', 'reviewed', 'interview', 'accepted', 'rejected'].map((status) => (_jsx("button", { onClick: () => setFilter(status), className: `px-4 py-2 font-medium capitalize border-b-2 transition-colors ${filter === status
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'}`, children: status }, status))) }), loading ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading applications..." })] })) : filteredApps.length === 0 ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500 text-lg", children: "No applications yet" }) })) : (_jsx("div", { className: "space-y-4", children: filteredApps.map((app) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: app.job?.title || 'Job Title' }), _jsxs("p", { className: "text-sm text-gray-600", children: ["From: ", _jsx("span", { className: "font-medium", children: app.student?.fullName || 'Unknown' })] }), app.student?.email && (_jsxs("p", { className: "text-sm text-blue-600 flex items-center gap-1 mt-1", children: [_jsx(Mail, { className: "w-4 h-4" }), app.student.email] }))] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`, children: app.status }) })] }), app.cover_letter && (_jsxs("div", { className: "mb-4 p-3 bg-gray-50 rounded", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-2", children: "Cover Letter:" }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: app.cover_letter }), _jsx("button", { onClick: () => setSelectedApp(app), className: "text-xs text-blue-600 hover:text-blue-700 mt-1", children: "Read Full Letter" })] })), _jsxs("div", { className: "flex gap-2 pt-4 border-t border-gray-200", children: [app.status !== 'reviewed' && (_jsx("button", { onClick: () => handleStatusChange(app.id, 'reviewed'), className: "px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium", children: "Mark Reviewed" })), app.status === 'reviewed' && (_jsx(_Fragment, { children: _jsx("button", { onClick: () => handleStatusChange(app.id, 'interview'), className: "px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm font-medium", children: "Schedule Interview" }) })), ['pending', 'reviewed', 'interview'].includes(app.status) && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => handleStatusChange(app.id, 'accepted'), className: "px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium flex items-center gap-1", children: [_jsx(Check, { className: "w-4 h-4" }), " Accept"] }), _jsxs("button", { onClick: () => handleStatusChange(app.id, 'rejected'), className: "px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium flex items-center gap-1", children: [_jsx(X, { className: "w-4 h-4" }), " Reject"] })] }))] }), _jsxs("p", { className: "text-xs text-gray-500 mt-3", children: ["Applied on ", new Date(app.applied_at).toLocaleDateString()] })] }, app.id))) }))] }), selectedApp && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-2xl w-full p-6", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: ["Application from ", selectedApp.student?.fullName] }), _jsxs("p", { className: "text-sm text-gray-600 mb-4", children: ["For: ", selectedApp.job?.title] }), _jsx("div", { className: "bg-gray-50 p-4 rounded mb-6 max-h-96 overflow-y-auto", children: _jsx("p", { className: "text-gray-700 whitespace-pre-wrap", children: selectedApp.cover_letter }) }), _jsx("button", { onClick: () => setSelectedApp(null), className: "px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700", children: "Close" })] }) }))] }) }));
}
export default ApplicationsManager;
