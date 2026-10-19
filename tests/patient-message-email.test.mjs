import test from 'node:test';
import assert from 'node:assert/strict';
import { notifyPatientMessages } from '../patient-message-email.ts';
const env={BREVO_API_KEY:'test',SUPABASE_SERVICE_ROLE_KEY:'test'};
test('notice contains a generic alert and inbox link and records successful delivery',async()=>{
 const original=global.fetch,calls=[];
 global.fetch=async(url,init={})=>{calls.push({url,init});if(url.includes('brevo'))return Response.json({messageId:'test'});return Response.json([{id:'test'}]);};
 try { await notifyPatientMessages(env);const mail=JSON.parse(calls.find(c=>c.url.includes('brevo')).init.body);assert.equal(mail.to[0].email,'contact@carolinasanchezgirona.com');assert.match(mail.htmlContent,/\/admin\/mensajes\//);assert.equal(mail.tags[0],'patient-internal-message-notice');assert.ok(calls.some(c=>c.init.body?.includes('email_notice_sent_at'))); }
 finally{global.fetch=original;}
});
test('provider failure leaves a durable pending notice for retry',async()=>{
 const original=global.fetch,calls=[];
 global.fetch=async(url,init={})=>{calls.push({url,init});if(url.includes('brevo'))return new Response('',{status:500});return Response.json([{id:'test'}]);};
 try{await notifyPatientMessages(env);assert.deepEqual(JSON.parse(calls.at(-1).init.body),{email_notice_claimed_at:null});}finally{global.fetch=original;}
});
test('a concurrent sender that loses the claim does not send email',async()=>{
 const original=global.fetch,calls=[];
 global.fetch=async(url,init={})=>{calls.push({url,init});return Response.json(init.method==='PATCH'?[]:[{id:'test'}]);};
 try{await notifyPatientMessages(env);assert.equal(calls.some(c=>c.url.includes('brevo')),false);}finally{global.fetch=original;}
});
