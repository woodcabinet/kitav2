// Zero-friction brand onboarding scraper — boiled ocean edition.
//
// Given a URL, extracts:
//   - Brand name (5-way fallback: og:site_name > og:title > twitter:title > <title> > h1)
//   - Tagline + description (og:description > twitter:description > meta desc > first <p>)
//   - Logo (apple-touch-icon > og:logo > link[rel=icon] > largest img with 'logo' class/alt)
//   - Banner (og:image > twitter:image > largest content image > first product image)
//   - Products (4-way: Shopify /products.json, WooCommerce, JSON-LD, OG product tags)
//   - Gallery (top 12 content images, deduplicated, absolutised)
//   - Platform (shopify, woocommerce, squarespace, wix, bigcommerce, custom)
//   - Instagram (profile pic, followers, display name)
//   - Suggested category + hashtags
//
// Every failure is logged to warnings[] so the user sees exactly what worked.

const PROXIES = [
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
  (u) => `https://thingproxy.freeboard.io/fetch/${u}`,
]

// Heuristic: an SPA shell returns very little meaningful HTML on a plain
// GET (React/Vue/Next stub). If the body is tiny OR contains a <noscript>
// "please enable JavaScript" cue, retry via Browserbase rendering.
function looksLikeSpaShell(html) {
  if (!html || html.length < 4000) return true
  const lower = html.toLowerCase()
  const hasNoscript = /<noscript>[^<]*(enable|javascript|required)/i.test(html)
  const textOnly = lower.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  return hasNoscript || textOnly.length < 400
}

async function proxyFetch(url, { timeout = 12000, allowRender = true } = {}) {
  // Prefer server-side fetch (no CORS, no rate-limits). Fall back to proxies
  // if the endpoint isn't reachable (local dev without `vercel dev`).
  const hitServer = async (mode) => {
    try {
      const controller = new AbortController()
      const tid = setTimeout(() => controller.abort(), timeout)
      const res = await fetch(`/api/scrape?url=${encodeURIComponent(url)}${mode ? `&mode=${mode}` : ''}`, { signal: controller.signal })
      clearTimeout(tid)
      if (res.ok) {
        const data = await res.json()
        if (data?.html && data.html.length > 200) return data.html
      }
    } catch { /* fall through */ }
    return null
  }

  // 1. Plain fetch
  const fetched = await hitServer()
  if (fetched && !looksLikeSpaShell(fetched)) return fetched

  // 2. Render with Browserbase if the site looks like an SPA shell
  if (allowRender && fetched && looksLikeSpaShell(fetched)) {
    const rendered = await hitServer('render')
    if (rendered) return rendered
    // if render failed (no Browserbase key configured), return the fetched
    // HTML anyway — downstream parsers will try their best.
    return fetched
  }
  if (fetched) return fetched

  let lastErr
  for (const build of PROXIES) {
    try {
      const controller = new AbortController()
      const tid = setTimeout(() => controller.abort(), timeout)
      const res = await fetch(build(url), { redirect: 'follow', signal: controller.signal })
      clearTimeout(tid)
      if (res.ok) {
        const txt = await res.text()
        if (txt && txt.length > 200) return txt
        lastErr = new Error('Empty response from proxy')
      } else {
        lastErr = new Error(`HTTP ${res.status} from proxy`)
      }
    } catch (e) { lastErr = e }
  }
  throw lastErr ?? new Error('All proxies failed')
}

async function proxyJSON(url) {
  try {
    const txt = await proxyFetch(url)
    return JSON.parse(txt)
  } catch { return null }
}

// ——————————————————————————————————————————————————————————
// HTML parsing — with DOMParser where available for accuracy
// ——————————————————————————————————————————————————————————

function parseDOM(html) {
  try { return new DOMParser().parseFromString(html, 'text/html') }
  catch { return null }
}

function metaFromDOM(doc, names) {
  if (!doc) return null
  for (const n of names) {
    const el = doc.querySelector(`meta[property="${n}"], meta[name="${n}"]`)
    if (el?.content) return el.content.trim()
  }
  return null
}

function metaFromRegex(html, name) {
  const patterns = [
    new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i'),
  ]
  for (const p of patterns) {
    const m = html.match(p)
    if (m?.[1]) return m[1].trim()
  }
  return null
}

function meta(html, doc, name) {
  return metaFromDOM(doc, [name]) ?? metaFromRegex(html, name)
}

function titleOf(html, doc) {
  if (doc) {
    const t = doc.querySelector('title')?.textContent?.trim()
    if (t) return t
  }
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? null
}

function h1Of(doc) {
  return doc?.querySelector('h1')?.textContent?.trim() ?? null
}

function firstParagraph(doc) {
  if (!doc) return null
  for (const p of doc.querySelectorAll('p')) {
    const t = p.textContent?.trim()
    if (t && t.length > 40 && t.length < 400) return t
  }
  return null
}

// ——————————————————————————————————————————————————————————
// URL helpers
// ——————————————————————————————————————————————————————————

function absolutise(url, base) {
  if (!url) return null
  url = url.trim()
  if (url.startsWith('data:')) return null
  if (url.startsWith('//')) return 'https:' + url
  if (url.startsWith('http')) return url
  try { return new URL(url, base).toString() } catch { return null }
}

function normalizeImageUrl(url) {
  if (!url) return null
  // Upgrade shopify low-res to high-res
  return url.replace(/_\d+x\d*\./, '_1200x.').replace(/_small\./, '_1200x.')
}

// ——————————————————————————————————————————————————————————
// Platform detection
// ——————————————————————————————————————————————————————————

function detectPlatform(html, baseUrl) {
  const h = html.toLowerCase()
  if (h.includes('cdn.shopify.com') || h.includes('shopify.theme') || h.includes('.myshopify.com') || baseUrl.includes('.myshopify.com')) return 'shopify'
  if (h.includes('woocommerce') || h.includes('wp-content/plugins/woocommerce') || h.includes('wc-block')) return 'woocommerce'
  if (h.includes('squarespace-cdn.com') || h.includes('static1.squarespace')) return 'squarespace'
  if (h.includes('wixstatic.com') || h.includes('wix.com/ready')) return 'wix'
  if (h.includes('bigcommerce.com') || h.includes('cdn11.bigcommerce.com')) return 'bigcommerce'
  if (h.includes('webflow.io') || h.includes('assets.website-files.com')) return 'webflow'
  return 'custom'
}

// ——————————————————————————————————————————————————————————
// Image extraction
// ——————————————————————————————————————————————————————————

function extractImages(doc, html, baseUrl, limit = 12) {
  const urls = new Set()
  const candidates = []

  if (doc) {
    doc.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src') ?? img.getAttribute('data-src') ?? img.getAttribute('data-lazy-src') ?? img.getAttribute('srcset')?.split(',').pop()?.trim().split(' ')[0]
      if (!src) return
      const abs = absolutise(src, baseUrl)
      if (!abs) return
      const w = parseInt(img.getAttribute('width') || '0', 10)
      const alt = img.getAttribute('alt') ?? ''
      candidates.push({ url: abs, width: w, alt })
    })
  }

  // Regex fallback
  const re = /<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi
  let m
  while ((m = re.exec(html))) {
    const abs = absolutise(m[1], baseUrl)
    if (abs) candidates.push({ url: abs, width: 0, alt: '' })
  }

  candidates.forEach(({ url }) => {
    if (/\.(svg|gif)(\?|$)/i.test(url)) return
    if (/logo|icon|favicon|sprite|placeholder|payment|badge|loader|pixel|tracking|avatar|emoji/i.test(url)) return
    if (urls.size < limit * 3) urls.add(normalizeImageUrl(url))
  })

  return [...urls].slice(0, limit)
}

function findLogo(doc, html, baseUrl) {
  // Priority: apple-touch-icon, shortcut icon, any icon
  if (doc) {
    const appleIcon = doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href')
    if (appleIcon) return absolutise(appleIcon, baseUrl)
    const iconSized = doc.querySelector('link[rel="icon"][sizes*="192"], link[rel="icon"][sizes*="512"]')?.getAttribute('href')
    if (iconSized) return absolutise(iconSized, baseUrl)
    // Logo image in header
    const logoImg = doc.querySelector('header img[alt*="logo" i], .logo img, #logo img, [class*="Logo"] img, [class*="brand"] img')
    if (logoImg) {
      const src = logoImg.getAttribute('src') ?? logoImg.getAttribute('data-src')
      if (src) return absolutise(src, baseUrl)
    }
    const anyIcon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]')?.getAttribute('href')
    if (anyIcon) return absolutise(anyIcon, baseUrl)
  }
  const m = html.match(/<link[^>]+rel=["'](?:apple-touch-icon|icon|shortcut icon)[^>]+href=["']([^"']+)["']/i)
  return m ? absolutise(m[1], baseUrl) : null
}

// ——————————————————————————————————————————————————————————
// Product extraction — 4 strategies
// ——————————————————————————————————————————————————————————

async function fetchShopifyProducts(baseUrl, limit = 24) {
  const origin = new URL(baseUrl).origin
  const data = await proxyJSON(`${origin}/products.json?limit=${limit}`)
  if (!data?.products) return []
  return data.products.map(p => ({
    id: String(p.id),
    name: p.title,
    description: p.body_html?.replace(/<[^>]+>/g, '').slice(0, 300) ?? '',
    price: parseFloat(p.variants?.[0]?.price ?? '0'),
    compare_price: p.variants?.[0]?.compare_at_price ? parseFloat(p.variants[0].compare_at_price) : null,
    stock: p.variants?.reduce((s, v) => s + (v.inventory_quantity ?? 0), 0) ?? 0,
    images: (p.images ?? []).map(img => normalizeImageUrl(img.src)).slice(0, 4),
    vendor: p.vendor,
    tags: typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()) : (p.tags ?? []),
    handle: p.handle,
    url: `${origin}/products/${p.handle}`,
  }))
}

async function fetchWooCommerceProducts(baseUrl, limit = 24) {
  const origin = new URL(baseUrl).origin
  // WooCommerce Store API (newer) — public, no auth
  const data = await proxyJSON(`${origin}/wp-json/wc/store/v1/products?per_page=${limit}`)
  if (!Array.isArray(data)) return []
  return data.map(p => ({
    id: String(p.id),
    name: p.name,
    description: p.short_description?.replace(/<[^>]+>/g, '').slice(0, 300) ?? '',
    price: parseFloat(p.prices?.price ?? '0') / (p.prices?.currency_minor_unit ? 100 : 1),
    compare_price: p.prices?.regular_price ? parseFloat(p.prices.regular_price) / 100 : null,
    stock: p.is_in_stock ? (p.stock_quantity ?? 99) : 0,
    images: (p.images ?? []).map(img => img.src).slice(0, 4),
    tags: (p.tags ?? []).map(t => t.name),
    handle: p.slug,
    url: p.permalink,
  }))
}

function extractJsonLdProducts(doc, html, baseUrl) {
  const scripts = doc
    ? [...doc.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent)
    : [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1])

  const products = []
  for (const raw of scripts) {
    if (!raw) continue
    try {
      const data = JSON.parse(raw)
      const nodes = Array.isArray(data) ? data : (data['@graph'] ?? [data])
      for (const node of nodes) {
        const type = node['@type']
        if (type === 'Product' || (Array.isArray(type) && type.includes('Product'))) {
          const img = Array.isArray(node.image) ? node.image : [node.image].filter(Boolean)
          const offers = Array.isArray(node.offers) ? node.offers[0] : node.offers
          products.push({
            id: node.sku ?? node.productID ?? String(products.length + Math.random()),
            name: node.name,
            description: (node.description ?? '').slice(0, 300),
            price: parseFloat(offers?.price ?? offers?.lowPrice ?? '0'),
            compare_price: null,
            stock: offers?.availability?.includes('InStock') ? 10 : 0,
            images: img.map(i => typeof i === 'string' ? i : i.url).filter(Boolean).map(u => absolutise(u, baseUrl)),
            tags: [],
            url: node.url ?? absolutise(node['@id'], baseUrl),
          })
        }
      }
    } catch { /* bad json ignore */ }
  }
  return products
}

async function extractProducts(platform, baseUrl, doc, html, warnings) {
  // Strategy 1: Shopify
  if (platform === 'shopify') {
    const p = await fetchShopifyProducts(baseUrl)
    if (p.length) return { products: p, strategy: 'shopify-products.json' }
    warnings.push('Shopify detected but /products.json returned empty — may be private store.')
  }

  // Strategy 2: WooCommerce
  if (platform === 'woocommerce') {
    const p = await fetchWooCommerceProducts(baseUrl)
    if (p.length) return { products: p, strategy: 'woocommerce-store-api' }
    warnings.push('WooCommerce detected but Store API returned empty — endpoint may be disabled.')
  }

  // Strategy 3: JSON-LD (works everywhere)
  const ld = extractJsonLdProducts(doc, html, baseUrl)
  if (ld.length) return { products: ld, strategy: 'json-ld' }

  // Strategy 4: Try Shopify as last resort (many custom sites are secretly Shopify)
  try {
    const p = await fetchShopifyProducts(baseUrl)
    if (p.length) return { products: p, strategy: 'shopify-fallback' }
  } catch {}

  warnings.push('No structured product data found. Brand will need to add products manually.')
  return { products: [], strategy: 'none' }
}

// ——————————————————————————————————————————————————————————
// Instagram scraping
// ——————————————————————————————————————————————————————————

async function scrapeInstagram(handle, warnings) {
  const clean = handle.replace(/^@/, '').replace(/.*instagram\.com\//, '').replace(/\/.*$/, '').trim()
  if (!clean) return null
  try {
    const html = await proxyFetch(`https://www.instagram.com/${clean}/`)
    const doc = parseDOM(html)
    const ogImage = meta(html, doc, 'og:image')
    const ogDesc = meta(html, doc, 'og:description') ?? ''
    const ogTitle = meta(html, doc, 'og:title') ?? ''
    // NOTE: we intentionally do NOT extract follower counts. Instagram's
    // og:description count is often stale or wrong, and surfacing a wrong
    // number is worse than no number. Brands will connect their IG via
    // OAuth (Meta Graph API) to get verified counts — see /dashboard.
    return {
      handle: clean,
      url: `https://instagram.com/${clean}`,
      profile_pic: ogImage,
      display_name: ogTitle.split('(')[0]?.trim(),
      followers: null,           // verified-only; unset until OAuth connect
      bio_preview: ogDesc.split(' - ').pop()?.trim(),
      verified: false,           // unverified public-page scrape
    }
  } catch (e) {
    warnings.push(`Instagram scrape failed: ${e.message}`)
    return { handle: clean, url: `https://instagram.com/${clean}`, followers: null, verified: false }
  }
}

// ——————————————————————————————————————————————————————————
// Main entry
// ——————————————————————————————————————————————————————————

export async function scrapeBrand({ website, instagram } = {}) {
  const result = {
    source: { website, instagram },
    scanned_at: new Date().toISOString(),
    warnings: [],
    products: [],
    gallery: [],
  }

  // ── 1. Website — richest source ───────────────────────────
  if (website) {
    let url = website.trim()
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`
    try {
      const html = await proxyFetch(url)
      const doc = parseDOM(html)
      const baseUrl = new URL(url).origin
      const platform = detectPlatform(html, url)
      result.platform = platform
      result.url = url

      // Brand name: 5-way fallback
      result.name =
        meta(html, doc, 'og:site_name') ??
        meta(html, doc, 'og:title')?.split(/[|·—-]/)[0].trim() ??
        meta(html, doc, 'twitter:title')?.split(/[|·—-]/)[0].trim() ??
        titleOf(html, doc)?.split(/[|·—-]/)[0].trim() ??
        h1Of(doc)

      // Tagline/description
      result.tagline =
        meta(html, doc, 'og:description') ??
        meta(html, doc, 'twitter:description') ??
        meta(html, doc, 'description') ??
        firstParagraph(doc)
      result.description = result.tagline

      // Logo: 3-way fallback
      result.logo_url =
        findLogo(doc, html, baseUrl) ??
        absolutise(meta(html, doc, 'og:image'), baseUrl)

      // Banner: og > twitter > first content image
      result.banner_url =
        absolutise(meta(html, doc, 'og:image:secure_url'), baseUrl) ??
        absolutise(meta(html, doc, 'og:image'), baseUrl) ??
        absolutise(meta(html, doc, 'twitter:image'), baseUrl)

      // Gallery
      result.gallery = extractImages(doc, html, baseUrl, 12)
      if (!result.banner_url && result.gallery[0]) result.banner_url = result.gallery[0]
      if (!result.logo_url) result.logo_url = result.gallery[0]

      // Products — 4 strategies
      const { products, strategy } = await extractProducts(platform, baseUrl, doc, html, result.warnings)
      result.products = products
      result.product_strategy = strategy

      // Upgrade banner to first product image if it's more meaningful
      if (products[0]?.images?.[0] && !result.banner_url) {
        result.banner_url = products[0].images[0]
      }
    } catch (e) {
      result.warnings.push(`Website fetch failed: ${e.message}. Try a different URL or check the site is public.`)
    }
  }

  // ── 2. Instagram — fill gaps ──────────────────────────────
  if (instagram) {
    const ig = await scrapeInstagram(instagram, result.warnings)
    if (ig) {
      result.instagram = ig
      if (!result.logo_url && ig.profile_pic) result.logo_url = ig.profile_pic
      if (!result.banner_url && ig.profile_pic) result.banner_url = ig.profile_pic
      if (!result.name && ig.display_name) result.name = ig.display_name
      if (!result.tagline && ig.bio_preview) result.tagline = ig.bio_preview
    }
  }

  // ── 3. Clean + suggest ────────────────────────────────────
  if (!result.name) {
    result.name = 'Untitled Brand'
    result.warnings.push('Could not detect brand name — please edit.')
  }
  if (!result.logo_url) result.warnings.push('No logo found — please upload one.')
  if (!result.banner_url) result.warnings.push('No banner found — please upload one.')

  result.suggested_category = suggestCategory(
    `${result.name ?? ''} ${result.description ?? ''} ${(result.products ?? []).map(p => p.name).join(' ')}`
  )
  result.suggested_tags = suggestTags(result)

  return result
}

function suggestCategory(text) {
  const t = text.toLowerCase()
  if (/coffee|cafe|roast|espresso|latte/.test(t)) return 'food_beverage'
  if (/cake|bakery|dessert|pastry|ice cream|soft serve|chocolate|bread/.test(t)) return 'food_beverage'
  if (/wine|spirit|cocktail|brewery|beer|gin/.test(t)) return 'food_beverage'
  if (/tee|shirt|hoodie|streetwear|vintage|thrift|denim|fashion|apparel|clothing|jeans|jacket/.test(t)) return 'fashion'
  if (/jewellery|jewelry|charm|bracelet|necklace|ring|earring/.test(t)) return 'arts_crafts'
  if (/leather|notebook|stationery|ceramic|craft|candle|incense/.test(t)) return 'lifestyle'
  if (/home|interior|decor|furniture|lamp/.test(t)) return 'home_decor'
  if (/skin|serum|beauty|fragrance|makeup|lipstick|perfume/.test(t)) return 'beauty'
  if (/yoga|pilates|fitness|gym|wellness|meditation/.test(t)) return 'wellness'
  return 'lifestyle'
}

function suggestTags({ name, platform, products = [] }) {
  const tags = new Set(['#sglocal', '#singaporebrands'])
  if (name) tags.add('#' + name.toLowerCase().replace(/[^a-z0-9]/g, ''))
  if (platform === 'shopify') tags.add('#supportlocal')
  products.slice(0, 4).forEach(p => {
    const w = p.name?.split(/\s+/)?.[0]?.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (w && w.length > 3) tags.add('#' + w)
  })
  return [...tags].slice(0, 6)
}
