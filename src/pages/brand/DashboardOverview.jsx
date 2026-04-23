import { Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, Eye, DollarSign, Sparkles, ArrowRight, CheckCircle, Info, Coffee, Heart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { MOCK_ANALYTICS } from '../../data/mockData'
import { formatNumber, formatCurrency } from '../../lib/utils'
import { PlatformBadge } from '../../components/shared/Badge'
import { useBrandProfile } from '../../lib/brandStore'

// ═══════════════════════════ Stat card w/ explainer tooltip ═══════════════════════════
function StatCard({ label, value, delta, icon: Icon, prefix = '', isCurrency = false, explain }) {
  const [showInfo, setShowInfo] = useState(false)
  const isPositive = delta >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="paper-card rounded-2xl p-4 relative"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-[#8B7355] uppercase tracking-wider">{label}</p>
          {explain && (
            <button
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              onClick={() => setShowInfo(s => !s)}
              className="text-[#A89880] hover:text-accent transition-colors"
            >
              <Info size={12} />
            </button>
          )}
        </div>
        <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center">
          <Icon size={16} className="text-accent" />
        </div>
      </div>
      <p className="text-2xl font-display font-semibold text-ink mb-1">
        {isCurrency ? formatCurrency(value) : prefix + formatNumber(value)}
      </p>
      <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-[#2d7a4a]' : 'text-accent'}`}>
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{isPositive ? '+' : ''}{delta}{typeof delta === 'number' && delta > 100 ? '' : '%'} this month</span>
      </div>
      {showInfo && explain && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-3 bg-ink text-cream text-[11px] rounded-xl z-20 shadow-warm-lg"
        >
          {explain}
        </motion.div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════ AI Rec card ═══════════════════════════
function AiRecommendationCard({ rec }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="paper-card rounded-2xl p-4 relative overflow-hidden"
    >
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-accent/10" />
      <div className="relative">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles size={14} className="text-accent" />
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">AI Suggestion</span>
        </div>
        <p className="text-sm text-ink font-semibold mb-1">{rec.title}</p>
        <p className="text-xs text-[#6B5744]">{rec.body}</p>
        <button className="mt-3 text-xs font-semibold text-accent flex items-center gap-1 hover:gap-2 transition-all">
          Try this <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  )
}

const AI_RECS = [
  {
    title: 'Post between 7–9PM on weekdays',
    body: 'Your audience shows up strongest Tue & Thu evenings. Engagement is 2.3× higher in this window.',
  },
  {
    title: 'Try a behind-the-scenes video',
    body: 'BTS content for brands like yours averages 68% more saves and 3× shares. Show your process.',
  },
  {
    title: '3 brands looking for collabs',
    body: 'Foreword Coffee and 2 others posted open collab listings this week. Check Connect.',
  },
]

// ═══════════════════════════ Main ═══════════════════════════
export default function DashboardOverview() {
  const { overview, follower_history, platform_breakdown, top_posts } = MOCK_ANALYTICS
  const [brand] = useBrandProfile()
  const brandName = brand?.name ?? 'Your brand'

  return (
    <div className="p-6 max-w-6xl mx-auto pb-20">
      {/* Brand hero — if onboarded */}
      {brand && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-6 paper-card"
        >
          {brand.banner_url && (
            <img src={brand.banner_url} alt="" className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
          )}
          <div className="p-5 flex items-center gap-4">
            {brand.logo_url && (
              <img src={brand.logo_url} alt="" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#FAF6EE] -mt-12 bg-[#FAF6EE]" referrerPolicy="no-referrer" />
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-semibold text-xl text-ink truncate">{brand.name}</h2>
              <p className="text-sm text-[#6B5744] truncate">{brand.tagline}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#8B7355] uppercase tracking-wider">Platform</p>
              <p className="text-sm font-semibold text-accent capitalize">{brand.platform ?? 'custom'}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Page header */}
      <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
        <div>
          <p className="font-hand text-xl text-accent leading-none">kopi morning</p>
          <h1 className="font-display text-3xl font-semibold text-ink mt-0.5">How's business?</h1>
          <p className="text-sm text-[#6B5744] mt-1">April 2026 · {brandName}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-[#2d7a4a] bg-[#e8f5ec] px-3 py-1.5 rounded-xl font-medium">
            <CheckCircle size={12} />
            All synced
          </span>
          <Link to="/dashboard/content" className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-warm transition-colors">
            + New post
          </Link>
        </div>
      </div>

      {/* Analytics primer — explain what each thing means */}
      <div className="paper-card rounded-2xl p-4 mb-6 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Coffee size={18} className="text-accent" />
        </div>
        <div>
          <p className="font-display font-semibold text-sm text-ink">Your numbers, explained</p>
          <p className="text-xs text-[#6B5744] mt-0.5 leading-relaxed">
            <span className="font-semibold">Followers</span> = how many people chose to stay in touch.
            <span className="font-semibold"> Impressions</span> = times your stuff showed up on someone's screen.
            <span className="font-semibold"> Engagement</span> = how often people stop, like, save or comment.
            <span className="font-semibold"> Revenue</span> = sales tracked from our shop links this month.
            Hover the <Info size={10} className="inline mb-0.5" /> on each card for more.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-in">
        <StatCard
          label="Followers"
          value={overview.followers}
          delta={overview.followers_delta}
          icon={Users}
          explain="Total fans across Instagram, TikTok, and your newsletter. Think: people who said 'keep me posted.'"
        />
        <StatCard
          label="Impressions"
          value={overview.impressions}
          delta={overview.impressions_delta}
          icon={Eye}
          explain="How many times your content appeared on any screen this month. One person can scroll past the same post twice — both count."
        />
        <StatCard
          label="Engagement"
          value={overview.engagement_rate}
          delta={overview.engagement_delta}
          icon={Heart}
          prefix=""
          explain="% of viewers who stopped scrolling to like, comment, save, or share. Higher = your content is resonating."
        />
        <StatCard
          label="Revenue"
          value={overview.revenue}
          delta={overview.revenue_delta}
          icon={DollarSign}
          isCurrency
          explain="Sales tracked through your KitaKakis links this month, across all platforms. Paid orders only."
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Follower growth */}
        <div className="lg:col-span-2 paper-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-display font-semibold text-ink">Follower growth</p>
              <p className="font-hand text-sm text-[#8B7355] leading-none">where your people came from</p>
            </div>
            <span className="text-xs text-[#8B7355]">Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={follower_history}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D94545" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#D94545" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8B7355' }} tickFormatter={v => v.slice(5)} tickLine={false} axisLine={false} interval={6} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [formatNumber(v), 'Followers']}
                labelFormatter={v => v}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px -12px rgba(168, 82, 37, 0.3)', background: '#FAF6EE', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="count" stroke="#D94545" strokeWidth={2.5} fill="url(#grad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Platform breakdown */}
        <div className="paper-card rounded-2xl p-5">
          <p className="font-display font-semibold text-ink mb-1">Where they hang out</p>
          <p className="font-hand text-sm text-[#8B7355] leading-none mb-4">platform split</p>
          <div className="space-y-4">
            {platform_breakdown.map(p => (
              <div key={p.platform}>
                <div className="flex items-center justify-between mb-1.5">
                  <PlatformBadge platform={p.platform} />
                  <span className="text-xs font-semibold text-[#6B5744]">{formatNumber(p.followers)}</span>
                </div>
                <div className="h-2 bg-[#F0E7D5] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.followers / overview.followers) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-accent to-accent-dark rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-[#8B7355]">{formatNumber(p.impressions)} views</span>
                  <span className="text-[10px] text-[#8B7355]">{p.engagement}% engage</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top posts */}
        <div className="paper-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-display font-semibold text-ink">Crowd favourites</p>
              <p className="font-hand text-sm text-[#8B7355] leading-none">top posts this month</p>
            </div>
            <Link to="/dashboard/analytics" className="text-xs text-accent font-semibold underline-dotted">View all</Link>
          </div>
          <div className="space-y-3 stagger-in">
            {top_posts.map((post, i) => (
              <div key={post.id} className="flex gap-3 items-start">
                <span className="font-display text-xl font-semibold text-accent/40 w-6 flex-shrink-0">#{i + 1}</span>
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#F0E7D5]">
                  {post.media_urls?.[0] && <img src={post.media_urls[0]} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink line-clamp-1">{post.content}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <PlatformBadge platform={post.platform} />
                    <span className="text-xs text-[#8B7355]">{formatNumber(post.views)} views</span>
                    <span className="text-xs text-[#8B7355] inline-flex items-center gap-0.5"><Heart size={10} className="fill-current text-red-400" /> {post.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI recommendations */}
        <div className="space-y-3">
          {AI_RECS.map(rec => <AiRecommendationCard key={rec.title} rec={rec} />)}
        </div>
      </div>
    </div>
  )
}
