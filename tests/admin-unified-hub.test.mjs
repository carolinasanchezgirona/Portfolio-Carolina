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
    "admin-home-priorities","admin-home-today","admin-home-clinical","admin-home-economy",
    "admin-home-editorial","admin-home-commerce",
    "admin-home-refresh","admin-home-logout"
  ]) assert.equal((page.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
  assert.match(page,/Gestión económica/);
  assert.match(page,/Centro editorial/);
  assert.match(page,/Mi espacio/);
});

test("private content remains hidden until Supabase verifies owner identity",()=>{
  assert.match(page,/id="admin-home" className="admin-home" hidden/);
  assert.match(client,/const user = await currentUser\(\)/);
  assert.match(client,/return user\?\.id === OWNER \? user : null/);
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
  assert.match(client,/ready\(a\)\?numberFormat\.format\(todayActive\.length\):"—"/);
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
  assert.match(access,/next : "\/admin\/"/);
  assert.match(clinic,/next=%2Fadmin%2Fclinica%2F%3Fpanel%3D1/);
});

test("responsive, legible dashboard with keyboard focus",()=>{
  assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css,/@media\(max-width:570px\)/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/prefers-reduced-motion/);
});
