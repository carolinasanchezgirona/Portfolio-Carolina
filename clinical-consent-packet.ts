import { buildClinicalConsentPdf, type ConsentKind, CONSENT_VERSION } from "./clinical-consent-pdf";

type Env={SUPABASE_SERVICE_ROLE_KEY?:string};
const SUPA="https://grgyvdxkjdstdyumdfyg.supabase.co";
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const types=new Set(["psicologico","neuro_evaluacion","neuro_intervencion"]);
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
export async function clinicalConsentPacket(
 request:Request, env:Env, owner:(r:Request)=>Promise<boolean>, sameOrigin:(r:Request)=>boolean
):Promise<Response>{
 if(request.method!=="POST")return json({error:"Método no permitido."},405);
 if(!sameOrigin(request))return json({error:"Origen no permitido."},403);
 if(!await owner(request))return json({error:"Acceso profesional necesario."},401);
 if(!env.SUPABASE_SERVICE_ROLE_KEY)return json({error:"Servicio clínico no configurado."},503);
 if(!request.headers.get("content-type")?.startsWith("application/json"))return json({error:"Formato no válido."},415);
 if(Number(request.headers.get("content-length")||0)>1024)return json({error:"Solicitud demasiado grande."},413);
 let data:Record<string,unknown>;
 try{const raw=await request.text();if(raw.length>1024)return json({error:"Solicitud demasiado grande."},413);data=JSON.parse(raw);}catch{return json({error:"Solicitud no válida."},400);}
 if(!data||typeof data!=="object"||Array.isArray(data))return json({error:"Solicitud no válida."},400);
 if(typeof data.patient_id!=="string"||!UUID.test(data.patient_id)||typeof data.kind!=="string"||!types.has(data.kind))return json({error:"Datos de paciente o procedimiento no válidos."},400);
 const headers={apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY};
 const found=await fetch(SUPA+"/rest/v1/clinical_patients?select=id,full_name,birth_date,national_id,status&id=eq."+encodeURIComponent(data.patient_id)+"&limit=1",{headers,cache:"no-store"}).catch(()=>null);
 if(!found?.ok)return json({error:"No se ha podido comprobar la ficha."},503);
 const patients=await found.json().catch(()=>[]) as Array<{id:string;full_name:string;birth_date:string|null;national_id:string|null;status:string}>;
 const patient=patients[0];
 if(!patient||patient.status==="archived"||!patient.full_name)return json({error:"No existe una ficha activa válida."},404);
 const documentId=crypto.randomUUID();
 try{
  const bytes=await buildClinicalConsentPdf(patient,data.kind as ConsentKind,documentId);
  const buffer=new ArrayBuffer(bytes.byteLength);new Uint8Array(buffer).set(bytes);
  const hash=await crypto.subtle.digest("SHA-256",buffer);
  const hashText=Array.from(new Uint8Array(hash),v=>v.toString(16).padStart(2,"0")).join("");
  return new Response(buffer,{status:200,headers:{
    "Content-Type":"application/pdf",
    "Content-Disposition":'attachment; filename="consentimiento-'+data.kind+'-'+CONSENT_VERSION+'.pdf"',
    "Cache-Control":"private, no-store",
    "X-Content-Type-Options":"nosniff",
    "X-Consent-Version":CONSENT_VERSION,
    "X-Consent-Document-Id":documentId,
    "X-Consent-SHA256":hashText,
  }});
 }catch{return json({error:"No se ha podido preparar el PDF. No se ha enviado nada."},503);}
}
