import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const page=readFileSync("app/admin/clinica/page.tsx","utf8");
const css=readFileSync("app/admin/clinica/clinic-navigation.css","utf8");
const clinic=readFileSync("public/admin-clinica.js","utf8");
const shell=readFileSync("public/admin-shell.js","utf8");
const pwa=readFileSync("public/clinic-pwa.js","utf8");
test("Barra única, controles y enlaces existentes",()=>{
 assert.equal((page.match(/className="clinic-tabs clinic-navigation"/g)||[]).length,1);
 for(const id of ["clinic-view-today","clinic-view-patients","clinic-view-pending","clinic-pending-badge","clinic-refresh","clinic-logout"])
 assert.equal((page.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
 for(const href of ["/admin/agenda/","/admin/recursos/","/admin/preguntas/","/admin/articulos/","/admin/economia/","/admin/"])
 assert.ok(page.includes('href="'+href+'"'),href);
 assert.match(page,/<details className="clinic-more-menu">/);
 assert.match(clinic,/button\.setAttribute\("aria-current", "page"\)/);
 assert.match(shell,/pathname\.startsWith\("\/admin\/clinica"\)/);
 assert.match(pwa,/\.clinic-more-install-slot/);
});
test("Navegación móvil fija y escritorio lateral, sin tapar contenido",()=>{
 assert.match(css,/@media\(max-width:800px\)/);
 assert.match(css,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
 assert.match(css,/env\(safe-area-inset-bottom\)/);
 assert.match(css,/@media\(min-width:1100px\)/);
});
