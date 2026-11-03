-- Recovery codes keep the administrator from being locked out after phone loss.
-- Only the privileged Edge Function can create/redeem codes after validating password.
create table if not exists admin_mfa_private.recovery_codes(
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  code_hash text not null,
  created_at timestamptz not null default now(),
  used_at timestamptz,
  unique(user_id,code_hash)
);
create or replace function public.admin_mobile_recovery(action text, args jsonb)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare uid uuid := (args->>'user_id')::uuid;
  sid uuid := (args->>'session_id')::uuid;
  hash_value text;
  matched bigint;
begin
  if uid is null or sid is null then raise exception 'Missing verified identity'; end if;
  if action='setup' then
    if not exists(select 1 from admin_mfa_private.approved_sessions s
                  where s.user_id=uid and s.session_id=sid and s.expires_at>now())
       then raise exception 'A verified phone session is required'; end if;
    if jsonb_typeof(args->'hashes') <> 'array' or jsonb_array_length(args->'hashes') <> 8
      then raise exception 'Eight secure recovery codes are required'; end if;
    delete from admin_mfa_private.recovery_codes where user_id=uid;
    for hash_value in select jsonb_array_elements_text(args->'hashes') loop
      if hash_value !~ '^[a-f0-9]{64}$' then raise exception 'Invalid recovery code hash'; end if;
      insert into admin_mfa_private.recovery_codes(user_id,code_hash) values(uid,hash_value);
    end loop;
    return jsonb_build_object('ok',true);
  end if;
  if action='redeem' then
    if not exists(select 1 from admin_mfa_private.devices d where d.user_id=uid and d.revoked_at is null)
       then raise exception 'No mobile device is enrolled'; end if;
    hash_value := args->>'hash';
    if hash_value !~ '^[a-f0-9]{64}$' then return jsonb_build_object('ok',false); end if;
    update admin_mfa_private.recovery_codes c set used_at=now()
    where c.id=(select id from admin_mfa_private.recovery_codes
                where user_id=uid and code_hash=hash_value and used_at is null limit 1
                for update skip locked)
    returning id into matched;
    if matched is null then return jsonb_build_object('ok',false); end if;
    insert into admin_mfa_private.approved_sessions(user_id,session_id,expires_at)
      values(uid,sid,now()+interval '1 hour')
      on conflict(user_id,session_id) do update set approved_at=now(),expires_at=excluded.expires_at;
    return jsonb_build_object('ok',true);
  end if;
  raise exception 'Invalid recovery action';
end $$;
revoke all on function public.admin_mobile_recovery(text,jsonb) from public,anon,authenticated;
grant execute on function public.admin_mobile_recovery(text,jsonb) to service_role;
