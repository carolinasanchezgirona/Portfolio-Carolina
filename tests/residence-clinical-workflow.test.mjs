import assert from 'node:assert/strict';
import test from 'node:test';
import {registerHooks} from 'node:module';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
registerHooks({resolve(specifier,context,next){if(specifier.startsWith('.')&&context.parentURL?.includes('/app/admin/residencia/')&&!/\.[a-z]+$/.test(specifier)){const url=new URL(specifier+'.ts',context.parentURL);if(existsSync(fileURLToPath(url)))return next(url.href,context);}return next(specifier,context);}});
const {emptyData}=await import('../app/admin/residencia/model.ts');
const {goalFollowups,sourceOptions,resolveSource,workflowError,newGoalFollowup}=await import('../app/admin/residencia/clinical-workflow.ts');
const {weeklyPiaiDocument,residentDocument}=await import('../app/admin/residencia/export-model.ts');
const {reportDraft,filterDiary}=await import('../app/admin/residencia/care-documentation.ts');
const {mergeVersions}=await import('../app/admin/residencia/offline-merge.ts');
const resident=()=>({id:'ficticio',code:'FICTICIO',center:'Centro ficticio',revision:1,status:'active',data:{...emptyData(),profile:{clinicalBaseline:'Autonomía basal ficticia',baselineDate:'2026-09-01',baselineSource:'Entrevista ficticia'},assessments:[{id:'same',date:'2026-09-01',conclusion:'Valoración de origen'}],scales:[{id:'same',date:'2026-10-01',instrument:'MMSE'}],goals:[{id:'goal',date:'2026-09-01',objective:'Objetivo ficticio',indicator:'Indicador pactado',state:'En curso',sourceRef:'assessments:same',sourceLabel:'Valoración de origen'}]}});
test('links distinguish registry IDs and never resolve another resident or fabricate links for legacy notes',()=>{
 const r=resident();assert.equal(sourceOptions(r).length,2);assert.equal(resolveSource(r,'assessments:same').entry.conclusion,'Valoración de origen');assert.equal(resolveSource(r,'scales:same').entry.instrument,'MMSE');assert.equal(resolveSource(r,'followups:same'),undefined);
 assert.match(workflowError(r,'followups',{id:'bad',goalId:'foreign'}),/ya no está disponible/);assert.match(workflowError(r,'goals',{id:'bad',sourceRef:'assessments:foreign'}),/ya no está disponible/);
 assert.equal(workflowError(r,'followups',{id:'legacy'}),'');assert.equal(goalFollowups(r,'goal').length,0);
});
test('a new followup stays a draft and does not change the objective; only linked observations enter its chronology',()=>{
 const r=resident(),original=structuredClone(r),draft=newGoalFollowup(r.data.goals[0],'2026-10-23');assert.equal(draft.goalId,'goal');assert.equal(draft.goalReview,'Sin valorar');assert.deepEqual(r,original);
 r.data.followups=[{id:'late-entry',date:'2026-10-20',createdAt:'2026-10-24T10:00:00Z',goalId:'goal'},{id:'newer-observation',date:'2026-10-23',goalId:'goal'},{id:'other',date:'2026-10-25'}];
 assert.deepEqual(goalFollowups(r,'goal').map(e=>e.id),['newer-observation','late-entry']);r.data.goals[0].state='Cerrado';assert.equal(goalFollowups(r,'goal').length,2);
});
test('PDF and report retain behavioral context and goal evidence while weekly PIAI excludes unrelated notes and other dates',()=>{
 const r=resident();r.data.followups=[{id:'f',date:'2026-10-23',goalId:'goal',goalReview:'Avance observado',goalEvidence:'EVIDENCIA FICTICIA',behaviorRecord:'true',antecedent:'CONTEXTO FICTICIO',hypothesis:'HIPÓTESIS POR CONTRASTAR',observation:'Conducta observable',topics:'["Convivencia"]'},{id:'unrelated',date:'2026-10-23',observation:'NO INCLUIR NOTA AJENA'},{id:'old',date:'2026-10-01',goalId:'goal',observation:'NO INCLUIR OTRA SEMANA'}];
 const stamp='2026-10-23T10:00:00Z',weekly=weeklyPiaiDocument([r],'2026-10-19','2026-10-25',stamp).blocks.map(b=>b.text).join('\n');
 assert.match(weekly,/EVIDENCIA FICTICIA/);assert.match(weekly,/CONTEXTO FICTICIO/);assert.match(weekly,/Objetivo ficticio/);assert.doesNotMatch(weekly,/NO INCLUIR/);
 const individual=residentDocument(r,[],stamp).blocks.map(b=>b.text).join('\n');assert.match(individual,/Autonomía basal ficticia/);assert.match(individual,/HIPÓTESIS POR CONTRASTAR/);
 const report=reportDraft(r,{id:'report',date:'2026-10-23',periodFrom:'2026-10-19',periodTo:'2026-10-25'},['goals','participation','background']);assert.match(report.goals,/EVIDENCIA FICTICIA/);assert.match(report.goals,/Objetivo ficticio/);assert.doesNotMatch(report.goals,/NO INCLUIR/);assert.match(report.participation,/Hipótesis de trabajo pendiente de contrastar: HIPÓTESIS POR CONTRASTAR/);assert.match(report.background,/Entrevista ficticia/);
 assert.equal(filterDiary(r.data.followups,'','','','CONTEXTO FICTICIO').length,1);
});
test('offline merge preserves goal links and independent behavioral observations with concurrent baseline changes',()=>{
 const base=resident(),local=structuredClone(base),remote=structuredClone(base);local.data.followups.push({...newGoalFollowup(base.data.goals[0],'2026-10-23'),behaviorRecord:'true',antecedent:'Contexto',observation:'Observación ficticia'});remote.data.profile.clinicalBaseline='Basal revisada';
 const merged=mergeVersions(base,local,remote);assert.deepEqual(merged.conflicts,[]);assert.equal(merged.value.data.profile.clinicalBaseline,'Basal revisada');assert.equal(merged.value.data.followups[0].goalId,'goal');assert.equal(merged.value.data.followups[0].antecedent,'Contexto');
});
