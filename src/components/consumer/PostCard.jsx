import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, CheckCircle, ShoppingBag, Plus, Volume2, VolumeX, ExternalLink } from 'lucide-react'
import { cn, formatRelativeTime, formatNumber, formatCurrency } from '../../lib/utils'
import { Avatar } from '../shared/Avatar'
import { PlatformBadge } from '../shared/Badge'
import { MOCK_PRODUCTS } from '../../data/mockData'
import { addToCart } from '../../lib/cartStore'

// Convert a public IG / TikTok post URL into the platform's official embed
// iframe URL. These endpoints are public (no auth key required) and are the
// sanctioned way to surface real brand posts inside our feed — the video
// plays off Instagram/TikTok's CDN with attribution + tap-through intact.
function buildEmbedSrc(url) {
  if (!url) return null
  const ig = url.match(/instagram\.com\/(p|reel|tv)\/([^/?#]+)/i)
  if (ig) return `https://www.instagram.com/${ig[1]}/${ig[2]}/embed`
  const tt = url.match(/tiktok\.com\/.*\/video\/(\d+)/i) || url.match(/tiktok\.com\/embed\/v2\/(\d+)/i)
  if (tt) return `https://www.tiktok.com/embed/v2/${tt[1]}`
  return null
}

function platformFromUrl(url) {
  if (!url) return null
  if (/instagram\.com/i.test(url)) return 'instagram'
  if (/tiktok\.com/i.test(url)) return 'tiktok'
  return null
}

// Embedded real IG/TikTok post. Lazy-loads via IntersectionObserver so the
// feed doesn't fetch 20 embeds on first render. Aspect is 4:5 — closest
// common denominator between IG feed posts and TikTok videos.
function EmbedMedia({ url }) {
  const src = useMemo(() => buildEmbedSrc(url), [url])
  const hostRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = hostRef.current
    if (!el || visible) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); io.disconnect() }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [visible])

  if (!src) return null
  const platform = platformFromUrl(url)

  return (
    <div ref={hostRef} className="relative w-full bg-black" style={{ aspectRatio: '4 / 5' }}>
      {visible ? (
        <iframe
          src={src}
          title={platform === 'tiktok' ? 'TikTok post' : 'Instagram post'}
          className="w-full h-full"
          frameBorder="0"
          scrolling="no"
          allow="encrypted-media; autoplay; clipboard-write; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/70 text-xs">Loading…</div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 bg-black/55 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1 hover:bg-black/70"
      >
        <ExternalLink size={10} />
        Open on {platform === 'tiktok' ? 'TikTok' : 'Instagram'}
      </a>
    </div>
  )
}

// Autoplay-on-scroll: the video starts (muted, so browsers allow it) the
// moment 60%+ of the frame is visible; pauses when it scrolls out. The sound
// toggle stays sticky across this card — tap once to unmute, stays unmuted
// for this post even as you scroll back and forth.
function FeedVideo({ src, poster }) {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {}) // swallow autoplay rejections
        } else {
          el.pause()
        }
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (failed && poster) {
    return <img src={poster} alt="Post" className="w-full h-full object-cover" />
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
      />
      <button
        onClick={(e) => { e.stopPropagation(); setMuted(m => !m) }}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </div>
  )
}

function ShopThisPost({ productIds }) {
  const products = productIds
    .map(id => MOCK_PRODUCTS.find(p => p.id === id))
    .filter(Boolean)
  if (!products.length) return null

  return (
    <div className="px-4 pt-3">
      <div className="flex items-center gap-1.5 mb-2">
        <ShoppingBag size={13} className="text-[#D94545]" />
        <span className="text-xs font-semibold text-[#6B5744] uppercase tracking-wide">Shop this post</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-hide">
        {products.map(product => (
          <div key={product.id} className="flex-shrink-0 w-36 bg-white border border-[#E8DDC8] rounded-xl overflow-hidden">
            <Link to={`/brand/${product.brand?.slug ?? ''}`} className="block">
              <div className="aspect-square bg-[#F4EDE0]">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-semibold text-ink line-clamp-2 leading-tight">{product.name}</p>
                <p className="text-xs text-[#D94545] font-bold mt-1">{formatCurrency(product.price)}</p>
              </div>
            </Link>
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product) }}
              className="w-full flex items-center justify-center gap-1 bg-[#D94545] hover:bg-[#a85225] text-white text-xs font-semibold py-1.5 transition-colors"
            >
              <Plus size={12} /> Add
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes ?? 0)

  function handleLike() {
    setLiked(l => !l)
    setLikeCount(c => liked ? c - 1 : c + 1)
  }

  const isVideo = post.media_type === 'video'
  const mediaUrl = post.media_urls?.[0]

  return (
    <article className="bg-[#FAF6EE] border-b border-[#E8DDC8] pb-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Link to={`/brand/${post.brand?.slug}`} className="flex items-center gap-2.5">
          <div className="relative">
            <Avatar src={post.brand?.logo_url} name={post.brand?.name} size="sm" />
            {post.brand?.verified && (
              <CheckCircle size={12} className="absolute -bottom-0.5 -right-0.5 text-[#D94545] fill-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-ink">{post.brand?.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#8B7355]">{post.brand?.location}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-[#8B7355]">{formatRelativeTime(post.published_at)}</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <PlatformBadge platform={post.platform} />
          <button className="text-[#8B7355] hover:text-[#6B5744]">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Media */}
      {post.embed_url ? (
        <EmbedMedia url={post.embed_url} />
      ) : mediaUrl ? (
        <div className="aspect-square overflow-hidden bg-black">
          {isVideo ? (
            <FeedVideo src={mediaUrl} poster={post.poster_url} />
          ) : (
            <img
              src={mediaUrl}
              alt="Post"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ) : null}

      {/* Shop this post — linked products */}
      {post.product_ids?.length > 0 && <ShopThisPost productIds={post.product_ids} />}

      {/* Actions */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className={cn('flex items-center gap-1.5 transition-colors', liked ? 'text-red-500' : 'text-[#6B5744] hover:text-ink')}>
            <Heart size={22} className={liked ? 'fill-current' : ''} />
            <span className="text-sm font-medium">{formatNumber(likeCount)}</span>
          </button>
          <button className="flex items-center gap-1.5 text-[#6B5744] hover:text-ink">
            <MessageCircle size={22} />
            <span className="text-sm font-medium">{formatNumber(post.comments ?? 0)}</span>
          </button>
          <button className="flex items-center gap-1.5 text-[#6B5744] hover:text-ink">
            <Share2 size={22} />
          </button>
        </div>
        <button onClick={() => setSaved(s => !s)} className={cn('transition-colors', saved ? 'text-[#D94545]' : 'text-[#6B5744] hover:text-ink')}>
          <Bookmark size={22} className={saved ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm text-ink leading-relaxed">
          <Link to={`/brand/${post.brand?.slug}`} className="font-semibold">{post.brand?.name}</Link>
          {' '}{post.content}
        </p>
        {post.views > 0 && (
          <p className="text-xs text-[#8B7355] mt-1">{formatNumber(post.views)} views</p>
        )}
      </div>
    </article>
  )
}
