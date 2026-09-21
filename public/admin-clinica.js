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
    viewToday: $("#clinic-view-today"), viewPatients: $("#clinic-view-patients"), viewPending: $("#clinic-view-pending"),
    todayView: $("#clinic-today-view"), patientsView: $("#clinic-patients-view"), pendingView: $("#clinic-pending-view"),
    pendingBadge: $("#clinic-pending-badge"), pendingSummary: $("#clinic-pending-summary"), pendingList: $("#clinic-pending-list"),
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
    processMarkers: $("#clinic-process-markers"), interventionMarkers: $("#clinic-intervention-markers"),
    sessionGoals: $("#clinic-session-goals"), addGoal: $("#clinic-add-goal"),
    generateDraft: $("#clinic-generate-draft"),
    exerciseSuggestions: $("#clinic-exercise-suggestions"), patientExercises: $("#clinic-patient-exercises"),
    newExercise: $("#clinic-new-exercise"), exerciseDialog: $("#clinic-exercise-dialog"),
    exerciseForm: $("#clinic-exercise-form"), exerciseClose: $("#clinic-exercise-close"),
    exerciseTemplateId: $("#clinic-exercise-template-id"), exercisePatientCode: $("#clinic-exercise-patient-code"),
    exerciseTitle: $("#clinic-exercise-title"), exerciseContent: $("#clinic-exercise-content"),
    exerciseRationale: $("#clinic-exercise-rationale"), exerciseEmail: $("#clinic-exercise-email"),
    exerciseMessage: $("#clinic-exercise-message"), saveExercise: $("#clinic-save-exercise"),
    printHistory: $("#clinic-print-history"), newReport: $("#clinic-new-report"), patientReports: $("#clinic-patient-reports"),
    patientTimeline: $("#clinic-patient-timeline"), refreshTimeline: $("#clinic-refresh-timeline"),
    addDocument: $("#clinic-add-document"), patientDocuments: $("#clinic-patient-documents"),
    documentDialog: $("#clinic-document-dialog"), documentForm: $("#clinic-document-form"), documentClose: $("#clinic-document-close"),
    documentTitle: $("#clinic-document-title"), documentCategory: $("#clinic-document-category"), documentDate: $("#clinic-document-date"),
    documentFile: $("#clinic-document-file"), documentNotes: $("#clinic-document-notes"), documentMessage: $("#clinic-document-message"),
    addScale: $("#clinic-add-scale"), patientScales: $("#clinic-patient-scales"), scaleDialog: $("#clinic-scale-dialog"),
    scaleForm: $("#clinic-scale-form"), scaleClose: $("#clinic-scale-close"), scaleInstrument: $("#clinic-scale-instrument"),
    scaleDate: $("#clinic-scale-date"), scaleScore: $("#clinic-scale-score"), scaleInterpretation: $("#clinic-scale-interpretation"),
    scaleNotes: $("#clinic-scale-notes"), scaleMessage: $("#clinic-scale-message"),
    dictate: $("#clinic-dictate"), dictationState: $("#clinic-dictation-state"),
    reportDialog: $("#clinic-report-dialog"), reportForm: $("#clinic-report-form"), reportClose: $("#clinic-report-close"),
    reportId: $("#clinic-report-id"), reportHeading: $("#clinic-report-heading"), reportType: $("#clinic-report-type"),
    reportRecipient: $("#clinic-report-recipient"), reportPurpose: $("#clinic-report-purpose"),
    reportStart: $("#clinic-report-start"), reportEnd: $("#clinic-report-end"), generateReport: $("#clinic-generate-report"),
    reportTitlePreview: $("#clinic-report-title-preview"), reportMeta: $("#clinic-report-meta"),
    reportContext: $("#clinic-report-context"), reportEvolution: $("#clinic-report-evolution"),
    reportInterventions: $("#clinic-report-interventions"), reportCurrent: $("#clinic-report-current"),
    reportSignature: $("#clinic-report-signature"), reportMessage: $("#clinic-report-message"),
    saveReport: $("#clinic-save-report"), approveReport: $("#clinic-approve-report"), printReport: $("#clinic-print-report"),
  };


  const clinicalProfileSchema = [
    { key: "reason_for_consultation", id: "clinic-reason-consultation", label: "Motivo de consulta", group: "Historia y antecedentes" },
    { key: "current_problem_history", id: "clinic-problem-history", label: "Historia del problema actual", group: "Historia y antecedentes" },
    { key: "psychological_psychiatric_history", id: "clinic-psych-history", label: "Antecedentes psicológicos / psiquiátricos", group: "Historia y antecedentes" },
    { key: "medical_history", id: "clinic-medical-history", label: "Antecedentes médicos", group: "Historia y antecedentes" },
    { key: "family_history", id: "clinic-family-history", label: "Antecedentes familiares", group: "Historia y antecedentes" },
    { key: "personal_family_context", id: "clinic-personal-family-context", label: "Contexto personal y familiar", group: "Historia y antecedentes" },
    { key: "social_context", id: "clinic-social-context", label: "Contexto social", group: "Historia y antecedentes" },
    { key: "academic_work_context", id: "clinic-work-academic-context", label: "Contexto académico / laboral", group: "Historia y antecedentes" },
    { key: "significant_life_events", id: "clinic-life-events", label: "Acontecimientos vitales relevantes", group: "Historia y antecedentes" },
    { key: "clinical_examination", id: "clinic-clinical-examination", label: "Exploración clínica", group: "Evaluación y diagnóstico" },
    { key: "psychometric_assessment", id: "clinic-psychometric-assessment", label: "Evaluación psicométrica", group: "Evaluación y diagnóstico" },
    { key: "neuropsychological_assessment", id: "clinic-neuropsych-assessment", label: "Evaluación neuropsicológica", group: "Evaluación y diagnóstico" },
    { key: "diagnoses", id: "clinic-diagnoses", label: "Diagnósticos registrados", group: "Evaluación y diagnóstico" },
    { key: "diagnostic_hypotheses", id: "clinic-diagnostic-hypotheses", label: "Hipótesis diagnósticas", group: "Evaluación y diagnóstico" },
    { key: "differential_diagnosis", id: "clinic-differential-diagnosis", label: "Diagnóstico diferencial", group: "Evaluación y diagnóstico" },
    { key: "current_clinical_problems", id: "clinic-current-problems", label: "Problemas clínicos actuales", group: "Formulación clínica" },
    { key: "predisposing_factors", id: "clinic-predisposing-factors", label: "Factores predisponentes", group: "Formulación clínica" },
    { key: "precipitating_factors", id: "clinic-precipitating-factors", label: "Factores precipitantes", group: "Formulación clínica" },
    { key: "perpetuating_factors", id: "clinic-perpetuating-factors", label: "Factores perpetuantes", group: "Formulación clínica" },
    { key: "protective_factors", id: "clinic-protective-factors", label: "Factores protectores", group: "Formulación clínica" },
    { key: "integrative_formulation", id: "clinic-integrative-formulation", label: "Formulación clínica integradora", group: "Formulación clínica" },
    { key: "therapeutic_goals", id: "clinic-therapeutic-goals", label: "Objetivos terapéuticos", group: "Tratamiento y evolución" },
    { key: "treatment_plan", id: "clinic-treatment-plan", label: "Plan terapéutico", group: "Tratamiento y evolución" },
    { key: "interventions_summary", id: "clinic-interventions-summary", label: "Intervenciones realizadas", group: "Tratamiento y evolución" },
    { key: "clinical_evolution_summary", id: "clinic-evolution-summary", label: "Evolución clínica", group: "Tratamiento y evolución" },
    { key: "risk_safety", id: "clinic-risk-safety", label: "Riesgo y seguridad", group: "Seguridad y coordinación" },
    { key: "professional_coordination", id: "clinic-professional-coordination", label: "Coordinación con otros profesionales", group: "Seguridad y coordinación" },
    { key: "clinical_observations", id: "clinic-clinical-observations", label: "Observaciones clínicas", group: "Seguridad y coordinación" },
  ];
  const clinicalProfileFields = Object.fromEntries(clinicalProfileSchema.map((field) => [field.key, $(`#${field.id}`)]));

  let session = null;
  let appointments = [];
  let patients = [];
  let externalVisits = [];
  let clinicalSessions = [];
  let clinicalGoals = [];
  let exerciseTemplates = [];
  let exerciseAssignments = [];
  let clinicalReports = [];
  let clinicalDocuments = [];
  let scaleMeasurements = [];
  let speechRecognition = null;
  let isDictating = false;
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
  function patientExternalVisits(patientId) {
    return externalVisits
      .filter((item) => item.patient_id === patientId)
      .sort((a, b) => `${b.visit_date || "0000-00-00"}T${b.visit_time}`.localeCompare(`${a.visit_date || "0000-00-00"}T${a.visit_time}`));
  }
  function externalCenterLabel(center) {
    return center === "arenys_2" ? "Arenys 2" : "Arenys 1";
  }
  function externalVisitWhen(item) {
    const date = item.visit_date
      ? dateShort.format(new Date(`${item.visit_date}T12:00:00Z`))
      : "Fecha no indicada";
    return `${date} · ${(item.visit_time || "").slice(0, 5)}`;
  }
  function patientById(id) { return patients.find((patient) => patient.id === id); }
  function patientGoals(patientId) {
    return clinicalGoals.filter((goal) => goal.patient_id === patientId && ["active", "review"].includes(goal.status));
  }
  function patientExercises(patientId) {
    return exerciseAssignments.filter((item) => item.patient_id === patientId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  function suggestedExercises(patientId) {
    const latest = patientSessions(patientId)[0];
    const markers = latest?.process_markers || [];
    return exerciseTemplates
      .map((template) => ({ template, matches: (template.process_tags || []).filter((tag) => markers.includes(tag)) }))
      .filter((item) => item.matches.length)
      .sort((a, b) => b.matches.length - a.matches.length)
      .slice(0, 3);
  }
  function openExercise(template = null, rationale = "") {
    if (!currentPatient) return;
    els.exerciseTemplateId.value = template?.id || "";
    els.exercisePatientCode.textContent = `Paciente ${currentPatient.public_code} · La identidad no aparecerá en el correo.`;
    els.exerciseTitle.value = template?.title || "";
    els.exerciseContent.value = template?.instructions || "";
    els.exerciseRationale.value = rationale;
    els.exerciseEmail.value = currentPatient.email || "";
    els.exerciseMessage.textContent = "";
    els.exerciseDialog.showModal();
  }
  function renderExercises(patient) {
    els.exerciseSuggestions.replaceChildren();
    const suggestions = suggestedExercises(patient.id);
    if (suggestions.length) {
      suggestions.forEach(({ template, matches }) => {
        const card = create("article", "clinic-exercise-card");
        const body = create("div");
        body.append(create("strong", "", template.title), create("p", "", `Sugerido por: ${matches.join(", ")} · ${template.duration_minutes || "—"} min`));
        const button = create("button", "clinic-secondary", "Preparar");
        button.type = "button";
        button.addEventListener("click", () => openExercise(template, `Procesos registrados: ${matches.join(", ")}.`));
        card.append(body, button);
        els.exerciseSuggestions.append(card);
      });
    } else {
      els.exerciseSuggestions.append(create("p", "clinic-empty-inline", "No hay sugerencias automáticas con los datos registrados. Puedes asignar un ejercicio manualmente."));
    }
    els.patientExercises.replaceChildren();
    const assigned = patientExercises(patient.id);
    if (!assigned.length) {
      els.patientExercises.append(create("p", "clinic-empty-inline", "Todavía no hay ejercicios asignados."));
      return;
    }
    assigned.forEach((item) => {
      const row = create("article");
      const info = create("div");
      const state = item.email_status === "sent" ? `Enviado · enlace hasta ${dateShort.format(new Date(item.access_expires_at))}` : item.status === "prepared" ? "Preparado, sin enviar" : item.status;
      info.append(create("strong", "", item.title), create("span", "", state));
      row.append(info);
      if (["sent", "assigned"].includes(item.status)) {
        const reviewed = create("button", "clinic-secondary", "Marcar revisado"); reviewed.type = "button";
        reviewed.addEventListener("click", async () => {
          try {
            const rows = await rest(`clinical_exercise_assignments?id=eq.${encodeURIComponent(item.id)}&select=*`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ status: "reviewed", reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }) });
            if (rows?.[0]) exerciseAssignments = exerciseAssignments.map((x) => x.id === item.id ? rows[0] : x);
            renderExercises(currentPatient); renderTimeline(currentPatient); renderPending();
          } catch (error) { els.patientMessage.textContent = error.message; }
        });
        row.append(reviewed);
      }
      els.patientExercises.append(row);
    });
  }
  async function saveExercise(sendAfterSave) {
    if (!currentPatient) return;
    if (!els.exerciseTitle.value.trim() || !els.exerciseContent.value.trim()) throw new Error("Completa el título y el contenido.");
    els.exerciseMessage.textContent = sendAfterSave ? "Preparando enlace seguro…" : "Guardando…";
    const rows = await rest("clinical_exercise_assignments?select=*", {
      method: "POST", headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        patient_id: currentPatient.id,
        template_id: els.exerciseTemplateId.value || null,
        title: els.exerciseTitle.value.trim(),
        content: els.exerciseContent.value.trim(),
        rationale: els.exerciseRationale.value.trim() || null,
        recipient_email: els.exerciseEmail.value.trim() || null,
        status: "prepared",
      }),
    });
    const saved = rows?.[0];
    if (!saved) throw new Error("No se ha podido guardar el ejercicio.");
    exerciseAssignments.unshift(saved);
    if (sendAfterSave) {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/send-clinical-exercise`, {
        method: "POST", headers: authHeaders(), body: JSON.stringify({ assignment_id: saved.id }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "No se ha podido enviar el enlace.");
      await loadData();
    }
    renderExercises(currentPatient);
    els.exerciseDialog.close();
  }

  function escapeHtml(value) {
    return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
  function clinicalProfile(patient) {
    const value = patient?.clinical_profile;
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }
  function fillClinicalProfile(patient) {
    const profile = clinicalProfile(patient);
    clinicalProfileSchema.forEach((field) => {
      if (clinicalProfileFields[field.key]) clinicalProfileFields[field.key].value = profile[field.key] || "";
    });
  }
  function clinicalProfilePayload() {
    return {
      ...clinicalProfile(currentPatient),
      ...Object.fromEntries(clinicalProfileSchema.map((field) => [field.key, clinicalProfileFields[field.key]?.value.trim() || null])),
    };
  }
  function clinicalProfilePrintHtml(patient) {
    const profile = clinicalProfile(patient);
    const groups = [...new Set(clinicalProfileSchema.map((field) => field.group))];
    return groups.map((group) => {
      const entries = clinicalProfileSchema
        .filter((field) => field.group === group && profile[field.key])
        .map((field) => `<h3>${escapeHtml(field.label)}</h3><div class="text">${escapeHtml(profile[field.key])}</div>`)
        .join("");
      return entries ? `<section class="entry"><h2>${escapeHtml(group)}</h2>${entries}</section>` : "";
    }).join("");
  }
  function reportTypeLabel(type) {
    return ({ evolution: "Informe de evolución", clinical_summary: "Resumen clínico", referral: "Informe de derivación" })[type] || "Informe clínico";
  }
  function approvedSessionsInPeriod(patientId) {
    const start = els.reportStart.value ? new Date(els.reportStart.value + "T00:00:00") : null;
    const end = els.reportEnd.value ? new Date(els.reportEnd.value + "T23:59:59") : null;
    return patientSessions(patientId).filter((item) => {
      const date = new Date(item.session_date);
      return item.status === "approved" && (!start || date >= start) && (!end || date <= end);
    }).sort((a, b) => new Date(a.session_date) - new Date(b.session_date));
  }
  function printableWindow(title, body) {
    const popup = window.open("", "_blank");
    if (!popup) throw new Error("El navegador ha bloqueado la ventana de impresión.");
    popup.opener = null;
    popup.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>@page{size:A4;margin:18mm}body{font-family:Arial,sans-serif;color:#1f2933;font-size:11pt;line-height:1.5}header{border-bottom:2px solid #1f5f99;margin-bottom:24px;padding-bottom:14px}h1{font-size:20pt;color:#1f5f99;margin:4px 0}h2{font-size:13pt;margin:24px 0 8px}h3{font-size:11pt;margin:18px 0 5px}.meta{color:#526b7a;font-size:9.5pt}.entry{break-inside:avoid;border-bottom:1px solid #d5e3ee;padding:0 0 14px;margin-bottom:16px}.text{white-space:pre-wrap}.signature{margin-top:48px}.privacy{margin-top:30px;color:#607786;font-size:8.5pt}@media print{button{display:none}}</style></head><body>${body}<script>window.onload=()=>window.print()<\/script></body></html>`);
    popup.document.close();
  }
  function printClinicalHistory() {
    if (!currentPatient) return;
    const sessions = patientSessions(currentPatient.id).filter((item) => item.status === "approved").sort((a, b) => new Date(a.session_date) - new Date(b.session_date));
    const profileEntries = clinicalProfilePrintHtml(currentPatient);
    const overview = [
      currentPatient.clinical_summary ? `<section class="entry"><h2>Síntesis clínica</h2><div class="text">${escapeHtml(currentPatient.clinical_summary)}</div></section>` : "",
      currentPatient.medication_notes ? `<section class="entry"><h2>Medicación registrada</h2><div class="text">${escapeHtml(currentPatient.medication_notes)}</div></section>` : "",
      currentPatient.next_session_focus ? `<section class="entry"><h2>Focos pendientes</h2><div class="text">${escapeHtml(currentPatient.next_session_focus)}</div></section>` : "",
    ].join("");
    const entries = sessions.map((item) => `<section class="entry"><h2>Sesión ${item.session_number || ""} · ${escapeHtml(dateShort.format(new Date(item.session_date)))}</h2>${item.evolution_note ? `<h3>Evolución</h3><div class="text">${escapeHtml(item.evolution_note)}</div>` : ""}${item.intervention_note ? `<h3>Intervención</h3><div class="text">${escapeHtml(item.intervention_note)}</div>` : ""}${item.response_note ? `<h3>Respuesta</h3><div class="text">${escapeHtml(item.response_note)}</div>` : ""}${item.agreements_note ? `<h3>Acuerdos</h3><div class="text">${escapeHtml(item.agreements_note)}</div>` : ""}${item.homework_note ? `<h3>Tarea</h3><div class="text">${escapeHtml(item.homework_note)}</div>` : ""}</section>`).join("");
    printableWindow("Historial clínico", `<header><p>Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga</p><h1>Historial clínico</h1><p class="meta">Paciente: ${escapeHtml(currentPatient.full_name)} · Código: ${escapeHtml(currentPatient.public_code)} · Emitido: ${escapeHtml(dateShort.format(new Date()))}</p></header>${overview}${profileEntries}<h2>Sesiones aprobadas</h2>${entries || "<p>No constan sesiones clínicas aprobadas.</p>"}<p class="privacy">Documento confidencial que contiene datos de salud.</p>`);
  }
  function openReport(report = null) {
    if (!currentPatient) return;
    els.reportId.value = report?.id || "";
    els.reportType.value = report?.report_type || "evolution";
    els.reportRecipient.value = report?.recipient || "";
    els.reportPurpose.value = report?.purpose || "";
    els.reportStart.value = report?.period_start || "";
    els.reportEnd.value = report?.period_end || "";
    const content = report?.content || {};
    els.reportContext.value = content.context || "";
    els.reportEvolution.value = content.evolution || "";
    els.reportInterventions.value = content.interventions || "";
    els.reportCurrent.value = content.current || "";
    els.reportTitlePreview.textContent = report?.title || reportTypeLabel(els.reportType.value);
    els.reportHeading.textContent = report?.title || "Nuevo informe";
    els.reportMeta.textContent = `${currentPatient.public_code} · ${currentPatient.full_name}`;
    els.reportSignature.textContent = `Carolina Sánchez Girona · ${dateShort.format(new Date())}`;
    els.reportMessage.textContent = report?.status === "approved" ? "Informe aprobado. El contenido está bloqueado." : "";
    const locked = report?.status === "approved";
    [els.reportType, els.reportRecipient, els.reportPurpose, els.reportStart, els.reportEnd, els.reportContext, els.reportEvolution, els.reportInterventions, els.reportCurrent].forEach((field) => { field.disabled = locked; });
    els.generateReport.disabled = locked; els.saveReport.disabled = locked; els.approveReport.disabled = locked;
    if (!els.reportDialog.open) els.reportDialog.showModal();
  }
  function generateReportDraft() {
    if (!currentPatient) return;
    const sessions = approvedSessionsInPeriod(currentPatient.id);
    const goals = patientGoals(currentPatient.id);
    const profile = clinicalProfile(currentPatient);
    els.reportTitlePreview.textContent = reportTypeLabel(els.reportType.value);
    els.reportContext.value = [
      profile.reason_for_consultation ? `Motivo de consulta: ${profile.reason_for_consultation}` : "",
      currentPatient.clinical_summary ? `Síntesis clínica: ${currentPatient.clinical_summary}` : "",
      profile.integrative_formulation ? `Formulación clínica: ${profile.integrative_formulation}` : "",
      profile.diagnoses ? `Diagnósticos registrados: ${profile.diagnoses}` : "",
    ].filter(Boolean).join("\n\n") || "No consta información clínica estructurada suficiente.";
    els.reportEvolution.value = sessions.map((item) => `${dateShort.format(new Date(item.session_date))}: ${item.evolution_note || "Sin descripción de evolución."}`).join("\n\n") || profile.clinical_evolution_summary || "";
    els.reportInterventions.value = sessions.filter((item) => item.intervention_note).map((item) => `${dateShort.format(new Date(item.session_date))}: ${item.intervention_note}`).join("\n\n") || profile.interventions_summary || "";
    const activeGoals = goals.map((goal) => goal.title).join("; ");
    els.reportCurrent.value = [
      currentPatient.next_session_focus ? `Focos clínicos pendientes: ${currentPatient.next_session_focus}` : "",
      activeGoals ? `Objetivos activos: ${activeGoals}.` : "",
      profile.therapeutic_goals ? `Objetivos terapéuticos: ${profile.therapeutic_goals}` : "",
      profile.treatment_plan ? `Plan terapéutico: ${profile.treatment_plan}` : "",
    ].filter(Boolean).join("\n\n");
    els.reportMessage.textContent = `Borrador generado a partir de ${sessions.length} sesión(es) aprobada(s) y de la ficha clínica estructurada. Revísalo antes de aprobar.`;
  }
  function reportPayload(status) {
    const sessions = approvedSessionsInPeriod(currentPatient.id);
    return {
      patient_id: currentPatient.id, report_type: els.reportType.value,
      title: reportTypeLabel(els.reportType.value), recipient: els.reportRecipient.value.trim() || null,
      purpose: els.reportPurpose.value.trim() || null, period_start: els.reportStart.value || null,
      period_end: els.reportEnd.value || null,
      content: { context: els.reportContext.value.trim(), evolution: els.reportEvolution.value.trim(), interventions: els.reportInterventions.value.trim(), current: els.reportCurrent.value.trim() },
      included_session_ids: sessions.map((item) => item.id), status,
      approved_at: status === "approved" ? new Date().toISOString() : null, updated_at: new Date().toISOString(),
    };
  }
  async function persistReport(status) {
    if (!currentPatient) return;
    if (status === "approved" && !els.reportEvolution.value.trim() && !els.reportContext.value.trim()) throw new Error("El informe no contiene información suficiente para aprobarlo.");
    els.reportMessage.textContent = status === "approved" ? "Aprobando informe…" : "Guardando borrador…";
    const payload = reportPayload(status);
    const rows = els.reportId.value
      ? await rest(`clinical_reports?id=eq.${encodeURIComponent(els.reportId.value)}&select=*`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(payload) })
      : await rest("clinical_reports?select=*", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(payload) });
    const saved = rows?.[0]; if (!saved) throw new Error("No se ha podido guardar el informe.");
    clinicalReports = [saved, ...clinicalReports.filter((item) => item.id !== saved.id)];
    els.reportId.value = saved.id;
    renderReports(currentPatient);
    openReport(saved);
  }
  function printCurrentReport() {
    if (!currentPatient) return;
    const section = (title, value) => value.trim() ? `<h2>${title}</h2><div class="text">${escapeHtml(value)}</div>` : "";
    printableWindow(els.reportTitlePreview.textContent, `<header><p>Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga</p><h1>${escapeHtml(els.reportTitlePreview.textContent)}</h1><p class="meta">Paciente: ${escapeHtml(currentPatient.full_name)} · Código: ${escapeHtml(currentPatient.public_code)}<br>Destinatario: ${escapeHtml(els.reportRecipient.value || "No especificado")} · Finalidad: ${escapeHtml(els.reportPurpose.value || "Asistencial")}<br>Fecha: ${escapeHtml(dateShort.format(new Date()))}</p></header>${section("Motivo y contexto", els.reportContext.value)}${section("Evolución clínica", els.reportEvolution.value)}${section("Intervenciones realizadas", els.reportInterventions.value)}${section("Situación actual y recomendaciones", els.reportCurrent.value)}<div class="signature"><p>Carolina Sánchez Girona</p></div><p class="privacy">Documento confidencial que contiene datos de salud.</p>`);
  }
  function renderReports(patient) {
    els.patientReports.replaceChildren();
    const reports = clinicalReports.filter((item) => item.patient_id === patient.id);
    if (!reports.length) { els.patientReports.append(create("p", "clinic-empty-inline", "Todavía no hay informes guardados.")); return; }
    reports.forEach((report) => {
      const row = create("article"); const info = create("div");
      info.append(create("strong", "", report.title), create("span", "", `${dateShort.format(new Date(report.created_at))} · ${report.status === "approved" ? "Aprobado" : "Borrador"}`));
      const button = create("button", "clinic-secondary", report.status === "approved" ? "Ver / imprimir" : "Continuar");
      button.type = "button"; button.addEventListener("click", () => openReport(report));
      row.append(info, button); els.patientReports.append(row);
    });
  }

  function markerValues(container) {
    return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
  }
  function setMarkerValues(container, values = []) {
    container.querySelectorAll('input[type="checkbox"]').forEach((input) => { input.checked = values.includes(input.value); });
  }
  function evolutionValues() {
    return Object.fromEntries(Array.from(document.querySelectorAll("[data-evolution]")).map((select) => [select.dataset.evolution, select.value]));
  }
  function setEvolutionValues(values = {}) {
    document.querySelectorAll("[data-evolution]").forEach((select) => { select.value = values[select.dataset.evolution] || "not_assessed"; });
  }
  function renderSessionGoals(patientId, selected = []) {
    els.sessionGoals.replaceChildren();
    const goals = patientGoals(patientId);
    if (!goals.length) {
      els.sessionGoals.append(create("p", "clinic-empty-inline", "Todavía no hay objetivos activos."));
      return;
    }
    goals.forEach((goal) => {
      const label = create("label");
      const input = create("input");
      input.type = "checkbox";
      input.value = goal.id;
      input.checked = selected.includes(goal.id);
      label.append(input, document.createTextNode(goal.title));
      els.sessionGoals.append(label);
    });
  }


  function renderPending() {
    const drafts = clinicalSessions.filter((item) => item.status === "draft");
    const exercises = exerciseAssignments.filter((item) => ["prepared", "sent", "assigned"].includes(item.status));
    const reports = clinicalReports.filter((item) => item.status === "draft");
    const now = new Date();
    const withoutNext = patients.filter((patient) =>
      patient.care_context !== "creu_blava"
      && !patientAppointments(patient.id).some((item) => new Date(item.starts_at) > now && !["cancelled", "canceled"].includes(item.status))
    );
    const groups = [
      ["Sesiones sin cerrar", drafts, (item) => patientById(item.patient_id)],
      ["Ejercicios pendientes", exercises, (item) => patientById(item.patient_id)],
      ["Informes en borrador", reports, (item) => patientById(item.patient_id)],
      ["Sin próxima cita", withoutNext, (item) => item],
    ];
    const total = groups.reduce((sum, [, items]) => sum + items.length, 0);
    els.pendingBadge.textContent = String(total);
    els.pendingSummary.replaceChildren();
    groups.forEach(([label, items]) => { const card = create("article"); card.append(create("strong", "", String(items.length)), create("span", "", label)); els.pendingSummary.append(card); });
    els.pendingList.replaceChildren();
    groups.forEach(([label, items, getPatient]) => {
      const section = create("section", "clinic-pending-group"); section.append(create("h3", "", label));
      if (!items.length) section.append(create("p", "clinic-empty-inline", "Sin pendientes."));
      items.forEach((item) => {
        const patient = getPatient(item); if (!patient) return;
        const row = create("article"); const info = create("div");
        const detail = item.title || (item.session_number ? `Sesión ${item.session_number}` : patient.public_code);
        info.append(create("strong", "", patient.public_code), create("span", "", detail));
        const button = create("button", "clinic-secondary", "Abrir ficha"); button.type = "button"; button.addEventListener("click", () => openPatient(patient));
        row.append(info, button); section.append(row);
      });
      els.pendingList.append(section);
    });
  }
  function timelineItems(patient) {
    const items = [];
    patientAppointments(patient.id).forEach((x) => items.push({ date: x.starts_at, type: "Cita", text: statusLabel(x.status) }));
    patientExternalVisits(patient.id).filter((x) => x.visit_date).forEach((x) => items.push({
      date: `${x.visit_date}T${x.visit_time}`,
      type: "Visita externa",
      text: `${x.external_provider} · ${externalCenterLabel(x.center)} · ${x.insurance_provider}`,
    }));
    patientSessions(patient.id).forEach((x) => items.push({ date: x.session_date, type: "Sesión", text: `${x.status === "approved" ? "Aprobada" : "Borrador"} · sesión ${x.session_number || ""}` }));
    patientExercises(patient.id).forEach((x) => items.push({ date: x.sent_at || x.created_at, type: "Ejercicio", text: `${x.title} · ${x.email_status === "sent" ? "enviado" : "preparado"}` }));
    clinicalReports.filter((x) => x.patient_id === patient.id).forEach((x) => items.push({ date: x.approved_at || x.created_at, type: "Informe", text: `${x.title} · ${x.status === "approved" ? "aprobado" : "borrador"}` }));
    clinicalDocuments.filter((x) => x.patient_id === patient.id).forEach((x) => items.push({ date: x.document_date || x.created_at, type: "Documento", text: x.title }));
    scaleMeasurements.filter((x) => x.patient_id === patient.id).forEach((x) => items.push({ date: x.measured_at, type: "Escala", text: `${x.instrument}${x.total_score !== null && x.total_score !== undefined ? `: ${x.total_score}` : ""}` }));
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  function renderTimeline(patient) {
    els.patientTimeline.replaceChildren();
    const items = timelineItems(patient);
    if (!items.length) { els.patientTimeline.append(create("p", "clinic-empty-inline", "Todavía no hay actividad clínica.")); return; }
    items.forEach((item) => {
      const row = create("article", "clinic-timeline-item");
      row.append(create("time", "", dateShort.format(new Date(item.date))), create("strong", "", item.type), create("span", "", item.text));
      els.patientTimeline.append(row);
    });
  }
  function renderDocuments(patient) {
    els.patientDocuments.replaceChildren();
    const docs = clinicalDocuments.filter((item) => item.patient_id === patient.id);
    if (!docs.length) { els.patientDocuments.append(create("p", "clinic-empty-inline", "No hay documentos.")); return; }
    docs.forEach((doc) => {
      const row = create("article"); const info = create("div");
      info.append(create("strong", "", doc.title), create("span", "", `${doc.file_name} · ${dateShort.format(new Date(doc.document_date || doc.created_at))}`));
      const button = create("button", "clinic-secondary", "Abrir"); button.type = "button";
      button.addEventListener("click", async () => {
        try {
          const response = await fetch(`${SUPABASE_URL}/storage/v1/object/authenticated/clinical-documents/${doc.file_path}`, { headers: authHeaders() });
          if (!response.ok) throw new Error("No se ha podido descargar el documento.");
          const url = URL.createObjectURL(await response.blob()); const popup = window.open(url, "_blank"); if (popup) popup.opener = null;
          setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (error) { els.patientMessage.textContent = error.message; }
      });
      row.append(info, button); els.patientDocuments.append(row);
    });
  }
  async function uploadDocument(event) {
    event.preventDefault(); if (!currentPatient) return;
    const file = els.documentFile.files?.[0]; if (!file) throw new Error("Selecciona un archivo.");
    if (file.size > 10485760) throw new Error("El archivo supera los 10 MB.");
    els.documentMessage.textContent = "Subiendo documento…";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${currentPatient.id}/${crypto.randomUUID()}-${safeName}`;
    const upload = await fetch(`${SUPABASE_URL}/storage/v1/object/clinical-documents/${path}`, { method: "POST", headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}`, "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" }, body: file });
    if (!upload.ok) throw new Error((await upload.json().catch(() => ({}))).message || "No se ha podido subir el archivo.");
    try {
      const rows = await rest("clinical_documents?select=*", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ patient_id: currentPatient.id, category: els.documentCategory.value, title: els.documentTitle.value.trim(), file_path: path, file_name: file.name, mime_type: file.type || null, file_size: file.size, document_date: els.documentDate.value || null, notes: els.documentNotes.value.trim() || null }) });
      if (!rows?.[0]) throw new Error("No se pudo registrar el documento.");
      clinicalDocuments.unshift(rows[0]);
    } catch (error) {
      await fetch(`${SUPABASE_URL}/storage/v1/object/clinical-documents/${path}`, { method: "DELETE", headers: authHeaders() });
      throw error;
    }
    renderDocuments(currentPatient); renderTimeline(currentPatient); els.documentDialog.close(); renderPending();
  }
  function renderScales(patient) {
    els.patientScales.replaceChildren();
    const rows = scaleMeasurements.filter((item) => item.patient_id === patient.id).sort((a, b) => new Date(b.measured_at) - new Date(a.measured_at));
    if (!rows.length) { els.patientScales.append(create("p", "clinic-empty-inline", "No hay mediciones.")); return; }
    rows.forEach((item) => {
      const row = create("article"); const info = create("div");
      info.append(create("strong", "", `${item.instrument}${item.total_score !== null && item.total_score !== undefined ? ` · ${item.total_score}` : ""}`), create("span", "", `${dateShort.format(new Date(item.measured_at + "T12:00:00"))}${item.interpretation ? ` · ${item.interpretation}` : ""}`));
      row.append(info); els.patientScales.append(row);
    });
  }
  async function saveScale(event) {
    event.preventDefault(); if (!currentPatient) return;
    els.scaleMessage.textContent = "Guardando medición…";
    const rows = await rest("clinical_scale_measurements?select=*", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ patient_id: currentPatient.id, instrument: els.scaleInstrument.value.trim(), measured_at: els.scaleDate.value, total_score: els.scaleScore.value === "" ? null : Number(els.scaleScore.value), interpretation: els.scaleInterpretation.value.trim() || null, notes: els.scaleNotes.value.trim() || null }) });
    if (!rows?.[0]) throw new Error("No se ha podido guardar la medición.");
    scaleMeasurements.unshift(rows[0]); renderScales(currentPatient); renderTimeline(currentPatient); els.scaleDialog.close();
  }
  function toggleDictation() {
    if (isDictating) { speechRecognition?.stop(); return; }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { els.dictationState.textContent = "El navegador no admite dictado."; return; }
    if (!sessionStorage.getItem("clinic_dictation_notice")) {
      const accepted = window.confirm("El navegador puede procesar la voz mediante un servicio externo. No se guardará audio en la aplicación. ¿Quieres iniciar el dictado?");
      if (!accepted) return;
      sessionStorage.setItem("clinic_dictation_notice", "accepted");
    }
    speechRecognition = new Recognition(); speechRecognition.lang = "es-ES"; speechRecognition.continuous = true; speechRecognition.interimResults = true;
    let finalText = "";
    speechRecognition.onstart = () => { isDictating = true; els.dictate.textContent = "Detener dictado"; els.dictationState.textContent = "Escuchando…"; };
    speechRecognition.onresult = (event) => {
      let interim = ""; for (let i = event.resultIndex; i < event.results.length; i += 1) { const text = event.results[i][0].transcript; if (event.results[i].isFinal) finalText += text + " "; else interim += text; }
      els.dictationState.textContent = interim || "Escuchando…";
      if (finalText) { els.workNotes.value = [els.workNotes.value.trim(), finalText.trim()].filter(Boolean).join("\n"); finalText = ""; }
    };
    speechRecognition.onerror = (event) => { els.dictationState.textContent = `Error de dictado: ${event.error}`; };
    speechRecognition.onend = () => { isDictating = false; els.dictate.textContent = "Iniciar dictado"; if (!els.dictationState.textContent.startsWith("Error")) els.dictationState.textContent = "Dictado detenido."; };
    speechRecognition.start();
  }

  function renderPreparation(patient) {
    els.preparation.replaceChildren();
    const recent = patientSessions(patient.id).filter((item) => item.status === "approved").slice(0, 3);
    const profile = clinicalProfile(patient);
    const list = create("div", "clinic-preparation-grid");
    const summary = create("article");
    summary.append(create("strong", "", "Síntesis actual"), create("p", "", patient.clinical_summary || "Todavía no consta una síntesis clínica."));
    const focus = create("article");
    focus.append(create("strong", "", "Para hoy"), create("p", "", patient.next_session_focus || "No hay focos pendientes registrados."));
    list.append(summary, focus);
    if (profile.risk_safety) {
      const risk = create("article", "clinic-full clinic-preparation-alert");
      risk.append(create("strong", "", "Seguridad / seguimiento"), create("p", "", profile.risk_safety));
      list.append(risk);
    }
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
    setMarkerValues(els.processMarkers, existing?.process_markers || []);
    setMarkerValues(els.interventionMarkers, existing?.intervention_markers || []);
    setEvolutionValues(existing?.evolution_markers || {});
    renderSessionGoals(patient.id, existing?.worked_goal_ids || []);
    els.sessionMessage.textContent = "";
    const approved = existing?.status === "approved";
    els.sessionState.textContent = approved
      ? `Registro aprobado el ${dateShort.format(new Date(existing.approved_at))}. No puede sobrescribirse.`
      : "Las notas de trabajo permanecen separadas del registro clínico hasta que pulses «Aprobar y cerrar».";
    [els.workNotes, els.evolutionNote, els.interventionNote, els.responseNote, els.agreementsNote, els.homeworkNote, els.nextSessionNote]
      .forEach((field) => { field.disabled = approved; });
    els.saveDraft.disabled = approved;
    els.approveSession.disabled = approved;
    els.dictate.disabled = approved;
    els.sessionDialog.showModal();
  }

  function renderHistory(patient) {
    els.patientHistory.replaceChildren();
    const bookings = patientAppointments(patient.id).sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at));
    const visits = patientExternalVisits(patient.id);
    if (!bookings.length && !visits.length) {
      els.patientHistory.append(create("p", "clinic-empty-inline", "No hay citas vinculadas."));
      return;
    }
    visits.forEach((visit) => {
      const row = create("article");
      const info = create("div");
      info.append(
        create("strong", "", externalVisitWhen(visit)),
        create("span", "", `${visit.external_provider} · ${externalCenterLabel(visit.center)} · ${visit.insurance_provider}`)
      );
      row.append(info, create("span", "clinic-status-pill", "Visita externa"));
      els.patientHistory.append(row);
    });
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
    const latestExternalVisit = patientExternalVisits(patient.id)[0];
    if (latestExternalVisit) {
      els.patientContact.append(create("span", "", `${latestExternalVisit.external_provider} · ${externalCenterLabel(latestExternalVisit.center)} · ${latestExternalVisit.insurance_provider}`));
      els.patientContact.append(create("span", "", externalVisitWhen(latestExternalVisit)));
    }
    if (patient.care_context === "combined") els.patientContact.append(create("span", "", "Consulta propia + Creu Blava"));
    els.summaryNote.value = patient.clinical_summary || "";
    els.nextFocus.value = patient.next_session_focus || "";
    els.medication.value = patient.medication_notes || "";
    fillClinicalProfile(patient);
    els.patientMessage.textContent = "";
    els.patientName.textContent = `${patient.public_code} · ${patient.full_name}`;
    renderPreparation(patient);
    renderTimeline(patient);
    renderDocuments(patient);
    renderScales(patient);
    renderExercises(patient);
    renderReports(patient);
    renderHistory(patient);
    els.patientDialog.showModal();
  }

  function appointmentCard(appointment) {
    const patient = patientById(appointment.clinical_patient_id);
    const card = create("article", "clinic-appointment");
    card.append(create("time", "clinic-time", timeFormat.format(new Date(appointment.starts_at))));
    const body = create("div");
    body.append(
      create("h3", "", patient?.public_code || "Paciente sin código"),
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
    const filtered = patients.filter((patient) => {
      const externalText = patientExternalVisits(patient.id)
        .map((item) => `${item.insurance_provider} ${item.external_provider} ${externalCenterLabel(item.center)} ${item.visit_date || ""} ${item.visit_time || ""}`)
        .join(" ");
      return [patient.full_name, patient.email, patient.phone, externalText]
        .some((value) => (value || "").toLowerCase().includes(term));
    });
    els.patientList.replaceChildren();
    if (!filtered.length) {
      els.patientList.append(create("div", "clinic-empty", "No se han encontrado pacientes."));
      return;
    }
    filtered.forEach((patient) => {
      const bookings = patientAppointments(patient.id);
      const visits = patientExternalVisits(patient.id);
      const card = create("article", "clinic-patient-card");
      const body = create("div");
      body.append(create("h3", "", patient.public_code), create("p", "", "Identidad oculta en el listado general"));
      if (visits[0]) {
        body.append(create("p", "", `${visits[0].external_provider} · ${externalCenterLabel(visits[0].center)} · ${visits[0].insurance_provider} · ${externalVisitWhen(visits[0])}`));
      }
      const summary = create("p", "", `${bookings.length} cita(s) propia(s) · ${visits.length} visita(s) externa(s) · ${patientSessions(patient.id).length} sesión(es) clínica(s)`);
      const button = create("button", "clinic-secondary", "Abrir ficha");
      button.type = "button";
      button.addEventListener("click", () => openPatient(patient));
      card.append(body, summary, button);
      els.patientList.append(card);
    });
  }

  async function loadData() {
    setMessage("Cargando información clínica…");
    const [bookingRows, patientRows, externalVisitRows, sessionRows, goalRows, templateRows, assignmentRows, reportRows, documentRows, scaleRows] = await Promise.all([
      rest(`appointment_bookings?select=id,patient_name,patient_email,patient_phone,patient_type,status,starts_at,ends_at,service_code,clinical_patient_id&order=starts_at.desc&limit=1000`),
      rest("clinical_patients?select=*&order=full_name.asc"),
      rest("clinical_external_visits?select=*&order=visit_date.desc.nullslast,visit_time.desc"),
      rest("clinical_sessions?select=*&order=session_date.desc"),
      rest("clinical_goals?select=*&order=created_at.asc"),
      rest("clinical_exercise_templates?select=*&status=eq.active&order=title.asc"),
      rest("clinical_exercise_assignments?select=*&order=created_at.desc"),
      rest("clinical_reports?select=*&order=created_at.desc"),
      rest("clinical_documents?select=*&order=created_at.desc"),
      rest("clinical_scale_measurements?select=*&order=measured_at.desc"),
    ]);
    appointments = bookingRows || [];
    patients = patientRows || [];
    externalVisits = externalVisitRows || [];
    clinicalSessions = sessionRows || [];
    clinicalGoals = goalRows || [];
    exerciseTemplates = templateRows || [];
    exerciseAssignments = assignmentRows || [];
    clinicalReports = reportRows || [];
    clinicalDocuments = documentRows || [];
    scaleMeasurements = scaleRows || [];
    renderToday();
    renderPatients(els.patientSearch.value);
    renderPending();
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
        clinical_profile: clinicalProfilePayload(),
        updated_at: new Date().toISOString(),
      }),
    });
    const updated = rows?.[0];
    if (updated) {
      patients = patients.map((patient) => patient.id === updated.id ? updated : patient);
      currentPatient = updated;
      fillClinicalProfile(updated);
      renderPreparation(updated);
      renderTimeline(updated);
    }
    els.patientMessage.textContent = "Ficha completa guardada.";
  }

  function generateStructuredDraft() {
    const notes = els.workNotes.value.trim();
    const processes = markerValues(els.processMarkers);
    const interventions = markerValues(els.interventionMarkers);
    const evolution = evolutionValues();
    const evolutionLabels = { better: "mejor", similar: "similar", worse: "peor", fluctuating: "fluctuante" };
    const assessed = Object.entries(evolution)
      .filter(([, value]) => value !== "not_assessed")
      .map(([area, value]) => `${area}: ${evolutionLabels[value] || value}`);

    if (!notes && !processes.length && !interventions.length && !assessed.length) {
      els.sessionMessage.textContent = "Añade primero alguna nota o marcador.";
      return;
    }
    if (!els.evolutionNote.value.trim()) {
      const parts = [];
      if (notes) parts.push(notes);
      if (processes.length) parts.push(`Procesos registrados: ${processes.join(", ")}.`);
      if (assessed.length) parts.push(`Evolución referida u observada: ${assessed.join("; ")}.`);
      els.evolutionNote.value = parts.join("\n\n");
    }
    if (!els.interventionNote.value.trim() && interventions.length) {
      els.interventionNote.value = `Intervenciones realizadas: ${interventions.join(", ")}.`;
    }
    els.sessionMessage.textContent = "Borrador generado. Revísalo antes de aprobar.";
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
      process_markers: markerValues(els.processMarkers),
      intervention_markers: markerValues(els.interventionMarkers),
      evolution_markers: evolutionValues(),
      worked_goal_ids: markerValues(els.sessionGoals),
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
      if (currentPatient && els.nextSessionNote.value.trim()) {
        const updatedPatients = await rest(`clinical_patients?id=eq.${encodeURIComponent(currentPatient.id)}&select=*`, {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            next_session_focus: els.nextSessionNote.value.trim(),
            updated_at: new Date().toISOString(),
          }),
        });
        if (updatedPatients?.[0]) {
          currentPatient = updatedPatients[0];
          patients = patients.map((patient) => patient.id === currentPatient.id ? currentPatient : patient);
        }
      }
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
    els.todayView.hidden = name !== "today";
    els.patientsView.hidden = name !== "patients";
    els.pendingView.hidden = name !== "pending";
    els.viewToday.classList.toggle("active", name === "today");
    els.viewPatients.classList.toggle("active", name === "patients");
    els.viewPending.classList.toggle("active", name === "pending");
    if (name === "patients") els.patientSearch.focus();
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
  els.viewPending.addEventListener("click", () => setView("pending"));
  els.patientSearch.addEventListener("input", () => renderPatients(els.patientSearch.value));
  els.patientClose.addEventListener("click", () => els.patientDialog.close());
  els.patientForm.addEventListener("submit", (event) => savePatient(event).catch((error) => { els.patientMessage.textContent = error.message; }));
  els.sessionClose.addEventListener("click", () => { if (isDictating) speechRecognition?.stop(); els.sessionDialog.close(); });
  els.refreshTimeline.addEventListener("click", () => currentPatient && renderTimeline(currentPatient));
  els.addDocument.addEventListener("click", () => { if (!currentPatient) return; els.documentForm.reset(); els.documentDate.value = todayKey(); els.documentMessage.textContent = ""; els.documentDialog.showModal(); });
  els.documentClose.addEventListener("click", () => els.documentDialog.close());
  els.documentForm.addEventListener("submit", (event) => uploadDocument(event).catch((error) => { els.documentMessage.textContent = error.message; }));
  els.addScale.addEventListener("click", () => { if (!currentPatient) return; els.scaleForm.reset(); els.scaleDate.value = todayKey(); els.scaleMessage.textContent = ""; els.scaleDialog.showModal(); });
  els.scaleClose.addEventListener("click", () => els.scaleDialog.close());
  els.scaleForm.addEventListener("submit", (event) => saveScale(event).catch((error) => { els.scaleMessage.textContent = error.message; }));
  els.dictate.addEventListener("click", toggleDictation);
  els.printHistory.addEventListener("click", () => { try { printClinicalHistory(); } catch (error) { els.patientMessage.textContent = error.message; } });
  els.newReport.addEventListener("click", () => openReport());
  els.reportClose.addEventListener("click", () => els.reportDialog.close());
  els.reportType.addEventListener("change", () => { els.reportTitlePreview.textContent = reportTypeLabel(els.reportType.value); });
  els.generateReport.addEventListener("click", generateReportDraft);
  els.saveReport.addEventListener("click", () => persistReport("draft").catch((error) => { els.reportMessage.textContent = error.message; }));
  els.approveReport.addEventListener("click", () => persistReport("approved").catch((error) => { els.reportMessage.textContent = error.message; }));
  els.printReport.addEventListener("click", () => { try { printCurrentReport(); } catch (error) { els.reportMessage.textContent = error.message; } });
  els.newExercise.addEventListener("click", () => openExercise());
  els.exerciseClose.addEventListener("click", () => els.exerciseDialog.close());
  els.saveExercise.addEventListener("click", () => saveExercise(false).catch((error) => { els.exerciseMessage.textContent = error.message; }));
  els.exerciseForm.addEventListener("submit", (event) => { event.preventDefault(); saveExercise(true).catch((error) => { els.exerciseMessage.textContent = error.message; }); });
  els.generateDraft.addEventListener("click", generateStructuredDraft);
  els.addGoal.addEventListener("click", async () => {
    if (!currentPatient) return;
    const title = window.prompt("Escribe el objetivo terapéutico:");
    if (!title?.trim()) return;
    try {
      const rows = await rest("clinical_goals?select=*", {
        method: "POST", headers: { Prefer: "return=representation" },
        body: JSON.stringify({ patient_id: currentPatient.id, title: title.trim() }),
      });
      if (rows?.[0]) clinicalGoals.push(rows[0]);
      const selected = markerValues(els.sessionGoals);
      renderSessionGoals(currentPatient.id, selected);
    } catch (error) { els.sessionMessage.textContent = error.message; }
  });
  els.saveDraft.addEventListener("click", () => persistClinicalSession("draft").catch((error) => { els.sessionMessage.textContent = error.message; }));
  els.sessionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    persistClinicalSession("approved").catch((error) => { els.sessionMessage.textContent = error.message; });
  });
  [els.patientDialog, els.sessionDialog, els.exerciseDialog, els.reportDialog, els.documentDialog, els.scaleDialog].forEach((dialog) => dialog.addEventListener("click", (event) => {
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
