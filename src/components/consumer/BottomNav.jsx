// Mobile bottom nav. Active tab gets a soft accent pill behind the icon
// (animated via framer's `layoutId` so the pill slides between tabs)
// plus a slightly bolder stroke. The label colour shifts in tandem so
// the change reads immediately even with peripheral vision.
//
// Lives inside the centered consumer column so its shadow lines up with
// the column edges on desktop's phone-width preview.

import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Compass, ShoppingBag, Gift, MessageSquare } from 'lucide-react'
import { useFollows } from '../../lib/followStore'

const NAV_ITEMS = [
  { to: '/',         icon: Home,           label: 'Home',     match: (p) => p === '/' },
  { to: '/discover', icon: Compass,        label: 'Discover', match: (p) => p.startsWith('/discover') },
  { to: '/shop',     icon: ShoppingBag,    label: 'Shop',     match: (p) => p.startsWith('/shop') },
  { to: '/threads',  icon: MessageSquare,  label: 'Threads',  match: (p) => p.startsWith('/threads') },
  { to: '/rewards',  icon: Gift,           label: 'Rewards',  match: (p) => p.startsWith('/rewards') },
]

export function BottomNav() {
  const { pathname } = useLocation()
  // Subscribed so the Discover tab can show a follow-count dot when the user
  // has followed brands but hasn't visited Discover since.
  const { count: followCount } = useFollows()

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF6EE]/92 backdrop-blur-md border-t border-[#E8DDC8] shadow-warm-lg max-w-md mx-auto pb-[max(env(safe-area-inset-bottom),0.25rem)]"
    >
      <div className="flex items-stretch justify-around px-2 pt-1.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label, match }) => {
          const active = match(pathname)
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="flex-1 group flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl active:scale-[0.96] transition-transform"
            >
              <span className="relative inline-flex items-center justify-center">
                {active && (
                  <motion.span
                    layoutId="bottomnav-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-x-[-10px] inset-y-[-4px] bg-accent/12 rounded-full"
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={`relative transition-colors duration-150 ${
                    active ? 'text-accent' : 'text-[#8B7355] group-hover:text-[#6B5744]'
                  }`}
                />
                {to === '/discover' && followCount > 0 && !active && (
                  <span className="absolute -top-0.5 -right-1.5 w-2 h-2 rounded-full bg-accent ring-2 ring-[#FAF6EE]" />
                )}
              </span>
              <span
                className={`text-[10px] font-medium leading-none transition-colors duration-150 ${
                  active ? 'text-accent' : 'text-[#8B7355]'
                }`}
              >
                {label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
