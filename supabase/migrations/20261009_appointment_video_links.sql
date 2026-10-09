create table public.appointment_video_links (
  appointment_id uuid primary key references public.appointment_bookings(id) on delete cascade,
  meet_url text not null unique check (meet_url ~ '^https://meet[.]google[.]com/[a-z]{3}-[a-z]{4}-[a-z]{3}$'),
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.appointment_video_links enable row level security;
revoke all on public.appointment_video_links from public, anon, authenticated;
grant select, insert, update, delete on public.appointment_video_links to service_role;
comment on table public.appointment_video_links is 'Per-appointment Meet access. Only Worker service role; patient access is scoped by verified portal session.';
