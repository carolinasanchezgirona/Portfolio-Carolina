import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const script = readFileSync("public/admin-dashboard.js", "utf8");
const page = readFileSync("app/admin/page.tsx", "utf8");

test("La pantalla de inicio contiene únicamente las citas de hoy", () => {
  const workspace = page.split('<div className="admin-hub-workspace">')[1];
  assert.ok(workspace);
  for (const value of ["Tu consulta hoy","Citas de hoy","id=\"admin-home-today\"","id=\"admin-home-status\""]) {
    assert.ok(workspace.includes(value), value);
  }
  assert.doesNotMatch(workspace, /Próxima cita|Buscar un paciente|Mensajes de pacientes|Facturas|Ventas de recursos|Centro editorial/);
  assert.doesNotMatch(script, /\/api\/admin\/patient-messages|digital_resource_orders\?|billing_invoices\?|articles\?select/);
  assert.match(script, /rows\.map\(formatter\)/);
});

const appointments = Array.from({ length: 9 }, (_, index) => ({
  id: "ficticia-" + index,
  patient_name: "Paciente de prueba " + index,
  service_code: index % 2 ? "neuropsicologia" : "psicologia_general_sanitaria",
  status: index === 8 ? "cancelled" : "confirmed",
  starts_at: "2026-11-09T" + String(7 + index).padStart(2, "0") + ":00:00Z"
}));

async function boot({ data = appointments, gate = true, bookingError = false } = {}) {
  const listeners = {};
  const elements = Object.fromEntries([
    "admin-home","admin-home-loading","admin-home-date","admin-home-status",
    "admin-home-today","admin-home-refresh","admin-home-logout"
  ].map(id => [id, {
    hidden: id === "admin-home",
    textContent: "",
    innerHTML: "",
    addEventListener: (event, callback) => { listeners[id + ":" + event] = callback; }
  }]));
  const calls = [];
  let redirect = "";
  const owner = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
  const context = {
    document: {
      querySelector: selector => elements[selector.replace(/^#/, "")] || null
    },
    sessionStorage: {
      getItem: key => key === "dememoria_admin_session" ? '{"access_token":"PRUEBA"}' : null,
      removeItem: () => {}
    },
    fetch: async url => {
      calls.push(url);
      if (url.includes("/auth/v1/user")) return { ok:true, json:async () => ({ id:owner }) };
      if (url.includes("/rpc/admin_mobile_gate")) return { ok:true, json:async () => gate };
      if (url.includes("/appointment_bookings?")) return {
        ok: !bookingError,
        status: bookingError ? 503 : 200,
        json: async () => bookingError ? { message:"Servidor no disponible" } : data
      };
      throw new Error("Solicitud no esperada: " + url);
    },
    window: { location: { replace: url => { redirect = url; } } },
    Intl, Date, URL, console
  };
  runInNewContext(script, context);
  for(let i=0;i<10;i++) await new Promise(resolve => setImmediate(resolve));
  return {elements, calls, listeners, redirect};
}

test("Con acceso válido solo se consulta la agenda y se muestran todas las citas no canceladas", async () => {
  const {elements,calls,redirect} = await boot();
  assert.equal(redirect, "");
  assert.equal(elements["admin-home"].hidden,false);
  assert.equal(calls.length,3);
  assert.equal(calls.filter(value => value.includes("appointment_bookings?")).length,1);
  assert.equal((elements["admin-home-today"].innerHTML.match(/class="admin-home-item"/g) || []).length,8);
  assert.doesNotMatch(elements["admin-home-today"].innerHTML,/Paciente de prueba 8/);
  assert.match(elements["admin-home-today"].innerHTML,/Paciente de prueba 7/);
  assert.equal(elements["admin-home-status"].textContent, "");
});

test("Un error de agenda muestra estado no disponible, sin fingir cero citas", async () => {
  const {elements} = await boot({bookingError:true});
  assert.match(elements["admin-home-status"].textContent,/No se han podido actualizar/);
  assert.match(elements["admin-home-today"].innerHTML,/no están disponibles/i);
});

test("Sin autorización no se consultan citas ni se muestra contenido clínico", async () => {
  const {elements,calls,redirect} = await boot({gate:false});
  assert.equal(elements["admin-home"].hidden,true);
  assert.match(redirect,/admin\/clinica\/acceso/);
  assert.equal(calls.filter(value => value.includes("appointment_bookings?")).length,0);
});
