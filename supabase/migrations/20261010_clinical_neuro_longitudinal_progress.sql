-- Registro longitudinal de actividades neuropsicológicas, reservado a la profesional.
-- Sin diagnóstico automático ni puntuaciones psicométricas.
create table if not exists public.clinical_neuro_progress (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.clinical_patients(id) on delete restrict,
  assignment_id uuid references public.clinical_exercise_assignments(id) on delete set null,
  observed_on date not null default ((now() at time zone 'Europe/Madrid')::date),
  week_number integer not null check (week_number between 1 and 52),
  domain text not null check (domain in (
    'orientacion_temporal','orientacion_espacial','orientacion_personal','atencion',
    'memoria','funciones_ejecutivas','lenguaje','visuoespacial','praxias_gnosias','cognicion_funcional'
  )),
  task_name text not null check (char_length(btrim(task_name)) between 3 and 180),
  protocol_key text check (protocol_key is null or char_length(protocol_key) between 3 and 120),
  conditions_description text not null default '' check (char_length(conditions_description) <= 1000),
  comparable_conditions boolean not null default false,
  opportunities integer check (opportunities between 1 and 100),
  independent_successes integer check (independent_successes between 0 and 100),
  cue_intensity text not null default 'not_recorded' check (cue_intensity in ('none','light','moderate','intensive','not_recorded')),
  cue_types text[] not null default '{}'::text[] check (cue_types <@ array['visual','verbal','semantic','phonological','modeling','repetition','choice','external_aid','other']::text[]),
  error_types text[] not null default '{}'::text[] check (error_types <@ array['omission','intrusion','perseveration','substitution','spatial','sequencing','comprehension','other']::text[]),
  fatigue integer check (fatigue between 0 and 3),
  participation text not null default 'not_recorded' check (participation in ('good','variable','limited','declined','not_recorded')),
  functional_transfer text not null default 'not_assessed' check (functional_transfer in ('not_assessed','not_observed','with_support','independent')),
  clinician_notes text not null default '' check (char_length(clinician_notes) <= 3500),
  ocr_transcript text not null default '' check (char_length(ocr_transcript) <= 6000),
  transcript_reviewed boolean not null default false,
  photo_paths text[] not null default '{}'::text[] check (cardinality(photo_paths) <= 4),
  supersedes_id uuid references public.clinical_neuro_progress(id) on delete restrict,
  recorded_by uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  constraint neuro_progress_successes_check check (
    (opportunities is null and independent_successes is null)
    or (opportunities is not null and independent_successes is not null and independent_successes <= opportunities)
  ),
  constraint neuro_progress_comparable_check check (
    comparable_conditions = false or (protocol_key is not null and char_length(btrim(conditions_description)) >= 10)
  ),
  constraint neuro_progress_transcript_check check (
    char_length(btrim(ocr_transcript)) = 0 or transcript_reviewed = true
  )
);
create index if not exists clinical_neuro_progress_patient_date_idx
 on public.clinical_neuro_progress(patient_id, observed_on desc, created_at desc);
create index if not exists clinical_neuro_progress_patient_protocol_idx
 on public.clinical_neuro_progress(patient_id, protocol_key, observed_on);
create index if not exists clinical_neuro_progress_assignment_idx
 on public.clinical_neuro_progress(assignment_id);

create or replace function public.clinical_neuro_progress_check_links()
returns trigger language plpgsql security invoker set search_path = ''
as $$
begin
  if new.assignment_id is not null and not exists (
    select 1 from public.clinical_exercise_assignments a
    where a.id = new.assignment_id and a.patient_id = new.patient_id
      and a.patient_document ->> 'clinical_area' = 'neuropsychology'
  ) then
    raise exception 'La asignación no corresponde a un material neuropsicológico de este paciente.' using errcode = '23514';
  end if;
  if new.supersedes_id is not null and not exists (
    select 1 from public.clinical_neuro_progress p
    where p.id = new.supersedes_id and p.patient_id = new.patient_id
  ) then
    raise exception 'La observación corregida no corresponde a este paciente.' using errcode = '23514';
  end if;
  if new.recorded_by is distinct from (select auth.uid()) then
    raise exception 'Identidad profesional no válida.' using errcode = '42501';
  end if;
  return new;
end;
$$;
drop trigger if exists clinical_neuro_progress_validate on public.clinical_neuro_progress;
create trigger clinical_neuro_progress_validate before insert on public.clinical_neuro_progress
 for each row execute function public.clinical_neuro_progress_check_links();

alter table public.clinical_neuro_progress enable row level security;
revoke all on public.clinical_neuro_progress from public, anon, authenticated;
grant select, insert on public.clinical_neuro_progress to authenticated;
create policy "neuro_progress_owner_select" on public.clinical_neuro_progress
  for select to authenticated using (auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy "neuro_progress_owner_insert" on public.clinical_neuro_progress
  for insert to authenticated with check (auth.uid() = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
    and recorded_by = auth.uid());

-- Fotografías manuscritas, privadas y separadas del portal del paciente.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('clinical-neuro-handwriting','clinical-neuro-handwriting',false,8388608,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=8388608,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
create policy "neuro_handwriting_owner_select" on storage.objects
  for select to authenticated
  using (bucket_id='clinical-neuro-handwriting' and auth.uid()='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy "neuro_handwriting_owner_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id='clinical-neuro-handwriting'
    and auth.uid()='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid
    and (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$'
  );
create policy "neuro_handwriting_owner_delete" on storage.objects
  for delete to authenticated
  using (bucket_id='clinical-neuro-handwriting' and auth.uid()='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
comment on table public.clinical_neuro_progress is 'Observaciones clínicas longitudinales, originales e inmutables. Las correcciones crean un nuevo registro con supersedes_id. Nunca se exponen en Mi espacio.';
comment on column public.clinical_neuro_progress.ocr_transcript is 'Transcripción OCR local, corregida y confirmada expresamente por profesional. No equivale a una corrección automática.';
