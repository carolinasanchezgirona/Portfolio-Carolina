import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const month = read("public/admin-month-view.js");
const calendarCss = read("app/admin/agenda/month-view.css");
const agenda = read("app/admin/agenda/page.tsx");
const navigationCss = read("app/admin/workspace-navigation.css");
const selector = read("public/admin-agenda-view-switcher.js");

function extractFunction(name) {
  const start = month.indexOf("function " + name + "(");
  assert.ok(start >= 0, name + " debe existir");
  const end = month.indexOf("\n  }", start);
  assert.ok(end > start, name + " debe estar completo");
  return month.slice(start, end + 4);
}

test("La vista mensual usa la fecha de Madrid y no el mes UTC del dispositivo", () => {
  assert.match(month, /let cursor = monthAtMadridNow\(\)/);
  assert.match(month, /month-today"\)\.addEventListener\("click",\(\)=>\{cursor=monthAtMadridNow\(\);loadMonth\(\);\}\)/);
  const fakeNow = "2026-12-31T23:15:00.000Z"; // Ya es 1 de enero en Madrid
  class FakeDate extends Date {
    constructor(...args) { super(...(args.length ? args : [fakeNow])); }
  }
  const calc = new Function("Date", "ZONE",
    extractFunction("dayKeyFromIso") + "\n" +
    extractFunction("monthAtMadridNow") +
    "\nreturn monthAtMadridNow().toISOString();"
  );
  assert.equal(calc(FakeDate, "Europe/Madrid"), "2027-01-01T12:00:00.000Z");
});

test("Los estilos mensuales se sirven con el resto de CSS y con los tokens corporativos", () => {
  assert.match(agenda, /import "\.\/month-view\.css"/);
  assert.doesNotMatch(month, /document\.createElement\("style"\)/);
  assert.match(calendarCss, /\.month-day-menu/);
  assert.match(calendarCss, /\.month-grid/);
  assert.match(calendarCss, /var\(--admin-action\)/);
  assert.doesNotMatch(calendarCss, /#11A6C2|#075A68/i);
});

test("Hay una sola navegación visible de vistas y las canceladas no ocupan el mes", () => {
  assert.equal((agenda.match(/id="admin-agenda-view-select"/g) || []).length, 1);
  assert.equal((agenda.match(/id="view-month"/g) || []).length, 1);
  assert.match(navigationCss, /\.admin-page \.admin-view-tabs\.agenda-view-tabs-source\{display:none!important\}/);
  assert.match(selector, /target\.click\(\)/);
  assert.match(month, /rows = bookingsBody\.filter\(row => !\["cancelled", "canceled"\]\.includes\(row\.status\)\)/);
  assert.match(agenda, /id="month-status" className="admin-message" role="status" aria-live="polite"/);
});
