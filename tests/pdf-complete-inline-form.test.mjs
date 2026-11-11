import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const portal = readFileSync("public/mi-espacio.js", "utf8");
const worker = readFileSync("worker.ts", "utf8");
const css = readFileSync("app/mi-espacio/mi-espacio.css", "utf8");
const adminPage = readFileSync("app/admin/clinica/page.tsx", "utf8");

test("an authenticated PDF form includes ALL original pages, not only questions", () => {
  const start = portal.indexOf("  function appendCompletePdfToForm(");
  const end = portal.indexOf("  // Each objective can define", start);
  assert.ok(start > 0 && end > start, "inline PDF reader function must exist");
  const createElement = tag => ({
    tag, className: "", children: [], dataset: {}, attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    append(...children) { this.children.push(...children); },
  });
  const handler = runInNewContext(portal.slice(start, end) + "\nappendCompletePdfToForm;", {
    document: { createElement },
    encodeURIComponent,
  });
  const form = { children: [], append(node) { this.children.push(node); } };
  const id = "12345678-1234-1234-1234-123456789012";
  handler(form, { id, mime_type: "application/pdf" });
  assert.equal(form.children.length, 1);
  const section = form.children[0];
  assert.equal(section.className, "space-pdf-form-document");
  const reader = section.children.find(node => node.className === "space-pdf-form-reader");
  assert.ok(reader, "the complete document must be rendered inside the response form");
  assert.equal(reader.dataset.pdfUrl, "/api/patient-portal/file?id=" + id);
  assert.equal(reader.attributes.role, "group");
  assert.ok(reader.children.some(node => node.className === "space-pdf-form-loading"));
  const link = section.children.find(node => node.tag === "a");
  assert.equal(link.href, reader.dataset.pdfUrl, "mobile fallback uses the same authenticated document");
  assert.equal(link.target, "_blank");
  assert.equal(link.rel, "noopener noreferrer");
  assert.ok(!reader.dataset.pdfUrl.includes("/storage/v1/") && !reader.dataset.pdfUrl.includes("public"));

  const invalidForm = { children: [], append(node) { this.children.push(node); } };
  handler(invalidForm, { id: "../invalid" });
  assert.equal(invalidForm.children.length, 0);
});

test("PDF is presented BEFORE its responses, without replacing original prose with generic scaffolding", () => {
  assert.match(portal, /if \(!sourceFile\) \{\s*appendPatientSection\(body/);
  assert.match(portal, /appendCompletePdfToForm\(workspace, sourceFile\)/);
  const start = portal.indexOf('const form = document.createElement("form");', portal.indexOf("function createPatientMaterial"));
  const after = portal.slice(start, start + 4500);
  assert.ok(after.indexOf("appendCompletePdfToForm(workspace, sourceFile)") >= 0);
  assert.match(portal, /state\.portalData\?\.files/);
  assert.match(portal, /sourceFile \? "Material completo y respuestas"/);
  assert.doesNotMatch(portal, /storage\/v1\/object\/public\/clinical-documents/);
  assert.match(css, /space-pdf-form-reader/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(portal, /reader\.src = url/);
  assert.match(portal, /reader\.referrerPolicy = "no-referrer"/);
  assert.match(portal, /renderCompletePdfPages\(host\)/);
  assert.doesNotMatch(portal, /await import\("\/vendor\/pdfjs\/pdf\.mjs"\)/);
  assert.match(portal, /sourceFile \? "↓ Descargar PDF original completo"/);
});

test("only the authenticated same-origin patient can embed an unabridged source PDF", () => {
  const start = worker.indexOf("async function handlePatientPortalFile(");
  const end = worker.indexOf("/** PDF generation is granted", start);
  const handler = worker.slice(start, end);
  assert.ok(start > 0 && end > start);
  assert.match(handler, /patientPortalSession\(request, env\)/);
  assert.match(handler, /&patient_id=eq\./);
  assert.match(handler, /&shared_at=not\.is\.null&share_revoked_at=is\.null/);
  assert.match(handler, /path\.startsWith\(session\.patient_id \+ "\/"\)/);
  assert.match(handler, /"Cache-Control": "private, no-store, max-age=0"/);
  assert.match(handler, /"X-Frame-Options": safeMime === "application\/pdf" \? "SAMEORIGIN" : "DENY"/);
  assert.match(handler, /"Content-Security-Policy": safeMime === "application\/pdf" \? "frame-ancestors 'self'" : "frame-ancestors 'none'"/);
  assert.match(handler, /"Cross-Origin-Resource-Policy": "same-origin"/);
  assert.doesNotMatch(handler, /public\/clinical-documents/);
});

test("the clinical editor explains source PDF preservation rather than requesting duplicate text", () => {
  assert.match(adminPage, /el paciente verá todas sus páginas originales dentro del propio formulario/);
  assert.match(adminPage, /puede responder en el espacio libre junto al PDF/);
});
