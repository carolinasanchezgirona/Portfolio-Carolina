import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("clinical reviews are owner-only and never patient-portal exposed", () => {
  const sql = read("supabase/migrations/20261109140209_clinical_process_reviews_private.sql");
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /revoke all on table public\.clinical_process_reviews from public, anon, authenticated/i);
  assert.match(sql, /is_clinical_owner/);
  assert.match(sql, /on delete restrict/);
  assert.doesNotMatch(sql, /grant.+\s+to anon/i);
  const worker = read("worker.ts");
  const index = worker.indexOf("async function handlePatientPortalSession(");
  const end = worker.indexOf("/** Each file request revalidates", index);
  assert.ok(index > -1 && end > index);
  assert.doesNotMatch(worker.slice(index,end), /clinical_process_reviews/);
});

test("review records never change patient status or share content automatically", () => {
  const js = read("public/clinic-process-reviews.js");
  assert.match(js, /clinical_process_reviews\?select/);
  assert.match(js, /Nueva revisión/);
  assert.match(js, /Plan de mantenimiento/);
  assert.match(js, /review_date/);
  assert.match(js, /clinical_assessment/);
  assert.match(js, /patient_perspective/);
  assert.match(js, /maintenance_plan/);
  assert.match(js, /patient_id: patientId/);
  assert.match(js, /patient_id=eq\./);
  assert.doesNotMatch(js, /patient-portal\/response|clinical_goal_publications|portal_access_enabled|status: "discharged"/);
  assert.doesNotMatch(js, /localStorage|innerHTML = review\./);
});

test("consolidation drafts reuse the report editor with review and approval", () => {
  const js = read("public/clinic-process-reviews.js");
  assert.match(js, /clinic-new-report/);
  assert.match(js, /clinic-report-type", "clinical_summary"/);
  assert.match(js, /clinic-report-context/);
  assert.match(js, /clinic-report-evolution/);
  assert.match(js, /clinic-report-interventions/);
  assert.match(js, /clinic-report-current/);
  assert.match(js, /clinic-report-purpose/);
  assert.match(js, /No se ha compartido con el paciente/);
  assert.doesNotMatch(js, /clinic-approve-report\)\.click/);
});

test("review workspace is part of Treatment, without an extra top-level page", () => {
  const layout = read("app/admin/clinica/layout.tsx");
  const workspace = read("public/clinic-patient-workspace.js");
  assert.match(layout, /clinic-process-reviews\.js/);
  assert.match(workspace, /const reviews = select\("\.clinic-process-reviews"\)/);
  assert.match(workspace, /add\("tratamiento",reviews\)/);
});
