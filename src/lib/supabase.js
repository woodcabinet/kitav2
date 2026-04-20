import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey)

if (!hasSupabase) {
  console.warn('Supabase env vars missing — running in demo mode with mock data only')
}

// Use a harmless placeholder URL when env is missing so createClient doesn't throw
// at module load and crash the entire app.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
export default supabase
