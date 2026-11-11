import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const portal = readFileSync("public/mi-espacio.js", "utf8");
const admin = readFileSync("public/admin-clinica.js", "utf8");
const worker = readFileSync("worker.ts", "utf8");
const sql = readFileSync("supabase/migrations/20261111072000_clinical_exercise_response_events.sql", "utf8");
const patientPage = readFileSync("app/mi-espacio/page.tsx", "utf8");

test("Patient opens an entire private PDF alongside its editable fields", () => {
  assert.match(portal, /function appendCompletePdfToForm/);
  assert.match(portal, /\/api\/patient-portal\/file\?id=/);
  assert.match(portal, /reader\.src = url/);
  assert.match(portal, /reader\.referrerPolicy = "no-referrer"/);
  assert.match(portal, /space-fillable-workspace/);
  assert.match(portal, /appendCompletePdfToForm\(readingPart\.content, sourceFile\)/);
  assert.match(portal, /appendInteractiveQuestions\(answerTarget, item, documentData\)/);
  assert.match(portal, /answerTarget\.append\(actions, responseStatus\)/);
  assert.match(portal, /textContent = "Abrir y responder"/);
  assert.match(portal, /navigateToView\("therapy"\)/);
  assert.doesNotMatch(portal, /import\("\/vendor\/pdfjs\/pdf\.mjs"\)/);
  assert.match(patientPage, /mi-espacio\.js\?v=20261111-cuadernos-secciones-1/);
});

test("Original file stays private and PDF embedding is restricted to same origin", () => {
  assert.match(worker, /"X-Frame-Options": safeMime === "application\/pdf" \? "SAMEORIGIN" : "DENY"/);
  assert.match(worker, /"Content-Security-Policy": safeMime === "application\/pdf" \? "frame-ancestors 'self'" : "frame-ancestors 'none'"/);
  assert.match(worker, /patientPortalSession\(request, env\)/);
  assert.match(worker, /share_revoked_at=is\.null/);
  assert.doesNotMatch(portal, /storage\/v1\/object\/public\/clinical-documents/);
});

test("Full PDF answers can be published without transcribing every prompt", () => {
  assert.match(portal, /Escribe las respuestas a las actividades del PDF/);
  assert.match(portal, /form\.querySelector\("\[data-response-record\]"\)/);
  assert.match(worker, /!definitions\.length && !String\(doc\.record_prompt \|\| ""\)\.trim\(\)/);
  assert.doesNotMatch(admin, /El formulario está vinculado a un PDF, pero aún no tiene preguntas/);
  assert.match(admin, /if \(releasing && formSourceDocumentId/);
  assert.match(admin, /clinic-form-source-reviewed/);
});

test("Each submitted set is archived independently and remains clinician-only", () => {
  assert.match(sql, /create table if not exists public\.clinical_exercise_response_events/i);
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /revoke all on table public\.clinical_exercise_response_events from anon, authenticated/i);
  assert.match(sql, /grant select on table public\.clinical_exercise_response_events to authenticated/i);
  assert.match(sql, /admin_mobile_gate\(\)/);
  assert.match(sql, /if new\.patient_response_status = 'shared'/i);
  assert.match(sql, /after update of patient_response, patient_response_status, patient_response_shared_at/i);
  assert.match(admin, /clinical_exercise_response_events\?select=/);
  assert.match(admin, /Historial de entregas/);
  assert.match(admin, /Formulario cumplimentado/);
  assert.match(admin, /sin validar cl[ií]nicamente/);
});
