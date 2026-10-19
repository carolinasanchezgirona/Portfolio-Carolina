type EmailEnv = { BREVO_API_KEY?: string; SUPABASE_SERVICE_ROLE_KEY?: string };
const table = "https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1/patient_internal_messages";
/** Durable notices: claim atomically, record success, retry failures on the existing cron. */
export async function notifyPatientMessages(env: EmailEnv, patientId?: string, nonce?: string): Promise<void> {
  if (!env.BREVO_API_KEY || !env.SUPABASE_SERVICE_ROLE_KEY) return;
  const headers = { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY, "Content-Type": "application/json" };
  const filter = "&sender=eq.patient&email_notice_sent_at=is.null";
  const stale = new Date(Date.now() - 10 * 60000).toISOString();
  const available = "&or=(email_notice_claimed_at.is.null,email_notice_claimed_at.lt." + encodeURIComponent(stale) + ")";
  const scoped = patientId && nonce ? "&patient_id=eq." + patientId + "&client_nonce=eq." + nonce : "";
  const pending = await fetch(table + "?select=id" + filter + available + scoped + "&order=created_at.asc&limit=30", { headers, cache: "no-store" });
  if (!pending.ok) return;
  const rows = await pending.json() as { id: string }[];
  for (const row of rows) {
    const claimedAt = new Date().toISOString();
    const claimed = await fetch(table + "?select=id&id=eq." + row.id + filter + available, {
      method: "PATCH", headers: { ...headers, Prefer: "return=representation" }, body: JSON.stringify({ email_notice_claimed_at: claimedAt }),
    });
    if (!claimed.ok || !(await claimed.json() as unknown[]).length) continue;
    let success = false;
    try {
      const sent = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST", headers: { "api-key": env.BREVO_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: { name: "Entre Sesiones · Carolina Sánchez", email: "contact@carolinasanchezgirona.com" },
          to: [{ email: "contact@carolinasanchezgirona.com" }],
          subject: "Nuevo mensaje interno en Entre Sesiones",
          htmlContent: '<h1 style="color:#173A5E;font-size:24px">Tienes un mensaje nuevo</h1><p>Un paciente te ha enviado un mensaje privado en Entre Sesiones.</p><p><a href="https://carolinasanchezgirona.com/admin/mensajes/" style="display:inline-block;background:#173A5E;color:#fff;padding:14px 22px;border-radius:10px;text-decoration:none">Leer y responder</a></p><p>Accede con tu cuenta profesional. El contenido del mensaje permanece en tu panel privado.</p>',
          textContent: "Un paciente te ha enviado un mensaje privado en Entre Sesiones.\n\nLeer y responder: https://carolinasanchezgirona.com/admin/mensajes/\n\nAccede con tu cuenta profesional. El contenido del mensaje permanece en tu panel privado.",
          tags: ["patient-internal-message-notice"],
          headers: { "X-Mailin-Track-Opens": "0", "X-Mailin-Track-Clicks": "0" },
        }),
      });
      success = sent.ok;
    } catch { /* A failed notice stays pending for the scheduled retry. */ }
    await fetch(table + "?id=eq." + row.id + "&email_notice_claimed_at=eq." + encodeURIComponent(claimedAt), {
      method: "PATCH", headers,
      body: JSON.stringify(success ? { email_notice_sent_at: new Date().toISOString() } : { email_notice_claimed_at: null }),
    });
  }
}
