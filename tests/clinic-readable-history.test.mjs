import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("La historia clínica se presenta igual aunque el workspace mueva las secciones", () => {
  const history = read("public/clinic-readable-history.js");
  const workspace = read("public/clinic-patient-workspace.js");
  assert.match(workspace, /panels\\.get\\(id\\)\\.append\\(node\\)/);
  for (const id of ["clinic-reason-consultation", "clinic-clinical-examination",
    "clinic-current-problems", "clinic-therapeutic-goals", "clinic-risk-safety"]) {
    assert.ok(history.includes('"' + id + '"'), id);
  }
  assert.match(history, /closest\\("details\\.clinic-record-section"\\)/);
  assert.match(history, /details\\.clinic-record-section\\.readable-history/);
  assert.doesNotMatch(history, /querySelector\\("\\.clinic-record-sections"\\)|\\.clinic-record-sections\\.readable-history/);
  assert.match(history, /clinical:patient-opened/);
  assert.doesNotMatch(history, /clinic:patient-loaded/);
  assert.doesNotMatch(history, /aiPanel\\.innerHTML|root\\.appendChild\\(aiPanel\\)/);
});

test("La impresión usa una única implementación y respeta el orden clínico canónico", () => {
  const main = read("public/admin-clinica.js");
  const layout = read("app/admin/clinica/layout.tsx");
  assert.doesNotMatch(layout, /admin-clinica-print-fixes\\.js/);
  assert.match(main, /function printClinicalHistory\\(\\)/);
  assert.match(main, /clinicalProfilePrintHtml\\(currentPatient\\)/);
  assert.match(main, /clinicalProfileSchema\\.map/);
  for (const part of ["scaleEntries", "documentEntries", "reportEntries", "Sesiones aprobadas"]) {
    assert.ok(main.includes(part), part);
  }
  assert.match(main, /item\\.status === "approved"/);
});
