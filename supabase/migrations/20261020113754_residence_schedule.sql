create table public.residence_schedule_types (
 id uuid primary key default gen_random_uuid(),
 label text not null check(char_length(trim(label)) between 1 and 100),
 color text not null unique check(color ~ '^#[0-9a-f]{6}$'),
 revision integer not null default 1 check(revision>0)
);
create unique index residence_schedule_types_label on public.residence_schedule_types(lower(label));
insert into public.residence_schedule_types(label,color) values
 ('Ejercicios','#087f8c'),('Valoraciones','#2855a2'),('Entrevistas','#cc6759'),
 ('PIAI','#8056a4'),('Coordinación','#a77816'),('Gestión','#536775');
create table public.residence_schedule (
 id uuid primary key default gen_random_uuid(),
 event_date date not null check(extract(isodow from event_date) between 1 and 6),
 start_min integer not null check(start_min>=540 and start_min<1140 and start_min%30=0),
 end_min integer not null check(end_min<=1140 and end_min>540 and end_min%30=0),
 category_id uuid not null references public.residence_schedule_types(id),
 title text not null check(char_length(trim(title)) between 1 and 220),
 center text not null check(char_length(trim(center)) between 1 and 200),
 resident_id uuid references public.residence_records(id) on delete set null,
 location text not null default '' check(char_length(location)<=200),
 notes text not null default '' check(char_length(notes)<=10000),
 status text not null default 'planned' check(status in ('planned','done','cancelled')),
 revision integer not null default 1 check(revision>0),
 slot tsrange generated always as (tsrange(event_date + start_min * interval '1 minute',event_date + end_min * interval '1 minute','[)')) stored,
 check(end_min>start_min),
 exclude using gist(slot with &&) where (status <> 'cancelled')
);
create index residence_schedule_date on public.residence_schedule(event_date);
create index residence_schedule_resident on public.residence_schedule(resident_id);
create index residence_schedule_category on public.residence_schedule(category_id);
alter table public.residence_schedule_types enable row level security;
alter table public.residence_schedule enable row level security;
revoke all on public.residence_schedule_types,public.residence_schedule from public,anon,authenticated;
grant select,insert,update on public.residence_schedule_types,public.residence_schedule to authenticated;
grant all on public.residence_schedule_types,public.residence_schedule to service_role;
create policy residence_schedule_types_admin on public.residence_schedule_types for all to authenticated
 using ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
 with check ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy residence_schedule_admin on public.residence_schedule for all to authenticated
 using ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
 with check ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
comment on table public.residence_schedule is 'Personal residence-only schedule, Europe/Madrid civil dates and half-hour slots. Separate from private appointment bookings.';

