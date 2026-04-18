import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Bell, Search, User, Coffee } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from '../shared/Avatar'

export function ConsumerHeader() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [q, setQ] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    const trimmed = q.trim()
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
    setQ('')
  }

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#E8DDC8]">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-accent flex items-center justify-center shadow-warm animate-breathe">
            <Coffee size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-lg text-ink tracking-tight hidden sm:inline">kitakakis</span>
        </Link>

        {/* Inline search — collapses to icon on very narrow mobile, bar on larger */}
        <form onSubmit={onSubmit} className="flex-1 max-w-[260px] mx-2 hidden sm:block">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search brands, products, events…"
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-[#E8DDC8] text-[13px] text-ink placeholder:text-[#A89880] focus:outline-none focus:border-accent transition-all"
              onFocus={(e) => {
                // Route to full search page on focus for rich experience
                if (location.pathname !== '/search') {
                  e.target.blur()
                  navigate('/search')
                }
              }}
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link to="/search" className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F0E7D5] text-[#6B5744] transition-colors">
            <Search size={19} />
          </Link>
          <Link to="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F0E7D5] text-[#6B5744] transition-colors">
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </Link>
          {profile
            ? <Link to="/profile">
                <Avatar src={profile.avatar_url} name={profile.display_name} size="sm" />
              </Link>
            : <Link to="/auth/login" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F0E7D5] text-[#6B5744]">
                <User size={19} />
              </Link>
          }
        </div>
      </div>
    </header>
  )
}
