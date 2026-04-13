import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import { useApplications } from '../../hooks/useApplications';
import { AlertCircle, MapPin, TrendingUp, Calendar, DollarSign } from 'lucide-react';
export function JobDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { fetchJob, currentJob, loading: jobLoading, error: jobError } = useJobs();
    const { applyForJob, loading: applyLoading, error: applyError } = useApplications();
    const [coverLetter, setCoverLetter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        if (jobId) {
            fetchJob(jobId);
        }
    }, [jobId]);
    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await applyForJob(jobId, coverLetter);
            setSuccess(true);
            setCoverLetter('');
            setShowForm(false);
            setTimeout(() => setSuccess(false), 3000);
        }
        catch (err) {
            console.error(err);
        }
    };
    if (jobLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading job details..." })] }) }));
    }
    if (jobError || !currentJob) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsx("div", { className: "bg-white rounded-lg shadow-lg p-8", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertCircle, { className: "w-16 h-16 text-red-600 mx-auto mb-4" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Job Not Found" }), _jsx("p", { className: "text-gray-600 mb-6", children: "This job posting doesn't exist or has been removed." }), _jsx("button", { onClick: () => navigate('/student/jobs'), className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Back to Jobs" })] }) }) }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("button", { onClick: () => navigate('/student/jobs'), className: "mb-6 text-blue-600 hover:text-blue-700 font-medium", children: "\u2190 Back to Jobs" }), success && (_jsx("div", { className: "mb-6 p-4 bg-green-50 border border-green-200 rounded-lg", children: _jsx("p", { className: "text-green-800 font-medium", children: "\u2713 Application submitted successfully!" }) })), applyError && (_jsxs("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-red-800", children: applyError })] })), _jsxs("div", { className: "bg-white rounded-lg shadow-lg overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8", children: [_jsx("span", { className: "inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium mb-4", children: currentJob.job_type }), _jsx("h1", { className: "text-4xl font-bold mb-2", children: currentJob.title }), _jsx("p", { className: "text-xl text-blue-100", children: currentJob.company_name })] }), _jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200", children: [currentJob.location && (_jsxs("div", { children: [_jsx("p", { className: "text-gray-500 text-sm mb-1", children: "Location" }), _jsxs("div", { className: "flex items-center gap-1 text-gray-900 font-medium", children: [_jsx(MapPin, { className: "w-4 h-4" }), currentJob.location] })] })), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500 text-sm mb-1", children: "Experience" }), _jsxs("div", { className: "flex items-center gap-1 text-gray-900 font-medium capitalize", children: [_jsx(TrendingUp, { className: "w-4 h-4" }), currentJob.experience_level] })] }), currentJob.deadline && (_jsxs("div", { children: [_jsx("p", { className: "text-gray-500 text-sm mb-1", children: "Deadline" }), _jsxs("div", { className: "flex items-center gap-1 text-gray-900 font-medium", children: [_jsx(Calendar, { className: "w-4 h-4" }), new Date(currentJob.deadline).toLocaleDateString()] })] })), currentJob.salary_min && currentJob.salary_max && (_jsxs("div", { children: [_jsx("p", { className: "text-gray-500 text-sm mb-1", children: "Salary Range" }), _jsxs("div", { className: "flex items-center gap-1 text-gray-900 font-medium", children: [_jsx(DollarSign, { className: "w-4 h-4" }), currentJob.salary_min.toLocaleString(), "-", currentJob.salary_max.toLocaleString()] })] }))] }), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "About This Job" }), _jsx("div", { className: "prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap", children: currentJob.description })] }), currentJob.required_skills && currentJob.required_skills.length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Required Skills" }), _jsx("div", { className: "flex flex-wrap gap-2", children: currentJob.required_skills.map((skill) => (_jsx("span", { className: "px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium", children: skill }, skill))) })] })), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 mb-8 flex gap-8", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500 text-sm", children: "Applications" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: currentJob.application_count })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500 text-sm", children: "Views" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: currentJob.view_count })] })] }), !showForm ? (_jsx("button", { onClick: () => setShowForm(true), className: "w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg transition-colors", children: "Apply Now" })) : (_jsxs("form", { onSubmit: handleApply, className: "bg-gray-50 rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "Submit Your Application" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Cover Letter *" }), _jsx("textarea", { value: coverLetter, onChange: (e) => setCoverLetter(e.target.value), placeholder: "Tell us why you're a great fit for this role...", required: true, rows: 6, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "1-5000 characters" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "submit", disabled: applyLoading || !coverLetter.trim(), className: "flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold disabled:bg-gray-400", children: applyLoading ? 'Submitting...' : 'Submit Application' }), _jsx("button", { type: "button", onClick: () => setShowForm(false), className: "flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-bold", children: "Cancel" })] })] }))] })] })] }) }));
}
export default JobDetails;
