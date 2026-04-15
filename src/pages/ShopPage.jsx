import { useState } from 'react';
import { Heart, Share2, Bell, Plus, Flame, Tag } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { brands } from '../data/brands';

const dropPieces = [
  { brandId: 'koyoyu', name: 'Vietnamese-Made Oversized Coach Jacket', price: 89, emoji: '🧥' },
  { brandId: 'toneff', name: 'The Askew Shirt', price: 36, emoji: '👔' },
  { brandId: 'maroon', name: 'Maroon Signature Hoodie', price: 85, emoji: '🧥' },
  { brandId: 'unwastelands', name: 'Vintage Corduroy Overshirt', price: 68, emoji: '🧥' },
  { brandId: 'vintagewknd', name: 'Japanese Denim Work Jacket', price: 95, emoji: '🧥' },
];

// Full product catalog across all brands
const shopProducts = [
  { id: 'sp1', brandId: 'toneff', name: 'Askew Shirt', price: 36, category: 'Tops', tag: 'Drop' },
  { id: 'sp2', brandId: 'maroon', name: 'Signature Hoodie', price: 85, category: 'Tops', tag: 'Bestseller' },
  { id: 'sp3', brandId: 'koyoyu', name: 'Oversized Coach Jacket', price: 89, category: 'Outerwear', tag: 'Drop' },
  { id: 'sp4', brandId: 'unwastelands', name: 'Vintage Corduroy Overshirt', price: 68, category: 'Outerwear', tag: 'Vintage' },
  { id: 'sp5', brandId: 'charmsandlinks', name: 'Custom Charm Bracelet', price: 12, category: 'Accessories', tag: 'Popular' },
  { id: 'sp6', brandId: 'no1apparels', name: 'Honored One Tee', price: 42, category: 'Tops', tag: 'Anime' },
  { id: 'sp7', brandId: 'heritagebay', name: 'Ceplok Diamond Jorts', price: 58, category: 'Bottoms', tag: 'Heritage' },
  { id: 'sp8', brandId: 'vintagewknd', name: 'Japanese Denim Work Jacket', price: 95, category: 'Outerwear', tag: 'Premium' },
  { id: 'sp9', brandId: 'studiogypsied', name: 'Batik Camp Collar Shirt', price: 78, category: 'Tops', tag: 'Heritage' },
  { id: 'sp10', brandId: 'rageyvintage', name: 'Vintage Starter Jacket', price: 55, category: 'Outerwear', tag: 'Vintage' },
  { id: 'sp11', brandId: 'woofies', name: 'Mystery Vintage Tee', price: 10, category: 'Tops', tag: 'Under $15' },
  { id: 'sp12', brandId: 'nearestten', name: 'Curated Denim Bundle', price: 35, category: 'Bottoms', tag: 'Bundle' },
  { id: 'sp13', brandId: 'twoworlds', name: 'Cottagecore Linen Shirt', price: 28, category: 'Tops', tag: 'Thrift' },
  { id: 'sp14', brandId: 'squarishmind', name: 'Abstract Print Oversized Tee', price: 45, category: 'Tops', tag: 'Art' },
  { id: 'sp15', brandId: 'maroon', name: 'Cargo Cap', price: 29, category: 'Accessories', tag: 'Drop' },
  { id: 'sp16', brandId: 'koyoyu', name: 'Wide-Leg Cargo Trousers', price: 72, category: 'Bottoms', tag: 'Drop' },
];

const shopCategories = ['All', 'Drops', 'Tops', 'Outerwear', 'Bottoms', 'Accessories', 'Under $30'];

const cardStyle = {
  background: 'linear-gradient(165deg, #151D13 0%, #131A11 50%, #121810 100%)',
  border: '1px solid rgba(36,56,38,0.5)',
};

export default function ShopPage({ appState, onBrandClick, cart, onCartAdd, onCartRemove }) {
  const { timeLeft, dropInfo } = useCountdown();
  const { wishlisted, toggleWishlist } = appState;
  const [shopFilter, setShopFilter] = useState('All');
  const [notified, setNotified] = useState(false);

  const filtered = shopProducts.filter(p => {
    if (shopFilter === 'All') return true;
    if (shopFilter === 'Drops') return p.tag === 'Drop';
    if (shopFilter === 'Under $30') return p.price < 30;
    return p.category === shopFilter;
  });

  return (
    <div className="min-h-screen pb-24 bg-offblack">
      {/* ===== DROP COUNTDOWN HERO ===== */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, rgba(30,53,32,0.4) 0%, #0A0D08 100%)',
      }}>
        <div className="relative px-6 pt-14 pb-6 text-center">
          <p className="text-gold/40 text-[10px] font-medium tracking-[0.3em] uppercase mb-2">Next Drop</p>
          <h1 className="font-display text-3xl font-bold text-gold mb-1">{dropInfo.month} Drop</h1>
          <p className="text-warm/35 text-xs mb-6">
            First Saturday · {dropInfo.month} {dropInfo.day} · 10AM SGT
          </p>

          <div className="flex justify-center gap-2.5 mb-6">
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

          <button
            onClick={() => setNotified(!notified)}
            className={`font-semibold px-7 py-2.5 rounded-full text-sm flex items-center gap-2 mx-auto transition-all ${
              notified ? 'bg-sage/20 text-sage border border-sage/30' : 'bg-gold text-offblack'
            }`}>
            <Bell size={15} /> {notified ? 'Notified ✓' : 'Get Notified'}
          </button>
        </div>
      </div>

      {/* ===== DROP WIDGET — quick-add drop pieces ===== */}
      <div className="px-4 pt-2 pb-4">
        <div className="rounded-2xl overflow-hidden" style={{
          background: 'linear-gradient(145deg, rgba(42,26,16,0.25) 0%, rgba(30,53,32,0.15) 100%)',
          border: '1px solid rgba(212,168,67,0.18)',
        }}>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{
            background: 'linear-gradient(90deg, rgba(212,168,67,0.08) 0%, rgba(14,20,12,0.5) 100%)',
            borderBottom: '1px solid rgba(212,168,67,0.1)',
          }}>
            <div className="flex items-center gap-2">
              <Flame size={13} className="text-gold" />
              <span className="text-[12px] font-semibold text-gold/90">Drop Preview</span>
            </div>
            <span className="text-[9px] text-warm/40">{dropPieces.length} pieces</span>
          </div>

          <div className="p-3 space-y-1.5">
            {dropPieces.map((piece, i) => {
              const brand = brands.find(b => b.id === piece.brandId);
              const inCart = cart.some(c => c.id === `drop-${i}`);
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl p-2" style={{ background: 'rgba(10,13,8,0.4)' }}>
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center text-lg shrink-0 overflow-hidden" style={{ background: brand?.heroGradient || '#1E3520' }}>
                    {brand?.heroImage ? (
                      <img src={brand.heroImage} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                    ) : piece.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-cream/80 truncate">{piece.name}</p>
                    <p className="text-[10px] text-warm/35">{brand?.shortName} · <span className="text-gold/70">${piece.price}</span></p>
                  </div>
                  <button
                    onClick={() => {
                      if (inCart) return;
                      onCartAdd({ id: `drop-${i}`, name: piece.name, brand: brand?.shortName || '', price: piece.price, qty: 1 });
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      inCart ? 'bg-sage/15 border border-sage/30' : 'bg-gold/10 border border-gold/20'
                    }`}>
                    {inCart ? <span className="text-sage text-[10px] font-bold">✓</span> : <Plus size={13} className="text-gold/80" />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Widget action bar */}
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(36,56,38,0.25)' }}>
            <button
              onClick={() => {
                const text = `Dropping on KitaKakis this Saturday 10AM 🔥 Don't miss the ${dropInfo.month} Drop! #KitaKakis #KitaKakisDrop`;
                if (navigator.share) navigator.share({ text }).catch(() => {});
                else navigator.clipboard?.writeText(text);
              }}
              className="text-[11px] text-warm/45 flex items-center gap-1.5 hover:text-cream/60 transition-colors">
              <Share2 size={11} /> Share drop
            </button>
            {cart.length > 0 && (
              <span className="text-[11px] text-gold/60 font-medium">
                {cart.reduce((s, c) => s + c.qty, 0)} in cart
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ===== SHOP CATALOG ===== */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gold/80 flex items-center gap-2">
            <Tag size={13} /> All Products
          </h2>
          <span className="text-[11px] text-warm/35">{filtered.length} items</span>
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 no-scrollbar -mx-1 px-1">
          {shopCategories.map(cat => (
            <button key={cat} onClick={() => setShopFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                shopFilter === cat ? 'text-gold' : 'text-warm/35'
              }`}
              style={shopFilter === cat ? {
                background: 'rgba(212,168,67,0.08)',
                border: '1px solid rgba(212,168,67,0.2)',
              } : {
                background: 'transparent',
                border: '1px solid rgba(36,56,38,0.3)',
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {filtered.map(product => {
            const brand = brands.find(b => b.id === product.brandId);
            const inCart = cart.some(c => c.id === product.id);
            const wishId = `shop-${product.id}`;
            return (
              <div key={product.id} className="rounded-2xl overflow-hidden group" style={cardStyle}>
                {/* Product image */}
                <div className="aspect-square relative overflow-hidden" style={{ background: brand?.heroGradient || '#1E3520' }}>
                  {brand?.productImages?.[0] ? (
                    <img src={brand.productImages[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : brand?.heroImage ? (
                    <img src={brand.heroImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl opacity-40">
                      {brand?.avatar}
                    </div>
                  )}
                  {/* Tag badge */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded" style={{
                      background: product.tag === 'Drop' ? 'rgba(212,168,67,0.9)' : 'rgba(10,13,8,0.75)',
                      color: product.tag === 'Drop' ? '#0A0D08' : '#D4A843',
                      backdropFilter: 'blur(8px)',
                    }}>{product.tag}</span>
                  </div>
                  {/* Wishlist */}
                  <button onClick={() => toggleWishlist(wishId)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform active:scale-90"
                    style={{ background: 'rgba(10,13,8,0.5)' }}>
                    <Heart size={13} className={wishlisted.has(wishId) ? 'fill-rust text-rust' : 'text-white/50'} />
                  </button>
                </div>
                {/* Product info */}
                <div className="p-2.5">
                  <p className="text-[9px] text-warm/40 uppercase tracking-wider">{brand?.shortName}</p>
                  <p className="text-[12px] text-cream/85 font-medium leading-tight mt-0.5 line-clamp-2">{product.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-gold">${product.price}</span>
                    <button
                      onClick={() => {
                        if (inCart) return;
                        onCartAdd({ id: product.id, name: product.name, brand: brand?.shortName || '', price: product.price, qty: 1 });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all ${
                        inCart ? 'text-sage bg-sage/10 border border-sage/25' : 'text-offblack bg-gold'
                      }`}>
                      {inCart ? '✓ Added' : <><Plus size={10} /> Add</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
