import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const get = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("TDAH y TEA ofrecen reserva directa también al final de la página", () => {
  for (const route of ["evaluacion-tdah-adultos", "evaluacion-tea-adultos"]) {
    const page = get(`app/${route}/page.tsx`);
    const matches = page.match(/href="\/cita\/#neuropsicologia"/g) || [];
    assert.ok(matches.length >= 2, `${route}: faltan llamadas a reservar`);
    assert.match(page, /Ver disponibilidad y reservar primera visita/);
    assert.doesNotMatch(page, /mailto:contact@carolinasanchezgirona.com\?subject=Solicitud/);
  }
});

test("La reserva preselecciona neuropsicología sin codificar diagnósticos en URL", () => {
  const booking = get("public/booking.js");
  assert.match(booking, /window\.location\.hash === "#neuropsicologia"/);
  assert.match(booking, /choice\.checked = true/);
  assert.doesNotMatch(booking, /#tdah|#tea/);
});

test("La portada no envía a un perfil de Doctoralia desactivado", () => {
  const home = get("app/page.tsx");
  assert.doesNotMatch(home, /Doctoralia|doctoralia\.es/);
  assert.match(home, /Ver reseñas en Google/);
});
