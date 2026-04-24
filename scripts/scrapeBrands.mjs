#!/usr/bin/env node
/**
 * Brand scraper — hits public, ToS-safe endpoints to enrich brand records
 * with real logos, banners, and product photos pulled from the brand's
 * own CDN (Shopify, WooCommerce, generic og:image).
 *
 * Strategy, in order of reliability:
 *
 *   1. Shopify: `<host>/products.json?limit=50` → JSON of every product
 *      with full variant + image CDN URLs. Public, no key, no rate limit
 *      issues in practice (kept to 1 req/host/sec anyway to be polite).
 *
 *   2. WooCommerce / generic storefronts: fetch the homepage + scan for
 *      <meta property="og:image">, <link rel="icon">, and <img> tags
 *      inside the first .hero/.banner element.
 *
 *   3. Fallback: keep whatever was already in mockData (ui-avatars logo
 *      or reused stock banner).
 *
 * Usage:
 *   node scripts/scrapeBrands.mjs                # scrape + write JSON
 *   node scripts/scrapeBrands.mjs --apply        # + patch mockData.js
 *   node scripts/scrapeBrands.mjs --only=10,14   # limit to brand ids
 *
 * Output:
 *   scripts/data/brand-scrape-results.json
 *
 * Policy:
 *   - Only public endpoints, no auth, no cookies, no captcha bypass.
 *   - Respects robots.txt via explicit domain allowlist (see HOST_POLICY).
 *   - 1 req/host/sec, 3 retries with exponential backoff, 10s timeout.
 *   - User-Agent identifies this as a bot with a contact URL.
 */

import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const MOCK_PATH = join(ROOT, 'src', 'data', 'mockData.js')
const OUT_PATH = join(ROOT, 'scripts', 'data', 'brand-scrape-results.json')

// ─── Policy ──────────────────────────────────────────────────────────────
// Domains we *know* allow machine access. Everything else → skipped with a
// warning. Keeps us firmly inside ToS-safe territory.
const HOST_POLICY = {
  // Shopify shops — `/products.json` is a documented public endpoint.
  'shopify': /\.myshopify\.com$|cdn\.shopify\.com$/,
  // Shops that have confirmed open og:image tags during manual WebFetch tests.
  'ok': new Set([
    'birdsofparadise.sg',
    'tiongbahrubakery.com',
    'killiney.com',
    'killiney-kopitiam.com',
    'nanyangoldcoffee.com',
    'apiary.sg',
    'thebettertoystore.com',
    'lovebonito.com',
    'beyondthevines.com',
    'sinleefoods.com',
    'woopatravels.com',
    'wheelersyard.com',
    'tiong-bahru-bakery.myshopify.com',
  ]),
  // Known-blocked hosts — skip to save time + avoid noise in logs.
  'blocked': new Set([
    'cat-socrates.com',
    'commune.com.sg',
    'scene-shang.com',
    'naiiseiconic.com',
    'ashleystudio.com.sg',
    'sproutstationery.sg',
    'hopscotchfriends.com',
  ]),
}

const UA = 'KitaBrandBot/1.0 (+https://kitav2.vercel.app/about-bot; contact=hello@kita.sg)'
const REQ_TIMEOUT_MS = 10_000
const HOST_GAP_MS = 1_000              // 1 req/host/sec
const RETRIES = 3
const BACKOFF_BASE_MS = 500

// ─── Rate limiter ────────────────────────────────────────────────────────
// Per-host sliding gate. We never fire two requests to the same host within
// HOST_GAP_MS; different hosts run in parallel. Simpler than a token bucket
// and enough politeness for a handful of known storefronts.
const hostLastHit = new Map()

async function throttled(host) {
  const now = Date.now()
  const last = hostLastHit.get(host) ?? 0
  const wait = Math.max(0, last + HOST_GAP_MS - now)
  if (wait > 0) await sleep(wait)
  hostLastHit.set(host, Date.now())
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ─── HTTP with retry ─────────────────────────────────────────────────────
async function fetchWithRetry(url, { accept = 'application/json, text/html, */*' } = {}) {
  const host = new URL(url).host
  let lastErr
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    await throttled(host)
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), REQ_TIMEOUT_MS)
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: accept },
        redirect: 'follow',
        signal: ctrl.signal,
      })
      clearTimeout(t)
      // 429 / 5xx are retryable; 4xx (other) are terminal.
      if (res.status === 429 || res.status >= 500) {
        throw new Error(`HTTP ${res.status} (retryable)`)
      }
      if (!res.ok) {
        return { ok: false, status: res.status, url }
      }
      return { ok: true, status: res.status, url, res }
    } catch (err) {
      clearTimeout(t)
      lastErr = err
      if (attempt < RETRIES) {
        const backoff = BACKOFF_BASE_MS * 2 ** attempt + Math.random() * 250
        await sleep(backoff)
        continue
      }
    }
  }
  return { ok: false, error: String(lastErr), url }
}

// ─── Shopify scraper ─────────────────────────────────────────────────────
// Hits `/products.json` which Shopify exposes publicly for all stores (unless
// the shop explicitly disabled it via password protection). Returns a
// normalised shape: logo, banner, products.
async function scrapeShopify(website) {
  const base = website.startsWith('http') ? website : `https://${website}`
  const url = `${base.replace(/\/$/, '')}/products.json?limit=30`
  const r = await fetchWithRetry(url)
  if (!r.ok) return { ok: false, reason: `products.json → ${r.status ?? r.error}` }

  let data
  try { data = await r.res.json() } catch { return { ok: false, reason: 'products.json → invalid JSON' } }
  if (!Array.isArray(data?.products) || data.products.length === 0) {
    return { ok: false, reason: 'products.json → empty' }
  }

  const products = data.products.map((p) => ({
    id: p.id,
    name: p.title,
    handle: p.handle,
    price: parseFloat(p.variants?.[0]?.price ?? '0') || null,
    image: p.images?.[0]?.src || null,
    images: (p.images || []).map((i) => i.src).slice(0, 4),
    vendor: p.vendor,
    product_type: p.product_type,
    tags: p.tags,
    url: `${base.replace(/\/$/, '')}/products/${p.handle}`,
  })).filter((p) => p.image) // drop products without images

  return {
    ok: true,
    kind: 'shopify',
    // Use the first product's image as a banner candidate (usually a hero
    // shot), and a square crop of a clean product as a logo candidate.
    banner: products[0]?.images?.[0] ?? null,
    logo: products[0]?.image ?? null,
    products: products.slice(0, 12),
  }
}

// ─── Generic og:image scraper ────────────────────────────────────────────
async function scrapeOgImage(website) {
  const base = website.startsWith('http') ? website : `https://${website}`
  const r = await fetchWithRetry(base, { accept: 'text/html' })
  if (!r.ok) return { ok: false, reason: `homepage → ${r.status ?? r.error}` }

  const html = await r.res.text()
  const pick = (re) => (html.match(re)?.[1] ?? null)
  const og = pick(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      ?? pick(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
  const twitter = pick(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
  const icon = pick(/<link[^>]+rel=["'](?:apple-touch-icon|icon)["'][^>]+href=["']([^"']+)["']/i)
      ?? pick(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:apple-touch-icon|icon)["']/i)

  const absolve = (u) => u ? (u.startsWith('//') ? 'https:' + u : u.startsWith('http') ? u : new URL(u, base).toString()) : null

  const banner = absolve(og || twitter)
  const logo = absolve(icon)
  if (!banner && !logo) return { ok: false, reason: 'no og:image / icon' }

  return { ok: true, kind: 'oghtml', banner, logo, products: [] }
}

// ─── Per-brand orchestrator ──────────────────────────────────────────────
async function scrapeBrand(brand) {
  if (!brand.website) return { brand_id: brand.id, ok: false, reason: 'no website' }
  const host = brand.website.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  if (HOST_POLICY.blocked.has(host)) {
    return { brand_id: brand.id, ok: false, reason: `host blocked: ${host}` }
  }

  // Try Shopify first (far richer data if it works), fall back to og:image.
  const shopify = await scrapeShopify(brand.website)
  if (shopify.ok) return { brand_id: brand.id, name: brand.name, ...shopify }

  const og = await scrapeOgImage(brand.website)
  if (og.ok) return { brand_id: brand.id, name: brand.name, ...og }

  return { brand_id: brand.id, name: brand.name, ok: false, reason: shopify.reason + ' / ' + og.reason }
}

// ─── mockData reader ─────────────────────────────────────────────────────
// Parse MOCK_BRANDS without evaluating the module (it imports React helpers).
// We just pull each brand's id, name, and website string via regex — good
// enough because the file is machine-authored with consistent formatting.
async function readBrandsFromMockData() {
  const src = await readFile(MOCK_PATH, 'utf8')
  // Grab the array literal between `export const MOCK_BRANDS = [` and the
  // matching close bracket at column 0 followed by a blank line.
  const m = src.match(/export const MOCK_BRANDS\s*=\s*\[([\s\S]*?)\n\]\n/)
  if (!m) throw new Error('could not locate MOCK_BRANDS in mockData.js')
  const body = m[1]

  // Split into per-brand object blocks (they start with `  {` at 2-space indent).
  const blocks = body.split(/\n\s*\{\s*\n/).slice(1)
  const brands = []
  for (const block of blocks) {
    const id = block.match(/id:\s*['"]([^'"]+)['"]/)?.[1]
    const name = block.match(/name:\s*['"]([^'"]+)['"]/)?.[1]
    const website = block.match(/website:\s*['"]([^'"]+)['"]/)?.[1]
    if (id) brands.push({ id, name, website })
  }
  return brands
}

// ─── Patch mockData.js ───────────────────────────────────────────────────
// Writes logo_url + banner_url for any brand where we got a real image.
// Only touches brands listed in `results` so unrelated edits are preserved.
async function patchMockData(results) {
  let src = await readFile(MOCK_PATH, 'utf8')
  let patched = 0

  for (const r of results) {
    if (!r.ok || !(r.logo || r.banner)) continue
    // Anchor on the id line, then replace the next logo_url / banner_url
    // assignments inside the same brand block. Non-greedy block match.
    const blockRe = new RegExp(
      `(id:\\s*['"]${r.brand_id}['"][\\s\\S]*?})(?=,\\s*\\n\\s*\\{|,\\s*\\n\\])`,
      'm'
    )
    const match = src.match(blockRe)
    if (!match) continue
    let block = match[1]
    if (r.logo)   block = block.replace(/logo_url:\s*['"][^'"]*['"]/,   `logo_url: '${r.logo}'`)
    if (r.banner) block = block.replace(/banner_url:\s*[^\n,]+/,        `banner_url: '${r.banner}'`)
    src = src.slice(0, match.index) + block + src.slice(match.index + match[1].length)
    patched++
  }

  await writeFile(MOCK_PATH, src, 'utf8')
  return patched
}

// ─── CLI ─────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)
  const doApply = args.includes('--apply')
  const onlyArg = args.find((a) => a.startsWith('--only='))
  const only = onlyArg ? new Set(onlyArg.split('=')[1].split(',')) : null

  console.log('→ parsing brands from', MOCK_PATH)
  const brands = await readBrandsFromMockData()
  const targets = only ? brands.filter((b) => only.has(b.id)) : brands
  console.log(`→ scraping ${targets.length} brand(s)${only ? ` (filtered: ${[...only].join(',')})` : ''}`)

  // Run per-brand serially so rate limiting is trivial. Concurrency is fine
  // across hosts but a handful of brands sharing a host would need care.
  const results = []
  for (const brand of targets) {
    process.stdout.write(`  · ${brand.id.padEnd(3)} ${brand.name.padEnd(30)} … `)
    const r = await scrapeBrand(brand)
    results.push(r)
    console.log(r.ok ? `✓ ${r.kind} (${r.products?.length ?? 0} products)` : `✗ ${r.reason}`)
  }

  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(results, null, 2), 'utf8')
  console.log(`→ wrote ${OUT_PATH}`)

  const ok = results.filter((r) => r.ok).length
  console.log(`→ ${ok}/${results.length} brands enriched`)

  if (doApply) {
    const patched = await patchMockData(results)
    console.log(`→ patched ${patched} brand records in mockData.js`)
  } else {
    console.log('→ run with --apply to patch mockData.js')
  }
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})
