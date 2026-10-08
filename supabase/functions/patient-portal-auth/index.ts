const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";

// Accept both legacy service_role and current sb_secret_* keys belonging to this
// Supabase project. These are privileged server credentials, never browser keys.
const PROJECT_SECRET_KEYS: string[] = (() => {
  try {
    const values = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}") as Record<string, unknown>;
    if (!values || typeof values !== "object" || Array.isArray(values)) return [];
    return Object.values(values).filter((v): v is string => typeof v === "string" && v.startsWith("sb_secret_"));
  } catch { return []; }
})();

async function isAuthorizedBackend(request: Request): Promise<boolean> {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return false;
  const candidate = authorization.slice(7);
  if (!candidate || candidate.length > 1024) return false;
  if ((Boolean(SERVICE_ROLE_KEY) && candidate === SERVICE_ROLE_KEY) || PROJECT_SECRET_KEYS.includes(candidate)) {
    return true;
  }

  // Key rotation can make Cloudflare's privileged key differ from this
  // function's environment key. Validate against this project's own Auth
  // ADMIN API instead of weakening security with a static public API key.
  // The admin route cannot be called with publishable/anon/user credentials.
  if (!candidate.startsWith("sb_secret_") && candidate.split(".").length !== 3) return false;
  try {
    const res = await fetch(SUPABASE_URL + "/auth/v1/admin/users?page=1&per_page=1", {
      method: "GET",
      headers: { apikey: candidate, Authorization: "Bearer " + candidate },
      cache: "no-store",
    });
    if (!res.ok) console.error("[portal-auth] Supabase admin validation rejected credential", res.status);
    return res.ok;
  } catch {
    console.error("[portal-auth] Supabase admin validation unavailable");
    return false;
  }
}

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

/* Supabase Auth owns password hashing, credential policy and email verification.
   Never store patient passwords or Supabase Auth access tokens in clinical tables. */
const AUTH_PUBLIC_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
const AUTH_API = SUPABASE_URL + "/auth/v1";
const genericPasswordMessage = "Si el correo está habilitado, recibirás instrucciones en unos minutos.";

async function eligiblePatient(email: string): Promise<{id: string} | null> {
  const response = await fetch(
    SUPABASE_URL + "/rest/v1/clinical_patients?select=id,email,status&email=ilike." +
      encodeURIComponent(email) + "&status=neq.archived&limit=2",
    { headers: serviceHeaders, cache: "no-store" },
  );
  if (!response.ok) throw new Error("Patient lookup unavailable");
  const rows = await response.json().catch(() => []);
  if (!Array.isArray(rows) || rows.length !== 1 ||
      String(rows[0].email || "").trim().toLowerCase() !== email) return null;
  return { id: String(rows[0].id) };
}

// Keep patient identities separate from the clinical professional's Supabase Auth account.
function patientAuthEmail(patientId: string): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(patientId)) {
    throw new Error("Invalid patient identifier");
  }
  return "patient-" + patientId.toLowerCase() + "@auth.carolinasanchezgirona.com";
}

async function makeAuthRequest(path: string, data: Record<string, unknown>,
    key: string, method = "POST"): Promise<Response> {
  return fetch(AUTH_API + path, {
    method, cache: "no-store",
    headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function sendPasswordLink(email: string, purpose: string) {
  // Never reveal to unauthenticated callers whether the address belongs to a patient.
  const generic = { ok: true, message: genericPasswordMessage };
  if (!SERVICE_ROLE_KEY || !AUTH_PUBLIC_KEY || !BREVO_API_KEY) return json({ error: "Servicio temporalmente no disponible." }, 503);
  let patient: {id:string} | null;
  try { patient = await eligiblePatient(email); }
  catch { return json({ error: "Servicio temporalmente no disponible." }, 503); }
  if (!patient) return json(generic);

  // Reuse the production transaction-safe cooldown: one link per minute
  // and five per hour, even for concurrent attempts.
  const limitResponse = await fetch(SUPABASE_URL + "/rest/v1/rpc/issue_patient_portal_login_code", {
    method: "POST",
    headers: serviceHeaders,
    body: JSON.stringify({
      p_patient_id: patient.id,
      p_email_normalized: email,
      p_code_hash: await hashCode(email, randomToken()),
      p_expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
    }),
  });
  if (!limitResponse.ok) return json({ error: "Servicio temporalmente no disponible." }, 503);
  const trackingId = await limitResponse.json().catch(() => null);
  if (typeof trackingId !== "string" || !/^[0-9a-f-]{36}$/i.test(trackingId)) return json(generic);

  // Invite only provisioned patients. Existing Auth users receive a recovery link.
  const internalEmail = patientAuthEmail(patient.id);
  let type: "invite" | "recovery" = purpose === "reset" ? "recovery" : "invite";
  let generated = await makeAuthRequest("/admin/generate_link", { type, email: internalEmail }, SERVICE_ROLE_KEY);
  if (!generated.ok && type === "invite" && generated.status === 422) {
    type = "recovery";
    generated = await makeAuthRequest("/admin/generate_link", { type, email: internalEmail }, SERVICE_ROLE_KEY);
  }
  if (!generated.ok) {
    console.error("[portal-password] Link generation failed", generated.status);
    return json(generic);
  }
  const info = await generated.json().catch(() => ({})) as Record<string, unknown>;
  const properties = (info.properties && typeof info.properties === "object")
    ? info.properties as Record<string, unknown> : {};
  const hash = String(properties.hashed_token ?? info.hashed_token ?? "");
  if (!/^[A-Za-z0-9_-]{32,256}$/.test(hash)) {
    console.error("[portal-password] Auth link missing token hash");
    return json({ error: "Servicio temporalmente no disponible." }, 503);
  }

  const linkUrl = "https://carolinasanchezgirona.com/mi-espacio/#configurar=" +
    encodeURIComponent(hash) + "&tipo=" + type;
  const intro = purpose === "reset" ? "Recuperar la contraseña de Mi espacio" : "Preparar el acceso a Mi espacio";
  const brevo = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { email: "contact@carolinasanchezgirona.com", name: "Carolina Sánchez Girona" },
      to: [{ email }],
      subject: intro,
      htmlContent: '<p>' + intro + '</p><p><a href="' + linkUrl +
        '">Configurar mi contraseña</a></p><p>El enlace es personal y de un solo uso. ' +
        'Si no lo has solicitado, ignora este mensaje.</p>',
      textContent: intro + "\n\n" + linkUrl + "\n\nSi no lo has solicitado, ignora el mensaje.",
      tags: ["patient-portal-password"],
      headers: { "X-Mailin-Track-Opens": "0", "X-Mailin-Track-Clicks": "0" },
    }),
  });
  if (!brevo.ok) {
    console.error("[portal-password] Email provider failed", brevo.status);
    return json({ error: "Servicio temporalmente no disponible." }, 503);
  }
  return json(generic);
}

async function setPatientPassword(email: string, tokenHash: string, flow: string, password: string) {
  if (!AUTH_PUBLIC_KEY || !SERVICE_ROLE_KEY) return json({ error: "Servicio temporalmente no disponible." }, 503);
  if (!/^[A-Za-z0-9_-]{32,256}$/.test(tokenHash) || !["invite", "recovery"].includes(flow) ||
      password.length < 12 || password.length > 128) return json({ error: "Enlace o contraseña no válidos." }, 400);
  // Verify the emailed one-use secret at the Auth provider, not in browser code.
  const verified = await makeAuthRequest("/verify", { token_hash: tokenHash, type: flow }, AUTH_PUBLIC_KEY);
  if (!verified.ok) return json({ error: "El enlace ha caducado o ya se ha utilizado." }, 401);
  const auth = await verified.json().catch(() => ({})) as Record<string, unknown>;
  const jwt = String(auth.access_token ?? "");
  const user = auth.user as Record<string, unknown> | undefined;
  if (!jwt) return json({ error: "No se ha podido verificar el enlace." }, 401);
  let patient: {id:string} | null;
  try { patient = await eligiblePatient(email); }
  catch { return json({ error: "Servicio temporalmente no disponible." }, 503); }
  if (!patient || String(user?.email ?? "").toLowerCase() !== patientAuthEmail(patient.id)) return json({ error: "No se ha podido validar el acceso." }, 403);
  const updated = await fetch(AUTH_API + "/user", {
    method: "PUT", cache: "no-store",
    headers: { apikey: AUTH_PUBLIC_KEY, Authorization: "Bearer " + jwt, "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!updated.ok) return json({ error: "No se ha podido guardar la contraseña. Solicita otro enlace." }, 400);

  // Invalidate existing clinical sessions before confirming the password change.
  const revoked = await fetch(
    SUPABASE_URL + "/rest/v1/patient_portal_sessions?patient_id=eq." + encodeURIComponent(patient.id) +
      "&revoked_at=is.null",
    { method: "PATCH", headers: { ...serviceHeaders, Prefer: "return=minimal" },
      body: JSON.stringify({ revoked_at: new Date().toISOString() }) },
  ).catch(() => null);
  if (!revoked?.ok) {
    console.error("[portal-password] Could not revoke existing clinical sessions");
    return json({ error: "La contraseña se ha actualizado, pero no se han podido cerrar todas las sesiones. Contacta con la consulta antes de continuar." }, 503);
  }
  return json({ ok: true, message: "Contraseña guardada. Ya puedes iniciar sesión." });
}

async function loginWithPassword(email: string, password: string) {
  if (!AUTH_PUBLIC_KEY || !SERVICE_ROLE_KEY) return json({ error: "Servicio temporalmente no disponible." }, 503);
  if (password.length < 1 || password.length > 128) return json({ error: "Correo o contraseña incorrectos." }, 401);
  let patient: {id:string} | null;
  try { patient = await eligiblePatient(email); }
  catch { return json({ error: "Servicio temporalmente no disponible." }, 503); }
  if (!patient) return json({ error: "Correo o contraseña incorrectos." }, 401);
  const signed = await makeAuthRequest("/token?grant_type=password", { email: patientAuthEmail(patient.id), password }, AUTH_PUBLIC_KEY);
  if (!signed.ok) return json({ error: "Correo o contraseña incorrectos." }, 401);
  const auth = await signed.json().catch(() => ({})) as Record<string, unknown>;
  const user = auth.user as Record<string, unknown> | undefined;
  if (String(user?.email ?? "").toLowerCase() !== patientAuthEmail(patient.id) ||
      !user?.email_confirmed_at) return json({ error: "Correo o contraseña incorrectos." }, 401);
  const now = new Date();
  const token = "pwd2_" + randomToken();
  const expiry = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString();
  const saved = await fetch(SUPABASE_URL + "/rest/v1/patient_portal_sessions", {
    method: "POST", headers: { ...serviceHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({
      patient_id: patient.id, token_hash: await sha256(token),
      expires_at: expiry, last_seen_at: now.toISOString(),
    }),
  });
  if (!saved.ok) return json({ error: "No se ha podido iniciar la sesión." }, 502);
  return json({ ok: true, session_token: token, expires_at: expiry });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405);

  // The public browser only talks to the same-origin Cloudflare Worker.
  // Supabase Edge Function accepts only the Worker's server-side credential.
  if (!SERVICE_ROLE_KEY || !await isAuthorizedBackend(req)) {
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
  if (action === "password-link") return await sendPasswordLink(email, String(body.purpose ?? "setup") === "reset" ? "reset" : "setup");
  if (action === "password-set") return await setPatientPassword(email, String(body.token_hash ?? ""), String(body.flow ?? ""), String(body.password ?? ""));
  if (action === "password-login") return await loginWithPassword(email, String(body.password ?? ""));
  return json({ error: "Acción no válida." }, 400);
});
