import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const agenda = read("app/admin/agenda/page.tsx");
const agendaLayout = read("app/admin/agenda/layout.tsx");
const agendaCss = read("app/admin/workspace-navigation.css");
const agendaSwitcher = read("public/admin-agenda-view-switcher.js");
const month = read("public/admin-month-view.js");
const noticesPage = read("app/admin/notificaciones/page.tsx");
const noticesClient = read("public/admin-notifications.js");
const serviceWorker = read("public/sw.js");
const adminHome = read("app/admin/page.tsx");

test("Agenda muestra una única cita principal y un selector de vistas que preserva los eventos existentes", () => {
  assert.match(agenda, /id="admin-new"/);
  assert.equal((agenda.match(/id="admin-new"/g) || []).length, 1);
  assert.match(agenda, /admin-agenda-header-actions/);
  assert.match(agenda, /Más acciones/);
  assert.match(agenda, /id="admin-agenda-view-select"/);
  assert.match(agenda, /className="admin-view-tabs agenda-view-tabs-source"/);
  for (const id of ["view-today","view-tomorrow","view-week","view-patients","today-new","tomorrow-new","admin-block","admin-print","admin-logout"]) {
    assert.equal((agenda.match(new RegExp('id="' + id + '"', "g")) || []).length, 1, id);
  }
  assert.match(agendaCss, /\.admin-page \.admin-view-tabs\.agenda-view-tabs-source\{display:none!important\}/);
  assert.match(agendaCss, /#today-new,.admin-page #tomorrow-new\{display:none!important\}/);
  assert.match(agendaLayout, /admin-agenda-view-switcher\.js/);
  assert.match(agendaSwitcher, /MutationObserver/);
  assert.match(agendaSwitcher, /target\.click\(\)/);
  assert.match(agendaSwitcher, /select\.replaceChildren/);
  assert.match(month, /"#view-tomorrow"/);
  assert.match(month, /document\.createElement\("details"\); dayMenu\.className="month-day-menu"/);
  assert.match(month, /dayMenu\.append\(menuTrigger,dayMenuPanel\)/);
});

test("Centro de avisos autentica al titular y minimiza datos antes de consultar las fuentes", () => {
  assert.match(noticesPage, /id="admin-notice-app" hidden/);
  for (const key of ["agenda","patients","clinical","portal","economy","security","system"]) {
    assert.match(noticesPage, new RegExp('\\["' + key + '"'));
  }
  assert.match(noticesClient, /\/auth\/v1\/user/);
  assert.match(noticesClient, /user\.id !== OWNER/);
  assert.match(noticesClient, /Promise\.allSettled/);
  assert.match(noticesClient, /patient_response_shared_at=not\.is\.null/);
  assert.match(noticesClient, /clinical_admin_tasks/);
  assert.match(noticesClient, /billing_invoices/);
  assert.match(adminHome, /href: "\/admin\/notificaciones\/"/);
  assert.doesNotMatch(noticesClient, /clinical_summary|medication_notes|patient_name|patient_email|patient_response:jsonb/);
});

test("Los avisos push requieren activación voluntaria y contenido seguro en pantalla de bloqueo", () => {
  assert.match(noticesPage, /Avisos en este dispositivo/);
  assert.match(noticesPage, /id="admin-notice-push-enable"/);
  assert.ok(serviceWorker.includes('self.addEventListener("push"'));
  assert.match(serviceWorker, /notificationclick/);
  assert.doesNotMatch(serviceWorker, /patient_name|patient_email|clinical_summary/);
});
