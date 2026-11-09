
/**
 * Firma electrónica SIMPLE gratuita dentro de Mi espacio.
 * No es firma avanzada, cualificada ni PAdES. Solo la profesional puede iniciar envíos.
 * Custodia: PDF exacto informado + acta probatoria separada en Storage privado.
 * No se devuelven URLs de Storage ni datos de otros pacientes.
 */
import { jsPDF } from "jspdf";
import { buildClinicalConsentPdf, CONSENT_VERSION, type ConsentKind } from "./clinical-consent-pdf.ts";

type Env={SUPABASE_SERVICE_ROLE_KEY?:string;BREVO_API_KEY?:string};
type PatientSession={patient_id:string;id:string;fresh_password:boolean};
type Patient={id:string;full_name:string;email:string|null;birth_date:string|null;national_id:string|null;
 status:string;portal_access_enabled:boolean};
type Consent={
 id:string;patient_id:string;kind:ConsentKind;status:string;consent_version:string;signer_email:string;
 original_path:string|null;original_sha256:string|null;accepted_by:string|null;accepted_at:string|null;
 accepted_session_id:string|null;evidence_path:string|null;evidence_sha256:string|null;
 email_accepted_at:string|null;archived_at:string|null;expires_at:string;created_at:string;
};
const SUPA="https://grgyvdxkjdstdyumdfyg.supabase.co";
const BASE="https://carolinasanchezgirona.com";
const table="clinical_simple_consents";
const BUCKET="clinical-documents";
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL=/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;
const kinds=new Set<ConsentKind>(["psicologico","neuro_evaluacion","neuro_intervencion"]);
const labels:Record<ConsentKind,string>={
 psicologico:"Consentimiento informado para atención psicológica",
 neuro_evaluacion:"Consentimiento informado para evaluación neuropsicológica",
 neuro_intervencion:"Consentimiento informado para intervención neuropsicológica"
};
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{
 "Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer",
 "X-Frame-Options":"DENY"
}});
function headers(env:Env,other:Record<string,string>={}):Record<string,string>{
 return {apikey:env.SUPABASE_SERVICE_ROLE_KEY||"",Authorization:"Bearer "+(env.SUPABASE_SERVICE_ROLE_KEY||""),
  "Content-Type":"application/json",...other};
}
async function rest(env:Env,path:string,init:RequestInit={}):Promise<Response>{
 const res=await fetch(SUPA+"/rest/v1/"+path,{...init,headers:headers(env,init.headers as Record<string,string>||{}),cache:"no-store"});
 if(!res.ok)throw Error("El registro clínico protegido no ha respondido correctamente.");
 return res;
}
async function rows<T>(env:Env,path:string):Promise<T[]>{
 const data=await(await rest(env,path)).json();
 if(!Array.isArray(data))throw Error("La respuesta de la historia clínica no es válida.");
 return data as T[];
}
async function patch(env:Env,id:string,body:Record<string,unknown>,filter=""){
 const res=await rest(env,table+"?id=eq."+id+filter+"&select=id",{method:"PATCH",
  headers:{Prefer:"return=representation"},body:JSON.stringify({...body,updated_at:new Date().toISOString()})});
 const items=await res.json() as unknown[];
 if(!Array.isArray(items)||items.length!==1)throw Error("No se ha confirmado la transición del consentimiento.");
}
async function storagePut(env:Env,path:string,bytes:Uint8Array){
 if(!/^simple-consents\/[0-9a-f-]{36}\/(original|evidence)\.pdf$/i.test(path))
  throw Error("Ruta de archivo no permitida.");
 const body=new Uint8Array(bytes.byteLength);body.set(bytes);
 const response=await fetch(SUPA+"/storage/v1/object/"+BUCKET+"/"+path,{method:"POST",
  headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY||"",Authorization:"Bearer "+(env.SUPABASE_SERVICE_ROLE_KEY||""),
   "Content-Type":"application/pdf","x-upsert":"false"},body:body.buffer,cache:"no-store"});
 if(!response.ok)throw Error("No se ha podido guardar el documento privado.");
}
async function storageGet(env:Env,path:string){
 if(!/^simple-consents\/[0-9a-f-]{36}\/(original|evidence)\.pdf$/i.test(path))
  throw Error("Ruta privada no válida.");
 const response=await fetch(SUPA+"/storage/v1/object/authenticated/"+BUCKET+"/"+path,{
  headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY||"",Authorization:"Bearer "+(env.SUPABASE_SERVICE_ROLE_KEY||"")},
  cache:"no-store"});
 if(!response.ok)throw Error("El documento privado no está disponible.");
 const bytes=new Uint8Array(await response.arrayBuffer());
 if(bytes.byteLength<500||bytes.byteLength>20_000_000||new TextDecoder().decode(bytes.subarray(0,5))!=="%PDF-")
  throw Error("El archivo no es un PDF válido.");
 return bytes;
}
async function sha(bytes:Uint8Array){
 const buffer=new Uint8Array(bytes.length);buffer.set(bytes);
 const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",buffer.buffer));
 return Array.from(digest,b=>b.toString(16).padStart(2,"0")).join("");
}
function isAdult(birth:string|null){
 if(!birth||!/^\d{4}-\d{2}-\d{2}$/.test(birth))return false;
 const now=new Date();
 const cutoff=new Date(Date.UTC(now.getUTCFullYear()-18,now.getUTCMonth(),now.getUTCDate())).toISOString().slice(0,10);
 return birth<=cutoff && birth>="1900-01-01";
}
function normalizeName(value:string){
 return value.normalize("NFC").replace(/\s+/g," ").trim().toLocaleLowerCase("es-ES");
}
function evidencePdf(row:Consent,patient:Patient,session:PatientSession,acceptedAt:string,typedName:string){
 const pdf=new jsPDF({format:"a4",unit:"mm",compress:true});
 pdf.setProperties({title:"Acta de aceptación electrónica simple",author:"Carolina Sánchez Girona"});
 let y=25;
 const write=(text:string,size=10)=>{
  pdf.setFont("helvetica","normal");pdf.setFontSize(size);pdf.setTextColor(35,49,56);
  for(const line of pdf.splitTextToSize(text,170) as string[]){
   if(y>268){pdf.addPage();y=25;}
   pdf.text(line,20,y);y+=7;
  } y+=4;
 };
 pdf.setFont("helvetica","bold");pdf.setFontSize(16);pdf.setTextColor(70,100,115);
 pdf.text("ACTA DE ACEPTACIÓN ELECTRÓNICA SIMPLE",20,y);y+=13;
 write("Este registro acredita una declaración de aceptación realizada dentro del portal privado de la consulta. NO es una firma electrónica avanzada o cualificada, ni un sello cualificado de tiempo.",9);
 write("Solicitud: "+row.id);
 write("Documento: "+labels[row.kind]+" · versión "+row.consent_version);
 write("Paciente identificado por la ficha: "+patient.full_name);
 write("Correo asociado a la cuenta: "+row.signer_email);
 write("Nombre expresamente introducido al aceptar: "+typedName);
 write("Fecha y hora del evento (UTC, reloj del servidor): "+acceptedAt);
 write("Medio de acceso: sesión individual autenticada por contraseña, creada menos de 15 minutos antes de la declaración.");
 write("Identificador de sesión autenticada: "+session.id);
 write("SHA-256 del PDF clínico informado: "+(row.original_sha256||""));
 write("Declaración expresa: He podido revisar el consentimiento completo, dispongo de la posibilidad de preguntar a la profesional y acepto libremente el procedimiento descrito. Entiendo que puedo comunicar mi negativa o retirada.");
 write("El archivo original se conserva íntegro, por separado y sin sobreescritura. La huella SHA-256 permite comprobar si cambia. La identidad se vincula a la cuenta del paciente, no a una verificación estatal de identidad.");
 write("Este documento complementa, pero no reemplaza, el registro profesional de la información ofrecida y de la capacidad para consentir.",9);
 return new Uint8Array(pdf.output("arraybuffer"));
}
async function registerDoc(env:Env,row:Consent,path:string,hash:string,type:"original"|"evidence"){
 const data={patient_id:row.patient_id,category:"consent",
  title:type==="original"?"Consentimiento clínico · PDF original":
   "Acta de aceptación electrónica simple · evidencias",
  file_path:path,file_name:type+"-"+row.id+".pdf",mime_type:"application/pdf",
  document_date:new Date().toISOString().slice(0,10),
  notes:"Firma simple Mi espacio · solicitud "+row.id+" · versión "+row.consent_version+" · SHA-256 "+hash,
  shared_at:null,share_revoked_at:null};
 await rest(env,"clinical_documents?on_conflict=file_path",{method:"POST",
  headers:{Prefer:"resolution=ignore-duplicates,return=minimal"},body:JSON.stringify(data)});
}
function publicConsent(row:Consent){
 return {id:row.id,kind:row.kind,title:labels[row.kind],version:row.consent_version,
  status:row.status,original_sha256:row.original_sha256,created_at:row.created_at,
  email_accepted_at:row.email_accepted_at,accepted_at:row.accepted_at,archived_at:row.archived_at,
  expires_at:row.expires_at};
}
async function readBody(request:Request){
 if(!request.headers.get("Content-Type")?.startsWith("application/json"))
  throw Error("El formato de la petición no es válido.");
 if(Number(request.headers.get("Content-Length")||"0")>2048)throw Error("Petición demasiado extensa.");
 const raw=await request.text();
 if(raw.length>2048)throw Error("Petición demasiado extensa.");
 const value=JSON.parse(raw);
 if(!value||Array.isArray(value)||typeof value!=="object")throw Error("Petición no válida.");
 return value as Record<string,unknown>;
}
async function lookupPatient(env:Env,id:string):Promise<Patient|null>{
 return (await rows<Patient>(env,"clinical_patients?select=id,full_name,email,birth_date,national_id,status,portal_access_enabled&id=eq."+id+"&limit=1"))[0]||null;
}
async function findConsent(env:Env,id:string):Promise<Consent|null>{
 return (await rows<Consent>(env,table+"?select=*&id=eq."+id+"&limit=1"))[0]||null;
}
async function sendNeutralEmail(env:Env,email:string):Promise<{accepted:boolean;messageId:string|null}>{
 const body={
  sender:{name:"Carolina Sánchez Girona",email:"contact@carolinasanchezgirona.com"},
  to:[{email}],replyTo:{name:"Carolina Sánchez Girona",email:"contact@carolinasanchezgirona.com"},
  subject:"Tienes un documento pendiente de revisar en Mi espacio",
  textContent:"Hola,\n\nHe puesto a tu disposición un documento para que lo revises en tu espacio privado. Accede con tu contraseña en "+BASE+"/mi-espacio/ . No estás obligado a aceptarlo; si tienes dudas, podemos comentarlas antes.\n\nUn saludo,\nCarolina Sánchez Girona",
  htmlContent:"<p>Hola,</p><p>Tienes un documento para revisar en tu espacio privado. Puedes acceder desde <a href=\""+BASE+"/mi-espacio/\">Mi espacio</a> con tu contraseña.</p><p>Si tienes dudas o prefieres no aceptarlo, puedes consultármelo previamente.</p><p>Un saludo,<br>Carolina Sánchez Girona</p>",
  tags:["manual-simple-consent-invitation"],
  headers:{"X-Mailin-Track-Opens":"0","X-Mailin-Track-Clicks":"0"}
 };
 const res=await fetch("https://api.brevo.com/v3/smtp/email",{
  method:"POST",headers:{"api-key":env.BREVO_API_KEY||"","Content-Type":"application/json"},
  body:JSON.stringify(body),signal:AbortSignal.timeout(20000)
 }).catch(()=>null);
 if(!res?.ok)return {accepted:false,messageId:null};
 const data=await res.json().catch(()=>({})) as {messageId?:string};
 return {accepted:true,messageId:typeof data.messageId==="string"?data.messageId:null};
}
/** Completa de forma idempotente un archivo pendiente SIN volver a pedir ni simular firma. */
async function finalizeRecorded(env:Env,row:Consent,patient:Patient){
 if(row.status!=="recording"||!row.accepted_at||!row.accepted_by||!row.accepted_session_id||
   !row.original_path||!row.original_sha256)throw Error("Faltan evidencias de la declaración.");
 const original=await storageGet(env,row.original_path);
 if(await sha(original)!==row.original_sha256)throw Error("El PDF original no coincide con su huella.");
 const path="simple-consents/"+row.id+"/evidence.pdf";
 const url=SUPA+"/storage/v1/object/authenticated/"+BUCKET+"/"+path;
 const response=await fetch(url,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY||"",
  Authorization:"Bearer "+(env.SUPABASE_SERVICE_ROLE_KEY||"")},cache:"no-store"});
 let evidence:Uint8Array;
 if(response.status===404){
  const session:PatientSession={patient_id:row.patient_id,id:row.accepted_session_id,fresh_password:true};
  evidence=evidencePdf(row,patient,session,row.accepted_at,row.accepted_by);
  try{await storagePut(env,path,evidence);}
  catch{
   // Puede haberse creado el mismo archivo en una llamada concurrente.
   evidence=await storageGet(env,path);
  }
 }else if(response.ok){
  evidence=new Uint8Array(await response.arrayBuffer());
  if(evidence.length<500||evidence.length>20_000_000||new TextDecoder().decode(evidence.subarray(0,5))!=="%PDF-")
   throw Error("El acta custodiada no es un PDF válido.");
 }else throw Error("No se puede comprobar el acta de evidencias.");
 const evidenceHash=await sha(evidence);
 await registerDoc(env,row,row.original_path,row.original_sha256,"original");
 await registerDoc(env,row,path,evidenceHash,"evidence");
 const archivedAt=new Date().toISOString();
 await patch(env,row.id,{status:"archived",evidence_path:path,evidence_sha256:evidenceHash,
  archived_at:archivedAt},"&status=eq.recording");
 return {status:"archived",archived_at:archivedAt};
}

export async function clinicalSimpleAdmin(request:Request,env:Env,
 verifyOwner:(r:Request)=>Promise<boolean>,sameOrigin:(r:Request)=>boolean):Promise<Response>{
 if(!["GET","POST"].includes(request.method))return json({error:"Método no permitido."},405);
 if(!sameOrigin(request))return json({error:"Origen no permitido."},403);
 if(!await verifyOwner(request))return json({error:"Sesión profesional MFA requerida."},401);
 if(!env.SUPABASE_SERVICE_ROLE_KEY)return json({error:"No hay servicio clínico configurado."},503);
 let body:Record<string,unknown>={};
 try{if(request.method==="POST")body=await readBody(request);}catch{return json({error:"Petición no válida."},400);}
 const id=request.method==="GET"?new URL(request.url).searchParams.get("patient_id"):body.patient_id;
 if(typeof id!=="string"||!UUID.test(id))return json({error:"Paciente no válido."},400);
 try{
  const patient=await lookupPatient(env,id);
  if(!patient||patient.status==="archived")return json({error:"La ficha no está activa."},404);
  const current=await rows<Consent>(env,table+"?select=*&patient_id=eq."+id+"&order=created_at.desc&limit=30");
  if(request.method==="GET")return json({email:patient.email||"",portal_enabled:patient.portal_access_enabled,
   available:!!env.BREVO_API_KEY,requests:current.map(publicConsent)});
  if(body.action==="repair"){
   if(typeof body.request_id!=="string"||!UUID.test(body.request_id))
    return json({error:"Solicitud no válida."},400);
   const recording=current.find(row=>row.id===body.request_id&&row.status==="recording");
   if(!recording)return json({error:"No hay ninguna aceptación pendiente de archivo en esta ficha."},404);
   try{return json(await finalizeRecorded(env,recording,patient));}
   catch{return json({error:"No se ha podido verificar o recuperar el archivo. Es necesaria una revisión técnica; nunca solicites una nueva firma por este error."},503);}
  }
  if(body.action!=="send")return json({error:"Acción no válida."},400);
  if(!patient.portal_access_enabled)return json({error:"Activa manualmente Mi espacio para este paciente antes de enviar una firma."},409);
  if(!isAdult(patient.birth_date))return json({error:"Solo está habilitada la firma de adultos. Menores y representación precisan un circuito distinto."},409);
  if(!env.BREVO_API_KEY)return json({error:"Falta configurar el correo de la consulta."},503);
  const email=(patient.email||"").trim().toLowerCase();
  if(!EMAIL.test(email)||body.confirm_email!==email||body.send_manually!==true||
     body.information_provided!==true||body.patient_self_consents!==true)
   return json({error:"Revisa el correo, la información ofrecida y la capacidad para consentir."},409);
  if(typeof body.kind!=="string"||!kinds.has(body.kind as ConsentKind))
   return json({error:"Tipo de consentimiento no válido."},400);
  if(current.some(row=>row.kind===body.kind&&["preparing","pending","email_accepted","email_unknown","recording"].includes(row.status)))
   return json({error:"Ya existe una solicitud abierta de ese tipo. Revisa su estado antes de crear otra."},409);
  const signatureId=crypto.randomUUID();
  const record={id:signatureId,patient_id:id,kind:body.kind,consent_version:CONSENT_VERSION,
   signer_email:email,status:"preparing"};
  await rest(env,table,{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify(record)});
  let created=false;
  try {
   const original=await buildClinicalConsentPdf(patient,body.kind as ConsentKind,signatureId);
   const originalHash=await sha(original),path="simple-consents/"+signatureId+"/original.pdf";
   await storagePut(env,path,original);
   await patch(env,signatureId,{original_path:path,original_sha256:originalHash,status:"pending"});
   created=true;
   // No se manda hasta aquí: documento fijado y custodidado previamente.
   const sent=await sendNeutralEmail(env,email);
   if(!sent.accepted){
    await patch(env,signatureId,{status:"email_unknown"}).catch(()=>{});
    return json({error:"El proveedor no ha confirmado la aceptación del correo. Consulta Brevo antes de reintentar; el documento sigue disponible en Mi espacio.",request_id:signatureId},502);
   }
   await patch(env,signatureId,{status:"email_accepted",email_provider_id:sent.messageId,
    email_accepted_at:new Date().toISOString()}).catch(()=>{});
   return json({ok:true,request_id:signatureId,status:"email_accepted",
    message:"Aceptado por Brevo; no confirma entrega ni firma."});
  }catch{
   if(!created)await patch(env,signatureId,{status:"failed"}).catch(()=>{});
   return json({error:"No se ha podido completar la preparación. Revisa el registro antes de intentarlo de nuevo.",request_id:signatureId},503);
  }
 }catch{return json({error:"No se ha podido verificar el registro de consentimientos."},503);}
}

export async function clinicalSimplePatient(request:Request,env:Env,
 sessionFor:(r:Request)=>Promise<PatientSession|null>,sameOrigin:(r:Request)=>boolean):Promise<Response>{
 if(!["GET","POST"].includes(request.method))return json({error:"Método no permitido."},405);
 if(!sameOrigin(request))return json({error:"Origen no permitido."},403);
 const session=await sessionFor(request);
 if(!session)return json({error:"Inicia sesión en Mi espacio para ver tus documentos."},401);
 if(!env.SUPABASE_SERVICE_ROLE_KEY)return json({error:"Servicio de custodia no disponible."},503);
 try{
  const patient=await lookupPatient(env,session.patient_id);
  if(!patient||patient.status==="archived"||!patient.portal_access_enabled)return json({error:"Acceso no autorizado."},401);
  const params=new URL(request.url).searchParams;
  if(request.method==="GET"){
   if(params.has("document_id")||params.has("evidence_id")){
    const evidenceRequested=params.has("evidence_id");
    const docId=params.get(evidenceRequested?"evidence_id":"document_id")||"";
    if(!UUID.test(docId))return json({error:"Documento no válido."},400);
    const row=await findConsent(env,docId);
    if(!row||row.patient_id!==session.patient_id||!row.original_path||!row.original_sha256||
      !["pending","email_accepted","email_unknown","recording","archived"].includes(row.status))
     return json({error:"Documento no disponible para esta cuenta."},404);
    if(evidenceRequested&&(row.status!=="archived"||!row.evidence_path||!row.evidence_sha256))
     return json({error:"El acta no está archivada."},404);
    const path=evidenceRequested?row.evidence_path!:row.original_path;
    const expected=evidenceRequested?row.evidence_sha256!:row.original_sha256;
    const bytes=await storageGet(env,path);
    if(await sha(bytes)!==expected)throw Error("La integridad del documento no se ha podido verificar.");
    const buffer=new Uint8Array(bytes.length);buffer.set(bytes);
    return new Response(buffer.buffer,{headers:{
     "Content-Type":"application/pdf","Content-Disposition":evidenceRequested?
      'attachment; filename="acta-aceptacion-electronica.pdf"':'attachment; filename="consentimiento-informado.pdf"',
     "Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"
    }});
   }
   const found=await rows<Consent>(env,table+"?select=*&patient_id=eq."+session.patient_id+
    "&status=in.(pending,email_accepted,email_unknown,recording,archived)&order=created_at.desc&limit=30");
   const now=Date.now();
   return json({fresh_password:session.fresh_password,requests:found.filter(r=>
    r.status==="archived"||Date.parse(r.expires_at)>now).map(publicConsent)});
  }
  let data:Record<string,unknown>;
  try{data=await readBody(request);}catch{return json({error:"Solicitud de firma no válida."},400);}
  if(data.action!=="accept"||typeof data.request_id!=="string"||!UUID.test(data.request_id))
   return json({error:"Solicitud de firma no válida."},400);
  if(!session.fresh_password)return json({error:"Para firmar, cierra sesión y vuelve a entrar con tu contraseña. La identificación debe ser reciente."},409);
  const row=await findConsent(env,data.request_id);
  if(!row||row.patient_id!==session.patient_id||
    !["pending","email_accepted","email_unknown"].includes(row.status)||Date.parse(row.expires_at)<=Date.now())
   return json({error:"La solicitud ha caducado, ya se ha aceptado o no pertenece a esta cuenta."},409);
  const typed=typeof data.typed_name==="string"?data.typed_name.trim():"";
  if(typed.length<3||typed.length>150||normalizeName(typed)!==normalizeName(patient.full_name)||
    data.confirm_read!==true||data.confirm_voluntary!==true||data.sign_intent!=="accept")
   return json({error:"Debes revisar el documento, expresar tu decisión e introducir el nombre que consta en la ficha."},409);
  // Si el documento cambió tras la preparación, no se permite aceptar.
  const original=await storageGet(env,row.original_path||"");
  if(!row.original_sha256||await sha(original)!==row.original_sha256)
   return json({error:"La integridad del documento requiere revisión profesional."},503);
  const acceptedAt=new Date().toISOString();
  const updated=await rest(env,table+"?id=eq."+row.id+
   "&patient_id=eq."+session.patient_id+
   "&status=in.(pending,email_accepted,email_unknown)&expires_at=gt."+encodeURIComponent(acceptedAt)+
   "&select=id",{method:"PATCH",headers:{Prefer:"return=representation"},
    body:JSON.stringify({status:"recording",accepted_by:typed,accepted_at:acceptedAt,
     accepted_session_id:session.id,updated_at:acceptedAt})});
  const rowsUpdated=await updated.json() as unknown[];
  if(!Array.isArray(rowsUpdated)||rowsUpdated.length!==1)return json({error:"Este documento acaba de cambiar. Actualiza la página antes de continuar."},409);
  try{
   await finalizeRecorded(env,{...row,status:"recording",accepted_by:typed,accepted_at:acceptedAt,
    accepted_session_id:session.id},patient);
   return json({ok:true,status:"archived",
    message:"Tu aceptación electrónica simple consta en el expediente. Conservamos el documento original y el acta probatoria."});
  }catch{return json({error:"Se ha registrado tu decisión, pero el archivo probatorio requiere revisión profesional. No vuelvas a firmar.",status:"recording"},503);}
 }catch{return json({error:"No ha sido posible completar la consulta segura de consentimientos."},503);}
}
