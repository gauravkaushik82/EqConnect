import React, { useState } from 'react'
import { useMessaging } from '../hooks/useMessaging'
import { Loader, MessageCircle, Trash2 } from 'lucide-react'

interface ConversationListProps {
  onSelectConversation: (userId: string, userName: string, avatar?: string, isRecruiter?: boolean) => void
  selectedUserId?: string
}

export const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedUserId
}) => {
  const { conversations, loading, error, totalUnread, deleteConversation } = useMessaging()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDeleteConversation = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation()
    if (!confirm('Delete this conversation?')) return

    setDeleting(userId)
    try {
      await deleteConversation(userId)
    } catch (err) {
      console.error('Failed to delete conversation:', err)
      alert('Failed to delete conversation.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-lg">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="h-full bg-white rounded-lg shadow flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        {totalUnread > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {totalUnread} unread {totalUnread === 1 ? 'message' : 'messages'}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="m-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <MessageCircle className="w-12 h-12 mb-2 opacity-30" />
            <p className="text-center">No conversations yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() =>
                  onSelectConversation(
                    conversation.other_user_id,
                    conversation.other_user_name,
                    conversation.other_user_avatar || undefined,
                    conversation.is_recruiter
                  )
                }
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${
                  selectedUserId === conversation.other_user_id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.other_user_name}
                      </h3>
                      {conversation.is_recruiter && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                          Recruiter
                        </span>
                      )}
                      {conversation.unread_count > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 ml-auto text-xs font-bold text-white bg-red-500 rounded-full">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                    {conversation.last_message && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.last_message}
                      </p>
                    )}
                    {conversation.last_message_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(conversation.last_message_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleDeleteConversation(e, conversation.other_user_id)}
                    disabled={deleting === conversation.other_user_id}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                    title="Delete conversation"
                  >
                    {deleting === conversation.other_user_id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
