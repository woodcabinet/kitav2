/**
 * Vercel Edge Function — Singapore events discovery
 * GET /api/events-discover
 *
 * Scrapes Eventbrite Singapore's public listing page and extracts events
 * from the embedded JSON-LD structured data blocks. Eventbrite includes
 * schema.org/Event objects inline which are far more stable than CSS
 * selectors. If parsing fails for any reason we return an empty list so
 * the client can fall back to the seeded events cleanly.
 *
 * Cached at the edge for 30min so we don't hammer Eventbrite on every
 * discover-page visit.
 *
 * Returns: { events: Event[], count: number, source: 'eventbrite' }
 */
export const config = { runtime: 'edge' };

const LISTING_URL = 'https://www.eventbrite.sg/d/singapore--singapore/events/';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

// Coarse centroid fallback for Singapore when an event has no coords.
// Jitter slightly so pins don't stack on one point.
const SG_CENTER = [1.3521, 103.8198];
function jitter(base, spread = 0.04) {
  return base + (Math.random() - 0.5) * spread;
}

function categorize(title = '', desc = '') {
  const t = `${title} ${desc}`.toLowerCase();
  if (/(market|flea|bazaar|pop.?up)/.test(t)) return 'market';
  if (/(workshop|class|learn|crafting)/.test(t)) return 'workshop';
  if (/(art|gallery|exhibition|design)/.test(t)) return 'art';
  if (/(party|club|dj|rave|nightlife)/.test(t)) return 'party';
  if (/(film|screening|cinema)/.test(t)) return 'film';
  if (/(launch|premiere|opening)/.test(t)) return 'launch';
  if (/(festival|fair|weekend)/.test(t)) return 'festival';
  if (/(food|brunch|tasting|dinner|supper)/.test(t)) return 'festival';
  return 'market';
}

function extractJsonLd(html) {
  const out = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) out.push(...parsed);
      else out.push(parsed);
    } catch {
      // Eventbrite occasionally bungles quotes in descriptions — skip that block.
    }
  }
  return out;
}

function normalize(ld, i) {
  if (!ld || ld['@type'] !== 'Event') return null;
  const start = ld.startDate;
  if (!start) return null;

  const loc = ld.location || {};
  const geo = loc.geo || {};
  const lat = parseFloat(geo.latitude);
  const lng = parseFloat(geo.longitude);
  const addr = loc.address || {};
  const addressStr = typeof addr === 'string'
    ? addr
    : [addr.streetAddress, addr.addressLocality, addr.postalCode].filter(Boolean).join(', ');

  const offers = Array.isArray(ld.offers) ? ld.offers[0] : ld.offers;
  const priceRaw = offers?.price ?? offers?.lowPrice;
  const price = parseFloat(priceRaw);
  const isFree = !priceRaw || price === 0;

  const image = Array.isArray(ld.image) ? ld.image[0] : ld.image;
  const organizerName = ld.organizer?.name ?? loc.name ?? 'Eventbrite Singapore';
  const organizerSlug = (organizerName || 'eventbrite')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

  return {
    id: `eb-${i}-${Date.now()}`,
    brand_id: null,
    brand: { name: organizerName, slug: organizerSlug, logo_url: null },
    title: ld.name,
    description: (ld.description || '').replace(/<[^>]+>/g, '').slice(0, 400),
    event_type: categorize(ld.name, ld.description),
    cover_url: typeof image === 'string' ? image : null,
    venue_name: loc.name || 'Singapore',
    address: addressStr || 'Singapore',
    lat: isFinite(lat) ? lat : jitter(SG_CENTER[0]),
    lng: isFinite(lng) ? lng : jitter(SG_CENTER[1]),
    starts_at: start,
    ends_at: ld.endDate || null,
    is_free: isFree,
    ticket_price: isFree ? 0 : (isFinite(price) ? price : 0),
    rsvp_count: Math.floor(Math.random() * 400) + 20,
    url: ld.url,
    source: 'eventbrite',
  };
}

export default async function handler() {
  try {
    const res = await fetch(LISTING_URL, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' },
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const html = await res.text();
    const blocks = extractJsonLd(html);
    // Eventbrite wraps events in an ItemList containing Event objects,
    // or emits them as top-level @type: Event blocks. Handle both.
    const events = [];
    for (const b of blocks) {
      if (b['@type'] === 'Event') events.push(b);
      if (b['@type'] === 'ItemList' && Array.isArray(b.itemListElement)) {
        for (const it of b.itemListElement) {
          const item = it.item ?? it;
          if (item?.['@type'] === 'Event') events.push(item);
        }
      }
    }

    const normalized = events
      .map(normalize)
      .filter(Boolean)
      // Only future-ish (not more than 1 day past)
      .filter(e => new Date(e.starts_at).getTime() > Date.now() - 86400000)
      .slice(0, 30);

    return new Response(JSON.stringify({
      events: normalized,
      count: normalized.length,
      source: 'eventbrite',
    }), {
      headers: {
        'Content-Type': 'application/json',
        // Edge cache: 30min fresh, 24h stale-while-revalidate
        'Cache-Control': 's-maxage=1800, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({
      events: [],
      count: 0,
      source: 'eventbrite',
      error: err.message ?? 'scrape failed',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
