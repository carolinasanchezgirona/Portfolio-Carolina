-- Per-publication delivery ledger: one notice per document and share timestamp.
-- Separate from clinical_documents to preserve its existing owner-only RLS.
create table if not exists public.clinical_document_email_notices (
  document_id uuid not null references public.clinical_documents(id) on delete cascade,
  shared_at timestamptz not null,
  status text not null default 'sending'
    check (status in ('sending','sent','failed')),
  claimed_at timestamptz not null default now(),
  sent_at timestamptz,
  provider_message_id text,
  error_code text,
  primary key(document_id, shared_at)
);
create index if not exists clinical_document_email_notices_status_idx
  on public.clinical_document_email_notices (status,claimed_at);

alter table public.clinical_document_email_notices enable row level security;
revoke all on public.clinical_document_email_notices from PUBLIC, anon, authenticated;
grant select on public.clinical_document_email_notices to authenticated;
grant all on public.clinical_document_email_notices to service_role;
drop policy if exists clinical_document_email_notices_owner_read
  on public.clinical_document_email_notices;
create policy clinical_document_email_notices_owner_read
  on public.clinical_document_email_notices
  for select to authenticated
  using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);

-- No patient session, anonymous visitor or other authenticated user can claim or alter email notices.
