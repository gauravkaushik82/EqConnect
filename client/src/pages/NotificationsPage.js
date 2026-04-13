import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import useNotifications from '../hooks/useNotifications';
import { Trash2, Settings } from 'lucide-react';
export default function NotificationsPage() {
    const { notifications, preferences, loading, fetchNotifications, markAsRead, deleteNotification, fetchPreferences, updatePreferences } = useNotifications();
    const [showSettings, setShowSettings] = useState(false);
    useEffect(() => {
        fetchNotifications(false, 50, 0);
        fetchPreferences();
    }, [fetchNotifications, fetchPreferences]);
    const handleEmailToggle = async () => {
        if (!preferences)
            return;
        await updatePreferences({
            ...preferences,
            email_notifications: !preferences.email_notifications
        });
    };
    const handleInAppToggle = async () => {
        if (!preferences)
            return;
        await updatePreferences({
            ...preferences,
            in_app_notifications: !preferences.in_app_notifications
        });
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Notifications" }), _jsxs("button", { onClick: () => setShowSettings(!showSettings), className: "flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors", children: [_jsx(Settings, { className: "w-5 h-5" }), "Settings"] })] }), showSettings && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Notification Preferences" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: preferences?.in_app_notifications ?? true, onChange: handleInAppToggle, className: "w-4 h-4 text-blue-600 rounded" }), _jsx("span", { className: "text-gray-700", children: "In-app notifications" })] }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: preferences?.email_notifications ?? true, onChange: handleEmailToggle, className: "w-4 h-4 text-blue-600 rounded" }), _jsx("span", { className: "text-gray-700", children: "Email notifications" })] })] })] })), loading ? (_jsx("div", { className: "text-center py-12", children: _jsx("div", { className: "inline-block animate-spin", children: _jsx("div", { className: "w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full" }) }) })) : notifications.length === 0 ? (_jsx("div", { className: "bg-white rounded-lg shadow p-12 text-center", children: _jsx("p", { className: "text-gray-500 text-lg", children: "No notifications yet" }) })) : (_jsx("div", { className: "space-y-4", children: notifications.map((notif) => (_jsxs("div", { className: `bg-white rounded-lg shadow p-4 flex justify-between items-start gap-4 hover:shadow-md transition-shadow ${!notif.read ? 'border-l-4 border-blue-600' : ''}`, children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: notif.title }), !notif.read && _jsx("span", { className: "px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded", children: "New" })] }), _jsx("p", { className: "text-gray-600 mb-2", children: notif.message }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-500", children: [_jsx("span", { className: "bg-gray-100 px-2 py-1 rounded text-xs", children: notif.type }), _jsx("span", { children: new Date(notif.created_at).toLocaleString() })] })] }), _jsxs("div", { className: "flex gap-2", children: [!notif.read && (_jsx("button", { onClick: () => markAsRead(notif.id), className: "px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded transition-colors", children: "Mark read" })), _jsx("button", { onClick: () => deleteNotification(notif.id), className: "p-2 text-gray-400 hover:text-red-600 transition-colors", children: _jsx(Trash2, { className: "w-5 h-5" }) })] })] }, notif.id))) }))] }) }));
}
