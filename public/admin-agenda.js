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
    newButton: $("#admin-new"), print: $("#admin-print"), prev: $("#week-prev"), next: $("#week-next"), today: $("#week-today"),
    weekTitle: $("#week-title"), weekSubtitle: $("#week-subtitle"), calendar: $("#week-calendar"), status: $("#admin-status"),
    total: $("#summary-total"), confirmed: $("#summary-confirmed"), pending: $("#summary-pending"), cancelled: $("#summary-cancelled"),
    dialog: $("#appointment-dialog"), dialogTitle: $("#dialog-title"), dialogClose: $("#dialog-close"),
    form: $("#appointment-form"), closeForm: $("#appointment-close"), cancelBooking: $("#appointment-cancel-booking"),
    saveAppointment: $("#appointment-save"), message: $("#appointment-message"),
    id: $("#appointment-id"), date: $("#appointment-date"), time: $("#appointment-time"), name: $("#appointment-name"),
    patientEmail: $("#appointment-email"), phone: $("#appointment-phone"), service: $("#appointment-service"),
    appointmentStatus: $("#appointment-status"), patientType: $("#appointment-patient-type"), price: $("#appointment-price"),
    accessDialog: $("#access-dialog"), accessForm: $("#access-form"), accessClose: $("#access-close"), accessCancel: $("#access-cancel"),
    currentEmail: $("#access-current-email"), newEmail: $("#access-new-email"), newPassword: $("#access-new-password"),
    repeatPassword: $("#access-repeat-password"), accessMessage: $("#access-message"),
  };

  let session = null;
  let currentUser = null;
  let appointments = [];
  let weekStartKey = mondayKey(todayKey());

  const dateLong = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: ZONE });
  const dayShort = new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric", month: "short", timeZone: ZONE });
  const monthYear = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: ZONE });
  const timeFmt = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ZONE });

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
      timeZone: ZONE, hour12: false, year: "numeric", month: "2-digit", day: "2-digit",
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

  async function fetchCurrentUser() {
    if (!session?.access_token) return null;
    const response = await fetch(`${AUTH_URL}/user`, { headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
    if (!response.ok) return null;
    const user = await response.json();
    return user?.id === ALLOWED_USER_ID ? user : null;
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
    els.login.hidden = true;
    els.app.hidden = false;
  }

  function showLogin() {
    els.app.hidden = true;
    els.login.hidden = false;
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
    setStatus("Cargando agenda…");
    const start = madridLocalToIso(weekStartKey, "00:00");
    const end = madridLocalToIso(addDaysKey(weekStartKey, 7), "00:00");
    const select = "id,patient_name,patient_email,patient_phone,patient_type,status,starts_at,ends_at,price_eur,service_code,created_by_admin";
    const url = `${REST_URL}/appointment_bookings?select=${encodeURIComponent(select)}&starts_at=gte.${encodeURIComponent(start)}&starts_at=lt.${encodeURIComponent(end)}&order=starts_at.asc`;
    const response = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    if (response.status === 401) {
      saveSession(null); currentUser = null; showLogin(); throw new Error("La sesión ha caducado. Vuelve a entrar.");
    }
    const body = await response.json().catch(() => []);
    if (!response.ok) throw new Error(body.message || "No se ha podido cargar la agenda.");
    appointments = body;
    renderWeek();
    setStatus("");
  }

  function renderWeek() {
    const firstDate = new Date(madridLocalToIso(weekStartKey, "12:00"));
    const lastKey = addDaysKey(weekStartKey, 6);
    const lastDate = new Date(madridLocalToIso(lastKey, "12:00"));
    els.weekTitle.textContent = `Semana del ${dayShort.format(firstDate)} al ${dayShort.format(lastDate)}`;
    els.weekSubtitle.textContent = monthYear.format(firstDate);
    els.total.textContent = String(appointments.length);
    els.confirmed.textContent = String(appointments.filter((a) => a.status === "confirmed").length);
    els.pending.textContent = String(appointments.filter((a) => a.status === "pending").length);
    els.cancelled.textContent = String(appointments.filter((a) => ["cancelled", "canceled"].includes(a.status)).length);

    els.calendar.replaceChildren();
    for (let i = 0; i < 7; i += 1) {
      const key = addDaysKey(weekStartKey, i);
      const instant = new Date(madridLocalToIso(key, "12:00"));
      const dayAppointments = appointments.filter((a) => keyFromIso(a.starts_at) === key);
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

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);
  }

  function openNew() {
    els.form.reset();
    els.id.value = "";
    els.dialogTitle.textContent = "Nueva cita";
    els.date.value = todayKey();
    els.time.value = "09:00";
    els.service.value = "psicologia_general_sanitaria";
    els.appointmentStatus.value = "confirmed";
    els.patientType.value = "existing";
    els.price.value = "60";
    els.cancelBooking.hidden = true;
    els.saveAppointment.textContent = "Crear cita";
    setFormMessage("");
    els.dialog.showModal();
  }

  function openEdit(a) {
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
    els.saveAppointment.textContent = "Guardar cambios";
    setFormMessage("");
    els.dialog.showModal();
  }

  async function rpc(name, body) {
    const response = await fetch(`${REST_URL}/rpc/${name}`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.hint || "No se ha podido guardar la cita.");
    return data;
  }

  async function saveAppointment() {
    const startsAt = madridLocalToIso(els.date.value, els.time.value);
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
    if (els.id.value) await rpc("admin_update_appointment", { p_id: els.id.value, ...common });
    else await rpc("admin_create_appointment", common);
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
      els.dialog.close();
      await loadWeek();
    } catch (error) {
      setFormMessage(error.message);
    } finally {
      els.cancelBooking.disabled = false;
      els.saveAppointment.disabled = false;
    }
  }

  els.loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoginMessage("Entrando…");
    try {
      await signIn(els.email.value.trim(), els.password.value);
      els.password.value = "";
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

  els.logout?.addEventListener("click", () => { saveSession(null); currentUser = null; appointments = []; showLogin(); });
  els.accessButton?.addEventListener("click", openAccess);
  els.newButton?.addEventListener("click", openNew);
  els.print?.addEventListener("click", () => window.print());
  els.prev?.addEventListener("click", async () => { weekStartKey = addDaysKey(weekStartKey, -7); await loadWeek().catch((e) => setStatus(e.message)); });
  els.next?.addEventListener("click", async () => { weekStartKey = addDaysKey(weekStartKey, 7); await loadWeek().catch((e) => setStatus(e.message)); });
  els.today?.addEventListener("click", async () => { weekStartKey = mondayKey(todayKey()); await loadWeek().catch((e) => setStatus(e.message)); });
  els.dialogClose?.addEventListener("click", () => els.dialog.close());
  els.closeForm?.addEventListener("click", () => els.dialog.close());
  els.cancelBooking?.addEventListener("click", cancelAppointment);
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
      showApp();
      loadWeek().catch((e) => setStatus(e.message));
      if (recovery) {
        openAccess();
        setAccessMessage("El enlace de recuperación es válido. Escribe ahora tu contraseña nueva.");
      }
    } else {
      saveSession(null);
      currentUser = null;
      showLogin();
    }
  })();
})();
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
    newButton: $("#admin-new"), print: $("#admin-print"), prev: $("#week-prev"), next: $("#week-next"), today: $("#week-today"),
    weekTitle: $("#week-title"), weekSubtitle: $("#week-subtitle"), calendar: $("#week-calendar"), status: $("#admin-status"),
    total: $("#summary-total"), confirmed: $("#summary-confirmed"), pending: $("#summary-pending"), cancelled: $("#summary-cancelled"),
    dialog: $("#appointment-dialog"), dialogTitle: $("#dialog-title"), dialogClose: $("#dialog-close"),
    form: $("#appointment-form"), closeForm: $("#appointment-close"), cancelBooking: $("#appointment-cancel-booking"),
    saveAppointment: $("#appointment-save"), message: $("#appointment-message"),
    id: $("#appointment-id"), date: $("#appointment-date"), time: $("#appointment-time"), name: $("#appointment-name"),
    patientEmail: $("#appointment-email"), phone: $("#appointment-phone"), service: $("#appointment-service"),
    appointmentStatus: $("#appointment-status"), patientType: $("#appointment-patient-type"), price: $("#appointment-price"),
    accessDialog: $("#access-dialog"), accessForm: $("#access-form"), accessClose: $("#access-close"), accessCancel: $("#access-cancel"),
    currentEmail: $("#access-current-email"), newEmail: $("#access-new-email"), newPassword: $("#access-new-password"),
    repeatPassword: $("#access-repeat-password"), accessMessage: $("#access-message"),
  };

  let session = null;
  let currentUser = null;
  let appointments = [];
  let weekStartKey = mondayKey(todayKey());

  const dateLong = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: ZONE });
  const dayShort = new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric", month: "short", timeZone: ZONE });
  const monthYear = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: ZONE });
  const timeFmt = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ZONE });

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
      timeZone: ZONE, hour12: false, year: "numeric", month: "2-digit", day: "2-digit",
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

  async function fetchCurrentUser() {
    if (!session?.access_token) return null;
    const response = await fetch(`${AUTH_URL}/user`, { headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
    if (!response.ok) return null;
    const user = await response.json();
    return user?.id === ALLOWED_USER_ID ? user : null;
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
    els.login.hidden = true;
    els.app.hidden = false;
  }

  function showLogin() {
    els.app.hidden = true;
    els.login.hidden = false;
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
    setStatus("Cargando agenda…");
    const start = madridLocalToIso(weekStartKey, "00:00");
    const end = madridLocalToIso(addDaysKey(weekStartKey, 7), "00:00");
    const select = "id,patient_name,patient_email,patient_phone,patient_type,status,starts_at,ends_at,price_eur,service_code,created_by_admin";
    const url = `${REST_URL}/appointment_bookings?select=${encodeURIComponent(select)}&starts_at=gte.${encodeURIComponent(start)}&starts_at=lt.${encodeURIComponent(end)}&order=starts_at.asc`;
    const response = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    if (response.status === 401) {
      saveSession(null); currentUser = null; showLogin(); throw new Error("La sesión ha caducado. Vuelve a entrar.");
    }
    const body = await response.json().catch(() => []);
    if (!response.ok) throw new Error(body.message || "No se ha podido cargar la agenda.");
    appointments = body;
    renderWeek();
    setStatus("");
  }

  function renderWeek() {
    const firstDate = new Date(madridLocalToIso(weekStartKey, "12:00"));
    const lastKey = addDaysKey(weekStartKey, 6);
    const lastDate = new Date(madridLocalToIso(lastKey, "12:00"));
    els.weekTitle.textContent = `Semana del ${dayShort.format(firstDate)} al ${dayShort.format(lastDate)}`;
    els.weekSubtitle.textContent = monthYear.format(firstDate);
    els.total.textContent = String(appointments.length);
    els.confirmed.textContent = String(appointments.filter((a) => a.status === "confirmed").length);
    els.pending.textContent = String(appointments.filter((a) => a.status === "pending").length);
    els.cancelled.textContent = String(appointments.filter((a) => ["cancelled", "canceled"].includes(a.status)).length);

    els.calendar.replaceChildren();
    for (let i = 0; i < 7; i += 1) {
      const key = addDaysKey(weekStartKey, i);
      const instant = new Date(madridLocalToIso(key, "12:00"));
      const dayAppointments = appointments.filter((a) => keyFromIso(a.starts_at) === key);
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

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);
  }

  function openNew() {
    els.form.reset();
    els.id.value = "";
    els.dialogTitle.textContent = "Nueva cita";
    els.date.value = todayKey();
    els.time.value = "09:00";
    els.service.value = "psicologia_general_sanitaria";
    els.appointmentStatus.value = "confirmed";
    els.patientType.value = "existing";
    els.price.value = "60";
    els.cancelBooking.hidden = true;
    els.saveAppointment.textContent = "Crear cita";
    setFormMessage("");
    els.dialog.showModal();
  }

  function openEdit(a) {
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
    els.saveAppointment.textContent = "Guardar cambios";
    setFormMessage("");
    els.dialog.showModal();
  }

  async function rpc(name, body) {
    const response = await fetch(`${REST_URL}/rpc/${name}`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.hint || "No se ha podido guardar la cita.");
    return data;
  }

  async function saveAppointment() {
    const startsAt = madridLocalToIso(els.date.value, els.time.value);
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
    if (els.id.value) await rpc("admin_update_appointment", { p_id: els.id.value, ...common });
    else await rpc("admin_create_appointment", common);
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
      els.dialog.close();
      await loadWeek();
    } catch (error) {
      setFormMessage(error.message);
    } finally {
      els.cancelBooking.disabled = false;
      els.saveAppointment.disabled = false;
    }
  }

  els.loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoginMessage("Entrando…");
    try {
      await signIn(els.email.value.trim(), els.password.value);
      els.password.value = "";
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

  els.logout?.addEventListener("click", () => { saveSession(null); currentUser = null; appointments = []; showLogin(); });
  els.accessButton?.addEventListener("click", openAccess);
  els.newButton?.addEventListener("click", openNew);
  els.print?.addEventListener("click", () => window.print());
  els.prev?.addEventListener("click", async () => { weekStartKey = addDaysKey(weekStartKey, -7); await loadWeek().catch((e) => setStatus(e.message)); });
  els.next?.addEventListener("click", async () => { weekStartKey = addDaysKey(weekStartKey, 7); await loadWeek().catch((e) => setStatus(e.message)); });
  els.today?.addEventListener("click", async () => { weekStartKey = mondayKey(todayKey()); await loadWeek().catch((e) => setStatus(e.message)); });
  els.dialogClose?.addEventListener("click", () => els.dialog.close());
  els.closeForm?.addEventListener("click", () => els.dialog.close());
  els.cancelBooking?.addEventListener("click", cancelAppointment);
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
      showApp();
      loadWeek().catch((e) => setStatus(e.message));
      if (recovery) {
        openAccess();
        setAccessMessage("El enlace de recuperación es válido. Escribe ahora tu contraseña nueva.");
      }
    } else {
      saveSession(null);
      currentUser = null;
      showLogin();
    }
  })();
})();
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
    newButton: $("#admin-new"), print: $("#admin-print"), prev: $("#week-prev"), next: $("#week-next"), today: $("#week-today"),
    weekTitle: $("#week-title"), weekSubtitle: $("#week-subtitle"), calendar: $("#week-calendar"), status: $("#admin-status"),
    total: $("#summary-total"), confirmed: $("#summary-confirmed"), pending: $("#summary-pending"), cancelled: $("#summary-cancelled"),
    dialog: $("#appointment-dialog"), dialogTitle: $("#dialog-title"), dialogClose: $("#dialog-close"),
    form: $("#appointment-form"), cancel: $("#appointment-cancel"), message: $("#appointment-message"),
    id: $("#appointment-id"), date: $("#appointment-date"), time: $("#appointment-time"), name: $("#appointment-name"),
    patientEmail: $("#appointment-email"), phone: $("#appointment-phone"), service: $("#appointment-service"),
    appointmentStatus: $("#appointment-status"), patientType: $("#appointment-patient-type"), price: $("#appointment-price"),
    accessDialog: $("#access-dialog"), accessForm: $("#access-form"), accessClose: $("#access-close"), accessCancel: $("#access-cancel"),
    currentEmail: $("#access-current-email"), newEmail: $("#access-new-email"), newPassword: $("#access-new-password"),
    repeatPassword: $("#access-repeat-password"), accessMessage: $("#access-message"),
  };

  let session = null;
  let currentUser = null;
  let appointments = [];
  let weekStartKey = mondayKey(todayKey());

  const dateLong = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: ZONE });
  const dayShort = new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric", month: "short", timeZone: ZONE });
  const monthYear = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: ZONE });
  const timeFmt = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ZONE });

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
      timeZone: ZONE, hour12: false, year: "numeric", month: "2-digit", day: "2-digit",
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

  async function fetchCurrentUser() {
    if (!session?.access_token) return null;
    const response = await fetch(`${AUTH_URL}/user`, { headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
    if (!response.ok) return null;
    const user = await response.json();
    return user?.id === ALLOWED_USER_ID ? user : null;
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
    els.login.hidden = true;
    els.app.hidden = false;
  }

  function showLogin() {
    els.app.hidden = true;
    els.login.hidden = false;
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
    setStatus("Cargando agenda…");
    const start = madridLocalToIso(weekStartKey, "00:00");
    const end = madridLocalToIso(addDaysKey(weekStartKey, 7), "00:00");
    const select = "id,patient_name,patient_email,patient_phone,patient_type,status,starts_at,ends_at,price_eur,service_code,created_by_admin";
    const url = `${REST_URL}/appointment_bookings?select=${encodeURIComponent(select)}&starts_at=gte.${encodeURIComponent(start)}&starts_at=lt.${encodeURIComponent(end)}&order=starts_at.asc`;
    const response = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    if (response.status === 401) {
      saveSession(null); currentUser = null; showLogin(); throw new Error("La sesión ha caducado. Vuelve a entrar.");
    }
    const body = await response.json().catch(() => []);
    if (!response.ok) throw new Error(body.message || "No se ha podido cargar la agenda.");
    appointments = body;
    renderWeek();
    setStatus("");
  }

  function renderWeek() {
    const firstDate = new Date(madridLocalToIso(weekStartKey, "12:00"));
    const lastKey = addDaysKey(weekStartKey, 6);
    const lastDate = new Date(madridLocalToIso(lastKey, "12:00"));
    els.weekTitle.textContent = `Semana del ${dayShort.format(firstDate)} al ${dayShort.format(lastDate)}`;
    els.weekSubtitle.textContent = monthYear.format(firstDate);
    els.total.textContent = String(appointments.length);
    els.confirmed.textContent = String(appointments.filter((a) => a.status === "confirmed").length);
    els.pending.textContent = String(appointments.filter((a) => a.status === "pending").length);
    els.cancelled.textContent = String(appointments.filter((a) => ["cancelled", "canceled"].includes(a.status)).length);

    els.calendar.replaceChildren();
    for (let i = 0; i < 7; i += 1) {
      const key = addDaysKey(weekStartKey, i);
      const instant = new Date(madridLocalToIso(key, "12:00"));
      const dayAppointments = appointments.filter((a) => keyFromIso(a.starts_at) === key);
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
      dayAppointments.forEach((appointment) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `appointment-card${appointment.service_code === "neuropsicologia" ? " neuro" : ""}${["cancelled", "canceled"].includes(appointment.status) ? " cancelled" : ""}`;
        button.innerHTML = `<time>${timeFmt.format(new Date(appointment.starts_at))}</time><strong>${escapeHtml(appointment.patient_name)}</strong><small>${serviceLabel(appointment.service_code)} · ${statusLabel(appointment.status)}</small>`;
        button.addEventListener("click", () => openEdit(appointment));
        body.append(button);
      });
      column.append(head, body);
      els.calendar.append(column);
    }
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);
  }

  function openNew() {
    els.form.reset();
    els.id.value = "";
    els.dialogTitle.textContent = "Nueva cita";
    els.date.value = todayKey();
    els.time.value = "09:00";
    els.service.value = "psicologia_general_sanitaria";
    els.appointmentStatus.value = "confirmed";
    els.patientType.value = "existing";
    els.price.value = "60";
    setFormMessage("");
    els.dialog.showModal();
  }

  function openEdit(a) {
    els.id.value = a.id;
    els.dialogTitle.textContent = "Editar cita";
    els.date.value = keyFromIso(a.starts_at);
    els.time.value = timeFmt.format(new Date(a.starts_at));
    els.name.value = a.patient_name || "";
    els.patientEmail.value = a.patient_email || "";
    els.phone.value = a.patient_phone || "";
    els.service.value = a.service_code || "psicologia_general_sanitaria";
    els.appointmentStatus.value = a.status === "canceled" ? "cancelled" : a.status;
    els.patientType.value = a.patient_type || "existing";
    els.price.value = a.price_eur ?? 60;
    setFormMessage("");
    els.dialog.showModal();
  }

  async function rpc(name, body) {
    const response = await fetch(`${REST_URL}/rpc/${name}`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.hint || "No se ha podido guardar la cita.");
    return data;
  }

  async function saveAppointment() {
    const startsAt = madridLocalToIso(els.date.value, els.time.value);
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
    if (els.id.value) await rpc("admin_update_appointment", { p_id: els.id.value, ...common });
    else await rpc("admin_create_appointment", common);
  }

  els.loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoginMessage("Entrando…");
    try {
      await signIn(els.email.value.trim(), els.password.value);
      els.password.value = "";
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

  els.logout?.addEventListener("click", () => { saveSession(null); currentUser = null; appointments = []; showLogin(); });
  els.accessButton?.addEventListener("click", openAccess);
  els.newButton?.addEventListener("click", openNew);
  els.print?.addEventListener("click", () => window.print());
  els.prev?.addEventListener("click", async () => { weekStartKey = addDaysKey(weekStartKey, -7); await loadWeek().catch((e) => setStatus(e.message)); });
  els.next?.addEventListener("click", async () => { weekStartKey = addDaysKey(weekStartKey, 7); await loadWeek().catch((e) => setStatus(e.message)); });
  els.today?.addEventListener("click", async () => { weekStartKey = mondayKey(todayKey()); await loadWeek().catch((e) => setStatus(e.message)); });
  els.dialogClose?.addEventListener("click", () => els.dialog.close());
  els.cancel?.addEventListener("click", () => els.dialog.close());
  els.accessClose?.addEventListener("click", () => els.accessDialog.close());
  els.accessCancel?.addEventListener("click", () => els.accessDialog.close());

  els.form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!els.form.reportValidity()) return;
    setFormMessage("Guardando…");
    try {
      await saveAppointment();
      els.dialog.close();
      weekStartKey = mondayKey(els.date.value);
      await loadWeek();
    } catch (error) { setFormMessage(error.message); }
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
      showApp();
      loadWeek().catch((e) => setStatus(e.message));
      if (recovery) {
        openAccess();
        setAccessMessage("El enlace de recuperación es válido. Escribe ahora tu contraseña nueva.");
      }
    } else {
      saveSession(null);
      currentUser = null;
      showLogin();
    }
  })();
})();
