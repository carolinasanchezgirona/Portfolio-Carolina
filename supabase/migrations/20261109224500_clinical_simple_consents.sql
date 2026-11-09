-- Firma electrónica SIMPLE: registros privados e inmutables una vez archivados.
-- No confundir con firma avanzada/cualificada o firma PDF PAdES.
-- No implica envíos automáticos, ni aceptación de protección de datos RGPD.
create table if not exists public.clinical_simple_consents (
 id uuid primary key default gen_random_uuid(),
 patient_id uuid not null references public.clinical_patients(id) on delete restrict,
 kind text not null check (kind in ('psicologico','neuro_evaluacion','neuro_intervencion')),
 consent_version text not null,
 status text not null default 'preparing'
  check (status in ('preparing','pending','email_accepted','email_unknown','recording','archived','expired','rejected','failed')),
 signer_email text not null,
 original_path text,
 original_sha256 char(64),
 accepted_by text,
 accepted_at timestamptz,
 accepted_session_id uuid,
 evidence_path text,
 evidence_sha256 char(64),
 email_provider_id text,
 email_accepted_at timestamptz,
 archived_at timestamptz,
 expires_at timestamptz not null default (now() + interval '30 days'),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint simple_consents_archived_has_evidence check (
  status <> 'archived' or (
   accepted_at is not null and accepted_session_id is not null and
   evidence_path is not null and evidence_sha256 is not null and
   original_path is not null and original_sha256 is not null and archived_at is not null
  )
 )
);
create index if not exists clinical_simple_consents_patient_idx on public.clinical_simple_consents(patient_id,created_at desc);
create unique index if not exists clinical_simple_consents_open_unique
 on public.clinical_simple_consents(patient_id,kind)
 where status in ('preparing','pending','email_accepted','email_unknown','recording');
alter table public.clinical_simple_consents enable row level security;
revoke all on public.clinical_simple_consents from public,anon,authenticated;
grant all on public.clinical_simple_consents to service_role;
-- Ninguna política pública. El Worker comprueba la sesión del paciente o MFA profesional en cada petición.

create or replace function public.protect_archived_simple_consent()
returns trigger language plpgsql security invoker set search_path = ''
as $$
begin
 if old.status = 'archived' then
  raise exception 'Un consentimiento archivado no se puede modificar ni borrar';
 end if;
 return case when tg_op = 'DELETE' then old else new end;
end;
$$;
revoke all on function public.protect_archived_simple_consent() from public,anon,authenticated;
drop trigger if exists protect_archived_simple_consent on public.clinical_simple_consents;
create trigger protect_archived_simple_consent
 before update or delete on public.clinical_simple_consents
 for each row execute function public.protect_archived_simple_consent();
comment on table public.clinical_simple_consents is
 'Consentimientos por firma electrónica simple autenticada en Mi espacio. El PDF original y acta probatoria se custodian en Storage privado sin publicación al paciente por defecto.';
