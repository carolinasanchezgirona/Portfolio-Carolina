-- Bulk import for external clinical agendas.
-- The external history number is intentionally neither accepted nor stored.

create or replace function public.generate_clinical_patient_code()
returns text
language plpgsql
set search_path = ''
as $$
declare
  candidate text;
begin
  loop
    candidate := 'DM-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    exit when not exists (
      select 1
      from public.clinical_patients
      where public_code = candidate
    );
  end loop;
  return candidate;
end;
$$;

alter table public.clinical_patients
  add column if not exists public_code text,
  add column if not exists care_context text not null default 'private_practice',
  add column if not exists external_provider text;

update public.clinical_patients
set public_code = public.generate_clinical_patient_code()
where public_code is null;

alter table public.clinical_patients
  alter column public_code set default public.generate_clinical_patient_code(),
  alter column public_code set not null;

create unique index if not exists clinical_patients_public_code_key
  on public.clinical_patients (public_code);

alter table public.clinical_patients
  drop constraint if exists clinical_patients_care_context_check;

alter table public.clinical_patients
  add constraint clinical_patients_care_context_check
  check (care_context in ('private_practice', 'creu_blava', 'combined'));

create table public.clinical_external_visits (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.clinical_patients(id) on delete restrict,
  visit_date date,
  visit_time time(0) without time zone not null,
  insurance_provider text not null,
  external_provider text not null default 'Creu Blava',
  center text not null check (center in ('arenys_1', 'arenys_2')),
  import_source text not null default 'bulk_agenda' check (import_source = 'bulk_agenda'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clinical_external_visits_unique
    unique nulls not distinct (patient_id, visit_date, visit_time, center, external_provider)
);

create index clinical_external_visits_patient_date_idx
  on public.clinical_external_visits (patient_id, visit_date desc, visit_time desc);

alter table public.clinical_external_visits enable row level security;

create policy "clinical_external_visits_owner_all"
on public.clinical_external_visits
for all
to authenticated
using (public.is_clinical_owner())
with check (public.is_clinical_owner());

grant select, insert, update on public.clinical_external_visits to authenticated;

create or replace function public.import_clinical_patient_batch(p_rows jsonb)
returns table (
  patient_id uuid,
  public_code text,
  full_name text,
  import_action text,
  external_visit_id uuid
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  item jsonb;
  item_count integer;
  v_name text;
  v_phone text;
  v_insurer text;
  v_provider text;
  v_center text;
  v_context text;
  v_date date;
  v_time time(0) without time zone;
  v_patient_id uuid;
  v_public_code text;
  v_existing_context text;
  v_action text;
  v_visit_id uuid;
begin
  if current_user <> 'postgres' and not public.is_clinical_owner() then
    raise exception 'No autorizado para importar fichas clínicas.' using errcode = '42501';
  end if;

  if p_rows is null or jsonb_typeof(p_rows) <> 'array' then
    raise exception 'El lote debe ser una lista de fichas.' using errcode = '22023';
  end if;

  item_count := jsonb_array_length(p_rows);
  if item_count = 0 or item_count > 100 then
    raise exception 'El lote debe contener entre 1 y 100 fichas.' using errcode = '22023';
  end if;

  for item in select value from jsonb_array_elements(p_rows)
  loop
    v_name := nullif(btrim(item ->> 'full_name'), '');
    v_phone := regexp_replace(coalesce(item ->> 'phone', ''), '[^0-9]', '', 'g');
    v_insurer := upper(nullif(btrim(item ->> 'insurance_provider'), ''));
    v_provider := nullif(btrim(item ->> 'external_provider'), '');
    v_center := lower(nullif(btrim(item ->> 'external_site'), ''));
    v_context := lower(coalesce(nullif(btrim(item ->> 'care_context'), ''), 'creu_blava'));

    if v_name is null or char_length(v_name) > 180 then
      raise exception 'Cada ficha necesita un nombre impreso válido.' using errcode = '22023';
    end if;
    if v_phone !~ '^[0-9]{9}$' then
      raise exception 'Cada ficha necesita un teléfono de 9 cifras.' using errcode = '22023';
    end if;
    if v_insurer is null or char_length(v_insurer) > 100 then
      raise exception 'Cada ficha necesita una mutua válida.' using errcode = '22023';
    end if;
    if lower(coalesce(v_provider, '')) <> 'creu blava' then
      raise exception 'El centro externo debe ser Creu Blava.' using errcode = '22023';
    end if;
    v_provider := 'Creu Blava';
    if v_center not in ('arenys_1', 'arenys_2') then
      raise exception 'La sede debe ser Arenys 1 o Arenys 2.' using errcode = '22023';
    end if;
    if v_context not in ('creu_blava', 'combined') then
      raise exception 'El circuito asistencial no es válido.' using errcode = '22023';
    end if;
    if coalesce(item ->> 'visit_time', '') !~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$' then
      raise exception 'Cada ficha necesita una hora válida (HH:MM).' using errcode = '22023';
    end if;

    v_time := (item ->> 'visit_time')::time(0);
    if nullif(btrim(item ->> 'visit_date'), '') is null then
      v_date := null;
    elsif (item ->> 'visit_date') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then
      v_date := (item ->> 'visit_date')::date;
    else
      raise exception 'La fecha debe usar el formato AAAA-MM-DD.' using errcode = '22023';
    end if;

    select p.id, p.public_code, p.care_context
      into v_patient_id, v_public_code, v_existing_context
    from public.clinical_patients as p
    where regexp_replace(coalesce(p.phone, ''), '[^0-9]', '', 'g') = v_phone
    order by p.created_at asc
    limit 1
    for update;

    if v_patient_id is null then
      insert into public.clinical_patients (
        identity_key,
        full_name,
        phone,
        patient_type,
        status,
        care_context,
        external_provider
      ) values (
        'phone:' || v_phone,
        v_name,
        v_phone,
        'existing',
        'active',
        v_context,
        v_provider
      )
      returning id, clinical_patients.public_code
        into v_patient_id, v_public_code;
      v_action := 'created';
    else
      update public.clinical_patients as p
      set
        full_name = v_name,
        phone = v_phone,
        care_context = case
          when p.care_context in ('private_practice', 'combined') then 'combined'
          else v_context
        end,
        external_provider = v_provider,
        updated_at = now()
      where p.id = v_patient_id;
      v_action := 'updated';
    end if;

    insert into public.clinical_external_visits (
      patient_id,
      visit_date,
      visit_time,
      insurance_provider,
      external_provider,
      center
    ) values (
      v_patient_id,
      v_date,
      v_time,
      v_insurer,
      v_provider,
      v_center
    )
    on conflict on constraint clinical_external_visits_unique do update
    set
      insurance_provider = excluded.insurance_provider,
      updated_at = now()
    returning id into v_visit_id;

    patient_id := v_patient_id;
    public_code := v_public_code;
    full_name := v_name;
    import_action := v_action;
    external_visit_id := v_visit_id;
    return next;
  end loop;
end;
$$;

revoke execute on function public.import_clinical_patient_batch(jsonb) from public;
revoke execute on function public.import_clinical_patient_batch(jsonb) from anon;
grant execute on function public.import_clinical_patient_batch(jsonb) to authenticated;
