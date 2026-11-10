import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const admin = readFileSync("public/admin-clinica.js", "utf8");
const page = readFileSync("app/admin/clinica/page.tsx", "utf8");
const worker = readFileSync("worker.ts", "utf8");
const portal = readFileSync("public/mi-espacio.js", "utf8");

test("a PDF opens the existing draft, never a duplicate automatically", () => {
  assert.match(admin, /function convertPatientPdfToInteractiveForm\(doc\)/);
  assert.match(admin, /item\.patient_document\?\.source_document_id === doc\.id/);
  assert.match(admin, /openPreparedExercise\(existing\)/);
  assert.match(admin, /Ya existe un formulario publicado para este PDF/);
  assert.match(admin, /const summaryOnly =/);
});

test("PDF forms can be saved, reviewed and published without email", () => {
  assert.match(page, /id="clinic-save-exercise"/);
  assert.match(page, /id="clinic-form-source-reviewed"/);
  assert.match(page, /id="clinic-publish-form"/);
  assert.match(admin, /invalidatePdfFormReview\(\)/);
  assert.match(admin, /async function saveExercise\(sendAfterSave, publishToPortal = false\)/);
  assert.match(admin, /publishExistingAssignment\(rows\[0\]\)/);
  assert.match(admin, /publishExistingAssignment\(saved\)/);
  assert.match(admin, /\/api\/admin\/clinical-form-publish/);
  assert.match(admin, /No se ha enviado ningún correo/);
  assert.match(page, /pdf-editor-open-3/);
});

test("publication is checked server-side against clinician, source and questions", () => {
  const handler = worker.split("async function handleAdminClinicalFormPublish(")[1]
    ?.split("async function handlePatientPortalResponse(")[0];
  assert.ok(handler, "publication handler must be defined");
  assert.match(handler, /request\.method !== "POST"/);
  assert.match(handler, /patientPortalSameOrigin\(request\)/);
  assert.match(handler, /verifyEditorialOwner\(request\)/);
  assert.match(handler, /env\.SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(handler, /assignment\.status !== "prepared"/);
  assert.match(handler, /doc\.conversion_review_required !== true/);
  assert.match(handler, /doc\.conversion_reviewed_at/);
  assert.match(handler, /definitions\.length < 1 \|\| definitions\.length > 30/);
  assert.match(handler, /ids\.has\(id\)/);
  assert.match(handler, /original\.mime_type !== "application\/pdf"/);
  assert.match(handler, /original\.category !== "intervention_plan"/);
  assert.match(handler, /patient_id=eq\./);
  assert.match(handler, /shared_at=not\.is\.null&share_revoked_at=is\.null/);
  assert.match(handler, /&status=eq\.prepared&revoked_at=is\.null&select=id/);
  assert.match(handler, /status: "assigned"/);
  assert.doesNotMatch(handler, /send-clinical-exercise|BREVO_API_KEY|storage\/v1\/object\/public/);
  assert.match(worker, /\/api\/admin\/clinical-form-publish/);
});

test("patients see only assigned materials and save in their own private session", () => {
  assert.match(worker, /revoked_at=is\.null&status=in\.\(sent,assigned,reviewed\)/);
  assert.match(worker, /patientPortalSession\(request, env\)/);
  assert.match(worker, /patient_response_status: action === "share" \? "shared" : "draft"/);
  assert.match(portal, /\/api\/patient-portal\/file\?id=/);
  assert.match(portal, /control\.dataset\.formAnswer = def\.id/);
});
