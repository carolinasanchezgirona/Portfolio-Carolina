alter table public.clinical_patients
  add column if not exists birth_date date,
  add column if not exists national_id text,
  add column if not exists address text,
  add column if not exists occupation text,
  add column if not exists marital_status text,
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_phone text,
  add column if not exists referring_professional text,
  add column if not exists insurance_provider text,
  add column if not exists administrative_notes text;

comment on column public.clinical_patients.birth_date is 'Fecha de nacimiento del paciente. La edad se calcula en interfaz.';
comment on column public.clinical_patients.national_id is 'DNI/NIE opcional para identificación administrativa.';
comment on column public.clinical_patients.address is 'Dirección postal opcional.';
comment on column public.clinical_patients.occupation is 'Profesión u ocupación.';
comment on column public.clinical_patients.marital_status is 'Estado civil o convivencia, solo cuando sea útil administrativamente.';
comment on column public.clinical_patients.emergency_contact_name is 'Persona de contacto de emergencia opcional.';
comment on column public.clinical_patients.emergency_contact_phone is 'Teléfono de contacto de emergencia opcional.';
comment on column public.clinical_patients.referring_professional is 'Profesional o médico de referencia opcional.';
comment on column public.clinical_patients.insurance_provider is 'Mutua o cobertura administrativa opcional.';
comment on column public.clinical_patients.administrative_notes is 'Observaciones administrativas no clínicas.';
