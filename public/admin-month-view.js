(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const ZONE = "Europe/Madrid";

  const tabs = document.querySelector(".admin-view-tabs");
  const todayView = document.querySelector("#today-view");
  const weekView = document.querySelector("#week-view");
  const patientsView = document.querySelector("#patients-view");
  const dialog = document.querySelector("#appointment-dialog");
  if (!tabs || !todayView || !weekView || !patientsView || !dialog) return;

  const monthButton = document.createElement("button");
  monthButton.id = "view-month";
  monthButton.type = "button";
  monthButton.textContent = "Mes";
  tabs.insertBefore(monthButton, document.querySelector("#view-patients"));

  const section = document.createElement("section");
  section.id = "month-view";
  section.className = "admin-view";
  section.hidden = true;
  section.innerHTML = `
    <div class="month-toolbar">
      <div>
        <p class="admin-eyebrow">Vista mensual</p>
        <h2 id="month-title">Mes</h2>
      </div>
      <div class="month-nav">
        <button id="month-prev" type="button" aria-label="Mes anterior">←</button>
        <button id="month-today" type="button">Este mes</button>
        <button id="month-next" type="button" aria-label="Mes siguiente">→</button>
      </div>
    </div>
    <div class="month-summary" aria-label="Resumen mensual">
      <article><strong id="month-total">0</strong><span>Citas</span></article>
      <article><strong id="month-confirmed">0</strong><span>Confirmadas</span></article>
      <article><strong id="month-completed">0</strong><span>Realizadas</span></article>
      <article><strong id="month-cancelled">0</strong><span>Canceladas</span></article>
    </div>
    <p id="month-status" class="admin-message" role="status"></p>
    <div class="month-weekdays" aria-hidden="true">
      <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
    </div>
    <div id="month-grid" class="month-grid"></div>`;
  weekView.after(section);

  const style = document.createElement("style");
  style.textContent = `
    .month-toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:18px}.month-toolbar h2{margin:2px 0 0}.month-nav{display:flex;gap:8px}.month-nav button{min-height:40px;padding:8px 12px;border:1px solid #9EDCE7;border-radius:10px;background:#fff;color:#075A68;cursor:pointer}.month-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:18px}.month-summary article{padding:14px;border:1px solid #d8eaee;border-radius:14px;background:#fff;display:grid;gap:3px}.month-summary strong{font-size:1.4rem;color:#075A68}.month-summary span{color:#667983;font-size:.9rem}.month-weekdays,.month-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}.month-weekdays{margin-bottom:7px;text-align:center;font-size:.8rem;font-weight:700;color:#667983}.month-day{min-height:122px;padding:9px;border:1px solid #d8eaee;border-radius:12px;background:#fff;overflow:hidden}.month-day.is-outside{opacity:.42}.month-day.is-today{outline:2px solid #11A6C2;outline-offset:1px}.month-day-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px}.month-day-number{font-weight:800;color:#24343d}.month-day-count{font-size:.75rem;color:#667983}.month-appointments{display:grid;gap:5px}.month-appointment{display:block;width:100%;text-align:left;border:0;border-radius:8px;padding:6px 7px;background:#EAF6F8;color:#075A68;font-size:.78rem;line-height:1.25;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.month-appointment.is-neuro{background:#eef1ff;color:#36479f}.month-appointment.is-cancelled{opacity:.48;text-decoration:line-through}.month-more{font-size:.72rem;color:#667983;padding:2px 4px}.month-empty{font-size:.75rem;color:#9aa7ae}.month-day-add{margin-top:6px;width:100%;border:0;background:transparent;color:#11A6C2;font-size:.74rem;cursor:pointer;text-align:left;padding:2px 0}@media(max-width:900px){.month-grid,.month-weekdays{gap:4px}.month-day{min-height:96px;padding:6px}.month-appointment{font-size:.7rem;padding:5px}.month-summary{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){.month-toolbar{align-items:flex-start;flex-direction:column}.month-weekdays{display:none}.month-grid{display:grid;grid-template-columns:1fr;gap:8px}.month-day,.month-day.is-outside{min-height:auto;opacity:1}.month-day.is-outside{display:none}.month-day-head{margin-bottom:5px}.month-appointments{gap:4px}}
  `;
  document.head.append(style);

  const title = section.querySelector("#month-title");
  const grid = section.querySelector("#month-grid");
  const status = section.querySelector("#month-status");
  const total = section.querySelector("#month-total");
  const confirmed = section.querySelector("#month-confirmed");
  const completed = section.querySelector("#month-completed");
  const cancelled = section.querySelector("#month-cancelled");
  let cursor = new Date();
  cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), 1, 12));
  let rows = [];

  const monthName = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "UTC" });
  const timeFmt = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ZONE });

  function session() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }
  function headers() {
    return { apikey: KEY, Authorization: `Bearer ${session()?.access_token || ""}`, "Content-Type": "application/json" };
  }
  function dayKeyFromIso(iso) {
    const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: ZONE }).formatToParts(new Date(iso));
    const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}`;
  }
  function localIso(dateKey, time = "00:00") {
    const [y,m,d] = dateKey.split("-").map(Number); const [hh,mm] = time.split(":").map(Number);
    const guess = Date.UTC(y,m-1,d,hh,mm,0); let instant = new Date(guess);
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: ZONE, hour12:false, year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit" }).formatToParts(instant);
    const p = Object.fromEntries(parts.map(x => [x.type,x.value]));
    let offset = Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)-instant.getTime();
    instant = new Date(guess-offset);
    return instant.toISOString();
  }
  function key(y,m,d){return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}

  function showMonth() {
    [todayView, weekView, patientsView].forEach(v => v.hidden = true);
    section.hidden = false;
    tabs.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === monthButton));
    loadMonth();
  }

  async function loadMonth() {
    status.textContent = "Cargando mes…";
    const y = cursor.getUTCFullYear(); const m = cursor.getUTCMonth()+1;
    const next = m === 12 ? { y:y+1, m:1 } : { y, m:m+1 };
    const start = localIso(key(y,m,1)); const end = localIso(key(next.y,next.m,1));
    const select = "id,patient_name,patient_email,patient_phone,patient_type,status,starts_at,ends_at,price_eur,service_code,recurrence_group_id,recurrence_pattern,recurrence_index,recurrence_total";
    const url = `${REST_URL}/appointment_bookings?select=${encodeURIComponent(select)}&starts_at=gte.${encodeURIComponent(start)}&starts_at=lt.${encodeURIComponent(end)}&order=starts_at.asc`;
    try {
      const response = await fetch(url, { headers: headers(), cache: "no-store" });
      const body = await response.json().catch(() => []);
      if (!response.ok) throw new Error(body?.message || "No se ha podido cargar el mes.");
      rows = body || [];
      render(); status.textContent = "";
    } catch (error) { status.textContent = error instanceof Error ? error.message : "No se ha podido cargar el mes."; }
  }

  function render() {
    const y = cursor.getUTCFullYear(); const m0 = cursor.getUTCMonth(); const m = m0 + 1;
    title.textContent = monthName.format(cursor).replace(/^./, s => s.toUpperCase());
    total.textContent = String(rows.length);
    confirmed.textContent = String(rows.filter(r => r.status === "confirmed").length);
    completed.textContent = String(rows.filter(r => r.status === "completed").length);
    cancelled.textContent = String(rows.filter(r => ["cancelled","canceled"].includes(r.status)).length);
    grid.replaceChildren();

    const firstWeekday = (new Date(Date.UTC(y,m0,1)).getUTCDay()+6)%7;
    const days = new Date(Date.UTC(y,m,0)).getUTCDate();
    const prevMonthDays = new Date(Date.UTC(y,m0,0)).getUTCDate();
    const cells = Math.ceil((firstWeekday+days)/7)*7;
    const todayKey = dayKeyFromIso(new Date().toISOString());

    for (let i=0;i<cells;i++) {
      let cy=y, cm=m, cd=i-firstWeekday+1, outside=false;
      if (cd<1) { outside=true; cm=m-1; if (cm<1){cm=12;cy--;} cd=prevMonthDays+cd; }
      else if (cd>days) { outside=true; cd-=days; cm=m+1; if(cm>12){cm=1;cy++;} }
      const k=key(cy,cm,cd);
      const dayRows = rows.filter(r => dayKeyFromIso(r.starts_at) === k);
      const cell = document.createElement("article");
      cell.className = `month-day${outside?" is-outside":""}${k===todayKey?" is-today":""}`;
      const head = document.createElement("div"); head.className="month-day-head";
      head.innerHTML = `<span class="month-day-number">${cd}</span><span class="month-day-count">${dayRows.length ? `${dayRows.length} ${dayRows.length===1?"cita":"citas"}` : ""}</span>`;
      const list = document.createElement("div"); list.className="month-appointments";
      if (!dayRows.length) {
        const empty = document.createElement("span"); empty.className="month-empty"; empty.textContent="Sin citas"; list.append(empty);
      } else {
        dayRows.slice(0,4).forEach(r => {
          const b=document.createElement("button"); b.type="button";
          b.className=`month-appointment${r.service_code==="neuropsicologia"?" is-neuro":""}${["cancelled","canceled"].includes(r.status)?" is-cancelled":""}`;
          b.textContent=`${timeFmt.format(new Date(r.starts_at))} · ${r.patient_name}`;
          b.title=`${r.patient_name} · ${r.status}`;
          b.addEventListener("click",()=>openAppointment(r));
          list.append(b);
        });
        if(dayRows.length>4){const more=document.createElement("span");more.className="month-more";more.textContent=`+ ${dayRows.length-4} más`;list.append(more);}
      }
      if (!outside) {
        const add=document.createElement("button"); add.type="button"; add.className="month-day-add"; add.textContent="+ Añadir cita";
        add.addEventListener("click",()=>openNew(k)); list.append(add);
      }
      cell.append(head,list); grid.append(cell);
    }
  }

  function setField(selector,value){const el=document.querySelector(selector); if(el) el.value=value ?? "";}
  function openAppointment(r) {
    setField("#appointment-id", r.id); setField("#appointment-date", dayKeyFromIso(r.starts_at));
    setField("#appointment-time", timeFmt.format(new Date(r.starts_at))); setField("#appointment-name", r.patient_name);
    setField("#appointment-email", r.patient_email || ""); setField("#appointment-phone", r.patient_phone || "");
    setField("#appointment-service", r.service_code || "psicologia_general_sanitaria"); setField("#appointment-status", r.status || "confirmed");
    setField("#appointment-patient-type", r.patient_type || "existing"); setField("#appointment-price", r.price_eur ?? 60);
    const h=document.querySelector("#dialog-title"); if(h) h.textContent="Editar cita";
    const save=document.querySelector("#appointment-save"); if(save) save.textContent="Guardar cambios";
    const cancel=document.querySelector("#appointment-cancel-booking"); if(cancel) cancel.hidden=false;
    const msg=document.querySelector("#appointment-message"); if(msg) msg.textContent="";
    dialog.showModal();
  }
  function openNew(dateKey) {
    document.querySelector("#admin-new")?.click();
    setTimeout(()=>{setField("#appointment-date",dateKey);},30);
  }

  monthButton.addEventListener("click", showMonth);
  section.querySelector("#month-prev").addEventListener("click",()=>{cursor=new Date(Date.UTC(cursor.getUTCFullYear(),cursor.getUTCMonth()-1,1,12));loadMonth();});
  section.querySelector("#month-next").addEventListener("click",()=>{cursor=new Date(Date.UTC(cursor.getUTCFullYear(),cursor.getUTCMonth()+1,1,12));loadMonth();});
  section.querySelector("#month-today").addEventListener("click",()=>{const n=new Date();cursor=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),1,12));loadMonth();});

  ["#view-today","#view-week","#view-patients"].forEach(sel=>document.querySelector(sel)?.addEventListener("click",()=>{section.hidden=true;monthButton.classList.remove("active");}));
})();