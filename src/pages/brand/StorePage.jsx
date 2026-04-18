import { useState } from 'react'
import { Package, Plus, Zap, Edit2, Trash2, Eye, EyeOff, Search, MoreHorizontal, DollarSign, ShoppingBag, BarChart2, Clock, Flame } from 'lucide-react'
import { MOCK_PRODUCTS, MOCK_DROPS } from '../../data/mockData'
import { formatCurrency, formatDate, formatCountdown, formatNumber } from '../../lib/utils'
import { useBrandProfile } from '../../lib/brandStore'

const TABS = [
  { id: 'products', label: 'Products', icon: Package },
  { id: 'drops', label: 'Drops', icon: Zap },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
]

// ─── Mock orders ──────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 'o1', customer: 'Marcus T.', items: [{ name: 'Ethiopia Yirgacheffe 250g', qty: 2 }], total: 56, status: 'confirmed', date: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'o2', customer: 'Priya N.', items: [{ name: 'Ethiopia Yirgacheffe 250g', qty: 1 }], total: 28, status: 'shipped', date: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 'o3', customer: 'Jun W.', items: [{ name: 'Ethiopia Yirgacheffe 250g', qty: 3 }], total: 84, status: 'delivered', date: new Date(Date.now() - 72 * 3600000).toISOString() },
]

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

// ─── Products Tab ──────────────────────────────────────────

function ProductsTab() {
  const [query, setQuery] = useState('')
  const [brand, saveBrand] = useBrandProfile()
  const brandProducts = brand?.products ?? []
  // Use scraped products if brand onboarded, else fall back to demo data
  const allProducts = brandProducts.length > 0 ? brandProducts : MOCK_PRODUCTS
  const products = allProducts.filter(p =>
    !query || p.name.toLowerCase().includes(query.toLowerCase())
  )

  function removeProduct(id) {
    if (!brand) return
    saveBrand({ ...brand, products: brand.products.filter(p => p.id !== id) })
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Products', value: allProducts.length, icon: Package, color: 'bg-[#C4B49A]' },
          { label: 'In Stock', value: allProducts.filter(p => p.stock > 0).length, icon: Eye, color: 'bg-green-50' },
          { label: 'Revenue (MTD)', value: '$12,840', icon: DollarSign, color: 'bg-[#C4B49A]' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${color} rounded-xl flex items-center justify-center`}>
                <Icon size={16} className="text-[#D94545]" />
              </div>
            </div>
            <p className="text-xl font-bold text-ink">{value}</p>
            <p className="text-xs text-[#6B5744]">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Add */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF6EE] border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#D94545] hover:bg-[#a85225] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Product table */}
      <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8DDC8] text-xs text-[#6B5744] uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-semibold">Product</th>
              <th className="text-left px-4 py-3 font-semibold">Price</th>
              <th className="text-left px-4 py-3 font-semibold">Stock</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-right px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const isOutOfStock = product.stock === 0 && !product.unlimited_stock
              const isDrop = !!product.drop_at
              return (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm text-ink">{product.name}</p>
                          {isDrop && (
                            <span className="flex items-center gap-0.5 bg-[#D94545] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                              <Zap size={8} /> DROP
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#8B7355]">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-ink">{formatCurrency(product.price)}</span>
                      {product.compare_price && (
                        <span className="text-xs text-[#8B7355] line-through">{formatCurrency(product.compare_price)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : product.stock < 10 ? 'text-orange-500' : 'text-gray-700'}`}>
                      {isOutOfStock ? 'Out of stock' : `${product.stock} units`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isDrop ? (
                      <span className="text-xs font-semibold text-[#D94545] bg-[#C4B49A] px-2 py-1 rounded-lg">
                        Drop: {formatDate(product.drop_at, 'MMM d, h:mm a')}
                      </span>
                    ) : isOutOfStock ? (
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg">Sold Out</span>
                    ) : (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#8B7355] hover:text-[#6B5744]">
                        <Edit2 size={14} />
                      </button>
                      <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#8B7355] hover:text-[#6B5744]">
                        <BarChart2 size={14} />
                      </button>
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#8B7355] hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Drops Tab (create + manage drops) ─────────────────────

function DropsTab() {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Drops', value: MOCK_DROPS.length, icon: Zap },
          { label: 'Total Hype', value: formatNumber(MOCK_DROPS.reduce((s, d) => s + d.hype_count, 0)), icon: Flame },
          { label: 'Next Drop', value: 'In 3 days', icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-[#C4B49A] rounded-xl flex items-center justify-center">
                <Icon size={16} className="text-[#D94545]" />
              </div>
            </div>
            <p className="text-xl font-bold text-ink">{value}</p>
            <p className="text-xs text-[#6B5744]">{label}</p>
          </div>
        ))}
      </div>

      {/* Create drop */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-ink">Drop Schedule</h3>
        <button
          onClick={() => setShowCreate(s => !s)}
          className="flex items-center gap-2 bg-[#D94545] hover:bg-[#a85225] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Zap size={16} /> Create Drop
        </button>
      </div>

      {showCreate && (
        <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-5 mb-4">
          <h4 className="font-bold text-ink mb-4">New Drop</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Drop Name</label>
              <input type="text" placeholder="e.g. Summer Capsule Drop" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Drop Date & Time</label>
              <input type="datetime-local" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30" />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
            <textarea rows={3} placeholder="Describe the drop — build hype..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-[#D94545]/30" />
          </div>
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Cover Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#D94545] transition-colors cursor-pointer">
              <p className="text-2xl mb-1">📸</p>
              <p className="text-sm text-[#6B5744]">Drop + drag or click to upload</p>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Products in this Drop</label>
            <p className="text-xs text-[#8B7355] mb-2">Select existing products or add new ones to include in the drop.</p>
            <div className="space-y-2">
              {MOCK_PRODUCTS.slice(0, 3).map(p => (
                <label key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input type="checkbox" className="w-4 h-4 accent-[#D94545] rounded" />
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-[#8B7355]">{formatCurrency(p.price)} · {p.stock} in stock</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-[#D94545] hover:bg-[#a85225] text-white font-semibold py-2.5 rounded-xl transition-colors">
              Schedule Drop
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-[#6B5744] font-semibold hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Drop list */}
      <div className="space-y-3">
        {MOCK_DROPS.map(drop => {
          const countdown = formatCountdown(drop.drop_at)
          const isPast = new Date(drop.drop_at) < new Date()
          return (
            <div key={drop.id} className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-4 flex gap-4 hover:shadow-sm transition-shadow">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                {drop.cover_url && <img src={drop.cover_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-sm text-ink truncate">{drop.title}</h4>
                  {isPast ? (
                    <span className="text-[10px] font-semibold bg-gray-100 text-[#6B5744] px-2 py-0.5 rounded-full">Completed</span>
                  ) : countdown.live ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-[#D94545] text-white px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-[#FAF6EE] rounded-full animate-pulse" /> LIVE
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold bg-[#C4B49A] text-[#D94545] px-2 py-0.5 rounded-full">
                      In {countdown.days}d {countdown.hours}h
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B5744] line-clamp-1 mb-1.5">{drop.description}</p>
                <div className="flex items-center gap-4 text-xs text-[#8B7355]">
                  <span className="flex items-center gap-1"><Clock size={11} /> {formatDate(drop.drop_at, 'MMM d, h:mm a')}</span>
                  <span className="flex items-center gap-1"><Flame size={11} className="text-orange-400" /> {formatNumber(drop.hype_count)} hyped</span>
                </div>
              </div>
              <div className="flex items-start gap-1 flex-shrink-0">
                <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#8B7355]">
                  <Edit2 size={14} />
                </button>
                <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#8B7355]">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Orders Tab ────────────────────────────────────────────

function OrdersTab() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: MOCK_ORDERS.length, icon: ShoppingBag },
          { label: 'Revenue', value: formatCurrency(MOCK_ORDERS.reduce((s, o) => s + o.total, 0)), icon: DollarSign },
          { label: 'Pending', value: MOCK_ORDERS.filter(o => o.status === 'pending' || o.status === 'confirmed').length, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-4">
            <div className="w-8 h-8 bg-[#C4B49A] rounded-xl flex items-center justify-center mb-2">
              <Icon size={16} className="text-[#D94545]" />
            </div>
            <p className="text-xl font-bold text-ink">{value}</p>
            <p className="text-xs text-[#6B5744]">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8DDC8] text-xs text-[#6B5744] uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-semibold">Order</th>
              <th className="text-left px-4 py-3 font-semibold">Customer</th>
              <th className="text-left px-4 py-3 font-semibold">Items</th>
              <th className="text-left px-4 py-3 font-semibold">Total</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map(order => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-mono text-[#6B5744]">#{order.id.toUpperCase()}</td>
                <td className="px-4 py-3 text-sm text-ink font-medium">{order.customer}</td>
                <td className="px-4 py-3 text-sm text-[#6B5744]">
                  {order.items.map(i => `${i.name} × ${i.qty}`).join(', ')}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-ink">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg capitalize ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#8B7355]">{formatDate(order.date, 'MMM d, h:mm a')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stripe banner */}
      <div className="mt-4 bg-gradient-to-r from-[#1A1513] to-[#2D5A40] rounded-2xl p-5 text-white">
        <p className="font-bold text-sm mb-1">Payments via Stripe Connect</p>
        <p className="text-xs text-white/70 mb-3">All payments go directly to your Stripe account. Kitakakis takes a 2% platform fee.</p>
        <button className="bg-[#FAF6EE] text-[#1A1513] text-xs font-bold px-4 py-2 rounded-xl">Connect Stripe Account</button>
      </div>
    </div>
  )
}

// ─── Main Store Page ────────────────────────────────────────

export default function StorePage() {
  const [activeTab, setActiveTab] = useState('products')

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Store</h1>
          <p className="text-sm text-[#6B5744]">Manage products, schedule drops, track orders.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === id
                ? 'border-[#D94545] text-[#D94545]'
                : 'border-transparent text-[#8B7355] hover:text-[#6B5744]'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'products' && <ProductsTab />}
      {activeTab === 'drops' && <DropsTab />}
      {activeTab === 'orders' && <OrdersTab />}
    </div>
  )
}
