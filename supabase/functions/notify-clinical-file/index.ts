// A neutral, one-time service notice when a clinician explicitly shares a file.
// No filenames, document titles, diagnoses, treatment descriptions or attachments ever enter the email.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const AUTH_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const BREVO_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const OWNER_ID = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const APP_ORIGIN = "https://carolinasanchezgirona.com";
const PORTAL_URL = APP_ORIGIN + "/mi-espacio/";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CORS = {
  "Access-Control-Allow-Origin": APP_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Vary": "Origin",
};
const responseJson = (data: Record<string, unknown>, status = 200) =>
  Response.json(data, { status, headers: { ...CORS, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
const serviceHeaders = (extra: Record<string, string> = {}) => ({
  "apikey": SERVICE_KEY,
  "Authorization": "Bearer " + SERVICE_KEY,
  "Content-Type": "application/json",
  ...extra,
});
const queryNotice = (documentId: string, sharedAt: string) =>
  "document_id=eq." + encodeURIComponent(documentId) +
  "&shared_at=eq." + encodeURIComponent(sharedAt);
const NOTICES = SUPABASE_URL + "/rest/v1/clinical_document_email_notices";

async function getCurrentNotice(documentId: string, sharedAt: string) {
  const res = await fetch(NOTICES + "?select=status,claimed_at,sent_at&" + queryNotice(documentId, sharedAt) + "&limit=1",
    { headers: serviceHeaders(), cache: "no-store" });
  if (!res.ok) throw new Error("Notice lookup unavailable");
  return (await res.json().catch(() => []))?.[0] ?? null;
}

async function updateNotice(documentId: string, sharedAt: string, data: Record<string, unknown>, extraFilter = "") {
  const res = await fetch(NOTICES + "?select=document_id&" + queryNotice(documentId, sharedAt) + extraFilter, {
    method: "PATCH",
    headers: serviceHeaders({ "Prefer": "return=representation" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Cannot update notice");
  return ((await res.json().catch(() => [])) as unknown[]).length === 1;
}

function emailMessage() {
  const message = "Tienes una nueva comunicación disponible en tu espacio privado. Para consultarla, entra con tus credenciales habituales.";
  const html = '<!doctype html><html lang="es"><body style="margin:0;background:#f5f8fb;font-family:Arial,sans-serif;color:#173A5E">' +
    '<div style="max-width:600px;margin:0 auto;padding:26px 16px"><div style="background:#fff;border:1px solid #dce7ef;border-radius:16px;padding:28px">' +
    '<h1 style="font-size:22px">Tienes una novedad en Mi espacio</h1>' +
    '<p style="line-height:1.6">' + message + '</p>' +
    '<p style="margin:28px 0"><a style="background:#173A5E;color:#fff;padding:12px 20px;border-radius:9px;text-decoration:none" href="' + PORTAL_URL + '">Entrar en Mi espacio</a></p>' +
    '<p style="font-size:13px;color:#60768b">Por seguridad, este aviso no contiene archivos ni detalles personales. No respondas incluyendo información sensible.</p>' +
    '<p>Carolina Sánchez Girona</p></div></div></body></html>';
  const text = "Tienes una novedad en Mi espacio.\n\n" + message + "\n\n" +
    PORTAL_URL + "\n\nPor seguridad, no se incluyen archivos ni detalles personales.\n\nCarolina Sánchez Girona";
  return { html, text };
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return responseJson({ error: "Método no permitido." }, 405);
  const origin = req.headers.get("Origin");
  if (origin && origin !== APP_ORIGIN) return responseJson({ error: "Origen no permitido." }, 403);
  if (Number(req.headers.get("Content-Length") || "0") > 4096) return responseJson({ error: "Solicitud no válida." }, 413);
  if (!AUTH_KEY || !SERVICE_KEY || !SUPABASE_URL) return responseJson({ error: "Servicio no configurado." }, 503);
  const authorization = req.headers.get("Authorization") || "";
  if (!/^Bearer [\w.-]+$/.test(authorization)) return responseJson({ error: "Inicia sesión en Gestión clínica." }, 401);
  const who = await fetch(SUPABASE_URL + "/auth/v1/user", {
    headers: { "apikey": AUTH_KEY, "Authorization": authorization }, cache: "no-store",
  }).catch(() => null);
  if (!who?.ok) return responseJson({ error: "La sesión ha caducado." }, 401);
  const person = await who.json().catch(() => ({}));
  if (person?.id !== OWNER_ID) return responseJson({ error: "Acceso no autorizado." }, 403);

  let body: Record<string, unknown>;
  try { body = await req.json() as Record<string, unknown>; } catch { return responseJson({ error: "Solicitud no válida." }, 400); }
  const documentId = typeof body.document_id === "string" ? body.document_id : "";
  const explicitRetry = body.retry === true;
  if (!UUID.test(documentId)) return responseJson({ error: "Archivo no válido." }, 400);

  // The email recipient is always obtained from the protected patient record.
  const documentResponse = await fetch(
    SUPABASE_URL + "/rest/v1/clinical_documents?select=id,patient_id,shared_at,patient:clinical_patients(email,status)" +
      "&id=eq." + encodeURIComponent(documentId) +
      "&shared_at=not.is.null&share_revoked_at=is.null&limit=1",
    { headers: serviceHeaders(), cache: "no-store" },
  );
  if (!documentResponse.ok) return responseJson({ error: "No se ha podido comprobar el acceso del archivo." }, 503);
  const doc = (await documentResponse.json().catch(() => []))?.[0];
  if (!doc?.id || !doc?.shared_at || doc.patient?.status === "archived") {
    return responseJson({ error: "El archivo no está compartido con un paciente activo." }, 404);
  }
  const shareStamp = String(doc.shared_at);
  const recipient = typeof doc.patient?.email === "string" ? doc.patient.email.trim().toLowerCase() : "";
  const currentStamp = new Date().toISOString();

  // This INSERT owns the unique (document_id,shared_at) slot. Concurrent invocations
  // cannot send twice. Only an explicit, clinician-initiated retry may reclaim a failure.
  const claimed = await fetch(NOTICES + "?on_conflict=document_id,shared_at&select=document_id", {
    method: "POST",
    headers: serviceHeaders({ "Prefer": "resolution=ignore-duplicates,return=representation" }),
    body: JSON.stringify({ document_id: documentId, shared_at: shareStamp, status: "sending", claimed_at: currentStamp }),
  });
  if (!claimed.ok) return responseJson({ error: "No se ha podido registrar el aviso." }, 503);
  let acquired = ((await claimed.json().catch(() => [])) as unknown[]).length === 1;
  if (!acquired) {
    const previous = await getCurrentNotice(documentId, shareStamp);
    if (!previous) return responseJson({ error: "No se ha podido comprobar el estado del aviso." }, 503);
    if (previous.status === "sent") return responseJson({ ok: true, status: "sent", already_sent: true, sent_at: previous.sent_at });
    if (!explicitRetry) {
      return responseJson({ ok: false, status: previous.status, error: previous.status === "failed" ?
        "El aviso no pudo enviarse. Puedes reintentarlo desde la ficha." :
        "El aviso ya se está procesando." }, 409);
    }
    // Claims left in 'sending' after an interruption must be older than ten minutes.
    const stale = previous.status === "sending" &&
      Number.isFinite(Date.parse(previous.claimed_at)) &&
      Date.now() - Date.parse(previous.claimed_at) > 10 * 60_000;
    if (previous.status !== "failed" && !stale) return responseJson({ error: "El aviso ya se está procesando." }, 409);
    acquired = await updateNotice(documentId, shareStamp,
      { status: "sending", claimed_at: currentStamp, error_code: null },
      "&status=eq." + (stale ? "sending" : "failed") +
      (stale ? "&claimed_at=lt." + encodeURIComponent(new Date(Date.now() - 10 * 60_000).toISOString()) : ""));
    if (!acquired) return responseJson({ error: "Este aviso ya lo está gestionando otra solicitud." }, 409);
  }

  const fail = async (reason: string, clientMessage: string, status = 502) => {
    await updateNotice(documentId, shareStamp, { status: "failed", error_code: reason }, "&status=eq.sending").catch(() => false);
    return responseJson({ ok: false, status: "failed", error: clientMessage }, status);
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return fail("missing_email", "El paciente no tiene una dirección de correo válida.", 400);
  }
  if (!BREVO_KEY) return fail("email_service_unconfigured", "El servicio de correo no está configurado.", 503);

  // Recheck immediately before contacting the email provider (handles revocation).
  const stillShared = await fetch(
    SUPABASE_URL + "/rest/v1/clinical_documents?select=id&id=eq." + encodeURIComponent(documentId) +
      "&patient_id=eq." + encodeURIComponent(String(doc.patient_id)) +
      "&shared_at=eq." + encodeURIComponent(shareStamp) + "&share_revoked_at=is.null&limit=1",
    { headers: serviceHeaders(), cache: "no-store" });
  if (!stillShared.ok || ((await stillShared.json().catch(() => [])) as unknown[]).length !== 1) {
    return fail("access_revoked", "El archivo ya no está disponible para el paciente.", 409);
  }

  const { html, text } = emailMessage();
  const mail = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_KEY, "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      sender: { name: "Carolina Sánchez Girona", email: "contact@carolinasanchezgirona.com" },
      to: [{ email: recipient }],
      replyTo: { email: "contact@carolinasanchezgirona.com", name: "Carolina Sánchez Girona" },
      subject: "Tienes una novedad en Mi espacio",
      htmlContent: html,
      textContent: text,
      tags: ["patient-portal-file-notice"],
      headers: { "X-Mailin-Track-Opens": "0", "X-Mailin-Track-Clicks": "0" },
    }),
  }).catch(() => null);
  if (!mail?.ok) return fail("provider_rejected", "El correo no se ha podido enviar. Puedes reintentarlo.");

  const provider = await mail.json().catch(() => ({}));
  const sentAt = new Date().toISOString();
  const recorded = await updateNotice(documentId, shareStamp, {
    status: "sent",
    sent_at: sentAt,
    provider_message_id: typeof provider.messageId === "string" ? provider.messageId.slice(0, 300) : null,
    error_code: null,
  }, "&status=eq.sending").catch(() => false);
  if (!recorded) return responseJson({
    ok: true, status: "sending",
    warning: "El servicio de correo aceptó el aviso, pero no se pudo actualizar su registro. Evita repetirlo.",
  });
  return responseJson({ ok: true, status: "sent", sent_at: sentAt });
});
