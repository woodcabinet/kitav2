import { useEffect, useRef, useState } from 'react'
import { formatDate, formatCurrency } from '../../lib/utils'
import { downloadICS, googleCalendarURL } from '../../lib/calendar'
import { CalendarPlus, X, MapPin, Clock, Users } from 'lucide-react'

// Singapore center
const SG_CENTER = [1.3521, 103.8198]
const SG_ZOOM = 12

export function EventMap({ events }) {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return

    let map
    async function initMap() {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      map = L.map(mapContainer.current, {
        center: SG_CENTER,
        zoom: SG_ZOOM,
        zoomControl: true,
        attributionControl: false,
      })

      // Free OpenStreetMap tiles — no token needed
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map)

      events.forEach(event => {
        if (!event.lat || !event.lng) return
        const now = new Date()
        const start = new Date(event.starts_at)
        const end = event.ends_at ? new Date(event.ends_at) : null
        const isLive = start <= now && (!end || end >= now)
        const daysUntil = Math.floor((start - now) / 86400000)

        // Traffic-light coding:
        //   GREEN  = live right now (go!)
        //   AMBER  = today or this week (coming up soon)
        //   RED    = later (1+ week out, or past)
        let color, ring, label
        if (isLive) {
          color = '#16A34A'; ring = 'rgba(22,163,74,0.32)'
          label = 'LIVE'
        } else if (daysUntil >= 0 && daysUntil <= 7) {
          color = '#F59E0B'; ring = 'rgba(245,158,11,0.28)'
          label = daysUntil === 0 ? 'TODAY' : formatDate(event.starts_at, 'EEE')
        } else {
          color = '#D94545'; ring = 'rgba(217,69,69,0.24)'
          label = daysUntil > 7 ? formatDate(event.starts_at, 'd MMM') : 'PAST'
        }

        const pulseHTML = isLive
          ? `<div style="position:absolute;width:52px;height:52px;border-radius:50%;background:${ring};top:-10px;left:-10px;animation:mapPulse 2s ease-in-out infinite;pointer-events:none;"></div>`
          : ''

        // Pointer-style SVG pin (teardrop): rounded head with a tapered
        // point anchored at the bottom-centre. Label sits inside the head.
        const iconHTML = `
          <div style="position:relative;width:32px;height:42px;filter:drop-shadow(0 3px 4px rgba(0,0,0,0.25));">
            ${pulseHTML}
            <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;overflow:visible;">
              <path d="M16 1 C7.16 1 1 7.16 1 16 C1 27 16 41 16 41 C16 41 31 27 31 16 C31 7.16 24.84 1 16 1 Z"
                    fill="${color}" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
              <circle cx="16" cy="16" r="6.5" fill="white" opacity="0.95"/>
              <text x="16" y="19" text-anchor="middle"
                    font-family="ui-sans-serif,system-ui,sans-serif"
                    font-size="7" font-weight="800" fill="${color}">${label}</text>
            </svg>
          </div>
        `

        const icon = L.divIcon({
          html: iconHTML,
          className: 'event-map-pin',
          iconSize: [32, 42],
          iconAnchor: [16, 41], // tip of the pointer sits on the coordinate
        })

        L.marker([event.lat, event.lng], { icon })
          .addTo(map)
          .on('click', () => setSelected(event))
      })

      mapRef.current = map
    }

    initMap()
    return () => { if (map) map.remove() }
  }, [events])

  return (
    <div className="relative rounded-3xl overflow-hidden border border-gray-200">
      <style>{`
        @keyframes mapPulse { 0%,100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.6); opacity: 0; } }
        .event-map-pin { background: transparent !important; border: none !important; }
        .leaflet-container { font-family: inherit; }
      `}</style>

      <div ref={mapContainer} className="h-80 w-full z-0" />

      {/* Legend — traffic light */}
      <div className="absolute top-3 left-3 bg-[#FAF6EE]/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-warm border border-[#E8DDC8] z-[1000]">
        <div className="flex items-center gap-3 text-[10px] font-semibold text-ink">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />Live</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />This week</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D94545]" />Later</span>
        </div>
      </div>

      {selected && <EventPopup event={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function EventPopup({ event, onClose }) {
  const [calDropdown, setCalDropdown] = useState(false)
  const isLive = new Date(event.starts_at) <= new Date() && (!event.ends_at || new Date(event.ends_at) >= new Date())

  const calendarData = {
    title: event.title,
    description: event.description,
    location: event.address || event.venue_name,
    start: event.starts_at,
    end: event.ends_at,
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-4 z-[1001]">
      <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
        <X size={14} className="text-gray-500" />
      </button>

      <div className="flex items-center gap-2 mb-2">
        {isLive && (
          <span className="flex items-center gap-1 bg-[#D94545] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE
          </span>
        )}
        <span className="text-xs text-gray-400">{event.brand?.name}</span>
      </div>

      <h3 className="font-bold text-base text-gray-900 mb-1 pr-8">{event.title}</h3>

      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock size={12} />
          <span className="text-xs">{formatDate(event.starts_at, 'EEE, d MMM · h:mm a')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <MapPin size={12} />
          <span className="text-xs">{event.venue_name}</span>
        </div>
        {event.rsvp_count > 0 && (
          <div className="flex items-center gap-1.5 text-gray-500">
            <Users size={12} />
            <span className="text-xs">{event.rsvp_count} going</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="flex-1 bg-[#D94545] hover:bg-[#a85225] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
          RSVP
        </button>

        <div className="relative">
          <button
            onClick={() => setCalDropdown(d => !d)}
            className="flex items-center gap-1.5 px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <CalendarPlus size={16} />
          </button>
          {calDropdown && (
            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 z-20">
              <a
                href={googleCalendarURL(calendarData)}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Google Calendar
              </a>
              <button
                onClick={() => { downloadICS(calendarData); setCalDropdown(false) }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Download .ics
              </button>
            </div>
          )}
        </div>

        {!event.is_free && (
          <span className="text-sm font-bold text-gray-900">{formatCurrency(event.ticket_price)}</span>
        )}
      </div>
    </div>
  )
}
