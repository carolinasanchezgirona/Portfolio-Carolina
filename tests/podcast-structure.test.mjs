import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const file = path => new URL("../" + path, import.meta.url);
const read = path => readFileSync(file(path), "utf8");

test("the retired podcast stays out of public navigation, resources and the legal notice", () => {
  for (const path of ["app/components/site-shell.tsx", "app/recursos/page.tsx", "app/aviso-legal/page.tsx"]) {
    assert.doesNotMatch(read(path), /\bp[oó]dcast\b|Psicología Incómoda/i, path);
  }
});

test("the retired podcast has no public routes, cover or sitemap entry", () => {
  for (const path of ["app/podcast/page.tsx", "app/podcast/[slug]/page.tsx", "public/podcast/episodio-01.avif"]) {
    assert.equal(existsSync(file(path)), false, path);
  }
  assert.doesNotMatch(read("app/sitemap.ts"), /\bpodcast\b/i);
});
