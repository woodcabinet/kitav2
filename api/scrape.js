/**
 * Vercel Edge Function — Server-side HTML fetch
 * GET /api/scrape?url=https://example.com[&mode=render]
 *
 * Two modes:
 *   • fetch  (default) — plain HTTP GET, works on ~70% of sites. Fast, free.
 *   • render           — Browserbase headless Chromium, handles JS-heavy
 *                        sites (Squarespace, Wix, SPA storefronts),
 *                        CAPTCHAs, and anti-bot detection. Requires
 *                        BROWSERBASE_API_KEY + BROWSERBASE_PROJECT_ID env.
 *
 * The client picks `mode=render` only when the fetch path returns empty
 * or a <noscript>-heavy shell — see brandScraper.js. This keeps cost down
 * by reserving Browserbase for sites that actually need it.
 *
 * Returns: { html, status, finalUrl, mode }
 *
 * Security note: we only accept http(s) URLs and cap the response at 2MB.
 * NEVER forward auth headers or cookies — this is a public read-only
 * fetcher for scraping public HTML.
 */
export const config = { runtime: 'edge' };

// ─── Browserbase (opt-in via env) ────────────────────────────
// Signup: https://www.browserbase.com — paste API key + project ID into
// Vercel env. Until then, mode=render transparently falls back to fetch.

async function browserbaseRender(targetUrl) {
  const apiKey = process.env.BROWSERBASE_API_KEY;
  const projectId = process.env.BROWSERBASE_PROJECT_ID;
  if (!apiKey || !projectId) return null;

  // Create a session + navigate via Browserbase REST API. We don't need
  // the full Playwright client from edge runtime — the REST endpoints
  // cover "go to URL, return rendered HTML" in two calls.
  try {
    // 1. create session
    const sessRes = await fetch('https://api.browserbase.com/v1/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BB-API-Key': apiKey,
      },
      body: JSON.stringify({ projectId, keepAlive: false }),
    });
    if (!sessRes.ok) return null;
    const { id: sessionId, connectUrl } = await sessRes.json();

    // 2. use the session's CDP endpoint to fetch rendered HTML
    //    (Edge runtime can't run playwright-core, so we hit the debug
    //     endpoint directly and extract document.documentElement.outerHTML)
    const cdpRes = await fetch(`https://api.browserbase.com/v1/sessions/${sessionId}/debug`, {
      headers: { 'X-BB-API-Key': apiKey },
    });
    if (!cdpRes.ok) return null;

    // Simplest path: navigate via page.goto through the REST "navigate" action
    const navRes = await fetch(`https://api.browserbase.com/v1/sessions/${sessionId}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-BB-API-Key': apiKey },
      body: JSON.stringify({
        actions: [
          { type: 'goto', url: targetUrl, waitUntil: 'networkidle' },
          { type: 'evaluate', script: 'document.documentElement.outerHTML' },
        ],
      }),
    });
    if (!navRes.ok) return null;
    const result = await navRes.json();
    const html = result?.results?.[1]?.value;
    return typeof html === 'string' && html.length > 200 ? html : null;
  } catch {
    return null;
  }
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const MAX_BYTES = 2 * 1024 * 1024; // 2MB

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');
  const mode = searchParams.get('mode') === 'render' ? 'render' : 'fetch';

  if (!target || !/^https?:\/\//i.test(target)) {
    return new Response(JSON.stringify({ error: 'Missing or invalid url param' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Browserbase render path (opt-in, falls through to fetch if unconfigured)
  if (mode === 'render') {
    const rendered = await browserbaseRender(target);
    if (rendered) {
      return new Response(
        JSON.stringify({ html: rendered, status: 200, finalUrl: target, mode: 'render' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, s-maxage=600',
          },
        }
      );
    }
    // fall through to fetch
  }

  try {
    const res = await fetch(target, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    // Stream + cap at 2MB so we don't blow the edge memory
    const reader = res.body.getReader();
    const chunks = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > MAX_BYTES) break;
      chunks.push(value);
    }
    const buf = new Uint8Array(total > MAX_BYTES ? MAX_BYTES : total);
    let offset = 0;
    for (const c of chunks) {
      if (offset + c.length > buf.length) {
        buf.set(c.subarray(0, buf.length - offset), offset);
        break;
      }
      buf.set(c, offset);
      offset += c.length;
    }
    const html = new TextDecoder('utf-8').decode(buf);

    return new Response(
      JSON.stringify({ html, status: res.status, finalUrl: res.url, mode: 'fetch' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=600', // 10 min cache per URL
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
