import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, X, SlidersHorizontal, Grid3X3, Zap, Calendar,
  Heart, CheckCircle, MapPin, Clock, Users, Flame, CalendarPlus,
  MessageCircle, ExternalLink, Check, Gift
} from 'lucide-react'
import { Avatar } from '../../components/shared/Avatar'
import { CategoryBadge, PlatformBadge } from '../../components/shared/Badge'
import { EventMap } from '../../components/consumer/EventMap'
import { MOCK_BRANDS, MOCK_POSTS, MOCK_EVENTS, MOCK_DROPS, MOCK_PRODUCTS } from '../../data/mockData'
import { addToCart } from '../../lib/cartStore'
import { ShoppingBag } from 'lucide-react'
import { formatRelativeTime, formatNumber, formatDate, formatCurrency, formatCountdown, CATEGORY_LABELS } from '../../lib/utils'
import { downloadICS, googleCalendarURL } from '../../lib/calendar'
import { cn } from '../../lib/utils'
import { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const CATEGORIES = ['all', 'fashion', 'food_beverage', 'lifestyle', 'beauty', 'arts_crafts', 'wellness']
const TABS = [
  { id: 'explore', label: 'Explore', icon: Grid3X3 },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'drops', label: 'Drops', icon: Zap },
]

// Build a mixed grid of items for the Instagram explore view
function buildExploreGrid(query, category) {
  const items = []

  // Add posts
  MOCK_POSTS.forEach(post => {
    if (query && !post.content?.toLowerCase().includes(query.toLowerCase()) &&
        !post.brand?.name.toLowerCase().includes(query.toLowerCase())) return
    if (category !== 'all' && post.brand?.category !== category) return
    items.push({ type: 'post', data: post, sort: new Date(post.published_at).getTime() })
  })

  // Add events
  MOCK_EVENTS.forEach(event => {
    if (query && !event.title.toLowerCase().includes(query.toLowerCase()) &&
        !event.brand?.name.toLowerCase().includes(query.toLowerCase())) return
    if (category !== 'all' && event.brand?.category !== category) return
    items.push({ type: 'event', data: event, sort: new Date(event.starts_at).getTime() + 1e15 }) // boost events
  })

  // Add drops
  MOCK_DROPS.forEach(drop => {
    if (query && !drop.title.toLowerCase().includes(query.toLowerCase()) &&
        !drop.brand?.name.toLowerCase().includes(query.toLowerCase())) return
    if (category !== 'all' && drop.brand?.category !== category) return
    items.push({ type: 'drop', data: drop, sort: new Date(drop.drop_at).getTime() + 2e15 }) // boost drops
  })

  // Add brands as featured tiles
  MOCK_BRANDS.forEach(brand => {
    if (query && !brand.name.toLowerCase().includes(query.toLowerCase()) &&
        !brand.tagline?.toLowerCase().includes(query.toLowerCase())) return
    if (category !== 'all' && brand.category !== category) return
    // Sort by follower count when available, otherwise a stable offset so
    // unverified brands don't all clump at the top of the feed.
    items.push({ type: 'brand', data: brand, sort: brand.follower_count ?? 500 })
  })

  // Interleave: sort by relevance, then interleave types for variety
  items.sort((a, b) => b.sort - a.sort)

  // Ensure variety — don't show 3 of same type in a row
  const result = []
  const buckets = { post: [], event: [], drop: [], brand: [] }
  items.forEach(i => buckets[i.type].push(i))
  const order = ['drop', 'event', 'post', 'brand', 'post', 'post', 'event', 'brand', 'drop', 'post']
  let idx = 0
  const used = new Set()
  for (let round = 0; round < 3; round++) {
    for (const t of order) {
      const item = buckets[t]?.shift()
      if (item && !used.has(item.data.id)) {
        result.push(item)
        used.add(item.data.id)
      }
    }
  }
  // Add remaining
  items.forEach(i => { if (!used.has(i.data.id)) result.push(i) })

  return result
}

// ─── Grid tile components ─────────────────────────────────

function PostTile({ post, size }) {
  return (
    <Link to={`/brand/${post.brand?.slug}`} className={cn('relative rounded-2xl overflow-hidden group', size === 'large' ? 'col-span-2 row-span-2' : '')}>
      <div className={cn('bg-[#F0E7D5] overflow-hidden', size === 'large' ? 'aspect-square' : 'aspect-square')}>
        {post.media_urls?.[0]
          ? <img src={post.media_urls[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full bg-gradient-to-br from-[#C4B49A] to-[#E8DDD1]" />
        }
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex items-center gap-4 text-white font-semibold text-sm">
          <span className="flex items-center gap-1"><Heart size={16} className="fill-white" /> {formatNumber(post.likes)}</span>
          <span className="flex items-center gap-1"><MessageCircle size={14} className="fill-white" /> {formatNumber(post.comments)}</span>
        </div>
      </div>
      {/* Platform badge */}
      <div className="absolute top-2 right-2">
        <PlatformBadge platform={post.platform} />
      </div>
      {/* Brand name */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2.5 pb-2 pt-6">
        <div className="flex items-center gap-1.5">
          <Avatar src={post.brand?.logo_url} name={post.brand?.name} size="xs" />
          <span className="text-white text-xs font-semibold truncate">{post.brand?.name}</span>
        </div>
      </div>
    </Link>
  )
}

function EventTile({ event }) {
  const [calOpen, setCalOpen] = useState(false)
  const isLive = new Date(event.starts_at) <= new Date() && (!event.ends_at || new Date(event.ends_at) >= new Date())
  const calData = { title: event.title, description: event.description, location: event.address || event.venue_name, start: event.starts_at, end: event.ends_at }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#E8DDC8] bg-[#FAF6EE] group">
      <div className="aspect-[4/3] overflow-hidden relative">
        {event.cover_url
          ? <img src={event.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full bg-gradient-to-br from-[#1A1513] to-[#2D5A40]" />
        }
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          {isLive ? (
            <span className="flex items-center gap-1 bg-[#D94545] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#FAF6EE] rounded-full animate-pulse" />LIVE
            </span>
          ) : (
            <span className="bg-[#1A1513] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              {formatDate(event.starts_at, 'MMM d')}
            </span>
          )}
        </div>
        {/* Calendar button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => { e.stopPropagation(); setCalOpen(c => !c) }}
            className="w-7 h-7 bg-[#FAF6EE]/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-[#FAF6EE] transition-colors"
          >
            <CalendarPlus size={13} className="text-[#6B5744]" />
          </button>
          {calOpen && (
            <div className="absolute top-full right-0 mt-1 bg-[#FAF6EE] rounded-xl shadow-lg border border-[#E8DDC8] py-1 w-40 z-20">
              <a href={googleCalendarURL(calData)} target="_blank" rel="noopener noreferrer"
                className="block px-3 py-2 text-xs text-[#4a3a2b] hover:bg-[#F5EFE4]">
                Google Calendar
              </a>
              <button onClick={() => { downloadICS(calData); setCalOpen(false) }}
                className="w-full text-left px-3 py-2 text-xs text-[#4a3a2b] hover:bg-[#F5EFE4]">
                Download .ics
              </button>
            </div>
          )}
        </div>
        {/* Free / Price */}
        <div className="absolute bottom-2 right-2">
          {event.is_free
            ? <span className="bg-green-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">FREE</span>
            : <span className="bg-[#FAF6EE] text-ink text-[11px] font-bold px-2.5 py-1 rounded-full shadow">{formatCurrency(event.ticket_price)}</span>
          }
        </div>
      </div>
      <div className="p-2.5">
        <p className="font-semibold text-xs text-ink line-clamp-1">{event.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Clock size={10} className="text-[#8B7355]" />
          <span className="text-[10px] text-[#6B5744]">{formatDate(event.starts_at, 'EEE, h:mm a')}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={10} className="text-[#8B7355]" />
          <span className="text-[10px] text-[#6B5744] truncate">{event.venue_name}</span>
        </div>
      </div>
    </div>
  )
}

function DropTile({ drop }) {
  const [countdown, setCountdown] = useState(formatCountdown(drop.drop_at))

  useEffect(() => {
    const interval = setInterval(() => setCountdown(formatCountdown(drop.drop_at)), 1000)
    return () => clearInterval(interval)
  }, [drop.drop_at])

  return (
    <Link to={`/brand/${drop.brand?.slug}`} className="relative rounded-2xl overflow-hidden group">
      <div className="aspect-square overflow-hidden relative">
        {drop.cover_url
          ? <img src={drop.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full bg-gradient-to-br from-[#1A1513] to-[#2D5A40]" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Drop badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#D94545] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          <Zap size={11} /> DROP
        </div>

        {/* Hype */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#FAF6EE]/20 backdrop-blur-sm text-white rounded-full px-2.5 py-1">
          <Flame size={11} className="text-orange-300" />
          <span className="text-[11px] font-semibold">{formatNumber(drop.hype_count)}</span>
        </div>

        {/* Countdown + info */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Avatar src={drop.brand?.logo_url} name={drop.brand?.name} size="xs" />
            <span className="text-white/80 text-[10px]">{drop.brand?.name}</span>
          </div>
          <p className="text-white font-bold text-xs line-clamp-1">{drop.title}</p>
          {!countdown.live ? (
            <div className="flex items-center gap-1 mt-1">
              <span className="bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {countdown.days}d {String(countdown.hours).padStart(2,'0')}:{String(countdown.minutes).padStart(2,'0')}:{String(countdown.seconds).padStart(2,'0')}
              </span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 bg-[#D94545] text-white text-[11px] font-bold px-2.5 py-1 rounded-full mt-1">
              <span className="w-1.5 h-1.5 bg-[#FAF6EE] rounded-full animate-pulse" /> LIVE NOW
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function BrandTile({ brand }) {
  const { user } = useAuth()
  const [saved, setSaved] = useState(() => {
    if (!user) return false
    const saved = JSON.parse(localStorage.getItem(`saves_${user.id}`) || '[]')
    return saved.includes(brand.id)
  })

  function handleSave(e) {
    e.preventDefault()
    if (!user) {
      window.location.href = '/auth/login'
      return
    }
    const saved = JSON.parse(localStorage.getItem(`saves_${user.id}`) || '[]')
    if (saved.includes(brand.id)) {
      setSaved(false)
      localStorage.setItem(`saves_${user.id}`, JSON.stringify(saved.filter(id => id !== brand.id)))
    } else {
      setSaved(true)
      localStorage.setItem(`saves_${user.id}`, JSON.stringify([...saved, brand.id]))
    }
  }

  return (
    <Link to={`/brand/${brand.slug}`} className="rounded-2xl overflow-hidden bg-[#FAF6EE] border border-[#E8DDC8] group hover:shadow-md transition-shadow">
      <div className="h-16 overflow-hidden">
        {brand.banner_url
          ? <img src={brand.banner_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full bg-gradient-to-br from-[#C4B49A] to-[#E8DDD1]" />
        }
      </div>
      <div className="px-2.5 pb-2.5 -mt-4">
        <div className="flex items-end justify-between mb-1.5">
          <div className="ring-2 ring-white rounded-xl overflow-hidden">
            <Avatar src={brand.logo_url} name={brand.name} size="sm" className="rounded-xl" />
          </div>
          <button
            onClick={handleSave}
            className={cn(
              'text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all',
              saved ? 'border-[#D94545] text-[#D94545] bg-[#D94545]/5' : 'border-gray-300 text-[#8B7355] hover:border-gray-400'
            )}
          >
            <Heart size={11} className={cn('inline -mt-0.5 mr-0.5', saved ? 'fill-current' : '')} /> Save
          </button>
        </div>
        <div className="flex items-center gap-1">
          <p className="font-bold text-xs text-ink truncate">{brand.name}</p>
          {brand.verified && <CheckCircle size={10} className="text-[#D94545] flex-shrink-0" />}
        </div>
        <p className="text-[10px] text-[#8B7355] truncate">{brand.tagline}</p>
      </div>
    </Link>
  )
}

// ─── Events tab with calendar add ──────────────────────────

function EventsTab({ events, loading }) {
  const liveCount = events.filter(e => e.source === 'eventbrite').length
  return (
    <div className="space-y-3">
      {/* Map widget pinned at top */}
      <div className="px-4">
        <EventMap events={events} />
        <div className="flex items-center justify-between mt-1.5 px-1">
          <p className="text-[11px] text-[#8B7355]">
            {events.length} events across Singapore — tap a pin to preview
          </p>
          {loading ? (
            <span className="text-[11px] text-[#8B7355] animate-pulse">Fetching live…</span>
          ) : liveCount > 0 ? (
            <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              · {liveCount} live
            </span>
          ) : null}
        </div>
      </div>
      <div className="px-4 space-y-3">
        {events.length === 0 && !loading ? (
          <div className="text-center py-12 px-4 paper-card rounded-3xl">
            <Calendar size={32} className="mx-auto mb-3 text-[#C4B49A]" />
            <p className="font-display text-lg text-ink">No events this week</p>
            <p className="text-sm text-[#6B5744] mt-1">Check back soon — local brands drop new ones weekly.</p>
          </div>
        ) : (
          events.map(event => <EventFullCard key={event.id} event={event} />)
        )}
      </div>
    </div>
  )
}

function EventFullCard({ event }) {
  const { user } = useAuth()
  const [rsvped, setRsvped] = useState(() => {
    if (!user) return false
    const rsvps = JSON.parse(localStorage.getItem(`rsvps_${user.id}`) || '[]')
    return rsvps.includes(event.id)
  })
  const [calOpen, setCalOpen] = useState(false)
  const isLive = new Date(event.starts_at) <= new Date() && (!event.ends_at || new Date(event.ends_at) >= new Date())
  const isSoldOut = event.max_capacity && event.rsvp_count >= event.max_capacity
  const calData = { title: event.title, description: event.description, location: event.address || event.venue_name, start: event.starts_at, end: event.ends_at }

  function handleRSVP() {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }
    const rsvps = JSON.parse(localStorage.getItem(`rsvps_${user.id}`) || '[]')
    if (rsvped) {
      setRsvped(false)
      localStorage.setItem(`rsvps_${user.id}`, JSON.stringify(rsvps.filter(id => id !== event.id)))
    } else {
      setRsvped(true)
      localStorage.setItem(`rsvps_${user.id}`, JSON.stringify([...rsvps, event.id]))
    }
  }

  return (
    <div className={cn('bg-[#FAF6EE] rounded-3xl overflow-hidden border transition-shadow hover:shadow-lg',
      isLive ? 'border-[#D94545] ring-1 ring-[#D94545]/20' : 'border-[#E8DDC8]')}>
      <div className="relative h-40 overflow-hidden">
        {event.cover_url
          ? <img src={event.cover_url} alt={event.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-[#C4B49A] to-[#E8DDD1]" />
        }
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#D94545] text-white rounded-full px-3 py-1">
            <span className="w-2 h-2 bg-[#FAF6EE] rounded-full animate-pulse" />
            <span className="text-xs font-bold">HAPPENING NOW</span>
          </div>
        )}
        {!isLive && (
          <div className="absolute top-3 left-3 bg-[#FAF6EE] rounded-xl px-2.5 py-1.5 shadow-md">
            <p className="text-[10px] font-semibold text-[#D94545] uppercase">{formatDate(event.starts_at, 'MMM')}</p>
            <p className="text-lg font-bold text-ink leading-none">{formatDate(event.starts_at, 'd')}</p>
          </div>
        )}
        <div className="absolute bottom-3 right-3">
          {event.is_free
            ? <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">FREE</span>
            : <span className="bg-[#FAF6EE] text-ink text-xs font-bold px-2.5 py-1 rounded-full shadow">{formatCurrency(event.ticket_price)}</span>
          }
        </div>
      </div>
      <div className="p-4">
        <Link to={`/brand/${event.brand?.slug}`} className="flex items-center gap-2 mb-2">
          <Avatar src={event.brand?.logo_url} name={event.brand?.name} size="xs" />
          <span className="text-xs text-[#6B5744]">{event.brand?.name}</span>
        </Link>
        <h3 className="font-bold text-base text-ink mb-2">{event.title}</h3>
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-[#6B5744]">
            <Clock size={13} /><span className="text-xs">{formatDate(event.starts_at, 'EEE, d MMM · h:mm a')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6B5744]">
            <MapPin size={13} /><span className="text-xs truncate">{event.venue_name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6B5744]">
            <Users size={13} />
            <span className="text-xs">{event.rsvp_count} going{event.max_capacity && ` · ${event.max_capacity - event.rsvp_count} spots left`}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRSVP}
            disabled={isSoldOut && !rsvped}
            className={cn('flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all',
              isSoldOut && !rsvped ? 'bg-[#F0E7D5] text-[#8B7355]' :
              rsvped ? 'bg-green-50 text-green-600 border border-green-200' :
              'bg-[#D94545] text-white hover:bg-[#a85225]'
            )}
          >
            {isSoldOut && !rsvped ? 'Sold Out' : rsvped ? (<span className="inline-flex items-center gap-1"><Check size={14} /> Going</span>) : 'RSVP Now'}
          </button>

          {/* Add to Calendar */}
          <div className="relative">
            <button
              onClick={() => setCalOpen(c => !c)}
              className="flex items-center gap-1.5 px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-[#6B5744] hover:bg-[#F5EFE4] transition-colors"
            >
              <CalendarPlus size={16} />
              <span className="hidden sm:inline text-xs">Calendar</span>
            </button>
            {calOpen && (
              <div className="absolute bottom-full right-0 mb-2 bg-[#FAF6EE] rounded-xl shadow-lg border border-[#E8DDC8] py-1 w-44 z-20">
                <a href={googleCalendarURL(calData)} target="_blank" rel="noopener noreferrer"
                  className="block px-3 py-2 text-sm text-[#4a3a2b] hover:bg-[#F5EFE4]">
                  Google Calendar
                </a>
                <button onClick={() => { downloadICS(calData); setCalOpen(false) }}
                  className="w-full text-left px-3 py-2 text-sm text-[#4a3a2b] hover:bg-[#F5EFE4]">
                  Download .ics
                </button>
              </div>
            )}
          </div>

          {/* External RSVP fallback for scraped events */}
          {event.url && event.source && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-xs font-semibold text-[#6B5744] hover:bg-[#F5EFE4] transition-colors"
              title={`View on ${event.source}`}
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* Shop-the-event — products from the hosting brand */}
        <ShopTheEvent event={event} />
      </div>
    </div>
  )
}

// Horizontal product rail under each event — the commerce loop Eventbrite can't touch.
// Only shows when the event has a linked Kita brand with in-stock products.
function ShopTheEvent({ event }) {
  const brandId = event.brand_id
  const products = useMemo(() => {
    if (!brandId) return []
    return MOCK_PRODUCTS.filter(p => p.brand_id === brandId).slice(0, 6)
  }, [brandId])

  if (!products.length) return null

  return (
    <div className="mt-4 pt-4 border-t border-[#E8DDC8]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <ShoppingBag size={13} className="text-[#D94545]" />
          <p className="text-xs font-semibold text-ink">Shop the event</p>
        </div>
        <Link to={`/brand/${event.brand?.slug}`} className="text-[11px] text-[#D94545] font-semibold hover:underline">
          See all →
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        {products.map(product => (
          <div
            key={product.id}
            className="flex-shrink-0 w-28 paper-card rounded-xl overflow-hidden border border-[#E8DDC8]"
          >
            <Link to={`/brand/${product.brand?.slug}`} className="block">
              <div className="aspect-square bg-[#F0E7D5] overflow-hidden">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-2">
                <p className="text-[11px] font-semibold text-ink line-clamp-1 leading-tight">{product.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] font-bold text-accent">{formatCurrency(product.price)}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product) }}
                    className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center hover:bg-[#a85225] active:scale-90 transition-all"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag size={11} className="text-white" />
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Drops tab ─────────────────────────────────────────────

function DropsTab({ drops }) {
  const upcoming = drops.filter(d => new Date(d.drop_at) > new Date())
  const live = drops.filter(d => new Date(d.drop_at) <= new Date())

  return (
    <div className="px-4 space-y-4">
      {live.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-[#D94545] rounded-full animate-pulse" />
            <h2 className="font-bold text-sm text-ink">Live Now</h2>
          </div>
          {live.map(drop => <DropFullCard key={drop.id} drop={drop} />)}
        </div>
      )}
      <div>
        <h2 className="font-bold text-sm text-ink mb-2">Upcoming Drops</h2>
        <div className="space-y-4">
          {upcoming.map(drop => <DropFullCard key={drop.id} drop={drop} />)}
        </div>
      </div>
      {/* How drops work */}
      <div className="p-4 bg-[#C4B49A] rounded-2xl">
        <p className="font-bold text-xs text-ink mb-2">How Drops Work</p>
        <div className="space-y-2 text-xs text-[#6B5744]">
          <p className="flex items-start gap-2"><Flame size={13} className="mt-0.5 flex-shrink-0 text-accent" /> Hype a drop to get notified when it goes live.</p>
          <p className="flex items-start gap-2"><Zap size={13} className="mt-0.5 flex-shrink-0 text-accent" /> Shop fast — first come, first served.</p>
          <p className="flex items-start gap-2"><Gift size={13} className="mt-0.5 flex-shrink-0 text-accent" /> Payments go directly to the brand.</p>
        </div>
      </div>
    </div>
  )
}

function DropFullCard({ drop }) {
  const [countdown, setCountdown] = useState(formatCountdown(drop.drop_at))
  const [hyped, setHyped] = useState(false)
  const [hypers, setHypers] = useState(drop.hype_count ?? 0)

  useEffect(() => {
    const interval = setInterval(() => setCountdown(formatCountdown(drop.drop_at)), 1000)
    return () => clearInterval(interval)
  }, [drop.drop_at])

  return (
    <div className={cn('bg-[#FAF6EE] rounded-3xl overflow-hidden border hover:shadow-lg transition-shadow',
      countdown.live ? 'border-[#D94545] ring-1 ring-[#D94545]/20' : 'border-[#E8DDC8]')}>
      <div className="relative h-48 overflow-hidden">
        {drop.cover_url
          ? <img src={drop.cover_url} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-[#1A1513] to-[#2D5A40]" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {countdown.live && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#D94545] text-white rounded-full px-3 py-1">
            <span className="w-2 h-2 bg-[#FAF6EE] rounded-full animate-pulse" />
            <span className="text-xs font-bold">LIVE NOW</span>
          </div>
        )}
        <button onClick={() => { setHyped(h => !h); setHypers(c => hyped ? c - 1 : c + 1) }}
          className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#FAF6EE]/20 backdrop-blur-sm text-white rounded-full px-3 py-1.5">
          <Flame size={14} className={hyped ? 'fill-orange-400 text-orange-400' : ''} />
          <span className="text-xs font-semibold">{formatNumber(hypers)}</span>
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link to={`/brand/${drop.brand?.slug}`} className="flex items-center gap-2 mb-1">
            <Avatar src={drop.brand?.logo_url} name={drop.brand?.name} size="xs" />
            <span className="text-white/80 text-xs">{drop.brand?.name}</span>
          </Link>
          <p className="text-white font-bold text-sm">{drop.title}</p>
        </div>
      </div>
      <div className="p-4">
        {!countdown.live ? (
          <div className="flex items-center justify-center gap-2 mb-3">
            {[
              { val: countdown.days, lbl: 'D' },
              { val: countdown.hours, lbl: 'H' },
              { val: countdown.minutes, lbl: 'M' },
              { val: countdown.seconds, lbl: 'S' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="bg-[#1A1513] text-white rounded-xl px-3 py-2 text-center min-w-[48px]">
                <span className="text-xl font-bold tabular-nums">{String(val).padStart(2, '0')}</span>
                <span className="text-[9px] text-white/50 ml-0.5">{lbl}</span>
              </div>
            ))}
          </div>
        ) : (
          <Link to={`/brand/${drop.brand?.slug}`}
            className="block w-full bg-[#D94545] hover:bg-[#a85225] text-white text-sm font-semibold py-2.5 rounded-xl text-center transition-colors mb-3">
            Shop Now →
          </Link>
        )}
        <p className="text-sm text-[#6B5744] line-clamp-2">{drop.description}</p>
      </div>
    </div>
  )
}

// ─── Main Discover Page ────────────────────────────────────

export default function DiscoverPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('explore')
  const [liveEvents, setLiveEvents] = useState([])
  const [liveEventsLoading, setLiveEventsLoading] = useState(false)

  // Fetch live SG events from our scraper on first mount.
  // Falls back silently to seeded events if the edge function errors out.
  useEffect(() => {
    let cancelled = false
    setLiveEventsLoading(true)
    fetch('/api/events-discover')
      .then(r => r.ok ? r.json() : { events: [] })
      .then(d => { if (!cancelled) setLiveEvents(Array.isArray(d.events) ? d.events : []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLiveEventsLoading(false) })
    return () => { cancelled = true }
  }, [])

  // Merge seeded + scraped events; de-dupe on title+venue to avoid double-posting
  const allEvents = useMemo(() => {
    const seen = new Set()
    const merged = []
    for (const ev of [...liveEvents, ...MOCK_EVENTS]) {
      const key = `${ev.title}|${ev.venue_name}`.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(ev)
    }
    return merged.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
  }, [liveEvents])

  const exploreItems = useMemo(
    () => buildExploreGrid(query, activeCategory),
    [query, activeCategory]
  )

  return (
    <div className="pb-20">
      {/* Search bar */}
      <div className="sticky top-0 z-20 bg-[#FAF6EE] px-4 pt-3 pb-2 border-b border-[#E8DDC8]">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search brands, events, drops..."
              className="w-full pl-3 pr-14 py-2.5 bg-[#F0E7D5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-9 top-1/2 -translate-y-1/2 text-[#8B7355]">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                activeTab === id
                  ? 'bg-[#D94545] text-white'
                  : 'bg-[#F0E7D5] text-[#6B5744] hover:bg-gray-200'
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills — show on explore */}
      {activeTab === 'explore' && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                activeCategory === cat
                  ? 'bg-[#1A1513] text-white'
                  : 'bg-[#F0E7D5] text-[#6B5744] hover:bg-gray-200'
              )}
            >
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {/* ─── Explore grid (Instagram style) ─── */}
      {activeTab === 'explore' && (
        <div className="px-2">
          <div className="grid grid-cols-3 gap-1">
            {exploreItems.map((item, i) => {
              // Every 5th item is large (2x2) for visual variety
              const isLarge = i % 7 === 0 && item.type === 'post'

              if (item.type === 'post') return <PostTile key={`p-${item.data.id}`} post={item.data} size={isLarge ? 'large' : 'normal'} />
              if (item.type === 'event') return <EventTile key={`e-${item.data.id}`} event={item.data} />
              if (item.type === 'drop') return <DropTile key={`d-${item.data.id}`} drop={item.data} />
              if (item.type === 'brand') return <BrandTile key={`b-${item.data.id}`} brand={item.data} />
              return null
            })}
          </div>

          {exploreItems.length === 0 && (
            <div className="text-center py-16 px-8">
              <Search size={32} className="text-[#C4B49A] mx-auto mb-3" />
              <p className="font-bold text-ink">Nothing found</p>
              <p className="text-sm text-[#6B5744]">Try a different search or category.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── Events tab ─── */}
      {activeTab === 'events' && <EventsTab events={allEvents} loading={liveEventsLoading} />}

      {/* ─── Drops tab ─── */}
      {activeTab === 'drops' && <DropsTab drops={MOCK_DROPS} />}
    </div>
  )
}
