create table public.professional_notebook (
 id text primary key check (id='main'),
 body text not null default '' check(char_length(body)<=50000),
 revision integer not null default 1 check(revision>0),
 updated_at timestamptz not null default now()
);
alter table public.professional_notebook enable row level security;
revoke all on public.professional_notebook from public,anon,authenticated;
grant select,insert,update on public.professional_notebook to authenticated;
grant all on public.professional_notebook to service_role;
create policy professional_notebook_admin on public.professional_notebook for all to authenticated
 using ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
 with check ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
comment on table public.professional_notebook is 'General professional notebook, independent of patient histories and patient-facing documents.';

