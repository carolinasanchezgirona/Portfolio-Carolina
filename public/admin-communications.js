(() => {
  "use strict";

  const dialog = document.querySelector("#appointment-dialog");
  const form = document.querySelector("#appointment-form");
  const idField = document.querySelector("#appointment-id");
  if (!dialog || !form || !idField) return;

  const SESSION_KEY = "dememoria_admin_session";
  let configPromise = null;
  let panel = null;
  let lastLoadedId = null;

  async function config() {
    if (configPromise) return configPromise;
    configPromise = fetch("/admin-agenda-v3.js", { cache: "no-store" })
      .then((response) => response.text())
      .then((text) => {
        const url = text.match(/const SUPABASE_URL = \"([^\"]+)\"/)?.[1];
        const key = text.match(/const KEY = \"([^\"]+)\"/)?.[1];
        if (!url || !key) throw new Error("No se ha podido leer la configuración de la agenda.");
        return { rest: `${url}/rest/v1`, key };
      });
    return configPromise;
  }

  function session() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }

  async function authHeaders() {
    const current = session();
    const c = await config();
    return { apikey: c.key, Authorization: `Bearer ${current?.access_token || ""}` };
  }

  function googleDate(value) {
    return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }

  function googleUrl(appointment) {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Cita con Carolina Sánchez",
      dates: `${googleDate(appointment.starts_at)}/${googleDate(appointment.ends_at)}`,
      details: "Cita profesional con Carolina Sánchez · 60 minutos. Si necesitas cambiar o cancelar la cita, avisa con al menos 24 horas de antelación.",
      location: "Dememoria · Carrer Barcelona 8, Local · Arenys de Mar",
      ctz: "Europe/Madrid",
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement("section");
    panel.id = "appointment-communications";
    panel.className = "admin-note";
    panel.innerHTML = `<strong>Comunicaciones</strong><div id="appointment-communications-body" style="display:grid;gap:7px;margin-top:9px"></div>`;
    const note = form.querySelector(".admin-note");
    note?.after(panel);
    return panel;
  }

  function setBody(html) {
    ensurePanel();
    const body = panel.querySelector("#appointment-communications-body");
    if (body) body.innerHTML = html;
  }

  async function copyCalendarLink(appointment) {
    const url = googleUrl(appointment);
    try {
      await navigator.clipboard.writeText(url);
      const button = panel?.querySelector("#copy-calendar-link");
      if (button) {
        const previous = button.textContent;
        button.textContent = "Enlace copiado";
        setTimeout(() => { button.textContent = previous; }, 1500);
      }
    } catch {
      window.open(url, "_blank", "noopener");
    }
  }

  async function loadAppointment() {
    ensurePanel();
    const id = idField.value;
    if (!id) {
      lastLoadedId = null;
      setBody("<span>Nueva cita. El estado de comunicaciones aparecerá después de guardarla.</span>");
      return;
    }
    if (lastLoadedId === id && panel.dataset.loaded === "true") return;
    lastLoadedId = id;
    panel.dataset.loaded = "false";
    setBody("<span>Consultando comunicaciones…</span>");

    try {
      const c = await config();
      const select = "id,status,patient_email,starts_at,ends_at,reminder_sent_at,needs_patient_confirmation,created_by_admin";
      const response = await fetch(`${c.rest}/appointment_bookings?select=${encodeURIComponent(select)}&id=eq.${encodeURIComponent(id)}&limit=1`, {
        headers: await authHeaders(), cache: "no-store",
      });
      const rows = await response.json().catch(() => []);
      if (!response.ok || !rows.length) throw new Error("No se ha podido consultar la cita.");
      const appointment = rows[0];

      const confirmation = appointment.created_by_admin
        ? "No requerida · creada desde admin"
        : appointment.needs_patient_confirmation
          ? "Pendiente de confirmación"
          : "Confirmación completada";
      const reminder = appointment.reminder_sent_at
        ? `Enviado · ${new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Madrid" }).format(new Date(appointment.reminder_sent_at))}`
        : "Pendiente";
      const email = appointment.patient_email ? "Disponible" : "Sin correo";

      setBody(`
        <span><b>Confirmación:</b> ${confirmation}</span>
        <span><b>Recordatorio por email:</b> ${reminder}</span>
        <span><b>Email:</b> ${email}</span>
        <button id="copy-calendar-link" class="admin-secondary" type="button" style="justify-self:start;margin-top:5px">Copiar enlace de Google Calendar</button>
      `);
      panel.querySelector("#copy-calendar-link")?.addEventListener("click", () => copyCalendarLink(appointment));
      panel.dataset.loaded = "true";
    } catch (error) {
      setBody(`<span>${error instanceof Error ? error.message : "No se ha podido consultar el estado."}</span>`);
    }
  }

  const observer = new MutationObserver(() => {
    if (dialog.open) setTimeout(loadAppointment, 0);
    else {
      lastLoadedId = null;
      if (panel) panel.dataset.loaded = "false";
    }
  });
  observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });

  document.addEventListener("click", (event) => {
    if (!dialog.open) return;
    const target = event.target;
    if (target instanceof Element && target.closest(".appointment-card, .patient-history-list button")) {
      setTimeout(loadAppointment, 0);
    }
  });
})();
