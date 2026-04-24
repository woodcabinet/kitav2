// Sign-in / sign-up gate shown at the end of onboarding when Supabase is
// configured but the user isn't authenticated — we can't save a brand
// without an account. If Supabase is off (local-only demo), the flow
// never reaches this; `persistBrand()` falls through to demo mode instead.
//
// Signup flow handles two cases:
//   1. Email confirmation disabled → immediate session → call onSuccess()
//   2. Email confirmation required → show "check your inbox" screen
// Signin: any error from supabase.auth.signInWithPassword surfaces in-modal.

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export function AuthGateModal({ onClose, onSuccess }) {
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
