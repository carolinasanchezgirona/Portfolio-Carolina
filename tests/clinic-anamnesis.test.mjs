import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as vm from "node:vm";
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

test("Las cinco anamnesis 2.0 disponen de entrevista extensa, formatos seleccionables y fuentes académicas",()=>{
  const {runInNewContext}=requireVm();
  const fakeWindow={dispatchEvent(){}};
  runInNewContext(read("public/clinic-anamnesis-forms.js"),{
    window:fakeWindow,Event:class Event{constructor(type){this.type=type;}}
  },{timeout:1200});
  const forms=fakeWindow.ClinicAnamnesisForms;
  assert.equal(forms.version,"2.0");
  const expected=["tea_adultos","memoria_deterioro","altas_capacidades","dislexia","neuropsicologia_general"];
  assert.deepEqual(Object.keys(forms.profiles).sort(),expected.sort());
  for (const [key,profile] of Object.entries(forms.profiles)) {
    assert.ok(profile.sources.length>=2,key+" sin referencias");
    assert.ok(profile.sections.length>=4,key+" sin desarrollo clínico suficiente");
    const items=[...forms.common,...profile.sections].flatMap(section=>section.questions);
    assert.ok(items.length>=75,key+": "+items.length+" preguntas");
    assert.ok(items.filter(q=>q.kind==="checks").length>=10,key+" sin casillas suficientes");
    assert.ok(items.filter(q=>q.kind==="select").length>=25,key+" sin respuestas seleccionables");
    assert.equal(new Set(items.map(q=>q.key)).size,items.length,key+" con claves repetidas");
    for (const item of items) {
      assert.match(item.key,/^[a-z][a-z0-9_]*$/);
      assert.ok(item.label);
      if (["checks","select"].includes(item.kind)) assert.ok(item.options.length>=2,item.key);
    }
  }
});

test("La ficha estructura selectores, checkboxes, guardado por versión y conserva formularios históricos",()=>{
  assert.match(moduleJs,/formSections\(current\)/);
  assert.match(moduleJs,/String\(current\.protocol_version\|\|"1\.0"\)==="1\.0"/);
  assert.match(moduleJs,/renderQuestion\(question, previous, readonly\)/);
  assert.match(moduleJs,/checkbox\.type="checkbox"/);
  assert.match(moduleJs,/input\.add\(new Option\("Sin responder \/ seleccionar…",""\)\)/);
  assert.match(moduleJs,/input\.type=kind==="date"\|\|kind==="number"\?kind:"text"/);
  assert.match(moduleJs,/protocol_version:"2\.0"/);
  assert.match(moduleJs,/const earlier=records\.find/);
  assert.match(moduleJs,/Array\.isArray\(answer\)\?answer\.join/);
  assert.match(moduleJs,/document\.createElement|node\("details"/);
  assert.match(read("app/admin/clinica/layout.tsx"),/clinic-anamnesis-forms\.js/);
});

function requireVm(){
  return {runInNewContext:vm.runInNewContext};
}
