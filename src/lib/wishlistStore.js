// Wishlist store — localStorage-backed, no auth required.
//
// Mirrors the followStore pattern: a flat list of product IDs, custom-event
// dispatch on write so `useWishlist()` subscribers update instantly across
// the same tab, plus the `storage` event for cross-tab sync.

import { useEffect, useState } from 'react'

const KEY = 'kita_wishlist'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function write(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids))
  window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: ids }))
}

export function getWishlist() { return read() }

export function isWishlisted(productId) {
  return read().includes(String(productId))
}

export function addToWishlist(product) {
  if (!product?.id) return read()
  const id = String(product.id)
  const ids = read()
  if (ids.includes(id)) return ids
  const next = [...ids, id]
  write(next)
  return next
}

export function removeFromWishlist(productId) {
  const id = String(productId)
  const next = read().filter(x => x !== id)
  write(next)
  return next
}

export function toggleWishlist(product) {
  return isWishlisted(product?.id)
    ? removeFromWishlist(product?.id)
    : addToWishlist(product)
}

export function useWishlist() {
  const [ids, setIds] = useState(read)
  useEffect(() => {
    const on = (e) => setIds(e.detail ?? read())
    const onStorage = (e) => { if (e.key === KEY || e.key === null) setIds(read()) }
    window.addEventListener('wishlist:updated', on)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('wishlist:updated', on)
      window.removeEventListener('storage', onStorage)
    }
  }, [])
  return {
    ids,
    count: ids.length,
    isWishlisted: (productId) => ids.includes(String(productId)),
    add: addToWishlist,
    remove: removeFromWishlist,
    toggle: toggleWishlist,
  }
}
