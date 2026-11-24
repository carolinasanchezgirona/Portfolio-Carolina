import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
const read=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("the consent table is private and patient-bound",()=>{
 const sql=read("supabase/migrations/20261124_clinical_consent_requests.sql");
 assert.match(sql,/patient_id uuid not null references public\.clinical_patients\(id\)/);
 assert.match(sql,/enable row level security/i);
 assert.match(sql,/revoke all on public\.clinical_consent_requests from public, anon, authenticated/i);
 assert.match(sql,/guard_signed_clinical_consent/i);
 assert.match(sql,/unique index if not exists clinical_consent_requests_one_pending/i);
});

test("patient consent API uses the verified portal session, not a supplied patient_id",()=>{
 const source=read("clinical-consent-workflow.ts");
 const patient=source.slice(source.indexOf('const session=actor==="patient"?await options.patientSession(request):null;'));
 assert.match(patient,/const patientId=onsite\?\.row\.patient_id\|\|session\?\.patient_id\|\|""/);
 assert.match(patient,/getOne\(env,id,patientId\)/);
 assert.match(source,/options\.owner\(request\)/);
 assert.match(source,/options\.sameOrigin\(request\)/);
 assert.match(source,/status=eq\.pending/);
 assert.match(source,/pdfSha/);
 assert.match(source,/signature_png/);
 assert.match(source,/await deletePdf/);
});

test("the PDF archive is private and requires a hash check on retrieval",()=>{
 const source=read("clinical-consent-workflow.ts");
 assert.match(source,/storage\/v1\/object\/clinical-documents\//);
 assert.match(source,/category:"consent"/);
 assert.match(source,/share_revoked_at|category:"consent"/);
 assert.match(source,/await digest\(bytes\)!==record\.pdf_sha256/);
 assert.match(source,/status:"submitted"/);
 assert.match(source,/\["submitted","verified"\]\.includes\(record\.status\)/);
});

test("patients see consent assignments only after portal authentication",()=>{
 const patient=read("public/patient-consents.js");
 const page=read("app/mi-espacio/page.tsx");
 const form=read("app/components/legal-signature-form.tsx");
 assert.match(patient,/patient-portal-session-ready/);
 assert.match(patient,/\/api\/patient-portal\/consents/);
 assert.match(page,/space-consent-requests/);
 assert.match(form,/\/api\/patient-portal\/consents\?id=/);
 assert.match(form,/credentials:"include"/);
 assert.match(form,/setSubmitted\(true\)/);
});

test("professional alone assigns and validates, never automatic verification",()=>{
 const admin=read("public/clinic-consent-workflow.js");
 assert.match(admin,/clinic-patient-opened/);
 assert.match(admin,/action:"assign"/);
 assert.match(admin,/updateStatus\(item,"verify"\)/);
 assert.match(admin,/Firmado: pendiente de revisión/);
 const worker=read("worker.ts");
 assert.match(worker,/clinicalConsentWorkflow\(request, env, .*"admin"\)/);
 assert.match(worker,/clinicalConsentWorkflow\(request, env, .*"patient"\)/);
});
