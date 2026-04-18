import { NavLink } from 'react-router-dom'
import { Home, Compass, ShoppingBag, MessageSquare, Gift, Search, PlusSquare, User } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/shop', icon: ShoppingBag, label: 'Shop' },
  { to: '/threads', icon: MessageSquare, label: 'Threads' },
  { to: '/rewards', icon: Gift, label: 'Rewards' },
]

// Desktop-only left sidebar (Instagram-web style).
// Hidden on mobile/tablet — BottomNav takes over below md.
export function SideNav() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-[72px] xl:w-60 flex-col border-r border-gray-100 bg-white px-3 py-6">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-2xl bg-[#D94545] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold">K</span>
        </div>
        <span className="hidden xl:inline font-bold text-lg text-[#1A1513]">kitakakis</span>
      </NavLink>

      {/* Primary nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-4 px-3 py-3 rounded-xl transition-colors',
              isActive
                ? 'bg-[#C4B49A] text-[#D94545] font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={24} strokeWidth={isActive ? 2.4 : 1.8} />
                <span className="hidden xl:inline text-[15px]">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* For brands CTA */}
      <NavLink
        to="/brand/onboarding"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-500 hover:bg-gray-50 mt-2"
      >
        <PlusSquare size={18} />
        <span className="hidden xl:inline">For Brands</span>
      </NavLink>
    </aside>
  )
}
