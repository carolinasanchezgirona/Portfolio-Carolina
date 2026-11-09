import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(path, "utf8");
const workspace = read("public/clinic-patient-workspace.js");
const page = read("app/admin/clinica/page.tsx");
const css = read("app/admin/clinica/patient-workspace.css");
const base = read("public/admin-clinica.js");

test("La ficha abre el recorrido clínico antes de las funciones administrativas", () => {
  const items = ["resumen", "sesiones", "tratamiento", "evaluacion", "historia", "documentos", "datos"];
  const positions = items.map(id => workspace.indexOf('["' + id + '",'));
  assert.ok(positions.every(n => n >= 0), "Las siete áreas deben conservarse");
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.match(workspace, /window\.addEventListener\("clinical:patient-opened",\(\) => activate\("resumen"/);
  assert.match(workspace, /Consultar sesiones/);
  assert.match(workspace, /Plan y evolución/);
});

test("Acciones existentes y acceso del paciente se reubican sin duplicados", () => {
  for (const id of ["clinic-new-report", "clinic-print-history", "clinic-delete-patient", "clinic-archive-patient", "clinic-portal-access-toggle"]) {
    assert.equal((page.match(new RegExp('id="' + id + '"', "g")) || []).length, 1, id);
  }
  assert.match(workspace, /panels\.get\("documentos"\)\.querySelector\("\.clinic-workspace-panel-heading"\)\.append\(reportActions\)/);
  assert.match(workspace, /adminTools\.append\(recordActions\)/);
  assert.match(workspace, /add\("datos",select\("\.clinic-portal-access"\)\)/);
  assert.match(workspace, /adminTools\.append\(note\)/);
  assert.match(base, /els\.newReport/);
  assert.doesNotMatch(workspace, /localStorage|sessionStorage|innerHTML/);
});

test("Pestañas accesibles con teclado y apertura del apartado que contiene un campo inválido", () => {
  assert.match(workspace, /navigation\.setAttribute\("role", "tablist"\)/);
  assert.match(workspace, /button\.setAttribute\("role","tab"\)/);
  assert.match(workspace, /panel\.setAttribute\("role","tabpanel"\)/);
  assert.match(workspace, /button\.setAttribute\("aria-selected",String\(selected\)\)/);
  assert.match(workspace, /"ArrowRight", "ArrowLeft", "Home", "End"/);
  assert.match(workspace, /if \(collapsed\) collapsed\.open = true/);
  assert.match(workspace, /form\.append\(bottomSave\)/);
});

test("Estilos sin inyección y respetando el ocultamiento de preparación redundante", () => {
  assert.match(page, /import "\.\/patient-workspace\.css"/);
  assert.doesNotMatch(workspace, /document\.createElement\("style"\)/);
  assert.match(css, /var\(--admin-action\)/);
  assert.match(css, /\.clinic-patient-admin-tools/);
  assert.match(read("app/admin/clinica/patient-ux.css"), /#clinic-patient-dialog \.clinic-preparation,/);
});
