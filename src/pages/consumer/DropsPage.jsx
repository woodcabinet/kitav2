import { Zap } from 'lucide-react'
import { DropCard } from '../../components/consumer/DropCard'
import { MOCK_DROPS } from '../../data/mockData'

export default function DropsPage() {
  const upcoming = MOCK_DROPS.filter(d => new Date(d.drop_at) > new Date())
  const live = MOCK_DROPS.filter(d => new Date(d.drop_at) <= new Date())

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={24} className="text-[#D94545]" />
          <h1 className="text-2xl font-bold text-gray-900">Drops</h1>
        </div>
        <p className="text-sm text-gray-500">Limited releases from Singapore's best local brands. Don't sleep.</p>
      </div>

      {live.length > 0 && (
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-[#D94545] rounded-full animate-pulse" />
            <h2 className="font-bold text-gray-900">Live Now</h2>
          </div>
          <div className="space-y-4">
            {live.map(drop => <DropCard key={drop.id} drop={drop} />)}
          </div>
        </div>
      )}

      <div className="px-4">
        <h2 className="font-bold text-gray-900 mb-3">Upcoming</h2>
        <div className="space-y-4">
          {upcoming.map(drop => <DropCard key={drop.id} drop={drop} />)}
        </div>
      </div>

      {/* How it works */}
      <div className="mx-4 mt-8 p-5 bg-[#C4B49A] rounded-3xl">
        <h3 className="font-bold text-gray-900 mb-3">How Drops Work</h3>
        <div className="space-y-3">
          {[
            { icon: '🔥', title: 'Hype it', desc: 'Tap the flame icon to track a drop. You\'ll get notified when it goes live.' },
            { icon: '⚡', title: 'Drop goes live', desc: 'At the countdown, the shop opens. First come, first served.' },
            { icon: '🎁', title: 'Support local', desc: 'Payments go directly to the brand. No middleman margin.' },
          ].map(step => (
            <div key={step.icon} className="flex gap-3">
              <span className="text-2xl flex-shrink-0">{step.icon}</span>
              <div>
                <p className="font-semibold text-sm text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
