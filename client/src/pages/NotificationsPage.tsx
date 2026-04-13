import { useEffect, useState } from 'react'
import useNotifications from '../hooks/useNotifications'
import { Trash2, Settings } from 'lucide-react'

export default function NotificationsPage() {
  const { notifications, preferences, loading, fetchNotifications, markAsRead, deleteNotification, fetchPreferences, updatePreferences } = useNotifications()
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    fetchNotifications(false, 50, 0)
    fetchPreferences()
  }, [fetchNotifications, fetchPreferences])

  const handleEmailToggle = async () => {
    if (!preferences) return
    await updatePreferences({
      ...preferences,
      email_notifications: !preferences.email_notifications
    })
  }

  const handleInAppToggle = async () => {
    if (!preferences) return
    await updatePreferences({
      ...preferences,
      in_app_notifications: !preferences.in_app_notifications
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {showSettings && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences?.in_app_notifications ?? true}
                  onChange={handleInAppToggle}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-gray-700">In-app notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences?.email_notifications ?? true}
                  onChange={handleEmailToggle}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-gray-700">Email notifications</span>
              </label>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-white rounded-lg shadow p-4 flex justify-between items-start gap-4 hover:shadow-md transition-shadow ${!notif.read ? 'border-l-4 border-blue-600' : ''}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    {!notif.read && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">New</span>}
                  </div>
                  <p className="text-gray-600 mb-2">{notif.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{notif.type}</span>
                    <span>{new Date(notif.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
