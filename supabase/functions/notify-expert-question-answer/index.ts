export {};

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

const PROJECT_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const ADMIN_EMAIL = "contact@carolinasanchezgirona.com";
const ADMIN_USER_ID = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const ALLOWED_ORIGINS = new Set([
  "https://carolinasanchezgirona.com",
  "https://www.carolinasanchezgirona.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(body: Record<string, unknown>, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json; charset=utf-8" },
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.has(origin)) return json({ error: "Origen no permitido." }, 403, "https://carolinasanchezgirona.com");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405, origin);

  const authorization = req.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ") || !PROJECT_URL || !SERVICE_ROLE_KEY) {
    return json({ error: "No autorizado." }, 401, origin);
  }
  const userResponse = await fetch(`${PROJECT_URL}/auth/v1/user`, {
    headers: { "apikey": SERVICE_ROLE_KEY, "Authorization": authorization },
  });
  if (!userResponse.ok) return json({ error: "No autorizado." }, 401, origin);
  const user = await userResponse.json();
  if (user.id !== ADMIN_USER_ID) return json({ error: "No autorizado." }, 403, origin);

  let body: { id?: unknown };
  try { body = await req.json(); } catch { return json({ error: "Solicitud no válida." }, 400, origin); }
  if (typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id)) {
    return json({ error: "Pregunta no válida." }, 400, origin);
  }

  const questionResponse = await fetch(
    `${PROJECT_URL}/rest/v1/expert_questions?id=eq.${encodeURIComponent(body.id)}&select=id,contact_email,status,anchor_slug,notified_at`,
    { headers: { "apikey": SERVICE_ROLE_KEY, "Authorization": `Bearer ${SERVICE_ROLE_KEY}` } },
  );
  if (!questionResponse.ok) return json({ error: "No se ha podido leer la pregunta." }, 500, origin);
  const rows = await questionResponse.json();
  const question = rows[0];
  if (!question || question.status !== "published" || !question.anchor_slug) {
    return json({ error: "La pregunta todavía no está publicada." }, 409, origin);
  }
  if (!question.contact_email || question.notified_at) return json({ ok: true, skipped: true }, 200, origin);
  if (!BREVO_API_KEY) return json({ error: "El correo no está configurado." }, 503, origin);

  const publicUrl = `https://carolinasanchezgirona.com/pregunta-a-carolina/#${question.anchor_slug}`;
  const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      sender: { name: "Carolina Sánchez", email: ADMIN_EMAIL },
      to: [{ email: question.contact_email }],
      subject: "Tu pregunta ya tiene respuesta",
      htmlContent: `<p>Ya he publicado una respuesta anonimizada a tu pregunta en <strong>Pregunta a Carolina</strong>.</p><p><a href="${publicUrl}">Leer la respuesta</a></p><p>Recuerda que esta información es divulgativa y no sustituye una valoración profesional individual.</p><p>Un saludo,<br>Carolina Sánchez Girona</p>`,
    }),
  });
  if (!emailResponse.ok) {
    console.error("Brevo answer notification failed", emailResponse.status);
    return json({ error: "No se ha podido enviar el aviso." }, 502, origin);
  }

  const updateResponse = await fetch(`${PROJECT_URL}/rest/v1/expert_questions?id=eq.${encodeURIComponent(body.id)}`, {
    method: "PATCH",
    headers: {
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({ notified_at: new Date().toISOString() }),
  });
  if (!updateResponse.ok) console.error("Could not mark notification", updateResponse.status);
  return json({ ok: true }, 200, origin);
});
