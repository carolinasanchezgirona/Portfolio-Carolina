const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";

const serviceHeaders = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: "Bearer " + SERVICE_ROLE_KEY,
  "Content-Type": "application/json",
};

const cors = {
  "Access-Control-Allow-Origin": "https://carolinasanchezgirona.com",
  "Access-Control-Allow-Headers": "content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8" },
  });
}

function normalizeEmail(value: unknown) {
  const email = String(value ?? "").trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  return email;
}

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomCode() {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(bytes[0] % 1000000).padStart(6, "0");
}

function randomToken(bytes = 32) {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  let binary = "";
  data.forEach((value) => { binary += String.fromCharCode(value); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function hashCode(email: string, code: string) {
  return await sha256(code + "|" + email + "|" + SERVICE_ROLE_KEY);
}

async function requestCode(email: string) {
  const generic = { ok: true, message: "Si el correo corresponde a una cuenta con acceso, recibirás un código en unos minutos." };
  if (!SERVICE_ROLE_KEY || !BREVO_API_KEY) return json({ error: "El acceso por correo no está configurado." }, 503);

  const patientsResponse = await fetch(
    SUPABASE_URL + "/rest/v1/clinical_patients?select=id,status&email=ilike." + encodeURIComponent(email) + "&status=neq.archived&limit=3",
    { headers: serviceHeaders, cache: "no-store" },
  );
  if (!patientsResponse.ok) return json(generic);
  const patients = await patientsResponse.json().catch(() => []);
  if (!Array.isArray(patients) || patients.length !== 1) return json(generic);

  const patient = patients[0] as { id?: string };
  if (!patient.id) return json(generic);

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recentResponse = await fetch(
    SUPABASE_URL + "/rest/v1/patient_portal_login_codes?select=id,created_at&patient_id=eq." + encodeURIComponent(patient.id) +
      "&email_normalized=eq." + encodeURIComponent(email) + "&created_at=gte." + encodeURIComponent(oneHourAgo) +
      "&order=created_at.desc&limit=10",
    { headers: serviceHeaders, cache: "no-store" },
  );
  const recent = recentResponse.ok ? await recentResponse.json().catch(() => []) : [];
  if (Array.isArray(recent) && recent.length) {
    const lastCreated = Date.parse(String(recent[0]?.created_at || ""));
    if (Number.isFinite(lastCreated) && Date.now() - lastCreated < 60 * 1000) return json(generic);
    if (recent.length >= 5) return json(generic);
  }

  const code = randomCode();
  const now = new Date();
  const expires = new Date(now.getTime() + 10 * 60 * 1000);
  const codeHash = await hashCode(email, code);

  const insert = await fetch(SUPABASE_URL + "/rest/v1/patient_portal_login_codes?select=id", {
    method: "POST",
    headers: { ...serviceHeaders, Prefer: "return=representation" },
    body: JSON.stringify({
      patient_id: patient.id,
      email_normalized: email,
      code_hash: codeHash,
      expires_at: expires.toISOString(),
    }),
  });
  const inserted = await insert.json().catch(() => []);
  const loginId = Array.isArray(inserted) ? inserted[0]?.id : null;
  if (!insert.ok || !loginId) return json({ error: "No se ha podido preparar el acceso." }, 502);

  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#f5f8fb;font-family:Arial,sans-serif;color:#233746"><div style="max-width:620px;margin:0 auto;padding:32px 18px"><div style="background:#fff;border:1px solid #d5e3ee;border-radius:18px;padding:32px"><p style="color:#08A6A0;font-size:13px;font-weight:700;letter-spacing:.04em">MI ESPACIO</p><h1 style="font-size:25px;color:#173A5E">Tu código de acceso</h1><p>Introduce este código en Mi espacio:</p><p style="font-size:34px;letter-spacing:8px;font-weight:800;color:#173A5E;text-align:center;margin:28px 0">${code}</p><p>El código caduca en 10 minutos y solo puede utilizarse una vez.</p><p style="margin-top:28px">Carolina Sánchez Girona</p></div><p style="color:#667983;font-size:12px">Si no has solicitado este acceso, puedes ignorar este correo. No respondas incluyendo información clínica.</p></div></body></html>`;
  const textContent = `Tu código para Mi espacio es: ${code}\n\nCaduca en 10 minutos y solo puede utilizarse una vez.\n\nSi no has solicitado este acceso, ignora este correo.\n\nCarolina Sánchez Girona`;

  const sent = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Carolina Sánchez Girona", email: "contact@carolinasanchezgirona.com" },
      to: [{ email }],
      replyTo: { email: "contact@carolinasanchezgirona.com", name: "Carolina Sánchez Girona" },
      subject: "Tu código para Mi espacio",
      htmlContent: html,
      textContent,
      tags: ["patient-portal-login"],
      headers: { "X-Mailin-Track-Opens": "0", "X-Mailin-Track-Clicks": "0" },
    }),
  });

  if (!sent.ok) {
    await fetch(SUPABASE_URL + "/rest/v1/patient_portal_login_codes?id=eq." + encodeURIComponent(String(loginId)), {
      method: "DELETE",
      headers: serviceHeaders,
    }).catch(() => null);
    return json({ error: "No se ha podido enviar el código." }, 502);
  }

  await fetch(
    SUPABASE_URL + "/rest/v1/patient_portal_login_codes?created_at=lt." + encodeURIComponent(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    { method: "DELETE", headers: serviceHeaders },
  ).catch(() => null);

  return json(generic);
}

async function verifyCode(email: string, code: string) {
  if (!SERVICE_ROLE_KEY) return json({ error: "El acceso por correo no está configurado." }, 503);
  if (!/^\d{6}$/.test(code)) return json({ error: "Código no válido o caducado." }, 401);

  const response = await fetch(
    SUPABASE_URL + "/rest/v1/patient_portal_login_codes?select=id,patient_id,code_hash,expires_at,attempts&email_normalized=eq." +
      encodeURIComponent(email) + "&consumed_at=is.null&order=created_at.desc&limit=1",
    { headers: serviceHeaders, cache: "no-store" },
  );
  const rows = response.ok ? await response.json().catch(() => []) : [];
  const item = Array.isArray(rows) ? rows[0] : null;
  if (!item) return json({ error: "Código no válido o caducado." }, 401);

  const attempts = Number(item.attempts || 0);
  const expires = Date.parse(String(item.expires_at || ""));
  if (!Number.isFinite(expires) || expires < Date.now() || attempts >= 5) {
    return json({ error: "Código no válido o caducado." }, 401);
  }

  const candidate = await hashCode(email, code);
  if (candidate !== String(item.code_hash || "")) {
    await fetch(SUPABASE_URL + "/rest/v1/patient_portal_login_codes?id=eq." + encodeURIComponent(String(item.id)), {
      method: "PATCH",
      headers: { ...serviceHeaders, Prefer: "return=minimal" },
      body: JSON.stringify({ attempts: Math.min(attempts + 1, 10) }),
    }).catch(() => null);
    return json({ error: "Código no válido o caducado." }, 401);
  }

  const now = new Date();
  await fetch(SUPABASE_URL + "/rest/v1/patient_portal_login_codes?id=eq." + encodeURIComponent(String(item.id)), {
    method: "PATCH",
    headers: { ...serviceHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({ consumed_at: now.toISOString() }),
  });

  const rawSession = randomToken();
  const tokenHash = await sha256(rawSession);
  const sessionExpires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const sessionResponse = await fetch(SUPABASE_URL + "/rest/v1/patient_portal_sessions", {
    method: "POST",
    headers: { ...serviceHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({
      patient_id: item.patient_id,
      token_hash: tokenHash,
      expires_at: sessionExpires.toISOString(),
      last_seen_at: now.toISOString(),
    }),
  });
  if (!sessionResponse.ok) return json({ error: "No se ha podido iniciar la sesión." }, 502);

  await fetch(
    SUPABASE_URL + "/rest/v1/patient_portal_sessions?expires_at=lt." + encodeURIComponent(now.toISOString()),
    { method: "DELETE", headers: serviceHeaders },
  ).catch(() => null);

  return json({ ok: true, session_token: rawSession, expires_at: sessionExpires.toISOString() });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405);

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return json({ error: "Solicitud no válida." }, 400); }

  const action = String(body.action ?? "");
  const email = normalizeEmail(body.email);
  if (!email) return json({ error: "Introduce un correo válido." }, 400);

  if (action === "request") return await requestCode(email);
  if (action === "verify") return await verifyCode(email, String(body.code ?? "").trim());
  return json({ error: "Acción no válida." }, 400);
});
