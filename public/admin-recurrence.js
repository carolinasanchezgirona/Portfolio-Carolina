(() => {
  "use strict";

  const ZONE = "Europe/Madrid";
  const SESSION_KEY = "dememoria_admin_session";
  const form = document.querySelector("#appointment-form");
  if (!form) return;

  const q = (s) => document.querySelector(s);

  function ensureControls() {
    let repeat = q("#appointment-repeat");
    let count = q("#appointment-repeat-count");
    let repeatFields = q("#appointment-repeat-fields");
    if (repeat && count) return { repeat, count, repeatFields };

    const block = document.createElement("div");
    block.id = "appointment-recurrence-controls";
    block.className = "form-grid two-cols";
    block.innerHTML = `
      <label>
        Repetir cita
        <select id="appointment-repeat">
          <option value="none">No repetir</option>
          <option value="weekly">Cada semana</option>
          <option value="biweekly">Cada 15 días</option>
          <option value="monthly">Una vez al mes</option>
        </select>
      </label>
      <label id="appointment-repeat-fields" hidden>
        Número total de sesiones
        <input id="appointment-repeat-count" type="number" min="2" max="52" step="1" value="4" />
      </label>`;

    const firstNote = form.querySelector(".admin-note");
    form.insertBefore(block, firstNote || q("#appointment-message"));

    const note = document.createElement("p");
    note.id = "appointment-recurrence-note";
    note.className = "admin-note";
    note.textContent = "La serie se guarda completa en una sola operación. Si alguna fecha está ocupada o bloqueada, no se crea ninguna cita. Si partes de una cita existente, esa cita cuenta como la primera sesión.";
    block.insertAdjacentElement("afterend", note);

    repeat = q("#appointment-repeat");
    count = q("#appointment-repeat-count");
    repeatFields = q("#appointment-repeat-fields");
    return { repeat, count, repeatFields };
  }

  const { repeat, count, repeatFields } = ensureControls();
  if (!repeat || !count) return;

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
    return {
      apikey: c.key,
      Authorization: `Bearer ${current?.access_token || ""}`,
      "Content-Type": "application/json",
    };
  }

  function zoneOffsetMs(value) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: ZONE,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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

  function msg(text) {
    const el = q("#appointment-message");
    if (el) el.textContent = text;
  }

  async function rpc(name, body) {
    const c = await config();
    const response = await fetch(`${c.rest}/rpc/${name}`, {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.hint || "No se ha podido guardar la serie.");
    return data;
  }

  function visibility() {
    const active = repeat.value !== "none";
    if (repeatFields) repeatFields.hidden = !active;
    count.required = active;
  }

  function resetRecurrence() {
    repeat.value = "none";
    count.value = "4";
    visibility();
  }

  repeat.addEventListener("change", visibility);
  form.addEventListener("reset", () => setTimeout(resetRecurrence, 0));
  q("#appointment-dialog")?.addEventListener("close", resetRecurrence);

  form.addEventListener("submit", async (event) => {
    if (repeat.value === "none") return;

    event.preventDefault();
    event.stopImmediatePropagation();
    if (!form.checkValidity()) return form.reportValidity();

    const total = Number(count.value || 0);
    if (!Number.isInteger(total) || total < 2 || total > 52) {
      msg("Indica entre 2 y 52 sesiones en total.");
      return;
    }

    const date = q("#appointment-date").value;
    const time = q("#appointment-time").value;
    const startsAt = madridLocalToIso(date, time);
    const existingId = q("#appointment-id")?.value || null;
    const button = q("#appointment-save");

    if (button) {
      button.disabled = true;
      button.textContent = "Guardando serie…";
    }

    try {
      msg("Comprobando y guardando toda la serie…");
      await rpc("admin_create_appointment_series", {
        p_existing_id: existingId,
        p_starts_at: startsAt,
        p_patient_name: q("#appointment-name").value.trim(),
        p_patient_email: q("#appointment-email").value.trim() || null,
        p_patient_phone: q("#appointment-phone").value.trim() || null,
        p_patient_type: q("#appointment-patient-type").value,
        p_service_code: q("#appointment-service").value,
        p_status: q("#appointment-status").value,
        p_price_eur: Number(q("#appointment-price").value || 60),
        p_pattern: repeat.value,
        p_total: total,
      });

      msg(`Serie guardada correctamente: ${total} citas.`);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      msg(error instanceof Error ? error.message : "No se ha podido guardar la serie.");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = existingId ? "Guardar cambios" : "Crear cita";
      }
    }
  }, true);

  visibility();
})();
