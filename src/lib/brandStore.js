// Persistent brand profile — localStorage-backed.
// Dashboard, StorePage, ContentPage all read from here.
// On MVP this is localStorage. In prod this wraps Supabase.

const KEY = 'my_brand'

export function saveBrandProfile(data) {
  if (!data) return
  const existing = getBrandProfile() ?? {}
  const merged = { ...existing, ...data, updated_at: new Date().toISOString() }
  localStorage.setItem(KEY, JSON.stringify(merged))
  // Fire a custom event so components re-render
  window.dispatchEvent(new CustomEvent('brand:updated', { detail: merged }))
  return merged
}

export function getBrandProfile() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function clearBrandProfile() {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new CustomEvent('brand:updated', { detail: null }))
}

// React hook for live updates
import { useEffect, useState } from 'react'
export function useBrandProfile() {
  const [profile, setProfile] = useState(getBrandProfile)
  useEffect(() => {
    const handler = (e) => setProfile(e.detail)
    window.addEventListener('brand:updated', handler)
    window.addEventListener('storage', () => setProfile(getBrandProfile()))
    return () => window.removeEventListener('brand:updated', handler)
  }, [])
  return [profile, saveBrandProfile, clearBrandProfile]
}
