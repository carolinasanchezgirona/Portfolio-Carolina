-- Versión por defecto para nuevas anamnesis. No modifica registros existentes.
alter table public.clinical_anamnesis_records
  alter column protocol_version set default '2.0';
comment on column public.clinical_anamnesis_records.protocol_version is
  '1.0 = entrevista narrativa original, 2.0 = entrevista académica estructurada con respuestas por tipo; conservar versión de cada registro histórico.';
