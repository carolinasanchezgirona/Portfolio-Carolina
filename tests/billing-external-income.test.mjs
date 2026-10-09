import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const migration = read("supabase/migrations/20261009_dememoria_billing_external_income.sql");
const app = read("public/admin-economia.js");
const page = read("app/admin/economia/page.tsx");
const nav = read("app/admin/workspace-nav.tsx");

test("external income is owner-only, references are unique and patient data is excluded", () => {
  assert.match(migration, /create table if not exists public\.billing_external_income/);
  assert.match(migration, /alter table public\.billing_external_income enable row level security/);
  assert.match(migration, /revoke all on public\.billing_external_income from PUBLIC, anon, authenticated/);
  assert.match(migration, /auth\.uid\(\)/);
  assert.match(migration, /create unique index if not exists billing_external_income_ref_unique/);
  assert.doesNotMatch(migration, /patient_id|recipient_name|contact_email|diagnos|health_data|clinical_summary/);
  assert.match(migration, /raise exception 'El movimiento anulado es inalterable'/);
  assert.match(migration, /Solo es posible anular con motivo/);
  assert.doesNotMatch(migration, /grant delete .*billing_external_income/i);
});

test("external income only counts real documented receipts, not invoices issued", () => {
  assert.match(app, /rest\("billing_external_income\?select=/);
  assert.match(app, /const externalReceipts = externalIncome\.filter\(r => !r\.voided_at/);
  assert.match(app, /const collected = invoiceReceipts \+ externalReceipts/);
  assert.match(app, /const independent = externalIncome\.filter\(row => !row\.voided_at/);
  assert.match(app, /\.\.\.income, \.\.\.independent, \.\.\.outgoing/);
  assert.match(app, /external_reference:ref/);
  assert.match(app, /voided_at:new Date\(\)\.toISOString\(\)/);
  assert.doesNotMatch(app, /billing_invoices.*DELETE/);
});

test("every extra income requires confirmation, supporting reference and one compact action", () => {
  assert.match(page, /<h1>Contabilidad<\/h1>/);
  assert.match(page, /econ-external-income-form/);
  assert.match(page, /Referencia única del justificante/);
  assert.match(page, /no está registrado en otra factura o movimiento de Dememoria/);
  assert.match(page, /No introduzcas nombres ni datos sanitarios de pacientes/);
  assert.match(page, /Historial de ingresos anulados/);
  assert.match(nav, />Gestión económica<\/a>|>Contabilidad<\/a>/);
});
