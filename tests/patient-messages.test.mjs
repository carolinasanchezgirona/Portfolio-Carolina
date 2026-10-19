import test from 'node:test';
import assert from 'node:assert/strict';
import { patientMessages } from '../patient-messages.ts';
const patient = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const nonce = '33333333-3333-4333-8333-333333333333';
const req = (method = 'GET', data, admin = false, query = '') => new Request('https://example.com/api/' + (admin ? 'admin/patient-messages' : 'patient-portal/messages') + query, { method, ...(data ? { body: JSON.stringify(data) } : {}) });
function mock(overrides = {}) {
 const calls = [];
 const deps = { origin: () => true, session: async () => ({patient_id:patient}), owner: async () => false,
 query: async (path, init) => {calls.push({path,init});return Response.json(path.startsWith('clinical_patients') ? [{id:patient}] : []);},
 json: (body,status=200) => Response.json(body,{status}), ...overrides };
 return {calls,deps};
}
test('anonymous patient cannot list or send messages', async () => {
 const {calls,deps}=mock({session:async()=>null});
 assert.equal((await patientMessages(req(),deps)).status,401);assert.equal(calls.length,0);
});
test('patient cannot select another patient by query or forged payload', async () => {
 const {calls,deps}=mock();
 assert.equal((await patientMessages(req('POST',{body:'Hola',nonce,patient_id:other,sender:'clinician'},false,'?patient_id='+other),deps)).status,200);
 const sent=calls.find(c=>c.init?.method==='POST');
 assert.equal(JSON.parse(sent.init.body).patient_id,patient);assert.equal(JSON.parse(sent.init.body).sender,'patient');
});
test('cross origin mutation fails before database access', async () => {
 const {calls,deps}=mock({origin:()=>false});assert.equal((await patientMessages(req('POST',{body:'Hola',nonce}),deps)).status,403);assert.equal(calls.length,0);
});
test('admin route requires verified owner and selected patient for sending', async () => {
 assert.equal((await patientMessages(req('GET',null,true),mock().deps)).status,401);
 assert.equal((await patientMessages(req('POST',{body:'Hola',nonce},true),mock({owner:async()=>true}).deps)).status,400);
});
test('archived or missing patient is denied',async()=>{
 const {deps}=mock({query:async()=>Response.json([])});assert.equal((await patientMessages(req(),deps)).status,403);
});
test('empty and overlong messages do not insert',async()=>{
 for(const body of ['  ','a'.repeat(4001)]){const {deps,calls}=mock();assert.equal((await patientMessages(req('POST',{body,nonce}),deps)).status,400);assert.equal(calls.some(c=>c.init?.method==='POST'),false);}
});
test('read acknowledgement is scoped to selected patient and incoming sender',async()=>{
 const {deps,calls}=mock();assert.equal((await patientMessages(req('PATCH',{ids:[nonce]}),deps)).status,200);
 const patch=calls.find(c=>c.init?.method==='PATCH');assert.match(patch.path,new RegExp('patient_id=eq.'+patient));assert.match(patch.path,/sender=eq.clinician/);assert.match(patch.path,/read_at=is.null/);
});
test('rate limit and database failure do not claim successful delivery',async()=>{
 const {deps}=mock({query:async(path)=>Response.json(path.startsWith('clinical_patients')?[{id:patient}]:Array(10).fill({id:nonce}))});assert.equal((await patientMessages(req('POST',{body:'Hola',nonce}),deps)).status,429);
 const broken=mock({query:async()=>new Response('',{status:500})});assert.equal((await patientMessages(req(),broken.deps)).status,503);
});
