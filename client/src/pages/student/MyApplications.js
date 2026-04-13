import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useApplications } from '../../hooks/useApplications';
import { AlertCircle, Briefcase, Calendar, MapPin, Trash2 } from 'lucide-react';
export function MyApplications() {
    const { fetchStudentApplications, deleteApplication, applications, loading, error } = useApplications();
    const [filter, setFilter] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    useEffect(() => {
        fetchStudentApplications();
    }, []);
    const filteredApps = filter === 'all'
        ? applications
        : applications.filter((app) => app.status === filter);
    const handleDelete = async (appId) => {
        try {
            await deleteApplication(appId);
            await fetchStudentApplications();
            setDeleteConfirm(null);
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
    const getStatusMessage = (status) => {
        switch (status) {
            case 'pending':
                return 'Waiting for recruiter to review';
            case 'reviewed':
                return 'Your application has been reviewed';
            case 'interview':
                return 'You have an interview scheduled';
            case 'accepted':
                return 'Congratulations! You got the job';
            case 'rejected':
                return 'Unfortunately, your application was rejected';
            default:
                return 'Application status unknown';
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "My Applications" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Track all your job applications in one place" }), error && (_jsxs("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-red-800", children: error })] })), _jsx("div", { className: "flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto", children: ['all', 'pending', 'reviewed', 'interview', 'accepted', 'rejected'].map((status) => (_jsx("button", { onClick: () => setFilter(status), className: `px-4 py-2 font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${filter === status
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'}`, children: status }, status))) }), loading ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading applications..." })] })) : filteredApps.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Briefcase, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500 text-lg", children: "No applications yet" }), _jsx("p", { className: "text-gray-400 text-sm mt-1", children: filter === 'all'
                                    ? 'Start applying to jobs to see them here'
                                    : `No applications with status "${filter}"` })] })) : (_jsx("div", { className: "space-y-4", children: filteredApps.map((app) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: app.job?.title || 'Job Title' }), _jsx("p", { className: "text-gray-600", children: app.job?.company_name || 'Company' })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`, children: app.status }), _jsx("button", { onClick: () => setDeleteConfirm(app.id), className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors", children: _jsx(Trash2, { className: "w-5 h-5" }) })] })] }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: getStatusMessage(app.status) }), app.job?.location && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 mb-3", children: [_jsx(MapPin, { className: "w-4 h-4" }), app.job.location] })), app.cover_letter && (_jsxs("div", { className: "bg-gray-50 p-3 rounded mb-4", children: [_jsx("p", { className: "text-xs font-medium text-gray-700 mb-2", children: "Your Cover Letter:" }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: app.cover_letter })] })), _jsxs("div", { className: "flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), "Applied ", new Date(app.applied_at).toLocaleDateString()] }), app.updated_at && app.updated_at !== app.applied_at && (_jsxs("div", { className: "flex items-center gap-1", children: ["Updated ", new Date(app.updated_at).toLocaleDateString()] }))] }), deleteConfirm === app.id && (_jsxs("div", { className: "mt-4 p-4 bg-red-50 border border-red-200 rounded-lg", children: [_jsx("p", { className: "text-sm text-red-800 font-medium mb-3", children: "Are you sure you want to withdraw this application?" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleDelete(app.id), className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium", children: "Yes, Withdraw" }), _jsx("button", { onClick: () => setDeleteConfirm(null), className: "px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium", children: "Cancel" })] })] }))] }, app.id))) }))] }) }) }));
}
export default MyApplications;
