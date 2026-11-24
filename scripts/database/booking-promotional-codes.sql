-- First-visit campaign, independent of existing booking signature.
-- Apply after reviewing CI; no live campaign is enabled by this migration.
begin;
create table public.booking_promo_codes (
  code text primary key check (code ~ '^[A-Z0-9_-]{3,32}$'),
  label text not null check (length(label) between 1 and 100),
  discount_eur numeric(8,2) not null check (discount_eur > 0 and discount_eur < 60),
  enabled boolean not null default false,
  starts_on date not null,
  ends_on date not null check (ends_on >= starts_on),
  max_uses integer check (max_uses > 0)
);
alter table public.booking_promo_codes enable row level security;
revoke all on public.booking_promo_codes from public, anon, authenticated;
grant select,insert,update on public.booking_promo_codes to authenticated;
-- Reuse the existing professional-only ownership predicate, including the MFA gate.
do $policy$
declare predicate text;
begin
  select pg_get_expr(polqual,polrelid) into strict predicate
  from pg_policy where polrelid='public.appointment_bookings'::regclass
  and polname='profesional_select_bookings';
  execute format('create policy booking_promo_professional on public.booking_promo_codes for all to authenticated using ((%s) and (select public.admin_mobile_gate())) with check ((%s) and (select public.admin_mobile_gate()))',predicate,predicate);
end $policy$;
alter table public.appointment_bookings
  add column promo_code text references public.booking_promo_codes(code),
  add column promo_discount_eur numeric(8,2) not null default 0 check (promo_discount_eur >= 0);
create index appointment_bookings_promo_code_idx on public.appointment_bookings(promo_code) where promo_code is not null;
insert into public.booking_promo_codes(code,label,discount_eur,starts_on,ends_on,max_uses) values
('BIENVENIDA10','Web',10,(now() at time zone 'Europe/Madrid')::date,(now() at time zone 'Europe/Madrid')::date+29,20),
('INSTAGRAM10','Instagram',10,(now() at time zone 'Europe/Madrid')::date,(now() at time zone 'Europe/Madrid')::date+29,20),
('ARENYS10','Carteles del despacho',10,(now() at time zone 'Europe/Madrid')::date,(now() at time zone 'Europe/Madrid')::date+29,20),
('FARMACIA10','Difusión local',10,(now() at time zone 'Europe/Madrid')::date,(now() at time zone 'Europe/Madrid')::date+29,20);
-- Anonymous quote intentionally receives no patient identity and cannot disclose history.
create function public.quote_booking_promo(p_code text,p_service_code text,p_patient_type text)
returns numeric language sql stable security definer set search_path to '' as $quote$
  select c.discount_eur from public.booking_promo_codes c
  where p_service_code='psicologia_general_sanitaria' and p_patient_type='new'
  and c.code=upper(btrim(p_code)) and c.enabled
  and (now() at time zone 'Europe/Madrid')::date between c.starts_on and c.ends_on
  and (c.max_uses is null or (select count(*) from public.appointment_bookings b
    where b.promo_code=c.code and b.status not in ('cancelled','canceled')) < c.max_uses)
$quote$;
revoke all on function public.quote_booking_promo(text,text,text) from public,anon,authenticated;
grant execute on function public.quote_booking_promo(text,text,text) to anon,authenticated;
CREATE OR REPLACE FUNCTION public.create_public_booking_quick(p_starts_at timestamp with time zone, p_duration_minutes integer, p_patient_name text, p_patient_email text, p_patient_phone text, p_patient_type text, p_service_code text, p_promo_code text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_booking_id uuid;
  v_promo_code text := nullif(upper(btrim(p_promo_code)), '');
  v_discount numeric := 0;
  v_privacy_version text;
  v_cancellation_version text;
begin
  if p_patient_type is null or p_patient_type not in ('new','existing') then
    raise exception 'Tipo de paciente no válido';
  end if;
  if p_service_code is null or p_service_code not in ('psicologia_general_sanitaria','neuropsicologia') then
    raise exception 'Tipo de atención no válido';
  end if;
  if p_duration_minutes is distinct from 60 then
    raise exception 'Duración no válida';
  end if;
  if p_starts_at is null or p_starts_at < now() + interval '24 hours'
    or p_starts_at > now() + interval '30 days' then
    raise exception 'La cita solicitada está fuera del periodo de reserva';
  end if;
  if nullif(btrim(p_patient_name),'') is null or length(btrim(p_patient_name)) > 120 then
    raise exception 'Indica un nombre válido';
  end if;
  if nullif(btrim(p_patient_email),'') is null or length(btrim(p_patient_email)) > 254
    or btrim(p_patient_email) !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Indica un correo válido';
  end if;
  if nullif(btrim(p_patient_phone),'') is null or length(btrim(p_patient_phone)) > 30 then
    raise exception 'Indica un teléfono válido';
  end if;

  perform pg_advisory_xact_lock(81726354);
  if v_promo_code is not null then
    -- Same transaction lock as the slot reservation prevents concurrent over-redemption.
    perform 1 from public.booking_promo_codes where code = v_promo_code for share;
    v_discount := public.quote_booking_promo(v_promo_code,p_service_code,p_patient_type);
    if v_discount is null then raise exception 'Código no disponible. Retíralo o prueba otro.'; end if;
  end if;
  if not exists (
    select 1 from public.get_available_appointment_starts(60,30) as available
    where available.starts_at = p_starts_at
  ) then
    raise exception 'Ese horario ya no está disponible';
  end if;

  select privacy_version, cancellation_version into v_privacy_version, v_cancellation_version
  from public.policy_versions where id = true;

  insert into public.appointment_bookings (
    patient_name,patient_email,patient_phone,patient_type,status,
    starts_at,ends_at,duration_minutes,price_eur,service_code,promo_code,promo_discount_eur,
    privacy_accepted,cancellation_accepted,informed_consent_accepted,
    consent_deferred,signer_name,privacy_version,consent_version,cancellation_version,accepted_at,
    confirmation_token,needs_patient_confirmation
  ) values (
    btrim(p_patient_name),lower(btrim(p_patient_email)),btrim(p_patient_phone),
    p_patient_type,'pending',
    p_starts_at,p_starts_at + interval '60 minutes',60,
    (case when p_service_code = 'neuropsicologia' then 75.00 else 60.00 end)-v_discount,p_service_code,v_promo_code,v_discount,
    false,true,false,
    p_patient_type = 'new',null,v_privacy_version,null,v_cancellation_version,now(),
    encode(extensions.gen_random_bytes(24),'hex'),true
  ) returning id into v_booking_id;

  return v_booking_id;
end
$function$

revoke all on function public.create_public_booking_quick(timestamptz,integer,text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.create_public_booking_quick(timestamptz,integer,text,text,text,text,text,text) to anon,authenticated;
commit;
