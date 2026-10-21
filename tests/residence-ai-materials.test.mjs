import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {defaultConfig,validateAiConfig,materialFromAi,searchMaterials} from '../app/admin/residencia/material-generator.ts';
import * as privacy from '../clinical-privacy.ts';
import * as generator from '../app/admin/residencia/material-generator.ts';
const require=createRequire(import.meta.url),ts=require('typescript');
const compiled=ts.transpileModule(fs.readFileSync(new URL('../residence-material-ai.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const module={exports:{}};
new Function('require','module','exports',compiled)(name=>name.includes('material-generator')?generator:privacy,module,module.exports);
const {residenceMaterialAi}=module.exports;
const brief=()=>({...structuredClone(defaultConfig),domains:['Memoria'],aiInstructions:'Una ficha de memoria sobre una compra con cuatro alimentos.'});
const proposal=()=>({title:'Recuerda la compra',warnings:[],exercises:[{domain:'Memoria',title:'Lista de la compra',instruction:'Lee y tapa la lista; después recuerda los productos.',body:'pan · leche · arroz · manzanas',answer:'pan, leche, arroz y manzanas',kind:'text',cells:null,columns:null}]});
const request=config=>new Request('https://example.org/api/residence/material-generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({config})});
test('normalizes only the generation brief and preserves instructions in saved/searchable material',()=>{
 const config=validateAiConfig({...brief(),resident:{name:'SHOULD NOT BE SENT'}});assert.equal('resident' in config,false);
 const material=materialFromAi(proposal(),config);assert.equal(material.data.reviewed,false);assert.equal(material.data.generator,'residence-ai-v1');assert.deepEqual(material.links,[]);
 assert.equal(material.data.config.aiInstructions,config.aiInstructions);assert.equal(searchMaterials([material],'cuatro alimentos','','','').length,1);
 assert.throws(()=>validateAiConfig({...brief(),aiInstructions:'corta'}));assert.throws(()=>validateAiConfig({...brief(),domains:['No permitida']}));
});
test('rejects wrong page counts, malformed grids and unrelated domains before preview',()=>{
 assert.throws(()=>materialFromAi(proposal(),{...brief(),format:'Cuaderno',pages:3}));
 const bad=proposal();bad.exercises[0].domain='Cálculo';assert.throws(()=>materialFromAi(bad,brief()));
 const grid=proposal();Object.assign(grid.exercises[0],{domain:'Atención',kind:'grid',columns:3,cells:['A','B','C','D'],body:''});assert.throws(()=>materialFromAi(grid,{...brief(),domains:['Atención']}));
 grid.exercises[0].cells=['A','B','C','D','E','F'];assert.equal(materialFromAi(grid,{...brief(),domains:['Atención']}).data.exercises[0].cells.length,6);
});
test('private endpoint enforces authentication and identifier preflight without provider calls',async()=>{
 assert.equal((await residenceMaterialAi(new Request('https://example.org'),{},async()=>true)).status,405);
 assert.equal((await residenceMaterialAi(request(brief()),{},async()=>false)).status,401);
 assert.equal((await residenceMaterialAi(request(brief()),{},async()=>true)).status,503);
 assert.equal((await residenceMaterialAi(request({...brief(),notes:'Correo: test@example.org'}),{OPENAI_API_KEY:'TEST'},async()=>true)).status,422);
 assert.equal((await residenceMaterialAi(request({...brief(),aiInstructions:'x'.repeat(25000)}),{OPENAI_API_KEY:'TEST'},async()=>true)).status,413);
});
test('provider receives the exact instructions and settings; structured response is never auto-approved',async()=>{
 const original=globalThis.fetch;try{let calls=0;globalThis.fetch=async(url,init)=>{
  calls++;assert.equal(url,'https://api.openai.com/v1/responses');const sent=JSON.parse(init.body);const input=JSON.parse(sent.input);
  assert.equal(input.config.aiInstructions,brief().aiInstructions);assert.equal(sent.store,false);assert.equal(sent.text.format.strict,true);assert.equal(sent.model,'configured-model');assert.deepEqual(Object.keys(input),['config']);
  return Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(proposal())}]}]});
 };const response=await residenceMaterialAi(request(brief()),{OPENAI_API_KEY:'TEST',OPENAI_TEXT_MODEL:'configured-model'},async()=>true);
 assert.equal(response.status,200);assert.equal(response.headers.get('Cache-Control'),'no-store');const data=await response.json();assert.equal(data.proposal.exercises.length,1);assert.equal(calls,1);assert.equal(JSON.stringify(data).includes('TEST'),false);
 }finally{globalThis.fetch=original;}
});
test('provider failure or invalid output returns a useful error and no partial material',async()=>{
 const original=globalThis.fetch;try{
  globalThis.fetch=async()=>Response.json({error:'quota'},{status:429});assert.equal((await residenceMaterialAi(request(brief()),{OPENAI_API_KEY:'TEST'},async()=>true)).status,502);
  globalThis.fetch=async()=>Response.json({status:'completed',output:[{content:[{type:'output_text',text:'{}'}]}]});const response=await residenceMaterialAi(request(brief()),{OPENAI_API_KEY:'TEST'},async()=>true);assert.equal(response.status,502);assert.equal('proposal' in await response.json(),false);
 }finally{globalThis.fetch=original;}
});
