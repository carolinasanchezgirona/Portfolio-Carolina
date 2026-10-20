import assert from 'node:assert/strict';
import test from 'node:test';
import {sixMonths,nextReview} from '../app/admin/residencia/model.ts';
test('six-month reviews clamp month ends and retain leap days',()=>{
 assert.equal(sixMonths('2026-08-31'),'2027-02-28');
 assert.equal(sixMonths('2027-08-31'),'2028-02-29');
 assert.equal(sixMonths('2026-10-20'),'2027-04-20');
});
test('next review follows the latest assessment, not insertion order',()=>{
 const resident={data:{profile:{firstReview:'2026-01-01'},assessments:[{date:'2026-10-20',next:'2027-04-20'},{date:'2026-04-20',next:'2026-10-20'}]}};
 assert.equal(nextReview(resident),'2027-04-20');
 resident.data.assessments=[];
 assert.equal(nextReview(resident),'2026-01-01');
});
