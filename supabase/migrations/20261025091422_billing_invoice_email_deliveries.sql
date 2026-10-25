-- Delivery audit only: no invoices, receipts, expenses or other accounting entries are created.
create table public.billing_invoice_email_deliveries (
  id uuid primary key,
  invoice_id uuid not null references public.billing_invoices(id) on delete restrict,
  recipient_email text not null check (length(recipient_email) between 3 and 254),
  status text not null default 'pending' check (status in ('pending','accepted','failed','unknown')),
  provider_message_id text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
create index billing_invoice_email_history on public.billing_invoice_email_deliveries(invoice_id,created_at desc);
create unique index billing_invoice_email_one_inflight on public.billing_invoice_email_deliveries(invoice_id)
  where status in ('pending','unknown');
alter table public.billing_invoice_email_deliveries enable row level security;
revoke all on public.billing_invoice_email_deliveries from PUBLIC, anon, authenticated;
grant select on public.billing_invoice_email_deliveries to authenticated;
grant select,insert,update on public.billing_invoice_email_deliveries to service_role;
create policy billing_invoice_email_owner_read on public.billing_invoice_email_deliveries for select to authenticated
  using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
comment on table public.billing_invoice_email_deliveries is 'Email submission audit; accepted means provider accepted, not delivery or reading confirmation.';

