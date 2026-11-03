-- Prevent old privileged RPC functions from bypassing mobile approval.
-- Existing browser sessions still work until the owner has paired a phone.
create or replace function public.is_clinical_owner()
returns boolean language sql stable security definer set search_path to ''
as $$
  select (select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
    and (select public.admin_mobile_gate());
$$;

do $$
declare entry record; definition text; marker text := E'\nbegin\n'; at_pos int;
begin
  for entry in
    select p.oid,p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname in (
      'admin_cancel_future_patient_appointments',
      'admin_create_appointment',
      'admin_create_appointment_series',
      'admin_update_appointment',
      'admin_update_appointment_series_scope',
      'billing_issue_invoice'
    ) and p.prosecdef
  loop
    definition := pg_get_functiondef(entry.oid);
    if position('public.admin_mobile_gate()' in definition)>0 then continue; end if;
    at_pos := strpos(definition,marker);
    if at_pos=0 then
      raise exception 'Cannot safely locate function body for %',entry.proname;
    end if;
    definition := substr(definition,1,at_pos+length(marker)-1)
      || E'  if not (select public.admin_mobile_gate()) then\n'
      || E'    raise exception ''Confirma el acceso desde tu Authenticator.'' using errcode = ''42501'';\n'
      || E'  end if;\n'
      || substr(definition,at_pos+length(marker));
    execute definition;
  end loop;
end $$;
