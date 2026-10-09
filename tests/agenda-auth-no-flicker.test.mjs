import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const page = readFileSync("app/admin/agenda/page.tsx", "utf8");
const css = readFileSync("app/admin/agenda/admin.css", "utf8");
const client = readFileSync("public/admin-agenda-v3.js", "utf8");

test("Agenda must not show login form before checking owner session", () => {
  assert.match(page, /id="admin-login" className="admin-login-shell" hidden/);
  assert.match(page, /id="admin-agenda-loading" className="admin-agenda-loading"/);
  assert.match(page, /id="admin-app" className="admin-app" hidden/);
  assert.match(css, /\.admin-page #admin-login\[hidden\][\s\S]*?display: none !important/);
  assert.match(css, /\.admin-page #admin-app\[hidden\][\s\S]*?display: none !important/);
  assert.match(css, /\.admin-page #admin-agenda-loading\[hidden\][\s\S]*?display: none !important/);
});

test("Agenda only appears after owner session verification", () => {
  assert.match(client, /currentUser = await fetchCurrentUser\(\)/);
  assert.match(client, /if \(currentUser\) \{/);
  assert.match(client, /showApp\(\)/);
  assert.match(client, /els\.app\.hidden = false/);
  assert.match(client, /if \(loading\) loading\.hidden = true/);
  assert.match(client, /\/admin\/clinica\/acceso\/\?next=/);
});

test("Expired sessions use one central login without showing the old Agenda form", () => {
  assert.match(client, /function showLogin\(\)[\s\S]*?if \(els\.login\) els\.login\.hidden = true/);
  assert.match(client, /window\.location\.replace\("\/admin\/clinica\/acceso\/\?next="/);
  assert.match(client, /if \(response\.status === 401\)/);
  assert.match(client, /showLogin\(\)/);
});

test("Motion and a11y guard during authentication", () => {
  assert.match(page, /role="status" aria-live="polite"/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
