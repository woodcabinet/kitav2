// Step 0 — collect a business name + at least one source link (website,
// IG, or TikTok) that the scraper can use. `onContinue` kicks the scrape
// off; `onSkip` lets the user move forward with just a name and fill
// everything in manually at the review step.

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, AlertCircle, Globe, Instagram, Music2, Coffee } from 'lucide-react'

export function StepNameAndLinks({ name, onName, inputs, onInputs, onContinue, onSkip, error }) {
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
