-- Editorial Instagram: public educational content only. Do not store patient data.
create table if not exists public.instagram_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid(),
  source_article_id uuid references public.articles(id) on delete set null,
  source_article_slug text,
  topic text not null,
  family text not null check (family in ('educativa','pregunta','profesional')),
  format text not null check (format in ('carrusel','individual')),
  accent text not null check (accent in ('turquesa','coral')),
  status text not null default 'draft' check (status in ('draft','ready','exported')),
  content jsonb not null default '{}'::jsonb,
  photos jsonb not null default '{}'::jsonb,
  evidence_reviewed boolean not null default false,
  design_reviewed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists instagram_posts_updated_idx on public.instagram_posts(updated_at desc);
create index if not exists instagram_posts_source_idx on public.instagram_posts(source_article_id);
alter table public.instagram_posts enable row level security;
create policy "Only Carolina can read Instagram drafts" on public.instagram_posts for select to authenticated
  using (auth.uid() = author_id and auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy "Only Carolina can create Instagram drafts" on public.instagram_posts for insert to authenticated
  with check (auth.uid() = author_id and auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy "Only Carolina can edit Instagram drafts" on public.instagram_posts for update to authenticated
  using (auth.uid() = author_id and auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
  with check (auth.uid() = author_id and auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy "Only Carolina can remove Instagram drafts" on public.instagram_posts for delete to authenticated
  using (auth.uid() = author_id and auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('instagram-assets','instagram-assets',true,5242880,array['image/webp','image/png','image/jpeg'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "Carolina can upload Instagram assets" on storage.objects for insert to authenticated
  with check(bucket_id='instagram-assets' and auth.uid()='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy "Carolina can view Instagram assets" on storage.objects for select to authenticated
  using(bucket_id='instagram-assets' and auth.uid()='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy "Carolina can remove Instagram assets" on storage.objects for delete to authenticated
  using(bucket_id='instagram-assets' and auth.uid()='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
