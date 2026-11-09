/**
 * Docusign eSignature REST v2.1 adapter. No user/token/identity data reaches the browser.
 * Requires an approved Data Processing Agreement, verified IDV workflow, and account OAuth grant.
 * Official API: https://developers.docusign.com/docs/esign-rest-api/how-to/id-verification/
 */
export type DocusignEnv = {
 DOCUSIGN_INTEGRATION_KEY?:string;
 DOCUSIGN_IMPERSONATED_USER_ID?:string;
 DOCUSIGN_RSA_PRIVATE_KEY?:string;
 DOCUSIGN_ACCOUNT_ID?:string;
 DOCUSIGN_IDV_WORKFLOW_ID?:string;
 DOCUSIGN_ENVIRONMENT?:string;
 DOCUSIGN_DPA_APPROVED?:string;
 DOCUSIGN_PRODUCTION_APPROVED?:string;
 DOCUSIGN_CONNECT_HMAC_KEY?:string;
};
export const providerConfigured = (env:DocusignEnv) =>
 !!(env.DOCUSIGN_INTEGRATION_KEY && env.DOCUSIGN_IMPERSONATED_USER_ID &&
    env.DOCUSIGN_RSA_PRIVATE_KEY && env.DOCUSIGN_ACCOUNT_ID &&
    env.DOCUSIGN_IDV_WORKFLOW_ID && env.DOCUSIGN_DPA_APPROVED==="yes" &&
    (env.DOCUSIGN_ENVIRONMENT!=="production" || env.DOCUSIGN_PRODUCTION_APPROVED==="yes"));

const base64url=(bytes:Uint8Array)=>btoa(Array.from(bytes,b=>String.fromCharCode(b)).join("")).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const utf8=(text:string)=>new TextEncoder().encode(text);
export function encodePdf(bytes:Uint8Array):string{
  let result="";
  for(let i=0;i<bytes.length;i+=8192) result+=String.fromCharCode(...bytes.subarray(i,i+8192));
  return btoa(result);
}
export function exactBuffer(bytes:Uint8Array):ArrayBuffer{
 const buffer=new ArrayBuffer(bytes.byteLength);
 new Uint8Array(buffer).set(bytes);
 return buffer;
}
export async function sha256(bytes:Uint8Array):Promise<string>{
 const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",exactBuffer(bytes)));
 return Array.from(digest,b=>b.toString(16).padStart(2,"0")).join("");
}
async function signedJwt(env:DocusignEnv){
 const login=env.DOCUSIGN_ENVIRONMENT==="production"?"account.docusign.com":"account-d.docusign.com";
 const keyText=(env.DOCUSIGN_RSA_PRIVATE_KEY||"").replace(/\\n/g,"\n");
 const keyBytes=Uint8Array.from(atob(keyText.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s+/g,"")),c=>c.charCodeAt(0));
 const key=await crypto.subtle.importKey("pkcs8",keyBytes,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["sign"]);
 const now=Math.floor(Date.now()/1000);
 const header=base64url(utf8(JSON.stringify({alg:"RS256",typ:"JWT"})));
 const claims=base64url(utf8(JSON.stringify({iss:env.DOCUSIGN_INTEGRATION_KEY,sub:env.DOCUSIGN_IMPERSONATED_USER_ID,
  aud:login,iat:now-10,exp:now+3300,scope:"signature impersonation"})));
 const payload=header+"."+claims;
 const signature=new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5",key,utf8(payload)));
 return {login,assertion:payload+"."+base64url(signature)};
}
type Session={token:string;apiRoot:string;accountId:string};
export async function authenticateDocusign(env:DocusignEnv):Promise<Session>{
 if(!providerConfigured(env))throw Error("Falta aprobar o configurar Docusign y su flujo de verificación de identidad.");
 const {login,assertion}=await signedJwt(env);
 const response=await fetch("https://"+login+"/oauth/token",{
  method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},
  body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion}).toString(),
  signal:AbortSignal.timeout(12000)
 });
 if(!response.ok)throw Error("Docusign no ha autorizado la integración. Revisa la concesión OAuth.");
 const token=(await response.json() as {access_token?:string}).access_token;
 if(!token)throw Error("Docusign no ha facilitado un token de acceso.");
 const info=await fetch("https://"+login+"/oauth/userinfo",{headers:{Authorization:"Bearer "+token},signal:AbortSignal.timeout(12000)});
 if(!info.ok)throw Error("No se ha podido verificar la cuenta de Docusign.");
 const details=await info.json() as {accounts?:Array<{account_id:string;base_uri:string}>};
 const account=details.accounts?.find(a=>a.account_id===env.DOCUSIGN_ACCOUNT_ID);
 if(!account)throw Error("La cuenta autorizada no coincide con la cuenta configurada.");
 const base=new URL(account.base_uri);
 if(base.protocol!=="https:"||!base.hostname.endsWith(".docusign.net"))
  throw Error("Docusign ha devuelto una URL de API no admitida.");
 return {token,accountId:account.account_id,apiRoot:base.origin+"/restapi/v2.1/accounts/"+encodeURIComponent(account.account_id)};
}
export async function docusignApi(session:Session,path:string,init:RequestInit={}):Promise<Response>{
 if(!/^\/(envelopes|identity_verification)(\/|$)/.test(path))throw Error("Ruta de Docusign no permitida.");
 return fetch(session.apiRoot+path,{...init,headers:{Authorization:"Bearer "+session.token,
  Accept:"application/json",...init.headers},signal:AbortSignal.timeout(25000)});
}
export async function assertIdentityWorkflow(session:Session,workflowId:string){
 const response=await docusignApi(session,"/identity_verification");
 if(!response.ok)throw Error("No se han podido consultar las verificaciones de identidad.");
 const data=await response.json() as {identityVerification?:Array<{workflowId?:string}>};
 if(!data.identityVerification?.some(x=>x.workflowId===workflowId))
  throw Error("Docusign no dispone del flujo IDV exigido. No se enviará ninguna firma.");
}
/** Always creates a draft. Sending requires a separate, deliberate API step. */
export async function createDocusignDraft(session:Session,params:{
 email:string;name:string;pdf:Uint8Array;workflowId:string;documentId:string;
}){
 await assertIdentityWorkflow(session,params.workflowId);
 const payload={
  emailSubject:"Documento de la consulta para revisión y firma",
  emailBlurb:"Por favor, revisa la información y firma cuando lo consideres oportuno. Si tienes dudas, contacta con la consulta.",
  status:"created",
  documents:[{documentBase64:encodePdf(params.pdf),documentId:"1",name:"Consentimiento informado",
   fileExtension:"pdf"}],
  recipients:{signers:[{email:params.email,name:params.name,recipientId:"1",routingOrder:"1",
   identityVerification:{workflowId:params.workflowId,steps:null},
   tabs:{signHereTabs:[{documentId:"1",recipientId:"1",anchorString:"Firma de la persona atendida",
     anchorUnits:"pixels",anchorXOffset:"0",anchorYOffset:"18",anchorIgnoreIfNotPresent:"false"}]}}]},
  customFields:{textCustomFields:[{name:"clinical_document_id",value:params.documentId,show:"false",required:"false"}]},
 };
 const response=await docusignApi(session,"/envelopes",{method:"POST",headers:{"Content-Type":"application/json"},
  body:JSON.stringify(payload)});
 if(!response.ok)throw Error("Docusign no ha podido crear un borrador de firma.");
 const data=await response.json() as {envelopeId?:string;status?:string};
 if(!data.envelopeId||data.status!=="created")throw Error("El borrador no se ha podido confirmar. Verifica la cuenta antes de repetir.");
 return data.envelopeId;
}
export async function sendDocusignDraft(session:Session,envelopeId:string){
 if(!/^[0-9a-f-]{36}$/i.test(envelopeId))throw Error("Sobre inválido.");
 const response=await docusignApi(session,"/envelopes/"+envelopeId,{method:"PUT",headers:{"Content-Type":"application/json"},
  body:JSON.stringify({status:"sent"})});
 if(!response.ok)throw Error("No se ha podido confirmar el envío. Consulta el sobre en Docusign.");
 return true;
}
export async function getDocusignStatus(session:Session,envelopeId:string){
 if(!/^[0-9a-f-]{36}$/i.test(envelopeId))throw Error("Sobre inválido.");
 const response=await docusignApi(session,"/envelopes/"+envelopeId);
 if(!response.ok)throw Error("Docusign no ha permitido verificar el estado.");
 const data=await response.json() as {status?:string;completedDateTime?:string};
 return {status:data.status||"unknown",completed_at:data.completedDateTime||null};
}
export async function downloadSignedPdf(session:Session,envelopeId:string,which:"combined"|"certificate"){
 const response=await docusignApi(session,"/envelopes/"+envelopeId+"/documents/"+which,{headers:{Accept:"application/pdf"}});
 if(!response.ok)throw Error("No se ha podido obtener "+which+" desde Docusign.");
 const bytes=new Uint8Array(await response.arrayBuffer());
 if(bytes.byteLength<500||bytes.byteLength>25_000_000||new TextDecoder().decode(bytes.subarray(0,5))!=="%PDF-")
  throw Error("El documento recuperado no es un PDF válido.");
 return bytes;
}
export async function verifyDocusignHmac(body:Uint8Array,secret:string,header:string):Promise<boolean>{
 if(!header||!secret)return false;
 const key=await crypto.subtle.importKey("raw",utf8(secret),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
 try {
  const provided=Uint8Array.from(atob(header),c=>c.charCodeAt(0));
  return await crypto.subtle.verify("HMAC",key,exactBuffer(provided),exactBuffer(body));
 }catch{return false;}
}
