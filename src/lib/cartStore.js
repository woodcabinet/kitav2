// Shopping cart — localStorage-backed, no auth required.
// Syncs across tabs via the `storage` event. Exposes a React hook so any
// component can subscribe to the live cart without prop drilling.
//
// Items are keyed by product.id. Quantity increments on re-add.

import { useEffect, useState } from 'react'
import { pushNotification } from './notificationStore'

const KEY = 'kita_cart'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function write(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: items }))
}

export function getCart() { return read() }

export function addToCart(product, qty = 1) {
  const items = read()
  const i = items.findIndex(x => x.id === product.id)
  const isNew = i < 0
  if (!isNew) {
    items[i] = { ...items[i], qty: (items[i].qty ?? 1) + qty }
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? null,
      brand: product.brand?.name ?? product.brand_name ?? null,
      brand_slug: product.brand?.slug ?? null,
      qty,
    })
  }
  write(items)
  // Only notify on first add — repeated +1 would spam the bell.
  if (isNew) {
    pushNotification({
      kind: 'order',
      title: 'Added to cart',
      body: `${product.name}${product.brand?.name ? ' · ' + product.brand.name : ''}`,
      url: '/shop',
    })
  }
  return items
}

export function removeFromCart(id) {
  write(read().filter(x => x.id !== id))
}

export function setQty(id, qty) {
  if (qty <= 0) return removeFromCart(id)
  const items = read().map(x => x.id === id ? { ...x, qty } : x)
  write(items)
}

export function clearCart() { write([]) }

export function cartTotals(items = read()) {
  const count = items.reduce((s, x) => s + (x.qty ?? 1), 0)
  const subtotal = items.reduce((s, x) => s + (x.price ?? 0) * (x.qty ?? 1), 0)
  return { count, subtotal }
}

export function useCart() {
  const [items, setItems] = useState(read)
  useEffect(() => {
    const on = (e) => setItems(e.detail ?? read())
    const onStorage = () => setItems(read())
    window.addEventListener('cart:updated', on)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('cart:updated', on)
      window.removeEventListener('storage', onStorage)
    }
  }, [])
  return { items, ...cartTotals(items), addToCart, removeFromCart, setQty, clearCart }
}
