import { useState } from 'react'
import {
  Calendar, Plus, MapPin, Clock, Users, Edit2, Trash2, MoreHorizontal,
  TrendingUp, CheckCircle, AlertCircle, Sparkles, Copy, BarChart2, DollarSign,
  Store, Zap, Rocket, Palette, Handshake, ImagePlus
} from 'lucide-react'
import { MOCK_EVENTS } from '../../data/mockData'
import { formatCurrency, formatDate, formatRelativeTime } from '../../lib/utils'
import { cn } from '../../lib/utils'

// ─── Build additional past + draft events for demo ────────

const PAST_EVENTS = [
  {
    id: 'pe1',
    title: 'March Pop-Up at Keong Saik',
    event_type: 'pop_up',
    cover_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop',
    venue_name: 'Keong Saik Road', address: 'Keong Saik Road, Singapore',
    starts_at: new Date(Date.now() - 25 * 24 * 3600000).toISOString(),
    ends_at: new Date(Date.now() - 25 * 24 * 3600000 + 6 * 3600000).toISOString(),
    is_free: true, rsvp_count: 248, actual_attendance: 187, revenue: 3840,
  },
  {
    id: 'pe2',
    title: 'Valentine\'s Day Latte Art Class',
    event_type: 'workshop',
    cover_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop',
    venue_name: 'Assembly Tanjong Pagar', address: '100 Tras Street, Singapore',
    starts_at: new Date(Date.now() - 62 * 24 * 3600000).toISOString(),
    ends_at: new Date(Date.now() - 62 * 24 * 3600000 + 3 * 3600000).toISOString(),
    is_free: false, ticket_price: 48, rsvp_count: 20, actual_attendance: 19, revenue: 912,
  },
  {
    id: 'pe3',
    title: 'New Year Cupping Session',
    event_type: 'workshop',
    cover_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=500&fit=crop',
    venue_name: 'Assembly Tanjong Pagar', address: '100 Tras Street, Singapore',
    starts_at: new Date(Date.now() - 104 * 24 * 3600000).toISOString(),
    ends_at: new Date(Date.now() - 104 * 24 * 3600000 + 2 * 3600000).toISOString(),
    is_free: false, ticket_price: 38, rsvp_count: 20, actual_attendance: 18, revenue: 684,
  },
]

const DRAFT_EVENTS = [
  {
    id: 'de1',
    title: 'May Day Weekend Market (Draft)',
    event_type: 'market',
    starts_at: new Date(Date.now() + 14 * 24 * 3600000).toISOString(),
    venue_name: 'TBD',
    is_free: true,
    status: 'draft',
    completeness: 60,
  },
]

const EVENT_TYPE_LABELS = {
  market: 'Market',
  pop_up: 'Pop-Up',
  launch: 'Launch',
  workshop: 'Workshop',
  collab: 'Collab',
  other: 'Event',
}

const TABS = [
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'past', label: 'Past', icon: CheckCircle },
  { id: 'drafts', label: 'Drafts', icon: AlertCircle },
  { id: 'plan', label: 'Plan New', icon: Sparkles },
]

// ─── Upcoming Tab ───────────────────────────────────────────

function UpcomingTab({ events }) {
  if (events.length === 0) {
    return <EmptyState title="No upcoming events" message="Plan your next event to start filling seats." />
  }

  return (
    <div className="space-y-3">
      {events.map(event => (
        <div key={event.id} className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-4 flex gap-4 hover:shadow-sm transition-shadow">
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            {event.cover_url && <img src={event.cover_url} alt="" className="w-full h-full object-cover" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm text-ink truncate">{event.title}</h4>
              <span className="text-[11px] font-semibold bg-[#C4B49A] text-[#D94545] px-2.5 py-1 rounded-full">
                {EVENT_TYPE_LABELS[event.event_type]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-[#6B5744] mb-2">
              <span className="flex items-center gap-1"><Clock size={11} /> {formatDate(event.starts_at, 'EEE, MMM d · h:mm a')}</span>
              <span className="flex items-center gap-1"><MapPin size={11} /> {event.venue_name}</span>
              <span className="flex items-center gap-1"><Users size={11} /> {event.rsvp_count} RSVPs{event.max_capacity && ` / ${event.max_capacity}`}</span>
              {!event.is_free && <span className="flex items-center gap-1"><DollarSign size={11} /> {formatCurrency(event.ticket_price)}</span>}
            </div>
            {/* Capacity bar */}
            {event.max_capacity && (
              <div>
                <div className="flex items-center justify-between text-[10px] text-[#8B7355] mb-0.5">
                  <span>Capacity</span>
                  <span>{Math.round((event.rsvp_count / event.max_capacity) * 100)}% full</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D94545] rounded-full transition-all"
                    style={{ width: `${Math.min((event.rsvp_count / event.max_capacity) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-start gap-1 flex-shrink-0">
            <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#8B7355]" title="Edit">
              <Edit2 size={14} />
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#8B7355]" title="Analytics">
              <BarChart2 size={14} />
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#8B7355]" title="More">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Past Events Tab (logs) ─────────────────────────────────

function PastTab({ events }) {
  const totalRevenue = events.reduce((s, e) => s + (e.revenue || 0), 0)
  const totalAttendees = events.reduce((s, e) => s + (e.actual_attendance || 0), 0)
  const avgAttendanceRate = events.length
    ? events.reduce((s, e) => s + ((e.actual_attendance || 0) / (e.rsvp_count || 1)), 0) / events.length * 100
    : 0

  return (
    <div>
      {/* Aggregate stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Events Run', value: events.length, icon: CheckCircle },
          { label: 'Total Attendees', value: totalAttendees, icon: Users },
          { label: 'Revenue', value: formatCurrency(totalRevenue), icon: DollarSign },
          { label: 'Show-up Rate', value: `${avgAttendanceRate.toFixed(0)}%`, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-4">
            <div className="w-8 h-8 bg-[#C4B49A] rounded-xl flex items-center justify-center mb-2">
              <Icon size={16} className="text-[#D94545]" />
            </div>
            <p className="text-xl font-bold text-ink">{value}</p>
            <p className="text-xs text-[#6B5744]">{label}</p>
          </div>
        ))}
      </div>

      {/* Past events table */}
      <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8DDC8] text-xs text-[#6B5744] uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-semibold">Event</th>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
              <th className="text-left px-4 py-3 font-semibold">RSVP → Attended</th>
              <th className="text-left px-4 py-3 font-semibold">Revenue</th>
              <th className="text-left px-4 py-3 font-semibold">Rate</th>
              <th className="text-right px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => {
              const rate = event.rsvp_count ? (event.actual_attendance / event.rsvp_count) * 100 : 0
              return (
                <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {event.cover_url && <img src={event.cover_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-ink">{event.title}</p>
                        <p className="text-xs text-[#8B7355]">{EVENT_TYPE_LABELS[event.event_type]} · {event.venue_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B5744]">
                    <p>{formatDate(event.starts_at, 'MMM d, yyyy')}</p>
                    <p className="text-[#8B7355]">{formatRelativeTime(event.starts_at)}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className="font-semibold">{event.actual_attendance}</span>
                    <span className="text-[#8B7355]"> / {event.rsvp_count}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-ink">
                    {event.revenue ? formatCurrency(event.revenue) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-xs font-semibold px-2 py-1 rounded-lg',
                      rate >= 90 ? 'bg-green-50 text-green-700' :
                      rate >= 70 ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    )}>
                      {rate.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#8B7355]" title="Duplicate">
                        <Copy size={14} />
                      </button>
                      <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#8B7355]" title="Analytics">
                        <BarChart2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className="mt-4 bg-gradient-to-r from-[#1A1513] to-[#2D5A40] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-[#D94545]" />
          <p className="font-bold text-sm">AI Insights from your past events</p>
        </div>
        <p className="text-xs text-white/70 mb-3">
          Your workshops have a {avgAttendanceRate.toFixed(0)}% show-up rate — above SG average of 72%.
          Markets drew 3× more attendees than workshops. Consider scheduling another weekend market in Keong Saik.
        </p>
        <button className="bg-[#D94545] text-white text-xs font-bold px-4 py-2 rounded-xl">
          Plan similar event →
        </button>
      </div>
    </div>
  )
}

// ─── Drafts Tab ─────────────────────────────────────────────

function DraftsTab({ events }) {
  if (events.length === 0) {
    return <EmptyState title="No drafts" message="Unfinished events you're planning will show up here." />
  }

  return (
    <div className="space-y-3">
      {events.map(event => (
        <div key={event.id} className="bg-[#FAF6EE] rounded-2xl border-2 border-dashed border-gray-200 p-4 flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
            {EVENT_TYPE_LABELS[event.event_type]?.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm text-ink truncate">{event.title}</h4>
              <span className="text-[11px] font-semibold bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full">DRAFT</span>
            </div>
            <div className="text-xs text-[#6B5744] space-y-0.5 mb-2">
              <span className="flex items-center gap-1"><Clock size={11} /> {formatDate(event.starts_at, 'EEE, MMM d')}</span>
              <span className="flex items-center gap-1"><MapPin size={11} /> {event.venue_name}</span>
            </div>
            {/* Completeness */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-[#8B7355] mb-0.5">
                <span>Completion</span>
                <span>{event.completeness}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${event.completeness}%` }} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <button className="bg-[#D94545] hover:bg-[#a85225] text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
              Continue
            </button>
            <button className="text-xs text-[#8B7355] hover:text-red-500">Discard</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Plan New Tab ──────────────────────────────────────────

function PlanTab({ onCreated }) {
  const [form, setForm] = useState({
    title: '', type: 'workshop', venue: '', address: '', date: '', time: '',
    description: '', is_free: true, ticket_price: '', max_capacity: '',
  })

  return (
    <div>
      {/* AI prompt banner */}
      <div className="bg-gradient-to-r from-[#D94545] to-[#d97943] rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FAF6EE]/20 rounded-xl flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Let AI plan this event for you</p>
            <p className="text-xs text-white/80">Describe your idea in one sentence. AI fills in the rest.</p>
          </div>
        </div>
        <button className="bg-[#FAF6EE] text-[#D94545] text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap">
          Use AI
        </button>
      </div>

      <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-6">
        <h3 className="font-bold text-ink mb-5">Create New Event</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Event Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g. Weekend Coffee Cupping Session"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Event Type</label>
              <select
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30 bg-[#FAF6EE]"
              >
                {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Max Capacity</label>
              <input
                type="number"
                value={form.max_capacity}
                onChange={e => setForm({...form, max_capacity: e.target.value})}
                placeholder="20"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Start Time</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm({...form, time: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Venue Name</label>
            <input
              type="text"
              value={form.venue}
              onChange={e => setForm({...form, venue: e.target.value})}
              placeholder="e.g. Assembly Tanjong Pagar"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})}
              placeholder="100 Tras Street, Singapore 079027"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30"
            />
            <p className="text-xs text-[#8B7355] mt-1 inline-flex items-center gap-1"><MapPin size={11} /> This will be pinned on the public event map.</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="What's this event about? Who's it for?"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-[#D94545]/30"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Cover Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#D94545] transition-colors cursor-pointer">
              <ImagePlus size={28} className="text-[#8B7355] mx-auto mb-2" />
              <p className="text-sm text-[#6B5744]">Click to upload or drag and drop</p>
              <p className="text-xs text-[#8B7355] mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Ticket</label>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setForm({...form, is_free: true})}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all',
                  form.is_free
                    ? 'border-[#D94545] bg-[#C4B49A] text-[#D94545]'
                    : 'border-gray-200 text-[#6B5744] hover:border-gray-300'
                )}
              >
                Free Event
              </button>
              <button
                onClick={() => setForm({...form, is_free: false})}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all',
                  !form.is_free
                    ? 'border-[#D94545] bg-[#C4B49A] text-[#D94545]'
                    : 'border-gray-200 text-[#6B5744] hover:border-gray-300'
                )}
              >
                Paid Event
              </button>
            </div>
            {!form.is_free && (
              <input
                type="number"
                value={form.ticket_price}
                onChange={e => setForm({...form, ticket_price: e.target.value})}
                placeholder="Ticket price (SGD)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30"
              />
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-[#E8DDC8]">
            <button className="flex-1 bg-[#D94545] hover:bg-[#a85225] text-white font-semibold py-3 rounded-xl transition-colors">
              Publish Event
            </button>
            <button className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────

function EmptyState({ title, message }) {
  return (
    <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-12 text-center">
      <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
      <p className="font-bold text-gray-700 mb-1">{title}</p>
      <p className="text-sm text-[#8B7355]">{message}</p>
    </div>
  )
}

// ─── Main Events Page ──────────────────────────────────────

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('upcoming')

  // For demo: all MOCK_EVENTS are treated as this brand's upcoming
  const upcomingEvents = MOCK_EVENTS
  const pastEvents = PAST_EVENTS
  const draftEvents = DRAFT_EVENTS

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Events</h1>
          <p className="text-sm text-[#6B5744]">Plan events, manage RSVPs, track what worked.</p>
        </div>
        <button
          onClick={() => setActiveTab('plan')}
          className="flex items-center gap-2 bg-[#D94545] hover:bg-[#a85225] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Upcoming', value: upcomingEvents.length, icon: Calendar, color: 'text-[#D94545] bg-[#C4B49A]' },
          { label: 'This Week', value: upcomingEvents.filter(e => new Date(e.starts_at) < new Date(Date.now() + 7 * 86400000)).length, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Total RSVPs', value: upcomingEvents.reduce((s, e) => s + e.rsvp_count, 0), icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Drafts', value: draftEvents.length, icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-4">
            <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-2', color)}>
              <Icon size={16} />
            </div>
            <p className="text-xl font-bold text-ink">{value}</p>
            <p className="text-xs text-[#6B5744]">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-1.5 px-5 py-3 text-sm font-semibold border-b-2 transition-all',
              activeTab === id
                ? 'border-[#D94545] text-[#D94545]'
                : 'border-transparent text-[#8B7355] hover:text-gray-600'
            )}
          >
            <Icon size={16} />
            {label}
            {id === 'upcoming' && upcomingEvents.length > 0 && (
              <span className="bg-[#D94545] text-white text-[11px] font-bold px-2 py-0.5 rounded-full ml-1 min-w-[18px] inline-flex items-center justify-center">
                {upcomingEvents.length}
              </span>
            )}
            {id === 'drafts' && draftEvents.length > 0 && (
              <span className="bg-yellow-400 text-white text-[11px] font-bold px-2 py-0.5 rounded-full ml-1 min-w-[18px] inline-flex items-center justify-center">
                {draftEvents.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'upcoming' && <UpcomingTab events={upcomingEvents} />}
      {activeTab === 'past' && <PastTab events={pastEvents} />}
      {activeTab === 'drafts' && <DraftsTab events={draftEvents} />}
      {activeTab === 'plan' && <PlanTab onCreated={() => setActiveTab('upcoming')} />}
    </div>
  )
}
