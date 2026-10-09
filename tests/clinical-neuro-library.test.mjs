import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const catalog=JSON.parse(readFileSync(new URL("../public/clinic-neuro-starter-library.json", import.meta.url),"utf8"));
const {activities}=catalog;

test("24 actividades iniciales únicas, pendientes de revisión profesional",()=>{
 assert.equal(catalog.status,"draft_requires_clinical_review");
 assert.equal(activities.length,24);
 assert.equal(new Set(activities.map(x=>x.code)).size,24);
 assert.equal(new Set(activities.map(x=>x.title)).size,24);
 assert.ok(activities.every(x=>x.review_status==="draft_requires_clinical_review"));
});
test("dominios fundamentales y orientación triple completos",()=>{
 const domains=new Set(activities.map(x=>x.domain));
 ["orientacion_temporal","orientacion_espacial","orientacion_personal","atencion","memoria","funciones_ejecutivas","lenguaje","visuoespacial","praxias_gnosias","cognicion_funcional"].forEach(x=>assert.ok(domains.has(x),x));
 for(const domain of ["orientacion_temporal","orientacion_espacial","orientacion_personal"]) assert.equal(activities.filter(x=>x.domain===domain).length,3);
});
test("cada borrador incorpora objetivo, cuatro ejercicios, estímulos y cautela",()=>{
 for(const item of activities){
   assert.ok(item.title.length>8,item.code);
   assert.ok(item.objective.length>22,item.code);
   assert.ok(item.caution.length>28,item.code);
   assert.ok(item.steps.length===4,item.code);
   assert.ok(item.steps.every(s=>s.length>28),item.code);
   assert.ok(item.visual_blocks.length>0,item.code);
   for(const block of item.visual_blocks){
     assert.ok(["table","diagram","calendar","chart"].includes(block.type),item.code);
     assert.ok(block.title && block.content,item.code);
     if(block.type==="table"){
       const cells=block.content.split("\n").map(row=>row.split("|"));
       assert.ok(cells.length>=2,item.code);
       assert.ok(cells[0].length>=2 && cells[0].length<=6,item.code);
       assert.ok(cells.every(row=>row.length===cells[0].length),item.code);
     }
     if(block.type==="calendar")assert.match(block.content,/^\d{4}-(0[1-9]|1[0-2])/);
   }
 }
});
test("ningún borrador contiene diagnósticos, datos de pacientes ni resultados inventados",()=>{
 for(const item of activities){
   const text=JSON.stringify(item);
   assert.doesNotMatch(text, /@[^\s"]+\.[a-z]{2,}/i,item.code);
   assert.doesNotMatch(text, /\b(?:WAIS|WCST|NEPSY)\s*(?:ítem|item|baremo|escala)/i,item.code);
   assert.doesNotMatch(text, /validado clínicamente|eficacia garantizada|cura la demencia/i,item.code);
 }
});
