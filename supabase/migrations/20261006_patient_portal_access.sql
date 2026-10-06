create table if not exists public.patient_portal_login_codes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.clinical_patients(id) on delete cascade,
  email_normalized text not null,
  code_hash text not null,
  attempts smallint not null default 0 check (attempts >= 0 and attempts <= 10),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists patient_portal_login_codes_email_created_idx
  on public.patient_portal_login_codes (email_normalized, created_at desc);

create index if not exists patient_portal_login_codes_patient_idx
  on public.patient_portal_login_codes (patient_id);

alter table public.patient_portal_login_codes enable row level security;
revoke all on table public.patient_portal_login_codes from anon, authenticated;
grant all on table public.patient_portal_login_codes to service_role;

create table if not exists public.patient_portal_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.clinical_patients(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists patient_portal_sessions_patient_idx
  on public.patient_portal_sessions (patient_id);

create index if not exists patient_portal_sessions_expires_idx
  on public.patient_portal_sessions (expires_at);

alter table public.patient_portal_sessions enable row level security;
revoke all on table public.patient_portal_sessions from anon, authenticated;
grant all on table public.patient_portal_sessions to service_role;

comment on table public.patient_portal_login_codes is
  'Códigos de acceso de un solo uso para Mi espacio. Solo accesibles desde backend con service_role.';

comment on table public.patient_portal_sessions is
  'Sesiones revocables del portal de pacientes. El navegador recibe únicamente el token aleatorio, nunca su hash.';
