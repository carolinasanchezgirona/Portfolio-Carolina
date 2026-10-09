import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const ui = readFileSync("app/mi-espacio/mood-tracker.tsx", "utf8");
const css = readFileSync("app/mi-espacio/mood-tracker.css", "utf8");

test("five independently selectable energy batteries have distinctive fill levels", () => {
  assert.match(ui, /function EnergyBattery\(/);
  assert.match(ui, /Array\.from\(\{ length: 5 \}/);
  assert.match(ui, /index < level/);
  assert.match(ui, /<EnergyBattery level=\{index \+ 1\}/);
  assert.match(ui, /aria-pressed=\{energy === index\}/);
  assert.match(ui, /aria-label=\{`Energía/);
  assert.match(ui, /"Muy baja", "Baja", "Media", "Alta", "Muy alta"/);
});
test("mood values and existing energy persistence are preserved", () => {
  assert.match(ui, /rating: selected, energy, energy_scale: 5/);
  assert.match(ui, /setEnergy\(index\)/);
  assert.match(ui, /STORAGE_KEY \+ ":" \+ scope/);
});
test("companion portraits fade into pastel background without a square frame", () => {
  assert.match(css, /mood-friend-panel \.mood-friend-image/);
  assert.match(css, /mask-image:radial-gradient/);
  assert.match(css, /border-radius:0!important/);
  assert.match(css, /box-shadow:none!important/);
  assert.match(css, /@media\(max-width:380px\)/);
});
test("battery selection remains distinguishable without colour", () => {
  assert.match(ui, /<span>\{item\}<\/span>/);
  assert.match(css, /button\.is-selected:after/);
  assert.match(css, /button:focus-visible/);
});
