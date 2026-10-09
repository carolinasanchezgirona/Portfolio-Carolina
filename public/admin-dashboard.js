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


  const numberFormat = new Intl.NumberFormat("es-ES");
  const money = amount => new Intl.NumberFormat("es-ES", {style:"currency",currency:"EUR"}).format(Number(amount||0)/100);
  const ready = result => result.status === "fulfilled";
  const resultOf = result => ready(result) ? result.value : [];

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

  async function load() {
    const user = await currentUser();
    if (!user) {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.replace("/admin/clinica/acceso/?next=%2Fadmin%2F");
      return;
    }
    root.hidden = false;
    const loading = document.querySelector("#admin-home-loading");
    if (loading) loading.hidden = true;

    const today = madridDateKey(), tomorrow = addDays(today,1);
    const start = localIso(today), end = localIso(tomorrow);
    const now = new Date().toISOString();
    const dateEl = document.querySelector("#admin-home-date");
    if (dateEl) dateEl.textContent = new Intl.DateTimeFormat("es-ES", {
      weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:ZONE
    }).format(new Date());
    setStatus("Consultando actividad…");

    const results = await Promise.allSettled([
      get("appointment_bookings?select=id,patient_name,status,starts_at,service_code&starts_at=gte."+encodeURIComponent(start)+"&starts_at=lt."+encodeURIComponent(end)+"&order=starts_at.asc&limit=200"),
      get("clinical_admin_tasks?select=id,title,status,priority,due_at,created_at&status=neq.completed&order=due_at.asc.nullslast,created_at.asc&limit=50"),
      get("expert_questions?select=id,status,created_at,category,question_public&status=neq.published&status=neq.discarded&order=created_at.asc&limit=100"),
      get("articles?select=id,title,status,scheduled_at,updated_at&or=(status.eq.draft,status.eq.scheduled)&order=updated_at.desc&limit=100"),
      get("digital_resource_orders?select=id,payment_status,amount_total,currency,created_at,paid_at&order=created_at.desc&limit=100"),
      get("billing_invoices?select=id,status,total_cents,recipient_name,issue_date,created_at&order=created_at.desc&limit=1000"),
      get("billing_receipts?select=invoice_id,amount_cents&limit=1000"),
      get("billing_issuer_settings?select=tax_id,fiscal_address,first_invoice_year,first_invoice_number&id=eq.1"),
    ]);
    if (results.some(r => r.status === "rejected" && r.reason?.message === "session")) {
      sessionStorage.removeItem(SESSION_KEY);
      root.hidden = true;
      window.location.replace("/admin/clinica/acceso/?next=%2Fadmin%2F");
      return;
    }

    const [a,t,q,ar,o,bi,br,issuer] = results;
    const appointments=resultOf(a), tasks=resultOf(t), questions=resultOf(q), articles=resultOf(ar),
      orders=resultOf(o), invoices=resultOf(bi), receipts=resultOf(br), settings=resultOf(issuer);
    const todayActive = appointments.filter(row => !["cancelled","canceled"].includes(String(row.status||"")));
    const overdue = tasks.filter(row => row.due_at && row.due_at < now);
    const pendingQuestions = questions.filter(row => !["published","discarded"].includes(row.status));
    const scheduled = articles.filter(row => row.status === "scheduled" && row.scheduled_at);
    const ordersPaid = orders.filter(row => ["paid","complete","succeeded"].includes(String(row.payment_status||"").toLowerCase()));

    const paidById = new Map();
    receipts.forEach(row => paidById.set(row.invoice_id,(paidById.get(row.invoice_id)||0)+Number(row.amount_cents||0)));
    const issued = invoices.filter(row => row.status === "issued");
    const open = ready(bi) && ready(br) ? issued.filter(row =>
      Number(row.total_cents||0) > (paidById.get(row.id)||0)
    ) : [];
    const amountOpen = open.reduce((sum,row)=>sum+Math.max(0,Number(row.total_cents||0)-(paidById.get(row.id)||0)),0);
    const fiscalReady = Boolean(ready(issuer) && settings[0] &&
      String(settings[0].tax_id||"").trim().length>=8 &&
      String(settings[0].fiscal_address||"").trim().length>=10 &&
      Number.isInteger(settings[0].first_invoice_year) &&
      Number.isInteger(settings[0].first_invoice_number));

    const priorities = document.querySelector("#admin-home-priorities");
    if (priorities) priorities.innerHTML = [
      priorityCard("/admin/agenda/",ready(a)?numberFormat.format(todayActive.length):"—","citas de hoy"),
      priorityCard("/admin/clinica/?panel=1",ready(t)?numberFormat.format(tasks.length):"—","tareas clínicas",overdue.length>0),
      priorityCard("/admin/economia/",ready(bi)&&ready(br)?numberFormat.format(open.length):"—","facturas por cobrar",open.length>0),
      priorityCard("/admin/preguntas/",ready(q)?numberFormat.format(pendingQuestions.length):"—","preguntas pendientes",pendingQuestions.length>0),
      priorityCard("/admin/articulos/",ready(ar)?numberFormat.format(scheduled.length):"—","artículos programados"),
      priorityCard("/admin/recursos/",ready(o)?numberFormat.format(ordersPaid.length):"—","ventas recientes de recursos"),
    ].join("");

    if(ready(a)){
      const timeFmt = new Intl.DateTimeFormat("es-ES",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:ZONE});
      renderList("#admin-home-today",todayActive,row =>
        '<div class="admin-home-item"><div><strong>'+esc(row.patient_name||"Cita")+
        '</strong><span>'+esc(row.service_code==="neuropsicologia"?"Neuropsicología":"Consulta")+
        '</span></div><small>'+esc(timeFmt.format(new Date(row.starts_at)))+'</small></div>',
        "No hay citas programadas hoy.");
    } else unavailable("#admin-home-today");

    if(ready(t)){
      const fmt = new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"2-digit",timeZone:ZONE});
      renderList("#admin-home-clinical",tasks,row =>
        '<div class="admin-home-item"><div><strong>'+esc(row.title||"Tarea clínica")+
        '</strong><span>'+esc(row.priority||"normal")+
        (row.due_at?" · "+esc(fmt.format(new Date(row.due_at))):"")+
        '</span></div>'+(row.due_at&&row.due_at<now?"<small>Vencida</small>":"")+'</div>',
        "No hay tareas clínicas pendientes.");
    } else unavailable("#admin-home-clinical");

    if(ready(bi)&&ready(br)){
      const draftCount=invoices.filter(row=>row.status==="draft").length;
      const rows=[
        {label:"Pendiente por cobrar",value:money(amountOpen),note:open.length+" facturas"},
        {label:"Borradores",value:numberFormat.format(draftCount),note:"Sin emitir"},
      ];
      if(ready(issuer)&&!fiscalReady)rows.push({label:"Datos fiscales",value:"Pendientes",note:"Completar antes de emitir"});
      renderList("#admin-home-economy",rows,row =>
        '<div class="admin-home-item"><div><strong>'+esc(row.label)+'</strong><span>'+esc(row.note)+
        '</span></div><small>'+esc(row.value)+'</small></div>',"Sin movimiento económico.");
    } else unavailable("#admin-home-economy");

    if(ready(q)&&ready(ar)){
      const editorial=[
        ...pendingQuestions.slice(0,3).map(row=>({type:"Pregunta",title:row.question_public||row.category||"Pregunta pendiente",meta:row.status})),
        ...articles.slice(0,3).map(row=>({type:"Artículo",title:row.title||"Artículo sin título",meta:row.status})),
      ];
      renderList("#admin-home-editorial",editorial,row =>
        '<div class="admin-home-item"><div><strong>'+esc(row.title)+
        '</strong><span>'+esc(row.type)+'</span></div><small>'+esc(row.meta||"")+'</small></div>',
        "No hay pendientes editoriales destacados.");
    } else unavailable("#admin-home-editorial");

    if(ready(o)){
      const fmt = new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"2-digit",timeZone:ZONE});
      renderList("#admin-home-commerce",ordersPaid,row =>
        '<div class="admin-home-item"><div><strong>'+esc(money(row.amount_total))+
        '</strong><span>Recurso digital · pago registrado</span></div><small>'+
        esc(fmt.format(new Date(row.paid_at||row.created_at)))+'</small></div>',
        "Todavía no hay ventas recientes de recursos.");
    } else unavailable("#admin-home-commerce");

    const fails=results.filter(r=>r.status==="rejected").length;
    setStatus(fails>0?"Hay "+fails+" áreas sin actualizar; los demás datos se muestran con normalidad.":"");
  }
  document.querySelector("#admin-home-refresh")?.addEventListener("click",()=>load().catch(e=>setStatus(e?.message||"No se ha podido actualizar.")));
  document.querySelector("#admin-home-logout")?.addEventListener("click",logout);
  load().catch(error=>{
    const loading=document.querySelector("#admin-home-loading");
    if(loading)loading.textContent="No se ha podido comprobar el acceso. Actualiza para intentarlo de nuevo.";
    setStatus(error?.message||"No se ha podido iniciar el panel.");
  });
})();
