/**
 * Web Push exclusivo del titular de la consulta.
 * Los mensajes al sistema operativo no contienen datos clínicos, nombres ni identificadores.
 * Se envían "push" sin carga útil; la notificación se construye localmente en /sw.js.
 */
const API = "https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1/";
const OWNER_ID = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const ENC = new TextEncoder();
const TYPES = ["web_booking", "exercise_shared"] as const;
type EventKind = typeof TYPES[number];
type SubscriptionRow = { id: string; endpoint: string; created_at: string; disabled_at?: string | null };
type AdminEvent = { kind: EventKind; eventId: string; at: string };

export interface AdminPushEnv {
  SUPABASE_SERVICE_ROLE_KEY?: string;
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_JWK?: string;
}
function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: {
    "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  } });
}
function originMatches(request: Request): boolean {
  const origin = request.headers.get("Origin");
  return !origin || origin === new URL(request.url).origin;
}
/** Never fetch endpoints submitted by the client outside known browser push providers. */
function validEndpoint(endpoint: unknown): endpoint is string {
  if (typeof endpoint !== "string" || endpoint.length < 30 || endpoint.length > 2048) return false;
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" || url.port || url.username || url.password || url.hash) return false;
    const hostname = url.hostname.toLowerCase();
    return [
      "fcm.googleapis.com", "fcmregistrations.googleapis.com",
      "updates.push.services.mozilla.com", "push.services.mozilla.com",
      "web.push.apple.com",
    ].includes(hostname) || (hostname.endsWith(".push.apple.com") && hostname.length < 100);
  } catch { return false; }
}
function svcHeaders(env: AdminPushEnv, extra: Record<string, string> = {}): Record<string,string> {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY || "",
    Authorization: "Bearer " + (env.SUPABASE_SERVICE_ROLE_KEY || ""),
    "Content-Type": "application/json",
    ...extra,
  };
}
async function db(env: AdminPushEnv, path: string, init: RequestInit = {}): Promise<Response> {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("push backend unavailable");
  return fetch(API + path, {
    ...init,
    headers: { ...svcHeaders(env), ...(init.headers as Record<string,string> || {}) },
    cache: "no-store",
  });
}
function base64url(input: Uint8Array | string): string {
  const data = typeof input === "string" ? ENC.encode(input) : input;
  let binary = "";
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
async function vapidToken(endpoint: string, privateJwk: string): Promise<string> {
  const jwk = JSON.parse(privateJwk) as JsonWebKey;
  if (jwk.kty !== "EC" || jwk.crv !== "P-256" || !jwk.d || !jwk.x || !jwk.y) throw new Error("Invalid VAPID private key");
  const key = await crypto.subtle.importKey("jwk", jwk, { name:"ECDSA", namedCurve:"P-256" }, false, ["sign"]);
  const header = base64url(JSON.stringify({ alg:"ES256", typ:"JWT" }));
  const payload = base64url(JSON.stringify({
    aud: new URL(endpoint).origin, exp: Math.floor(Date.now()/1000) + 45 * 60,
    sub: "https://carolinasanchezgirona.com",
  }));
  const body = header + "." + payload;
  const signature = new Uint8Array(await crypto.subtle.sign({ name:"ECDSA", hash:"SHA-256" }, key, ENC.encode(body)));
  return body + "." + base64url(signature);
}
async function sendEmptyPush(endpoint: string, env: AdminPushEnv): Promise<{ok:boolean;gone:boolean}> {
  if (!validEndpoint(endpoint) || !env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_JWK) return {ok:false,gone:false};
  const signed = await vapidToken(endpoint, env.VAPID_PRIVATE_JWK);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: "vapid t=" + signed + ", k=" + env.VAPID_PUBLIC_KEY,
      TTL: "3600",
      Urgency: "normal",
      "Content-Length": "0",
    },
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });
  return { ok: response.status >= 200 && response.status < 300, gone: [404,410].includes(response.status) };
}
async function markDisabled(env: AdminPushEnv, endpoint: string): Promise<void> {
  const r = await db(env, "admin_push_subscriptions?endpoint=eq." + encodeURIComponent(endpoint), {
    method: "PATCH", headers: { Prefer:"return=minimal" }, body: JSON.stringify({disabled_at: new Date().toISOString()}),
  });
  if (!r.ok) throw new Error("Cannot disable subscription");
}
export async function adminPushRequest(
  request: Request, env: AdminPushEnv, verifyOwner: (request: Request)=>Promise<boolean>,
): Promise<Response> {
  if (!originMatches(request)) return json({error:"Origen no permitido."},403);
  if (!await verifyOwner(request)) return json({error:"Sesión no autorizada."},401);
  if (request.method === "GET") return json({
    enabled: Boolean(env.SUPABASE_SERVICE_ROLE_KEY && env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_JWK),
    publicKey: env.VAPID_PUBLIC_KEY || null,
  });
  if (request.method !== "POST") return json({error:"Método no permitido."},405);
  if (!env.SUPABASE_SERVICE_ROLE_KEY || !env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_JWK) return json({error:"Avisos push sin configurar."},503);
  if (Number(request.headers.get("content-length") || 0) > 4096) return json({error:"Solicitud demasiado extensa."},413);
  let payload: Record<string,unknown>;
  try { payload = await request.json() as Record<string,unknown>; }
  catch { return json({error:"Solicitud no válida."},400); }
  const action = payload.action;
  const endpoint = payload.endpoint;
  if (!["subscribe","unsubscribe","test"].includes(String(action)) || !validEndpoint(endpoint)) return json({error:"Suscripción no válida."},400);
  if (action === "subscribe") {
    const r = await db(env, "admin_push_subscriptions?on_conflict=endpoint", {
      method: "POST", headers: {Prefer:"resolution=merge-duplicates,return=minimal"},
      body: JSON.stringify({owner_id:OWNER_ID,endpoint,disabled_at:null,created_at:new Date().toISOString()}),
    });
    if (!r.ok) return json({error:"No se ha podido guardar el dispositivo."},502);
    return json({ok:true});
  }
  if (action === "unsubscribe") {
    await markDisabled(env, endpoint);
    return json({ok:true});
  }
  const r = await db(env, "admin_push_subscriptions?select=id,endpoint,disabled_at&endpoint=eq." + encodeURIComponent(endpoint) + "&limit=1");
  if (!r.ok) return json({error:"No se ha podido verificar el dispositivo."},502);
  const rows = await r.json() as SubscriptionRow[];
  if (!rows[0] || rows[0].disabled_at) return json({error:"Activa primero los avisos en este dispositivo."},409);
  try {
    const delivered = await sendEmptyPush(endpoint, env);
    if (delivered.gone) await markDisabled(env, endpoint);
    return delivered.ok ? json({ok:true}) : json({error:"El proveedor de avisos ha rechazado el envío."},502);
  } catch { return json({error:"No se ha podido enviar la prueba."},502); }
}
async function getEvents(env: AdminPushEnv, since: string): Promise<AdminEvent[]> {
  const bookings = "appointment_bookings?select=id,created_at&created_by_admin=is.false&status=not.in.(cancelled,canceled)&created_at=gte." + encodeURIComponent(since) + "&order=created_at.desc&limit=50";
  const exercises = "clinical_exercise_assignments?select=id,patient_response_shared_at&patient_response_shared_at=gte." + encodeURIComponent(since) + "&order=patient_response_shared_at.desc&limit=50";
  const responses = await Promise.all([db(env, bookings), db(env, exercises)]);
  if (responses.some(r=>!r.ok)) throw new Error("Push event sources unavailable");
  const b = await responses[0].json() as Array<{id:string;created_at:string}>;
  const e = await responses[1].json() as Array<{id:string;patient_response_shared_at:string}>;
  return [
    ...b.map(row=>({kind:"web_booking" as const,eventId:row.id,at:row.created_at})),
    ...e.map(row=>({kind:"exercise_shared" as const,eventId:row.id + ":" + row.patient_response_shared_at,at:row.patient_response_shared_at})),
  ].filter(x=>Date.parse(x.at)>0);
}
/**
 * Trigger cron; only pushes events from the last 25 minutes AND after the browser
 * subscription was created. Avoid sending old notices on initial activation.
 * Deduplication is durable per endpoint/event; failures do not reveal user information.
 */
export async function runAdminPushCron(env: AdminPushEnv): Promise<void> {
  if (!env.SUPABASE_SERVICE_ROLE_KEY || !env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_JWK) return;
  const since = new Date(Date.now()-25*60000).toISOString();
  try {
    const r=await db(env,"admin_push_subscriptions?select=id,endpoint,created_at,disabled_at&disabled_at=is.null&limit=20");
    if (!r.ok) throw new Error("Subscription query failed");
    const subs=await r.json() as SubscriptionRow[];
    if (!subs.length) return;
    const events=await getEvents(env,since);
    for (const sub of subs) {
      if (!validEndpoint(sub.endpoint)) continue;
      for (const ev of events.slice(0,15)) {
        if (Date.parse(ev.at) <= Date.parse(sub.created_at)) continue;
        const claimed=await db(env,"admin_push_deliveries?on_conflict=subscription_id,event_type,event_id",{
          method:"POST",headers:{Prefer:"resolution=ignore-duplicates,return=representation"},
          body:JSON.stringify({subscription_id:sub.id,event_type:ev.kind,event_id:ev.eventId}),
        });
        if (!claimed.ok) throw new Error("Push delivery reservation failed");
        const reserved=await claimed.json() as unknown[];
        if (!reserved.length) continue; // A previous cron already sent this.
        try {
          const sent=await sendEmptyPush(sub.endpoint,env);
          if (sent.gone) { await markDisabled(env,sub.endpoint); break; }
          if (!sent.ok) console.warn("Push provider rejected event",ev.kind);
          else {
            await db(env,"admin_push_subscriptions?id=eq."+encodeURIComponent(sub.id),{
              method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({last_sent_at:new Date().toISOString()}),
            });
          }
        } catch (error) {
          console.warn("Push attempt failed",error instanceof Error?error.name:"Unknown");
        }
      }
    }
  } catch (error) {
    console.error("Admin push cron failed",error instanceof Error?error.name:"Unknown");
  }
}
