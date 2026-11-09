import test from "node:test";
import assert from "node:assert/strict";
import {buildClinicalConsentPdf,CONSENT_VERSION} from "../clinical-consent-pdf.ts";
import {clinicalSimpleAdmin,clinicalSimplePatient} from "../clinical-simple-consents.ts";
const PID="11111111-1111-4111-8111-111111111111";
const OTHER="22222222-2222-4222-8222-222222222222";
const REQ="33333333-3333-4333-8333-333333333333";
const SESSION="44444444-4444-4444-8444-444444444444";
const origin="https://carolinasanchezgirona.com";
const env={SUPABASE_SERVICE_ROLE_KEY:"test-secret",BREVO_API_KEY:"test-brevo"};
const patient={id:PID,full_name:"Persona de prueba",email:"paciente@example.invalid",
 birth_date:"1980-05-01",national_id:null,status:"active",portal_access_enabled:true};
const record={id:REQ,patient_id:PID,kind:"psicologico",status:"email_accepted",consent_version:CONSENT_VERSION,
 signer_email:"paciente@example.invalid",original_path:"simple-consents/"+REQ+"/original.pdf",
 original_sha256:"",accepted_at:null,accepted_by:null,accepted_session_id:null,
 evidence_path:null,evidence_sha256:null,email_accepted_at:"2026-11-09T19:00:00Z",archived_at:null,
 expires_at:"2099-01-01T00:00:00Z",created_at:"2026-11-09T18:00:00Z"};
const verified={patient_id:PID,id:SESSION,fresh_password:true};
const adminGet=new Request(origin+"/api/admin/clinical-simple-consents?patient_id="+PID,
 {headers:{Origin:origin}});
const patientGet=new Request(origin+"/api/patient-portal/clinical-simple-consents",{headers:{Origin:origin}});
function adminPost(extra={}){
 return new Request(origin+"/api/admin/clinical-simple-consents",{method:"POST",
  headers:{Origin:origin,"Content-Type":"application/json"},
  body:JSON.stringify({action:"send",patient_id:PID,kind:"psicologico",confirm_email:patient.email,
   send_manually:true,information_provided:true,patient_self_consents:true,...extra})});
}
function signPost(extra={}){
 return new Request(origin+"/api/patient-portal/clinical-simple-consents",{method:"POST",
  headers:{Origin:origin,"Content-Type":"application/json"},
  body:JSON.stringify({action:"accept",request_id:REQ,typed_name:patient.full_name,
   confirm_read:true,confirm_voluntary:true,sign_intent:"accept",...extra})});
}
async function mockFetch(responder,task){
 const existing=globalThis.fetch;const calls=[];
 globalThis.fetch=async(url,opts={})=>{calls.push({url:String(url),opts});return responder(String(url),opts)};
 try{await task(calls);}finally{globalThis.fetch=existing;}
}
function basic(url){
 if(url.includes("/clinical_patients?"))return Response.json([patient]);
 if(url.includes("/clinical_simple_consents?"))return Response.json([]);
 throw Error("Unexpected "+url);
}
test("nunca accede al paciente sin MFA profesional o sin mismo origen",async()=>{
 await mockFetch(()=>{throw Error("No debería llamar red");},async calls=>{
  assert.equal((await clinicalSimpleAdmin(adminGet,env,async()=>false,()=>true)).status,401);
  assert.equal((await clinicalSimpleAdmin(adminGet,env,async()=>true,()=>false)).status,403);
  assert.equal(calls.length,0);
 });
});
test("paciente sin sesión no ve firmas ni datos clínicos",async()=>{
 await mockFetch(()=>{throw Error("No debería llamar red");},async calls=>{
  assert.equal((await clinicalSimplePatient(patientGet,env,async()=>null,()=>true)).status,401);
  assert.equal(calls.length,0);
 });
});
test("GET administrativo solo consulta y no envía correos",async()=>{
 await mockFetch(basic,async calls=>{
  const res=await clinicalSimpleAdmin(adminGet,env,async()=>true,()=>true);
  assert.equal(res.status,200);
  const data=await res.json();
  assert.equal(data.email,patient.email);assert.equal(data.portal_enabled,true);
  assert.equal(calls.filter(c=>c.opts.method==="POST").length,0);
  assert.equal(calls.filter(c=>c.url.includes("brevo.com")).length,0);
 });
});
test("bloquea envío sin Mi espacio, representación y menores",async()=>{
 await mockFetch(url=>{
  if(url.includes("/clinical_patients?"))return Response.json([{...patient,portal_access_enabled:false}]);
  if(url.includes("/clinical_simple_consents?"))return Response.json([]);
  throw Error("Ningún correo se debería enviar");
 },async calls=>{
  assert.equal((await clinicalSimpleAdmin(adminPost(),env,async()=>true,()=>true)).status,409);
  assert.equal(calls.filter(c=>c.url.includes("brevo.com")).length,0);
 });
 await mockFetch(url=>{
  if(url.includes("/clinical_patients?"))return Response.json([{...patient,birth_date:"2020-01-01"}]);
  if(url.includes("/clinical_simple_consents?"))return Response.json([]);
  throw Error("No debería enviar");
 },async calls=>{
  assert.equal((await clinicalSimpleAdmin(adminPost(),env,async()=>true,()=>true)).status,409);
  assert.equal(calls.filter(c=>c.opts.method==="POST").length,0);
 });
});
test("rechaza firmar sin contraseña reciente y sin declaración",async()=>{
 await mockFetch(url=>{
  if(url.includes("/clinical_patients?"))return Response.json([patient]);
  if(url.includes("/clinical_simple_consents?"))return Response.json([record]);
  throw Error("No debe leer documento sin autenticación reciente");
 },async calls=>{
  const stale=await clinicalSimplePatient(signPost(),env,async()=>({...verified,fresh_password:false}),()=>true);
  assert.equal(stale.status,409);
  const noConsent=await clinicalSimplePatient(signPost({confirm_voluntary:false}),env,async()=>verified,()=>true);
  assert.equal(noConsent.status,409);
  assert.equal(calls.filter(c=>c.opts.method==="PATCH").length,0);
 });
});
test("un paciente no puede descargar documento de otra ficha",async()=>{
 await mockFetch(url=>{
  if(url.includes("/clinical_patients?"))return Response.json([patient]);
  if(url.includes("/clinical_simple_consents?"))return Response.json([{...record,patient_id:OTHER}]);
  throw Error("Nunca debe consultar Storage");
 },async calls=>{
  const req=new Request(origin+"/api/patient-portal/clinical-simple-consents?document_id="+REQ,
   {headers:{Origin:origin}});
  assert.equal((await clinicalSimplePatient(req,env,async()=>verified,()=>true)).status,404);
  assert.equal(calls.filter(c=>c.url.includes("/storage/v1/")).length,0);
 });
});
test("la firma registra sesión y hora y archiva original y acta privados antes de informar éxito",async()=>{
 const pdf=await buildClinicalConsentPdf(patient,"psicologico",REQ);
 const digest=await crypto.subtle.digest("SHA-256",new Uint8Array(pdf).buffer);
 const hash=Buffer.from(digest).toString("hex");
 const row={...record,original_sha256:hash};
 await mockFetch((url,opts)=>{
  if(url.includes("/clinical_patients?"))return Response.json([patient]);
  if(url.includes("/clinical_simple_consents?")&&(!opts.method||opts.method==="GET"))return Response.json([row]);
  if(url.includes("/storage/v1/object/authenticated/clinical-documents/")&&url.includes("/evidence.pdf"))return new Response(null,{status:404});
  if(url.includes("/storage/v1/object/authenticated/clinical-documents/"))return new Response(pdf,{status:200});
  if(url.includes("/clinical_simple_consents?")&&opts.method==="PATCH")return Response.json([{id:REQ}]);
  if(url.includes("/storage/v1/object/clinical-documents/")&&opts.method==="POST")return Response.json({Key:"ok"});
  if(url.includes("/clinical_documents?")&&opts.method==="POST")return new Response(null,{status:201});
  throw Error("Not allowed "+url);
 },async calls=>{
  const res=await clinicalSimplePatient(signPost(),env,async()=>verified,()=>true);
  assert.equal(res.status,200);
  const data=await res.json();assert.equal(data.status,"archived");
  assert.equal(calls.filter(c=>c.url.includes("/storage/v1/object/clinical-documents/")&&c.opts.method==="POST").length,1);
  const changes=calls.filter(c=>c.url.includes("/clinical_simple_consents?")&&c.opts.method==="PATCH")
   .map(c=>JSON.parse(c.opts.body));
  assert.equal(changes[0].status,"recording");assert.equal(changes[0].accepted_session_id,SESSION);
  assert.equal(changes[1].status,"archived");assert.match(changes[1].evidence_sha256,/^[a-f0-9]{64}$/);
  assert.equal(calls.filter(c=>c.url.includes("/brevo.com/")).length,0);
 });
});
