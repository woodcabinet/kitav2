import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowLeft, TrendingUp, Coffee, Sparkles, MapPin, Calendar, ShoppingBag, Users, MessageCircle } from 'lucide-react'
import {
  MOCK_BRANDS, MOCK_POSTS, MOCK_EVENTS, MOCK_DROPS, MOCK_PRODUCTS, MOCK_THREADS
} from '../../data/mockData'
import { formatRelativeTime, formatCurrency, formatNumber } from '../../lib/utils'

// ═══════════════════════════ Fuzzy scoring ═══════════════════════════
// Simple weighted substring match — bumps exact prefix matches,
// allows multi-word queries (splits on space, all words must hit).
function score(haystack, needle) {
  if (!haystack || !needle) return 0
  const h = String(haystack).toLowerCase()
  const n = needle.toLowerCase().trim()
  if (!n) return 0
  const words = n.split(/\s+/).filter(Boolean)
  let total = 0
  for (const w of words) {
    const idx = h.indexOf(w)
    if (idx === -1) return 0
    // Exact prefix = big bonus, start of word = medium, inner = small
    if (idx === 0) total += 10
    else if (h[idx - 1] === ' ') total += 5
    else total += 2
    // Length match ratio
    total += (w.length / h.length) * 3
  }
  return total
}

// Unified search across every dataset
function useSearch(query) {
  return useMemo(() => {
    const q = query.trim()
    if (q.length < 1) return { brands: [], posts: [], events: [], drops: [], products: [], threads: [], total: 0 }

    const brands = MOCK_BRANDS
      .map(b => ({ item: b, s: score(b.name, q) * 2 + score(b.tagline, q) + score(b.description, q) * 0.5 + score(b.location || '', q) * 0.5 }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 10).map(x => x.item)

    const posts = MOCK_POSTS
      .map(p => ({ item: p, s: score(p.content, q) + score(p.brand?.name, q) }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 10).map(x => x.item)

    const events = MOCK_EVENTS
      .map(e => ({ item: e, s: score(e.title, q) * 2 + score(e.description, q) + score(e.venue_name, q) + score(e.address, q) + score(e.brand?.name, q) }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 10).map(x => x.item)

    const drops = MOCK_DROPS
      .map(d => ({ item: d, s: score(d.title, q) * 2 + score(d.description, q) + score(d.brand?.name, q) }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 10).map(x => x.item)

    const products = MOCK_PRODUCTS
      .map(p => ({ item: p, s: score(p.name, q) * 2 + score(p.brand?.name, q) + score(p.category || '', q) }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 16).map(x => x.item)

    const threads = MOCK_THREADS
      .map(t => ({ item: t, s: score(t.content, q) + score(t.author?.display_name, q) + score((t.tags || []).join(' '), q) }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 8).map(x => x.item)

    const total = brands.length + posts.length + events.length + drops.length + products.length + threads.length
    return { brands, posts, events, drops, products, threads, total }
  }, [query])
}

// ═══════════════════════════ Suggestions ═══════════════════════════
const TRENDING_QUERIES = [
  'vintage', 'streetwear', 'thrift', 'batik', 'heritage', 'haji lane', 'pop-up', 'workshop'
]

const RECENT_KEY = 'kk_recent_searches'
function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
}
function saveRecent(q) {
  if (!q || q.length < 2) return
  const prev = loadRecent().filter(x => x.toLowerCase() !== q.toLowerCase())
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, 6)))
}

// ═══════════════════════════ The Page ═══════════════════════════
export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const initialQ = params.get('q') || ''
  const [query, setQuery] = useState(initialQ)
  const [debounced, setDebounced] = useState(initialQ)
  const [activeTab, setActiveTab] = useState('all')
  const [recent, setRecent] = useState(loadRecent)
  const inputRef = useRef(null)

  // Debounce query → searchable state (250ms)
  useEffect(() => {
    const tid = setTimeout(() => setDebounced(query), 250)
    return () => clearTimeout(tid)
  }, [query])

  // Sync query to URL so links are shareable
  useEffect(() => {
    if (debounced) setParams({ q: debounced }, { replace: true })
    else setParams({}, { replace: true })
  }, [debounced, setParams])

  // Save to recent when user settles on a query for 1.5s
  useEffect(() => {
    if (!debounced) return
    const tid = setTimeout(() => {
      saveRecent(debounced)
      setRecent(loadRecent())
    }, 1500)
    return () => clearTimeout(tid)
  }, [debounced])

  useEffect(() => { inputRef.current?.focus() }, [])

  const results = useSearch(debounced)

  const TABS = [
    { id: 'all', label: 'All', count: results.total },
    { id: 'brands', label: 'Brands', count: results.brands.length },
    { id: 'products', label: 'Products', count: results.products.length },
    { id: 'events', label: 'Events', count: results.events.length },
    { id: 'drops', label: 'Drops', count: results.drops.length },
    { id: 'posts', label: 'Posts', count: results.posts.length },
    { id: 'threads', label: 'Threads', count: results.threads.length },
  ]

  const showEmpty = !debounced.trim()
  const showNoResults = debounced.trim() && results.total === 0

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Search bar */}
      <div className="sticky top-0 z-30 bg-cream-light/95 backdrop-blur-md border-b border-[#E8DDC8]">
        <div className="flex items-center gap-2 px-3 py-3">
          <Link to="/" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F0E7D5] text-[#1A1513] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B7355]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brands, events, products…"
              className="w-full pl-11 pr-11 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#E8DDC8] text-[15px] text-[#1A1513] placeholder:text-[#A89880] focus:outline-none focus:border-accent focus:bg-white transition-all font-body"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F0E7D5] text-[#8B7355]"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Tab pills — only shown when there's a query */}
        {debounced && results.total > 0 && (
          <div className="flex gap-2 px-3 pb-3 overflow-x-auto scrollbar-hide">
            {TABS.filter(t => t.count > 0 || t.id === 'all').map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                  activeTab === t.id
                    ? 'bg-[#1A1513] text-cream'
                    : 'bg-[#FAF6EE] text-[#6B5744] hover:bg-[#F0E7D5]'
                }`}
              >
                {t.label} <span className="opacity-60">{t.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-4 pb-24">
        <AnimatePresence mode="wait">
          {showEmpty && (
            <EmptyState key="empty" recent={recent} onPick={(q) => setQuery(q)} clearRecent={() => { localStorage.removeItem(RECENT_KEY); setRecent([]) }} />
          )}
          {showNoResults && <NoResults key="none" query={debounced} />}
          {debounced && results.total > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {(activeTab === 'all' || activeTab === 'brands') && results.brands.length > 0 && (
                <Section icon={<Users size={16} />} title="Brands" subtitle="Local SG makers">
                  <div className="space-y-2">
                    {results.brands.map(b => <BrandRow key={b.id} brand={b} />)}
                  </div>
                </Section>
              )}

              {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
                <Section icon={<ShoppingBag size={16} />} title="Products" subtitle="Shop from local stores">
                  <div className="grid grid-cols-2 gap-3">
                    {results.products.slice(0, activeTab === 'products' ? 16 : 6).map(p => <ProductTile key={p.id} product={p} />)}
                  </div>
                </Section>
              )}

              {(activeTab === 'all' || activeTab === 'events') && results.events.length > 0 && (
                <Section icon={<Calendar size={16} />} title="Events" subtitle="What's happening">
                  <div className="space-y-2">
                    {results.events.map(e => <EventRow key={e.id} event={e} />)}
                  </div>
                </Section>
              )}

              {(activeTab === 'all' || activeTab === 'drops') && results.drops.length > 0 && (
                <Section icon={<Sparkles size={16} />} title="Drops" subtitle="Limited releases">
                  <div className="space-y-2">
                    {results.drops.map(d => <DropRow key={d.id} drop={d} />)}
                  </div>
                </Section>
              )}

              {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                <Section icon={<TrendingUp size={16} />} title="Posts">
                  <div className="space-y-2">
                    {results.posts.map(p => <PostRow key={p.id} post={p} />)}
                  </div>
                </Section>
              )}

              {(activeTab === 'all' || activeTab === 'threads') && results.threads.length > 0 && (
                <Section icon={<MessageCircle size={16} />} title="Threads">
                  <div className="space-y-2">
                    {results.threads.map(t => <ThreadRow key={t.id} thread={t} />)}
                  </div>
                </Section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ═══════════════════════════ Empty & No-results ═══════════════════════════
function EmptyState({ recent, onPick, clearRecent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-2"
    >
      <div className="paper-card rounded-3xl p-6 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          className="inline-flex w-14 h-14 rounded-2xl bg-accent/10 items-center justify-center mb-3"
        >
          <Coffee size={26} className="text-accent" />
        </motion.div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-1">What you looking for?</h2>
        <p className="text-sm text-[#6B5744]">Brands, products, events, drops — we got you.</p>
      </div>

      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8B7355]">Recent</span>
            <button onClick={clearRecent} className="text-xs text-[#8B7355] hover:text-accent">Clear</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map(r => (
              <button
                key={r}
                onClick={() => onPick(r)}
                className="px-3 py-1.5 rounded-full bg-[#FAF6EE] text-[#6B5744] text-sm border border-[#E8DDC8] hover:bg-white hover:border-accent hover:text-accent transition-colors"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <TrendingUp size={14} className="text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8B7355]">Trending</span>
        </div>
        <div className="flex flex-wrap gap-2 stagger-in">
          {TRENDING_QUERIES.map(q => (
            <button
              key={q}
              onClick={() => onPick(q)}
              className="px-3 py-1.5 rounded-full bg-white text-[#1A1513] text-sm font-medium shadow-warm border border-[#E8DDC8] hover:bg-accent hover:text-white hover:border-accent transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Sparkles size={14} className="text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8B7355]">Featured Brands</span>
        </div>
        <div className="grid grid-cols-2 gap-2 stagger-in">
          {MOCK_BRANDS.slice(0, 6).map(b => (
            <Link
              key={b.id}
              to={`/brand/${b.slug}`}
              className="paper-card rounded-2xl p-3 flex items-center gap-2 hover:shadow-warm-lg transition-shadow"
            >
              <img src={b.logo_url} alt={b.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-ink truncate">{b.name}</p>
                <p className="text-[11px] text-[#8B7355] truncate">{b.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function NoResults({ query }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="paper-card rounded-3xl p-8 text-center mt-4"
    >
      <div className="inline-flex w-14 h-14 rounded-2xl bg-[#F0E7D5] items-center justify-center mb-3">
        <Coffee size={26} className="text-[#8B7355]" />
      </div>
      <h3 className="font-display text-xl font-semibold text-ink mb-1">No match for "{query}"</h3>
      <p className="text-sm text-[#6B5744]">Try shorter words — or browse <Link to="/discover" className="text-accent font-semibold underline-dotted">all brands</Link>.</p>
    </motion.div>
  )
}

// ═══════════════════════════ Section wrapper ═══════════════════════════
function Section({ icon, title, subtitle, children }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-accent">{icon}</span>
          <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        </div>
        {subtitle && <span className="text-[11px] text-[#8B7355] font-hand text-base">{subtitle}</span>}
      </div>
      {children}
    </section>
  )
}

// ═══════════════════════════ Row / tile components ═══════════════════════════
function BrandRow({ brand }) {
  return (
    <Link to={`/brand/${brand.slug}`} className="paper-card rounded-2xl p-3 flex items-center gap-3 hover:shadow-warm-lg transition-all group">
      <img src={brand.logo_url} alt={brand.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 ring-1 ring-[#E8DDC8]" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-[15px] text-ink truncate group-hover:text-accent transition-colors">{brand.name}</p>
          {brand.verified && <span className="text-accent text-xs">✓</span>}
        </div>
        <p className="text-[13px] text-[#6B5744] truncate">{brand.tagline}</p>
        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#8B7355]">
          <span className="flex items-center gap-0.5"><MapPin size={11} /> {brand.location}</span>
          {brand.follower_count != null && (
            <>
              <span>·</span>
              <span>{formatNumber(brand.follower_count)} followers</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

function ProductTile({ product }) {
  return (
    <Link to={`/brand/${product.brand?.slug || ''}`} className="paper-card rounded-2xl overflow-hidden hover:shadow-warm-lg transition-all group">
      <div className="aspect-square bg-[#F0E7D5] overflow-hidden">
        <img src={product.images?.[0] || product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-2.5">
        <p className="text-[11px] text-[#8B7355] truncate">{product.brand?.name}</p>
        <p className="font-semibold text-[13px] text-ink truncate leading-tight mt-0.5">{product.name}</p>
        <p className="font-display text-sm text-accent font-semibold mt-1">{formatCurrency(product.price)}</p>
      </div>
    </Link>
  )
}

function EventRow({ event }) {
  const date = event.starts_at ? new Date(event.starts_at) : null
  return (
    <Link to="/discover" className="paper-card rounded-2xl overflow-hidden flex gap-3 hover:shadow-warm-lg transition-all group">
      {event.cover_url && (
        <div className="w-24 h-24 flex-shrink-0 bg-[#F0E7D5] overflow-hidden">
          <img src={event.cover_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="flex-1 min-w-0 py-2.5 pr-3">
        {date && <p className="text-[11px] font-bold uppercase text-accent tracking-wider">{date.toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' })}</p>}
        <p className="font-semibold text-[14px] text-ink truncate mt-0.5">{event.title}</p>
        <div className="flex items-center gap-1 mt-1 text-[11px] text-[#8B7355] truncate">
          <MapPin size={11} className="flex-shrink-0" /> {event.venue_name}
        </div>
        <p className="text-[12px] font-semibold text-ink mt-1">
          {event.is_free ? 'Free' : formatCurrency(event.ticket_price || 0)}
        </p>
      </div>
    </Link>
  )
}

function DropRow({ drop }) {
  return (
    <Link to="/discover" className="paper-card rounded-2xl overflow-hidden flex gap-3 hover:shadow-warm-lg transition-all group">
      {drop.cover_url && (
        <div className="w-24 h-24 flex-shrink-0 bg-[#F0E7D5] overflow-hidden relative">
          <img src={drop.cover_url} alt={drop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {drop.status === 'live' && <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-accent text-white text-[9px] font-bold animate-pulse">LIVE</span>}
        </div>
      )}
      <div className="flex-1 min-w-0 py-2.5 pr-3">
        <p className="text-[11px] text-[#8B7355] truncate">{drop.brand?.name}</p>
        <p className="font-semibold text-[14px] text-ink truncate mt-0.5">{drop.title}</p>
        <p className="text-[12px] text-[#6B5744] mt-0.5 line-clamp-2">{drop.description}</p>
      </div>
    </Link>
  )
}

function PostRow({ post }) {
  return (
    <div className="paper-card rounded-2xl p-3 flex gap-3">
      {post.media_urls?.[0] && (
        <img src={post.media_urls[0]} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {post.brand?.logo_url && <img src={post.brand.logo_url} alt="" className="w-4 h-4 rounded-full" />}
          <span className="text-[12px] font-semibold text-ink truncate">{post.brand?.name}</span>
          <span className="text-[10px] text-[#8B7355]">· {formatRelativeTime(post.published_at)}</span>
        </div>
        <p className="text-[13px] text-[#1A1513] line-clamp-2 mt-0.5">{post.content}</p>
      </div>
    </div>
  )
}

function ThreadRow({ thread }) {
  return (
    <Link to="/threads" className="paper-card rounded-2xl p-3 block hover:shadow-warm-lg transition-all">
      <div className="flex items-center gap-2 mb-1">
        <img src={thread.author?.avatar_url} alt="" className="w-6 h-6 rounded-full" />
        <span className="text-[12px] font-semibold text-ink">{thread.author?.display_name}</span>
        <span className="text-[11px] text-[#8B7355]">· {formatRelativeTime(thread.created_at)}</span>
      </div>
      <p className="text-[13px] text-[#1A1513] line-clamp-2">{thread.content}</p>
      {thread.tags?.length > 0 && (
        <div className="flex gap-1 mt-1.5">
          {thread.tags.slice(0, 3).map(t => <span key={t} className="text-[10px] text-accent">#{t}</span>)}
        </div>
      )}
    </Link>
  )
}
