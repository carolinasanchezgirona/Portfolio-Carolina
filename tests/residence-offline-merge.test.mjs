import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeVersions,matchesPayload} from '../app/admin/residencia/offline-merge.ts';
test('merges concurrent diary entries and independent fields without losing either version',()=>{
 const base={id:'r',revision:1,data:{profile:{name:'A',language:'Catalán'},followups:[{id:'a',body:'Inicial'}]}};
 const local=structuredClone(base);local.data.followups.push({id:'b',body:'Local'});local.revision=2;
 const remote=structuredClone(base);remote.data.profile.language='Castellano';remote.data.followups.push({id:'c',body:'Remoto'});remote.revision=2;
 const result=mergeVersions(base,local,remote);assert.deepEqual(result.conflicts,[]);assert.equal(result.value.data.profile.language,'Castellano');assert.deepEqual(result.value.data.followups.map(x=>x.id),['a','c','b']);
});
test('requires explicit review of contradictory fields, preserving compatible changes with either choice',()=>{
 const b={id:'r',data:{profile:{name:'A',language:'Catalán'},followups:[]}},l=structuredClone(b),r=structuredClone(b);
 l.data.profile.name='B';r.data.profile.name='C';r.data.profile.language='Castellano';
 assert.deepEqual(mergeVersions(b,l,r).conflicts,['/data/profile/name']);
 assert.equal(mergeVersions(b,l,r,'local').value.data.profile.name,'B');assert.equal(mergeVersions(b,l,r,'local').value.data.profile.language,'Castellano');assert.equal(mergeVersions(b,l,r,'remote').value.data.profile.name,'C');
});
test('a concurrent delete and edit is a conflict; unchanged deletion remains deleted',()=>{
 const b=[{id:'a',body:'Original'}],l=[],r=[{id:'a',body:'Editado'}];
 assert.deepEqual(mergeVersions(b,l,r).conflicts,['/a']);assert.deepEqual(mergeVersions(b,l,b).value,[]);
});
test('recognizes an acknowledged write after response loss even with generated server fields',()=>{
 assert.equal(matchesPayload({id:'a',revision:2,slot:'computed',updated_at:'server'}, {id:'a',revision:2,updated_at:'client'}),true);assert.equal(matchesPayload({id:'a',revision:3},{id:'a',revision:2}),false);
});

test('JSONB property ordering does not turn an acknowledged insert into a conflict',()=>{assert.equal(matchesPayload({id:'a',revision:1,data:{profile:{room:'2',name:'A'},followups:[]}}, {id:'a',revision:1,data:{followups:[],profile:{name:'A',room:'2'}}}),true);});
