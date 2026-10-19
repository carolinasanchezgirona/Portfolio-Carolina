create table public.patient_internal_messages (
 id uuid primary key default gen_random_uuid(),
 patient_id uuid not null references public.clinical_patients(id) on delete cascade,
 sender text not null check (sender in ('patient','clinician')),
 body text not null check (char_length(trim(body)) between 1 and 4000),
 client_nonce uuid not null,
 created_at timestamptz not null default now(),
 read_at timestamptz,
 unique(patient_id,sender,client_nonce)
);
create index patient_internal_messages_thread_idx on public.patient_internal_messages(patient_id,created_at desc,id desc);
create index patient_internal_messages_unread_idx on public.patient_internal_messages(sender,created_at desc) where read_at is null;
alter table public.patient_internal_messages enable row level security;
revoke all on public.patient_internal_messages from public,anon,authenticated;
grant select,insert,update on public.patient_internal_messages to service_role;
comment on table public.patient_internal_messages is 'Mensajes privados entre paciente y profesional. Acceso exclusivo desde backend con sesión validada; no enviar contenido por email.';
