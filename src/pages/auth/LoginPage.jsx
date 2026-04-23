import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isSignup = location.pathname.endsWith('/signup')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      if (isSignup) {
        const { data, error: err } = await signUp(email, password)
        if (err) { setError(err.message); return }
        // If email confirmation is on, Supabase returns a user but no session
        if (!data?.session) { setSent(true); return }
        navigate('/brand/onboarding')
      } else {
        const { error: err } = await signIn(email, password)
        if (err) { setError(err.message); return }
        navigate('/')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#C4B49A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#D94545] flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="font-bold text-2xl text-[#1A1513]">kitakakis</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Singapore's local brand platform</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isSignup ? 'Create your account' : 'Sign in'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
          )}

          {sent ? (
            <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
              Check your inbox — we sent a confirmation link to <strong>{email}</strong>.
              Once you confirm, sign in to continue.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30 focus:border-[#D94545]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D94545]/30 focus:border-[#D94545]"
                />
                {isSignup && (
                  <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D94545] hover:bg-[#a85225] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors"
              >
                {loading
                  ? (isSignup ? 'Creating account...' : 'Signing in...')
                  : (isSignup ? 'Create account' : 'Sign in')}
              </button>
            </form>
          )}

          <div className="mt-4 text-center">
            {isSignup ? (
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-[#D94545] font-semibold">Sign in</Link>
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-[#D94545] font-semibold">Sign up</Link>
              </p>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link to="/brand/onboarding" className="text-sm text-[#1A1513] font-semibold">
              Register your brand →
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to support local Singapore makers.
        </p>
      </div>
    </div>
  )
}
