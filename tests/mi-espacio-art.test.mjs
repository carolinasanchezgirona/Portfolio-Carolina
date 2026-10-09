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

test("the original chosen-character portraits remain available", () => {
  checkWebp("public/mi-espacio-art/avatares-3d-hd.webp", 1000, 500);
});
test("all forty mood portraits are stored on the site at adequate resolution", () => {
  const path = "public/mi-espacio-art/40-estados-3d.webp";
  checkWebp(path, 1200, 1920);
  assert.ok(readFileSync(path).byteLength > 120000);
});
test("the portal loads the real 3D atlas and retains eight character choices", () => {
  const source = readFileSync("app/mi-espacio/mood-tracker.tsx", "utf8");
  assert.match(source, /40-estados-3d\.webp/);
  assert.equal((source.match(/stage: "/g) || []).length, 8);
  assert.match(source, /async function saveAvatar/);
  assert.doesNotMatch(source, /localStorage\.setItem\(AVATAR_KEY/);
});
