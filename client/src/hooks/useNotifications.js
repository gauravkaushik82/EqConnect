import { useState, useCallback } from 'react';
export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const fetchNotifications = useCallback(async (unreadOnly = false, limit = 20, offset = 0) => {
        if (!token) {
            setError('Not authenticated');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (unreadOnly)
                params.append('unread_only', 'true');
            params.append('limit', limit.toString());
            params.append('offset', offset.toString());
            const response = await fetch(`http://localhost:3001/api/notifications?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok)
                throw new Error('Failed to fetch notifications');
            const data = await response.json();
            setNotifications(data.notifications || []);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching notifications');
        }
        finally {
            setLoading(false);
        }
    }, [token]);
    const fetchUnreadCount = useCallback(async () => {
        if (!token)
            return;
        try {
            const response = await fetch('http://localhost:3001/api/notifications/unread/count', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok)
                throw new Error('Failed to fetch unread count');
            const data = await response.json();
            setUnreadCount(data.unread_count || 0);
        }
        catch (err) {
            console.error('Error fetching unread count:', err);
        }
    }, [token]);
    const markAsRead = useCallback(async (notificationId) => {
        if (!token) {
            setError('Not authenticated');
            return;
        }
        try {
            const response = await fetch(`http://localhost:3001/api/notifications/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ read: true })
            });
            if (!response.ok)
                throw new Error('Failed to mark notification as read');
            setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
            await fetchUnreadCount();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error marking notification as read');
        }
    }, [token, fetchUnreadCount]);
    const markAllAsRead = useCallback(async () => {
        if (!token) {
            setError('Not authenticated');
            return;
        }
        try {
            const response = await fetch('http://localhost:3001/api/notifications/mark-all/read', {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok)
                throw new Error('Failed to mark all as read');
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error marking all as read');
        }
    }, [token]);
    const deleteNotification = useCallback(async (notificationId) => {
        if (!token) {
            setError('Not authenticated');
            return;
        }
        try {
            const response = await fetch(`http://localhost:3001/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok)
                throw new Error('Failed to delete notification');
            setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
            await fetchUnreadCount();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting notification');
        }
    }, [token, fetchUnreadCount]);
    const fetchPreferences = useCallback(async () => {
        if (!token)
            return;
        try {
            const response = await fetch('http://localhost:3001/api/notifications/preferences/get', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok)
                throw new Error('Failed to fetch preferences');
            const data = await response.json();
            setPreferences(data);
        }
        catch (err) {
            console.error('Error fetching preferences:', err);
        }
    }, [token]);
    const updatePreferences = useCallback(async (prefs) => {
        if (!token) {
            setError('Not authenticated');
            return;
        }
        try {
            const response = await fetch('http://localhost:3001/api/notifications/preferences/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(prefs)
            });
            if (!response.ok)
                throw new Error('Failed to update preferences');
            const data = await response.json();
            setPreferences(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating preferences');
        }
    }, [token]);
    return {
        notifications,
        unreadCount,
        preferences,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchPreferences,
        updatePreferences
    };
};
export default useNotifications;
