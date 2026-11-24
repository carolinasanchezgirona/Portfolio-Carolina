import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("the clinical patient file exposes only Mi espacio consent workflow",()=>{
 const page=read("app/admin/clinica/page.tsx");
 const layout=read("app/admin/clinica/layout.tsx");
 assert.match(page,/Consentimientos y protección de datos/);
 assert.match(page,/id="clinic-consent-requests"/);
 assert.match(page,/id="clinic-consent-assign"/);
 assert.match(page,/id="clinic-consent-status-list"/);
 assert.match(page,/id="clinic-signature-kind"/);
 assert.doesNotMatch(page,/clinic-manual-documents|clinic-signature-prepare|clinic-signature-archive|signaturit/);
 assert.match(layout,/clinic-consent-workflow\.js/);
 assert.doesNotMatch(layout,/clinic-manual-documents-email\.js|clinic-electronic-signature\.js/);
});

test("obsolete consent endpoints are not accessible from Cloudflare worker",()=>{
 const worker=read("worker.ts");
 assert.match(worker,/\/api\/admin\/consent-workflow/);
 assert.match(worker,/\/api\/patient-portal\/consents/);
 assert.doesNotMatch(worker,/\/api\/admin\/clinical-consent-packet/);
 assert.doesNotMatch(worker,/\/api\/admin\/patient-documents-email/);
});

test("public signatures require a valid, patient-linked pending request",()=>{
 const form=read("app/components/legal-signature-form.tsx");
 assert.match(form,/const \[assignmentLoading, setAssignmentLoading\] = useState\(true\)/);
 assert.match(form,/Para firmar este documento, abre la solicitud asignada en Mi espacio/);
 assert.match(form,/assignmentId && !submitted && !assignmentLoading && !assignmentError && <form/);
 assert.doesNotMatch(form,/window\.print\(\)/);
 assert.doesNotMatch(form,/Guardar o imprimir el documento cumplimentado/);
 assert.match(form,/\/api\/patient-portal\/consents/);
});

test("pending consent reminders navigate to the single private patient workflow",()=>{
 const deferred=read("public/clinic-deferred-consent.js");
 assert.match(deferred,/#clinic-consent-requests/);
 assert.doesNotMatch(deferred,/href = link.*consentimiento-psicologico/);
});
