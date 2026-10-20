import test from 'node:test';
import assert from 'node:assert/strict';
import {newWebMmse,mmseGroups,mmseItemKey,calculateMmse,validateWebMmse} from '../app/admin/residencia/mmse-items.ts';
import {assessmentMetric,comparisonFor,comparableSeries,stampEntry} from '../app/admin/residencia/assessment-history.ts';
const blank=()=>newWebMmse({id:'a',date:'2026-10-20'});
const full=()=>{let e=blank();for(const g of mmseGroups)for(const i of g.items)e[mmseItemKey(i.key)]='1';return calculateMmse(e);};
test('MMSE sums 30 points, a missing or unevaluable answer is never converted to zero',()=>{
 assert.equal(calculateMmse(blank()).score,'');const e=full();assert.equal(e.score,'30');assert.equal(e.validity,'Aplicado');
 e.mmse_year_score='0';assert.equal(calculateMmse(e).score,'29');e.mmse_year_score='';assert.equal(calculateMmse(e).score,'');
 e.mmse_year_score='NE';assert.equal(calculateMmse(e).validity,'No evaluable');assert.equal(assessmentMetric(calculateMmse(e)),null);
 e.mmse_year_score='7';assert.match(validateWebMmse(e),/puntuación/);
});
test('two attention alternatives use the better complete score without double counting',()=>{
 const e=full();e.attentionMethod='Ambos';e.mmse_subtract0_score='0';assert.equal(calculateMmse(e).score,'30');
 e.mmse_spell0_score='0';assert.equal(calculateMmse(e).score,'29');e.mmse_spell1_score='';assert.equal(calculateMmse(e).score,'');
 e.attentionMethod='Restas seriadas';assert.equal(calculateMmse(e).score,'29');
});
test('each application retains creation timestamp through notes edits; no dates fabricated for legacy entries',()=>{
 const e=stampEntry(full(),undefined,'2026-10-20T10:00:00Z');
 const edit=stampEntry({...e,executionNotes:'Fatiga'},e,'2026-10-21T10:00:00Z');
 assert.equal(edit.createdAt,e.createdAt);assert.equal(edit.updatedAt,'2026-10-21T10:00:00Z');
 assert.equal(stampEntry({id:'old',date:'2026-10-01'},{id:'old',date:'2026-10-01'}).createdAt,'');
});
test('progress compares complete matching versions and methods; same-day applications ordered by creation',()=>{
 const first={...full(),createdAt:'2026-10-20T08:00:00Z',score:'30'};
 const later={...first,id:'b',createdAt:'2026-10-20T10:00:00Z',score:'27'};
 const incomplete={...later,id:'c',validity:'Incompleto',score:''};
 const other={...later,id:'d',version:'MEC 35',score:'25'};
 const changedMethod={...later,id:'e',attentionMethod:'MUNDO al revés'};
 const excluded={...later,id:'f',comparability:'No comparable'};
 const records=[later,incomplete,other,changedMethod,excluded,first];
 assert.deepEqual(comparableSeries(records,later).map(e=>e.id),['a','b']);
 const c=comparisonFor(records,later);assert.equal(c.delta,-3);assert.equal(c.baselineDelta,-3);assert.equal(c.previous.id,'a');
 assert.equal(assessmentMetric({...first,score:'0'}).value,0);assert.equal(assessmentMetric({...first,score:''}),null);
 assert.equal(assessmentMetric({...first,language:'Catalán'}).signature===assessmentMetric(first).signature,false);
 assert.equal(assessmentMetric({...first,version:''}),null);assert.equal(assessmentMetric({...first,language:''}),null);
});
test('scores from distinct clock systems and verbal fluency protocols do not merge',()=>{
 const e={id:'clock',date:'2026-10-20',instrument:'Test del reloj',version:'A',language:'Español',validity:'Aplicado',score:'5',maximum:'10',method:'Sistema A',modality:'Orden',requestedTime:'11:10'};
 assert.notEqual(assessmentMetric(e).signature,assessmentMetric({...e,method:'Sistema B'}).signature);
 const fluency={...e,instrument:'Fluencia verbal',correct:'12',modality:'Semántica',stimulus:'Animales',durationSeconds:'60'};
 assert.notEqual(assessmentMetric(fluency).signature,assessmentMetric({...fluency,stimulus:'Frutas'}).signature);
 assert.equal(assessmentMetric({...fluency,durationSeconds:''}),null);
});
