(() => {
  "use strict";

  const ZONE = "Europe/Madrid";
  const SESSION_KEY = "dememoria_admin_session";
  const form = document.querySelector("#appointment-form");
  const repeat = document.querySelector("#appointment-repeat");
  const count = document.querySelector("#appointment-repeat-count");
  const repeatFields = document.querySelector("#appointment-repeat-fields");
  if (!form || !repeat || !count) return;

  const q = (s) => document.querySelector(s);
  let configPromise = null;

  async function config() {
    if (configPromise) return configPromise;
    configPromise = fetch("/admin-agenda-v3.js", { cache: "no-store" })
      .then((r) => r.text())
      .then((text) => {
        const url = text.match(/const SUPABASE_URL = \"([^\"]+)\"/)?.[1];
        const key = text.match(/const KEY = \"([^\"]+)\"/)?.[1];
        if (!url || !key) throw new Error("No se ha podido leer la configuración de la agenda.");
        return { rest: `${url}/rest/v1`, key };
      });
    return configPromise;
  }

  function auth() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }

  async function headers() {
    const c = await config();
    const current = auth();
    return { apikey: c.key, Authorization: `Bearer ${current?.access_token || ""}`, "Content-Type": "application/json" };
  }

  function zoneOffsetMs(value) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: ZONE, hour12: false, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(value);
    const p = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - value.getTime();
  }

  function madridLocalToIso(dateKey, timeValue) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const [hh, mm] = timeValue.split(":").map(Number);
    const guess = Date.UTC(y, m - 1, d, hh, mm, 0);
    let instant = new Date(guess);
    let offset = zoneOffsetMs(instant);
    instant = new Date(guess - offset);
    const refined = zoneOffsetMs(instant);
    if (refined !== offset) instant = new Date(guess - refined);
    return instant.toISOString();
  }

  function addDays(key, days) {
    const [y, m, d] = key.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + days, 12));
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
  }

  function addMonths(key, months) {
    const [y, m, d] = key.split("-").map(Number);
    const first = new Date(Date.UTC(y, m - 1 + months, 1, 12));
    const maxDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0, 12)).getUTCDate();
    const day = Math.min(d, maxDay);
    return `${first.getUTCFullYear()}-${String(first.getUTCMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function dateAt(start, kind, index) {
    if (kind === "weekly") return addDays(start, index * 7);
    if (kind === "biweekly") return addDays(start, index * 14);
    return addMonths(start, index);
  }

  function msg(text) { const el = q("#appointment-message"); if (el) el.textContent = text; }

  async function rpc(name, body) {
    const c = await config();
    const response = await fetch(`${c.rest}/rpc/${name}`, {
      method: "POST", headers: await headers(), body: JSON.stringify(body), cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.hint || "No se ha podido crear la cita.");
    return data;
  }

  async function preflight(starts) {
    const c = await config();
    const h = await headers();
    for (const start of starts) {
      const end = new Date(new Date(start).getTime() + 3600000).toISOString();
      const bookings = `${c.rest}/appointment_bookings?select=id&status=in.(pending,confirmed)&starts_at=lt.${encodeURIComponent(end)}&ends_at=gt.${encodeURIComponent(start)}&limit=1`;
      const blocks = `${c.rest}/appointment_schedule_blocks?select=id&starts_at=lt.${encodeURIComponent(end)}&ends_at=gt.${encodeURIComponent(start)}&limit=1`;
      const [a, b] = await Promise.all([fetch(bookings, { headers: h }), fetch(blocks, { headers: h })]);
      const aa = a.ok ? await a.json() : [];
      const bb = b.ok ? await b.json() : [];
      if (aa.length || bb.length) {
        const when = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: ZONE }).format(new Date(start));
        throw new Error(`No se ha creado la serie: ${when} ya está ocupado o bloqueado.`);
      }
    }
  }

  function visibility() {
    const active = repeat.value !== "none";
    if (repeatFields) repeatFields.hidden = !active;
    count.required = active;
  }
  repeat.addEventListener("change", visibility);

  form.addEventListener("submit", async (event) => {
    if (repeat.value === "none" || q("#appointment-id")?.value) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!form.checkValidity()) return form.reportValidity();

    const total = Number(count.value || 0);
    if (!Number.isInteger(total) || total < 2 || total > 52) return msg("Indica entre 2 y 52 sesiones.");

    const date = q("#appointment-date").value;
    const time = q("#appointment-time").value;
    const starts = Array.from({ length: total }, (_, i) => madridLocalToIso(dateAt(date, repeat.value, i), time));
    const button = q("#appointment-save");
    if (button) { button.disabled = true; button.textContent = "Creando serie…"; }

    try {
      msg("Comprobando todos los horarios…");
      await preflight(starts);
      const common = {
        p_patient_name: q("#appointment-name").value.trim(),
        p_patient_email: q("#appointment-email").value.trim() || null,
        p_patient_phone: q("#appointment-phone").value.trim() || null,
        p_patient_type: q("#appointment-patient-type").value,
        p_service_code: q("#appointment-service").value,
        p_status: q("#appointment-status").value,
        p_price_eur: Number(q("#appointment-price").value || 60),
      };
      for (let i = 0; i < starts.length; i += 1) {
        msg(`Creando sesión ${i + 1} de ${starts.length}…`);
        await rpc("admin_create_appointment", { p_starts_at: starts[i], ...common });
      }
      msg(`Serie creada: ${starts.length} citas.`);
      repeat.value = "none";
      visibility();
      setTimeout(() => window.location.reload(), 600);
    } catch (error) {
      msg(error instanceof Error ? error.message : "No se ha podido crear la serie.");
    } finally {
      if (button) { button.disabled = false; button.textContent = "Crear cita"; }
    }
  }, true);

  visibility();
})();
