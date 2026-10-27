import { NEWSLETTER_CONSENT_TEXT, NEWSLETTER_LIST_NAME, NEWSLETTER_POLICY_VERSION, NEWSLETTER_TEMPLATE_NAME } from "./policy.ts";

export type NewsletterEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; BREVO_API_KEY: string };
type Configuration = { listId: number; templateId: number };
const SITE = "https://carolinasanchezgirona.com";
const attributeTypes: Record<string, string> = {
  CG_NEWSLETTER_CONSENT: "boolean", CG_NEWSLETTER_VERSION: "text",
  CG_NEWSLETTER_REQUESTED_AT: "text", CG_NEWSLETTER_SOURCE: "text", CG_NEWSLETTER_TEXT: "text",
};
function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
async function brevo(env: NewsletterEnv, path: string, body?: unknown) {
  return fetch("https://api.brevo.com/v3" + path, {
    method: body === undefined ? "GET" : "POST",
    headers: { "api-key": env.BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(10_000),
  });
}
export async function prepareNewsletter(env: NewsletterEnv): Promise<Configuration> {
  const [listsResponse, attributesResponse, templatesResponse, sendersResponse] = await Promise.all([
    brevo(env, "/contacts/lists?limit=50"), brevo(env, "/contacts/attributes"), brevo(env, "/smtp/templates?limit=1000"),
    brevo(env, "/senders"),
  ]);
  if (!listsResponse.ok || !attributesResponse.ok || !templatesResponse.ok || !sendersResponse.ok) throw Error("newsletter_configuration_unavailable");
  const lists = await listsResponse.json() as { lists?: Array<{ id: number; name: string }>; count?: number };
  let list = lists.lists?.find(item => item.name === NEWSLETTER_LIST_NAME);
  // Do not select a different list, or fetch any contacts, when looking for the target.
  for (let offset = 50; !list && offset < Math.min(lists.count || 0, 1000); offset += 50) {
    const response = await brevo(env, `/contacts/lists?limit=50&offset=${offset}`);
    if (!response.ok) throw Error("newsletter_list_unavailable");
    const page = await response.json() as typeof lists;
    list = page.lists?.find(item => item.name === NEWSLETTER_LIST_NAME);
  }
  if (!list || !Number.isInteger(list.id)) throw Error("newsletter_list_missing");
  const attributes = await attributesResponse.json() as { attributes?: Array<{ name: string; category: string; type: string }> };
  for (const [name, type] of Object.entries(attributeTypes)) {
    const found = attributes.attributes?.find(item => item.name === name && item.category === "normal");
    if (found && found.type !== type) throw Error("newsletter_attribute_type_mismatch");
    if (!found) {
      const created = await brevo(env, `/contacts/attributes/normal/${name}`, { type });
      if (!created.ok) {
        // A concurrent cold start may have created the same attribute. Verify, never ignore an error.
        const recheck = await brevo(env, "/contacts/attributes");
        const data = recheck.ok ? await recheck.json() as typeof attributes : {};
        if (!data.attributes?.some(item => item.name === name && item.category === "normal" && item.type === type)) throw Error("newsletter_attribute_unavailable");
      }
    }
  }
  const templates = await templatesResponse.json() as { templates?: Array<{ id: number; name: string; isActive: boolean; htmlContent?: string }> };
  let templateId = templates.templates?.find(item => item.name === NEWSLETTER_TEMPLATE_NAME && item.isActive && /doubleoptin/.test(item.htmlContent || ""))?.id;
  if (templateId === undefined) {
    const senders = await sendersResponse.json() as { senders?: Array<{ id: number; name: string; email: string; active: boolean }> };
    const activeSenders = senders.senders?.filter(item => item.active) || [];
    const sender = activeSenders.find(item => item.email === "contact@carolinasanchezgirona.com")
      || activeSenders.find(item => /carolina|demem[oò]ria/i.test(item.name))
      || (activeSenders.length === 1 ? activeSenders[0] : undefined);
    if (!sender) throw Error("newsletter_verified_sender_missing");
    const created = await brevo(env, "/smtp/templates", {
      sender: { name: "Carolina Sánchez Girona", id: sender.id },
      replyTo: "contact@carolinasanchezgirona.com", templateName: NEWSLETTER_TEMPLATE_NAME,
      subject: "Confirma tu suscripción a los recursos gratuitos", isActive: true, tag: "website-newsletter-doi",
      htmlContent: `<html lang="es"><body style="font-family:Arial,sans-serif;color:#173A5E;line-height:1.7;max-width:600px;margin:auto;padding:24px"><h1>Confirma tu suscripción</h1><p>Has solicitado recibir recursos gratuitos y novedades de Carolina Sánchez Girona.</p><p>${NEWSLETTER_CONSENT_TEXT}</p><p><a href="{{ doubleoptin }}">Confirmar mi suscripción</a></p><p>Si no has hecho esta solicitud, ignora este mensaje. No se te añadirá a la lista por recibirlo.</p><p>Responsable: Carolina Sánchez Girona (Dememoria). Puedes retirar el consentimiento mediante la baja de cada comunicación o escribiendo a contact@carolinasanchezgirona.com.</p><p><a href="${SITE}/privacidad/">Política de privacidad</a> · <a href="{{ unsubscribe }}">No deseo recibir comunicaciones</a></p></body></html>`,
    });
    if (!created.ok) throw Error("newsletter_template_unavailable");
    const value = await created.json() as { id: number };
    templateId = value.id;
  }
  if (!Number.isInteger(templateId)) throw Error("newsletter_template_invalid");
  return { listId: list.id, templateId: templateId! };
}
async function opaqueKey(env: NewsletterEnv, type: string, value: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.SUPABASE_SERVICE_ROLE_KEY), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`website-newsletter-limit:${type}:${value}`));
  return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, "0")).join("");
}
async function consumeLimit(env: NewsletterEnv, type: string, value: string, max: number, seconds: number) {
  const response = await fetch(env.SUPABASE_URL + "/rest/v1/rpc/consume_website_newsletter_limit", {
    method: "POST", headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_key_hash: await opaqueKey(env, type, value), p_max: max, p_window_seconds: seconds }), signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw Error("newsletter_limits_unavailable");
  return await response.json() === true;
}
async function verifyNewsletterService(request: Request, env: NewsletterEnv) {
  const authorization = request.headers.get("Authorization") || "";
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return false;
  if (authorization === `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`) return true;
  if (!/^Bearer [A-Za-z0-9._~-]{40,4096}$/.test(authorization) || !env.SUPABASE_URL) return false;
  // Rotated service credentials can differ from the Edge runtime's legacy key.
  // Verify against this project's restricted, empty result set. Do not decode
  // or trust an unsigned role claim, and do not request users or clinical data.
  try {
    const verification = await fetch(env.SUPABASE_URL + "/rest/v1/website_newsletter_limits?select=key_hash&limit=0", {
      headers: { apikey: authorization.slice(7), Authorization: authorization },
      cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(5000),
    });
    return verification.status === 200;
  } catch { return false; }
}
export function createNewsletterHandler(env: NewsletterEnv) {
  let configuration: Promise<Configuration> | null = null;
  return async function newsletter(request: Request): Promise<Response> {
    if (!await verifyNewsletterService(request, env)) return json({ error: "No autorizado." }, 401);
    if (request.method === "GET") {
      if (!env.BREVO_API_KEY || !env.SUPABASE_URL) return json({ available: false, reason: !env.BREVO_API_KEY ? "email_not_configured" : "database_not_configured" }, 503);
      try {
        // Readiness initializes only dedicated template/attribute metadata, never a contact or an email.
        if (!configuration) configuration = prepareNewsletter(env).catch(error => { configuration = null; throw error; });
        await configuration;
        return json({ available: true });
      } catch (error) {
        const reason = error instanceof Error && /^newsletter_[a-z_]+$/.test(error.message) ? error.message : "newsletter_configuration_unavailable";
        console.error("[newsletter]", reason);
        return json({ available: false, reason }, 503);
      }
    }
    if (request.method !== "POST") return json({ error: "Método no permitido." }, 405);
    if (!request.headers.get("Content-Type")?.startsWith("application/json")) return json({ error: "Formato no válido." }, 415);
    if (Number(request.headers.get("Content-Length") || 0) > 4096) return json({ error: "Solicitud demasiado grande." }, 413);
    let body: Record<string, unknown>;
    try { const text = await request.text(); if (text.length > 4096) return json({ error: "Solicitud demasiado grande." }, 413); body = JSON.parse(text); }
    catch { return json({ error: "Solicitud no válida." }, 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Solicitud no válida." }, 400);
    if (typeof body.website === "string" && body.website.trim()) return json({ ok: true }, 202);
    if (body.consent !== true || body.policyVersion !== NEWSLETTER_POLICY_VERSION) return json({ error: "Debes aceptar la suscripción y revisar la información de privacidad actual." }, 400);
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (email.length > 254 || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)) return json({ error: "Introduce un correo electrónico válido." }, 400);
    if (!env.BREVO_API_KEY || !env.SUPABASE_URL) return json({ error: "La suscripción no está disponible en este momento. Puedes descargar los recursos sin suscribirte." }, 503);
    const clientIP = request.headers.get("X-Newsletter-Client-IP") || "unknown";
    try {
      if (!await consumeLimit(env, "ip", clientIP, 5, 3600)) return json({ error: "Se han realizado varias solicitudes. Inténtalo más tarde." }, 429);
      if (!await consumeLimit(env, "email", email, 1, 900)) return json({ ok: true }, 202);
      if (!configuration) configuration = prepareNewsletter(env).catch(error => { configuration = null; throw error; });
      const { listId, templateId } = await configuration;
      // Only the provider's DOI endpoint may add a contact after email confirmation.
      // Never create/update a campaign contact directly on initial form submission.
      const response = await brevo(env, "/contacts/doubleOptinConfirmation", {
        email, includeListIds: [listId], templateId,
        redirectionUrl: `${SITE}/suscripcion/confirmada/`, contactPixelTrackingConsent: false,
        attributes: { CG_NEWSLETTER_CONSENT: true, CG_NEWSLETTER_VERSION: NEWSLETTER_POLICY_VERSION,
          CG_NEWSLETTER_REQUESTED_AT: new Date().toISOString(), CG_NEWSLETTER_SOURCE: `${SITE}/suscribete/`, CG_NEWSLETTER_TEXT: NEWSLETTER_CONSENT_TEXT },
      });
      if (response.ok) return json({ ok: true }, 202);
      // Do not disclose whether an address is subscribed or blocked.
      if (response.status === 400) {
        const result = await response.json().catch(() => ({})) as { code?: string };
        if (result.code === "duplicate_parameter") return json({ ok: true }, 202);
      }
      return json({ error: "No se ha podido tramitar la confirmación. Inténtalo más tarde; los recursos gratuitos siguen disponibles." }, 502);
    } catch {
      // No email, raw IP, credentials or provider response body in logs or errors.
      return json({ error: "No se ha podido tramitar la suscripción. Inténtalo más tarde." }, 503);
    }
  };
}
