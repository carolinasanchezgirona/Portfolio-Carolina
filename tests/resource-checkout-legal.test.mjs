import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { RESOURCE_TERMS_VERSION, RESOURCE_TERMS_FULL_TEXT, RESOURCE_TERMS } from "../resource-legal.ts";

const worker = readFileSync(new URL("../worker.ts", import.meta.url), "utf8");
const client = readFileSync(new URL("../app/recursos/resources-catalog.tsx", import.meta.url), "utf8");
const sql = readFileSync(new URL("../supabase/migrations/20261008_digital_checkout_acceptances.sql", import.meta.url), "utf8");
const functionCode = readFileSync(new URL("../supabase/functions/send-resource-confirmation/index.ts", import.meta.url), "utf8");

test("legal contract has clear version and distinct consumer rights", () => {
  assert.match(RESOURCE_TERMS_VERSION, /^\d{4}-\d{2}-\d{2}-v\d+$/);
  assert.ok(RESOURCE_TERMS.length >= 9);
  assert.match(RESOURCE_TERMS_FULL_TEXT, /103\.m/);
  assert.match(RESOURCE_TERMS_FULL_TEXT, /garant[ií]as legales/i);
  assert.match(RESOURCE_TERMS_FULL_TEXT, /descargar/i);
  assert.match(RESOURCE_TERMS_FULL_TEXT, /contact@carolinasanchezgirona\.com/);
});

test("front-end requires THREE unselected consent boxes", () => {
  assert.ok(client.includes("acceptedTerms: acceptances[resource.id]?.terms === true"));
  assert.ok(client.includes("immediateSupply: acceptances[resource.id]?.supply === true"));
  assert.ok(client.includes("withdrawalLossAware: acceptances[resource.id]?.withdrawal === true"));
  assert.ok(client.includes("termsVersion: RESOURCE_TERMS_VERSION"));
  assert.ok(client.includes('disabled={buyingId === resource.id || !hasAllAcceptances(resource.id)}'));
  assert.ok(client.includes('href="/condiciones-recursos/"'));
});

test("server blocks checkout without affirmations, records snapshot before redirect, and expires failed sessions", () => {
  const start = worker.indexOf("async function handleResourceCheckout(");
  const end = worker.indexOf("async function handleResourceAccess(", start);
  assert.ok(start >= 0 && end > start);
  const code = worker.slice(start, end);
  for (const c of ["data.acceptedTerms === true", "data.immediateSupply === true",
    "data.withdrawalLossAware === true", "data.termsVersion !== RESOURCE_TERMS_VERSION",
    "terms_snapshot: RESOURCE_TERMS_FULL_TEXT", "terms_sha256: await sha256Hex",
    "if (!saved?.ok)", "checkout/sessions/", "/expire"]) {
    assert.ok(code.includes(c), "Missing checkout safety rule: " + c);
  }
  assert.ok(code.indexOf("if (!saved?.ok)") < code.indexOf("return resourceJson({ url: checkoutUrl })"));
});

test("paid download requires the stored record AND confirmation email", () => {
  const start = worker.indexOf("async function handleResourceAccess(");
  const end = worker.indexOf("function storageObjectPath(", start);
  const code = worker.slice(start, end);
  assert.ok(code.includes("fetchCheckoutConsent(env, sessionId)"));
  assert.ok(code.includes("consent.resource_id !== resourceId"));
  assert.ok(code.includes("consent.amount_cents !== Number(stripeSession.amount_total)"));
  assert.ok(code.includes("confirmResourceContract"));
  assert.ok(code.indexOf("confirmResourceContract") < code.indexOf("const rawToken = randomToken()"));
});

test("contract acceptances are private, timestamped and immutable", () => {
  for (const clause of ["ENABLE ROW LEVEL SECURITY", "FROM PUBLIC, anon, authenticated",
    "stripe_session_id text NOT NULL UNIQUE", "terms_snapshot text NOT NULL",
    "terms_accepted_at timestamptz NOT NULL", "immediate_supply_requested_at timestamptz NOT NULL",
    "withdrawal_loss_acknowledged_at timestamptz NOT NULL", "prevent_checkout_acceptance_rewrite"]) {
      assert.ok(sql.includes(clause), "Missing SQL rule: " + clause);
    }
});

function harness() {
  let handler;
  const emails = [];
  const output = ts.transpileModule(functionCode, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
    reportDiagnostics: true,
  });
  assert.deepEqual((output.diagnostics || []).filter(x => x.category === ts.DiagnosticCategory.Error), []);
  const Deno = { env: { get: key => ({ SUPABASE_SERVICE_ROLE_KEY: "synthetic-service", BREVO_API_KEY: "synthetic-brevo" })[key] ?? "" },
    serve: fn => { handler = fn; } };
  vm.runInNewContext(output.outputText, {
    Deno, fetch: async (url, init) => {
      assert.equal(url, "https://api.brevo.com/v3/smtp/email");
      const payload = JSON.parse(init.body);
      emails.push(payload);
      return Response.json({ messageId: "test-message-id" });
    }, Response, Request, Date,
  });
  async function call({ authorization = "Bearer synthetic-service", email = "usuario@example.test",
    terms = RESOURCE_TERMS_FULL_TEXT, resource_title = "Salir del bucle",
    amount = "14,90 €", version = RESOURCE_TERMS_VERSION } = {}) {
    const req = new Request("https://example.supabase.co/functions/v1/send-resource-confirmation", {
      method: "POST", headers: { Authorization: authorization, "Content-Type": "application/json" },
      body: JSON.stringify({ email, terms, resource_title, amount, version }),
    });
    const res = await handler(req);
    return { status: res.status, body: await res.json() };
  }
  return { call, emails };
}

test("confirmation email rejects untrusted calls without sending", async () => {
  const h = harness();
  assert.equal((await h.call({ authorization: "" })).status, 401);
  assert.equal(h.emails.length, 0);
});

test("successful confirmation has full terms and disables tracking", async () => {
  const h = harness();
  const result = await h.call();
  assert.equal(result.status, 200);
  assert.equal(result.body.message_id, "test-message-id");
  assert.equal(h.emails.length, 1);
  assert.equal(h.emails[0].headers["X-Mailin-Track-Opens"], "0");
  assert.equal(h.emails[0].headers["X-Mailin-Track-Clicks"], "0");
  assert.ok(h.emails[0].textContent.includes(RESOURCE_TERMS_FULL_TEXT));
  assert.ok(h.emails[0].textContent.includes("14,90 €"));
});

test("email HTML escapes injected text", async () => {
  const h = harness();
  const result = await h.call({ resource_title: "<script>TEST</script>" });
  assert.equal(result.status, 200);
  assert.ok(h.emails[0].htmlContent.includes("&lt;script&gt;TEST&lt;/script&gt;"));
});

test("signed Stripe webhook sends contract confirmation independently of return-page visit", () => {
  const begin = worker.indexOf("async function handleStripeWebhook(");
  const end = worker.indexOf("/** Private, authenticated editorial generation.", begin);
  assert.ok(begin >= 0 && end > begin);
  const webhook = worker.slice(begin, end);
  assert.ok(webhook.includes('case "checkout.session.completed"'));
  assert.ok(webhook.includes('case "checkout.session.async_payment_succeeded"'));
  assert.ok(webhook.includes("confirmResourceContract(env, session, consent"));
  assert.ok(webhook.includes('new Response("Please retry checkout confirmation", { status: 500 })'));
});
