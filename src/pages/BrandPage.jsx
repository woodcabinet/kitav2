import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, ExternalLink, Globe, MessageCircle, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import TikTokBadge from '../components/TikTokBadge';
import { getBrandById } from '../data/brands';

function ImageWithFallback({ src, fallback, alt, className, style }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <div className={className} style={style}>{fallback}</div>;
  }
  return <img src={src} alt={alt} className={className} style={{ ...style, objectFit: 'cover' }} onError={() => setFailed(true)} />;
}

export default function BrandPage({ brandId, appState, onBack }) {
  const brand = getBrandById(brandId);
  const [activeTab, setActiveTab] = useState('feed');
  const [slideIndex, setSlideIndex] = useState(0);
  const { following, toggleFollow, tiktokSync, toggleTiktokSync, wishlisted, toggleWishlist } = appState;

  if (!brand) return null;

  const isFollowing = following.has(brand.id);
  const isSynced = tiktokSync.has(brand.id);
  const tabs = ['Feed', 'TikTok', 'Drops', 'About'];

  // Slideshow images — use productImages, heroImage, or fallback to gradient
  const slides = brand.productImages?.length > 0
    ? brand.productImages
    : brand.heroImage ? [brand.heroImage] : [];

  // Auto-advance slideshow
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen pb-24 bg-offblack">
      {/* Hero Slideshow */}
      <div className="relative h-56 overflow-hidden">
        {slides.length > 0 ? (
          <>
            {slides.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${brand.name} ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === slideIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            {/* Slide dots */}
            {slides.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === slideIndex ? 'bg-white w-4' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: brand.heroGradient }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-offblack" />

        {/* Logo overlay */}
        {brand.logo && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10">
            <img src={brand.logo} alt={brand.name} className="h-8 object-contain drop-shadow-lg" onError={(e) => e.target.style.display='none'} />
          </div>
        )}

        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10"
        >
          <ArrowLeft size={16} className="text-white" />
        </button>
      </div>

      {/* Brand Info */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="flex items-end gap-3 mb-3">
          <div className="w-16 h-16 rounded-xl border-3 border-offblack flex items-center justify-center text-2xl shadow-lg overflow-hidden" style={{
            background: brand.heroGradient,
          }}>
            {brand.logo ? (
              <img src={brand.logo} alt="" className="w-full h-full object-cover p-1.5" onError={(e) => { e.target.style.display='none'; e.target.parentNode.textContent = brand.avatar; }} />
            ) : brand.avatar}
          </div>
          <div className="flex-1 pb-0.5">
            <h1 className="text-lg font-bold text-cream/95">{brand.name}</h1>
            {brand.tagline && <p className="text-[11px] text-warm/40 italic">{brand.tagline}</p>}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {brand.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded text-[9px] text-warm/50" style={{ background: 'rgba(30,53,32,0.3)' }}>{tag}</span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-5 mb-3">
          <div><span className="font-bold text-gold text-sm">{brand.followers.toLocaleString()}</span> <span className="text-[10px] text-warm/30">followers</span></div>
          <div><span className="font-bold text-cream/70 text-sm">{brand.dropCount}</span> <span className="text-[10px] text-warm/30">drops</span></div>
          <div><span className="font-bold text-sage/70 text-sm">{brand.sellThrough}</span> <span className="text-[10px] text-warm/30">sell-through</span></div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => toggleFollow(brand.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              isFollowing ? 'text-gold border border-gold/20 bg-gold/5' : 'bg-gold text-offblack'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          {brand.tiktokHandle && (
            <button
              onClick={() => toggleTiktokSync(brand.id, brand.tiktokHandle)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isSynced ? 'text-tiktok bg-tiktok/5 border border-tiktok/20' : 'text-warm/40 bg-[#111A10]'
              }`}
            >
              <TikTokBadge small />
              {isSynced ? 'Synced' : 'Sync'}
            </button>
          )}
          {brand.website && (
            <a href={brand.website} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-sm text-warm/40 bg-[#111A10] flex items-center gap-1">
              <Globe size={13} /> Site
            </a>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06]">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors relative ${
                activeTab === tab.toLowerCase() ? 'text-gold' : 'text-warm/30'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gold rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4">
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {/* Product showcase posts */}
            {brand.drops.slice(0, 4).map((drop, i) => (
              <div key={drop.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ background: '#1E3520' }}>{brand.avatar}</div>
                  <span className="text-xs font-medium text-cream/70">{brand.name}</span>
                  <span className="text-[10px] text-warm/25">{i + 1}d ago</span>
                </div>
                {drop.image ? (
                  <img src={drop.image} alt={drop.name} className="w-full aspect-square object-cover rounded-lg mb-2" onError={(e) => {
                    e.target.style.display = 'none';
                  }} />
                ) : (
                  <div className="w-full aspect-square rounded-lg mb-2 flex items-center justify-center text-5xl" style={{ background: brand.heroGradient }}>
                    {drop.emoji}
                  </div>
                )}
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-cream/80">{drop.name}</p>
                  <span className="text-gold font-semibold text-sm">${drop.price}</span>
                </div>
                <p className="text-[11px] text-warm/30 mb-2">Available on KitaKakis</p>
                <div className="flex items-center gap-3 text-warm/40">
                  <button className="transition-transform active:scale-90">
                    <Heart size={18} className={wishlisted.has(drop.id) ? 'fill-rust text-rust' : ''} />
                  </button>
                  <MessageCircle size={17} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tiktok' && (
          <div>
            {brand.tiktokHandle ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TikTokBadge />
                    <span className="text-xs font-medium text-cream/70">{brand.tiktokHandle}</span>
                  </div>
                  <button
                    onClick={() => toggleTiktokSync(brand.id, brand.tiktokHandle)}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
                      isSynced ? 'text-tiktok bg-tiktok/10' : 'text-warm/35 bg-[#111A10]'
                    }`}
                  >
                    {isSynced ? 'Synced' : 'Sync to feed'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {brand.tiktoks.map((tt, i) => (
                    <div key={tt.id} className="rounded-lg overflow-hidden animate-fade-in" style={{
                      animationDelay: `${i * 0.06}s`,
                    }}>
                      <div className="aspect-[9/14] relative" style={{ background: brand.heroGradient }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play size={24} className="text-white/30" fill="currentColor" />
                        </div>
                        <div className="absolute top-1.5 left-1.5"><TikTokBadge small /></div>
                        <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                          <p className="text-[9px] text-white/80 leading-tight line-clamp-2">{tt.caption}</p>
                        </div>
                      </div>
                      <div className="p-2 flex items-center justify-between text-[9px] text-warm/30" style={{ background: '#111A10' }}>
                        <span className="flex items-center gap-0.5"><Heart size={8} /> {tt.likes}</span>
                        <span>👁 {tt.views}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href={brand.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-tiktok/70 text-xs font-medium bg-tiktok/5 border border-tiktok/10"
                >
                  View on TikTok <ExternalLink size={10} />
                </a>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-warm/30 text-sm">TikTok not connected yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'drops' && (
          <div className="space-y-2">
            {brand.drops.map((drop, i) => (
              <div key={drop.id} className="rounded-lg overflow-hidden flex animate-fade-in" style={{
                animationDelay: `${i * 0.06}s`,
                background: '#111A10',
              }}>
                {drop.image ? (
                  <img src={drop.image} alt={drop.name} className="w-20 h-20 object-cover shrink-0" onError={(e) => {
                    e.target.outerHTML = `<div class="w-20 h-20 flex items-center justify-center text-2xl shrink-0" style="background:${brand.heroGradient}">${drop.emoji}</div>`;
                  }} />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center text-2xl shrink-0" style={{ background: brand.heroGradient }}>
                    {drop.emoji}
                  </div>
                )}
                <div className="flex-1 p-2.5 flex flex-col justify-between">
                  <p className="text-sm font-medium text-cream/80 leading-tight">{drop.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold/80 font-semibold">${drop.price}</span>
                    <button
                      onClick={() => toggleWishlist(drop.id)}
                      className="transition-transform active:scale-90"
                    >
                      <Heart size={16} className={wishlisted.has(drop.id) ? 'fill-rust text-rust' : 'text-warm/25'} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-sm font-semibold text-gold/80 mb-1.5">Our Story</h3>
              <p className="text-[13px] text-cream/55 leading-relaxed">{brand.story}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg p-3" style={{ background: '#111A10' }}>
                <p className="text-[10px] text-warm/30 mb-0.5">Founded</p>
                <p className="font-bold text-gold text-lg">{brand.founded}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: '#111A10' }}>
                <p className="text-[10px] text-warm/30 mb-0.5">Location</p>
                <p className="text-sm font-medium text-cream/70">{brand.location}</p>
              </div>
              <div className="rounded-lg p-3 col-span-2" style={{ background: '#111A10' }}>
                <p className="text-[10px] text-warm/30 mb-0.5">Category</p>
                <p className="text-sm font-medium text-cream/70">{brand.category}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-cream/70 mb-2">Connect</h3>
              <div className="flex flex-col gap-1.5">
                {brand.website && (
                  <a href={brand.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-lg p-2.5" style={{ background: '#111A10' }}>
                    <Globe size={14} className="text-gold/50" />
                    <span className="text-sm text-cream/60 flex-1">{brand.website.replace('https://', '').replace('http://', '').replace('www.', '')}</span>
                    <ExternalLink size={12} className="text-warm/20" />
                  </a>
                )}
                {brand.tiktokUrl && (
                  <a href={brand.tiktokUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-lg p-2.5" style={{ background: '#111A10' }}>
                    <TikTokBadge small />
                    <span className="text-sm text-cream/60 flex-1">{brand.tiktokHandle}</span>
                    <ExternalLink size={12} className="text-warm/20" />
                  </a>
                )}
                {brand.instagram && (
                  <a href={brand.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-lg p-2.5" style={{ background: '#111A10' }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-rust/50"><rect x={2} y={2} width={20} height={20} rx={5} ry={5}/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1={17.5} y1={6.5} x2={17.51} y2={6.5}/></svg>
                    <span className="text-sm text-cream/60 flex-1">Instagram</span>
                    <ExternalLink size={12} className="text-warm/20" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
