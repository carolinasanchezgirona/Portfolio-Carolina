import assert from 'node:assert/strict';
import test from 'node:test';
import {generateAssessmentSlots,campaignDates,campaignStats,campaignError,slotError,placeAssessmentSlot,validDate} from '../app/admin/residencia/campaign-model.ts';
import {mergeVersions} from '../app/admin/residencia/offline-merge.ts';
const make=(date='2026-12-28',duration=30)=>({id:'c',title:'Semestral',center:'Centro',start_date:date,target_count:110,revision:1,data:{weeks:4,slotMinutes:duration,slots:generateAssessmentSlots(date,duration)}});
test('four dated weeks contain 112 half-hour slots with the correct daily totals and protected meetings',()=>{
 const c=make();assert.equal(campaignError(c),'');assert.equal(c.data.slots.length,112);assert.equal(new Set(c.data.slots.map(s=>s.id)).size,112);
 const dates=campaignDates(c.start_date);assert.equal(dates[0],'2026-12-29');assert.equal(dates[15],'2027-01-22');assert.deepEqual(dates.slice(0,4).map(d=>c.data.slots.filter(s=>s.date===d).length),[4,8,10,6]);
 assert.equal(campaignStats(c).free,112);assert.equal(generateAssessmentSlots('2026-12-28',60).length,56);
 for(const date of ['2026-12-29','2026-02-30',''])assert.throws(()=>generateAssessmentSlots(date));assert.equal(validDate('2026-02-30'),false);
});
test('moving an assigned appointment consumes the destination placeholder and frees the original time',()=>{
 const c=make();const source={...c.data.slots[0],resident_id:'a'};c.data.slots[0]=source;const destination=c.data.slots[9];
 const changed={...source,date:destination.date,start_min:destination.start_min,end_min:destination.end_min,notes:'Material previsto'};
 const next=placeAssessmentSlot(c,changed);assert.equal(campaignError(next),'');assert.equal(campaignStats(next).capacity,112);assert.equal(campaignStats(next).assigned,1);
 assert.ok(next.data.slots.some(s=>s.date===source.date&&s.start_min===source.start_min&&!s.resident_id&&s.status==='planned'));assert.equal(next.data.slots.find(s=>s.id===destination.id).status,'cancelled');assert.equal(c.data.slots[0].date,source.date);
});
test('an extended appointment consumes adjacent empty slots but cannot displace an assigned resident',()=>{
 const c=make(),first={...c.data.slots[0],resident_id:'a',end_min:660};const next=placeAssessmentSlot(c,first);assert.equal(campaignError(next),'');assert.equal(campaignStats(next).capacity,111);
 c.data.slots[1].resident_id='b';assert.match(campaignError(placeAssessmentSlot(c,first)),/solapa/);
});
test('prevents duplicate residents, invalid hours, dates, and done without a resident; cancellations release residents',()=>{
 const c=make();c.data.slots[0].resident_id='a';assert.match(slotError({...c.data.slots[1],resident_id:'a'},c),/ya tiene cita/);
 assert.equal(slotError({...c.data.slots[1],resident_id:'a',status:'cancelled'},c),'');
 for(const change of [{date:'2027-03-02'},{date:'2026-12-28'},{start_min:720,end_min:750},{start_min:610},{status:'done'}])assert.ok(slotError({...c.data.slots[1],...change},c));
 assert.match(campaignError({...c,start_date:'2026-12-29'}),/lunes/);assert.match(campaignError({...c,target_count:0}),/objetivo/);
});
test('offline merge preserves independent resident assignments and detects same-slot conflicts',()=>{
 const b=make(),local=structuredClone(b),remote=structuredClone(b);local.data.slots[0].resident_id='a';remote.data.slots[1].resident_id='b';const result=mergeVersions(b,local,remote);assert.deepEqual(result.conflicts,[]);assert.equal(result.value.data.slots[0].resident_id,'a');assert.equal(result.value.data.slots[1].resident_id,'b');
 remote.data.slots[0].resident_id='c';assert.ok(mergeVersions(b,local,remote).conflicts.length);
});
