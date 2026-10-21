import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultConfig,domains,generateMaterial,searchMaterials,validateConfig} from '../app/admin/residencia/material-generator.ts';
import {mergeVersions} from '../app/admin/residencia/offline-merge.ts';
test('all domains and languages produce complete tasks and answer keys at each difficulty',()=>{
 for(const language of ['es','ca','en'])for(const domain of domains)for(const difficulty of [1,2,3,4]){
 const m=generateMaterial({...defaultConfig,language,domains:[domain],difficulty},42);const e=m.data.exercises[0];assert(e.title&&e.instruction&&e.answer);assert.equal(m.data.reviewed,false);assert.equal(m.links.length,0);
 if(e.kind==='grid')assert.equal(e.cells.length%e.columns,0);else assert(e.body.length>0);
 if(domain==='Atención'){const expected=e.cells.flatMap((v,i)=>e.instruction.split(': ')[1].split('.')[0].includes(v)?[`${Math.floor(i/e.columns)+1}.${i%e.columns+1}`]:[]);assert.deepEqual(e.answer.split(' · '),expected);}
 if(domain==='Cálculo')for(const line of e.answer.split('\n')){const [a,op,b,,result]=line.split(' ');assert.equal(Number(result),op==='+'?Number(a)+Number(b):Number(a)-Number(b));}
 }
});
test('workbooks rotate selected functions and regenerate variants without changing configuration',()=>{const config={...defaultConfig,format:'Cuaderno',pages:12,domains:[...domains]};const original=structuredClone(config);const a=generateMaterial(config,10),b=generateMaterial(config,20);assert.equal(a.data.exercises.length,12);assert.deepEqual(a.data.exercises.slice(0,6).map(e=>e.domain),domains);assert.deepEqual(config,original);assert.notDeepEqual(a.data.exercises.map(e=>e.body||e.cells),b.data.exercises.map(e=>e.body||e.cells));});
test('configuration rejects empty domains, out of range lengths and unsupported literacy presentation',()=>{assert(validateConfig({...defaultConfig,domains:[]}));assert(validateConfig({...defaultConfig,format:'Cuaderno',pages:25}));assert(validateConfig({...defaultConfig,education:'Sin lectoescritura funcional',domains:['Lenguaje']}));assert.equal(validateConfig({...defaultConfig,education:'Sin lectoescritura funcional',domains:['Lenguaje'],facilitators:['Presentación oral']}),'');});
test('material search combines accent-insensitive words, function, language and resident',()=>{const m=generateMaterial({...defaultConfig,domains:['Atención'],notes:'Búsqueda con apoyo'},1);m.links=[{id:'r1',date:'today'}];assert.equal(searchMaterials([m],'atencion apoyo','Atención','es','r1').length,1);assert.equal(searchMaterials([m],'','Atención','ca','r1').length,0);assert.equal(searchMaterials([m],'','','','r2').length,0);});
test('concurrent resident assignments survive offline merge as independent links',()=>{const base=generateMaterial(defaultConfig,1);const local=structuredClone(base),remote=structuredClone(base);local.links.push({id:'a',date:'today'});remote.links.push({id:'b',date:'today'});const result=mergeVersions(base,local,remote);assert.deepEqual(result.conflicts,[]);assert.deepEqual(result.value.links.map(v=>v.id),['b','a']);});
