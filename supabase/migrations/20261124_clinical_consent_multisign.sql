-- Segunda vía de firma dentro de la misma solicitud clínica.
-- Presencial: acceso temporal efímero generado solo bajo MFA.
-- Remota: nombre escrito con OTP al correo ya verificado del expediente.
alter table public.clinical_consent_requests
 add column if not exists signing_method text
 check (signing_method is null or signing_method in ('drawn_portal','typed_email_otp','drawn_onsite'));

create table if not exists public.clinical_consent_onsite_links(
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null references public.clinical_consent_requests(id) on delete cascade,
 token_hash text not null unique,
 issued_at timestamptz not null default now(),
 expires_at timestamptz not null,
 consumed_at timestamptz,
 revoked_at timestamptz
);
create index if not exists clinical_consent_onsite_lookup on public.clinical_consent_onsite_links(token_hash)
 where consumed_at is null and revoked_at is null;
create index if not exists clinical_consent_onsite_per_request on public.clinical_consent_onsite_links(request_id,issued_at desc);

create table if not exists public.clinical_consent_email_otps(
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null references public.clinical_consent_requests(id) on delete cascade,
 patient_id uuid not null references public.clinical_patients(id) on delete restrict,
 code_hash text not null,
 issued_at timestamptz not null default now(),
 expires_at timestamptz not null,
 attempts smallint not null default 0 check(attempts between 0 and 5),
 consumed_at timestamptz
);
create index if not exists clinical_consent_email_otp_lookup on public.clinical_consent_email_otps(request_id,issued_at desc);

alter table public.clinical_consent_onsite_links enable row level security;
alter table public.clinical_consent_email_otps enable row level security;
revoke all on public.clinical_consent_onsite_links from public, anon, authenticated;
revoke all on public.clinical_consent_email_otps from public, anon, authenticated;
grant select,insert,update on public.clinical_consent_onsite_links to service_role;
grant select,insert,update on public.clinical_consent_email_otps to service_role;

-- RPC con invocador de servicio exclusivamente: envío y verificación son atómicos.
-- Evita códigos repetidos ilimitadamente y revoca los anteriores al generar uno nuevo.
create or replace function public.issue_clinical_consent_email_otp(
  p_request_id uuid,p_patient_id uuid,p_code_hash text
) returns text
language plpgsql security invoker set search_path = ''
as $$
declare v_pending boolean; v_now timestamptz := clock_timestamp();
begin
 select true into v_pending from public.clinical_consent_requests
 where id=p_request_id and patient_id=p_patient_id and status='pending' for update;
 if not coalesce(v_pending,false) then return 'invalid'; end if;
 if (select count(*) from public.clinical_consent_email_otps
     where request_id=p_request_id and issued_at>v_now-interval '1 hour')>=3 then
   return 'rate_limited';
 end if;
 if exists(select 1 from public.clinical_consent_email_otps
     where request_id=p_request_id and issued_at>v_now-interval '60 seconds') then
   return 'cooldown';
 end if;
 update public.clinical_consent_email_otps
 set consumed_at=v_now where request_id=p_request_id and consumed_at is null;
 insert into public.clinical_consent_email_otps(request_id,patient_id,code_hash,issued_at,expires_at)
 values(p_request_id,p_patient_id,p_code_hash,v_now,v_now+interval '10 minutes');
 return 'ok';
end;
$$;
revoke all on function public.issue_clinical_consent_email_otp(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.issue_clinical_consent_email_otp(uuid,uuid,text) to service_role;

create or replace function public.consume_clinical_consent_email_otp(
 p_request_id uuid,p_patient_id uuid,p_code_hash text
) returns boolean
language plpgsql security invoker set search_path = ''
as $$
declare v_current public.clinical_consent_email_otps%rowtype;
begin
 select * into v_current from public.clinical_consent_email_otps
 where request_id=p_request_id and patient_id=p_patient_id and consumed_at is null
 order by issued_at desc limit 1 for update;
 if not found then return false; end if;
 if v_current.expires_at <= clock_timestamp() or v_current.attempts>=5 then return false; end if;
 if v_current.code_hash <> p_code_hash then
   update public.clinical_consent_email_otps set attempts=attempts+1 where id=v_current.id;
   return false;
 end if;
 update public.clinical_consent_email_otps set consumed_at=clock_timestamp()
 where id=v_current.id and consumed_at is null;
 return true;
end;
$$;
revoke all on function public.consume_clinical_consent_email_otp(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.consume_clinical_consent_email_otp(uuid,uuid,text) to service_role;

-- No se puede sustituir el método después de registrar la firma.
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
   or new.signing_method is distinct from old.signing_method
   or new.cancelled_at is distinct from old.cancelled_at)
 then raise exception 'La evidencia de un consentimiento recibido es inmutable.'; end if;
 if old.status='verified' and new.status<>'verified' then
  raise exception 'Una validación no puede revertirse automáticamente.';
 end if;
 return new;
end;
$$;
