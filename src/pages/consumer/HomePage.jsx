import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, MapPin, Coffee, Sparkles, Check } from 'lucide-react'
import { PostCard } from '../../components/consumer/PostCard'
import { EventCard } from '../../components/consumer/EventCard'
import { MOCK_POSTS, MOCK_BRANDS, MOCK_EVENTS, MOCK_DROPS } from '../../data/mockData'
import { useFollows } from '../../lib/followStore'

const FILTERS = ['All', 'Following', 'Fashion', 'Food & Drink', 'Lifestyle', 'Beauty']

// Greeting by time of day — tiny homey touch
function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Morning, friend'
  if (h < 18) return 'Good afternoon'
  return 'Evening, kawan'
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const follows = useFollows()

  // Find the drop happening soonest for the teaser
  const nextDrop = [...MOCK_DROPS].sort((a, b) => new Date(a.drop_at) - new Date(b.drop_at))[0]

  return (
    <div className="pb-20 bg-[#FAF6EE]">
      {/* Warm welcome strip */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-4 pt-4 pb-1"
      >
        <p className="font-hand text-xl text-accent leading-none">{greeting()}</p>
        <p className="font-display text-2xl font-semibold text-ink mt-0.5">Fresh from the community</p>
      </motion.div>

      {/* Stories / Brand Quick Access */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 stagger-in">
          <Link to="/discover" className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-warm">
              <Sparkles size={24} className="text-white" />
            </div>
            <span className="text-[10px] text-[#6B5744] w-[60px] text-center truncate font-medium">Explore</span>
          </Link>
          {MOCK_BRANDS.map(brand => {
            const followed = follows.isFollowing(brand.id)
            return (
              <Link key={brand.id} to={`/brand/${brand.slug}`} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="relative">
                  <div className={`w-[60px] h-[60px] rounded-full overflow-hidden transition-all duration-200 ${
                    followed
                      ? 'ring-[3px] ring-accent ring-offset-2 ring-offset-[#FAF6EE]'
                      : 'ring-2 ring-[#E0D5C4] ring-offset-2 ring-offset-[#FAF6EE]'
                  }`}>
                    <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
                  </div>
                  {followed && (
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-accent rounded-full flex items-center justify-center ring-2 ring-[#FAF6EE]">
                      <Check size={10} strokeWidth={3} className="text-white" />
                    </span>
                  )}
                </div>
                <span className={`text-[10px] w-[60px] text-center truncate font-medium transition-colors ${followed ? 'text-accent' : 'text-[#6B5744]'}`}>{brand.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 h-9 px-4 rounded-full text-[13px] font-medium transition-all whitespace-nowrap ${
              activeFilter === f
                ? 'bg-ink text-cream shadow-warm'
                : 'bg-white text-[#6B5744] border border-[#E8DDC8] hover:bg-[#F0E7D5]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Upcoming drop teaser */}
      {nextDrop && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-4 mb-4 relative overflow-hidden rounded-3xl shadow-warm-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink to-[#3a2d1f]" />
          <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url(${nextDrop.cover_url})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/30" />
          <div className="relative px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap size={12} className="text-accent" />
                <span className="text-accent text-[10px] font-bold uppercase tracking-widest">Next Drop</span>
              </div>
              <p className="text-white font-display font-semibold text-[15px] leading-snug line-clamp-2">{nextDrop.title}</p>
              <p className="text-white/60 text-xs mt-1">{nextDrop.brand?.name}</p>
            </div>
            <Link to="/discover" className="h-9 px-5 rounded-full bg-accent hover:bg-accent-dark text-white text-xs font-bold flex-shrink-0 flex items-center shadow-warm transition-colors whitespace-nowrap">
              Hype →
            </Link>
          </div>
        </motion.div>
      )}

      {/* Trending events quick bar */}
      <div className="px-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={15} className="text-accent" />
            <span className="font-display text-[15px] font-semibold text-ink">This Weekend</span>
            <span className="font-hand text-base text-[#8B7355] ml-1">happenings</span>
          </div>
          <Link to="/discover" className="text-xs text-accent font-semibold underline-dotted">See all</Link>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {MOCK_EVENTS.slice(0, 3).map(event => (
            <div key={event.id} className="flex-shrink-0 w-52">
              <EventCard event={event} compact />
            </div>
          ))}
        </div>
      </div>

      {/* Main feed */}
      <div className="px-1">
        <div className="flex items-center gap-1.5 mb-2 px-4">
          <Coffee size={14} className="text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8B7355]">Your Feed</span>
        </div>
        <div className="space-y-1">
          {MOCK_POSTS.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Discover more prompt */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-4 mt-6 p-6 paper-card rounded-3xl text-center relative overflow-hidden"
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-accent/10" />
        <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-tan/20" />
        <MapPin size={26} className="text-accent mx-auto mb-2 relative" />
        <p className="font-display font-semibold text-lg text-ink mb-1 relative">Discover more local brands</p>
        <p className="text-sm text-[#6B5744] mb-4 relative">120+ Singapore makers and growing daily.</p>
        <Link to="/discover" className="inline-block bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-warm transition-colors relative">
          Explore Brands →
        </Link>
      </motion.div>
    </div>
  )
}
