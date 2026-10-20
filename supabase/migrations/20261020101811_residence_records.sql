create table public.residence_records (
 id uuid primary key default gen_random_uuid(),
 code text not null check (length(trim(code)) between 1 and 200),
 center text not null check (length(trim(center)) between 1 and 200),
 status text not null default 'active' check (status in ('active','archived')),
 data jsonb not null check (jsonb_typeof(data)='object' and jsonb_typeof(data->'profile')='object' and jsonb_typeof(data->'assessments')='array' and jsonb_typeof(data->'reports')='array' and jsonb_typeof(data->'attendance')='array' and jsonb_typeof(data->'followups')='array' and jsonb_typeof(data->'goals')='array' and data ?& array['profile','assessments','reports','attendance','followups','goals'] and octet_length(data::text)<2000000),
 revision integer not null default 1 check(revision>0),
 updated_at timestamptz not null default now(),
 unique(center,code)
);
alter table public.residence_records enable row level security;
revoke all on public.residence_records from public,anon,authenticated;
grant select,insert,update on public.residence_records to authenticated;
grant all on public.residence_records to service_role;
create policy residence_records_admin on public.residence_records for all to authenticated
 using ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
 with check ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
comment on table public.residence_records is 'Private residential care workspace, separate from patient portal. Resident dossiers with assessments, reports, attendance, follow-ups and PIAI goals.';

