-- A booking is the redemption record. Cancelled bookings remain auditable but release eligibility.
-- No-show and completed redemptions remain counted. All campaigns share the same identity limit.
create function public.booking_promo_phone_key(value text)
returns text language sql immutable strict set search_path to '' as $$
  select nullif(case when d ~ '^0034[0-9]{9}$' then substring(d from 5)
    when d ~ '^34[0-9]{9}$' then substring(d from 3)
    else d end,'')
  from (select regexp_replace(value,'[^0-9]','','g') as d) s
$$;
revoke all on function public.booking_promo_phone_key(text) from public,anon,authenticated;
grant execute on function public.booking_promo_phone_key(text) to authenticated,service_role;
create unique index booking_promo_once_email_idx
on public.appointment_bookings ((nullif(lower(btrim(patient_email)),'')))
where promo_code is not null and status not in ('cancelled','canceled');
create unique index booking_promo_once_phone_idx
on public.appointment_bookings ((public.booking_promo_phone_key(patient_phone)))
where promo_code is not null and status not in ('cancelled','canceled');
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
    if v_discount is null or exists (
      select 1 from public.appointment_bookings b
      where b.status not in ('cancelled','canceled')
      and (lower(btrim(b.patient_email)) = lower(btrim(p_patient_email))
        or (public.booking_promo_phone_key(p_patient_phone) is not null
          and public.booking_promo_phone_key(b.patient_phone) = public.booking_promo_phone_key(p_patient_phone)))
    ) then raise exception 'Código no disponible para esta reserva. Retíralo o contacta con la consulta.'; end if;
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
exception when unique_violation then
  if v_promo_code is not null then
    raise exception 'Código no disponible para esta reserva. Retíralo o contacta con la consulta.';
  end if;
  raise;
end
$function$;
revoke all on function public.create_public_booking_quick(timestamptz,integer,text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.create_public_booking_quick(timestamptz,integer,text,text,text,text,text,text) to anon,authenticated;
insert into public.booking_promo_codes(code,label,discount_eur,enabled,starts_on,ends_on,max_uses)
values ('REFERIDOS10','Recomendación personal',10,false,(now() at time zone 'Europe/Madrid')::date,(now() at time zone 'Europe/Madrid')::date+29,20)
on conflict (code) do nothing;
