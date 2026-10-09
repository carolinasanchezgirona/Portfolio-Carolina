import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const worker = source("worker.ts");
const admin = source("public/admin-clinica.js");
const portal = source("public/mi-espacio.js");
const adminPage = source("app/admin/clinica/page.tsx");
const portalPage = source("app/mi-espacio/page.tsx");
const migration = source("supabase/migrations/20261009_patient_shared_clinical_files.sql");

test("previous clinical documents remain private unless explicitly shared", () => {
  assert.match(migration, /add column if not exists shared_at timestamptz/);
  assert.match(migration, /add column if not exists share_revoked_at timestamptz/);
  assert.match(adminPage, /id="clinic-document-share" type="checkbox"/);
  assert.match(admin, /const share = Boolean\(els\.documentShare\?\.checked\)/);
  assert.match(admin, /share_revoked_at: now/);
  assert.match(admin, /shared_at: share \? new Date\(\)\.toISOString\(\) : null/);
});

test("shared file metadata excludes internal notes and storage path", () => {
  const session = worker.split("async function handlePatientPortalSession(")[1]?.split("/** Each file request")[0];
  assert.ok(session);
  assert.match(session, /clinical_documents\?select=id,title,category,mime_type,patient_note,shared_at/);
  assert.doesNotMatch(session, /clinical_documents\?select=[^"\n]*file_path/);
  assert.match(session, /shared_at=not\.is\.null&share_revoked_at=is\.null/);
  assert.match(session, /encodeURIComponent\(session\.patient_id\)/);
});

test("private binary route checks cookie, patient, ownership and revocation", () => {
  const handler = worker.split("async function handlePatientPortalFile(")[1]?.split("/** PDF generation is granted")[0];
  assert.ok(handler);
  assert.match(handler, /patientPortalSession\(request, env\)/);
  assert.match(handler, /clinical_patients\?select=id/);
  assert.match(handler, /clinical_documents\?select=id,file_path,file_name,mime_type,patient_id/);
  assert.match(handler, /&patient_id=eq\./);
  assert.match(handler, /shared_at=not\.is\.null&share_revoked_at=is\.null/);
  assert.match(handler, /path\.startsWith\(session\.patient_id \+ "\/"\)/);
  assert.match(handler, /storage\/v1\/object\/authenticated\/clinical-documents/);
  assert.doesNotMatch(handler, /storage\/v1\/object\/public\//);
  assert.match(handler, /Cache-Control": "private, no-store/);
});

test("audio is playable with byte-range requests, and downloads are explicitly requested", () => {
  const handler = worker.split("async function handlePatientPortalFile(")[1]?.split("/** PDF generation is granted")[0];
  assert.match(handler, /storageHeaders\.Range = range/);
  assert.match(handler, /"Content-Range"/);
  assert.match(handler, /searchParams\.get\("download"\) === "1"/);
  assert.match(portal, /audio\.controls = true/);
  assert.match(portal, /audio\.preload = "none"/);
  assert.match(portal, /"&download=1"/);
  assert.match(portalPage, /id="space-shared-files"/);
});

test("bucket stays private and allows documents plus audio", () => {
  assert.match(migration, /where id = 'clinical-documents' and public = false/);
  assert.match(migration, /'audio\/mpeg'/);
  assert.match(migration, /'application\/pdf'/);
});
