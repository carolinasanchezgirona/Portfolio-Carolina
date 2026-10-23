import assert from 'node:assert/strict';
import test from 'node:test';
import {canonicalTest,geriatricTests,geriatricItems,newGeriatricTest,scoreGeriatricTest,itemField,geriatricTestError,findTests} from '../app/admin/residencia/geriatric-tests.ts';
import {assessmentMetric,comparisonFor} from '../app/admin/residencia/assessment-history.ts';
const blank=name=>newGeriatricTest({id:'ficticio',date:'2026-10-23'},name);
function answered(name,last=false){const e=blank(name);for(const i of geriatricItems(name))e[itemField(i.key)]=(last?i.options.at(-1):i.options[0]).value;return scoreGeriatricTest(e);}
test('catalog aliases reuse existing instruments, physical and mental Cruz Roja remain distinct, and ambiguous RAPID stays inactive',()=>{
 assert.equal(new Set(geriatricTests.map(t=>t.instrument)).size,geriatricTests.length);
 for(const [name,expected] of [['MEC','MMSE'],['Mini-Mental','MMSE'],['Isaacs','Fluencia verbal'],['GSD Reisberg','GDS de Reisberg'],['Golberg','Goldberg'],['Lawton-Brody','Lawton y Brody']])assert.equal(canonicalTest(name),expected);
 assert.notEqual(canonicalTest('CRF'),canonicalTest('CRM'));assert.equal(findTests('RAPID')[0].mode,'pending');assert.equal(newGeriatricTest({id:'x'},'RAPID').geriatricFormat,undefined);assert.equal(findTests('funcionalidad').length,4);
});
test('Barthel, Lawton, Cruz Roja and HAM-D use verified ranges; incomplete, invalid and unevaluable responses never become zero totals',()=>{
 for(const [name,min,max] of [['Índice de Barthel',0,100],['Lawton y Brody',8,0],['Cruz Roja física',0,5],['Cruz Roja mental',0,5],['Hamilton',0,52]]){
  assert.equal(answered(name).score,String(min));assert.equal(answered(name,true).score,String(max));
  let e=answered(name);const key=itemField(geriatricItems(name)[0].key);e[key]='';e=scoreGeriatricTest(e);assert.equal(e.validity,'Incompleto');assert.equal(e.score,'');assert.equal(assessmentMetric(e),null);
  e[key]='NA';e=scoreGeriatricTest(e);assert.equal(e.validity,'No evaluable');assert.equal(e.score,'');e[key]='-1';assert.match(geriatricTestError(e),/puntuación/);
 }
 const e=answered('Hamilton',true);assert.equal(geriatricItems('Hamilton').length,17);assert.equal(e.maximum,'52');
});
test('Katz distinguishes all 64 independence profiles without inventing an ordinal numeric score',()=>{
 for(let mask=0;mask<64;mask++){
  const e=blank('Índice de Katz'),d=[];geriatricItems(e.instrument).forEach((i,n)=>{const dep=!!(mask&(1<<n));e[itemField(i.key)]=dep?'1':'0';if(dep)d.push(n);});
  const r=scoreGeriatricTest(e),count=d.length;
  const expected=count===0?'A':count===1?'B':count===6?'G':count===2&&d.includes(0)?'C':count===3&&[0,1].every(i=>d.includes(i))?'D':count===4&&[0,1,2].every(i=>d.includes(i))?'E':count===5&&[0,1,2,3].every(i=>d.includes(i))?'F':'H';
  assert.equal(r.geriCategory,expected);assert.equal(r.score,'');assert.equal(assessmentMetric(r),null);
 }
});
test('Blessed preserves three areas rather than creating an unsupported global score',()=>{
 const e=answered('Blessed',true);assert.equal(geriatricItems(e.instrument).length,22);assert.deepEqual(JSON.parse(e.subscores),{Actividades:8,'Hábitos':9,'Personalidad y conducta':11});assert.equal(e.score,'');assert.equal(assessmentMetric(e),null);
 e.geri_daily0='1';assert.equal(JSON.parse(scoreGeriatricTest(e).subscores).Actividades,7.5);
});
test('external scores enforce their own protocol ranges, Goldberg subscales stay separate, and Geronte requires a documented qualitative profile',()=>{
 for(const [name,min,max] of [['Cornell',0,38],['Beck',0,63],['Zung',20,80]]){
  const e={...blank(name),validity:'Aplicado',score:String(min)};assert.equal(geriatricTestError(e),'');assert.equal(geriatricTestError({...e,score:String(max)}),'');assert.match(geriatricTestError({...e,score:String(max+1)}),/rango/);assert.match(geriatricTestError({...e,score:''}),/puntuación/);assert.equal(geriatricTestError({...e,validity:'Incompleto',score:''}),'');
 }
 const g={...blank('Goldberg'),validity:'Aplicado',score:'4',maximum:'9'};assert.match(geriatricTestError(g),/subescala/);g.version='EADG-A · ansiedad · 9 ítems · resultado externo';assert.equal(geriatricTestError(g),'');assert.match(geriatricTestError({...g,score:'18'}),/rango/);
 const geronte={...blank('Geronte'),version:'Edición documentada',validity:'Aplicado'};assert.match(geriatricTestError(geronte),/perfil cualitativo/);assert.equal(geriatricTestError({...geronte,resultSummary:'Perfil registrado'}),'');
});
test('history compares only matching protocols, languages and outcome scales; old records remain untouched',()=>{
 const first=answered('Índice de Barthel'),second={...answered('Índice de Barthel',true),id:'second',date:'2026-10-24'};assert.equal(comparisonFor([first,second],second).delta,100);
 assert.equal(comparisonFor([first,{...second,language:'Català'}],{...second,language:'Català'}),null);
 const a={...blank('Goldberg'),version:'EADG-A · ansiedad · 9 ítems · resultado externo',validity:'Aplicado',score:'4',maximum:'9'},d={...a,id:'d',date:'2026-10-24',version:'EADG-D · depresión · 9 ítems · resultado externo'};assert.equal(comparisonFor([a,d],d),null);
 const legacy={id:'legacy',instrument:'Barthel',score:'50'};assert.deepEqual(scoreGeriatricTest(legacy),legacy);
});
