import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Flame } from 'lucide-react'
import { cn, formatCountdown, formatNumber } from '../../lib/utils'
import { Avatar } from '../shared/Avatar'

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-ink text-white rounded-xl px-3 py-2 min-w-[52px] text-center">
        <span className="text-2xl font-bold tabular-nums">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-[9px] font-medium text-[#6B5744] mt-1 uppercase tracking-wide">{label}</span>
    </div>
  )
}

export function DropCard({ drop }) {
  const [countdown, setCountdown] = useState(formatCountdown(drop.drop_at))
  const [hyped, setHyped] = useState(false)
  const [hypers, setHypers] = useState(drop.hype_count ?? 0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(drop.drop_at))
    }, 1000)
    return () => clearInterval(interval)
  }, [drop.drop_at])

  function handleHype() {
    setHyped(h => !h)
    setHypers(c => hyped ? c - 1 : c + 1)
  }

  const isLive = countdown.live

  return (
    <div className={cn(
      'paper-card rounded-3xl overflow-hidden transition-shadow hover:shadow-warm-lg',
      isLive ? 'ring-2 ring-accent' : ''
    )}>
      {/* Cover */}
      <div className="relative h-56 overflow-hidden">
        {drop.cover_url
          ? <img src={drop.cover_url} alt={drop.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-[#1A1513] to-[#2D6A4F] flex items-center justify-center">
              <Zap size={48} className="text-white/30" />
            </div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Live badge */}
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-accent text-white rounded-full px-3 py-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-bold uppercase">Live Now</span>
          </div>
        )}

        {/* Hype */}
        <button
          onClick={handleHype}
          className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full px-3 py-1.5"
        >
          <Flame size={14} className={hyped ? 'fill-orange-400 text-orange-400' : ''} />
          <span className="text-xs font-semibold">{formatNumber(hypers)}</span>
        </button>

        {/* Brand + Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link to={`/brand/${drop.brand?.slug}`} className="flex items-center gap-2 mb-1">
            <Avatar src={drop.brand?.logo_url} name={drop.brand?.name} size="xs" />
            <span className="text-white/80 text-xs">{drop.brand?.name}</span>
          </Link>
          <h3 className="text-white font-bold text-base leading-tight">{drop.title}</h3>
        </div>
      </div>

      <div className="p-4">
        {!isLive ? (
          <>
            <p className="text-xs font-semibold text-[#6B5744] uppercase tracking-wide mb-3">Drops in</p>
            <div className="flex items-start gap-2 justify-center">
              <CountdownUnit value={countdown.days} label="days" />
              <span className="text-2xl font-bold text-gray-300 mt-2">:</span>
              <CountdownUnit value={countdown.hours} label="hours" />
              <span className="text-2xl font-bold text-gray-300 mt-2">:</span>
              <CountdownUnit value={countdown.minutes} label="min" />
              <span className="text-2xl font-bold text-gray-300 mt-2">:</span>
              <CountdownUnit value={countdown.seconds} label="sec" />
            </div>
          </>
        ) : (
          <Link
            to={`/brand/${drop.brand?.slug}`}
            className="block w-full bg-accent hover:bg-accent-dark text-white text-sm font-semibold py-3 rounded-xl text-center transition-colors"
          >
            Shop Now →
          </Link>
        )}

        <p className="text-sm text-[#6B5744] mt-3 line-clamp-2">{drop.description}</p>
      </div>
    </div>
  )
}
