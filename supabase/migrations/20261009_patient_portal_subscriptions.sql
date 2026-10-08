-- Entitlements for optional post-therapy digital access.
-- Deliberately independent of clinical notes and exercise responses.
-- No payment is initiated or made active by this migration.
create table if not exists public.patient_portal_subscriptions (
  patient_id uuid primary key references public.clinical_patients(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null default 'none' check (status in (
    'none','incomplete','trialing','active','past_due','unpaid','canceled','paused'
  )),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now(),
  check ((status not in ('active','trialing')) or current_period_end is not null)
);
create index if not exists patient_portal_subscriptions_stripe_customer_idx
  on public.patient_portal_subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;
alter table public.patient_portal_subscriptions enable row level security;
revoke all on public.patient_portal_subscriptions from public, anon, authenticated;
grant select, insert, update, delete on public.patient_portal_subscriptions to service_role;
comment on table public.patient_portal_subscriptions is
  'Server-only entitlement metadata. No Stripe payment details, psychological assessments or clinical notes. Enforced only after checkout, webhook and privacy validation.';
