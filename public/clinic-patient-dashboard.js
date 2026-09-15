(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const ZONE = "Europe/Madrid";

  const dialog = document.querySelector("#clinic-patient-dialog");
  const patientIdField = document.querySelector("#clinic-patient-id");
  const contact = document.querySelector("#clinic-patient-contact");
  if (!dialog || !patientIdField || !contact) return;

  const dashboard = document.createElement("section");
  dashboard.id = "clinic-patient-dashboard";
  dashboard.className = "clinic-patient-dashboard";
  dashboard.innerHTML = `
    <div class="clinic-dashboard-heading">
      <div><p class="clinic-eyebrow">Resumen del paciente</p><h3>Situación de un vistazo</h3></div>
      <button id="clinic-dashboard-refresh" class="clinic-text" type="button">Actualizar</button>
    </div>
    <p id="clinic-dashboard-status" class="clinic-message" role="status"></p>
    <div class="clinic-dashboard-grid">
      <article data-dashboard-card="next"><span>Próxima cita</span><strong>—</strong><small></small></article>
      <article data-dashboard-card="last-session"><span>Última sesión</span><strong>—</strong><small></small></article>
      <article data-dashboard-card="goals"><span>Objetivos activos</span><strong>0</strong><small></small></article>
      <article data-dashboard-card="exercises"><span>Ejercicios pendientes</span><strong>0</strong><small></small></article>
      <article data-dashboard-card="scale"><span>Última escala</span><strong>—</strong><small></small></article>
      <article data-dashboard-card="reports"><span>Informes en borrador</span><strong>0</strong><small></small></article>
    </div>
    <div id="clinic-dashboard-alerts" class="clinic-dashboard-alerts" hidden></div>`;
  contact.after(dashboard);

  const style = document.createElement("style");
  style.textContent = `
    .clinic-patient-dashboard{margin:16px 0 18px;padding:17px;border:1px solid #9EDCE7;border-radius:15px;background:#F7FCFD}
    .clinic-dashboard-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}.clinic-dashboard-heading h3{margin:0;font-family:Newsreader,Georgia,serif;font-size:1.35rem;font-weight:500}.clinic-dashboard-heading .clinic-eyebrow{margin-bottom:3px}
    .clinic-dashboard-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.clinic-dashboard-grid article{min-width:0;padding:13px;border:1px solid #CFE9EE;border-radius:12px;background:#fff;display:grid;gap:4px}.clinic-dashboard-grid span{color:#667983;font-size:.74rem;font-weight:700}.clinic-dashboard-grid strong{color:#075A68;font-size:1.05rem;line-height:1.25;overflow-wrap:anywhere}.clinic-dashboard-grid small{min-height:1.1em;color:#667983;font-size:.72rem;line-height:1.35;overflow-wrap:anywhere}.clinic-dashboard-grid article.is-attention{border-color:#e6c58f;background:#fff9ee}.clinic-dashboard-grid article.is-attention strong{color:#8a5b11}
    .clinic-dashboard-alerts{margin-top:10px;padding:10px 12px;border-radius:10px;background:#FFF4E3;color:#72521e;font-size:.78rem;line-height:1.45}.clinic-dashboard-alerts strong{display:block;margin-bottom:3px;color:#62430f}
    @media(max-width:760px){.clinic-dashboard-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:480px){.clinic-dashboard-grid{grid-template-columns:1fr}.clinic-dashboard-heading{align-items:flex-start}.clinic-patient-dashboard{padding:13px}}
  `;
  document.head.append(style);

  const status = dashboard.querySelector("#clinic-dashboard-status");
  const alerts = dashboard.querySelector("#clinic-dashboard-alerts");
  const refresh = dashboard.querySelector("#clinic-dashboard-refresh");

  function session() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }
  function headers() {
    return { apikey: KEY, Authorization: `Bearer ${session()?.access_token || ""}`, "Content-Type": "application/json" };
  }
  function card(name) { return dashboard.querySelector(`[data-dashboard-card="${name}"]`); }
  function setCard(name, strong, small = "", attention = false) {
    const el = card(name); if (!el) return;
    el.querySelector("strong").textContent = strong;
    el.querySelector("small").textContent = small || "";
    el.classList.toggle("is-attention", !!attention);
  }
  function dateTime(value) {
    if (!value) return "—";
    return new Intl.DateTimeFormat("es-ES", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit", hour12:false, timeZone:ZONE }).format(new Date(value));
  }
  function dateOnly(value) {
    if (!value) return "—";
    const raw = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const [y,m,d] = raw.split("-").map(Number);
      return new Intl.DateTimeFormat("es-ES", { day:"2-digit", month:"short", year:"numeric", timeZone:"UTC" }).format(new Date(Date.UTC(y,m-1,d,12)));
    }
    return new Intl.DateTimeFormat("es-ES", { day:"2-digit", month:"short", year:"numeric", timeZone:ZONE }).format(new Date(value));
  }
  async function get(path) {
    const response = await fetch(`${REST_URL}/${path}`, { headers: headers(), cache: "no-store" });
    const body = await response.json().catch(() => []);
    if (!response.ok) throw new Error(body?.message || "No se ha podido cargar el resumen.");
    return body;
  }

  async function loadDashboard() {
    const patientId = patientIdField.value;
    if (!patientId || !dialog.open) return;
    status.textContent = "Actualizando resumen…";
    alerts.hidden = true;
    const now = new Date().toISOString();
    try {
      const [appointments, sessions, goals, exercises, scales, reports] = await Promise.all([
        get(`appointment_bookings?select=id,starts_at,status,service_code&clinical_patient_id=eq.${encodeURIComponent(patientId)}&starts_at=gte.${encodeURIComponent(now)}&status=not.in.(cancelled,canceled)&order=starts_at.asc&limit=1`),
        get(`clinical_sessions?select=id,session_date,session_number,status,approved_at&patient_id=eq.${encodeURIComponent(patientId)}&status=eq.approved&order=session_date.desc&limit=1`),
        get(`clinical_goals?select=id,title,status,priority,last_reviewed_at&patient_id=eq.${encodeURIComponent(patientId)}&order=created_at.asc`),
        get(`clinical_exercise_assignments?select=id,title,status,email_status,review_due_at,reviewed_at,assigned_at&patient_id=eq.${encodeURIComponent(patientId)}&order=assigned_at.desc`),
        get(`clinical_scale_measurements?select=id,instrument,measured_at,total_score,interpretation&patient_id=eq.${encodeURIComponent(patientId)}&order=measured_at.desc&limit=1`),
        get(`clinical_reports?select=id,title,status,updated_at&patient_id=eq.${encodeURIComponent(patientId)}&status=eq.draft&order=updated_at.desc`),
      ]);

      const next = appointments[0];
      setCard("next", next ? dateTime(next.starts_at) : "Sin próxima cita", next ? (next.service_code === "neuropsicologia" ? "Neuropsicología" : "Psicología") : "");

      const last = sessions[0];
      setCard("last-session", last ? dateTime(last.session_date) : "Sin sesión aprobada", last?.session_number ? `Sesión ${last.session_number}` : "");

      const activeGoals = goals.filter(g => !["completed","achieved","closed","paused","cancelled","canceled"].includes(String(g.status || "").toLowerCase()));
      setCard("goals", String(activeGoals.length), activeGoals[0]?.title || (activeGoals.length ? "Objetivos en curso" : "Sin objetivos activos"));

      const pendingExercises = exercises.filter(e => !e.reviewed_at && !["completed","reviewed","revoked","cancelled","canceled"].includes(String(e.status || "").toLowerCase()));
      const overdueExercises = pendingExercises.filter(e => e.review_due_at && new Date(e.review_due_at).getTime() < Date.now());
      setCard("exercises", String(pendingExercises.length), overdueExercises.length ? `${overdueExercises.length} pendientes de revisión` : (pendingExercises[0]?.title || "Sin pendientes"), overdueExercises.length > 0);

      const scale = scales[0];
      const scaleValue = scale ? `${scale.instrument}${scale.total_score !== null && scale.total_score !== undefined ? ` · ${scale.total_score}` : ""}` : "Sin mediciones";
      setCard("scale", scaleValue, scale ? dateOnly(scale.measured_at) : "");

      setCard("reports", String(reports.length), reports[0]?.title || (reports.length ? "Pendientes de aprobar" : "Sin borradores"), reports.length > 0);

      const notices = [];
      if (!next) notices.push("No hay próxima cita programada.");
      if (overdueExercises.length) notices.push(`${overdueExercises.length} ejercicio(s) tienen revisión pendiente.`);
      if (reports.length) notices.push(`${reports.length} informe(s) siguen en borrador.`);
      if (!activeGoals.length) notices.push("No hay objetivos terapéuticos activos registrados.");
      if (notices.length) {
        alerts.innerHTML = `<strong>Para revisar</strong>${notices.map(x => `<div>• ${x}</div>`).join("")}`;
        alerts.hidden = false;
      } else alerts.hidden = true;
      status.textContent = "";
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "No se ha podido cargar el resumen.";
    }
  }

  const observer = new MutationObserver(() => {
    if (dialog.open && patientIdField.value) setTimeout(loadDashboard, 80);
  });
  observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
  refresh.addEventListener("click", loadDashboard);

  const patientIdObserver = new MutationObserver(() => {
    if (dialog.open && patientIdField.value) loadDashboard();
  });
  patientIdObserver.observe(patientIdField, { attributes: true, attributeFilter: ["value"] });

  // Asset revision 2.
})();
