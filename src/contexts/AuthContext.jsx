import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Race guard: if the user signs in/out fast (e.g. logout immediately
    // followed by a switch-account sign-in), an in-flight fetchProfile()
    // for the OLD user could resolve AFTER the new auth state arrives and
    // overwrite the new profile. We tag each fetch with a token and drop
    // stale results.
    let activeToken = 0
    const makeToken = () => ++activeToken
    const isStale = (t) => t !== activeToken

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id, makeToken(), isStale)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id, makeToken(), isStale)
      } else {
        makeToken() // bump to invalidate any in-flight fetch
        setProfile(null); setBrand(null); setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId, token, isStale) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (isStale?.(token)) return
    setProfile(prof)

    if (prof?.account_type === 'brand') {
      const { data: br } = await supabase
        .from('brands')
        .select('*')
        .eq('owner_id', userId)
        .single()
      if (isStale?.(token)) return
      setBrand(br)
    } else {
      setBrand(null)
    }

    setLoading(false)
  }

  async function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signUp(email, password, options = {}) {
    return supabase.auth.signUp({ email, password, options })
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null); setProfile(null); setBrand(null)
  }

  async function refreshProfile() {
    // Manual refresh from callers (e.g. after brand onboarding). Uses a
    // one-off token that's always considered current — this path only
    // runs when the user explicitly asks for a re-fetch.
    if (user) await fetchProfile(user.id, 0, () => false)
  }

  return (
    <AuthContext.Provider value={{ user, profile, brand, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
