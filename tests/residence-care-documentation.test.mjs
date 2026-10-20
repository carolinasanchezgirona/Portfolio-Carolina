import assert from 'node:assert/strict';
import test from 'node:test';
import {emptyData} from '../app/admin/residencia/model.ts';
import {stampEntry} from '../app/admin/residencia/assessment-history.ts';
import {reportDraft,reportText,entryTopics,filterDiary} from '../app/admin/residencia/care-documentation.ts';
const resident=()=>({id:'resident-a',code:'R1',center:'Centro ficticio',data:{...emptyData(),profile:{name:'Persona ficticia',reason:'Motivo clínico',diagnoses:'Antecedente registrado',identification:'NO INCLUIR DNI',contactPhone:'NO INCLUIR TELÉFONO',room:'NO INCLUIR HABITACIÓN',cognitiveProfile:'Capacidades preservadas'},scales:[{id:'s1',date:'2026-09-01',instrument:'MMSE',score:'26',maximum:'30',interpretation:'Interpretación consignada'},{id:'s2',date:'2026-10-05',instrument:'MMSE',score:'24',maximum:'30'}],followups:[{id:'f1',date:'2026-10-06',createdAt:'2026-10-06T09:00:00Z',topics:JSON.stringify(['Cognición','Participación']),observation:'Participa con apoyo'},{id:'f2',date:'2026-09-06',observation:'Nota anterior sin categorías'}]}});
test('structured report imports only selected fields, resident sources and dated period, without administrative details or invented conclusions',()=>{
 const r=resident(),draft=reportDraft(r,{id:'report',date:'2026-10-20',periodFrom:'2026-10-01',periodTo:'2026-10-20',conclusions:'Conclusión profesional propia',body:'Informe antiguo conservado'},['background','methods','cognition','participation']);
 assert.match(draft.methods,/2026-10-05/);assert.doesNotMatch(draft.methods,/2026-09-01/);assert.match(draft.participation,/Participa con apoyo/);assert.match(draft.cognition,/Capacidades preservadas/);assert.equal(draft.conclusions,'Conclusión profesional propia');assert.equal(draft.body,'Informe antiguo conservado');assert(!('emotion' in draft));assert.doesNotMatch(JSON.stringify(draft),/NO INCLUIR/);assert.equal(r.data.reports.length,0);
 const output=reportText(r,draft);assert.match(output,/Persona ficticia/);assert.match(output,/Conclusión profesional propia/);assert.match(output,/Informe antiguo conservado/);assert.doesNotMatch(output,/undefined|NO INCLUIR/);
});
test('diary supports multiple themes and legacy notes without silently assigning themes',()=>{
 const r=resident();assert.deepEqual(entryTopics(r.data.followups[0]),['Cognición','Participación']);assert.deepEqual(entryTopics({id:'bad',topics:'{'}),[]);assert.equal(filterDiary(r.data.followups,'Cognición').length,1);assert.equal(filterDiary(r.data.followups,'Sin clasificar').length,1);assert.equal(filterDiary(r.data.followups,'','2026-10-01','2026-10-20','apoyo').length,1);assert.equal(filterDiary(r.data.followups,'','2026-11-01').length,0);
});
test('diary creation time survives edits, remains separate from observation date, and determines chronology',()=>{
 const first=stampEntry({id:'one',date:'2026-08-01',observation:'Nueva entrada'},undefined,'2026-10-20T10:30:00Z');const edited=stampEntry({...first,observation:'Revisada'},first,'2026-10-21T12:30:00Z');assert.equal(edited.createdAt,first.createdAt);assert.equal(edited.updatedAt,'2026-10-21T12:30:00Z');assert.equal(edited.date,'2026-08-01');
 const legacy=stampEntry({id:'old',date:'2026-10-01'}, {id:'old',date:'2026-10-01'},'2026-10-21T12:31:00Z');assert.equal(legacy.createdAt,'');assert.equal(filterDiary([legacy,edited])[0].id,'one');
});
