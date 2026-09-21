alter table public.clinical_exercise_templates
  add column if not exists activity_code text,
  add column if not exists version integer not null default 1 check (version >= 1),
  add column if not exists review_status text not null default 'generated'
    check (review_status in ('generated','reviewed','approved')),
  add column if not exists phase text,
  add column if not exists area_tags text[] not null default '{}',
  add column if not exists goal_tags text[] not null default '{}',
  add column if not exists mechanism_tags text[] not null default '{}',
  add column if not exists approach_tags text[] not null default '{}',
  add column if not exists technique_tags text[] not null default '{}',
  add column if not exists format_code text,
  add column if not exists population text,
  add column if not exists use_context text,
  add column if not exists depth text,
  add column if not exists structure_level text,
  add column if not exists professional_content jsonb not null default '{}'::jsonb,
  add column if not exists patient_content jsonb not null default '{}'::jsonb,
  add column if not exists generation_spec jsonb not null default '{}'::jsonb,
  add column if not exists origin text not null default 'manual'
    check (origin in ('manual','factory','factory_ai')),
  add column if not exists generated_at timestamptz,
  add column if not exists reviewed_at timestamptz,
  add column if not exists approved_at timestamptz;

create unique index if not exists clinical_exercise_templates_activity_code_uidx
  on public.clinical_exercise_templates(activity_code)
  where activity_code is not null;

create index if not exists clinical_exercise_templates_area_tags_gin
  on public.clinical_exercise_templates using gin(area_tags);

create index if not exists clinical_exercise_templates_goal_tags_gin
  on public.clinical_exercise_templates using gin(goal_tags);
