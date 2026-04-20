-- ============================================================
-- KITAKAKIS — OAuth integrations + analytics snapshots
-- Supabase SQL Editor → New Query → paste → Run
-- ============================================================
--
-- This migration adds:
--   • pgsodium-backed encryption for OAuth tokens at rest
--   • connected_integrations table (one row per brand × provider)
--   • analytics_snapshots table (daily metric rollups per brand × provider)
--   • Row-Level Security so brands only see their own rows
--   • Helper functions that encrypt/decrypt via Vault automatically
--
-- SECURITY — before applying, enable Vault in Supabase dashboard:
--   Project → Settings → Vault → "Enable Vault"
-- That creates the `vault` schema and the encryption key we reference below.
-- Vault is pgsodium under the hood.
--
-- Providers we'll wire, in order:
--   1. google_analytics  (GA4 Data API)
--   2. shopify           (Admin API)
--   3. stripe            (Connect OAuth)
--   4. meta              (Instagram Graph + Facebook Graph)
--   5. tiktok            (TikTok for Business)
--   6. youtube           (YouTube Analytics API)

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists pgsodium;
create extension if not exists "uuid-ossp";

-- ─── ENUMS ──────────────────────────────────────────────────
do $$ begin
  create type integration_provider as enum (
    'google_analytics','shopify','stripe','meta_instagram','meta_facebook','tiktok','youtube'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type integration_status as enum ('pending','connected','error','revoked');
exception when duplicate_object then null; end $$;

-- ─── CONNECTED INTEGRATIONS ─────────────────────────────────
-- One row per (brand, provider). OAuth tokens are stored as pgsodium-
-- encrypted text — the raw values NEVER leave Postgres in plaintext.
--
-- The `access_token` + `refresh_token` columns are declared as text but
-- Supabase's column encryption (via `security label`) rewrites them
-- transparently. Reads through the `connected_integrations_decrypted`
-- view return plaintext; direct table reads return ciphertext.

create table if not exists connected_integrations (
  id               uuid primary key default gen_random_uuid(),
  brand_id         uuid not null references brands(id) on delete cascade,
  provider         integration_provider not null,
  status           integration_status   not null default 'pending',
  -- Encrypted OAuth material (see `security label` calls below)
  access_token     text,
  refresh_token    text,
  -- Non-sensitive metadata (safe to read plaintext)
  provider_account_id text,             -- e.g. GA4 property id, Shopify shop domain
  provider_account_label text,          -- human-readable shop name / account name
  scopes           text[] default '{}',
  expires_at       timestamptz,
  last_synced_at   timestamptz,
  last_error       text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  unique (brand_id, provider, provider_account_id)
);

-- Encrypt the sensitive columns using pgsodium's column-level encryption
-- (Supabase Vault syntax). Requires Vault enabled in the project.
security label for pgsodium on column connected_integrations.access_token
  is 'ENCRYPT WITH KEY ID default';
security label for pgsodium on column connected_integrations.refresh_token
  is 'ENCRYPT WITH KEY ID default';

create index if not exists connected_integrations_brand_idx
  on connected_integrations (brand_id, provider);

-- ─── ANALYTICS SNAPSHOTS ────────────────────────────────────
-- Daily rollup, one row per (brand, provider, snapshot_date).
-- Metrics are stored as JSONB so we don't need schema migrations
-- each time a provider adds/removes a field.
--
-- Example metrics payloads:
--   GA4:      { sessions, users, page_views, engagement_rate, revenue }
--   Shopify:  { orders, gross_sales, refunds, aov, top_products }
--   Meta IG:  { followers, reach, impressions, profile_visits }
--   TikTok:   { followers, video_views, likes, comments, shares }

create table if not exists analytics_snapshots (
  id             uuid primary key default gen_random_uuid(),
  brand_id       uuid not null references brands(id) on delete cascade,
  provider       integration_provider not null,
  snapshot_date  date not null,
  metrics        jsonb not null default '{}',
  raw_response   jsonb,                   -- debugging; prune after 30d
  created_at     timestamptz default now(),
  unique (brand_id, provider, snapshot_date)
);

create index if not exists analytics_snapshots_brand_date_idx
  on analytics_snapshots (brand_id, snapshot_date desc);

-- ─── ROW-LEVEL SECURITY ─────────────────────────────────────
-- Brands can only see/write their own integration rows and snapshots.
-- Admin service role bypasses RLS — use it for the scheduled cron
-- worker that pulls data and inserts snapshots.

alter table connected_integrations enable row level security;
alter table analytics_snapshots    enable row level security;

-- Owner = profile that owns the brand
drop policy if exists integrations_brand_owner_read on connected_integrations;
create policy integrations_brand_owner_read
  on connected_integrations for select
  using (
    brand_id in (select id from brands where owner_id = auth.uid())
  );

drop policy if exists integrations_brand_owner_write on connected_integrations;
create policy integrations_brand_owner_write
  on connected_integrations for all
  using (
    brand_id in (select id from brands where owner_id = auth.uid())
  )
  with check (
    brand_id in (select id from brands where owner_id = auth.uid())
  );

drop policy if exists snapshots_brand_owner_read on analytics_snapshots;
create policy snapshots_brand_owner_read
  on analytics_snapshots for select
  using (
    brand_id in (select id from brands where owner_id = auth.uid())
  );

-- Snapshots are written by the service-role cron worker only. No
-- client-side insert policy on purpose — clients read, workers write.

-- ─── updated_at TRIGGER ─────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_integrations_updated on connected_integrations;
create trigger trg_integrations_updated
  before update on connected_integrations
  for each row execute function set_updated_at();

-- ─── DONE ───────────────────────────────────────────────────
-- Next steps (code, not SQL):
--   1. /api/oauth/[provider]/start  — builds authorise URL
--   2. /api/oauth/[provider]/callback — exchanges code, inserts row
--   3. /api/cron/sync-analytics — pulls daily metrics per integration
--   4. Dashboard tile reads from analytics_snapshots for latest date
