import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { whatsappWebhook, WhatsAppQuota } from "../whatsapp-webhook.ts";

const webhook = "https://example.test/api/whatsapp/webhook";
const testRecipient = "34600000000";
const preset = "Hola, quisiera información administrativa sobre una primera visita.";
const signed = (body, key = "test-app-secret") => new Request(webhook, {
  method: "POST",
  headers: { "X-Hub-Signature-256": `sha256=${createHmac("sha256", key).update(body).digest("hex")}` },
  body,
});

function makeLedger() {
  const db = new DatabaseSync(":memory:");
  const ledger = new WhatsAppQuota({ storage: {
    sql: { exec(query, ...params) {
      const statement = db.prepare(query);
      return query.startsWith("SELECT") ? { one: () => statement.get(...params) } : { rowsWritten: statement.run(...params).changes };
    } },
    async setAlarm() {},
  } });
  return { db, ledger };
}

function notification(messages, phoneId = "123456") {
  return JSON.stringify({ object: "whatsapp_business_account", entry: [{ changes: [{
    field: "messages", value: { metadata: { phone_number_id: phoneId }, messages },
  }] }] });
}

test("webhook verification requires the token and incoming events require a valid raw body signature", async () => {
  const env = { WHATSAPP_VERIFY_TOKEN: "test-verify-token", WHATSAPP_APP_SECRET: "test-app-secret" };
  const verify = (token) => new Request(`${webhook}?hub.mode=subscribe&hub.verify_token=${token}&hub.challenge=987`);
  assert.equal((await whatsappWebhook(verify("test-verify-token"), {})).status, 503);
  assert.equal(await (await whatsappWebhook(verify("test-verify-token"), env)).text(), "987");
  assert.equal((await whatsappWebhook(verify("incorrect"), env)).status, 403);
  assert.equal((await whatsappWebhook(signed("{}", "incorrect"), env)).status, 401);
  assert.equal((await whatsappWebhook(signed(" ".repeat(128 * 1024 + 1)), env)).status, 413);
  assert.equal((await whatsappWebhook(signed("{}"), env)).status, 200);
});

test("only the current booking request receives one service reply, and test mode restricts the recipient", async (t) => {
  const { db, ledger } = makeLedger();
  t.after(() => db.close());
  const api = t.mock.method(globalThis, "fetch", async () => new Response("{}", { status: 200 }));
  const env = {
    WHATSAPP_APP_SECRET: "test-app-secret", WHATSAPP_VERIFY_TOKEN: "test-verify-token", WHATSAPP_MODE: "test",
    WHATSAPP_TEST_RECIPIENT: testRecipient, WHATSAPP_PHONE_NUMBER_ID: "123456", WHATSAPP_GRAPH_VERSION: "v25.0",
    WHATSAPP_ACCESS_TOKEN: "test-access-token", WHATSAPP_QUOTA: { getByName: () => ledger },
  };
  const message = { id: "wamid.match", from: testRecipient, timestamp: String(Math.floor(Date.now() / 1000)), type: "text", text: { body: preset } };
  const ignored = notification([
    { ...message, id: "wamid.other", from: "34600000001" },
    { ...message, id: "wamid.old", timestamp: "1000" },
    { ...message, id: "wamid.free", text: { body: `${preset} Tengo una consulta personal.` } },
    { ...message, id: "wamid.audio", type: "audio" },
  ]);
  assert.equal((await whatsappWebhook(signed(ignored), env)).status, 200);
  assert.equal((await whatsappWebhook(signed(notification([message], "654321")), env)).status, 200);
  assert.equal((await whatsappWebhook(signed(notification([message])), { ...env, WHATSAPP_MODE: undefined })).status, 200);
  assert.equal(api.mock.callCount(), 0);

  const responses = await Promise.all([1, 2].map(() => whatsappWebhook(signed(notification([message])), env)));
  assert.deepEqual(responses.map((response) => response.status), [200, 200]);
  assert.equal(api.mock.callCount(), 1);
  const [url, init] = api.mock.calls[0].arguments;
  const sent = JSON.parse(init.body);
  assert.equal(url, "https://graph.facebook.com/v25.0/123456/messages");
  assert.equal(sent.type, "text");
  assert.equal(sent.to, testRecipient);
  assert.match(sent.text.body, /https:\/\/carolinasanchezgirona\.com\/cita\//);
  assert.equal(db.prepare("SELECT id FROM attempts").get().id.length, 64);
});

test("quota counts send attempts once and removes expired reservations", async (t) => {
  const { db, ledger } = makeLedger();
  t.after(() => db.close());
  const reserve = (id) => ledger.fetch(new Request(`https://quota.internal/${id.toString(16).padStart(64, "0")}`, { method: "POST" }));
  for (let id = 0; id < 900; id++) assert.equal((await reserve(id)).status, 201);
  assert.equal((await reserve(900)).status, 409);
  db.prepare("UPDATE attempts SET created_at = 1 WHERE id = ?").run("0".repeat(64));
  await ledger.alarm();
  assert.equal(db.prepare("SELECT COUNT(*) AS total FROM attempts").get().total, 899);
  assert.equal((await reserve(1)).status, 409);
  assert.equal((await reserve(900)).status, 201);
});
