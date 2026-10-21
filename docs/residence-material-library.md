# Residence cognitive material library

The residence workspace now has a material factory and a searchable, private library.

The current generator uses local procedural templates (not an external LLM). It creates attention cancellation, shopping recall, semantic fluency, everyday action sequencing, arithmetic, and spatial pattern copying in Spanish, Catalan, or English. Configurations include four difficulty levels, schooling, one worksheet or a mixed workbook, and presentation supports. Free-text objectives are retained as professional review notes; they are not automatically interpreted by a model.

Before saving, review each worksheet and its separate answer key. Any content edit invalidates approval. Save inserts or updates one `residence_materials` row containing the material and its resident links atomically. Links do not imply the task was administered and do not write clinical performance results. The resident history links to the library filtered by resident. Creating an adaptation copies the material with a fresh ID and no resident links.

The deployed Supabase migration `residence_cognitive_material_library` creates `public.residence_materials`, enables RLS, denies anonymous access, and limits authenticated reads/writes to the existing residence owner. Fields: `id uuid`, `revision integer`, `created_at timestamptz`, `title text`, `data jsonb`, `links jsonb`. No patient names are embedded in reusable worksheets.

`offline-store.ts` includes the new table in the encrypted vault, download preparation, optimistic revision handling, and three-way merge. Links are objects identified by resident ID, allowing independent additions to merge. Saved materials work offline after downloading. Unsaved previews stay in the mounted workspace during local navigation; a beforeunload guard protects them, but they are not persisted as drafts across reloads.

Checks:

- `node --experimental-strip-types --test tests/residence-materials.test.mjs`
- `npm run build`
- With an exported site served on localhost: `NODE_PATH=<playwright modules> CHROMIUM_PATH=<browser> node tests/residence-materials-browser.cjs` (uses only fictional resident fixtures and mocked API writes).
