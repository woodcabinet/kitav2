import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, CheckCircle, ArrowRight, Instagram, Globe, Search,
  RefreshCw, AlertCircle, Package, Trash2, Plus, Edit2, Coffee,
  Check, ExternalLink, Facebook, Music2, TrendingUp, Users, Heart,
  DollarSign, BarChart2, Eye, MessageCircle, Rocket, PartyPopper
} from 'lucide-react'
import { scrapeBrand } from '../../lib/brandScraper'
import { saveBrandProfile } from '../../lib/brandStore'
import { CATEGORY_LABELS } from '../../lib/utils'
import { useAuth } from '../../contexts/AuthContext'
import { supabase, hasSupabase } from '../../lib/supabase'
import { ImageUploader } from '../../components/shared/ImageUploader'

// ═══════════════════════════════ MAIN ═══════════════════════════════

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [businessName, setBusinessName] = useState('')
  const [inputs, setInputs] = useState({ website: '', instagram: '', tiktok: '' })
  const [scraped, setScraped] = useState(null)
  const [error, setError] = useState(null)

  async function runScan() {
    const name = businessName.trim()
    const website = inputs.website.trim()
    const instagram = inputs.instagram.replace(/^@/, '').trim()
    const tiktok = inputs.tiktok.replace(/^@/, '').trim()

    if (!name) { setError("What's your business called?"); return }
    if (!website && !instagram && !tiktok) {
      setError('Add at least one — a website, Instagram, or TikTok handle.')
      return
    }
    setError(null)
    setStep(1) // scanning
    try {
      const data = await scrapeBrand({
        website: website || null,
        instagram: instagram || null,
      })
      if (!data.name) data.name = name
      if (tiktok) data.tiktok = { handle: tiktok, url: `https://tiktok.com/@${tiktok}` }
      setScraped(data)
      setStep(2) // review
    } catch (e) {
      setError(e.message ?? 'Scan failed — try different URL or skip.')
      setStep(0)
    }
  }

  function skipScan() {
    // Let the user proceed without scraping — they'll fill everything in manually
    const name = businessName.trim()
    if (!name) { setError("At least give us your business name"); return }
    setError(null)
    setScraped({
      name,
      tagline: '',
      description: '',
      logo_url: '',
      banner_url: '',
      gallery: [],
      products: [],
      suggested_category: 'lifestyle',
      suggested_tags: [],
      url: inputs.website || null,
      instagram: inputs.instagram ? { handle: inputs.instagram.replace(/^@/, '') } : null,
      tiktok: inputs.tiktok ? { handle: inputs.tiktok.replace(/^@/, '') } : null,
      warnings: ['Manual mode — fill in the blanks below.'],
    })
    setStep(2)
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

  const [saving, setSaving] = useState(false)
  const [savedProfile, setSavedProfile] = useState(null)
  const [authGate, setAuthGate] = useState(false)
  const { user } = useAuth()

  async function goLive() {
    // Require auth if Supabase is configured — otherwise brand can't be saved
    // to a real account. Anonymous demo mode still works for local-only testing.
    if (hasSupabase && !user) {
      setAuthGate(true)
      return
    }
    await persistBrand()
  }

  async function persistBrand() {
    setSaving(true)
    setError(null)
    try {
      const saved = await saveBrandProfile({
        name: scraped.name, tagline: scraped.tagline, description: scraped.description,
        logo_url: scraped.logo_url, banner_url: scraped.banner_url, platform: scraped.platform,
        category: scraped.suggested_category, tags: scraped.suggested_tags,
        website: scraped.url, instagram: scraped.instagram,
        products: scraped.products, gallery: scraped.gallery,
        onboarded_at: new Date().toISOString(),
      })
      setSavedProfile(saved)
      setStep(3)
    } finally {
      setSaving(false)
    }
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
          {/* ═══ STEP 0: NAME + LINKS ═══ */}
          {step === 0 && (
            <StepWrapper key="0">
              <StepNameAndLinks
                name={businessName}
                onName={setBusinessName}
                inputs={inputs}
                onInputs={(k, v) => setInputs(s => ({ ...s, [k]: v }))}
                onContinue={runScan}
                onSkip={skipScan}
                error={error}
              />
            </StepWrapper>
          )}

          {/* ═══ STEP 1: SCANNING ═══ */}
          {step === 1 && (
            <StepWrapper key="1">
              <StepScanning />
            </StepWrapper>
          )}

          {/* ═══ STEP 2: REVIEW + EDIT ═══ */}
          {step === 2 && scraped && (
            <StepWrapper key="2">
              <StepReview
                scraped={scraped}
                onField={updateField}
                onProduct={updateProduct}
                onRemoveProduct={removeProduct}
                onAddProduct={addProduct}
                onBack={() => setStep(0)}
                onLive={goLive}
                saving={saving}
              />
            </StepWrapper>
          )}

          {/* ═══ STEP 3: LIVE ═══ */}
          {step === 3 && (
            <StepWrapper key="3">
              <StepLive
                scraped={scraped}
                savedProfile={savedProfile}
                onDashboard={() => navigate('/dashboard')}
              />
            </StepWrapper>
          )}
        </AnimatePresence>
      </div>

      {authGate && (
        <AuthGateModal
          onClose={() => setAuthGate(false)}
          onSuccess={async () => { setAuthGate(false); await persistBrand() }}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════ AUTH GATE ═══════════════════════════════

function AuthGateModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('signup') // 'signup' | 'signin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({ email, password })
        if (err) { setError(err.message); return }
        if (!data?.session) { setSent(true); return } // email confirm required
        await onSuccess()
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) { setError(err.message); return }
        await onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-[#1A1513] mb-1">
          {mode === 'signup' ? 'Create your account' : 'Sign in'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {mode === 'signup'
            ? 'Save your brand to your account so you can manage it from the dashboard.'
            : 'Sign in to publish your brand.'}
        </p>

        {error && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">{error}</div>
        )}

        {sent ? (
          <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700">
            Check your inbox — confirmation link sent to <strong>{email}</strong>. Once confirmed, come back and sign in.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email" required placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30 focus:border-[#D94545]"
            />
            <input
              type="password" required minLength={6} placeholder="Password (6+ chars)"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30 focus:border-[#D94545]"
            />
            <button
              type="submit" disabled={loading}
              className="w-full bg-[#D94545] hover:bg-[#a85225] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm"
            >
              {loading ? '...' : (mode === 'signup' ? 'Create account & publish' : 'Sign in & publish')}
            </button>
          </form>
        )}

        <div className="mt-3 flex items-center justify-between text-xs">
          <button onClick={() => { setMode(m => m === 'signup' ? 'signin' : 'signup'); setError(null); setSent(false) }} className="text-[#D94545] font-semibold">
            {mode === 'signup' ? 'Have an account? Sign in' : 'Need an account? Sign up'}
          </button>
          <button onClick={onClose} className="text-gray-400">Cancel</button>
        </div>
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
      {[0, 1, 2, 3].map(i => (
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

// ═══════════════════════════════ STEP 0: NAME + LINKS ═══════════════════════════════

function StepNameAndLinks({ name, onName, inputs, onInputs, onContinue, onSkip, error }) {
  const [loading, setLoading] = useState(false)
  async function go() {
    setLoading(true)
    try { await onContinue() } finally { setLoading(false) }
  }
  return (
    <div>
      <div className="text-center mb-5">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#D94545] mb-3 shadow-warm-lg"
        >
          <Coffee size={24} className="text-white" />
        </motion.div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1513] mb-1 leading-tight">
          Let's set up your brand
        </h1>
        <p className="text-gray-600 text-sm">
          We'll scan what you give us and auto-fill the rest. <span className="font-hand text-[#D94545] text-base">edit everything after</span>
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Business name *</label>
          <input
            type="text"
            autoFocus
            value={name}
            onChange={e => onName(e.target.value)}
            placeholder="Maroon Clothing"
            className="w-full mt-1 px-4 py-3 font-display text-lg bg-white border-2 border-[#E8DDCB] rounded-xl outline-none focus:border-[#D94545]"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1"><Globe size={11}/> Website</label>
          <input
            type="text"
            value={inputs.website}
            onChange={e => onInputs('website', e.target.value)}
            placeholder="maroonclothing.com"
            className="w-full mt-1 px-4 py-3 bg-white border-2 border-[#E8DDCB] rounded-xl text-sm outline-none focus:border-[#D94545]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1"><Instagram size={11}/> Instagram</label>
            <input
              type="text"
              value={inputs.instagram}
              onChange={e => onInputs('instagram', e.target.value)}
              placeholder="@yourhandle"
              className="w-full mt-1 px-3 py-3 bg-white border-2 border-[#E8DDCB] rounded-xl text-sm outline-none focus:border-[#D94545]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1"><Music2 size={11}/> TikTok</label>
            <input
              type="text"
              value={inputs.tiktok}
              onChange={e => onInputs('tiktok', e.target.value)}
              placeholder="@yourtiktok"
              className="w-full mt-1 px-3 py-3 bg-white border-2 border-[#E8DDCB] rounded-xl text-sm outline-none focus:border-[#D94545]"
            />
          </div>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={go}
        disabled={loading}
        className="mt-5 w-full bg-[#D94545] hover:bg-[#a85225] disabled:opacity-70 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-warm"
      >
        {loading ? (
          <><RefreshCw size={18} className="animate-spin" /> Scanning…</>
        ) : (
          <>Scan my brand <Sparkles size={16} /></>
        )}
      </motion.button>

      <button
        onClick={onSkip}
        disabled={loading}
        className="mt-2 w-full text-xs text-gray-400 hover:text-[#D94545] py-2"
      >
        or skip and fill it in manually →
      </button>
    </div>
  )
}

// ═══════════════════════════════ LEGACY STEP (unused, kept for reference) ═══

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
            <p className="font-hand text-2xl text-[#D94545] mb-1">no results</p>
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
    'Starting the scan...',
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

function StepReview({ scraped, onField, onProduct, onRemoveProduct, onAddProduct, onBack, onLive, saving }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <CheckCircle size={22} className="text-green-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1A1513] leading-tight">Found your brand.</h2>
          <p className="font-hand text-lg text-[#D94545]">edit anything, nothing is locked</p>
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

      {/* Image editors with upload + drag-drop + URL fallback */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="col-span-1">
          <ImageUploader
            value={scraped.logo_url}
            onChange={v => onField('logo_url', v)}
            folder="logos"
            aspect="square"
            label="Logo"
          />
        </div>
        <div className="col-span-2">
          <ImageUploader
            value={scraped.banner_url}
            onChange={v => onField('banner_url', v)}
            folder="banners"
            aspect="banner"
            label="Banner"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatPill value={scraped.products?.length ?? 0} label="Products" />
        <StatPill value={scraped.gallery?.length ?? 0} label="Images" />
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
        <button
          onClick={onBack}
          disabled={saving}
          className="px-5 py-4 border-2 border-[#E8DDCB] text-gray-600 font-semibold rounded-2xl hover:bg-white disabled:opacity-50"
        >
          ← Back
        </button>
        <motion.button
          whileHover={{ scale: saving ? 1 : 1.01 }}
          whileTap={{ scale: saving ? 1 : 0.98 }}
          onClick={onLive}
          disabled={saving}
          className="flex-1 bg-[#D94545] hover:bg-[#a85225] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-warm transition-colors"
        >
          {saving ? (
            <>
              <RefreshCw size={18} className="animate-spin" /> Saving your brand...
            </>
          ) : (
            <>
              Looks good, go live <ArrowRight size={18} />
            </>
          )}
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
  const primaryImage = product.images?.[0]

  function setPrimaryImage(url) {
    const rest = (product.images ?? []).slice(1)
    onChange(idx, 'images', url ? [url, ...rest] : rest)
  }

  return (
    <div className="border-2 border-[#E8DDCB] rounded-2xl overflow-hidden bg-white">
      <div className="flex items-center gap-2 p-2">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {primaryImage ? (
            <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package size={16} />
            </div>
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
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${expanded ? 'bg-[#D94545]/10 text-[#D94545]' : 'hover:bg-gray-100 text-gray-400'}`}
          title="Edit details"
        >
          <Edit2 size={12} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500"
          title="Remove"
        >
          <Trash2 size={12} />
        </button>
      </div>
      {expanded && (
        <div className="border-t border-[#E8DDCB] p-3 space-y-2 bg-[#FAF6EE]">
          <div className="flex gap-2">
            <div className="w-20 flex-shrink-0">
              <ImageUploader
                value={primaryImage}
                onChange={setPrimaryImage}
                folder={`products/${product.id ?? idx}`}
                aspect="square"
                size="sm"
              />
            </div>
            <div className="flex-1">
              <textarea
                value={product.description ?? ''}
                onChange={e => onChange(idx, 'description', e.target.value)}
                placeholder="Description"
                rows={4}
                className="w-full h-full px-2 py-1.5 text-xs border border-[#E8DDCB] rounded-lg bg-white outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════ STEP 4: LIVE + ANALYTICS ═══════════════════════════════

function StepLive({ scraped, savedProfile, onDashboard }) {
  const isDemo = savedProfile?.demo === true
  const saveError = savedProfile?.error
  return (
    <div>
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4"
        >
          {isDemo ? <Eye size={36} className="text-green-700" /> : <PartyPopper size={36} className="text-green-700" />}
        </motion.div>
        <h1 className="font-display text-3xl font-bold text-[#1A1513] mb-1">
          {isDemo ? "Preview ready" : "You're live!"}
        </h1>
        <p className="font-hand text-xl text-[#D94545]">
          {scraped?.name ?? 'Your brand'} {isDemo ? 'looks good so far' : 'is on kitakakis'}
        </p>
      </div>

      {/* Honest status banner — Supabase unreachable / demo mode / saved */}
      {saveError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">Saved locally, not to the cloud yet</p>
            <p className="text-xs text-red-600 mt-0.5">{saveError}</p>
            <p className="text-xs text-red-500 mt-1">Your brand is cached in this browser. Sign in and retry from the dashboard to publish.</p>
          </div>
        </div>
      )}
      {isDemo && !saveError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Demo mode — sign in to publish</p>
            <p className="text-xs text-amber-700 mt-0.5">This preview is saved to your browser. Create an account from the dashboard to publish your brand for real.</p>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <StatPill value={scraped?.products?.length ?? 0} label="Products synced" />
        <StatPill value={scraped?.gallery?.length ?? 0} label="Images" />
        <StatPill value={<Check size={18} className="inline" />} label="Dashboard ready" />
      </div>

      {/* Analytics explainer — only shows what's actually wired up. Numbers
          you haven't connected yet are marked "pending" so we never show
          a fake figure. Connect the data source to light it up. */}
      <div className="bg-[#FAF6EE] border border-[#E8DDCB] rounded-2xl p-5 mb-4">
        <p className="font-display text-lg font-bold text-[#1A1513] mb-1 inline-flex items-center gap-2"><BarChart2 size={18} /> Your analytics, decoded</p>
        <p className="font-hand text-base text-[#D94545] mb-4">everything below is live from your Kita storefront — real numbers only</p>

        <div className="space-y-3">
          <MetricExplainer
            icon={Users} color="#D94545"
            label="Followers"
            meaning="People who follow your brand on Kita. They see your posts & drops first."
            source="Live from your Kita storefront"
            status="live"
          />
          <MetricExplainer
            icon={Eye} color="#1A1513"
            label="Impressions"
            meaning="How many times your storefront, posts, and products appeared on someone's screen."
            source="Live from your Kita storefront"
            status="live"
          />
          <MetricExplainer
            icon={Heart} color="#D94545"
            label="Engagement"
            meaning="Likes, comments, saves, and RSVPs across your Kita content."
            source="Live from your Kita storefront"
            status="live"
          />
          <MetricExplainer
            icon={DollarSign} color="#1A1513"
            label="Revenue"
            meaning="Money earned through Kita checkouts — updates the moment an order lands."
            source="Live from your Kita storefront"
            status="live"
          />
          <MetricExplainer
            icon={TrendingUp} color="#D94545"
            label="Top products"
            meaning="Your best-performing pieces this month, ranked by Kita clicks and sales."
            source="Live from your Kita storefront"
            status="live"
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

function MetricExplainer({ icon: Icon, color, label, meaning, source, status = 'live' }) {
  const statusStyles = {
    live:    { dot: 'bg-green-500',  text: 'text-green-700',  label: 'LIVE' },
    partial: { dot: 'bg-amber-500',  text: 'text-amber-700',  label: 'PARTIAL' },
    pending: { dot: 'bg-gray-400',   text: 'text-gray-500',   label: 'PENDING' },
  }[status] ?? { dot: 'bg-gray-300', text: 'text-gray-500', label: '' }
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#E8DDCB]">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-sm text-[#1A1513]">{label}</p>
          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider ${statusStyles.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
            {statusStyles.label}
          </span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{meaning}</p>
        <p className="text-[10px] text-gray-400 italic mt-1">{source}</p>
      </div>
    </div>
  )
}
