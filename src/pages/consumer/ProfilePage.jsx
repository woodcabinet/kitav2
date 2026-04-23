import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Heart, Calendar, ShoppingBag, MapPin, Clock, Settings, Bell, Shield, HelpCircle, Info, ChevronRight, Coffee } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from '../../components/shared/Avatar'
import { MOCK_BRANDS, MOCK_EVENTS } from '../../data/mockData'
import { formatDate } from '../../lib/utils'

const SETTINGS_ROWS = [
  { icon: ShoppingBag, label: 'Order history', hint: 'Track past purchases', to: '/profile/orders' },
  { icon: Bell,       label: 'Notifications', hint: 'Drops, events, friends' },
  { icon: Shield,     label: 'Privacy',       hint: 'Who sees your saves' },
  { icon: HelpCircle, label: 'Help & FAQ',    hint: 'We got your back' },
  { icon: Info,       label: 'About KitaKakis', hint: 'By Singaporeans, for Singaporeans' },
]

export default function ProfilePage() {
  const { profile, signOut, user } = useAuth()
  const navigate = useNavigate()
  const [savedBrands, setSavedBrands] = useState([])
  const [rsvpEvents, setRsvpEvents] = useState([])
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    if (!user) { navigate('/auth/login'); return }
    const saved = JSON.parse(localStorage.getItem(`saves_${user?.id}`) || '[]')
    const rsvps = JSON.parse(localStorage.getItem(`rsvps_${user?.id}`) || '[]')
    const wish = JSON.parse(localStorage.getItem(`wishlist_${user?.id}`) || '[]')
    setSavedBrands(MOCK_BRANDS.filter(b => saved.includes(b.id)))
    setRsvpEvents(MOCK_EVENTS.filter(e => rsvps.includes(e.id)))
    setWishlist(wish)
  }, [user, navigate])

  async function handleSignOut() {
    await signOut()
    navigate('/auth/login')
  }

  if (!profile) return null

  const isEmpty = savedBrands.length === 0 && rsvpEvents.length === 0 && wishlist.length === 0

  return (
    <div className="pb-24 bg-[#FAF6EE] min-h-screen">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="bg-gradient-to-b from-tan/50 via-[#F0E7D5] to-[#FAF6EE] px-4 pt-8 pb-8">
          <div className="flex flex-col items-center text-center">
            <div className="ring-4 ring-accent/30 rounded-full">
              <Avatar src={profile.avatar_url} name={profile.display_name} size="lg" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink mt-3">{profile.display_name || 'Friend'}</h1>
            <p className="font-hand text-lg text-accent leading-none mt-0.5">@{profile.username || user?.email?.split('@')[0]}</p>
            <p className="text-xs text-[#8B7355] mt-2">{user?.email}</p>

            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 rounded-xl bg-white border border-[#E8DDC8] text-[13px] font-semibold text-ink hover:bg-[#F0E7D5] transition-colors">
                Edit profile
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent/10 text-accent text-[13px] font-semibold hover:bg-accent hover:text-white transition-colors"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 -mt-3 relative z-10 stagger-in">
        <div className="paper-card rounded-2xl p-3 text-center">
          <p className="font-display font-semibold text-accent text-xl">{savedBrands.length}</p>
          <p className="text-[10px] text-[#8B7355] uppercase tracking-wider mt-0.5">Saved</p>
        </div>
        <div className="paper-card rounded-2xl p-3 text-center">
          <p className="font-display font-semibold text-accent text-xl">{rsvpEvents.length}</p>
          <p className="text-[10px] text-[#8B7355] uppercase tracking-wider mt-0.5">RSVPs</p>
        </div>
        <div className="paper-card rounded-2xl p-3 text-center">
          <p className="font-display font-semibold text-accent text-xl">{wishlist.length}</p>
          <p className="text-[10px] text-[#8B7355] uppercase tracking-wider mt-0.5">Wishlist</p>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-6">
        {/* Saved brands */}
        {savedBrands.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-semibold text-ink mb-3 flex items-center gap-1.5">
              <Heart size={16} className="text-accent fill-accent" /> Your saved brands
            </h2>
            <div className="space-y-2">
              {savedBrands.map(brand => (
                <Link
                  key={brand.id}
                  to={`/brand/${brand.slug}`}
                  className="paper-card rounded-2xl p-3 flex items-center gap-3 hover:shadow-warm-lg transition-all group"
                >
                  <img src={brand.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#E8DDC8]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-ink truncate group-hover:text-accent transition-colors">{brand.name}</p>
                    <p className="text-xs text-[#8B7355] truncate">{brand.tagline}</p>
                  </div>
                  {brand.follower_count != null && (
                    <span className="text-[11px] bg-accent/10 text-accent font-bold px-2.5 py-1 rounded-full">
                      {brand.follower_count.toLocaleString()}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* RSVP'd events */}
        {rsvpEvents.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-semibold text-ink mb-3 flex items-center gap-1.5">
              <Calendar size={16} className="text-accent" /> Your events
            </h2>
            <div className="space-y-2">
              {rsvpEvents.map(event => {
                const isLive = new Date(event.starts_at) <= new Date() && (!event.ends_at || new Date(event.ends_at) >= new Date())
                return (
                  <div key={event.id} className="paper-card rounded-2xl p-3">
                    <div className="flex items-start gap-2 mb-2">
                      {isLive && (
                        <span className="flex items-center gap-1 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />LIVE
                        </span>
                      )}
                      <h3 className="font-semibold text-sm text-ink truncate">{event.title}</h3>
                    </div>
                    <div className="space-y-1 text-xs text-[#8B7355]">
                      <div className="flex items-center gap-1.5"><Clock size={12} /> {formatDate(event.starts_at, 'EEE, d MMM · h:mm a')}</div>
                      <div className="flex items-center gap-1.5"><MapPin size={12} /> {event.venue_name}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Wishlist */}
        {wishlist.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-semibold text-ink mb-3 flex items-center gap-1.5">
              <ShoppingBag size={16} className="text-accent" /> Your wishlist
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {wishlist.map(item => (
                <div key={item.id} className="paper-card rounded-xl overflow-hidden">
                  {item.images?.[0] && <img src={item.images[0]} alt="" className="w-full aspect-square object-cover" />}
                  <div className="p-1.5">
                    <p className="text-[11px] font-semibold text-ink truncate">{item.name}</p>
                    <p className="text-[11px] text-accent font-display font-semibold">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="paper-card rounded-3xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-accent/10" />
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
              className="inline-flex w-14 h-14 rounded-2xl bg-accent/10 items-center justify-center mb-3 relative"
            >
              <Coffee size={26} className="text-accent" />
            </motion.div>
            <p className="font-display font-semibold text-lg text-ink mb-1 relative">Start your story</p>
            <p className="text-sm text-[#6B5744] mb-4 relative">Save brands, RSVP events, build your wishlist</p>
            <Link
              to="/discover"
              className="relative inline-block bg-accent hover:bg-accent-dark text-white font-semibold py-2.5 px-6 rounded-xl shadow-warm transition-colors"
            >
              Explore brands →
            </Link>
          </motion.div>
        )}

        {/* Settings */}
        <div>
          <h2 className="font-display text-lg font-semibold text-ink mb-3 flex items-center gap-1.5">
            <Settings size={16} className="text-accent" /> Settings & more
          </h2>
          <div className="paper-card rounded-3xl p-2">
            {SETTINGS_ROWS.map(row => {
              const Icon = row.icon
              const Cmp = row.to ? Link : 'button'
              const extraProps = row.to ? { to: row.to } : {}
              return (
                <Cmp
                  key={row.label}
                  {...extraProps}
                  className="w-full flex items-center gap-3 py-3 px-3 text-left hover:bg-[#F0E7D5] rounded-2xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink">{row.label}</p>
                    <p className="text-[11px] text-[#8B7355]">{row.hint}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#A89880]" />
                </Cmp>
              )
            })}
          </div>
        </div>
      </div>

      <p className="font-hand text-lg text-center text-[#8B7355] mt-8 px-4">
        made in Singapore
      </p>
    </div>
  )
}
