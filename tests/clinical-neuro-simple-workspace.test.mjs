import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=name=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
const window={},document={readyState:"loading",addEventListener(){}};
for(const name of ["clinic-neuro-variant-factory.js","clinic-neuro-graded-recipes.js","clinic-neuro-weekly-composer.js"])vm.runInNewContext(read("public/"+name),{window,document,Date,Intl});
const composer=window.NeuroWeeklyComposer;
const opts=(focus,mode="weekly")=>({
 week:4,mode,domain:mode==="weekly"?"multidominio":focus,
 priority:focus,level:"autonomo",support:"moderado",
 format:"mixto",activity_type:"mixto",intervention:"estimulacion",
 response:"flexible",accessibility:"",theme:"",goal:""
});

test("inicio neuropsicológico ofrece solo tres decisiones principales",()=>{
 const page=read("app/admin/clinica/page.tsx");
 const start=page.indexOf('<fieldset id="clinic-neuro-settings"');
 const advanced=page.indexOf('<details className="clinic-neuro-advanced">',start);
 assert.ok(start>=0&&advanced>start);
 const initial=page.slice(start,advanced);
 assert.equal((initial.match(/<select /g)||[]).length,3);
 assert.equal((initial.match(/id="clinic-neuro-(?:mode|focus|level)"/g)||[]).length,3);
 assert.match(initial,/Cuaderno semanal · 7 días/);
 assert.match(initial,/Variado · todas las funciones/);
 assert.match(initial,/Elegir nivel…/);
 assert.match(initial,/id="clinic-neuro-generate"/);
});
test("las opciones secundarias permanecen ocultas en sección desplegable",()=>{
 const page=read("app/admin/clinica/page.tsx");
 for(const id of ["clinic-neuro-activity-type","clinic-neuro-week-number","clinic-neuro-domain","clinic-neuro-intervention","clinic-neuro-format","clinic-neuro-support","clinic-neuro-theme","clinic-neuro-response-mode","clinic-neuro-accessibility","clinic-neuro-functional-goal","clinic-neuro-catalog"])assert.ok(page.includes('id="'+id+'"'),id);
 assert.match(page,/className="clinic-neuro-advanced"/);
 assert.match(page,/id="clinic-material-editor-stage"/);
 const css=read("app/admin/clinica/neuro-materials.css");
 assert.match(css,/\.clinic-exercise-dialog\.neuro-fullscreen\[open\]/);
 assert.match(css,/\.neuro-fullscreen:not\(\.neuro-ready\) #clinic-material-editor-stage/);
 assert.match(read("public/clinic-neuro-materials.js"),/neuro-ready/);
});
test("la prioridad seleccionada obtiene una segunda actividad sin perder el resto de dominios",()=>{
 for(const [domain] of composer.GROUPS){
  const doc=composer.build(opts(domain));
  const recipes=composer.selectRecipes(opts(domain));
  assert.equal(recipes.length,14);
  assert.equal(new Set(recipes.map(x=>x.domain)).size,13);
  assert.equal(recipes.filter(x=>x.domain===domain).length,2,domain);
  assert.equal(doc.neuro_profile.priority_domain,domain);
  assert.equal(doc.neuro_profile.covered_domains.length,13);
  assert.equal(doc.visual_blocks.length,8);
 }
});
test("equilibrado no privilegia una función fija y mantiene 7 jornadas con 14 tareas",()=>{
 const doc=composer.build(opts("equilibrado"));
 assert.equal(doc.neuro_profile.priority_domain,"equilibrado");
 assert.equal((doc.instructions.match(/(?:^|\n)Ejercicio \d+:/g)||[]).length,14);
 for(let d=1;d<=7;d++)assert.equal((doc.instructions.match(new RegExp("Día "+d+" ·","g"))||[]).length,2);
});
test("modo focal sigue produciendo tres ejercicios, individual exactamente uno",()=>{
 for(const mode of ["single","individual"]){
  const doc=composer.build(opts("memoria",mode));
  assert.equal(doc.neuro_profile.domain,"memoria");
  assert.equal((doc.instructions.match(/(?:^|\n)Ejercicio \d+:/g)||[]).length,mode==="single"?3:1);
 }
});
test("catálogo no reemplaza silenciosamente la función elegida al preparar una ficha",()=>{
 const c=read("public/clinic-neuro-catalog-browser.js");
 assert.match(c,/if\(focus\)focus\.value=item\.domain/);
 const js=read("public/clinic-neuro-weekly-composer.js");
 assert.match(js,/function syncMode/);
 assert.match(js,/if\(!weekly&&focus\.value==="equilibrado"\)focus\.value="atencion"/);
});
