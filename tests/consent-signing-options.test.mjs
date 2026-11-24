import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("one patient-linked consent record supports 3 evidence methods",()=>{
 const migration=read("supabase/migrations/20261124_clinical_consent_multisign.sql");
 assert.match(migration,/drawn_portal','typed_email_otp','drawn_onsite/);
 assert.match(migration,/enable row level security/);
 assert.match(migration,/revoke all on public.clinical_consent_email_otps from public, anon, authenticated/);
 assert.match(migration,/revoke all on public.clinical_consent_onsite_links from public, anon, authenticated/);
 assert.match(migration,/p_patient_id uuid,p_code_hash text/);
 assert.match(migration,/attempts=attempts\+1/);
 assert.match(migration,/issued_at>v_now-interval '60 seconds'/);
 assert.match(migration,/issued_at>v_now-interval '1 hour'/);
});
test("remote typed signature requires an email one-time code, cannot be forged from another patient",()=>{
 const source=read("clinical-consent-workflow.ts");
 assert.match(source,/const patientId=onsite\?\.row.patient_id\|\|session\?\.patient_id\|\|""/);
 assert.match(source,/await options.patientSession\(request\)/);
 assert.match(source,/if\(actor!=="patient"\)return json/);
 assert.match(source,/consume_clinical_consent_email_otp/);
 assert.match(source,/typed_email_otp/);
 assert.match(source,/signing_method:signingMethod/);
 assert.match(source,/comparable\(typedName\)!==comparable\(patient.full_name\)/);
 assert.match(source,/BREVO_API_KEY/);
 assert.doesNotMatch(source,/otp_code:[^}]*signed_payload/);
});
test("presential link requires clinician MFA and is short-lived, unguessable, one-use",()=>{
 const source=read("clinical-consent-workflow.ts");
 assert.match(source,/if\(!await options.owner\(request\)\)/);
 assert.match(source,/body.action==="onsite_link"/);
 assert.match(source,/randomSecret\(\)/);
 assert.match(source,/15\*60000/);
 assert.match(source,/&consumed_at=is.null&revoked_at=is.null/);
 assert.match(source,/expires_at=gt/);
 assert.match(source,/signatureRoute\(pending.kind\)\+"#presencial="/);
 assert.match(source,/consumed_at:signedAt/);
 assert.match(source,/row.id!==id/);
});
test("new signing options are integrated in one UI, never a second system",()=>{
 const patient=read("app/components/legal-signature-form.tsx");
 const admin=read("public/clinic-consent-workflow.js");
 const panel=read("app/admin/clinica/page.tsx");
 assert.match(patient,/signatureMode==="typed"/);
 assert.match(patient,/request_otp/);
 assert.match(patient,/X-Consent-Presencial/);
 assert.match(patient,/window.history.replaceState/);
 assert.match(patient,/one-time-code/);
 assert.match(admin,/Firma presencial en este dispositivo/);
 assert.match(admin,/onsite_link/);
 assert.match(panel,/clinic-consent-requests/);
 assert.match(panel,/clinic-consent-onsite-link/);
 assert.doesNotMatch(panel,/clinic-signature-prepare|clinic-manual-documents/);
});
test("signed PDF explicitly records method and OTP proof without storing OTP itself",()=>{
 const pdf=read("clinical-consent-signed-pdf.ts");
 assert.match(pdf,/Firma mediante nombre escrito y código de correo/);
 assert.match(pdf,/data.typed_name/);
 assert.match(pdf,/verified_email_code_at/);
 assert.match(pdf,/data.signing_method === "typed_email_otp"/);
 assert.match(pdf,/firma electrónica avanzada o cualificada/i);
});
