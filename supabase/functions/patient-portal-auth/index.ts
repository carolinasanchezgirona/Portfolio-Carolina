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

async function requestCode(email: string, useLink = false) {
  const generic = { ok: true, message: useLink ? "Si el correo tiene acceso, recibirás un enlace en unos minutos." : "Si el correo tiene acceso, recibirás un código en unos minutos." };
  if (!SERVICE_ROLE_KEY || !BREVO_API_KEY) return json({ error: "El acceso por correo no está configurado." }, 503);

  const patientsResponse = await fetch(
    SUPABASE_URL + "/rest/v1/clinical_patients?select=id,email,status&status=neq.archived&limit=500",
    { headers: serviceHeaders, cache: "no-store" },
  );
  if (!patientsResponse.ok) { console.error("[patient-auth] No se pudo consultar el registro de pacientes:", patientsResponse.status); return json({ error: "Servicio temporalmente no disponible." }, 503); }
  const patientRows = await patientsResponse.json().catch(() => []);
  const patients = Array.isArray(patientRows)
    ? patientRows.filter((row) => String(row?.email ?? "").trim().toLowerCase() === email)
    : [];
  if (patients.length !== 1) return json(generic);

  const patient = patients[0] as { id?: string };
  if (!patient.id) return json(generic);

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recentResponse = await fetch(
    SUPABASE_URL + "/rest/v1/patient_portal_login_codes?select=id,created_at&patient_id=eq." + encodeURIComponent(patient.id) +
      "&email_normalized=eq." + encodeURIComponent(email) + "&created_at=gte." + encodeURIComponent(oneHourAgo) +
      "&order=created_at.desc&limit=10",
    { headers: serviceHeaders, cache: "no-store" },
  );
  if (!recentResponse.ok) { console.error("[patient-auth] No se pudo validar el límite de solicitudes:", recentResponse.status); return json({ error: "Servicio temporalmente no disponible." }, 503); }
  const recent = await recentResponse.json().catch(() => []);
  if (Array.isArray(recent) && recent.length) {
    const lastCreated = Date.parse(String(recent[0]?.created_at || ""));
    if (Number.isFinite(lastCreated) && Date.now() - lastCreated < 60 * 1000) return json(generic);
    if (recent.length >= 5) return json(generic);
  }

  const code = useLink ? randomToken() : randomCode();
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

  const linkUrl = "https://carolinasanchezgirona.com/mi-espacio/#acceso=" + encodeURIComponent(code) + "&email=" + encodeURIComponent(email);
  const html = useLink ? `<!doctype html><html lang="es"><body style="font-family:Arial,sans-serif;color:#173A5E"><h1>Entra en Mi espacio</h1><p>Pulsa este enlace para acceder de forma segura:</p><p><a href="${linkUrl}">Entrar en mi espacio</a></p><p>El enlace caduca en 10 minutos y solo puede utilizarse una vez.</p><p>Si no lo solicitaste, ignora el mensaje.</p></body></html>` : `<!doctype html><html lang="es"><body style="margin:0;background:#f5f8fb;font-family:Arial,sans-serif;color:#233746"><div style="max-width:620px;margin:0 auto;padding:32px 18px"><div style="background:#fff;border:1px solid #d5e3ee;border-radius:18px;padding:32px"><p style="color:#08A6A0;font-size:13px;font-weight:700;letter-spacing:.04em">MI ESPACIO</p><h1 style="font-size:25px;color:#173A5E">Tu código de acceso</h1><p>Introduce este código en Mi espacio:</p><p style="font-size:34px;letter-spacing:8px;font-weight:800;color:#173A5E;text-align:center;margin:28px 0">${code}</p><p>El código caduca en 10 minutos y solo puede utilizarse una vez.</p><p style="margin-top:28px">Carolina Sánchez Girona</p></div><p style="color:#667983;font-size:12px">Si no has solicitado este acceso, puedes ignorar este correo. No respondas incluyendo información clínica.</p></div></body></html>`;
  const textContent = useLink ? `Entra en Mi espacio: ${linkUrl}\n\nEl enlace caduca en 10 minutos y solo sirve una vez.` : `Tu código para Mi espacio es: ${code}\n\nCaduca en 10 minutos y solo puede utilizarse una vez.\n\nSi no has solicitado este acceso, ignora este correo.\n\nCarolina Sánchez Girona`;

  const sent = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Carolina Sánchez Girona", email: "contact@carolinasanchezgirona.com" },
      to: [{ email }],
      replyTo: { email: "contact@carolinasanchezgirona.com", name: "Carolina Sánchez Girona" },
      subject: useLink ? "Tu enlace seguro para Mi espacio" : "Tu código para Mi espacio",
      htmlContent: html,
      textContent,
      tags: ["patient-portal-login"],
      headers: { "X-Mailin-Track-Opens": "0", "X-Mailin-Track-Clicks": "0" },
    }),
  });

  if (!sent.ok) {
    console.error("[patient-auth] El proveedor de correo rechazó el envío:", sent.status);
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

async function verifyCode(email: string, code: string, useLink = false) {
  if (!SERVICE_ROLE_KEY) return json({ error: "El acceso por correo no está configurado." }, 503);
  if (!(useLink ? /^[A-Za-z0-9_-]{43}$/.test(code) : /^\d{6}$/.test(code))) return json({ error: "Código no válido o caducado." }, 401);

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
  const consumed = await fetch(SUPABASE_URL + "/rest/v1/patient_portal_login_codes?id=eq." + encodeURIComponent(String(item.id)) +
    "&consumed_at=is.null&expires_at=gt." + encodeURIComponent(now.toISOString()) + "&select=id", {
    method: "PATCH",
    headers: { ...serviceHeaders, Prefer: "return=representation" },
    body: JSON.stringify({ consumed_at: now.toISOString() }),
  });
  const usedRows = await consumed.json().catch(() => []);
  if (!consumed.ok || !Array.isArray(usedRows) || usedRows.length !== 1) {
    return json({ error: "Enlace no válido o ya utilizado." }, 401);
  }

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


/* Supabase Auth owns password hashing, credential policy and email verification.
   Never store patient passwords or Supabase Auth access tokens in clinical tables. */
const AUTH_PUBLIC_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
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

  // Reuse the existing atomic, service-role-only issuance RPC. This prevents
  // concurrent requests from bypassing the five/hour and one/minute limits.
  const issued = await fetch(SUPABASE_URL + "/rest/v1/rpc/issue_patient_portal_login_code", {
    method: "POST", headers: serviceHeaders, cache: "no-store",
    body: JSON.stringify({
      p_patient_id: patient.id,
      p_email_normalized: email,
      p_code_hash: await hashCode(email, randomToken()),
      p_expires_at: new Date(Date.now() + 60_000).toISOString()
    })
  });
  if (!issued.ok) {
    console.error("[portal-password] Unable to limit invitation requests:", issued.status);
    return json({ error: "Servicio temporalmente no disponible." }, 503);
  }
  const issuedId = await issued.json().catch(() => null);
  if (typeof issuedId !== "string") return json(generic);

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
  // Only the trusted same-origin Worker may invoke this privileged Edge Function.
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

  if (action === "password-link") return await sendPasswordLink(email, String(body.purpose ?? "setup") === "reset" ? "reset" : "setup");
  if (action === "password-set") return await setPatientPassword(email, String(body.token_hash ?? ""), String(body.flow ?? ""), String(body.password ?? ""));
  if (action === "password-login") return await loginWithPassword(email, String(body.password ?? ""));
  return json({ error: "Acción no válida." }, 400);
});
