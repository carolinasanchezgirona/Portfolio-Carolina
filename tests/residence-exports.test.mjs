import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {existsSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
registerHooks({resolve(specifier,context,next){if(specifier.startsWith('.')&&context.parentURL?.includes('/app/admin/residencia/')&&!/\.[a-z]+$/.test(specifier)){const url=new URL(specifier+'.ts',context.parentURL);if(existsSync(fileURLToPath(url)))return next(url.href,context);}return next(specifier,context);}});
const {emptyData}=await import('../app/admin/residencia/model.ts');
const {weekRange,piaiReasons,completeDocument,weeklyPiaiDocument}=await import('../app/admin/residencia/export-model.ts');
const {completeAssessmentAppointments}=await import('../app/admin/residencia/assessment-completion.ts');
const {monthlyFollowups}=await import('../app/admin/residencia/followup-planning.ts');
const resident=(id='a')=>({id,code:'FICTICIO-'+id,center:'Centro ficticio',status:'active',revision:1,data:{...emptyData(),profile:{name:'Persona ficticia '+id}}});
const bundle=residents=>({residents,schedule:[],types:[],campaigns:[],materials:[],tasks:[]});
const stamp='2026-10-23T12:00:00Z';

test('weekly selection respects Monday/Sunday, year changes and undated opt-in without importing other weeks',()=>{
 assert.deepEqual(weekRange('2027-01-01'),{from:'2026-12-28',to:'2027-01-03'});
 assert.deepEqual(weekRange('2026-10-25'),{from:'2026-10-19',to:'2026-10-25'});
 const r=resident();r.data.profile.piaiReviewPending='true';
 assert.equal(piaiReasons(r,'2026-10-19','2026-10-25',false).length,0);
 assert.equal(piaiReasons(r,'2026-10-19','2026-10-25',true).length,1);
 r.data.profile.piaiReviewDate='2026-10-26';assert.equal(piaiReasons(r,'2026-10-19','2026-10-25').length,0);
 r.data.goals=[{id:'g',next:'2026-10-25',state:'En curso'}];assert.equal(piaiReasons(r,'2026-10-19','2026-10-25').length,1);
 r.data.goals[0].state='Cerrado';assert.equal(piaiReasons(r,'2026-10-19','2026-10-25').length,0);
});
test('weekly dossier keeps objectives and PIAI context while excluding unrelated histories, personal identifiers and future records',()=>{
 const r=resident();r.data.profile.identification='DNI-EXCLUIDO';r.data.profile.preferences='Preferencia ficticia';
 r.data.goals=[{id:'g1',date:'2026-09-01',state:'En curso',objective:'OBJETIVO ACTUAL'},{id:'g2',date:'2026-11-01',objective:'OBJETIVO FUTURO'},{id:'g3',date:'2026-08-01',state:'Cerrado',objective:'OBJETIVO CERRADO ANTIGUO'},{id:'legacy',objective:'OBJETIVO SIN FECHA'}];
 r.data.followups=[{id:'f',date:'2026-10-23',observation:'DIARIO EXCLUIDO'}];r.data.reports=[{id:'report',body:'INFORME EXCLUIDO'}];
 const doc=weeklyPiaiDocument([r],'2026-10-19','2026-10-25',stamp),text=doc.blocks.map(b=>b.text).join('\n');
 assert.match(text,/OBJETIVO ACTUAL|Preferencia ficticia/);assert.match(text,/OBJETIVO SIN FECHA/);assert.doesNotMatch(text,/EXCLUIDO|OBJETIVO FUTURO|OBJETIVO CERRADO ANTIGUO/);
});
test('complete dump includes every registry, custom profile fields, JSON responses, images, archived people and organisational content',()=>{
 const a=resident(),b=resident('archivada');b.status='archived';a.data.profile.unknownClinical='DATO NUEVO';a.data.customFields=[{id:'custom',label:'Campo del centro',value:'VALOR PERSONALIZADO'}];
 for(const kind of Object.keys(emptyData()).filter(k=>!['profile','customFields'].includes(k)))a.data[kind]=[{id:kind,date:'2026-10-23',title:kind,notes:'CONTENIDO-'+kind}];
 a.data.scales[0].answers='{"orientation":"RESPUESTA GUARDADA"}';a.data.scales[0].clockImage='data:image/png;base64,TEST';
 const data=bundle([a,b]);data.tasks=[{id:'task',title:'[Residencia] TAREA FICTICIA',due_at:'2026-10-23',status:'open'}];
 const doc=completeDocument(data,stamp),text=doc.blocks.map(b=>b.text).join('\n');
 for(const kind of Object.keys(emptyData()).filter(k=>!['profile','customFields'].includes(k)))assert.match(text,new RegExp('CONTENIDO-'+kind));
 assert.match(text,/DATO NUEVO/);assert.match(text,/VALOR PERSONALIZADO/);assert.match(text,/RESPUESTA GUARDADA/);assert.match(text,/Persona ficticia archivada/);assert.match(text,/TAREA FICTICIA/);assert.equal(doc.blocks.filter(b=>b.type==='image').length,1);
});
test('excluded diary entries never satisfy the monthly target; mixed same-day notes still count once',()=>{
 const r=resident();r.data.followups=[{id:'1',date:'2026-10-01',countForMonthly:'false'},{id:'2',date:'2026-10-02'},{id:'3',date:'2026-10-02',countForMonthly:'true'}];
 assert.equal(monthlyFollowups(r,'2026-10-23').completed,1);
});
test('a saved complete review updates only matching planned appointments; partial tests and repeated saves are idempotent',async()=>{
 const before=resident(),after=structuredClone(before);after.data.assessments=[{id:'review',date:'2026-10-23',conclusion:'Síntesis ficticia'}];
 const campaign={id:'c',revision:3,data:{slots:[{id:'match',resident_id:'a',date:'2026-10-23',status:'planned'},{id:'other',resident_id:'b',date:'2026-10-23',status:'planned'},{id:'cancelled',resident_id:'a',date:'2026-10-23',status:'cancelled'}]}};
 let writes=0;const api=async(path,init)=>{if(!init)return [campaign];writes++;const saved=JSON.parse(init.body);assert.equal(saved.revision,4);assert.equal(saved.data.slots[0].status,'done');assert.equal(saved.data.slots[1].status,'planned');assert.equal(saved.data.slots[2].status,'cancelled');return [saved];};
 assert.equal(await completeAssessmentAppointments(before,after,api,'2026-10-23'),1);assert.equal(writes,1);
 assert.equal(await completeAssessmentAppointments(after,after,api,'2026-10-23'),0);assert.equal(writes,1);
 const partial=structuredClone(before);partial.data.scales=[{id:'scale',date:'2026-10-23',instrument:'MMSE',score:'25'}];assert.equal(await completeAssessmentAppointments(before,partial,api,'2026-10-23'),0);
 await assert.rejects(completeAssessmentAppointments(before,after,async(path,init)=>init?[]:[campaign],'2026-10-23'),/otra ventana/);
 assert.equal(after.data.assessments.length,1);
});
test('PDF writer handles long text, accents and images across pages and rejects damaged images',async()=>{
 const {buildPdf}=await import('../app/admin/residencia/pdf-export.ts');
 const font=readFileSync(new URL('../public/fonts/residence-sans.ttf',import.meta.url)).toString('base64');
 const r=resident();r.data.profile.name='Fictícia Álvarez · memòria';r.data.followups=[{id:'f',date:'2026-10-23',observation:'Texto largo de prueba con acentos y espacios. '.repeat(350)}];
 r.data.scales=[{id:'clock',date:'2026-10-23',instrument:'Test del reloj',clockImage:'data:image/png;base64,'+readFileSync(new URL('./fixtures/residence-clock.png',import.meta.url)).toString('base64')}];
 const doc=await buildPdf(completeDocument(bundle([r]),stamp),font);assert(doc.getNumberOfPages()>3);assert.match(doc.output().slice(0,8),/%PDF-/);
 if(process.env.RESIDENCE_PDF_QA_DIR){mkdirSync(process.env.RESIDENCE_PDF_QA_DIR,{recursive:true});writeFileSync(process.env.RESIDENCE_PDF_QA_DIR+'/complete.pdf',Buffer.from(doc.output('arraybuffer')));const weekly=await buildPdf(weeklyPiaiDocument([r],'2026-10-19','2026-10-25',stamp),font);writeFileSync(process.env.RESIDENCE_PDF_QA_DIR+'/weekly.pdf',Buffer.from(weekly.output('arraybuffer')));}
 const bad=completeDocument(bundle([r]),stamp);bad.blocks.push({type:'image',text:'Dibujo dañado',value:'data:image/png;base64,INVALID'});await assert.rejects(buildPdf(bad,font),/incompleto/);
});
