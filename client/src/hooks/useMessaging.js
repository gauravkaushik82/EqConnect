import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export function useMessaging() {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Fetch all conversations
    const fetchConversations = useCallback(async () => {
        const token = localStorage.getItem('auth_token');
        if (!token)
            return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/api/messages/conversations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch conversations: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success) {
                setConversations(data.data || []);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Fetch messages for a specific conversation
    const fetchMessages = useCallback(async (userId) => {
        const token = localStorage.getItem('auth_token');
        if (!token)
            return;
        try {
            const response = await fetch(`${API_BASE}/api/messages/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch messages: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success) {
                setMessages(data.data || []);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch messages');
        }
    }, []);
    // Send message
    const sendMessage = useCallback(async (recipientId, content) => {
        const token = localStorage.getItem('auth_token');
        if (!token)
            return false;
        try {
            const response = await fetch(`${API_BASE}/api/messages/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipientId, content }),
            });
            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success) {
                setMessages((prev) => [...prev, data.data]);
                return true;
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
            return false;
        }
    }, []);
    // Mark messages as read
    const markAsRead = useCallback(async (userId) => {
        const token = localStorage.getItem('auth_token');
        if (!token)
            return false;
        try {
            const response = await fetch(`${API_BASE}/api/messages/${userId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to mark as read: ${response.statusText}`);
            }
            // Update local messages
            setMessages((prev) => prev.map((m) => m.sender_id === userId ? { ...m, read: true } : m));
            return true;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark as read');
            return false;
        }
    }, []);
    // Delete conversation
    const deleteConversation = useCallback(async (userId) => {
        const token = localStorage.getItem('auth_token');
        if (!token)
            return false;
        try {
            const response = await fetch(`${API_BASE}/api/messages/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to delete conversation: ${response.statusText}`);
            }
            setConversations((prev) => prev.filter((c) => c.other_user_id !== userId));
            setMessages([]);
            return true;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete conversation');
            return false;
        }
    }, []);
    // Get unread count
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
    // Load conversations on mount
    useEffect(() => {
        if (user?.id) {
            fetchConversations();
        }
    }, [user?.id, fetchConversations]);
    // Poll for new messages every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (user?.id) {
                fetchConversations();
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [user?.id, fetchConversations]);
    return {
        conversations,
        messages,
        loading,
        error,
        totalUnread,
        fetchConversations,
        fetchMessages,
        sendMessage,
        markAsRead,
        deleteConversation,
    };
}
