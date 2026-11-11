-- Immutable patient-shared worksheet deliveries. Draft answers stay in the
-- assignment record and are never added to the clinical-history log.
-- Only the treating professional may read this table; patient writes flow
-- exclusively through the existing authenticated Worker endpoint.
create table if not exists public.clinical_exercise_response_events (
  id bigint generated always as identity primary key,
  assignment_id uuid not null references public.clinical_exercise_assignments(id) on delete cascade,
  patient_id uuid not null references public.clinical_patients(id) on delete cascade,
  title text not null,
  source_document_id uuid,
  response jsonb not null check (jsonb_typeof(response) = 'object'),
  field_definitions jsonb not null default '[]'::jsonb,
  shared_at timestamptz not null,
  recorded_at timestamptz not null default now()
);
comment on table public.clinical_exercise_response_events is
  'Append-only clinician-only history of patient-shared worksheet responses. Drafts are never recorded. No automatic clinical validation.';
create index if not exists clinical_exercise_response_events_patient_date
  on public.clinical_exercise_response_events(patient_id, shared_at desc);
create index if not exists clinical_exercise_response_events_assignment_date
  on public.clinical_exercise_response_events(assignment_id, shared_at desc);

alter table public.clinical_exercise_response_events enable row level security;
revoke all on table public.clinical_exercise_response_events from anon, authenticated;
revoke all on sequence public.clinical_exercise_response_events_id_seq from anon, authenticated;
grant select on table public.clinical_exercise_response_events to authenticated;
create policy clinical_response_events_owner_read
  on public.clinical_exercise_response_events for select to authenticated
  using ((select public.is_clinical_owner()) and (select public.admin_mobile_gate()));

create schema if not exists private;
create or replace function private.capture_clinical_exercise_shared_response()
returns trigger
language plpgsql
security definer
set search_path = ''
as $body$
begin
  if new.patient_response_status = 'shared'
     and new.patient_response_shared_at is not null
     and (
       old.patient_response_status is distinct from new.patient_response_status
       or old.patient_response_shared_at is distinct from new.patient_response_shared_at
       or old.patient_response is distinct from new.patient_response
     ) then
    insert into public.clinical_exercise_response_events(
      assignment_id, patient_id, title, source_document_id,
      response, field_definitions, shared_at
    )
    values (
      new.id, new.patient_id, new.title,
      case when coalesce(new.patient_document->>'source_document_id', '') ~*
        '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        then (new.patient_document->>'source_document_id')::uuid else null end,
      new.patient_response,
      case when jsonb_typeof(new.patient_document->'form_fields') = 'array'
        then new.patient_document->'form_fields' else '[]'::jsonb end,
      new.patient_response_shared_at
    );
  end if;
  return new;
end;
$body$;
revoke all on function private.capture_clinical_exercise_shared_response() from public, anon, authenticated;

drop trigger if exists clinical_exercise_shared_response_history
  on public.clinical_exercise_assignments;
create trigger clinical_exercise_shared_response_history
  after update of patient_response, patient_response_status, patient_response_shared_at
  on public.clinical_exercise_assignments
  for each row
  execute function private.capture_clinical_exercise_shared_response();
