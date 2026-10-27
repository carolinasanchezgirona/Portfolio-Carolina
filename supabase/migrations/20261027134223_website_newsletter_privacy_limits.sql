-- Opaque, short-lived anti-abuse counters. No email address, IP, or clinical data.
create table public.website_newsletter_limits (
  key_hash text primary key check (key_hash ~ '^[a-f0-9]{64}$'),
  attempts integer not null default 1 check (attempts > 0),
  expires_at timestamptz not null
);
alter table public.website_newsletter_limits enable row level security;
revoke all on public.website_newsletter_limits from public, anon, authenticated;
grant select, insert, update, delete on public.website_newsletter_limits to service_role;
create index website_newsletter_limits_expiry on public.website_newsletter_limits(expires_at);

create function public.consume_website_newsletter_limit(p_key_hash text, p_max integer, p_window_seconds integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare n integer;
begin
  if p_key_hash !~ '^[a-f0-9]{64}$' or p_max < 1 or p_max > 20 or p_window_seconds < 60 or p_window_seconds > 3600 then
    raise exception 'Invalid limit parameters';
  end if;
  delete from public.website_newsletter_limits where expires_at <= now();
  insert into public.website_newsletter_limits as limits (key_hash, attempts, expires_at)
    values (p_key_hash, 1, now() + make_interval(secs => p_window_seconds))
    on conflict (key_hash) do update set attempts = limits.attempts + 1
    returning attempts into n;
  return n <= p_max;
end;
$$;
revoke all on function public.consume_website_newsletter_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_website_newsletter_limit(text, integer, integer) to service_role;

-- Delete expired counters even when nobody submits a form.
select cron.schedule('website-newsletter-limit-cleanup', '* * * * *',
  $$delete from public.website_newsletter_limits where expires_at <= now()$$);
