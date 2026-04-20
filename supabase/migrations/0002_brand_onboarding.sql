-- ============================================================
-- KITAKAKIS — Brand onboarding fields
-- Supabase SQL Editor → New Query → paste → Run
-- ============================================================
--
-- Adds the last few columns the onboarding scraper populates that
-- weren't in the original schema:
--   • gallery_urls   — scraped brand imagery (jsonb array of URLs)
--   • tags           — ai-suggested hashtags (text[])
--   • platform       — detected storefront platform (shopify, etc.)
--   • onboarded_at   — when the brand finished the onboarding flow
--   • last_scraped_at — latest successful scrape timestamp
--
-- Also unique-ify slug generation by adding a BEFORE-INSERT trigger
-- that appends a short id if the slug collides — so two brands named
-- "heritage bay" don't kill the insert.

-- ─── brands: new columns ────────────────────────────────────
alter table brands add column if not exists gallery_urls   jsonb   default '[]';
alter table brands add column if not exists tags           text[]  default '{}';
alter table brands add column if not exists platform       text;
alter table brands add column if not exists onboarded_at   timestamptz;
alter table brands add column if not exists last_scraped_at timestamptz;

-- ─── slug collision handling ────────────────────────────────
create or replace function brands_ensure_unique_slug()
returns trigger language plpgsql as $$
declare
  base_slug text := new.slug;
  suffix    int := 0;
begin
  while exists (select 1 from brands where slug = new.slug and id <> new.id) loop
    suffix := suffix + 1;
    new.slug := base_slug || '-' || suffix;
    exit when suffix > 200; -- paranoid guard
  end loop;
  return new;
end $$;

drop trigger if exists trg_brands_unique_slug on brands;
create trigger trg_brands_unique_slug
  before insert or update of slug on brands
  for each row execute function brands_ensure_unique_slug();
