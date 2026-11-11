import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = p => readFileSync(p,"utf8");
const page = read("app/admin/proteccion-datos/page.tsx");
const home = read("app/admin/page.tsx");
const nav = read("app/admin/workspace-nav.tsx");
const clinic = read("app/admin/clinica/page.tsx");

test("Registro RGPD privado: no incluye casos personales en el código ni los muestra antes de autorizar", () => {
  assert.match(page,/verifyAccess\(\)/);
  assert.match(page,/auth\/v1\/user/);
  assert.match(page,/admin_mobile_gate/);
  assert.match(page,/user\?\.id !== OWNER/);
  assert.match(page,/authorized &&/);
  assert.doesNotMatch(page,/Sergi Valverde|Carolina Sánchez Girona|PR 236/);
  assert.doesNotMatch(page,/service_role|sb_secret_/);
});
test("PDF original solo en bucket privado, con validación y verificación de integridad", () => {
  assert.match(page,/privacy-incident-evidence/);
  assert.match(page,/crypto\.subtle\.digest\("SHA-256"/);
  assert.match(page,/String\.fromCharCode\(\.\.\.signature\) !== "%PDF-"/);
  assert.match(page,/attachment_path: path, attachment_sha256: sha256/);
  assert.match(page,/actual !== selected\.attachment_sha256/);
  assert.match(page,/evidence_access_requested/);
  assert.match(page,/evidence_access_verified/);
  assert.doesNotMatch(page,/getPublicUrl|storage\/v1\/object\/public/);
});
test("Registro e historial, sin sobrescribir entradas previas", () => {
  assert.match(page,/privacy_incidents\?select/);
  assert.match(page,/privacy_incident_events\?select/);
  assert.match(page,/createEvent\(selected\.id, "note", detail\)/);
  assert.match(page,/risk_assessment: risk\.trim\(\), status/);
  assert.match(page,/Crear|Guardar incidencia/);
});
test("Navegación de administración coherente", () => {
  for (const text of [home, nav, clinic]) assert.ok(text.includes("/admin/proteccion-datos/"));
  assert.match(home,/Tu consulta hoy/);
});
