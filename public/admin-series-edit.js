(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const ZONE = "Europe/Madrid";

  const dialog = document.querySelector("#appointment-dialog");
  const form = document.querySelector("#appointment-form");
  const idField = document.querySelector("#appointment-id");
  const message = document.querySelector("#appointment-message");
  if (!dialog || !form || !idField) return;

  const session = () => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  };
  const headers = () => ({ apikey: KEY, Authorization: `Bearer ${session()?.access_token || ""}`, "Content-Type": "application/json" });

  function zoneOffsetMs(date) {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: ZONE, hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(date);
    const p = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - date.getTime();
  }
  function madridLocalToIso(dateKey, time) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    const guess = Date.UTC(y, m - 1, d, hh, mm, 0);
    let instant = new Date(guess);
    let offset = zoneOffsetMs(instant);
    instant = new Date(guess - offset);
    const refined = zoneOffsetMs(instant);
    if (refined !== offset) instant = new Date(guess - refined);
    return instant.toISOString();
  }

  const block = document.createElement("div");
  block.id = "series-edit-scope-block";
  block.className = "admin-note";
  block.hidden = true;
  block.innerHTML = `
    <strong>Cita periódica</strong>
    <label style="display:grid;gap:7px;margin-top:8px">Aplicar cambios a
      <select id="series-edit-scope" style="width:100%;min-height:42px;padding:9px 11px;border:1px solid #9EDCE7;border-radius:10px;background:#fff">
        <option value="this">Solo esta cita</option>
        <option value="following">Esta y las siguientes</option>
        <option value="all">Toda la serie</option>
      </select>
    </label>
    <span id="series-edit-info" style="display:block;margin-top:7px"></span>`;
  const existingNote = form.querySelector(".admin-note");
  existingNote?.before(block);
  const scope = block.querySelector("#series-edit-scope");
  const info = block.querySelector("#series-edit-info");

  async function inspectSeries() {
    block.hidden = true;
    scope.value = "this";
    const id = idField.value;
    if (!id) return;
    const response = await fetch(`${REST_URL}/appointment_bookings?select=id,recurrence_group_id,recurrence_pattern,recurrence_index,recurrence_total&id=eq.${encodeURIComponent(id)}&limit=1`, { headers: headers(), cache: "no-store" });
    const rows = await response.json().catch(() => []);
    const item = rows?.[0];
    if (!response.ok || !item?.recurrence_group_id) return;
    const pattern = ({ weekly: "semanal", biweekly: "cada 15 días", monthly: "mensual" })[item.recurrence_pattern] || item.recurrence_pattern || "periódica";
    info.textContent = `Serie ${pattern} · sesión ${item.recurrence_index || "?"} de ${item.recurrence_total || "?"}.`;
    block.hidden = false;
  }

  const observer = new MutationObserver(() => {
    if (dialog.open) setTimeout(inspectSeries, 50);
    else block.hidden = true;
  });
  observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });

  form.addEventListener("submit", async (event) => {
    if (block.hidden || scope.value === "this" || !idField.value) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const date = document.querySelector("#appointment-date")?.value || "";
    const time = document.querySelector("#appointment-time")?.value || "";
    const name = document.querySelector("#appointment-name")?.value?.trim() || "";
    if (!date || !time || !name) { if (message) message.textContent = "Completa fecha, hora y nombre."; return; }

    const button = document.querySelector("#appointment-save");
    if (button) { button.disabled = true; button.textContent = "Guardando serie…"; }
    if (message) message.textContent = "Comprobando y actualizando la serie…";

    const body = {
      p_id: idField.value,
      p_starts_at: madridLocalToIso(date, time),
      p_patient_name: name,
      p_patient_email: document.querySelector("#appointment-email")?.value?.trim() || null,
      p_patient_phone: document.querySelector("#appointment-phone")?.value?.trim() || null,
      p_patient_type: document.querySelector("#appointment-patient-type")?.value || "existing",
      p_service_code: document.querySelector("#appointment-service")?.value || "psicologia_general_sanitaria",
      p_status: document.querySelector("#appointment-status")?.value || "confirmed",
      p_price_eur: Number(document.querySelector("#appointment-price")?.value || 60),
      p_scope: scope.value,
    };

    try {
      const response = await fetch(`${REST_URL}/rpc/admin_update_appointment_series_scope`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || result?.error || "No se ha podido actualizar la serie.");
      if (message) message.textContent = `${result || "Las"} cita(s) actualizadas.`;
      setTimeout(() => window.location.reload(), 350);
    } catch (error) {
      if (message) message.textContent = error instanceof Error ? error.message : "No se ha podido actualizar la serie.";
      if (button) { button.disabled = false; button.textContent = "Guardar cambios"; }
    }
  }, true);
})();