-- KitaKakis — Supabase schema
-- Run this in your Supabase project: SQL Editor → New Query → paste → Run

-- Orders
create table if not exists orders (
  id          uuid default gen_random_uuid() primary key,
  user_id     text not null,
  items       jsonb not null,
  total       numeric(10,2) not null,
  created_at  timestamptz default now()
);

-- RSVPs
create table if not exists rsvps (
  id          uuid default gen_random_uuid() primary key,
  user_id     text not null,
  event_id    text not null,
  event_title text,
  created_at  timestamptz default now(),
  unique(user_id, event_id)
);

-- Wishlist
create table if not exists wishlist (
  id          uuid default gen_random_uuid() primary key,
  user_id     text not null,
  item_id     text not null,
  created_at  timestamptz default now(),
  unique(user_id, item_id)
);

-- Brand follows
create table if not exists follows (
  id          uuid default gen_random_uuid() primary key,
  user_id     text not null,
  brand_id    text not null,
  created_at  timestamptz default now(),
  unique(user_id, brand_id)
);

-- Row Level Security — anyone can read/write their own rows (anon key safe)
alter table orders  enable row level security;
alter table rsvps   enable row level security;
alter table wishlist enable row level security;
alter table follows  enable row level security;

create policy "own orders"   on orders   for all using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
create policy "own rsvps"    on rsvps    for all using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
create policy "own wishlist" on wishlist for all using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
create policy "own follows"  on follows  for all using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
