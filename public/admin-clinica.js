(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const AUTH_URL = `${SUPABASE_URL}/auth/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const ZONE = "Europe/Madrid";
  const SESSION_KEY = "dememoria_admin_session";
  const ALLOWED_USER_ID = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";

  const $ = (selector) => document.querySelector(selector);
  const els = {
    login: $("#clinic-login"), app: $("#clinic-app"), loginForm: $("#clinic-login-form"),
    email: $("#clinic-email"), password: $("#clinic-password"), loginMessage: $("#clinic-login-message"),
    logout: $("#clinic-logout"), refresh: $("#clinic-refresh"), date: $("#clinic-date"), status: $("#clinic-status"),
    viewToday: $("#clinic-view-today"), viewPatients: $("#clinic-view-patients"),
    todayView: $("#clinic-today-view"), patientsView: $("#clinic-patients-view"),
    todayList: $("#clinic-today-list"), patientList: $("#clinic-patient-list"), patientSearch: $("#clinic-patient-search"),
    totalToday: $("#clinic-total-today"), confirmedToday: $("#clinic-confirmed-today"),
    pendingToday: $("#clinic-pending-today"), finishedToday: $("#clinic-finished-today"),
    patientDialog: $("#clinic-patient-dialog"), patientForm: $("#clinic-patient-form"),
    patientClose: $("#clinic-patient-close"), patientId: $("#clinic-patient-id"),
    patientName: $("#clinic-patient-name"), patientContact: $("#clinic-patient-contact"),
    summaryNote: $("#clinic-summary-note"), nextFocus: $("#clinic-next-focus"), medication: $("#clinic-medication"),
    patientMessage: $("#clinic-patient-message"), patientHistory: $("#clinic-patient-history"),
    preparation: $("#clinic-preparation-content"),
    sessionDialog: $("#clinic-session-dialog"), sessionForm: $("#clinic-session-form"),
    sessionClose: $("#clinic-session-close"), sessionId: $("#clinic-session-id"),
    sessionPatientId: $("#clinic-session-patient-id"), sessionAppointmentId: $("#clinic-session-appointment-id"),
    sessionTitle: $("#clinic-session-title"), sessionState: $("#clinic-session-state"),
    workNotes: $("#clinic-work-notes"), evolutionNote: $("#clinic-evolution-note"),
    interventionNote: $("#clinic-intervention-note"), responseNote: $("#clinic-response-note"),
    agreementsNote: $("#clinic-agreements-note"), homeworkNote: $("#clinic-homework-note"),
    nextSessionNote: $("#clinic-next-session-note"), sessionMessage: $("#clinic-session-message"),
    saveDraft: $("#clinic-save-draft"), approveSession: $("#clinic-approve-session"),
  };

  let session = null;
  let appointments = [];
  let patients = [];
  let clinicalSessions = [];
  let currentPatient = null;
  let currentAppointment = null;

  const dateLong = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: ZONE });
  const dateShort = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric", timeZone: ZONE });
  const timeFormat = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ZONE });

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }
  function saveSession(value) {
    session = value;
    if (value) sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
    else sessionStorage.removeItem(SESSION_KEY);
  }
  function authHeaders(extra = {}) {
    return { apikey: KEY, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json", ...extra };
  }
  async function fetchCurrentUser() {
    if (!session?.access_token) return null;
    const response = await fetch(`${AUTH_URL}/user`, { headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
    if (!response.ok) return null;
    const user = await response.json();
    return user?.id === ALLOWED_USER_ID ? user : null;
  }
  async function signIn(email, password) {
    const response = await fetch(`${AUTH_URL}/token?grant_type=password`, {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email, password }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error_description || body.msg || "No se ha podido iniciar sesión.");
    if (body.user?.id !== ALLOWED_USER_ID) throw new Error("Esta cuenta no tiene acceso al área clínica.");
    saveSession(body);
  }
  function showLogin() { els.app.hidden = true; els.login.hidden = false; }
  function showApp() { els.login.hidden = true; els.app.hidden = false; }
  function setMessage(text) { els.status.textContent = text || ""; }
  function create(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function localDateKey(value) {
    const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: ZONE }).formatToParts(new Date(value));
    const data = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${data.year}-${data.month}-${data.day}`;
  }
  function todayKey() { return localDateKey(new Date()); }
  function statusLabel(status) {
    return ({ confirmed: "Confirmada", pending: "Pendiente", cancelled: "Cancelada", canceled: "Cancelada", completed: "Realizada", no_show: "No presentado", rescheduled: "Reprogramada" })[status] || status;
  }
  function statusClass(status) {
    if (["cancelled", "canceled", "no_show"].includes(status)) return "cancelled";
    if (status === "completed") return "completed";
    if (status === "pending") return "pending";
    return "";
  }
  async function rest(path, options = {}) {
    const response = await fetch(`${REST_URL}/${path}`, {
      cache: "no-store",
      ...options,
      headers: authHeaders(options.headers || {}),
    });
    if (response.status === 401) {
      saveSession(null); showLogin(); throw new Error("La sesión ha caducado. Vuelve a entrar.");
    }
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || body?.hint || "No se ha podido guardar la información.");
    return body;
  }

  function patientAppointments(patientId) {
    return appointments.filter((appointment) => appointment.clinical_patient_id === patientId);
  }
  function patientSessions(patientId) {
    return clinicalSessions
      .filter((item) => item.patient_id === patientId)
      .sort((a, b) => new Date(b.session_date) - new Date(a.session_date));
  }
  function patientById(id) { return patients.find((patient) => patient.id === id); }

  function renderPreparation(patient) {
    els.preparation.replaceChildren();
    const recent = patientSessions(patient.id).filter((item) => item.status === "approved").slice(0, 3);
    const list = create("div", "clinic-preparation-grid");
    const summary = create("article");
    summary.append(create("strong", "", "Síntesis actual"), create("p", "", patient.clinical_summary || "Todavía no consta una síntesis clínica."));
    const focus = create("article");
    focus.append(create("strong", "", "Para hoy"), create("p", "", patient.next_session_focus || "No hay focos pendientes registrados."));
    list.append(summary, focus);
    if (recent.length) {
      const previous = create("article", "clinic-full");
      previous.append(create("strong", "", "Últimas sesiones"));
      recent.forEach((item) => {
        previous.append(create("p", "", `${dateShort.format(new Date(item.session_date))}: ${item.evolution_note || item.intervention_note || "Registro aprobado"}`));
      });
      list.append(previous);
    }
    els.preparation.append(list);
  }

  function openSession(patient, appointment) {
    currentPatient = patient;
    currentAppointment = appointment;
    const existing = clinicalSessions.find((item) => item.appointment_id === appointment.id) || null;
    const number = patientSessions(patient.id).length + (existing ? 0 : 1);
    els.sessionId.value = existing?.id || "";
    els.sessionPatientId.value = patient.id;
    els.sessionAppointmentId.value = appointment.id;
    els.sessionTitle.textContent = `${patient.full_name} · sesión ${existing?.session_number || number}`;
    els.workNotes.value = existing?.work_notes || "";
    els.evolutionNote.value = existing?.evolution_note || "";
    els.interventionNote.value = existing?.intervention_note || "";
    els.responseNote.value = existing?.response_note || "";
    els.agreementsNote.value = existing?.agreements_note || "";
    els.homeworkNote.value = existing?.homework_note || "";
    els.nextSessionNote.value = existing?.next_session_note || patient.next_session_focus || "";
    els.sessionMessage.textContent = "";
    const approved = existing?.status === "approved";
    els.sessionState.textContent = approved
      ? `Registro aprobado el ${dateShort.format(new Date(existing.approved_at))}. No puede sobrescribirse.`
      : "Las notas de trabajo permanecen separadas del registro clínico hasta que pulses «Aprobar y cerrar».";
    [els.workNotes, els.evolutionNote, els.interventionNote, els.responseNote, els.agreementsNote, els.homeworkNote, els.nextSessionNote]
      .forEach((field) => { field.disabled = approved; });
    els.saveDraft.disabled = approved;
    els.approveSession.disabled = approved;
    els.sessionDialog.showModal();
  }

  function renderHistory(patient) {
    els.patientHistory.replaceChildren();
    const bookings = patientAppointments(patient.id).sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at));
    if (!bookings.length) {
      els.patientHistory.append(create("p", "clinic-empty-inline", "No hay citas vinculadas."));
      return;
    }
    bookings.forEach((appointment) => {
      const row = create("article");
      const info = create("div");
      info.append(
        create("strong", "", dateShort.format(new Date(appointment.starts_at))),
        create("span", "", `${timeFormat.format(new Date(appointment.starts_at))} · ${statusLabel(appointment.status)}`)
      );
      const existing = clinicalSessions.find((item) => item.appointment_id === appointment.id);
      const button = create("button", existing?.status === "approved" ? "clinic-secondary" : "clinic-primary", existing ? (existing.status === "approved" ? "Ver registro" : "Continuar sesión") : "Preparar sesión");
      button.type = "button";
      button.addEventListener("click", () => openSession(patient, appointment));
      row.append(info, button);
      els.patientHistory.append(row);
    });
  }

  function openPatient(patient) {
    currentPatient = patient;
    els.patientId.value = patient.id;
    els.patientName.textContent = patient.full_name;
    els.patientContact.replaceChildren();
    if (patient.email) els.patientContact.append(create("span", "", patient.email));
    if (patient.phone) els.patientContact.append(create("span", "", patient.phone));
    els.summaryNote.value = patient.clinical_summary || "";
    els.nextFocus.value = patient.next_session_focus || "";
    els.medication.value = patient.medication_notes || "";
    els.patientMessage.textContent = "";
    renderPreparation(patient);
    renderHistory(patient);
    els.patientDialog.showModal();
  }

  function appointmentCard(appointment) {
    const patient = patientById(appointment.clinical_patient_id);
    const card = create("article", "clinic-appointment");
    card.append(create("time", "clinic-time", timeFormat.format(new Date(appointment.starts_at))));
    const body = create("div");
    body.append(
      create("h3", "", appointment.patient_name),
      create("p", "", `${appointment.service_code === "neuropsicologia" ? "Neuropsicología" : "Psicología"} · ${appointment.patient_type === "new" ? "Primera visita" : "Seguimiento"}`)
    );
    card.append(body, create("span", `clinic-status-pill ${statusClass(appointment.status)}`, statusLabel(appointment.status)));
    const button = create("button", "clinic-open-patient", patient ? "Abrir ficha" : "Sin ficha");
    button.type = "button";
    button.disabled = !patient;
    if (patient) button.addEventListener("click", () => openPatient(patient));
    card.append(button);
    return card;
  }

  function renderToday() {
    const active = appointments.filter((item) => item.patient_email !== "bloqueo@agenda.interno" && localDateKey(item.starts_at) === todayKey());
    els.totalToday.textContent = String(active.length);
    els.confirmedToday.textContent = String(active.filter((item) => item.status === "confirmed").length);
    els.pendingToday.textContent = String(active.filter((item) => item.status === "pending").length);
    els.finishedToday.textContent = String(active.filter((item) => item.status === "completed").length);
    els.todayList.replaceChildren();
    if (!active.length) {
      els.todayList.append(create("div", "clinic-empty", "No hay consultas registradas para hoy."));
      return;
    }
    active.forEach((item) => els.todayList.append(appointmentCard(item)));
  }

  function renderPatients(query = "") {
    const term = query.trim().toLowerCase();
    const filtered = patients.filter((patient) =>
      [patient.full_name, patient.email, patient.phone].some((value) => (value || "").toLowerCase().includes(term))
    );
    els.patientList.replaceChildren();
    if (!filtered.length) {
      els.patientList.append(create("div", "clinic-empty", "No se han encontrado pacientes."));
      return;
    }
    filtered.forEach((patient) => {
      const bookings = patientAppointments(patient.id);
      const card = create("article", "clinic-patient-card");
      const body = create("div");
      body.append(create("h3", "", patient.full_name), create("p", "", [patient.email, patient.phone].filter(Boolean).join(" · ") || "Sin contacto registrado"));
      const summary = create("p", "", `${bookings.length} cita(s) · ${patientSessions(patient.id).length} sesión(es) clínica(s)`);
      const button = create("button", "clinic-secondary", "Abrir ficha");
      button.type = "button";
      button.addEventListener("click", () => openPatient(patient));
      card.append(body, summary, button);
      els.patientList.append(card);
    });
  }

  async function loadData() {
    setMessage("Cargando información clínica…");
    const [bookingRows, patientRows, sessionRows] = await Promise.all([
      rest(`appointment_bookings?select=id,patient_name,patient_email,patient_phone,patient_type,status,starts_at,ends_at,service_code,clinical_patient_id&order=starts_at.desc&limit=1000`),
      rest("clinical_patients?select=*&order=full_name.asc"),
      rest("clinical_sessions?select=*&order=session_date.desc"),
    ]);
    appointments = bookingRows || [];
    patients = patientRows || [];
    clinicalSessions = sessionRows || [];
    renderToday();
    renderPatients(els.patientSearch.value);
    setMessage("");
  }

  async function savePatient(event) {
    event.preventDefault();
    els.patientMessage.textContent = "Guardando…";
    const rows = await rest(`clinical_patients?id=eq.${encodeURIComponent(els.patientId.value)}&select=*`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        clinical_summary: els.summaryNote.value.trim() || null,
        next_session_focus: els.nextFocus.value.trim() || null,
        medication_notes: els.medication.value.trim() || null,
        updated_at: new Date().toISOString(),
      }),
    });
    const updated = rows?.[0];
    if (updated) {
      patients = patients.map((patient) => patient.id === updated.id ? updated : patient);
      currentPatient = updated;
      renderPreparation(updated);
    }
    els.patientMessage.textContent = "Ficha guardada.";
  }

  function sessionPayload(status) {
    const patientId = els.sessionPatientId.value;
    const existing = clinicalSessions.find((item) => item.id === els.sessionId.value);
    return {
      patient_id: patientId,
      appointment_id: els.sessionAppointmentId.value,
      session_date: currentAppointment?.starts_at || new Date().toISOString(),
      session_number: existing?.session_number || patientSessions(patientId).length + 1,
      status,
      work_notes: els.workNotes.value.trim() || null,
      evolution_note: els.evolutionNote.value.trim() || null,
      intervention_note: els.interventionNote.value.trim() || null,
      response_note: els.responseNote.value.trim() || null,
      agreements_note: els.agreementsNote.value.trim() || null,
      homework_note: els.homeworkNote.value.trim() || null,
      next_session_note: els.nextSessionNote.value.trim() || null,
      approved_at: status === "approved" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
  }

  async function persistClinicalSession(status) {
    if (status === "approved" && !els.evolutionNote.value.trim() && !els.interventionNote.value.trim()) {
      throw new Error("Añade al menos la evolución o la intervención antes de aprobar.");
    }
    els.sessionMessage.textContent = status === "approved" ? "Aprobando registro…" : "Guardando borrador…";
    const payload = sessionPayload(status);
    let rows;
    if (els.sessionId.value) {
      rows = await rest(`clinical_sessions?id=eq.${encodeURIComponent(els.sessionId.value)}&select=*`, {
        method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(payload),
      });
    } else {
      rows = await rest("clinical_sessions?select=*", {
        method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(payload),
      });
    }
    const saved = rows?.[0];
    if (!saved) throw new Error("No se ha podido recuperar el registro guardado.");
    clinicalSessions = [...clinicalSessions.filter((item) => item.id !== saved.id), saved];
    els.sessionId.value = saved.id;
    els.sessionMessage.textContent = status === "approved" ? "Registro aprobado y cerrado." : "Borrador guardado.";
    if (status === "approved") {
      els.sessionDialog.close();
      if (currentPatient) {
        renderPreparation(currentPatient);
        renderHistory(currentPatient);
      }
    }
    renderToday();
    renderPatients(els.patientSearch.value);
  }

  function setView(name) {
    const today = name === "today";
    els.todayView.hidden = !today;
    els.patientsView.hidden = today;
    els.viewToday.classList.toggle("active", today);
    els.viewPatients.classList.toggle("active", !today);
    if (!today) els.patientSearch.focus();
  }

  els.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    els.loginMessage.textContent = "Comprobando acceso…";
    try {
      await signIn(els.email.value.trim(), els.password.value);
      els.password.value = ""; els.loginMessage.textContent = ""; showApp(); await loadData();
    } catch (error) { els.loginMessage.textContent = error.message; }
  });
  els.logout.addEventListener("click", () => { saveSession(null); showLogin(); });
  els.refresh.addEventListener("click", () => loadData().catch((error) => setMessage(error.message)));
  els.viewToday.addEventListener("click", () => setView("today"));
  els.viewPatients.addEventListener("click", () => setView("patients"));
  els.patientSearch.addEventListener("input", () => renderPatients(els.patientSearch.value));
  els.patientClose.addEventListener("click", () => els.patientDialog.close());
  els.patientForm.addEventListener("submit", (event) => savePatient(event).catch((error) => { els.patientMessage.textContent = error.message; }));
  els.sessionClose.addEventListener("click", () => els.sessionDialog.close());
  els.saveDraft.addEventListener("click", () => persistClinicalSession("draft").catch((error) => { els.sessionMessage.textContent = error.message; }));
  els.sessionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    persistClinicalSession("approved").catch((error) => { els.sessionMessage.textContent = error.message; });
  });
  [els.patientDialog, els.sessionDialog].forEach((dialog) => dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  }));

  (async function init() {
    els.date.textContent = dateLong.format(new Date());
    session = getSession();
    const user = await fetchCurrentUser();
    if (!user) { saveSession(null); showLogin(); return; }
    showApp();
    loadData().catch((error) => setMessage(error.message));
  })();
})();
