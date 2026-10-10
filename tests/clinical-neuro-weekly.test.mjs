import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const script=readFileSync(new URL("../public/clinic-neuro-materials.js",import.meta.url),"utf8");
const worker=readFileSync(new URL("../worker.ts",import.meta.url),"utf8");
const viewer=readFileSync(new URL("../supabase/functions/view-clinical-exercise/index.ts",import.meta.url),"utf8");
const catalog=JSON.parse(readFileSync(new URL("../public/clinic-neuro-starter-library.json",import.meta.url),"utf8"));
const start=script.indexOf("  const DOMAIN_PRACTICE = {");
const end=script.indexOf("  async function initializeStarterLibrary()",start);
assert.ok(start>=0&&end>start,"Se localiza el generador de borradores iniciales");
const make=vm.runInNewContext(script.slice(start,end)+"\n starterToDocument;",{
  DOMAIN_LABELS:{
    orientacion_temporal:"Orientación temporal",orientacion_espacial:"Orientación espacial",orientacion_personal:"Orientación personal",
    atencion:"Atención",memoria:"Memoria",funciones_ejecutivas:"Funciones ejecutivas",lenguaje:"Lenguaje",
    visuoespacial:"Visuoespacial",praxias_gnosias:"Praxias y gnosias",cognicion_funcional:"Cognición funcional"
  },
  $:(id)=>({value:id==="clinic-neuro-week-number"?"3":id==="clinic-neuro-response-mode"?"senalamiento":""})
});

test("Los 24 borradores son semanales, con número configurable, sin segunda semana",()=>{
  for(const item of catalog.activities){
    const doc=make(item);
    assert.equal(doc.clinical_area,"neuropsychology",item.code);
    assert.equal(doc.neuro_profile.week_number,3,item.code);
    assert.match(doc.instructions,/^Semana 3\n\nEjercicio 1:/,item.code);
    const count=(doc.instructions.match(/(?:^|\n)Ejercicio\s+\d+:/g)||[]).length;
    assert.equal(count,4,item.code);
    assert.doesNotMatch(doc.instructions,/(?:^|\n)\s*Semana\s+(?:1|2|4)\b/,item.code);
    assert.match(doc.frequency,/Semana 3/i,item.code);
    assert.doesNotMatch(doc.remember,/dos semanas/i,item.code);
  }
});
test("Los 96 ejercicios de biblioteca están escritos para quien los realiza",()=>{
  for(const item of catalog.activities){
    const doc=make(item);
    const chunks=doc.instructions.split(/(?:^|\n)Ejercicio\s+\d+:/g).slice(1);
    assert.equal(chunks.length,4,item.code);
    for(const [index,chunk] of chunks.entries()){
      for(const label of ["Consigna:","Material:","Cómo responder:","Tu respuesta:","Dudas o notas:"]){
        assert.ok(chunk.includes(label),item.code+" ejercicio "+(index+1)+" "+label);
      }
      assert.doesNotMatch(chunk,/Qué observar:|Adaptación:|Modelar primero|No incrementar velocidad|no puntuación rígida/i,item.code);
    }
    assert.match(doc.record_prompt,/dudas/i,item.code);
  }
});

test("Psicología mantiene los materiales quincenales; neuropsicología usa otro contrato",()=>{
  assert.ok(worker.includes("TWO_WEEK_MATERIAL_GUIDELINES"));
  assert.ok(worker.includes("WEEKLY_NEURO_MATERIAL_GUIDELINES"));
  assert.match(worker,/doc\.clinical_area==="neuropsychology"\?completeWeeklyNeuroMaterial\(doc\):completeTwoWeekMaterial\(doc\)/);
  assert.match(script,/week_number:/);
});
test("El lector y el PDF respetan jerarquía, márgenes y separación semanal",()=>{
  assert.match(viewer,/function weeklyInstructionsHtml/);
  assert.match(viewer,/class=\\"exercise-card/);
  assert.match(viewer,/exercise-stack\{display:grid;gap:28px/);
  assert.match(viewer,/drawWeeklyNeuroInstructions/);
  assert.match(viewer,/marginX = isNeuro \? 67 : 61/);
  assert.match(viewer,/ensureSpace\(Math\.max\(118, cardTop \+ 67\)\)/);
  assert.match(viewer,/drawWorkArea\(isNeuro \? 4 : 7\)/);
});

test("Gradación cognitiva y modalidades accesibles en las fichas semanales",()=>{
  assert.match(script,/const DOMAIN_PRACTICE/);
  assert.match(script,/response_mode:responseMode/);
  assert.match(script,/accesibilidad|accessibility/i);
  for(const item of catalog.activities){
    assert.equal(item.visual_blocks.length,2,item.code);
    assert.equal(item.examples.length,4,item.code);
    const doc=make(item);
    assert.equal(doc.neuro_profile.response_mode,"senalamiento",item.code);
    assert.ok(doc.instructions.includes("Tu respuesta:"),item.code);
    assert.match(doc.record_prompt,/dudas/i,item.code);
    assert.equal(doc.visual_blocks.length,4,item.code);
  }
});
