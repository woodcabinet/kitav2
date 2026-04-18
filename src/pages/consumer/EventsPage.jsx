import { useState } from 'react'
import { Map, List, Calendar } from 'lucide-react'
import { EventCard } from '../../components/consumer/EventCard'
import { MOCK_EVENTS } from '../../data/mockData'
import { formatDate } from '../../lib/utils'

const TYPES = ['All', 'Market', 'Workshop', 'Launch', 'Pop-Up']

export default function EventsPage() {
  const [view, setView] = useState('list')
  const [activeType, setActiveType] = useState('All')

  const filtered = MOCK_EVENTS.filter(e =>
    activeType === 'All' || e.event_type === activeType.toLowerCase().replace('-', '_')
  )

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => setView('map')}
              className={`p-1.5 rounded-lg transition-all ${view === 'map' ? 'bg-white shadow-sm' : ''}`}
            >
              <Map size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500">{filtered.length} events happening in Singapore</p>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeType === t
                ? 'bg-[#D94545] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {view === 'map' ? (
        /* Map placeholder — swap for real Mapbox in production */
        <div className="mx-4 rounded-3xl overflow-hidden border border-gray-200">
          <div className="h-80 bg-gradient-to-br from-green-50 to-teal-50 flex flex-col items-center justify-center gap-3">
            <Map size={48} className="text-[#1A1513]" />
            <p className="font-bold text-gray-700">Interactive Map</p>
            <p className="text-sm text-gray-500 text-center px-8">
              Connect your Mapbox API key to enable the full event map with pins for all {MOCK_EVENTS.length} events.
            </p>
            <div className="flex flex-col gap-1 mt-2 w-full px-6">
              {filtered.map(e => (
                <div key={e.id} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#D94545]" />
                  <span className="font-medium text-gray-800 flex-1 truncate">{e.title}</span>
                  <span className="text-gray-400 text-xs">{formatDate(e.starts_at, 'MMM d')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-4">
          {filtered.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700">No events found</p>
          <p className="text-sm text-gray-400">Check back soon.</p>
        </div>
      )}
    </div>
  )
}
