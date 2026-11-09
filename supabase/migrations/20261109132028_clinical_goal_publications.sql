-- Patient-facing goal copies are stored separately from confidential clinical goals.
-- IMPORTANT: deploy this migration before releasing the corresponding Worker/UI.
-- There are no patient-visible rows until the clinician publishes one explicitly.
alter table public.clinical_goals
  add constraint clinical_goals_id_patient_unique unique (id, patient_id);

create table if not exists public.clinical_goal_publications (
  goal_id uuid primary key,
  patient_id uuid not null,
  display_title text not null
    check (char_length(trim(display_title)) between 1 and 220),
  description text not null default ''
    check (char_length(description) <= 2000),
  published_at timestamptz not null default now(),
  revoked_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint clinical_goal_publications_goal_patient_fkey
    foreign key (goal_id, patient_id)
    references public.clinical_goals (id, patient_id)
    on delete cascade
);

create index if not exists clinical_goal_publications_patient_visible_idx
  on public.clinical_goal_publications(patient_id, published_at desc)
  where revoked_at is null;

alter table public.clinical_goal_publications enable row level security;
revoke all on public.clinical_goal_publications from public, anon, authenticated;
grant select, insert, update on public.clinical_goal_publications to authenticated;

create policy "clinical_goal_publications_owner_all"
  on public.clinical_goal_publications
  for all to authenticated
  using ((select public.is_clinical_owner()))
  with check ((select public.is_clinical_owner()));

comment on table public.clinical_goal_publications is
  'Explicitly approved patient-visible goal texts; never expose via anon/authenticated patient access. Portal reads exclusively through validated server session.';
