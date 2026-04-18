import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Heart, TrendingUp, Clock, Plus, Coffee } from 'lucide-react'
import { Avatar } from '../../components/shared/Avatar'
import { MOCK_THREADS } from '../../data/mockData'
import { formatRelativeTime, formatNumber } from '../../lib/utils'

const LIKED_KEY = 'kk_liked_threads'
function readLiked() { try { return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) ?? '[]')) } catch { return new Set() } }
function saveLiked(set) { localStorage.setItem(LIKED_KEY, JSON.stringify([...set])) }

function ThreadCard({ thread, likedSet, toggleLike }) {
  const liked = likedSet.has(thread.id)
  const likes = thread.like_count + (liked ? 1 : 0)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3 }}
      className="paper-card rounded-3xl p-4"
    >
      <div className="flex items-center gap-2.5 mb-2">
        <Avatar src={thread.author?.avatar_url} name={thread.author?.display_name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-ink truncate">{thread.author?.display_name}</p>
          <p className="text-[11px] text-[#8B7355]">@{thread.author?.username} · {formatRelativeTime(thread.created_at)}</p>
        </div>
      </div>

      <p className="text-[15px] text-ink leading-relaxed">{thread.content}</p>

      {thread.tags?.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mt-2.5">
          {thread.tags.map(tag => (
            <span key={tag} className="px-2.5 py-0.5 rounded-full bg-[#F0E7D5] text-[11px] text-accent font-medium">#{tag}</span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-[#E8DDC8]">
        <button onClick={() => toggleLike(thread.id)} className={`flex items-center gap-1.5 text-sm transition-all ${liked ? 'text-accent' : 'text-[#8B7355] hover:text-accent'}`}>
          <motion.span animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
            <Heart size={16} className={liked ? 'fill-current' : ''} />
          </motion.span>
          <span className="font-medium">{formatNumber(likes)}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-[#8B7355] hover:text-ink transition-colors">
          <MessageCircle size={16} />
          <span className="font-medium">{formatNumber(thread.reply_count)}</span>
        </button>
      </div>
    </motion.article>
  )
}

export default function ThreadsPage() {
  const [activeTab, setActiveTab] = useState('trending')
  const [likedSet, setLikedSet] = useState(readLiked)

  const threads = useMemo(() => {
    const copy = [...MOCK_THREADS]
    if (activeTab === 'trending') return copy.sort((a, b) => b.like_count - a.like_count)
    return copy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [activeTab])

  function toggleLike(id) {
    setLikedSet(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      saveLiked(next)
      return next
    })
  }

  return (
    <div className="pb-24 bg-[#FAF6EE] min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4 pb-3"
      >
        <p className="font-hand text-xl text-accent leading-none">warm chats, hot takes</p>
        <h1 className="font-display text-3xl font-semibold text-ink mt-0.5 flex items-center gap-2">
          Kopitiam Talk <Coffee size={22} className="text-accent" />
        </h1>
      </motion.div>

      {/* Tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          {[
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'recent', label: 'Fresh', icon: Clock },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === id
                  ? 'bg-ink text-cream shadow-warm'
                  : 'bg-white text-[#6B5744] border border-[#E8DDC8] hover:bg-[#F0E7D5]'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Thread list */}
      <div className="px-4 space-y-3 stagger-in">
        <AnimatePresence mode="popLayout">
          {threads.map(thread => (
            <ThreadCard key={thread.id} thread={thread} likedSet={likedSet} toggleLike={toggleLike} />
          ))}
        </AnimatePresence>
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 md:right-[calc(50%-300px)] z-30 w-14 h-14 bg-accent hover:bg-accent-dark text-white rounded-2xl shadow-warm-lg flex items-center justify-center animate-breathe transition-colors">
        <Plus size={24} />
      </button>
    </div>
  )
}
