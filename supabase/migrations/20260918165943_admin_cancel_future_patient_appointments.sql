create or replace function public.admin_cancel_future_patient_appointments(
  p_id uuid,
  p_include_selected boolean default false
)
returns integer
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_current public.appointment_bookings%rowtype;
  v_email text;
  v_phone text;
  v_count integer := 0;
begin
  if (select auth.uid()) is distinct from '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid then
    raise exception 'Acceso no autorizado' using errcode = '42501';
  end if;

  select *
    into v_current
  from public.appointment_bookings
  where id = p_id;

  if not found then
    raise exception 'Cita no encontrada';
  end if;

  if v_current.starts_at is null then
    raise exception 'La cita no tiene fecha';
  end if;

  v_email := nullif(lower(btrim(coalesce(v_current.patient_email, ''))), '');
  v_phone := nullif(regexp_replace(coalesce(v_current.patient_phone, ''), '\D', '', 'g'), '');

  update public.appointment_bookings as b
  set status = 'cancelled'
  where b.status in ('pending', 'confirmed')
    and b.starts_at is not null
    and (
      (p_include_selected and b.starts_at >= v_current.starts_at)
      or
      (not p_include_selected and b.starts_at > v_current.starts_at)
    )
    and (
      (
        v_current.clinical_patient_id is not null
        and b.clinical_patient_id = v_current.clinical_patient_id
      )
      or
      (
        v_current.clinical_patient_id is null
        and lower(btrim(b.patient_name)) = lower(btrim(v_current.patient_name))
        and (
          (v_email is not null and lower(btrim(coalesce(b.patient_email, ''))) = v_email)
          or
          (v_phone is not null and regexp_replace(coalesce(b.patient_phone, ''), '\D', '', 'g') = v_phone)
          or
          (v_email is null and v_phone is null)
        )
      )
    );

  get diagnostics v_count = row_count;
  return v_count;
end;
$function$;

revoke all on function public.admin_cancel_future_patient_appointments(uuid, boolean) from public;
revoke all on function public.admin_cancel_future_patient_appointments(uuid, boolean) from anon;
grant execute on function public.admin_cancel_future_patient_appointments(uuid, boolean) to authenticated;
