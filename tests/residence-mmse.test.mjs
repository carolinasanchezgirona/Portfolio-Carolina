import assert from 'node:assert/strict';
import test from 'node:test';
import {mmseVersion,mmseAreas,validateMmse} from '../app/admin/residencia/mmse-protocol.ts';
const base=()=>({id:'test',date:'2026-10-20',instrument:'MMSE',version:mmseVersion,maximum:'30'});
test('incomplete MMSE leaves unknown scores blank while enforcing domain ranges',()=>{
 const e=base();assert.equal(validateMmse(e),'');assert.equal(e.score,undefined);
 assert.match(validateMmse({...e,registration:'4'}),/entre 0 y 3/);
 assert.match(validateMmse({...e,reading:'0.5'}),/entero/);
 assert.match(validateMmse({...e,score:'31'}),/entre 0 y 30/);
 assert.equal(validateMmse({...e,score:'0',registration:'0'}),'');
});
test('complete domain scores must agree with raw total, independently of manual correction',()=>{
 const e=base();for(const [key,,max] of mmseAreas)e[key]=String(max);
 assert.equal(validateMmse({...e,score:'30',correctedScore:'29',correctionReference:'Tabla revisada por evaluadora'}),'');
 assert.match(validateMmse({...e,score:'29'}),/suma de las áreas/);
 assert.equal(validateMmse({...e,version:'Otra versión',score:'29'}),'');
});
