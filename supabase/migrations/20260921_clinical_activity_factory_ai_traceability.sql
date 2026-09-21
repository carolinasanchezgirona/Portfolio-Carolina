alter table public.clinical_exercise_templates
  add column if not exists ai_model text,
  add column if not exists ai_enriched_at timestamptz;
