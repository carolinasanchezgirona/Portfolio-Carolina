(() => {
  "use strict";
  const SUPABASE = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const OWNER = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
  const SESSION_KEY = "dememoria_admin_session";
  const READ_KEY = "dememoria_admin_notices_read_v1";
  const MAX_AGE = 14 * 24 * 60 * 60 * 1000;
  const $ = selector => document.querySelector(selector);
  const app = $("#admin-notice-app");
  if (!app) return;

  let items = [];
  let filter = "all";
  let seen;
  try { seen = new Set(JSON.parse(localStorage.getItem(READ_KEY) || "[]")); }
  catch { seen = new Set(); }
  const now = Date.now();

  const dateFmt = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Madrid"
  });

  function session() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); }
    catch { return null; }
  }
  function authHeaders(token) { return { apikey: KEY, Authorization: "Bearer " + token }; }
  function safeDate(value) {
    const time = Date.parse(value || "");
    return Number.isFinite(time) ? time : 0;
  }
  function recent(value) {
    const time = safeDate(value);
    return time && time <= now + 180000 && now - time <= MAX_AGE;
  }
  function storeSeen() {
    try { localStorage.setItem(READ_KEY, JSON.stringify(Array.from(seen).slice(-1000))); }
    catch { /* private browsing may disallow storage */ }
  }
  function notice(category, id, title, description, date, href) {
    if (!recent(date)) return null;
    return { category, id, title, description, date, href };
  }
  async function rest(token, query) {
    const r = await fetch(SUPABASE + "/rest/v1/" + query, {
      headers: authHeaders(token), cache: "no-store"
    });
    if (!r.ok) throw new Error("No se ha podido consultar una de las fuentes de avisos.");
    return r.json();
  }

  async function load() {
    const token = session()?.access_token;
    if (!token) { redirect(); return; }
    const status = $("#admin-notice-status");
    status.textContent = "Actualizando actividad administrativa…";

    const tasks = [
      ["agenda", "appointment_bookings?select=id,status,created_at,created_by_admin&order=created_at.desc&limit=60"],
      ["patients", "clinical_patients?select=id,created_at&order=created_at.desc&limit=50"],
      ["clinical", "clinical_exercise_assignments?select=id,patient_response_shared_at,reviewed_at&patient_response_shared_at=not.is.null&order=patient_response_shared_at.desc&limit=50"],
      ["clinical", "clinical_admin_tasks?select=id,due_at,status,created_at&order=created_at.desc&limit=80"],
      ["economy", "billing_invoices?select=id,status,created_at,updated_at&order=updated_at.desc&limit=50"],
    ];
    const results = await Promise.allSettled(tasks.map(([, query]) => rest(token, query)));
    const list = [];
    const errors = [];
    results.forEach((result, index) => {
      if (result.status !== "fulfilled") { errors.push(tasks[index][0]); return; }
      const area = tasks[index][0];
      for (const row of result.value) {
        if (area === "agenda" && !row.created_by_admin && !["cancelled", "canceled"].includes(row.status)) {
          const item = notice("agenda", "booking:" + row.id, "Nueva reserva", "Nueva cita registrada desde la web.", row.created_at, "/admin/agenda/");
          if (item) list.push(item);
        }
        if (area === "patients") {
          const item = notice("patients", "patient:" + row.id, "Ficha incorporada", "Se ha creado una ficha de paciente.", row.created_at, "/admin/clinica/?panel=1&view=patients");
          if (item) list.push(item);
        }
        if (area === "clinical" && row.patient_response_shared_at && !row.reviewed_at) {
          const item = notice("clinical", "exercise:" + row.id, "Actividad por revisar", "Se ha compartido una respuesta a una actividad.", row.patient_response_shared_at, "/admin/clinica/?panel=1&view=pending");
          if (item) list.push(item);
        }
        if (area === "clinical" && row.due_at && !["completed", "done", "cancelled"].includes(row.status)) {
          const due = safeDate(row.due_at);
          if (due && due < now + 72 * 60 * 60 * 1000 && due > now - MAX_AGE) {
            list.push({ category: "clinical", id: "task:" + row.id, title: "Tarea pendiente", description: "Hay una tarea administrativa con vencimiento cercano.", date: row.due_at, href: "/admin/clinica/?panel=1&view=pending" });
          }
        }
        if (area === "economy" && ["draft", "borrador"].includes(row.status)) {
          const item = notice("economy", "invoice:" + row.id, "Borrador de factura", "Hay una factura pendiente de revisión.", row.updated_at || row.created_at, "/admin/economia/?tab=invoices");
          if (item) list.push(item);
        }
      }
    });
    items = list.sort((a,b) => Date.parse(b.date) - Date.parse(a.date)).slice(0,100);
    status.textContent = errors.length ? "Algunas fuentes no han respondido. Los demás avisos se han actualizado." : "";
    render();
  }

  function make(tag, className, content) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (content !== undefined) e.textContent = String(content);
    return e;
  }
  function render() {
    const count = items.filter(item => !seen.has(item.id)).length;
    const badge = $("#admin-notice-total");
    badge.textContent = count ? String(count) : "";
    badge.hidden = count === 0;
    const container = $("#admin-notice-list");
    container.replaceChildren();
    const shown = items.filter(item => filter === "all" || item.category === filter);
    if (!shown.length) {
      let content = "No hay avisos recientes en esta categoría.";
      if (filter === "portal") content = "Los mensajes de Mi espacio todavía no están conectados a este centro de avisos.";
      if (filter === "security") content = "El registro de alertas de seguridad todavía no está integrado.";
      if (filter === "system") content = "Las incidencias del sistema todavía no están conectadas a esta bandeja.";
      container.append(make("div", "admin-notice-empty", content));
      return;
    }
    for (const item of shown) {
      const card = make("article", "admin-notice-card" + (seen.has(item.id) ? "" : " unread"));
      const info = make("div", "admin-notice-card-info");
      const label = { agenda:"Agenda", patients:"Pacientes", clinical:"Gestión clínica", portal:"Mi espacio", economy:"Gestión económica", security:"Seguridad", system:"Sistema" }[item.category] || "Dememoria";
      info.append(make("small", "", label));
      info.append(make("h3", "", item.title));
      info.append(make("p", "", item.description));
      info.append(make("small", "", dateFmt.format(new Date(item.date))));
      const actions = make("div", "admin-notice-card-actions");
      const link = make("a", "", "Abrir área");
      link.href = item.href;
      link.addEventListener("click", () => { seen.add(item.id); storeSeen(); });
      actions.append(link);
      if (!seen.has(item.id)) {
        const read = make("button", "", "Leído");
        read.type = "button";
        read.addEventListener("click", () => { seen.add(item.id); storeSeen(); render(); });
        actions.append(read);
      }
      card.append(info, actions);
      container.append(card);
    }
  }
  function redirect() {
    location.replace("/admin/clinica/acceso/?next=" + encodeURIComponent("/admin/notificaciones/"));
  }
  async function init() {
    const token = session()?.access_token;
    if (!token) { redirect(); return; }
    try {
      const r = await fetch(SUPABASE + "/auth/v1/user", { headers: authHeaders(token), cache:"no-store" });
      if (!r.ok) throw new Error("authentication");
      const user = await r.json();
      if (user.id !== OWNER) throw new Error("authentication");
    } catch {
      redirect();
      return;
    }
    $("#admin-notice-loading").hidden = true;
    app.hidden = false;
    $("#admin-notice-refresh").addEventListener("click", load);
    $("#admin-notice-mark-all").addEventListener("click", () => {
      items.forEach(item => seen.add(item.id));
      storeSeen();
      render();
    });
    document.querySelectorAll("[data-notice-filter]").forEach(button => {
      button.addEventListener("click", () => {
        filter = button.dataset.noticeFilter;
        document.querySelectorAll("[data-notice-filter]").forEach(el => {
          el.setAttribute("aria-pressed", String(el === button));
        });
        render();
      });
    });
    await load();
  }
  init();
})();
