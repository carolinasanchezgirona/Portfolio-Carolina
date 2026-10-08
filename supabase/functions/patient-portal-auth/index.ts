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
    SUPABASE_URL + "/rest/v1/clinical_patients?select=id,email,status&status=neq.archived&limit=500",
    { headers: serviceHeaders, cache: "no-store" },
  );
  if (!patientsResponse.ok) return json(generic);
  const patientRows = await patientsResponse.json().catch(() => []);
  const patients = Array.isArray(patientRows)
    ? patientRows.filter((row) => String(row?.email ?? "").trim().toLowerCase() === email)
    : [];
  if (patients.length !== 1) return json(generic);

  const patient = patients[0] as { id?: string };
  if (!patient.id) return json(generic);

  const code = randomCode();
  const now = new Date();
  const expires = new Date(now.getTime() + 10 * 60 * 1000);
  const codeHash = await hashCode(email, code);

  // Atomic issuance enforces one code per minute and at most five per hour,
  // including concurrent requests. The RPC is callable only by service_role.
  const insert = await fetch(SUPABASE_URL + "/rest/v1/rpc/issue_patient_portal_login_code", {
    method: "POST",
    headers: serviceHeaders,
    body: JSON.stringify({
      p_patient_id: patient.id,
      p_email_normalized: email,
      p_code_hash: codeHash,
      p_expires_at: expires.toISOString(),
    }),
  });
  if (!insert.ok) return json({ error: "No se ha podido preparar el acceso." }, 502);
  const inserted = await insert.json().catch(() => null);
  const loginId = typeof inserted === "string" && /^[0-9a-f-]{36}$/i.test(inserted) ? inserted : null;
  if (!loginId) return json(generic);

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

  // A single locked database transaction checks attempts and consumes the
  // code. This prevents racing five attempts or using a code twice.
  const candidate = await hashCode(email, code);
  const response = await fetch(
    SUPABASE_URL + "/rest/v1/rpc/consume_patient_portal_login_code",
    {
      method: "POST",
      headers: serviceHeaders,
      body: JSON.stringify({
        p_email_normalized: email,
        p_candidate_hash: candidate,
      }),
    },
  );
  if (!response.ok) return json({ error: "No se ha podido comprobar el código." }, 502);
  const patientId = await response.json().catch(() => null);
  if (typeof patientId !== "string" || !/^[0-9a-f-]{36}$/i.test(patientId)) {
    return json({ error: "Código no válido o caducado." }, 401);
  }

  const now = new Date();
  const rawSession = randomToken();
  const tokenHash = await sha256(rawSession);
  const sessionExpires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const sessionResponse = await fetch(SUPABASE_URL + "/rest/v1/patient_portal_sessions", {
    method: "POST",
    headers: { ...serviceHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({
      patient_id: patientId,
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

  // The public browser only talks to the same-origin Cloudflare Worker.
  // Supabase Edge Function accepts only the Worker's server-side credential.
  if (!SERVICE_ROLE_KEY || req.headers.get("Authorization") !== "Bearer " + SERVICE_ROLE_KEY) {
    return json({ error: "Acceso no autorizado." }, 401);
  }
  if (Number(req.headers.get("content-length") || "0") > 4096) {
    return json({ error: "Solicitud demasiado extensa." }, 413);
  }

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
