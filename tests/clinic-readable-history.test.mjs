import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("Historia clínica uniforme después de mover los apartados a las pestañas", () => {
  const history = read("public/clinic-readable-history.js");
  const workspace = read("public/clinic-patient-workspace.js");
  assert.ok(workspace.includes("panels.get(id).append(node)"));
  for (const id of [
    "clinic-reason-consultation", "clinic-clinical-examination",
    "clinic-current-problems", "clinic-therapeutic-goals", "clinic-risk-safety"
  ]) assert.ok(history.includes('"' + id + '"'), id);

  assert.ok(history.includes('closest("details.clinic-record-section")'));
  assert.ok(history.includes("details.clinic-record-section.readable-history"));
  assert.ok(history.includes("details.clinic-record-section.readable-history.history-editing"));
  assert.ok(!history.includes('querySelector(".clinic-record-sections")'));
  assert.ok(!history.includes(".clinic-record-sections.readable-history"));
  assert.ok(history.includes("clinical:patient-opened"));
  assert.ok(!history.includes("clinic:patient-loaded"));
  assert.ok(!history.includes("root.appendChild(aiPanel)"));
});

test("La impresión del historial tiene una única fuente y contiene la historia estructurada", () => {
  const main = read("public/admin-clinica.js");
  const layout = read("app/admin/clinica/layout.tsx");
  assert.ok(!layout.includes("admin-clinica-print-fixes.js"));
  assert.ok(main.includes("function printClinicalHistory()"));
  assert.ok(main.includes("clinicalProfilePrintHtml(currentPatient)"));
  assert.ok(main.includes("clinicalProfileSchema.map"));
  for (const part of ["scaleEntries", "documentEntries", "reportEntries", "Sesiones aprobadas"]) {
    assert.ok(main.includes(part), part);
  }
  assert.ok(main.includes('item.status === "approved"'));
});
