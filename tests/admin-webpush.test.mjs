import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const worker = read("worker.ts");
const backend = read("admin-webpush.ts");
const client = read("public/admin-notifications.js");
const sw = read("public/sw.js");
const wrangler = read("wrangler.toml");
const workflow = read(".github/workflows/cloudflare-manual-release.yml");
const setup = read("scripts/ensure-vapid.mjs");
const manifest = read("public/clinic-manifest.webmanifest");

test("Push API exige la cuenta profesional y evita endpoints arbitrarios SSRF", () => {
  assert.match(worker, /adminPushRequest\(request, env, verifyEditorialOwner\)/);
  assert.match(backend, /await verifyOwner\(request\)/);
  assert.match(backend, /originMatches\(request\)/);
  assert.match(backend, /url\.protocol !== "https:"/);
  assert.match(backend, /fcm\.googleapis\.com/);
  assert.match(backend, /push\.services\.mozilla\.com/);
  assert.match(backend, /\.push\.apple\.com/);
});

test("VAPID nunca se compromete en GitHub y conserva claves entre despliegues", () => {
  assert.match(setup, /generateKeyPairSync\("ec"/);
  assert.match(setup, /secret","list"/);
  assert.match(setup, /existingPublic !== existingPrivate/);
  assert.match(setup, /if \(existingPublic\)/);
  assert.match(setup, /secret","bulk"/);
  assert.match(workflow, /node scripts\/ensure-vapid\.mjs/);
  assert.doesNotMatch(client, /VAPID_PRIVATE_JWK|SERVICE_ROLE_KEY/);
});

test("En el móvil se muestra solo aviso genérico y permite desactivarlo", () => {
  assert.match(client, /Notification\.requestPermission\(\)/);
  assert.match(client, /pushManager\.subscribe/);
  assert.match(client, /action:"unsubscribe"/);
  assert.match(sw, /addEventListener\("push"/);
  assert.match(sw, /showNotification\("Dememoria · Nuevo aviso"/);
  assert.match(sw, /notificationclick/);
  assert.doesNotMatch(sw, /patient_name|patient_email|patient_id|diagnostico|medication/);
  assert.equal(JSON.parse(manifest).scope, "/admin/");
});

test("Solo se envían reservas web y respuestas compartidas, con deduplicación y sin carga clínica", () => {
  assert.match(backend, /created_by_admin=is\.false/);
  assert.match(backend, /patient_response_shared_at=gte/);
  assert.match(backend, /admin_push_deliveries\?on_conflict=subscription_id,event_type,event_id/);
  assert.match(backend, /Date\.parse\(ev\.at\) <= Date\.parse\(sub\.created_at\)/);
  assert.match(backend, /method: "POST"/);
  assert.doesNotMatch(backend, /patient_name|patient_email|clinical_summary|patient_response[,:]/);
  assert.match(wrangler, /crons = \["\*\/10 \* \* \* \*"\]/);
  assert.match(workflow, /La API privada de avisos debe rechazar solicitudes sin sesión/);
});
