import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const shell = readFileSync(new URL("../app/components/site-shell.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/editorial.css", import.meta.url), "utf8");

test("main public menu uses the agreed architecture", () => {
  assert.match(shell, /<summary>Servicios <ChevronIcon \/>/);
  assert.match(shell, /href="\/pregunta-a-carolina\/".*Tu Consulta<\/a>/);
  assert.match(shell, /<summary>Recursos <ChevronIcon \/>/);
  assert.match(shell, /href="\/sobre-mi\/"/);
  assert.match(shell, /href="\/mi-espacio\/"/);
  assert.match(shell, /site-booking-cta.*href="\/cita\/"/);
  assert.doesNotMatch(shell, /const mainNavigation/);
});

test("service and resource links remain at their indexed URLs", () => {
  for (const href of [
    "/psicologia/", "/neuropsicologia/", "/residencias/",
    "/recursos/", "/articulos/", "/pregunta-a-carolina/"
  ]) {
    assert.ok(shell.includes('href: "' + href + '"') || shell.includes('href="' + href + '"'), href);
  }
});

test("mobile navigation provides expandable groups and accessible touch targets", () => {
  assert.match(shell, /className="site-mobile-nav-section"/);
  assert.match(shell, /className="site-mobile-nav-items"/);
  assert.match(styles, /site-mobile-nav-section > summary/);
  assert.match(styles, /min-height:48px/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media\(max-width:1150px\)/);
});

test("private and consent pages are excluded from public navigation", () => {
  for (const route of ["/admin", "/mi-espacio", "/cita", "/privacidad"]) {
    assert.ok(shell.includes('"' + route + '"'), route);
  }
});
