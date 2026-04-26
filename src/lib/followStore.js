// Brand-follow store — localStorage-backed, no auth required.
//
// Mirrors the cartStore pattern: a flat list of brand IDs, custom-event
// dispatch on write so `useFollows()` subscribers update instantly across
// the same tab, plus the `storage` event for cross-tab sync.
//
// Why localStorage and not Supabase? Following is a low-stakes, high-frequency
// gesture. Doing it in localStorage means anonymous browsers can still
// curate their feed; the data can be migrated to a `follows` table on
// sign-up later by reading this key and bulk-inserting.

import { useEffect, useState } from 'react'
import { pushNotification } from './notificationStore'

const KEY = 'kita_follows'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function write(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids))
  window.dispatchEvent(new CustomEvent('follows:updated', { detail: ids }))
}

export function getFollows() { return read() }

export function isFollowing(brandId) {
  return read().includes(String(brandId))
}

export function followBrand(brand) {
  if (!brand?.id) return read()
  const id = String(brand.id)
  const ids = read()
  if (ids.includes(id)) return ids
  const next = [...ids, id]
  write(next)
  pushNotification({
    kind: 'follow',
    title: `Following ${brand.name ?? 'brand'}`,
    body: 'You\'ll see their posts and drops first.',
    url: brand.slug ? `/brand/${brand.slug}` : '/',
  })
  return next
}

export function unfollowBrand(brandId) {
  const id = String(brandId)
  const next = read().filter(x => x !== id)
  write(next)
  return next
}

export function toggleFollow(brand) {
  return isFollowing(brand?.id) ? unfollowBrand(brand?.id) : followBrand(brand)
}

export function useFollows() {
  const [ids, setIds] = useState(read)
  useEffect(() => {
    const on = (e) => setIds(e.detail ?? read())
    const onStorage = (e) => { if (e.key === KEY || e.key === null) setIds(read()) }
    window.addEventListener('follows:updated', on)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('follows:updated', on)
      window.removeEventListener('storage', onStorage)
    }
  }, [])
  return {
    ids,
    count: ids.length,
    isFollowing: (brandId) => ids.includes(String(brandId)),
    follow: followBrand,
    unfollow: unfollowBrand,
    toggle: toggleFollow,
  }
}
