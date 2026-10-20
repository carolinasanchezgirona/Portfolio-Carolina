import assert from 'node:assert/strict';
import test from 'node:test';
import {addDays,monday,overlaps,validSchedule} from '../app/admin/residencia/schedule-model.ts';
const event={id:'1',event_date:'2026-10-19',start_min:540,end_min:600,category_id:'type',title:'Ejercicio',center:'Centro',status:'planned'};
test('weekly dates cross months and years without timezone shifts',()=>{assert.equal(monday('2027-01-03'),'2026-12-28');assert.equal(addDays('2026-12-28',7),'2027-01-04');});
test('residential planner accepts Monday to Saturday and exact half-hour bounds',()=>{
 assert.equal(validSchedule(event),true);assert.equal(validSchedule({...event,event_date:'2026-10-24',start_min:1110,end_min:1140}),true);
 for(const changed of [{event_date:'2026-10-25'},{start_min:535},{start_min:545},{end_min:1170},{end_min:540}])assert.equal(validSchedule({...event,...changed}),false);
});
test('back-to-back slots and cancellations do not conflict; all centres share personal availability',()=>{
 assert.equal(overlaps(event,{...event,id:'2',start_min:600,end_min:630}),false);
 assert.equal(overlaps(event,{...event,id:'2',start_min:570,end_min:630,center:'Otro centro'}),true);
 assert.equal(overlaps(event,{...event,id:'2',status:'cancelled'}),false);
});
