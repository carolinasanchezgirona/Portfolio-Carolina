(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const ZONE = "Europe/Madrid";
  const MODULE_VERSION = "20260915-2";

  const appointmentDialog = document.querySelector("#appointment-dialog");
  const idField = document.querySelector("#appointment-id");
  const actions = appointmentDialog?.querySelector(".dialog-actions");
  if (!appointmentDialog || !idField || !actions) return;

  const button = document.createElement("button");
  button.id = "appointment-quick-reschedule";
  button.type = "button";
  button.className = "admin-secondary";
  button.textContent = "Reprogramar";
  button.hidden = true;
  const cancelButton = document.querySelector("#appointment-cancel-booking");
  actions.insertBefore(button, cancelButton || actions.lastElementChild);

  const dialog = document.createElement("dialog");
  dialog.id = "quick-reschedule-dialog";
  dialog.className = "appointment-dialog";
  dialog.dataset.moduleVersion = MODULE_VERSION;
  dialog.innerHTML = `
    <form id="quick-reschedule-form">
      <div class="dialog-heading">
        <div><p class="admin-eyebrow">Reprogramar cita</p><h2 id="quick-reschedule-title">Nueva fecha y hora</h2></div>
        <button id="quick-reschedule-close" class="dialog-close" type="button" aria-label="Cerrar">×</button>
      </div>
      <p id="quick-reschedule-current" class="admin-note"></p>
      <div class="form-grid two-cols">
        <label>Nueva fecha<input id="quick-reschedule-date" type="date" required></label>
        <label>Nueva hora<input id="quick-reschedule-time" type="time" step="1800" required></label>
      </div>
      <div id="quick-reschedule-shortcuts" style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 16px">
        <button type="button" class="admin-secondary" data-add-days="7">+ 1 semana</button>
        <button type="button" class="admin-secondary" data-add-days="14">+ 15 días</button>
        <button type="button" class="admin-secondary" data-add-days="28">+ 4 semanas</button>
      </div>
      <label id="quick-reschedule-scope-wrap" hidden>Aplicar a
        <select id="quick-reschedule-scope">
          <option value="this">Solo esta cita</option>
          <option value="following">Esta y las siguientes</option>
          <option value="all">Toda la serie</option>
        </select>
      </label>
      <p class="admin-note">Se comprobarán solapamientos antes de guardar. Este cambio no envía un correo automático al paciente.</p>
      <p id="quick-reschedule-message" class="admin-message" role="status"></p>
      <div class="dialog-actions">
        <button id="quick-reschedule-cancel" class="admin-secondary" type="button">Cancelar</button>
        <button id="quick-reschedule-save" class="admin-primary" type="submit">Guardar nueva fecha</button>
      </div>
    </form>`;
  document.body.append(dialog);

  const form = dialog.querySelector("#quick-reschedule-form");
  const dateField = dialog.querySelector("#quick-reschedule-date");
  const timeField = dialog.querySelector("#quick-reschedule-time");
  const scopeWrap = dialog.querySelector("#quick-reschedule-scope-wrap");
  const scopeField = dialog.querySelector("#quick-reschedule-scope");
  const currentText = dialog.querySelector("#quick-reschedule-current");
  const message = dialog.querySelector("#quick-reschedule-message");
  const saveButton = dialog.querySelector("#quick-reschedule-save");
  let current = null;

  function session() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }
  function headers() {
    return { apikey: KEY, Authorization: `Bearer ${session()?.access_token || ""}`, "Content-Type": "application/json" };
  }
  function dateKey(iso) {
    const parts = new Intl.DateTimeFormat("en-CA", { year:"numeric", month:"2-digit", day:"2-digit", timeZone:ZONE }).formatToParts(new Date(iso));
    const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}`;
  }
  function timeKey(iso) {
    return new Intl.DateTimeFormat("en-GB", { hour:"2-digit", minute:"2-digit", hour12:false, timeZone:ZONE }).format(new Date(iso));
  }
  function zoneOffsetMs(date) {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone:ZONE, hour12:false, year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit" }).formatToParts(date);
    const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
    return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)-date.getTime();
  }
  function localToIso(key, time) {
    const [y,m,d] = key.split("-").map(Number); const [hh,mm] = time.split(":").map(Number);
    const guess = Date.UTC(y,m-1,d,hh,mm,0); let instant = new Date(guess);
    let offset = zoneOffsetMs(instant); instant = new Date(guess-offset);
    const refined = zoneOffsetMs(instant); if (refined !== offset) instant = new Date(guess-refined);
    return instant.toISOString();
  }
  function addDays(key, days) {
    const [y,m,d] = key.split("-").map(Number);
    const dt = new Date(Date.UTC(y,m-1,d+days,12));
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth()+1).padStart(2,"0")}-${String(dt.getUTCDate()).padStart(2,"0")}`;
  }

  async function fetchAppointment(id) {
    const select = "id,patient_name,patient_email,patient_phone,patient_type,status,starts_at,price_eur,service_code,recurrence_group_id,recurrence_pattern,recurrence_index,recurrence_total";
    const response = await fetch(`${REST_URL}/appointment_bookings?select=${encodeURIComponent(select)}&id=eq.${encodeURIComponent(id)}&limit=1`, { headers: headers(), cache:"no-store" });
    const rows = await response.json().catch(() => []);
    if (!response.ok || !rows?.[0]) throw new Error("No se ha podido cargar la cita.");
    return rows[0];
  }

  async function openQuickReschedule() {
    if (!idField.value) return;
    button.disabled = true;
    try {
      current = await fetchAppointment(idField.value);
      dateField.value = dateKey(current.starts_at);
      timeField.value = timeKey(current.starts_at);
      currentText.textContent = `${current.patient_name} · ${dateField.value} · ${timeField.value}`;
      scopeField.value = "this";
      scopeWrap.hidden = !current.recurrence_group_id;
      message.textContent = "";
      appointmentDialog.close();
      dialog.showModal();
    } catch (error) {
      const target = document.querySelector("#appointment-message");
      if (target) target.textContent = error instanceof Error ? error.message : "No se ha podido abrir la reprogramación.";
    } finally { button.disabled = false; }
  }

  const observer = new MutationObserver(() => {
    button.hidden = !(appointmentDialog.open && idField.value);
  });
  observer.observe(appointmentDialog, { attributes:true, attributeFilter:["open"] });
  idField.addEventListener("change", () => { button.hidden = !idField.value; });
  button.addEventListener("click", openQuickReschedule);

  dialog.querySelector("#quick-reschedule-close").addEventListener("click", () => dialog.close());
  dialog.querySelector("#quick-reschedule-cancel").addEventListener("click", () => dialog.close());
  dialog.querySelectorAll("[data-add-days]").forEach((shortcut) => shortcut.addEventListener("click", () => {
    if (!dateField.value) return;
    dateField.value = addDays(dateField.value, Number(shortcut.dataset.addDays || 0));
  }));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!current || !dateField.value || !timeField.value) return;
    saveButton.disabled = true;
    message.textContent = "Comprobando disponibilidad…";
    const startsAt = localToIso(dateField.value, timeField.value);
    const scope = current.recurrence_group_id ? scopeField.value : "this";
    const body = {
      p_id: current.id,
      p_starts_at: startsAt,
      p_patient_name: current.patient_name,
      p_patient_email: current.patient_email || null,
      p_patient_phone: current.patient_phone || null,
      p_patient_type: current.patient_type || "existing",
      p_service_code: current.service_code || "psicologia_general_sanitaria",
      p_status: current.status || "confirmed",
      p_price_eur: Number(current.price_eur ?? 60),
    };
    const endpoint = scope === "this" ? "admin_update_appointment" : "admin_update_appointment_series_scope";
    if (scope !== "this") body.p_scope = scope;
    try {
      const response = await fetch(`${REST_URL}/rpc/${endpoint}`, { method:"POST", headers:headers(), body:JSON.stringify(body) });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || result?.error || "No se ha podido reprogramar la cita.");
      message.textContent = scope === "this" ? "Cita reprogramada." : `${result || "Las"} cita(s) reprogramadas.`;
      setTimeout(() => window.location.reload(), 350);
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : "No se ha podido reprogramar la cita.";
      saveButton.disabled = false;
    }
  });
})();