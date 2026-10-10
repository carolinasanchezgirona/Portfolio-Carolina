import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../"+path, import.meta.url), "utf8");
const migration=read("supabase/migrations/20261010_clinical_neuro_longitudinal_progress.sql");
const component=read("app/admin/clinica/neuro-followup.tsx");
const page=read("app/admin/clinica/page.tsx");
const admin=read("public/admin-clinica.js");

test("longitudinal neuropsychology is stored in private append-only observations",()=>{
  assert.match(migration,/clinical_neuro_progress\s*\(/);
  assert.match(migration,/enable row level security/);
  assert.match(migration,/revoke all on public\.clinical_neuro_progress from public, anon, authenticated/);
  assert.match(migration,/grant select, insert on public\.clinical_neuro_progress to authenticated/);
  assert.doesNotMatch(migration,/grant.*\b(update|delete)\b.*clinical_neuro_progress to authenticated/i);
  assert.match(migration,/supersedes_id uuid references/);
  assert.match(migration,/clinical_neuro_progress_check_links/);
  assert.match(migration,/assignment_id.*patient_id/);
  assert.match(migration,/recorded_by = auth\.uid\(\)/);
});
test("uploaded handwritten worksheets remain owner-only, without public URLs",()=>{
  assert.match(migration,/clinical-neuro-handwriting/);
  assert.match(migration,/public=false/);
  assert.match(migration,/neuro_handwriting_owner_select/);
  assert.match(migration,/neuro_handwriting_owner_insert/);
  assert.match(component,/storage\/v1\/object\/authenticated/);
  assert.doesNotMatch(component,/storage\/v1\/object\/public/);
  assert.doesNotMatch(component,/service_role|SUPABASE_SERVICE_ROLE_KEY|OPENAI_API_KEY/);
});
test("OCR happens in browser and requires explicit professional transcription review",()=>{
  assert.match(component,/await import\("tesseract\.js"\)/);
  assert.match(component,/await worker\.recognize\(file\)/);
  assert.match(component,/transcript_reviewed:false/);
  assert.match(component,/!draft\.transcript_reviewed/);
  assert.match(migration,/neuro_progress_transcript_check/);
  assert.doesNotMatch(component,/openai\.com|api\/ocr|fetch\(.+file\.arrayBuffer/);
});
test("comparison requires clinician-designated compatible protocols and descriptive metrics",()=>{
  assert.match(component,/comparable_conditions/);
  assert.match(component,/protocol_key/);
  assert.match(component,/conditions_description\.trim\(\)\.toLowerCase\(\)/);
  assert.match(component,/independent_successes/);
  assert.match(component,/No equivale a progreso terapéutico ni a cambio psicométrico/);
  assert.doesNotMatch(component,/normScore|diagnosticar automáticamente|z_score/);
});
test("tracking only mounts inside clinical treatment and does not pollute patient form edits",()=>{
  assert.match(page,/import NeuroFollowup from "\.\/neuro-followup"/);
  assert.match(page,/<NeuroFollowup \/>/);
  assert.match(admin,/#clinic-consent-grid,.clinic-goals-manager,.clinic-task-box,.clinic-scale-trends,.neuro-followup/);
});

test("phone photographs are sanitized before upload and originals never expose EXIF location",()=>{
  assert.match(component,/async function sanitizeImage/);
  assert.match(component,/createImageBitmap\(file\)/);
  assert.match(component,/canvas\.toBlob\(resolve,"image\/jpeg"/);
  assert.match(component,/new File\(\[blob\],"ficha-manuscrita-"/);
  assert.match(component,/HEIC/);
  assert.match(component,/for\(const \[i,file\] of selected\.entries\(\)\)cleaned\.push\(await sanitizeImage\(file,i\)\)/);
});
