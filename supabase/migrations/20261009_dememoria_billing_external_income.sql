-- Dememoria: receipts for professional revenue documented OUTSIDE this billing module.
-- Never use for consultation invoices/cobros already recorded in billing_receipts.
-- No patient identifiers or clinical narratives are stored.
create table if not exists public.billing_external_income (
  id uuid primary key default gen_random_uuid(),
  received_date date not null,
  source text not null check (source in ('external_invoice','other_documented')),
  concept text not null check (length(trim(concept)) between 5 and 200),
  external_reference text not null check (length(trim(external_reference)) between 3 and 100),
  payment_method text not null check (payment_method in ('bizum','bank_transfer','card','cash','other')),
  amount_cents integer not null check (amount_cents between 1 and 10000000),
  created_at timestamptz not null default now(),
  voided_at timestamptz,
  void_reason text,
  constraint billing_external_income_void_check check (
    (voided_at is null and void_reason is null)
    or (voided_at is not null and length(trim(void_reason)) between 6 and 250)
  )
);
create unique index if not exists billing_external_income_ref_unique
  on public.billing_external_income (lower(trim(external_reference)));
create index if not exists billing_external_income_received_idx
  on public.billing_external_income (received_date desc) where voided_at is null;

alter table public.billing_external_income enable row level security;
revoke all on public.billing_external_income from PUBLIC, anon, authenticated;
grant select, insert, update on public.billing_external_income to authenticated;
grant all on public.billing_external_income to service_role;
create policy billing_external_income_owner on public.billing_external_income
  for all to authenticated
  using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
  with check ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);

-- No updates of amounts, date, source, or reference. Voiding is an audited action,
-- not deletion. An already voided entry can never be changed again.
create or replace function public.billing_external_income_guard()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if new.voided_at is not null or new.void_reason is not null then
      raise exception 'Los ingresos se registran como vigentes';
    end if;
    new.external_reference := trim(new.external_reference);
    new.concept := trim(new.concept);
    return new;
  end if;
  if old.voided_at is not null then
    raise exception 'El movimiento anulado es inalterable';
  end if;
  if (new.id, new.received_date, new.source, new.concept, new.external_reference,
      new.payment_method, new.amount_cents, new.created_at) is distinct from
     (old.id, old.received_date, old.source, old.concept, old.external_reference,
      old.payment_method, old.amount_cents, old.created_at)
    or new.voided_at is null or length(trim(coalesce(new.void_reason,''))) < 6 then
    raise exception 'Solo es posible anular con motivo; los importes originales son inalterables';
  end if;
  new.voided_at := now();
  new.void_reason := trim(new.void_reason);
  return new;
end $$;
create trigger billing_external_income_guard_trigger
  before insert or update on public.billing_external_income
  for each row execute function public.billing_external_income_guard();

comment on table public.billing_external_income is
  'Professional receipts accounted outside Dememoria invoice book; no patient data. Voids retained for audit.';
