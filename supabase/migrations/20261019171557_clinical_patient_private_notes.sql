create table public.clinical_patient_notes (
 patient_id uuid primary key references public.clinical_patients(id) on delete cascade,
 body text not null default '' check (char_length(body)<=20000),
 revision integer not null default 1 check (revision>0),
 updated_at timestamptz not null default now()
);
alter table public.clinical_patient_notes enable row level security;
revoke all on public.clinical_patient_notes from public,anon,authenticated;
grant select,insert,update on public.clinical_patient_notes to authenticated;
grant select,insert,update,delete on public.clinical_patient_notes to service_role;
create policy clinical_patient_notes_owner on public.clinical_patient_notes
 for all to authenticated
 using ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
 with check ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
comment on table public.clinical_patient_notes is 'Bloc de notas privado del profesional por historial; no forma parte de los documentos compartidos ni de las exportaciones para pacientes.';
