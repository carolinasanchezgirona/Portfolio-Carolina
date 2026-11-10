-- Restricted incident registry for the controller's internal compliance records.
-- Never place patient identifiers or the incident report in this public repository.
create table if not exists public.privacy_incidents (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique check (length(reference) between 8 and 60),
  title text not null,
  occurred_at timestamptz,
  summary text not null default '',
  external_reference text,
  risk_assessment text not null default 'Pendiente de evaluación definitiva',
  status text not null default 'investigating' check (status in ('investigating', 'contained', 'closed')),
  attachment_path text,
  attachment_sha256 text,
  attachment_mime text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.privacy_incidents enable row level security;
revoke all on public.privacy_incidents from anon, authenticated;
grant select,insert,update on public.privacy_incidents to authenticated;
create policy privacy_incidents_admin_select on public.privacy_incidents
 for select to authenticated using (
  (select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
  and (select public.admin_mobile_gate())
 );
create policy privacy_incidents_admin_insert on public.privacy_incidents
 for insert to authenticated with check (
  (select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
  and (select public.admin_mobile_gate())
 );
create policy privacy_incidents_admin_update on public.privacy_incidents
 for update to authenticated using (
  (select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
  and (select public.admin_mobile_gate())
 ) with check (
  (select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
  and (select public.admin_mobile_gate())
 );
create table if not exists public.privacy_incident_events (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.privacy_incidents(id) on delete restrict,
  event_type text not null,
  detail text not null,
  recorded_at timestamptz not null default now(),
  recorded_by uuid default auth.uid()
);
alter table public.privacy_incident_events enable row level security;
revoke all on public.privacy_incident_events from anon, authenticated;
grant select, insert on public.privacy_incident_events to authenticated;
create policy privacy_incident_events_admin_select on public.privacy_incident_events
 for select to authenticated using (
  (select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
  and (select public.admin_mobile_gate())
 );
create policy privacy_incident_events_admin_insert on public.privacy_incident_events
 for insert to authenticated with check (
  (select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
  and (select public.admin_mobile_gate())
 );
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('privacy-incident-evidence','privacy-incident-evidence',false,10485760,
  array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;
create policy privacy_incident_evidence_admin_insert on storage.objects
 for insert to authenticated with check (
  bucket_id = 'privacy-incident-evidence'
  and (select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
  and (select public.admin_mobile_gate())
 );
create policy privacy_incident_evidence_admin_select on storage.objects
 for select to authenticated using (
  bucket_id = 'privacy-incident-evidence'
  and (select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
  and (select public.admin_mobile_gate())
 );