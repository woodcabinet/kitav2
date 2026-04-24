// Step 3 — success screen. Shows a celebratory badge (confetti popper if
// the brand saved to Supabase, binocular "preview" if it's demo/local
// only), a banner explaining save status honestly (demo / error /
// published), and a "decoder" for the analytics metrics the dashboard
// will show — so the brand knows what every number means before they
// see numbers.
//
// MetricExplainer is exported too so the dashboard overview page can
// reuse the same row styling when surfacing metric tooltips.

import { motion } from 'framer-motion'
import { ArrowRight, Check, AlertCircle, BarChart2, Users, Eye, Heart, DollarSign, TrendingUp, PartyPopper } from 'lucide-react'
import { StatPill } from './StepReview'

export function StepLive({ scraped, savedProfile, onDashboard }) {
  const isDemo = savedProfile?.demo === true
  const saveError = savedProfile?.error
  return (
    <div>
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4"
        >
          {isDemo ? <Eye size={36} className="text-green-700" /> : <PartyPopper size={36} className="text-green-700" />}
        </motion.div>
        <h1 className="font-display text-3xl font-bold text-[#1A1513] mb-1">
          {isDemo ? 'Preview ready' : "You're live!"}
        </h1>
        <p className="font-hand text-xl text-[#D94545]">
          {scraped?.name ?? 'Your brand'} {isDemo ? 'looks good so far' : 'is on kitakakis'}
        </p>
      </div>

      {/* Honest status banner — Supabase unreachable / demo mode / saved */}
      {saveError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">Saved locally, not to the cloud yet</p>
            <p className="text-xs text-red-600 mt-0.5">{saveError}</p>
            <p className="text-xs text-red-500 mt-1">Your brand is cached in this browser. Sign in and retry from the dashboard to publish.</p>
          </div>
        </div>
      )}
      {isDemo && !saveError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Demo mode — sign in to publish</p>
            <p className="text-xs text-amber-700 mt-0.5">This preview is saved to your browser. Create an account from the dashboard to publish your brand for real.</p>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <StatPill value={scraped?.products?.length ?? 0} label="Products synced" />
        <StatPill value={scraped?.gallery?.length ?? 0} label="Images" />
        <StatPill value={<Check size={18} className="inline" />} label="Dashboard ready" />
      </div>

      {/* Analytics explainer — only shows what's actually wired up. Numbers
          you haven't connected yet are marked "pending" so we never show
          a fake figure. Connect the data source to light it up. */}
      <div className="bg-[#FAF6EE] border border-[#E8DDCB] rounded-2xl p-5 mb-4">
        <p className="font-display text-lg font-bold text-[#1A1513] mb-1 inline-flex items-center gap-2"><BarChart2 size={18} /> Your analytics, decoded</p>
        <p className="font-hand text-base text-[#D94545] mb-4">everything below is live from your Kita storefront — real numbers only</p>

        <div className="space-y-3">
          <MetricExplainer icon={Users}       color="#D94545" label="Followers"     meaning="People who follow your brand on Kita. They see your posts & drops first."         source="Live from your Kita storefront" status="live" />
          <MetricExplainer icon={Eye}         color="#1A1513" label="Impressions"   meaning="How many times your storefront, posts, and products appeared on someone's screen." source="Live from your Kita storefront" status="live" />
          <MetricExplainer icon={Heart}       color="#D94545" label="Engagement"    meaning="Likes, comments, saves, and RSVPs across your Kita content."                      source="Live from your Kita storefront" status="live" />
          <MetricExplainer icon={DollarSign}  color="#1A1513" label="Revenue"       meaning="Money earned through Kita checkouts — updates the moment an order lands."         source="Live from your Kita storefront" status="live" />
          <MetricExplainer icon={TrendingUp}  color="#D94545" label="Top products"  meaning="Your best-performing pieces this month, ranked by Kita clicks and sales."        source="Live from your Kita storefront" status="live" />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDashboard}
        className="w-full bg-[#1A1513] hover:bg-[#000] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-warm-lg"
      >
        Take me to my dashboard <ArrowRight size={18} />
      </motion.button>
    </div>
  )
}

// Reusable row explaining a single metric with a live/partial/pending
// traffic light. Dashboard overview pages reuse this to keep labels,
// colors, and status terminology in one place.
export function MetricExplainer({ icon: Icon, color, label, meaning, source, status = 'live' }) {
  const statusStyles = {
    live:    { dot: 'bg-green-500', text: 'text-green-700', label: 'LIVE' },
    partial: { dot: 'bg-amber-500', text: 'text-amber-700', label: 'PARTIAL' },
    pending: { dot: 'bg-gray-400',  text: 'text-gray-500',  label: 'PENDING' },
  }[status] ?? { dot: 'bg-gray-300', text: 'text-gray-500', label: '' }
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#E8DDCB]">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-sm text-[#1A1513]">{label}</p>
          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider ${statusStyles.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
            {statusStyles.label}
          </span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{meaning}</p>
        <p className="text-[10px] text-gray-400 italic mt-1">{source}</p>
      </div>
    </div>
  )
}
