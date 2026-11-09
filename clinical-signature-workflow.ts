import { buildClinicalConsentPdf,CONSENT_VERSION,type ConsentKind } from "./clinical-consent-pdf";
import { authenticateDocusign,createDocusignDraft,sendDocusignDraft,getDocusignStatus,
 downloadSignedPdf,providerConfigured,sha256,verifyDocusignHmac,type DocusignEnv } from "./clinical-signature-docusign";

type Env=DocusignEnv & {SUPABASE_SERVICE_ROLE_KEY?:string};
const SUPA="https://grgyvdxkjdstdyumdfyg.supabase.co";
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL=/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;
const kinds=new Set(["psicologico","neuro_evaluacion","neuro_intervencion"]);
const table="clinical_signature_requests";
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
type SignatureRow={
 id:string;request_nonce:string;patient_id:string;kind:ConsentKind;status:string;signer_email:string;
 envelope_id:string|null;original_sha256:string|null;original_path:string|null;
 signed_sha256:string|null;signed_path:string|null;certificate_sha256:string|null;certificate_path:string|null;
 requested_at:string;submitted_at:string|null;provider_completed_at:string|null;archived_at:string|null;
};
type Patient={id:string;full_name:string;email:string|null;birth_date:string|null;national_id:string|null;status:string};
function serviceHeaders(env:Env,additional:Record<string,string>={}){
 return {apikey:env.SUPABASE_SERVICE_ROLE_KEY||"",Authorization:"Bearer "+(env.SUPABASE_SERVICE_ROLE_KEY||""),
  "Content-Type":"application/json",...additional};
}
async function db(env:Env,path:string,init:RequestInit={}){
 const response=await fetch(SUPA+"/rest/v1/"+path,{...init,headers:serviceHeaders(env,init.headers as Record<string,string>||{}),cache:"no-store"});
 if(!response.ok)throw Error("No se ha podido confirmar el registro protegido de firma.");
 return response;
}
async function rows<T>(env:Env,path:string):Promise<T[]>{
 return await (await db(env,path)).json() as T[];
}
async function patch(env:Env,id:string,changes:Record<string,unknown>){
 const result=await db(env,table+"?id=eq."+encodeURIComponent(id)+"&select=id",{method:"PATCH",
  headers:{Prefer:"return=representation"},body:JSON.stringify({...changes,updated_at:new Date().toISOString()})});
 if(!(await result.json() as Array<unknown>).length)throw Error("No se ha podido registrar el cambio de firma.");
}
async function savePdf(env:Env,path:string,bytes:Uint8Array){
 if(!/^[a-f0-9-]{36}\/(original|signed|certificate)\.pdf$/i.test(path))throw Error("Ruta de custodia no válida.");
 const result=await fetch(SUPA+"/storage/v1/object/clinical-documents/"+path,{method:"POST",headers:{
  apikey:env.SUPABASE_SERVICE_ROLE_KEY||"",Authorization:"Bearer "+(env.SUPABASE_SERVICE_ROLE_KEY||""),
  "Content-Type":"application/pdf","x-upsert":"false"
 },body:bytes,cache:"no-store"});
 if(!result.ok && result.status!==409)throw Error("No se ha podido guardar el PDF en la custodia privada.");
}
async function registerClinicalDocument(env:Env,row:SignatureRow,which:"signed"|"certificate",path:string,hash:string){
 const label=which==="signed"?"Consentimiento informado firmado":"Certificado de evidencias de la firma";
 const request={patient_id:row.patient_id,category:"consent",title:label,
  file_path:path,file_name:which+"-"+row.id+".pdf",mime_type:"application/pdf",
  document_date:new Date().toISOString().slice(0,10),
  notes:"Docusign · versión "+CONSENT_VERSION+" · solicitud "+row.id+" · SHA-256 "+hash,
  shared_at:null,share_revoked_at:null};
 await db(env,"clinical_documents?on_conflict=file_path",{method:"POST",
  headers:{Prefer:"resolution=ignore-duplicates,return=minimal"},body:JSON.stringify(request)});
}
async function archiveIfCompleted(env:Env,row:SignatureRow){
 if(row.status==="archived")return {status:"archived",archived_at:row.archived_at};
 if(!row.envelope_id)throw Error("No consta un sobre de firma.");
 const session=await authenticateDocusign(env);
 const remote=await getDocusignStatus(session,row.envelope_id);
 if(remote.status==="declined"||remote.status==="voided"){
  await patch(env,row.id,{status:remote.status});
  return {status:remote.status};
 }
 if(remote.status!=="completed"){
  const allowed=["sent","delivered"].includes(remote.status)?remote.status:"unknown";
  await patch(env,row.id,{status:allowed});
  return {status:allowed};
 }
 // No se afirma que esté firmado hasta verificar estado remoto y custodiar AMBOS PDF.
 await patch(env,row.id,{status:"completed_unarchived",provider_completed_at:remote.completed_at});
 const signed=await downloadSignedPdf(session,row.envelope_id,"combined");
 const certificate=await downloadSignedPdf(session,row.envelope_id,"certificate");
 const signedPath=row.id+"/signed.pdf",certificatePath=row.id+"/certificate.pdf";
 const signedHash=await sha256(signed),certificateHash=await sha256(certificate);
 await savePdf(env,signedPath,signed);
 await savePdf(env,certificatePath,certificate);
 await registerClinicalDocument(env,row,"signed",signedPath,signedHash);
 await registerClinicalDocument(env,row,"certificate",certificatePath,certificateHash);
 const archivedAt=new Date().toISOString();
 await patch(env,row.id,{status:"archived",signed_path:signedPath,signed_sha256:signedHash,
  certificate_path:certificatePath,certificate_sha256:certificateHash,archived_at:archivedAt,
  provider_completed_at:remote.completed_at||archivedAt});
 return {status:"archived",archived_at:archivedAt};
}

export async function clinicalSignatures(request:Request,env:Env,
 owner:(r:Request)=>Promise<boolean>,sameOrigin:(r:Request)=>boolean):Promise<Response>{
 if(!["GET","POST"].includes(request.method))return json({error:"Método no permitido."},405);
 if(!sameOrigin(request))return json({error:"Origen no permitido."},403);
 if(!await owner(request))return json({error:"Acceso profesional no autorizado."},401);
 if(!env.SUPABASE_SERVICE_ROLE_KEY)return json({error:"Servicio de custodia no configurado."},503);
 if(Number(request.headers.get("Content-Length")||0)>2048)return json({error:"Solicitud demasiado extensa."},413);
 let body:Record<string,unknown>={};
 if(request.method==="POST"){
  if(!request.headers.get("Content-Type")?.startsWith("application/json"))return json({error:"Formato no válido."},415);
  try {const raw=await request.text();if(raw.length>2048)throw Error("too long");body=JSON.parse(raw);
   if(!body||Array.isArray(body)||typeof body!=="object")throw Error("invalid");
  }catch{return json({error:"Solicitud no válida."},400);}
 }
 const patientId=request.method==="GET"?new URL(request.url).searchParams.get("patient_id"):body.patient_id;
 if(typeof patientId!=="string"||!UUID.test(patientId))return json({error:"Paciente no válido."},400);
 try {
  const patient=(await rows<Patient>(env,"clinical_patients?select=id,full_name,email,birth_date,national_id,status&id=eq."+patientId+"&limit=1"))[0];
  if(!patient||patient.status==="archived")return json({error:"Ficha no activa."},404);
  const existing=await rows<SignatureRow>(env,table+"?select=*&patient_id=eq."+patientId+"&order=requested_at.desc&limit=30");
  const configured=providerConfigured(env);
  if(request.method==="GET")return json({
   configured, email:patient.email||"", requests:existing.map(r=>({id:r.id,kind:r.kind,status:r.status,
    requested_at:r.requested_at,submitted_at:r.submitted_at,archived_at:r.archived_at,
    original_sha256:r.original_sha256,signed_sha256:r.signed_sha256,certificate_sha256:r.certificate_sha256})),
   note: configured?"La firma usa verificación de identidad del prestador.":"Conecta y valida primero Docusign: no hay envíos activos."
  });
  if(body.action==="sync"){
   if(typeof body.signature_id!=="string"||!UUID.test(body.signature_id))return json({error:"Solicitud de firma no válida."},400);
   const row=existing.find(x=>x.id===body.signature_id);
   if(!row)return json({error:"La solicitud no pertenece a esta ficha."},404);
   if(!configured)return json({error:"El proveedor no está configurado."},503);
   return json(await archiveIfCompleted(env,row));
  }
  if(body.action!=="send")return json({error:"Acción no admitida."},400);
  if(!configured)return json({error:"La firma verificada no está activada. Debes configurar Docusign y aprobar el tratamiento antes de enviar."},503);
  const kind=body.kind;
  if(typeof kind!=="string"||!kinds.has(kind))return json({error:"Tipo de consentimiento no válido."},400);
  const email=typeof patient.email==="string"?patient.email.trim().toLowerCase():"";
  if(!EMAIL.test(email)||!patient.full_name||body.email_confirmation!==email||body.confirm_send!==true)
   return json({error:"Revisa y confirma la identidad y el correo del destinatario."},409);
  // El flujo actual sólo contempla personas adultas que firman por sí mismas.
  if(!patient.birth_date||!/^\d{4}-\d{2}-\d{2}$/.test(patient.birth_date)||
    Date.now()-Date.parse(patient.birth_date)<18*365.2425*24*3600*1000)
   return json({error:"La firma automática requiere un adulto con fecha de nacimiento registrada. La representación necesita un procedimiento específico."},409);
  if(body.self_consenting_adult!==true)return json({error:"Confirma que el paciente firma por sí mismo, sin representación."},409);
  const nonce=body.request_id;
  if(typeof nonce!=="string"||!UUID.test(nonce))return json({error:"Identificador de envío no válido."},400);
  const prior=existing.find(x=>x.request_nonce===nonce);
  if(prior)return json({error:"Esta solicitud ya existe. Comprueba su estado; nunca se reenvía automáticamente.",request_id:prior.id},409);
  if(existing.some(x=>x.kind===kind&&["preparing","draft","sent","delivered","unknown","completed_unarchived"].includes(x.status)))
   return json({error:"Hay una solicitud de este tipo todavía pendiente. Sincronízala antes de generar otra."},409);
  const signatureId=crypto.randomUUID();
  const created=await db(env,table+"?select=id",{method:"POST",headers:{Prefer:"return=representation"},
   body:JSON.stringify({id:signatureId,request_nonce:nonce,patient_id:patientId,kind,signer_email:email,
    consent_version:CONSENT_VERSION,status:"preparing"})});
  if(!(await created.json() as unknown[]).length)throw Error("No se ha podido reservar la solicitud.");
  let envelope:string|null=null;
  try{
   const pdf=await buildClinicalConsentPdf(patient,kind as ConsentKind,signatureId);
   const originalHash=await sha256(pdf),originalPath=signatureId+"/original.pdf";
   await savePdf(env,originalPath,pdf);
   await patch(env,signatureId,{original_sha256:originalHash,original_path:originalPath});
   const session=await authenticateDocusign(env);
   envelope=await createDocusignDraft(session,{email,name:patient.full_name,pdf,
    workflowId:env.DOCUSIGN_IDV_WORKFLOW_ID!,documentId:signatureId});
   await patch(env,signatureId,{status:"draft",envelope_id:envelope});
   // Un borrador sin registrar en DB NUNCA se envía.
   try {
    await sendDocusignDraft(session,envelope);
    await patch(env,signatureId,{status:"sent",submitted_at:new Date().toISOString()});
    return json({ok:true,status:"sent",signature_id:signatureId});
   }catch {
    await patch(env,signatureId,{status:"unknown"}).catch(()=>{});
    return json({error:"No se puede confirmar el envío. Comprueba el sobre en Docusign y sincroniza antes de repetir.",signature_id:signatureId},502);
   }
  }catch {
   if(!envelope)await patch(env,signatureId,{status:"error"}).catch(()=>{});
   else await patch(env,signatureId,{status:"unknown"}).catch(()=>{});
   return json({error:envelope?"Existe un borrador en Docusign. No lo reenvíes sin comprobarlo.":"No se ha enviado nada; revisa la configuración o el documento.",signature_id:signatureId},503);
  }
 }catch{return json({error:"No se ha podido verificar o actualizar el registro de firma. Revisa la configuración antes de reintentar."},503);}
}

export async function clinicalSignaturesConnect(request:Request,env:Env):Promise<Response>{
 if(request.method!=="POST")return new Response(null,{status:405});
 if(!providerConfigured(env)||!env.DOCUSIGN_CONNECT_HMAC_KEY||!env.SUPABASE_SERVICE_ROLE_KEY)
  return new Response(null,{status:503});
 if(Number(request.headers.get("Content-Length")||0)>65_536)return new Response(null,{status:413});
 const raw=new Uint8Array(await request.arrayBuffer());
 if(raw.byteLength>65_536)return new Response(null,{status:413});
 const signatures=Array.from(request.headers.entries()).filter(([k])=>/^x-docusign-signature-\d+$/i.test(k));
 let valid=false;
 for(const [,v] of signatures)if(await verifyDocusignHmac(raw,env.DOCUSIGN_CONNECT_HMAC_KEY,v)){valid=true;break;}
 if(!valid)return new Response(null,{status:401});
 let event:{event?:string;data?:{accountId?:string;envelopeId?:string}};
 try {event=JSON.parse(new TextDecoder().decode(raw));}catch{return new Response(null,{status:400});}
 if(event.data?.accountId!==env.DOCUSIGN_ACCOUNT_ID||!event.data?.envelopeId||!UUID.test(event.data.envelopeId))
  return new Response(null,{status:204});
 if(!["envelope-completed","envelope-declined","envelope-voided"].includes(event.event||""))
  return new Response(null,{status:204});
 try{
  const row=(await rows<SignatureRow>(env,table+"?select=*&envelope_id=eq."+event.data.envelopeId+"&limit=1"))[0];
  if(!row)return new Response(null,{status:204});
  await archiveIfCompleted(env,row);
  return new Response(null,{status:204});
 }catch{return new Response(null,{status:503});}
}
