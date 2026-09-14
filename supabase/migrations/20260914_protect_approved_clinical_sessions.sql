create or replace function public.protect_approved_clinical_session()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if old.status = 'approved' then
    raise exception 'Los registros clínicos aprobados no pueden sobrescribirse';
  end if;
  return new;
end;
$$;

revoke execute on function public.protect_approved_clinical_session() from public, anon, authenticated;

create trigger protect_approved_clinical_session_trigger
before update or delete on public.clinical_sessions
for each row execute function public.protect_approved_clinical_session();