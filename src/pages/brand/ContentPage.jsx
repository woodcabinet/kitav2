import { useState } from 'react'
import { Sparkles, Instagram, Calendar, Clock, Send, CheckCircle, Plus, Wand2, RefreshCw, Music2, Globe, ImagePlus, Heart } from 'lucide-react'
import { MOCK_POSTS } from '../../data/mockData'
import { PlatformBadge } from '../../components/shared/Badge'
import { formatDate } from '../../lib/utils'

const AI_CAPTIONS = [
  "Your Monday just got an upgrade — new single origin from Ethiopia — nutty, citrus, and dangerously smooth. Available now at all outlets. Link in bio.",
  "We source. We roast. We brew. But really, it's all for you. Come find your perfect cup this week.",
  "Some things are worth waking up early for. Ethiopia Yirgacheffe is in. Grab it before it's gone.",
]

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', Icon: Instagram },
  { id: 'tiktok',    label: 'TikTok',    Icon: Music2 },
  { id: 'website',   label: 'Website Blog', Icon: Globe },
]

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('create')
  const [caption, setCaption] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram'])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiCaption, setAiCaption] = useState(null)
  const [scheduleDate, setScheduleDate] = useState('')

  function togglePlatform(id) {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  async function generateCaption() {
    setAiLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setAiCaption(AI_CAPTIONS[Math.floor(Math.random() * AI_CAPTIONS.length)])
    setAiLoading(false)
  }

  function useAiCaption() {
    setCaption(aiCaption)
    setAiCaption(null)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Content Studio</h1>
          <p className="text-sm text-[#6B5744]">Create once. Publish everywhere. Let AI do the heavy lifting.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'create', label: 'Create & Schedule' },
          { id: 'queue', label: 'Queue' },
          { id: 'published', label: 'Published' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-[#D94545] text-[#D94545]'
                : 'border-transparent text-[#8B7355] hover:text-[#6B5744]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Composer */}
          <div className="lg:col-span-2 space-y-4">
            {/* Media upload */}
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-[#D94545] transition-colors cursor-pointer">
              <ImagePlus size={30} className="text-[#8B7355] mx-auto mb-2" />
              <p className="font-semibold text-gray-700">Add Photo or Video</p>
              <p className="text-sm text-[#8B7355]">Drag & drop, or click to browse</p>
              <p className="text-xs text-gray-300 mt-1">JPG, PNG, MP4 · Max 50MB</p>
            </div>

            {/* Caption */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Caption</label>
                <button
                  onClick={generateCaption}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#D94545] bg-[#C4B49A] px-3 py-1.5 rounded-xl hover:bg-[#eee4d8] transition-colors"
                >
                  {aiLoading ? <RefreshCw size={12} className="animate-spin" /> : <Wand2 size={12} />}
                  {aiLoading ? 'Generating...' : 'Write with AI'}
                </button>
              </div>

              {aiCaption && (
                <div className="mb-2 p-3 bg-gradient-to-br from-[#C4B49A] to-white border border-[#D94545]/20 rounded-xl">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={12} className="text-[#D94545]" />
                    <span className="text-xs font-semibold text-[#D94545]">AI Suggestion</span>
                  </div>
                  <p className="text-sm text-gray-700">{aiCaption}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={useAiCaption} className="text-xs font-semibold text-white bg-[#D94545] px-3 py-1 rounded-lg">Use this</button>
                    <button onClick={generateCaption} className="text-xs font-semibold text-[#6B5744] bg-gray-100 px-3 py-1 rounded-lg">Try again</button>
                    <button onClick={() => setAiCaption(null)} className="text-xs text-[#8B7355] px-2">Dismiss</button>
                  </div>
                </div>
              )}

              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Write your caption... or let AI write it for you."
                rows={5}
                className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-[#D94545]/30 focus:border-[#D94545]"
              />
              <p className="text-xs text-[#8B7355] text-right mt-1">{caption.length} / 2200</p>
            </div>

            {/* Platforms */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Publish to</p>
              <div className="flex gap-2">
                {PLATFORMS.map(p => {
                  const PIcon = p.Icon
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedPlatforms.includes(p.id)
                          ? 'border-[#D94545] bg-[#C4B49A] text-[#D94545]'
                          : 'border-gray-200 text-[#6B5744] hover:border-gray-300'
                      }`}
                    >
                      <PIcon size={15} />
                      {p.label}
                      {selectedPlatforms.includes(p.id) && <CheckCircle size={14} />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Schedule</p>
              <div className="flex gap-3">
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#D94545] hover:bg-[#a85225] text-white font-semibold py-3 rounded-xl transition-colors">
                <Send size={16} />
                {scheduleDate ? 'Schedule Post' : 'Publish Now'}
              </button>
              <button className="px-4 py-3 border-2 border-gray-200 text-[#6B5744] font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Save Draft
              </button>
            </div>
          </div>

          {/* AI Tips sidebar */}
          <div className="space-y-4">
            <div className="bg-[#1A1513] rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-[#D94545]" />
                <span className="font-bold text-sm">AI Insights</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/60 mb-0.5">Best time to post</p>
                  <p className="font-semibold text-sm">Tue & Thu, 7–9PM</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-0.5">Trending hashtags</p>
                  <div className="flex flex-wrap gap-1">
                    {['#sglocal', '#kopisg', '#specialtycoffee', '#sgfood'].map(tag => (
                      <button key={tag} onClick={() => setCaption(c => c + ' ' + tag)} className="text-xs bg-[#FAF6EE]/10 hover:bg-[#FAF6EE]/20 text-white/80 px-2 py-0.5 rounded-full">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-0.5">Suggested format</p>
                  <p className="text-sm font-semibold">Carousel (3–5 images)<br/>
                    <span className="text-white/60 font-normal text-xs">+42% engagement for your audience</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF6EE] border border-[#E8DDC8] rounded-2xl p-4">
              <p className="font-semibold text-sm text-ink mb-3">Cross-posting</p>
              <p className="text-xs text-[#6B5744] mb-3">
                Publishing to all 3 platforms simultaneously. We auto-adapt format and caption length for each platform.
              </p>
              <div className="space-y-2">
                {PLATFORMS.filter(p => selectedPlatforms.includes(p.id)).map(p => {
                  const PIcon = p.Icon
                  return (
                    <div key={p.id} className="flex items-center gap-2 text-xs text-[#6B5744]">
                      <CheckCircle size={12} className="text-green-500" />
                      <PIcon size={12} /> {p.label} — ready
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'queue' || activeTab === 'published') && (
        <div className="space-y-3">
          {MOCK_POSTS.slice(0, 4).map(post => (
            <div key={post.id} className="flex gap-4 bg-[#FAF6EE] border border-[#E8DDC8] rounded-2xl p-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                {post.media_urls?.[0] && <img src={post.media_urls[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <PlatformBadge platform={post.platform} />
                  <span className="text-xs text-[#8B7355]">{formatDate(post.published_at, 'MMM d · h:mm a')}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-semibold text-gray-700 inline-flex items-center gap-1"><Heart size={11} className="fill-current text-red-500" /> {post.likes}</p>
                <p className="text-xs text-[#8B7355]">{post.views?.toLocaleString()} views</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
