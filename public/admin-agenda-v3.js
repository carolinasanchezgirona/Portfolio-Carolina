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
    login: $("#admin-login"), app: $("#admin-app"), loginForm: $("#admin-login-form"),
    email: $("#admin-email"), password: $("#admin-password"), loginMessage: $("#admin-login-message"),
    forgot: $("#admin-forgot-password"), logout: $("#admin-logout"), accessButton: $("#admin-access"),
    newButton: $("#admin-new"), todayNew: $("#today-new"), tomorrowNew: $("#tomorrow-new"), blockButton: $("#admin-block"), print: $("#admin-print"), prev: $("#week-prev"), next: $("#week-next"), today: $("#week-today"),
    weekTitle: $("#week-title"), weekSubtitle: $("#week-subtitle"), calendar: $("#week-calendar"), status: $("#admin-status"),
    total: $("#summary-total"), confirmed: $("#summary-confirmed"), pending: $("#summary-pending"), cancelled: $("#summary-cancelled"),
    dialog: $("#appointment-dialog"), dialogTitle: $("#dialog-title"), dialogClose: $("#dialog-close"),
    form: $("#appointment-form"), closeForm: $("#appointment-close"), cancelBooking: $("#appointment-cancel-booking"),
    repeatAppointment: $("#appointment-repeat"), finalizeFollowup: $("#appointment-finalize"),
    saveAppointment: $("#appointment-save"), message: $("#appointment-message"),
    id: $("#appointment-id"), date: $("#appointment-date"), time: $("#appointment-time"), name: $("#appointment-name"),
    patientEmail: $("#appointment-email"), phone: $("#appointment-phone"), service: $("#appointment-service"),
    appointmentStatus: $("#appointment-status"), patientType: $("#appointment-patient-type"), price: $("#appointment-price"),
    accessDialog: $("#access-dialog"), accessForm: $("#access-form"), accessClose: $("#access-close"), accessCancel: $("#access-cancel"),
    currentEmail: $("#access-current-email"), newEmail: $("#access-new-email"), newPassword: $("#access-new-password"),
    repeatPassword: $("#access-repeat-password"), accessMessage: $("#access-message"),
    viewToday: $("#view-today"), viewTomorrow: $("#view-tomorrow"), viewWeek: $("#view-week"), viewPatients: $("#view-patients"),
    todayView: $("#today-view"), tomorrowView: $("#tomorrow-view"), weekView: $("#week-view"), patientsView: $("#patients-view"),
    todayTitle: $("#today-title"), todaySummary: $("#today-summary"), todayList: $("#today-list"),
    tomorrowTitle: $("#tomorrow-title"), tomorrowSummary: $("#tomorrow-summary"), tomorrowList: $("#tomorrow-list"),
    patientSearch: $("#patient-search"), patientSearchStatus: $("#patient-search-status"), patientResults: $("#patient-results"),
    blockDialog: $("#block-dialog"), blockForm: $("#block-form"), blockClose: $("#block-close"), blockSave: $("#block-save"),
    blockFields: $("#block-fields"), blockMode: $("#block-mode"), blockDateLabel: $("#block-date-label"), blockDate: $("#block-date"),
    blockLastDateField: $("#block-last-date-field"), blockLastDate: $("#block-last-date"), blockHours: $("#block-hours"),
    blockStart: $("#block-start"), blockEnd: $("#block-end"), blockReason: $("#block-reason"), blockMessage: $("#block-message"),
    blockList: $("#block-list"), blockListStatus: $("#block-list-status"), blockFeedback: $("#agenda-block-feedback"),
  };

  let session = null;
  let currentUser = null;
  let appointments = [];
  let scheduleBlocks = [];
  let weekRequest = 0;
  let blockListRequest = 0;
  let blockBusy = false;
  let blockSaved = false;
  let pendingBlock = null;
  let currentAppointment = null;
  let weekStartKey = mondayKey(todayKey());

  const dateLong = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: ZONE });
  const blockDateFmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: ZONE });
  const dayShort = new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric", month: "short", timeZone: ZONE });
  const monthYear = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: ZONE });
  const timeFmt = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: ZONE });

  function todayKey() {
    const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: ZONE }).formatToParts(new Date());
    const obj = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return `${obj.year}-${obj.month}-${obj.day}`;
  }

  function addDaysKey(key, days) {
    const [y, m, d] = key.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + days, 12));
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
  }

  function mondayKey(key) {
    const [y, m, d] = key.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d, 12));
    const weekday = dt.getUTCDay() || 7;
    return addDaysKey(key, 1 - weekday);
  }

  function zoneOffsetMs(date) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: ZONE, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(date);
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

  function keyFromIso(iso) {
    const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: ZONE }).formatToParts(new Date(iso));
    const p = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${p.year}-${p.month}-${p.day}`;
  }

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }

  function saveSession(value) {
    session = value;
    if (value) sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
    else sessionStorage.removeItem(SESSION_KEY);
  }

  function authHeaders() {
    return { apikey: KEY, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" };
  }

  function setLoginMessage(text) { if (els.loginMessage) els.loginMessage.textContent = text || ""; }
  function setStatus(text) { if (els.status) els.status.textContent = text || ""; }
  function setFormMessage(text) { if (els.message) els.message.textContent = text || ""; }
  function setAccessMessage(text) { if (els.accessMessage) els.accessMessage.textContent = text || ""; }

  function ensureFutureCancelButton() {
    const existing = $("#appointment-cancel-future");
    if (existing) return existing;
    const actions = els.cancelBooking?.parentElement;
    if (!actions || !els.cancelBooking) return null;
    const button = document.createElement("button");
    button.id = "appointment-cancel-future";
    button.className = "admin-danger";
    button.type = "button";
    button.hidden = true;
    button.textContent = "Cancelar próximas citas";
    actions.insertBefore(button, els.cancelBooking);
    return button;
  }

  const cancelFutureButton = ensureFutureCancelButton();
  function setBlockMessage(element, message, error = false) {
    element.textContent = message;
    element.classList.toggle("is-error", error);
    if (element === els.blockFeedback) element.hidden = !message;
  }

  function setView(name) {
    const views = { today: els.todayView, tomorrow: els.tomorrowView, week: els.weekView, patients: els.patientsView };
    const target = views[name];
    if (!target) return;
    // Una sola vista visible, incluidas las añadidas dinámicamente (mes y espera).
    document.querySelectorAll(".admin-page .admin-view").forEach(view => { view.hidden = view !== target; });
    document.querySelectorAll(".admin-view-tabs button").forEach(button => {
      button.classList.toggle("active", button === ({ today: els.viewToday, tomorrow: els.viewTomorrow, week: els.viewWeek, patients: els.viewPatients })[name]);
    });
    if (name === "patients") els.patientSearch?.focus();
  }

  async function fetchCurrentUser() {
    if (!session?.access_token) return null;
    const response = await fetch(`${AUTH_URL}/user`, { headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
    if (!response.ok) return null;
    const user = await response.json();
    if(user?.id!==ALLOWED_USER_ID)return null;
    const gate=await fetch(SUPABASE_URL+"/rest/v1/rpc/admin_mobile_gate",{
      method:"POST",cache:"no-store",
      headers:{apikey:KEY,Authorization:"Bearer "+session.access_token,"Content-Type":"application/json"},
      body:"{}",
    }).catch(()=>null);
    if(!gate?.ok)return null;
    return await gate.json()===true?user:null;
  }

  async function signIn(email, password) {
    const response = await fetch(`${AUTH_URL}/token?grant_type=password`, {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error_description || body.msg || "No se ha podido iniciar sesión.");
    if (body.user?.id !== ALLOWED_USER_ID) throw new Error("Esta cuenta no tiene acceso al área administrativa.");
    saveSession(body);
    currentUser = body.user;
    const state=await fetch(`${AUTH_URL}/user`,{
      headers:{apikey:KEY,Authorization:"Bearer "+body.access_token},cache:"no-store",
    }).then(r=>r.json()).catch(()=>({}));
    if(Array.isArray(state.factors)&&state.factors.some(f=>f.factor_type==='totp'&&f.status==='verified')){
      window.location.assign('/admin/clinica/acceso/');
      throw new Error('Continúa la confirmación con Authenticator.');
    }
  }

  async function requestPasswordReset(email) {
    if (!email) throw new Error("Escribe primero el correo de acceso.");
    const redirectTo = `${window.location.origin}/admin/agenda/`;
    const response = await fetch(`${AUTH_URL}/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.msg || body.error_description || "No se ha podido enviar el correo de recuperación.");
  }

  function sessionFromRecoveryHash() {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (hash.get("type") !== "recovery" || !hash.get("access_token")) return null;
    return {
      access_token: hash.get("access_token"),
      refresh_token: hash.get("refresh_token"),
      token_type: hash.get("token_type") || "bearer",
      expires_in: Number(hash.get("expires_in") || 3600),
    };
  }

  async function updateAccount(payload) {
    const response = await fetch(`${AUTH_URL}/user`, {
      method: "PUT", headers: authHeaders(), body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.msg || body.error_description || body.message || "No se han podido guardar los cambios.");
    if (body?.id === ALLOWED_USER_ID) currentUser = body;
    return body;
  }

  function showApp() {
    if (els.login) els.login.hidden = true;
    els.app.hidden = false;
    const loading = document.querySelector("#admin-agenda-loading");
    if (loading) loading.hidden = true;
  }

  function showLogin() {
    els.app.hidden = true;
    if (els.login) els.login.hidden = true;
    const loading = document.querySelector("#admin-agenda-loading");
    if (loading) loading.hidden = false;
    window.location.replace("/admin/clinica/acceso/?next=" + encodeURIComponent("/admin/agenda/"));
  }

  function openAccess() {
    if (!els.accessDialog) return;
    els.currentEmail.value = currentUser?.email || "";
    els.newEmail.value = "";
    els.newPassword.value = "";
    els.repeatPassword.value = "";
    setAccessMessage("");
    els.accessDialog.showModal();
  }

  function serviceLabel(code) { return code === "neuropsicologia" ? "Neuropsicología" : "Psicología"; }
  function statusLabel(status) {
    return ({ confirmed: "Confirmada", pending: "Pendiente", cancelled: "Cancelada", canceled: "Cancelada", completed: "Realizada", no_show: "No presentado", rescheduled: "Reprogramada" })[status] || status;
  }

  async function loadWeek() {
    const request = ++weekRequest;
    setStatus("Cargando agenda…");
    const start = madridLocalToIso(weekStartKey, "00:00");
    const end = madridLocalToIso(addDaysKey(weekStartKey, 7), "00:00");
    const select = "id,patient_name,patient_email,patient_phone,patient_type,status,starts_at,ends_at,price_eur,service_code,created_by_admin";
    const url = `${REST_URL}/appointment_bookings?select=${encodeURIComponent(select)}&starts_at=gte.${encodeURIComponent(start)}&starts_at=lt.${encodeURIComponent(end)}&order=starts_at.asc`;
    const blockUrl = `${REST_URL}/appointment_schedule_blocks?select=id,starts_at,ends_at,reason&starts_at=lt.${encodeURIComponent(end)}&ends_at=gt.${encodeURIComponent(start)}&order=starts_at.asc`;
    const [response, blocksResponse] = await Promise.all([
      fetch(url, { headers: authHeaders(), cache: "no-store" }),
      fetch(blockUrl, { headers: authHeaders(), cache: "no-store" }),
    ]);
    if (response.status === 401) {
      saveSession(null); currentUser = null; showLogin(); throw new Error("La sesión ha caducado. Vuelve a entrar.");
    }
    const body = await response.json().catch(() => []);
    if (!response.ok) throw new Error(body.message || "No se ha podido cargar la agenda.");
    const blocksBody = blocksResponse.ok ? await blocksResponse.json().catch(() => null) : null;
    const blocksReadable = Array.isArray(blocksBody);
    if (request !== weekRequest) return;
    appointments = body;
    scheduleBlocks = blocksReadable ? blocksBody : [];
    renderWeek();
    renderToday();
    renderTomorrow();
    setStatus(blocksReadable
      ? ""
      : "Citas cargadas, pero no se han podido verificar los bloqueos. No interpretes los huecos como disponibles hasta actualizar.");
  }

  function renderWeek() {
    const firstDate = new Date(madridLocalToIso(weekStartKey, "12:00"));
    const lastKey = addDaysKey(weekStartKey, 6);
    const lastDate = new Date(madridLocalToIso(lastKey, "12:00"));
    els.weekTitle.textContent = `Semana del ${dayShort.format(firstDate)} al ${dayShort.format(lastDate)}`;
    els.weekSubtitle.textContent = monthYear.format(firstDate);
    els.total.textContent = String(appointments.filter((a) => !["cancelled", "canceled"].includes(a.status)).length);
    els.confirmed.textContent = String(appointments.filter((a) => a.status === "confirmed").length);
    els.pending.textContent = String(appointments.filter((a) => a.status === "pending").length);
    els.cancelled.textContent = String(appointments.filter((a) => ["cancelled", "canceled"].includes(a.status)).length);

    els.calendar.replaceChildren();
    for (let i = 0; i < 7; i += 1) {
      const key = addDaysKey(weekStartKey, i);
      const instant = new Date(madridLocalToIso(key, "12:00"));
      const dayAppointments = appointments.filter((a) => keyFromIso(a.starts_at) === key && !["cancelled", "canceled"].includes(a.status));
      const dayBlocks = blocksForDay(key);
      const column = document.createElement("article");
      column.className = "calendar-day-column";
      const head = document.createElement("div");
      head.className = "calendar-day-head";
      head.innerHTML = `<strong>${dateLong.format(instant)}</strong><span>${dayAppointments.length} ${dayAppointments.length === 1 ? "cita" : "citas"}</span>`;
      const body = document.createElement("div");
      body.className = "calendar-day-body";
      if (!dayAppointments.length) {
        const empty = document.createElement("div"); empty.className = "empty-day"; empty.textContent = "Sin citas"; body.append(empty);
      }
      dayBlocks.forEach((block) => body.append(createBlockCard(block, key)));
      dayAppointments.forEach((appointment) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `appointment-card${appointment.service_code === "neuropsicologia" ? " neuro" : ""}${["cancelled", "canceled"].includes(appointment.status) ? " cancelled" : ""}`;
        button.innerHTML = `<time>${timeFmt.format(new Date(appointment.starts_at))}</time><strong>${escapeHtml(appointment.patient_name)}</strong><small>${serviceLabel(appointment.service_code)} · ${statusLabel(appointment.status)}</small><span class="appointment-card-action">Ver o modificar</span>`;
        button.addEventListener("click", () => openEdit(appointment));
        body.append(button);
      });
      column.append(head, body);
      els.calendar.append(column);
    }
  }

  function createAppointmentCard(appointment, compact = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `appointment-card${compact ? " compact" : ""}${appointment.service_code === "neuropsicologia" ? " neuro" : ""}${["cancelled", "canceled"].includes(appointment.status) ? " cancelled" : ""}`;
    button.innerHTML = `<time>${timeFmt.format(new Date(appointment.starts_at))}</time><strong>${escapeHtml(appointment.patient_name)}</strong><small>${serviceLabel(appointment.service_code)} · ${statusLabel(appointment.status)}</small><span class="appointment-card-action">Ver o modificar</span>`;
    button.addEventListener("click", () => openEdit(appointment));
    return button;
  }

  function patientIdentityMatches(a, b) {
    const emailA = (a.patient_email || "").trim().toLowerCase();
    const emailB = (b.patient_email || "").trim().toLowerCase();
    const phoneA = (a.patient_phone || "").replace(/\D/g, "");
    const phoneB = (b.patient_phone || "").replace(/\D/g, "");
    const nameA = (a.patient_name || "").trim().toLowerCase();
    const nameB = (b.patient_name || "").trim().toLowerCase();
    if (emailA && emailB) return emailA === emailB;
    if (phoneA && phoneB) return phoneA === phoneB;
    return nameA && nameA === nameB;
  }

  async function findFutureAppointment(appointment) {
    const start = new Date();
    const end = new Date(start.getTime() + 180 * 24 * 60 * 60 * 1000);
    const select = "id,patient_name,patient_email,patient_phone,status,starts_at";
    const url = `${REST_URL}/appointment_bookings?select=${encodeURIComponent(select)}&starts_at=gt.${encodeURIComponent(start.toISOString())}&starts_at=lt.${encodeURIComponent(end.toISOString())}&status=in.(confirmed,pending,rescheduled)&order=starts_at.asc&limit=100`;
    const response = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    const rows = await response.json().catch(() => []);
    if (!response.ok) return null;
    return rows.find((row) => patientIdentityMatches(appointment, row) && row.id !== appointment.id) || null;
  }

  async function quickSetStatus(appointment, status) {
    if (!appointment?.id || ["cancelled", "canceled"].includes(appointment.status)) return;
    const label = status === "completed" ? "realizada" : "no presentado";
    const confirmed = window.confirm(`¿Marcar la cita de ${appointment.patient_name} como ${label}?`);
    if (!confirmed) return;

    try {
      await rpc("admin_update_appointment", {
        p_id: appointment.id,
        p_starts_at: appointment.starts_at,
        p_patient_name: appointment.patient_name,
        p_patient_email: appointment.patient_email || null,
        p_patient_phone: appointment.patient_phone || null,
        p_patient_type: appointment.patient_type || "existing",
        p_service_code: appointment.service_code || "psicologia_general_sanitaria",
        p_status: status,
        p_price_eur: Number(appointment.price_eur ?? 60),
      });
      appointment.status = status;
      await loadWeek();

      if (status === "completed") {
        const next = await findFutureAppointment(appointment);
        if (!next) {
          window.alert(`Sesión marcada como realizada. ${appointment.patient_name} no tiene una próxima cita programada.`);
        }
      }
    } catch (error) {
      window.alert(error.message || "No se ha podido actualizar la cita.");
    }
  }

  function createDayAppointmentCard(appointment, allowQuickActions = true) {
    const card = document.createElement("article");
    card.className = `appointment-card day-card${appointment.service_code === "neuropsicologia" ? " neuro" : ""}${["cancelled", "canceled"].includes(appointment.status) ? " cancelled" : ""}`;
    card.innerHTML = `
      <button type="button" class="day-card-main">
        <time>${timeFmt.format(new Date(appointment.starts_at))}</time>
        <strong>${escapeHtml(appointment.patient_name)}</strong>
        <small>${serviceLabel(appointment.service_code)} · ${statusLabel(appointment.status)}</small>
        <span class="appointment-card-action">Ver o modificar</span>
      </button>
      <div class="day-card-actions">
        <button type="button" class="quick-complete">Realizada</button>
        <button type="button" class="quick-noshow">No presentado</button>
      </div>`;
    card.querySelector(".day-card-main")?.addEventListener("click", () => openEdit(appointment));
    const active = !["cancelled", "canceled", "completed", "no_show"].includes(appointment.status);
    const complete = card.querySelector(".quick-complete");
    const noShow = card.querySelector(".quick-noshow");
    if (!active || !allowQuickActions) {
      complete?.setAttribute("hidden", "");
      noShow?.setAttribute("hidden", "");
    } else {
      complete?.addEventListener("click", () => quickSetStatus(appointment, "completed"));
      noShow?.addEventListener("click", () => quickSetStatus(appointment, "no_show"));
    }
    return card;
  }

  function blocksForDay(key) {
    const start = Date.parse(madridLocalToIso(key, "00:00"));
    const end = Date.parse(madridLocalToIso(addDaysKey(key, 1), "00:00"));
    return scheduleBlocks.filter((block) => Date.parse(block.starts_at) < end && Date.parse(block.ends_at) > start);
  }

  function describeBlock(block, dayKey) {
    const start = new Date(block.starts_at);
    const end = new Date(block.ends_at);
    const startKey = keyFromIso(start);
    const endKey = keyFromIso(end);
    const startTime = timeFmt.format(start);
    const endTime = timeFmt.format(end);
    if (dayKey) {
      const from = dayKey === startKey ? startTime : "00:00";
      const to = dayKey === endKey ? endTime : "24:00";
      return from === "00:00" && to === "24:00" ? "Día completo" : `${from}–${to}`;
    }
    if (startTime === "00:00" && endTime === "00:00" && startKey !== endKey) {
      const lastDay = new Date(end.getTime() - 1);
      if (keyFromIso(lastDay) === startKey) return `${blockDateFmt.format(start)} · Día completo`;
      return `Del ${blockDateFmt.format(start)} al ${blockDateFmt.format(lastDay)}`;
    }
    if (startKey === endKey) return `${blockDateFmt.format(start)} · ${startTime}–${endTime}`;
    return `Del ${blockDateFmt.format(start)} a las ${startTime} al ${blockDateFmt.format(end)} a las ${endTime}`;
  }

  function createBlockCard(block, dayKey) {
    const card = document.createElement("article");
    card.className = "schedule-block-card";
    card.innerHTML = `<div><time>${escapeHtml(describeBlock(block, dayKey))}</time><strong>${escapeHtml(block.reason || "Horario bloqueado")}</strong></div><button type="button">Liberar</button>`;
    const button = card.querySelector("button");
    button.setAttribute("aria-label", `Liberar bloqueo: ${describeBlock(block)}`);
    button.addEventListener("click", () => deleteBlock(block, button));
    return card;
  }

  function renderDay(key, titleEl, summaryEl, listEl, emptyLabel, allowQuickActions = false) {
    const dayAppointments = appointments.filter((a) => keyFromIso(a.starts_at) === key && !["cancelled", "canceled"].includes(a.status));
    const active = dayAppointments.filter((a) => !["cancelled", "canceled"].includes(a.status));
    titleEl.textContent = dateLong.format(new Date(madridLocalToIso(key, "12:00")));
    summaryEl.innerHTML = `<article><strong>${active.length}</strong><span>Citas activas</span></article><article><strong>${active.filter((a) => a.status === "confirmed").length}</strong><span>Confirmadas</span></article><article><strong>${active.filter((a) => a.status === "pending").length}</strong><span>Pendientes</span></article>`;
    listEl.replaceChildren();
    const dayBlocks = blocksForDay(key);
    dayBlocks.forEach((block) => listEl.append(createBlockCard(block, key)));
    dayAppointments.forEach((a) => listEl.append(createDayAppointmentCard(a, allowQuickActions)));
    if (!dayAppointments.length && !dayBlocks.length) {
      listEl.innerHTML = `<div class="empty-today"><strong>No hay citas ${emptyLabel}</strong><span>Puedes añadir una cita o bloquear una franja.</span></div>`;
    }
  }

  function renderToday() {
    renderDay(todayKey(), els.todayTitle, els.todaySummary, els.todayList, "hoy", true);
  }

  function renderTomorrow() {
    const key = addDaysKey(todayKey(), 1);
    renderDay(key, els.tomorrowTitle, els.tomorrowSummary, els.tomorrowList, "mañana", false);
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);
  }

  function openNew(dateKey = todayKey()) {
    els.form.reset();
    els.id.value = "";
    els.dialogTitle.textContent = "Nueva cita";
    els.date.value = dateKey;
    els.time.value = "09:00";
    els.service.value = "psicologia_general_sanitaria";
    els.appointmentStatus.value = "confirmed";
    els.patientType.value = "existing";
    els.price.value = "60";
    currentAppointment = null;
    els.cancelBooking.hidden = true;
    if (els.repeatAppointment) els.repeatAppointment.hidden = true;
    if (els.finalizeFollowup) els.finalizeFollowup.hidden = true;
    if (cancelFutureButton) cancelFutureButton.hidden = true;
    els.saveAppointment.textContent = "Crear cita";
    setFormMessage("");
    els.dialog.showModal();
  }

  function openEdit(a) {
    currentAppointment = a;
    els.id.value = a.id;
    els.dialogTitle.textContent = "Modificar cita";
    els.date.value = keyFromIso(a.starts_at);
    els.time.value = timeFmt.format(new Date(a.starts_at));
    els.name.value = a.patient_name || "";
    els.patientEmail.value = a.patient_email || "";
    els.phone.value = a.patient_phone || "";
    els.service.value = a.service_code || "psicologia_general_sanitaria";
    els.appointmentStatus.value = a.status === "canceled" ? "cancelled" : a.status;
    els.patientType.value = a.patient_type || "existing";
    els.price.value = a.price_eur ?? 60;
    els.cancelBooking.hidden = ["cancelled", "canceled"].includes(a.status);
    if (els.repeatAppointment) els.repeatAppointment.hidden = false;
    if (els.finalizeFollowup) els.finalizeFollowup.hidden = false;
    if (cancelFutureButton) cancelFutureButton.hidden = true;
    els.saveAppointment.textContent = "Guardar cambios";
    setFormMessage("");
    els.dialog.showModal();
  }

  async function rpc(name, body) {
    const response = await fetch(`${REST_URL}/rpc/${name}`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.hint || "No se ha podido guardar la cita.");
    window.dispatchEvent(new Event("agenda:appointments-changed"));
    return data;
  }

  async function checkAppointmentConflict(startsAt, ignoreId = null) {
    const start = new Date(startsAt);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const dayKey = keyFromIso(startsAt);
    // Incluir el día anterior por si una cita cruza la medianoche.
    const dayStart = madridLocalToIso(addDaysKey(dayKey, -1), "00:00");
    const dayEnd = madridLocalToIso(addDaysKey(dayKey, 1), "00:00");
    const select = "id,patient_name,status,starts_at,ends_at";
    const appointmentUrl = `${REST_URL}/appointment_bookings?select=${encodeURIComponent(select)}&starts_at=gte.${encodeURIComponent(dayStart)}&starts_at=lt.${encodeURIComponent(dayEnd)}&order=starts_at.asc`;
    const blockUrl = `${REST_URL}/appointment_schedule_blocks?select=id,starts_at,ends_at,reason&starts_at=lt.${encodeURIComponent(end.toISOString())}&ends_at=gt.${encodeURIComponent(start.toISOString())}`;
    const [appointmentResponse, blockResponse] = await Promise.all([
      fetch(appointmentUrl, { headers: authHeaders(), cache: "no-store" }),
      fetch(blockUrl, { headers: authHeaders(), cache: "no-store" }),
    ]);
    // Si alguna consulta falla, nunca asumir que el horario está libre.
    if (!appointmentResponse.ok || !blockResponse.ok) {
      throw new Error("No se han podido verificar las citas y los bloqueos de ese horario. No se ha guardado ningún cambio. Actualiza la agenda e inténtalo de nuevo.");
    }
    const rows = await appointmentResponse.json().catch(() => null);
    const blocks = await blockResponse.json().catch(() => null);
    if (!Array.isArray(rows) || !Array.isArray(blocks)) {
      throw new Error("La respuesta al comprobar disponibilidad no es válida. No se ha guardado ningún cambio.");
    }

    const conflict = rows.find((row) => {
      if (row.id === ignoreId || ["cancelled", "canceled", "completed", "no_show"].includes(row.status)) return false;
      const rowStart = new Date(row.starts_at);
      const rowEnd = row.ends_at ? new Date(row.ends_at) : new Date(rowStart.getTime() + 60 * 60 * 1000);
      return rowStart < end && rowEnd > start;
    });

    if (conflict) {
      return `Ya existe una cita de ${conflict.patient_name} a las ${timeFmt.format(new Date(conflict.starts_at))}.`;
    }
    if (blocks.length) {
      return `Ese horario coincide con un bloqueo de agenda${blocks[0].reason ? `: ${blocks[0].reason}` : "."}`;
    }
    return "";
  }

  async function saveAppointment() {
    const startsAt = madridLocalToIso(els.date.value, els.time.value);
    // Una cancelación debe seguir siendo posible si falla el servicio de disponibilidad.
    const cancelling = ["cancelled", "canceled"].includes(els.appointmentStatus.value);
    const conflictMessage = cancelling ? "" : await checkAppointmentConflict(startsAt, els.id.value || null);
    if (conflictMessage && !window.confirm(`${conflictMessage}\n\n¿Quieres guardar la cita de todos modos?`)) {
      throw new Error("No se ha guardado la cita para evitar un solapamiento.");
    }
    const common = {
      p_starts_at: startsAt,
      p_patient_name: els.name.value.trim(),
      p_patient_email: els.patientEmail.value.trim() || null,
      p_patient_phone: els.phone.value.trim() || null,
      p_patient_type: els.patientType.value,
      p_service_code: els.service.value,
      p_status: els.appointmentStatus.value,
      p_price_eur: Number(els.price.value || 60),
    };
    const editedAppointment = currentAppointment;
    if (els.id.value) await rpc("admin_update_appointment", { p_id: els.id.value, ...common });
    else await rpc("admin_create_appointment", common);

    if (common.p_status === "completed" && editedAppointment) {
      const next = await findFutureAppointment({ ...editedAppointment, status: "completed", starts_at: startsAt });
      if (!next) {
        window.alert(`Sesión marcada como realizada. ${common.p_patient_name} no tiene una próxima cita programada.`);
      }
    }
  }

  function repeatCurrentAppointment() {
    if (!currentAppointment) return;
    const originalDate = keyFromIso(currentAppointment.starts_at);
    const originalTime = timeFmt.format(new Date(currentAppointment.starts_at));

    els.id.value = "";
    els.dialogTitle.textContent = "Repetir cita";
    els.date.value = addDaysKey(originalDate, 7);
    els.time.value = originalTime;
    els.appointmentStatus.value = "confirmed";
    els.patientType.value = "existing";
    els.cancelBooking.hidden = true;
    if (els.repeatAppointment) els.repeatAppointment.hidden = true;
    if (els.finalizeFollowup) els.finalizeFollowup.hidden = true;
    if (cancelFutureButton) cancelFutureButton.hidden = true;
    els.saveAppointment.textContent = "Crear cita";
    setFormMessage("He preparado una copia para dentro de 7 días. Puedes cambiar la fecha antes de guardarla.");
    currentAppointment = null;
  }

  async function finalizeFollowup(appointment = currentAppointment) {
    if (!appointment?.id) return;
    const patientName = appointment.patient_name || "esta paciente";
    const confirmed = window.confirm(
      `¿Finalizar el seguimiento de ${patientName}? Se conservará todo el historial y se cancelarán las citas futuras activas. Esta acción no borra ninguna cita.`
    );
    if (!confirmed) return;

    if (els.finalizeFollowup) els.finalizeFollowup.disabled = true;
    els.cancelBooking.disabled = true;
    els.saveAppointment.disabled = true;
    setFormMessage("Finalizando seguimiento…");

    try {
      const count = Number(await rpc("admin_cancel_future_patient_appointments", {
        p_id: appointment.id,
        p_include_selected: true,
      })) || 0;

      setFormMessage(
        count
          ? `Seguimiento finalizado. Se han cancelado ${count} cita${count === 1 ? "" : "s"} futura${count === 1 ? "" : "s"}.`
          : "Seguimiento finalizado. No había citas futuras activas."
      );
      await loadWeek();
      if (els.patientSearch?.value.trim().length >= 2) {
        await searchPatients(els.patientSearch.value);
      }
      setTimeout(() => els.dialog.open && els.dialog.close(), 450);
    } catch (error) {
      setFormMessage(error.message || "No se ha podido finalizar el seguimiento.");
    } finally {
      if (els.finalizeFollowup) els.finalizeFollowup.disabled = false;
      els.cancelBooking.disabled = false;
      els.saveAppointment.disabled = false;
    }
  }

  async function cancelAppointment() {
    if (!els.id.value) return;
    const patientName = els.name.value.trim() || "esta persona";
    const confirmed = window.confirm(`¿Cancelar la cita de ${patientName}? La cita permanecerá registrada como cancelada y ese horario volverá a quedar disponible.`);
    if (!confirmed) return;

    els.cancelBooking.disabled = true;
    els.saveAppointment.disabled = true;
    setFormMessage("Cancelando cita…");
    try {
      els.appointmentStatus.value = "cancelled";
      await saveAppointment();
      window.adminUX?.saved("appointment-form");
      els.dialog.close();
      await loadWeek();
    } catch (error) {
      setFormMessage(error.message);
    } finally {
      els.cancelBooking.disabled = false;
      els.saveAppointment.disabled = false;
    }
  }

  async function cancelFutureAppointments() {
    if (!els.id.value) return;
    const patientName = currentAppointment?.patient_name || els.name.value.trim() || "esta paciente";
    const confirmed = window.confirm(
      `¿Cancelar todas las citas activas posteriores a la visita seleccionada de ${patientName}? La visita seleccionada y el historial anterior se conservarán sin cambios.`
    );
    if (!confirmed) return;

    if (cancelFutureButton) cancelFutureButton.disabled = true;
    els.cancelBooking.disabled = true;
    els.saveAppointment.disabled = true;
    setFormMessage("Cancelando próximas citas…");

    try {
      const count = Number(await rpc("admin_cancel_future_patient_appointments", {
        p_id: els.id.value,
        p_include_selected: false,
      })) || 0;

      if (count === 0) {
        setFormMessage("No hay citas futuras activas de esta paciente después de la visita seleccionada.");
        return;
      }

      setFormMessage(`Se han cancelado ${count} cita${count === 1 ? "" : "s"} futura${count === 1 ? "" : "s"}.`);
      await loadWeek();
      setTimeout(() => els.dialog.close(), 350);
    } catch (error) {
      setFormMessage(error.message || "No se han podido cancelar las citas futuras.");
    } finally {
      if (cancelFutureButton) cancelFutureButton.disabled = false;
      els.cancelBooking.disabled = false;
      els.saveAppointment.disabled = false;
    }
  }

  function updateBlockFields() {
    const hours = els.blockMode.value === "hours";
    const period = els.blockMode.value === "period";
    els.blockDateLabel.textContent = period ? "Primer día" : "Fecha";
    els.blockHours.hidden = !hours;
    els.blockStart.disabled = els.blockEnd.disabled = !hours;
    els.blockLastDateField.hidden = !period;
    els.blockLastDate.disabled = !period;
    els.blockLastDate.required = period;
    els.blockLastDate.min = els.blockDate.value;
    if (period && (!els.blockLastDate.value || els.blockLastDate.value < els.blockDate.value)) {
      els.blockLastDate.value = els.blockDate.value;
    }
  }

  function openBlock() {
    if (blockBusy) return;
    els.blockForm.reset();
    els.blockDate.value = els.tomorrowView.hidden ? todayKey() : addDaysKey(todayKey(), 1);
    els.blockStart.value = "09:00";
    els.blockEnd.value = "10:00";
    pendingBlock = null;
    blockSaved = false;
    setBlockBusy(false);
    updateBlockFields();
    setBlockMessage(els.blockMessage, "");
    setBlockMessage(els.blockFeedback, "");
    els.blockDialog.showModal();
    els.blockMode.focus();
    loadBlockList();
  }

  async function loadBlockList() {
    const request = ++blockListRequest;
    const now = encodeURIComponent(new Date().toISOString());
    els.blockList.replaceChildren();
    setBlockMessage(els.blockListStatus, "Cargando bloqueos…");
    try {
      const response = await fetch(`${REST_URL}/appointment_schedule_blocks?select=id,starts_at,ends_at,reason&ends_at=gt.${now}&order=starts_at.asc,id.asc`, {
        headers: authHeaders(), cache: "no-store",
      });
      if (!response.ok) throw new Error();
      const blocks = await response.json();
      if (request !== blockListRequest) return;
      els.blockList.replaceChildren(...blocks.map((block) => createBlockCard(block)));
      setBlockMessage(els.blockListStatus, blocks.length ? "" : "No hay bloqueos activos ni próximos.");
    } catch {
      if (request === blockListRequest) setBlockMessage(els.blockListStatus, "No se han podido cargar los bloqueos. Vuelve a abrir este apartado para reintentar.", true);
    }
  }

  async function createBlock() {
    const date = els.blockDate.value;
    const mode = els.blockMode.value;
    const hours = mode === "hours";
    const endDate = hours ? date : addDaysKey(mode === "period" ? els.blockLastDate.value : date, 1);
    const from = hours ? els.blockStart.value : "00:00";
    const to = hours ? els.blockEnd.value : "00:00";
    const startsAt = madridLocalToIso(date, from);
    const endsAt = madridLocalToIso(endDate, to);
    if (hours && (timeFmt.format(new Date(startsAt)) !== from || timeFmt.format(new Date(endsAt)) !== to)) {
      throw new Error("Alguna de las horas elegidas no existe ese día por el cambio de hora.");
    }
    if (endsAt <= startsAt) throw new Error("La hora final debe ser posterior a la inicial.");
    const block = { starts_at: startsAt, ends_at: endsAt, reason: els.blockReason.value.trim() || null };
    const data = JSON.stringify(block);
    if (pendingBlock?.data !== data) pendingBlock = { data, id: crypto.randomUUID() };
    const response = await fetch(`${REST_URL}/appointment_schedule_blocks`, {
      method: "POST",
      headers: { ...authHeaders(), Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({ id: pendingBlock.id, ...block }),
    });
    if (!response.ok) throw new Error("No se ha podido guardar el bloqueo. Comprueba que tu sesión sigue activa y vuelve a intentarlo.");
    pendingBlock = null;
  }

  function setBlockBusy(busy) {
    blockBusy = busy;
    els.blockFields.disabled = busy;
    els.blockSave.disabled = busy || blockSaved;
    els.blockClose.disabled = busy;
  }

  function refreshBlocks() {
    window.dispatchEvent(new Event("agenda:blocks-changed"));
    loadWeek().catch((error) => setStatus(error.message));
    if (els.blockDialog.open) loadBlockList();
  }

  async function deleteBlock(block, button) {
    if (blockBusy || !window.confirm(`¿Liberar este bloqueo? ${describeBlock(block)}`)) return;
    const feedback = els.blockDialog.open ? els.blockMessage : els.blockFeedback;
    setBlockBusy(true);
    button.disabled = true;
    setBlockMessage(feedback, "Liberando horario…");
    try {
      const response = await fetch(`${REST_URL}/appointment_schedule_blocks?id=eq.${encodeURIComponent(block.id)}&select=id`, {
        method: "DELETE", headers: { ...authHeaders(), Prefer: "return=representation" },
      });
      if (!response.ok || !(await response.json()).some((row) => row.id === block.id)) throw new Error();
      setBlockMessage(feedback, "Bloqueo liberado.");
      refreshBlocks();
    } catch {
      setBlockMessage(feedback, "No se ha podido liberar el bloqueo. Actualiza la agenda para comprobar su estado.", true);
    } finally {
      button.disabled = false;
      setBlockBusy(false);
    }
  }

  let searchTimer = null;
  async function searchPatients(query) {
    const term = query.trim();
    els.patientResults.replaceChildren();
    if (term.length < 2) {
      els.patientSearchStatus.textContent = "Escribe al menos dos caracteres.";
      return;
    }
    els.patientSearchStatus.textContent = "Buscando…";
    const safe = term.replace(/[,%()]/g, " ").trim();
    const filter = `patient_name.ilike.*${safe}*,patient_email.ilike.*${safe}*,patient_phone.ilike.*${safe}*`;
    const select = "id,patient_name,patient_email,patient_phone,patient_type,status,starts_at,ends_at,price_eur,service_code,created_by_admin";
    const url = `${REST_URL}/appointment_bookings?select=${encodeURIComponent(select)}&or=(${encodeURIComponent(filter)})&order=starts_at.desc&limit=100`;
    const response = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    const rows = await response.json().catch(() => []);
    if (!response.ok) {
      els.patientSearchStatus.textContent = rows.message || "No se ha podido realizar la búsqueda.";
      return;
    }
    const groups = new Map();
    rows.forEach((row) => {
      const key = `${(row.patient_email || "").toLowerCase()}|${row.patient_phone || ""}|${row.patient_name.toLowerCase()}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    });
    els.patientSearchStatus.textContent = groups.size ? `${groups.size} ${groups.size === 1 ? "paciente encontrado" : "pacientes encontrados"}.` : "No hay resultados.";
    groups.forEach((items) => {
      const latest = items[0];
      const section = document.createElement("article");
      section.className = "patient-history-card";

      const now = new Date();
      const nonCancelled = items.filter((item) => !["cancelled", "canceled"].includes(item.status));
      const past = nonCancelled
        .filter((item) => new Date(item.starts_at) <= now)
        .sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at));
      const future = nonCancelled
        .filter((item) => new Date(item.starts_at) > now && ["confirmed", "pending", "rescheduled"].includes(item.status))
        .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));

      const lastAppointment = past[0] || null;
      const nextAppointment = future[0] || null;
      const lastText = lastAppointment
        ? `${dateLong.format(new Date(lastAppointment.starts_at))} · ${timeFmt.format(new Date(lastAppointment.starts_at))}`
        : "Sin sesiones previas";
      const nextText = nextAppointment
        ? `${dateLong.format(new Date(nextAppointment.starts_at))} · ${timeFmt.format(new Date(nextAppointment.starts_at))}`
        : "Sin próxima cita";

      section.innerHTML = `<header><div class="patient-history-main"><strong>${escapeHtml(latest.patient_name)}</strong><span>${escapeHtml(latest.patient_email || "Sin correo")} · ${escapeHtml(latest.patient_phone || "Sin teléfono")}</span><div class="patient-session-summary"><span><b>Última</b> ${escapeHtml(lastText)}</span><span><b>Próxima</b> ${escapeHtml(nextText)}</span></div></div><div class="patient-history-actions"><b>${items.length} ${items.length === 1 ? "cita" : "citas"}</b><button type="button" class="admin-danger patient-finalize">Finalizar seguimiento</button></div></header><div class="patient-history-list"></div>`;
      const finalizeButton = section.querySelector(".patient-finalize");
      finalizeButton?.addEventListener("click", async (event) => {
        event.stopPropagation();
        const anchor = nextAppointment || latest;
        await finalizeFollowup(anchor);
      });
      const list = section.querySelector(".patient-history-list");
      items.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.innerHTML = `<time>${dateLong.format(new Date(item.starts_at))} · ${timeFmt.format(new Date(item.starts_at))}</time><span>${serviceLabel(item.service_code)} · ${statusLabel(item.status)}</span>`;
        button.addEventListener("click", () => openEdit(item));
        list.append(button);
      });
      els.patientResults.append(section);
    });
  }

  els.loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoginMessage("Entrando…");
    try {
      await signIn(els.email.value.trim(), els.password.value);
      els.password.value = "";
      const next = new URL(window.location.href).searchParams.get("next");
      if (next && next.startsWith("/admin/")) {
        window.location.assign(next);
        return;
      }
      showApp();
      await loadWeek();
      setLoginMessage("");
    } catch (error) { setLoginMessage(error.message); }
  });

  els.forgot?.addEventListener("click", async () => {
    setLoginMessage("Enviando correo de recuperación…");
    try {
      await requestPasswordReset(els.email.value.trim());
      setLoginMessage("Te he enviado un correo para crear una contraseña nueva.");
    } catch (error) { setLoginMessage(error.message); }
  });

  els.logout?.addEventListener("click", () => { saveSession(null); currentUser = null; appointments = []; window.location.assign("/admin/clinica/acceso/"); });
  els.accessButton?.addEventListener("click", openAccess);
  els.newButton?.addEventListener("click", () => openNew(todayKey()));
  window.addEventListener("agenda:edit-appointment", (event) => openEdit(event.detail));
  els.todayNew?.addEventListener("click", () => openNew(todayKey()));
  els.tomorrowNew?.addEventListener("click", () => openNew(addDaysKey(todayKey(), 1)));
  els.blockButton?.addEventListener("click", openBlock);
  els.viewToday?.addEventListener("click", async () => {
    setView("today");
    if (weekStartKey !== mondayKey(todayKey())) {
      weekStartKey = mondayKey(todayKey());
      await loadWeek().catch((e) => setStatus(e.message));
    }
  });
  els.viewTomorrow?.addEventListener("click", async () => {
    setView("tomorrow");
    const tomorrowWeek = mondayKey(addDaysKey(todayKey(), 1));
    if (weekStartKey !== tomorrowWeek) {
      weekStartKey = tomorrowWeek;
      await loadWeek().catch((e) => setStatus(e.message));
    }
  });
  els.viewWeek?.addEventListener("click", () => setView("week"));
  els.viewPatients?.addEventListener("click", () => setView("patients"));
  els.patientSearch?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => searchPatients(els.patientSearch.value), 250);
  });
  els.print?.addEventListener("click", () => window.print());
  els.prev?.addEventListener("click", async () => { weekStartKey = addDaysKey(weekStartKey, -7); await loadWeek().catch((e) => setStatus(e.message)); });
  els.next?.addEventListener("click", async () => { weekStartKey = addDaysKey(weekStartKey, 7); await loadWeek().catch((e) => setStatus(e.message)); });
  els.today?.addEventListener("click", async () => { weekStartKey = mondayKey(todayKey()); await loadWeek().catch((e) => setStatus(e.message)); });
  els.dialogClose?.addEventListener("click", () => els.dialog.close());
  els.closeForm?.addEventListener("click", () => els.dialog.close());
  els.cancelBooking?.addEventListener("click", cancelAppointment);
  els.repeatAppointment?.addEventListener("click", repeatCurrentAppointment);
  els.finalizeFollowup?.addEventListener("click", () => finalizeFollowup(currentAppointment));
  cancelFutureButton?.addEventListener("click", cancelFutureAppointments);
  els.blockClose?.addEventListener("click", () => els.blockDialog.close());
  els.blockDialog?.addEventListener("cancel", (event) => {
    if (blockBusy) event.preventDefault();
  });
  els.blockForm?.addEventListener("input", () => {
    if (!blockSaved) return;
    blockSaved = false;
    els.blockSave.disabled = blockBusy;
    setBlockMessage(els.blockMessage, "");
  });
  els.blockMode?.addEventListener("change", updateBlockFields);
  els.blockDate?.addEventListener("change", updateBlockFields);
  els.accessClose?.addEventListener("click", () => els.accessDialog.close());
  els.accessCancel?.addEventListener("click", () => els.accessDialog.close());

  els.form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!els.form.reportValidity()) return;
    els.saveAppointment.disabled = true;
    els.cancelBooking.disabled = true;
    setFormMessage("Guardando…");
    try {
      await saveAppointment();
      window.adminUX?.saved("appointment-form");
      els.dialog.close();
      weekStartKey = mondayKey(els.date.value);
      await loadWeek();
    } catch (error) {
      setFormMessage(error.message);
    } finally {
      els.saveAppointment.disabled = false;
      els.cancelBooking.disabled = false;
    }
  });

  els.blockForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (blockBusy || blockSaved || !els.blockForm.reportValidity()) return;
    setBlockBusy(true);
    setBlockMessage(els.blockMessage, "Guardando bloqueo…");
    try {
      await createBlock();
      blockSaved = true;
      els.blockReason.value = "";
      window.adminUX?.saved("block-form");
      setBlockMessage(els.blockMessage, "Bloqueo guardado.");
      refreshBlocks();
    } catch (error) {
      setBlockMessage(els.blockMessage, error.message, true);
    } finally {
      setBlockBusy(false);
    }
  });

  els.accessForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = els.newEmail.value.trim();
    const password = els.newPassword.value;
    const repeat = els.repeatPassword.value;
    if (!email && !password) return setAccessMessage("Escribe un correo nuevo, una contraseña nueva o ambos.");
    if (password && password.length < 8) return setAccessMessage("La contraseña debe tener al menos 8 caracteres.");
    if (password !== repeat) return setAccessMessage("Las dos contraseñas no coinciden.");

    setAccessMessage("Guardando cambios…");
    try {
      if (password) await updateAccount({ password });
      if (email && email.toLowerCase() !== (currentUser?.email || "").toLowerCase()) {
        await updateAccount({ email });
        setAccessMessage("Contraseña actualizada. Para completar el cambio de correo, revisa los mensajes de confirmación que envíe Supabase.");
      } else {
        setAccessMessage("Contraseña actualizada correctamente.");
      }
      els.newPassword.value = "";
      els.repeatPassword.value = "";
    } catch (error) { setAccessMessage(error.message); }
  });

  (async function init() {
    const recovery = sessionFromRecoveryHash();
    if (recovery) {
      saveSession(recovery);
      history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      session = getSession();
    }

    currentUser = await fetchCurrentUser();
    if (currentUser) {
      const next = new URL(window.location.href).searchParams.get("next");
      if (next && next.startsWith("/admin/") && !recovery) {
        window.location.replace(next);
        return;
      }
      showApp();
      loadWeek().catch((e) => setStatus(e.message));
      if (recovery) {
        openAccess();
        setAccessMessage("El enlace de recuperación es válido. Escribe ahora tu contraseña nueva.");
      }
    } else {
      saveSession(null);
      currentUser = null;
      window.location.replace("/admin/clinica/acceso/?next=" + encodeURIComponent("/admin/agenda/"));
    }
  })();
})();
