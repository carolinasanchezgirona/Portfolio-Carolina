interface Env {
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_WEBHOOK_SECRET_TEST?: string;
  OPENAI_API_KEY?: string;
  OPENAI_TEXT_MODEL?: string;
  OPENAI_IMAGE_MODEL?: string;
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const encoder = new TextEncoder();

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
    "No escribas más de 2000 caracteres en el pie ni más de 6 hashtags."
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
          { role: "user", content: JSON.stringify({ tema: topic, familia: family, instrucciones: notes, texto_articulo: source, diapositivas: slideCount }) }
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (
      url.pathname === "/api/stripe/webhook" ||
      url.pathname === "/api/stripe/webhook/"
    ) {
      return handleStripeWebhook(request, env);
    }

    if (url.pathname === "/api/editorial/generate" || url.pathname === "/api/editorial/generate/") return editorialRequest(request, env, "content");
    if (url.pathname === "/api/editorial/image" || url.pathname === "/api/editorial/image/") return editorialRequest(request, env, "image");
    return env.ASSETS.fetch(request);
  },
};
