import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const worker = readFileSync(new URL("../worker.ts", import.meta.url), "utf8");
const portal = readFileSync(new URL("../public/mi-espacio.js", import.meta.url), "utf8");
const edge = readFileSync(new URL("../supabase/functions/view-clinical-exercise/index.ts", import.meta.url), "utf8");

test("download is only available for authenticated patient and owned, non-revoked assignment", () => {
  const handler = worker.split("async function handlePatientPortalMaterialPdf(")[1]?.split("const PATIENT_PORTAL_ALLOWED_AVATARS")[0];
  assert.ok(handler, "Authenticated PDF route must exist");
  assert.match(handler, /patientPortalSession\(request, env\)/);
  assert.match(handler, /clinical_patients\?select=id/);
  assert.match(handler, /status=neq\.archived/);
  assert.match(handler, /patient_id=eq\./);
  assert.match(handler, /revoked_at=is\.null/);
  assert.match(handler, /status=in\.\(sent,assigned,reviewed\)/);
  assert.match(handler, /Cache-Control": "private, no-store/);
  assert.ok(!handler.includes("patient_response"), "Patient answers must not be sent into a downloaded prescription PDF");
});

test("PDF renderer requires project-verified service role even after key rotation", () => {
  const auth = edge.split("async function verifyPortalPdfService(")[1]?.split("async function renderAuthenticatedPortalPdf(")[0];
  const handler = edge.split("async function renderAuthenticatedPortalPdf(")[1]?.split("Deno.serve(")[0];
  assert.ok(auth && handler);
  assert.match(auth, /authorization === "Bearer " \+ SERVICE_ROLE_KEY/);
  assert.match(auth, /\/auth\/v1\/admin\/users\?page=1&per_page=1/);
  assert.match(auth, /headers: \{ apikey: ANON_KEY, Authorization: authorization \}/);
  assert.match(auth, /return verification\.status === 200/);
  assert.match(handler, /if \(!await verifyPortalPdfService\(req\)\)/);
  assert.doesNotMatch(auth, /atob\(|JSON\.parse\(.*jwt|verify_jwt: false/);
  assert.match(edge, /Legacy bearer links are retired/);
  assert.match(edge, /req\.headers\.get\("x-portal-pdf"\) === "1"/);
});

test("patient PDF downloads use a protected first-party native link, not a synthetic blob click", () => {
  assert.match(portal, /function patientMaterialDownloadUrl\(item\)/);
  assert.match(portal, /\/api\/patient-portal\/material-pdf\?material_id=/);
  assert.match(portal, /downloadLink\.href = patientMaterialDownloadUrl\(item\)/);
  assert.match(portal, /downloadLink\.download = "entre-sesiones\.pdf"/);
  assert.match(portal, /downloadLink\.rel = "noopener noreferrer"/);
  assert.doesNotMatch(portal, /URL\.createObjectURL\(blob\)/);
  assert.doesNotMatch(portal, /downloadPatientMaterial\(item, downloadButton, downloadStatus\)/);
});

test("patient portal does not show password form during initial session check", () => {
  const page = readFileSync(new URL("../app/mi-espacio/page.tsx", import.meta.url), "utf8");
  const style = readFileSync(new URL("../app/mi-espacio/mi-espacio.css", import.meta.url), "utf8");
  assert.match(page, /id="space-session-check"/);
  assert.match(page, /id="space-access" className="space-access" hidden/);
  assert.match(portal, /const sessionCheck = document\.getElementById\("space-session-check"\)/);
  assert.match(portal, /if \(sessionCheck\) sessionCheck\.hidden = true/);
  assert.match(style, /\.space-page \.space-session-check\[hidden\]\{display:none!important\}/);
});
