import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("informes clínicos integrados sin alterar tarifas ni duplicar la consultoría", () => {
  const neuro = read("app/evaluacion-neuropsicologica/page.tsx");
  const psychology = read("app/psicologia/page.tsx");
  assert.match(neuro, /id="informes-para-tramites"/);
  assert.match(neuro, /Discapacidad y dependencia/);
  assert.match(neuro, /consultoria-neuropsicologica-juridica/);
  assert.match(psychology, /id="informes-clinicos-psicologia"/);
  assert.match(psychology, /informe asistencial no es un peritaje/);
  assert.match(psychology, /60 € por sesión/);
  assert.match(neuro, /<strong>75 €<\/strong>/);
});

test("apartado profesional de informes enlazado y sujeto a control de acceso", () => {
  const reportHub = read("app/admin/clinica/informes/page.tsx");
  const sidebar = read("app/admin/workspace-nav.tsx");
  const clinic = read("app/admin/clinica/page.tsx");
  const docs = read("app/admin/clinica/documentacion/page.tsx");
  assert.match(reportHub, /verifyProfessionalAccess\(\)/);
  assert.match(reportHub, /admin_mobile_gate/);
  assert.match(reportHub, /OWNER_ID/);
  assert.match(reportHub, /status === "ready"/);
  assert.match(reportHub, /No se almacena ninguna información de pacientes/);
  assert.match(reportHub, /no es un peritaje/);
  assert.match(sidebar, /active === "informes"/);
  assert.match(clinic, /href="\/admin\/clinica\/informes\/"/);
  assert.match(docs, /Abrir espacio de informes/);
});
