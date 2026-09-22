export {};

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

const PROJECT_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const ADMIN_EMAIL = "contact@carolinasanchezgirona.com";
const ALLOWED_ORIGINS = new Set([
  "https://carolinasanchezgirona.com",
  "https://www.carolinasanchezgirona.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);
const CATEGORIES = new Set([
  "psicologia", "ansiedad-animo", "relaciones-duelo", "neuropsicologia",
  "memoria-deterioro", "familiares-cuidadores", "otra",
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

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!email) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254 ? email : "invalid";
}

async function sendEmail(to: string, subject: string, htmlContent: string) {
  if (!BREVO_API_KEY) return;
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      sender: { name: "Carolina Sánchez", email: ADMIN_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });
  if (!response.ok) console.error("Brevo notification failed", response.status);
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.has(origin)) {
    return json({ error: "Origen no permitido." }, 403, "https://carolinasanchezgirona.com");
  }
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405, origin);
  if (Number(req.headers.get("content-length") ?? "0") > 20_000) {
    return json({ error: "Solicitud demasiado grande." }, 413, origin);
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Solicitud no válida." }, 400, origin); }
  if (typeof body.website === "string" && body.website.trim()) return json({ ok: true }, 202, origin);

  const question = typeof body.question === "string" ? body.question.trim().replace(/\s+/g, " ") : "";
  const category = typeof body.category === "string" ? body.category : "";
  const email = normalizeEmail(body.email);
  if (question.length < 80 || question.length > 1200) {
    return json({ error: "La pregunta debe tener entre 80 y 1.200 caracteres." }, 400, origin);
  }
  if (!CATEGORIES.has(category)) return json({ error: "Selecciona un tema válido." }, 400, origin);
  if (email === "invalid") return json({ error: "El correo no parece válido." }, 400, origin);
  if (body.privacyAccepted !== true || body.healthConsent !== true || body.publishConsent !== true) {
    return json({ error: "Necesitamos las tres confirmaciones para recibir la pregunta." }, 400, origin);
  }
  if (!PROJECT_URL || !SERVICE_ROLE_KEY) return json({ error: "Servicio no disponible." }, 503, origin);

  const insertResponse = await fetch(`${PROJECT_URL}/rest/v1/expert_questions`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      question_text: question,
      category,
      contact_email: email,
      privacy_accepted: true,
      consent_health: true,
      consent_publish: true,
      status: "pending",
    }),
  });
  if (!insertResponse.ok) {
    console.error("Question insert failed", insertResponse.status);
    return json({ error: "No hemos podido guardar la pregunta. Inténtalo de nuevo." }, 500, origin);
  }

  await Promise.all([
    sendEmail(ADMIN_EMAIL, "Nueva pregunta para revisar", '<p>Ha llegado una nueva pregunta a <strong>Pregunta a Carolina</strong>.</p><p>Revísala desde el panel privado antes de publicarla.</p><p><a href="https://carolinasanchezgirona.com/admin/preguntas/">Abrir panel de preguntas</a></p>'),
    email ? sendEmail(email, "He recibido tu pregunta", '<p>Gracias por escribir a <strong>Pregunta a Carolina</strong>.</p><p>He recibido tu consulta. La revisaré y, si encaja con el carácter divulgativo de la sección, publicaré una versión anonimizada junto con mi respuesta.</p><p>Este canal no sustituye una consulta profesional ni sirve para urgencias. En caso de emergencia, llama al 112; si existe riesgo de conducta suicida, también puedes llamar al 024.</p><p>Un saludo,<br>Carolina Sánchez Girona</p>') : Promise.resolve(),
  ]);

  return json({ ok: true }, 201, origin);
});
