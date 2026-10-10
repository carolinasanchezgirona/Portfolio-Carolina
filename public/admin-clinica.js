(() => {
  "use strict";
  if (window.location.pathname.startsWith("/admin/clinica/acceso")) return;

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
    exerciseRationale: $("#clinic-exercise-rationale"), exerciseEmail: $("#clinic-exercise-email"),
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
  function showLogin() { window.location.replace("/admin/clinica/acceso/?next=%2Fadmin%2Fclinica%2F%3Fpanel%3D1"); }
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
    if (!els.sessionDialog.open || els.saveDraft.disabled || !els.sessionPatientId.value) return;
    const state = document.querySelector("#clinic-session-autosave-state");
    window.clearTimeout(sessionSaveTimer);
    if (sessionFormSnapshot() === sessionFormBaseline) {
      if (state) state.textContent = "Sin cambios pendientes";
      return;
    }
    if (state) state.textContent = "Cambios pendientes · guardado automático en 5 segundos";
    sessionSaveTimer = window.setTimeout(() => persistClinicalSession("draft", { auto: true }).catch(err => {
      if (state) state.textContent = "No se ha podido guardar: " + err.message;
    }), 5000);
  }
  function closeSessionEditor() {
    if (!els.sessionDialog.open) return true;
    if (sessionSaveActive) { els.sessionMessage.textContent = "Se está guardando el borrador. Espera a que finalice."; return false; }
    if (sessionFormBaseline && sessionFormSnapshot() !== sessionFormBaseline && !window.confirm("Hay notas de esta sesión sin guardar. ¿Quieres cerrarla y descartarlas?")) return false;
    window.clearTimeout(sessionSaveTimer);
    if (isDictating) speechRecognition?.stop();
    els.sessionDialog.close();
    return true;
  }
  function patientFormSnapshot() {
    if (!els.patientForm) return "";
    return JSON.stringify([...els.patientForm.querySelectorAll("input, textarea, select")]
      .filter((node) => !["button","submit","reset","file"].includes(String(node.type || "").toLowerCase()) && !node.closest("#clinic-consent-grid,.clinic-goals-manager,.clinic-task-box,.clinic-scale-trends,.neuro-followup"))
      .map((node) => ({
        id: node.id || "",
        value: node.type === "checkbox" || node.type === "radio" ? Boolean(node.checked) : String(node.value || "")
      })));
  }

  function showPatientPage() {
    patientPageReturnScroll = window.scrollY || 0;
    if (els.app) els.app.hidden = true;
    if (els.patientDialog) els.patientDialog.hidden = false;
    document.body.classList.add("clinic-patient-page-open");
    window.scrollTo({ top: 0, behavior: "auto" });
    window.setTimeout(() => { patientFormBaseline = patientFormSnapshot(); updatePatientSaveState(); }, 0);
  }

  function closePatientPage({ force = false } = {}) {
    if (!els.patientDialog || els.patientDialog.hidden) return true;
    if (els.reportDialog?.open && !closeReportEditor({ force })) return false;
    const changed = patientFormBaseline && patientFormSnapshot() !== patientFormBaseline;
    if (!force && changed) {
      const leave = window.confirm("Hay cambios sin guardar en esta ficha. ¿Quieres volver a pacientes y descartarlos?");
      if (!leave) return false;
    }
    els.patientDialog.hidden = true;
    if (els.app) els.app.hidden = false;
    document.body.classList.remove("clinic-patient-page-open");
    patientFormBaseline = "";
    window.setTimeout(() => window.scrollTo({ top: patientPageReturnScroll, behavior: "auto" }), 0);
    return true;
  }

  function updatePatientSaveState() {
    const badge = document.querySelector("#clinic-patient-save-state");
    if (!badge || !els.patientDialog || els.patientDialog.hidden) return;
    badge.textContent = patientFormBaseline && patientFormSnapshot() !== patientFormBaseline ? "Cambios en ficha sin guardar" : "Ficha guardada";
  }
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
  function patientHasClinicalActivity(patient) {
    if (!patient) return false;
    const profile = patient.clinical_profile && typeof patient.clinical_profile === "object" ? patient.clinical_profile : {};
    const profileHasContent = Object.values(profile).some((value) => {
      if (typeof value === "string") return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      if (value && typeof value === "object") return Object.keys(value).length > 0;
      return Boolean(value);
    });
    return Boolean(
      patientSessions(patient.id).length ||
      patientExternalVisits(patient.id).length ||
      clinicalGoals.some((item) => item.patient_id === patient.id) ||
      exerciseAssignments.some((item) => item.patient_id === patient.id) ||
      clinicalReports.some((item) => item.patient_id === patient.id) ||
      clinicalDocuments.some((item) => item.patient_id === patient.id) ||
      scaleMeasurements.some((item) => item.patient_id === patient.id) ||
      String(patient.clinical_summary || "").trim() ||
      String(patient.next_session_focus || "").trim() ||
      String(patient.medication_notes || "").trim() ||
      profileHasContent
    );
  }

  function updatePatientRecordActions(patient) {
    if (els.archivePatient) {
      const archived = patient?.status === "archived";
      els.archivePatient.textContent = archived ? "Restaurar ficha" : "Archivar ficha";
      els.archivePatient.title = archived
        ? "Volver a mostrar esta ficha entre los pacientes activos."
        : "Ocultar la ficha de la lista activa conservando su historial.";
    }
    if (els.deletePatient) {
      const canDelete = Boolean(patient) && !patientHasClinicalActivity(patient);
      els.deletePatient.disabled = false;
      els.deletePatient.textContent = "Eliminar paciente";
      els.deletePatient.title = canDelete
        ? "Eliminar definitivamente una ficha creada por error y sin contenido clínico."
        : "Esta ficha contiene actividad clínica. Al pulsar se explicará por qué debe archivarse en lugar de eliminarse.";
      if (els.deletePatientNote) {
        els.deletePatientNote.textContent = canDelete
          ? "Esta ficha no contiene actividad clínica registrada y puede eliminarse si fue creada por error."
          : "Esta ficha contiene actividad clínica. Por seguridad, no se elimina desde aquí: puedes archivarla y conservar el historial.";
      }
    }
  }

  function prescriptionSuggestions(patientId) {
    const latest = patientSessions(patientId)[0];
    const patient = patientById(patientId);
    const markerSet = new Set(latest?.process_markers || []);
    const profileText = [
      patient?.clinical_summary,
      patient?.next_session_focus,
      patient?.medication_notes,
      ...Object.values(patient?.clinical_profile || {}).filter((value) => typeof value === "string"),
    ].filter(Boolean).join(" ").toLocaleLowerCase("es");

    const assignments = patientExercises(patientId);
    const templateById = new Map(exerciseTemplates.map((template) => [template.id, template]));
    const processHistory = new Map();

    assignments.forEach((assignment) => {
      const template = templateById.get(assignment.template_id);
      if (!template) return;
      (template.process_tags || []).forEach((tag) => {
        const current = processHistory.get(tag) || { total: 0, reviewed: 0 };
        current.total += 1;
        if (["reviewed", "closed"].includes(assignment.status)) current.reviewed += 1;
        processHistory.set(tag, current);
      });
    });

    return exerciseTemplates
      .map((template) => {
        const tags = template.process_tags || [];
        const matches = tags.filter((tag) => markerSet.has(tag) || profileText.includes(String(tag).toLocaleLowerCase("es")));
        if (!matches.length) return null;

        const priorSame = assignments.filter((item) => item.template_id === template.id);
        const alreadyActive = priorSame.some((item) => ["prepared", "assigned", "sent"].includes(item.status));
        if (alreadyActive) return null;

        const history = matches.reduce((sum, tag) => {
          const item = processHistory.get(tag);
          return sum + (item?.total || 0);
        }, 0);
        const reviewed = matches.reduce((sum, tag) => sum + (processHistory.get(tag)?.reviewed || 0), 0);

        let score = matches.length * 100;
        const reasons = ["Encaja con " + matches.join(", ")];

        if (history === 0 && template.material_type === "psychoeducation") {
          score += 48;
          reasons.push("proceso sin material previo: conviene orientar antes de pedir práctica");
        }
        if (history === 0 && ["assessment", "skills"].includes(template.phase)) {
          score += 32;
          reasons.push("fase inicial");
        }
        if (history > 0 && ["skills", "practice", "exposure"].includes(template.phase)) {
          score += 38;
          reasons.push("ya existe trabajo previo: prioriza práctica");
        }
        if (reviewed >= 2 && template.phase === "consolidation") {
          score += 30;
          reasons.push("hay material revisado: encaja como consolidación");
        }
        if (reviewed >= 3 && template.phase === "relapse_prevention") {
          score += 28;
          reasons.push("fase compatible con mantenimiento");
        }
        if (priorSame.some((item) => ["reviewed", "closed"].includes(item.status))) {
          score -= 45;
          reasons.push("ya se trabajó anteriormente");
        }
        if (template.burden === "low") score += 5;
        score += Math.max(0, 24 - Math.min(24, Number(template.sequence_rank || 50) / 5));

        return { template, matches, score, reasons, history, reviewed };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || Number(a.template.sequence_rank || 50) - Number(b.template.sequence_rank || 50))
      .slice(0, 4);
  }
  function populateMaterialProcessOptions(selected = "") {
    if (!els.materialProcess) return;
    const values = [...new Set(exerciseTemplates.flatMap((template) => template.process_tags || []))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "es"));
    els.materialProcess.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Seleccionar categoría…";
    els.materialProcess.append(placeholder);
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      els.materialProcess.append(option);
    });
    els.materialProcess.value = selected || "";
  }

  function normalizeMaterialSearch(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .trim();
  }

  function populateExerciseLibrary(selectedId = "", query = "") {
    if (!els.exerciseLibrary) return;
    els.exerciseLibrary.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Seleccionar material…";
    els.exerciseLibrary.append(placeholder);

    const needle = normalizeMaterialSearch(query);
    const filtered = exerciseTemplates.filter((template) => {
      if (!needle) return true;
      const typeLabel = template.material_type === "psychoeducation" ? "psicoeducacion" : "ejercicio";
      const haystack = normalizeMaterialSearch([
        template.title,
        template.summary,
        ...(template.process_tags || []),
        typeLabel
      ].filter(Boolean).join(" "));
      return haystack.includes(needle);
    });

    const grouped = new Map();
    filtered.forEach((template) => {
      const process = (template.process_tags || [])[0] || "Otros";
      const typeLabel = template.material_type === "psychoeducation" ? "Psicoeducación" : "Ejercicios";
      const key = typeLabel + " · " + process;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(template);
    });

    [...grouped.keys()].sort((a, b) => a.localeCompare(b, "es")).forEach((label) => {
      const group = document.createElement("optgroup");
      group.label = label;
      grouped.get(label)
        .sort((a, b) => Number(a.sequence_rank || 50) - Number(b.sequence_rank || 50) || a.title.localeCompare(b.title, "es"))
        .forEach((template) => {
          const option = document.createElement("option");
          option.value = template.id;
          option.textContent = template.title;
          group.append(option);
        });
      els.exerciseLibrary.append(group);
    });

    if (els.materialNotFound) els.materialNotFound.hidden = !needle || filtered.length > 0;
    els.exerciseLibrary.value = selectedId || "";
  }

  function materialPatientDefaults(materialType = "exercise", summary = "", instructions = "", durationMinutes = null) {
    const psycho = materialType === "psychoeducation";
    const focus = String(summary || "").trim();
    const duration = Number(durationMinutes);
    return {
      version: 1,
      material_type: psycho ? "psychoeducation" : "exercise",
      duration_minutes: Number.isFinite(duration) && duration > 0 ? Math.round(duration) : psycho ? 10 : null,
      frequency: psycho
        ? "Revísalo una vez esta semana y vuelve a él si te resulta útil."
        : "Practícalo según lo acordado en sesión. Si no concretamos frecuencia, prueba una vez y anota qué observas.",
      introduction: psycho
        ? "Este material resume una idea trabajada en sesión para que puedas revisarla con calma y volver a ella cuando lo necesites."
        : "Este material forma parte del trabajo acordado en sesión. Úsalo como una guía breve entre sesiones y adáptalo a tu ritmo.",
      why: psycho
        ? `Entender este proceso puede ayudarte a reconocer mejor qué está ocurriendo y disponer de un mapa más claro antes de decidir qué practicar.${focus ? " El foco de este material es: " + focus + "." : ""}`
        : `Este ejercicio permite practicar fuera de sesión una habilidad concreta y observar cómo funciona en situaciones reales.${focus ? " El foco es: " + focus + "." : ""} No buscamos hacerlo perfecto ni eliminar el malestar de inmediato, sino obtener información útil y ampliar recursos.`,
      objective: focus,
      instructions: instructions || "",
      example: "",
      record_prompt: psycho ? "" : "Después de probarlo, anota brevemente en qué situación lo utilizaste, qué hiciste y qué observaste. No hace falta escribir mucho.",
      safety_note: "",
      remember: psycho
        ? "No necesitas memorizarlo ni estar de acuerdo con todo a la primera. Quédate con las ideas que te ayuden a entender mejor lo que ocurre."
        : "No se trata de hacerlo perfecto. Si algo no encaja, resulta demasiado difícil o genera dudas, déjalo anotado para revisarlo en sesión.",
      session_questions: psycho
        ? ["¿Qué idea te ha resultado más útil o relevante?", "¿Hay algo que no encaje con tu experiencia o quieras revisar?"]
        : ["¿Qué te resultó más fácil o más difícil?", "¿Qué observaste al probarlo?", "¿Qué ajustarías para que te resulte más útil?"]
    };
  }

  function normalizedPatientDocument(template = null) {
    const type = template?.material_type === "psychoeducation" ? "psychoeducation" : "exercise";
    const defaults = materialPatientDefaults(type, template?.summary || "", template?.instructions || "", template?.duration_minutes);
    const raw = template?.patient_document && typeof template.patient_document === "object" && !Array.isArray(template.patient_document)
      ? template.patient_document
      : {};
    return {
      ...defaults,
      ...raw,
      version: 1,
      material_type: type,
      duration_minutes: Number(raw.duration_minutes || template?.duration_minutes || defaults.duration_minutes) || null,
      frequency: raw.frequency || defaults.frequency,
      safety_note: raw.safety_note || "",
      instructions: raw.instructions || template?.instructions || defaults.instructions,
      session_questions: Array.isArray(raw.session_questions) ? raw.session_questions.filter(Boolean) : defaults.session_questions
    };
  }

  function patientDocumentQuality(document) {
    const doc = document || {};
    const missing = [];
    if (!String(doc.introduction || "").trim()) missing.push("introducción");
    if (!String(doc.why || "").trim()) missing.push("explicación");
    if (!String(doc.objective || "").trim()) missing.push("objetivo");
    if (!String(doc.instructions || "").trim()) missing.push("instrucciones");
    if (!String(doc.example || "").trim()) missing.push("ejemplo");
    if (!String(doc.frequency || "").trim()) missing.push("frecuencia");
    if (!Number(doc.duration_minutes || 0)) missing.push("tiempo");
    if (!String(doc.remember || "").trim()) missing.push("cierre");
    if (doc.material_type !== "psychoeducation" && !String(doc.record_prompt || "").trim()) missing.push("registro");
    if (!Array.isArray(doc.session_questions) || !doc.session_questions.filter(Boolean).length) missing.push("preguntas para sesión");
    return { complete: missing.length === 0, missing };
  }

  function renderPatientDocumentQuality(document = null) {
    if (!els.materialQuality || !els.materialQualityLabel || !els.materialQualityNote) return;
    const doc = document || patientDocumentFromForm(els.materialType?.value || "exercise");
    const quality = patientDocumentQuality(doc);
    els.materialQuality.classList.toggle("is-complete", quality.complete);
    els.materialQualityLabel.textContent = quality.complete ? "Ficha completa" : "Ficha básica";
    els.materialQualityNote.textContent = quality.complete
      ? "Contenido completado. Revisa su adecuación y la vista del paciente antes de enviarlo."
      : `Recomendable completar antes de enviar · falta ${quality.missing.slice(0, 4).join(", ")}${quality.missing.length > 4 ? "…" : ""}.`;
    if (els.materialAiEnrich) els.materialAiEnrich.textContent = quality.complete ? "Mejorar ficha con IA" : "Completar ficha con IA";
  }

  function fillPatientDocument(document) {
    const doc = document || materialPatientDefaults(els.materialType?.value || "exercise");
    els.exerciseIntroduction.value = doc.introduction || "";
    els.exerciseWhy.value = doc.why || "";
    els.exerciseDuration.value = doc.duration_minutes || "";
    els.exerciseFrequency.value = doc.frequency || "";
    els.exerciseObjective.value = doc.objective || "";
    els.exerciseExample.value = doc.example || "";
    els.exerciseRecord.value = doc.record_prompt || "";
    els.exerciseSafety.value = doc.safety_note || "";
    els.exerciseRemember.value = doc.remember || "";
    els.exerciseSessionQuestions.value = Array.isArray(doc.session_questions) ? doc.session_questions.join("\n") : "";
    window.ClinicNeuroMaterials?.hydrate(doc);
    renderPatientDocumentQuality(doc);
  }

  function patientDocumentFromForm(materialType = "exercise") {
    return {
      version: 1,
      material_type: materialType === "psychoeducation" ? "psychoeducation" : "exercise",
      duration_minutes: Number.isFinite(Number(els.exerciseDuration.value)) && Number(els.exerciseDuration.value) > 0
        ? Math.min(180, Math.round(Number(els.exerciseDuration.value)))
        : null,
      frequency: els.exerciseFrequency.value.trim(),
      introduction: els.exerciseIntroduction.value.trim(),
      why: els.exerciseWhy.value.trim(),
      objective: els.exerciseObjective.value.trim(),
      instructions: els.exerciseContent.value.trim(),
      example: els.exerciseExample.value.trim(),
      record_prompt: els.exerciseRecord.value.trim(),
      safety_note: els.exerciseSafety.value.trim(),
      remember: els.exerciseRemember.value.trim(),
      session_questions: els.exerciseSessionQuestions.value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean).slice(0, 6),
      ...(window.ClinicNeuroMaterials?.read?.() || { clinical_area: "psychology", visual_blocks: [] })
    };
  }

  function applyExerciseTemplate(template) {
    if (!template) {
      els.exerciseTemplateId.value = "";
      els.exerciseTitle.value = "";
      els.exerciseContent.value = "";
      fillPatientDocument(materialPatientDefaults(els.materialType?.value || "exercise"));
      if (els.addMaterialLibrary) els.addMaterialLibrary.textContent = "Añadir a la biblioteca";
      return;
    }
    els.exerciseTemplateId.value = template.id || "";
    els.exerciseTitle.value = template.title || "";
    const patientDocument = normalizedPatientDocument(template);
    els.exerciseContent.value = patientDocument.instructions || template.instructions || "";
    fillPatientDocument(patientDocument);
    if (els.addMaterialLibrary) els.addMaterialLibrary.textContent = "Actualizar biblioteca";
  }

  function openExercise(template = null, rationale = "") {
    if (!currentPatient) return;
    if (els.materialSearch) els.materialSearch.value = "";
    if(els.materialAiCreate)els.materialAiCreate.disabled=true;
    populateExerciseLibrary(template?.id || "");
    populateMaterialProcessOptions((template?.process_tags || [])[0] || "");
    if (els.materialType) els.materialType.value = template?.material_type || "exercise";
    applyExerciseTemplate(template);
    if (!template) {
      // La propuesta semanal siguiente se obtiene del material realmente asignado,
      // nunca de una inferencia clínica ni de un borrador sin enviar.
      const priorWeeks = patientExercises(currentPatient.id)
        .filter(item => ["sent","assigned","reviewed"].includes(item.status) && item.patient_document?.clinical_area === "neuropsychology")
        .map(item => Number(item.patient_document?.neuro_profile?.week_number))
        .filter(week => Number.isInteger(week) && week >= 1 && week <= 52);
      const suggestedWeek = priorWeeks.length ? Math.min(52,Math.max(...priorWeeks)+1) : 1;
      const weekInput = document.getElementById("clinic-neuro-week-number");
      if (weekInput) weekInput.value = String(suggestedWeek);
      const mode = document.getElementById("clinic-neuro-mode");
      const focus = document.getElementById("clinic-neuro-focus");
      const level = document.getElementById("clinic-neuro-level");
      const advanced = document.querySelector(".clinic-neuro-advanced");
      const summary = document.getElementById("clinic-neuro-draft-summary");
      if(mode)mode.value = "weekly";
      if(focus)focus.value = "equilibrado";
      if(level)level.value = "";
      if(advanced)advanced.open = false;
      if(summary){summary.hidden=true;summary.textContent="";}
      mode?.dispatchEvent(new Event("change"));
    }
    els.exercisePatientCode.textContent = `Paciente ${currentPatient.public_code} · La identidad no aparecerá en el correo.`;
    els.exerciseRationale.value = rationale;
    els.exerciseEmail.value = currentPatient.email || "";
    els.exerciseMessage.textContent = "";
    els.exerciseDialog.showModal();
  }
  function patientStateLabel(value) {
    return ({ pending: "Pendiente", reviewed: "Lo ha revisado", discuss: "Quiere comentarlo en sesión" })[value] || "Pendiente";
  }
  function sharedPatientResponse(item) {
    if (item?.patient_response_status !== "shared") return null;
    const source = item.patient_response && typeof item.patient_response === "object" ? item.patient_response : {};
    const record = String(source.record || "").trim();
    const answers = Array.isArray(source.answers) ? source.answers.map((value) => String(value || "").trim()) : [];
    const neuro_answers = Array.isArray(source.neuro_answers) ? source.neuro_answers.slice(0,14).map(value => String(value || "").trim()) : [];
    if (!record && !answers.some(Boolean) && !neuro_answers.some(Boolean)) return null;
    return { record, answers, neuro_answers };
  }

  function previewFileName(title) {
    const slug = String(title || "material")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
    return `entre-sesiones-${slug || "material"}.pdf`;
  }

  async function openPatientMaterialPreview(title, patientDocument, format = "html", download = false) {
    const value = getSession();
    if (!value?.access_token) throw new Error("La sesión ha caducado. Vuelve a entrar en Gestión clínica.");
    let previewWindow = null;
    if (!download) {
      previewWindow = window.open("about:blank", "_blank");
      if (!previewWindow) throw new Error("El navegador ha bloqueado la vista previa.");
      previewWindow.document.write("<p style=\"font-family:Arial,sans-serif;padding:24px\">Preparando vista previa…</p>");
    }
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/view-clinical-exercise`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ mode: "preview", title, patient_document: patientDocument, format, patient_id: currentPatient?.id || null })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "No se ha podido generar la vista previa.");
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      if (download) {
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = previewFileName(title);
        document.body.append(link);
        link.click();
        link.remove();
      } else if (previewWindow) {
        previewWindow.location.replace(objectUrl);
      }
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 120000);
    } catch (error) {
      if (previewWindow) previewWindow.close();
      throw error;
    }
  }

  async function refreshCurrentPatientMaterials(patientId) {
    await loadData();
    const freshPatient = patients.find((item) => item.id === patientId) || currentPatient;
    if (freshPatient) currentPatient = freshPatient;
    if (currentPatient) {
      renderExercises(currentPatient);
      renderTimeline(currentPatient);
      renderPending();
    }
  }

  async function sendExistingAssignment(item, resend = false) {
    els.patientMessage.textContent = resend ? "Reenviando material…" : "Enviando material…";
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-clinical-exercise`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ assignment_id: item.id, resend })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || "No se ha podido enviar el material.");
    els.patientMessage.textContent = resend ? "Material reenviado con un enlace nuevo." : "Material enviado.";
    await refreshCurrentPatientMaterials(item.patient_id);
  }

  async function revokeAssignment(item) {
    if (!window.confirm("¿Revocar este enlace? El paciente dejará de poder abrirlo inmediatamente.")) return;
    const rows = await rest(`clinical_exercise_assignments?id=eq.${encodeURIComponent(item.id)}&select=*`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    });
    if (rows?.[0]) exerciseAssignments = exerciseAssignments.map((value) => value.id === item.id ? rows[0] : value);
    renderExercises(currentPatient);
    renderTimeline(currentPatient);
  }

  function renderExercises(patient) {
    els.exerciseSuggestions.replaceChildren();
    const suggestions = prescriptionSuggestions(patient.id);
    if (suggestions.length) {
      suggestions.forEach(({ template, matches, reasons }) => {
        const card = create("article", "clinic-exercise-card");
        const body = create("div");
        body.append(create("strong", "", template.title), create("p", "", `${template.material_type === "psychoeducation" ? "Psicoeducación" : "Ejercicio"} · ${template.duration_minutes || "—"} min · ${reasons.join(" · ")}`));
        const button = create("button", "clinic-secondary", "Preparar");
        button.type = "button";
        button.addEventListener("click", () => openExercise(template, `Prescripción sugerida. ${reasons.join(". ")}.`));
        card.append(body, button);
        els.exerciseSuggestions.append(card);
      });
    } else {
      els.exerciseSuggestions.append(create("p", "clinic-empty-inline", "No hay una prescripción prioritaria con los datos registrados. Puedes seleccionar cualquier material de la biblioteca."));
    }

    els.patientExercises.replaceChildren();
    const assigned = patientExercises(patient.id);
    if (!assigned.length) {
      els.patientExercises.append(create("p", "clinic-empty-inline", "Todavía no hay material entre sesiones asignado."));
      return;
    }

    assigned.forEach((item) => {
      const row = create("article");
      const info = create("div");
      const title = create("strong", "", item.title);
      const statusLine = item.revoked_at
        ? "Enlace revocado"
        : item.email_status === "sent"
          ? `Enviado${item.access_expires_at ? " · enlace hasta " + dateShort.format(new Date(item.access_expires_at)) : ""}`
          : item.status === "prepared" ? "Preparado, sin enviar" : item.status;
      info.append(title, create("span", "", statusLine));

      const states = create("div", "clinic-material-status");
      if (item.first_opened_at) states.append(create("span", "clinic-material-state opened", `Abierto ${dateShort.format(new Date(item.first_opened_at))}`));
      else if (item.email_status === "sent" && !item.revoked_at) states.append(create("span", "clinic-material-state", "Aún no abierto"));
      if (item.email_status === "sent") {
        const patientStateClass = item.patient_state === "discuss" ? "clinic-material-state discuss" : "clinic-material-state";
        states.append(create("span", patientStateClass, patientStateLabel(item.patient_state)));
      }
      const patientResponse = sharedPatientResponse(item);
      if (patientResponse) states.append(create("span", "clinic-material-state shared", "Respuestas compartidas"));
      if (item.revoked_at) states.append(create("span", "clinic-material-state revoked", "Revocado"));
      if (states.childNodes.length) info.append(states);

      if (patientResponse) {
        const details = create("details", "clinic-material-response");
        const summary = create("summary", "", "Ver respuestas compartidas");
        const body = create("div", "clinic-material-response-body");
        if (patientResponse.record) {
          const block = create("article");
          block.append(create("strong", "", "Tu registro"), create("p", "", patientResponse.record));
          body.append(block);
        }
        const questions = Array.isArray(item.patient_document?.session_questions) ? item.patient_document.session_questions : [];
        patientResponse.answers.forEach((answer, index) => {
          if (!answer) return;
          const block = create("article");
          block.append(create("strong", "", questions[index] || `Respuesta ${index + 1}`), create("p", "", answer));
          body.append(block);
        });
        patientResponse.neuro_answers.forEach((answer, index) => {
          if (!answer) return;
          const block = create("article");
          block.append(create("strong", "", "Ejercicio " + (index + 1)), create("p", "", answer));
          body.append(block);
        });
        if (item.patient_response_shared_at) {
          body.append(create("small", "", `Compartido ${dateShort.format(new Date(item.patient_response_shared_at))}`));
        }
        details.append(summary, body);
        info.append(details);
      }

      const actions = create("div", "clinic-material-row-actions");

      const preview = create("button", "clinic-text", "Ver");
      preview.type = "button";
      preview.addEventListener("click", () => openPatientMaterialPreview(item.title, item.patient_document || { instructions: item.content }, "html", false).catch((error) => { els.patientMessage.textContent = error.message; }));
      actions.append(preview);

      const pdf = create("button", "clinic-text", "Descargar copia");
      pdf.type = "button";
      pdf.addEventListener("click", () => openPatientMaterialPreview(item.title, item.patient_document || { instructions: item.content }, "pdf", true).catch((error) => { els.patientMessage.textContent = error.message; }));
      actions.append(pdf);

      if (item.email_status !== "sent") {
        const send = create("button", "clinic-secondary", "Enviar");
        send.type = "button";
        send.addEventListener("click", () => sendExistingAssignment(item, false).catch((error) => { els.patientMessage.textContent = error.message; }));
        actions.append(send);
      } else {
        const resend = create("button", "clinic-secondary", "Reenviar");
        resend.type = "button";
        resend.addEventListener("click", () => sendExistingAssignment(item, true).catch((error) => { els.patientMessage.textContent = error.message; }));
        actions.append(resend);
      }

      if (item.email_status === "sent" && !item.revoked_at) {
        const revoke = create("button", "clinic-text", "Revocar enlace");
        revoke.type = "button";
        revoke.addEventListener("click", () => revokeAssignment(item).catch((error) => { els.patientMessage.textContent = error.message; }));
        actions.append(revoke);
      }

      if (["sent", "assigned"].includes(item.status)) {
        const reviewed = create("button", "clinic-text", "Marcar revisado");
        reviewed.type = "button";
        reviewed.addEventListener("click", async () => {
          try {
            const rows = await rest(`clinical_exercise_assignments?id=eq.${encodeURIComponent(item.id)}&select=*`, {
              method: "PATCH",
              headers: { Prefer: "return=representation" },
              body: JSON.stringify({ status: "reviewed", reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
            });
            if (rows?.[0]) exerciseAssignments = exerciseAssignments.map((value) => value.id === item.id ? rows[0] : value);
            renderExercises(currentPatient);
            renderTimeline(currentPatient);
            renderPending();
          } catch (error) {
            els.patientMessage.textContent = error.message;
          }
        });
        actions.append(reviewed);
      }

      row.append(info, actions);
      els.patientExercises.append(row);
    });
  }

  async function saveExercise(sendAfterSave) {
    if (!currentPatient) return;
    if (sendAfterSave) {
      const materialTypeForQuality = els.materialType?.value || "exercise";
      const docForQuality = patientDocumentFromForm(materialTypeForQuality);
      const validation = window.ClinicNeuroMaterials?.validate?.(docForQuality);
      if (validation && !validation.ok) throw new Error("Antes de prescribir: " + validation.issues.join("; ") + ".");
      if (docForQuality.clinical_area === "neuropsychology" && !document.getElementById("clinic-neuro-reviewed")?.checked) {
        throw new Error("Debes confirmar la revisión clínica de los estímulos y consignas antes de enviar esta actividad.");
      }
      const quality = patientDocumentQuality(docForQuality);
      if (!quality.complete) {
        if (docForQuality.clinical_area === "neuropsychology") {
          throw new Error("Completa todos los campos necesarios para prescribir: " + quality.missing.join(", ") + ".");
        }
        const proceed = window.confirm(`Esta ficha todavía está marcada como básica. Falta: ${quality.missing.join(", ")}.\n\nPuedes enviarla igualmente o cancelar para completarla con IA.`);
        if (!proceed) {
          els.exerciseMessage.textContent = "Envío cancelado. Puedes completar la ficha antes de enviarla.";
          return;
        }
      }
    }
    if (!els.exerciseTitle.value.trim() || !els.exerciseContent.value.trim()) throw new Error("Completa el título y el contenido.");
    if (!els.exerciseIntroduction.value.trim() || !els.exerciseWhy.value.trim()) throw new Error("Completa la introducción y «Por qué hacemos este ejercicio».");
    const selectedTemplate = exerciseTemplates.find((item) => item.id === els.exerciseTemplateId.value) || null;
    const materialType = selectedTemplate?.material_type || els.materialType?.value || "exercise";
    els.exerciseMessage.textContent = sendAfterSave ? "Preparando enlace seguro…" : "Guardando…";
    const rows = await rest("clinical_exercise_assignments?select=*", {
      method: "POST", headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        patient_id: currentPatient.id,
        template_id: els.exerciseTemplateId.value || null,
        title: els.exerciseTitle.value.trim(),
        content: els.exerciseContent.value.trim(),
        rationale: els.exerciseRationale.value.trim() || null,
        patient_document: patientDocumentFromForm(materialType),
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
    return ({ evolution_health: "Informe de evolución y seguimiento · Profesional sanitario", evolution: "Informe de evolución", clinical_summary: "Resumen clínico", referral: "Informe de derivación" })[type] || "Informe clínico";
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
  function personalAdministrativePrintHtml(patient) {
    const rows = [
      ["Nombre y apellidos", patient.full_name],
      ["Fecha de nacimiento", patient.birth_date ? dateShort.format(new Date(patient.birth_date + "T00:00:00")) : null],
      ["Edad", patient.birth_date ? (patientAge(patient.birth_date) ? patientAge(patient.birth_date) + " años" : null) : null],
      ["DNI / NIE", patient.national_id],
      ["Teléfono", patient.phone],
      ["Correo", patient.email],
      ["Dirección", patient.address],
      ["Profesión / ocupación", patient.occupation],
      ["Estado civil / convivencia", patient.marital_status],
      ["Persona de contacto", patient.emergency_contact_name],
      ["Teléfono de contacto", patient.emergency_contact_phone],
      ["Profesional de referencia", patient.referring_professional],
      ["Mutua / cobertura", patient.insurance_provider],
      ["Centro / proveedor externo", patient.external_provider],
      ["Observaciones administrativas", patient.administrative_notes],
    ].filter(([, value]) => value);
    if (!rows.length) return "";
    return `<section class="entry"><h2>Datos personales y administrativos</h2>${rows.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join("")}</section>`;
  }
  function printClinicalHistory() {
    if (!currentPatient) return;
    const sessions = patientSessions(currentPatient.id).filter((item) => item.status === "approved").sort((a, b) => new Date(a.session_date) - new Date(b.session_date));
    const profileEntries = clinicalProfilePrintHtml(currentPatient);
    const personalEntries = personalAdministrativePrintHtml(currentPatient);
    const overview = [
      currentPatient.clinical_summary ? `<section class="entry"><h2>Síntesis clínica</h2><div class="text">${escapeHtml(currentPatient.clinical_summary)}</div></section>` : "",
      currentPatient.medication_notes ? `<section class="entry"><h2>Medicación registrada</h2><div class="text">${escapeHtml(currentPatient.medication_notes)}</div></section>` : "",
      currentPatient.next_session_focus ? `<section class="entry"><h2>Focos pendientes</h2><div class="text">${escapeHtml(currentPatient.next_session_focus)}</div></section>` : "",
    ].join("");
    const entries = sessions.map((item) => `<section class="entry"><h2>Sesión ${item.session_number || ""} · ${escapeHtml(dateShort.format(new Date(item.session_date)))}</h2>${item.evolution_note ? `<h3>Evolución</h3><div class="text">${escapeHtml(item.evolution_note)}</div>` : ""}${item.intervention_note ? `<h3>Intervención</h3><div class="text">${escapeHtml(item.intervention_note)}</div>` : ""}${item.response_note ? `<h3>Respuesta</h3><div class="text">${escapeHtml(item.response_note)}</div>` : ""}${item.agreements_note ? `<h3>Acuerdos</h3><div class="text">${escapeHtml(item.agreements_note)}</div>` : ""}${item.homework_note ? `<h3>Tarea</h3><div class="text">${escapeHtml(item.homework_note)}</div>` : ""}</section>`).join("");
    printableWindow("Historial clínico", `<header><p>Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga</p><h1>Historial clínico</h1><p class="meta">Paciente: ${escapeHtml(currentPatient.full_name)} · Código: ${escapeHtml(currentPatient.public_code)} · Emitido: ${escapeHtml(dateShort.format(new Date()))}</p></header>${overview}${personalEntries}${profileEntries}<h2>Sesiones aprobadas</h2>${entries || "<p>No constan sesiones clínicas aprobadas.</p>"}<p class="privacy">Documento confidencial que contiene datos de salud.</p>`);
  }
  const healthReportFields = [
    ["sources", "Fuentes y procedimiento"], ["background", "Antecedentes relevantes"],
    ["observation", "Estado clínico y observación"], ["results", "Resultados y cambios documentados"],
    ["integration", "Integración e impresión clínica (revisión profesional obligatoria)"],
    ["conclusions", "Conclusiones (revisión profesional obligatoria)"],
    ["plan", "Plan de seguimiento"], ["limitations", "Limitaciones y alcance"]
  ];
  function healthReportInputs() {
    let panel = document.querySelector("#clinic-health-report-sections");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "clinic-health-report-sections";
      panel.style.cssText = "display:grid;gap:16px";
      for (const [key,label] of healthReportFields) {
        const wrapper = document.createElement("label");
        wrapper.textContent = label;
        const area = document.createElement("textarea");
        area.id = "clinic-health-" + key;
        area.rows = key === "integration" || key === "conclusions" ? 5 : 4;
        area.style.width = "100%";
        wrapper.append(area);
        panel.append(wrapper);
      }
      els.reportSignature.parentElement.before(panel);
    }
    return Object.fromEntries(healthReportFields.map(([key]) => [key, panel.querySelector("#clinic-health-" + key)]));
  }
  let reportFormBaseline = "";
  let reportDirty = false;
  let reportSaveTimer = null;
  let reportSaveActive = false;
  let reportSaveRequested = false;
  let reportIsOpening = false;
  function reportInputs() {
    return [els.reportType,els.reportRecipient,els.reportPurpose,els.reportStart,els.reportEnd,els.reportContext,els.reportEvolution,els.reportInterventions,els.reportCurrent,...Object.values(healthReportInputs())];
  }
  function reportSnapshot() { return JSON.stringify(reportInputs().map(input => [input.id,input.value])); }
  function markReportClean() {
    reportFormBaseline = reportSnapshot(); reportDirty = false;
    const state = document.querySelector("#clinic-report-save-state");
    if (state) state.textContent = els.reportId.value ? "Guardado · borrador recuperable" : "Borrador nuevo · todavía sin guardar";
  }
  function reportSaveState(message) {
    const state = document.querySelector("#clinic-report-save-state");
    if (state) state.textContent = message;
  }
  function reportHasContent() {
    return [els.reportContext, els.reportEvolution, els.reportInterventions, els.reportCurrent, ...Object.values(healthReportInputs())].some(input => input.value.trim());
  }
  function scheduleReportAutoSave() {
    if (reportIsOpening || !currentPatient || !els.reportDialog.open || els.saveReport.disabled) return;
    reportDirty = reportSnapshot() !== reportFormBaseline;
    if (!reportDirty) { reportSaveState("Guardado · sin cambios"); return; }
    reportSaveState("Cambios sin guardar · guardado automático pendiente");
    window.clearTimeout(reportSaveTimer);
    if (!els.reportPurpose.value.trim() || !reportHasContent() || (healthReportSelected() && (!els.reportStart.value || !els.reportEnd.value))) {
      reportSaveState("Cambios pendientes · indica finalidad y periodo para guardar"); return;
    }
    reportSaveTimer = window.setTimeout(() => persistReport("draft", { auto: true }).catch(error => reportSaveState("No se ha guardado: " + error.message)), 3500);
  }
  function healthReportSelected() {
    const active = els.reportType.value === "evolution_health";
    const panel = document.querySelector("#clinic-health-report-sections");
    if (panel) { panel.hidden = !active; panel.style.display = active ? "grid" : "none"; }
    if (els.reportContext?.closest("#clinic-report-sheet")) { const sheet = els.reportContext.closest("#clinic-report-sheet"); sheet.hidden = false; sheet.style.display = ""; }
    if (els.generateReport) els.generateReport.textContent = "Descargar Word editable";
    if (els.printReport) { els.printReport.hidden = false; els.printReport.style.display = ""; els.printReport.textContent = "Imprimir borrador"; }
    if (els.saveReport) { els.saveReport.hidden = false; els.saveReport.style.display = ""; els.saveReport.textContent = "Guardar en Gestión Clínica"; }
    if (els.approveReport) { els.approveReport.hidden = active; els.approveReport.style.display = active ? "none" : ""; }
    const label = document.querySelector("#clinic-report-current")?.closest("label");
    if (label) label.firstChild.textContent = active ? "Estado actual y objetivos pendientes" : "Situación actual y recomendaciones";
    return active;
  }
  function openReport(report = null) {
    if (!currentPatient) return;
    els.reportId.value = report?.id || "";
    els.reportType.value = report?.report_type || "evolution_health";
    els.reportRecipient.value = report?.recipient || "";
    els.reportPurpose.value = report?.purpose || "";
    els.reportStart.value = report?.period_start || "";
    els.reportEnd.value = report?.period_end || "";
    const content = report?.content || {};
    els.reportContext.value = content.context || "";
    els.reportEvolution.value = content.evolution || "";
    els.reportInterventions.value = content.interventions || "";
    els.reportCurrent.value = content.current || "";
    const healthInputs = healthReportInputs();
    healthReportFields.forEach(([key]) => { healthInputs[key].value = content[key] || ""; });
    reportIsOpening = true;
    const health = healthReportSelected();
    Object.values(healthInputs).forEach((field) => { field.disabled = report?.status === "approved"; });
    if (health && !els.reportRecipient.value) els.reportRecipient.value = "Profesional sanitario";
    els.reportTitlePreview.textContent = report?.title || reportTypeLabel(els.reportType.value);
    els.reportHeading.textContent = report?.title || "Nuevo informe";
    els.reportMeta.textContent = `${currentPatient.public_code} · ${currentPatient.full_name}`;
    els.reportSignature.textContent = `Carolina Sánchez Girona · ${dateShort.format(new Date())}`;
    els.reportMessage.textContent = report?.status === "approved" ? "Informe aprobado. El contenido está bloqueado." : "";
    const locked = report?.status === "approved";
    [els.reportType, els.reportRecipient, els.reportPurpose, els.reportStart, els.reportEnd, els.reportContext, els.reportEvolution, els.reportInterventions, els.reportCurrent].forEach((field) => { field.disabled = locked; });
    els.generateReport.disabled = locked; els.saveReport.disabled = locked; els.approveReport.disabled = locked;
    window.clearTimeout(reportSaveTimer);
    if (!els.reportDialog.parentElement?.matches("#clinic-patient-dialog")) els.patientDialog.append(els.reportDialog);
    if (!els.reportDialog.open) els.reportDialog.show();
    els.patientForm.hidden = true;
    document.body.classList.add("clinic-report-page-open");
    window.scrollTo({ top: 0, behavior: "auto" });
    markReportClean();
    reportIsOpening = false;
  }
  function closeReportEditor({ force = false } = {}) {
    if (!els.reportDialog.open) return true;
    if (reportSaveActive) { reportSaveState("Guardando borrador… espera antes de salir"); return false; }
    if (!force && (reportDirty || reportSaveRequested)) {
      if (!window.confirm("Hay cambios de informe pendientes de guardar. ¿Quieres salir y descartarlos?")) return false;
    }
    window.clearTimeout(reportSaveTimer);
    els.reportDialog.close();
    els.patientForm.hidden = false;
    document.body.classList.remove("clinic-report-page-open");
    reportDirty = false;
    reportSaveRequested = false;
    window.scrollTo({ top: 0, behavior: "auto" });
    return true;
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
    if (healthReportSelected()) {
      const h = healthReportInputs();
      const dated = (note, item) => note ? dateShort.format(new Date(item.session_date)) + ": " + note : "";
      h.sources.value = sessions.length ? sessions.length + " sesiones aprobadas entre " + dateShort.format(new Date(sessions[0].session_date)) + " y " + dateShort.format(new Date(sessions[sessions.length - 1].session_date)) + ". Fuentes: anotaciones clínicas aprobadas y ficha estructurada." : "No constan sesiones aprobadas en el periodo seleccionado.";
      h.background.value = currentPatient.clinical_summary || "[Completar antecedentes relevantes si procede]";
      h.observation.value = sessions.map(item => dated(item.response_note, item)).filter(Boolean).join("\n\n") || "[Completar observaciones relevantes del estado actual]";
      h.results.value = "[Completar únicamente con resultados y medidas verificables; no se han importado puntuaciones psicométricas]";
      h.integration.value = "";
      h.conclusions.value = "";
      h.plan.value = [profile.treatment_plan, currentPatient.next_session_focus].filter(Boolean).join("\n\n") || "[Completar el plan si está documentado]";
      h.limitations.value = "Este borrador sintetiza únicamente los registros aprobados incluidos en el periodo. La ausencia de una medición estandarizada no permite cuantificar el cambio clínico.";
      els.reportRecipient.value ||= "Profesional sanitario";
    }
    els.reportMessage.textContent = `Borrador generado a partir de ${sessions.length} sesión(es) aprobada(s) y de la ficha clínica estructurada. Revísalo antes de aprobar.`;
  }
  function downloadHealthReportWord() {
    if (!currentPatient || !window.ClinicWordExport?.download) throw new Error("No se ha cargado el generador de Word. Actualiza la página y vuelve a intentarlo.");
    const h = healthReportInputs();
    if (!els.reportPurpose.value.trim()) throw new Error("Indica la finalidad clínica del informe antes de descargarlo.");
    if (els.reportStart.value && els.reportEnd.value && els.reportStart.value > els.reportEnd.value) throw new Error("El periodo seleccionado no es válido.");
    if (healthReportSelected() && (!els.reportStart.value || !els.reportEnd.value)) throw new Error("Selecciona un periodo de seguimiento para este tipo de informe.");
    const isHealthcare = healthReportSelected();
    const additional = isHealthcare ? Object.fromEntries(healthReportFields.map(([key]) => [key, h[key].value])) : {};
    const sections = {
      context: els.reportContext.value,
      interventions: els.reportInterventions.value,
      observation: els.reportCurrent.value,
      plan: els.reportCurrent.value,
      ...additional
    };
    const evolution = els.reportEvolution.value.trim();
    if (evolution) sections.interventions = [sections.interventions, "Evolución cronológica documentada:\n" + evolution].filter(Boolean).join("\n\n");
    if (isHealthcare && els.reportCurrent.value.trim()) sections.plan = [sections.plan, els.reportCurrent.value].filter(Boolean).join("\n\n");
    window.ClinicWordExport.download({
      type: els.reportType.value, title: reportTypeLabel(els.reportType.value),
      identity: { name: currentPatient.full_name, code: currentPatient.public_code, birth: currentPatient.birth_date || "" },
      period: [els.reportStart.value, els.reportEnd.value].filter(Boolean).join(" a ") || "No especificado",
      purpose: els.reportPurpose.value.trim(), recipient: els.reportRecipient.value.trim() || "Profesional sanitario",
      professional: "Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga",
      license: "", sections
    });
    els.reportMessage.textContent = "Archivo Word descargado como BORRADOR. Modifica los apartados clínicos en Word. Los cambios realizados fuera de Gestión Clínica no se sincronizan con la historia.";
  }
  function reportPayload(status) {
    const sessions = approvedSessionsInPeriod(currentPatient.id);
    return {
      patient_id: currentPatient.id, report_type: els.reportType.value,
      title: reportTypeLabel(els.reportType.value), recipient: els.reportRecipient.value.trim() || null,
      purpose: els.reportPurpose.value.trim() || null, period_start: els.reportStart.value || null,
      period_end: els.reportEnd.value || null,
      content: { context: els.reportContext.value.trim(), evolution: els.reportEvolution.value.trim(), interventions: els.reportInterventions.value.trim(), current: els.reportCurrent.value.trim(), ...(healthReportSelected() ? Object.fromEntries(healthReportFields.map(([key]) => [key, healthReportInputs()[key].value.trim()])) : {}) },
      included_session_ids: sessions.map((item) => item.id), status,
      approved_at: status === "approved" ? new Date().toISOString() : null, updated_at: new Date().toISOString(),
    };
  }
  async function persistReport(status, { auto = false } = {}) {
    if (reportSaveActive) { reportSaveRequested = true; if (!auto) throw new Error("Se está guardando el borrador. Espera unos segundos."); return; }
    if (auto && (!els.reportPurpose.value.trim() || !reportHasContent())) return;
    if (els.reportId.value && clinicalReports.some(item => item.id === els.reportId.value && item.status === "approved")) throw new Error("El informe aprobado no se puede sobrescribir.");
    if (auto && healthReportSelected() && (!els.reportStart.value || !els.reportEnd.value || els.reportStart.value > els.reportEnd.value)) return;
    if (auto && !reportDirty) return;
    if (!currentPatient) return;
    const savingSnapshot = reportSnapshot();
    if (status === "approved" && healthReportSelected()) {
      const h = healthReportInputs();
      if (!els.reportPurpose.value.trim() || !els.reportRecipient.value.trim() || !els.reportStart.value || !els.reportEnd.value) throw new Error("Indica finalidad, destinatario y periodo antes de aprobar.");
      if (els.reportStart.value > els.reportEnd.value) throw new Error("El periodo de fechas no es válido.");
      if (!h.integration.value.trim() || !h.conclusions.value.trim()) throw new Error("Revisa y redacta expresamente la integración y las conclusiones antes de aprobar.");
      if (Object.values(h).some(x => /\[completar/i.test(x.value))) throw new Error("Hay apartados pendientes de completar.");
    }
    if (status === "approved" && !els.reportEvolution.value.trim() && !els.reportContext.value.trim()) throw new Error("El informe no contiene información suficiente para aprobarlo.");
    els.reportMessage.textContent = status === "approved" ? "Aprobando informe…" : "Guardando borrador…";
    const payload = reportPayload(status);
    reportSaveActive = true;
    let savedSuccessfully = false;
    try {
      if (auto) reportSaveState("Guardando borrador…");
      const rows = els.reportId.value
        ? await rest(`clinical_reports?id=eq.${encodeURIComponent(els.reportId.value)}&select=*`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(payload) })
        : await rest("clinical_reports?select=*", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(payload) });
      const saved = rows?.[0]; if (!saved) throw new Error("No se ha podido guardar el informe.");
      savedSuccessfully = true;
      clinicalReports = [saved, ...clinicalReports.filter((item) => item.id !== saved.id)];
      els.reportId.value = saved.id;
      renderReports(currentPatient);
      if (reportSnapshot() === savingSnapshot) markReportClean();
      else { reportDirty = true; reportSaveState("Hay cambios posteriores pendientes de guardar"); }
      els.reportMessage.textContent = auto ? "" : "Borrador guardado en la historia clínica.";
    } finally {
      reportSaveActive = false;
      const needsAnotherSave = savedSuccessfully && (reportSaveRequested || (auto && reportDirty));
      reportSaveRequested = false;
      if (needsAnotherSave && reportDirty) scheduleReportAutoSave();
    }
  }
  function printCurrentReport() {
    if (!currentPatient) return;
    const section = (title, value) => value.trim() ? `<h2>${title}</h2><div class="text">${escapeHtml(value)}</div>` : "";
    printableWindow(els.reportTitlePreview.textContent, `<header><p>Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga</p><h1>${escapeHtml(els.reportTitlePreview.textContent)}</h1><p class="meta">Paciente: ${escapeHtml(currentPatient.full_name)} · Código: ${escapeHtml(currentPatient.public_code)}<br>Destinatario: ${escapeHtml(els.reportRecipient.value || "No especificado")} · Finalidad: ${escapeHtml(els.reportPurpose.value || "Asistencial")}<br>Fecha: ${escapeHtml(dateShort.format(new Date()))}</p></header>${section("Motivo y contexto", els.reportContext.value)}${section("Evolución clínica", els.reportEvolution.value)}${section("Intervenciones realizadas", els.reportInterventions.value)}${section(healthReportSelected() ? "Estado actual y objetivos pendientes" : "Situación actual y recomendaciones", els.reportCurrent.value)}${healthReportSelected() ? healthReportFields.map(([key,label]) => section(label, healthReportInputs()[key].value)).join("") : ""}<div class="signature"><p>Carolina Sánchez Girona</p></div><p class="privacy">Documento confidencial que contiene datos de salud.</p>`);
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
        feedback = "Archivo compartido. Aviso por correo enviado.";
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
      if (isShared) info.append(create("span", "clinic-material-state", notice?.status === "sent" ? "Aviso por correo enviado" : notice?.status === "sending" ? "Aviso por correo en proceso" : notice?.status === "failed" ? "Aviso por correo no enviado" : "Sin aviso por correo"));
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

  els.logout.addEventListener("click", () => { saveSession(null); window.location.assign("/admin/clinica/acceso/?next=%2Fadmin%2Fclinica%2F%3Fpanel%3D1"); });
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
    const panelMode = new URL(window.location.href).searchParams.get("panel") === "1";
    if (!user) {
      saveSession(null);
      window.location.replace("/admin/clinica/acceso/?next=%2Fadmin%2Fclinica%2F%3Fpanel%3D1");
      return;
    }
    if (!panelMode) {
      window.location.replace("/admin/clinica/?panel=1");
      return;
    }
    showApp();
    const requestedView = new URL(window.location.href).searchParams.get("view");
    if (["today", "patients", "pending"].includes(requestedView)) setView(requestedView);
    loadData().catch((error) => setMessage(error.message));
  })();
})();
