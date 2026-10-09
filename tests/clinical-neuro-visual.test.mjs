import test from "node:test";
import assert from "node:assert/strict";
import { normalizeVisualBlocks, visualHtml, getCalendar, matrix } from "../supabase/functions/view-clinical-exercise/visual-blocks.ts";

const escapeHtml = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

test("rechaza contenido activo y solo acepta imágenes PNG/JPEG acotadas", () => {
  assert.equal(normalizeVisualBlocks([{ type: "image", title: "Falsa", alt: "foto", data: "javascript:alert(1)" }]).length, 0);
  assert.equal(normalizeVisualBlocks([{ type: "image", title: "Falsa", alt: "foto", data: "data:image/svg+xml;base64,AAAA" }]).length, 0);
});

test("no interpreta HTML en celdas ni etiquetas", () => {
  const blocks = normalizeVisualBlocks([{ type: "table", title: "Clasificar", content: "Estación|Objeto\nOtoño|<img src=x onerror=alert(1)>" }]);
  const html = visualHtml(blocks, escapeHtml);
  assert.match(html, /&lt;img/);
  assert.doesNotMatch(html, /<img src=x/);
  assert.match(html, /<table>/);
});

test("gráficos no convierten entradas arbitrarias en estilos", () => {
  const html = visualHtml([{ type: "chart", title: "Datos ficticios", content: "A|20\nB|80\nC|invalid\nX|999999" }], escapeHtml);
  assert.match(html, /width:25%/);
  assert.match(html, /width:100%/);
  assert.doesNotMatch(html, /999999/);
});

test("calendarios válidos incluyen cambio de año bisiesto y lunes inicial", () => {
  const feb = getCalendar("2028-02\n29|Celebración");
  assert.ok(feb);
  assert.equal(feb.days, 29);
  assert.equal(feb.events.get(29), "Celebración");
  assert.equal(getCalendar("2028-15"), null);
  assert.equal(getCalendar("28-02"), null);
});

test("tablas conservan filas y columnas sin mezclarlas", () => {
  const [block] = normalizeVisualBlocks([{ type: "table", title: "Orientación", content: "Día|Actividad\nLunes|Compra\nMartes|Paseo" }]);
  assert.deepEqual(matrix(block), [["Día", "Actividad"], ["Lunes", "Compra"], ["Martes", "Paseo"]]);
});

test("ninguna de las opciones predeterminadas inserta identidad del paciente", () => {
  const html = visualHtml([{ type: "diagram", title: "Preparar una salida", content: "Comprobar calendario\nReunir llaves\nSalir" }], escapeHtml);
  assert.match(html, /Preparar una salida/);
  assert.doesNotMatch(html, /nombre del paciente|diagnóstico confirmado/i);
});
