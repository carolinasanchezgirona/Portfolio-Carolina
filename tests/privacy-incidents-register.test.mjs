import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("app/admin/privacidad/page.tsx", "utf8");
const script = readFileSync("public/privacy-incident-register.js", "utf8");
const migration = readFileSync("supabase/migrations/20261110_private_privacy_incidents.sql", "utf8");
const nav = readFileSync("app/admin/workspace-nav.tsx", "utf8");

test("RGPD incidents have a dedicated tab outside patient charts", () => {
  assert.match(nav, /href="\/admin\/privacidad\/"/);
  assert.match(page, /<AdminWorkspaceNav active="privacidad"/);
  assert.match(page, /id="privacy-private" hidden/);
  assert.doesNotMatch(page, /INC-2026-11-10-01|Valverde|Sergi|Sergio/);
});

test("reports stay in restricted storage, never bundled in public assets", () => {
  assert.match(migration, /privacy_incident_evidence_admin_select/);
  assert.match(migration, /privacy_incident_evidence_admin_insert/);
  assert.match(migration, /'privacy-incident-evidence',false/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /public\.admin_mobile_gate\(\)/);
  assert.match(script, /dememoria_admin_session/);
  assert.match(script, /auth\/v1\/user/);
  assert.match(script, /storage\/v1\/object\/privacy-incident-evidence/);
  assert.match(script, /storage\/v1\/object\/authenticated\/privacy-incident-evidence/);
  assert.doesNotMatch(script, /service_role|Sergi|Valverde|Sergio/);
});

test("incident entries remain append-only and evidence SHA-256 is recorded", () => {
  assert.match(script, /crypto\.subtle\.digest\("SHA-256"/);
  assert.match(script, /privacy_incident_events/);
  assert.match(script, /attachment_sha256/);
  assert.match(migration, /grant select, insert on public\.privacy_incident_events/);
  assert.doesNotMatch(migration, /grant .*update.* on public\.privacy_incident_events/);
});