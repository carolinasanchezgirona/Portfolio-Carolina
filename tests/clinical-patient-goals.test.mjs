import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("patient goal storage is owner-only and private by default", () => {
  const sql = read("supabase/migrations/20261109132028_clinical_goal_publications.sql");
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /revoke all.+from public, anon, authenticated/i);
  assert.match(sql, /is_clinical_owner/i);
  assert.match(sql, /foreign key \(goal_id, patient_id\)/i);
  assert.match(sql, /revoked_at timestamptz/i);
  assert.doesNotMatch(sql, /policy .+patient.*to authenticated/i);
});

test("admin workflow requires explicit publication and supports revocation", () => {
  const js = read("public/clinic-goals-manager.js");
  assert.match(js, /Publicar en Entre Sesiones/);
  assert.match(js, /Compartir con paciente/);
  assert.match(js, /Retirar acceso/);
  assert.match(js, /clinical_goal_publications/);
  assert.match(js, /publications = new Map\(\)/);
  assert.match(js, /publishingAvailable = false/);
  assert.match(js, /value="achieved"/);
  assert.match(js, /value="current"/);
  assert.doesNotMatch(js, /value="completed"/);
  assert.doesNotMatch(js, /value="high"/);
  assert.doesNotMatch(js, /value="normal"/);
});

test("portal only reads published unrevoked patient-specific copies", () => {
  const worker = read("worker.ts");
  const start = worker.indexOf("async function handlePatientPortalSession(");
  const end = worker.indexOf("/** Each file request revalidates", start);
  assert.ok(start !== -1 && end > start);
  const session = worker.slice(start, end);
  assert.match(session, /await patientPortalSession\(request, env\)/);
  assert.match(session, /clinical_goal_publications\?select=goal_id,display_title,description,published_at/);
  assert.match(session, /session.patient_id/);
  assert.match(session, /revoked_at=is.null/);
  assert.match(session, /!goalsResponse.ok/);
  assert.match(session, /goals: goals.map/);
  assert.doesNotMatch(session, /clinical_summary|work_notes|intervention_note/);
});

test("patient component uses text nodes and clears private data on logout", () => {
  const js = read("public/patient-goal-process.js");
  assert.match(js, /textContent = item.title/);
  assert.match(js, /textContent = item.description/);
  assert.match(js, /patient-portal-locked/);
  assert.match(js, /controller.abort\(\)/);
  assert.match(js, /credentials: "include"/);
  assert.doesNotMatch(js, /innerHTML|localStorage|sessionStorage/);
  const page = read("app/mi-espacio/page.tsx");
  assert.match(page, /id="space-goals-list"/);
  assert.match(page, /patient-goal-process.js/);
});
