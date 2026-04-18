import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, CheckCircle, ArrowRight, Instagram, Globe, Search,
  RefreshCw, AlertCircle, Package, Trash2, Plus, Edit2, Coffee,
  Check, ExternalLink, Facebook, Music2, TrendingUp, Users, Heart,
  DollarSign, BarChart2, Eye, MessageCircle
} from 'lucide-react'
import { scrapeBrand } from '../../lib/brandScraper'
import { discoverBrand } from '../../lib/brandDiscover'
import { saveBrandProfile } from '../../lib/brandStore'
import { CATEGORY_LABELS } from '../../lib/utils'

// ═══════════════════════════════ MAIN ═══════════════════════════════

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [businessName, setBusinessName] = useState('')
  const [discovered, setDiscovered] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [customInputs, setCustomInputs] = useState({ website: '', instagram: '', tiktok: '' })
  const [scanning, setScanning] = useState(false)
  const [scraped, setScraped] = useState(null)
  const [error, setError] = useState(null)
  const [discovering, setDiscovering] = useState(false)

  async function runDiscovery() {
    if (!businessName.trim()) {
      setError('Tell us what your business is called ☕')
      return
    }
    setError(null)
    setDiscovering(true)
    try {
      const d = await discoverBrand(businessName)
      setDiscovered(d)
      setStep(1)
    } catch (e) {
      setError(e.message ?? 'Search failed. Try a different name or add your URL manually.')
    } finally {
      setDiscovering(false)
    }
  }

  function toggleSelect(key) {
    setSelected(s => {
      const n = new Set(s)
      n.has(key) ? n.delete(key) : n.add(key)
      return n
    })
  }

  function getSelectedSources() {
    const sources = { website: null, instagram: null, tiktok: null }
    selected.forEach(key => {
      const [kind, i] = key.split(':')
      const item = discovered?.[kind === 'instagram' || kind === 'tiktok' || kind === 'facebook' ? kind : 'websites']?.[parseInt(i)]
      if (!item) return
      if (kind === 'website' && !sources.website) sources.website = item.url
      if (kind === 'instagram' && !sources.instagram) sources.instagram = item.handle
      if (kind === 'tiktok' && !sources.tiktok) sources.tiktok = item.handle
    })
    // Manual inputs override
    if (customInputs.website) sources.website = customInputs.website
    if (customInputs.instagram) sources.instagram = customInputs.instagram.replace(/^@/, '')
    if (customInputs.tiktok) sources.tiktok = customInputs.tiktok.replace(/^@/, '')
    return sources
  }

  async function runScan() {
    const sources = getSelectedSources()
    if (!sources.website && !sources.instagram) {
      setError('Pick at least one source — a website or social account.')
      return
    }
    setError(null)
    setScanning(true)
    setStep(2)
    try {
      const data = await scrapeBrand({ website: sources.website, instagram: sources.instagram })
      if (!data.name && businessName) data.name = businessName
      setScraped(data)
      setStep(3)
    } catch (e) {
      setError(e.message ?? 'Scan failed.')
      setStep(1)
    } finally {
      setScanning(false)
    }
  }

  function updateField(field, value) {
    setScraped(s => ({ ...s, [field]: value }))
  }
  function updateProduct(idx, field, value) {
    setScraped(s => ({ ...s, products: s.products.map((p, i) => i === idx ? { ...p, [field]: value } : p) }))
  }
  function removeProduct(idx) {
    setScraped(s => ({ ...s, products: s.products.filter((_, i) => i !== idx) }))
  }
  function addProduct() {
    setScraped(s => ({
      ...s,
      products: [...(s.products ?? []), { id: `new-${Date.now()}`, name: 'New product', price: 0, images: [], stock: 10 }],
    }))
  }

  function goLive() {
    saveBrandProfile({
      name: scraped.name, tagline: scraped.tagline, description: scraped.description,
      logo_url: scraped.logo_url, banner_url: scraped.banner_url, platform: scraped.platform,
      category: scraped.suggested_category, tags: scraped.suggested_tags,
      website: scraped.url, instagram: scraped.instagram,
      products: scraped.products, gallery: scraped.gallery,
      onboarded_at: new Date().toISOString(),
    })
    setStep(4)
  }

  return (
    <div className="min-h-screen paper-texture flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient coffee steam — decorative */}
      <SteamDecor />

      <div className="w-full max-w-3xl relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#D94545] flex items-center justify-center shadow-warm">
              <span className="text-white font-bold text-lg font-display">K</span>
            </div>
            <span className="font-display font-bold text-2xl text-[#1A1513]">kitakakis</span>
          </div>
        </motion.div>

        {/* Progress dots */}
        <ProgressDots current={step} />

        <AnimatePresence mode="wait">
          {/* ═══ STEP 0: NAME ═══ */}
          {step === 0 && (
            <StepWrapper key="0">
              <StepName
                value={businessName}
                onChange={setBusinessName}
                onContinue={runDiscovery}
                error={error}
                loading={discovering}
              />
            </StepWrapper>
          )}

          {/* ═══ STEP 1: PICK SOURCES ═══ */}
          {step === 1 && discovered && (
            <StepWrapper key="1">
              <StepDiscovery
                name={businessName}
                discovered={discovered}
                selected={selected}
                onToggle={toggleSelect}
                customInputs={customInputs}
                onCustomInput={(k, v) => setCustomInputs(c => ({ ...c, [k]: v }))}
                onBack={() => setStep(0)}
                onContinue={runScan}
                error={error}
              />
            </StepWrapper>
          )}

          {/* ═══ STEP 2: SCANNING ═══ */}
          {step === 2 && (
            <StepWrapper key="2">
              <StepScanning />
            </StepWrapper>
          )}

          {/* ═══ STEP 3: REVIEW + EDIT ═══ */}
          {step === 3 && scraped && (
            <StepWrapper key="3">
              <StepReview
                scraped={scraped}
                onField={updateField}
                onProduct={updateProduct}
                onRemoveProduct={removeProduct}
                onAddProduct={addProduct}
                onBack={() => setStep(1)}
                onLive={goLive}
              />
            </StepWrapper>
          )}

          {/* ═══ STEP 4: LIVE + ANALYTICS EXPLAINER ═══ */}
          {step === 4 && (
            <StepWrapper key="4">
              <StepLive scraped={scraped} onDashboard={() => navigate('/dashboard')} />
            </StepWrapper>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ═══════════════════════════════ SHARED ═══════════════════════════════

function StepWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="paper-card rounded-3xl p-6 sm:p-8 shadow-warm-lg"
    >
      {children}
    </motion.div>
  )
}

function ProgressDots({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor: i <= current ? '#D94545' : '#E8DDCB',
          }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  )
}

function SteamDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute w-2 h-10 bg-gradient-to-t from-transparent via-[#D94545]/10 to-transparent rounded-full animate-steam"
          style={{
            left: `${15 + i * 30}%`,
            bottom: '20%',
            animationDelay: `${i * 0.8}s`,
            filter: 'blur(4px)',
          }}
        />
      ))}
    </div>
  )
}

// ═══════════════════════════════ STEP 0: NAME ═══════════════════════════════

function StepName({ value, onChange, onContinue, error, loading }) {
  return (
    <div>
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D94545] mb-4 shadow-warm-lg"
        >
          <Coffee size={28} className="text-white" />
        </motion.div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1513] mb-2 leading-tight">
          Hey there <span className="font-hand text-[#D94545] text-4xl sm:text-5xl">!</span>
        </h1>
        <p className="text-gray-600 text-base">
          Let's find your business. <span className="font-hand text-[#D94545] text-lg">no login needed</span>
        </p>
      </div>

      <div className="mb-4">
        <label className="font-hand text-xl text-[#1A1513] block mb-2 text-center">
          What's your business called?
        </label>
        <input
          type="text"
          autoFocus
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onContinue()}
          placeholder="Maroon Clothing"
          className="w-full px-5 py-5 font-display text-2xl sm:text-3xl text-center bg-white/60 border-2 border-[#E8DDCB] rounded-2xl outline-none focus:border-[#D94545] focus:bg-white transition-all placeholder:text-gray-300"
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2"
        >
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        disabled={loading}
        className="w-full bg-[#D94545] hover:bg-[#a85225] disabled:opacity-70 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-warm"
      >
        {loading ? (
          <>
            <RefreshCw size={18} className="animate-spin" /> Searching the web...
          </>
        ) : (
          <>
            Find my business <ArrowRight size={18} />
          </>
        )}
      </motion.button>

      <p className="text-xs text-gray-400 text-center mt-4">
        We search the web for your website, Instagram, TikTok, and Facebook.<br/>
        You pick which ones are actually yours.
      </p>
    </div>
  )
}

// ═══════════════════════════════ STEP 1: DISCOVERY ═══════════════════════════════

function StepDiscovery({ name, discovered, selected, onToggle, customInputs, onCustomInput, onBack, onContinue, error }) {
  const totalFound = (discovered.websites?.length ?? 0) + (discovered.instagram?.length ?? 0) + (discovered.tiktok?.length ?? 0) + (discovered.facebook?.length ?? 0)
  const selectedCount = selected.size + Object.values(customInputs).filter(Boolean).length

  return (
    <div>
      <div className="flex items-start gap-3 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-12 h-12 bg-[#D94545] rounded-2xl flex items-center justify-center shadow-warm flex-shrink-0"
        >
          <Search size={22} className="text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-2xl font-bold text-[#1A1513] leading-tight">
            Found {totalFound} things for "{name}"
          </h2>
          <p className="font-hand text-lg text-[#D94545]">pick the ones that are yours ↓</p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-5 stagger-in">
        {discovered.websites?.length > 0 && (
          <Section icon={Globe} label="Websites" count={discovered.websites.length}>
            {discovered.websites.map((r, i) => (
              <SourceCard
                key={r.url}
                kind="website"
                selected={selected.has(`website:${i}`)}
                onToggle={() => onToggle(`website:${i}`)}
                icon={r.icon}
                title={r.title || r.domain}
                subtitle={r.domain}
                url={r.url}
                snippet={r.snippet}
              />
            ))}
          </Section>
        )}

        {discovered.instagram?.length > 0 && (
          <Section icon={Instagram} label="Instagram" count={discovered.instagram.length}>
            {discovered.instagram.map((r, i) => (
              <SourceCard
                key={r.url}
                kind="instagram"
                selected={selected.has(`instagram:${i}`)}
                onToggle={() => onToggle(`instagram:${i}`)}
                icon={r.icon}
                title={`@${r.handle}`}
                subtitle={r.title}
                url={r.url}
                snippet={r.snippet}
              />
            ))}
          </Section>
        )}

        {discovered.tiktok?.length > 0 && (
          <Section icon={Music2} label="TikTok" count={discovered.tiktok.length}>
            {discovered.tiktok.map((r, i) => (
              <SourceCard
                key={r.url}
                kind="tiktok"
                selected={selected.has(`tiktok:${i}`)}
                onToggle={() => onToggle(`tiktok:${i}`)}
                icon={r.icon}
                title={`@${r.handle}`}
                subtitle={r.title}
                url={r.url}
                snippet={r.snippet}
              />
            ))}
          </Section>
        )}

        {discovered.facebook?.length > 0 && (
          <Section icon={Facebook} label="Facebook" count={discovered.facebook.length}>
            {discovered.facebook.map((r, i) => (
              <SourceCard
                key={r.url}
                kind="facebook"
                selected={selected.has(`facebook:${i}`)}
                onToggle={() => onToggle(`facebook:${i}`)}
                icon={r.icon}
                title={r.title}
                subtitle={r.domain}
                url={r.url}
                snippet={r.snippet}
              />
            ))}
          </Section>
        )}

        {totalFound === 0 && (
          <div className="text-center py-8 bg-[#FAF6EE] rounded-2xl border border-[#E8DDCB]">
            <p className="font-hand text-2xl text-[#D94545] mb-1">no results 🤷</p>
            <p className="text-sm text-gray-500">No problem — add your links manually below.</p>
          </div>
        )}

        {/* Manual add-your-own */}
        <Section icon={Plus} label="Add yours manually" count={null}>
          <div className="space-y-2">
            <ManualInput
              icon={Globe}
              placeholder="yourwebsite.com"
              value={customInputs.website}
              onChange={v => onCustomInput('website', v)}
            />
            <ManualInput
              icon={Instagram}
              placeholder="@yourhandle"
              value={customInputs.instagram}
              onChange={v => onCustomInput('instagram', v)}
            />
            <ManualInput
              icon={Music2}
              placeholder="@tiktokhandle"
              value={customInputs.tiktok}
              onChange={v => onCustomInput('tiktok', v)}
            />
          </div>
        </Section>
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex gap-2 mt-6 sticky bottom-2 bg-gradient-to-t from-[#FAF6EE] to-transparent pt-4 -mx-2 px-2">
        <button
          onClick={onBack}
          className="px-5 py-4 border-2 border-[#E8DDCB] text-gray-600 font-semibold rounded-2xl hover:bg-white"
        >
          ← Back
        </button>
        <motion.button
          whileHover={{ scale: selectedCount > 0 ? 1.01 : 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          disabled={selectedCount === 0}
          className="flex-1 bg-[#D94545] hover:bg-[#a85225] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-warm transition-colors"
        >
          <Sparkles size={18} /> Scan {selectedCount > 0 && `${selectedCount} source${selectedCount > 1 ? 's' : ''}`}
        </motion.button>
      </div>
    </div>
  )
}

function Section({ icon: Icon, label, count, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-[#D94545]" />
        <span className="text-sm font-semibold text-[#1A1513] uppercase tracking-wide">{label}</span>
        {count !== null && <span className="text-xs text-gray-400">({count})</span>}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function SourceCard({ selected, onToggle, icon, title, subtitle, url, snippet }) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      onClick={onToggle}
      className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all ${
        selected
          ? 'border-[#D94545] bg-[#D94545]/5 shadow-warm'
          : 'border-[#E8DDCB] bg-white hover:border-[#D94545]/40 hover:bg-[#FAF6EE]'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          selected ? 'bg-[#D94545] border-[#D94545]' : 'border-gray-300'
        }`}>
          {selected && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>

        {/* Favicon */}
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={icon} alt="" className="w-5 h-5" referrerPolicy="no-referrer" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#1A1513] truncate">{title}</p>
          {snippet && <p className="text-xs text-gray-500 line-clamp-1">{snippet}</p>}
          {subtitle && !snippet && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"
        >
          <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  )
}

function ManualInput({ icon: Icon, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#E8DDCB] rounded-xl text-sm outline-none focus:border-[#D94545] transition-colors"
      />
    </div>
  )
}

// ═══════════════════════════════ STEP 2: SCANNING ═══════════════════════════════

function StepScanning() {
  const [stageIdx, setStageIdx] = useState(0)
  const stages = [
    'Brewing the scan... ☕',
    'Reading your website...',
    'Checking Instagram vibes...',
    'Importing products...',
    'Scanning imagery...',
    'Finalising your profile...',
  ]

  useEffect(() => {
    const t = setInterval(() => setStageIdx(i => Math.min(i + 1, stages.length - 1)), 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="py-6">
      {/* Coffee cup with steam */}
      <div className="relative flex justify-center mb-6">
        <div className="relative">
          {/* Steam puffs */}
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute w-1.5 h-8 bg-gradient-to-t from-transparent via-[#D94545]/30 to-transparent rounded-full animate-steam"
              style={{ left: `${10 + i * 10}px`, bottom: '70px', animationDelay: `${i * 0.5}s`, filter: 'blur(2px)' }}
            />
          ))}
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-[#D94545] flex items-center justify-center shadow-warm-lg"
          >
            <Coffee size={36} className="text-white" />
          </motion.div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold text-[#1A1513] mb-1">Scanning...</h2>
        <p className="font-hand text-xl text-[#D94545]">this should take ~30 seconds</p>
      </div>

      <div className="space-y-2">
        {stages.map((msg, i) => (
          <motion.div
            key={msg}
            initial={{ opacity: 0 }}
            animate={{ opacity: i <= stageIdx ? 1 : 0.3 }}
            className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
              i === stageIdx ? 'bg-[#D94545]/5' : ''
            }`}
          >
            {i < stageIdx ? (
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
            ) : i === stageIdx ? (
              <RefreshCw size={16} className="text-[#D94545] animate-spin flex-shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
            )}
            <span className={`text-sm ${i === stageIdx ? 'font-semibold text-[#1A1513]' : 'text-gray-500'}`}>
              {msg}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════ STEP 3: REVIEW ═══════════════════════════════

function StepReview({ scraped, onField, onProduct, onRemoveProduct, onAddProduct, onBack, onLive }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <CheckCircle size={22} className="text-green-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1A1513] leading-tight">Found your brand.</h2>
          <p className="font-hand text-lg text-[#D94545]">edit anything, nothing is locked ✏️</p>
        </div>
      </div>

      {/* Preview card */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#E8DDCB] mb-4 bg-white">
        {scraped.banner_url ? (
          <img src={scraped.banner_url} alt="" className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-[#C4B49A] to-[#E8DDCB]" />
        )}
        <div className="p-4 flex items-center gap-3">
          {scraped.logo_url && (
            <img src={scraped.logo_url} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-warm -mt-12 bg-white" referrerPolicy="no-referrer" />
          )}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={scraped.name ?? ''}
              onChange={e => onField('name', e.target.value)}
              className="w-full font-display font-bold text-[#1A1513] text-lg outline-none border-b border-transparent hover:border-[#E8DDCB] focus:border-[#D94545] bg-transparent"
            />
            <input
              type="text"
              value={scraped.tagline ?? ''}
              onChange={e => onField('tagline', e.target.value)}
              placeholder="Add a tagline"
              className="w-full text-sm text-gray-500 outline-none border-b border-transparent hover:border-[#E8DDCB] focus:border-[#D94545] bg-transparent mt-1"
            />
          </div>
        </div>
      </div>

      {/* Image URL editors */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <label className="block">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Logo URL</span>
          <input
            type="url"
            value={scraped.logo_url ?? ''}
            onChange={e => onField('logo_url', e.target.value)}
            className="w-full mt-1 px-3 py-2 text-xs bg-white border border-[#E8DDCB] rounded-xl outline-none focus:border-[#D94545]"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Banner URL</span>
          <input
            type="url"
            value={scraped.banner_url ?? ''}
            onChange={e => onField('banner_url', e.target.value)}
            className="w-full mt-1 px-3 py-2 text-xs bg-white border border-[#E8DDCB] rounded-xl outline-none focus:border-[#D94545]"
          />
        </label>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatPill value={scraped.products?.length ?? 0} label="Products" />
        <StatPill value={scraped.gallery?.length ?? 0} label="Images" />
        <StatPill value={scraped.instagram?.followers ?? '—'} label="IG followers" />
      </div>

      {/* Products */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Package size={14} className="text-[#D94545]" />
            <p className="text-sm font-semibold text-[#1A1513]">Products</p>
            {scraped.product_strategy && scraped.product_strategy !== 'none' && (
              <span className="text-[10px] text-gray-400 ml-1 font-hand text-sm">via {scraped.product_strategy}</span>
            )}
          </div>
          <button onClick={onAddProduct} className="text-xs text-[#D94545] font-semibold flex items-center gap-1 hover:bg-[#D94545]/5 px-2 py-1 rounded-lg">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {(scraped.products ?? []).map((p, i) => (
            <ProductRow key={p.id ?? i} product={p} idx={i} onChange={onProduct} onRemove={onRemoveProduct} />
          ))}
          {!scraped.products?.length && (
            <div className="text-center py-6 bg-[#FAF6EE] rounded-2xl border border-[#E8DDCB]">
              <p className="font-hand text-lg text-gray-500">no products found — add after going live</p>
            </div>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="mb-4 p-3 bg-[#FAF6EE] border border-[#E8DDCB] rounded-2xl flex items-center justify-between">
        <span className="text-sm text-gray-600">Category</span>
        <select
          value={scraped.suggested_category ?? 'lifestyle'}
          onChange={e => onField('suggested_category', e.target.value)}
          className="text-sm font-semibold text-[#1A1513] bg-transparent outline-none cursor-pointer"
        >
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {scraped.warnings?.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-2xl space-y-1">
          {scraped.warnings.map(w => (
            <p key={w} className="text-xs text-yellow-700 flex items-start gap-1.5">
              <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />{w}
            </p>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onBack} className="px-5 py-4 border-2 border-[#E8DDCB] text-gray-600 font-semibold rounded-2xl hover:bg-white">
          ← Back
        </button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLive}
          className="flex-1 bg-[#D94545] hover:bg-[#a85225] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-warm transition-colors"
        >
          Looks good, go live <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  )
}

function StatPill({ value, label }) {
  return (
    <div className="bg-[#FAF6EE] border border-[#E8DDCB] rounded-2xl p-3 text-center">
      <p className="font-display font-bold text-[#D94545] text-lg">{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
  )
}

function ProductRow({ product, idx, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="border-2 border-[#E8DDCB] rounded-2xl overflow-hidden bg-white">
      <div className="flex items-center gap-2 p-2">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {product.images?.[0] && (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={product.name ?? ''}
            onChange={e => onChange(idx, 'name', e.target.value)}
            className="w-full text-sm font-semibold text-[#1A1513] bg-transparent outline-none truncate"
          />
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-gray-400">$</span>
            <input
              type="number"
              step="0.01"
              value={product.price ?? 0}
              onChange={e => onChange(idx, 'price', parseFloat(e.target.value) || 0)}
              className="w-16 text-xs text-gray-600 bg-transparent outline-none"
            />
            <span className="text-xs text-gray-300">·</span>
            <input
              type="number"
              value={product.stock ?? 0}
              onChange={e => onChange(idx, 'stock', parseInt(e.target.value) || 0)}
              className="w-12 text-xs text-gray-600 bg-transparent outline-none"
            />
            <span className="text-xs text-gray-400">stock</span>
          </div>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
          <Edit2 size={12} />
        </button>
        <button onClick={() => onRemove(idx)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500">
          <Trash2 size={12} />
        </button>
      </div>
      {expanded && (
        <div className="border-t border-[#E8DDCB] p-2 space-y-1.5 bg-[#FAF6EE]">
          <input
            type="url"
            value={product.images?.[0] ?? ''}
            onChange={e => onChange(idx, 'images', [e.target.value, ...(product.images?.slice(1) ?? [])])}
            placeholder="Primary image URL"
            className="w-full px-2 py-1.5 text-xs border border-[#E8DDCB] rounded-lg bg-white outline-none"
          />
          <textarea
            value={product.description ?? ''}
            onChange={e => onChange(idx, 'description', e.target.value)}
            placeholder="Description"
            rows={2}
            className="w-full px-2 py-1.5 text-xs border border-[#E8DDCB] rounded-lg bg-white outline-none resize-none"
          />
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════ STEP 4: LIVE + ANALYTICS ═══════════════════════════════

function StepLive({ scraped, onDashboard }) {
  return (
    <div>
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4"
        >
          <span className="text-4xl">🎉</span>
        </motion.div>
        <h1 className="font-display text-3xl font-bold text-[#1A1513] mb-1">You're live!</h1>
        <p className="font-hand text-xl text-[#D94545]">
          {scraped?.name ?? 'Your brand'} is on kitakakis
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <StatPill value={scraped?.products?.length ?? 0} label="Products synced" />
        <StatPill value={scraped?.gallery?.length ?? 0} label="Images" />
        <StatPill value="✓" label="Dashboard ready" />
      </div>

      {/* Analytics explainer */}
      <div className="bg-[#FAF6EE] border border-[#E8DDCB] rounded-2xl p-5 mb-4">
        <p className="font-display text-lg font-bold text-[#1A1513] mb-1">📊 Your analytics, decoded</p>
        <p className="font-hand text-base text-[#D94545] mb-4">here's what we'll track for you</p>

        <div className="space-y-3">
          <MetricExplainer
            icon={Users} color="#D94545"
            label="Followers"
            meaning="People who hit save on your profile. Growing = your audience is growing."
            source="Pulled from your Instagram + Kitakakis saves daily"
          />
          <MetricExplainer
            icon={Eye} color="#1A1513"
            label="Impressions"
            meaning="How many times your posts + products appeared on someone's screen."
            source="Kitakakis feed + discover + shop views"
          />
          <MetricExplainer
            icon={Heart} color="#D94545"
            label="Engagement rate"
            meaning="% of people who see your post and interact (like, save, share, comment). 3%+ is solid, 5%+ is great."
            source="Calculated weekly from impressions + interactions"
          />
          <MetricExplainer
            icon={DollarSign} color="#1A1513"
            label="Revenue"
            meaning="Money from products sold through Kitakakis. Direct to your Stripe, we take 2%."
            source="Real-time, updates as orders come in"
          />
          <MetricExplainer
            icon={TrendingUp} color="#D94545"
            label="Top posts"
            meaning="Which posts pulled the most attention this month. Do more of what works."
            source="Ranked by impressions × engagement weekly"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDashboard}
        className="w-full bg-[#1A1513] hover:bg-[#000] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-warm-lg"
      >
        Take me to my dashboard <ArrowRight size={18} />
      </motion.button>
    </div>
  )
}

function MetricExplainer({ icon: Icon, color, label, meaning, source }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#E8DDCB]">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#1A1513]">{label}</p>
        <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{meaning}</p>
        <p className="text-[10px] text-gray-400 italic mt-1">{source}</p>
      </div>
    </div>
  )
}
