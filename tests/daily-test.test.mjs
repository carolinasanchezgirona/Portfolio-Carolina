import test from 'node:test';
import assert from 'node:assert/strict';
import { dailyTest } from '../daily-test.ts';
const req = (method='POST', origin='https://example.test') => new Request('https://example.test/api/video/test', {method, headers:{Origin:origin}});
test('denies wrong method, cross-origin, non-owner and missing secret without contacting Daily', async () => {
  const saved = global.fetch;
  global.fetch = () => { throw Error('Must not contact provider'); };
  try {
    assert.equal((await dailyTest(req('GET'), {}, async()=>true)).status,405);
    assert.equal((await dailyTest(req('POST','https://other.test'), {DAILY_API_KEY:'fake'}, async()=>true)).status,403);
    assert.equal((await dailyTest(req(), {DAILY_API_KEY:'fake'}, async()=>false)).status,401);
    assert.equal((await dailyTest(req(), {}, async()=>true)).status,503);
  } finally {global.fetch=saved;}
});
test('creates private expiring P2P room and bounded token without names or recording', async () => {
  const saved=global.fetch; const savedNow=Date.now; const calls=[];
  Date.now=()=>1800000000000;
  global.fetch=async(url, options)=>{
    calls.push([url,options]);
    if (options.method==='GET') return new Response('{}',{status:404});
    const body=JSON.parse(options.body);
    if(url.endsWith('/rooms')) return Response.json({url:'https://carolinasanchezgirona.daily.co/'+body.name,privacy:body.privacy,config:body.properties});
    return Response.json({token:'test-token'});
  };
  try {
    const result=await dailyTest(req(),{DAILY_API_KEY:'fake-secret'},async()=>true);
    assert.equal(result.status,200);
    const room=JSON.parse(calls[1][1].body), token=JSON.parse(calls[2][1].body);
    assert.equal(room.privacy,'private'); assert.equal(room.properties.max_participants,2);
    assert.equal(room.properties.enable_recording,false); assert.equal(room.properties.sfu_switchover,3);
    assert.equal(room.properties.enable_transcription_storage,false);
    assert.equal(token.properties.room_name,room.name); assert.equal(token.properties.exp,room.properties.exp);
    assert.equal(token.properties.is_owner,false); assert.equal(token.properties.eject_at_token_exp,true);
    assert.ok(!JSON.stringify(await result.json()).includes('fake-secret'));
  } finally {global.fetch=saved;Date.now=savedNow;}
});
