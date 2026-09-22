create table if not exists public.expert_questions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  question_text text not null,
  question_public text,
  answer text,
  category text not null,
  contact_email text,
  privacy_accepted boolean not null default false,
  consent_health boolean not null default false,
  consent_publish boolean not null default false,
  status text not null default 'pending',
  anchor_slug text unique,
  related_page text,
  published_at timestamptz,
  display_order integer not null default 0,
  notified_at timestamptz,
  constraint expert_questions_question_length check (char_length(question_text) between 80 and 1200),
  constraint expert_questions_public_length check (question_public is null or char_length(question_public) between 20 and 1200),
  constraint expert_questions_answer_length check (answer is null or char_length(answer) between 80 and 8000),
  constraint expert_questions_category check (category in ('psicologia','ansiedad-animo','relaciones-duelo','neuropsicologia','memoria-deterioro','familiares-cuidadores','otra')),
  constraint expert_questions_status check (status in ('pending','answered','published','rejected')),
  constraint expert_questions_email check (contact_email is null or contact_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  constraint expert_questions_slug check (anchor_slug is null or anchor_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint expert_questions_related_page check (related_page is null or related_page ~ '^/[a-z0-9/_-]*/?$'),
  constraint expert_questions_publish_complete check (
    status <> 'published' or (
      consent_publish = true and question_public is not null and answer is not null
      and anchor_slug is not null and published_at is not null
    )
  )
);

create index if not exists expert_questions_status_created_idx
  on public.expert_questions (status, created_at desc);
create index if not exists expert_questions_published_idx
  on public.expert_questions (display_order desc, published_at desc)
  where status = 'published';

create or replace function public.set_expert_questions_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_expert_questions_updated_at on public.expert_questions;
create trigger set_expert_questions_updated_at before update on public.expert_questions
for each row execute function public.set_expert_questions_updated_at();

alter table public.expert_questions enable row level security;
revoke all on table public.expert_questions from anon, authenticated;
grant select, insert, update, delete on table public.expert_questions to authenticated;
grant all on table public.expert_questions to service_role;

create policy "Admin can read expert questions" on public.expert_questions for select to authenticated
using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy "Admin can insert expert questions" on public.expert_questions for insert to authenticated
with check ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy "Admin can update expert questions" on public.expert_questions for update to authenticated
using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
with check ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
create policy "Admin can delete expert questions" on public.expert_questions for delete to authenticated
using ((select auth.uid()) = '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);

create or replace function public.get_published_expert_questions()
returns table (
  id uuid, question text, answer text, category text, anchor_slug text,
  related_page text, published_at timestamptz, updated_at timestamptz
)
language sql stable security definer set search_path = '' as $$
  select q.id, q.question_public, q.answer, q.category, q.anchor_slug,
    q.related_page, q.published_at, q.updated_at
  from public.expert_questions q
  where q.status = 'published' and q.question_public is not null
    and q.answer is not null and q.anchor_slug is not null
  order by q.display_order desc, q.published_at desc;
$$;

revoke all on function public.get_published_expert_questions() from public;
grant execute on function public.get_published_expert_questions() to anon, authenticated, service_role;
