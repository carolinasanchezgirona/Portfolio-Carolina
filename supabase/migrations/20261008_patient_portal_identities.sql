create table if not exists public.patient_portal_identities (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  patient_id uuid not null unique references public.clinical_patients(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.patient_portal_identities enable row level security;
revoke all on public.patient_portal_identities from anon, authenticated;
grant all on public.patient_portal_identities to service_role;
comment on table public.patient_portal_identities is 'Vinculación explícita entre identidad verificada de Supabase Auth y ficha clínica. No deducir por dirección de correo.';

alter table public.patient_portal_sessions add column if not exists auth_method text not null default 'legacy';
