import React, { useState, useRef, useEffect } from 'react'
import { useMessaging } from '../hooks/useMessaging'
import { Send, Trash2, Loader, MessageCircle } from 'lucide-react'

interface ChatWindowProps {
  otherUserId: string
  otherUserName: string
  otherUserAvatar?: string
  onBack?: () => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  otherUserId,
  otherUserName,
  otherUserAvatar,
  onBack
}) => {
  const { messages, loading, error, sendMessage, markAsRead, deleteConversation } = useMessaging()
  const [messageInput, setMessageInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Filter messages for this conversation
  const conversationMessages = messages.filter(
    (msg) => msg.sender_id === otherUserId || (msg.recipient_id === otherUserId && msg.sender_id)
  )

  // Mark as read when opening conversation
  useEffect(() => {
    markAsRead(otherUserId)
  }, [otherUserId, markAsRead])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationMessages])

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return

    setSending(true)
    try {
      await sendMessage(otherUserId, messageInput.trim())
      setMessageInput('')
    } catch (err) {
      console.error('Failed to send message:', err)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleDeleteConversation = async () => {
    if (!confirm('Are you sure you want to delete this entire conversation?')) return

    try {
      await deleteConversation(otherUserId)
      onBack?.()
    } catch (err) {
      console.error('Failed to delete conversation:', err)
      alert('Failed to delete conversation. Please try again.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              ←
            </button>
          )}
          {otherUserAvatar && (
            <img
              src={otherUserAvatar}
              alt={otherUserName}
              className="w-10 h-10 rounded-full"
            />
          )}
          <h2 className="font-semibold text-gray-900">{otherUserName}</h2>
        </div>
        <button
          onClick={handleDeleteConversation}
          className="p-2 text-red-500 hover:bg-red-50 rounded transition"
          title="Delete conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {conversationMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-12 h-12 mb-2 opacity-30" />
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          conversationMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === otherUserId ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender_id === otherUserId
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="break-words text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.sender_id === otherUserId ? 'text-gray-600' : 'text-blue-100'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {sending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
