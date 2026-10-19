alter table public.patient_internal_messages add column email_notice_sent_at timestamptz, add column email_notice_claimed_at timestamptz;
create index patient_internal_messages_email_pending_idx on public.patient_internal_messages(created_at) where sender='patient' and email_notice_sent_at is null;
revoke delete,truncate,references,trigger on public.patient_internal_messages from service_role;
