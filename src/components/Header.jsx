import { useState, useRef, useEffect } from 'react';
import { Search, Bell, X } from 'lucide-react';
import { brands } from '../data/brands';

const notifications = [
  { id: 'n1', icon: '🔥', text: 'May Drop goes live this Saturday 10AM', time: '1h ago', unread: true },
  { id: 'n2', icon: '❤️', text: 'KOYOYU STUDIO posted a new collection', time: '3h ago', unread: true },
  { id: 'n3', icon: '⭐', text: "You're 2 stamps away from Early Drop Access", time: '1d ago', unread: false },
  { id: 'n4', icon: '🛍️', text: 'TONÊFF Askew Shirt is almost sold out', time: '2d ago', unread: false },
];

export default function Header({ onBrandClick }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [query, setQuery] = useState('');
  const [hasUnread, setHasUnread] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showSearch) inputRef.current?.focus();
  }, [showSearch]);

  const results = query.trim().length > 0
    ? brands.filter(b =>
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.shortName.toLowerCase().includes(query.toLowerCase()) ||
        b.category.toLowerCase().includes(query.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSelectBrand = (brandId) => {
    setQuery('');
    setShowSearch(false);
    onBrandClick?.(brandId);
  };

  return (
    <header className="sticky top-0 z-50 bg-offblack/95 backdrop-blur-md">
      {showSearch ? (
        <div className="flex items-center gap-2 px-4 py-2.5">
          <Search size={16} className="text-warm/40 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search brands, styles, drops..."
            className="flex-1 bg-transparent text-sm text-cream placeholder-warm/30 focus:outline-none"
          />
          <button onClick={() => { setShowSearch(false); setQuery(''); }} className="text-warm/50">
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-2.5">
          <h1 className="font-display text-xl font-bold text-gold">KitaKakis</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSearch(true)} className="w-8 h-8 rounded-full flex items-center justify-center text-warm/60 hover:text-warm transition-colors">
              <Search size={18} />
            </button>
            <button
              onClick={() => { setShowNotifs(!showNotifs); setHasUnread(false); }}
              className="w-8 h-8 rounded-full flex items-center justify-center relative text-warm/60 hover:text-warm transition-colors">
              <Bell size={18} />
              {hasUnread && <span className="absolute top-1 right-1 w-2 h-2 bg-rust rounded-full" />}
            </button>
          </div>
        </div>
      )}

      {/* Search results dropdown */}
      {showSearch && results.length > 0 && (
        <div className="mx-4 mb-2 rounded-xl overflow-hidden" style={{ background: '#131A12', border: '1px solid rgba(36,56,38,0.5)' }}>
          {results.map(brand => (
            <button
              key={brand.id}
              onClick={() => handleSelectBrand(brand.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 overflow-hidden" style={{ background: brand.heroGradient }}>
                {brand.logo ? (
                  <img src={brand.logo} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                ) : brand.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cream/85 truncate">{brand.name}</p>
                <p className="text-[10px] text-warm/35">{brand.category}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Notifications panel */}
      {showNotifs && (
        <div className="mx-4 mb-2 rounded-xl overflow-hidden" style={{ background: '#131A12', border: '1px solid rgba(36,56,38,0.5)' }}>
          <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(36,56,38,0.3)' }}>
            <span className="text-[11px] font-semibold text-cream/70">Notifications</span>
            <button onClick={() => setShowNotifs(false)} className="text-warm/40"><X size={14} /></button>
          </div>
          {notifications.map(n => (
            <div key={n.id} className="flex items-start gap-3 px-3 py-2.5" style={{ borderBottom: '1px solid rgba(36,56,38,0.15)', background: n.unread ? 'rgba(212,168,67,0.03)' : 'transparent' }}>
              <span className="text-base shrink-0">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-cream/70 leading-snug">{n.text}</p>
                <p className="text-[10px] text-warm/30 mt-0.5">{n.time}</p>
              </div>
              {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
