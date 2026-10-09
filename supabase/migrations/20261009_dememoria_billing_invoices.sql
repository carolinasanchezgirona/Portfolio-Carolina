-- Exclusively for carolinasanchezgirona.com / Dememoria. No shared Mineuri billing.
-- Patient invoices are never exposed to the patient portal, anon, or non-owner accounts.
-- Drafts may be edited; issuance allocates a number atomically and freezes fiscal fields.
create table if not exists public.billing_issuer_settings (
  id smallint primary key default 1 check (id = 1),
  legal_name text not null default 'Carolina Sánchez Girona',
  tax_id text not null default '',
  fiscal_address text not null default '',
  email text not null default 'contact@carolinasanchezgirona.com',
  updated_at timestamptz not null default now(),
  constraint billing_issuer_lengths check (
    length(legal_name) between 3 and 160 and length(tax_id) <= 30
    and length(fiscal_address) <= 350 and length(email) <= 180
  )
);
insert into public.billing_issuer_settings(id) values (1) on conflict (id) do nothing;

create table if not exists public.billing_invoice_sequences (
  fiscal_year integer not null check (fiscal_year between 2020 and 2100),
  series text not null default 'CSG' check (series = 'CSG'),
  last_number integer not null check (last_number > 0),
  primary key (fiscal_year, series)
);

create table if not exists public.billing_invoices (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.clinical_patients(id) on delete restrict,
  appointment_id uuid references public.appointment_bookings(id) on delete restrict,
  status text not null default 'draft' check (status in ('draft','issued')),
  recipient_name text not null,
  recipient_tax_id text not null,
  recipient_address text not null,
  description text not null,
  service_date date not null,
  quantity smallint not null default 1 check (quantity between 1 and 50),
  unit_price_cents integer not null check (unit_price_cents between 1 and 10000000),
  tax_treatment text not null default 'exempt_healthcare'
    check (tax_treatment in ('exempt_healthcare','vat_21')),
  issue_date date,
  invoice_number text unique,
  fiscal_year integer,
  number_in_series integer,
  issuer_snapshot jsonb,
  vat_cents integer,
  total_cents integer,
  issued_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_invoice_data_check check (
    length(trim(recipient_name)) between 3 and 160 and
    length(trim(recipient_tax_id)) between 5 and 40 and
    length(trim(recipient_address)) between 5 and 350 and
    length(trim(description)) between 3 and 250
  ),
  constraint billing_invoice_issued_data_check check (
    (status = 'draft' and invoice_number is null and issue_date is null
      and issued_at is null and issuer_snapshot is null and vat_cents is null
      and total_cents is null and fiscal_year is null and number_in_series is null)
    or
    (status = 'issued' and invoice_number is not null and issue_date is not null
      and issued_at is not null and issuer_snapshot is not null
      and vat_cents is not null and total_cents is not null
      and fiscal_year is not null and number_in_series is not null)
  ),
  unique(fiscal_year, number_in_series)
);
create index if not exists billing_invoices_patient_idx on public.billing_invoices(patient_id,created_at desc);
create index if not exists billing_invoices_issued_idx on public.billing_invoices(issue_date desc)
  where status = 'issued';
create unique index if not exists billing_invoices_issued_appointment_idx on public.billing_invoices(appointment_id)
  where appointment_id is not null and status = 'issued';

create table if not exists public.billing_receipts (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.billing_invoices(id) on delete restrict,
  amount_cents integer not null check (amount_cents > 0),
  paid_date date not null,
  method text not null check (method in ('bizum','bank_transfer','card','cash','other')),
  created_at timestamptz not null default now()
);
create index if not exists billing_receipts_invoice_idx on public.billing_receipts(invoice_id);

create table if not exists public.billing_expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null,
  category text not null check (category in ('rent','utilities','software','materials','marketing','training','professional','other')),
  supplier text not null check (length(trim(supplier)) between 2 and 160),
  concept text not null check (length(trim(concept)) between 2 and 250),
  amount_cents integer not null check (amount_cents between 1 and 10000000),
  created_at timestamptz not null default now()
);
create index if not exists billing_expenses_date_idx on public.billing_expenses(expense_date desc);

-- Strict row-level controls: only the pre-existing sole clinical administrator.
alter table public.billing_issuer_settings enable row level security;
alter table public.billing_invoice_sequences enable row level security;
alter table public.billing_invoices enable row level security;
alter table public.billing_receipts enable row level security;
alter table public.billing_expenses enable row level security;

revoke all on public.billing_issuer_settings, public.billing_invoice_sequences,
 public.billing_invoices, public.billing_receipts, public.billing_expenses from PUBLIC, anon, authenticated;
grant select, insert, update on public.billing_issuer_settings to authenticated;
grant select, insert, update, delete on public.billing_invoices to authenticated;
grant select, insert on public.billing_receipts to authenticated;
grant select, insert, delete on public.billing_expenses to authenticated;
grant all on public.billing_issuer_settings, public.billing_invoice_sequences,
 public.billing_invoices, public.billing_receipts, public.billing_expenses to service_role;

create policy billing_issuer_owner on public.billing_issuer_settings
  for all to authenticated using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
  with check ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy billing_invoices_owner on public.billing_invoices
  for all to authenticated using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
  with check ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy billing_receipts_owner on public.billing_receipts
  for all to authenticated using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
  with check ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy billing_expenses_owner on public.billing_expenses
  for all to authenticated using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
  with check ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);

-- Non-issuance edits to an already issued invoice are prohibited, including DELETE.
-- Direct writes cannot issue a draft or set the invoice number.
create or replace function public.billing_invoice_guard()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.status = 'issued' then
      raise exception 'Las facturas emitidas no pueden eliminarse';
    end if;
    return old;
  end if;
  if tg_op = 'INSERT' then
    if new.status <> 'draft' or new.invoice_number is not null then
      raise exception 'Solo se pueden crear borradores';
    end if;
    return new;
  end if;
  if old.status = 'issued' then
    raise exception 'Factura emitida: datos inalterables; se requiere rectificativa';
  end if;
  if new.status <> 'draft' and current_setting('app.billing_issuing',true) is distinct from 'yes' then
    raise exception 'Utiliza la función de emisión atómica';
  end if;
  if new.status = 'draft' and
    (new.invoice_number is not null or new.issued_at is not null
     or new.issuer_snapshot is not null or new.total_cents is not null) then
    raise exception 'El número y los importes finales solo se asignan al emitir';
  end if;
  new.updated_at = now();
  return new;
end $$;
create trigger billing_invoice_guard_trigger before insert or update or delete on public.billing_invoices
  for each row execute function public.billing_invoice_guard();

-- Never allow the fiscal identity of already issued invoices to drift: issuer_snapshot is frozen.
create or replace function public.billing_issue_invoice(p_invoice_id uuid)
returns public.billing_invoices
language plpgsql security definer set search_path = ''
as $$
declare
  v_invoice public.billing_invoices%rowtype;
  v_issuer public.billing_issuer_settings%rowtype;
  v_number integer;
  v_year integer;
  v_today date;
  v_total_base bigint;
  v_vat integer;
  v_updated public.billing_invoices%rowtype;
begin
  if (select auth.uid()) is distinct from '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid then
    raise exception 'No autorizado';
  end if;
  select * into v_invoice from public.billing_invoices where id=p_invoice_id for update;
  if not found then raise exception 'Borrador no encontrado'; end if;
  if v_invoice.status <> 'draft' then raise exception 'Esta factura ya está emitida'; end if;
  select * into v_issuer from public.billing_issuer_settings where id=1;
  if not found or length(trim(v_issuer.legal_name)) < 3
    or length(trim(v_issuer.tax_id)) < 8 or length(trim(v_issuer.fiscal_address)) < 10 then
    raise exception 'Completa y revisa el NIF, nombre y domicilio fiscal del emisor';
  end if;
  if v_invoice.appointment_id is not null and exists (
    select 1 from public.billing_invoices where appointment_id=v_invoice.appointment_id
      and status='issued' and id<>p_invoice_id
  ) then raise exception 'Ya existe una factura emitida para esta cita'; end if;
  v_today := (now() at time zone 'Europe/Madrid')::date;
  v_year := extract(year from v_today)::integer;
  v_total_base := v_invoice.quantity::bigint * v_invoice.unit_price_cents::bigint;
  if v_total_base > 200000000 then raise exception 'Importe excesivo'; end if;
  v_vat := case when v_invoice.tax_treatment='vat_21'
    then round(v_total_base * 0.21)::integer else 0 end;
  insert into public.billing_invoice_sequences(fiscal_year,series,last_number)
    values (v_year,'CSG',1)
    on conflict (fiscal_year,series) do update
      set last_number=public.billing_invoice_sequences.last_number+1
    returning last_number into v_number;
  perform set_config('app.billing_issuing','yes',true);
  update public.billing_invoices set
    status='issued', issue_date=v_today, fiscal_year=v_year,
    number_in_series=v_number,
    invoice_number='CSG-' || v_year::text || '-' || lpad(v_number::text,5,'0'),
    issued_at=now(),
    issuer_snapshot=jsonb_build_object(
      'legal_name',trim(v_issuer.legal_name),
      'tax_id',trim(v_issuer.tax_id),
      'fiscal_address',trim(v_issuer.fiscal_address),
      'email',trim(v_issuer.email)),
    vat_cents=v_vat,
    total_cents=(v_total_base + v_vat)::integer
    where id=p_invoice_id returning * into v_updated;
  perform set_config('app.billing_issuing','',true);
  return v_updated;
end $$;

revoke all on function public.billing_issue_invoice(uuid) from PUBLIC, anon;
grant execute on function public.billing_issue_invoice(uuid) to authenticated;

-- Payment records only for issued invoices; lock invoice to prevent concurrent overpayments.
create or replace function public.billing_receipt_guard()
returns trigger language plpgsql set search_path = ''
as $$
declare
  v_due bigint; v_existing bigint; v_status text;
begin
  select total_cents,status into v_due,v_status from public.billing_invoices
    where id=new.invoice_id for update;
  if not found or v_status <> 'issued' then raise exception 'Primero debes emitir la factura'; end if;
  select coalesce(sum(amount_cents),0) into v_existing from public.billing_receipts
    where invoice_id=new.invoice_id;
  if v_existing + new.amount_cents > v_due then raise exception 'El cobro supera el importe pendiente'; end if;
  return new;
end $$;
create trigger billing_receipt_guard_trigger before insert on public.billing_receipts
  for each row execute function public.billing_receipt_guard();
