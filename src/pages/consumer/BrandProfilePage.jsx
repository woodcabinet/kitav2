import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, MapPin, Share2, Heart, Coffee, Grid3X3, ShoppingBag, Calendar, Zap } from 'lucide-react'
import { MOCK_BRANDS, MOCK_POSTS, MOCK_EVENTS, MOCK_PRODUCTS, MOCK_DROPS } from '../../data/mockData'
import { PostCard } from '../../components/consumer/PostCard'
import { ProductCard } from '../../components/consumer/ProductCard'
import { EventCard } from '../../components/consumer/EventCard'
import { DropCard } from '../../components/consumer/DropCard'
import { formatNumber } from '../../lib/utils'
import { useFollows } from '../../lib/followStore'

const SAVED_KEY = 'kk_saved_brands'

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]')
  } catch {
    return []
  }
}

export default function BrandProfilePage() {
  const { slug } = useParams()
  const brand = MOCK_BRANDS.find(b => b.slug === slug)
  const [activeTab, setActiveTab] = useState('posts')
  const follows = useFollows()
  const followed = brand ? follows.isFollowing(brand.id) : false
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!brand) return
    setSaved(readSaved().includes(brand.id))
  }, [brand])

  function toggleSave() {
    if (!brand) return
    const list = readSaved()
    const next = list.includes(brand.id) ? list.filter(x => x !== brand.id) : [...list, brand.id]
    localStorage.setItem(SAVED_KEY, JSON.stringify(next))
    setSaved(next.includes(brand.id))
  }

  if (!brand) {
    return (
      <div className="pb-20 min-h-screen bg-[#FAF6EE] paper-texture flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="paper-card rounded-3xl p-8 text-center max-w-sm w-full"
        >
          <Coffee size={36} className="text-[#C4B49A] mx-auto mb-3 animate-breathe" />
          <p className="font-hand text-accent text-lg">oops</p>
          <h2 className="font-display text-2xl text-ink mt-1">Brand not found</h2>
          <p className="text-sm text-[#6B5744] mt-2">This shop hasn't opened its doors here yet.</p>
          <Link
            to="/shop"
            className="inline-block mt-5 px-5 py-2.5 bg-accent hover:bg-accent-dark text-cream text-sm font-semibold rounded-2xl shadow-warm transition-colors"
          >
            Back to shop
          </Link>
        </motion.div>
      </div>
    )
  }

  const brandPosts = MOCK_POSTS.filter(p => p.brand_id === brand.id)
  const brandProducts = MOCK_PRODUCTS.filter(p => p.brand_id === brand.id)
  const brandEvents = MOCK_EVENTS.filter(e => e.brand_id === brand.id)
  const brandDrops = MOCK_DROPS.filter(d => d.brand_id === brand.id)

  const TABS = [
    { id: 'posts', label: 'Posts', icon: Grid3X3, count: brandPosts.length },
    { id: 'products', label: 'Products', icon: ShoppingBag, count: brandProducts.length },
    { id: 'events', label: 'Events', icon: Calendar, count: brandEvents.length },
    { id: 'drops', label: 'Drops', icon: Zap, count: brandDrops.length },
  ]

  return (
    <div className="pb-20 min-h-screen bg-[#FAF6EE] paper-texture">
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        {brand.banner_url ? (
          <img src={brand.banner_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#C4B49A] to-[#E8DDD1]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <button className="absolute top-4 right-4 w-10 h-10 bg-cream/90 backdrop-blur rounded-2xl flex items-center justify-center text-ink shadow-warm hover-wiggle">
          <Share2 size={16} />
        </button>
      </div>

      {/* Logo + header */}
      <div className="px-4 -mt-12 mb-4">
        <div className="flex items-end justify-between mb-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-[#FAF6EE] shadow-warm-lg bg-cream"
          >
            <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
          </motion.div>

          <div className="flex gap-2 mb-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleSave}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors shadow-warm ${
                saved ? 'bg-accent text-cream' : 'paper-card text-[#6B5744]'
              }`}
              aria-label="Save"
            >
              <motion.span
                key={saved ? 'on' : 'off'}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 14 }}
              >
                <Heart size={16} className={saved ? 'fill-current' : ''} />
              </motion.span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => follows.toggle(brand)}
              className={`inline-flex items-center justify-center px-6 py-2.5 rounded-2xl text-sm font-semibold transition-colors shadow-warm ${
                followed
                  ? 'paper-card text-[#6B5744]'
                  : 'bg-accent hover:bg-accent-dark text-cream animate-breathe'
              }`}
              aria-pressed={followed}
            >
              {followed ? 'Following' : 'Follow'}
            </motion.button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-display text-3xl text-ink leading-tight">{brand.name}</h1>
          {brand.verified && <CheckCircle size={18} className="text-accent" />}
        </div>
        <p className="font-hand text-accent text-xl leading-tight mb-2">{brand.tagline}</p>
        <div className="flex items-center gap-1.5 text-[#6B5744] mb-4">
          <MapPin size={13} />
          <span className="text-sm">{brand.location}</span>
          {brand.follower_count != null && (
            <>
              <span className="text-[#C4B49A]">·</span>
              <span className="text-sm">{formatNumber(brand.follower_count)} followers</span>
            </>
          )}
        </div>

        {/* Stat pills — skip Followers pill when unverified; replaces with
            a subtle "Verify via IG" cue so the grid stays balanced */}
        <div className="grid grid-cols-3 gap-2">
          {[
            brand.follower_count != null
              ? { label: 'Followers', value: formatNumber(brand.follower_count) }
              : { label: 'Verified via', value: '—' },
            { label: 'Products', value: brandProducts.length },
            { label: 'Events', value: brandEvents.length },
          ].map(s => (
            <div key={s.label} className="paper-card rounded-2xl py-3 text-center">
              <p className="font-display text-xl text-ink leading-none">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wide text-[#8B7355] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map(({ id, label, icon: Icon, count }) => {
            const active = activeTab === id
            return (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  active ? 'bg-ink text-cream shadow-warm' : 'paper-card text-[#6B5744]'
                }`}
              >
                <Icon size={13} />
                {label}
                {count > 0 && <span className="opacity-70">({count})</span>}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'posts' && (
              brandPosts.length > 0 ? (
                <div className="space-y-4">
                  {brandPosts.map(post => (
                    <div key={post.id} className="paper-card rounded-3xl overflow-hidden">
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              ) : <EmptyState message="No posts brewing yet" />
            )}

            {activeTab === 'products' && (
              brandProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {brandProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : <EmptyState message="Shelves are empty for now" />
            )}

            {activeTab === 'events' && (
              brandEvents.length > 0 ? (
                <div className="space-y-4">
                  {brandEvents.map(e => <EventCard key={e.id} event={e} />)}
                </div>
              ) : <EmptyState message="No events on the calendar" />
            )}

            {activeTab === 'drops' && (
              brandDrops.length > 0 ? (
                <div className="space-y-4">
                  {brandDrops.map(d => <DropCard key={d.id} drop={d} />)}
                </div>
              ) : <EmptyState message="No drops in the oven" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="paper-card rounded-3xl p-8 text-center">
      <Coffee size={32} className="text-[#C4B49A] mx-auto mb-3 animate-breathe" />
      <p className="font-hand text-accent text-lg">brewing soon</p>
      <p className="font-display text-lg text-ink mt-1">{message}</p>
      <p className="text-xs text-[#6B5744] mt-1">Check back in a bit.</p>
    </div>
  )
}
