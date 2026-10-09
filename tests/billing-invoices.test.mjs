import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = file => readFileSync(new URL("../" + file, import.meta.url), "utf8");
const migration = read("supabase/migrations/20261009_dememoria_billing_invoices.sql");
const app = read("public/admin-economia.js");
const page = read("app/admin/economia/page.tsx");
const clinician = read("app/admin/clinica/page.tsx");

test("accounting exists only in the owner-restricted private administration", () => {
  assert.match(page, /Gestión económica/);
  assert.match(page, /noindex|index: false/);
  assert.match(app, /user\?\.id !== OWNER/);
  assert.match(app, /clinical_patients\?select=id,full_name,national_id,address,care_context,status/);
  assert.doesNotMatch(app, /clinical_summary|work_notes|diagnos|medication_notes/);
  assert.match(clinician, /href="\/admin\/economia\/"/);
  for (const name of ["billing_issuer_settings","billing_invoices","billing_receipts","billing_expenses"])
    assert.match(migration, new RegExp("alter table public\\." + name + " enable row level security"));
  assert.match(migration, /revoke all on public\.billing_issuer_settings/);
  assert.match(migration, /from PUBLIC, anon, authenticated/);
  assert.match(migration, /auth\.uid\(\)/);
});
test("invoice numbering comes only from a server-side atomic sequence", () => {
  assert.match(migration, /create or replace function public\.billing_issue_invoice/);
  assert.match(migration, /security definer set search_path = ''/);
  assert.match(migration, /on conflict \(fiscal_year,series\) do update/);
  assert.match(migration, /last_number=public\.billing_invoice_sequences\.last_number\+1/);
  assert.match(migration, /where id=p_invoice_id for update/);
  assert.match(migration, /invoice_number='CSG-' \|\| v_year/);
  assert.match(migration, /Factura emitida: datos inalterables/);
  assert.match(migration, /Las facturas emitidas no pueden eliminarse/);
  assert.match(migration, /issuer_snapshot=jsonb_build_object/);
  assert.doesNotMatch(app, /Math\.random\(\).*invoice_number|localStorage.*invoice_number/);
});
test("no fabricated fiscal identifiers and full invoice requires them", () => {
  assert.match(page, /econ-issuer-nif/);
  assert.match(page, /econ-issuer-address/);
  assert.match(page, /econ-invoice-nif/);
  assert.match(page, /econ-invoice-address/);
  assert.match(migration, /length\(trim\(v_issuer\.tax_id\)\) < 8/);
  assert.match(migration, /length\(trim\(v_issuer\.fiscal_address\)\) < 10/);
  assert.match(migration, /recipient_tax_id text not null/);
  assert.match(page, /Este módulo inicial no contempla retenciones de IRPF/);
});
test("separates exempt health care from other taxable operations and invoices from cashflow", () => {
  assert.match(page, /20\.Uno\.3\.º LIVA/);
  assert.match(page, /IVA general 21 %/);
  assert.match(migration, /tax_treatment in \('exempt_healthcare','vat_21'\)/);
  assert.match(migration, /round\(v_total_base \* 0\.21\)/);
  assert.match(app, /const collected = receipts\.filter/);
  assert.match(app, /const spent = expenses\.filter/);
  assert.match(migration, /if v_existing \+ new\.amount_cents > v_due/);
});
test("invoice PDF presentation is rendered locally without sending patient data to external services", () => {
  assert.match(app, /function printInvoice\(i\)/);
  assert.match(app, /window\.print\(\)/);
  assert.match(app, /function esc\(s\)/);
  assert.match(app, /issuer_snapshot/);
  assert.match(app, /function csvCell\(value\)/);
  assert.match(app, /if \(\/\^\[\\s\]/);
  assert.doesNotMatch(app, /jsdelivr|unpkg|pdfkit|api\.brevo\.com/);
  assert.doesNotMatch(app, /localStorage/);
  assert.match(page, /No se envían facturas por correo automáticamente/);
});
