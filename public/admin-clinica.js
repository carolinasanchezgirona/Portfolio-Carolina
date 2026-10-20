(() => {
  "use strict";
  if (window.location.pathname.startsWith("/admin/clinica/acceso")) return;
  // La entrada antigua de Mi clínica abre el panel general. Los enlaces internos usan panel=1.
  if (new URL(window.location.href).searchParams.get("panel") !== "1") {
    window.location.replace("/admin/");
    return;
  }

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
    showArchived: $("#clinic-show-archived"),
    newPatient: $("#clinic-new-patient"), newPatientDialog: $("#clinic-new-patient-dialog"), newPatientForm: $("#clinic-new-patient-form"),
    newPatientClose: $("#clinic-new-patient-close"), newPatientCancel: $("#clinic-new-patient-cancel"), newPatientSave: $("#clinic-new-patient-save"),
    newPatientName: $("#clinic-new-patient-name"), newPatientPhone: $("#clinic-new-patient-phone"), newPatientEmail: $("#clinic-new-patient-email"),
    newPatientType: $("#clinic-new-patient-type"), newPatientContext: $("#clinic-new-patient-context"), newPatientMessage: $("#clinic-new-patient-message"),
    totalToday: $("#clinic-total-today"), confirmedToday: $("#clinic-confirmed-today"),
    pendingToday: $("#clinic-pending-today"), finishedToday: $("#clinic-finished-today"),
    patientDialog: $("#clinic-patient-dialog"), patientForm: $("#clinic-patient-form"),
    patientClose: $("#clinic-patient-close"), patientId: $("#clinic-patient-id"),
    patientName: $("#clinic-patient-name"), patientContact: $("#clinic-patient-contact"),
    archivePatient: $("#clinic-archive-patient"), deletePatient: $("#clinic-delete-patient"), deletePatientNote: $("#clinic-delete-patient-note"),
    personalFullName: $("#clinic-personal-full-name"), personalBirthDate: $("#clinic-personal-birth-date"),
    personalAge: $("#clinic-personal-age"), personalNationalId: $("#clinic-personal-national-id"),
    personalPhone: $("#clinic-personal-phone"), personalEmail: $("#clinic-personal-email"),
    personalAddress: $("#clinic-personal-address"), personalOccupation: $("#clinic-personal-occupation"),
    personalMaritalStatus: $("#clinic-personal-marital-status"), personalEmergencyName: $("#clinic-personal-emergency-name"),
    personalEmergencyPhone: $("#clinic-personal-emergency-phone"), personalReferringProfessional: $("#clinic-personal-referring-professional"),
    personalInsurance: $("#clinic-personal-insurance"), personalCareContext: $("#clinic-personal-care-context"),
    personalExternalProvider: $("#clinic-personal-external-provider"), personalAdminNotes: $("#clinic-personal-admin-notes"),
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
    exerciseLibrary: $("#clinic-exercise-library"), materialSearch: $("#clinic-material-search"),
    materialNotFound: $("#clinic-material-not-found"), materialUseSearch: $("#clinic-material-use-search"), materialAiCreate: $("#clinic-material-ai-create"),
    materialType: $("#clinic-material-type"), materialProcess: $("#clinic-material-process"), addMaterialLibrary: $("#clinic-add-material-library"),
    materialAiEnrich: $("#clinic-material-ai-enrich"),
    exerciseTitle: $("#clinic-exercise-title"), exerciseContent: $("#clinic-exercise-content"),
    exerciseIntroduction: $("#clinic-exercise-introduction"), exerciseWhy: $("#clinic-exercise-why"),
    exerciseDuration: $("#clinic-exercise-duration"), exerciseFrequency: $("#clinic-exercise-frequency"),
    exerciseObjective: $("#clinic-exercise-objective"), exerciseExample: $("#clinic-exercise-example"),
    exerciseRecord: $("#clinic-exercise-record"), exerciseSafety: $("#clinic-exercise-safety"), exerciseRemember: $("#clinic-exercise-remember"),
    exerciseSessionQuestions: $("#clinic-exercise-session-questions"),
    exerciseRationale: $("#clinic-exercise-rationale"), exerciseEmail: $("#clinic-exercise-email"), exerciseEmailSecondary: $("#clinic-exercise-email-secondary"),
    exerciseMessage: $("#clinic-exercise-message"), saveExercise: $("#clinic-save-exercise"),
    materialQuality: $("#clinic-material-quality"), materialQualityLabel: $("#clinic-material-quality-label"), materialQualityNote: $("#clinic-material-quality-note"),
    previewMaterial: $("#clinic-preview-material"), previewPdf: $("#clinic-preview-pdf"),
    printHistory: $("#clinic-print-history"), newReport: $("#clinic-new-report"), patientReports: $("#clinic-patient-reports"),
    patientTimeline: $("#clinic-patient-timeline"), refreshTimeline: $("#clinic-refresh-timeline"),
    addDocument: $("#clinic-add-document"), patientDocuments: $("#clinic-patient-documents"),
    documentDialog: $("#clinic-document-dialog"), documentForm: $("#clinic-document-form"), documentClose: $("#clinic-document-close"),
    documentTitle: $("#clinic-document-title"), documentCategory: $("#clinic-document-category"), documentDate: $("#clinic-document-date"),
    documentFile: $("#clinic-document-file"), documentNotes: $("#clinic-document-notes"), documentPatientNote: $("#clinic-document-patient-note"), documentShare: $("#clinic-document-share"), documentMessage: $("#clinic-document-message"),
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
  let pendingAiMaterial = null;
  let exerciseAssignments = [];
  let clinicalReports = [];
  let clinicalDocuments = [];
  let clinicalDocumentEmailNotices = [];
  let scaleMeasurements = [];
  let speechRecognition = null;
  let isDictating = false;
  let currentPatient = null;
  let currentAppointment = null;
  let patientPageReturnScroll = 0;
  let patientFormBaseline = "";
  let sessionFormBaseline = "";
  let sessionSaveTimer = null;
  let sessionSaveActive = false;
  let sessionSavePending = false;

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
  function showLogin() { window.location.replace("/admin/clinica/acceso/?next=%2Fadmin%2F"); }
  function showApp() { if (els.app) els.app.hidden = false; }

  function sessionFormSnapshot() {
    if (!els.sessionForm) return "";
    return JSON.stringify([...els.sessionForm.querySelectorAll("input,textarea,select")]
      .filter(input => !["button","submit","reset","hidden"].includes(input.type || ""))
      .map(input => [input.id || input.name || "",input.type === "checkbox" || input.type === "radio" ? input.checked : input.value]));
  }
  function markSessionSaved() {
    sessionFormBaseline = sessionFormSnapshot();
    const el = document.querySelector("#clinic-session-autosave-state");
    if (el) el.textContent = els.sessionId.value ? "Borrador de sesión guardado" : "Sesión nueva · sin guardar";
  }
  function scheduleSessionAutoSave() {
    if (!els.sessionDialog.open || els.saveDraft.disab…18769 tokens truncated…tatus === "approved" ? "Aprobado" : "Borrador"}`));
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
    patientExercises(patient.id).forEach((x) => items.push({ date: x.sent_at || x.created_at, type: "Ejercicio", text: `${x.title} · ${x.email_status === "sent" ? "enviado" : "preparado"}${x.patient_response_status === "shared" ? " · respuestas compartidas" : ""}` }));
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
  function documentCategoryLabel(category) {
    return ({
      intervention_plan: "Plan de intervención",
      information_notice: "Circular informativa",
      relaxation_audio: "Audio de relajación",
      external_report: "Informe externo",
      referral: "Derivación",
      consent: "Consentimiento",
      test_result: "Resultado de prueba",
      attendance: "Justificante",
      other: "Otro"
    })[category] || "Documento";
  }


  async function refreshClinicalFileNotices() {
    clinicalDocumentEmailNotices = await rest(
      "clinical_document_email_notices?select=document_id,shared_at,status,sent_at,claimed_at,error_code&order=claimed_at.desc&limit=1000"
    ) || [];
    if (currentPatient) renderDocuments(currentPatient);
  }

  async function sendClinicalFileNotice(docId, retry = false) {
    let feedback = "El archivo ya está disponible en Mi espacio.";
    try {
      const response = await fetch(SUPABASE_URL + "/functions/v1/notify-clinical-file", {
        method: "POST",
        headers: { apikey: KEY, Authorization: "Bearer " + session.access_token, "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: docId, retry }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && (data.status === "sent" || data.already_sent)) {
        feedback = "Archivo compartido. Brevo ha aceptado el correo. La entrega todavía no está confirmada.";
      } else if (response.ok && data.status === "sending") {
        feedback = "Archivo compartido. El aviso por correo está en proceso, sin confirmación de entrega.";
      } else {
        feedback = "Archivo compartido. Aviso por correo no enviado: " +
          (data.error || "servicio temporalmente no disponible.") +
          " Puedes reintentarlo desde la ficha.";
      }
    } catch {
      feedback = "Archivo compartido. No se ha podido comprobar el envío del correo. Consulta el estado antes de reintentar.";
    }
    try { await refreshClinicalFileNotices(); } catch { /* Sharing is preserved if mail history is unavailable. */ }
    els.patientMessage.textContent = feedback;
    return feedback;
  }

  async function setPatientDocumentSharing(doc, share) {
    if (!currentPatient || currentPatient.id !== doc.patient_id) throw new Error("Paciente no válido.");
    if (share && !window.confirm(`¿Publicar «${doc.title}» para este paciente en Mi espacio? Comprueba que el documento y su destinatario son correctos.`)) return;
    if (!share && !window.confirm(`¿Retirar el acceso de este paciente a «${doc.title}»? Las copias ya descargadas no se pueden retirar.`)) return;
    const now = new Date().toISOString();
    const rows = await rest("clinical_documents?id=eq." + encodeURIComponent(doc.id) + "&patient_id=eq." + encodeURIComponent(doc.patient_id) + "&select=*", {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(share
        ? { shared_at: now, share_revoked_at: null }
        : { share_revoked_at: now })
    });
    if (!Array.isArray(rows) || rows.length !== 1) throw new Error("No se ha podido actualizar el acceso.");
    const index = clinicalDocuments.findIndex(item => item.id === doc.id);
    if (index >= 0) clinicalDocuments[index] = rows[0];
    renderDocuments(currentPatient);
    if (share) await sendClinicalFileNotice(doc.id);
    else els.patientMessage.textContent = "Acceso retirado de Mi espacio. Las copias descargadas anteriormente no pueden revocarse.";
  }

  async function deletePatientDocument(doc) {
    if (!currentPatient || currentPatient.id !== doc.patient_id) throw new Error("Paciente no válido.");
    const label = doc.title || doc.file_name || "este documento";
    if (!window.confirm(`¿Eliminar «${label}» de la ficha clínica y de Mi espacio? Esta acción no se puede deshacer. Conserva cualquier documentación cuya custodia sea obligatoria.`)) return false;
    const filePath = String(doc.file_path || "");
    if (!filePath || !filePath.startsWith(doc.patient_id + "/")) throw new Error("Ruta de archivo no válida. No se ha eliminado nada.");
    // Remove the private object before its database metadata. If storage rejects deletion,
    // preserve the clinical record and report the error instead of hiding it in the UI.
    const storageResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/clinical-documents`, {
      method: "DELETE",
      headers: authHeaders(),
      body: JSON.stringify({ prefixes: [filePath] })
    });
    if (!storageResponse.ok && storageResponse.status !== 404) {
      const payload = await storageResponse.json().catch(() => ({}));
      throw new Error(payload.message || payload.error || "No se ha podido eliminar el archivo del almacenamiento. No se ha modificado su ficha.");
    }
    let removed;
    try {
      removed = await rest("clinical_documents?id=eq." + encodeURIComponent(doc.id) +
        "&patient_id=eq." + encodeURIComponent(doc.patient_id) + "&select=id", {
        method: "DELETE",
        headers: { Prefer: "return=representation" }
      });
    } catch (error) {
      throw new Error("El archivo se ha retirado del almacenamiento, pero no se pudo borrar su registro clínico. Contacta con soporte para completar la operación. " + (error.message || ""));
    }
    if (!Array.isArray(removed) || removed.length !== 1) {
      throw new Error("El archivo se ha retirado del almacenamiento, pero no se confirmó el borrado del registro. Actualiza la ficha y verifica su estado.");
    }
    clinicalDocuments = clinicalDocuments.filter(item => item.id !== doc.id);
    renderDocuments(currentPatient);
    els.patientMessage.textContent = "Documento eliminado de la ficha y del almacenamiento.";
    return true;
  }

  function renderDocuments(patient) {
    els.patientDocuments.replaceChildren();
    const docs = clinicalDocuments.filter((item) => item.patient_id === patient.id);
    if (!docs.length) { els.patientDocuments.append(create("p", "clinic-empty-inline", "Todavía no hay archivos.")); return; }
    docs.forEach((doc) => {
      const isShared = Boolean(doc.shared_at && !doc.share_revoked_at);
      const notice = isShared ? clinicalDocumentEmailNotices.find(item => item.document_id === doc.id && new Date(item.shared_at).getTime() === new Date(doc.shared_at).getTime()) : null;
      const row = create("article");
      const info = create("div");
      info.append(
        create("strong", "", doc.title),
        create("span", "", `${documentCategoryLabel(doc.category)} · ${doc.file_name} · ${dateShort.format(new Date(doc.document_date || doc.created_at))}`),
        create("span", "clinic-material-state" + (isShared ? " opened" : ""), isShared ? "Compartido en Mi espacio" : "Solo archivo clínico")
      );
      if (isShared) {
        const noticeLabels = {
          sending: "Aviso en proceso · entrega sin confirmar",
          sent: "Aceptado por Brevo · entrega sin confirmar",
          delivered: "Correo entregado al servidor destinatario",
          failed: "Aviso no enviado · comprueba el error",
          bounced: "Correo rechazado por el destinatario",
          blocked: "Correo bloqueado por el proveedor"
        };
        const label = notice ? (noticeLabels[notice.status] || "Estado del correo no disponible") : "Sin aviso por correo";
        const stamp = notice?.delivered_at || notice?.sent_at || notice?.claimed_at;
        const dated = stamp && !Number.isNaN(Date.parse(stamp)) ? " · " + new Date(stamp).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) : "";
        const state = create("span", "clinic-material-state", label + dated);
        state.title = notice?.status === "delivered"
          ? "Confirmación de recepción por el servidor de destino. No garantiza que el paciente haya leído el mensaje."
          : notice?.status === "sent"
          ? "Brevo ha aceptado el mensaje, pero todavía no existe confirmación de entrega."
          : notice?.status === "failed" ? "El envío no ha sido aceptado correctamente. Puedes reintentarlo." : label;
        info.append(state);
      }
      const actions = create("div", "clinic-material-row-actions");
      const openButton = create("button", "clinic-secondary", "Abrir");
      openButton.type = "button";
      openButton.addEventListener("click", async () => {
        try {
          const response = await fetch(`${SUPABASE_URL}/storage/v1/object/authenticated/clinical-documents/${doc.file_path}`, { headers: authHeaders() });
          if (!response.ok) throw new Error("No se ha podido descargar el documento.");
          const url = URL.createObjectURL(await response.blob());
          const popup = window.open(url, "_blank");
          if (popup) popup.opener = null;
          setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (error) { els.patientMessage.textContent = error.message; }
      });
      const shareButton = create("button", "clinic-secondary", isShared ? "Retirar acceso" : "Compartir con paciente");
      shareButton.type = "button";
      shareButton.addEventListener("click", async () => {
        shareButton.disabled = true;
        try { await setPatientDocumentSharing(doc, !isShared); }
        catch (error) { els.patientMessage.textContent = error.message || "No se ha podido actualizar el acceso."; }
        finally { shareButton.disabled = false; }
      });
      actions.append(openButton, shareButton);
      if (isShared && (!notice || notice.status === "failed")) {
        const notify = create("button", "clinic-secondary", notice?.status === "failed" ? "Reintentar aviso" : "Enviar aviso");
        notify.type = "button";
        notify.addEventListener("click", async () => {
          if (!window.confirm("¿Enviar un aviso neutro por correo? No incluirá archivos, títulos ni información clínica.")) return;
          notify.disabled = true;
          await sendClinicalFileNotice(doc.id, notice?.status === "failed");
        });
        actions.append(notify);
      }
      const deleteButton = create("button", "clinic-secondary clinic-document-delete", "Eliminar documento");
      deleteButton.type = "button";
      deleteButton.addEventListener("click", async () => {
        deleteButton.disabled = true;
        let status = row.querySelector(".clinic-document-delete-status");
        if (!status) {
          status = create("p", "clinic-document-delete-status");
          status.setAttribute("role", "status");
          row.append(status);
        }
        status.textContent = "";
        try { await deletePatientDocument(doc); }
        catch (error) {
          status.textContent = error.message || "No se ha podido eliminar el documento.";
          els.patientMessage.textContent = status.textContent;
        }
        finally { deleteButton.disabled = false; }
      });
      actions.append(deleteButton);
      row.append(info, actions);
      els.patientDocuments.append(row);
    });
  }

  const PATIENT_FILE_MAX_BYTES = 25 * 1024 * 1024;
  const PATIENT_FILE_MIME = {
    pdf: "application/pdf",
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    mp3: "audio/mpeg", m4a: "audio/mp4", wav: "audio/wav",
    ogg: "audio/ogg", webm: "audio/webm"
  };

  async function uploadDocument(event) {
    event.preventDefault();
    if (!currentPatient) return;
    const file = els.documentFile.files?.[0];
    if (!file) throw new Error("Selecciona un archivo.");
    if (file.size <= 0 || file.size > PATIENT_FILE_MAX_BYTES) throw new Error("El archivo debe ocupar entre 1 byte y 25 MB.");
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const mime = PATIENT_FILE_MIME[extension];
    if (!mime) throw new Error("Formato no admitido. Usa PDF, DOCX, imagen o audio MP3/M4A/WAV/OGG/WEBM.");
    const share = Boolean(els.documentShare?.checked);
    if (share && !window.confirm(`¿Compartir «${els.documentTitle.value.trim()}» con este paciente en Mi espacio? Revisa que el archivo no contiene información destinada a otra persona.`)) return;
    els.documentMessage.textContent = "Subiendo archivo privado…";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-140);
    const path = `${currentPatient.id}/${crypto.randomUUID()}-${safeName}`;
    const upload = await fetch(`${SUPABASE_URL}/storage/v1/object/clinical-documents/${path}`, {
      method: "POST",
      headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}`, "Content-Type": mime, "x-upsert": "false" },
      body: file
    });
    if (!upload.ok) throw new Error((await upload.json().catch(() => ({}))).message || "No se ha podido subir el archivo.");
    try {
      const rows = await rest("clinical_documents?select=*", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          patient_id: currentPatient.id,
          category: els.documentCategory.value,
          title: els.documentTitle.value.trim(),
          file_path: path,
          file_name: file.name,
          mime_type: mime,
          file_size: file.size,
          document_date: els.documentDate.value || null,
          notes: els.documentNotes.value.trim() || null,
          patient_note: els.documentPatientNote.value.trim() || null,
          shared_at: share ? new Date().toISOString() : null
        })
      });
      if (!rows?.[0]) throw new Error("No se pudo registrar el archivo.");
      clinicalDocuments.unshift(rows[0]);
    } catch (error) {
      await fetch(`${SUPABASE_URL}/storage/v1/object/clinical-documents/${path}`, { method: "DELETE", headers: authHeaders() });
      throw error;
    }
    renderDocuments(currentPatient);
    renderTimeline(currentPatient);
    els.documentDialog.close();
    if (share) await sendClinicalFileNotice(clinicalDocuments[0].id);
    else els.patientMessage.textContent = "Archivo guardado solo en la historia clínica.";
    renderPending();
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
      if (finalText) { els.workNotes.value = [els.workNotes.value.trim(), finalText.trim()].filter(Boolean).join("\n"); finalText = ""; scheduleSessionAutoSave(); }
    };
    speechRecognition.onerror = (event) => { els.dictationState.textContent = `Error de dictado: ${event.error}`; };
    speechRecognition.onend = () => { isDictating = false; els.dictate.textContent = "Iniciar dictado"; if (!els.dictationState.textContent.startsWith("Error")) els.dictationState.textContent = "Dictado detenido."; };
    speechRecognition.start();
  }

  function renderPreparation(patient) {
    els.preparation.replaceChildren();
    const approved = patientSessions(patient.id).filter(item => item.status === "approved");
    const last = approved[0] || null;
    const profile = clinicalProfile(patient);
    const goals = patientGoals(patient.id);
    const assignments = patientExercises(patient.id);
    const measurements = scaleMeasurements.filter(item => item.patient_id === patient.id)
      .sort((a,b) => new Date(b.measured_at) - new Date(a.measured_at));
    const openReports = clinicalReports.filter(item => item.patient_id === patient.id && item.status === "draft");
    const now = new Date();
    const upcoming = patientAppointments(patient.id)
      .filter(item => new Date(item.starts_at) > now && !["cancelled","canceled","no_show"].includes(item.status))
      .sort((a,b) => new Date(a.starts_at) - new Date(b.starts_at))[0] || null;
    const pendingExercises = assignments.filter(item =>
      ["prepared","sent","assigned"].includes(item.status) || item.patient_response_status === "shared"
    );
    const safeDate = input => {
      const date = input ? new Date(input) : null;
      return date && !Number.isNaN(date.getTime()) ? dateShort.format(date) : "Sin fecha registrada";
    };
    const list = create("div","clinic-preparation-grid clinic-preparation-unified");
    const addCard = (title,entries,wide=false) => {
      const card = create("article",wide ? "clinic-full clinic-preparation-detail" : "clinic-preparation-detail");
      card.append(create("strong","",title));
      for (const [label,value] of entries) {
        if (value === null || value === undefined || value === "") continue;
        const line = create("p","clinic-preparation-item");
        if (label) line.append(create("span","clinic-preparation-label",label + ": "));
        line.append(document.createTextNode(String(value)));
        card.append(line);
      }
      list.append(card);
      return card;
    };
    const addAction = (card,label,tab) => {
      const button = create("button","clinic-secondary clinic-preparation-action",label);
      button.type = "button";
      button.addEventListener("click",() => window.ClinicPatientWorkspace?.activate(tab));
      card.append(button);
    };

    const next = addCard("Próxima consulta",[
      ["Fecha",upcoming ? safeDate(upcoming.starts_at) + " · " + timeFormat.format(new Date(upcoming.starts_at)) : "No consta una próxima cita propia"],
      ["Situación",upcoming ? statusLabel(upcoming.status) : ""]
    ]);
    if(upcoming) {
      const action = create("button","clinic-primary clinic-preparation-action","Abrir sesión");
      action.type = "button";
      action.addEventListener("click",() => openSession(patient,upcoming));
      next.append(action);
    }
    const focus = patient.next_session_focus || last?.next_session_note || "";
    addCard("Pregunta clínica y foco de seguimiento",[
      ["Foco documentado",focus || "No consta un foco específico registrado"],
      ["Fuente",patient.next_session_focus ? "Ficha clínica" : last?.next_session_note ? "Última sesión aprobada" : ""]
    ]);

    const previous = addCard("Última sesión aprobada",last ? [
      ["Fecha",safeDate(last.session_date)],
      ["Evolución registrada",last.evolution_note || "Sin nota de evolución"],
      ["Intervención",last.intervention_note || ""],
      ["Respuesta",last.response_note || ""],
      ["Acuerdos",last.agreements_note || ""],
      ["Tarea prescrita",last.homework_note || ""]
    ] : [["Situación","No constan sesiones clínicas aprobadas"]],true);
    addAction(previous,"Consultar sesiones","sesiones");

    const goalCard = addCard("Objetivos terapéuticos activos",goals.length ?
      goals.slice(0,5).map(item => [
        item.status === "review" ? "Por revisar" : "Activo",
        item.title + (item.last_reviewed_at ? " · revisado " + safeDate(item.last_reviewed_at) : "")
      ]) : [["Registro","No constan objetivos activos"]]);
    addAction(goalCard,"Ver tratamiento","tratamiento");

    const exerciseCard = addCard("Trabajo entre sesiones",[
      ["Pendientes de envío, respuesta o revisión",String(pendingExercises.length)],
      ...pendingExercises.slice(0,3).map(item => [
        item.patient_response_status === "shared" ? "Respuesta compartida" : "Asignación",
        (item.title || "Material") + (item.review_due_at ? " · revisión prevista " + safeDate(item.review_due_at) : "")
      ])
    ]);
    addAction(exerciseCard,"Revisar ejercicios","tratamiento");

    const lastMeasurement = measurements[0];
    const scaleCard = addCard("Evaluación y medidas",lastMeasurement ? [
      ["Último instrumento",lastMeasurement.instrument || "No identificado"],
      ["Fecha",safeDate(lastMeasurement.measured_at)],
      ["Puntuación registrada",lastMeasurement.total_score === null || lastMeasurement.total_score === undefined ? "Sin puntuación numérica" : String(lastMeasurement.total_score)],
      ["Interpretación","La puntuación aislada no acredita mejoría ni empeoramiento."]
    ] : [["Registro","No constan mediciones en la ficha"]]);
    addAction(scaleCard,"Ver evaluación","evaluacion");

    const docs = addCard("Documentación en curso",[
      ["Informes pendientes de revisión",String(openReports.length)],
      ["Síntesis clínica",patient.clinical_summary ? patient.clinical_summary : "No consta una síntesis clínica"]
    ],true);
    addAction(docs,"Ver informes","documentos");

    if(profile.risk_safety) {
      const safety = addCard("Seguridad y coordinación · registro existente",[
        ["Información documentada",profile.risk_safety],
        ["Nota","Revisar vigencia y contexto. Este panel no realiza una valoración automática del riesgo."]
      ],true);
      safety.classList.add("clinic-preparation-alert");
      addAction(safety,"Abrir historia","historia");
    }
    els.preparation.append(list);
    const attribution = create("p","clinic-preparation-footnote",
      "Resumen descriptivo elaborado con los registros disponibles. No sustituye la valoración profesional ni presume que un dato anterior siga vigente.");
    els.preparation.append(attribution);
  }

  function renderSessionBrief(patient,appointment) {
    const host = document.querySelector("#clinic-session-brief");
    if(!host) return;
    host.replaceChildren();
    const heading = create("h3","","Antes de comenzar");
    host.append(heading);
    const earlier = patientSessions(patient.id).filter(item =>
      item.status === "approved" && new Date(item.session_date) < new Date(appointment.starts_at)
    )[0];
    const goals = patientGoals(patient.id);
    const assignment = patientExercises(patient.id).find(item =>
      item.patient_response_status === "shared" || ["sent","assigned","prepared"].includes(item.status)
    );
    const scale = scaleMeasurements.filter(item => item.patient_id === patient.id && new Date(item.measured_at) <= new Date(appointment.starts_at))
      .sort((a,b) => new Date(b.measured_at) - new Date(a.measured_at))[0];
    const profile = clinicalProfile(patient);
    const rows = [
      ["Foco documentado",patient.next_session_focus || earlier?.next_session_note || "No consta un foco previamente registrado"],
      ["Última sesión aprobada",earlier
        ? dateShort.format(new Date(earlier.session_date)) + " · " + (earlier.evolution_note || earlier.intervention_note || "Sin síntesis narrativa")
        : "No constan sesiones anteriores aprobadas"],
      ["Objetivos activos",goals.length ? goals.slice(0,4).map(item => item.title).join("; ") : "No constan objetivos activos"],
      ["Trabajo entre sesiones",assignment
        ? (assignment.title || "Material asignado") + (assignment.patient_response_status === "shared" ? " · respuesta compartida pendiente de revisión" : " · estado: " + assignment.status)
        : "No constan actividades pendientes"],
      ["Última medición",scale ? (scale.instrument || "Escala") + (scale.total_score === null || scale.total_score === undefined ? "" : ": " + scale.total_score) + " · " + String(scale.measured_at).slice(0,10) : "Sin mediciones registradas"]
    ];
    if(profile.risk_safety) rows.push(["Seguridad: registro previo",profile.risk_safety]);
    for (const [label,value] of rows) {
      const row = create("p","clinic-session-brief-row");
      row.append(create("strong","",label + ": "),document.createTextNode(String(value)));
      host.append(row);
    }
    host.append(create("p","clinic-session-brief-note","Resumen documental para revisar en consulta. No actualiza por sí mismo la valoración clínica."));
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
    renderSessionBrief(patient,appointment);
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
    markSessionSaved();
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

  function patientAge(birthDate) {
    if (!birthDate) return "";
    const birth = new Date(birthDate + "T00:00:00");
    if (Number.isNaN(birth.getTime())) return "";
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const beforeBirthday = now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
    if (beforeBirthday) age -= 1;
    return age >= 0 ? String(age) : "";
  }

  function fillPatientPersonalData(patient) {
    els.personalFullName.value = patient.full_name || "";
    els.personalBirthDate.value = patient.birth_date || "";
    els.personalAge.value = patientAge(patient.birth_date);
    els.personalNationalId.value = patient.national_id || "";
    els.personalPhone.value = patient.phone || "";
    els.personalEmail.value = patient.email || "";
    els.personalAddress.value = patient.address || "";
    els.personalOccupation.value = patient.occupation || "";
    els.personalMaritalStatus.value = patient.marital_status || "";
    els.personalEmergencyName.value = patient.emergency_contact_name || "";
    els.personalEmergencyPhone.value = patient.emergency_contact_phone || "";
    els.personalReferringProfessional.value = patient.referring_professional || "";
    els.personalInsurance.value = patient.insurance_provider || "";
    els.personalCareContext.value = patient.care_context || "private_practice";
    els.personalExternalProvider.value = patient.external_provider || "";
    els.personalAdminNotes.value = patient.administrative_notes || "";
  }

  function renderPatientIdentityHeader(patient) {
    els.patientName.textContent = `${patient.public_code} · ${patient.full_name}`;
    els.patientContact.replaceChildren();
    if (patient.email) els.patientContact.append(create("span", "", patient.email));
    if (patient.phone) els.patientContact.append(create("span", "", patient.phone));
    if (patient.birth_date) {
      const age = patientAge(patient.birth_date);
      els.patientContact.append(create("span", "", age ? `${dateShort.format(new Date(patient.birth_date + "T00:00:00"))} · ${age} años` : dateShort.format(new Date(patient.birth_date + "T00:00:00"))));
    }
    const latestExternalVisit = patientExternalVisits(patient.id)[0];
    if (latestExternalVisit) {
      els.patientContact.append(create("span", "", `${latestExternalVisit.external_provider} · ${externalCenterLabel(latestExternalVisit.center)} · ${latestExternalVisit.insurance_provider}`));
      els.patientContact.append(create("span", "", externalVisitWhen(latestExternalVisit)));
    }
    if (patient.care_context === "combined") els.patientContact.append(create("span", "", "Consulta propia + centro externo"));
  }

  function openPatient(patient) {
    currentPatient = patient;
    els.patientId.value = patient.id;
    fillPatientPersonalData(patient);
    renderPatientIdentityHeader(patient);
    els.summaryNote.value = patient.clinical_summary || "";
    els.nextFocus.value = patient.next_session_focus || "";
    els.medication.value = patient.medication_notes || "";
    fillClinicalProfile(patient);
    els.patientMessage.textContent = "";
    els.patientName.textContent = `${patient.public_code} · ${patient.full_name}`;
    updatePatientRecordActions(patient);
    renderPreparation(patient);
    renderTimeline(patient);
    renderDocuments(patient);
    renderScales(patient);
    renderExercises(patient);
    renderReports(patient);
    renderHistory(patient);
    showPatientPage();
    window.dispatchEvent(new CustomEvent("clinical:patient-opened", { detail: { patientId: patient.id } }));
    window.setTimeout(() => { patientFormBaseline = patientFormSnapshot(); }, 0);
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
    const includeArchived = Boolean(els.showArchived?.checked);
    const filtered = patients.filter((patient) => {
      if (patient.status === "archived" && !includeArchived) return false;
      const externalText = patientExternalVisits(patient.id)
        .map((item) => `${item.insurance_provider} ${item.external_provider} ${externalCenterLabel(item.center)} ${item.visit_date || ""} ${item.visit_time || ""}`)
        .join(" ");
      return [patient.full_name, patient.email, patient.phone, patient.national_id, patient.insurance_provider, patient.occupation, patient.referring_professional, externalText]
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
      const card = create("article", "clinic-patient-card" + (patient.status === "archived" ? " is-archived" : ""));
      const body = create("div");
      body.append(create("h3", "", patient.public_code), create("p", "", "Identidad oculta en el listado general"));
      if (patient.status === "archived") body.append(create("span", "clinic-archived-badge", "Archivado"));
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
    const [bookingRows, patientRows, externalVisitRows, sessionRows, goalRows, templateRows, assignmentRows, reportRows, documentRows, scaleRows, noticeRows] = await Promise.all([
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
      rest("clinical_document_email_notices?select=document_id,shared_at,status,sent_at,claimed_at,error_code&order=claimed_at.desc&limit=1000"),
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
    clinicalDocumentEmailNotices = noticeRows || [];
    scaleMeasurements = scaleRows || [];
    renderToday();
    renderPatients(els.patientSearch.value);
    renderPending();
    setMessage("");
  }


  function normalizePatientPhone(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return digits.length > 9 ? digits.slice(-9) : digits;
  }

  async function createManualPatient(event) {
    event.preventDefault();
    const fullName = els.newPatientName.value.trim();
    const phone = normalizePatientPhone(els.newPatientPhone.value);
    const email = els.newPatientEmail.value.trim().toLocaleLowerCase("es");
    const patientType = els.newPatientType.value || "new";
    const careContext = els.newPatientContext.value || "private_practice";

    if (!fullName) {
      els.newPatientMessage.textContent = "Indica el nombre y apellidos.";
      return;
    }
    if (phone && phone.length !== 9) {
      els.newPatientMessage.textContent = "El teléfono debe tener 9 cifras.";
      return;
    }

    els.newPatientMessage.textContent = "Comprobando si ya existe…";
    els.newPatientSave.disabled = true;

    try {
      let duplicate = null;
      if (phone) {
        const rows = await rest("clinical_patients?select=id,public_code,full_name,email,phone&phone=eq." + encodeURIComponent(phone) + "&limit=1");
        duplicate = rows?.[0] || null;
      }
      if (!duplicate && email) {
        const rows = await rest("clinical_patients?select=id,public_code,full_name,email,phone&email=eq." + encodeURIComponent(email) + "&limit=1");
        duplicate = rows?.[0] || null;
      }

      if (duplicate) {
        els.newPatientMessage.textContent = "Ya existe una ficha: " + duplicate.full_name + " · " + duplicate.public_code + ".";
        return;
      }

      const identityKey = phone
        ? "phone:" + phone
        : email
          ? "email:" + email
          : "manual:" + (globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2));

      els.newPatientMessage.textContent = "Creando ficha…";
      const rows = await rest("clinical_patients?select=*", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          identity_key: identityKey,
          full_name: fullName,
          phone: phone || null,
          email: email || null,
          patient_type: patientType,
          status: "active",
          care_context: careContext,
          external_provider: careContext === "private_practice" ? null : "Creu Blava",
          clinical_profile: {}
        })
      });

      const created = rows?.[0];
      if (!created) throw new Error("No se ha podido recuperar la ficha creada.");

      patients = [...patients, created].sort((a, b) => a.full_name.localeCompare(b.full_name, "es"));
      renderPatients(els.patientSearch.value);
      els.newPatientDialog.close();
      els.newPatientForm.reset();
      els.newPatientMessage.textContent = "";
      currentPatient = created;
      openPatient(created);
    } catch (error) {
      els.newPatientMessage.textContent = error?.message || "No se ha podido crear la ficha.";
    } finally {
      els.newPatientSave.disabled = false;
    }
  }

  async function savePatient(event) {
    event.preventDefault();
    els.patientMessage.textContent = "Guardando…";
    const rows = await rest(`clinical_patients?id=eq.${encodeURIComponent(els.patientId.value)}&select=*`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        full_name: els.personalFullName.value.trim(),
        birth_date: els.personalBirthDate.value || null,
        national_id: els.personalNationalId.value.trim() || null,
        phone: normalizePatientPhone(els.personalPhone.value) || null,
        email: els.personalEmail.value.trim().toLocaleLowerCase("es") || null,
        address: els.personalAddress.value.trim() || null,
        occupation: els.personalOccupation.value.trim() || null,
        marital_status: els.personalMaritalStatus.value.trim() || null,
        emergency_contact_name: els.personalEmergencyName.value.trim() || null,
        emergency_contact_phone: els.personalEmergencyPhone.value.trim() || null,
        referring_professional: els.personalReferringProfessional.value.trim() || null,
        insurance_provider: els.personalInsurance.value.trim() || null,
        care_context: els.personalCareContext.value || "private_practice",
        external_provider: els.personalExternalProvider.value.trim() || null,
        administrative_notes: els.personalAdminNotes.value.trim() || null,
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
      fillPatientPersonalData(updated);
      renderPatientIdentityHeader(updated);
      fillClinicalProfile(updated);
      renderPreparation(updated);
      renderTimeline(updated);
      renderPatients(els.patientSearch.value);
    }
    els.patientMessage.textContent = "Ficha completa guardada.";
    patientFormBaseline = patientFormSnapshot();
    updatePatientSaveState();
  }

  async function togglePatientArchive() {
    if (!currentPatient) return;
    const archived = currentPatient.status === "archived";
    const nextStatus = archived ? "active" : "archived";
    if (!archived && !window.confirm("¿Archivar esta ficha? El historial se conservará y dejará de aparecer en la lista activa.")) return;
    els.patientMessage.textContent = archived ? "Restaurando ficha…" : "Archivando ficha…";
    const rows = await rest(`clinical_patients?id=eq.${encodeURIComponent(currentPatient.id)}&select=*`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: nextStatus, updated_at: new Date().toISOString() })
    });
    const updated = rows?.[0];
    if (!updated) throw new Error("No se ha podido actualizar el estado de la ficha.");
    patients = patients.map((patient) => patient.id === updated.id ? updated : patient);
    currentPatient = updated;
    updatePatientRecordActions(updated);
    renderPatients(els.patientSearch.value);
    els.patientMessage.textContent = archived ? "Ficha restaurada." : "Ficha archivada.";
    if (!archived && !els.showArchived?.checked) window.setTimeout(() => closePatientPage({ force: true }), 350);
  }

  async function deletePatientCreatedByError() {
    if (!currentPatient) return;
    if (patientHasClinicalActivity(currentPatient)) {
      throw new Error("Esta ficha ya contiene información clínica y no puede eliminarse. Puedes archivarla.");
    }
    els.patientMessage.textContent = "Comprobando que la ficha esté vacía…";
    const patientId = encodeURIComponent(currentPatient.id);
    const [consents, tasks, mergeArchive] = await Promise.all([
      rest(`clinical_patient_consents?patient_id=eq.${patientId}&select=id&limit=1`),
      rest(`clinical_admin_tasks?patient_id=eq.${patientId}&select=id&limit=1`),
      rest(`clinical_patient_merge_archive?kept_patient_id=eq.${patientId}&select=id&limit=1`)
    ]);
    if (consents?.length || tasks?.length || mergeArchive?.length) {
      throw new Error("Esta ficha tiene información relacionada y no puede eliminarse. Puedes archivarla.");
    }
    const confirmation = window.prompt("Esta acción elimina definitivamente la ficha. Escribe ELIMINAR para confirmar.");
    if (confirmation !== "ELIMINAR") {
      els.patientMessage.textContent = "Eliminación cancelada.";
      return;
    }
    els.patientMessage.textContent = "Eliminando ficha…";
    try {
      await rest(`clinical_patients?id=eq.${encodeURIComponent(currentPatient.id)}`, { method: "DELETE" });
    } catch (error) {
      throw new Error("No se ha podido eliminar la ficha. Si tiene actividad clínica relacionada, archívala en su lugar.");
    }
    const deletedId = currentPatient.id;
    patients = patients.filter((patient) => patient.id !== deletedId);
    currentPatient = null;
    closePatientPage({ force: true });
    renderPatients(els.patientSearch.value);
    setMessage("Ficha creada por error eliminada.");
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

  async function persistClinicalSession(status, { auto = false } = {}) {
    if (sessionSaveActive) { sessionSavePending = true; if (!auto) throw new Error("Se está guardando el borrador; inténtalo de nuevo en unos segundos."); return; }
    if (auto && (!els.sessionDialog.open || els.saveDraft.disabled || sessionFormSnapshot() === sessionFormBaseline)) return;
    const savingSnapshot = sessionFormSnapshot();
    sessionSaveActive = true;
    let savedSuccessfully = false;
    try {
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
    savedSuccessfully = true;
    clinicalSessions = [...clinicalSessions.filter((item) => item.id !== saved.id), saved];
    els.sessionId.value = saved.id;
    els.sessionMessage.textContent = status === "approved" ? "Registro aprobado y cerrado." : (auto ? "" : "Borrador guardado.");
    if (sessionFormSnapshot() === savingSnapshot) markSessionSaved();
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
    } finally {
      sessionSaveActive = false;
      const needsSaving = savedSuccessfully && (sessionSavePending || (auto && els.sessionDialog.open && sessionFormSnapshot() !== sessionFormBaseline));
      sessionSavePending = false;
      if (needsSaving && els.sessionDialog.open && !els.saveDraft.disabled) scheduleSessionAutoSave();
    }
  }

  function setView(name) {
    els.todayView.hidden = name !== "today";
    els.patientsView.hidden = name !== "patients";
    els.pendingView.hidden = name !== "pending";
    els.viewToday.classList.toggle("active", name === "today");
    els.viewPatients.classList.toggle("active", name === "patients");
    els.viewPending.classList.toggle("active", name === "pending");
    [[els.viewToday, "today"], [els.viewPatients, "patients"], [els.viewPending, "pending"]].forEach(([button, key]) => {
      if (name === key) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    document.querySelector(".clinic-more-menu")?.removeAttribute("open");
    if (name === "patients") els.patientSearch.focus();
  }

  els.logout.addEventListener("click", () => { saveSession(null); window.location.assign("/admin/clinica/acceso/?next=%2Fadmin%2F"); });
  els.refresh.addEventListener("click", () => loadData().catch((error) => setMessage(error.message)));
  els.viewToday.addEventListener("click", () => setView("today"));
  els.viewPatients.addEventListener("click", () => setView("patients"));
  els.viewPending.addEventListener("click", () => setView("pending"));
  els.patientSearch.addEventListener("input", () => renderPatients(els.patientSearch.value));
  els.newPatient?.addEventListener("click", () => {
    els.newPatientForm.reset();
    els.newPatientMessage.textContent = "";
    els.newPatientDialog.showModal();
    setTimeout(() => els.newPatientName?.focus(), 0);
  });
  els.newPatientClose?.addEventListener("click", () => els.newPatientDialog.close());
  els.newPatientCancel?.addEventListener("click", () => els.newPatientDialog.close());
  els.newPatientForm?.addEventListener("submit", (event) => createManualPatient(event));

  window.addEventListener("clinical:patient-updated", (event) => {
    const updated = event?.detail?.patient;
    if (!updated?.id) return;
    patients = patients.map((patient) => patient.id === updated.id ? updated : patient);
    if (currentPatient?.id === updated.id) {
      currentPatient = updated;
      window.setTimeout(() => { patientFormBaseline = patientFormSnapshot(); }, 0);
    }
    renderPatients(els.patientSearch.value);
  });

  els.showArchived?.addEventListener("change", () => renderPatients(els.patientSearch.value));
  els.archivePatient?.addEventListener("click", () => togglePatientArchive().catch((error) => { els.patientMessage.textContent = error.message; }));
  els.deletePatient?.addEventListener("click", () => deletePatientCreatedByError().catch((error) => { els.patientMessage.textContent = error.message; }));
  els.patientClose.addEventListener("click", () => closePatientPage());
  els.personalBirthDate?.addEventListener("change", () => { els.personalAge.value = patientAge(els.personalBirthDate.value); });
  els.patientForm.addEventListener("submit", (event) => savePatient(event).catch((error) => { els.patientMessage.textContent = error.message; }));
  els.patientForm.addEventListener("input", updatePatientSaveState);
  els.patientForm.addEventListener("change", updatePatientSaveState);
  window.addEventListener("beforeunload", event => {
    const patientUnsaved = !els.patientDialog.hidden && patientFormBaseline && patientFormSnapshot() !== patientFormBaseline;
    const reportUnsaved = els.reportDialog.open && (reportDirty || reportSaveActive);
    const sessionUnsaved = els.sessionDialog.open && (sessionSaveActive || sessionFormBaseline && sessionFormSnapshot() !== sessionFormBaseline);
    if (patientUnsaved || reportUnsaved || sessionUnsaved) { event.preventDefault(); event.returnValue = ""; }
  });
  els.sessionClose.addEventListener("click", () => closeSessionEditor());
  els.sessionDialog.addEventListener("cancel", event => { event.preventDefault(); closeSessionEditor(); });
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
  els.reportClose.addEventListener("click", () => closeReportEditor());
  els.reportDialog.addEventListener("cancel", event => { event.preventDefault(); closeReportEditor(); });
  els.reportForm.addEventListener("input", (event) => { if (event.target.matches("input,textarea,select")) scheduleReportAutoSave(); });
  els.reportForm.addEventListener("change", (event) => { if (event.target.matches("input,textarea,select")) scheduleReportAutoSave(); });
  els.reportType.addEventListener("change", () => { els.reportTitlePreview.textContent = reportTypeLabel(els.reportType.value); healthReportInputs(); healthReportSelected(); scheduleReportAutoSave(); });
  els.generateReport.addEventListener("click", () => { try { if (!els.reportId.value && !reportHasContent()) { generateReportDraft(); scheduleReportAutoSave(); } downloadHealthReportWord(); } catch (error) { els.reportMessage.textContent = error.message; } });
  els.saveReport.addEventListener("click", () => { if (reportSaveActive) { els.reportMessage.textContent = "Se está guardando el informe. Espera a la confirmación."; return; } if (healthReportSelected() && !reportHasContent()) generateReportDraft(); if (healthReportSelected() && !els.reportPurpose.value.trim()) { els.reportMessage.textContent = "Indica la finalidad del informe antes de guardarlo."; return; } persistReport("draft").then(() => { if (healthReportSelected()) els.reportMessage.textContent = "Borrador guardado en la historia clínica. La edición posterior del Word descargado no se sincroniza automáticamente."; }).catch((error) => { els.reportMessage.textContent = error.message; }); });
  els.approveReport.addEventListener("click", () => persistReport("approved").catch((error) => { els.reportMessage.textContent = error.message; }));
  $("#clinic-upload-revised-word")?.addEventListener("click", () => {
    if (!currentPatient) return;
    if (!closeReportEditor()) return;
    els.documentForm.reset();
    els.documentTitle.value = reportTypeLabel(els.reportType.value) + " · Word revisado";
    els.documentCategory.value = "other";
    els.documentDate.value = todayKey();
    els.documentNotes.value = "Versión Word revisada externamente. Comprobar identificación, contenido clínico y estado de firma antes de su uso.";
    els.documentMessage.textContent = "Selecciona el archivo .docx revisado. Se guardará en el almacenamiento privado de este paciente.";
    els.documentDialog.showModal();
  });

  window.ClinicReportPreparePrint = () => { if (!els.reportId.value && !reportHasContent()) generateReportDraft(); };
  els.printReport.addEventListener("click", () => { try { window.ClinicReportPreparePrint(); printCurrentReport(); } catch (error) { els.reportMessage.textContent = error.message; } });
  els.newExercise.addEventListener("click", () => openExercise());
  els.exerciseLibrary?.addEventListener("change", () => {
    const template = exerciseTemplates.find((item) => item.id === els.exerciseLibrary.value) || null;
    applyExerciseTemplate(template);
    if (template) {
      els.exerciseRationale.value = template.summary || "";
      const document = normalizedPatientDocument(template);
      if (!document.example) {
        els.exerciseMessage.textContent = "Este material todavía no tiene un ejemplo trabajado. Puedes usar «Completar ficha con IA», revisarlo y actualizar la biblioteca.";
      } else {
        els.exerciseMessage.textContent = "";
      }
    }
  });
  window.addEventListener("clinic-neuro-load-starter", (event) => {
    const draft = event.detail || {};
    if (!currentPatient) {
      if (els.exerciseMessage) els.exerciseMessage.textContent = "Selecciona primero un paciente para preparar el material.";
      return;
    }
    if (!draft.patient_document || !draft.title || !draft.domain) return;
    if (!els.exerciseDialog.open) openExercise();
    pendingAiMaterial = null;
    applyExerciseTemplate(null);
    const doc = { ...draft.patient_document, visual_blocks: Array.isArray(draft.patient_document.visual_blocks) ? draft.patient_document.visual_blocks : [] };
    if (els.materialType) els.materialType.value = "exercise";
    els.exerciseTemplateId.value = "";
    els.exerciseTitle.value = draft.title;
    els.exerciseContent.value = doc.instructions || "";
    fillPatientDocument(doc);
    const process = draft.domain;
    populateMaterialProcessOptions(process);
    if (els.materialProcess && !Array.from(els.materialProcess.options).some(option => option.value === process)) {
      const option = document.createElement("option");
      option.value = process;
      option.textContent = "Neuropsicología · " + process.replaceAll("_", " ");
      els.materialProcess.append(option);
      els.materialProcess.value = process;
    }
    els.exerciseRationale.value = "Borrador inicial " + (draft.code || "") +
      ". Revisión profesional: " + (draft.caution || "Comprobar adecuación y estímulos.") +
      " Registro: " + (draft.record || "") +
      (draft.professional_answer_key ? "\n\nUSO PROFESIONAL EXCLUSIVO · SOLUCIONES Y CRITERIOS (NO EN EL CUADERNO DEL PACIENTE)\n" + String(draft.professional_answer_key).slice(0,16000) : "");
    if (els.materialSearch) els.materialSearch.value = "";
    els.exerciseMessage.textContent = "Propuesta cargada. Antes de enviar revisa materiales, fechas, consignas, nivel de ayuda y el objetivo funcional. No está validada ni prescrita.";
  });

  els.materialSearch?.addEventListener("input", () => {
    populateExerciseLibrary("", els.materialSearch.value);
    if(els.materialAiCreate)els.materialAiCreate.disabled=!els.materialSearch.value.trim();
  });
  els.materialUseSearch?.addEventListener("click", () => {
    const value = els.materialSearch?.value?.trim() || "";
    if (!value) return;
    pendingAiMaterial = null;
    applyExerciseTemplate(null);
    els.exerciseTitle.value = value;
    els.exerciseContent.focus();
  });
  els.materialAiCreate?.addEventListener("click", async () => {
    const query = els.materialSearch?.value?.trim() || "";
    if (!query) return;

    const value = getSession();
    if (!value?.access_token) {
      els.exerciseMessage.textContent = "La sesión ha caducado. Vuelve a entrar en Gestión clínica.";
      return;
    }

    els.exerciseMessage.textContent = "Comprobando la biblioteca y preparando una propuesta…";
    els.materialAiCreate.disabled = true;

    try {
      const catalog = exerciseTemplates.map((template) => ({
        id: template.id,
        title: template.title,
        summary: template.summary || "",
        process_tags: template.process_tags || [],
        material_type: template.material_type || "exercise"
      }));

      const response = await fetch("/api/clinical/material-draft", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + value.access_token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
          case_context: els.exerciseRationale.value.trim(),
          preferred_type: els.materialType?.value || "",
          preferred_process: els.materialProcess?.value || "",
          clinical_area: window.ClinicNeuroMaterials?.read?.().clinical_area || "psychology",
          neuro_profile: window.ClinicNeuroMaterials?.read?.().neuro_profile || null,
          catalog
        })
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "No se ha podido comprobar la biblioteca.");

      if (body.status === "existing" && body.existing_id) {
        const existing = exerciseTemplates.find((template) => template.id === body.existing_id);
        if (existing) {
          if (els.materialSearch) els.materialSearch.value = "";
          populateExerciseLibrary(existing.id);
          populateMaterialProcessOptions((existing.process_tags || [])[0] || "");
          if (els.materialType) els.materialType.value = existing.material_type || "exercise";
          applyExerciseTemplate(existing);
          els.exerciseRationale.value = existing.summary || body.reason || "";
          els.exerciseMessage.textContent = "Ya existe un material equivalente: " + existing.title;
          return;
        }
      }

      const material = body.material || {};
      pendingAiMaterial = material;
      els.exerciseTitle.value = material.title || query;
      if (els.materialType) els.materialType.value = material.material_type || "exercise";
      const aiPatientDocument = material.patient_document && typeof material.patient_document === "object" && !Array.isArray(material.patient_document)
        ? { ...materialPatientDefaults(material.material_type || "exercise", material.summary || "", material.instructions || "", material.duration_minutes), ...material.patient_document, frequency: material.patient_document.frequency || materialPatientDefaults(material.material_type || "exercise", material.summary || "", material.instructions || "", material.duration_minutes).frequency, instructions: material.patient_document.instructions || material.instructions || "" }
        : materialPatientDefaults(material.material_type || "exercise", material.summary || "", material.instructions || "", material.duration_minutes);
      els.exerciseContent.value = aiPatientDocument.instructions || material.instructions || "";
      fillPatientDocument(aiPatientDocument);
      els.exerciseRationale.value = material.summary || body.reason || "";

      const process = (material.process_tags || [])[0] || "";
      populateMaterialProcessOptions(process);
      if (process && els.materialProcess && !Array.from(els.materialProcess.options).some((option) => option.value === process)) {
        const option = document.createElement("option");
        option.value = process;
        option.textContent = process;
        els.materialProcess.append(option);
        els.materialProcess.value = process;
      }

      els.exerciseMessage.textContent = "No estaba en la biblioteca. La IA ha preparado una propuesta. Revísala y pulsa «Añadir a la biblioteca» para incorporarla.";
      els.exerciseContent.focus();
    } catch (error) {
      els.exerciseMessage.textContent = error?.message || "No se ha podido generar la propuesta.";
    } finally {
      els.materialAiCreate.disabled = false;
    }
  });
  [els.exerciseDuration, els.exerciseFrequency, els.exerciseIntroduction, els.exerciseWhy, els.exerciseObjective, els.exerciseContent, els.exerciseExample, els.exerciseRecord, els.exerciseSafety, els.exerciseRemember, els.exerciseSessionQuestions]
    .filter(Boolean)
    .forEach((field) => field.addEventListener("input", () => renderPatientDocumentQuality()));

  els.materialAiEnrich?.addEventListener("click", async () => {
    const title = els.exerciseTitle.value.trim();
    if (!title || !els.exerciseContent.value.trim()) {
      els.exerciseMessage.textContent = "Selecciona o prepara un material antes de completar la ficha con IA.";
      return;
    }
    const value = getSession();
    if (!value?.access_token) {
      els.exerciseMessage.textContent = "La sesión ha caducado. Vuelve a entrar en Gestión clínica.";
      return;
    }

    const existing = exerciseTemplates.find((item) => item.id === els.exerciseTemplateId.value) || null;
    els.exerciseMessage.textContent = window.ClinicNeuroMaterials?.read?.().clinical_area === "neuropsychology"
      ? "Preparando una semana de actividades neuropsicológicas detalladas…"
      : "Preparando cuaderno personalizado para dos semanas…";
    els.materialAiEnrich.disabled = true;
    try {
      const response = await fetch("/api/clinical/material-enrich", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + value.access_token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          case_context: els.exerciseRationale.value.trim(),
          material_type: els.materialType?.value || existing?.material_type || "exercise",
          summary: existing?.summary || pendingAiMaterial?.summary || els.exerciseObjective.value.trim(),
          process_tags: els.materialProcess?.value ? [els.materialProcess.value] : (existing?.process_tags || []),
          patient_document: (() => { const doc = patientDocumentFromForm(els.materialType?.value || existing?.material_type || "exercise"); return { ...doc, visual_blocks: (doc.visual_blocks || []).filter(b => b.type !== "image").map(({ data, ...rest }) => rest) }; })()
        })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "No se ha podido completar la ficha.");
      const current = patientDocumentFromForm(els.materialType?.value || "exercise");
      const document = body.patient_document || {};
      const preservedImages = (current.visual_blocks || []).filter(block => block.type === "image");
      const generatedVisuals = Array.isArray(document.visual_blocks) ? document.visual_blocks : (current.visual_blocks || []).filter(block => block.type !== "image");
      const mergedDocument = { ...current, ...document, visual_blocks: [...preservedImages, ...generatedVisuals].slice(0, 8) };
      fillPatientDocument(mergedDocument);
      els.exerciseContent.value = mergedDocument.instructions || els.exerciseContent.value;
      els.exerciseMessage.textContent = existing
        ? "Ficha completada. Revísala y pulsa «Actualizar biblioteca» si quieres conservar esta versión."
        : "Ficha completada. Revísala antes de añadirla a la biblioteca o enviarla.";
    } catch (error) {
      els.exerciseMessage.textContent = error?.message || "No se ha podido completar la ficha con IA.";
    } finally {
      els.materialAiEnrich.disabled = false;
    }
  });

  els.addMaterialLibrary?.addEventListener("click", async () => {
    const title = els.exerciseTitle.value.trim();
    const content = els.exerciseContent.value.trim();
    const process = els.materialProcess?.value || "";
    const materialType = els.materialType?.value || "exercise";
    const existing = exerciseTemplates.find((item) => item.id === els.exerciseTemplateId.value) || null;
    const neuroCheck = window.ClinicNeuroMaterials?.validate?.(patientDocumentFromForm(materialType));
    if (neuroCheck && !neuroCheck.ok) { els.exerciseMessage.textContent = "Revisa la ficha: " + neuroCheck.issues.join("; "); return; }
    if (window.ClinicNeuroMaterials?.read?.().clinical_area === "neuropsychology" && !document.getElementById("clinic-neuro-reviewed")?.checked) {
      els.exerciseMessage.textContent = "Confirma la revisión profesional antes de incorporar la actividad neuropsicológica a la biblioteca.";
      return;
    }
    if (!title || !content || !process) {
      els.exerciseMessage.textContent = "Para guardar el material indica título, contenido y categoría.";
      return;
    }
    if (!els.exerciseIntroduction.value.trim() || !els.exerciseWhy.value.trim()) {
      els.exerciseMessage.textContent = "Completa la introducción y «Por qué hacemos este ejercicio» antes de guardarlo.";
      return;
    }

    const duration = Number(els.exerciseDuration.value);
    const payload = {
      title,
      summary: existing?.summary || pendingAiMaterial?.summary || els.exerciseObjective.value.trim() || "Material de la biblioteca clínica.",
      instructions: content,
      process_tags: [process],
      duration_minutes: Number.isFinite(duration) && duration > 0 ? Math.min(180, Math.round(duration)) : existing?.duration_minutes || (materialType === "psychoeducation" ? 10 : null),
      burden: ["low", "medium", "high"].includes(pendingAiMaterial?.burden)
        ? pendingAiMaterial.burden
        : existing?.burden || "low",
      status: "active",
      material_type: materialType,
      phase: pendingAiMaterial?.phase || existing?.phase || (materialType === "psychoeducation" ? "orientation" : "practice"),
      objectives: Array.isArray(pendingAiMaterial?.objectives) && pendingAiMaterial.objectives.length
        ? pendingAiMaterial.objectives
        : els.exerciseObjective.value.trim() ? [els.exerciseObjective.value.trim()] : (existing?.objectives || []),
      cautions: Array.isArray(pendingAiMaterial?.cautions) ? pendingAiMaterial.cautions : (existing?.cautions || []),
      sequence_rank: Number.isFinite(Number(pendingAiMaterial?.sequence_rank))
        ? Number(pendingAiMaterial.sequence_rank)
        : Number(existing?.sequence_rank || 50),
      patient_document: patientDocumentFromForm(materialType),
      patient_facing: true,
      updated_at: new Date().toISOString()
    };

    els.exerciseMessage.textContent = existing ? "Actualizando biblioteca…" : "Añadiendo a la biblioteca…";
    els.addMaterialLibrary.disabled = true;
    try {
      const rows = existing
        ? await rest(`clinical_exercise_templates?id=eq.${encodeURIComponent(existing.id)}&select=*`, {
            method: "PATCH",
            headers: { Prefer: "return=representation" },
            body: JSON.stringify(payload)
          })
        : await rest("clinical_exercise_templates?select=*", {
            method: "POST",
            headers: { Prefer: "return=representation" },
            body: JSON.stringify(payload)
          });
      const saved = rows?.[0];
      if (!saved) throw new Error("No se ha podido recuperar el material guardado.");
      exerciseTemplates = existing
        ? exerciseTemplates.map((item) => item.id === saved.id ? saved : item)
        : [...exerciseTemplates, saved];
      pendingAiMaterial = null;
      if (els.materialSearch) els.materialSearch.value = "";
      populateExerciseLibrary(saved.id);
      populateMaterialProcessOptions(process);
      applyExerciseTemplate(saved);
      els.exerciseMessage.textContent = existing
        ? "Biblioteca actualizada. La nueva versión queda lista para futuras asignaciones."
        : "Añadido a la biblioteca. Ya puedes asignarlo o enviarlo.";
    } catch (error) {
      els.exerciseMessage.textContent = error?.message || "No se ha podido guardar el material.";
    } finally {
      els.addMaterialLibrary.disabled = false;
    }
  });

  els.previewMaterial?.addEventListener("click", () => {
    const title = els.exerciseTitle.value.trim();
    if (!title || !els.exerciseContent.value.trim()) {
      els.exerciseMessage.textContent = "Completa al menos el título y el contenido para ver la vista del paciente.";
      return;
    }
    openPatientMaterialPreview(title, patientDocumentFromForm(els.materialType?.value || "exercise"), "html", false)
      .catch((error) => { els.exerciseMessage.textContent = error.message; });
  });

  els.previewPdf?.addEventListener("click", () => {
    const title = els.exerciseTitle.value.trim();
    if (!title || !els.exerciseContent.value.trim()) {
      els.exerciseMessage.textContent = "Completa al menos el título y el contenido para generar el PDF de prueba.";
      return;
    }
    openPatientMaterialPreview(title, patientDocumentFromForm(els.materialType?.value || "exercise"), "pdf", true)
      .catch((error) => { els.exerciseMessage.textContent = error.message; });
  });

  els.exerciseClose.addEventListener("click", () => els.exerciseDialog.close());
  els.saveExercise.addEventListener("click", () => saveExercise(false).catch((error) => { els.exerciseMessage.textContent = error.message; }));
  els.exerciseForm.addEventListener("submit", (event) => { event.preventDefault(); saveExercise(true).catch((error) => { els.exerciseMessage.textContent = error.message; }); });
  els.generateDraft.addEventListener("click", () => { generateStructuredDraft(); scheduleSessionAutoSave(); });
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
  els.sessionForm.addEventListener("input", event => { if (event.target.matches("input,textarea,select")) scheduleSessionAutoSave(); });
  els.sessionForm.addEventListener("change", event => { if (event.target.matches("input,textarea,select")) scheduleSessionAutoSave(); });
  els.sessionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    persistClinicalSession("approved").catch((error) => { els.sessionMessage.textContent = error.message; });
  });
  [els.newPatientDialog, els.exerciseDialog, els.documentDialog, els.scaleDialog].filter(Boolean).forEach((dialog) => dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  }));

  (async function init() {
    els.date.textContent = dateLong.format(new Date());
    session = getSession();
    const user = await fetchCurrentUser();
    if (!user) {
      saveSession(null);
      window.location.replace("/admin/clinica/acceso/?next=%2Fadmin%2F");
      return;
    }
    showApp();
    const requestedView = new URL(window.location.href).searchParams.get("view");
    if (["today", "patients", "pending"].includes(requestedView)) setView(requestedView);
    loadData().catch((error) => setMessage(error.message));
  })();
})();
