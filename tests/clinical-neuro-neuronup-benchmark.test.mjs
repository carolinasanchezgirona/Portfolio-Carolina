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
const config=(type,mode="weekly",level="autonomo",domain="orientacion_espacial")=>({
  week:1,level,mode,domain,variant:0,activity_type:type,support:"moderado",
  format:"mixto",intervention:"rehabilitacion",response:"flexible",goal:"",
  theme:"",accessibility:""
});

test("fichas y generadores son procedimientos diferenciados, sin juegos fingidos",()=>{
  const fixed=composer.selectRecipes(config("ficha"));
  const generated=composer.selectRecipes(config("generador"));
  assert.equal(fixed.length,14);
  assert.equal(generated.length,14);
  assert.ok(fixed.every(r=>!r.generated));
  assert.ok(generated.every(r=>r.generated===true));
  assert.equal(new Set(fixed.map(x=>x.domain)).size,13);
  assert.equal(new Set(generated.map(x=>x.domain)).size,13);
  assert.equal(composer.build(config("generador")).neuro_profile.activity_type,"generador");
  assert.equal(composer.build(config("ficha")).neuro_profile.activity_type,"ficha");
});

test("modo focal utiliza dos variantes paramétricas y la transferencia funcional",()=>{
  const tasks=composer.selectRecipes(config("generador","single","autonomo","atencion"));
  assert.equal(tasks.length,3);
  assert.equal(tasks.filter(x=>x.generated===true).length,2);
  assert.match(tasks[2].title,/Transferencia funcional/);
});

test("el mapa avanzado es una matriz de 5x5 con parada obligatoria y trayecto válido",()=>{
  for(let seed=1;seed<=120;seed++){
    const r=factory.create("orientacion_espacial","autonomo",seed*41);
    const rows=r.stimuli.split("\n").map(line=>line.split("|"));
    assert.equal(rows.length,6);
    assert.ok(rows.every(row=>row.length===6));
    const cells=rows.slice(1).map(row=>row.slice(1));
    assert.equal(cells[2][2],"Centro cultural");
    assert.equal(cells[4][4]=== "Mercado" || cells[4][4]==="Biblioteca",true);
    const trail=r.solution.split("Una ruta válida: ")[1].split(";")[0].split(" → ");
    assert.equal(trail[0],"A1");
    assert.equal(trail.at(-1),"E5");
    assert.ok(trail.includes("C3"));
    let last;
    for(const code of trail){
      const x=code.charCodeAt(0)-65,y=Number(code.slice(1))-1;
      assert.ok(x>=0&&x<5&&y>=0&&y<5);
      assert.notEqual(cells[y][x],"Obras");
      if(last)assert.equal(Math.abs(last.x-x)+Math.abs(last.y-y),1);
      last={x,y};
    }
    const distance=(start,target)=>{
      const queue=[[...start,0]],seen=new Set();
      while(queue.length){
        const [x,y,d]=queue.shift();
        if(x===target[0]&&y===target[1])return d;
        if(x<0||x>=5||y<0||y>=5||cells[y][x]==="Obras"||seen.has(x+","+y))continue;
        seen.add(x+","+y);
        for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]])queue.push([x+dx,y+dy,d+1]);
      }
      return Infinity;
    };
    assert.equal(trail.length-1,distance([0,0],[2,2])+distance([2,2],[4,4]));
  }
});

test("el formulario exige nivel de demanda y diferencia formatos realmente disponibles",()=>{
  const page=read("app/admin/clinica/page.tsx"),js=read("public/clinic-neuro-weekly-composer.js");
  const worker=read("worker.ts");
  assert.match(page,/id="clinic-neuro-activity-type"/);
  assert.match(page,/<option value="generador">/);
  assert.match(page,/Juegos digitales|juegos y autocorrección|juegos y la autocorrección|juegos interactivos/i);
  assert.match(js,/if\(!LEVEL_NAMES\[opts.level\]\)/);
  assert.match(worker,/consistencia lógica y respuesta/);
  assert.match(worker,/benchmark funcional/);
});
