-- Nullable fiscal cells are kept as empty strings, never invented zeroes or default tax classifications.
create table public.billing_tax_book_rows (
 id uuid primary key,
 book text not null check (book in ('income','expense','investment')),
 data jsonb not null check (jsonb_typeof(data)='object' and octet_length(data::text)<=30000),
 source_key text not null check (source_key ~ '^[a-f0-9]{64}$'),
 source_name text not null check (length(source_name)<=320),
 source_row integer not null check (source_row between 1 and 10034),
 notes text not null default '' check (length(notes)<=2000),
 created_at timestamptz not null default now(),
 unique(book,source_key)
);
create index billing_tax_book_year_idx on public.billing_tax_book_rows ((data->>'c01'),book);
alter table public.billing_tax_book_rows enable row level security;
revoke all on public.billing_tax_book_rows from PUBLIC,anon,authenticated;
grant select,insert,update on public.billing_tax_book_rows to authenticated;
grant all on public.billing_tax_book_rows to service_role;
create policy billing_tax_book_owner on public.billing_tax_book_rows for all to authenticated
 using ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid)
 with check ((select auth.uid())='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'::uuid);
comment on table public.billing_tax_book_rows is 'Editable AEAT fiscal registers with draft/incomplete cells and import provenance. Separate from invoice issuance and cash receipts.';

