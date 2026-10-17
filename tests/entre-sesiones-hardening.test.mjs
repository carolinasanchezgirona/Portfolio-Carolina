import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const worker = readFileSync("worker.ts","utf8");
const admin = readFileSync("public/admin-clinica.js","utf8");
const summary = readFileSync("public/clinic-patient-dashboard.js","utf8");
const portal = readFileSync("public/mi-espacio.js","utf8");
const portalPage = readFileSync("app/mi-espacio/page.tsx","utf8");
const mood = readFileSync("app/mi-espacio/mood-tracker.tsx","utf8");
const home = readFileSync("app/entre-sesiones/app/panel.tsx","utf8");
const css = readFileSync("app/mi-espacio/mi-espacio.css","utf8");

test("clinician review scheduling reuses protected exercise assignments and validates the patient", () => {
  assert.match(admin,/Planificar revisión/);
  assert.match(admin,/dateInput\.type = "date"/);
  assert.match(admin,/clinical_exercise_assignments\?id=eq\./);
  assert.match(admin,/&patient_id=eq\./);
  assert.match(admin,/currentPatient\.id !== item\.patient_id/);
  assert.match(admin,/method: "PATCH"/);
  assert.match(admin,/review_due_at: nextDate/);
  assert.match(admin,/if \(!updated \|\| updated\.id !== item\.id \|\| updated\.patient_id !== currentPatient\.id\)/);
  assert.match(admin,/clinic-assignment-plan-updated/);
  assert.match(summary,/window\.addEventListener\("clinic-assignment-plan-updated"/);
});

test("clinician summary counts only deliberately shared responses", () => {
  assert.match(summary,/patient_response_status,patient_response_shared_at/);
  assert.match(summary,/e\.patient_response_status === "shared"/);
  assert.match(summary,/Respuestas compartidas/);
  assert.doesNotMatch(summary,/select=[^"\n]*patient_response(?:,|&)/);
});

test("patient reading preferences are local, account scoped and switch off on logout", () => {
  assert.match(portalPage,/id="space-reading-size"/);
  assert.match(portalPage,/id="space-reading-simple"/);
  assert.match(portalPage,/id="space-reading-motion"/);
  assert.match(portal,/READING_KEY = "patient_reading_preferences_v1"/);
  assert.match(portal,/localStorage\.setItem\(scopedWellnessKey\(READING_KEY\)/);
  assert.match(portal,/state\.storageScope = scope \|\| null;\s*loadReadingSettings\(\)/);
  assert.match(portal,/state\.portalAuthenticated/);
  assert.match(css,/space-reading-simple/);
  assert.match(css,/space-reading-quiet/);
});

test("logout clears data from DOM and bfcache cannot restore stale clinical views", () => {
  assert.match(portal,/patientMaterials\?\.replaceChildren\(\)/);
  assert.match(portal,/patientFiles\?\.replaceChildren\(\)/);
  assert.match(portal,/state\.portalData = null/);
  assert.match(portal,/state\.storageScopeVersion\+\+/);
  assert.match(portal,/window\.addEventListener\("pageshow"/);
  assert.match(portal,/if \(!event\.persisted\) return;\s*showAccessGate\(\);\s*void loadPatientSession\(\)/);
  assert.match(mood,/document\.addEventListener\("patient-portal-locked", locked\)/);
  assert.match(mood,/document\.removeEventListener\("patient-portal-locked", locked\)/);
  assert.match(portal,/new Event\("patient-local-wellness-cleared"\)/);
  assert.match(mood,/document\.addEventListener\("patient-local-wellness-cleared", clearWithWellness\)/);
});

test("partial clinic backend outages are explicit failures and never mistaken for empty assignments", () => {
  assert.match(worker,/if \(!patientResponse\.ok\) return patientPortalJson\(/);
  assert.match(worker,/if \(!appointmentResponse\.ok \|\| !materialsResponse\.ok \|\| !filesResponse\.ok\)/);
  assert.match(worker,/No se ha podido cargar Mi espacio/);
  assert.match(worker,/return patientPortalJson\(\{ error: "La información no se ha recibido correctamente\." \}, 503\)/);
  assert.match(worker,/Cache-Control": "private, no-store"/);
  assert.match(worker,/const revocation = await fetch\(/);
  assert.match(worker,/if \(!revocation\?\.ok\)/);
  assert.match(worker,/No se ha podido confirmar el cierre de sesión/);
});

test("logout is only reported successful when server acknowledges; offline status is visible", () => {
  assert.match(home,/if \(!response\.ok\) throw new Error\("logout_failed"\)/);
  assert.match(home,/setLogoutError\("No se ha podido cerrar la sesión en el servidor/);
  assert.match(home,/window\.addEventListener\("offline", offline\)/);
  assert.match(home,/window\.addEventListener\("online", online\)/);
  assert.match(portal,/if \(!response\.ok\) throw new Error\("logout_not_confirmed"\)/);
  assert.match(portal,/No hemos podido cerrar la sesión en el servidor/);
});


test("old authenticated sessions cannot reappear after a newer session or logout", () => {
  assert.match(portal, /let portalSessionEpoch = 0/);
  assert.match(portal, /const requestEpoch = \+\+portalSessionEpoch/);
  assert.match(portal, /if \(requestEpoch !== portalSessionEpoch\) return false/);
  assert.match(portal, /const loginEpoch = \+\+portalSessionEpoch/);
  assert.match(portal, /if \(loginEpoch !== portalSessionEpoch\) return/);
  assert.match(portal, /const logoutEpoch = \+\+portalSessionEpoch/);
  assert.match(portal, /if \(logoutEpoch !== portalSessionEpoch\) return/);
  assert.match(portal, /portalSessionEpoch\+\+;\s*\/\/ El contenido clínico/);
  assert.match(portal, /const responseEpoch = portalSessionEpoch/);
  assert.match(portal, /responseEpoch !== portalSessionEpoch \|\| !state\.portalAuthenticated \|\| !details\?\.isConnected/);
  assert.match(portal, /status\.setAttribute\("aria-live", "polite"\)|responseStatus\.setAttribute\("aria-live", "polite"\)/);
  assert.match(portal, /if \(!window\.confirm\("¿Compartir estas respuestas con Carolina\?/);
});
