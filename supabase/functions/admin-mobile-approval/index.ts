// Trusted phone approval for admin logins. Supabase Auth verifies password; a
// non-exportable P-256 key stored in the mobile browser signs each approval.
import { createClient } from "npm:@supabase/supabase-js@2.76.0";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const CLINIC_PROJECT = SUPABASE_URL.includes("grgyvdxkjdstdyumdfyg");
const OWNER_ID = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const ORIGINS = CLINIC_PROJECT
  ? ["https://carolinasanchezgirona.com", "https://www.carolinasanchezgirona.com"]
  : ["https://mineuri.com", "https://www.mineuri.com"];
const db = createClient(SUPABASE_URL, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });
const enc = new TextEncoder();
const decode = (v: string) => Uint8Array.from(atob(v.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - v.length % 4) % 4)), ch => ch.charCodeAt(0));

function reply(body: unknown, status: number, origin: string): Response {
  return Response.json(body, { status, headers: {
    "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Headers": "authorization,apikey,content-type",
    "Access-Control-Allow-Methods": "POST,OPTIONS", "Vary": "Origin",
    "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff",
  }});
}
async function backend(action: string, args: Record<string, unknown> = {}) {
  const result = await db.rpc("admin_mobile_backend", { action, args });
  if (result.error) throw Error(result.error.message);
  return result.data;
}
async function memberAllowed(id: string): Promise<boolean> {
  if (CLINIC_PROJECT) return id === OWNER_ID;
  const r = await db.from("admin_members").select("role").eq("user_id", id).maybeSingle();
  return !r.error && ["owner", "editor"].includes(r.data?.role ?? "");
}
async function passwordSession(req: Request) {
  const authorization = req.headers.get("authorization") || "";
  if (!/^Bearer [A-Za-z0-9._-]+$/.test(authorization)) throw Error("Inicia sesión con tu contraseña.");
  const token = authorization.slice(7);
  const userResult = await db.auth.getUser(token);
  if (userResult.error || !userResult.data.user || !await memberAllowed(userResult.data.user.id)) {
    throw Error("Acceso de administración no autorizado.");
  }
  let claims: { session_id?: string } = {};
  try { claims = JSON.parse(new TextDecoder().decode(decode(token.split(".")[1]))); }
  catch { throw Error("Sesión inválida."); }
  if (!claims.session_id || !/^[0-9a-f-]{36}$/i.test(claims.session_id)) throw Error("No se ha podido comprobar la sesión.");
  return { user_id: userResult.data.user.id, session_id: claims.session_id };
}
function validSubscription(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const s = value as Record<string, unknown>;
  if (typeof s.endpoint !== "string" || !s.keys || typeof s.keys !== "object") return false;
  const keys = s.keys as Record<string,unknown>;
  if (typeof keys.p256dh !== "string" || typeof keys.auth !== "string" || keys.p256dh.length>300 || keys.auth.length>100) return false;
  try {
    const url = new URL(s.endpoint);
    if (url.protocol !== "https:" || url.port || url.username || url.password || url.hash || s.endpoint.length>2048) return false;
    const h = url.hostname.toLowerCase();
    return ["fcm.googleapis.com", "fcmregistrations.googleapis.com", "updates.push.services.mozilla.com",
      "push.services.mozilla.com", "web.push.apple.com"].includes(h) ||
      (h.endsWith(".push.apple.com") && h.length<100);
  } catch { return false; }
}
async function verifyPhone(body: Record<string,unknown>, actionMessage: string) {
  const id = String(body.device_id || "");
  const stamp = Number(body.timestamp);
  const sig = String(body.signature || "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !Number.isFinite(stamp) || Math.abs(Date.now()-stamp)>60000 || !sig || sig.length>300) {
    throw Error("La confirmación del móvil ha caducado. Actualiza la pantalla.");
  }
  const device = await backend("device", {device_id: id});
  if (!device?.user_id || !device?.public_key || !await memberAllowed(device.user_id)) throw Error("Dispositivo no reconocido.");
  const pub = device.public_key;
  if (pub.kty!=="EC" || pub.crv!=="P-256" || typeof pub.x!=="string" || typeof pub.y!=="string") throw Error("Clave inválida.");
  const key = await crypto.subtle.importKey("jwk", pub, {name:"ECDSA",namedCurve:"P-256"}, false, ["verify"]);
  const signed = actionMessage + "|" + stamp;
  const valid = await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},key,decode(sig),enc.encode(signed));
  if (!valid) throw Error("La firma del móvil no es válida.");
  return id;
}
async function notifyPhones(userId: string, requestId: string): Promise<boolean> {
  const config = await backend("config");
  if (!config?.public || !config?.private || !config?.subject) return false;
  webpush.setVapidDetails(config.subject,config.public,config.private);
  // "pushes" is queried after authenticating an enrolled, trusted device.
  // During initial login no trusted device ID is supplied, so use the
  // registered device lookup via the secured backend's "notify" action.
  const subs = await backend("notify",{user_id:userId});
  let delivered=false;
  for (const row of subs || []) {
    if (!validSubscription(row.subscription)) continue;
    try {
      await webpush.sendNotification(row.subscription, JSON.stringify({kind:"admin-mobile-approval"}), {TTL:180,urgency:"high"});
      delivered=true;
    } catch (err) { console.warn("Push could not be delivered", err instanceof Error ? err.name : "error"); }
  }
  return delivered;
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") || "";
  if (!ORIGINS.includes(origin)) return Response.json({error:"Origen no autorizado"},{status:403});
  if (request.method==="OPTIONS") return new Response(null,{status:204,headers:{
    "Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"authorization,apikey,content-type",
    "Access-Control-Allow-Methods":"POST,OPTIONS","Vary":"Origin",
  }});
  if (request.method!=="POST") return reply({error:"Método no permitido"},405,origin);
  if (Number(request.headers.get("content-length") || 0)>10000) return reply({error:"Solicitud demasiado grande"},413,origin);
  try {
    const body = await request.json() as Record<string,unknown>;
    const action = String(body.action || "");
    if (["status","request","enroll","config"].includes(action)) {
      const user = await passwordSession(request);
      if (action==="status") return reply(await backend("status",user),200,origin);
      if (action==="config") {
        const config=await backend("config");
        return reply({public_key:config.public||null,available:!!config.public},200,origin);
      }
      if (action==="request") {
        const label=String(body.client_label||"Navegador").replace(/[^a-zA-Z0-9 À-ÿ.,()_-]/g,"").slice(0,90);
        const result=await backend("request",{...user,client_label:label});
        if (result.new && result.request_id) {
          const delivered=await notifyPhones(user.user_id,result.request_id);
          return reply({...result,notification_sent:delivered},200,origin);
        }
        return reply(result,200,origin);
      }
      const jwk=body.public_key;
      if (!jwk || typeof jwk!=="object" || (jwk as Record<string,unknown>).kty!=="EC" ||
          (jwk as Record<string,unknown>).crv!=="P-256" ||
          typeof (jwk as Record<string,unknown>).x!=="string" ||
          typeof (jwk as Record<string,unknown>).y!=="string")
        throw Error("La clave del dispositivo no es válida.");
      // Validate the actual key material, not just the JWK labels.
      await crypto.subtle.importKey("jwk",jwk as JsonWebKey,{name:"ECDSA",namedCurve:"P-256"},false,["verify"]);
      const subscription=validSubscription(body.push_subscription) ? body.push_subscription : null;
      const deviceId=String(body.device_id||"");
      if(!/^[0-9a-f-]{36}$/i.test(deviceId)) throw Error("Dispositivo no válido.");
      const result=await backend("enroll",{...user,device_id:deviceId,public_key:jwk,push_subscription:subscription,label:String(body.label||"Móvil de confianza")});
      return reply(result,200,origin);
    }
    if (action==="pending") {
      const deviceId=await verifyPhone(body,"pending");
      return reply({requests:await backend("pending",{device_id:deviceId})},200,origin);
    }
    if (action==="approve" || action==="deny") {
      const requestId=String(body.request_id||"");
      if (!/^[0-9a-f-]{36}$/i.test(requestId)) throw Error("Solicitud no válida.");
      const decision=action==="approve"?"approved":"denied";
      const deviceId=await verifyPhone(body,"decide|"+requestId+"|"+decision);
      return reply(await backend("approve",{device_id:deviceId,request_id:requestId,decision}),200,origin);
    }
    if (action==="revoke") {
      const deviceId=await verifyPhone(body,"revoke");
      return reply(await backend("revoke",{device_id:deviceId}),200,origin);
    }
    return reply({error:"Operación no admitida"},400,origin);
  } catch (error) {
    // Do not expose tokens, private keys, internal DB values or stack traces.
    const message=error instanceof Error?error.message:"Error de verificación";
    return reply({error:message.slice(0,180)},400,origin);
  }
});
