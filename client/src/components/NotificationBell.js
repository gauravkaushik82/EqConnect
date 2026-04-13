import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import useNotifications from '../hooks/useNotifications';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
export default function NotificationBell() {
    const { notifications, unreadCount, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const bellRef = useRef(null);
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);
    useEffect(() => {
        if (isOpen) {
            fetchNotifications(false, 10, 0);
        }
    }, [isOpen, fetchNotifications]);
    useEffect(() => {
        function handleClickOutside(event) {
            if (bellRef.current && !bellRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const getNotificationColor = (type) => {
        switch (type) {
            case 'job_application':
                return 'bg-blue-50 border-blue-200';
            case 'application_status':
                return 'bg-green-50 border-green-200';
            case 'message':
                return 'bg-purple-50 border-purple-200';
            case 'profile_view':
                return 'bg-yellow-50 border-yellow-200';
            case 'skill_endorsement':
                return 'bg-pink-50 border-pink-200';
            case 'opportunity':
                return 'bg-indigo-50 border-indigo-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };
    return (_jsxs("div", { className: "relative", ref: bellRef, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none", children: [_jsx(Bell, { className: "w-6 h-6" }), unreadCount > 0 && (_jsx("span", { className: "absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full", children: unreadCount > 99 ? '99+' : unreadCount }))] }), isOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto", children: [_jsxs("div", { className: "sticky top-0 bg-white border-b p-4 flex justify-between items-center", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: "Notifications" }), unreadCount > 0 && (_jsx("button", { onClick: markAllAsRead, className: "text-xs text-blue-600 hover:text-blue-700 font-medium", children: "Mark all as read" }))] }), notifications.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-500", children: "No notifications" })) : (_jsx("div", { className: "divide-y", children: notifications.map((notif) => (_jsx("div", { className: `p-4 hover:bg-gray-50 border-l-4 ${getNotificationColor(notif.type)} transition-colors`, children: _jsxs("div", { className: "flex justify-between items-start gap-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium text-gray-900 truncate", children: notif.title }), _jsx("p", { className: "text-sm text-gray-600 mt-1 line-clamp-2", children: notif.message }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: [new Date(notif.created_at).toLocaleDateString(), " at", ' ', new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] })] }), _jsxs("div", { className: "flex gap-1 ml-2", children: [!notif.read && (_jsx("button", { onClick: () => markAsRead(notif.id), className: "p-1 text-gray-400 hover:text-blue-600 transition-colors", title: "Mark as read", children: _jsx(Check, { className: "w-4 h-4" }) })), notif.read && _jsx(CheckCheck, { className: "w-4 h-4 text-gray-400" }), _jsx("button", { onClick: () => deleteNotification(notif.id), className: "p-1 text-gray-400 hover:text-red-600 transition-colors", title: "Delete", children: _jsx(X, { className: "w-4 h-4" }) })] })] }) }, notif.id))) })), _jsx("div", { className: "sticky bottom-0 bg-gray-50 border-t p-3 text-center", children: _jsx("a", { href: "/notifications", className: "text-sm text-blue-600 hover:text-blue-700 font-medium", children: "View all notifications" }) })] }))] }));
}
