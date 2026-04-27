// Floating cart FAB + slide-out sheet.
//
// Lives at the root of ConsumerLayout so it's visible on every tab.
// Bottom-right on desktop, bottom-right above BottomNav on mobile.
// Hides itself on cart-checkout pages where a permanent cart is shown.

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, X, Minus, Plus, Trash2, Check } from 'lucide-react'
import { useCart, setQty, removeFromCart } from '../../lib/cartStore'
import { formatCurrency } from '../../lib/utils'

export function FloatingCart() {
  const { items, count, subtotal } = useCart()
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState(null) // { name, brand }
  const location = useLocation()

  // Listen for new-item-added events and flash a brief toast
  useEffect(() => {
    let timer
    const handler = (e) => {
      setToast(e.detail)
      clearTimeout(timer)
      timer = setTimeout(() => setToast(null), 2200)
    }
    window.addEventListener('cart:item-added', handler)
    return () => {
      window.removeEventListener('cart:item-added', handler)
      clearTimeout(timer)
    }
  }, [])

  // Hide on dedicated cart/checkout routes (future)
  if (/^\/(cart|checkout)/.test(location.pathname)) return null

  return (
    <>
      {/* "Added to cart" toast — pops above the FAB for 2 s */}
      <AnimatePresence>
        {toast && !open && (
          <motion.div
            key="cart-toast"
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="fixed z-40 bottom-[7.5rem] right-4 md:bottom-20 md:right-6 bg-ink text-cream rounded-2xl px-3.5 py-2.5 shadow-warm-lg flex items-center gap-2.5 max-w-[230px]"
          >
            <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Check size={13} strokeWidth={2.5} />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold truncate leading-tight">{toast.name}</p>
              {toast.brand && <p className="text-[10px] text-cream/60 truncate leading-tight">{toast.brand}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB — always visible on consumer screens so people know where the cart lives */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => setOpen(true)}
            className={`fixed z-40 bottom-24 right-4 md:bottom-6 md:right-6 rounded-full shadow-warm-lg flex items-center gap-2 transition-colors ${
              count > 0
                ? 'bg-accent hover:bg-accent-dark text-white pl-4 pr-5 py-3'
                : 'bg-white border border-[#E8DDC8] text-[#6B5744] hover:text-accent px-4 py-3'
            }`}
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <>
                <span className="text-sm font-semibold leading-none">{formatCurrency(subtotal)}</span>
                <span className="ml-0.5 min-w-[20px] h-5 px-1.5 bg-white/25 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Slide-out drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#FAF6EE] z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DDC8]">
                <div>
                  <h3 className="font-display text-xl text-ink">Your basket</h3>
                  <p className="text-xs text-[#8B7355]">{count} {count === 1 ? 'item' : 'items'}</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-xl hover:bg-[#F0E7D5] flex items-center justify-center"
                >
                  <X size={18} className="text-[#6B5744]" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-3 py-3">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-[#8B7355]">
                    <ShoppingBag size={36} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Your basket is empty</p>
                    <p className="text-xs mt-1">Browse the shop to add items</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3 paper-card rounded-2xl p-2.5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F0E7D5] flex-shrink-0">
                          {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          {item.brand && (
                            <p className="text-[10px] uppercase tracking-wide text-[#8B7355] truncate">{item.brand}</p>
                          )}
                          <p className="text-sm font-semibold text-ink line-clamp-2 leading-snug">{item.name}</p>
                          <p className="text-sm font-bold text-accent mt-1">{formatCurrency(item.price * item.qty)}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#C4B49A] hover:text-red-500 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="flex items-center gap-1 bg-white rounded-full border border-[#E8DDC8] px-1">
                            <button
                              onClick={() => setQty(item.id, item.qty - 1)}
                              className="w-5 h-5 flex items-center justify-center text-[#6B5744] hover:text-accent"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-semibold w-5 text-center">{item.qty}</span>
                            <button
                              onClick={() => setQty(item.id, item.qty + 1)}
                              className="w-5 h-5 flex items-center justify-center text-[#6B5744] hover:text-accent"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-[#E8DDC8] px-4 py-4 bg-white/70 backdrop-blur">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#6B5744]">Subtotal</span>
                    <span className="font-display text-xl text-ink">{formatCurrency(subtotal)}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center bg-accent hover:bg-accent-dark text-white font-semibold py-3.5 rounded-full shadow-warm transition-colors"
                  >
                    Checkout
                  </Link>
                  <p className="text-[11px] text-center text-[#8B7355] mt-2">
                    Secure checkout — powered by Stripe
                  </p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
