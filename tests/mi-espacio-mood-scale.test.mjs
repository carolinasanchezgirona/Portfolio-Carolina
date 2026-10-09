import { test } from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const page = readFileSync("app/mi-espacio/mood-tracker.tsx", "utf8");
const style = readFileSync("app/mi-espacio/mood-tracker.css", "utf8");

test("five labels are immediately understandable and do not change stored ratings", () => {
  for (const label of ["Muy mal", "Mal", "Regular", "Bien", "Muy bien"]) {
    assert.ok(page.includes(`name: "${label}"`), `Missing mood label: ${label}`);
  }
  assert.match(page, /rating: 1/);
  assert.match(page, /rating: 5/);
  assert.match(page, /selected === mood.rating/);
  assert.match(page, /rating: selected/);
});
test("every mood choice displays an expressive face and an accessible name", () => {
  assert.match(page, /function MoodScaleFace\(/);
  assert.match(page, /<MoodScaleFace rating={mood.rating}/);
  assert.match(page, /aria-label={`Me siento/);
  assert.match(page, /aria-pressed={selected === mood.rating}/);
  assert.match(page, /rating === 1/);
  assert.match(page, /rating === 5/);
  assert.doesNotMatch(page, /className="mood-option-dot"/);
  assert.match(style, /\.mood-scale-face/);
});
test("selection remains usable on small mobile screens", () => {
  assert.match(style, /@media\(max-width:370px\)/);
  assert.match(style, /grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(style, /:focus-visible/);
});
