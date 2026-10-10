import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const window={};
const document={readyState:"loading",addEventListener(){}};
for(const path of ["public/clinic-neuro-variant-factory.js","public/clinic-neuro-graded-recipes.js","public/clinic-neuro-weekly-composer.js"]){
  vm.runInNewContext(read(path),{window,document,Intl,Date});
}
const composer=window.NeuroWeeklyComposer;
const factory=window.NeuroVariantFactory;
const levels=["apoyo_alto","apoyo_moderado","autonomo"];
const settings=(week,level,mode="weekly",domain="atencion")=>({
  week,level,mode,domain,variant:0,support:"moderado",format:"mixto",
  intervention:"estimulacion",response:"flexible",goal:"",theme:"",accessibility:""
});

test("auditoría 52 semanas por cada nivel sin redundancias consecutivas",()=>{
  for(const level of levels){
    let previous=new Set();
    const seen=new Map(composer.GROUPS.map(row=>[row[0],new Set()]));
    for(let week=1;week<=52;week++){
      const config=settings(week,level);
      const tasks=composer.selectRecipes(config);
      const material=composer.build(config);
      assert.equal(tasks.length,14);
      assert.equal(new Set(tasks.map(t=>t.domain)).size,13);
      assert.equal(new Set(tasks.map(t=>t.title)).size,14);
      assert.equal(material.visual_blocks.length,8);
      const current=new Set(tasks.map(t=>t.domain+"|"+t.stimuli));
      for(const entry of current)assert.ok(!previous.has(entry),level+" semana "+week+" repetida: "+entry);
      for(const [domain] of composer.GROUPS){
        seen.get(domain).add(tasks.find(task=>task.domain===domain).stimuli);
      }
      for(const block of material.visual_blocks){
        assert.match(block.title,/^Ejercicio \d+ · /);
        assert.ok(material.instructions.includes("«"+block.title+"»"));
        if(block.type==="table"){
          const rows=block.content.split("\n").map(row=>row.split("|"));
          assert.ok(rows.length>=2&&rows.length<=13);
          assert.ok(rows[0].length>=2&&rows[0].length<=6);
          assert.ok(rows.every(row=>row.length===rows[0].length));
        }
      }
      previous=current;
    }
    for(const [domain,stimuli] of seen){
      assert.equal(stimuli.size,52,level+" · "+domain+" no ofrece 52 estímulos distintos");
    }
  }
});

test("las tres modalidades son distintas y no se imprimen soluciones",()=>{
  for(const level of levels)for(const mode of ["weekly","single","individual"]){
    const options=settings(5,level,mode,"memoria");
    const tasks=composer.selectRecipes(options),material=composer.build(options);
    assert.equal(tasks.length,mode==="weekly"?14:mode==="single"?3:1);
    for(const task of tasks)if(task.solution.length>=24){
      assert.ok(!material.instructions.includes(task.solution),"Solución expuesta en el cuaderno: "+task.title);
    }
    assert.equal(material.neuro_profile.level,level);
  }
});

test("reconocimiento diferido exige tapar estímulos",()=>{
  for(const level of levels){
    const item=factory.create("memoria",level,300);
    assert.match(item.task,/t[aá]p/i);
    assert.match(item.stimuli,/ESTUDIAR Y TAPAR/);
    assert.match(item.stimuli,/RESPONDER/);
  }
});

test("planos siguen trayectorias contiguas y sin obstáculos",()=>{
  for(const level of levels)for(let seed=1;seed<=52;seed++){
    const item=factory.create("orientacion_espacial",level,seed*41);
    const grid=item.stimuli.split("\n").slice(1).map(row=>row.split("|").slice(1));
    const trail=item.solution.split("Una ruta válida: ")[1].split(";")[0].replace(/\.$/,"").split(" → ");
    assert.equal(trail[0],"A1");
    let last=null;
    for(const cell of trail){
      const x=cell.charCodeAt(0)-65,y=Number(cell.slice(1))-1;
      assert.ok(x>=0&&x<grid.length&&y>=0&&y<grid.length);
      assert.notEqual(grid[y][x],"Obras");
      if(last)assert.equal(Math.abs(last.x-x)+Math.abs(last.y-y),1);
      last={x,y};
    }
    assert.equal(trail.at(-1),String.fromCharCode(64+grid.length)+grid.length);
  }
});

test("cálculos avanzados mantienen precio, descuento y cambio coherentes",()=>{
  for(let seed=1;seed<=52;seed++){
    const item=factory.create("calculo","autonomo",seed*41);
    const data=Object.fromEntries(item.stimuli.split("\n").slice(1).map(row=>row.split("|")));
    const price=Number(data["Precio inicial"].replace(" €",""));
    const discount=Number(data["Descuento"].replace(" %",""));
    const paid=Number(data["Pago"].replace(" €",""));
    const result=price*(100-discount)/100;
    assert.ok(item.solution.includes("Precio final: "+result+" €"));
    assert.ok(item.solution.includes("Cambio: "+(paid-result)+" €"));
  }
});

test("servidor e interfaz admiten ejercicio individual con los mismos límites",()=>{
  const worker=read("worker.ts"),page=read("app/admin/clinica/page.tsx");
  assert.match(worker,/INDIVIDUAL_NEURO_MATERIAL_GUIDELINES/);
  assert.match(worker,/individual\?exercises\.length===1/);
  assert.ok(page.indexOf('src="/clinic-neuro-variant-factory.js')>=0);
  assert.ok(page.indexOf('src="/clinic-neuro-variant-factory.js')<page.indexOf('src="/clinic-neuro-weekly-composer.js'));
  assert.equal((page.match(/id="clinic-neuro-generate"/g)||[]).length,1);
});
