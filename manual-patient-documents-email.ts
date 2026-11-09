/** Envío de documentos informativos exclusivamente tras una acción explícita de la profesional. */
type Env = { BREVO_API_KEY?: string; SUPABASE_SERVICE_ROLE_KEY?: string };
const SUPABASE = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const BASE = "https://carolinasanchezgirona.com";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;
type Doc = "consentimientos" | "privacidad";
const documents: Record<Doc, { title: string; url: string }> = {
  consentimientos: { title: "Información y consentimientos clínicos", url: BASE + "/consentimientos/" },
  privacidad: { title: "Política de privacidad y protección de datos", url: BASE + "/privacidad/" },
};
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
const htmlEsc = (text: string) => text.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]!));

function message(selected: Doc[]) {
  const intro = "Te facilito la documentación informativa de la consulta para que puedas leerla con tranquilidad. Podremos revisar cualquier duda antes de iniciar el procedimiento que corresponda.";
  const note = "Estos enlaces no constituyen una firma ni la aceptación de un consentimiento. No envíes informes ni información de salud por correo electrónico.";
  const lines = selected.map(key => documents[key].title + ": " + documents[key].url);
  const textContent = "Hola,\n\n" + intro + "\n\n" + lines.join("\n") + "\n\n" + note + "\n\nUn saludo,\nCarolina Sánchez Girona";
  const links = selected.map(key => "<li style=\"margin:12px 0\"><a href=\"" + documents[key].url + "\" style=\"color:#466776\">" + htmlEsc(documents[key].title) + "</a></li>").join("");
  const htmlContent = '<!doctype html><html lang="es"><body style="font-family:Arial,sans-serif;color:#273642;background:#f2efe7;margin:0"><main style="max-width:620px;margin:0 auto;padding:28px 20px"><div style="background:#fff;padding:30px;border-radius:12px;border:1px solid #d4dde0"><h1 style="font-size:23px;font-weight:500">Documentación de la consulta</h1><p>Hola,</p><p style="line-height:1.6">' + htmlEsc(intro) + '</p><ul style="line-height:1.5">' + links + '</ul><p style="font-size:13px;line-height:1.6;color:#596d77">' + htmlEsc(note) + '</p><p>Un saludo,<br>Carolina Sánchez Girona</p></div></main></body></html>';
  return { textContent, htmlContent };
}

export async function manualPatientDocumentsEmail(
  request: Request,
  env: Env,
  verifyOwner: (request: Request) => Promise<boolean>,
  sameOrigin: (request: Request) => boolean,
): Promise<Response> {
  if (!["GET", "POST"].includes(request.method)) return json({ error: "Método no permitido." }, 405);
  if (!sameOrigin(request)) return json({ error: "Origen no permitido." }, 403);
  if (!await verifyOwner(request)) return json({ error: "Acceso profesional no autorizado." }, 401);
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return json({ error: "No se ha configurado la consulta de destinatarios." }, 503);
  if (Number(request.headers.get("content-length") || "0") > 2048) return json({ error: "Solicitud demasiado extensa." }, 413);

  let body: Record<string, unknown> = {};
  if (request.method === "POST") {
    if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Formato no válido." }, 415);
    try {
      const raw = await request.text();
      if (raw.length > 2048) return json({ error: "Solicitud demasiado extensa." }, 413);
      body = JSON.parse(raw);
      if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Solicitud no válida." }, 400);
    } catch { return json({ error: "Solicitud no válida." }, 400); }
  }
  const id = request.method === "GET" ? new URL(request.url).searchParams.get("patient_id") : body.patient_id;
  if (typeof id !== "string" || !UUID.test(id)) return json({ error: "Paciente no válido." }, 400);
  const headers = { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY };
  const response = await fetch(SUPABASE + "/rest/v1/clinical_patients?select=id,email,status&id=eq." + encodeURIComponent(id) + "&limit=1",
    { headers, cache: "no-store" }).catch(() => null);
  if (!response?.ok) return json({ error: "No se ha podido verificar el destinatario." }, 503);
  const patients = await response.json().catch(() => []) as Array<{ id: string; email: string | null; status?: string }>;
  const patient = patients[0];
  if (!patient || patient.status === "archived") return json({ error: "El paciente no está activo." }, 404);
  const email = typeof patient.email === "string" ? patient.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL.test(email)) return json({ error: "La ficha no tiene un correo electrónico válido." }, 409);
  if (request.method === "GET") return json({ email, configured: Boolean(env.BREVO_API_KEY) });

  // El navegador nunca decide el destinatario. Se obliga a verificar el correo
  // que la profesional acaba de ver frente al que consta en la ficha persistida.
  if (body.confirm_recipient !== true || body.email_confirmation !== email)
    return json({ error: "El destinatario ha cambiado. Actualiza la ficha y vuelve a comprobarlo." }, 409);
  const requested = body.documents;
  if (!Array.isArray(requested) || !requested.length || requested.length > 2 ||
      requested.some(v => v !== "consentimientos" && v !== "privacidad") ||
      new Set(requested).size !== requested.length)
    return json({ error: "Selecciona uno o ambos documentos." }, 400);
  if (!env.BREVO_API_KEY) return json({ error: "El servicio de correo no está configurado." }, 503);
  const selected = requested as Doc[];
  const { htmlContent, textContent } = message(selected);
  const sent = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": env.BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "Carolina Sánchez Girona", email: "contact@carolinasanchezgirona.com" },
      to: [{ email }],
      replyTo: { name: "Carolina Sánchez Girona", email: "contact@carolinasanchezgirona.com" },
      subject: "Documentación informativa de la consulta",
      htmlContent, textContent, tags: ["manual-patient-legal-documents"],
      headers: { "X-Mailin-Track-Opens": "0", "X-Mailin-Track-Clicks": "0" },
    }),
    signal: AbortSignal.timeout(20_000),
  }).catch(() => null);
  if (!sent) return json({ error: "No ha sido posible confirmar si el proveedor aceptó el envío. Comprueba Brevo antes de reintentarlo." }, 502);
  if (!sent.ok) return json({ error: "El proveedor de correo ha rechazado el envío." }, 502);
  return json({ accepted: true, email, documents: selected, note: "Aceptado por el proveedor; entrega no confirmada." });
}
