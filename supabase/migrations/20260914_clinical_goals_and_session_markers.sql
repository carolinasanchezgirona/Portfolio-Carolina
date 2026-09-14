create table if not exists public.clinical_goals (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.clinical_patients(id) on delete restrict,
  title text not null check (char_length(trim(title)) between 1 and 240),
  status text not null default 'active' check (status in ('active','review','paused','achieved','closed')),
  priority text not null default 'current' check (priority in ('current','secondary','observation')),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clinical_goals enable row level security;
create policy "clinical_goals_owner_all" on public.clinical_goals
for all to authenticated using (public.is_clinical_owner()) with check (public.is_clinical_owner());
grant select, insert, update on public.clinical_goals to authenticated;

alter table public.clinical_sessions
  add column if not exists process_markers text[] not null default '{}',
  add column if not exists intervention_markers text[] not null default '{}',
  add column if not exists evolution_markers jsonb not null default '{}'::jsonb,
  add column if not exists worked_goal_ids uuid[] not null default '{}';