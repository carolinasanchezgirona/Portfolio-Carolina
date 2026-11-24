import { signedConsentPdf, type ConsentSignedData } from "./clinical-consent-signed-pdf";
import { CONSENT_VERSION, type ConsentKind } from "./clinical-consent-pdf";

type Env = { SUPABASE_SERVICE_ROLE_KEY?: string };
type Session = { patient_id: string } | null;
type Options = {
  owner: (request: Request) => Promise<boolean>;
  sameOrigin: (request: Request) => boolean;
  patientSession: (request: Request) => Promise<Session>;
};
const SUPABASE = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const kinds = new Set<ConsentKind>(["psicologico","neuro_evaluacion","neuro_intervencion","privacidad"]);
const names: Record<ConsentKind, string> = {
  psicologico:"Consentimiento psicológico",
  neuro_evaluacion:"Consentimiento evaluación neuropsicológica",
  neuro_intervencion:"Consentimiento intervención neuropsicológica",
  privacidad:"Acuse información de protección de datos",
};
type ConsentRow = { id:string; patient_id:string; kind:ConsentKind; status:string; assigned_at:string; signed_at:string|null; verified_at:string|null; document_id:string|null; pdf_sha256:string|null };
type Patient = { id:string; full_name:string; birth_date:string|null; national_id:string|null; status:string; portal_access_enabled:boolean };

function json(body:unknown,status=200){return Response.json(body,{status,headers:{"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","X-Frame-Options":"DENY"}});}
const string=(value:unknown,max=140)=>typeof value==="string"?value.trim().replace(/[\t\n\r]+/g," ").slice(0,max+1):"";
const comparable=(value:string)=>value.normalize("NFKC").replace(/\s+/g," ").toLocaleLowerCase("es").trim();
async function digest(value:Uint8Array| string){
 const bytes=typeof value==="string"?new TextEncoder().encode(value):value;
 const hash=await crypto.subtle.digest("SHA-256",bytes);
 return Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,"0")).join("");
}
function authHeaders(env:Env, extras:Record<string,string>={}) {
 return {apikey:env.SUPABASE_SERVICE_ROLE_KEY||"",Authorization:"Bearer "+(env.SUPABASE_SERVICE_ROLE_KEY||""),...extras};
}
async function query(env:Env,path:string,init:RequestInit={}) {
 return fetch(SUPABASE+"/rest/v1/"+path,{...init,headers:{...authHeaders(env),...(init.headers||{})},cache:"no-store"});
}
async function parsePayload(request:Request) {
 if(!request.headers.get("content-type")?.startsWith("application/json"))throw Error("Formato incorrecto.");
 if(Number(request.headers.get("content-length")||0)>250000)throw Error("Solicitud demasiado grande.");
 const body=await request.text();
 if(body.length>250000)throw Error("Solicitud demasiado grande.");
 const result=JSON.parse(body) as Record<string,unknown>;
 if(!result||typeof result!=="object"||Array.isArray(result))throw Error("Datos no válidos.");
 return result;
}
async function patientRecord(env:Env,id:string) {
 const response=await query(env,"clinical_patients?select=id,full_name,birth_date,national_id,status,portal_access_enabled&id=eq."+encodeURIComponent(id)+"&limit=1");
 if(!response.ok)return null;
 const rows=await response.json().catch(()=>[]) as Patient[];
 return rows[0]||null;
}
async function getRequests(env:Env,patientId:string) {
 const response=await query(env,"clinical_consent_requests?select=id,patient_id,kind,status,assigned_at,signed_at,verified_at,document_id,pdf_sha256&patient_id=eq."+encodeURIComponent(patientId)+"&order=assigned_at.desc&limit=60");
 if(!response.ok)throw Error("No se pueden consultar las solicitudes.");
 return await response.json() as ConsentRow[];
}
async function getOne(env:Env,id:string,patientId:string) {
 const response=await query(env,"clinical_consent_requests?select=id,patient_id,kind,status,assigned_at,signed_at,verified_at,document_id,pdf_sha256&id=eq."+encodeURIComponent(id)+"&patient_id=eq."+encodeURIComponent(patientId)+"&limit=1");
 if(!response.ok)return null;
 const rows=await response.json().catch(()=>[]) as ConsentRow[];
 return rows[0]||null;
}
async function archivePdf(env:Env,path:string,bytes:Uint8Array){
 const buffer=new ArrayBuffer(bytes.byteLength);new Uint8Array(buffer).set(bytes);
 return fetch(SUPABASE+"/storage/v1/object/clinical-documents/"+path,{
  method:"POST",headers:authHeaders(env,{"Content-Type":"application/pdf","x-upsert":"false","Cache-Control":"no-store"}),body:buffer,
 });
}
async function deletePdf(env:Env,path:string){
 await fetch(SUPABASE+"/storage/v1/object/clinical-documents/"+path,{method:"DELETE",headers:authHeaders(env)}).catch(()=>null);
}
export async function clinicalConsentWorkflow(request:Request,env:Env, options:Options,actor:"admin"|"patient"):Promise<Response>{
 const method=request.method;
 if(!["GET","POST"].includes(method))return json({error:"Método no permitido."},405);
 if(method==="POST"&&!options.sameOrigin(request))return json({error:"Origen no permitido."},403);
 if(!env.SUPABASE_SERVICE_ROLE_KEY)return json({error:"Servicio no disponible."},503);
 if(actor==="admin"){
  if(!await options.owner(request))return json({error:"Identificación profesional y MFA necesarios."},401);
  if(method==="GET"){
   const patientId=new URL(request.url).searchParams.get("patient_id")||"";
   if(!ID.test(patientId))return json({error:"Paciente no válido."},400);
   try {return json({requests:await getRequests(env,patientId)});}catch{return json({error:"No se ha podido cargar el estado de las firmas."},503);}
  }
  let body:Record<string,unknown>;
  try{body=await parsePayload(request);}catch{return json({error:"Solicitud no válida."},400);}
  const patientId=string(body.patient_id,36);
  if(!ID.test(patientId))return json({error:"Paciente no válido."},400);
  const patient=await patientRecord(env,patientId);
  if(!patient||patient.status==="archived")return json({error:"La ficha no está activa."},404);
  if(body.action==="assign"){
   const kind=body.kind;
   if(typeof kind!=="string"||!kinds.has(kind as ConsentKind))return json({error:"Tipo no válido."},400);
   if(!patient.portal_access_enabled)return json({error:"El acceso de Mi espacio de este paciente está deshabilitado."},409);
   const response=await query(env,"clinical_consent_requests?select=id,kind,status,assigned_at",{
    method:"POST",headers:{"Content-Type":"application/json",Prefer:"return=representation"},
    body:JSON.stringify({patient_id:patientId,kind,document_version:CONSENT_VERSION,status:"pending"})
   });
   if(response.status===409)return json({error:"Ya existe una solicitud pendiente de este documento."},409);
   if(!response.ok)return json({error:"No se pudo asignar el consentimiento."},503);
   return json({request:(await response.json())[0]},201);
  }
  if(body.action==="verify"||body.action==="cancel"){
   const id=string(body.request_id,36);
   if(!ID.test(id))return json({error:"Solicitud no válida."},400);
   const previous=await getOne(env,id,patientId);
   if(!previous)return json({error:"Solicitud no encontrada."},404);
   if(body.action==="verify"&&previous.status!=="submitted")return json({error:"Solo se puede verificar una firma recibida."},409);
   if(body.action==="cancel"&&previous.status!=="pending")return json({error:"Solo se pueden cancelar solicitudes pendientes."},409);
   const status=body.action==="verify"?"verified":"cancelled";
   const changes=status==="verified"?{status,verified_at:new Date().toISOString()}:{status,cancelled_at:new Date().toISOString()};
   const response=await query(env,"clinical_consent_requests?id=eq."+encodeURIComponent(id)+"&patient_id=eq."+encodeURIComponent(patientId)+"&status=eq."+previous.status+"&select=id,status",{
    method:"PATCH",headers:{"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(changes)
   });
   const rows=response.ok?await response.json().catch(()=>[]):[];
   if(!Array.isArray(rows)||rows.length!==1)return json({error:"No se pudo confirmar el cambio de estado."},409);
   return json({request:rows[0]});
  }
  return json({error:"Acción desconocida."},400);
 }

 const session=await options.patientSession(request);
 if(!session)return json({error:"Accede primero a Mi espacio con tu cuenta."},401);
 const patientId=session.patient_id;
 if(method==="GET"){
  try{
   const rows=await getRequests(env,patientId);
   const id=new URL(request.url).searchParams.get("id");
   if(id){
    const requestRow=rows.find(x=>x.id===id);
    if(!requestRow)return json({error:"Esta solicitud no pertenece a tu espacio."},404);
    const patient=await patientRecord(env,patientId);
    if(!patient)return json({error:"Ficha no disponible."},404);
    return json({request:requestRow,patient:{name:patient.full_name,birth_date:patient.birth_date||"",national_id:patient.national_id||""}});
   }
   return json({requests:rows.map(x=>({id:x.id,kind:x.kind,status:x.status,assigned_at:x.assigned_at,signed_at:x.signed_at}))});
  }catch{return json({error:"No se han podido cargar tus consentimientos."},503);}
 }
 let body:Record<string,unknown>;
 try{body=await parsePayload(request);}catch{return json({error:"Formulario no válido."},400);}
 const id=string(body.request_id,36);
 if(!ID.test(id))return json({error:"Solicitud no válida."},400);
 const row=await getOne(env,id,patientId);
 if(!row)return json({error:"Esta solicitud no pertenece a tu espacio."},404);
 if(row.status!=="pending")return json({error:"Esta solicitud ya no admite nuevas firmas."},409);
 const patient=await patientRecord(env,patientId);
 if(!patient||patient.status==="archived"||!patient.portal_access_enabled)return json({error:"Acceso clínico inactivo."},403);
 const name=string(body.name,160), place=string(body.place,100), date=string(body.date,10);
 const signer=body.signer;
 const representativeName=string(body.representative_name,160),representation=string(body.relationship,180);
 const nationalId=string(body.national_id,25),birth=string(body.birth,10);
 const scope=string(body.scope,25);
 const png=typeof body.signature_png==="string"?body.signature_png:"";
 if(name.length<3||name.length>160||comparable(name)!==comparable(patient.full_name)||
    !place||place.length>100||!/^20\d{2}-\d{2}-\d{2}$/.test(date)||
    !["patient","representative"].includes(String(signer))||body.accepted!==true)
    return json({error:"Revisa la identidad, la fecha, el lugar y la declaración de consentimiento."},400);
 if(signer==="representative"&&(!representativeName||!representation))
    return json({error:"Identifica al representante y su vínculo. La profesional deberá acreditarlo."},400);
 if(row.kind==="neuro_evaluacion"&&scope!=="evaluation"||row.kind==="neuro_intervencion"&&scope!=="intervention")
    return json({error:"El alcance solicitado no coincide con el documento asignado."},400);
 if(!/^data:image\/png;base64,[A-Za-z0-9+/=]{100,180000}$/.test(png)||png.length>180030)
    return json({error:"La firma debe dibujarse en el recuadro."},400);
 // Reject malformed images before the PDF generator.
 let signatureBytes:string;
 try{
  signatureBytes=atob(png.slice("data:image/png;base64,".length));
  if(signatureBytes.length<70||signatureBytes.length>135000||
     !signatureBytes.startsWith("\x89PNG\r\n\x1a\n"))throw Error("PNG inválido");
 }catch{return json({error:"La firma no contiene una imagen PNG válida."},400);}
 const signedAt=new Date().toISOString();
 const declared={
  patient_name:patient.full_name,
  birth_date:birth||patient.birth_date||"",
  national_id:nationalId||patient.national_id||"",
  place,
  declared_date:date,
  signer:signer as "patient"|"representative",
  representative_name:signer==="representative"?representativeName:"",
  representation:signer==="representative"?representation:"",
  scope:row.kind.startsWith("neuro_")?scope:"",
  accepted:true as const,
  signed_at:signedAt,
  document_id:row.id,
  document_version:CONSENT_VERSION,
  policy_reference:row.kind==="privacidad"?"https://carolinasanchezgirona.com/privacidad/":"",
  signature_png:png,
 };
 const evidenceSha=await digest(JSON.stringify(declared));
 const signed:ConsentSignedData={...declared,evidence_sha256:evidenceSha};
 let bytes:Uint8Array;
 try{bytes=signedConsentPdf(row.kind,signed);}catch{return json({error:"No se ha podido preparar el PDF firmado. No se ha guardado nada."},503);}
 if(bytes.length===0||bytes.length>3_000_000)return json({error:"Documento generado no válido."},503);
 const pdfSha=await digest(bytes);
 const storagePath=patientId+"/consents/"+id+".pdf";
 const uploaded=await archivePdf(env,storagePath,bytes).catch(()=>null);
 if(!uploaded?.ok)return json({error:"No se pudo guardar la copia privada. Comprueba el estado antes de repetir la firma."},503);
 const documentId=crypto.randomUUID();
 const record={
  id:documentId,patient_id:patientId,category:"consent",title:names[row.kind],
  file_path:storagePath,file_name:"consentimiento-"+row.kind+"-"+id+".pdf",
  mime_type:"application/pdf",file_size:bytes.length,document_date:signedAt.slice(0,10),
  notes:"Documento recibido con firma electrónica simple. Pendiente de revisión de identidad, capacidad y representación. Solicitud: "+id+"; evidencia SHA-256 "+evidenceSha+"; PDF SHA-256 "+pdfSha,
 };
 const inserted=await query(env,"clinical_documents?select=id",{method:"POST",headers:{"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(record)}).catch(()=>null);
 if(!inserted?.ok){
  await deletePdf(env,storagePath);
  return json({error:"La copia se ha preparado pero no se pudo vincular al historial. No se ha confirmado la firma."},503);
 }
 const updated=await query(env,"clinical_consent_requests?id=eq."+encodeURIComponent(id)+"&patient_id=eq."+encodeURIComponent(patientId)+"&status=eq.pending&select=id,status",{
  method:"PATCH",headers:{"Content-Type":"application/json",Prefer:"return=representation"},
  body:JSON.stringify({status:"submitted",signed_at:signedAt,signed_payload:declared,
   evidence_sha256:evidenceSha,pdf_sha256:pdfSha,document_id:documentId})
 }).catch(()=>null);
 const confirmed=updated?.ok?await updated.json().catch(()=>[]):[];
 if(!Array.isArray(confirmed)||confirmed.length!==1){
  // Roll back orphaned archives when the request changed concurrently.
  const deleted=await query(env,"clinical_documents?id=eq."+encodeURIComponent(documentId),{method:"DELETE"}).catch(()=>null);
  if(deleted?.ok)await deletePdf(env,storagePath);
  return json({error:"No se ha confirmado la recepción; contacta con la consulta antes de repetir."},409);
 }
 return json({ok:true,status:"submitted",message:"Documento recibido en tu ficha clínica, pendiente de validación profesional."},201);
}
