import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const page = read("app/admin/page.tsx");
const css = read("app/admin/dashboard.css");
const client = read("public/admin-dashboard.js");
const shell = read("public/admin-shell.js");
const access = read("public/clinical-access.js");
const clinic = read("public/admin-clinica.js");

test("admin start shows only today's consultation information", () => {
  assert.match(page, /Panel de administración/);
  assert.match(page, /index: false/);
  const workspace = page.split('<div className="admin-hub-workspace">')[1];
  assert.ok(workspace, "Missing workspace");
  assert.match(workspace, /Tu consulta hoy/);
  assert.match(workspace, /Próxima cita/);
  assert.match(workspace, /Buscar un paciente/);
  assert.match(workspace, /Mensajes de pacientes/);
  assert.match(workspace, /Citas de hoy/);
  assert.doesNotMatch(workspace, /Administración y contenidos|Todas tus áreas de trabajo|Facturas y cobros|Contenido editorial|Ventas de recursos|admin-hub-module-grid|admin-hub-tools/);
  for (const id of [
    "admin-home", "admin-home-loading", "admin-home-date",
    "admin-home-next-appointment", "admin-home-messages", "admin-home-today",
    "admin-home-refresh", "admin-home-logout",
  ]) assert.equal((page.match(new RegExp('id="' + id + '"', "g")) || []).length, 1, id);
  for (const id of ["admin-home-economy", "admin-home-editorial", "admin-home-commerce", "admin-home-priorities"]) {
    assert.doesNotMatch(page, new RegExp('id="' + id + '"'), "Not part of home: " + id);
  }
});

test("other areas remain available exclusively from the sidebar navigation", () => {
  for (const href of [
    "/admin/clinica/?panel=1", "/admin/agenda/", "/admin/economia/",
    "/admin/articulos/", "/admin/recursos/", "/admin/residencia/",
    "/admin/marketing/", "/admin/notificaciones/", "/admin/tareas/",
    "/admin/mensajes/", "/admin/clinica/materiales-externos/",
    "/admin/clinica/documentacion/",
  ]) assert.ok(page.includes(href), "Sidebar is missing " + href);
  assert.match(page, /admin-hub-desktop-navigation/);
  assert.match(page, /<details className="admin-hub-mobile-menu">/);
  assert.match(page, /<AdminSidebarLinks \/>/);
  assert.doesNotMatch(page, /\/admin\/preguntas\//);
});

test("Supabase owner and mobile gate checks are preserved", () => {
  assert.match(page, /id="admin-home" className="admin-home" hidden/);
  assert.match(client, /const user = await currentUser\(\)/);
  assert.match(client, /if \(user\?\.id !== OWNER\) return null/);
  assert.ok(client.includes("/rest/v1/rpc/admin_mobile_gate"));
  assert.ok(client.includes("return await gate.json()===true?user:null"));
  assert.ok(client.indexOf("root.hidden = false;") > client.indexOf("const user = await currentUser();"));
  assert.match(client, /sessionStorage\.removeItem\(SESSION_KEY\)/);
  assert.match(client, /AUTH_URL \+ "\/logout"/);
});

test("appointments and messages retain live data and graceful failures", () => {
  assert.match(client, /Promise\.allSettled\(/);
  assert.match(client, /result\.status === "fulfilled"/);
  assert.match(client, /else unavailable\("#admin-home-today"\)/);
  assert.match(client, /Agenda sin actualizar/);
  assert.match(client, /Bandeja sin actualizar/);
  assert.match(client, /status=in\.\(confirmed,pending,rescheduled\)&order=starts_at.asc&limit=1/);
  assert.match(client, /patient_email.neq.bloqueo@agenda.interno/);
  assert.match(client, /\/api\/admin\/patient-messages\?unread=1/);
});

test("responsive navigation and accessible keyboard focus", () => {
  assert.match(css, /admin-hub-mobile-menu/);
  assert.match(css, /admin-hub-sidebar>\.admin-hub-desktop-navigation\{display:none\}/);
  assert.match(css, /@media\(max-width:570px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});

test("users return to admin from modules and sign in to the same page", () => {
  assert.match(shell, /".econ-top-links"/);
  assert.match(shell, /link\.href = "\/admin\/"/);
  assert.match(access, /window\.location\.assign\("\/admin\/"\)/);
  assert.match(clinic, /next=%2Fadmin%2F/);
});
