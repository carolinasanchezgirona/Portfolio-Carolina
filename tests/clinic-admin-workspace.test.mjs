import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const js = readFileSync("public/admin-clinica.js", "utf8");
const page = readFileSync("app/admin/clinica/page.tsx", "utf8");
const styles = readFileSync("app/admin/clinica/clinica.css", "utf8");

test("the report opens within the patient's workspace, not as a modal", () => {
  assert.match(js, /els\.patientDialog\.append\(els\.reportDialog\)/);
  assert.match(js, /els\.reportDialog\.show\(\)/);
  assert.doesNotMatch(js, /els\.reportDialog\.showModal\(\)/);
  assert.match(js, /els\.patientForm\.hidden = true/);
  assert.match(js, /function closeReportEditor/);
  assert.match(styles, /\.clinic-patient-page \.clinic-report-workspace\[open\]/);
  assert.match(styles, /#clinic-patient-form\[hidden\]/);
});

test("report inputs are visible and include clinician-reviewed integration and conclusions", () => {
  assert.match(js, /panel\.hidden = !active/);
  assert.match(js, /sheet\.hidden = false/);
  assert.match(js, /\["integration", "Integración e impresión clínica/);
  assert.match(js, /\["conclusions", "Conclusiones/);
  assert.match(page, /clinic-report-save-state/);
  assert.match(js, /Descargar Word editable/);
});

test("report drafts are automatically saved only to authorized server records", () => {
  assert.match(js, /function scheduleReportAutoSave/);
  assert.match(js, /persistReport\("draft", \{ auto: true \}\)/);
  assert.match(js, /3500/);
  assert.match(js, /clinical_reports\?id=eq/);
  assert.match(js, /status === "approved"\)\) throw new Error/);
  assert.match(js, /reportSaveActive/);
  assert.doesNotMatch(js, /localStorage\.setItem\([^\n]*report/);
});

test("navigation checks unsaved patient reports and session work", () => {
  assert.match(js, /window\.addEventListener\("beforeunload"/);
  assert.match(js, /patientFormSnapshot\(\) !== patientFormBaseline/);
  assert.match(js, /const reportUnsaved =/);
  assert.match(js, /const sessionUnsaved =/);
  assert.match(js, /function closeSessionEditor/);
  assert.match(js, /function closeReportEditor/);
  assert.match(js, /reportSaveActive\) \{ reportSaveState/);
});

test("all Word, Save, Print and revised-Word actions remain available", () => {
  for (const name of ["clinic-generate-report", "clinic-save-report", "clinic-print-report", "clinic-upload-revised-word"]) assert.ok(page.includes(name), name);
  assert.match(js, /window\.ClinicWordExport\.download/);
  assert.match(js, /persistReport\("draft"\)/);
});

test("session autosave only stores draft notes and preserves manual approval", () => {
  assert.match(js, /function scheduleSessionAutoSave/);
  assert.match(js, /persistClinicalSession\("draft", \{ auto: true \}\)/);
  assert.match(js, /sessionSaveActive/);
  assert.match(js, /sessionFormSnapshot/);
  assert.match(js, /function closeSessionEditor/);
  assert.match(page, /clinic-session-autosave-state/);
  assert.match(js, /persistClinicalSession\("approved"\)/);
  assert.match(js, /window\.addEventListener\("beforeunload"/);
});
