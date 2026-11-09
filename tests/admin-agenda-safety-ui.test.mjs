import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const agenda = read("public/admin-agenda-v3.js");
const month = read("public/admin-month-view.js");
const waitlist = read("public/admin-waitlist.js");
const page = read("app/admin/agenda/page.tsx");
const css = read("app/admin/agenda/waitlist.css");

test("La agenda no permite guardar si no puede comprobar citas y bloqueos", () => {
  assert.match(agenda, /if \(!appointmentResponse\.ok \|\| !blockResponse\.ok\)/);
  assert.match(agenda, /if \(!Array\.isArray\(rows\) \|\| !Array\.isArray\(blocks\)\)/);
  assert.match(agenda, /No se han podido verificar las citas y los bloqueos/);
  assert.match(agenda, /const cancelling = \["cancelled", "canceled"\]\.includes\(els\.appointmentStatus\.value\)/);
  assert.match(agenda, /const conflictMessage = cancelling \? "" : await checkAppointmentConflict/);
  assert.match(agenda, /madridLocalToIso\(addDaysKey\(dayKey, -1\), "00:00"\)/);
});

test("El fallo al leer bloqueos se informa sin ocultar las citas cargadas", () => {
  assert.match(agenda, /const blocksReadable = Array\.isArray\(blocksBody\)/);
  assert.match(agenda, /scheduleBlocks = blocksReadable \? blocksBody : \[\]/);
  assert.match(agenda, /No interpretes los huecos como disponibles/);
  assert.match(month, /const blocksReadable = blocksRes\.ok && Array\.isArray\(blocksBody\)/);
  assert.match(month, /blocks = blocksReadable \? blocksBody : null/);
});

test("Hoy, semana, mes y espera mantienen una sola vista visible", () => {
  for (const source of [agenda, month, waitlist]) {
    assert.match(source, /document\.querySelectorAll\("\.admin-page \.admin-view"\)/);
    assert.match(source, /view\.hidden = view !==/);
  }
});

test("La lista de espera comparte paleta y no inyecta una hoja de estilos", () => {
  assert.match(page, /import "\.\/waitlist\.css"/);
  assert.match(css, /\.waitlist-match-panel/);
  assert.match(css, /var\(--admin-action\)/);
  assert.match(css, /#waitlist-dialog textarea/);
  assert.doesNotMatch(waitlist, /document\.createElement\("style"\)/);
  assert.doesNotMatch(css, /#9EDCE7|#11A6C2|#075A68/i);
});
