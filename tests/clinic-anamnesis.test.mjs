import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");
const moduleJs=read("public/clinic-anamnesis.js");
const schema=read("supabase/migrations/20261121_clinical_anamnesis_records_v1.sql");
const workspace=read("public/clinic-patient-workspace.js");
const layout=read("app/admin/clinica/layout.tsx");

test("Anamnesis aparece como pestaña propia sin sustituir Historia y Evaluación",()=>{
  for (const tab of ["anamnesis","evaluacion","historia"]) {
    assert.match(workspace,new RegExp('\\["'+tab+'"'));
  }
  assert.match(layout,/clinic-anamnesis\.js/);
  assert.match(layout,/import "\.\/anamnesis\.css"/);
});

test("Los cinco circuitos especializados están descritos y el TDAH mantiene su registro previo",()=>{
  for (const key of ["tea_adultos","memoria_deterioro","altas_capacidades","dislexia","neuropsicologia_general"]) {
    assert.match(moduleJs,new RegExp(key));
    assert.match(schema,new RegExp("'"+key+"'"));
  }
  assert.match(moduleJs,/ClinicPatientWorkspace\?\.activate\?\.\("evaluacion"\)/);
  assert.doesNotMatch(moduleJs,/clinical_adhd_forms.*(?:POST|PATCH)/);
});

test("Los datos clínicos solo van al almacenamiento autorizado, sin caché web",()=>{
  assert.match(schema,/enable row level security/i);
  assert.match(schema,/revoke all on table public\.clinical_anamnesis_records from public, anon, authenticated/i);
  assert.match(schema,/for select to authenticated using \(\(select public\.is_clinical_owner\(\)\)\)/);
  assert.match(schema,/for update to authenticated/i);
  assert.match(schema,/status <> 'reviewed'/);
  assert.doesNotMatch(moduleJs,/localStorage\.(?:setItem|getItem)|service_role\s*[:=]|innerHTML\s*=/);
  assert.match(moduleJs,/sessionStorage/);
  assert.match(moduleJs,/clinical_anamnesis_records\?id=eq/);
  assert.match(moduleJs,/revision=eq/);
});

test("Guardado por paciente, versión, bloqueo y exportación revisable",()=>{
  assert.match(moduleJs,/patient_id=eq/);
  assert.match(moduleJs,/setTimeout\(\(\)=>\{ void saveCurrent\(\); \},1300\)/);
  assert.match(moduleJs,/const recoveries=new Map\(\)/);
  assert.match(moduleJs,/async function reviewCurrent/);
  assert.match(moduleJs,/async function copyForReport/);
  assert.match(moduleJs,/async function printRecord/);
  assert.match(moduleJs,/age<6/);
  assert.match(moduleJs,/age<18/);
});