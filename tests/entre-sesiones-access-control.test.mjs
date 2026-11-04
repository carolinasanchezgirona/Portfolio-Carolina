import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const worker = readFileSync("worker.ts", "utf8");
const edge = readFileSync("supabase/functions/patient-portal-auth/index.ts", "utf8");
const admin = readFileSync("public/admin-clinica.js", "utf8");
const page = readFileSync("app/admin/clinica/page.tsx", "utf8");
const migration = readFileSync("supabase/migrations/20261104_patient_portal_manual_access_revocation.sql", "utf8");

test("portal access is enforced on every authenticated request and fails closed", () => {
  assert.match(worker, /async function patientPortalSession\(/);
  assert.match(worker, /portal_access_enabled=eq\.true&limit=1/);
  assert.match(worker, /if \(!access\?\.ok\) return null/);
  assert.match(worker, /if \(!Array\.isArray\(accessRows\) \|\| accessRows\.length !== 1\) return null/);
});

test("only a verified professional with the MFA gate can change access", () => {
  assert.match(worker, /async function handleAdminPatientPortalAccess\(/);
  assert.match(worker, /patientPortalSameOrigin\(request\)/);
  assert.match(worker, /if \(!await verifyEditorialOwner\(request\)\)/);
  assert.match(worker, /rpc\/admin_set_patient_portal_access/);
  assert.match(worker, /api\/admin\/patient-portal-access/);
  assert.match(worker, /body\.enabled !== "boolean"/);
});

test("both one-time-code and password flows reject suspended patients", () => {
  assert.match(edge, /portal_access_enabled=eq\.true&limit=500/);
  assert.match(edge, /portal_access_enabled=eq\.true&limit=2/);
  assert.match(edge, /const eligible = await fetch\(/);
  assert.match(edge, /portal_access_enabled=eq\.true&limit=1/);
});

test("deactivation revokes sessions, removes codes and writes an audit event atomically", () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.admin_set_patient_portal_access/);
  assert.match(migration, /SECURITY INVOKER/);
  assert.match(migration, /portal_access_enabled = p_enabled/);
  assert.match(migration, /UPDATE public\.patient_portal_sessions/);
  assert.match(migration, /DELETE FROM public\.patient_portal_login_codes/);
  assert.match(migration, /INSERT INTO public\.patient_portal_access_events/);
  assert.match(migration, /REVOKE ALL ON FUNCTION public\.admin_set_patient_portal_access\(uuid, boolean\) FROM PUBLIC, anon, authenticated/);
});

test("the patient's clinical record remains independent of portal eligibility", () => {
  assert.match(page, /id="clinic-portal-access-status"/);
  assert.match(page, /id="clinic-portal-access-toggle"/);
  assert.match(admin, /async function togglePatientPortalAccess\(/);
  assert.match(admin, /clinic-portal-access-toggle/);
  assert.match(admin, /portal_access_enabled: result\.enabled/);
  assert.match(admin, /portal_access_disabled_at: result\.enabled \? null : result\.changed_at/);
  assert.doesNotMatch(migration, /DELETE FROM public\.clinical_patients/);
});
