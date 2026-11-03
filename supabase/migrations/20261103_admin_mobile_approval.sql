
-- Verificación de acceso con móvil. Sin dispositivos registrados, el acceso actual permanece intacto.
create schema if not exists admin_mfa_private;
revoke all on schema admin_mfa_private from public, anon, authenticated;

create table if not exists admin_mfa_private.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  public_key jsonb not null,
  push_subscription jsonb,
  device_label text not null default 'Mi móvil',
  added_at timestamptz not null default now(),
  revoked_at timestamptz
);
create index if not exists admin_mfa_devices_active_idx on admin_mfa_private.devices(user_id) where revoked_at is null;

create table if not exists admin_mfa_private.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null,
  client_label text not null default 'Nuevo inicio de sesión',
  status text not null default 'pending' check (status in ('pending','approved','denied')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '3 minutes'),
  decided_at timestamptz,
  decided_by uuid references admin_mfa_private.devices(id)
);
create index if not exists admin_mfa_requests_session_idx on admin_mfa_private.requests(user_id,session_id,created_at desc);
create index if not exists admin_mfa_requests_pending_idx on admin_mfa_private.requests(user_id,status,expires_at);

create table if not exists admin_mfa_private.approved_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null,
  approved_at timestamptz not null default now(),
  expires_at timestamptz not null,
  primary key (user_id,session_id)
);
create table if not exists admin_mfa_private.push_config (
  id boolean primary key default true check (id),
  vapid_public text not null,
  vapid_private text not null,
  subject text not null
);

-- Función usada por RLS. El JWT es verificado por el servicio Auth de Supabase.
create or replace function public.admin_mobile_gate()
returns boolean language plpgsql stable security definer set search_path = ''
as $$
declare uid uuid := auth.uid(); sid uuid; paired boolean;
begin
  if uid is null then return true; end if;
  select exists (select 1 from admin_mfa_private.devices d where d.user_id = uid and d.revoked_at is null) into paired;
  if not paired then return true; end if; -- Activación únicamente tras emparejar el móvil
  begin
    sid := nullif(auth.jwt()->>'session_id','')::uuid;
  exception when invalid_text_representation then return false;
  end;
  if sid is null then return false; end if;
  return exists (
    select 1 from admin_mfa_private.approved_sessions s
    where s.user_id = uid and s.session_id = sid and s.expires_at > now()
  );
end $$;
revoke all on function public.admin_mobile_gate() from public, anon;
grant execute on function public.admin_mobile_gate() to authenticated, service_role;

-- Único punto de acceso interno a los datos MFA. No lo ejecuta el navegador;
-- únicamente la Edge Function con credenciales de servicio y verificaciones criptográficas.
create or replace function public.admin_mobile_backend(action text, args jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare uid uuid; sid uuid; did uuid; rid uuid; old_request admin_mfa_private.requests%rowtype;
  already boolean; item jsonb; rec jsonb; status_value text; decision text; push_data jsonb;
begin
  if action = 'config' then
    select jsonb_build_object('public',c.vapid_public,'private',c.vapid_private,'subject',c.subject)
      into rec from admin_mfa_private.push_config c where c.id = true;
    return coalesce(rec,'{}'::jsonb);
  end if;
  if action = 'device' then
    did := (args->>'device_id')::uuid;
    select jsonb_build_object('user_id',d.user_id,'public_key',d.public_key)
      into rec from admin_mfa_private.devices d where d.id = did and d.revoked_at is null;
    return coalesce(rec,'{}'::jsonb);
  end if;
  if action in ('enroll','status','request') then
    uid := (args->>'user_id')::uuid;
    sid := (args->>'session_id')::uuid;
    if uid is null or sid is null then raise exception 'Missing verified identity'; end if;
  end if;

  if action = 'enroll' then
    -- Nunca permitir añadir otro teléfono solo con la contraseña.
    did := (args->>'device_id')::uuid;
    if did is null then raise exception 'Missing device id'; end if;
    if exists(select 1 from admin_mfa_private.devices d where d.id=did and d.user_id=uid and d.revoked_at is null) then
      return jsonb_build_object('device_id',did,'paired',true);
    end if;
    select exists(select 1 from admin_mfa_private.devices d where d.user_id=uid and d.revoked_at is null) into already;
    if already and not exists(
      select 1 from admin_mfa_private.approved_sessions s where s.user_id=uid and s.session_id=sid and s.expires_at>now()
    ) then raise exception 'First approve access using an existing phone'; end if;
    if not (args ? 'public_key') then raise exception 'Missing device public key'; end if;
    push_data := args->'push_subscription';
    insert into admin_mfa_private.devices (id,user_id,public_key,push_subscription,device_label)
      values(did,uid,args->'public_key',push_data,left(coalesce(args->>'label','Mi móvil'),50));
    insert into admin_mfa_private.approved_sessions(user_id,session_id,expires_at)
      values(uid,sid,now()+interval '12 hours')
      on conflict(user_id,session_id) do update set approved_at=now(),expires_at=excluded.expires_at;
    return jsonb_build_object('device_id',did,'paired',true);
  end if;

  if action = 'status' then
    select exists(select 1 from admin_mfa_private.devices d where d.user_id=uid and d.revoked_at is null) into already;
    -- State must be rechecked on the database for each request.
    select jsonb_build_object(
      'paired',already,
      'approved',exists(select 1 from admin_mfa_private.approved_sessions s where s.user_id=uid and s.session_id=sid and s.expires_at>now()),
      'denied',exists(select 1 from admin_mfa_private.requests r where r.user_id=uid and r.session_id=sid and r.status='denied' and r.created_at>now()-interval '10 minutes'),
      'pending',exists(select 1 from admin_mfa_private.requests r where r.user_id=uid and r.session_id=sid and r.status='pending' and r.expires_at>now())
    ) into rec;
    return rec;
  end if;

  if action = 'request' then
    select exists(select 1 from admin_mfa_private.devices d where d.user_id=uid and d.revoked_at is null) into already;
    if not already then return jsonb_build_object('paired',false); end if;
    if exists(select 1 from admin_mfa_private.approved_sessions s where s.user_id=uid and s.session_id=sid and s.expires_at>now())
      then return jsonb_build_object('approved',true); end if;
    select * into old_request from admin_mfa_private.requests r where r.user_id=uid and r.session_id=sid
      and r.status='pending' and r.expires_at>now() order by r.created_at desc limit 1;
    if found then return jsonb_build_object('request_id',old_request.id,'new',false); end if;
    if (select count(*) from admin_mfa_private.requests r where r.user_id=uid and r.created_at>now()-interval '1 hour') >= 8
      then raise exception 'Too many approval requests. Try again later'; end if;
    insert into admin_mfa_private.requests(user_id,session_id,client_label)
      values(uid,sid,left(coalesce(args->>'client_label','Inicio en navegador'),90))
      returning id into rid;
    return jsonb_build_object('request_id',rid,'new',true);
  end if;

  if action in ('pending','approve','pushes','update_push','revoke') then
    did := (args->>'device_id')::uuid;
    select d.user_id into uid from admin_mfa_private.devices d where d.id=did and d.revoked_at is null;
    if not found then raise exception 'Unknown registered phone'; end if;
  end if;
  if action = 'pending' then
    select coalesce(jsonb_agg(jsonb_build_object('id',q.id,'label',q.client_label,'created_at',q.created_at,'expires_at',q.expires_at) order by q.created_at desc),'[]'::jsonb)
      into rec from (select * from admin_mfa_private.requests r where r.user_id=uid and r.status='pending' and r.expires_at>now() order by r.created_at desc limit 5) q;
    return rec;
  end if;
  if action = 'approve' then
    rid := (args->>'request_id')::uuid;
    decision := args->>'decision';
    if decision not in ('approved','denied') then raise exception 'Invalid decision'; end if;
    update admin_mfa_private.requests r set status=decision,decided_at=now(),decided_by=did
      where r.id=rid and r.user_id=uid and r.status='pending' and r.expires_at>now()
      returning r.* into old_request;
    if not found then raise exception 'Request expired or already handled'; end if;
    if decision = 'approved' then
      insert into admin_mfa_private.approved_sessions(user_id,session_id,expires_at)
        values(uid,old_request.session_id,now()+interval '12 hours')
        on conflict(user_id,session_id) do update set approved_at=now(),expires_at=excluded.expires_at;
    end if;
    return jsonb_build_object('ok',true,'decision',decision);
  end if;
  if action = 'notify' then
    uid := (args->>'user_id')::uuid;
    select coalesce(jsonb_agg(jsonb_build_object('device_id',d.id,'subscription',d.push_subscription)),'[]'::jsonb)
      into rec from admin_mfa_private.devices d
      where d.user_id=uid and d.revoked_at is null and d.push_subscription is not null;
    return rec;
  end if;
  if action = 'pushes' then
    select coalesce(jsonb_agg(jsonb_build_object('device_id',d.id,'subscription',d.push_subscription)),'[]'::jsonb) into rec
      from admin_mfa_private.devices d where d.user_id=uid and d.revoked_at is null and d.push_subscription is not null;
    return rec;
  end if;
  if action = 'update_push' then
    update admin_mfa_private.devices d set push_subscription=args->'push_subscription' where d.id=did;
    return jsonb_build_object('ok',true);
  end if;
  if action = 'revoke' then
    update admin_mfa_private.devices d set revoked_at=now(),push_subscription=null where d.id=did;
    delete from admin_mfa_private.approved_sessions s where s.user_id=uid;
    return jsonb_build_object('ok',true);
  end if;
  raise exception 'Unknown MFA action';
end $$;
revoke all on function public.admin_mobile_backend(text,jsonb) from public, anon, authenticated;
grant execute on function public.admin_mobile_backend(text,jsonb) to service_role;

-- Solo afecta a sesiones administrativas de usuarios que hayan vinculado un móvil.
-- La política RESTRICTIVE no se puede eludir con otra política permisiva.
do $$
declare target record;
begin
  for target in
    select n.nspname as schema_name,c.relname as table_name
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where c.relkind='r' and c.relrowsecurity
      and (n.nspname='public' or (n.nspname='storage' and c.relname='objects'))
  loop
    execute format('drop policy if exists admin_mobile_mfa_gate on %I.%I',target.schema_name,target.table_name);
    execute format('create policy admin_mobile_mfa_gate on %I.%I as restrictive for all to authenticated using ((select public.admin_mobile_gate())) with check ((select public.admin_mobile_gate()))',
        target.schema_name,target.table_name);
  end loop;
end $$;
