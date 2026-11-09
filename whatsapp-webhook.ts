export interface WhatsAppEnv {
  WHATSAPP_APP_SECRET?: string;
  WHATSAPP_VERIFY_TOKEN?: string;
  WHATSAPP_ACCESS_TOKEN?: string;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  WHATSAPP_GRAPH_VERSION?: string;
  WHATSAPP_MODE?: string;
  WHATSAPP_TEST_RECIPIENT?: string;
  WHATSAPP_QUOTA?: { getByName(name: string): { fetch(request: Request): Promise<Response> } };
}

const encoder = new TextEncoder();
const maxBodyBytes = 128 * 1024;
const maxMessageAge = 15 * 60_000;
const quotaLimit = 900;
const quotaPeriod = 32 * 24 * 60 * 60_000;
const bookingRequest = "hola, quisiera información administrativa sobre una primera visita.";
const bookingReply = "Hola. Puedes consultar los horarios disponibles y reservar desde https://carolinasanchezgirona.com/cita/. Este mensaje no confirma una cita. Usa este chat solo para cuestiones de horarios y reservas.";

interface IncomingMessage {
  id?: string;
  from?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
}

interface WebhookPayload {
  object?: string;
  entry?: Array<{ changes?: Array<{
    field?: string;
    value?: { metadata?: { phone_number_id?: string }; messages?: IncomingMessage[] };
  }> }>;
}

function reply(body: string | null, status = 200): Response {
  return new Response(body, { status, headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" } });
}

async function readBody(request: Request): Promise<Uint8Array<ArrayBuffer> | null> {
  if (!request.body || Number(request.headers.get("Content-Length")) > maxBodyBytes) return null;
  const reader = request.body.getReader();
  const bytes = new Uint8Array(maxBodyBytes);
  let length = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return bytes.subarray(0, length);
    if (length + value.byteLength > maxBodyBytes) {
      await reader.cancel();
      return null;
    }
    bytes.set(value, length);
    length += value.byteLength;
  }
}

export async function whatsappWebhook(request: Request, env: WhatsAppEnv): Promise<Response> {
  if (!env.WHATSAPP_VERIFY_TOKEN || !env.WHATSAPP_APP_SECRET) return reply(null, 503);
  if (request.method === "GET") {
    const query = new URL(request.url).searchParams;
    const challenge = query.get("hub.challenge");
    if (query.get("hub.mode") !== "subscribe" || query.get("hub.verify_token") !== env.WHATSAPP_VERIFY_TOKEN || !challenge || challenge.length > 128) {
      return reply(null, 403);
    }
    return reply(challenge);
  }
  if (request.method !== "POST") return reply(null, 405);

  const signature = request.headers.get("X-Hub-Signature-256")?.match(/^sha256=([0-9a-f]{64})$/i);
  if (!signature) return reply(null, 401);
  const bytes = await readBody(request);
  if (!bytes) return reply(null, 413);
  const key = await crypto.subtle.importKey("raw", encoder.encode(env.WHATSAPP_APP_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["verify", "sign"]);
  const digest = Uint8Array.from(signature[1].match(/../g)!, (hex) => parseInt(hex, 16));
  if (!await crypto.subtle.verify("HMAC", key, digest, bytes)) return reply(null, 401);

  const { WHATSAPP_MODE: mode, WHATSAPP_TEST_RECIPIENT: testRecipient, WHATSAPP_ACCESS_TOKEN: token,
    WHATSAPP_PHONE_NUMBER_ID: phoneId, WHATSAPP_GRAPH_VERSION: version, WHATSAPP_QUOTA: quota } = env;
  if (mode !== "test" && mode !== "live") return reply(null);
  if (!token || !phoneId || !/^\d{5,25}$/.test(phoneId) || !version || !/^v\d{1,3}\.0$/.test(version) || !quota || (mode === "test" && !testRecipient)) {
    return reply(null, 503);
  }

  let payload: WebhookPayload | null;
  try { payload = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { return reply(null, 400); }
  if (payload?.object !== "whatsapp_business_account" || !Array.isArray(payload.entry)) return reply(null);

  const ledger = quota.getByName(phoneId);
  for (const entry of payload.entry) {
    if (!Array.isArray(entry?.changes)) continue;
    for (const { field, value } of entry.changes.filter(Boolean)) {
      if (field !== "messages" || value?.metadata?.phone_number_id !== phoneId || !Array.isArray(value.messages)) continue;
      for (const message of value.messages) {
        if (message?.type !== "text" || typeof message.text?.body !== "string" || message.text.body.trim().toLowerCase() !== bookingRequest) continue;
        if (typeof message.id !== "string" || !/^wamid\.[\w+/=-]{1,512}$/.test(message.id) || typeof message.from !== "string" || !/^\d{7,15}$/.test(message.from)) continue;
        if (mode === "test" && message.from !== testRecipient) continue;
        const age = Date.now() - Number(message.timestamp) * 1000;
        if (!Number.isFinite(age) || age < -60_000 || age >= maxMessageAge) continue;

        const idDigest = await crypto.subtle.sign("HMAC", key, encoder.encode(`whatsapp-message:${message.id}`));
        const id = Array.from(new Uint8Array(idDigest), (byte) => byte.toString(16).padStart(2, "0")).join("");
        let reservation: Response;
        try { reservation = await ledger.fetch(new Request(`https://quota.internal/${id}`, { method: "POST" })); }
        catch { return reply(null, 503); }
        if (reservation.status === 409) continue;
        if (reservation.status !== 201) return reply(null, 503);

        // Once reserved, never retry a send whose result could have been lost in transit.
        try {
          const sent = await fetch(`https://graph.facebook.com/${version}/${phoneId}/messages`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ messaging_product: "whatsapp", to: message.from, type: "text", text: { body: bookingReply, preview_url: false } }),
            redirect: "error",
            signal: AbortSignal.timeout(5_000),
          });
          if (!sent.ok) console.warn("WhatsApp booking reply rejected", sent.status);
          await sent.body?.cancel();
        } catch { console.warn("WhatsApp booking reply result unavailable"); }
      }
    }
  }
  return reply(null);
}

interface QuotaStorage {
  sql: { exec(query: string, ...bindings: Array<number | string>): { rowsWritten: number; one(): { oldest: number | null } } };
  setAlarm(time: number): Promise<void>;
}

export class WhatsAppQuota {
  private storage: QuotaStorage;

  constructor(state: { storage: QuotaStorage }) {
    this.storage = state.storage;
    this.storage.sql.exec("CREATE TABLE IF NOT EXISTS attempts (id TEXT PRIMARY KEY, created_at INTEGER NOT NULL)");
  }

  async fetch(request: Request): Promise<Response> {
    const id = new URL(request.url).pathname.slice(1);
    if (request.method !== "POST" || !/^[a-f0-9]{64}$/.test(id)) return reply(null, 400);
    const now = Date.now();
    // Persist the expiry before reserving a send. The single INSERT enforces both limits atomically.
    await this.storage.setAlarm(now + 1_000);
    this.storage.sql.exec("DELETE FROM attempts WHERE created_at <= ?", now - quotaPeriod);
    const inserted = this.storage.sql.exec(
      "INSERT OR IGNORE INTO attempts SELECT ?, ? WHERE (SELECT COUNT(*) FROM attempts) < ?",
      id, now, quotaLimit,
    ).rowsWritten;
    return reply(null, inserted ? 201 : 409);
  }

  async alarm(): Promise<void> {
    this.storage.sql.exec("DELETE FROM attempts WHERE created_at <= ?", Date.now() - quotaPeriod);
    const { oldest } = this.storage.sql.exec("SELECT MIN(created_at) AS oldest FROM attempts").one();
    if (oldest !== null) await this.storage.setAlarm(oldest + quotaPeriod);
  }
}
