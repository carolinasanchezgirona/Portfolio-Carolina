import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const portal = readFileSync("public/mi-espacio.js", "utf8");
const admin = readFileSync("public/admin-clinica.js", "utf8");
const worker = readFileSync("worker.ts", "utf8");
const patientPage = readFileSync("app/mi-espacio/page.tsx", "utf8");
const adminPage = readFileSync("app/admin/clinica/page.tsx", "utf8");

test("clinical goal forms are authored only by the professional", () => {
  assert.match(adminPage, /id="clinic-interactive-fields"/);
  assert.match(adminPage, /id="clinic-add-interactive-field"/);
  assert.match(admin, /function normalizedInteractiveFields/);
  assert.match(admin, /form_fields: normalizedInteractiveFields\(interactiveFormFields\)/);
  assert.match(admin, /patient_response_status !== "shared"/);
  assert.match(admin, /fieldDefinitions\.find\(entry => entry\.id === fieldId\)/);
});

test("patient can save drafts and share individually prescribed form answers", () => {
  assert.match(portal, /function appendInteractiveQuestions/);
  assert.match(portal, /item\?\.patient_response\?\.form_answers/);
  assert.match(portal, /form_answers: formAnswers/);
  assert.match(portal, /data-form-answer/);
  assert.match(portal, /details\.addEventListener\("change", markUnsaved\)/);
  assert.match(portal, /fetch\("\/api\/patient-portal\/response"/);
  assert.match(patientPage, /mi-espacio\.js\?v=20261110-objective-forms-1/);
});

test("server binds answers to authenticated patient's assigned fields", () => {
  assert.match(worker, /const session = await patientPortalSession\(request, env\)/);
  assert.match(worker, /clinical_exercise_assignments\?select=id,content,patient_document&patient_id=eq/);
  assert.match(worker, /const definitions = Array\.isArray\(document\.form_fields\)/);
  assert.match(worker, /const fields = new Map<string,/);
  assert.match(worker, /!field \|\| typeof rawValue !== "string"/);
  assert.match(worker, /fields\.get\(id\)/);
  assert.match(worker, /form_answers: formAnswers/);
  assert.match(worker, /patient_response_status: action === "share" \? "shared" : "draft"/);
});


test("original goal PDF is linked without copying into a public asset", () => {
  assert.match(admin, /function convertPatientPdfToInteractiveForm\(doc\)/);
  assert.match(admin, /doc\.mime_type === "application\/pdf" && doc\.category === "intervention_plan"/);
  assert.match(admin, /formSourceDocumentId = doc\.id/);
  assert.match(admin, /source_document_id: formSourceDocumentId/);
  assert.match(admin, /interactiveFormFields = \[\]; \/\/ Never invent questions/);
  assert.match(admin, /if \(!docForQuality\.form_fields\.length\)/);
  assert.match(portal, /source_document_id/);
  assert.match(portal, /state\.portalData\?\.files/);
  assert.match(portal, /\/api\/patient-portal\/file\?id=/);
  assert.doesNotMatch(portal, /storage\/v1\/object\/public\/clinical-documents/);
});


test("source PDFs remain patient-specific and only shared originals may be assigned", () => {
  assert.match(admin, /d\.patient_id === currentPatient\.id/);
  assert.match(admin, /!linkedDoc\.shared_at \|\| linkedDoc\.share_revoked_at/);
  assert.match(admin, /const \{ source_document_id, \.\.\.documentForLibrary \}/);
  assert.match(admin, /const \{ source_document_id, \.\.\.doc \} = patientDocumentFromForm/);
  assert.doesNotMatch(portal, /source_document_name/);
});
