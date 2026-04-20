/**
 * Vercel Edge Function — Server-side HTML fetch
 * GET /api/scrape?url=https://example.com
 *
 * The client-side brandScraper uses free CORS proxies that rate-limit
 * and break. This runs server-side, so no CORS + full response bodies.
 *
 * Returns: { html: "...", status: 200, finalUrl: "..." }
 *
 * Security note: we only accept http(s) URLs and cap the response at 2MB.
 * NEVER forward auth headers or cookies — this is a public read-only
 * fetcher for scraping public HTML.
 */
export const config = { runtime: 'edge' };

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const MAX_BYTES = 2 * 1024 * 1024; // 2MB

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');

  if (!target || !/^https?:\/\//i.test(target)) {
    return new Response(JSON.stringify({ error: 'Missing or invalid url param' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
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
      JSON.stringify({ html, status: res.status, finalUrl: res.url }),
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
