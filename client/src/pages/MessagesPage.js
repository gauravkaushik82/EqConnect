import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import { MessageCircle } from 'lucide-react';
export const MessagesPage = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const handleSelectConversation = (userId, userName, avatar, isRecruiter) => {
        setSelectedConversation({ userId, userName, avatar, isRecruiter });
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-100 py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(MessageCircle, { className: "w-8 h-8 text-blue-600" }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Messages" })] }), _jsx("p", { className: "text-gray-600", children: "Connect with recruiters and students" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 h-96", children: [_jsx("div", { className: "lg:col-span-1", children: _jsx(ConversationList, { selectedUserId: selectedConversation?.userId, onSelectConversation: handleSelectConversation }) }), _jsx("div", { className: "lg:col-span-2", children: selectedConversation ? (_jsx(ChatWindow, { otherUserId: selectedConversation.userId, otherUserName: selectedConversation.userName, otherUserAvatar: selectedConversation.avatar, onBack: () => setSelectedConversation(null) })) : (_jsx("div", { className: "flex items-center justify-center h-full bg-white rounded-lg shadow", children: _jsxs("div", { className: "text-center text-gray-500", children: [_jsx(MessageCircle, { className: "w-12 h-12 mx-auto mb-4 opacity-30" }), _jsx("p", { className: "text-lg font-medium", children: "Select a conversation to start messaging" })] }) })) })] })] }) }));
};
