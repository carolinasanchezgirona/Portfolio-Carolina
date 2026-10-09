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

test("PDF renderer is accessible only with a server-side service key", () => {
  const handler = edge.split("async function renderAuthenticatedPortalPdf(")[1]?.split("Deno.serve(")[0];
  assert.ok(handler);
  assert.match(handler, /req\.headers\.get\("Authorization"\) !== "Bearer " \+ SERVICE_ROLE_KEY/);
  assert.match(edge, /Legacy bearer links are retired/);
  assert.match(edge, /req\.headers\.get\("x-portal-pdf"\) === "1"/);
});

test("portal UI offers per-material download without sharing written responses", () => {
  assert.match(portal, /downloadPatientMaterial\(item, downloadButton, downloadStatus\)/);
  assert.match(portal, /\/api\/patient-portal\/material-pdf\?material_id=/);
  assert.match(portal, /downloadButton\.textContent = "↓ Descargar PDF"/);
  assert.match(portal, /URL\.revokeObjectURL/);
});
