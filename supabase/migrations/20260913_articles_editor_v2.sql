alter table public.articles
  add column if not exists subtitle text,
  add column if not exists tags text[] not null default '{}'::text[],
  add column if not exists image_alt text,
  add column if not exists image_caption text,
  add column if not exists cta_label text,
  add column if not exists cta_url text,
  add column if not exists scheduled_at timestamptz;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images',
  'article-images',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read article images" on storage.objects;
create policy "Public read article images"
on storage.objects for select
to public
using (bucket_id = 'article-images');

drop policy if exists "Admin upload article images" on storage.objects;
create policy "Admin upload article images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'article-images'
  and auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
);

drop policy if exists "Admin update article images" on storage.objects;
create policy "Admin update article images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'article-images'
  and auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
)
with check (
  bucket_id = 'article-images'
  and auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
);

drop policy if exists "Admin delete article images" on storage.objects;
create policy "Admin delete article images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'article-images'
  and auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
);
