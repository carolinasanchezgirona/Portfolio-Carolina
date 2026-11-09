import test from "node:test";
import assert from "node:assert/strict";
import {providerConfigured,verifyDocusignHmac,sha256,encodePdf,authenticateDocusign} from "../clinical-signature-docusign.ts";
import {clinicalSignatures,clinicalSignaturesConnect} from "../clinical-signature-workflow.ts";
const env={SUPABASE_SERVICE_ROLE_KEY:"fake-secret"};
const auth=(role)=>async()=>role;
const same=()=>true;
const patient="11111111-1111-4111-8111-111111111111";
test("por defecto Docusign y el envío de firmas están desactivados",async()=>{
 assert.equal(providerConfigured({}),false);
 assert.equal(providerConfigured({DOCUSIGN_INTEGRATION_KEY:"a",DOCUSIGN_IMPERSONATED_USER_ID:"b",
  DOCUSIGN_RSA_PRIVATE_KEY:"secret",DOCUSIGN_ACCOUNT_ID:"acc",DOCUSIGN_IDV_WORKFLOW_ID:"workflow"}),false);
 await assert.rejects(()=>authenticateDocusign({}),/Falta aprobar/);
});
test("nunca consulta ni envía para usuarios sin MFA profesional",async()=>{
 const original=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;throw Error("No debería consultar datos");};
 try{
  const req=new Request("https://carolinasanchezgirona.com/api/admin/clinical-signatures?patient_id="+patient);
  assert.equal((await clinicalSignatures(req,env,auth(false),same)).status,401);
  assert.equal((await clinicalSignatures(req,env,auth(true),()=>false)).status,403);
  assert.equal(calls,0);
 }finally{globalThis.fetch=original;}
});
test("webhook no acepta mensajes sin HMAC ni configuración aprobada",async()=>{
 const res=await clinicalSignaturesConnect(new Request("https://carolinasanchezgirona.com/api/docusign/connect",
  {method:"POST",body:"{}"}),env);
 assert.equal(res.status,503);
});
test("la firma del webhook usa los bytes exactos",async()=>{
 const cryptoModule=await import("node:crypto");
 const body=new TextEncoder().encode('{"event":"envelope-completed"}');
 const secret="clave-de-prueba-solo-para-test";
 const correct=cryptoModule.createHmac("sha256",secret).update(body).digest("base64");
 assert.equal(await verifyDocusignHmac(body,secret,correct),true);
 assert.equal(await verifyDocusignHmac(new TextEncoder().encode('{"event":"envelope-voided"}'),secret,correct),false);
 assert.equal(await verifyDocusignHmac(body,secret,"invalid"),false);
});
test("hashes completos reproducibles y conversión PDF base64",async()=>{
 const bytes=new Uint8Array([37,80,68,70,45,49,46,52]);
 assert.equal(encodePdf(bytes),Buffer.from(bytes).toString("base64"));
 const expected=(await import("node:crypto")).createHash("sha256").update(bytes).digest("hex");
 assert.equal(await sha256(bytes),expected);
});
test("sin proveedor aprobado, incluso con paciente activo, se deniega el envío",async()=>{
 const original=globalThis.fetch,calls=[];
 globalThis.fetch=async(url,init={})=>{
  calls.push({url:String(url),init});
  if(String(url).includes("/clinical_patients?"))return Response.json([{id:patient,full_name:"Test",
    email:"test@example.invalid",birth_date:"1990-01-01",status:"active"}]);
  if(String(url).includes("/clinical_signature_requests?"))return Response.json([]);
  throw Error("Endpoint no esperado "+url);
 };
 try{
  const req=new Request("https://carolinasanchezgirona.com/api/admin/clinical-signatures",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({action:"send",patient_id:patient,kind:"psicologico",email_confirmation:"test@example.invalid",
     confirm_send:true,self_consenting_adult:true,request_id:"22222222-2222-4222-8222-222222222222"})});
  const res=await clinicalSignatures(req,env,auth(true),same);
  assert.equal(res.status,503);
  assert.equal(calls.filter(c=>c.init.method==="POST").length,0);
 }finally{globalThis.fetch=original;}
});
