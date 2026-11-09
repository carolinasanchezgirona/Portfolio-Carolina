import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(path, "utf8");
const page = read("app/mi-espacio/page.tsx");
const runtime = read("public/mi-espacio.js");
const portalCss = read("app/mi-espacio/mi-espacio.css");
const appCss = read("app/entre-sesiones/app/app.css");
const home = read("app/entre-sesiones/app/panel.tsx");

test("patient-facing app and its runtime contain no retired module branding", () => {
  for (const [name, content] of Object.entries({ page, runtime, portalCss, appCss, home })) {
    assert.doesNotMatch(content, /wellness/i, name + " contains a retired module reference");
  }
  assert.match(page, /data-space-panel="today"/);
  assert.match(page, /data-space-panel="therapy"/);
  assert.match(page, /data-space-panel="account"/);
  assert.doesNotMatch(page, /data-space-panel="(?:progreso|wellness)"/);
});

test("patient privacy and account-scoped reading preferences stay intact", () => {
  assert.match(runtime, /const READING_KEY = "patient_reading_preferences_v1"/);
  assert.match(runtime, /function scopedPatientKey\(base\)/);
  assert.match(runtime, /function usePatientStorageScope\(scope\)/);
  assert.match(runtime, /async function loadPatientStorageScope\(\)/);
  assert.match(runtime, /state\.storageScopeVersion\+\+/);
  assert.match(runtime, /fetch\("\/api\/patient-portal\/preferences"/);
  assert.match(runtime, /localStorage\.setItem\(scopedPatientKey\(READING_KEY\)/);
  assert.match(runtime, /credentials: "include"/);
  assert.match(runtime, /patientMaterials\?\.replaceChildren\(\)/);
  assert.match(runtime, /patientFiles\?\.replaceChildren\(\)/);
  assert.match(runtime, /patient-portal-locked/);
  assert.match(runtime, /window\.addEventListener\("pageshow"/);
});

test("retiring general activities never deletes clinical answers or mood records", () => {
  assert.doesNotMatch(runtime, /localStorage\.clear\(|sessionStorage\.clear\(/);
  assert.match(runtime, /if \(!state\.portalAuthenticated \|\| !state\.storageScope\) return/);
  assert.match(runtime, /localStorage\.removeItem\(key\)/);
  assert.match(runtime, /Restablecer las preferencias de lectura/);
  assert.match(page, /Restablecer preferencias de lectura/);
  assert.doesNotMatch(runtime, /state\.completed|state\.favorites/);
  assert.doesNotMatch(runtime, /renderWellness|renderProgress/);
});
