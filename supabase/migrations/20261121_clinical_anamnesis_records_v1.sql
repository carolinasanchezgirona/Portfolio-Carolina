-- Formularios de anamnesis por evaluación, separados de la anamnesis de TDAH existente.
create table if not exists public.clinical_anamnesis_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.clinical_patients(id) on delete restrict,
  assessment_type text not null check (assessment_type in (
    'tea_adultos', 'memoria_deterioro', 'altas_capacidades',
    'dislexia', 'neuropsicologia_general'
  )),
  status text not null default 'draft' check (status in ('draft', 'in_progress', 'reviewed')),
  protocol_version text not null default '1.0',
  answers jsonb not null default '{}'::jsonb
    check (jsonb_typeof(answers) = 'object' and pg_column_size(answers) <= 262144),
  revision integer not null default 1 check (revision >= 1),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviewed_has_date check (status <> 'reviewed' or reviewed_at is not null)
);
create index if not exists clinical_anamnesis_records_patient_idx
  on public.clinical_anamnesis_records(patient_id, created_at desc);

create or replace function public.clinical_anamnesis_record_guard()
returns trigger language plpgsql security invoker
set search_path = ''
as $function$
begin
  if old.status = 'reviewed' then
    raise exception 'La anamnesis revisada es de solo lectura. Inicie una nueva evaluación para registrar rectificaciones.';
  end if;
  if new.patient_id is distinct from old.patient_id
     or new.assessment_type is distinct from old.assessment_type
     or new.created_at is distinct from old.created_at
     or new.protocol_version is distinct from old.protocol_version then
    raise exception 'No se permite cambiar la identidad o el tipo de una evaluación existente.';
  end if;
  new.revision := old.revision + 1;
  new.updated_at := now();
  new.reviewed_at := case when new.status = 'reviewed' then now() else null end;
  return new;
end
$function$;
revoke all on function public.clinical_anamnesis_record_guard() from public, anon, authenticated;
drop trigger if exists clinical_anamnesis_record_guard_tr on public.clinical_anamnesis_records;
create trigger clinical_anamnesis_record_guard_tr
before update on public.clinical_anamnesis_records
for each row execute function public.clinical_anamnesis_record_guard();

alter table public.clinical_anamnesis_records enable row level security;
revoke all on table public.clinical_anamnesis_records from public, anon, authenticated;
grant select, insert, update on table public.clinical_anamnesis_records to authenticated;

create policy anamnesis_owner_select on public.clinical_anamnesis_records
for select to authenticated using ((select public.is_clinical_owner()));
create policy anamnesis_owner_insert on public.clinical_anamnesis_records
for insert to authenticated with check ((select public.is_clinical_owner()));
create policy anamnesis_owner_update on public.clinical_anamnesis_records
for update to authenticated
using ((select public.is_clinical_owner()) and status <> 'reviewed')
with check ((select public.is_clinical_owner()));
comment on table public.clinical_anamnesis_records is
  'Anamnesis clínica por proceso de evaluación; acceso solo profesional autorizado. TDAH usa clinical_adhd_assessments/forms.';