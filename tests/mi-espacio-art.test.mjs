import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

function checkWebp(path, width, height) {
  const bytes = readFileSync(path);
  assert.ok(bytes.byteLength > 1000, `${path} must contain image data`);
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  assert.equal(bytes.toString("ascii", 12, 16), "VP8 ");
  assert.equal(bytes.readUInt16LE(26) & 0x3fff, width);
  assert.equal(bytes.readUInt16LE(28) & 0x3fff, height);
}

test("the 3D portraits are stored permanently on the website", () => {
  checkWebp("public/mi-espacio-art/avatares-3d.webp", 280, 140);
  checkWebp("public/mi-espacio-art/avatares-3d-hd.webp", 1000, 500);
});
test("the five expressions for the older man have a dedicated image sheet", () => {
  checkWebp("public/mi-espacio-art/hombre-mayor-emociones-3d.webp", 500, 74);
});
test("the portal uses the static 3D assets and preserves eight choices", () => {
  const source = readFileSync("app/mi-espacio/mood-tracker.tsx", "utf8");
  assert.match(source, /mi-espacio-art\/avatares-expresiones-v2\.webp/);
  assert.match(source, /portraitOnly/);
  checkWebp("public/mi-espacio-art/avatares-expresiones-v2.webp", 1280, 2048);
  assert.equal((source.match(/stage: "/g) || []).length, 8);
  assert.match(source, /async function saveAvatar/);
  assert.doesNotMatch(source, /localStorage\.setItem\(AVATAR_KEY/);
});
