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
        const isHappening = start <= now && (!end || end >= now)

        const color = isHappening ? '#D94545' : '#1A1513'
        const pulseHTML = isHappening
          ? `<div style="position:absolute;width:44px;height:44px;border-radius:50%;background:rgba(217,69,69,0.35);top:-6px;left:-6px;animation:mapPulse 2s ease-in-out infinite;"></div>`
          : ''

        const iconHTML = `
          <div style="position:relative;width:32px;height:32px;">
            ${pulseHTML}
            <div style="width:32px;height:32px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;cursor:pointer;">
              <span style="color:white;font-size:10px;font-weight:700;">${isHappening ? '!' : formatDate(event.starts_at, 'd')}</span>
            </div>
          </div>
        `

        const icon = L.divIcon({
          html: iconHTML,
          className: 'event-map-pin',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
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

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm z-[1000]">
        <div className="flex items-center gap-3 text-[10px] font-semibold">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#D94545] animate-pulse" />Live</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#1A1513]" />Upcoming</span>
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
          <span className="flex items-center gap-1 bg-[#D94545] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
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
