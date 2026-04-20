// Brand profile persistence.
//
// Two-tier strategy:
//   • Signed-in user   → Supabase: brands + brand_social_accounts + products
//                        Row-level security guarantees the user can only
//                        write rows where they are owner_id.
//   • Anonymous demo   → localStorage: so the no-auth onboarding flow still
//                        produces a working preview. Marked `demo: true`
//                        so the UI can show "Sign in to publish for real".
//
// Every Supabase write is mirrored to localStorage as a read-through cache,
// so the Dashboard/StorePage/ContentPage can render instantly without a
// network round-trip and without branching on auth state everywhere.

import { useEffect, useState } from 'react'
import { supabase, hasSupabase } from './supabase'
import { slugify } from './utils'

const KEY = 'my_brand'

// ─────────────────────────────── LOCAL CACHE ───────────────────────────────

function readLocal() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function writeLocal(data) {
  if (!data) return null
  const merged = { ...readLocal(), ...data, updated_at: new Date().toISOString() }
  localStorage.setItem(KEY, JSON.stringify(merged))
  window.dispatchEvent(new CustomEvent('brand:updated', { detail: merged }))
  return merged
}

function clearLocal() {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new CustomEvent('brand:updated', { detail: null }))
}

// ─────────────────────────────── SUPABASE WRITE ───────────────────────────────

// Transform the onboarding payload → the exact columns the brands table
// expects. Stripping `null` / `undefined` avoids Supabase overwriting
// defaults with nulls on upsert.
function toBrandRow({ ownerId, data }) {
  const row = {
    owner_id:       ownerId,
    slug:           data.slug ?? slugify(data.name || 'untitled'),
    name:           data.name,
    tagline:        data.tagline ?? null,
    description:    data.description ?? null,
    logo_url:       data.logo_url ?? null,
    banner_url:     data.banner_url ?? null,
    category:       data.category ?? 'other',
    website_url:    data.website ?? null,
    location:       data.location ?? null,
    lat:            data.lat ?? null,
    lng:            data.lng ?? null,
    platform:       data.platform ?? null,
    gallery_urls:   data.gallery ?? [],
    tags:           data.tags ?? [],
    auto_scraped:   true,
    scrape_sources: data.scrape_sources ?? null,
    onboarded_at:   data.onboarded_at ?? new Date().toISOString(),
    last_scraped_at: new Date().toISOString(),
  }
  // Strip nulls so upsert doesn't blow away defaults
  Object.keys(row).forEach(k => row[k] === null && delete row[k])
  return row
}

// Insert or update the brand, then replace its product catalogue in one shot.
// Upsert-by-slug so repeated onboarding runs for the same brand (e.g.
// re-scrape) update the existing row instead of duplicating.
async function saveToSupabase(ownerId, data) {
  const row = toBrandRow({ ownerId, data })

  const { data: brand, error: brandErr } = await supabase
    .from('brands')
    .upsert(row, { onConflict: 'slug' })
    .select('id, slug, name')
    .single()

  if (brandErr) throw new Error(`brand save failed: ${brandErr.message}`)

  // Social handles → brand_social_accounts (upsert by brand_id + platform)
  const socialRows = []
  if (data.instagram) {
    const handle = typeof data.instagram === 'string' ? data.instagram : data.instagram?.handle
    if (handle) socialRows.push({
      brand_id: brand.id, platform: 'instagram',
      handle: String(handle).replace(/^@/, '').trim(),
    })
  }
  if (data.tiktok) {
    const handle = typeof data.tiktok === 'string' ? data.tiktok : data.tiktok?.handle
    if (handle) socialRows.push({
      brand_id: brand.id, platform: 'tiktok',
      handle: String(handle).replace(/^@/, '').trim(),
    })
  }
  if (socialRows.length) {
    const { error: socErr } = await supabase
      .from('brand_social_accounts')
      .upsert(socialRows, { onConflict: 'brand_id,platform' })
    if (socErr) console.warn('social accounts save failed:', socErr.message)
  }

  // Products — replace the catalogue wholesale for now. Safer than diffing
  // on the first onboarding pass; we'll switch to merge-by-handle once the
  // dashboard's product editor lands.
  if (Array.isArray(data.products) && data.products.length) {
    // Wipe existing (idempotent re-onboarding)
    await supabase.from('products').delete().eq('brand_id', brand.id)

    const productRows = data.products.map(p => ({
      brand_id:     brand.id,
      name:         p.name ?? 'Untitled product',
      description:  p.description ?? null,
      price:        Number.isFinite(+p.price) ? +p.price : 0,
      compare_price: p.compare_price ?? null,
      images:       Array.isArray(p.images) ? p.images : [],
      category:     p.category ?? data.category ?? null,
      tags:         Array.isArray(p.tags) ? p.tags : [],
      stock:        Number.isFinite(+p.stock) ? +p.stock : 0,
      active:       true,
    }))
    const { error: prodErr } = await supabase.from('products').insert(productRows)
    if (prodErr) console.warn('products save failed:', prodErr.message)
  }

  return { ...data, id: brand.id, slug: brand.slug, demo: false }
}

// ─────────────────────────────── PUBLIC API ───────────────────────────────

/**
 * Save the onboarded brand.
 *   - Returns the merged profile (same as before) for immediate UI use.
 *   - If signed in + Supabase configured: writes to DB, then mirrors to
 *     localStorage.
 *   - Otherwise: localStorage only, flagged `demo: true`.
 *   - Never throws to the caller — errors are returned via `.error`
 *     on the profile so the onboarding page can surface them inline
 *     without destroying the UX.
 */
export async function saveBrandProfile(data) {
  if (!data) return null

  // Try Supabase first (if configured + user is authenticated)
  if (hasSupabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const saved = await saveToSupabase(user.id, data)
        return writeLocal(saved)
      }
    } catch (e) {
      // Fall through to local mode but tag the error so the UI can explain
      return writeLocal({ ...data, demo: true, error: e.message })
    }
  }

  // Anon or no Supabase: demo mode
  return writeLocal({ ...data, demo: true })
}

export function getBrandProfile() {
  return readLocal()
}

export async function refreshBrandProfile() {
  // Pull the authoritative record from Supabase if possible
  if (!hasSupabase) return readLocal()
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return readLocal()
    const { data: brand } = await supabase
      .from('brands')
      .select('*, products(*), brand_social_accounts(*)')
      .eq('owner_id', user.id)
      .maybeSingle()
    if (brand) return writeLocal({ ...brand, demo: false })
  } catch { /* keep cache */ }
  return readLocal()
}

export function clearBrandProfile() {
  clearLocal()
}

// React hook — live updates when save/clear fires
export function useBrandProfile() {
  const [profile, setProfile] = useState(readLocal)
  useEffect(() => {
    const handler = (e) => setProfile(e.detail)
    const storageHandler = () => setProfile(readLocal())
    window.addEventListener('brand:updated', handler)
    window.addEventListener('storage', storageHandler)
    return () => {
      window.removeEventListener('brand:updated', handler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [])
  return [profile, saveBrandProfile, clearBrandProfile]
}
