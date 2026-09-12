(() => {
  "use strict";

  const REST_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const ZONE = "Europe/Madrid";
  const headers = { apikey: KEY, "Content-Type": "application/json" };

  const $ = (selector) => document.querySelector(selector);
  const form = $("#booking-form");
  const statusEl = $("#slots-status");
  if (!form || !statusEl) return;

  const state = { duration: 60, slots: [], selected: null, month: null, selectedDate: null };
  const SERVICES = {
    psicologia_general_sanitaria: {
      label: "Psicología General Sanitaria",
      consentHref: "/consentimiento-psicologico/",
      consentText: "consentimiento informado para intervención psicológica",
    },
    neuropsicologia: {
      label: "Neuropsicología",
      consentHref: "/consentimiento-neuropsicologico/",
      consentText: "consentimiento informado para intervención neuropsicológica",
    },
  };

  const els = {
    status: statusEl,
    first: $("#first-available"),
    toggle: $("#toggle-calendar"),
    calendar: $("#calendar-section"),
    title: $("#calendar-title"),
    grid: $("#calendar-grid"),
    times: $("#day-times"),
    prev: $("#calendar-prev"),
    next: $("#calendar-next"),
    selected: $("#selected-slot"),
    summary: $("#selection-summary"),
    submit: $("#booking-submit"),
    message: $("#form-message"),
    newDocuments: $("#new-patient-documents"),
    newSignature: $("#new-patient-signature"),
    newInformation: $("#new-patient-information"),
    selectedServiceName: $("#selected-service-name"),
    consentLink: $("#consent-link"),
    consentDescription: $("#consent-description"),
  };

  const dateFmt = new Intl.DateTimeFormat("es-ES", {
    weekday: "long", day: "numeric", month: "long", timeZone: ZONE,
  });
  const timeFmt = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ZONE,
  });
  const monthFmt = new Intl.DateTimeFormat("es-ES", {
    month: "long", year: "numeric", timeZone: "UTC",
  });

  const sentenceCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);

  function patientTypeValue() {
    const field = form.elements.namedItem("patient_type");
    return field && typeof field.value === "string" ? field.value : "new";
  }

  function serviceCodeValue() {
    const field = form.elements.namedItem("service_code");
    const value = field && typeof field.value === "string" ? field.value : "psicologia_general_sanitaria";
    return SERVICES[value] ? value : "psicologia_general_sanitaria";
  }

  function dateKey(iso) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      year: "numeric", month: "2-digit", day: "2-digit", timeZone: ZONE,
    }).formatToParts(new Date(iso));
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function formatSlot(slot) {
    return `${sentenceCase(dateFmt.format(new Date(slot.starts_at)))}, ${timeFmt.format(new Date(slot.starts_at))}–${timeFmt.format(new Date(slot.ends_at))}`;
  }

  function showMessage(text, type = "") {
    if (!els.message) return;
    els.message.textContent = text;
    els.message.className = `form-message${type ? ` form-message-${type}` : ""}`;
  }

  async function rpc(path, body) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      return await fetch(`${REST_URL}/rpc/${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
        cache: "no-store",
      });
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function updateSelectionSummary() {
    if (!state.selected || !els.summary) return;
    const service = SERVICES[serviceCodeValue()];
    els.summary.innerHTML = `<strong>${formatSlot(state.selected)}</strong><span>${service.label} · ${state.duration} minutos · 60 €</span>`;
  }

  function updateServiceChoice() {
    const service = SERVICES[serviceCodeValue()];
    if (els.selectedServiceName) els.selectedServiceName.textContent = service.label;
    if (els.consentLink) {
      els.consentLink.href = service.consentHref;
      els.consentLink.textContent = service.consentText;
    }
    if (els.consentDescription) {
      els.consentDescription.innerHTML = `Consulta el <a href="${service.consentHref}" target="_blank" rel="noopener">${service.consentText}</a>.`;
    }
    updateSelectionSummary();
  }

  function updatePatientType() {
    const existing = patientTypeValue() === "existing";
    if (els.newDocuments) els.newDocuments.hidden = existing;
    if (els.newSignature) els.newSignature.hidden = existing;
    if (els.newInformation) els.newInformation.hidden = existing;

    const privacy = form.elements.namedItem("privacy_acknowledged");
    const consent = form.elements.namedItem("informed_consent_accepted");
    const signer = form.elements.namedItem("signer_name");
    if (privacy) privacy.required = !existing;
    if (consent) consent.required = !existing;
    if (signer) signer.required = !existing;
    if (existing) {
      if (privacy) privacy.checked = false;
      if (consent) consent.checked = false;
      if (signer) signer.value = "";
    }
  }

  function selectSlot(slot) {
    state.selected = slot;
    if (els.selected) els.selected.value = slot.starts_at;
    updateSelectionSummary();
    if (els.submit) els.submit.disabled = false;
    showMessage("");
    document.querySelectorAll(".time-option, .first-slot-button").forEach((button) => {
      const selected = button.dataset.startsAt === slot.starts_at;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function slotButton(slot, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.startsAt = slot.starts_at;
    button.setAttribute("aria-pressed", "false");
    button.textContent = className === "time-option" ? timeFmt.format(new Date(slot.starts_at)) : formatSlot(slot);
    button.addEventListener("click", () => selectSlot(slot));
    return button;
  }

  function slotsByDate() {
    return state.slots.reduce((map, slot) => {
      const key = dateKey(slot.starts_at);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(slot);
      return map;
    }, new Map());
  }

  function renderFirst() {
    els.first?.replaceChildren();
    if (!state.slots.length) {
      els.status.textContent = "No hay citas disponibles en los próximos 30 días.";
      if (els.first) els.first.hidden = true;
      if (els.toggle) els.toggle.hidden = true;
      if (els.calendar) els.calendar.hidden = true;
      return;
    }
    els.status.textContent = "Primera cita disponible";
    const label = document.createElement("span");
    label.textContent = `${state.duration} minutos · 60 €`;
    els.first?.append(slotButton(state.slots[0], "first-slot-button"), label);
    if (els.first) els.first.hidden = false;
    if (els.toggle) els.toggle.hidden = false;
  }

  function renderTimes(key) {
    state.selectedDate = key;
    const daySlots = slotsByDate().get(key) || [];
    els.times?.replaceChildren();
    const heading = document.createElement("h4");
    heading.textContent = daySlots.length ? sentenceCase(dateFmt.format(new Date(daySlots[0].starts_at))) : "Sin horarios";
    const options = document.createElement("div");
    options.className = "time-options";
    daySlots.forEach((slot) => options.append(slotButton(slot, "time-option")));
    els.times?.append(heading, options);
    renderCalendar();
  }

  function renderCalendar() {
    if (!state.month || !state.slots.length || !els.grid || !els.title) return;
    const available = slotsByDate();
    const year = state.month.getUTCFullYear();
    const month = state.month.getUTCMonth();
    const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
    const totalDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    els.title.textContent = sentenceCase(monthFmt.format(state.month));
    els.grid.replaceChildren();

    for (let i = 0; i < firstWeekday; i += 1) {
      const empty = document.createElement("span");
      empty.className = "calendar-empty";
      els.grid.append(empty);
    }
    for (let day = 1; day <= totalDays; day += 1) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day";
      button.textContent = String(day);
      button.disabled = !available.has(key);
      button.classList.toggle("has-slots", available.has(key));
      button.classList.toggle("is-selected", state.selectedDate === key);
      button.setAttribute("aria-label", available.has(key) ? `${day}, con citas disponibles` : `${day}, sin disponibilidad`);
      if (available.has(key)) button.addEventListener("click", () => renderTimes(key));
      els.grid.append(button);
    }

    const firstDate = new Date(state.slots[0].starts_at);
    const lastDate = new Date(state.slots[state.slots.length - 1].starts_at);
    const firstMonth = new Date(Date.UTC(firstDate.getFullYear(), firstDate.getMonth(), 1));
    const lastMonth = new Date(Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), 1));
    if (els.prev) els.prev.disabled = state.month <= firstMonth;
    if (els.next) els.next.disabled = state.month >= lastMonth;
  }

  async function loadSlots() {
    state.selected = null;
    state.selectedDate = null;
    if (els.selected) els.selected.value = "";
    if (els.submit) els.submit.disabled = true;
    if (els.summary) els.summary.textContent = "Todavía no has elegido un horario.";
    els.status.textContent = "Consultando disponibilidad…";
    if (els.first) els.first.hidden = true;
    if (els.toggle) {
      els.toggle.hidden = true;
      els.toggle.textContent = "Elegir otra fecha";
    }
    if (els.calendar) els.calendar.hidden = true;
    els.times?.replaceChildren();

    try {
      const response = await rpc("get_public_appointment_starts", {});
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}${detail ? ` · ${detail}` : ""}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Respuesta de disponibilidad no válida");
      state.slots = data;
      if (state.slots.length) {
        const first = new Date(state.slots[0].starts_at);
        state.month = new Date(Date.UTC(first.getFullYear(), first.getMonth(), 1));
      }
      renderFirst();
    } catch (error) {
      console.error("[booking] Error al cargar disponibilidad", error);
      els.status.textContent = "No hemos podido cargar los horarios. Recarga la página o inténtalo de nuevo dentro de unos minutos.";
    }
  }

  els.toggle?.addEventListener("click", () => {
    if (!els.calendar) return;
    els.calendar.hidden = !els.calendar.hidden;
    els.toggle.textContent = els.calendar.hidden ? "Elegir otra fecha" : "Ocultar calendario";
    if (!els.calendar.hidden) renderCalendar();
  });
  els.prev?.addEventListener("click", () => {
    if (!state.month) return;
    state.month = new Date(Date.UTC(state.month.getUTCFullYear(), state.month.getUTCMonth() - 1, 1));
    renderCalendar();
  });
  els.next?.addEventListener("click", () => {
    if (!state.month) return;
    state.month = new Date(Date.UTC(state.month.getUTCFullYear(), state.month.getUTCMonth() + 1, 1));
    renderCalendar();
  });
  document.querySelectorAll('input[name="patient_type"]').forEach((input) => input.addEventListener("change", updatePatientType));
  document.querySelectorAll('input[name="service_code"]').forEach((input) => input.addEventListener("change", updateServiceChoice));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("patient_name") || "").trim();
    const email = String(data.get("patient_email") || "").trim();
    const phone = String(data.get("patient_phone") || "").trim();
    const signer = String(data.get("signer_name") || "").trim();
    const patientType = String(data.get("patient_type") || "new");
    const serviceCode = serviceCodeValue();
    const isExisting = patientType === "existing";

    if (!state.selected) return showMessage("Selecciona primero una fecha y una hora.", "error");
    if (!name) return showMessage("Escribe tu nombre y apellidos.", "error");
    if (!email) return showMessage("Escribe tu correo electrónico.", "error");
    if (!form.elements.patient_email.checkValidity()) return showMessage("Comprueba que el correo electrónico sea válido.", "error");
    if (!phone) return showMessage("Escribe tu número de teléfono.", "error");
    if (!data.get("cancellation_accepted")) return showMessage("Debes leer y aceptar la política de cancelación.", "error");
    if (!isExisting) {
      if (!data.get("privacy_acknowledged") || !data.get("informed_consent_accepted")) {
        return showMessage("Debes leer y aceptar la privacidad y el consentimiento informado.", "error");
      }
      if (!signer) return showMessage("Escribe tu nombre y apellidos en el campo de firma electrónica.", "error");
      if (signer.toLocaleLowerCase("es") !== name.toLocaleLowerCase("es")) {
        return showMessage("La firma debe coincidir con el nombre y apellidos indicados.", "error");
      }
    }

    els.submit.disabled = true;
    els.submit.textContent = "Registrando…";
    try {
      const response = await rpc("create_calendar_booking", {
        p_starts_at: state.selected.starts_at,
        p_duration_minutes: state.duration,
        p_patient_name: name,
        p_patient_email: email,
        p_patient_phone: phone,
        p_patient_type: patientType,
        p_privacy_acknowledged: !isExisting,
        p_cancellation_accepted: true,
        p_informed_consent_accepted: !isExisting,
        p_signer_name: isExisting ? null : signer,
        p_service_code: serviceCode,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message = String(body.message || "");
        throw new Error(message.includes("ya no está disponible") ? "Ese horario acaba de reservarse. Elige otro." : "No se ha podido registrar la reserva.");
      }

      const existingMessage = "Solicitud registrada. El horario queda reservado mientras comprobamos que eres paciente actual.";
      const newMessage = "Reserva registrada correctamente. Recibirás la confirmación por el canal indicado.";
      form.reset();
      state.duration = 60;
      showMessage(isExisting ? existingMessage : newMessage, "success");
      updatePatientType();
      updateServiceChoice();
      await loadSlots();
    } catch (error) {
      console.error("[booking] Error al registrar", error);
      showMessage(`${error.message} Inténtalo de nuevo dentro de unos minutos.`, "error");
      els.submit.disabled = false;
    } finally {
      els.submit.innerHTML = 'Confirmar reserva <span aria-hidden="true">→</span>';
    }
  });

  try {
    updatePatientType();
    updateServiceChoice();
    loadSlots();
  } catch (error) {
    console.error("[booking] Error de inicialización", error);
    els.status.textContent = "No hemos podido iniciar el calendario. Recarga la página.";
  }
})();
