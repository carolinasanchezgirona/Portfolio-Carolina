// Exclusivamente invocable desde el Worker mediante credencial de servicio.
// El envío se realiza con la configuración transaccional ya existente de Brevo.
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers });
}
function escapeHtml(s: string) {
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
}
Deno.serve(async req => {
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405);
  if (!SERVICE_ROLE_KEY || req.headers.get("authorization") !== "Bearer " + SERVICE_ROLE_KEY)
    return json({ error: "No autorizado." }, 401);
  if (!BREVO_API_KEY) return json({ error: "Servicio de correo no configurado." }, 503);
  if (Number(req.headers.get("content-length") || "0") > 15000)
    return json({ error: "Solicitud demasiado extensa." }, 413);
  let body: Record<string, unknown>;
  try { body = await req.json() as Record<string, unknown>; }
  catch { return json({ error: "Solicitud incorrecta." }, 400); }
  const email = String(body.email ?? "").trim();
  const terms = String(body.terms ?? "");
  const resourceTitle = String(body.resource_title ?? "").trim();
  const price = String(body.amount ?? "");
  const version = String(body.version ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      resourceTitle.length < 1 || resourceTitle.length > 120 ||
      !/^\d+[,.]\d{2} €$/.test(price) ||
      !/^[a-zA-Z0-9_.-]{5,50}$/.test(version) ||
      terms.length < 300 || terms.length > 12000)
    return json({ error: "Información de confirmación inválida." }, 400);
  const document = [
    "Confirmación de compra de contenido digital | Dememòria",
    "Producto: " + resourceTitle, "Precio total: " + price,
    "Fecha de confirmación: " + new Date().toISOString(),
    "Se ha solicitado expresamente el suministro digital inmediato y se ha",
    "reconocido la pérdida del derecho de desistimiento cuando concurren",
    "las condiciones legales del artículo 103.m del Real Decreto Legislativo 1/2007.",
    "Condiciones aceptadas, versión " + version + ":",
    terms,
    "Para incidencias: contact@carolinasanchezgirona.com"
  ].join("\n\n");
  const brevo = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Carolina Sánchez Girona", email: "contact@carolinasanchezgirona.com" },
      to: [{ email }],
      subject: "Confirmación de compra | Dememòria",
      textContent: document,
      htmlContent: '<!doctype html><html lang="es"><body><pre style="white-space:pre-wrap;font:15px/1.5 Arial,sans-serif">' +
        escapeHtml(document) + "</pre></body></html>",
      tags: ["digital-resource-contract"],
      headers: { "X-Mailin-Track-Opens": "0", "X-Mailin-Track-Clicks": "0" }
    })
  }).catch(() => null);
  if (!brevo?.ok) return json({ error: "No se ha podido enviar la confirmación." }, 502);
  const sent = await brevo.json().catch(() => ({})) as Record<string, unknown>;
  const messageId = String(sent.messageId ?? "");
  if (!messageId || messageId.length > 200) return json({ error: "Falta justificante del proveedor de correo." }, 502);
  return json({ ok: true, message_id: messageId });
});
