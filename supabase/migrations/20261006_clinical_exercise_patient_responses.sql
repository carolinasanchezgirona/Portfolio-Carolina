alter table public.clinical_exercise_assignments
  add column if not exists patient_response jsonb not null default '{}'::jsonb,
  add column if not exists patient_response_status text not null default 'empty',
  add column if not exists patient_response_updated_at timestamptz,
  add column if not exists patient_response_shared_at timestamptz;

alter table public.clinical_exercise_assignments
  drop constraint if exists clinical_exercise_assignments_patient_response_status_check;

alter table public.clinical_exercise_assignments
  add constraint clinical_exercise_assignments_patient_response_status_check
  check (patient_response_status in ('empty', 'draft', 'shared'));

comment on column public.clinical_exercise_assignments.patient_response is
  'Respuestas introducidas por el paciente en Entre Sesiones. No se incorporan automáticamente a la historia clínica.';

comment on column public.clinical_exercise_assignments.patient_response_status is
  'Estado de las respuestas del paciente: empty, draft o shared.';

comment on column public.clinical_exercise_assignments.patient_response_updated_at is
  'Última fecha de guardado de las respuestas del paciente.';

comment on column public.clinical_exercise_assignments.patient_response_shared_at is
  'Fecha en la que el paciente compartió explícitamente sus respuestas con la profesional.';
