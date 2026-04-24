// Brand onboarding flow — shell/coordinator. Holds flow state (which step,
// form inputs, scraped result, save status) and delegates rendering to the
// four step components. Individual screens live next to each other in
// src/components/brand/onboarding/ so they can evolve independently.
//
// Flow: name+links → scanning → review → live
// The user can also skip the scrape and fill everything in manually —
// they still enter at the review step.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { scrapeBrand } from '../../lib/brandScraper'
import { saveBrandProfile } from '../../lib/brandStore'
import { useAuth } from '../../contexts/AuthContext'
import { hasSupabase } from '../../lib/supabase'
import {
  StepWrapper, ProgressDots, SteamDecor,
} from '../../components/brand/onboarding/StepChrome'
import { StepNameAndLinks } from '../../components/brand/onboarding/StepNameAndLinks'
import { StepScanning }     from '../../components/brand/onboarding/StepScanning'
import { StepReview }       from '../../components/brand/onboarding/StepReview'
import { StepLive }         from '../../components/brand/onboarding/StepLive'
import { AuthGateModal }    from '../../components/brand/onboarding/AuthGateModal'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Flow state
  const [step, setStep] = useState(0)
  const [businessName, setBusinessName] = useState('')
  const [inputs, setInputs] = useState({ website: '', instagram: '', tiktok: '' })
  const [scraped, setScraped] = useState(null)
  const [error, setError] = useState(null)

  // Save state
  const [saving, setSaving] = useState(false)
  const [savedProfile, setSavedProfile] = useState(null)
  const [authGate, setAuthGate] = useState(false)

  // ── Flow actions ─────────────────────────────────────────────────────────

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
      const data = await scrapeBrand({ website: website || null, instagram: instagram || null })
      if (!data.name) data.name = name
      if (tiktok) data.tiktok = { handle: tiktok, url: `https://tiktok.com/@${tiktok}` }
      setScraped(data)
      setStep(2) // review
    } catch (e) {
      setError(e.message ?? 'Scan failed — try a different URL or skip.')
      setStep(0)
    }
  }

  function skipScan() {
    // Let the user proceed without scraping — they'll fill everything in at review.
    const name = businessName.trim()
    if (!name) { setError('At least give us your business name'); return }
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
      tiktok:    inputs.tiktok    ? { handle: inputs.tiktok.replace(/^@/, '') }    : null,
      warnings: ['Manual mode — fill in the blanks below.'],
    })
    setStep(2)
  }

  // ── Scraped-data editors ────────────────────────────────────────────────

  const updateField = (field, value) =>
    setScraped(s => ({ ...s, [field]: value }))

  const updateProduct = (idx, field, value) =>
    setScraped(s => ({ ...s, products: s.products.map((p, i) => i === idx ? { ...p, [field]: value } : p) }))

  const removeProduct = (idx) =>
    setScraped(s => ({ ...s, products: s.products.filter((_, i) => i !== idx) }))

  const addProduct = () =>
    setScraped(s => ({
      ...s,
      products: [...(s.products ?? []), { id: `new-${Date.now()}`, name: 'New product', price: 0, images: [], stock: 10 }],
    }))

  // ── Publish ─────────────────────────────────────────────────────────────

  async function goLive() {
    // Require auth if Supabase is configured — otherwise we can't save to a
    // real account. Local-only demo mode (no Supabase env vars) falls through.
    if (hasSupabase && !user) { setAuthGate(true); return }
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

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen paper-texture flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <SteamDecor />

      <div className="w-full max-w-3xl relative z-10">
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

        <ProgressDots current={step} />

        <AnimatePresence mode="wait">
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
          {step === 1 && (
            <StepWrapper key="1"><StepScanning /></StepWrapper>
          )}
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
