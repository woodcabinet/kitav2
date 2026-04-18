-- ============================================================
-- KITAKAKIS v2 — Full Platform Schema
-- Supabase SQL Editor → New Query → paste → Run
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- fuzzy search

-- ─── ENUMS ──────────────────────────────────────────────────
create type brand_category as enum (
  'fashion','food_beverage','beauty','lifestyle','arts_crafts',
  'wellness','home_decor','tech','sports','entertainment','other'
);

create type social_platform as enum ('instagram','tiktok','website','shopee','lazada');

create type post_status as enum ('draft','scheduled','published','failed');

create type event_type as enum ('market','pop_up','launch','workshop','collab','other');

create type collab_status as enum ('open','applied','accepted','closed');

create type reward_action as enum (
  'follow_brand','attend_event','purchase','share_post',
  'refer_user','daily_checkin','review'
);

create type order_status as enum ('pending','confirmed','shipped','delivered','cancelled');

create type account_type as enum ('consumer','brand','admin');

-- ─── PROFILES ────────────────────────────────────────────────
-- Extends Supabase auth.users
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  display_name  text,
  avatar_url    text,
  bio           text,
  account_type  account_type default 'consumer',
  points        integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── BRANDS ──────────────────────────────────────────────────
create table if not exists brands (
  id              uuid default gen_random_uuid() primary key,
  owner_id        uuid references profiles(id) on delete set null,
  slug            text unique not null,
  name            text not null,
  tagline         text,
  description     text,
  logo_url        text,
  banner_url      text,
  category        brand_category default 'other',
  website_url     text,
  location        text, -- SG district / neighbourhood
  lat             numeric(9,6),
  lng             numeric(9,6),
  verified        boolean default false,
  claimed         boolean default false,
  -- AI-scraped metadata
  auto_scraped    boolean default false,
  scrape_sources  jsonb default '[]', -- [{platform, handle, last_scraped}]
  -- Stripe
  stripe_account_id text,
  -- Stats (denormalised for speed)
  follower_count  integer default 0,
  post_count      integer default 0,
  product_count   integer default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── BRAND SOCIAL ACCOUNTS ───────────────────────────────────
create table if not exists brand_social_accounts (
  id              uuid default gen_random_uuid() primary key,
  brand_id        uuid references brands(id) on delete cascade,
  platform        social_platform not null,
  handle          text not null,
  access_token    text, -- encrypted at app layer
  refresh_token   text,
  token_expires   timestamptz,
  follower_count  integer,
  last_synced     timestamptz,
  sync_enabled    boolean default true,
  created_at      timestamptz default now(),
  unique(brand_id, platform)
);

-- ─── SOCIAL POSTS (synced + native) ──────────────────────────
create table if not exists posts (
  id              uuid default gen_random_uuid() primary key,
  brand_id        uuid references brands(id) on delete cascade,
  platform        social_platform,
  platform_post_id text, -- original post ID from the platform
  content         text,
  media_urls      jsonb default '[]', -- array of image/video URLs
  thumbnail_url   text,
  likes           integer default 0,
  comments        integer default 0,
  shares          integer default 0,
  views           integer default 0,
  status          post_status default 'published',
  scheduled_at    timestamptz, -- for scheduled posts
  published_at    timestamptz,
  ai_caption      text, -- AI-suggested caption
  ai_tags         text[], -- AI-suggested hashtags
  cross_post_targets jsonb default '[]', -- platforms to cross-post to
  created_at      timestamptz default now()
);

-- ─── POST ANALYTICS (per-day snapshots) ──────────────────────
create table if not exists post_analytics (
  id          uuid default gen_random_uuid() primary key,
  post_id     uuid references posts(id) on delete cascade,
  date        date not null,
  likes       integer default 0,
  comments    integer default 0,
  shares      integer default 0,
  views       integer default 0,
  saves       integer default 0,
  reach       integer default 0,
  created_at  timestamptz default now(),
  unique(post_id, date)
);

-- ─── BRAND ANALYTICS (per-day snapshots) ─────────────────────
create table if not exists brand_analytics (
  id              uuid default gen_random_uuid() primary key,
  brand_id        uuid references brands(id) on delete cascade,
  date            date not null,
  platform        social_platform,
  follower_count  integer default 0,
  impressions     integer default 0,
  profile_views   integer default 0,
  link_clicks     integer default 0,
  new_followers   integer default 0,
  revenue         numeric(12,2) default 0,
  orders_count    integer default 0,
  created_at      timestamptz default now(),
  unique(brand_id, date, platform)
);

-- ─── AI CONTENT RECOMMENDATIONS ──────────────────────────────
create table if not exists ai_recommendations (
  id          uuid default gen_random_uuid() primary key,
  brand_id    uuid references brands(id) on delete cascade,
  type        text, -- 'caption','post_idea','trending_topic','best_time'
  content     text,
  metadata    jsonb default '{}',
  dismissed   boolean default false,
  used        boolean default false,
  created_at  timestamptz default now()
);

-- ─── PRODUCTS ─────────────────────────────────────────────────
create table if not exists products (
  id              uuid default gen_random_uuid() primary key,
  brand_id        uuid references brands(id) on delete cascade,
  name            text not null,
  description     text,
  price           numeric(10,2) not null,
  compare_price   numeric(10,2), -- strike-through price
  images          jsonb default '[]',
  category        text,
  tags            text[],
  stock           integer default 0,
  unlimited_stock boolean default false,
  stripe_price_id text,
  active          boolean default true,
  drop_at         timestamptz, -- for timed drops
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── ORDERS ──────────────────────────────────────────────────
create table if not exists orders (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid references profiles(id),
  brand_id          uuid references brands(id),
  items             jsonb not null, -- [{product_id, name, price, qty}]
  subtotal          numeric(10,2) not null,
  platform_fee      numeric(10,2) not null,
  total             numeric(10,2) not null,
  status            order_status default 'pending',
  stripe_session_id text,
  stripe_transfer_id text,
  shipping_address  jsonb,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ─── EVENTS ──────────────────────────────────────────────────
create table if not exists events (
  id              uuid default gen_random_uuid() primary key,
  brand_id        uuid references brands(id) on delete cascade,
  title           text not null,
  description     text,
  event_type      event_type default 'other',
  cover_url       text,
  venue_name      text,
  address         text,
  lat             numeric(9,6),
  lng             numeric(9,6),
  starts_at       timestamptz not null,
  ends_at         timestamptz,
  is_free         boolean default true,
  ticket_price    numeric(10,2),
  max_capacity    integer,
  rsvp_count      integer default 0,
  published       boolean default true,
  created_at      timestamptz default now()
);

-- ─── EVENT RSVPS ─────────────────────────────────────────────
create table if not exists event_rsvps (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete cascade,
  event_id    uuid references events(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, event_id)
);

-- ─── DROPS ───────────────────────────────────────────────────
create table if not exists drops (
  id          uuid default gen_random_uuid() primary key,
  brand_id    uuid references brands(id) on delete cascade,
  title       text not null,
  description text,
  cover_url   text,
  drop_at     timestamptz not null,
  products    jsonb default '[]', -- product_ids in this drop
  hype_count  integer default 0, -- people watching/hyped
  published   boolean default true,
  created_at  timestamptz default now()
);

-- ─── DROP HYPE ────────────────────────────────────────────────
create table if not exists drop_hype (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete cascade,
  drop_id     uuid references drops(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, drop_id)
);

-- ─── THREADS (community discussions) ────────────────────────
create table if not exists threads (
  id          uuid default gen_random_uuid() primary key,
  author_id   uuid references profiles(id) on delete set null,
  brand_id    uuid references brands(id) on delete set null, -- null = user thread
  title       text,
  content     text not null,
  images      jsonb default '[]',
  tags        text[],
  like_count  integer default 0,
  reply_count integer default 0,
  pinned      boolean default false,
  created_at  timestamptz default now()
);

-- ─── THREAD REPLIES ──────────────────────────────────────────
create table if not exists thread_replies (
  id          uuid default gen_random_uuid() primary key,
  thread_id   uuid references threads(id) on delete cascade,
  author_id   uuid references profiles(id) on delete set null,
  content     text not null,
  like_count  integer default 0,
  created_at  timestamptz default now()
);

-- ─── LIKES (polymorphic) ────────────────────────────────────
create table if not exists likes (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references profiles(id) on delete cascade,
  target_type   text not null, -- 'post','thread','reply'
  target_id     uuid not null,
  created_at    timestamptz default now(),
  unique(user_id, target_type, target_id)
);

-- ─── FOLLOWS ─────────────────────────────────────────────────
create table if not exists follows (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete cascade,
  brand_id    uuid references brands(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, brand_id)
);

-- ─── WISHLISTS ───────────────────────────────────────────────
create table if not exists wishlist (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete cascade,
  product_id  uuid references products(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, product_id)
);

-- ─── BRAND CONNECTIONS (LinkedIn-style B2B) ──────────────────
create table if not exists brand_connections (
  id              uuid default gen_random_uuid() primary key,
  requester_id    uuid references brands(id) on delete cascade,
  receiver_id     uuid references brands(id) on delete cascade,
  status          text default 'pending', -- pending, accepted, declined
  message         text,
  created_at      timestamptz default now(),
  unique(requester_id, receiver_id)
);

-- ─── COLLABORATIONS (event/collab listings) ──────────────────
create table if not exists collaborations (
  id              uuid default gen_random_uuid() primary key,
  brand_id        uuid references brands(id) on delete cascade, -- posting brand
  title           text not null,
  description     text,
  collab_type     text, -- 'event_collab','product_collab','pop_up_partner','sponsor'
  status          collab_status default 'open',
  requirements    text,
  compensation    text,
  deadline        timestamptz,
  max_applicants  integer,
  created_at      timestamptz default now()
);

-- ─── COLLAB APPLICATIONS ─────────────────────────────────────
create table if not exists collab_applications (
  id              uuid default gen_random_uuid() primary key,
  collab_id       uuid references collaborations(id) on delete cascade,
  brand_id        uuid references brands(id) on delete cascade,
  message         text,
  status          text default 'pending', -- pending, accepted, declined
  created_at      timestamptz default now(),
  unique(collab_id, brand_id)
);

-- ─── REWARDS ─────────────────────────────────────────────────
create table if not exists rewards_transactions (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete cascade,
  action      reward_action not null,
  points      integer not null, -- positive = earn, negative = redeem
  reference_id uuid, -- brand/event/order id context
  note        text,
  created_at  timestamptz default now()
);

-- ─── NOTIFICATIONS ───────────────────────────────────────────
create table if not exists notifications (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete cascade,
  type        text not null, -- 'drop_live','event_tomorrow','collab_accepted', etc
  title       text,
  body        text,
  image_url   text,
  action_url  text,
  read        boolean default false,
  created_at  timestamptz default now()
);

-- ─── INDEXES ─────────────────────────────────────────────────
create index if not exists idx_posts_brand_id on posts(brand_id);
create index if not exists idx_posts_published_at on posts(published_at desc);
create index if not exists idx_events_starts_at on events(starts_at);
create index if not exists idx_events_brand_id on events(brand_id);
create index if not exists idx_drops_drop_at on drops(drop_at);
create index if not exists idx_brands_category on brands(category);
create index if not exists idx_brands_slug on brands(slug);
create index if not exists idx_threads_created_at on threads(created_at desc);
create index if not exists idx_follows_user_id on follows(user_id);
create index if not exists idx_follows_brand_id on follows(brand_id);
create index if not exists idx_notifications_user_id on notifications(user_id, read);
-- Full-text search on brands
create index if not exists idx_brands_search on brands using gin(
  to_tsvector('english', coalesce(name,'') || ' ' || coalesce(tagline,'') || ' ' || coalesce(description,''))
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
alter table profiles enable row level security;
alter table brands enable row level security;
alter table brand_social_accounts enable row level security;
alter table posts enable row level security;
alter table post_analytics enable row level security;
alter table brand_analytics enable row level security;
alter table ai_recommendations enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table events enable row level security;
alter table event_rsvps enable row level security;
alter table drops enable row level security;
alter table drop_hype enable row level security;
alter table threads enable row level security;
alter table thread_replies enable row level security;
alter table likes enable row level security;
alter table follows enable row level security;
alter table wishlist enable row level security;
alter table brand_connections enable row level security;
alter table collaborations enable row level security;
alter table collab_applications enable row level security;
alter table rewards_transactions enable row level security;
alter table notifications enable row level security;

-- Public read policies
create policy "public_profiles" on profiles for select using (true);
create policy "public_brands" on brands for select using (true);
create policy "public_posts" on posts for select using (status = 'published');
create policy "public_products" on products for select using (active = true);
create policy "public_events" on events for select using (published = true);
create policy "public_drops" on drops for select using (published = true);
create policy "public_threads" on threads for select using (true);
create policy "public_thread_replies" on thread_replies for select using (true);
create policy "public_collaborations" on collaborations for select using (true);

-- Authenticated write policies (own data)
create policy "own_profile_write" on profiles for all using (auth.uid() = id);
create policy "own_orders" on orders for all using (auth.uid() = user_id);
create policy "own_rsvps" on event_rsvps for all using (auth.uid() = user_id);
create policy "own_hype" on drop_hype for all using (auth.uid() = user_id);
create policy "own_likes" on likes for all using (auth.uid() = user_id);
create policy "own_follows" on follows for all using (auth.uid() = user_id);
create policy "own_wishlist" on wishlist for all using (auth.uid() = user_id);
create policy "own_notifications" on notifications for all using (auth.uid() = user_id);
create policy "own_rewards" on rewards_transactions for select using (auth.uid() = user_id);

-- Brand owner policies
create policy "brand_owner_write" on brands for all
  using (auth.uid() = owner_id);
create policy "brand_posts_write" on posts for all
  using (auth.uid() = (select owner_id from brands where id = brand_id));
create policy "brand_products_write" on products for all
  using (auth.uid() = (select owner_id from brands where id = brand_id));
create policy "brand_events_write" on events for all
  using (auth.uid() = (select owner_id from brands where id = brand_id));
create policy "brand_drops_write" on drops for all
  using (auth.uid() = (select owner_id from brands where id = brand_id));
create policy "brand_analytics_read" on brand_analytics for select
  using (auth.uid() = (select owner_id from brands where id = brand_id));
create policy "brand_ai_recs" on ai_recommendations for all
  using (auth.uid() = (select owner_id from brands where id = brand_id));

-- Thread write (authenticated)
create policy "threads_write" on threads for insert with check (auth.uid() = author_id);
create policy "replies_write" on thread_replies for insert with check (auth.uid() = author_id);

-- ─── TRIGGERS — auto-update follower counts ───────────────────
create or replace function update_follower_count() returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update brands set follower_count = follower_count + 1 where id = NEW.brand_id;
    update profiles set points = points + 5 where id = NEW.user_id;
    insert into rewards_transactions(user_id, action, points, reference_id)
      values (NEW.user_id, 'follow_brand', 5, NEW.brand_id);
  elsif TG_OP = 'DELETE' then
    update brands set follower_count = follower_count - 1 where id = OLD.brand_id;
  end if;
  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

create trigger trg_follow_count
  after insert or delete on follows
  for each row execute function update_follower_count();

-- RSVP count trigger
create or replace function update_rsvp_count() returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update events set rsvp_count = rsvp_count + 1 where id = NEW.event_id;
  elsif TG_OP = 'DELETE' then
    update events set rsvp_count = rsvp_count - 1 where id = OLD.event_id;
  end if;
  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

create trigger trg_rsvp_count
  after insert or delete on event_rsvps
  for each row execute function update_rsvp_count();

-- Hype count trigger
create or replace function update_hype_count() returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update drops set hype_count = hype_count + 1 where id = NEW.drop_id;
  elsif TG_OP = 'DELETE' then
    update drops set hype_count = hype_count - 1 where id = OLD.drop_id;
  end if;
  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

create trigger trg_hype_count
  after insert or delete on drop_hype
  for each row execute function update_hype_count();

-- Auto-create profile on signup
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, username, display_name, avatar_url)
  values (
    NEW.id,
    split_part(NEW.email, '@', 1),
    coalesce(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── SEED DATA — Singapore local brands (auto-scraped demo) ──
insert into brands (slug, name, tagline, description, category, location, lat, lng, auto_scraped, verified, claimed, follower_count) values
('assembly-coffee', 'Assembly Coffee', 'Specialty coffee. Community first.', 'Singapore''s beloved specialty coffee brand, roasting and brewing with intention.', 'food_beverage', 'Tanjong Pagar', 1.2762, 103.8446, true, true, false, 8420),
('tigerskin', 'Tigerskin', 'Womenswear for the bold.', 'Independent Singapore womenswear label crafting bold, intentional pieces.', 'fashion', 'Tiong Bahru', 1.2847, 103.8274, true, false, false, 3200),
('sunday-folks', 'Sunday Folks', 'Artisanal soft serve & waffles.', 'Beloved Holland Village dessert spot known for premium soft serve and waffles.', 'food_beverage', 'Holland Village', 1.3133, 103.7952, true, true, false, 12000),
('tigernator-coffee', 'Tigernator Coffee', 'Bold beans. Bolder people.', 'Local specialty coffee roaster serving the heartlands.', 'food_beverage', 'Bukit Timah', 1.3392, 103.7861, true, false, false, 1850),
('supermama', 'Supermama', 'Singapore design, gifted.', 'Design store celebrating Singapore culture through thoughtful, locally-made objects.', 'lifestyle', 'Keong Saik', 1.2800, 103.8426, true, true, false, 9100),
('foreword-coffee', 'Foreword Coffee', 'Good coffee. Better community.', 'Social enterprise coffee chain empowering persons with disabilities.', 'food_beverage', 'Bugis', 1.3009, 103.8556, true, true, false, 15300),
('naiise', 'Naiise', 'Discover local. Buy local.', 'Multi-brand platform celebrating Singapore and Southeast Asian independent designers.', 'lifestyle', 'Orchard', 1.3048, 103.8318, true, true, false, 22000),
('bynd-artisan', 'Bynd Artisan', 'Handcrafted leather goods.', 'Artisanal leather workshop creating bespoke notebooks, bags and accessories.', 'lifestyle', 'Raffles Place', 1.2840, 103.8515, true, true, false, 7600)
on conflict (slug) do nothing;
