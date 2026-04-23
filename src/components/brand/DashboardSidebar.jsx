import { NavLink, Link } from 'react-router-dom'
import {
  BarChart2, LayoutDashboard, Calendar, Package,
  Users, Zap, Settings, LogOut, Sparkles, Store, ArrowLeft
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from '../shared/Avatar'
import { LogoMark } from '../shared/Logo'
import { cn } from '../../lib/utils'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/dashboard/content', icon: Sparkles, label: 'Content' },
  { to: '/dashboard/store', icon: Store, label: 'Store' },
  { to: '/dashboard/events', icon: Calendar, label: 'Events' },
  { to: '/dashboard/connect', icon: Users, label: 'Connect' },
]

export function DashboardSidebar() {
  const { brand, profile, signOut } = useAuth()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#1A1513] min-h-screen px-4 py-6 flex-shrink-0">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 mb-8 px-2">
        <LogoMark size={36} />
        <span className="font-display font-semibold text-lg text-white tracking-tight">
          kita<span className="text-accent">kakis</span>
        </span>
      </Link>

      {/* Brand info */}
      <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-3 mb-6">
        <Avatar src={brand?.logo_url} name={brand?.name ?? profile?.display_name} size="sm" />
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm truncate">{brand?.name ?? 'Your Brand'}</p>
          <p className="text-white/50 text-xs truncate">{brand?.location ?? 'Singapore'}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive
                ? 'bg-accent text-white shadow-warm'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            )}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 pt-4 border-t border-white/10">
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) => cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
            isActive ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
          )}
        >
          <Settings size={18} />
          Settings
        </NavLink>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={18} />
          Consumer View
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
