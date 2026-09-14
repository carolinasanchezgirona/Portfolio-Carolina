-- Applied to Supabase project grgyvdxkjdstdyumdfyg.
-- Clinical data belongs to Dememoria and is accessible only by the owner account.

create or replace function public.is_clinical_owner()
returns boolean language sql stable security definer set search_path = ''
as $$ select auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid; $$;

create table if not exists public.clinical_patients (
  id uuid primary key default gen_random_uuid(),
  identity_key text not null unique,
  full_name text not null,
  email text,
  phone text,
  patient_type text not null default 'existing' check (patient_type in ('new','existing')),
  status text not null default 'active' check (status in ('potential','active','discharged','archived')),
  clinical_summary text,
  next_session_focus text,
  medication_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clinical_patients enable row level security;
create policy "clinical_patients_owner_all" on public.clinical_patients
for all to authenticated using (public.is_clinical_owner()) with check (public.is_clinical_owner());

alter table public.appointment_bookings add column if not exists clinical_patient_id uuid
references public.clinical_patients(id) on delete set null;

create table if not exists public.clinical_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.clinical_patients(id) on delete restrict,
  appointment_id uuid unique references public.appointment_bookings(id) on delete set null,
  session_date timestamptz not null default now(),
  session_number integer check (session_number is null or session_number > 0),
  status text not null default 'draft' check (status in ('draft','in_progress','pending_close','approved','amended')),
  work_notes text,
  evolution_note text,
  intervention_note text,
  response_note text,
  agreements_note text,
  homework_note text,
  next_session_note text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clinical_sessions enable row level security;
create policy "clinical_sessions_owner_all" on public.clinical_sessions
for all to authenticated using (public.is_clinical_owner()) with check (public.is_clinical_owner());

grant select, insert, update on public.clinical_patients to authenticated;
grant select, insert, update on public.clinical_sessions to authenticated;
