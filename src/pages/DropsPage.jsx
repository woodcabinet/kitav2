import { Heart, Share2, Bell } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { brands } from '../data/brands';

const dropPieces = [
  { brandId: 'koyoyu', name: 'Vietnamese-Made Oversized Coach Jacket', price: 89, emoji: '🧥' },
  { brandId: 'toneff', name: 'The Askew Shirt', price: 36, emoji: '👔' },
  { brandId: 'maroon', name: 'Maroon Signature Hoodie', price: 85, emoji: '🧥' },
  { brandId: 'unwastelands', name: 'Vintage Corduroy Overshirt', price: 68, emoji: '🧥' },
  { brandId: 'vintagewknd', name: 'Japanese Denim Work Jacket', price: 95, emoji: '🧥' },
];

export default function DropsPage({ appState, onBrandClick }) {
  const { timeLeft, dropInfo } = useCountdown();
  const { wishlisted, toggleWishlist } = appState;

  const shareCaption = (piece) => {
    const brand = brands.find(b => b.id === piece.brandId);
    const text = `Dropping on KitaKakis this Saturday 10AM 🔥 ${brand?.name} ${piece.name} — link in bio #KitaKakis #KitaKakisDrop #SGfashion`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-offblack">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, rgba(30,53,32,0.4) 0%, #0A0D08 100%)',
      }}>
        <div className="relative px-6 pt-14 pb-10 text-center">
          <p className="text-gold/40 text-[10px] font-medium tracking-[0.3em] uppercase mb-2">Next Drop</p>
          <h1 className="font-display text-3xl font-bold text-gold mb-1">{dropInfo.month} Drop</h1>
          <p className="text-warm/35 text-xs mb-8">
            First Saturday · {dropInfo.month} {dropInfo.day} · 10AM SGT
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-2.5 mb-8">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.minutes, label: 'Mins' },
              { val: timeLeft.seconds, label: 'Secs' },
            ].map((t, i) => (
              <div key={i} className="w-16">
                <div className="rounded-xl py-2.5 px-2 mb-1" style={{ background: '#111A10' }}>
                  <span className="font-display text-2xl font-bold text-gold tabular-nums">
                    {String(t.val).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-[9px] text-warm/30 uppercase tracking-wider">{t.label}</p>
              </div>
            ))}
          </div>

          <button className="bg-gold text-offblack font-semibold px-7 py-2.5 rounded-full text-sm flex items-center gap-2 mx-auto">
            <Bell size={15} /> Get Notified
          </button>
        </div>
      </div>

      {/* Participating Brands */}
      <div className="px-4 py-5">
        <h2 className="text-sm font-semibold text-gold/80 mb-3">Participating Brands</h2>
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {brands.slice(0, 5).map(brand => (
            <button
              key={brand.id}
              onClick={() => onBrandClick?.(brand.id)}
              className="flex flex-col items-center gap-1.5 min-w-[60px]"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg overflow-hidden" style={{ background: '#1E3520' }}>
                {brand.logo ? <img src={brand.logo} alt={brand.shortName} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} /> : brand.avatar}
              </div>
              <p className="text-[10px] text-warm/40 text-center leading-tight">{brand.shortName}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Drop Pieces */}
      <div className="px-4 pb-6">
        <h2 className="text-sm font-semibold text-gold/80 mb-3">Preview Pieces</h2>
        <div className="space-y-2">
          {dropPieces.map((piece, i) => {
            const brand = brands.find(b => b.id === piece.brandId);
            const id = `drop-piece-${i}`;
            return (
              <div key={i} className="rounded-xl overflow-hidden flex" style={{ background: '#111A10' }}>
                <div
                  className="w-20 h-20 flex items-center justify-center text-2xl shrink-0 overflow-hidden relative"
                  style={{ background: brand?.heroGradient || '#1E3520' }}
                >
                  {(brand?.drops?.find(d => d.name === piece.name)?.image || brand?.heroImage) ? (
                    <img src={brand?.drops?.find(d => d.name === piece.name)?.image || brand?.heroImage} alt={piece.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; e.target.nextSibling && (e.target.nextSibling.style.display='flex'); }} />
                  ) : null}
                  <span className={`${(brand?.drops?.find(d => d.name === piece.name)?.image || brand?.heroImage) ? 'hidden' : ''}`}>{piece.emoji}</span>
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-warm/30">{brand?.name}</p>
                    <p className="text-sm font-medium text-cream/80 leading-tight">{piece.name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gold/80 font-semibold">${piece.price}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleWishlist(id)} className="transition-transform active:scale-90">
                        <Heart size={15} className={wishlisted.has(id) ? 'fill-rust text-rust' : 'text-warm/25'} />
                      </button>
                      <button onClick={() => shareCaption(piece)} className="text-warm/25 hover:text-warm/50 transition-colors">
                        <Share2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Drop */}
      <div className="px-4 pb-8">
        <button
          onClick={() => {
            const text = `Dropping on KitaKakis this Saturday 10AM 🔥 Don't miss the ${dropInfo.month} Drop! #KitaKakis #KitaKakisDrop #SGfashion`;
            if (navigator.share) navigator.share({ text }).catch(() => {});
            else navigator.clipboard?.writeText(text);
          }}
          className="w-full py-2.5 rounded-xl text-gold/50 text-sm font-medium flex items-center justify-center gap-2"
          style={{ border: '1px dashed rgba(212,168,67,0.15)' }}
        >
          <Share2 size={15} /> Share this Drop
        </button>
      </div>
    </div>
  );
}
