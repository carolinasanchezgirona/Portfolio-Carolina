import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const read = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");
const window = {};
const document = {readyState:"loading",addEventListener(){}};
vm.runInNewContext(read("public/clinic-neuro-variant-factory.js"),{window,document,Intl,Date});
vm.runInNewContext(read("public/clinic-neuro-graded-recipes.js"),{window,document,Intl,Date});
vm.runInNewContext(read("public/clinic-neuro-weekly-composer.js"),{window,document,Intl,Date});
const composer=window.NeuroWeeklyComposer;
const domainNames=composer.GROUPS.map(row=>row[0]);
const domainLabels=composer.GROUPS.map(row=>row[1]);
const settings=(week,mode="weekly",domain="memoria")=>({
 week,mode,domain,intervention:"estimulacion",level:"apoyo_moderado",
 response:"flexible",accessibility:"letra grande",goal:"practicar estrategias",theme:""
});

test("el compositor ofrece trece funciones y un mínimo de veintiséis tareas originales",()=>{
 assert.equal(domainNames.length,13);
 assert.ok(composer.RECIPES.length>=26);
 for(const domain of domainNames)assert.ok(composer.RECIPES.filter(recipe=>recipe.domain===domain).length>=2,domain);
});

test("los cuadernos de doce semanas contienen catorce actividades y toda la cobertura cognitiva",()=>{
 for(let week=1;week<=12;week++){
  const doc=composer.build(settings(week));
  assert.equal(doc.clinical_area,"neuropsychology");
  assert.equal(doc.neuro_profile.mode,"weekly");
  assert.equal(doc.neuro_profile.week_number,week);
  assert.equal((doc.instructions.match(/(?:^|\n)Ejercicio\s+\d+:/g)||[]).length,14);
  for(let day=1;day<=7;day++)assert.equal((doc.instructions.match(new RegExp("Día "+day+"\\s*[·:]","g"))||[]).length,2);
  assert.equal(new Set(doc.neuro_profile.covered_domains).size,13);
  for(const label of domainLabels)assert.ok(doc.instructions.toLowerCase().includes(label.toLowerCase()),label+" semana "+week);
  assert.match(doc.record_prompt,/Dudas para comentar/);
  assert.doesNotMatch(doc.instructions,/(?:^|\n)Semana (?:0|53)/);
 }
});

test("la ficha focal se mantiene distinta del cuaderno multicomponente",()=>{
 const doc=composer.build(settings(2,"single","memoria"));
 assert.equal(doc.neuro_profile.mode,"single");
 assert.equal(doc.neuro_profile.domain,"memoria");
 assert.equal((doc.instructions.match(/(?:^|\n)Ejercicio\s+\d+:/g)||[]).length,3);
 assert.match(doc.instructions,/Transferencia funcional/);
});

test("cada actividad tiene guía, estímulos y criterios observacionales, sin baremos",()=>{
 for(const mode of ["weekly","single"]){
  const doc=composer.build(settings(4,mode,"lenguaje"));
  const tasks=doc.instructions.split(/(?:^|\n)Ejercicio\s+\d+:/g).slice(1);
  for(const task of tasks){
   for(const label of ["Objetivo:","Materiales:","Preparación:","Pasos:","Ejemplo:","Ayudas:","Adaptación:","Duración y frecuencia:","Qué observar:"]) assert.ok(task.includes(label),label);
   assert.ok(task.length>350);
  }
  assert.doesNotMatch(doc.instructions,/z_score|baremo validado|puntuación normativa/);
 }
});

test("las visualizaciones están estructuradas, son imprimibles y corresponden al tipo esperado",()=>{
 for(let week=1;week<=12;week++){
  const doc=composer.build(settings(week));
  assert.equal(doc.visual_blocks.length,14);
  assert.ok(doc.visual_blocks.length<=14);
  for(const block of doc.visual_blocks){
   assert.ok(block.title);
   if(block.type==="table"){
    const rows=block.content.split("\n").map(s=>s.split("|"));
    assert.ok(rows.length>=2);
    assert.ok(rows[0].length>=2&&rows[0].length<=6);
    assert.ok(rows.every(row=>row.length===rows[0].length));
   }else if(block.type==="diagram"){
    assert.ok(block.content.split("\n").length>=2);
   }else if(block.type==="calendar"){
    assert.match(block.content,/^\d{4}-(0[1-9]|1[0-2])$/);
   }else assert.fail("Tipo no permitido: "+block.type);
  }
 }
});

test("el generador visual es privado y las imágenes nunca se solicitan con identificadores del paciente",()=>{
 const worker=read("worker.ts");
 const materials=read("public/clinic-neuro-materials.js");
 assert.match(worker,/async function clinicalNeuroVisualImageRequest/);
 assert.match(worker,/verifyEditorialOwner\(request\)/);
 assert.match(worker,/containsDirectPatientIdentifiers\(brief\)/);
 assert.match(materials,/clinic\/clinical_area|clinic-neuro-mode|neuro_profile/);
 assert.match(materials,/blocks\.map\(\(\{prompt,\.\.\.b\}\)/);
});

test("la interfaz mantiene una sola ruta y no duplica acciones de envío",()=>{
 const page=read("app/admin/clinica/page.tsx");
 assert.match(page,/id="clinic-neuro-generate"/);
 assert.match(page,/id="clinic-neuro-mode"/);
 assert.match(page,/id="clinic-visual-details"/);
 assert.match(page,/Guardar y enviar al paciente/);
 assert.equal((page.match(/id="clinic-exercise-rationale"/g)||[]).length,1);
 assert.equal((page.match(/id="clinic-add-material-library"/g)||[]).length,1);
 assert.match(page,/clinic-neuro-weekly-composer\.js/);
});

test("la biblioteca cubre todos los dominios y tres niveles con dos recetas distintas por combinación",()=>{
 assert.equal(composer.catalog().length,78);
 for(const domain of domainNames)for(const level of ["apoyo_alto","apoyo_moderado","autonomo"]){
  const items=composer.catalog().filter(x=>x.domain===domain&&x.level===level);
  assert.equal(items.length,2,domain+" · "+level);
  assert.equal(new Set(items.map(x=>x.title)).size,2,domain+" · "+level);
  for(const item of items) {
    assert.ok(item.task&&item.stimuli&&item.solution&&item.visualType&&item.format,item.title);
    assert.doesNotMatch(item.task,/baremo|z.score/i);
  }
 }
});

test("los tres niveles generan tareas diferentes con cobertura de 13 funciones",()=>{
 const docs=["apoyo_alto","apoyo_moderado","autonomo"].map(level=>composer.build({...settings(3),level,support:"moderado",format:"mixto"}));
 const stimuli=docs.map(doc=>doc.instructions.match(/Estímulos: .*/g)||[]);
 assert.equal(stimuli.length,3);
 assert.notDeepEqual(stimuli[0],stimuli[1]);
 assert.notDeepEqual(stimuli[1],stimuli[2]);
 for(const doc of docs){
  assert.equal((doc.instructions.match(/(?:^|\n)Ejercicio\s+\d+:/g)||[]).length,14);
  assert.equal(new Set(doc.neuro_profile.covered_domains).size,13);
  assert.match(doc.instructions,/Demanda y modalidad:/);
  assert.match(doc.instructions,/La dificultad describe la tarea/);
 }
});

test("ejercicio individual: una tarea, modalidad y apoyos independientes",()=>{
 for(const level of ["apoyo_alto","apoyo_moderado","autonomo"]){
  const doc=composer.build({...settings(6,"individual","memoria"),level,support:"alto",format:"mixto"});
  assert.equal(doc.neuro_profile.mode,"individual");
  assert.equal(doc.neuro_profile.support,"alto");
  assert.equal((doc.instructions.match(/(?:^|\n)Ejercicio\s+\d+:/g)||[]).length,1);
  assert.equal(doc.visual_blocks.length,1);
  assert.match(doc.instructions,/Modelar una respuesta/);
 }
});

test("la variante cambia estímulos sin alterar dificultad ni semana",()=>{
 const a=composer.selectRecipes({...settings(2,"individual","atencion"),level:"autonomo",variant:0})[0];
 const b=composer.selectRecipes({...settings(2,"individual","atencion"),level:"autonomo",variant:1})[0];
 assert.notEqual(a.title,b.title);
 assert.equal(a.level,b.level);
 const visual=composer.selectRecipes({...settings(2,"individual","orientacion_espacial"),level:"autonomo",format:"visual"})[0];
 assert.equal(visual.format,"visual");
});

test("el editor distingue demanda, apoyo, formato y modalidad individual",()=>{
 const page=read("app/admin/clinica/page.tsx");
 const materials=read("public/clinic-neuro-materials.js");
 assert.match(page,/clinic-neuro-graded-recipes\.js/);
 for(const id of ["clinic-neuro-support","clinic-neuro-format","clinic-neuro-level"])assert.ok(page.includes('id="'+id+'"'));
 assert.match(page,/<option value="individual">Ejercicio individual/);
 assert.match(materials,/individual&&exercises\.length!==1/);
 assert.match(materials,/support: \$\("clinic-neuro-support"\)/);
});
