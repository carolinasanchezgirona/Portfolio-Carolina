-- Structured longitudinal clinical profile for Dememoria patient records.
-- The column remains protected by the existing clinical_patients RLS policy.

alter table public.clinical_patients
  add column if not exists clinical_profile jsonb not null default '{}'::jsonb;

comment on column public.clinical_patients.clinical_profile is
  'Structured clinical history: background, assessment, diagnosis, formulation, treatment, safety and coordination.';
