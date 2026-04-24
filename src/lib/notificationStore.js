// In-app notification center — localStorage-backed for now so it works
// without any backend wiring. When the Supabase `notifications` table
// exists (schema below), swap `readAll()` / `markRead()` to hit it instead;
// the rest of the codebase talks to this module, not directly to storage.
//
//   -- schema.sql (future):
//   create table notifications (
//     id uuid primary key default gen_random_uuid(),
//     user_id uuid references auth.users not null,
//     kind text not null,              -- 'drop' | 'event' | 'follow' | 'order' | 'system'
//     title text not null,
//     body text,
//     url text,                        -- deep link
//     read_at timestamptz,
//     created_at timestamptz default now()
//   );
//   create index on notifications(user_id, created_at desc);
//   -- RLS: user can read + update their own rows only.
//
// Delivery model:
//   - In-app (this file): always on.
//   - Email: Supabase auth emails for magic link / reset already work;
//     for transactional ("your drop is live") use a Supabase Edge Function
//     + Resend or AWS SES. Not built here — captured as a follow-up.
//   - SMS: Twilio, out of scope until the app has a revenue reason.
//   - Push: FCM web push, out of scope until we have a service worker.

const KEY = 'kita_notifications'
const MAX = 100
const listeners = new Set()

// Kinds come with a default icon + accent; keeps UI consistent without
// hardcoding strings everywhere.
export const NOTIFICATION_KINDS = {
  drop:   { icon: 'ShoppingBag',  accent: '#D94545', label: 'Drop' },
  event:  { icon: 'Calendar',     accent: '#C15E2E', label: 'Event' },
  follow: { icon: 'UserPlus',     accent: '#6B5744', label: 'Follow' },
  order:  { icon: 'Package',      accent: '#1A1513', label: 'Order' },
  system: { icon: 'Bell',         accent: '#8B7355', label: 'KitaKakis' },
}

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch { return [] }
}

function writeAll(list) {
  // Cap list so localStorage never balloons; oldest first out.
  const capped = list.slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(capped))
  listeners.forEach((fn) => { try { fn(capped) } catch {} })
  // Cross-tab sync: storage events fire in OTHER tabs only, so emit a
  // same-tab custom event so our useNotifications hook sees the update
  // in the tab that fired it too.
  window.dispatchEvent(new CustomEvent('kita:notifications'))
}

export function pushNotification({ kind = 'system', title, body = '', url = null }) {
  if (!title) return
  if (!NOTIFICATION_KINDS[kind]) kind = 'system'
  const all = readAll()
  const entry = {
    id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    kind, title, body, url,
    created_at: new Date().toISOString(),
    read_at: null,
  }
  writeAll([entry, ...all])
  return entry
}

export function markRead(id) {
  const all = readAll().map((n) => n.id === id ? { ...n, read_at: n.read_at ?? new Date().toISOString() } : n)
  writeAll(all)
}

export function markAllRead() {
  const now = new Date().toISOString()
  const all = readAll().map((n) => n.read_at ? n : { ...n, read_at: now })
  writeAll(all)
}

export function removeNotification(id) {
  writeAll(readAll().filter((n) => n.id !== id))
}

export function clearAll() { writeAll([]) }

export function getAll() { return readAll() }
export function getUnreadCount() { return readAll().filter((n) => !n.read_at).length }

// React hook. Subscribes to storage + custom event so the bell badge
// updates live whether the change came from the same tab or another.
import { useEffect, useState } from 'react'

export function useNotifications() {
  const [list, setList] = useState(readAll)

  useEffect(() => {
    const onChange = () => setList(readAll())
    listeners.add(onChange)
    window.addEventListener('storage', onChange)
    window.addEventListener('kita:notifications', onChange)
    return () => {
      listeners.delete(onChange)
      window.removeEventListener('storage', onChange)
      window.removeEventListener('kita:notifications', onChange)
    }
  }, [])

  return {
    notifications: list,
    unreadCount: list.filter((n) => !n.read_at).length,
    markRead, markAllRead, removeNotification, clearAll,
  }
}
