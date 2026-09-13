(() => {
  "use strict";

  const form = document.querySelector("#booking-form");
  const message = document.querySelector("#form-message");
  const submit = document.querySelector("#booking-submit");
  if (!form || !message || !submit) return;

  let pendingCalendar = null;
  let actions = null;

  function googleDate(value) {
    return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }

  function serviceLabel() {
    const selected = form.querySelector('input[name="service_code"]:checked');
    return selected?.value === "neuropsicologia" ? "Neuropsicología" : "Psicología General Sanitaria";
  }

  function calendarData() {
    const startsAt = String(form.querySelector("#selected-slot")?.value || "");
    if (!startsAt) return null;
    const start = new Date(startsAt);
    if (Number.isNaN(start.getTime())) return null;
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return { start, end, service: serviceLabel() };
  }

  function googleCalendarUrl(data) {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Cita con Carolina Sánchez",
      dates: `${googleDate(data.start)}/${googleDate(data.end)}`,
      details: `Cita profesional con Carolina Sánchez · ${data.service} · 60 minutos. Si necesitas cambiar o cancelar la cita, avisa con al menos 24 horas de antelación.`,
      ctz: "Europe/Madrid",
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function icsHref(data) {
    const escape = (value) => String(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
    const stamp = googleDate(new Date());
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Carolina Sanchez//Citas//ES",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-cita`}@carolinasanchezgirona.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${googleDate(data.start)}`,
      `DTEND:${googleDate(data.end)}`,
      `SUMMARY:${escape("Cita con Carolina Sánchez")}`,
      `DESCRIPTION:${escape(`Cita profesional · ${data.service} · 60 minutos.`)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
  }

  function clearActions() {
    actions?.remove();
    actions = null;
  }

  function showActions(data) {
    clearActions();
    actions = document.createElement("div");
    actions.className = "calendar-save-actions";
    actions.setAttribute("role", "group");
    actions.setAttribute("aria-label", "Guardar la cita en el calendario");

    const label = document.createElement("p");
    label.className = "form-help";
    label.textContent = "¿Quieres guardar esta cita en tu calendario?";

    const google = document.createElement("a");
    google.className = "text-button";
    google.href = googleCalendarUrl(data);
    google.target = "_blank";
    google.rel = "noopener";
    google.textContent = "Añadir a Google Calendar";

    const ics = document.createElement("a");
    ics.className = "text-button";
    ics.href = icsHref(data);
    ics.download = "cita-carolina-sanchez.ics";
    ics.textContent = "Apple / Outlook (.ics)";

    actions.append(label, google, ics);
    submit.before(actions);
  }

  form.addEventListener("submit", (event) => {
    clearActions();
    const data = new FormData(form);
    const name = String(data.get("patient_name") || "").trim();
    const signer = String(data.get("signer_name") || "").trim();

    if (name && signer && signer !== name) {
      event.preventDefault();
      event.stopImmediatePropagation();
      message.textContent = "La firma debe coincidir exactamente con el nombre y apellidos indicados, respetando mayúsculas, minúsculas, tildes y espacios internos.";
      message.className = "form-message form-message-error";
      return;
    }

    pendingCalendar = calendarData();
  }, true);

  const observer = new MutationObserver(() => {
    if (!pendingCalendar) return;
    if (!message.classList.contains("form-message-success")) return;
    showActions(pendingCalendar);
    pendingCalendar = null;
  });

  observer.observe(message, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["class"] });
})();
