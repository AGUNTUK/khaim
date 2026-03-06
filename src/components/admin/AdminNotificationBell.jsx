import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../context/ToastContext'

const formatRelativeTime = value => {
  const then = new Date(value).getTime()
  const now = Date.now()
  const diffSeconds = Math.max(1, Math.floor((now - then) / 1000))

  if (diffSeconds < 60) return `${diffSeconds}s ago`
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`
  return `${Math.floor(diffSeconds / 86400)}d ago`
}

export default function AdminNotificationBell({ className = '', enableToasts = true }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const latestSeenRef = useRef(null)
  const mountedRef = useRef(false)

  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useAdmin()
  const { addToast } = useToast()

  const topNotifications = useMemo(() => notifications.slice(0, 12), [notifications])

  useEffect(() => {
    const onWindowClick = event => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    window.addEventListener('click', onWindowClick)

    return () => {
      window.removeEventListener('click', onWindowClick)
    }
  }, [])

  useEffect(() => {
    if (!enableToasts) {
      return undefined
    }

    if (!notifications.length) {
      return
    }

    const latest = notifications[0]

    if (!mountedRef.current) {
      mountedRef.current = true
      latestSeenRef.current = latest.id
      return
    }

    if (latest.id !== latestSeenRef.current) {
      latestSeenRef.current = latest.id
      addToast(`${latest.title}: ${latest.message}`, 'success')
    }
  }, [notifications, addToast, enableToasts])

  return (
    <div className={`admin-notification ${className}`.trim()} ref={containerRef}>
      <button
        type="button"
        className="admin-notification-btn"
        onClick={event => {
          event.stopPropagation()
          setOpen(prev => !prev)
        }}
        aria-label="Open notifications"
      >
        <Bell size={18} />
        {unreadNotificationCount > 0 ? (
          <span className="admin-notification-count">{Math.min(99, unreadNotificationCount)}</span>
        ) : null}
      </button>

      {open ? (
        <div className="admin-notification-dropdown" onClick={event => event.stopPropagation()}>
          <div className="admin-notification-head">
            <h3>Notifications</h3>
            <span>{unreadNotificationCount} unread</span>
          </div>

          <div className="admin-notification-actions">
            <button type="button" onClick={markAllNotificationsRead}>
              <CheckCheck size={14} /> Mark all read
            </button>
            <button type="button" onClick={clearNotifications}>
              <Trash2 size={14} /> Clear
            </button>
          </div>

          {topNotifications.length === 0 ? (
            <p className="admin-notification-empty">No notifications yet.</p>
          ) : (
            <div className="admin-notification-list">
              {topNotifications.map(notification => (
                <button
                  type="button"
                  key={notification.id}
                  className={`admin-notification-item ${notification.read ? '' : 'unread'}`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="admin-notification-item-row">
                    <strong>{notification.title}</strong>
                    <span>{formatRelativeTime(notification.createdAt)}</span>
                  </div>
                  <p>{notification.message}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
