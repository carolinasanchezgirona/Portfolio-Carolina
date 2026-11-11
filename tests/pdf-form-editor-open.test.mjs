import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const admin = readFileSync("public/admin-clinica.js", "utf8");
const page = readFileSync("app/admin/clinica/page.tsx", "utf8");

test("PDF form editor fills inputs without shadowing the DOM document", () => {
  const start = admin.indexOf("  function fillPatientDocument(");
  const end = admin.indexOf("  function patientDocumentFromForm(", start);
  assert.ok(start > 0 && end > start, "the document editor must exist");

  const fields = ["exerciseIntroduction", "exerciseWhy", "exerciseDuration",
    "exerciseFrequency", "exerciseObjective", "exerciseExample", "exerciseRecord",
    "exerciseSafety", "exerciseRemember", "exerciseSessionQuestions"];
  const els = Object.fromEntries(fields.map(key => [key, { value: "" }]));
  let domLookupCount = 0;
  const review = { checked: false };
  const sandbox = {
    els,
    document: { getElementById(id) {
      domLookupCount += 1;
      assert.equal(id, "clinic-form-source-reviewed");
      return review;
    } },
    window: {},
    formSourceDocumentId: null,
    formSourceDocumentName: "",
    interactiveFormFields: [],
    materialPatientDefaults: () => ({ introduction: "" }),
    normalizedInteractiveFields: value => Array.isArray(value) ? value : [],
    renderInteractiveFields: () => {},
    renderInteractiveDocumentLink: () => {},
    renderPatientDocumentQuality: () => {},
  };
  const fillPatientDocument = runInNewContext(admin.slice(start, end) + "\nfillPatientDocument;", sandbox);
  assert.doesNotThrow(() => fillPatientDocument({
    introduction: "Texto clínico de prueba",
    source_document_id: "12345678-1234-1234-1234-123456789012",
    conversion_reviewed_at: "2026-11-10T22:00:00Z",
    form_fields: [{ id: "q1", label: "Pregunta de prueba", type: "long_text" }],
  }));
  assert.equal(els.exerciseIntroduction.value, "Texto clínico de prueba");
  assert.equal(domLookupCount, 1);
  assert.equal(review.checked, true);
  assert.equal(sandbox.interactiveFormFields.length, 1);
});

test("PDF conversion button reports opening errors inline and jumps to the actual fields", () => {
  assert.match(admin, /function focusPdfFormFields\(\)/);
  assert.match(admin, /section\.scrollIntoView\(\{ block: "start", behavior: "auto" \}\)/);
  assert.match(admin, /feedback\.setAttribute\("aria-live", "polite"\)/);
  assert.match(admin, /try \{\s*convertPatientPdfToInteractiveForm\(doc\);/);
  assert.match(admin, /No se ha podido abrir el editor/);
  assert.match(page, /admin-clinica\.js\?v=20261111-pdf-workbook-1/);
});
