import React, { useState } from 'react';
import { Heart, Share2, ExternalLink, MapPin, Calendar, Clock, Users, MessageCircle, Bookmark, Send, Music, Play } from 'lucide-react';
import TikTokBadge from './TikTokBadge';
import { useCountdown } from '../hooks/useCountdown';
import { brands } from '../data/brands';

// Build a lookup map: brandId -> brand logo URL
const brandLogoMap = brands.reduce((acc, b) => {
  if (b.logo) acc[b.id] = b.logo;
  return acc;
}, {});

function BrandAvatarSmall({ brandId, avatar }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const logo = brandLogoMap[brandId];

  if (logo && !logoFailed) {
    return (
      <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-offblack shrink-0">
        <img src={logo} alt="" className="w-full h-full object-cover" onError={() => setLogoFailed(true)} />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: '#1E3520' }}>
      {avatar}
    </div>
  );
}

function PostHeader({ avatar, name, subtitle, badge, onClick, brandId }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5">
      <button onClick={onClick}>
        <BrandAvatarSmall brandId={brandId} avatar={avatar} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <button onClick={onClick} className="font-semibold text-[13px] text-cream/90 hover:text-gold transition-colors">
            {name}
          </button>
          {badge}
        </div>
        <p className="text-warm/35 text-[11px]">{subtitle}</p>
      </div>
    </div>
  );
}

function PostActions({ liked, onLike, likeCount, extra }) {
  return (
    <div className="px-3 pt-2 pb-1">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-4">
          <button onClick={onLike} className="transition-transform active:scale-90">
            <Heart size={20} className={`transition-all ${liked ? 'fill-rust text-rust' : 'text-cream/60 hover:text-cream'}`} />
          </button>
          <button className="text-cream/60 hover:text-cream transition-colors"><MessageCircle size={19} /></button>
          <button className="text-cream/60 hover:text-cream transition-colors"><Send size={17} /></button>
        </div>
        <div className="flex items-center gap-3">
          {extra}
          <button className="text-cream/60 hover:text-cream transition-colors"><Bookmark size={19} /></button>
        </div>
      </div>
      {likeCount && <p className="text-[12px] font-semibold text-cream/80">{likeCount} likes</p>}
    </div>
  );
}

function TikTokEmbed({ handle }) {
  const containerRef = React.useRef(null);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const username = handle?.replace('@', '') || '';
    containerRef.current.innerHTML = `
      <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@${username}" data-unique-id="${username}" data-embed-from="oembed" data-embed-type="creator" style="max-width:100%; min-width:288px;">
        <section><a target="_blank" href="https://www.tiktok.com/@${username}?refer=creator_embed">@${username}</a></section>
      </blockquote>
    `;
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
    // If script already loaded, re-trigger
    if (window.tiktokEmbed) {
      window.tiktokEmbed.lib?.render?.();
    }
    return () => {
      try { document.body.removeChild(script); } catch {}
    };
  }, [handle]);

  return <div ref={containerRef} className="w-full min-h-[400px] bg-black/20" />;
}

export function TikTokCard({ post, liked, onLike, onBrandClick }) {
  const [showEmbed, setShowEmbed] = useState(false);

  return (
    <div>
      <PostHeader
        brandId={post.brandId}
        avatar={post.brandAvatar}
        name={post.brandName}
        subtitle={`${post.handle} · ${post.timestamp}`}
        badge={<TikTokBadge small />}
        onClick={() => onBrandClick?.(post.brandId)}
      />

      {showEmbed ? (
        <div className="w-full relative">
          <button
            onClick={() => setShowEmbed(false)}
            className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white text-sm"
          >
            ✕
          </button>
          <TikTokEmbed handle={post.handle} />
        </div>
      ) : (
        <div
          className="w-full aspect-[9/14] relative overflow-hidden cursor-pointer"
          onClick={() => setShowEmbed(true)}
          style={{
            background: `linear-gradient(180deg, ${post.gradientColors?.[0] || '#1E3520'} 0%, ${post.gradientColors?.[1] || '#2A4A2D'} 40%, #0A0D08 100%)`,
          }}
        >
          {/* Cinematic gradient */}
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at 50% 35%, ${post.gradientColors?.[1] || '#2A4A2D'}44 0%, transparent 60%)`,
          }} />

          {/* Center play button */}
          <div className="absolute inset-0 flex items-center justify-center group">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Play size={28} className="text-white/80 ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Right sidebar — TikTok style */}
          <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5">
            <button onClick={(e) => { e.stopPropagation(); onLike?.(post.id); }} className="flex flex-col items-center gap-1">
              <Heart size={26} className={liked ? 'fill-rust text-rust' : 'text-white/80'} fill={liked ? 'currentColor' : 'none'} />
              <span className="text-[10px] text-white/70 font-medium">{post.likes}</span>
            </button>
            <div className="flex flex-col items-center gap-1">
              <MessageCircle size={26} className="text-white/80" />
              <span className="text-[10px] text-white/70 font-medium">48</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Bookmark size={26} className="text-white/80" />
              <span className="text-[10px] text-white/70 font-medium">Save</span>
            </div>
            <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1">
              <Share2 size={24} className="text-white/80" />
              <span className="text-[10px] text-white/70 font-medium">Share</span>
            </button>
          </div>

          {/* Bottom overlay — caption + music */}
          <div className="absolute bottom-0 left-0 right-0 p-3 pb-4" style={{
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          }}>
            <p className="text-[12px] text-white/90 leading-relaxed mb-2 pr-12">
              <span className="font-bold mr-1">@{post.handle?.replace('@','')}</span>
              {post.content}
            </p>
            <div className="flex items-center gap-1.5 text-white/60">
              <Music size={11} />
              <p className="text-[10px] animate-marquee">Original Sound — {post.brandName}</p>
            </div>
          </div>

          {/* Tap to watch label */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/70 text-[10px] font-medium">
            <TikTokBadge small /> Tap to watch
          </div>

          {/* Views */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
            <span className="text-[10px] text-white/60">👁 {post.views}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function BrandStoryCard({ post, liked, onLike, onBrandClick }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#111A10' }}>
      <PostHeader
        brandId={post.brandId}
        avatar={post.brandAvatar}
        name={post.brandName}
        subtitle={`${post.handle} · ${post.timestamp}`}
        onClick={() => onBrandClick?.(post.brandId)}
      />

      <div className="px-3 pb-2">
        <p className="text-[13px] leading-relaxed text-cream/65">
          <span className="font-semibold text-cream/85 mr-1">{post.brandName.toLowerCase().replace(/[\s.]/g, '')}</span>
          {post.content}
        </p>
      </div>

      <PostActions liked={liked} onLike={() => onLike?.(post.id)} likeCount={typeof post.likes === 'number' ? post.likes : post.likes} />
    </div>
  );
}

export function EventCard({ post }) {
  const [rsvpd, setRsvpd] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#111A10' }}>
      <div className="p-3.5">
        <div className="flex items-start gap-3 mb-2.5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base shrink-0" style={{
            background: '#2A1810',
          }}>
            📍
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-gold leading-tight">{post.title}</h3>
            <p className="text-warm/35 text-[11px] mt-0.5">{post.entry}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2.5 text-[11px] text-warm/45">
          <span className="flex items-center gap-1"><Calendar size={10} className="text-rust/50" /> {post.date}</span>
          <span className="flex items-center gap-1"><Clock size={10} className="text-rust/50" /> {post.time}</span>
          <span className="flex items-center gap-1"><MapPin size={10} className="text-rust/50" /> {post.venue}</span>
        </div>
        <p className="text-[12px] text-cream/50 mb-3 leading-relaxed">{post.description}</p>
        <button
          onClick={() => setRsvpd(r => !r)}
          className="w-full py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.98]"
          style={rsvpd ? {
            background: 'rgba(122,158,122,0.12)',
            border: '1px solid rgba(122,158,122,0.25)',
            color: '#7A9E7A',
          } : {
            background: 'rgba(212,168,67,0.06)',
            border: '1px solid rgba(212,168,67,0.15)',
            color: 'rgba(212,168,67,0.8)',
          }}>
          {rsvpd ? "RSVP'd ✓" : 'RSVP'}
        </button>
      </div>
    </div>
  );
}

export function DropPreviewCard({ post, wishlisted, onWishlist, onShopClick }) {
  const { timeLeft } = useCountdown();
  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: '#111A10',
      border: '1px solid rgba(212,168,67,0.1)',
    }}>
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <div>
              <h3 className="text-[15px] font-semibold text-gold">May Drop</h3>
              <p className="text-[10px] text-rust/80 font-medium tabular-nums">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-semibold text-gold/60 bg-gold/5 border border-gold/10">UPCOMING</span>
        </div>
        <div className="space-y-1.5 mb-3">
          {post.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-2.5 rounded-lg" style={{
              background: 'rgba(20,26,18,0.6)',
            }}>
              <div>
                <p className="text-[10px] text-warm/30 uppercase tracking-wide">{item.brandName}</p>
                <p className="text-[12px] font-medium text-cream/75">{item.name}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-gold/80 font-semibold text-sm">${item.price}</span>
                <button onClick={() => onWishlist?.(`drop-${i}`)} className="transition-transform active:scale-90">
                  <Heart size={14} className={wishlisted?.has(`drop-${i}`) ? 'fill-rust text-rust' : 'text-warm/25'} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onShopClick?.()}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-offblack active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #D4A843 0%, #E4C373 100%)' }}>
          View Full Drop
        </button>
      </div>
    </div>
  );
}

export function CommunityCard({ post, liked, onLike }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#111A10' }}>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0" style={{
          background: '#1E2A1C',
        }}>
          <Users size={14} className="text-sage/50" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[13px] text-cream/80">{post.userName}</p>
          <p className="text-warm/30 text-[11px]">{post.userHandle} · {post.timestamp}</p>
        </div>
      </div>
      <div className="px-3 pb-2">
        <p className="text-[13px] leading-relaxed text-cream/55">{post.content}</p>
      </div>
      <PostActions liked={liked} onLike={() => onLike?.(post.id)} likeCount={post.likes} />
    </div>
  );
}

// =================== THREAD CARD — newsletter / announcement style ===================

export function ThreadCard({ post }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-3 my-2 rounded-2xl overflow-hidden" style={{
      background: 'linear-gradient(165deg, #151D13 0%, #131A11 50%, #121810 100%)',
      border: `1px solid ${post.tagColor || '#D4A843'}25`,
    }}>
      {/* Thread header */}
      <div className="px-4 py-2.5 flex items-center gap-2" style={{
        background: `linear-gradient(90deg, ${post.tagColor || '#D4A843'}12 0%, rgba(14,20,12,0.5) 100%)`,
        borderBottom: '1px solid rgba(36,56,38,0.25)',
      }}>
        <span className="text-lg">{post.authorAvatar}</span>
        <span className="text-[12px] font-semibold text-cream/80">{post.author}</span>
        <span className="text-warm/25">·</span>
        <span className="text-[10px] text-warm/35">{post.timestamp}</span>
        <span className="ml-auto text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{
          background: `${post.tagColor || '#D4A843'}18`,
          color: post.tagColor || '#D4A843',
          border: `1px solid ${post.tagColor || '#D4A843'}30`,
        }}>{post.tag}</span>
      </div>

      {/* Thread body */}
      <div className="px-4 py-3">
        <h3 className="text-[14px] font-bold text-cream/90 leading-snug mb-2">{post.title}</h3>
        <p className="text-[12px] text-cream/55 leading-relaxed mb-3">{post.body}</p>

        {/* Bullet points */}
        <div className={`space-y-1.5 ${!expanded && post.bullets?.length > 3 ? 'max-h-[72px] overflow-hidden relative' : ''}`}>
          {(expanded ? post.bullets : post.bullets?.slice(0, 3))?.map((bullet, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-cream/60 leading-snug">
              <span className="text-gold/60 shrink-0 mt-0.5">→</span>
              <span>{bullet}</span>
            </div>
          ))}
          {!expanded && post.bullets?.length > 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#131A11] to-transparent" />
          )}
        </div>
        {post.bullets?.length > 3 && (
          <button onClick={() => setExpanded(!expanded)}
            className="text-[11px] text-gold/70 font-medium mt-1.5">
            {expanded ? 'Show less' : `+ ${post.bullets.length - 3} more`}
          </button>
        )}
      </div>

      {/* Thread footer */}
      <div className="px-4 py-2 flex items-center justify-between" style={{ borderTop: '1px solid rgba(36,56,38,0.2)' }}>
        <div className="flex items-center gap-3">
          <button className="text-[11px] text-warm/40 flex items-center gap-1 hover:text-cream/60 transition-colors">
            <Heart size={12} /> Like
          </button>
          <button className="text-[11px] text-warm/40 flex items-center gap-1 hover:text-cream/60 transition-colors">
            <MessageCircle size={12} /> Discuss
          </button>
        </div>
        <button className="text-[11px] text-warm/40 flex items-center gap-1 hover:text-cream/60 transition-colors">
          <Share2 size={12} /> Share
        </button>
      </div>
    </div>
  );
}
