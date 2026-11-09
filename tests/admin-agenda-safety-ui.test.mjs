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

function makeConflictChecker(respond) {
  // Ejecutar la función real del navegador, aislada de Supabase y sin datos clínicos.
  const start = agenda.indexOf("  async function checkAppointmentConflict(");
  const end = agenda.indexOf("\n  async function saveAppointment()", start);
  assert.ok(start >= 0 && end > start, "La comprobación de disponibilidad debe existir");
  const declaration = agenda.slice(start, end).trim();
  const factory = new Function(
    "fetch", "REST_URL", "authHeaders", "madridLocalToIso", "addDaysKey", "keyFromIso", "timeFmt",
    "return (" + declaration + ");"
  );
  const addDaysKey = (value, delta) => new Date(Date.parse(value + "T00:00:00.000Z") + delta * 86400000).toISOString().slice(0, 10);
  return factory(
    respond, "https://api.example.invalid/rest/v1", () => ({}),
    (date, hour = "00:00") => date + "T" + hour + ":00.000Z",
    addDaysKey, iso => iso.slice(0, 10),
    { format: date => date.toISOString().slice(11, 16) }
  );
}

const ok = body => ({ ok: true, json: async () => body });
const failed = { ok: false, json: async () => ({ message: "No disponible" }) };
const day = "2026-11-09T10:00:00.000Z";

test("La validación real rechaza fallos del servidor y respuestas malformadas", async () => {
  for (const responses of [
    [failed, ok([])],
    [ok([]), failed],
    [ok({ error: "invalid" }), ok([])],
    [ok([]), ok(null)]
  ]) {
    let calls = 0;
    const check = makeConflictChecker(async () => responses[calls++]);
    await assert.rejects(check(day), /No se han podido verificar|respuesta.*no es válida/);
    assert.equal(calls, 2);
  }
});

test("La validación real detecta bloqueos y citas de madrugada sin consultar servicios reales", async () => {
  const bloqueado = makeConflictChecker(async url =>
    url.includes("schedule_blocks") ? ok([{ reason: "Reunión" }]) : ok([])
  );
  assert.match(await bloqueado(day), /bloqueo de agenda.*Reunión/);

  const morning = "2026-11-09T00:15:00.000Z";
  const previousEvening = {
    id: "ejemplo-sin-datos-personales",
    status: "confirmed",
    patient_name: "Paciente de prueba",
    starts_at: "2026-11-08T23:45:00.000Z",
    ends_at: "2026-11-09T00:45:00.000Z"
  };
  let appointmentsRequest = "";
  const overlapping = makeConflictChecker(async url => {
    if (url.includes("schedule_blocks")) return ok([]);
    appointmentsRequest = url;
    return ok([previousEvening]);
  });
  assert.match(await overlapping(morning), /Ya existe una cita/);
  assert.match(appointmentsRequest, /2026-11-08T00/);

  const available = makeConflictChecker(async () => ok([]));
  assert.equal(await available(day), "");
});
