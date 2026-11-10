import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const admin = readFileSync("public/admin-clinica.js","utf8");
const screen = readFileSync("app/admin/clinica/page.tsx","utf8");
const functionCode = readFileSync("supabase/functions/send-clinical-exercise/index.ts","utf8");
const worker = readFileSync("worker.ts","utf8");

test("Drafts created from source PDFs have an explicit clinical signoff",()=>{
  assert.match(screen,/id="clinic-form-source-reviewed"/);
  assert.match(admin,/conversion_review_required: true/);
  assert.match(admin,/conversion_reviewed_at:/);
  assert.match(admin,/function openPreparedExercise\(item\)/);
  assert.match(admin,/editingAssignmentId = item\.id/);
  assert.match(admin,/method: "PATCH"/);
  assert.match(admin,/id === editingAssignmentId/);
});

test("Admin cannot send unreviewed PDF adaptations from list or composer",()=>{
  assert.match(admin,/send\.disabled = Boolean\(item\.patient_document\?\.conversion_review_required/);
  assert.match(admin,/function sendExistingAssignment/);
  assert.match(admin,/formulario necesita cotejo profesional/);
  assert.match(admin,/Confirma el cotejo de las consignas con el PDF original/);
});

test("Production email backend requires signoff and source belonging to same patient",()=>{
  assert.match(functionCode,/if\(doc\.conversion_review_required\)/);
  assert.match(functionCode,/conversion_reviewed_at/);
  assert.match(functionCode,/clinical_documents\?select=id/);
  assert.match(functionCode,/patient_id=eq/);
  assert.match(functionCode,/shared_at=not\.is\.null/);
  assert.match(functionCode,/share_revoked_at=is\.null/);
  assert.match(functionCode,/user\?\.id!==ALLOWED_USER_ID/);
});

test("Prepared materials never appear on the patient portal",()=>{
  assert.match(worker,/revoked_at=is\.null&status=in\.\(sent,assigned,reviewed\)/);
  assert.doesNotMatch(worker,/revoked_at=is\.null&status=in\.\(prepared/);
});
