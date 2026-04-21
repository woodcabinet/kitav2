-- ============================================================
-- KITAKAKIS — Storage bucket for brand assets
-- Run in Supabase SQL Editor
-- ============================================================
-- Creates a public bucket `brand-assets` where signed-in brand
-- owners can upload logos, banners, product images, and gallery
-- shots. Files are organised as:
--   <auth.uid>/logos/<filename>
--   <auth.uid>/banners/<filename>
--   <auth.uid>/products/<product_id>/<filename>
-- RLS enforces that users can only write to their own folder,
-- but anyone (including anon) can read — this is by design
-- because images are served from public brand pages.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-assets',
  'brand-assets',
  true,
  10485760, -- 10MB per file
  array['image/jpeg','image/png','image/webp','image/gif','image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read — anyone can view brand images
drop policy if exists "brand_assets_public_read" on storage.objects;
create policy "brand_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'brand-assets');

-- Authenticated users can upload into their own folder
drop policy if exists "brand_assets_own_insert" on storage.objects;
create policy "brand_assets_own_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "brand_assets_own_update" on storage.objects;
create policy "brand_assets_own_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "brand_assets_own_delete" on storage.objects;
create policy "brand_assets_own_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
