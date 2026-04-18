# Kitakakis Demo Setup

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Add your Supabase credentials:
   - Get `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Supabase project settings
3. (Optional) Add Mapbox token for interactive map:
   - Get `VITE_MAPBOX_TOKEN` from https://mapbox.com/account/tokens

## What's Working

### Consumer App (Home Feed)
- Browse brands, products, events, drops
- Interactive Mapbox event map (color-coded: red = live, dark = upcoming)
- Search by brand name, event title, or keyword
- Filter by category (fashion, food, beauty, lifestyle, etc.)

### Brand Onboarding
- Scrapes website meta tags (og:title, og:description, og:image)
- Auto-detects Shopify and imports full product catalog
- Accepts Instagram URLs/handles and TikTok URLs
- Suggests category and hashtags
- Zero-friction profile setup

### Consumer Profile
- Saved brands (♡ button on brand tiles)
- RSVP'd events (RSVP button on event cards)
- Wishlist items
- Uses localStorage for MVP (can wire to Supabase later)

### Local Data
- 9 real Singapore brands with real product images
- 6 sample events with proper geo-location
- 10+ posts and 4 drops
- All brand data scraped from actual Shopify stores

## Architecture

### Layouts
- **ConsumerLayout**: SideNav (desktop) + centered content + BottomNav (mobile)
- **DashboardLayout**: Brand admin interface (stub)

### Key Pages
- `/` - Home feed (trending posts, recommended brands)
- `/discover` - Explore grid with tabs (explore/events/drops/map)
- `/profile` - Consumer profile (saved, RSVP'd, wishlist)
- `/brand/:slug` - Brand detail page
- `/brand/onboarding` - Brand signup with auto-scraper
- `/dashboard` - Brand admin (analytics, content, store)

### Styling
Colors:
- **Dark**: #1A1513 (text, upcoming events)
- **Accent**: #D94545 (buttons, live events, hearts)
- **Tan**: #C4B49A (backgrounds, accents)

All Tailwind + arbitrary color values. No CSS files needed.

## Known Limitations (MVP)

- Profile data stored in localStorage (not persisted to Supabase)
- Brand scraper uses public CORS proxies (unreliable, rate-limited)
- No real-time notifications
- No brand messaging
- Admin dashboard is stub pages
- Map falls back to event list if Mapbox token missing

## Next Steps

1. **Database**: Create Supabase schema for:
   - `profiles` (account_type, avatar, display_name)
   - `brands` (brand details, owner_id)
   - `consumer_saves` (user_id, brand_id)
   - `consumer_rsvps` (user_id, event_id)
   - `consumer_wishlist` (user_id, product_id)

2. **Auth**: Wire up Supabase Auth for SignUp flow

3. **Scraper**: Move brandScraper to Supabase Edge Function to control rate limits

4. **Push**: Deploy to Vercel or Supabase Hosting

## Testing Tips

- Log in with any email/password (Supabase Auth will reject, but UI works)
- Use `/brand/onboarding` to test scraper with:
  - Website: `vintagewknd.com` or `maroon-clothing.store`
  - Instagram: `vintagewknd` or `instagram.com/maroon.clothing`
  - TikTok: `tiktok.com/@vintagewknd`
- Try saving brands (♡) and RSVPing events (RSVP button) on `/discover`
- Visit `/profile` to see your saved items
- Map shows all events with live = red + pulse, upcoming = dark

Enjoy the demo! 🎉
