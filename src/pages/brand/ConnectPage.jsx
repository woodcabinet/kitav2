import { useState } from 'react'
import { Users, Handshake, Search, CheckCircle, MessageSquare, Plus } from 'lucide-react'
import { MOCK_BRANDS } from '../../data/mockData'
import { Avatar } from '../../components/shared/Avatar'
import { CategoryBadge } from '../../components/shared/Badge'
import { formatNumber } from '../../lib/utils'

const OPEN_COLLABS = [
  {
    id: 'c1',
    brand: MOCK_BRANDS[4],
    title: 'Looking for Fashion Brand Partner — Pop-Up Market',
    type: 'pop_up_partner',
    description: 'Foreword Coffee is organising a weekend pop-up at Bugis Junction in May. We\'re looking for 2–3 fashion or lifestyle brands to co-host. Our foot traffic is 400–600/day.',
    requirements: 'SG-based brand, 1+ year in operation, Instagram following 2K+',
    compensation: 'Revenue share, shared marketing',
    deadline: '2026-04-30',
    applicants: 7,
  },
  {
    id: 'c2',
    brand: MOCK_BRANDS[3],
    title: 'Product Collab: Gifting Set for SG60',
    type: 'product_collab',
    description: 'Supermama is curating a SG60 premium gifting set. Looking for complementary brands (food, stationery, wellness) to feature alongside our ceramics.',
    requirements: 'Premium positioning, local brand, product can be gifted',
    compensation: 'Revenue share + brand feature in our SG60 campaign (30K+ reach)',
    deadline: '2026-05-15',
    applicants: 12,
  },
  {
    id: 'c3',
    brand: MOCK_BRANDS[0],
    title: 'Wholesale Partner: Corporate Gifting',
    type: 'product_collab',
    description: 'Assembly Coffee is building a corporate gifting catalogue. Looking for complementary products from local brands for bundle opportunities.',
    requirements: 'Can fulfil bulk orders, professional packaging',
    compensation: 'Wholesale pricing + co-marketing',
    deadline: '2026-05-01',
    applicants: 4,
  },
]

const COLLAB_TYPE_LABELS = {
  pop_up_partner: 'Pop-Up Partner',
  product_collab: 'Product Collab',
  event_collab: 'Event Collab',
  sponsor: 'Sponsorship',
}

function CollabCard({ collab }) {
  const [applied, setApplied] = useState(false)
  return (
    <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <Avatar src={collab.brand.logo_url} name={collab.brand.name} size="md" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm text-ink">{collab.brand.name}</span>
            <CheckCircle size={12} className="text-[#D94545]" />
          </div>
          <span className="text-xs text-[#D94545] font-medium">{COLLAB_TYPE_LABELS[collab.type]}</span>
        </div>
      </div>

      <h3 className="font-bold text-base text-ink mb-2">{collab.title}</h3>
      <p className="text-sm text-[#6B5744] mb-3 line-clamp-2">{collab.description}</p>

      <div className="space-y-1.5 mb-4 text-xs text-[#6B5744]">
        <div><span className="font-semibold text-gray-700">Requirements:</span> {collab.requirements}</div>
        <div><span className="font-semibold text-gray-700">Compensation:</span> {collab.compensation}</div>
        <div><span className="font-semibold text-gray-700">Deadline:</span> {collab.deadline}</div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8B7355]">{collab.applicants} brands applied</span>
        <button
          onClick={() => setApplied(a => !a)}
          className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
            applied
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-[#D94545] text-white hover:bg-[#a85225]'
          }`}
        >
          {applied ? (<span className="inline-flex items-center gap-1"><CheckCircle size={14} /> Applied</span>) : 'Apply Now'}
        </button>
      </div>
    </div>
  )
}

function BrandConnectionCard({ brand }) {
  const [connected, setConnected] = useState(false)
  return (
    <div className="flex items-center gap-3 bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-3">
      <Avatar src={brand.logo_url} name={brand.name} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-sm text-ink truncate">{brand.name}</span>
          {brand.verified && <CheckCircle size={11} className="text-[#D94545] flex-shrink-0" />}
        </div>
        <CategoryBadge category={brand.category} className="mt-0.5" />
        <p className="text-xs text-[#8B7355] mt-0.5">
          {brand.follower_count != null && <>{formatNumber(brand.follower_count)} followers · </>}
          {brand.location}
        </p>
      </div>
      <button
        onClick={() => setConnected(c => !c)}
        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex-shrink-0 ${
          connected
            ? 'border-gray-300 text-[#6B5744]'
            : 'border-[#D94545] text-[#D94545] hover:bg-[#D94545] hover:text-white'
        }`}
      >
        {connected ? 'Connected' : 'Connect'}
      </button>
    </div>
  )
}

export default function ConnectPage() {
  const [activeTab, setActiveTab] = useState('collabs')

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Connect</h1>
          <p className="text-sm text-[#6B5744]">Find collab partners, apply for opportunities, grow your network.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#D94545] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#a85225] transition-colors">
          <Plus size={16} />
          Post Collab
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Brand Connections', value: '23', icon: Users },
          { label: 'Open Collabs', value: '3', icon: Handshake },
          { label: 'Applications Sent', value: '7', icon: CheckCircle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C4B49A] rounded-xl flex items-center justify-center">
              <Icon size={18} className="text-[#D94545]" />
            </div>
            <div>
              <p className="text-xl font-bold text-ink">{value}</p>
              <p className="text-xs text-[#6B5744]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'collabs', label: 'Open Collabs' },
          { id: 'network', label: 'My Network' },
          { id: 'discover', label: 'Discover Brands' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-[#D94545] text-[#D94545]'
                : 'border-transparent text-[#8B7355] hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'collabs' && (
        <div className="space-y-4">
          {OPEN_COLLABS.map(collab => <CollabCard key={collab.id} collab={collab} />)}
        </div>
      )}

      {activeTab === 'network' && (
        <div className="space-y-2">
          {MOCK_BRANDS.slice(0, 4).map(brand => (
            <div key={brand.id} className="flex items-center gap-3 bg-[#FAF6EE] rounded-2xl border border-[#E8DDC8] p-3">
              <Avatar src={brand.logo_url} name={brand.name} size="md" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-ink">{brand.name}</p>
                <p className="text-xs text-[#8B7355]">Connected since March 2026</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-[#6B5744] bg-gray-100 px-3 py-1.5 rounded-xl hover:bg-gray-200">
                <MessageSquare size={12} />
                Message
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'discover' && (
        <div className="space-y-2">
          {MOCK_BRANDS.slice(0, 6).map(brand => (
            <BrandConnectionCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </div>
  )
}
