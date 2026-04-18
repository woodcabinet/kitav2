import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Coffee, Heart } from 'lucide-react'
import { MOCK_PRODUCTS } from '../../data/mockData'
import { formatCurrency } from '../../lib/utils'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'arts_crafts', label: 'Arts & Crafts' },
  { id: 'home', label: 'Home' },
]

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 200)
    return () => clearTimeout(t)
  }, [searchInput])

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const byCat = activeCategory === 'all' || p.category === activeCategory
      if (!byCat) return false
      if (!debouncedSearch) return true
      const hay = `${p.name} ${p.brand?.name ?? ''} ${p.category}`.toLowerCase()
      return hay.includes(debouncedSearch)
    })
  }, [activeCategory, debouncedSearch])

  return (
    <div className="pb-20 bg-[#FAF6EE] min-h-screen paper-texture">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-1"
        >
          <Coffee size={22} className="text-accent animate-breathe" />
          <span className="font-hand text-accent text-lg">made with love 🧡</span>
        </motion.div>
        <h1 className="font-display text-4xl text-ink leading-tight">Shop local</h1>
        <p className="text-sm text-[#6B5744] mt-1">
          Handpicked from Singapore's independent makers. <span className="underline-dotted">Brewed fresh daily.</span>
        </p>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="search by name, brand, or vibe…"
            className="w-full paper-card rounded-2xl pl-11 pr-4 py-3 text-sm text-ink placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(cat => {
          const active = activeCategory === cat.id
          return (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileTap={{ scale: 0.94 }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                active
                  ? 'bg-ink text-cream shadow-warm'
                  : 'paper-card text-[#6B5744] hover:text-ink'
              }`}
            >
              {cat.label}
            </motion.button>
          )
        })}
      </div>

      {/* Tiny accent label */}
      <div className="px-4 mb-3 flex items-center gap-2">
        <span className="font-hand text-accent text-base">fresh today</span>
        <span className="text-[#C4B49A]">·</span>
        <span className="text-xs text-[#8B7355]">{filtered.length} pieces</span>
      </div>

      {/* Products grid */}
      <motion.div layout className="px-4 grid grid-cols-2 gap-3 stagger-in">
        <AnimatePresence mode="popLayout">
          {filtered.map(product => {
            const img = product.images?.[0]
            const stock = product.stock ?? 0
            const outOfStock = stock === 0 && !product.drop_at
            const lowStock = stock > 0 && stock <= 3

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="paper-card rounded-2xl overflow-hidden group hover:shadow-warm-lg transition-shadow"
              >
                <Link to={`/brand/${product.brand?.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-cream">
                    {img ? (
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#C4B49A]">
                        <Coffee size={36} />
                      </div>
                    )}

                    {/* Stock badge */}
                    <div className="absolute top-2 right-2">
                      {outOfStock ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8DDC8] text-[#8B7355]">
                          sold out
                        </span>
                      ) : lowStock ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-cream animate-pulse">
                          only {stock} left
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-wide text-[#8B7355] truncate">
                      {product.brand?.name}
                    </p>
                    <p className="font-semibold text-sm text-ink line-clamp-2 mt-0.5 leading-snug">
                      {product.name}
                    </p>
                    <p className="font-display text-lg text-accent mt-1">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-4 mt-6 paper-card rounded-3xl p-8 text-center"
        >
          <Coffee size={36} className="text-[#C4B49A] mx-auto mb-3 animate-breathe" />
          <p className="font-display text-xl text-ink">Nothing brewing here yet</p>
          <p className="text-sm text-[#6B5744] mt-1">Try another corner of the shop.</p>
        </motion.div>
      )}

      {/* Help us find more */}
      <div className="px-4 mt-8">
        <div className="paper-card rounded-3xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Heart size={20} className="text-accent animate-breathe" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-hand text-accent text-base leading-none">know a gem?</p>
            <p className="font-display text-lg text-ink leading-tight mt-1">Help us find more</p>
            <p className="text-xs text-[#6B5744] mt-1">Point us to your favourite local maker.</p>
          </div>
          <Link
            to="/discover"
            className="flex-shrink-0 px-4 py-2 bg-accent hover:bg-accent-dark text-cream text-sm font-semibold rounded-2xl shadow-warm transition-colors hover-wiggle"
          >
            Discover
          </Link>
        </div>
      </div>
    </div>
  )
}
