import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const window={};
const document={readyState:"loading",addEventListener(){}};
for(const file of ["clinic-neuro-variant-factory.js","clinic-neuro-graded-recipes.js","clinic-neuro-weekly-composer.js","clinic-neuro-catalog-browser.js"]){
 vm.runInNewContext(read("public/"+file),{window,document,Intl,Date,Event:setTimeout}, {filename:file});
}
const composer=window.NeuroWeeklyComposer;
const browser=window.NeuroCatalogBrowser;
const items=composer.catalog();
const settings={week:10,mode:"individual",domain:"memoria",level:"autonomo",intervention:"entrenamiento",response:"flexible",support:"minimo",format:"mixto",goal:"retener consignas",accessibility:"alto contraste"};

test("catálogo exploratorio único con 13 funciones, tres demandas y cuatro modalidades",()=>{
 assert.equal(items.length,78);
 assert.equal(new Set(items.map(browser.key)).size,items.length);
 assert.equal(new Set(items.map(x=>x.domain)).size,13);
 for(const level of ["apoyo_alto","apoyo_moderado","autonomo"])assert.ok(browser.filter(items,{level}).length>0);
 for(const format of ["visual","verbal","funcional","logico"])assert.ok(browser.filter(items,{format}).length>0);
});
test("los filtros se combinan y la búsqueda no depende de acentos",()=>{
 const results=browser.filter(items,{query:"MEMORIA",domain:"memoria",level:"autonomo"});
 assert.ok(results.length>=1);
 assert.ok(results.every(x=>x.domain==="memoria"&&x.level==="autonomo"));
 assert.equal(browser.filter(items,{query:"palabra inexistente no catalogada"}).length,0);
});
test("la ficha individual respeta exactamente la propuesta elegida también en semanas posteriores",()=>{
 const recipe=items.find(x=>x.domain==="memoria"&&x.level==="autonomo"&&x.format==="verbal") ||
   items.find(x=>x.domain==="memoria"&&x.level==="autonomo");
 assert.ok(recipe);
 const selectedRecipe={domain:recipe.domain,level:recipe.level,title:recipe.title};
 const document=composer.build({...settings,selectedRecipe});
 assert.equal(document.neuro_profile.selected_activity,recipe.title);
 assert.match(document.instructions,new RegExp("Ejercicio 1:.*"+recipe.title));
 assert.equal(document.visual_blocks.length,1);
 assert.equal(document.visual_blocks[0].title.startsWith("Ejercicio 1 ·"),true);
 assert.doesNotMatch(document.instructions,/Criterio de revisión|Solución orientativa/i);
 assert.equal((document.instructions.match(/Ejercicio \d+:/g)||[]).length,1);
 const selected=composer.selectRecipes({...settings,selectedRecipe})[0];
 assert.equal(selected.title,recipe.title);
});
test("no filtra soluciones en el encabezado del material ni altera cuaderno semanal",()=>{
 const chosen=items.find(x=>x.domain==="memoria"&&x.level==="autonomo");
 const doc=composer.build({...settings,mode:"weekly",selectedRecipe:{domain:chosen.domain,level:chosen.level,title:chosen.title}});
 assert.equal(doc.neuro_profile.selected_activity,null);
 assert.equal((doc.instructions.match(/Ejercicio \d+:/g)||[]).length,14);
});
test("se conserva una sola acción de prescripción y la solución queda en vista profesional",()=>{
 const page=read("app/admin/clinica/page.tsx");
 const script=read("public/clinic-neuro-catalog-browser.js");
 assert.match(page,/id="clinic-neuro-catalog-search"/);
 assert.match(page,/clinic-neuro-catalog-browser\.js/);
 assert.equal((page.match(/id="clinic-neuro-generate"/g)||[]).length,1);
 assert.match(script,/textContent=text/);
 assert.match(script,/Solución orientativa o criterio de revisión/);
 assert.match(script,/window.NeuroSelectedRecipe=null/);
});
