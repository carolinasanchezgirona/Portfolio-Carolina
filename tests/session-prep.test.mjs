import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home = readFileSync("app/entre-sesiones/app/panel.tsx", "utf8");
const homeCss = readFileSync("app/entre-sesiones/app/app.css", "utf8");
const portalMarkup = readFileSync("app/mi-espacio/page.tsx", "utf8");
const portalScript = readFileSync("public/mi-espacio.js", "utf8");
const prep = readFileSync("public/session-prep.js", "utf8");
const portalCss = readFileSync("app/mi-espacio/mi-espacio.css", "utf8");

test("home weekly plan uses only actual protected session materials", () => {
  assert.match(home, /status === "ready" && <section className="esapp-weekly-plan"/);
  assert.match(home, /const weeklyMaterials = \[\.\.\.active\]/);
  assert.match(home, /item\.patient_response_status === "draft"/);
  assert.match(home, /item\.review_due_at/);
  assert.match(home, /weeklyMaterials\.length \? weeklyMaterials\.map/);
  assert.match(home, /WELLNESS · SI TE APETECE/);
  assert.match(home, /No es una tarea prescrita/);
  assert.match(home, /const prepareSession = "\/entre-sesiones\/app\/espacio\/\?vista=panel#space-session-prep"/);
  assert.match(homeCss, /\.esapp-weekly-plan/);
});

test("preparation form has three voluntary prompts and no implied automatic consent", () => {
  for (const id of ["space-prep-difficult","space-prep-helped","space-prep-talk"]) {
    assert.match(portalMarkup, new RegExp('id="' + id + '"'));
  }
  assert.match(portalMarkup, /id="space-session-prep"/);
  assert.match(portalMarkup, /No se guardan automáticamente ni se envían a Carolina/);
  assert.match(portalMarkup, /Incorporar el resumen no lo guarda ni lo comparte/);
  assert.match(portalMarkup, /id="space-session-prep-target"/);
  assert.match(portalMarkup, /src="\/session-prep\.js\?v=/);
  assert.match(portalCss, /\.space-session-prep-privacy/);
  assert.match(portalCss, /@media\(max-width:680px\)/);
});

test("preparation module cannot auto-submit or persist responses", () => {
  assert.doesNotMatch(prep, /\bfetch\s*\(/);
  assert.doesNotMatch(prep, /\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b/);
  assert.doesNotMatch(prep, /\.innerHTML\s*=/);
  assert.doesNotMatch(prep, /\.submit\s*\(|\.requestSubmit\s*\(/);
  assert.match(prep, /record\.value = newValue/);
  assert.match(prep, /SIN guardar/);
  assert.match(prep, /therapyButton\?\.click\(\)/);
  assert.match(prep, /patient-portal-locked/);
  assert.match(prep, /clearPrivateNotes\(\)/);
  assert.match(prep, /patient-portal-view-ready/);
  assert.match(prep, /if \(!patientIsInPortal\(\)/);
  assert.match(prep, /navigator\.clipboard\.writeText\(exportedSummary\)/);
  assert.match(prep, /window\.confirm/);
});

test("existing clinical response save/share remains the only server sharing path", () => {
  assert.match(portalScript, /details\.dataset\.patientMaterialId = String\(item\.id \|\| ""\)/);
  assert.match(portalScript, /new Event\("patient-portal-locked"\)/);
  assert.match(portalScript, /new Event\("patient-portal-view-ready"\)/);
  assert.match(portalScript, /fetch\("\/api\/patient-portal\/response"/);
  assert.match(portalScript, /draft\.addEventListener\("click", \(\) => savePatientMaterialResponse\(item, form, "draft"/);
  assert.match(portalScript, /share\.addEventListener\("click", \(\) => \{/);
  assert.match(portalScript, /window\.confirm\("¿Compartir estas respuestas con Carolina\?/);
  assert.match(portalScript, /void savePatientMaterialResponse\(item, form, "share"/);
});
