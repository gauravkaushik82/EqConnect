import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useVerification } from '../../hooks/useVerification';
import { Lock, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
function VerificationPending() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { status, notifications, fetchVerificationStatus, fetchNotifications } = useVerification();
    const [timeRemaining, setTimeRemaining] = useState('');
    useEffect(() => {
        fetchVerificationStatus();
        fetchNotifications();
    }, []);
    // Calculate time remaining
    useEffect(() => {
        if (status?.verificationDeadline) {
            const interval = setInterval(() => {
                const deadline = new Date(status.verificationDeadline).getTime();
                const now = new Date().getTime();
                const diff = deadline - now;
                if (diff <= 0) {
                    setTimeRemaining('Deadline passed');
                    clearInterval(interval);
                }
                else {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
                }
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [status?.verificationDeadline]);
    if (status?.verificationStatus === 'verified') {
        navigate('/dashboard');
        return null;
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-orange-50 to-white", children: [_jsx("nav", { className: "sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center", children: [_jsx("div", { className: "text-2xl font-bold text-indigo-600", children: "EqConnect" }), _jsx("span", { className: "text-gray-600", children: user?.full_name || 'University' })] }) }), _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [_jsxs("div", { className: "mb-8 p-6 bg-orange-50 border-2 border-orange-300 rounded-xl flex items-start gap-4", children: [_jsx(Lock, { className: "w-8 h-8 text-orange-600 mt-1 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-orange-900 mb-2", children: "Account Verification Pending" }), _jsx("p", { className: "text-orange-800", children: "Your account is currently locked pending verification. An admin will review your submitted documents and approve or reject your request." })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-200 shadow-md", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Verification Status" }), _jsx(Clock, { className: "w-6 h-6 text-orange-500" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Status" }), _jsx("p", { className: "text-lg font-bold text-orange-600 capitalize", children: status?.verificationStatus || 'Unknown' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Documents Submitted" }), _jsxs("p", { className: "text-lg font-bold text-indigo-600", children: [status?.documentsSubmitted || 0, " / 3"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Time Remaining" }), _jsx("p", { className: "text-lg font-bold text-red-600", children: timeRemaining || 'Loading...' })] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-200 shadow-md", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Verification Timeline" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx(CheckCircle, { className: "w-6 h-6 text-green-500" }), _jsx("div", { className: "w-1 h-8 bg-gray-200 mt-1" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Documents Submitted" }), _jsx("p", { className: "text-sm text-gray-600", children: status?.submittedAt
                                                                    ? new Date(status.submittedAt).toLocaleDateString()
                                                                    : 'Not submitted' })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx(Clock, { className: "w-6 h-6 text-orange-500" }), _jsx("div", { className: "w-1 h-8 bg-gray-200 mt-1" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Under Review" }), _jsx("p", { className: "text-sm text-gray-600", children: "Admin is reviewing your documents" })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "flex flex-col items-center", children: status?.verificationStatus === 'verified' ? (_jsx(CheckCircle, { className: "w-6 h-6 text-green-500" })) : status?.verificationStatus === 'rejected' ? (_jsx(XCircle, { className: "w-6 h-6 text-red-500" })) : (_jsx("div", { className: "w-6 h-6 rounded-full border-2 border-gray-300" })) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Decision" }), _jsx("p", { className: "text-sm text-gray-600", children: status?.approvedAt
                                                                    ? `Approved on ${new Date(status.approvedAt).toLocaleDateString()}`
                                                                    : 'Pending admin decision' })] })] })] })] })] }), status?.documents && status.documents.length > 0 && (_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-200 shadow-md mb-8", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Submitted Documents" }), _jsx("div", { className: "space-y-3", children: status.documents.map((doc) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: doc.fileName }), _jsx("p", { className: "text-sm text-gray-600 capitalize", children: doc.type.replace(/_/g, ' ') })] }), _jsx("p", { className: "text-sm text-gray-600", children: new Date(doc.uploadedAt).toLocaleDateString() })] }, doc.id))) })] })), status?.notes && (_jsx("div", { className: "bg-yellow-50 p-6 rounded-xl border border-yellow-200 mb-8", children: _jsxs("div", { className: "flex gap-3", children: [_jsx(AlertCircle, { className: "w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-yellow-900 mb-2", children: "Admin Notes" }), _jsx("p", { className: "text-yellow-800", children: status.notes })] })] }) })), notifications && notifications.length > 0 && (_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-200 shadow-md", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Recent Updates" }), _jsx("div", { className: "space-y-3", children: notifications.slice(0, 5).map((notif) => (_jsxs("div", { className: "p-4 bg-blue-50 rounded-lg border border-blue-100", children: [_jsx("p", { className: "text-sm font-medium text-blue-900 capitalize", children: notif.type }), _jsx("p", { className: "text-sm text-blue-800 mt-1", children: notif.message })] }, notif.id))) })] })), _jsxs("div", { className: "mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200", children: [_jsx("h4", { className: "font-semibold text-blue-900 mb-3", children: "What Happens Next?" }), _jsxs("ul", { className: "space-y-2 text-blue-900 text-sm", children: [_jsx("li", { children: "\u2713 An admin will review your submitted documents within 24-48 hours" }), _jsx("li", { children: "\u2713 You will receive notifications about the verification status" }), _jsx("li", { children: "\u2713 Once verified, your account will be automatically unlocked" }), _jsx("li", { children: "\u2713 If rejected, you can resubmit documents with corrections" }), _jsx("li", { children: "\u2713 Verification must be completed within 7 days of submission" })] })] })] })] }));
}
export default VerificationPending;
