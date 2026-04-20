// Conversational brand discovery — AI-style search.
//
// User types their business name. We fan out searches across:
//   - General web (to find their website)
//   - Instagram
//   - TikTok
//   - Facebook
//
// Each search returns candidate results the user can select. They pick the
// ones that are actually theirs, and we pass those to the scraper.
//
// Uses DuckDuckGo HTML (no API key needed) via CORS proxy.

const PROXIES = [
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
]

async function proxyFetch(url, { timeout = 10000 } = {}) {
  for (const build of PROXIES) {
    try {
      const controller = new AbortController()
      const tid = setTimeout(() => controller.abort(), timeout)
      const res = await fetch(build(url), { redirect: 'follow', signal: controller.signal })
      clearTimeout(tid)
      if (res.ok) {
        const txt = await res.text()
        if (txt && txt.length > 100) return txt
      }
    } catch { /* try next */ }
  }
  return null
}

// DuckDuckGo HTML Lite — parses clean, no API key
async function ddgSearch(query, limit = 6) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  const html = await proxyFetch(url)
  if (!html) return []

  const linkRe = /<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi
  const snippetRe = /<a[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi

  const links = []
  let m
  while ((m = linkRe.exec(html)) && links.length < limit) {
    let href = m[1]
    const uddgMatch = href.match(/[?&]uddg=([^&]+)/)
    if (uddgMatch) href = decodeURIComponent(uddgMatch[1])
    const title = m[2].replace(/<[^>]+>/g, '').trim()
    if (title && href.startsWith('http')) links.push({ url: href, title })
  }

  const snippets = []
  while ((m = snippetRe.exec(html)) && snippets.length < limit) {
    snippets.push(m[1].replace(/<[^>]+>/g, '').trim())
  }

  return links.map((l, i) => ({ ...l, snippet: snippets[i] ?? '', domain: safeDomain(l.url) }))
}

function safeDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

function faviconFor(domain) {
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null
}

// ——————————————————————————————————————————————————————————
// Main — runs 4 searches in parallel
// ——————————————————————————————————————————————————————————

export async function discoverBrand(businessName) {
  if (!businessName || businessName.trim().length < 2) return null
  const name = businessName.trim()

  // Prefer the server-side endpoint — no CORS, no free-proxy rate limits.
  try {
    const res = await fetch(`/api/discover?q=${encodeURIComponent(name)}`, {
      signal: AbortSignal.timeout?.(15000),
    })
    if (res.ok) {
      const data = await res.json()
      if (data && !data.error) return data
    }
  } catch { /* fall through to proxy path */ }

  const [web, instagram, tiktok, facebook] = await Promise.all([
    ddgSearch(`${name} official site`, 5).catch(() => []),
    ddgSearch(`${name} site:instagram.com`, 4).catch(() => []),
    ddgSearch(`${name} site:tiktok.com`, 4).catch(() => []),
    ddgSearch(`${name} site:facebook.com`, 3).catch(() => []),
  ])

  const SOCIAL_DOMAINS = /instagram|tiktok|facebook|twitter|linkedin|wikipedia|pinterest|youtube|yelp/

  return {
    query: name,
    scanned_at: new Date().toISOString(),
    websites: dedupe(web.filter(r => !SOCIAL_DOMAINS.test(r.domain))).map(r => ({
      ...r, icon: faviconFor(r.domain), kind: 'website',
    })),
    instagram: instagram.filter(r => /instagram\.com\/[a-zA-Z0-9_.]+\/?$/.test(r.url)).map(r => ({
      ...r, icon: faviconFor('instagram.com'),
      handle: r.url.match(/instagram\.com\/([a-zA-Z0-9_.]+)/)?.[1],
      kind: 'instagram',
    })),
    tiktok: tiktok.filter(r => /tiktok\.com\/@/.test(r.url)).map(r => ({
      ...r, icon: faviconFor('tiktok.com'),
      handle: r.url.match(/tiktok\.com\/@([a-zA-Z0-9_.]+)/)?.[1],
      kind: 'tiktok',
    })),
    facebook: facebook.filter(r => /facebook\.com/.test(r.url)).map(r => ({
      ...r, icon: faviconFor('facebook.com'), kind: 'facebook',
    })),
  }
}

function dedupe(arr) {
  const seen = new Set()
  return arr.filter(r => {
    if (seen.has(r.domain)) return false
    seen.add(r.domain)
    return true
  })
}
