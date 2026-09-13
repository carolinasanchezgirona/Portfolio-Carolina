create table if not exists public.appointment_schedule_blocks (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint appointment_schedule_blocks_valid_range check (ends_at > starts_at),
  constraint appointment_schedule_blocks_reason_length check (reason is null or char_length(reason) <= 120)
);

alter table public.appointment_schedule_blocks enable row level security;
revoke all on table public.appointment_schedule_blocks from anon;
grant select, insert, delete on table public.appointment_schedule_blocks to authenticated;

drop policy if exists professional_select_schedule_blocks on public.appointment_schedule_blocks;
create policy professional_select_schedule_blocks
on public.appointment_schedule_blocks for select
to authenticated
using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);

drop policy if exists professional_insert_schedule_blocks on public.appointment_schedule_blocks;
create policy professional_insert_schedule_blocks
on public.appointment_schedule_blocks for insert
to authenticated
with check ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);

drop policy if exists professional_delete_schedule_blocks on public.appointment_schedule_blocks;
create policy professional_delete_schedule_blocks
on public.appointment_schedule_blocks for delete
to authenticated
using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);

create index if not exists appointment_schedule_blocks_starts_at_idx
on public.appointment_schedule_blocks (starts_at);

create or replace function public.get_available_appointment_starts(p_duration_minutes integer, p_days integer default 30)
returns table(starts_at timestamptz, ends_at timestamptz)
language sql
stable security definer
set search_path = public, pg_temp
as $function$
  with params as (
    select case when p_duration_minutes = 60 then 60 else null end as duration_minutes,
      least(greatest(coalesce(p_days, 30), 1), 60) as days_to_show
  ),
  local_days as (
    select d::date as local_date
    from params p
    cross join generate_series(
      (now() at time zone 'Europe/Madrid')::date,
      (now() at time zone 'Europe/Madrid')::date + (p.days_to_show - 1),
      interval '1 day'
    ) d
    where p.duration_minutes is not null
      and not exists (select 1 from public.appointment_date_exceptions e where e.exception_date = d::date)
  ),
  candidates as (
    select (g.local_start at time zone 'Europe/Madrid') as candidate_start,
      ((g.local_start + interval '60 minutes') at time zone 'Europe/Madrid') as candidate_end
    from local_days d
    join public.appointment_availability_rules r
      on r.iso_weekday = extract(isodow from d.local_date)::smallint and r.enabled
    cross join lateral generate_series(
      d.local_date + r.starts_at,
      d.local_date + r.ends_at - interval '60 minutes',
      interval '60 minutes'
    ) g(local_start)
  )
  select c.candidate_start, c.candidate_end
  from candidates c
  where c.candidate_start >= now() + interval '24 hours'
    and not exists (
      select 1 from public.appointment_bookings b
      where b.status in ('confirmed', 'pending') and b.starts_at is not null
        and tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(c.candidate_start, c.candidate_end, '[)')
    )
    and not exists (
      select 1 from public.appointment_schedule_blocks s
      where tstzrange(s.starts_at, s.ends_at, '[)') && tstzrange(c.candidate_start, c.candidate_end, '[)')
    )
  order by c.candidate_start;
$function$;

create or replace function public.get_professional_appointment_starts(p_days integer default 30)
returns table(starts_at timestamptz, ends_at timestamptz)
language sql
stable security definer
set search_path = public, pg_temp
as $function$
  with params as (
    select least(greatest(coalesce(p_days, 30), 1), 60) as days_to_show
  ),
  local_days as (
    select d::date as local_date
    from params p
    cross join generate_series(
      (now() at time zone 'Europe/Madrid')::date,
      (now() at time zone 'Europe/Madrid')::date + (p.days_to_show - 1),
      interval '1 day'
    ) d
    where not exists (select 1 from public.appointment_date_exceptions e where e.exception_date = d::date)
  ),
  candidates as (
    select (g.local_start at time zone 'Europe/Madrid') as candidate_start,
      ((g.local_start + interval '60 minutes') at time zone 'Europe/Madrid') as candidate_end
    from local_days d
    join public.appointment_availability_rules r
      on r.iso_weekday = extract(isodow from d.local_date)::smallint and r.enabled
    cross join lateral generate_series(
      d.local_date + r.starts_at,
      d.local_date + r.ends_at - interval '60 minutes',
      interval '60 minutes'
    ) g(local_start)
  )
  select c.candidate_start, c.candidate_end
  from candidates c
  where c.candidate_start >= now()
    and not exists (
      select 1 from public.appointment_bookings b
      where b.status in ('confirmed', 'pending') and b.starts_at is not null
        and tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(c.candidate_start, c.candidate_end, '[)')
    )
    and not exists (
      select 1 from public.appointment_schedule_blocks s
      where tstzrange(s.starts_at, s.ends_at, '[)') && tstzrange(c.candidate_start, c.candidate_end, '[)')
    )
  order by c.candidate_start;
$function$;
