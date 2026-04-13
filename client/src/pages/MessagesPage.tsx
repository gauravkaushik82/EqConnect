import React, { useState } from 'react'
import { ConversationList } from '../components/ConversationList'
import { ChatWindow } from '../components/ChatWindow'
import { MessageCircle } from 'lucide-react'

export const MessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<{
    userId: string
    userName: string
    avatar?: string
    isRecruiter?: boolean
  } | null>(null)

  const handleSelectConversation = (
    userId: string,
    userName: string,
    avatar?: string,
    isRecruiter?: boolean
  ) => {
    setSelectedConversation({ userId, userName, avatar, isRecruiter })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          </div>
          <p className="text-gray-600">Connect with recruiters and students</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <ConversationList
              selectedUserId={selectedConversation?.userId}
              onSelectConversation={handleSelectConversation}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <ChatWindow
                otherUserId={selectedConversation.userId}
                otherUserName={selectedConversation.userName}
                otherUserAvatar={selectedConversation.avatar}
                onBack={() => setSelectedConversation(null)}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-lg shadow">
                <div className="text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
