import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const file = name => readFileSync(name,"utf8");
const main = file("public/admin-clinica.js");
const workspace = file("public/clinic-patient-workspace.js");
const layout = file("app/admin/clinica/layout.tsx");

test("patient workspace provides seven navigable areas without duplicate medical records", () => {
  for(const tab of ["resumen","datos","historia","evaluacion","tratamiento","sesiones","documentos"]){
    assert.match(workspace,new RegExp('\\"'+tab+'\\"'));
  }
  assert.match(workspace,/#clinic-patient-form/);
  assert.match(workspace,/form\.append\(bottomSave\)/);
  assert.match(workspace,/panels\.get\(id\)\.append\(node\)/);
  assert.match(workspace,/form\.addEventListener\("invalid"/);
  assert.match(workspace,/button\.type = "button"/);
  assert.match(workspace,/window\.ClinicPatientWorkspace/);
  assert.doesNotMatch(workspace,/localStorage|sessionStorage|innerHTML/);
  assert.match(layout,/clinic-patient-workspace\.js/);
});

test("patient widgets refresh when the in-page patient record becomes visible", () => {
  for(const name of ["clinic-patient-dashboard","clinic-goals-manager","clinic-admin-tasks","clinic-scale-trends"]){
    const script=file("public/"+name+".js");
    assert.match(script,/\.hidden/);
    assert.doesNotMatch(script,/patientDialog\.open|dialog\.open/);
    assert.match(script,/attributeFilter:\s*\["hidden"\]/);
  }
});

test("pre-session brief is factual and uses only patient-linked authorized in-memory records", () => {
  const start=main.indexOf("function renderPreparation(patient)");
  const end=main.indexOf("function openSession(patient, appointment)",start);
  assert.ok(start>=0 && end>start);
  const brief=main.slice(start,end);
  for(const term of [
    'patientSessions(patient.id)', 'status === "approved"', 'patientGoals(patient.id)',
    'patientExercises(patient.id)', 'item.patient_id === patient.id',
    'measurements[0]', 'openReports', 'patient.next_session_focus',
    'profile.risk_safety', 'No sustituye la valoración profesional'
  ]) assert.ok(brief.includes(term),term);
  assert.match(brief,/document\.createTextNode/);
  assert.doesNotMatch(brief,/innerHTML|fetch\(|localStorage|eval\(/);
});
