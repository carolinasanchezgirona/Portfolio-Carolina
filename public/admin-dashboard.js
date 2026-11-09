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
    if (user?.id !== OWNER) return null;
    // Server-backed authorization. A verified TOTP factor requires aal2.
    const gate=await fetch(SUPABASE_URL+"/rest/v1/rpc/admin_mobile_gate",{
      method:"POST", cache:"no-store",
      headers:{...authHeaders(),"Content-Type":"application/json"},
      body:"{}",
    }).catch(()=>null);
    if(!gate?.ok)return null;
    return await gate.json()===true?user:null;
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
    const body = await r.json().catch(() => null);
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
    el.innerHTML = rows.map(formatter).join("");
  }

  function unavailable(id) {
    const target = document.querySelector(id);
    if (target) target.innerHTML = '<p class="admin-home-empty">Estos datos no están disponibles. Puedes entrar en su sección para consultarlos.</p>';
  }

  async function logout() {
    const active = session();
    sessionStorage.removeItem(SESSION_KEY);
    root.hidden = true;
    const loading = document.querySelector("#admin-home-loading");
    if (loading) {
      loading.hidden = false;
      loading.textContent = "Cerrando la sesión…";
    }
    try {
      if (active?.access_token) await fetch(AUTH_URL + "/logout", {
        method:"POST", headers:{apikey:KEY,Authorization:"Bearer "+active.access_token},cache:"no-store",
      });
    } catch { /* Clear local session even if the provider is unavailable. */ }
    window.location.replace("/admin/clinica/acceso/?next=%2Fadmin%2F");
  }

  let latestRequest = 0;
  async function load() {
    const request = ++latestRequest;
    const user = await currentUser();
    if (request !== latestRequest) return;
    if (!user) {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.replace("/admin/clinica/acceso/?next=%2Fadmin%2F");
      return;
    }
    root.hidden = false;
    const loading = document.querySelector("#admin-home-loading");
    if (loading) loading.hidden = true;

    const today = madridDateKey();
    const start = localIso(today), end = localIso(addDays(today,1));
    const dateEl = document.querySelector("#admin-home-date");
    if (dateEl) dateEl.textContent = new Intl.DateTimeFormat("es-ES", {
      weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:ZONE
    }).format(new Date());
    setStatus("Consultando las citas de hoy…");

    // Inicio de mínima exposición: solo consulta el día actual, nunca facturación,
    // publicaciones, ventas, mensajes ni el directorio completo de pacientes.
    const realAppointments = "&or=(patient_email.is.null,patient_email.neq.bloqueo@agenda.interno)";
    const path = "appointment_bookings?select=id,patient_name,status,starts_at,service_code" +
      "&starts_at=gte." + encodeURIComponent(start) +
      "&starts_at=lt." + encodeURIComponent(end) +
      realAppointments + "&order=starts_at.asc&limit=200";

    try {
      const appointments = await get(path);
      if (request !== latestRequest) return;
      if (!Array.isArray(appointments)) throw new Error("Respuesta inválida de la agenda.");
      const todayActive = appointments.filter(row => !["cancelled","canceled"].includes(String(row.status||"").toLowerCase()));
      const timeFmt = new Intl.DateTimeFormat("es-ES", {
        hour:"2-digit",minute:"2-digit",hour12:false,timeZone:ZONE
      });
      const statusLabel = {
        confirmed:"Confirmada", pending:"Pendiente", completed:"Realizada",
        no_show:"No presentada", rescheduled:"Reprogramada"
      };
      renderList("#admin-home-today",todayActive,row =>
        '<div class="admin-home-item"><div><strong>' + esc(row.patient_name || "Cita") +
        '</strong><span>' + esc(row.service_code === "neuropsicologia" ? "Neuropsicología" : "Psicología") +
        ' · ' + esc(statusLabel[row.status] || "Cita") +
        '</span></div><small>' + esc(timeFmt.format(new Date(row.starts_at))) + '</small></div>',
        "No hay citas programadas hoy.");
      setStatus("");
    } catch (error) {
      if (request !== latestRequest) return;
      if (error?.message === "session") {
        sessionStorage.removeItem(SESSION_KEY);
        root.hidden = true;
        window.location.replace("/admin/clinica/acceso/?next=%2Fadmin%2F");
        return;
      }
      unavailable("#admin-home-today");
      setStatus("No se han podido actualizar las citas de hoy. Puedes reintentar con «Actualizar» o acceder a Agenda.");
    }
  }
  document.querySelector("#admin-home-refresh")?.addEventListener("click",()=>load().catch(e=>setStatus(e?.message||"No se ha podido actualizar.")));
  document.querySelector("#admin-home-logout")?.addEventListener("click",logout);
  load().catch(error=>{
    const loading=document.querySelector("#admin-home-loading");
    if(loading)loading.textContent="No se ha podido comprobar el acceso. Actualiza para intentarlo de nuevo.";
    setStatus(error?.message||"No se ha podido iniciar el panel.");
  });

})();
