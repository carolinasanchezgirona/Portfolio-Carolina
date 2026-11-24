-- Expedientes de consentimiento asociados a la ficha, exclusivamente desde backend.
-- La persona paciente solo accede a sus solicitudes a través de una sesión
-- revocable de Mi espacio; jamás por la Data API de Supabase.
create table if not exists public.clinical_consent_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.clinical_patients(id) on delete restrict,
  kind text not null check (kind in ('psicologico','neuro_evaluacion','neuro_intervencion','privacidad')),
  status text not null default 'pending'
    check (status in ('pending','submitted','verified','cancelled')),
  document_version text not null default '2026-11-09',
  assigned_at timestamptz not null default now(),
  signed_at timestamptz,
  verified_at timestamptz,
  cancelled_at timestamptz,
  signed_payload jsonb,
  evidence_sha256 text,
  pdf_sha256 text,
  document_id uuid references public.clinical_documents(id) on delete restrict,
  constraint clinical_consent_signed_fields_check check (
    status in ('pending','cancelled') or
    (signed_at is not null and signed_payload is not null and evidence_sha256 is not null and pdf_sha256 is not null and document_id is not null)
  )
);
create index if not exists clinical_consent_requests_patient_idx
  on public.clinical_consent_requests(patient_id,assigned_at desc);
create unique index if not exists clinical_consent_requests_one_pending
  on public.clinical_consent_requests(patient_id,kind) where status='pending';

alter table public.clinical_consent_requests enable row level security;
revoke all on public.clinical_consent_requests from public, anon, authenticated;
grant select,insert,update on public.clinical_consent_requests to service_role;

-- Una firma recibida no se sobrescribe; solo cambian el estado y la
-- fecha de revisión. No permitir modificar el contenido probatorio.
create or replace function public.guard_signed_clinical_consent()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if old.status in ('submitted','verified') and
     (new.patient_id is distinct from old.patient_id
      or new.kind is distinct from old.kind
      or new.document_version is distinct from old.document_version
      or new.assigned_at is distinct from old.assigned_at
      or new.signed_at is distinct from old.signed_at
      or new.signed_payload is distinct from old.signed_payload
      or new.evidence_sha256 is distinct from old.evidence_sha256
      or new.pdf_sha256 is distinct from old.pdf_sha256
      or new.document_id is distinct from old.document_id
      or new.cancelled_at is distinct from old.cancelled_at)
  then
    raise exception 'La evidencia de un consentimiento recibido es inmutable.';
  end if;
  if old.status='verified' and new.status <> 'verified' then
    raise exception 'Una validación no puede revertirse automáticamente.';
  end if;
  return new;
end;
$$;
revoke all on function public.guard_signed_clinical_consent() from public, anon, authenticated;
drop trigger if exists clinical_consent_signed_guard on public.clinical_consent_requests;
create trigger clinical_consent_signed_guard before update on public.clinical_consent_requests
for each row execute function public.guard_signed_clinical_consent();

comment on table public.clinical_consent_requests is
  'Solicitud de consentimiento del expediente; evidencia y PDF firmado privados, solo accesibles por servidor y profesional con MFA.';
