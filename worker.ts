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
  const requestedFamily = editorialText(data.family, 24) || "auto";
  const requestedFormat = editorialText(data.format, 24) || "carrusel";
  const goal = editorialText(data.goal, 32) || "automatico";
  const humor = editorialText(data.humor, 32) || "automatico";
  const source = editorialText(data.source, 15000);
  const notes = editorialText(data.notes, 1600);
  const remix = editorialText(data.remix, 120);
  const recent = Array.isArray(data.recent) ? data.recent.slice(0, 8).map((post: unknown) => {
    const item = post && typeof post === "object" ? post as Record<string, unknown> : {};
    return { tema: editorialText(item.topic, 95), formato: editorialText(item.format, 24), enfoque: editorialText(item.angle, 45) };
  }) : [];
  const requestedCount = Number(data.slide_count) || 0;
  if (topic.length < 4) return editorialJson({ error: "Introduce un tema concreto de al menos cuatro caracteres." }, 400);
  if (!["auto", "educativa", "pregunta", "profesional"].includes(requestedFamily)) return editorialJson({ error: "Familia editorial no reconocida." }, 400);
  if (!["auto", "carrusel", "individual", "story", "reel"].includes(requestedFormat)) return editorialJson({ error: "Formato no reconocido." }, 400);
  if (!["automatico", "alcance", "interaccion", "guardados", "web", "leads", "consulta"].includes(goal)) return editorialJson({ error: "Objetivo editorial no reconocido." }, 400);
  if (!["automatico", "sin", "toque", "protagonista", "ironia", "absurdo"].includes(humor)) return editorialJson({ error: "Tipo de humor no reconocido." }, 400);
  const system = [
    "Eres directora editorial, estratega de captación y editora científica de Carolina Sánchez, psicóloga y neuropsicóloga en España.",
    "Crea contenido ORIGINAL en español de España, claro, brillante, útil y con voz profesional reconocible. Ni lenguaje de autoayuda genérica ni titulares sensacionalistas.",
    "La audiencia debe descubrir, confiar y, cuando encaje, visitar carolinasanchezgirona.com o informarse sobre la consulta. No prometas seguidores, resultados ni conversiones.",
    "Elige un ÁNGULO concreto: humor cotidiano, educación útil, pregunta ilustrativa, objeción a la terapia, microherramienta, identificación, perspectiva profesional o conversión ética.",
    "Cuando el humor encaje, usa ironía inteligente, observaciones cotidianas, diálogos divertidos o contradicciones humanas. No bromees sobre el sufrimiento, los pacientes, diagnósticos, violencia, trauma, crisis, duelo ni sobre terceras personas. Si un tema sensible no admite humor, devuelve humor='sin' incluso si se solicita.",
    "Cuando se pida humor protagonista, la pieza debe ser ingeniosa sin perder la enseñanza psicológica. El humor automático puede elegir sin humor, un toque, ironía o protagonista según el tema.",
    "No hagas diagnósticos, estadísticas, promesas terapéuticas ni afirmaciones causales sin fundamento; evita las frases 'no estás rota', 'tu cerebro te está diciendo' y similares.",
    "No inventes pacientes, testimonios, preguntas reales, citas bibliográficas ni experiencias propias de la profesional. Si usas familia='pregunta', indica de forma legible que es un ejemplo ilustrativo.",
    "Si hay un artículo de origen úsalo como material de apoyo, sin copiar extensamente ni inventar resultados, datos o referencias.",
    "Sigue identidad visual: Fraunces + DM Sans, azul #173A5E, un solo acento turquesa #08A6A0 o coral #F2766B, fondos blancos y #EAF6FB, fotografía editorial natural de colores vivos y cero clichés clínicos, sepia o beige apagado.",
    "Para 'carrusel' crea 4 a 7 diapositivas con portada potente, narrativa, utilidad y cierre. Para 'individual' UNA diapositiva con frase central y un pie desarrollado. Para 'story' crea 3 a 6 pantallas verticales 9:16, una o dos con encuesta/pregunta/llamada a visitar la web. Para 'reel' entrega 3 a 5 ESCENAS de storyboard vertical 9:16 con gancho de 0-3 s, guion hablado/voz en off, plano, duración aproximada y texto en pantalla. La aplicación generará imágenes del storyboard y portada, NO un vídeo MP4.",
    "Si formato='auto', elige el formato que mejor conecte el tema con el objetivo de captación y explica brevemente tu motivo. El formato solicitado explícitamente es obligatorio.",
    "El objetivo puede ser alcance, interaccion, guardados, web, leads o consulta; si es automatico escoge uno. Usa CTA acorde al objetivo, sin urgencia artificial ni manipulación.",
    "Los textos de pantalla deben ser breves y legibles; distribuye información entre caption y escenas. Varia composiciones, no repitas mas de dos seguidas.",
    "Fotografías: 1 a 3 escenas con foto_prompt EN INGLÉS, con composición fotografica, dividida o profesional. Resto tipograficas o pregunta. Foto_prompt describe escena y espacio negativo, NO texto incrustado.",
    "Devuelve SOLO JSON: {formato:'carrusel'|'individual'|'story'|'reel',familia:'educativa'|'pregunta'|'profesional',objetivo:'alcance'|'interaccion'|'guardados'|'web'|'leads'|'consulta',humor:'sin'|'toque'|'protagonista'|'ironia'|'absurdo',enfoque:string,motivo:string,concepto:string,titulo:string,subtitulo:string,diapositivas:[{titulo:string,texto:string,composicion:'fotografica'|'tipografica'|'dividida'|'pregunta'|'profesional',foto_prompt:string,alt:string,interaccion:string,voz:string,plano:string,duracion:string,texto_pantalla:string}],guion_reel:string,pie:string,cta:string,hashtags:string[]}.",
    "Para reels escribe guion_reel completo y en cada escena voz, plano, duracion y texto_pantalla. Para stories indica interaccion por pantalla cuando proceda. No finjas tener fotografías reales ni resultado de vídeo.",
    "Cada título de diapositiva máximo 70 caracteres, texto máximo 340, ALT máximo 180, caption máximo 2000, 3 a 6 hashtags pertinentes. No añadas referencias bibliográficas que no se hayan verificado.",
    "Evita repetir los enfoques de publicaciones recientes aportadas. La revisión clínica, visual y bibliográfica humana es obligatoria."
  ].join("\n");
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify({
            tema: topic, formato: requestedFormat, familia: requestedFamily,
            objetivo: goal, humor: humor, ajuste: remix, instrucciones: notes,
            texto_articulo: source, publicaciones_recientes: recent,
            numero_diapositivas: requestedCount > 0 ? requestedCount : "automático según formato"
          }) }
        ]
      })
    });
    const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    if (!response.ok || !result.choices?.[0]?.message?.content) {
      console.error("Instagram content generation failure", response.status);
      return editorialJson({ error: response.status === 429 ? "Límite de generación alcanzado. Prueba más tarde." : "No se ha podido generar el contenido." }, response.status === 429 ? 429 : 502);
    }
    const draft = JSON.parse(result.choices[0].message.content) as Record<string, unknown>;
    const allowedFormats = ["carrusel", "individual", "story", "reel"];
    const format = requestedFormat === "auto" && allowedFormats.includes(String(draft.formato)) ? String(draft.formato) : requestedFormat === "auto" ? "carrusel" : requestedFormat;
    const max = format === "individual" ? 1 : format === "story" ? 6 : format === "reel" ? 5 : 7;
    const min = format === "individual" ? 1 : format === "carrusel" ? 4 : 3;
    const slides = Array.isArray(draft.diapositivas) ? draft.diapositivas.slice(0, max) : [];
    if (slides.length < min || slides.length > max || (requestedFormat !== "auto" && requestedCount > 0 && slides.length !== (format === "individual" ? 1 : Math.min(max,Math.max(min,requestedCount))))) {
      return editorialJson({ error: "La IA ha devuelto una estructura incompleta. Prueba a generar de nuevo." }, 502);
    }
    const allowedLayouts = ["fotografica", "tipografica", "dividida", "pregunta", "profesional"];
    const allowedFamilies = ["educativa", "pregunta", "profesional"];
    const family = requestedFamily === "auto" && allowedFamilies.includes(String(draft.familia)) ? String(draft.familia) : requestedFamily === "auto" ? "educativa" : requestedFamily;
    const normalized = {
      formato: format,
      familia: family,
      objetivo: goal === "automatico" && ["alcance","interaccion","guardados","web","leads","consulta"].includes(String(draft.objetivo)) ? draft.objetivo : goal,
      humor: humor === "automatico" ? editorialText(draft.humor, 32) || "sin" : editorialText(draft.humor,32) || humor,
      enfoque: editorialText(draft.enfoque, 120),
      motivo: editorialText(draft.motivo, 350),
      concepto: editorialText(draft.concepto, 320),
      titulo: editorialText(draft.titulo, 90) || topic,
      subtitulo: editorialText(draft.subtitulo, 160),
      diapositivas: slides.map((slide: Record<string, unknown>, i: number) => ({
        titulo: editorialText(slide.titulo, 90) || "Diapositiva " + (i + 1),
        texto: editorialText(slide.texto, 480),
        composicion: allowedLayouts.includes(String(slide.composicion)) ? String(slide.composicion) : "tipografica",
        foto_prompt: editorialText(slide.foto_prompt, 900),
        alt: editorialText(slide.alt, 200),
        interaccion: editorialText(slide.interaccion, 240),
        voz: editorialText(slide.voz, 700),
        plano: editorialText(slide.plano, 280),
        duracion: editorialText(slide.duracion, 65),
        texto_pantalla: editorialText(slide.texto_pantalla, 200)
      })),
      guion_reel: format === "reel" ? editorialText(draft.guion_reel, 4000) : "",
      pie: editorialText(draft.pie, 2300),
      cta: editorialText(draft.cta, 260),
      hashtags: Array.isArray(draft.hashtags) ? draft.hashtags.slice(0, 6).map((tag: unknown) => editorialText(tag, 45)) : [],
      referencias: [],
      aviso_revision: "Borrador de IA pendiente de revisión clínica, bibliográfica y visual. Las imágenes sugeridas son ilustrativas."
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
