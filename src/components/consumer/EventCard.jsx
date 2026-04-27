import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, Check, Store, Zap, Rocket, Palette, Handshake } from 'lucide-react'
import { useState } from 'react'
import { cn, formatDate, formatCurrency } from '../../lib/utils'
import { Avatar } from '../shared/Avatar'

const EVENT_TYPE_META = {
  market:   { label: 'Market',   Icon: Store },
  pop_up:   { label: 'Pop-Up',   Icon: Zap },
  launch:   { label: 'Launch',   Icon: Rocket },
  workshop: { label: 'Workshop', Icon: Palette },
  collab:   { label: 'Collab',   Icon: Handshake },
  other:    { label: 'Event',    Icon: MapPin },
}

function EventTypeBadge({ type, className = '' }) {
  const meta = EVENT_TYPE_META[type] ?? EVENT_TYPE_META.other
  const Icon = meta.Icon
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <Icon size={11} /> {meta.label}
    </span>
  )
}

export function EventCard({ event, compact = false }) {
  const [rsvped, setRsvped] = useState(false)
  const isSoldOut = event.max_capacity && event.rsvp_count >= event.max_capacity

  if (compact) {
    return (
      <div className="flex gap-3 p-3 paper-card rounded-2xl">
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          {event.cover_url
            ? <img src={event.cover_url} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-[#C4B49A] flex items-center justify-center">
                <Calendar size={22} className="text-white" />
              </div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-ink line-clamp-1">{event.title}</p>
          <p className="text-xs text-accent font-medium"><EventTypeBadge type={event.event_type} /></p>
          <div className="flex items-center gap-1 mt-0.5">
            <Calendar size={10} className="text-[#8B7355]" />
            <span className="text-xs text-[#6B5744]">{formatDate(event.starts_at, 'EEE, MMM d · h:mm a')}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={10} className="text-[#8B7355]" />
            <span className="text-xs text-[#6B5744] truncate">{event.venue_name}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="paper-card rounded-3xl overflow-hidden hover:shadow-warm-lg transition-shadow">
      {/* Cover */}
      <div className="relative h-44 overflow-hidden">
        {event.cover_url
          ? <img src={event.cover_url} alt={event.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-[#C4B49A] to-[#E8DDD1] flex items-center justify-center">
              <Calendar size={42} className="text-white" />
            </div>
        }
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-white rounded-xl px-2.5 py-1.5 shadow-md">
          <p className="text-[10px] font-semibold text-accent uppercase">{formatDate(event.starts_at, 'MMM')}</p>
          <p className="text-lg font-bold text-ink leading-none">{formatDate(event.starts_at, 'd')}</p>
        </div>
        {/* Type badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
          <span className="text-white text-xs font-medium"><EventTypeBadge type={event.event_type} /></span>
        </div>
        {/* Free/Price */}
        <div className="absolute bottom-3 right-3">
          {event.is_free
            ? <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">FREE</span>
            : <span className="bg-white text-ink text-xs font-bold px-2.5 py-1 rounded-full shadow">{formatCurrency(event.ticket_price)}</span>
          }
        </div>
      </div>

      <div className="p-4">
        {/* Brand */}
        <Link to={`/brand/${event.brand?.slug}`} className="flex items-center gap-2 mb-2">
          <Avatar src={event.brand?.logo_url} name={event.brand?.name} size="xs" />
          <span className="text-xs text-[#6B5744]">{event.brand?.name}</span>
        </Link>

        <h3 className="font-bold text-base text-ink mb-2 line-clamp-2">{event.title}</h3>

        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-[#6B5744]">
            <Clock size={13} />
            <span className="text-xs">{formatDate(event.starts_at, 'EEE, d MMM · h:mm a')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6B5744]">
            <MapPin size={13} />
            <span className="text-xs truncate">{event.venue_name}, {event.address?.split(',').slice(-2).join(',').trim()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6B5744]">
            <Users size={13} />
            <span className="text-xs">
              {event.rsvp_count} going
              {event.max_capacity && ` · ${event.max_capacity - event.rsvp_count} spots left`}
            </span>
          </div>
        </div>

        <button
          onClick={() => setRsvped(r => !r)}
          disabled={isSoldOut && !rsvped}
          className={cn(
            'w-full h-11 rounded-full text-sm font-semibold transition-all inline-flex items-center justify-center gap-1.5',
            isSoldOut && !rsvped
              ? 'bg-gray-100 text-[#8B7355] cursor-not-allowed'
              : rsvped
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-accent text-white hover:bg-accent-dark active:scale-[0.97]'
          )}
        >
          {isSoldOut && !rsvped ? 'Sold Out' : rsvped ? <><Check size={14} /> Going</> : 'RSVP Now'}
        </button>
      </div>
    </div>
  )
}
