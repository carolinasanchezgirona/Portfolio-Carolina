import { containsDirectPatientIdentifiers, CLINICAL_IDENTIFIERS_ERROR } from "./clinical-privacy";

interface Env {
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_WEBHOOK_SECRET_TEST?: string;
  STRIPE_SECRET_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  OPENAI_API_KEY?: string;
  OPENAI_TEXT_MODEL?: string;
  OPENAI_CLINICAL_MODEL?: string;
  OPENAI_IMAGE_MODEL?: string;
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const encoder = new TextEncoder();

const RESOURCE_SUPABASE = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const RESOURCE_PUBLISHABLE = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";

function resourceJson(payload: unknown, status = 200): Response {
  return Response.json(payload, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

function serviceHeaders(env: Env, extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY || "",
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function sha256Hex(value: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
  return Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join("");
}

function randomToken(bytes = 32): string {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return Array.from(data, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function fetchPublishedResource(resourceId: string): Promise<Record<string, unknown> | null> {
  const select = "id,title,slug,price_cents,status,file_path,format_label";
  const url = `${RESOURCE_SUPABASE}/rest/v1/digital_resources?select=${encodeURIComponent(select)}&id=eq.${encodeURIComponent(resourceId)}&status=eq.published&limit=1`;
  const response = await fetch(url, { headers: { apikey: RESOURCE_PUBLISHABLE }, cache: "no-store" });
  if (!response.ok) return null;
  const rows = await response.json() as Record<string, unknown>[];
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function stripeRequest(env: Env, path: string, init: RequestInit = {}): Promise<Response> {
  if (!env.STRIPE_SECRET_KEY) return new Response("Stripe not configured", { status: 503 });
  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${env.STRIPE_SECRET_KEY}`);
  return fetch(`https://api.stripe.com/v1${path}`, { ...init, headers });
}

async function upsertResourceOrder(env: Env, session: Record<string, unknown>): Promise<void> {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");
  const metadata = (session.metadata && typeof session.metadata === "object") ? session.metadata as Record<string, unknown> : {};
  const resourceId = typeof metadata.resource_id === "string" ? metadata.resource_id : "";
  const sessionId = typeof session.id === "string" ? session.id : "";
  if (!resourceId || !sessionId) return;
  const customerDetails = (session.customer_details && typeof session.customer_details === "object") ? session.customer_details as Record<string, unknown> : {};
  const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : null;
  const amount = Number(session.amount_total || 0);
  const payload = {
    resource_id: resourceId,
    stripe_session_id: sessionId,
    stripe_payment_intent_id: paymentIntent,
    customer_email: typeof customerDetails.email === "string" ? customerDetails.email : null,
    amount_total: Number.isFinite(amount) ? Math.round(amount) : 0,
    currency: typeof session.currency === "string" ? session.currency : "eur",
    payment_status: typeof session.payment_status === "string" ? session.payment_status : "unpaid",
    livemode: Boolean(session.livemode),
    paid_at: session.payment_status === "paid" || session.payment_status === "no_payment_required" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
  const response = await fetch(`${RESOURCE_SUPABASE}/rest/v1/digital_resource_orders?on_conflict=stripe_session_id`, {
    method: "POST",
    headers: serviceHeaders(env, { Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Could not persist resource order");
}

async function fetchStripeSession(env: Env, sessionId: string): Promise<Record<string, unknown> | null> {
  if (!/^cs_(test|live)_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  const response = await stripeRequest(env, `/checkout/sessions/${encodeURIComponent(sessionId)}`, { method: "GET" });
  if (!response.ok) return null;
  return await response.json() as Record<string, unknown>;
}

async function handleResourceCheckout(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return resourceJson({ error: "Método no permitido." }, 405);
  if (!env.STRIPE_SECRET_KEY) return resourceJson({ error: "Stripe todavía no está configurado en el servidor." }, 503);
  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return resourceJson({ error: "Solicitud no válida." }, 400); }
  const resourceId = typeof data.resourceId === "string" ? data.resourceId : "";
  const resource = resourceId ? await fetchPublishedResource(resourceId) : null;
  if (!resource || !resource.file_path) return resourceJson({ error: "El recurso no está disponible para compra." }, 404);
  const amount = Number(resource.price_cents || 0);
  if (!Number.isInteger(amount) || amount < 50) return resourceJson({ error: "El precio del recurso no es válido." }, 400);

  const origin = new URL(request.url).origin;
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/recursos/gracias/?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/recursos/`);
  params.set("customer_creation", "always");
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "eur");
  params.set("line_items[0][price_data][unit_amount]", String(amount));
  params.set("line_items[0][price_data][product_data][name]", String(resource.title || "Recurso digital").slice(0, 120));
  params.set("metadata[resource_id]", resourceId);
  params.set("payment_intent_data[metadata][resource_id]", resourceId);

  const response = await stripeRequest(env, "/checkout/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const body = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok || typeof body.url !== "string") return resourceJson({ error: "No se ha podido iniciar el pago." }, 502);
  return resourceJson({ url: body.url });
}

async function handleResourceAccess(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return resourceJson({ error: "Método no permitido." }, 405);
  if (!env.STRIPE_SECRET_KEY || !env.SUPABASE_SERVICE_ROLE_KEY) return resourceJson({ error: "La entrega segura todavía no está configurada." }, 503);
  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return resourceJson({ error: "Solicitud no válida." }, 400); }
  const sessionId = typeof data.sessionId === "string" ? data.sessionId : "";
  const stripeSession = await fetchStripeSession(env, sessionId);
  if (!stripeSession) return resourceJson({ error: "No se ha podido verificar la compra." }, 404);
  if (!["paid", "no_payment_required"].includes(String(stripeSession.payment_status || ""))) {
    return resourceJson({ error: "El pago todavía no figura como completado." }, 409);
  }
  await upsertResourceOrder(env, stripeSession);
  const rawToken = randomToken();
  const tokenHash = await sha256Hex(rawToken);
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const response = await fetch(`${RESOURCE_SUPABASE}/rest/v1/digital_resource_orders?stripe_session_id=eq.${encodeURIComponent(sessionId)}`, {
    method: "PATCH",
    headers: serviceHeaders(env, { Prefer: "return=representation" }),
    body: JSON.stringify({ download_token_hash: tokenHash, download_expires_at: expires, updated_at: new Date().toISOString() }),
  });
  const rows = await response.json().catch(() => []) as Record<string, unknown>[];
  if (!response.ok || !Array.isArray(rows) || !rows[0]) return resourceJson({ error: "No se ha podido preparar la descarga." }, 502);
  return resourceJson({ download_url: `/api/resources/download?token=${rawToken}`, expires_at: expires });
}

function storageObjectPath(path: string): string {
  return path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}

async function handleResourceDownload(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return new Response("Method Not Allowed", { status: 405 });
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return new Response("Delivery not configured", { status: 503 });
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!/^[a-f0-9]{64}$/.test(token)) return new Response("Invalid download link", { status: 400 });
  const tokenHash = await sha256Hex(token);
  const orderResponse = await fetch(`${RESOURCE_SUPABASE}/rest/v1/digital_resource_orders?select=id,resource_id,payment_status,download_expires_at,download_count&download_token_hash=eq.${tokenHash}&limit=1`, {
    headers: serviceHeaders(env),
    cache: "no-store",
  });
  const orders = await orderResponse.json().catch(() => []) as Record<string, unknown>[];
  const order = Array.isArray(orders) ? orders[0] : null;
  if (!order || !["paid", "no_payment_required"].includes(String(order.payment_status || ""))) return new Response("Download not authorized", { status: 403 });
  const expires = Date.parse(String(order.download_expires_at || ""));
  if (!Number.isFinite(expires) || expires < Date.now()) return new Response("Download link expired", { status: 410 });

  const resource = await fetchPublishedResource(String(order.resource_id || ""));
  if (!resource?.file_path) return new Response("File unavailable", { status: 404 });
  const fileResponse = await fetch(`${RESOURCE_SUPABASE}/storage/v1/object/authenticated/resource-files/${storageObjectPath(String(resource.file_path))}`, {
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
    cache: "no-store",
  });
  if (!fileResponse.ok) return new Response("File unavailable", { status: 404 });

  await fetch(`${RESOURCE_SUPABASE}/rest/v1/digital_resource_orders?id=eq.${encodeURIComponent(String(order.id))}`, {
    method: "PATCH",
    headers: serviceHeaders(env, { Prefer: "return=minimal" }),
    body: JSON.stringify({ download_count: Number(order.download_count || 0) + 1, updated_at: new Date().toISOString() }),
  }).catch(() => null);

  const ext = String(resource.file_path).split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "pdf";
  const base = String(resource.slug || resource.title || "recurso").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "recurso";
  const headers = new Headers(fileResponse.headers);
  headers.set("Cache-Control", "private, no-store");
  headers.set("Content-Disposition", `attachment; filename="${base}.${ext}"`);
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(fileResponse.body, { status: 200, headers });
}


const PATIENT_PORTAL_COOKIE = "__Host-mi_espacio_session";
const PATIENT_PORTAL_AUTH_FUNCTION = RESOURCE_SUPABASE + "/functions/v1/patient-portal-auth";

function patientPortalJson(payload: unknown, status = 200, extraHeaders: Record<string,string> = {}): Response {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "X-Frame-Options": "DENY",
      "Content-Security-Policy": "base-uri 'self'; object-src 'none'; frame-ancestors 'none'",
      "Strict-Transport-Security": "max-age=31536000",
      ...extraHeaders,
    },
  });
}

function cookieValue(request: Request, name: string): string {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return "";
}

function patientPortalCookie(token: string, maxAge: number): string {
  return `${PATIENT_PORTAL_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

/** Require a same-origin browser request for cookie-based state changes (CSRF defense). */
function patientPortalSameOrigin(request: Request): boolean {
  const expectedOrigin = new URL(request.url).origin;
  const origin = request.headers.get("Origin");
  if (origin) return origin === expectedOrigin;
  if (request.headers.get("Sec-Fetch-Site") === "same-origin") return true;
  const referer = request.headers.get("Referer");
  if (!referer) return false;
  try { return new URL(referer).origin === expectedOrigin; }
  catch { return false; }
}

async function handlePatientPortalAuth(request: Request, env: Env, action: "password-link" | "password-set" | "password-login"): Promise<Response> {
  if (request.method !== "POST") return patientPortalJson({ error: "Método no permitido." }, 405);
  if (!patientPortalSameOrigin(request)) return patientPortalJson({ error: "Origen no permitido." }, 403);
  if (Number(request.headers.get("content-length") || "0") > 4096) return patientPortalJson({ error: "Solicitud demasiado extensa." }, 413);
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return patientPortalJson({ error: "Solicitud no válida." }, 400); }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  const password = typeof body.password === "string" && body.password.length <= 128 ? body.password : "";
  const tokenHash = typeof body.token_hash === "string" ? body.token_hash.trim().slice(0, 256) : "";
  const flow = body.flow === "invite" || body.flow === "recovery" ? body.flow : "";
  const purpose = body.purpose === "reset" ? "reset" : "setup";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return patientPortalJson({ error: "Introduce un correo válido." }, 400);
  }

  if (!env.SUPABASE_SERVICE_ROLE_KEY) return patientPortalJson({ error: "Servicio temporalmente no disponible." }, 503);
  const response = await fetch(PATIENT_PORTAL_AUTH_FUNCTION, {
    method: "POST",
    headers: serviceHeaders(env),
    body: JSON.stringify({ action, email, ...(action === "password-link" ? { purpose } : {}), ...(action === "password-set" ? { token_hash: tokenHash, flow, password } : {}), ...(action === "password-login" ? { password } : {}) }),
  });
  const result = await response.json().catch(() => ({})) as Record<string, unknown>;

  if (!response.ok) {
    const message = typeof result.error === "string" ? result.error : "No se ha podido completar el acceso.";
    return patientPortalJson({ error: message }, response.status);
  }

  if (action === "password-login") {
    const token = typeof result.session_token === "string" ? result.session_token : "";
    if (!/^[A-Za-z0-9_-]{40,}$/.test(token)) return patientPortalJson({ error: "No se ha podido iniciar la sesión." }, 502);
    return patientPortalJson(
      { ok: true, expires_at: result.expires_at || null },
      200,
      { "Set-Cookie": patientPortalCookie(token, 8 * 60 * 60) },
    );
  }

  return patientPortalJson({
    ok: true,
    message: typeof result.message === "string"
      ? result.message
      : "Si el correo corresponde a una cuenta con acceso, recibirás un enlace seguro en unos minutos.",
  });
}

type PatientPortalSession = {
  id: string;
  patient_id: string;
  expires_at: string;
};

async function patientPortalSession(request: Request, env: Env): Promise<PatientPortalSession | null> {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const token = cookieValue(request, PATIENT_PORTAL_COOKIE);
  if (!/^pwd2_[A-Za-z0-9_-]{40,}$/.test(token)) return null;
  const hash = await sha256Hex(token);
  const response = await fetch(
    RESOURCE_SUPABASE + "/rest/v1/patient_portal_sessions?select=id,patient_id,expires_at&token_hash=eq." +
      encodeURIComponent(hash) + "&revoked_at=is.null&expires_at=gt." + encodeURIComponent(new Date().toISOString()) + "&limit=1",
    { headers: serviceHeaders(env), cache: "no-store" },
  );
  const rows = await response.json().catch(() => []) as Record<string, unknown>[];
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!response.ok || !row?.id || !row?.patient_id || !row?.expires_at) return null;

  fetch(RESOURCE_SUPABASE + "/rest/v1/patient_portal_sessions?id=eq." + encodeURIComponent(String(row.id)), {
    method: "PATCH",
    headers: serviceHeaders(env, { Prefer: "return=minimal" }),
    body: JSON.stringify({ last_seen_at: new Date().toISOString() }),
  }).catch(() => null);

  return { id: String(row.id), patient_id: String(row.patient_id), expires_at: String(row.expires_at) };
}

function firstName(value: unknown): string {
  const clean = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  return clean.split(" ")[0]?.slice(0, 60) || "";
}

async function handlePatientPortalSession(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return patientPortalJson({ error: "Método no permitido." }, 405);
  const session = await patientPortalSession(request, env);
  if (!session) {
    return patientPortalJson(
      { authenticated: false },
      401,
      { "Set-Cookie": patientPortalCookie("", 0) },
    );
  }

  const patientResponse = await fetch(
    RESOURCE_SUPABASE + "/rest/v1/clinical_patients?select=id,full_name,status&id=eq." + encodeURIComponent(session.patient_id) + "&status=neq.archived&limit=1",
    { headers: serviceHeaders(env), cache: "no-store" },
  );
  const patientRows = await patientResponse.json().catch(() => []) as Record<string, unknown>[];
  const patient = Array.isArray(patientRows) ? patientRows[0] : null;
  if (!patient) return patientPortalJson({ authenticated: false }, 401, { "Set-Cookie": patientPortalCookie("", 0) });

  const now = new Date().toISOString();
  const [appointmentResponse, materialsResponse] = await Promise.all([
    fetch(
      RESOURCE_SUPABASE + "/rest/v1/appointment_bookings?select=id,starts_at,ends_at,status,service_code&clinical_patient_id=eq." +
        encodeURIComponent(session.patient_id) + "&starts_at=gte." + encodeURIComponent(now) +
        "&status=in.(confirmed,pending)&order=starts_at.asc&limit=1",
      { headers: serviceHeaders(env), cache: "no-store" },
    ),
    fetch(
      RESOURCE_SUPABASE + "/rest/v1/clinical_exercise_assignments?select=id,title,status,patient_document,review_due_at,patient_state,patient_response,patient_response_status,patient_response_updated_at,patient_response_shared_at,sent_at,created_at&patient_id=eq." +
        encodeURIComponent(session.patient_id) + "&revoked_at=is.null&status=in.(sent,assigned,reviewed)&order=sent_at.desc.nullslast,created_at.desc&limit=100",
      { headers: serviceHeaders(env), cache: "no-store" },
    ),
  ]);

  const appointments = appointmentResponse.ok ? await appointmentResponse.json().catch(() => []) : [];
  const materials = materialsResponse.ok ? await materialsResponse.json().catch(() => []) : [];

  return patientPortalJson({
    authenticated: true,
    patient: { first_name: firstName(patient.full_name) },
    session_expires_at: session.expires_at,
    next_appointment: Array.isArray(appointments) ? appointments[0] || null : null,
    materials: Array.isArray(materials) ? materials : [],
  });
}

async function handlePatientPortalResponse(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return patientPortalJson({ error: "Método no permitido." }, 405);
  if (!patientPortalSameOrigin(request)) return patientPortalJson({ error: "Origen no permitido." }, 403);
  if (Number(request.headers.get("content-length") || "0") > 65536) return patientPortalJson({ error: "Solicitud demasiado extensa." }, 413);
  const session = await patientPortalSession(request, env);
  if (!session) return patientPortalJson({ error: "Tu sesión ha caducado. Vuelve a entrar." }, 401, { "Set-Cookie": patientPortalCookie("", 0) });

  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return patientPortalJson({ error: "Solicitud no válida." }, 400); }

  const materialId = typeof body.material_id === "string" ? body.material_id : "";
  const action = body.action === "share" ? "share" : body.action === "draft" ? "draft" : "";
  if (!/^[0-9a-f-]{36}$/i.test(materialId) || !action) return patientPortalJson({ error: "Solicitud no válida." }, 400);

  const materialResponse = await fetch(
    RESOURCE_SUPABASE + "/rest/v1/clinical_exercise_assignments?select=id,content,patient_document&patient_id=eq." +
      encodeURIComponent(session.patient_id) + "&id=eq." + encodeURIComponent(materialId) + "&revoked_at=is.null&status=in.(sent,assigned,reviewed)&limit=1",
    { headers: serviceHeaders(env), cache: "no-store" },
  );
  const materialRows = await materialResponse.json().catch(() => []) as Record<string, unknown>[];
  const material = Array.isArray(materialRows) ? materialRows[0] : null;
  if (!material) return patientPortalJson({ error: "El material no está disponible." }, 404);

  const document = material.patient_document && typeof material.patient_document === "object" && !Array.isArray(material.patient_document)
    ? material.patient_document as Record<string, unknown>
    : {};
  if (document.material_type === "psychoeducation") return patientPortalJson({ error: "Este material no requiere respuestas." }, 400);

  const record = typeof body.record === "string" ? body.record.slice(0, 12000) : "";
  const answersInput = Array.isArray(body.answers) ? body.answers : [];
  const questions = Array.isArray(document.session_questions) ? document.session_questions.slice(0, 6) : [];
  const answers = Array.from({ length: questions.length }, (_, index) =>
    typeof answersInput[index] === "string" ? String(answersInput[index]).slice(0, 6000) : ""
  );
  const savedAt = new Date().toISOString();

  const update = await fetch(
    RESOURCE_SUPABASE + "/rest/v1/clinical_exercise_assignments?id=eq." + encodeURIComponent(materialId) +
      "&patient_id=eq." + encodeURIComponent(session.patient_id) +
      "&revoked_at=is.null&status=in.(sent,assigned,reviewed)&select=id",
    {
      method: "PATCH",
      headers: serviceHeaders(env, { Prefer: "return=representation" }),
      body: JSON.stringify({
        patient_response: { version: 1, record, answers },
        patient_response_status: action === "share" ? "shared" : "draft",
        patient_response_updated_at: savedAt,
        patient_response_shared_at: action === "share" ? savedAt : null,
        updated_at: savedAt,
      }),
    },
  );
  if (!update.ok) return patientPortalJson({ error: "No se ha podido guardar el ejercicio." }, 502);
  const updated = await update.json().catch(() => []) as unknown;
  if (!Array.isArray(updated) || updated.length !== 1) {
    return patientPortalJson({ error: "El material ya no está disponible." }, 404);
  }
  return patientPortalJson({ ok: true, status: action === "share" ? "shared" : "draft", saved_at: savedAt });
}

async function handlePatientPortalLogout(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return patientPortalJson({ error: "Método no permitido." }, 405);
  if (!patientPortalSameOrigin(request)) return patientPortalJson({ error: "Origen no permitido." }, 403);
  const raw = cookieValue(request, PATIENT_PORTAL_COOKIE);
  if (env.SUPABASE_SERVICE_ROLE_KEY && /^[A-Za-z0-9_-]{40,}$/.test(raw)) {
    const hash = await sha256Hex(raw);
    await fetch(RESOURCE_SUPABASE + "/rest/v1/patient_portal_sessions?token_hash=eq." + encodeURIComponent(hash), {
      method: "PATCH",
      headers: serviceHeaders(env, { Prefer: "return=minimal" }),
      body: JSON.stringify({ revoked_at: new Date().toISOString() }),
    }).catch(() => null);
  }
  return patientPortalJson({ ok: true }, 200, { "Set-Cookie": patientPortalCookie("", 0) });
}

async function handleQuestionDraft(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return editorialJson({ error: "Método no permitido." }, 405);
  if (!await verifyEditorialOwner(request)) return editorialJson({ error: "Sesión no autorizada." }, 401);
  if (!env.OPENAI_API_KEY) return editorialJson({ error: "La IA editorial no está configurada." }, 503);
  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return editorialJson({ error: "Solicitud no válida." }, 400); }
  let question = editorialText(data.question, 6000);
  if (question.length < 8) return editorialJson({ error: "La pregunta es demasiado breve." }, 400);
  question = question
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[correo omitido]")
    .replace(/(?:\+34\s*)?(?:\d[\s.-]*){9}/g, "[teléfono omitido]");
  const system = [
    "Eres asistente editorial de una psicóloga sanitaria y neuropsicóloga en España.",
    "Tu función es proponer un borrador divulgativo para revisión profesional, nunca publicar ni diagnosticar.",
    "Anonimiza la pregunta: elimina nombres, lugares concretos, empresas, centros, fechas exactas y detalles que puedan identificar a una persona.",
    "No inventes datos que no estén en la consulta. No conviertas síntomas en diagnósticos.",
    "La respuesta debe ser clara, prudente, útil y compatible con práctica psicológica responsable.",
    "Si detectas riesgo agudo, violencia, abuso, autolesión o urgencia médica, indícalo en review_note y evita una respuesta rutinaria.",
    "Devuelve SOLO JSON: {question_public:string,answer:string,category:string,review_note:string}.",
    "category debe ser uno de: psicologia, ansiedad-animo, relaciones-duelo, neuropsicologia, memoria-deterioro, familiares-cuidadores, otra."
  ].join("\n");
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OPENAI_TEXT_MODEL || env.OPENAI_CLINICAL_MODEL || "gpt-5.6-sol",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system }, { role: "user", content: question }],
      }),
    });
    const body = await response.json() as any;
    if (!response.ok) return editorialJson({ error: "No se ha podido generar la propuesta con IA." }, 502);
    const content = body?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(typeof content === "string" ? content : "{}") as Record<string, unknown>;
    const categories = new Set(["psicologia","ansiedad-animo","relaciones-duelo","neuropsicologia","memoria-deterioro","familiares-cuidadores","otra"]);
    return editorialJson({
      question_public: editorialText(parsed.question_public, 1200),
      answer: editorialText(parsed.answer, 8000),
      category: categories.has(String(parsed.category)) ? String(parsed.category) : "otra",
      review_note: editorialText(parsed.review_note, 1200),
    });
  } catch {
    return editorialJson({ error: "No se ha podido generar la propuesta con IA." }, 502);
  }
}


function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  const parts = signatureHeader.split(",");
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestampPart || signatures.length === 0) return false;

  const timestamp = timestampPart.slice(2);
  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;

  const toleranceSeconds = 300;
  const age = Math.abs(Date.now() / 1000 - timestampNumber);
  if (age > toleranceSeconds) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signedPayload = `${timestamp}.${payload}`;
  const digest = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload)),
  );

  return signatures.some((signature) => {
    try {
      return timingSafeEqual(digest, hexToBytes(signature));
    } catch {
      return false;
    }
  });
}

async function handleStripeWebhook(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing Stripe-Signature header", { status: 400 });
  }

  const body = await request.text();
  const secrets = [env.STRIPE_WEBHOOK_SECRET, env.STRIPE_WEBHOOK_SECRET_TEST].filter(
    (secret): secret is string => Boolean(secret),
  );

  let valid = false;
  for (const secret of secrets) {
    if (await verifyStripeSignature(body, signature, secret)) {
      valid = true;
      break;
    }
  }

  if (!valid) {
    return new Response("Invalid Stripe signature", { status: 400 });
  }

  let event: {
    id?: string;
    type?: string;
    data?: { object?: Record<string, unknown> };
  };

  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.async_payment_failed": {
      const session = event.data?.object ?? {};
      console.log("Stripe event received", {
        eventId: event.id,
        type: event.type,
        sessionId: session.id,
        paymentStatus: session.payment_status,
      });
      if (env.SUPABASE_SERVICE_ROLE_KEY) {
        try { await upsertResourceOrder(env, session); }
        catch (error) { console.error("Could not persist resource order", error instanceof Error ? error.message : "Unknown"); }
      }
      break;
    }
    default:
      console.log("Unhandled Stripe event", {
        eventId: event.id,
        type: event.type,
      });
  }

  return Response.json({ received: true });
}


/** Private, authenticated editorial generation. No clinical/patient records are accepted. */
const EDITORIAL_SUPABASE = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const EDITORIAL_PUBLISHABLE = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const EDITORIAL_OWNER = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";

function editorialJson(payload: unknown, status = 200): Response {
  return Response.json(payload, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

async function verifyEditorialOwner(request: Request): Promise<boolean> {
  const authorization = request.headers.get("authorization") || "";
  if (!/^Bearer [\w.-]+$/.test(authorization)) return false;
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return false;
  try {
    const response = await fetch(EDITORIAL_SUPABASE + "/auth/v1/user", {
      headers: { apikey: EDITORIAL_PUBLISHABLE, Authorization: authorization },
      cache: "no-store",
    });
    if (!response.ok) return false;
    const user = await response.json() as { id?: string };
    return user.id === EDITORIAL_OWNER;
  } catch {
    return false;
  }
}

function editorialText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function editorialRequest(request: Request, env: Env, operation: "content" | "image"): Promise<Response> {
  if (request.method !== "POST") return editorialJson({ error: "Método no permitido." }, 405);
  if (!await verifyEditorialOwner(request)) return editorialJson({ error: "Sesión no autorizada." }, 401);
  if (!env.OPENAI_API_KEY) return editorialJson({ error: "Falta configurar OPENAI_API_KEY en Cloudflare Workers. El editor manual sigue disponible." }, 503);
  if (Number(request.headers.get("content-length") || "0") > 30000) return editorialJson({ error: "Solicitud demasiado extensa." }, 413);
  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return editorialJson({ error: "Solicitud no válida." }, 400); }

  if (operation === "image") {
    const brief = editorialText(data.photo_prompt, 900);
    if (brief.length < 12) return editorialJson({ error: "Indica la escena que debe fotografiarse." }, 400);
    const direction = [
      "Create ONE realistic editorial photograph for a licensed psychologist's Spanish Instagram.",
      "Natural bright light; vivid but tasteful colors, human and contextually relevant imagery.",
      "Editorial contemporary art direction; no sepia, no beige haze, no stock-photo mental-health stereotypes.",
      "No lettering, no words, no letters, no signage, no logos, no borders, no collages, no watermark.",
      "Respect privacy, no identifiable real patients or depictions of actual clinical cases.",
      "Vertical composition with generous negative space for a separate typography overlay.",
      "Scene: " + brief
    ].join(" ");
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: env.OPENAI_IMAGE_MODEL || "gpt-image-1",
          prompt: direction,
          size: "1024x1536",
          quality: "medium",
          output_format: "webp",
          n: 1
        })
      });
      const result = await response.json() as { data?: Array<{ b64_json?: string }>; error?: { message?: string } };
      if (!response.ok || !result.data?.[0]?.b64_json) {
        console.error("Instagram image generation failure", response.status);
        return editorialJson({ error: response.status === 429 ? "Se ha alcanzado el límite de generación. Prueba más tarde." : "No se ha podido crear la fotografía." }, response.status === 429 ? 429 : 502);
      }
      return editorialJson({ data_url: "data:image/webp;base64," + result.data[0].b64_json });
    } catch (error) {
      console.error("Instagram image request failed", error instanceof Error ? error.name : "Unknown");
      return editorialJson({ error: "La generación fotográfica no está disponible en este momento." }, 502);
    }
  }

  const topic = editorialText(data.topic, 200);
  const family = editorialText(data.family, 24);
  const source = editorialText(data.source, 15000);
  const notes = editorialText(data.notes, 1600);
  const slideCount = Number(data.slide_count) === 1 ? 1 : Math.min(7, Math.max(3, Number(data.slide_count) || 5));
  const strategy = (data.strategy && typeof data.strategy === "object" && !Array.isArray(data.strategy)) ? data.strategy as Record<string, unknown> : {};
  const enumValue=(key: string, options: string[], fallback: string) => { const value=editorialText(strategy[key],30);return options.includes(value)?value:fallback; };
  const delivery=enumValue("delivery",["automatico","individual","carrusel","story","reel"],"carrusel");
  const objective=enumValue("objective",["automatico","alcance","interaccion","guardados","web","leads","consulta","recursos"],"automatico");
  const angle=enumValue("angle",["automatico","educativo","cercano","autoridad","preguntas","objeciones","microherramienta","perspectiva","humor"],"automatico");
  const humor=enumValue("humor",["automatico","ninguno","toque","protagonista","ironia","cotidiano"],"automatico");
  const commercial=enumValue("commercial",["suave","equilibrada","directa"],"equilibrada");
  if (topic.length < 4) return editorialJson({ error: "Introduce un tema concreto." }, 400);
  if (!["educativa", "pregunta", "profesional"].includes(family)) return editorialJson({ error: "Familia editorial no reconocida." }, 400);
  const system = [
    "Eres editora científica y directora de arte de Carolina Sánchez, psicóloga y neuropsicóloga en España.",
    "Redacta en español de España, con rigor clínico, originalidad y lenguaje claro.",
    "No hagas diagnósticos categóricos, no prometas eficacia ni inventes testimonios, estudios, citas ni estadísticas.",
    "No infieras problemas psicológicos a partir de frases aisladas. Diferencia psicoeducación de consejo personalizado.",
    "La familia 'pregunta' es una pregunta frecuente ILUSTRATIVA, nunca un mensaje real de una persona.",
    "Si existe texto de artículo úsalo como material de apoyo, no copies bloques literales ni inventes datos que el artículo no sostenga.",
    "En Instagram construye una narrativa: portada atractiva, desarrollo comprensible, ejemplo útil y cierre con CTA no manipulador.",
    "Varía encuadres y composiciones, sin repetir más de dos disposiciones consecutivas; si la familia es pregunta comienza por pregunta y si es profesional comienza por profesional.",
    "Fotografía editorial luminosa, realista, colores vivos y naturalidad; sin filtros sepia ni clichés clínicos.",
    "Devuelve SOLO JSON con forma {concepto:string,titulo:string,subtitulo:string,diapositivas:[{titulo:string,texto:string,composicion:'fotografica'|'tipografica'|'dividida'|'pregunta'|'profesional',foto_prompt:string,alt:string}],pie:string,cta:string,hashtags:string[],referencias:string[],aviso_revision:string}.",
    "Usa 1 a 3 diapositivas con foto_prompt EN INGLÉS y otras diapositivas tipográficas.",
    "No inventes referencias: referencias=[] salvo que el material aportado incluya una identificación bibliográfica completa que puedas transcribir exactamente.",
    "El aviso_revision debe explicar que hay que verificar las afirmaciones clínicas y las referencias antes de compartir.",
    "Incluye exactamente " + slideCount + " diapositivas; cada titulo <= 70 caracteres, texto <= 340 caracteres y alt <= 180.",
    "En diapositivas fotográficas, el prompt debe describir una escena concreta pertinente al tema SIN texto dentro de la foto.",
    "No escribas más de 2000 caracteres en el pie ni más de 6 hashtags.",
    "Objetivo de negocio: "+objective+". Enfoque editorial: "+angle+". Humor: "+humor+". Intensidad comercial: "+commercial+". Formato de entrega: "+delivery+".",
    "El humor es observacional y respetuoso: nunca bromas sobre pacientes ni síntomas graves. En duelo, trauma, crisis o riesgo clínico prioriza tono sensible aunque se solicite humor protagonista.",
    "El CTA debe ajustarse al objetivo, sin presión, falsa urgencia o promesas terapéuticas. Si el objetivo es web, invita a ampliar en un artículo solo si existe una URL real en el material de origen.",
    "Incluye además hook:string (frase inicial breve y original) y guion:string. En reel, guion presenta escenas numeradas con plano sugerido, texto sobreimpreso, voz y duración aproximada; en story, secuencia y propuestas de stickers o interacción; en los otros formatos guion puede ser cadena vacía.",
    "Las diapositivas de story y reel son únicamente un storyboard editable, NO equivalen a un archivo de vídeo ni a imágenes exportadas en formato 9:16."
  ].join("\n");
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
        temperature: 0.65,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify({ tema: topic, familia: family, instrucciones: notes, texto_articulo: source, diapositivas: slideCount, formato:delivery, objetivo:objective, enfoque:angle, humor, intensidad_comercial:commercial }) }
        ]
      })
    });
    const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    if (!response.ok || !result.choices?.[0]?.message?.content) {
      console.error("Instagram content generation failure", response.status);
      return editorialJson({ error: response.status === 429 ? "Límite de generación alcanzado. Prueba más tarde." : "No se ha podido generar el contenido." }, response.status === 429 ? 429 : 502);
    }
    const draft = JSON.parse(result.choices[0].message.content) as Record<string, unknown>;
    const slides = Array.isArray(draft.diapositivas) ? draft.diapositivas.slice(0, slideCount) : [];
    if (slides.length !== slideCount) return editorialJson({ error: "La respuesta estaba incompleta. Vuelve a generar el borrador." }, 502);
    const allowedLayouts = ["fotografica", "tipografica", "dividida", "pregunta", "profesional"];
    const normalized = {
      concepto: editorialText(draft.concepto, 320),
      hook:editorialText(draft.hook,200),
      guion:editorialText(draft.guion,5000),
      titulo: editorialText(draft.titulo, 90) || topic,
      subtitulo: editorialText(draft.subtitulo, 160),
      diapositivas: slides.map((slide: Record<string, unknown>, i: number) => ({
        titulo: editorialText(slide.titulo, 90) || "Diapositiva " + (i + 1),
        texto: editorialText(slide.texto, 480),
        composicion: allowedLayouts.includes(String(slide.composicion)) ? slide.composicion : "tipografica",
        foto_prompt: editorialText(slide.foto_prompt, 900),
        alt: editorialText(slide.alt, 200),
      })),
      pie: editorialText(draft.pie, 2300),
      cta: editorialText(draft.cta, 260),
      hashtags: Array.isArray(draft.hashtags) ? draft.hashtags.slice(0, 6).map((tag: unknown) => editorialText(tag, 45)) : [],
      referencias: [], // References must be reviewed and entered by the professional, never auto-invented.
      aviso_revision: "Borrador generado con IA: revisión clínica, bibliográfica y ortográfica pendiente."
    };
    return editorialJson(normalized);
  } catch (error) {
    console.error("Instagram content request failed", error instanceof Error ? error.name : "Unknown");
    return editorialJson({ error: "No se ha podido completar la generación. Reintenta o edita manualmente." }, 502);
  }
}


function openAIResponseText(payload: Record<string, unknown>): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  const output = Array.isArray(payload.output) ? payload.output : [];
  for (const item of output) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const content = Array.isArray((item as Record<string, unknown>).content)
      ? (item as Record<string, unknown>).content as unknown[]
      : [];
    for (const part of content) {
      if (!part || typeof part !== "object" || Array.isArray(part)) continue;
      const record = part as Record<string, unknown>;
      if (record.type === "output_text" && typeof record.text === "string" && record.text.trim()) return record.text.trim();
    }
  }
  return "";
}

function parseJsonObjectText(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  const unfenced = trimmed
    .replace(/^\`\`\`(?:json)?\s*/i, "")
    .replace(/\s*\`\`\`$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(unfenced) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
  } catch {
    // Fall through to a conservative object extraction for models that add a short wrapper.
  }

  const firstBrace = unfenced.indexOf("{");
  const lastBrace = unfenced.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const parsed = JSON.parse(unfenced.slice(firstBrace, lastBrace + 1)) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
  }

  throw new Error("Clinical model did not return a JSON object.");
}

/** Private clinical structuring. The professional reviews every proposal before it is saved. */
async function clinicalStructureRequest(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return editorialJson({ error: "Método no permitido." }, 405);
  if (!await verifyEditorialOwner(request)) return editorialJson({ error: "Sesión no autorizada." }, 401);
  if (!env.OPENAI_API_KEY) return editorialJson({ error: "El análisis clínico asistido no está configurado." }, 503);
  if (Number(request.headers.get("content-length") || "0") > 45000) return editorialJson({ error: "La nota es demasiado extensa para una sola importación." }, 413);

  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return editorialJson({ error: "Solicitud no válida." }, 400); }

  const notes = editorialText(data.notes, 24000);
  const rawExistingProfile = data.existing_profile && typeof data.existing_profile === "object" && !Array.isArray(data.existing_profile)
    ? data.existing_profile as Record<string, unknown>
    : {};

  if (notes.length < 20) return editorialJson({ error: "Añade notas clínicas suficientes para poder estructurarlas." }, 400);

  const allowedFields = [
    "clinical_summary","next_session_focus","medication_notes",
    "reason_for_consultation","current_problem_history","psychological_psychiatric_history",
    "medical_history","family_history","personal_family_context","social_context","academic_work_context",
    "significant_life_events","clinical_examination","psychometric_assessment","neuropsychological_assessment",
    "diagnoses","diagnostic_hypotheses","differential_diagnosis","current_clinical_problems",
    "predisposing_factors","precipitating_factors","perpetuating_factors","protective_factors",
    "integrative_formulation","therapeutic_goals","treatment_plan","interventions_summary",
    "clinical_evolution_summary","risk_safety","professional_coordination","clinical_observations"
  ];

  // Never forward arbitrary patient record properties to an external model.
  const existingProfile: Record<string, string> = {};
  for (const key of allowedFields) {
    const value = editorialText(rawExistingProfile[key], 7000);
    if (value) existingProfile[key] = value;
  }
  if (containsDirectPatientIdentifiers(notes) || containsDirectPatientIdentifiers(JSON.stringify(existingProfile))) {
    return editorialJson({ error: CLINICAL_IDENTIFIERS_ERROR }, 422);
  }

  const system = [
    "Eres un asistente de documentación clínica para una psicóloga sanitaria y neuropsicóloga en España.",
    "Tu tarea es convertir notas clínicas libres en una propuesta estructurada, conservadora, clínicamente útil y trazable.",
    "Haz una revisión de consistencia antes de generar la salida: diferencia hechos explícitos, inferencias, contradicciones y huecos de información.",
    "Prioriza precisión y conservación del significado original por encima de completar apartados.",
    "No inventes hechos, diagnósticos, medicación, fechas, antecedentes, resultados de pruebas ni riesgo.",
    "Distingue estrictamente entre información explícita, inferencias clínicas y aspectos pendientes de explorar.",
    "Las inferencias deben ser útiles pero prudentes. Nunca las redactes como hechos confirmados.",
    "Un síntoma o patrón aislado no equivale a un diagnóstico. No diagnostiques salvo que las notas indiquen de forma explícita un diagnóstico ya registrado por un profesional.",
    "Si detectas una posible hipótesis diagnóstica, colócala únicamente en inferences o diagnostic_hypotheses y deja claro que requiere exploración/validación.",
    "Si una información relevante no aparece, no escribas 'niega' ni 'ausente'. Añádela a missing_to_explore cuando sea clínicamente pertinente.",
    "Si hay versiones incompatibles o datos que parecen contradecirse, no elijas una versión como verdadera: conserva el conflicto en clinical_observations y propón aclararlo en missing_to_explore.",
    "No dupliques innecesariamente información en muchos apartados. Distribuye cada dato donde resulte más útil.",
    "Redacta en español clínico claro, profesional y conciso.",
    "Devuelve SOLO JSON válido con esta forma exacta:",
    "{fields:{},inferences:[{statement:string,basis:string,confidence:'high'|'plausible',target_field:string}],missing_to_explore:string[],processes:[{process:string,reason:string}]}.",
    "fields solo puede usar estas claves: " + allowedFields.join(", ") + ".",
    "processes debe usar, cuando encaje, etiquetas de procesos o áreas clínicas breves como Rumiación, Preocupación, Intolerancia a la incertidumbre, Regulación emocional, Autocrítica, Autoestima, Perfeccionismo, Necesidad de aprobación, Asertividad, Límites interpersonales, Activación conductual, Procrastinación, Resolución de problemas, Evitación, Comprobación, Sexualidad, Adicciones, Habilidades sociales infantil, TDAH adulto, TDAH infantil, TEA infantil, TEA adulto, Duelo, Trauma, Pareja, Dependencia emocional, Celos, Ira, TOC, Pánico, Ansiedad social, Fobias, Sueño, Dolor crónico, Alimentación, Habilidades parentales o Neuropsicología.",
    "Para riesgo y seguridad: si las notas contienen ideación autolesiva/suicida, violencia, abuso, descompensación grave u otra información de riesgo, conserva el dato en risk_safety sin minimizarlo y no infieras ausencia de riesgo por falta de mención.",
    "No incluyas nombres, correos, teléfonos ni otros identificadores personales en la salida si aparecen accidentalmente."
  ].join("\n");

  const clinicalResponseSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      fields: {
        type: "object",
        additionalProperties: false,
        properties: Object.fromEntries(allowedFields.map((key) => [key, { type: "string" }])),
        required: allowedFields
      },
      inferences: {
        type: "array",
        maxItems: 16,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            statement: { type: "string" },
            basis: { type: "string" },
            confidence: { type: "string", enum: ["high", "plausible"] },
            target_field: { type: "string", enum: allowedFields }
          },
          required: ["statement", "basis", "confidence", "target_field"]
        }
      },
      missing_to_explore: {
        type: "array",
        maxItems: 18,
        items: { type: "string" }
      },
      processes: {
        type: "array",
        maxItems: 12,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            process: { type: "string" },
            reason: { type: "string" }
          },
          required: ["process", "reason"]
        }
      }
    },
    required: ["fields", "inferences", "missing_to_explore", "processes"]
  };

  try {
    const preferredModel = env.OPENAI_CLINICAL_MODEL || "gpt-6.1-sol";
    const models = [...new Set([preferredModel, "gpt-6.1-sol", "gpt-6-sol", "gpt-6-luna", "gpt-4.1-mini"])];
    let outputText = "";
    let lastStatus = 502;
    let lastErrorCode = "";

    for (const model of models) {
      const requestBody = {
        model,
        store: false,
        instructions: system,
        input: JSON.stringify({ notas: notes, historial_existente: existingProfile })
      };

      const attempts = [
        {
          ...requestBody,
          text: {
            format: {
              type: "json_schema",
              name: "clinical_structure",
              strict: true,
              schema: clinicalResponseSchema
            }
          }
        },
        requestBody
      ];

      for (let attemptIndex = 0; attemptIndex < attempts.length; attemptIndex += 1) {
        const response = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + env.OPENAI_API_KEY,
            "Content-Type": "application/json",
            "X-Client-Request-Id": crypto.randomUUID()
          },
          body: JSON.stringify(attempts[attemptIndex])
        });

        const result = await response.json() as Record<string, unknown>;
        const candidate = openAIResponseText(result);
        if (response.ok && candidate) {
          outputText = candidate;
          break;
        }

        const apiError = result.error && typeof result.error === "object" && !Array.isArray(result.error)
          ? result.error as Record<string, unknown>
          : {};
        lastStatus = response.status;
        lastErrorCode = editorialText(apiError.code, 120);
        console.error(
          "Clinical structure generation failure",
          model,
          attemptIndex === 0 ? "structured" : "plain-json",
          response.status,
          lastErrorCode
        );

        // Invalid/revoked credentials or exhausted billing will not improve by retrying.
        if (response.status === 401 || response.status === 429) break;
        // Retry without a forced response format only when the structured-output request is rejected.
        if (attemptIndex === 0 && response.status === 400) continue;
        break;
      }

      if (outputText || lastStatus === 401 || lastStatus === 429) break;
      // Model access / unsupported-model errors can fall back safely to a broadly available model.
      if (![400, 403, 404].includes(lastStatus)) break;
    }

    if (!outputText) {
      if (lastStatus === 401) return editorialJson({ error: "La clave de OpenAI configurada no es válida o ha sido revocada." }, 502);
      if (lastStatus === 429) return editorialJson({ error: "Se ha alcanzado el límite de análisis o de crédito de la API. Revisa la facturación y prueba de nuevo." }, 429);
      if (lastStatus === 403 || lastStatus === 404) return editorialJson({ error: "La clave está configurada, pero el proyecto no tiene acceso a ninguno de los modelos clínicos de respaldo." }, 502);
      if (lastStatus === 400) return editorialJson({ error: "La API ha rechazado el formato del análisis. Se ha probado también el modelo de respaldo sin éxito." }, 502);
      return editorialJson({ error: "OpenAI ha rechazado el análisis clínico. Vuelve a intentarlo y, si continúa, revisaremos la configuración de la API." }, 502);
    }

    const raw = parseJsonObjectText(outputText);
    const rawFields = raw.fields && typeof raw.fields === "object" && !Array.isArray(raw.fields) ? raw.fields as Record<string, unknown> : {};
    const fields: Record<string, string> = {};
    for (const key of allowedFields) {
      const value = editorialText(rawFields[key], 5000);
      if (value) fields[key] = value;
    }

    const inferences = Array.isArray(raw.inferences) ? raw.inferences.slice(0, 16).map((item: Record<string, unknown>) => ({
      statement: editorialText(item.statement, 700),
      basis: editorialText(item.basis, 700),
      confidence: item.confidence === "high" ? "high" : "plausible",
      target_field: allowedFields.includes(String(item.target_field)) ? String(item.target_field) : "clinical_observations"
    })).filter((item) => item.statement) : [];

    const missingToExplore = Array.isArray(raw.missing_to_explore)
      ? raw.missing_to_explore.slice(0, 18).map((item) => editorialText(item, 500)).filter(Boolean)
      : [];

    const processes = Array.isArray(raw.processes) ? raw.processes.slice(0, 12).map((item: Record<string, unknown>) => ({
      process: editorialText(item.process, 120),
      reason: editorialText(item.reason, 500)
    })).filter((item) => item.process) : [];

    return editorialJson({ fields, inferences, missing_to_explore: missingToExplore, processes });
  } catch (error) {
    console.error("Clinical structure request failed", error instanceof Error ? error.name : "Unknown");
    return editorialJson({ error: "No se ha podido completar el análisis clínico. Revisa la nota y vuelve a intentarlo." }, 502);
  }
}



/** Private diagnostic support. Suggestions are provisional and require professional review before saving. */
async function clinicalDiagnosticSuggestionRequest(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return editorialJson({ error: "Método no permitido." }, 405);
  if (!await verifyEditorialOwner(request)) return editorialJson({ error: "Sesión no autorizada." }, 401);
  if (!env.OPENAI_API_KEY) return editorialJson({ error: "El análisis diagnóstico asistido no está configurado." }, 503);
  if (Number(request.headers.get("content-length") || "0") > 65000) return editorialJson({ error: "El historial enviado es demasiado extenso para este análisis." }, 413);

  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return editorialJson({ error: "Solicitud no válida." }, 400); }

  const rawProfile = data.profile && typeof data.profile === "object" && !Array.isArray(data.profile)
    ? data.profile as Record<string, unknown>
    : {};

  const allowedInputFields = [
    "age","clinical_summary","medication_notes","reason_for_consultation","current_problem_history",
    "psychological_psychiatric_history","medical_history","family_history","personal_family_context",
    "social_context","academic_work_context","significant_life_events","clinical_examination",
    "psychometric_assessment","neuropsychological_assessment","diagnoses","diagnostic_hypotheses",
    "differential_diagnosis","current_clinical_problems","predisposing_factors","precipitating_factors",
    "perpetuating_factors","protective_factors","integrative_formulation","clinical_evolution_summary",
    "risk_safety","clinical_observations"
  ];

  const profile: Record<string, string> = {};
  for (const key of allowedInputFields) {
    const value = editorialText(rawProfile[key], key === "age" ? 16 : 7000);
    if (value) profile[key] = value;
  }

  if (containsDirectPatientIdentifiers(JSON.stringify(profile))) {
    return editorialJson({ error: CLINICAL_IDENTIFIERS_ERROR }, 422);
  }

  const usableText = Object.values(profile).join("\n").trim();
  if (usableText.length < 80) {
    return editorialJson({ error: "La ficha todavía contiene poca información para sugerir un diagnóstico diferencial con prudencia." }, 400);
  }

  const system = [
    "Eres un asistente de apoyo al razonamiento diagnóstico para una psicóloga sanitaria y neuropsicóloga en España.",
    "Tu salida es una PROPUESTA CLÍNICA PARA REVISIÓN PROFESIONAL, nunca un diagnóstico automático ni una decisión definitiva.",
    "Razona de forma conservadora usando criterios compatibles con DSM-5-TR y CIE-11, pero NO inventes códigos diagnósticos ni criterios que no estén documentados.",
    "No fuerces una categoría diagnóstica. Si faltan duración, frecuencia, deterioro funcional, criterios nucleares, exclusiones médicas, consumo de sustancias, efectos de medicación o información evolutiva relevante, indícalo.",
    "Distingue síntomas, procesos transdiagnósticos, reacciones esperables a contexto y trastornos clínicos.",
    "No conviertas duelo, estrés, dolor, trauma referido, rasgos de personalidad, neurodivergencia o dificultades relacionales en diagnósticos por defecto.",
    "Valora siempre explicaciones médicas, farmacológicas, de sustancias, del sueño y neuropsicológicas cuando sean plausibles según la información disponible.",
    "Si ya existe un diagnóstico en la ficha, trátalo como antecedente registrado, no como verdad que debas confirmar automáticamente.",
    "La hipótesis principal solo debe proponerse cuando haya un patrón suficientemente coherente. En caso contrario usa assessment_status='insufficient_information'.",
    "Expresa el nivel de certeza clínica únicamente como low, moderate o high. No uses porcentajes ni falsa precisión.",
    "Para cada alternativa diferencial explica por qué considerarla, qué datos la debilitan o faltan y qué preguntas/pruebas permitirían discriminarla.",
    "Cuando los datos hagan una alternativa poco probable, márcala como less_likely y explica por qué. No llenes el diferencial con posibilidades remotas.",
    "Propón entre 0 y 6 preguntas concretas para la siguiente sesión que realmente ayuden a confirmar, descartar o diferenciar hipótesis.",
    "Puedes sugerir escalas o instrumentos validados solo cuando aporten información útil. Indica para qué servirían y sus limitaciones; ninguna escala confirma por sí sola un diagnóstico.",
    "En neuropsicología diferencia siempre que sea pertinente entre queja cognitiva, rendimiento observado, perfil cognitivo, hipótesis etiológica y diagnóstico neurocognitivo. No deduzcas un trastorno neurocognitivo solo por quejas o un cribado aislado.",
    "Si sugieres un código DSM-5-TR o CIE-11, hazlo solo cuando el diagnóstico esté suficientemente especificado y el código te resulte fiable. Si no, usa classification='none' y deja code vacío. Todo código es orientativo y debe verificarse manualmente antes de registrarlo.",
    "No propongas tratamiento. No añadas nombres, correos, teléfonos ni identificadores.",
    "Si hay información de riesgo, no la minimices, pero tampoco infieras riesgo ausente por falta de mención.",
    "Redacta en español clínico claro y conciso.",
    "Devuelve SOLO JSON válido conforme al esquema solicitado."
  ].join("\n");

  const diagnosticSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      assessment_status: {
        type: "string",
        enum: ["provisional_diagnosis_possible","insufficient_information","no_specific_diagnosis_supported"]
      },
      primary: {
        type: "object",
        additionalProperties: false,
        properties: {
          diagnosis: { type: "string" },
          status: { type: "string", enum: ["provisional","rule_out","insufficient_information"] },
          confidence: { type: "string", enum: ["low","moderate","high"] },
          rationale: { type: "string" },
          supporting_evidence: { type: "array", maxItems: 10, items: { type: "string" } },
          conflicting_or_missing_evidence: { type: "array", maxItems: 10, items: { type: "string" } },
          code_suggestion: {
            type: "object",
            additionalProperties: false,
            properties: {
              classification: { type: "string", enum: ["none","DSM-5-TR","CIE-11"] },
              code: { type: "string" },
              label: { type: "string" },
              verification_note: { type: "string" }
            },
            required: ["classification","code","label","verification_note"]
          }
        },
        required: ["diagnosis","status","confidence","rationale","supporting_evidence","conflicting_or_missing_evidence","code_suggestion"]
      },
      differential: {
        type: "array",
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            diagnosis: { type: "string" },
            likelihood: { type: "string", enum: ["plausible","unclear","less_likely"] },
            priority: { type: "string", enum: ["high","medium","low"] },
            why_consider: { type: "string" },
            against_or_missing: { type: "string" },
            discriminators: { type: "array", maxItems: 5, items: { type: "string" } }
          },
          required: ["diagnosis","likelihood","priority","why_consider","against_or_missing","discriminators"]
        }
      },
      medical_or_substance_considerations: {
        type: "array",
        maxItems: 8,
        items: { type: "string" }
      },
      priority_missing_information: {
        type: "array",
        maxItems: 10,
        items: { type: "string" }
      },
      next_session_questions: {
        type: "array",
        maxItems: 6,
        items: { type: "string" }
      },
      suggested_assessment_tools: {
        type: "array",
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            purpose: { type: "string" },
            limitations: { type: "string" }
          },
          required: ["name","purpose","limitations"]
        }
      },
      summary_statement: { type: "string" },
      record_hypothesis: { type: "string" },
      record_differential: { type: "string" },
      caution: { type: "string" }
    },
    required: [
      "assessment_status","primary","differential","medical_or_substance_considerations",
      "priority_missing_information","next_session_questions","suggested_assessment_tools","summary_statement",
      "record_hypothesis","record_differential","caution"
    ]
  };

  try {
    const preferredModel = env.OPENAI_CLINICAL_MODEL || "gpt-6-sol";
    const models = [...new Set([preferredModel, "gpt-6-sol", "gpt-6-luna", "gpt-4.1-mini"])];
    let outputText = "";
    let lastStatus = 502;

    for (const model of models) {
      const requestBody = {
        model,
        store: false,
        instructions: system,
        input: JSON.stringify({ historial_clinico_anonimizado: profile })
      };

      const attempts = [
        {
          ...requestBody,
          text: {
            format: {
              type: "json_schema",
              name: "clinical_diagnostic_support",
              strict: true,
              schema: diagnosticSchema
            }
          }
        },
        requestBody
      ];

      for (let attemptIndex = 0; attemptIndex < attempts.length; attemptIndex += 1) {
        const response = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + env.OPENAI_API_KEY,
            "Content-Type": "application/json",
            "X-Client-Request-Id": crypto.randomUUID()
          },
          body: JSON.stringify(attempts[attemptIndex])
        });
        const result = await response.json() as Record<string, unknown>;
        const candidate = openAIResponseText(result);
        if (response.ok && candidate) {
          outputText = candidate;
          break;
        }
        lastStatus = response.status;
        if (response.status === 401 || response.status === 429) break;
        if (attemptIndex === 0 && response.status === 400) continue;
        break;
      }

      if (outputText || lastStatus === 401 || lastStatus === 429) break;
      if (![400,403,404].includes(lastStatus)) break;
    }

    if (!outputText) {
      if (lastStatus === 401) return editorialJson({ error: "La clave de OpenAI configurada no es válida o ha sido revocada." }, 502);
      if (lastStatus === 429) return editorialJson({ error: "Se ha alcanzado el límite de análisis o de crédito de la API." }, 429);
      return editorialJson({ error: "No se ha podido generar la sugerencia diagnóstica con los modelos disponibles." }, 502);
    }

    const raw = parseJsonObjectText(outputText);
    const primaryRaw = raw.primary && typeof raw.primary === "object" && !Array.isArray(raw.primary)
      ? raw.primary as Record<string, unknown>
      : {};

    const normalizeList = (value: unknown, maxItems: number, maxLength: number) =>
      Array.isArray(value)
        ? value.slice(0, maxItems).map((item) => editorialText(item, maxLength)).filter(Boolean)
        : [];

    const differential = Array.isArray(raw.differential)
      ? raw.differential.slice(0, 6).map((item) => {
          const row = item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : {};
          return {
            diagnosis: editorialText(row.diagnosis, 220),
            likelihood: ["plausible","unclear","less_likely"].includes(String(row.likelihood)) ? String(row.likelihood) : "unclear",
            priority: ["high","medium","low"].includes(String(row.priority)) ? String(row.priority) : "medium",
            why_consider: editorialText(row.why_consider, 900),
            against_or_missing: editorialText(row.against_or_missing, 900),
            discriminators: normalizeList(row.discriminators, 5, 500)
          };
        }).filter((item) => item.diagnosis)
      : [];

    const status = ["provisional_diagnosis_possible","insufficient_information","no_specific_diagnosis_supported"].includes(String(raw.assessment_status))
      ? String(raw.assessment_status)
      : "insufficient_information";

    return editorialJson({
      assessment_status: status,
      primary: {
        diagnosis: editorialText(primaryRaw.diagnosis, 220),
        status: ["provisional","rule_out","insufficient_information"].includes(String(primaryRaw.status))
          ? String(primaryRaw.status)
          : "insufficient_information",
        confidence: ["low","moderate","high"].includes(String(primaryRaw.confidence)) ? String(primaryRaw.confidence) : "low",
        rationale: editorialText(primaryRaw.rationale, 1600),
        supporting_evidence: normalizeList(primaryRaw.supporting_evidence, 10, 650),
        conflicting_or_missing_evidence: normalizeList(primaryRaw.conflicting_or_missing_evidence, 10, 650),
        code_suggestion: (() => {
          const codeRaw = primaryRaw.code_suggestion && typeof primaryRaw.code_suggestion === "object" && !Array.isArray(primaryRaw.code_suggestion)
            ? primaryRaw.code_suggestion as Record<string, unknown>
            : {};
          const classification = ["none","DSM-5-TR","CIE-11"].includes(String(codeRaw.classification)) ? String(codeRaw.classification) : "none";
          return {
            classification,
            code: classification === "none" ? "" : editorialText(codeRaw.code, 40),
            label: classification === "none" ? "" : editorialText(codeRaw.label, 220),
            verification_note: editorialText(codeRaw.verification_note, 500) || "Verificar manualmente antes de registrar."
          };
        })()
      },
      differential,
      medical_or_substance_considerations: normalizeList(raw.medical_or_substance_considerations, 8, 650),
      priority_missing_information: normalizeList(raw.priority_missing_information, 10, 650),
      next_session_questions: normalizeList(raw.next_session_questions, 6, 650),
      suggested_assessment_tools: Array.isArray(raw.suggested_assessment_tools)
        ? raw.suggested_assessment_tools.slice(0, 6).map((item) => {
            const row = item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : {};
            return {
              name: editorialText(row.name, 180),
              purpose: editorialText(row.purpose, 700),
              limitations: editorialText(row.limitations, 700)
            };
          }).filter((item) => item.name)
        : [],
      summary_statement: editorialText(raw.summary_statement, 1200),
      record_hypothesis: editorialText(raw.record_hypothesis, 3000),
      record_differential: editorialText(raw.record_differential, 4000),
      caution: editorialText(raw.caution, 900) || "Sugerencia generada con IA para revisión profesional. No equivale a un diagnóstico confirmado."
    });
  } catch (error) {
    console.error("Clinical diagnostic suggestion failed", error instanceof Error ? error.name : "Unknown");
    return editorialJson({ error: "No se ha podido completar el análisis diagnóstico asistido." }, 502);
  }
}

async function clinicalMaterialDraftRequest(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return editorialJson({ error: "Método no permitido." }, 405);
  if (!await verifyEditorialOwner(request)) return editorialJson({ error: "Sesión no autorizada." }, 401);
  if (!env.OPENAI_API_KEY) return editorialJson({ error: "La generación clínica asistida no está configurada." }, 503);
  if (Number(request.headers.get("content-length") || "0") > 140000) return editorialJson({ error: "La biblioteca enviada es demasiado grande para esta comprobación." }, 413);

  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return editorialJson({ error: "Solicitud no válida." }, 400); }

  const query = editorialText(data.query, 300);
  const preferredType = data.preferred_type === "psychoeducation" ? "psychoeducation" : data.preferred_type === "exercise" ? "exercise" : "";
  const preferredProcess = editorialText(data.preferred_process, 120);
  const rawCatalog = Array.isArray(data.catalog) ? data.catalog.slice(0, 500) : [];
  if (query.length < 3) return editorialJson({ error: "Escribe qué material necesitas." }, 400);
  if (containsDirectPatientIdentifiers(query)) return editorialJson({ error: CLINICAL_IDENTIFIERS_ERROR }, 422);

  const catalog = rawCatalog.map((item) => {
    const record = item && typeof item === "object" ? item as Record<string, unknown> : {};
    return {
      id: editorialText(record.id, 80),
      title: editorialText(record.title, 220),
      summary: editorialText(record.summary, 350),
      process_tags: Array.isArray(record.process_tags)
        ? record.process_tags.slice(0, 6).map((tag) => editorialText(tag, 100)).filter(Boolean)
        : [],
      material_type: record.material_type === "psychoeducation" ? "psychoeducation" : "exercise"
    };
  }).filter((item) => item.id && item.title);

  const allowedPhases = ["orientation","assessment","skills","practice","exposure","consolidation","relapse_prevention"];
  const allowedBurden = ["low","medium","high"];
  const system = [
    "Eres un asistente de biblioteca clínica para una psicóloga sanitaria y neuropsicóloga en España.",
    "Debes decidir si la petición del profesional ya está cubierta por un material conceptualmente equivalente de la biblioteca existente.",
    "No consideres duplicado solo por compartir palabras: debe cubrir sustancialmente el mismo objetivo clínico y uso.",
    "Si ya existe, devuelve status='existing' y el id exacto del material más equivalente.",
    "Si falta, crea UN material nuevo, listo para que la profesional lo revise antes de incorporarlo.",
    "El contenido debe ser clínicamente prudente, claro, útil para paciente y no diagnosticar por sí solo.",
    "No sustituyas valoración médica o especializada cuando el tema pueda requerirla.",
    "En trauma prioriza estabilización salvo que la petición solicite explícitamente otra fase y sea apropiado.",
    "En TOC evita reaseguro y discusiones para demostrar que una obsesión es falsa.",
    "En adicciones no indiques retirada brusca de sustancias con posible dependencia física.",
    "En alimentación evita restricciones, conteos o instrucciones que puedan reforzar un TCA.",
    "En TEA usa un enfoque neuroafirmativo y evita normalización forzada o entrenamiento de enmascaramiento.",
    "Devuelve SOLO JSON válido.",
    "Si existe: {status:'existing',existing_id:string,reason:string}.",
    "Si falta: {status:'new',reason:string,material:{title:string,summary:string,instructions:string,process_tags:string[],material_type:'exercise'|'psychoeducation',phase:string,duration_minutes:number|null,burden:'low'|'medium'|'high',objectives:string[],cautions:string[],sequence_rank:number,patient_document:{duration_minutes:number|null,frequency:string,introduction:string,why:string,objective:string,instructions:string,example:string,record_prompt:string,safety_note:string,remember:string,session_questions:string[]}}}.",
    "Las instrucciones deben estar dirigidas al paciente cuando sea material enviable.",
    "patient_document es obligatorio en materiales nuevos y debe poder entregarse directamente al paciente.",
    "introduction debe ser una introducción breve. why debe explicar en lenguaje claro por qué hacemos el ejercicio o para qué sirve el material, sin revelar formulación clínica interna ni diagnósticos no comunicados.",
    "why debe explicar el proceso psicológico relevante, qué se entrena o comprende y dejar claro que no se busca hacerlo perfecto ni eliminar el malestar de inmediato cuando eso sea clínicamente pertinente.",
    "frequency debe proponer una frecuencia prudente y flexible, nunca punitiva. record_prompt debe ser útil para ejercicios y puede quedar vacío en psicoeducación.",
    "safety_note debe ser breve y solo aparecer si el material puede generar malestar relevante o requiere recordar que no hay que forzarse. session_questions debe contener de 1 a 4 preguntas breves para comentar en sesión.",
    "La ficha nueva debe complementar la biblioteca, no repetirla con un título distinto."
  ].join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify({
            peticion: query,
            tipo_preferido: preferredType || null,
            proceso_preferido: preferredProcess || null,
            biblioteca: catalog
          }) }
        ]
      })
    });

    const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    if (!response.ok || !result.choices?.[0]?.message?.content) {
      console.error("Clinical material generation failure", response.status);
      return editorialJson({ error: response.status === 429 ? "Se ha alcanzado el límite de generación. Prueba de nuevo más tarde." : "No se ha podido comprobar o generar el material." }, response.status === 429 ? 429 : 502);
    }

    const raw = JSON.parse(result.choices[0].message.content) as Record<string, unknown>;
    if (raw.status === "existing") {
      const existingId = editorialText(raw.existing_id, 80);
      if (catalog.some((item) => item.id === existingId)) {
        return editorialJson({
          status: "existing",
          existing_id: existingId,
          reason: editorialText(raw.reason, 700)
        });
      }
    }

    const materialRaw = raw.material && typeof raw.material === "object" && !Array.isArray(raw.material)
      ? raw.material as Record<string, unknown>
      : {};
    const materialType = materialRaw.material_type === "psychoeducation" ? "psychoeducation" : "exercise";
    const phaseCandidate = editorialText(materialRaw.phase, 80);
    const burdenCandidate = editorialText(materialRaw.burden, 30);
    const durationValue = Number(materialRaw.duration_minutes);
    const sequenceValue = Number(materialRaw.sequence_rank);

    const patientDocumentRaw = materialRaw.patient_document && typeof materialRaw.patient_document === "object" && !Array.isArray(materialRaw.patient_document)
      ? materialRaw.patient_document as Record<string, unknown>
      : {};
    const patientInstructions = editorialText(patientDocumentRaw.instructions, 7000) || editorialText(materialRaw.instructions, 7000);
    const patientDurationValue = Number(patientDocumentRaw.duration_minutes);
    const patientDocument = {
      version: 1,
      material_type: materialType,
      duration_minutes: Number.isFinite(patientDurationValue) && patientDurationValue > 0 && patientDurationValue <= 180
        ? Math.round(patientDurationValue)
        : Number.isFinite(durationValue) && durationValue > 0 && durationValue <= 180 ? Math.round(durationValue) : null,
      frequency: editorialText(patientDocumentRaw.frequency, 500),
      introduction: editorialText(patientDocumentRaw.introduction, 1200),
      why: editorialText(patientDocumentRaw.why, 2200),
      objective: editorialText(patientDocumentRaw.objective, 900),
      instructions: patientInstructions,
      example: editorialText(patientDocumentRaw.example, 1800),
      record_prompt: editorialText(patientDocumentRaw.record_prompt, 1800),
      safety_note: editorialText(patientDocumentRaw.safety_note, 1200),
      remember: editorialText(patientDocumentRaw.remember, 1400),
      session_questions: Array.isArray(patientDocumentRaw.session_questions)
        ? patientDocumentRaw.session_questions.slice(0, 4).map((item) => editorialText(item, 350)).filter(Boolean)
        : []
    };

    const material = {
      title: editorialText(materialRaw.title, 220) || query,
      summary: editorialText(materialRaw.summary, 700),
      instructions: patientInstructions,
      process_tags: Array.isArray(materialRaw.process_tags)
        ? materialRaw.process_tags.slice(0, 5).map((tag) => editorialText(tag, 100)).filter(Boolean)
        : preferredProcess ? [preferredProcess] : [],
      material_type: materialType,
      phase: allowedPhases.includes(phaseCandidate) ? phaseCandidate : materialType === "psychoeducation" ? "orientation" : "practice",
      duration_minutes: Number.isFinite(durationValue) && durationValue > 0 && durationValue <= 180 ? Math.round(durationValue) : null,
      burden: allowedBurden.includes(burdenCandidate) ? burdenCandidate : "low",
      objectives: Array.isArray(materialRaw.objectives)
        ? materialRaw.objectives.slice(0, 8).map((item) => editorialText(item, 300)).filter(Boolean)
        : [],
      cautions: Array.isArray(materialRaw.cautions)
        ? materialRaw.cautions.slice(0, 8).map((item) => editorialText(item, 350)).filter(Boolean)
        : [],
      sequence_rank: Number.isFinite(sequenceValue) ? Math.max(1, Math.min(100, Math.round(sequenceValue))) : 50,
      patient_document: patientDocument
    };

    if (!material.instructions || !patientDocument.introduction || !patientDocument.why) return editorialJson({ error: "La IA no ha generado un documento para paciente suficientemente completo para revisar." }, 502);
    return editorialJson({ status: "new", reason: editorialText(raw.reason, 700), material });
  } catch (error) {
    console.error("Clinical material request failed", error instanceof Error ? error.name : "Unknown");
    return editorialJson({ error: "No se ha podido completar la comprobación de la biblioteca." }, 502);
  }
}


async function clinicalMaterialEnrichRequest(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return editorialJson({ error: "Método no permitido." }, 405);
  if (!await verifyEditorialOwner(request)) return editorialJson({ error: "Sesión no autorizada." }, 401);
  if (!env.OPENAI_API_KEY) return editorialJson({ error: "La generación clínica asistida no está configurada." }, 503);
  if (Number(request.headers.get("content-length") || "0") > 40000) return editorialJson({ error: "El material enviado es demasiado grande." }, 413);

  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return editorialJson({ error: "Solicitud no válida." }, 400); }

  const title = editorialText(data.title, 220);
  const materialType = data.material_type === "psychoeducation" ? "psychoeducation" : "exercise";
  const summary = editorialText(data.summary, 900);
  const processTags = Array.isArray(data.process_tags)
    ? data.process_tags.slice(0, 6).map((item) => editorialText(item, 100)).filter(Boolean)
    : [];
  const currentRaw = data.patient_document && typeof data.patient_document === "object" && !Array.isArray(data.patient_document)
    ? data.patient_document as Record<string, unknown>
    : {};
  if (!title) return editorialJson({ error: "Falta el título del material." }, 400);

  const currentDocument = {
    material_type: materialType,
    duration_minutes: Number(currentRaw.duration_minutes) || null,
    frequency: editorialText(currentRaw.frequency, 500),
    introduction: editorialText(currentRaw.introduction, 1200),
    why: editorialText(currentRaw.why, 2200),
    objective: editorialText(currentRaw.objective, 900),
    instructions: editorialText(currentRaw.instructions, 7000),
    example: editorialText(currentRaw.example, 1800),
    record_prompt: editorialText(currentRaw.record_prompt, 1800),
    safety_note: editorialText(currentRaw.safety_note, 1200),
    remember: editorialText(currentRaw.remember, 1400),
    session_questions: Array.isArray(currentRaw.session_questions)
      ? currentRaw.session_questions.slice(0, 6).map((item) => editorialText(item, 350)).filter(Boolean)
      : []
  };

  if (containsDirectPatientIdentifiers(JSON.stringify({ title, summary, processTags, currentDocument }))) {
    return editorialJson({ error: CLINICAL_IDENTIFIERS_ERROR }, 422);
  }

  const system = [
    "Eres un asistente de edición de material clínico para una psicóloga sanitaria y neuropsicóloga en España.",
    "Tu tarea es completar y mejorar una ficha destinada al paciente SIN cambiar el objetivo clínico ni inventar diagnósticos.",
    "Preserva el sentido de las instrucciones existentes. Puedes hacerlas más claras, pero no introducir una intervención distinta.",
    "Escribe en español claro, cálido y profesional, sin infantilizar.",
    "Completa especialmente un ejemplo cotidiano, concreto y breve cuando falte.",
    "La explicación de por qué se hace debe explicar el proceso psicológico relevante y qué se entrena o comprende, sin revelar formulaciones internas ni diagnósticos no comunicados.",
    "La frecuencia debe ser prudente, flexible y fácil de seguir.",
    "La nota de seguridad solo debe incluirse cuando resulte clínicamente útil. Si se incluye, debe recordar que no es necesario forzarse y que el material puede revisarse en sesión.",
    "En trauma prioriza estabilización. En TOC evita reaseguro. En adicciones no aconsejes retirada brusca. En alimentación evita restricciones o conteos. En TEA usa enfoque neuroafirmativo.",
    "No añadas datos identificativos del paciente.",
    "Devuelve SOLO JSON válido con esta forma: {patient_document:{duration_minutes:number|null,frequency:string,introduction:string,why:string,objective:string,instructions:string,example:string,record_prompt:string,safety_note:string,remember:string,session_questions:string[]}}."
  ].join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify({
            titulo: title,
            tipo: materialType,
            resumen_interno: summary || null,
            procesos: processTags,
            ficha_actual: currentDocument
          }) }
        ]
      })
    });

    const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    if (!response.ok || !result.choices?.[0]?.message?.content) {
      console.error("Clinical material enrichment failure", response.status);
      return editorialJson({ error: response.status === 429 ? "Se ha alcanzado el límite de generación. Prueba de nuevo más tarde." : "No se ha podido completar la ficha." }, response.status === 429 ? 429 : 502);
    }

    const raw = JSON.parse(result.choices[0].message.content) as Record<string, unknown>;
    const docRaw = raw.patient_document && typeof raw.patient_document === "object" && !Array.isArray(raw.patient_document)
      ? raw.patient_document as Record<string, unknown>
      : {};
    const durationValue = Number(docRaw.duration_minutes);
    const patientDocument = {
      version: 1,
      material_type: materialType,
      duration_minutes: Number.isFinite(durationValue) && durationValue > 0 && durationValue <= 180
        ? Math.round(durationValue)
        : currentDocument.duration_minutes,
      frequency: editorialText(docRaw.frequency, 500) || currentDocument.frequency,
      introduction: editorialText(docRaw.introduction, 1200) || currentDocument.introduction,
      why: editorialText(docRaw.why, 2200) || currentDocument.why,
      objective: editorialText(docRaw.objective, 900) || currentDocument.objective,
      instructions: editorialText(docRaw.instructions, 7000) || currentDocument.instructions,
      example: editorialText(docRaw.example, 1800) || currentDocument.example,
      record_prompt: editorialText(docRaw.record_prompt, 1800) || currentDocument.record_prompt,
      safety_note: editorialText(docRaw.safety_note, 1200) || currentDocument.safety_note,
      remember: editorialText(docRaw.remember, 1400) || currentDocument.remember,
      session_questions: Array.isArray(docRaw.session_questions)
        ? docRaw.session_questions.slice(0, 4).map((item) => editorialText(item, 350)).filter(Boolean)
        : currentDocument.session_questions
    };
    if (!patientDocument.introduction || !patientDocument.why || !patientDocument.instructions) {
      return editorialJson({ error: "La IA no ha generado una ficha suficientemente completa para revisar." }, 502);
    }
    return editorialJson({ patient_document: patientDocument });
  } catch (error) {
    console.error("Clinical material enrichment request failed", error instanceof Error ? error.name : "Unknown");
    return editorialJson({ error: "No se ha podido completar la ficha con IA." }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (
      url.pathname === "/api/stripe/webhook" ||
      url.pathname === "/api/stripe/webhook/"
    ) {
      return handleStripeWebhook(request, env);
    }

    if (url.pathname === "/api/resources/checkout" || url.pathname === "/api/resources/checkout/") return handleResourceCheckout(request, env);
    if (url.pathname === "/api/resources/access" || url.pathname === "/api/resources/access/") return handleResourceAccess(request, env);
    if (url.pathname === "/api/resources/download" || url.pathname === "/api/resources/download/") return handleResourceDownload(request, env);
    if (url.pathname === "/api/questions/draft" || url.pathname === "/api/questions/draft/") return handleQuestionDraft(request, env);
    if (url.pathname === "/api/patient-portal/password-link" || url.pathname === "/api/patient-portal/password-link/") return handlePatientPortalAuth(request, env, "password-link");
    if (url.pathname === "/api/patient-portal/password-set" || url.pathname === "/api/patient-portal/password-set/") return handlePatientPortalAuth(request, env, "password-set");
    if (url.pathname === "/api/patient-portal/password-login" || url.pathname === "/api/patient-portal/password-login/") return handlePatientPortalAuth(request, env, "password-login");
    if (url.pathname === "/api/patient-portal/session" || url.pathname === "/api/patient-portal/session/") return handlePatientPortalSession(request, env);
    if (url.pathname === "/api/patient-portal/response" || url.pathname === "/api/patient-portal/response/") return handlePatientPortalResponse(request, env);
    if (url.pathname === "/api/patient-portal/logout" || url.pathname === "/api/patient-portal/logout/") return handlePatientPortalLogout(request, env);

    if (url.pathname === "/api/editorial/status" || url.pathname === "/api/editorial/status/") {
      if (request.method !== "GET") return editorialJson({ error: "Método no permitido." }, 405);
      if (!await verifyEditorialOwner(request)) return editorialJson({ error: "Sesión no autorizada." }, 401);
      return editorialJson({ configured: Boolean(env.OPENAI_API_KEY) });
    }
    if (url.pathname === "/api/editorial/generate" || url.pathname === "/api/editorial/generate/") return editorialRequest(request, env, "content");
    if (url.pathname === "/api/editorial/image" || url.pathname === "/api/editorial/image/") return editorialRequest(request, env, "image");
    if (url.pathname === "/api/clinical/structure" || url.pathname === "/api/clinical/structure/") return clinicalStructureRequest(request, env);
    if (url.pathname === "/api/clinical/diagnostic-suggestion" || url.pathname === "/api/clinical/diagnostic-suggestion/") return clinicalDiagnosticSuggestionRequest(request, env);
    if (url.pathname === "/api/clinical/material-draft" || url.pathname === "/api/clinical/material-draft/") return clinicalMaterialDraftRequest(request, env);
    if (url.pathname === "/api/clinical/material-enrich" || url.pathname === "/api/clinical/material-enrich/") return clinicalMaterialEnrichRequest(request, env);
    return env.ASSETS.fetch(request);
  },
};
