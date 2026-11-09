-- Revisión clínica estructurada, exclusivamente profesional.
-- No cambia el estado del paciente ni comparte contenidos con Entre Sesiones.
create table if not exists public.clinical_process_reviews (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.clinical_patients(id) on delete restrict,
  review_date date not null default current_date,
  review_kind text not null default 'periodic'
    check (review_kind in ('periodic','transition','closing')),
  goal_review text not null default '' check (char_length(goal_review) <= 4000),
  symptom_change text not null default '' check (char_length(symptom_change) <= 4000),
  functional_change text not null default '' check (char_length(functional_change) <= 4000),
  patient_perspective text not null default '' check (char_length(patient_perspective) <= 4000),
  measurement_interpretation text not null default '' check (char_length(measurement_interpretation) <= 4000),
  strategies_worked text not null default '' check (char_length(strategies_worked) <= 4000),
  clinical_assessment text not null default '' check (char_length(clinical_assessment) <= 4000),
  next_steps text not null default '' check (char_length(next_steps) <= 4000),
  maintenance_plan text not null default '' check (char_length(maintenance_plan) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clinical_process_reviews_patient_date_idx
  on public.clinical_process_reviews(patient_id,review_date desc,created_at desc);
alter table public.clinical_process_reviews enable row level security;
revoke all on table public.clinical_process_reviews from public, anon, authenticated;
grant select,insert,update on table public.clinical_process_reviews to authenticated;
create policy "clinical_process_reviews_owner_all"
  on public.clinical_process_reviews
  for all to authenticated
  using ((select public.is_clinical_owner()))
  with check ((select public.is_clinical_owner()));
comment on table public.clinical_process_reviews is
  'Revisiones clínicas privadas; el paciente no puede acceder a esta tabla. Cualquier documento externo se redacta y aprueba por separado en clinical_reports.';