import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useVerification } from '../../hooks/useVerification';
import { Check, X, Eye, Loader, AlertCircle } from 'lucide-react';
function AdminVerificationDash() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getPendingVerifications, approveVerification, rejectVerification, error } = useVerification();
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [selectedVerification, setSelectedVerification] = useState(null);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [approvalNotes, setApprovalNotes] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    useEffect(() => {
        fetchPendingVerifications();
    }, []);
    const fetchPendingVerifications = async () => {
        const result = await getPendingVerifications();
        if (result) {
            setPendingVerifications(result.verifications || []);
        }
    };
    const handleApprove = async (verification) => {
        setActionLoading(true);
        const result = await approveVerification(verification.userId, approvalNotes);
        if (result) {
            setApprovalNotes('');
            setSelectedVerification(null);
            await fetchPendingVerifications();
        }
        setActionLoading(false);
    };
    const handleReject = async (verification) => {
        if (!rejectReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        setActionLoading(true);
        const result = await rejectVerification(verification.userId, rejectReason);
        if (result) {
            setRejectReason('');
            setShowRejectForm(false);
            setSelectedVerification(null);
            await fetchPendingVerifications();
        }
        setActionLoading(false);
    };
    if (user?.role !== 'admin') {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertCircle, { className: "w-16 h-16 text-red-600 mx-auto mb-4" }), _jsx("h1", { className: "text-2xl font-bold text-red-900 mb-2", children: "Access Denied" }), _jsx("p", { className: "text-red-700 mb-6", children: "Only admins can access this page" }), _jsx("button", { onClick: () => navigate('/dashboard'), className: "px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700", children: "Go to Dashboard" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-purple-50 to-white", children: [_jsx("nav", { className: "sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center", children: [_jsx("div", { className: "text-2xl font-bold text-indigo-600", children: "EqConnect Admin" }), _jsxs("div", { className: "flex gap-4 items-center", children: [_jsx("span", { className: "text-gray-600", children: user?.full_name || 'Admin' }), _jsx("button", { onClick: () => navigate('/dashboard'), className: "px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50", children: "Back" })] })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "University Verifications" }), _jsx("p", { className: "text-gray-600", children: "Review and approve pending university verifications" })] }), error && (_jsxs("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-red-800", children: error })] })), _jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4", children: [_jsx("h2", { className: "text-lg font-bold", children: "Pending Verifications" }), _jsxs("p", { className: "text-purple-100 text-sm", children: [pendingVerifications.length, " requests"] })] }), _jsx("div", { className: "max-h-screen overflow-y-auto", children: pendingVerifications.length === 0 ? (_jsx("div", { className: "p-6 text-center text-gray-600", children: _jsx("p", { children: "No pending verifications" }) })) : (_jsx("div", { className: "divide-y", children: pendingVerifications.map((verification) => (_jsxs("button", { onClick: () => {
                                                        setSelectedVerification(verification);
                                                        setShowRejectForm(false);
                                                    }, className: `w-full p-4 text-left hover:bg-gray-50 transition-colors border-l-4 ${selectedVerification?.userId === verification.userId
                                                        ? 'border-l-purple-600 bg-purple-50'
                                                        : 'border-l-gray-200'}`, children: [_jsx("p", { className: "font-semibold text-gray-900", children: verification.universityName }), _jsx("p", { className: "text-sm text-gray-600 truncate", children: verification.email }), _jsxs("div", { className: "mt-2 flex items-center gap-2", children: [_jsx("span", { className: "inline-block w-2 h-2 bg-yellow-500 rounded-full" }), _jsx("p", { className: "text-xs text-gray-600", children: new Date(verification.submittedAt).toLocaleDateString() })] })] }, verification.userId))) })) })] }) }), _jsx("div", { className: "lg:col-span-2", children: selectedVerification ? (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-md p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: selectedVerification.universityName }), _jsx("p", { className: "text-gray-600", children: selectedVerification.email })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Submitted" }), _jsx("p", { className: "font-semibold text-gray-900", children: new Date(selectedVerification.submittedAt).toLocaleString() })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Deadline" }), _jsx("p", { className: "font-semibold text-gray-900", children: new Date(selectedVerification.deadline).toLocaleString() })] })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("h4", { className: "font-bold text-gray-900 mb-3", children: ["Submitted Documents (", selectedVerification.documents.length, ")"] }), _jsx("div", { className: "space-y-2", children: selectedVerification.documents.map((doc) => (_jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-lg", children: [_jsx(Eye, { className: "w-4 h-4 text-indigo-600" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: doc.file_name }), _jsx("p", { className: "text-xs text-gray-600 capitalize", children: doc.document_type.replace(/_/g, ' ') })] }), _jsx("a", { href: `/uploads/verification/${doc.file_name}`, target: "_blank", rel: "noopener noreferrer", className: "px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-300 rounded hover:bg-indigo-50", children: "View" })] }, doc.id))) })] }), selectedVerification.activityLog.length > 0 && (_jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "font-bold text-gray-900 mb-3", children: "Activity Log" }), _jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto", children: selectedVerification.activityLog.map((log, idx) => (_jsxs("div", { className: "text-sm p-2 bg-blue-50 rounded border border-blue-200", children: [_jsx("p", { className: "font-medium text-blue-900 capitalize", children: log.action }), _jsx("p", { className: "text-xs text-blue-700", children: new Date(log.created_at).toLocaleString() })] }, idx))) })] })), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900 mb-2", children: "Admin Notes (Optional)" }), _jsx("textarea", { value: approvalNotes, onChange: (e) => setApprovalNotes(e.target.value), placeholder: "Add any notes for the university...", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent", rows: 3 })] }), !showRejectForm ? (_jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => handleApprove(selectedVerification), disabled: actionLoading, className: `flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${actionLoading
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'}`, children: actionLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader, { className: "w-5 h-5 animate-spin" }), "Processing..."] })) : (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-5 h-5" }), "Approve"] })) }), _jsxs("button", { onClick: () => setShowRejectForm(true), disabled: actionLoading, className: `flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${actionLoading
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'}`, children: [_jsx(X, { className: "w-5 h-5" }), "Reject"] })] })) : (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900 mb-2", children: "Rejection Reason" }), _jsx("textarea", { value: rejectReason, onChange: (e) => setRejectReason(e.target.value), placeholder: "Explain why the verification is being rejected...", className: "w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3", rows: 3 }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => handleReject(selectedVerification), disabled: actionLoading, className: `flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${actionLoading
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : 'bg-red-600 text-white hover:bg-red-700'}`, children: actionLoading ? 'Rejecting...' : 'Confirm Rejection' }), _jsx("button", { onClick: () => {
                                                                setShowRejectForm(false);
                                                                setRejectReason('');
                                                            }, className: "flex-1 py-3 px-6 rounded-lg font-semibold border border-gray-300 text-gray-900 hover:bg-gray-50", children: "Cancel" })] })] }))] })) : (_jsx("div", { className: "bg-white rounded-xl border border-gray-200 shadow-md p-12 text-center", children: _jsx("p", { className: "text-gray-600 text-lg", children: "Select a verification request to review" }) })) })] })] })] }));
}
export default AdminVerificationDash;
