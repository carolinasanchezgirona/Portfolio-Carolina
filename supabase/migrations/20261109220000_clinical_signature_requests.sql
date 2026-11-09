-- Propuesta pendiente de validación y conexión del prestador, no desplegar con pacientes hasta completar DPIA/DPA.
-- Registro técnico separado de clinical_patient_consents: no confundir sobre enviado con consentimiento firmado.
create table if not exists public.clinical_signature_requests (
 id uuid primary key default gen_random_uuid(),
 request_nonce uuid not null unique,
 patient_id uuid not null references public.clinical_patients(id) on delete restrict,
 kind text not null check (kind in ('psicologico','neuro_evaluacion','neuro_intervencion')),
 consent_version text not null,
 signer_email text not null,
 provider text not null default 'docusign' check (provider='docusign'),
 envelope_id uuid unique,
 status text not null default 'preparing'
   check (status in ('preparing','draft','sent','delivered','unknown','completed_unarchived','archived','declined','voided','error')),
 original_sha256 char(64),
 original_path text,
 signed_sha256 char(64),
 signed_path text,
 certificate_sha256 char(64),
 certificate_path text,
 requested_at timestamptz not null default now(),
 submitted_at timestamptz,
 provider_completed_at timestamptz,
 archived_at timestamptz,
 updated_at timestamptz not null default now()
);
create index if not exists clinical_signature_requests_patient_idx on public.clinical_signature_requests(patient_id,requested_at desc);
create index if not exists clinical_signature_requests_pending_idx on public.clinical_signature_requests(patient_id,kind)
 where status in ('preparing','draft','sent','delivered','unknown','completed_unarchived');
alter table public.clinical_signature_requests enable row level security;
-- Solo el backend con service_role puede acceder. NO crear policies para anon/authenticated.
revoke all on public.clinical_signature_requests from public, anon, authenticated;
grant all on public.clinical_signature_requests to service_role;
comment on table public.clinical_signature_requests is
 'Solicitudes de firma con Docusign; archived sólo tras comprobar el estado completed del prestador y guardar PDF y certificado de finalización en Storage privado.';
