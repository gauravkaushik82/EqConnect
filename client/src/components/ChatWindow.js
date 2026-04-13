import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useMessaging } from '../hooks/useMessaging';
import { Send, Trash2, Loader, MessageCircle } from 'lucide-react';
export const ChatWindow = ({ otherUserId, otherUserName, otherUserAvatar, onBack }) => {
    const { messages, loading, error, sendMessage, markAsRead, deleteConversation } = useMessaging();
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    // Filter messages for this conversation
    const conversationMessages = messages.filter((msg) => msg.sender_id === otherUserId || (msg.recipient_id === otherUserId && msg.sender_id));
    // Mark as read when opening conversation
    useEffect(() => {
        markAsRead(otherUserId);
    }, [otherUserId, markAsRead]);
    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages]);
    const handleSendMessage = async () => {
        if (!messageInput.trim())
            return;
        setSending(true);
        try {
            await sendMessage(otherUserId, messageInput.trim());
            setMessageInput('');
        }
        catch (err) {
            console.error('Failed to send message:', err);
            alert('Failed to send message. Please try again.');
        }
        finally {
            setSending(false);
        }
    };
    const handleDeleteConversation = async () => {
        if (!confirm('Are you sure you want to delete this entire conversation?'))
            return;
        try {
            await deleteConversation(otherUserId);
            onBack?.();
        }
        catch (err) {
            console.error('Failed to delete conversation:', err);
            alert('Failed to delete conversation. Please try again.');
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-full bg-white rounded-lg", children: _jsx(Loader, { className: "w-8 h-8 animate-spin text-blue-500" }) }));
    }
    return (_jsxs("div", { className: "flex flex-col h-full bg-white rounded-lg shadow", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-3", children: [onBack && (_jsx("button", { onClick: onBack, className: "p-1 hover:bg-gray-100 rounded transition", children: "\u2190" })), otherUserAvatar && (_jsx("img", { src: otherUserAvatar, alt: otherUserName, className: "w-10 h-10 rounded-full" })), _jsx("h2", { className: "font-semibold text-gray-900", children: otherUserName })] }), _jsx("button", { onClick: handleDeleteConversation, className: "p-2 text-red-500 hover:bg-red-50 rounded transition", title: "Delete conversation", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm", children: error })), conversationMessages.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-gray-500", children: [_jsx(MessageCircle, { className: "w-12 h-12 mb-2 opacity-30" }), _jsx("p", { children: "No messages yet. Start a conversation!" })] })) : (conversationMessages.map((msg) => (_jsx("div", { className: `flex ${msg.sender_id === otherUserId ? 'justify-start' : 'justify-end'}`, children: _jsxs("div", { className: `max-w-xs px-4 py-2 rounded-lg ${msg.sender_id === otherUserId
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-blue-600 text-white'}`, children: [_jsx("p", { className: "break-words text-sm", children: msg.content }), _jsx("p", { className: `text-xs mt-1 ${msg.sender_id === otherUserId ? 'text-gray-600' : 'text-blue-100'}`, children: new Date(msg.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) })] }) }, msg.id)))), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "p-4 border-t border-gray-200 bg-gray-50", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("textarea", { value: messageInput, onChange: (e) => setMessageInput(e.target.value), onKeyPress: handleKeyPress, placeholder: "Type a message...", rows: 1, className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32" }), _jsx("button", { onClick: handleSendMessage, disabled: !messageInput.trim() || sending, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2", children: sending ? (_jsx(Loader, { className: "w-4 h-4 animate-spin" })) : (_jsx(Send, { className: "w-4 h-4" })) })] }) })] }));
};
