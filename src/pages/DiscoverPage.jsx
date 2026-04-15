import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, TrendingUp, Sparkles, Calendar, Heart, Clock, Users, ExternalLink, ChevronRight, Flame, Star, Zap } from 'lucide-react';
import { brands } from '../data/brands';

// Real SG events scraped from web
const events = [
  {
    id: 'e0', title: 'ARTBOX Camp 2026', date: 'Apr 3–5 & 10–12', time: '12–11PM',
    venue: 'Singapore Expo Hall 3, 1 Expo Drive', area: 'SG Expo',
    desc: '250+ rising brands, street food, art installations & Wiggle Wiggle showcase. Singapore\'s boldest creative festival.',
    entry: '$7–8', type: 'Fair',
    tags: ['250+ Brands', 'Art', 'F&B'],
    coords: { top: '55%', left: '92%' },
    color: '#D4A843',
    hot: true,
    featured: true,
  },
  {
    id: 'e1', title: 'Resurrack @ Bugis Art Lane', date: 'Every Sat & Sun', time: '3–9PM',
    venue: 'Bugis Street Art Lane', area: 'Bugis',
    desc: '50+ vintage vendors, live music, photo booths. Singapore\'s vibiest weekend flea.',
    entry: 'Free', type: 'Weekly',
    tags: ['Vintage', 'Thrift', 'Live Music'],
    coords: { top: '35%', left: '62%' },
    color: '#D4A843',
    hot: true,
  },
  {
    id: 'e2', title: 'The Retro Factory Vintage Flea', date: 'Apr 3–5', time: 'Fri-Sat 1–10PM, Sun 11AM–8PM',
    venue: 'Katong Square, 88 East Coast Rd', area: 'Katong',
    desc: 'Antiques, retro fashion, vinyl records, luxury handbags & rare collectibles.',
    entry: 'Free', type: 'Pop-Up',
    tags: ['Vintage', 'Antiques', 'Vinyl'],
    coords: { top: '72%', left: '78%' },
    color: '#C4622D',
  },
  {
    id: 'e3', title: '*SCAPE POP! Market', date: 'Every Sat & Sun', time: '12–6PM',
    venue: '*SCAPE, 2 Orchard Link', area: 'Somerset',
    desc: 'Pre-loved fashion, accessories & indie brands. Right above Somerset MRT.',
    entry: 'Free', type: 'Weekly',
    tags: ['Pre-loved', 'Fashion', 'Indie'],
    coords: { top: '45%', left: '38%' },
    color: '#7A9E7A',
  },
  {
    id: 'e4', title: 'Night at Orchard', date: 'May 29–31', time: '3–10PM',
    venue: 'Wisma Atria to Ngee Ann City', area: 'Orchard',
    desc: 'Street market along Orchard pedestrian walkway. Fashion, F&B, and live acts.',
    entry: 'Free', type: 'Seasonal',
    tags: ['Night Market', 'Fashion', 'F&B'],
    coords: { top: '42%', left: '32%' },
    color: '#F2D279',
  },
  {
    id: 'e5', title: 'Cosford Container Park Flea', date: 'Apr 11', time: '1–9PM',
    venue: 'Cosford Container Park, 30 Cosford Rd', area: 'Changi',
    desc: 'Themed weekly flea — vintage clothing, chic fashion, gorgeous jewellery + F&B.',
    entry: 'Free', type: 'Pop-Up',
    tags: ['Vintage', 'Themed', 'Container'],
    coords: { top: '48%', left: '88%' },
    color: '#C4622D',
  },
  {
    id: 'e6', title: 'Boutique Fairs', date: 'May 15–17', time: '10AM–8PM',
    venue: 'F1 Pit Building, 1 Republic Blvd', area: 'Marina Bay',
    desc: 'Massive fair showcasing design-forward treasures from SG-based small businesses.',
    entry: '$5', type: 'Fair',
    tags: ['Design', 'Local Brands', 'Premium'],
    coords: { top: '60%', left: '55%' },
    color: '#D4A843',
  },
  {
    id: 'e7', title: 'Me-You Market (Eid Core)', date: 'May 16–17', time: '11AM–9PM',
    venue: 'Suntec Convention Centre, Hall 404', area: 'Suntec',
    desc: 'Regional brands — modest fashion, jewellery, knick-knacks & F&B.',
    entry: 'Free', type: 'Pop-Up',
    tags: ['Modest Fashion', 'Regional', 'Eid'],
    coords: { top: '50%', left: '65%' },
    color: '#7A9E7A',
  },
  {
    id: 'e8', title: 'Refash Go Green Market', date: 'Ongoing', time: '10AM–9PM',
    venue: 'Chinatown Point, 133 New Bridge Rd', area: 'Chinatown',
    desc: 'Sustainable thrift pop-up. Pre-loved clothing at bargain prices.',
    entry: 'Free', type: 'Pop-Up',
    tags: ['Sustainable', 'Thrift', 'Bargain'],
    coords: { top: '65%', left: '48%' },
    color: '#7A9E7A',
  },
];

const trending = [
  { name: 'Maroon Signature Hoodie', brand: 'MAROON', brandId: 'maroon', price: 85, wishes: 312, emoji: '🧥', hot: true },
  { name: 'The Askew Shirt', brand: 'TONÊFF', brandId: 'toneff', price: 36, wishes: 287, emoji: '👔' },
  { name: 'Oversized Coach Jacket', brand: 'KOYOYU STUDIO', brandId: 'koyoyu', price: 89, wishes: 241, emoji: '🧥' },
  { name: 'Corduroy Overshirt', brand: 'UN.WASTELANDS', brandId: 'unwastelands', price: 68, wishes: 198, emoji: '🧥' },
  { name: 'Batik Collared Blouse', brand: 'STUDIO GYPSIED', brandId: 'studiogypsied', price: 88, wishes: 156, emoji: '👔' },
  { name: 'Starcloud Lullaby Charm', brand: 'CHARMS & LINKS', brandId: 'charmsandlinks', price: 2, wishes: 134, emoji: '⭐' },
];

// Singapore map locations with real lat/lng
const mapLocations = [
  { name: 'Bugis', lat: 1.3008, lng: 103.8553, events: 1, stores: 2, color: '#D4A843' },
  { name: 'Somerset', lat: 1.3006, lng: 103.8383, events: 1, stores: 1, color: '#7A9E7A' },
  { name: 'Orchard', lat: 1.3048, lng: 103.8318, events: 1, stores: 0, color: '#F2D279' },
  { name: 'Katong', lat: 1.3050, lng: 103.9050, events: 1, stores: 0, color: '#C4622D' },
  { name: 'Haji Lane', lat: 1.3015, lng: 103.8596, events: 0, stores: 3, color: '#D4A843' },
  { name: 'Marina Bay', lat: 1.2816, lng: 103.8636, events: 1, stores: 0, color: '#D4A843' },
  { name: 'Chinatown', lat: 1.2839, lng: 103.8448, events: 1, stores: 1, color: '#7A9E7A' },
  { name: 'Changi', lat: 1.3344, lng: 103.9625, events: 1, stores: 0, color: '#C4622D' },
  { name: 'SG Expo', lat: 1.3350, lng: 103.9590, events: 1, stores: 0, color: '#F2D279' },
];

export default function DiscoverPage({ onBrandClick }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [eventFilter, setEventFilter] = useState('all');
  const [rsvpd, setRsvpd] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Inject pin animation styles
    if (!document.querySelector('#kk-pin-styles')) {
      const style = document.createElement('style');
      style.id = 'kk-pin-styles';
      style.textContent = `
        .kk-pin { transition: transform 0.2s; cursor: pointer; }
        .kk-pin:hover { transform: scale(1.2) translateY(-4px) !important; }
        @keyframes kk-pin-drop {
          0% { transform: translateY(-40px); opacity: 0; }
          60% { transform: translateY(4px); opacity: 1; }
          80% { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }
        .kk-pin-anim { animation: kk-pin-drop 0.5s ease-out forwards; }
        .leaflet-container { background: #0A0D08 !important; }
      `;
      document.head.appendChild(style);
    }

    const initMap = () => {
      if (!mapRef.current || !window.L) return;

      const map = window.L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
        tap: true,
      }).setView([1.3050, 103.8569], 12);

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 16,
        minZoom: 11,
      }).addTo(map);

      // Add pin markers
      mapLocations.forEach((loc, i) => {
        const pinSvg = `
          <div class="kk-pin kk-pin-anim" style="animation-delay:${i * 0.08}s;width:28px;height:40px;">
            <svg viewBox="0 0 28 40" width="28" height="40">
              <defs>
                <filter id="ps${i}" x="-30%" y="-10%" width="160%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000" flood-opacity="0.5"/>
                </filter>
              </defs>
              <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z"
                    fill="${loc.color}" filter="url(#ps${i})"/>
              <circle cx="14" cy="13" r="5.5" fill="rgba(0,0,0,0.15)"/>
              <circle cx="14" cy="13" r="3.5" fill="rgba(255,255,255,0.85)"/>
            </svg>
          </div>`;

        const icon = window.L.divIcon({
          html: pinSvg,
          className: '',
          iconSize: [28, 40],
          iconAnchor: [14, 40],
          popupAnchor: [0, -40],
        });

        const marker = window.L.marker([loc.lat, loc.lng], { icon }).addTo(map);

        // Tooltip with location name
        marker.bindTooltip(loc.name, {
          direction: 'top',
          offset: [0, -42],
          className: 'kk-tooltip',
          permanent: false,
        });

        marker.on('click', () => {
          setSelectedLocation(prev => prev === loc.name ? null : loc.name);
        });
      });

      mapInstanceRef.current = map;
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const toggleRsvp = (id) => {
    setRsvpd(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const baseEvents = eventFilter === 'all' ? events :
    eventFilter === 'this-week' ? events.filter(e => e.type === 'Weekly' || e.date.includes('Ongoing')) :
    eventFilter === 'pop-up' ? events.filter(e => e.type === 'Pop-Up') :
    events.filter(e => e.type === 'Fair' || e.type === 'Seasonal');

  const q = searchQuery.trim().toLowerCase();
  const filteredEvents = q
    ? baseEvents.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.desc.toLowerCase().includes(q) ||
        e.area.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q))
      )
    : baseEvents;

  const filteredBrands = q
    ? brands.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.shortName.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      )
    : null; // null means "show default sections"

  const locationEvents = selectedLocation
    ? events.filter(e => e.area === selectedLocation)
    : null;

  return (
    <div className="min-h-screen pb-24 bg-offblack">
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display text-xl font-bold text-gold">Discover</h1>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] text-sage/70 font-medium" style={{
            background: 'rgba(122,158,122,0.08)',
            border: '1px solid rgba(122,158,122,0.15)',
          }}>
            <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
            {events.filter(e => e.type === 'Weekly').length} live events
          </div>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm/25" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search brands, events, pieces..."
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-cream placeholder-warm/25 focus:outline-none"
            style={{ background: '#131A12', border: '1px solid rgba(36,56,38,0.4)' }}
          />
        </div>
      </div>

      {/* Interactive Map */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl overflow-hidden relative" style={{
          border: '1px solid rgba(36,56,38,0.5)',
        }}>
          <div ref={mapRef} style={{ height: 220, width: '100%' }} />

          {/* Map overlay label */}
          <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{
            background: 'rgba(10,13,8,0.85)', border: '1px solid rgba(36,56,38,0.4)',
          }}>
            <MapPin size={11} className="text-gold/70" />
            <span className="text-[10px] text-gold/60 font-medium">Singapore</span>
          </div>

          {/* Legend overlay */}
          <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-3 px-2 py-1 rounded-lg" style={{
            background: 'rgba(10,13,8,0.85)', border: '1px solid rgba(36,56,38,0.4)',
          }}>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-[8px] text-warm/40">Events</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-sage" />
              <span className="text-[8px] text-warm/40">Stores</span>
            </div>
          </div>

          {/* Tap hint */}
          <div className="absolute bottom-3 right-3 z-[1000] px-2 py-1 rounded-lg" style={{
            background: 'rgba(10,13,8,0.75)',
          }}>
            <span className="text-[8px] text-warm/25">Tap pins to explore</span>
          </div>
        </div>

        {/* Location detail popover */}
        {selectedLocation && locationEvents && locationEvents.length > 0 && (
          <div className="mt-2 rounded-xl p-3 animate-fade-in" style={{
            background: 'linear-gradient(165deg, #151D13 0%, #131A11 100%)',
            border: '1px solid rgba(212,168,67,0.12)',
          }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-gold/70" />
                <span className="text-[12px] font-semibold text-cream/80">{selectedLocation}</span>
                <span className="text-[9px] text-warm/30">{locationEvents.length} event{locationEvents.length > 1 ? 's' : ''}</span>
              </div>
              <button onClick={() => setSelectedLocation(null)} className="text-[10px] text-warm/30">Close</button>
            </div>
            {locationEvents.map(ev => (
              <div key={ev.id} className="flex items-center gap-2.5 py-1.5" style={{ borderTop: '1px solid rgba(36,56,38,0.2)' }}>
                <div className="w-1.5 h-6 rounded-full shrink-0" style={{ background: ev.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-cream/70 truncate">{ev.title}</p>
                  <p className="text-[9px] text-warm/30">{ev.date} · {ev.time}</p>
                </div>
                <button
                  onClick={() => toggleRsvp(ev.id)}
                  className={`px-2 py-0.5 rounded text-[9px] font-semibold shrink-0 ${rsvpd.has(ev.id) ? 'text-sage/80' : 'text-gold/70'}`}
                  style={{ background: rsvpd.has(ev.id) ? 'rgba(122,158,122,0.1)' : 'rgba(212,168,67,0.06)', border: `1px solid ${rsvpd.has(ev.id) ? 'rgba(122,158,122,0.15)' : 'rgba(212,168,67,0.12)'}` }}
                >
                  {rsvpd.has(ev.id) ? 'Going' : 'RSVP'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Filter Pills */}
      <div className="px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Events', icon: Calendar },
            { id: 'this-week', label: 'This Week', icon: Flame },
            { id: 'pop-up', label: 'Pop-Ups', icon: Zap },
            { id: 'special', label: 'Fairs', icon: Star },
          ].map(f => (
            <button key={f.id} onClick={() => setEventFilter(f.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                eventFilter === f.id ? 'text-gold' : 'text-warm/35'
              }`}
              style={eventFilter === f.id ? {
                background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)',
              } : {
                background: 'rgba(10,13,8,0.5)', border: '1px solid rgba(36,56,38,0.3)',
              }}>
              <f.icon size={11} /> {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold text-cream/80 flex items-center gap-1.5">
            <Calendar size={14} className="text-rust/60" />
            Events & Markets
          </h2>
          <span className="text-[10px] text-warm/30">{filteredEvents.length} events</span>
        </div>
        <div className="space-y-2.5">
          {filteredEvents.map((ev, i) => (
            <div key={ev.id} className="rounded-2xl overflow-hidden animate-fade-in" style={{
              animationDelay: `${i * 0.05}s`,
              background: ev.featured
                ? 'linear-gradient(165deg, #1A1A0E 0%, #161510 50%, #131108 100%)'
                : 'linear-gradient(165deg, #151D13 0%, #131A11 50%, #121810 100%)',
              border: ev.featured ? '1.5px solid rgba(212,168,67,0.3)' : '1px solid rgba(36,56,38,0.5)',
            }}>
              {/* Featured banner */}
              {ev.featured && (
                <div className="px-3 py-1.5 flex items-center justify-between text-[9px] font-bold" style={{
                  background: 'linear-gradient(90deg, rgba(212,168,67,0.15), rgba(212,168,67,0.03))',
                  borderBottom: '1px solid rgba(212,168,67,0.1)',
                }}>
                  <span className="text-gold flex items-center gap-1"><Star size={9} /> FEATURED — THIS WEEKEND</span>
                  <span className="text-gold/50">250+ brands</span>
                </div>
              )}
              {/* Color accent bar */}
              <div className={ev.featured ? 'h-1.5' : 'h-1'} style={{ background: `linear-gradient(90deg, ${ev.color}, ${ev.featured ? ev.color + '44' : 'transparent'})` }} />

              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[13px] font-semibold text-cream/90 truncate">{ev.title}</h3>
                      {ev.hot && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-rust bg-rust/10 shrink-0 flex items-center gap-0.5">
                          <Flame size={7} /> HOT
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-cream/50 leading-relaxed">{ev.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold shrink-0" style={{
                    color: ev.color,
                    background: `${ev.color}10`,
                    border: `1px solid ${ev.color}20`,
                  }}>{ev.type}</span>
                </div>

                <div className="flex items-center gap-4 mb-2.5 text-[10px] text-warm/40">
                  <span className="flex items-center gap-1"><Calendar size={9} className="text-gold/50" /> {ev.date}</span>
                  <span className="flex items-center gap-1"><Clock size={9} className="text-gold/50" /> {ev.time}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-3 text-[10px] text-warm/40">
                  <MapPin size={9} className="text-rust/50" />
                  <span>{ev.venue}</span>
                  <span className="text-warm/20">·</span>
                  <span className={ev.entry === 'Free' ? 'text-sage/60 font-medium' : 'text-gold/60 font-medium'}>{ev.entry === 'Free' ? '🆓 Free' : `💰 ${ev.entry}`}</span>
                </div>

                {/* Tags */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {ev.tags.map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 rounded text-[8px] text-warm/35" style={{
                        background: 'rgba(30,53,32,0.2)', border: '1px solid rgba(36,56,38,0.3)',
                      }}>{tag}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => toggleRsvp(ev.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                      rsvpd.has(ev.id) ? 'text-sage/80' : 'text-gold/80'
                    }`}
                    style={rsvpd.has(ev.id) ? {
                      background: 'rgba(122,158,122,0.08)', border: '1px solid rgba(122,158,122,0.2)',
                    } : {
                      background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)',
                    }}
                  >
                    {rsvpd.has(ev.id) ? '✓ Going' : 'RSVP'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand search results */}
      {filteredBrands !== null && (
        <div className="px-4 mb-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Search size={14} className="text-gold/50" />
            <h2 className="text-sm font-semibold text-cream/80">Brands ({filteredBrands.length})</h2>
          </div>
          {filteredBrands.length === 0 ? (
            <p className="text-[12px] text-warm/30 py-4 text-center">No brands found</p>
          ) : (
            <div className="space-y-2">
              {filteredBrands.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => onBrandClick?.(brand.id)}
                  className="w-full flex items-center gap-3 rounded-xl p-2.5 active:scale-[0.98] transition-transform text-left"
                  style={{ background: '#111A10', border: '1px solid rgba(36,56,38,0.4)' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base shrink-0 overflow-hidden" style={{ background: brand.heroGradient }}>
                    {brand.logo ? <img src={brand.logo} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} /> : brand.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cream/85 truncate">{brand.name}</p>
                    <p className="text-[10px] text-warm/35">{brand.category} · {brand.location}</p>
                  </div>
                  <ChevronRight size={14} className="text-warm/25 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New on KitaKakis */}
      {filteredBrands === null && (
      <div className="px-4 mb-5">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles size={14} className="text-gold/50" />
          <h2 className="text-sm font-semibold text-cream/80">New on KitaKakis</h2>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {brands.filter(b => b.founded >= 2022).map(brand => (
            <button
              key={brand.id}
              onClick={() => onBrandClick?.(brand.id)}
              className="min-w-[130px] rounded-xl overflow-hidden shrink-0 transition-all active:scale-[0.97]"
              style={{ background: '#111A10', border: '1px solid rgba(36,56,38,0.4)' }}
            >
              <div className="h-16 relative" style={{ background: brand.heroGradient }}>
                {brand.heroImage && <img src={brand.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111A10]" />
              </div>
              <div className="px-2.5 pb-2.5 -mt-4 relative">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm mb-1 overflow-hidden shadow" style={{
                  background: brand.heroGradient, border: '1.5px solid rgba(36,56,38,0.5)',
                }}>
                  {brand.logo ? <img src={brand.logo} alt={brand.shortName} className="w-full h-full object-cover" /> : brand.avatar}
                </div>
                <p className="font-medium text-[11px] text-cream/80 truncate">{brand.shortName}</p>
                <p className="text-[9px] text-warm/30 truncate">{brand.category}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      )}

      {/* Trending */}
      <div className="px-4 pb-6">
        <div className="flex items-center gap-1.5 mb-2.5">
          <TrendingUp size={14} className="text-rust/60" />
          <h2 className="text-sm font-semibold text-cream/80">Trending This Week</h2>
        </div>
        <div className="space-y-2">
          {trending.map((item, i) => {
            const b = brands.find(x => x.id === item.brandId);
            const img = b?.drops?.[0]?.image || b?.heroImage;
            return (
              <div key={i} className="rounded-xl p-2.5 flex items-center gap-2.5" style={{ background: '#111A10' }}>
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base shrink-0 overflow-hidden" style={{ background: b?.heroGradient || '#1E3520' }}>
                    {img ? <img src={img} alt={item.name} className="w-full h-full object-cover" /> : item.emoji}
                  </div>
                  {item.hot && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rust flex items-center justify-center">
                      <Flame size={8} className="text-white" />
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -left-0.5 w-4 h-4 rounded-full bg-offblack flex items-center justify-center text-[8px] font-bold text-warm/50 border border-warm/10">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-cream/80 truncate">{item.name}</p>
                  <p className="text-[10px] text-warm/30">{item.brand}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-semibold text-gold/80">${item.price}</p>
                  <p className="text-[10px] text-warm/30 flex items-center gap-0.5 justify-end">
                    <Heart size={8} className="text-rust/50" /> {item.wishes}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
