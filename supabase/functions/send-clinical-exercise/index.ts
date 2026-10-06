const SUPABASE_URL=Deno.env.get("SUPABASE_URL")??"";
const ANON_KEY=Deno.env.get("SUPABASE_ANON_KEY")??"";
const SERVICE_ROLE_KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")??"";
const ALLOWED_USER_ID="9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const VIEW_URL=`${SUPABASE_URL}/functions/v1/view-clinical-exercise`;
const PORTAL_URL="https://carolinasanchezgirona.com/mi-espacio/";
const cors={"Access-Control-Allow-Origin":"https://carolinasanchezgirona.com","Access-Control-Allow-Headers":"authorization, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
function json(body:Record<string,unknown>,status=200){return new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json; charset=utf-8"}})}
function token(){const bytes=crypto.getRandomValues(new Uint8Array(32));return btoa(String.fromCharCode(...bytes)).replaceAll("+","-").replaceAll("/","_").replaceAll("=","")}
async function sha256(value:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes)).map(b=>b.toString(16).padStart(2,"0")).join("")}
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
 if(req.method!=="POST")return json({error:"Método no permitido"},405);
 const authorization=req.headers.get("Authorization")??"";
 const authHeaders={apikey:ANON_KEY,Authorization:authorization};
 const userResponse=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:authHeaders});
 if(!userResponse.ok)return json({error:"Sesión no válida"},401);
 const user=await userResponse.json();if(user?.id!==ALLOWED_USER_ID)return json({error:"No autorizado"},403);
 let payload:{assignment_id?:string;resend?:boolean};try{payload=await req.json()}catch{return json({error:"JSON no válido"},400)}
 if(!payload.assignment_id)return json({error:"Falta la asignación"},400);
 const id=encodeURIComponent(payload.assignment_id);
 const response=await fetch(`${SUPABASE_URL}/rest/v1/clinical_exercise_assignments?id=eq.${id}&select=id,recipient_email,email_status,access_token_hash,access_expires_at,revoked_at,first_opened_at,assigned_at,patient:clinical_patients(email)&limit=1`,{headers:authHeaders});
 const item=(await response.json().catch(()=>[]))?.[0];if(!item)return json({error:"Asignación no encontrada"},404);
 const resend=Boolean(payload.resend);if(item.email_status==="sent"&&!resend)return json({error:"Este material ya fue enviado"},409);
 const recipient=item.recipient_email||item.patient?.email;if(!recipient)return json({error:"El paciente no tiene correo"},400);
 const raw=token(),hash=await sha256(raw),now=new Date(),expires=new Date(now.getTime()+7*24*60*60*1000);
 const serviceHeaders={apikey:SERVICE_ROLE_KEY,Authorization:`Bearer ${SERVICE_ROLE_KEY}`,"Content-Type":"application/json"};
 const oldState={access_token_hash:item.access_token_hash??null,access_expires_at:item.access_expires_at??null,revoked_at:item.revoked_at??null,first_opened_at:item.first_opened_at??null,email_status:item.email_status??"not_sent"};const preparePayload:Record<string,unknown>={access_token_hash:hash,access_expires_at:expires.toISOString(),revoked_at:null,email_status:"sending",recipient_email:recipient,updated_at:now.toISOString()};if(!resend)preparePayload.first_opened_at=null;const prepare=await fetch(`${SUPABASE_URL}/rest/v1/clinical_exercise_assignments?id=eq.${id}`,{method:"PATCH",headers:{...serviceHeaders,Prefer:"return=minimal"},body:JSON.stringify(preparePayload)});
 if(!prepare.ok)return json({error:"No se pudo preparar el enlace"},502);
 const link=`${VIEW_URL}?token=${encodeURIComponent(raw)}`;
 const html=`<!doctype html><html lang="es"><body style="margin:0;background:#f5f8fb;font-family:Arial,sans-serif;color:#233746"><div style="max-width:620px;margin:0 auto;padding:32px 18px"><div style="background:#fff;border:1px solid #d5e3ee;border-radius:18px;padding:32px"><p style="color:#08A6A0;font-size:13px;font-weight:700">MATERIAL DISPONIBLE</p><h1 style="font-size:25px;color:#173A5E">Tienes nuevo material en Mi espacio</h1><p>Carolina ha compartido contigo un material para trabajar entre sesiones.</p><p>Entra en <strong>Mi espacio</strong> con el correo que utilizas en consulta. Si no tienes una sesión abierta, recibirás un código temporal de seis cifras.</p><p style="text-align:center;margin:28px 0"><a href="${PORTAL_URL}" style="display:inline-block;background:#173A5E;color:#fff;text-decoration:none;padding:14px 26px;border-radius:10px;font-weight:700">Entrar en Mi espacio</a></p><p>Desde allí podrás consultar tus materiales y, cuando el ejercicio lo permita, rellenarlo directamente en la página.</p><p style="margin-top:28px">Carolina Sánchez Girona</p></div><p style="color:#667983;font-size:12px">Este correo no contiene información clínica. Evita responder incluyendo datos sensibles.</p></div></body></html>`;
 const text=`Tienes nuevo material en Mi espacio.\n\nEntra con el correo que utilizas en consulta. Si no tienes una sesión abierta, recibirás un código temporal de seis cifras.\n\nMi espacio: ${PORTAL_URL}\n\nDesde allí podrás consultar y rellenar los ejercicios disponibles.\n\nCarolina Sánchez Girona`;
 const apiKey=Deno.env.get("BREVO_API_KEY");if(!apiKey){await fetch(`${SUPABASE_URL}/rest/v1/clinical_exercise_assignments?id=eq.${id}`,{method:"PATCH",headers:{...serviceHeaders,Prefer:"return=minimal"},body:JSON.stringify({...oldState,updated_at:new Date().toISOString()})});return json({error:"Correo no configurado"},500)}
 const sent=await fetch("https://api.brevo.com/v3/smtp/email",{method:"POST",headers:{"api-key":apiKey,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({sender:{name:"Carolina Sánchez Girona",email:"contact@carolinasanchezgirona.com"},to:[{email:recipient}],replyTo:{email:"contact@carolinasanchezgirona.com",name:"Carolina Sánchez Girona"},subject:"Material disponible",htmlContent:html,textContent:text,tags:["clinical-material-link"],headers:{"X-Mailin-Track-Opens":"0","X-Mailin-Track-Clicks":"0"}})});
 if(!sent.ok){await fetch(`${SUPABASE_URL}/rest/v1/clinical_exercise_assignments?id=eq.${id}`,{method:"PATCH",headers:{...serviceHeaders,Prefer:"return=minimal"},body:JSON.stringify({...oldState,updated_at:new Date().toISOString()})});return json({error:"No se ha podido enviar el correo"},502)}
 const finished=new Date().toISOString();
 await fetch(`${SUPABASE_URL}/rest/v1/clinical_exercise_assignments?id=eq.${id}`,{method:"PATCH",headers:{...serviceHeaders,Prefer:"return=minimal"},body:JSON.stringify({status:"sent",email_status:"sent",delivery_channel:"email",assigned_at:item.assigned_at||finished,sent_at:finished,updated_at:finished})});
 return json({ok:true,resend,sent_at:finished,expires_at:expires.toISOString()});
});