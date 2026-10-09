import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = file => readFileSync(new URL("../" + file, import.meta.url), "utf8");
const mailer = read("supabase/functions/notify-clinical-file/index.ts");
const migration = read("supabase/migrations/20261009_clinical_file_email_notices.sql");
const admin = read("public/admin-clinica.js");
const page = read("app/admin/clinica/page.tsx");

test("only the clinician can send; patient emails always originate from the clinical record", () => {
  assert.match(mailer, /auth\/v1\/user/);
  assert.match(mailer, /person\?\.id !== OWNER_ID/);
  assert.match(mailer, /clinical_documents\?select=id,patient_id,shared_at,patient:clinical_patients\(email,status\)/);
  assert.match(mailer, /share_revoked_at=is\.null/);
  assert.doesNotMatch(mailer, /body\.recipient|body\.email|body\.subject/);
  assert.match(mailer, /!UUID\.test\(documentId\)/);
});

test("notification content never leaks a file name, document title or clinical note", () => {
  const body = mailer.split("function emailMessage() {")[1]?.split("Deno.serve(")[0];
  assert.ok(body);
  assert.match(body, /Tienes una novedad en Mi espacio/);
  assert.match(mailer, /const PORTAL_URL = APP_ORIGIN \+ "\/mi-espacio\/"/);
  assert.doesNotMatch(body, /doc\.|documentId|recipient|mime_type|title:|patient_note|attachments/);
  assert.match(mailer, /"X-Mailin-Track-Opens": "0"/);
  assert.match(mailer, /"X-Mailin-Track-Clicks": "0"/);
});

test("only one sender can claim a given share publication", () => {
  assert.match(migration, /primary key\(document_id, shared_at\)/);
  assert.match(migration, /alter table public\.clinical_document_email_notices enable row level security/);
  assert.match(migration, /revoke all on public\.clinical_document_email_notices from PUBLIC, anon, authenticated/);
  assert.match(mailer, /resolution=ignore-duplicates,return=representation/);
  assert.match(mailer, /already_sent: true/);
  assert.match(mailer, /if \(!explicitRetry\)/);
  assert.match(mailer, /10 \* 60_000/);
  assert.match(mailer, /&status=eq\./);
});

test("automatic notices only follow explicit publication and failures leave the file shared", () => {
  assert.match(admin, /if \(share\) await sendClinicalFileNotice\(doc\.id\)/);
  assert.match(admin, /if \(share\) await sendClinicalFileNotice\(clinicalDocuments\[0\]\.id\)/);
  assert.match(admin, /notice\?\.status === "failed" \? "Reintentar aviso"/);
  assert.match(admin, /document_id: docId, retry/);
  assert.match(admin, /clinical_document_email_notices\?select=/);
  assert.match(page, /Al compartirlo se enviará automáticamente un aviso neutro por correo/);
});

test("the notification provider receives only an email address and static content", () => {
  assert.match(mailer, /api\.brevo\.com\/v3\/smtp\/email/);
  assert.match(mailer, /to: \[\{ email: recipient \}\]/);
  assert.match(mailer, /subject: "Tienes una novedad en Mi espacio"/);
  assert.doesNotMatch(mailer, /attachments:/);
  assert.match(mailer, /if \(!BREVO_KEY\)/);
});
