/**
 * Vercel Edge Function — Brand discovery search
 * GET /api/discover?q=Heritage+Bay
 *
 * Searches the web for a business name and returns candidate websites,
 * Instagram, TikTok, and Facebook handles. Runs server-side so we don't
 * hit CORS + free-proxy rate limits that break the client-side version.
 *
 * Uses DuckDuckGo HTML (no API key) — if you want higher quality, swap
 * in Bing Web Search API or Google Custom Search via env keys later.
 */
export const config = { runtime: 'edge' };

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function safeDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function faviconFor(domain) {
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;
}

async function ddgSearch(query, limit = 6) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
      redirect: 'follow',
    });
    if (!res.ok) return [];
    const html = await res.text();

    const linkRe = /<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    const snippetRe = /<a[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;

    const links = [];
    let m;
    while ((m = linkRe.exec(html)) && links.length < limit) {
      let href = m[1];
      const uddgMatch = href.match(/[?&]uddg=([^&]+)/);
      if (uddgMatch) href = decodeURIComponent(uddgMatch[1]);
      const title = m[2].replace(/<[^>]+>/g, '').trim();
      if (title && href.startsWith('http')) links.push({ url: href, title });
    }

    const snippets = [];
    while ((m = snippetRe.exec(html)) && snippets.length < limit) {
      snippets.push(m[1].replace(/<[^>]+>/g, '').trim());
    }

    return links.map((l, i) => ({ ...l, snippet: snippets[i] ?? '', domain: safeDomain(l.url) }));
  } catch {
    return [];
  }
}

function dedupe(arr) {
  const seen = new Set();
  return arr.filter(r => {
    if (seen.has(r.domain)) return false;
    seen.add(r.domain);
    return true;
  });
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();

  if (q.length < 2) {
    return new Response(JSON.stringify({ error: 'Query too short' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const SOCIAL = /instagram|tiktok|facebook|twitter|linkedin|wikipedia|pinterest|youtube|yelp/;

  const [web, instagram, tiktok, facebook] = await Promise.all([
    ddgSearch(`${q} official site`, 5),
    ddgSearch(`${q} site:instagram.com`, 4),
    ddgSearch(`${q} site:tiktok.com`, 4),
    ddgSearch(`${q} site:facebook.com`, 3),
  ]);

  const payload = {
    query: q,
    scanned_at: new Date().toISOString(),
    websites: dedupe(web.filter(r => !SOCIAL.test(r.domain))).map(r => ({
      ...r, icon: faviconFor(r.domain), kind: 'website',
    })),
    instagram: instagram
      .filter(r => /instagram\.com\/[a-zA-Z0-9_.]+\/?$/.test(r.url))
      .map(r => ({
        ...r,
        icon: faviconFor('instagram.com'),
        handle: r.url.match(/instagram\.com\/([a-zA-Z0-9_.]+)/)?.[1],
        kind: 'instagram',
      })),
    tiktok: tiktok
      .filter(r => /tiktok\.com\/@/.test(r.url))
      .map(r => ({
        ...r,
        icon: faviconFor('tiktok.com'),
        handle: r.url.match(/tiktok\.com\/@([a-zA-Z0-9_.]+)/)?.[1],
        kind: 'tiktok',
      })),
    facebook: facebook
      .filter(r => /facebook\.com/.test(r.url))
      .map(r => ({ ...r, icon: faviconFor('facebook.com'), kind: 'facebook' })),
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=300', // 5 min cache per query
    },
  });
}
