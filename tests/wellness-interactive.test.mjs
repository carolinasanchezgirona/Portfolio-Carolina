import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("app/mi-espacio/page.tsx", "utf8");
const ui = readFileSync("public/wellness-interactive.js", "utf8");
const portal = readFileSync("public/mi-espacio.js", "utf8");
const styles = readFileSync("app/mi-espacio/mi-espacio.css", "utf8");

test("four interactive Wellness tools are reachable from the patient view", () => {
  assert.match(page, /data-space-panel="wellness"/);
  assert.match(page, /id="wellness-interactive"/);
  assert.match(page, /src="\/wellness-interactive\.js\?v=/);
  for (const id of ["wi-decision", "wi-energy", "wi-priorities", "wi-focus"]) {
    assert.match(ui, new RegExp('id: "' + id + '"'));
  }
  assert.match(styles, /\.wi-workspace\[hidden\]/);
  assert.match(styles, /@media\(max-width:700px\)/);
});

test("personal input is not sent, persisted, scored or inserted as markup", () => {
  assert.doesNotMatch(ui, /\bfetch\s*\(/);
  assert.doesNotMatch(ui, /\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b/);
  assert.doesNotMatch(ui, /\.innerHTML\s*=/);
  assert.match(ui, /x\.textContent = value/);
  assert.match(ui, /window\.matchMedia/);
  assert.match(ui, /Las anotaciones y elecciones se descartan/);
});

test("only permitted activity identifiers and dates enter account-scoped progress", () => {
  assert.match(ui, /CustomEvent\("wellness:interactive-completed", \{ detail \}\)/);
  assert.match(portal, /Object\.prototype\.hasOwnProperty\.call\(interactiveActivityLabels, detail\.id\)/);
  assert.match(portal, /!state\.portalAuthenticated \|\| !state\.storageScope/);
  assert.match(portal, /state\.completed\.push\(\{ id: detail\.id, at: new Date\(\)\.toISOString\(\) \}\)/);
  assert.match(portal, /const saved = saveState\(\)/);
  assert.match(portal, /detail\.saved = saved/);
  assert.doesNotMatch(ui, /XMLHttpRequest|sendBeacon|WebSocket/);
});
