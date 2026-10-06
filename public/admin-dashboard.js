(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const AUTH_URL = `${SUPABASE_URL}/auth/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const OWNER = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
  const ZONE = "Europe/Madrid";

  const root = document.querySelector("#admin-home");
  if (!root) return;

  function session() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }

  function authHeaders() {
    return { apikey: KEY, Authorization: `Bearer ${session()?.access_token || ""}` };
  }

  async function currentUser() {
    const s = session();
    if (!s?.access_token) return null;
    const r = await fetch(`${AUTH_URL}/user`, { headers: authHeaders(), cache: "no-store" });
    if (!r.ok) return null;
    const user = await r.json().catch(() => null);
    return user?.id === OWNER ? user : null;
  }

  function setStatus(text) {
    const el = document.querySelector("#admin-home-status");
    if (el) el.textContent = text || "";
  }

  function madridDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
    const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}`;
  }

  function addDays(key, days) {
    const [y,m,d] = key.split("-").map(Number);
    const dt = new Date(Date.UTC(y,m-1,d+days,12));
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth()+1).padStart(2,"0")}-${String(dt.getUTCDate()).padStart(2,"0")}`;
  }

  function zoneOffsetMs(value) {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone:ZONE, hour12:false, year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit" }).formatToParts(value);
    const p = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second) - value.getTime();
  }

  function localIso(key, time="00:00") {
    const [y,m,d] = key.split("-").map(Number);
    const [hh,mm] = time.split(":").map(Number);
    const guess = Date.UTC(y,m-1,d,hh,mm,0);
    let instant = new Date(guess);
    let offset = zoneOffsetMs(instant);
    instant = new Date(guess-offset);
    const refined = zoneOffsetMs(instant);
    if (refined !== offset) instant = new Date(guess-refined);
    return instant.toISOString();
  }

  async function get(path) {
    const r = await fetch(`${REST_URL}/${path}`, { headers: authHeaders(), cache:"no-store" });
    if (r.status === 401) throw new Error("session");
    const body = await r.json().catch(() => []);
    if (!r.ok) throw new Error(body?.message || "No se han podido cargar los datos.");
    return body;
  }

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  }

  function renderList(id, rows, formatter, emptyText) {
    const el = document.querySelector(id);
    if (!el) return;
    if (!rows.length) {
      el.innerHTML = `<div class="admin-home-empty">${esc(emptyText)}</div>`;
      return;
    }
    el.innerHTML = rows.slice(0,6).map(formatter).join("");
  }

  function priorityCard(href, value, label, attention=false) {
    return `<a class="admin-home-priority${attention ? " attention" : ""}" href="${href}"><strong>${value}</strong><span>${esc(label)}</span></a>`;
  }

  async function load() {
    const user = await currentUser();
    if (!user) {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.replace(`/admin/clinica/acceso/?next=${encodeURIComponent("/admin/")}`);
      return;
    }

    root.hidden = false;
    const today = madridDateKey();
    const tomorrow = addDays(today, 1);
    const start = localIso(today);
    const end = localIso(tomorrow);
    const now = new Date().toISOString();

    const dateEl = document.querySelector("#admin-home-date");
    if (dateEl) dateEl.textContent = new Intl.DateTimeFormat("es-ES", { weekday:"long", day:"numeric", month:"long", year:"numeric", timeZone:ZONE }).format(new Date());
    setStatus("Actualizando prioridades…");

    try {
      const [appointments, tasks, questions, articles, orders] = await Promise.all([
        get(`appointment_bookings?select=id,patient_name,status,starts_at,service_code&starts_at=gte.${encodeURIComponent(start)}&starts_at=lt.${encodeURIComponent(end)}&order=starts_at.asc`),
        get(`clinical_admin_tasks?select=id,title,status,priority,due_at,created_at&status=neq.completed&order=due_at.asc.nullslast,created_at.asc&limit=20`),
        get(`expert_questions?select=id,status,created_at,category,question_public&status=neq.published&status=neq.discarded&order=created_at.asc&limit=20`),
        get(`articles?select=id,title,status,scheduled_at,updated_at&or=(status.eq.draft,status.eq.scheduled)&order=updated_at.desc&limit=20`),
        get(`digital_resource_orders?select=id,payment_status,amount_total,currency,created_at,paid_at&order=created_at.desc&limit=20`),
      ]);

      const activeToday = appointments.filter(a => !["cancelled","canceled"].includes(a.status));
      const overdueTasks = tasks.filter(t => t.due_at && t.due_at < now);
      const pendingQuestions = questions.filter(q => !["published","discarded"].includes(q.status));
      const scheduledSoon = articles.filter(a => a.status === "scheduled" && a.scheduled_at);
      const paidOrders = orders.filter(o => ["paid","complete","succeeded"].includes(String(o.payment_status || "").toLowerCase()));

      const priorities = document.querySelector("#admin-home-priorities");
      if (priorities) {
        priorities.innerHTML = [
          priorityCard("/admin/agenda/", activeToday.length, "citas hoy"),
          priorityCard("/admin/clinica/?panel=1", tasks.length, "tareas clínicas pendientes", overdueTasks.length > 0),
          priorityCard("/admin/preguntas/", pendingQuestions.length, "preguntas pendientes", pendingQuestions.length > 0),
          priorityCard("/admin/articulos/", scheduledSoon.length, "artículos programados"),
          priorityCard("/admin/recursos/", paidOrders.length, "ventas recientes"),
        ].join("");
      }

      const timeFmt = new Intl.DateTimeFormat("es-ES", { hour:"2-digit", minute:"2-digit", hour12:false, timeZone:ZONE });
      renderList("#admin-home-today", activeToday,
        a => `<div class="admin-home-item"><div><strong>${esc(a.patient_name || "Cita")}</strong><span>${esc(a.service_code === "neuropsicologia" ? "Neuropsicología" : "Psicología")}</span></div><small>${esc(timeFmt.format(new Date(a.starts_at)))}</small></div>`,
        "No hay citas activas hoy.");

      renderList("#admin-home-clinical", tasks,
        t => `<div class="admin-home-item"><div><strong>${esc(t.title || "Tarea clínica")}</strong><span>${esc(t.priority || "normal")}${t.due_at ? ` · ${esc(new Intl.DateTimeFormat("es-ES", { day:"2-digit", month:"2-digit", timeZone:ZONE }).format(new Date(t.due_at)))}` : ""}</span></div>${t.due_at && t.due_at < now ? "<small>Vencida</small>" : ""}</div>`,
        "No hay tareas clínicas pendientes.");

      const editorialRows = [
        ...pendingQuestions.slice(0,3).map(q => ({type:"Pregunta", title:q.question_public || q.category || "Pregunta pendiente", meta:q.status})),
        ...articles.slice(0,3).map(a => ({type:"Artículo", title:a.title, meta:a.status === "scheduled" && a.scheduled_at ? `Programado ${new Intl.DateTimeFormat("es-ES", { day:"2-digit", month:"2-digit", timeZone:ZONE }).format(new Date(a.scheduled_at))}` : a.status})),
      ];
      renderList("#admin-home-editorial", editorialRows,
        x => `<div class="admin-home-item"><div><strong>${esc(x.title)}</strong><span>${esc(x.type)}</span></div><small>${esc(x.meta || "")}</small></div>`,
        "No hay pendientes editoriales destacados.");

      renderList("#admin-home-commerce", paidOrders,
        o => `<div class="admin-home-item"><div><strong>${new Intl.NumberFormat("es-ES", {style:"currency",currency:String(o.currency || "eur").toUpperCase()}).format((o.amount_total || 0)/100)}</strong><span>Pago registrado</span></div><small>${esc(new Intl.DateTimeFormat("es-ES", { day:"2-digit", month:"2-digit", timeZone:ZONE }).format(new Date(o.paid_at || o.created_at)))}</small></div>`,
        "Todavía no hay ventas recientes registradas.");

      setStatus("");
    } catch (error) {
      if (error?.message === "session") {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace(`/admin/clinica/acceso/?next=${encodeURIComponent("/admin/")}`);
        return;
      }
      setStatus(error?.message || "No se ha podido actualizar el panel.");
    }
  }

  load();
})();
