import { motion } from 'framer-motion'
import {
  Gift, Star, CheckCircle, Lock, Sparkles, Coffee, Trophy,
  Handshake, Heart, Crown, Users, MapPin, ShoppingBag, Share2, Target,
  CalendarCheck, PenLine
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const TIERS = [
  { name: 'Kawan',    min: 0,    max: 499,       Icon: Handshake, blurb: 'welcome to the table' },
  { name: 'Sayang',   min: 500,  max: 1999,      Icon: Heart,     blurb: 'one of the regulars' },
  { name: 'Jaguh',    min: 2000, max: 4999,      Icon: Star,      blurb: 'champion of the kopitiam' },
  { name: 'Pahlawan', min: 5000, max: Infinity,  Icon: Crown,     blurb: 'legendary local' },
]

const HOW_TO_EARN = [
  { action: 'Follow a local brand',  points: '+5',         Icon: Users },
  { action: 'Attend an event',       points: '+50',        Icon: MapPin },
  { action: 'Make a purchase',       points: '+100 / $10', Icon: ShoppingBag },
  { action: 'Share a post',          points: '+10',        Icon: Share2 },
  { action: 'Refer a friend',        points: '+200',       Icon: Target },
  { action: 'Daily check-in',        points: '+2',         Icon: CalendarCheck },
  { action: 'Write a review',        points: '+25',        Icon: PenLine },
]

const REWARDS = [
  { title: 'Free kopi at Sunday Folks',    brand: 'Sunday Folks',   points: 150, available: true },
  { title: '$5 off Maroon merch',          brand: 'Maroon',         points: 200, available: true },
  { title: 'Charm workshop — 20% off',     brand: 'Charms & Links', points: 500, available: true },
  { title: 'Free tote (Heritage Bay)',     brand: 'Heritage Bay',   points: 350, available: true },
]

const ACTIVITY = [
  { label: "RSVP'd to Heritage Bay Launch", points: 50,  when: '2h ago' },
  { label: 'Shared a Maroon post',          points: 10,  when: 'yesterday' },
  { label: 'Daily check-in',                points: 2,   when: 'yesterday' },
  { label: 'Bought from VintageWknd',       points: 120, when: '3 days ago' },
]

export default function RewardsPage() {
  const { profile } = useAuth()
  const points = profile?.points ?? 2450
  const tier = TIERS.find(t => points >= t.min && points <= t.max) ?? TIERS[0]
  const nextTier = TIERS[TIERS.indexOf(tier) + 1]
  const progress = nextTier ? Math.min(100, ((points - tier.min) / (nextTier.min - tier.min)) * 100) : 100
  const TierIcon = tier.Icon
  const NextTierIcon = nextTier?.Icon

  return (
    <div className="pb-24 bg-[#FAF6EE] min-h-screen">
      {/* Hero */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="paper-card rounded-3xl p-6 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/10" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-tan/20" />

          <div className="relative">
            <p className="font-hand text-xl text-accent leading-none">kakis at the table</p>
            <div className="flex items-end justify-between mt-1">
              <div>
                <h1 className="font-display text-5xl font-semibold text-ink leading-none">{points.toLocaleString()}</h1>
                <p className="text-xs text-[#8B7355] mt-1">points · ≈ ${(points / 100).toFixed(2)} in treats</p>
              </div>
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl bg-accent/10 animate-breathe"
              >
                <TierIcon size={24} className="text-accent" />
                <span className="font-display font-semibold text-[13px] text-accent">{tier.name}</span>
              </motion.div>
            </div>
            <p className="font-hand text-base text-[#8B7355] mt-2">{tier.blurb}</p>

            {nextTier && (
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#6B5744] font-medium">{points.toLocaleString()} pts</span>
                  <span className="text-[#8B7355] inline-flex items-center gap-1">
                    {(nextTier.min - points).toLocaleString()} to {nextTier.name}
                    {NextTierIcon && <NextTierIcon size={12} />}
                  </span>
                </div>
                <div className="h-2.5 bg-[#F0E7D5] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-accent to-accent-dark rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Redeem */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-1.5 mb-3">
          <Gift size={16} className="text-accent" />
          <h2 className="font-display text-lg font-semibold text-ink">Redeem with friends</h2>
          <span className="font-hand text-base text-[#8B7355] ml-1">our treats for you</span>
        </div>
        <div className="grid grid-cols-2 gap-3 stagger-in">
          {REWARDS.map(reward => {
            const canRedeem = points >= reward.points && reward.available
            return (
              <div key={reward.title} className={`paper-card rounded-2xl p-3 flex flex-col ${!reward.available ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Gift size={18} className="text-accent" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Star size={9} className="fill-current" />{reward.points}
                  </span>
                </div>
                <p className="font-semibold text-[13px] text-ink leading-tight flex-1">{reward.title}</p>
                <p className="text-[11px] text-[#8B7355] mt-0.5">{reward.brand}</p>
                <button
                  disabled={!canRedeem}
                  className={`mt-2.5 w-full py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    canRedeem
                      ? 'bg-accent hover:bg-accent-dark text-white shadow-warm active:scale-[0.97]'
                      : 'bg-[#F0E7D5] text-[#A89880] cursor-not-allowed'
                  }`}
                >
                  {!reward.available ? 'Sold out' : canRedeem ? 'Redeem' : <Lock size={12} className="inline" />}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tier ladder */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-1.5 mb-3">
          <Trophy size={16} className="text-accent" />
          <h2 className="font-display text-lg font-semibold text-ink">Climb the ladder</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {TIERS.map(t => {
            const LadderIcon = t.Icon
            return (
              <div key={t.name} className={`flex-shrink-0 w-40 paper-card rounded-2xl p-4 ${tier.name === t.name ? 'ring-2 ring-accent' : ''}`}>
                <LadderIcon size={26} className="text-accent mb-2" />
                <p className="font-display font-semibold text-[15px] text-ink">{t.name}</p>
                <p className="font-hand text-sm text-[#8B7355] leading-tight">{t.blurb}</p>
                <p className="text-[11px] text-[#6B5744] mt-2 font-medium">
                  {t.max === Infinity ? `${t.min.toLocaleString()}+ pts` : `${t.min.toLocaleString()} – ${t.max.toLocaleString()} pts`}
                </p>
                {tier.name === t.name && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                    <CheckCircle size={10} /> You're here
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* How to earn */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles size={16} className="text-accent" />
          <h2 className="font-display text-lg font-semibold text-ink">Ways to earn</h2>
        </div>
        <div className="paper-card rounded-3xl p-2">
          {HOW_TO_EARN.map((item, idx) => {
            const EarnIcon = item.Icon
            return (
              <div key={item.action} className={`flex items-center justify-between py-2.5 px-3 ${idx < HOW_TO_EARN.length - 1 ? 'border-b border-[#E8DDC8]' : ''}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <EarnIcon size={15} className="text-accent" />
                  </div>
                  <span className="text-sm text-ink">{item.action}</span>
                </div>
                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{item.points}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-1.5 mb-3">
          <Coffee size={16} className="text-accent" />
          <h2 className="font-display text-lg font-semibold text-ink">Your story so far</h2>
        </div>
        <div className="paper-card rounded-3xl p-2">
          {ACTIVITY.map((a, idx) => (
            <div key={idx} className={`flex items-center justify-between py-2.5 px-3 ${idx < ACTIVITY.length - 1 ? 'border-b border-[#E8DDC8]' : ''}`}>
              <div>
                <p className="text-sm text-ink">{a.label}</p>
                <p className="text-[11px] text-[#8B7355]">{a.when}</p>
              </div>
              <span className="text-sm font-bold text-accent">+{a.points}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="font-hand text-lg text-center text-[#8B7355] mt-8 px-4">
        every point tells a story
      </p>
    </div>
  )
}
