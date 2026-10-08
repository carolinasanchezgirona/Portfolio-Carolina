import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import * as ts from "typescript";
import { webcrypto } from "node:crypto";

const file = readFileSync(new URL("../supabase/functions/patient-portal-auth/index.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(file, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
  reportDiagnostics: true
});
assert.equal((compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);

const id = "11111111-1111-4111-8111-111111111111";
const realEmail = "paciente@example.test";
const internalEmail = "patient-" + id + "@auth.carolinasanchezgirona.com";
const knownHash = "a".repeat(64);
const acceptedPassword = "UnaFraseDePrueba2026!";
const response = (value, status = 200) => Response.json(value, { status });

function createHarness() {
  const requests = [];
  const mail = [];
  let authorized = true;
  let used = false;
  let passwordWasUpdated = false;
  let issued = 0;
  let handler;
  const fetchStub = async (input, init = {}) => {
    const url = String(input);
    const payload = init.body ? JSON.parse(init.body) : {};
    requests.push({ url, method: init.method || "GET", payload });
    if (url.includes("/rest/v1/clinical_patients?")) {
      return response(authorized ? [{ id, email: realEmail, status: "active" }] : []);
    }
    if (url.includes("/rest/v1/patient_portal_login_codes?select=created_at")) {
      return response([]);
    }
    if (url.includes("/rest/v1/patient_portal_login_codes")) {
      return response({}, 201);
    }
    if (url.endsWith("/auth/v1/admin/generate_link")) {
      assert.equal(payload.email, internalEmail);
      return response({ properties: { hashed_token: knownHash } });
    }
    if (url.endsWith("/auth/v1/verify")) {
      if (used || payload.token_hash !== knownHash || !["invite", "recovery"].includes(payload.type)) {
        return response({ message: "Expired" }, 401);
      }
      used = true;
      return response({ access_token: "synthetic-token", user: { email: internalEmail } });
    }
    if (url.endsWith("/auth/v1/user") && init.method === "PUT") {
      passwordWasUpdated = true;
      assert.equal(payload.password, acceptedPassword);
      return response({ id: "test" });
    }
    if (url.includes("/auth/v1/token?grant_type=password")) {
      if (payload.email !== internalEmail || payload.password !== acceptedPassword) return response({}, 400);
      return response({ access_token: "synthetic-token", user: { email: internalEmail, email_confirmed_at: new Date().toISOString() } });
    }
    if (url.endsWith("/rest/v1/patient_portal_sessions") && init.method === "POST") {
      issued += 1;
      return response({}, 201);
    }
    if (url.includes("/rest/v1/patient_portal_sessions?") && init.method === "PATCH") {
      return response({}, 204);
    }
    if (url.includes("api.brevo.com/v3/smtp/email")) {
      mail.push(payload);
      return response({ messageId: "fictitious" });
    }
    throw Error("Unexpected request: " + url);
  };
  const fakeDeno = {
    env: { get: key => ({
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
      SUPABASE_ANON_KEY: "anon-key-test",
      BREVO_API_KEY: "brevo-test"
    })[key] || "" },
    serve: callback => { handler = callback; }
  };
  vm.runInNewContext(compiled.outputText, {
    Deno: fakeDeno, fetch: fetchStub, Response, URL, crypto: webcrypto,
    TextEncoder, Uint8Array, Uint32Array, btoa,
    console: { error() {}, warn() {} }
  }, { timeout: 8000 });
  async function call(action, other = {}) {
    const request = new Request("https://example.supabase.co/functions/v1/patient-portal-auth", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, email: realEmail, ...other })
    });
    const res = await handler(request);
    return { status: res.status, data: await res.json() };
  }
  return { call, requests, mail, revokePatient: () => { authorized = false; },
    passwordWasUpdated: () => passwordWasUpdated, issued: () => issued };
}

test("invitations go only to actual patient email and never expose user presence", async () => {
  const h = createHarness();
  const res = await h.call("password-link", { purpose: "setup" });
  assert.equal(res.status, 200);
  assert.equal(h.mail.length, 1);
  assert.equal(h.mail[0].to[0].email, realEmail);
  assert.equal(h.mail[0].to[0].email.includes("@auth."), false);
  assert.equal(h.mail[0].headers["X-Mailin-Track-Opens"], "0");
  assert.equal(h.issued(), 0);
  const other = createHarness();
  other.revokePatient();
  const privateResponse = await other.call("password-link", { purpose: "setup" });
  assert.deepEqual(privateResponse.data, res.data);
  assert.equal(other.mail.length, 0);
});

test("one-time link sets a password but does not grant clinical session", async () => {
  const h = createHarness();
  const success = await h.call("password-set", {
    flow: "invite", token_hash: knownHash, password: acceptedPassword
  });
  assert.equal(success.status, 200);
  assert.equal(h.passwordWasUpdated(), true);
  assert.equal(h.issued(), 0);
  const replay = await h.call("password-set", {
    flow: "invite", token_hash: knownHash, password: acceptedPassword
  });
  assert.equal(replay.status, 401);
  assert.equal(h.issued(), 0);
});

test("only correct password generates a tagged clinical session", async () => {
  const h = createHarness();
  const invalid = await h.call("password-login", { password: "incorrect" });
  assert.equal(invalid.status, 401);
  assert.equal(h.issued(), 0);
  const valid = await h.call("password-login", { password: acceptedPassword });
  assert.equal(valid.status, 200);
  assert.match(valid.data.session_token, /^pwd2_[A-Za-z0-9_-]{40,}$/);
  assert.equal(h.issued(), 1);
  const other = createHarness();
  other.revokePatient();
  const denial = await other.call("password-login", { password: acceptedPassword });
  assert.equal(denial.status, 401);
  assert.equal(other.issued(), 0);
});

test("old code/link actions cannot bypass password sign-in", async () => {
  const h = createHarness();
  for (const action of ["verify", "verify-link", "request", "request-link"]) {
    const result = await h.call(action, { token: "fake", code: "123456" });
    assert.equal(result.status, 400);
  }
  assert.equal(h.issued(), 0);
});
