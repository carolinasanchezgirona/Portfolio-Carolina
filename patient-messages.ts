type Session = { patient_id: string } | null;
type Dependencies = {
  origin(request: Request): boolean;
  session(request: Request): Promise<Session>;
  owner(request: Request): Promise<boolean>;
  query(path: string, init?: RequestInit): Promise<Response>;
  notify?(patientId: string, nonce: string): Promise<void>;
  json(body: Record<string, unknown>, status?: number): Response;
};
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** The patient identity always comes from the server session, never the request body. */
export async function patientMessages(request: Request, deps: Dependencies): Promise<Response> {
  const reply = deps.json;
  if (!["GET", "POST", "PATCH"].includes(request.method)) return reply({ error: "Método no permitido." }, 405);
  if (request.method !== "GET" && !deps.origin(request)) return reply({ error: "Origen no permitido." }, 403);
  const admin = new URL(request.url).pathname.startsWith("/api/admin/");
  let patientId = "";
  if (admin) {
    if (!await deps.owner(request)) return reply({ error: "Inicia sesión en el panel profesional." }, 401);
    patientId = new URL(request.url).searchParams.get("patient_id") || "";
    if (patientId && !uuid.test(patientId)) return reply({ error: "Paciente no válido." }, 400);
  } else {
    const session = await deps.session(request);
    if (!session) return reply({ error: "Inicia sesión para consultar tus mensajes." }, 401);
    patientId = session.patient_id;
  }
  try {
    if (patientId) {
      const active = await deps.query("clinical_patients?select=id&id=eq." + patientId + "&status=neq.archived&limit=1");
      if (!active.ok) return reply({ error: "No se ha podido comprobar el acceso." }, 503);
      if (!(await active.json() as unknown[]).length) return reply({ error: "Acceso no disponible." }, 403);
    }
    const base = "patient_internal_messages";
    if (request.method === "GET") {
      const select = admin && !patientId ? "id,patient_id,sender,created_at,read_at,patient:clinical_patients(full_name)" : "id,patient_id,sender,body,created_at,read_at";
      const res = await deps.query(base + "?select=" + select + (patientId ? "&patient_id=eq." + patientId : "") + "&order=created_at.desc,id.desc&limit=" + (patientId ? "200" : "1000"));
      if (!res.ok) throw new Error("read");
      return reply({ messages: await res.json() });
    }
    if (!patientId) return reply({ error: "Selecciona un paciente." }, 400);
    const raw = await request.text();
    if (raw.length > 12000) return reply({ error: "Mensaje demasiado largo." }, 413);
    let data: Record<string, unknown>;
    try { data = JSON.parse(raw); } catch { return reply({ error: "Solicitud no válida." }, 400); }
    if (request.method === "PATCH") {
      const ids = Array.isArray(data.ids) ? data.ids : [];
      if (!ids.length || ids.length > 200 || ids.some(id => typeof id !== "string" || !uuid.test(id))) return reply({ error: "Mensajes no válidos." }, 400);
      const marked = await deps.query(base + "?patient_id=eq." + patientId + "&sender=eq." + (admin ? "patient" : "clinician") + "&read_at=is.null&id=in.(" + ids.join(",") + ")", {
        method: "PATCH", body: JSON.stringify({ read_at: new Date().toISOString() }),
      });
      if (!marked.ok) throw new Error("mark");
      return reply({ ok: true });
    }
    const body = typeof data.body === "string" ? data.body.trim() : "";
    const nonce = typeof data.nonce === "string" ? data.nonce : "";
    if (!body || body.length > 4000 || !uuid.test(nonce)) return reply({ error: "Escribe un mensaje de entre 1 y 4000 caracteres." }, 400);
    const sender = admin ? "clinician" : "patient";
    const recent = await deps.query(base + "?select=id&patient_id=eq." + patientId + "&sender=eq." + sender + "&created_at=gt." + encodeURIComponent(new Date(Date.now() - 60000).toISOString()) + "&limit=10");
    if (!recent.ok) throw new Error("rate");
    if ((await recent.json() as unknown[]).length >= 10) return reply({ error: "Espera un minuto antes de enviar más mensajes." }, 429);
    const sent = await deps.query(base, { method: "POST", body: JSON.stringify({ patient_id: patientId, sender, body, client_nonce: nonce }) });
    if (!sent.ok && sent.status !== 409) throw new Error("send");
    if (sent.status === 409) {
      const existing = await deps.query(base + "?select=id&patient_id=eq." + patientId + "&sender=eq." + sender + "&client_nonce=eq." + nonce + "&limit=1");
      if (!existing.ok || !(await existing.json() as unknown[]).length) throw new Error("nonce");
    }
    if (!admin && deps.notify) await deps.notify(patientId, nonce).catch(() => {});
    return reply({ ok: true });
  } catch {
    return reply({ error: "No se ha podido completar la operación. Vuelve a intentarlo." }, 503);
  }
}
