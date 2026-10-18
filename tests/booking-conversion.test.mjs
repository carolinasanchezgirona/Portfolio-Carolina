import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const get = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("la reserva es breve y no pide consentimientos clínicos prematuros", () => {
  const page = get("app/cita/page.tsx");
  const booking = get("public/booking.js");
  assert.match(page, /información de privacidad completa/);
  assert.match(page, /condiciones de cancelación/);
  assert.doesNotMatch(page, /type="checkbox"/);
  assert.doesNotMatch(page, /signer-name|privacy_acknowledged|informed_consent_accepted/);
  assert.match(booking, /create_public_booking_quick/);
  assert.doesNotMatch(booking, /p_signer_name|p_informed_consent_accepted/);
});

test("la llamada a reservar transmite únicamente los campos administrativos", () => {
  const script = get("public/booking.js");
  const start = script.indexOf('rpc("create_public_booking_quick", {');
  assert.ok(start >= 0);
  const end = script.indexOf("});", start);
  const payload = script.slice(start, end);
  assert.match(payload, /p_starts_at:/);
  assert.match(payload, /p_patient_name:/);
  assert.match(payload, /p_patient_email:/);
  assert.match(payload, /p_patient_phone:/);
  assert.doesNotMatch(payload, /p_diagnosis|p_clinical|p_health/);
});

test("los eventos de conversión no añaden datos identificativos", () => {
  const script = get("public/booking.js");
  const tracking = script.split("\n").filter((line) => line.includes('gtag?.("event"'));
  assert.ok(tracking.length >= 4);
  for (const line of tracking) {
    assert.doesNotMatch(line, /patient_name|patient_email|patient_phone|service_code|starts_at/);
  }
  const analytics = get("app/components/google-analytics-consent.tsx");
  assert.match(analytics, /consent === "accepted"/);
});

test("el botón móvil deja libres las preferencias de cookies", () => {
  const style = get("app/components/conversion.css");
  assert.match(style, /mobile-booking-shortcut/);
  assert.match(style, /analytics-consent-settings/);
  assert.match(style, /analytics-consent\)/);
});

test("el panel de marketing muestra recuentos sin solicitar datos personales", () => {
  const panel = get("app/admin/marketing/page.tsx");
  assert.match(panel, /Solicitudes de primera visita/);
  assert.match(panel, /patient_type,status,created_at/);
  assert.doesNotMatch(panel, /patient_name,patient_email/);
});
