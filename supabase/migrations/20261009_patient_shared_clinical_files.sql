-- Compartir archivos de forma explícita con pacientes ya autenticados en Mi espacio.
-- Los documentos históricos siguen siendo estrictamente privados por defecto.
alter table public.clinical_documents
  add column if not exists shared_at timestamptz,
  add column if not exists share_revoked_at timestamptz,
  add column if not exists patient_note text;

alter table public.clinical_documents
  drop constraint if exists clinical_documents_category_check;
alter table public.clinical_documents
  add constraint clinical_documents_category_check check (
    category in ('external_report', 'referral', 'consent', 'test_result', 'attendance',
      'intervention_plan', 'information_notice', 'relaxation_audio', 'other')
  );

alter table public.clinical_documents
  add constraint clinical_documents_patient_note_length check (
    patient_note is null or char_length(patient_note) <= 500
  );

create index if not exists clinical_documents_shared_patient_idx
  on public.clinical_documents (patient_id, shared_at desc)
  where shared_at is not null and share_revoked_at is null;

-- Bucket privado. Audio de hasta 25 MB, MIME restringidos a contenido seguro.
update storage.buckets
set file_size_limit = 26214400,
    allowed_mime_types = array[
      'application/pdf', 'image/jpeg', 'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav',
      'audio/x-wav', 'audio/ogg', 'audio/webm'
    ]::text[]
where id = 'clinical-documents' and public = false;

-- La RLS clínica existente sigue siendo exclusiva para la profesional.
-- No conceder SELECT a anon ni a las sesiones de paciente sobre clinical_documents.
