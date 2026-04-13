import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMessaging } from '../hooks/useMessaging';
import { Loader, MessageCircle, Trash2 } from 'lucide-react';
export const ConversationList = ({ onSelectConversation, selectedUserId }) => {
    const { conversations, loading, error, totalUnread, deleteConversation } = useMessaging();
    const [deleting, setDeleting] = useState(null);
    const handleDeleteConversation = async (e, userId) => {
        e.stopPropagation();
        if (!confirm('Delete this conversation?'))
            return;
        setDeleting(userId);
        try {
            await deleteConversation(userId);
        }
        catch (err) {
            console.error('Failed to delete conversation:', err);
            alert('Failed to delete conversation.');
        }
        finally {
            setDeleting(null);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-full bg-white rounded-lg", children: _jsx(Loader, { className: "w-8 h-8 animate-spin text-blue-500" }) }));
    }
    return (_jsxs("div", { className: "h-full bg-white rounded-lg shadow flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-gray-200", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Messages" }), totalUnread > 0 && (_jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [totalUnread, " unread ", totalUnread === 1 ? 'message' : 'messages'] }))] }), error && (_jsx("div", { className: "m-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm", children: error })), _jsx("div", { className: "flex-1 overflow-y-auto", children: conversations.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-gray-500 p-4", children: [_jsx(MessageCircle, { className: "w-12 h-12 mb-2 opacity-30" }), _jsx("p", { className: "text-center", children: "No conversations yet" })] })) : (_jsx("div", { className: "divide-y divide-gray-200", children: conversations.map((conversation) => (_jsx("button", { onClick: () => onSelectConversation(conversation.other_user_id, conversation.other_user_name, conversation.other_user_avatar || undefined, conversation.is_recruiter), className: `w-full text-left px-4 py-3 hover:bg-gray-50 transition ${selectedUserId === conversation.other_user_id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`, children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-medium text-gray-900 truncate", children: conversation.other_user_name }), conversation.is_recruiter && (_jsx("span", { className: "inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded", children: "Recruiter" })), conversation.unread_count > 0 && (_jsx("span", { className: "inline-flex items-center justify-center w-5 h-5 ml-auto text-xs font-bold text-white bg-red-500 rounded-full", children: conversation.unread_count }))] }), conversation.last_message && (_jsx("p", { className: "text-sm text-gray-600 truncate mt-1", children: conversation.last_message })), conversation.last_message_at && (_jsx("p", { className: "text-xs text-gray-500 mt-1", children: new Date(conversation.last_message_at).toLocaleDateString() }))] }), _jsx("button", { onClick: (e) => handleDeleteConversation(e, conversation.other_user_id), disabled: deleting === conversation.other_user_id, className: "p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition", title: "Delete conversation", children: deleting === conversation.other_user_id ? (_jsx(Loader, { className: "w-4 h-4 animate-spin" })) : (_jsx(Trash2, { className: "w-4 h-4" })) })] }) }, conversation.id))) })) })] }));
};
