const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ALLOWED_ORIGIN = "https://carolinasanchezgirona.com";

const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "accept, content-type",
  "Access-Control-Max-Age": "86400",
};

function page(title: string, body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title}</title><style>body{margin:0;background:#f5f8fb;color:#233746;font-family:Arial,sans-serif}.shell{max-width:720px;margin:0 auto;padding:32px 18px}.card{background:#fff;border:1px solid #d5e3ee;border-radius:18px;padding:clamp(24px,5vw,42px);box-shadow:0 16px 50px rgba(31,95,153,.08)}.eyebrow{color:#1f5f99;font-size:13px;font-weight:700;letter-spacing:.08em}h1{font-size:clamp(25px,5vw,34px);line-height:1.2}.material{margin-top:24px;padding:22px;border-radius:14px;background:#eaf3fa;line-height:1.7;white-space:pre-wrap}.note{color:#667983;font-size:13px;line-height:1.5;margin:18px 6px}</style></head><body><main class="shell"><article class="card">${body}</article><p class="note">Este enlace es personal. No lo reenvíes. Si crees que otra persona ha accedido, comunícalo a tu profesional.</p></main></body></html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      },
    },
  );
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function wantsJson(req: Request, url: URL) {
  return url.searchParams.get("format") === "json" || (req.headers.get("Accept") ?? "").includes("application/json");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  const url = new URL(req.url);
  const asJson = wantsJson(req, url);

  if (req.method !== "GET") {
    return asJson
      ? json({ title: "Método no permitido", error: "Método no permitido" }, 405)
      : page("Método no permitido", "<h1>Método no permitido</h1>", 405);
  }

  const token = url.searchParams.get("token") ?? "";
  if (!/^[A-Za-z0-9_-]{40,}$/.test(token)) {
    return asJson
      ? json({ title: "Este enlace no es válido", error: "Solicita un nuevo enlace a tu profesional." }, 404)
      : page("Enlace no válido", '<p class="eyebrow">MATERIAL CLÍNICO</p><h1>Este enlace no es válido</h1><p>Solicita un nuevo enlace a tu profesional.</p>', 404);
  }

  const hash = await sha256(token);
  const headers = { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` };

  const anchorResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/clinical_exercise_assignments?access_token_hash=eq.${hash}&select=id,patient_id,title,content,status,access_expires_at,revoked_at,first_opened_at&limit=1`,
    { headers },
  );

  if (!anchorResponse.ok) {
    return asJson
      ? json({ title: "No disponible", error: "El material no está disponible en este momento." }, 503)
      : page("No disponible", "<h1>El material no está disponible</h1>", 503);
  }

  const item = (await anchorResponse.json())?.[0];
  if (!item || item.revoked_at || !item.access_expires_at || new Date(item.access_expires_at) <= new Date()) {
    return asJson
      ? json({ title: "Este enlace ha caducado", error: "Solicita un nuevo enlace a tu profesional." }, 410)
      : page("Enlace caducado", '<p class="eyebrow">MATERIAL CLÍNICO</p><h1>Este enlace ha caducado</h1><p>Solicita un nuevo enlace a tu profesional.</p>', 410);
  }

  if (!item.first_opened_at) {
    await fetch(`${SUPABASE_URL}/rest/v1/clinical_exercise_assignments?id=eq.${item.id}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ first_opened_at: new Date().toISOString() }),
    });
  }

  if (asJson) {
    const assignmentsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/clinical_exercise_assignments?patient_id=eq.${encodeURIComponent(item.patient_id)}&status=in.(sent,assigned,reviewed)&select=id,title,content,status,assigned_at,review_due_at,created_at&order=created_at.desc`,
      { headers },
    );

    if (!assignmentsResponse.ok) {
      return json({ title: "No disponible", error: "No se ha podido cargar tu material." }, 503);
    }

    const exercises = await assignmentsResponse.json();
    return json({
      ok: true,
      expires_at: item.access_expires_at,
      exercises: Array.isArray(exercises) ? exercises : [],
    });
  }

  return page(
    "Material acordado",
    `<p class="eyebrow">MATERIAL ACORDADO</p><h1>${escapeHtml(item.title)}</h1><div class="material">${escapeHtml(item.content)}</div>`,
  );
});
