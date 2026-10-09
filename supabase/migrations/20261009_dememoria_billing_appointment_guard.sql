-- Do not allow an invoice to be issued for another patient's appointment or for a future/cancelled booking.
create or replace function public.billing_issue_invoice(p_invoice_id uuid)
returns public.billing_invoices
language plpgsql security definer set search_path = ''
as $$
declare
  v_invoice public.billing_invoices%rowtype;
  v_issuer public.billing_issuer_settings%rowtype;
  v_number integer;
  v_initial integer;
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
  if v_invoice.appointment_id is not null and not exists (
    select 1 from public.appointment_bookings a
      where a.id = v_invoice.appointment_id
        and a.clinical_patient_id = v_invoice.patient_id
        and a.starts_at <= now()
        and a.status not in ('cancelled','canceled')
  ) then
    raise exception 'La cita no pertenece a este paciente o todavía no se ha realizado';
  end if;
  if v_invoice.appointment_id is not null and exists (
    select 1 from public.billing_invoices where appointment_id=v_invoice.appointment_id
      and status='issued' and id<>p_invoice_id
  ) then raise exception 'Ya existe una factura emitida para esta cita'; end if;
  if v_issuer.first_invoice_year is null or v_issuer.first_invoice_number is null then
    raise exception 'Configura antes de emitir el número inicial y el año fiscal de la serie CSG';
  end if;
  v_today := (now() at time zone 'Europe/Madrid')::date;
  v_year := extract(year from v_today)::integer;
  v_initial := case when v_year = v_issuer.first_invoice_year then v_issuer.first_invoice_number else 1 end;
  v_total_base := v_invoice.quantity::bigint * v_invoice.unit_price_cents::bigint;
  if v_total_base > 200000000 then raise exception 'Importe excesivo'; end if;
  v_vat := case when v_invoice.tax_treatment='vat_21'
    then round(v_total_base * 0.21)::integer else 0 end;
  insert into public.billing_invoice_sequences(fiscal_year,series,last_number)
    values (v_year,'CSG',v_initial)
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


