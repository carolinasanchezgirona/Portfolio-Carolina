import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const page = readFileSync("app/admin/page.tsx", "utf8");
const css = readFileSync("app/admin/dashboard.css", "utf8");
const script = readFileSync("public/admin-sidebar-navigation.js", "utf8");
const shared = readFileSync("app/admin/workspace-nav.tsx", "utf8");
const clinic = readFileSync("app/admin/clinica/page.tsx", "utf8");

test("El menú conserva las rutas y las agrupa por función sin duplicarlas", () => {
  for(const label of ["Clínica y evaluación","Organización y seguimiento","Gestión y difusión","Acceso y herramientas"]) {
    assert.ok(page.includes(label), label);
  }
  for(const path of ["/admin/","/admin/agenda/","/admin/clinica/?panel=1&view=patients","/admin/clinica/?panel=1","/admin/clinica/protocolos/","/admin/clinica/documentacion/","/admin/clinica/materiales-externos/","/admin/tareas/","/admin/residencia/","/admin/mensajes/","/admin/notificaciones/","/admin/economia/","/admin/articulos/","/admin/recursos/","/admin/marketing/"]) {
    assert.ok(page.includes(path), path);
  }
  assert.match(page,/className="admin-nav-search"/);
  assert.match(page,/admin-nav-group/);
  assert.match(css,/admin-hub-sidebar nav.admin-hub-mobile-navigation/);
  assert.match(css,/\.admin-nav-group>summary:focus-visible/);
  assert.match(page,/Tu consulta hoy/);
  assert.ok(!page.slice(page.indexOf('<div className="admin-hub-workspace">')).includes("adminMenuGroups"));
});

test("Las barras de navegación secundarias siguen la misma organización", () => {
  for(const text of ["Clínica y evaluación","Organización y seguimiento","Gestión y difusión"]) {
    assert.ok(shared.includes(text), text);
    assert.ok(clinic.includes(text), text);
  }
  assert.ok(shared.includes("Protocolos clínicos"));
  assert.ok(clinic.includes("Protocolos clínicos"));
  assert.ok(shared.includes("/admin/preguntas/"));
});

test("La búsqueda filtra enlaces, abre grupos y restablece su estado al vaciar", () => {
  class Element {
    constructor(text = "") { this.textContent = text; this.hidden = false; this.open = false; this.dataset = {}; this.elements = []; this.listeners = {}; }
    addEventListener(name, fn) { this.listeners[name] = fn; }
    querySelector(selector) { if(selector === "summary") return this.summary; if(selector === ".admin-nav-search") return this.search; if(selector === ".admin-nav-quick") return this.quick; if(selector === ".admin-nav-no-results") return this.empty; return null; }
    querySelectorAll(selector) { if(selector === ".admin-nav-group") return this.groups; if(selector === "a") return this.elements; if(selector === ".admin-nav-group-links a") return this.elements; return []; }
  }
  const input = new Element(); input.value="";
  const quick = new Element();
  const agenda = new Element("Agenda"); agenda.dataset.searchText="Agenda citas";
  quick.elements=[agenda];
  const group = new Element();
  const summary = new Element("Clínica y evaluación");
  const protocol = new Element("Protocolos clínicos"); protocol.dataset.searchText="Protocolos clínicos neuropsicología infantil";
  const library = new Element("Biblioteca clínica"); library.dataset.searchText="Biblioteca clínica";
  group.elements=[protocol,library];group.summary=summary;group.open=false;
  const empty = new Element();
  const menu = new Element();Object.assign(menu,{search:input,quick,empty,groups:[group]});
  const context = {document:{querySelectorAll:()=>[menu]}};
  runInNewContext(script,context);
  input.value="neuropsicologia";input.listeners.input();
  assert.equal(protocol.hidden,false);
  assert.equal(library.hidden,true);
  assert.equal(group.open,true);
  assert.equal(quick.hidden,true);
  input.value="inexistente";input.listeners.input();
  assert.equal(empty.hidden,false);
  input.value="";input.listeners.input();
  assert.equal(group.open,false);
  assert.equal(library.hidden,false);
  assert.equal(quick.hidden,false);
  assert.equal(empty.hidden,true);
});
