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
    login: $("#clinic-login"),
    app: $("#clinic-app"),
    loginForm: $("#clinic-login-form"),
    email: $("#clinic-email"),
    password: $("#clinic-password"),
    loginMessage: $("#clinic-login-message"),
    logout: $("#clinic-logout"),
    refresh: $("#clinic-refresh"),
    date: $("#clinic-date"),
    status: $("#clinic-status"),
    viewToday: $("#clinic-view-today"),
    viewPatients: $("#clinic-view-patients"),
    todayView: $("#clinic-today-view"),
    patientsView: $("#clinic-patients-view"),
    todayList: $("#clinic-today-list"),
    patientList: $("#clinic-patient-list"),
    patientSearch: $("#clinic-patient-search"),
    totalToday: $("#clinic-total-today"),
    confirmedToday: $("#clinic-confirmed-today"),
    pendingToday: $("#clinic-pending-today"),
    finishedToday: $("#clinic-finished-today"),
    patientDialog: $("#clinic-patient-dialog"),
    patientClose: $("#clinic-patient-close"),
    patientName: $("#clinic-patient-name"),
    patientContact: $("#clinic-patient-contact"),
    patientHistory: $("#clinic-patient-history"),
  };

  let session = null;
  let appointments = [];
  let patients = [];

  const dateLong = new Intl.DateTimeFormat("es-ES", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: ZONE,
  });
  const dateShort = new Intl.DateTimeFormat("es-ES", {
    day: "numeric", month: "short", year: "numeric", timeZone: ZONE,
  });
  const timeFormat = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ZONE,
  });

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); }
    catch { return null; }
  }

  function saveSession(value) {
    session = value;
    if (value) sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
    else sessionStorage.removeItem(SESSION_KEY);
  }

  function authHeaders() {
    return {
      apikey: KEY,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    };
  }

  async function fetchCurrentUser() {
    if (!session?.access_token) return null;
    const response = await fetch(`${AUTH_URL}/user`, {
      headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const user = await response.json();
    return user?.id === ALLOWED_USER_ID ? user : null;
  }

  async function signIn(email, password) {
    const response = await fetch(`${AUTH_URL}/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body.error_description || body.msg || "No se ha podido iniciar sesión.");
    }
    if (body.user?.id !== ALLOWED_USER_ID) {
      throw new Error("Esta cuenta no tiene acceso al área clínica.");
    }
    saveSession(body);
  }

  function showLogin() {
    els.app.hidden = true;
    els.login.hidden = false;
  }

  function showApp() {
    els.login.hidden = true;
    els.app.hidden = false;
  }

  function setMessage(text) {
    els.status.textContent = text || "";
  }

  function localDateKey(value) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      year: "numeric", month: "2-digit", day: "2-digit", timeZone: ZONE,
    }).formatToParts(new Date(value));
    const data = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${data.year}-${data.month}-${data.day}`;
  }

  function todayKey() {
    return localDateKey(new Date());
  }

  function statusLabel(status) {
    return ({
      confirmed: "Confirmada",
      pending: "Pendiente",
      cancelled: "Cancelada",
      canceled: "Cancelada",
      completed: "Realizada",
      no_show: "No presentado",
      rescheduled: "Reprogramada",
    })[status] || status;
  }

  function statusClass(status) {
    if (["cancelled", "canceled", "no_show"].includes(status)) return "cancelled";
    if (status === "completed") return "completed";
    if (status === "pending") return "pending";
    return "";
  }

  function contactKey(appointment) {
    const email = (appointment.patient_email || "").trim().toLowerCase();
    const phone = (appointment.patient_phone || "").replace(/\s+/g, "");
    return email || phone || appointment.patient_name.trim().toLowerCase();
  }

  function buildPatients() {
    const index = new Map();
    appointments.forEach((appointment) => {
      if (appointment.patient_email === "bloqueo@agenda.interno") return;
      const key = contactKey(appointment);
      const current = index.get(key) || {
        key,
        name: appointment.patient_name,
        email: appointment.patient_email,
        phone: appointment.patient_phone,
        appointments: [],
      };
      current.appointments.push(appointment);
      if (!current.email && appointment.patient_email) current.email = appointment.patient_email;
      if (!current.phone && appointment.patient_phone) current.phone = appointment.patient_phone;
      index.set(key, current);
    });
    patients = Array.from(index.values())
      .map((patient) => ({
        ...patient,
        appointments: patient.appointments.sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }

  function create(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function openPatient(patient) {
    els.patientName.textContent = patient.name;
    els.patientContact.replaceChildren();
    if (patient.email) els.patientContact.append(create("span", "", patient.email));
    if (patient.phone) els.patientContact.append(create("span", "", patient.phone));
    els.patientHistory.replaceChildren();

    patient.appointments.forEach((appointment) => {
      const row = create("article");
      const date = create("strong", "", dateShort.format(new Date(appointment.starts_at)));
      const meta = create(
        "span",
        "",
        `${timeFormat.format(new Date(appointment.starts_at))} · ${statusLabel(appointment.status)}`
      );
      row.append(date, meta);
      els.patientHistory.append(row);
    });

    els.patientDialog.showModal();
  }

  function appointmentCard(appointment) {
    const card = create("article", "clinic-appointment");
    const time = create("time", "clinic-time", timeFormat.format(new Date(appointment.starts_at)));
    const body = create("div");
    const name = create("h3", "", appointment.patient_name);
    const service = appointment.service_code === "neuropsicologia" ? "Neuropsicología" : "Psicología";
    const meta = create("p", "", `${service} · ${appointment.patient_type === "new" ? "Primera visita" : "Seguimiento"}`);
    body.append(name, meta);
    const pill = create("span", `clinic-status-pill ${statusClass(appointment.status)}`, statusLabel(appointment.status));
    const button = create("button", "clinic-open-patient", "Abrir ficha");
    button.type = "button";
    button.addEventListener("click", () => {
      const patient = patients.find((item) => item.key === contactKey(appointment));
      if (patient) openPatient(patient);
    });
    card.append(time, body, pill, button);
    return card;
  }

  function renderToday() {
    const active = appointments.filter(
      (appointment) =>
        appointment.patient_email !== "bloqueo@agenda.interno" &&
        localDateKey(appointment.starts_at) === todayKey()
    );
    els.totalToday.textContent = String(active.length);
    els.confirmedToday.textContent = String(active.filter((item) => item.status === "confirmed").length);
    els.pendingToday.textContent = String(active.filter((item) => item.status === "pending").length);
    els.finishedToday.textContent = String(active.filter((item) => item.status === "completed").length);
    els.todayList.replaceChildren();

    if (!active.length) {
      const empty = create("div", "clinic-empty");
      empty.append(
        create("strong", "", "No hay consultas registradas para hoy."),
        create("p", "", "Puedes consultar la semana completa desde la agenda.")
      );
      els.todayList.append(empty);
      return;
    }
    active.forEach((appointment) => els.todayList.append(appointmentCard(appointment)));
  }

  function renderPatients(query = "") {
    const term = query.trim().toLowerCase();
    const filtered = patients.filter((patient) =>
      [patient.name, patient.email, patient.phone].some((value) =>
        (value || "").toLowerCase().includes(term)
      )
    );
    els.patientList.replaceChildren();

    if (!filtered.length) {
      els.patientList.append(create("div", "clinic-empty", "No se han encontrado pacientes."));
      return;
    }

    filtered.forEach((patient) => {
      const card = create("article", "clinic-patient-card");
      const body = create("div");
      body.append(
        create("h3", "", patient.name),
        create("p", "", [patient.email, patient.phone].filter(Boolean).join(" · ") || "Sin contacto registrado")
      );
      const summary = create(
        "p",
        "",
        `${patient.appointments.length} cita(s) · Última registrada: ${dateShort.format(new Date(patient.appointments[0].starts_at))}`
      );
      const button = create("button", "clinic-secondary", "Abrir ficha");
      button.type = "button";
      button.addEventListener("click", () => openPatient(patient));
      card.append(body, summary, button);
      els.patientList.append(card);
    });
  }

  async function loadData() {
    setMessage("Cargando datos clínico-administrativos…");
    const select = "id,patient_name,patient_email,patient_phone,patient_type,status,starts_at,ends_at,service_code";
    const url = `${REST_URL}/appointment_bookings?select=${encodeURIComponent(select)}&order=starts_at.desc&limit=1000`;
    const response = await fetch(url, { headers: authHeaders(), cache: "no-store" });

    if (response.status === 401) {
      saveSession(null);
      showLogin();
      throw new Error("La sesión ha caducado. Vuelve a entrar.");
    }
    const body = await response.json().catch(() => []);
    if (!response.ok) throw new Error(body.message || "No se han podido cargar las citas.");

    appointments = body;
    buildPatients();
    renderToday();
    renderPatients(els.patientSearch.value);
    setMessage("");
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
      els.password.value = "";
      els.loginMessage.textContent = "";
      showApp();
      await loadData();
    } catch (error) {
      els.loginMessage.textContent = error.message;
    }
  });

  els.logout.addEventListener("click", () => {
    saveSession(null);
    showLogin();
  });
  els.refresh.addEventListener("click", () => loadData().catch((error) => setMessage(error.message)));
  els.viewToday.addEventListener("click", () => setView("today"));
  els.viewPatients.addEventListener("click", () => setView("patients"));
  els.patientSearch.addEventListener("input", () => renderPatients(els.patientSearch.value));
  els.patientClose.addEventListener("click", () => els.patientDialog.close());
  els.patientDialog.addEventListener("click", (event) => {
    if (event.target === els.patientDialog) els.patientDialog.close();
  });

  (async function init() {
    els.date.textContent = dateLong.format(new Date());
    session = getSession();
    const user = await fetchCurrentUser();
    if (!user) {
      saveSession(null);
      showLogin();
      return;
    }
    showApp();
    loadData().catch((error) => setMessage(error.message));
  })();
})();
