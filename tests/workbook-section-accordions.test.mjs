import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const portal = readFileSync("public/mi-espacio.js", "utf8");
const css = readFileSync("app/mi-espacio/mi-espacio.css", "utf8");
const page = readFileSync("app/mi-espacio/page.tsx", "utf8");

test("each workbook part is a native, accessible collapsible section", () => {
  const start = portal.indexOf("  function createWorkbookPart(");
  const end = portal.indexOf("  function patientResponseData(", start);
  assert.ok(start > 0 && end > start);
  const createElement = tag => ({
    tag, className: "", children: [], textContent: "", attributes: {}, open: false,
    append(...children) { this.children.push(...children); },
    setAttribute(name, value) { this.attributes[name] = value; },
  });
  const factory = runInNewContext(portal.slice(start, end) + "\ncreateWorkbookPart;", {
    document: { createElement },
  });
  const result = factory("Psicoeducación", "Lectura clínica", false);
  assert.equal(result.section.tag, "details");
  assert.equal(result.section.open, false);
  assert.equal(result.section.children[0].tag, "summary");
  assert.equal(result.section.children[1], result.content);
  assert.equal(result.section.children[0].children[0].children[0].textContent, "Psicoeducación");
  assert.equal(result.section.children[0].children[0].children[1].textContent, "Lectura clínica");
  assert.equal(result.section.children[0].children[1].attributes["aria-hidden"], "true");
});

test("structured workbooks separate full psychoeducation, techniques and actual exercise form", () => {
  assert.match(portal, /createWorkbookPart\("Psicoeducación"/);
  assert.match(portal, /appendPatientSection\(reading\.content, "Para qué sirve", documentData\.introduction\)/);
  assert.match(portal, /documentData\.why\)/);
  assert.match(portal, /createWorkbookPart\("Técnicas y ejemplos"/);
  assert.match(portal, /"Instrucciones completas"/);
  assert.match(portal, /documentData\.instructions\)/);
  assert.match(portal, /appendMaterialExamples\(techniquesPart\.content, documentData\.example\)/);
  assert.match(portal, /appendPatientSection\(techniquesPart\.content, "Qué conviene recordar"/);
  assert.match(portal, /createWorkbookPart\("Ejercicios y respuestas"/);
  assert.match(portal, /exerciseContent\.append\(host\)/);
  assert.match(portal, /host\.append\(explainer, form\)/);
  assert.match(portal, /appendInteractiveQuestions\(form, item, documentData\)/);
  assert.match(portal, /if \(neuroTaskContainer\) answerTarget\.append\(neuroTaskContainer\)/);
  assert.match(portal, /savePatientMaterialResponse\(item, form, "draft", responseStatus\)/);
  assert.match(portal, /savePatientMaterialResponse\(item, form, "share", responseStatus\)/);
  assert.match(portal, /parts\.forEach\(part => \{ part\.open = true; \}\)/);
});

test("source-linked PDF remains unabridged in a reading accordion, with exercises separately", () => {
  assert.match(portal, /createWorkbookPart\("Leer el cuaderno completo"/);
  assert.match(portal, /appendCompletePdfToForm\(readingPart\.content, sourceFile\)/);
  assert.match(portal, /readingPart\.section\.classList\.add\("space-workbook-part-reading"\)/);
  assert.match(portal, /workspace\.append\(readingPart\.section\)/);
  assert.match(portal, /workspace\.append\(answerPart\.section\)/);
  assert.match(portal, /answerTarget = answerPart\.content/);
  assert.match(portal, /appendInteractiveQuestions\(answerTarget, item, documentData\)/);
  assert.match(portal, /answerTarget\.append\(actions, responseStatus\)/);
  assert.match(portal, /if \(!details\.open \|\| !readingPart\?\.open/);
  assert.doesNotMatch(portal, /import\("\/vendor\/pdfjs\//);
});

test("previously shared intervention PDFs are never hidden or shown twice", () => {
  assert.match(portal, /const standaloneWorkbooks = files\.filter\(file =>/);
  assert.match(portal, /file\.category === "intervention_plan" && !linkedSourceIds\.has\(String\(file\.id\)\)/);
  assert.match(portal, /const otherFiles = files\.filter\(file => !workbookFileIds\.has\(String\(file\.id\)\)\)/);
  assert.match(portal, /standaloneWorkbooks\.forEach\(file => patientMaterials\.append\(createPatientFile\(file\)\)\)/);
  assert.match(portal, /document\.createElement\("details"\);\s*card\.className = "space-patient-shared-file space-shared-file-accordion"/);
  assert.match(portal, /createWorkbookPart\("Leer documento completo"/);
  assert.match(portal, /appendCompletePdfToForm\(reading\.content, file\)/);
  assert.match(portal, /audio\.preload = "none"/);
  assert.match(portal, /textContent = "Abrir y responder"/);
  assert.match(portal, /download\.href = url \+ "&download=1"/);
  assert.doesNotMatch(portal, /storage\/v1\/object\/public\/clinical-documents/);
});

test("section UI works on mobile and uses a new script revision", () => {
  assert.match(css, /space-workbook-part>summary/);
  assert.match(css, /space-shared-file-accordion>summary/);
  assert.match(css, /\.space-fillable-workspace\{grid-template-columns:minmax\(0,1fr\)/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(page, /Mis cuadernos y ejercicios/);
  assert.match(page, /mi-espacio\.js\?v=20261111-cuadernos-secciones-1/);
});
