import test from "node:test";
import assert from "node:assert/strict";
import {providerConfigured,verifyDocusignHmac,sha256} from "../clinical-signature-docusign.ts";
import {clinicalSignatures,clinicalSignaturesConnect} from "../clinical-signature-workflow.ts";
const patientId="11111111-1111-4111-8111-111111111111";
const env={SUPABASE_SERVICE_ROLE_KEY:"fake-service"};
const req=(method="GET",body)=>new Request("https://carolinasanchezgirona.com/api/admin/clinical-signatures"+
 (method==="GET"?"?patient_id="+patientId:""),{method,...(method==="POST"?{
 headers:{"Content-Type":"application/json"},
 body:JSON.stringify({patient_id:patientId,...body})}:{})});
const patient={id:patientId,full_name:"Adulto de prueba",email:"adulto@example.invalid",
 birth_date:"1990-01-01",national_id:null,status:"active"};
const reqId="22222222-2222-4222-8222-222222222222";
async function mock(run){
 const saved=globalThis.fetch,calls=[];
 globalThis.fetch=async (url,opts={})=>{
  calls.push({url:String(url),opts});
  if(String(url).includes("/rest/v1/clinical_patients?"))return Response.json([patient]);
  if(String(url).includes("/rest/v1/clinical_signature_requests?"))return Response.json([]);
  throw Error("No debe consultarse este servicio: "+url);
 };
 try {await run(calls);}finally{globalThis.fetch=saved;}
}
test("la firma sigue desactivada sin aprobación DPA y flujo IDV",()=>{
 assert.equal(providerConfigured({}),false);
 assert.equal(providerConfigured({DOCUSIGN_INTEGRATION_KEY:"x",DOCUSIGN_IMPERSONATED_USER_ID:"y",
  DOCUSIGN_RSA_PRIVATE_KEY:"key",DOCUSIGN_ACCOUNT_ID:"acc",DOCUSIGN_IDV_WORKFLOW_ID:"wf"}),false);
 assert.equal(providerConfigured({DOCUSIGN_INTEGRATION_KEY:"x",DOCUSIGN_IMPERSONATED_USER_ID:"y",
  DOCUSIGN_RSA_PRIVATE_KEY:"key",DOCUSIGN_ACCOUNT_ID:"acc",DOCUSIGN_IDV_WORKFLOW_ID:"wf",
  DOCUSIGN_DPA_APPROVED:"yes",DOCUSIGN_ENVIRONMENT:"production"}),false);
});
test("sin MFA nadie puede ver datos de firma",async()=>{
 await mock(async calls=>{
  const res=await clinicalSignatures(req(),env,async()=>false,()=>true);
  assert.equal(res.status,401);assert.equal(calls.length,0);
 });
});
test("bloquea solicitudes desde otro origen",async()=>{
 await mock(async calls=>{
  assert.equal((await clinicalSignatures(req("POST",{action:"send"}),env,async()=>true,()=>false)).status,403);
  assert.equal(calls.length,0);
 });
});
test("GET muestra inactividad sin contactar con proveedor ni enviar",async()=>{
 await mock(async calls=>{
  const res=await clinicalSignatures(req(),env,async()=>true,()=>true);
  assert.equal(res.status,200);
  const data=await res.json();
  assert.equal(data.configured,false);assert.equal(data.email,"adulto@example.invalid");
  assert.equal(calls.filter(x=>x.url.includes("docusign.com")).length,0);
 });
});
test("POST sin proveedor aprobado no genera ni envía sobres",async()=>{
 await mock(async calls=>{
  const res=await clinicalSignatures(req("POST",{
   action:"send",kind:"psicologico",email_confirmation:"adulto@example.invalid",
   confirm_send:true,self_consenting_adult:true,request_id:reqId,
  }),env,async()=>true,()=>true);
  assert.equal(res.status,503);
  assert.equal(calls.filter(x=>x.url.includes("docusign.com")).length,0);
  assert.equal(calls.filter(x=>x.opts.method==="POST").length,0);
 });
});
test("webhook sin firma HMAC rechaza antes de leer la historia",async()=>{
 const request=new Request("https://carolinasanchezgirona.com/api/docusign/connect",{
  method:"POST",headers:{"Content-Type":"application/json"},
  body:JSON.stringify({event:"envelope-completed",data:{accountId:"a",envelopeId:reqId}})
 });
 assert.equal((await clinicalSignaturesConnect(request,{...env,DOCUSIGN_CONNECT_HMAC_KEY:"secret"})).status,503);
});
test("verificación HMAC rechaza alteraciones del cuerpo",async()=>{
 const key="firmar-la-comunicacion";
 const raw=new TextEncoder().encode('{"event":"test"}');
 const signingKey=await crypto.subtle.importKey("raw",new TextEncoder().encode(key),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const signature=new Uint8Array(await crypto.subtle.sign("HMAC",signingKey,raw));
 const signed=Buffer.from(signature).toString("base64");
 assert.equal(await verifyDocusignHmac(raw,key,signed),true);
 assert.equal(await verifyDocusignHmac(new TextEncoder().encode('{"event":"alterado"}'),key,signed),false);
});
test("sha256 de originales es determinista y no contiene identificadores",async()=>{
 const a=await sha256(new TextEncoder().encode("documento de ensayo"));
 assert.match(a,/^[a-f0-9]{64}$/);
 assert.equal(a,await sha256(new TextEncoder().encode("documento de ensayo")));
});
