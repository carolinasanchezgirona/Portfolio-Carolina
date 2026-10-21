import test from 'node:test';
import assert from 'node:assert/strict';
import {monthlyFollowups} from '../app/admin/residencia/followup-planning.ts';
const resident=(dates=[],profile={})=>({data:{profile,followups:dates.map((date,i)=>({id:String(i),date}))}});
test('plans two monthly follow-ups, with distinct days and no future entries',()=>{
 assert.equal(monthlyFollowups(resident(),'2026-10-10').next,'2026-10-15');
 const one=monthlyFollowups(resident(['2026-10-05','2026-10-05','2026-10-28']),'2026-10-21');
 assert.equal(one.completed,1);assert.equal(one.remaining,1);assert.equal(one.next,'2026-10-31');
 const two=monthlyFollowups(resident(['2026-10-05','2026-10-20']),'2026-10-21');
 assert.equal(two.remaining,0);assert.equal(two.next,'2026-11-15');
});
test('resets the count monthly and handles leap years and year transitions',()=>{
 assert.equal(monthlyFollowups(resident(['2028-02-01']),'2028-02-20').next,'2028-02-29');
 assert.equal(monthlyFollowups(resident(['2026-12-01','2026-12-15']),'2026-12-21').next,'2027-01-15');
 const reset=monthlyFollowups(resident(['2026-09-05','2026-09-20']),'2026-10-21');
 assert.equal(reset.completed,0);assert.equal(reset.overdue,true);
});
test('honors earlier explicit follow-up dates, ignores stale plans and invalid dates',()=>{
 const r=resident(['2026-10-04']);r.data.followups[0].next='2026-10-12';
 assert.equal(monthlyFollowups(r,'2026-10-21').next,'2026-10-12');
 r.data.followups.push({id:'2',date:'2026-10-20'});
 assert.equal(monthlyFollowups(r,'2026-10-21').next,'2026-11-15');
 r.data.followups.push({id:'3',date:'2026-02-31'});
 assert.equal(monthlyFollowups(r,'2026-10-21').completed,2);
});
test('never schedules a follow-up before admission',()=>{
 const plan=monthlyFollowups(resident(['2026-10-01'],{admission:'2026-10-20'}),'2026-10-21');
 assert.equal(plan.completed,0);assert.equal(plan.next,'2026-10-20');
});
