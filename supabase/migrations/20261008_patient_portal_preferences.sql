-- Personalization only: never stores clinical notes or mood responses.
create table if not exists public.patient_portal_preferences (
  patient_id uuid primary key references public.clinical_patients(id) on delete cascade,
  avatar_id text not null check (avatar_id in (
    'boy','girl','teen-boy','teen-girl','adult-man','adult-woman','senior-man','senior-woman'
  )),
  updated_at timestamptz not null default now()
);
alter table public.patient_portal_preferences enable row level security;
revoke all on table public.patient_portal_preferences from public, anon, authenticated;
grant select, insert, update, delete on table public.patient_portal_preferences to service_role;
comment on table public.patient_portal_preferences is
  'Patient avatar choice; accessed only through authenticated Worker endpoints. No clinical or mood content.';
