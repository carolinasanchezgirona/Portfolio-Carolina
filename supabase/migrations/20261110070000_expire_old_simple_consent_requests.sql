-- Evita que una invitación caducada bloquee para siempre nuevos consentimientos.
-- Nunca toca una aceptación "recording" pendiente de archivo, ni una ya archivada.
-- Requiere permiso del backend; la tabla permanece privada y con RLS activo.
create or replace function public.expire_clinical_simple_consents_on_insert()
returns trigger language plpgsql security invoker set search_path = ''
as $$
begin
 update public.clinical_simple_consents
 set status='expired', updated_at=now()
 where patient_id=new.patient_id and kind=new.kind
   and (
     (status in ('pending','email_accepted','email_unknown') and expires_at <= now())
     or (status='preparing' and created_at < now() - interval '24 hours')
   );
 return new;
end;
$$;
revoke all on function public.expire_clinical_simple_consents_on_insert() from public,anon,authenticated;
drop trigger if exists expire_clinical_simple_consents_on_insert
 on public.clinical_simple_consents;
create trigger expire_clinical_simple_consents_on_insert
 before insert on public.clinical_simple_consents
 for each row execute function public.expire_clinical_simple_consents_on_insert();
