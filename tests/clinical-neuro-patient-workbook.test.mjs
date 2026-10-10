import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const window={},document={readyState:"loading",addEventListener(){}};
for(const p of ["public/clinic-neuro-variant-factory.js","public/clinic-neuro-graded-recipes.js","public/clinic-neuro-weekly-composer.js"]){
 vm.runInNewContext(read(p),{window,document,Intl,Date});
}
const composer=window.NeuroWeeklyComposer;
const opts=(level,week,mode="weekly",domain="atencion")=>({
 level,week,mode,domain,priority:"equilibrado",variant:1,activity_type:"mixto",
 response:"flexible",format:"mixto",support:"moderado",intervention:"estimulacion",accessibility:"",theme:"",goal:""
});
test("156 cuadernos adultos ofrecen consignas propias, 14 estímulos y respuestas por tarea",()=>{
 for(const level of ["apoyo_alto","apoyo_moderado","autonomo"]){
  for(let week=1;week<=52;week++){
   const conf=opts(level,week),doc=composer.build(conf),tasks=composer.selectRecipes(conf);
   assert.equal(doc.visual_blocks.length,14);
   assert.equal(new Set(doc.neuro_profile.covered_domains).size,13);
   const titles=doc.instructions.match(/(?:^|\n)Ejercicio \d+:/g)||[];
   assert.equal(titles.length,14);
   const answers=doc.instructions.match(/\nTu respuesta:/g)||[];
   assert.equal(answers.length,14);
   for(const field of ["Consigna:","Material:","Cómo responder:","Dudas o notas:"])
    assert.equal(doc.instructions.split(field).length-1,14,field);
   for(let i=0;i<14;i++){
    assert.match(doc.visual_blocks[i].title,new RegExp("^Ejercicio "+(i+1)+" · "));
    if(tasks[i].solution.length>=25)assert.ok(!JSON.stringify(doc).includes(tasks[i].solution),
      "Solución profesional dentro del documento del paciente: "+tasks[i].title);
   }
   assert.doesNotMatch(doc.instructions,/Qué observar:|Demanda y modalidad:|Adaptación:|Ayudas:|Criterio de corrección:|registrar participación/i);
   assert.ok(JSON.stringify(doc).length<60000);
  }
 }
});
test("la clave de corrección es únicamente para el profesional",()=>{
 const producer=read("public/clinic-neuro-weekly-composer.js");
 const clinical=read("public/admin-clinica.js");
 assert.match(producer,/professional_answer_key:tasksAnswerKey\(opts\)/);
 assert.match(clinical,/USO PROFESIONAL EXCLUSIVO/);
 assert.match(clinical,/rationale: els\.exerciseRationale\.value/);
 const worker=read("worker.ts");
 assert.match(worker,/select=id,title,status,patient_document,review_due_at/);
 assert.doesNotMatch(worker,/patient-portal\/session[\s\S]{0,200}rationale/);
});
test("la actividad del paciente es editable, persistente y revisable en Gestión clínica",()=>{
 const portal=read("public/mi-espacio.js");
 const worker=read("worker.ts");
 const clinical=read("public/admin-clinica.js");
 assert.match(portal,/appendNeuroWorkbook\(body,documentData,item\)/);
 assert.match(portal,/data-neuro-answer/);
 assert.match(portal,/neuro_answers: neuroAnswers/);
 assert.match(worker,/rawNeuroAnswers\.length!==digitalTaskCount/);
 assert.match(worker,/patient_response: \{ version: neuroAnswers \? 2 : 1/);
 assert.match(clinical,/patientResponse\.neuro_answers\.forEach/);
});
test("la vista online y el PDF anclan tablas e imágenes a cada ejercicio",()=>{
 const viewer=read("supabase/functions/view-clinical-exercise/index.ts");
 const visuals=read("supabase/functions/view-clinical-exercise/visual-blocks.ts");
 assert.match(viewer,/weeklyInstructionsHtml\(doc\.instructions \|\| "", doc\.visual_blocks\)/);
 assert.match(viewer,/await drawVisualResources\(\[visual\],true\)/);
 assert.match(viewer,/drawShapeGlyph/);
 assert.match(viewer,/exercise-answer-space/);
 assert.match(visuals,/return value\.slice\(0, 14\)/);
 assert.match(visuals,/inline \? '<div class="exercise-inline-visual">/);
});
test("el generador de psicología conserva el comportamiento anterior",()=>{
 const portal=read("public/mi-espacio.js");
 assert.match(portal,/documentData\.clinical_area!=="neuropsychology"/);
 assert.match(read("worker.ts"),/TWO_WEEK_MATERIAL_GUIDELINES/);
});
