import { NavLink } from 'react-router-dom'
import { Home, Compass, Calendar, ShoppingBag, Gift, MessageSquare, Zap } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/shop', icon: ShoppingBag, label: 'Shop' },
  { to: '/threads', icon: MessageSquare, label: 'Threads' },
  { to: '/rewards', icon: Gift, label: 'Rewards' },
]

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF6EE]/95 backdrop-blur-md border-t border-[#E8DDC8] shadow-warm-lg max-w-md mx-auto">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
              'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-150',
              isActive
                ? 'text-accent'
                : 'text-[#8B7355] hover:text-[#6B5744]'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[9px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
