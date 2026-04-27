import { Link } from 'react-router-dom'
import { CheckCircle, MapPin, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, formatNumber } from '../../lib/utils'
import { CategoryBadge } from '../shared/Badge'
import { Avatar } from '../shared/Avatar'
import { useFollows } from '../../lib/followStore'

export function BrandCard({ brand, compact = false }) {
  const follows = useFollows()
  const followed = follows.isFollowing(brand?.id)

  if (compact) {
    return (
      <Link to={`/brand/${brand.slug}`} className="flex items-center gap-3 p-3 paper-card rounded-2xl hover:shadow-warm-lg transition-shadow">
        <Avatar src={brand.logo_url} name={brand.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm text-ink truncate">{brand.name}</span>
            {brand.verified && <CheckCircle size={12} className="text-[#D94545] flex-shrink-0" />}
          </div>
          <p className="text-xs text-[#6B5744] truncate">{brand.tagline}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={10} className="text-[#8B7355]" />
            <span className="text-xs text-[#8B7355]">{brand.location}</span>
          </div>
        </div>
        {brand.follower_count != null && (
          <span className="text-xs text-[#6B5744] font-medium">{formatNumber(brand.follower_count)}</span>
        )}
      </Link>
    )
  }

  return (
    <div className="paper-card rounded-3xl overflow-hidden hover:shadow-warm-lg transition-shadow">
      {/* Banner */}
      <Link to={`/brand/${brand.slug}`}>
        <div className="h-28 bg-gradient-to-br from-[#C4B49A] to-[#E8DDD1] overflow-hidden">
          {brand.banner_url && (
            <img src={brand.banner_url} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      </Link>

      <div className="px-4 pb-4">
        {/* Avatar overlapping banner */}
        <div className="-mt-6 mb-2 flex items-end justify-between">
          <Link to={`/brand/${brand.slug}`}>
            <div className="ring-4 ring-[#FAF6EE] rounded-2xl overflow-hidden">
              <Avatar src={brand.logo_url} name={brand.name} size="lg" className="rounded-2xl" />
            </div>
          </Link>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); follows.toggle(brand) }}
            aria-pressed={followed}
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold px-4 py-1.5 rounded-xl border transition-all duration-150 active:scale-[0.97]',
              followed
                ? 'border-[#E8DDC8] bg-[#FAF6EE] text-[#6B5744]'
                : 'border-accent text-accent hover:bg-accent hover:text-white shadow-warm',
            )}
          >
            {followed ? <><Check size={12} /> Following</> : 'Follow'}
          </motion.button>
        </div>

        <Link to={`/brand/${brand.slug}`}>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-base text-ink">{brand.name}</h3>
            {brand.verified && <CheckCircle size={14} className="text-[#D94545]" />}
          </div>
          <p className="text-sm text-[#6B5744] line-clamp-2 mb-2">{brand.tagline}</p>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-[#8B7355]" />
            <span className="text-xs text-[#8B7355]">{brand.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <CategoryBadge category={brand.category} />
            {brand.follower_count != null && (
              <span className="text-xs text-[#6B5744]">{formatNumber(brand.follower_count)} followers</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
