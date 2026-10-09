import test from 'node:test';
import assert from 'node:assert/strict';
import {adminAppointmentVideo,patientAppointmentVideo,normalizeMeetUrl} from '../appointment-video.ts';
const patient='11111111-1111-4111-8111-111111111111',booking='22222222-2222-4222-8222-222222222222';
const url='https://meet.google.com/abc-defg-hij';
test('accepts only canonical Meet links and strips query parameters',()=>{
  assert.equal(normalizeMeetUrl(url+'?authuser=0'),url);
  for(const value of ['https://meet.google.com.evil.test/abc-defg-hij','http://meet.google.com/abc-defg-hij','https://user@meet.google.com/abc-defg-hij','https://meet.google.com/new','javascript:alert(1)'])assert.equal(normalizeMeetUrl(value),null);
});
test('denies unauthorized and cross-origin writes before database access',async()=>{
  const saved=global.fetch;global.fetch=()=>{throw Error('unexpected database access');};
  try{
    const req=(origin='https://example.test')=>new Request('https://example.test/api/video/appointment',{method:'POST',headers:{Origin:origin},body:'{}'});
    assert.equal((await adminAppointmentVideo(req(),{},async()=>false)).status,401);
    assert.equal((await adminAppointmentVideo(req('https://evil.test'),{},async()=>true)).status,403);
    assert.equal((await patientAppointmentVideo(new Request('https://example.test/api/patient-portal/video'),{},null)).status,401);
  }finally{global.fetch=saved;}
});
test('patient lookup scopes booking to session patient, confirmed state and nonexpired end; URL withheld before access window',async()=>{
  const saved=global.fetch,savedNow=Date.now;const now=1800000000000;Date.now=()=>now;
  try{
    for(const [minutes,published,expected] of [[20,true,'waiting'],[10,true,'ready'],[10,false,'none']]){
      const calls=[];
      global.fetch=async(path)=>{
        calls.push(path);
        if(path.includes('clinical_patients'))return Response.json([{id:patient}]);
        if(path.includes('appointment_bookings'))return Response.json([{id:booking,starts_at:new Date(now+minutes*60000).toISOString(),ends_at:new Date(now+3600000).toISOString()}]);
        return Response.json(published?[{meet_url:url}]:[]);
      };
      const response=await patientAppointmentVideo(new Request('https://example.test/api/patient-portal/video'),{SUPABASE_SERVICE_ROLE_KEY:'fake'},patient);
      assert.equal(response.status,200);const data=await response.json();
      assert.ok(calls[1].includes('clinical_patient_id=eq.'+patient));assert.ok(calls[1].includes('status=eq.confirmed'));assert.ok(calls[1].includes('ends_at=gt.'));
      assert.ok(calls[2].includes('appointment_id=eq.'+booking));assert.ok(calls[2].includes('published=eq.true'));
      if(expected==='none')assert.equal(data.video,null);
      else{assert.equal(data.video.available,expected==='ready');assert.equal(data.video.url,expected==='ready'?url:undefined);}
    }
  }finally{global.fetch=saved;Date.now=savedNow;}
});
