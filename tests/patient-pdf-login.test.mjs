import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("app/mi-espacio/page.tsx", "utf8");
const portal = readFileSync("public/mi-espacio.js", "utf8");
const css = readFileSync("app/mi-espacio/mi-espacio.css", "utf8");
const worker = readFileSync("worker.ts", "utf8");
const renderer = readFileSync("supabase/functions/view-clinical-exercise/index.ts", "utf8");

test("initial phase does not flash a login while a session is checked", () => {
  assert.match(page, /className="space-page" data-portal-phase="checking"/);
  assert.match(page, /id="space-session-check"/);
  assert.match(page, /id="space-access" className="space-access" hidden/);
  assert.match(page, /id="space-shell" className="space-shell" hidden/);
  assert.match(css, /\.space-page\[data-portal-phase="checking"\] \.space-access/);
  assert.match(portal, /readingPage\.dataset\.portalPhase = checking \? "checking" : "signed-out"/);
  assert.match(portal, /readingPage\.dataset\.portalPhase = "authenticated"/);
  assert.match(portal, /if \(!configuringPassword\) void loadPatientSession\(\)/);
});

test("PDF uses browser-native authenticated attachment and no popup", () => {
  assert.match(portal, /return "\/api\/patient-portal\/material-pdf\?material_id="/);
  assert.match(portal, /downloadLink\.download = "entre-sesiones\.pdf"/);
  assert.doesNotMatch(portal, /downloadLink\.target\s*=\s*"_blank"/);
  assert.match(worker, /async function handlePatientPortalMaterialPdf/);
  assert.match(worker, /await patientPortalSession\(request, env\)/);
  assert.match(worker, /encodeURIComponent\(session\.patient_id\)/);
  assert.match(worker, /&revoked_at=is\.null&status=in\.\(sent,assigned,reviewed\)/);
  assert.match(worker, /"X-Portal-Pdf": "1"/);
  assert.match(worker, /"Content-Type": "application\/pdf"/);
  assert.match(worker, /"Content-Disposition": rendered\.headers\.get\("content-disposition"\)/);
  assert.match(worker, /"Cache-Control": "private, no-store, max-age=0"/);
});

test("renderer authenticates service credentials using restricted project admin API", () => {
  assert.match(renderer, /async function verifyPortalPdfService/);
  assert.match(renderer, /const credential = authorization\.slice\("Bearer "\.length\)/);
  assert.match(renderer, /const candidates = \[credential/);
  assert.match(renderer, /\/auth\/v1\/admin\/users\?page=1&per_page=1/);
  assert.match(renderer, /headers: \{ apikey: apiKey, Authorization: authorization \}/);
  assert.match(renderer, /if \(verification\.status === 200\) return true/);
  assert.match(renderer, /return false;\s*}\s*async function renderAuthenticatedPortalPdf/);
  assert.match(renderer, /if \(!await verifyPortalPdfService\(req\)\)/);
  assert.match(renderer, /input\.action !== "portal-pdf"/);
  assert.match(renderer, /await pdfResponse\(input\.title\.trim\(\), doc/);
  assert.doesNotMatch(renderer, /JSON\.parse\(atob\(/);
});
