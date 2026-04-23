import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react'
import { formatCurrency, formatDate } from '../../lib/utils'

// Orders are stored in localStorage under `kita_orders` so checkout (when
// wired up) and this page stay in sync without a backend dependency.
const KEY = 'kita_orders'

function readOrders() {
  try {
    const raw = localStorage.getItem(KEY)
    const list = raw ? JSON.parse(raw) : []
    if (Array.isArray(list) && list.length) return list
  } catch {}
  // Seeded sample so the page isn't a blank wall for first-time users.
  return [
    {
      id: 'KK-20260418-8412',
      placed_at: '2026-04-18T14:22:00+08:00',
      status: 'delivered',
      items: [
        { name: 'The Askew Shirt', qty: 1, price: 45, brand: 'Tonêff' },
        { name: 'Pinstripe Cap', qty: 1, price: 29, brand: 'Maroon' },
      ],
      subtotal: 74, shipping: 4.50, total: 78.50,
    },
    {
      id: 'KK-20260412-3097',
      placed_at: '2026-04-12T09:10:00+08:00',
      status: 'shipped',
      items: [
        { name: 'The Vortex Tee', qty: 2, price: 30, brand: 'Maroon' },
      ],
      subtotal: 60, shipping: 4.50, total: 64.50,
    },
    {
      id: 'KK-20260405-5521',
      placed_at: '2026-04-05T18:02:00+08:00',
      status: 'processing',
      items: [
        { name: 'Koyoyu Diamond Zip-Up Hoodie', qty: 1, price: 88.88, brand: 'Koyoyu' },
      ],
      subtotal: 88.88, shipping: 4.50, total: 93.38,
    },
  ]
}

const STATUS_META = {
  processing: { label: 'Processing',  Icon: Clock,       color: 'bg-amber-100 text-amber-700' },
  shipped:    { label: 'Shipped',     Icon: Truck,       color: 'bg-blue-100 text-blue-700' },
  delivered:  { label: 'Delivered',   Icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Cancelled',   Icon: Package,     color: 'bg-gray-100 text-gray-600' },
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  useEffect(() => { setOrders(readOrders()) }, [])

  return (
    <div className="pb-24 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FAF6EE]/95 backdrop-blur border-b border-[#E8DDC8] px-4 py-3 flex items-center gap-3">
        <Link to="/profile" className="text-[#6B5744] hover:text-ink">
          <ChevronLeft size={22} />
        </Link>
        <div>
          <h1 className="font-display text-lg font-semibold text-ink leading-none">Order history</h1>
          <p className="text-[11px] text-[#8B7355] mt-1">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {orders.length === 0 && (
          <div className="paper-card rounded-2xl p-8 text-center">
            <Package size={28} className="text-[#A89880] mx-auto mb-2" />
            <p className="font-semibold text-ink">No orders yet</p>
            <p className="text-xs text-[#8B7355] mt-1">When you check out from local brands, orders appear here.</p>
            <Link to="/shop" className="inline-block mt-4 bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
              Browse the shop
            </Link>
          </div>
        )}

        {orders.map(order => {
          const meta = STATUS_META[order.status] ?? STATUS_META.processing
          const MIcon = meta.Icon
          return (
            <div key={order.id} className="paper-card rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-[#8B7355]">Order</p>
                  <p className="font-mono text-[13px] font-semibold text-ink">{order.id}</p>
                  <p className="text-[11px] text-[#8B7355] mt-0.5">{formatDate(order.placed_at, 'd MMM yyyy · h:mm a')}</p>
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
                  <MIcon size={12} /> {meta.label}
                </span>
              </div>

              <div className="border-t border-[#E8DDC8] pt-3 space-y-1.5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="min-w-0 pr-3">
                      <p className="text-ink truncate">
                        <span className="text-[#8B7355]">{item.qty}×</span> {item.name}
                      </p>
                      {item.brand && <p className="text-[11px] text-[#8B7355]">{item.brand}</p>}
                    </div>
                    <p className="text-ink font-semibold flex-shrink-0">{formatCurrency(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E8DDC8] mt-3 pt-3 flex items-center justify-between">
                <div className="text-[11px] text-[#8B7355]">
                  Subtotal {formatCurrency(order.subtotal)} · Shipping {formatCurrency(order.shipping)}
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#8B7355]">Total</p>
                  <p className="font-display font-semibold text-accent">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
