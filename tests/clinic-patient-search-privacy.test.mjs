import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const script = readFileSync("public/admin-clinica.js", "utf8");
const page = readFileSync("app/admin/clinica/page.tsx", "utf8");

test("patient directory is hidden until a deliberate search", () => {
  const start = script.indexOf("function renderPatients(query");
  const end = script.indexOf("async function loadData()",start);
  assert.ok(start >= 0 && end > start);
  const render = script.slice(start,end);
  const guard = render.indexOf("if (term.length < 2)");
  const filter = render.indexOf("patients.filter(");
  assert.ok(guard > 0 && guard < filter);
  assert.match(render,/els\.patientList\.replaceChildren\(\)/);
  assert.match(render,/patient\.public_code/);
  assert.match(render,/El listado permanece oculto por privacidad/);
});
test("browser requests fresh patient search code", () => {
  assert.match(page,/admin-clinica\.js\?v=20[0-9]{6}-[a-z0-9-]+/);
});
