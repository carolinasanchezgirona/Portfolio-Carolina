import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../"+path, import.meta.url),"utf8");
const page=read("app/admin/page.tsx");
const css=read("app/admin/dashboard.css");
const client=read("public/admin-dashboard.js");
const shell=read("public/admin-shell.js");
const econ=read("public/admin-economia.js");
const access=read("public/clinical-access.js");
const clinic=read("public/admin-clinica.js");

test("one central admin route for all six management sections",()=>{
  assert.match(page,/Panel de administración/);
  assert.match(page,/index: false/);
  for(const link of [
    "/admin/clinica/?panel=1",
    "/admin/agenda/",
    "/admin/economia/",
    "/admin/articulos/",
    "/admin/recursos/",
    "/admin/preguntas/"
  ]) assert.ok(page.includes(link),"Missing "+link);
  for(const id of [
    "admin-home","admin-home-loading","admin-home-date",
    "admin-home-next-appointment","admin-home-messages",
    "admin-home-priorities","admin-home-today","admin-home-economy",
    "admin-home-editorial","admin-home-commerce",
    "admin-home-refresh","admin-home-logout"
  ]) assert.equal((page.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
  assert.doesNotMatch(page,/Pendientes clínicos|Tareas clínicas/);
  assert.doesNotMatch(client,/clinical_admin_tasks\?select/);
  assert.match(page,/Contabilidad/);
  assert.match(page,/Centro editorial/);
  assert.match(page,/Mi espacio/);
});

test("private content remains hidden until Supabase verifies owner identity",()=>{
  assert.match(page,/id="admin-home" className="admin-home" hidden/);
  assert.match(client,/const user = await currentUser\(\)/);
  assert.match(client,/if \(user\?\.id !== OWNER\) return null/);
  assert.ok(client.includes("/rest/v1/rpc/admin_mobile_gate"));
  assert.ok(client.includes("return await gate.json()===true?user:null"));
  const verify=client.indexOf("const user = await currentUser();");
  const reveal=client.indexOf("root.hidden = false;",verify);
  assert.ok(verify>=0&&reveal>verify);
  assert.match(client,/sessionStorage\.removeItem\(SESSION_KEY\)/);
  assert.match(client,/AUTH_URL \+ "\/logout"/);
  assert.doesNotMatch(page,/clinical_summary|diagnos|medication_notes/);
});

test("partial failures do not hide the other live indicators and failed queries never show fake zeroes",()=>{
  assert.match(client,/Promise\.allSettled\(/);
  assert.match(client,/result\.status === "fulfilled"/);
  assert.match(client,/else unavailable\("#admin-home-today"\)/);
  assert.match(client,/Agenda sin actualizar/);
  assert.match(client,/Bandeja sin actualizar/);
  assert.match(client,/Hay "\+fails\+" áreas sin actualizar/);
  assert.match(client,/billing_invoices\?select/);
  assert.match(client,/billing_receipts\?select/);
  assert.match(client,/billing_issuer_settings\?select/);
  assert.match(client,/ventas recientes de recursos/);
  assert.match(page,/Las ventas de recursos digitales se muestran por separado/);
});

test("all modules can return to hub and billing deep links open the right form",()=>{
  assert.match(shell,/".econ-top-links"/);
  assert.match(shell,/link\.href = "\/admin\/"/);
  assert.match(shell,/link\.textContent = "Panel general"/);
  assert.match(page,/tab=invoices/);
  assert.match(econ,/requested\.get\("tab"\)/);
  assert.match(econ,/if \(tab === "invoices" && requested\.get\("nuevo"\) === "1"\) clearInvoiceForm\(\)/);
  assert.match(access,/window\.location\.assign\("\/admin\/"\)/);
  assert.match(clinic,/next=%2Fadmin%2F/);
});

test("responsive, legible dashboard with keyboard focus",()=>{
  assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css,/@media\(max-width:570px\)/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/prefers-reduced-motion/);
});

test("daily actions lead to the existing private views before administrative summaries", () => {
  const daily = page.slice(page.indexOf('id="admin-hub-daily-title"'), page.indexOf('id="admin-hub-details-title"'));
  assert.match(daily, /href="\/admin\/clinica\/\?panel=1&amp;view=patients">\s*<AdminIcon[^>]+\/><strong>Buscar un paciente/);
  assert.match(daily, /href="\/admin\/mensajes\/"/);
  assert.match(daily, /href="\/admin\/residencia\/"/);
  assert.match(client, /status=in\.\(confirmed,pending,rescheduled\)&order=starts_at.asc&limit=1/);
  assert.match(client, /patient_email.neq.bloqueo@agenda.interno/);
  assert.match(client, /\/api\/admin\/patient-messages\?unread=1/);
});
