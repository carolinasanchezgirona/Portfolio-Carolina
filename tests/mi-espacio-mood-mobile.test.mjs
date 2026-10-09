import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const source = readFileSync("app/mi-espacio/mood-tracker.tsx", "utf8");
const css = readFileSync("app/mi-espacio/mood-tracker.css", "utf8");
test("only one recent mood record list is present", () => {
  assert.equal((source.match(/Mis últimos registros/g) || []).length, 2, "exactly one heading plus its accessible label");
  assert.equal((source.match(/<ul className="mood-recent-list">/g) || []).length, 1);
  assert.doesNotMatch(source, /className="mood-recent-entries"/);
});
test("record layout groups date and energy for small screens", () => {
  assert.match(source, /<time className="mood-recent-day"/);
  assert.match(source, /className="mood-recent-text"/);
  assert.match(css, /grid-template-columns:13px 52px minmax\(0,1fr\)/);
  assert.match(css, /overflow-wrap:anywhere/);
});
test("patient mood entries remain scoped to the authenticated account", () => {
  assert.match(source, /STORAGE_KEY \+ ":" \+ scope/);
  assert.match(source, /localStorage\.setItem\(scopedMoodKey,/);
  assert.match(source, /energy_scale: 5/);
});
