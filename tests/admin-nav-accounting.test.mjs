import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = name => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const clinic = read("app/admin/clinica/page.tsx");
const agenda = read("app/admin/agenda/page.tsx");
const economy = read("app/admin/economia/page.tsx");
const nav = read("app/admin/workspace-nav.tsx");
const styles = read("app/admin/workspace-navigation.css");
const clinicJs = read("public/admin-clinica.js");
const econJs = read("public/admin-economia.js");

test("one consistent authenticated professional nav, with working clinical deep links", () => {
  assert.match(agenda, /<AdminWorkspaceNav active="agenda" \/>/);
  assert.match(economy, /<AdminWorkspaceNav active="economia" \/>/);
  assert.match(nav, /view=patients/);
  assert.match(nav, /view=pending/);
  assert.match(clinicJs, /requestedView/);
  assert.match(clinicJs, /setView\(requestedView\)/);
  for (const href of ["/admin/agenda/", "/admin/recursos/", "/admin/economia/", "/admin/"]) {
    assert.ok(nav.includes(href));
  }
  assert.match(styles, /@media\(max-width:800px\)/);
  assert.match(styles, /grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(styles, /@media\(min-width:1100px\)/);
});

test("agenda actions appear only in one compact tools menu and original ids survive", () => {
  assert.match(agenda, /<details className="admin-agenda-tools">/);
  for (const id of ["admin-new", "admin-block", "admin-print", "admin-access", "admin-logout", "pwa-install", "today-new"]) {
    assert.equal((agenda.match(new RegExp('id="' + id + '"', "g")) || []).length, 1, id);
  }
  assert.doesNotMatch(agenda, /admin-top-actions/);
  assert.match(clinic, /Citas pendientes/);
  assert.match(clinic, /Tareas pendientes/);
});

test("accounting separates cash movements from issued invoices", () => {
  for (const panel of ["overview", "movements", "invoices", "settings"]) {
    assert.ok(economy.includes('data-econ-panel="' + panel + '"'), panel);
  }
  assert.doesNotMatch(economy, /data-econ-panel="expenses"/);
  for (const label of ["Todos", "Ingresos", "Gastos", "Facturas"]) assert.ok(economy.includes(label));
  for (const id of ["econ-expense-form", "econ-issuer-form", "econ-invoice-form", "econ-movement-list", "econ-expense-register"]) {
    assert.equal((economy.match(new RegExp('id="' + id + '"', "g")) || []).length, 1, id);
  }
  assert.match(econJs, /const income = receipts\.filter/);
  assert.match(econJs, /const outgoing = expenses\.filter/);
  assert.match(econJs, /tab === "expenses" \? "movements"/);
  assert.match(econJs, /function exportMovements/);
  assert.match(economy, /Los ingresos no vinculados a factura todavía no se pueden registrar/);
});
