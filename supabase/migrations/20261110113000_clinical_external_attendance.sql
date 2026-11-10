-- Creu Blava: independent photo roster with explicit attendance confirmation.
-- No patient data is stored in the source repository; all roster records live in Supabase.
create table if not exists public.clinical_external_attendance (
  id uuid primary key default gen_random_uuid(),
  visit_date date not null,
  visit_time time without time zone not null,
  roster_name text not null check (char_length(trim(roster_name)) between 2 and 160),
  patient_id uuid references public.clinical_patients(id) on delete set null,
  provider text not null default 'Creu Blava' check (provider = 'Creu Blava'),
  attendance_status text not null default 'pending'
    check (attendance_status in ('pending', 'completed', 'no_show', 'cancelled')),
  attendance_note text check (attendance_note is null or char_length(attendance_note) <= 1000),
  source_type text not null default 'photo_roster'
    check (source_type in ('photo_roster', 'manual')),
  status_recorded_at timestamptz,
  status_recorded_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (visit_date, visit_time, roster_name)
);
create index if not exists clinical_external_attendance_patient_date_idx
  on public.clinical_external_attendance(patient_id, visit_date desc);
create index if not exists clinical_external_attendance_date_idx
  on public.clinical_external_attendance(visit_date, visit_time);

alter table public.clinical_external_attendance enable row level security;
revoke all on public.clinical_external_attendance from anon, authenticated;
grant select, insert, update on public.clinical_external_attendance to authenticated;
create policy clinical_external_attendance_professional_access
  on public.clinical_external_attendance for all to authenticated
  using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
    and (select public.admin_mobile_gate()))
  with check ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
    and (select public.admin_mobile_gate()));

create table if not exists public.clinical_external_attendance_events (
  id bigint generated always as identity primary key,
  attendance_id uuid not null references public.clinical_external_attendance(id),
  patient_id uuid references public.clinical_patients(id) on delete set null,
  old_status text,
  new_status text not null,
  old_patient_id uuid,
  new_patient_id uuid,
  old_note text,
  new_note text,
  actor_id uuid,
  changed_at timestamptz not null default now()
);
create index if not exists clinical_external_attendance_events_row_idx
  on public.clinical_external_attendance_events(attendance_id, changed_at desc);
alter table public.clinical_external_attendance_events enable row level security;
revoke all on public.clinical_external_attendance_events from anon, authenticated;
grant select on public.clinical_external_attendance_events to authenticated;
create policy clinical_external_attendance_events_professional_read
  on public.clinical_external_attendance_events for select to authenticated
  using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
    and (select public.admin_mobile_gate()));

create or replace function public.audit_clinical_external_attendance()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'UPDATE' then
    new.updated_at := now();
    if old.attendance_status is distinct from new.attendance_status then
      new.status_recorded_at := case when new.attendance_status = 'pending' then null else now() end;
      new.status_recorded_by := case when new.attendance_status = 'pending' then null else auth.uid() end;
    end if;
    if row(old.attendance_status, old.patient_id, old.attendance_note)
        is distinct from row(new.attendance_status, new.patient_id, new.attendance_note) then
      insert into public.clinical_external_attendance_events
        (attendance_id, patient_id, old_status, new_status,
         old_patient_id, new_patient_id, old_note, new_note, actor_id)
      values (new.id, new.patient_id, old.attendance_status, new.attendance_status,
         old.patient_id, new.patient_id, old.attendance_note, new.attendance_note, auth.uid());
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.audit_clinical_external_attendance() from public, anon, authenticated;
drop trigger if exists clinical_external_attendance_audit on public.clinical_external_attendance;
create trigger clinical_external_attendance_audit
  before update on public.clinical_external_attendance
  for each row execute function public.audit_clinical_external_attendance();

comment on table public.clinical_external_attendance is
  'Photo-imported external rosters with explicit status, independently of clinical session documentation. Private to professional; never exposed to patient portal.';
comment on table public.clinical_external_attendance_events is
  'Append-only attendance status, link, and note change history; readable only by professional.';