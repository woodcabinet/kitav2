import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ShoppingBag, Calendar, UserPlus, Package, Check, X } from 'lucide-react'
import { useNotifications, NOTIFICATION_KINDS } from '../../lib/notificationStore'
import { formatRelativeTime } from '../../lib/utils'

// Map kind → icon component (can't embed components inside notificationStore
// because that lib is UI-agnostic — it stays framework-neutral so the same
// reducer can run in a service worker later for push notifications).
const KIND_ICON = { drop: ShoppingBag, event: Calendar, follow: UserPlus, order: Package, system: Bell }

/**
 * Bell + dropdown. Anchors to the bell icon in the header. Tap outside to
 * close (uses a document-level click handler bound only while open).
 *
 * Desktop: popover. Mobile: full-height sheet from the right; same JSX,
 * responsive classes decide which.
 *
 * Data flow: notificationStore is single source of truth. This component
 * never sets local notification state — it reads + mutates via the hook,
 * which means another tab pushing a notification updates this tab's badge.
 */
export function NotificationCenter() {
  const { notifications, unreadCount, markRead, markAllRead, removeNotification, clearAll } = useNotifications()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    function onEsc(e) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications (${unreadCount} unread)`}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F0E7D5] text-[#6B5744] transition-colors"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#FAF6EE]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[340px] max-w-[92vw] max-h-[70vh] bg-white border border-[#E8DDC8] rounded-2xl shadow-warm-lg overflow-hidden z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8DDC8]">
            <div>
              <p className="font-display font-semibold text-ink text-sm">Notifications</p>
              <p className="text-[11px] text-[#8B7355]">
                {unreadCount > 0 ? `${unreadCount} unread` : 'You\'re all caught up'}
              </p>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-1">
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-semibold text-accent hover:text-accent-dark px-2 py-1 rounded"
                  title="Mark all as read"
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => { if (confirm('Clear all notifications?')) clearAll() }}
                  className="text-[11px] font-semibold text-[#8B7355] hover:text-ink px-2 py-1 rounded"
                  title="Clear all"
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#F0E7D5] flex items-center justify-center mx-auto mb-3">
                  <Bell size={20} className="text-[#A89880]" />
                </div>
                <p className="font-semibold text-sm text-ink">No notifications yet</p>
                <p className="text-xs text-[#8B7355] mt-0.5 px-6">When brands drop new products or events, you'll hear it here.</p>
              </div>
            )}

            {notifications.map((n) => {
              const Icon = KIND_ICON[n.kind] ?? Bell
              const meta = NOTIFICATION_KINDS[n.kind] ?? NOTIFICATION_KINDS.system
              const Cmp = n.url ? Link : 'div'
              const cmpProps = n.url ? { to: n.url } : {}
              return (
                <Cmp
                  key={n.id}
                  {...cmpProps}
                  onClick={() => {
                    if (!n.read_at) markRead(n.id)
                    if (n.url) setOpen(false)
                  }}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-[#F0E7D5] last:border-b-0 hover:bg-[#FAF6EE] transition-colors cursor-pointer ${!n.read_at ? 'bg-[#FDF9F1]' : ''}`}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-[#E8DDC8]"
                    style={{ backgroundColor: meta.accent + '15', color: meta.accent }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{n.title}</p>
                    {n.body && <p className="text-xs text-[#6B5744] mt-0.5 line-clamp-2">{n.body}</p>}
                    <p className="text-[10px] text-[#A89880] mt-1">{formatRelativeTime(n.created_at)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeNotification(n.id) }}
                    className="text-[#A89880] hover:text-ink flex-shrink-0 p-1"
                    aria-label="Remove"
                  >
                    <X size={13} />
                  </button>
                  {!n.read_at && (
                    <span className="w-1.5 h-1.5 bg-accent rounded-full absolute mt-2 right-8" />
                  )}
                </Cmp>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
