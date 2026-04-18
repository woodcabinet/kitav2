import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, CheckCircle } from 'lucide-react'
import { cn, formatRelativeTime, formatNumber } from '../../lib/utils'
import { Avatar } from '../shared/Avatar'
import { PlatformBadge } from '../shared/Badge'

export function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes ?? 0)

  function handleLike() {
    setLiked(l => !l)
    setLikeCount(c => liked ? c - 1 : c + 1)
  }

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

      {/* Image */}
      {post.media_urls?.[0] && (
        <div className="aspect-square overflow-hidden">
          <img
            src={post.media_urls[0]}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}

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
