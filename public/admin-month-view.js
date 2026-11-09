(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const ZONE = "Europe/Madrid";

  const tabs = document.querySelector(".admin-view-tabs");
  const monthButton = document.querySelector("#view-month");
  const section = document.querySelector("#month-view");
  if (!tabs || !monthButton || !section) return;

  // Los estilos del calendario se mantienen en app/admin/agenda/month-view.css.


  const title = section.querySelector("#month-title");
  const grid = section.querySelector("#month-grid");
  const status = section.querySelector("#month-status");
  const total = section.querySelector("#month-total");
  const confirmed = section.querySelector("#month-confirmed");
  const completed = section.querySelector("#month-completed");
  function monthAtMadridNow() {
    const [year, month] = dayKeyFromIso(new Date().toISOString()).split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, 1, 12));
  }
  let cursor = monthAtMadridNow();
  let monthRequest = 0;
  let rows = [];
  let blocks = [];
  let holidays = [];
  let dateOpenings = [];
  let dateExceptions = [];

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
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: ZONE, hourCycle:"h23", year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit" }).formatToParts(instant);
    const p = Object.fromEntries(parts.map(x => [x.type,x.value]));
    const offset = Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)-instant.getTime();
    instant = new Date(guess-offset);
    return instant.toISOString();
  }
  function key(y,m,d){return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}

  function showMonth() {
    document.querySelectorAll("#today-view, #tomorrow-view, #week-view, #patients-view, #waitlist-view")
      .forEach(view => { view.hidden = true; });
    section.hidden = false;
    tabs.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === monthButton));
    loadMonth();
  }

  async function loadMonth() {
    const request = ++monthRequest;
    status.textContent = "Cargando mes…";
    const y = cursor.getUTCFullYear(); const m = cursor.getUTCMonth()+1;
    const next = m === 12 ? { y:y+1, m:1 } : { y, m:m+1 };
    const startKey = key(y,m,1); const endKey = key(next.y,next.m,1);
    const start = localIso(startKey); const end = localIso(endKey);
    const select = "id,patient_name,patient_email,patient_phone,patient_type,status,starts_at,ends_at,price_eur,service_code,recurrence_group_id,recurrence_pattern,recurrence_index,recurrence_total";
    const urls = {
      bookings: `${REST_URL}/appointment_bookings?select=${encodeURIComponent(select)}&starts_at=gte.${encodeURIComponent(start)}&starts_at=lt.${encodeURIComponent(end)}&order=starts_at.asc`,
      blocks: `${REST_URL}/appointment_schedule_blocks?select=starts_at,ends_at&starts_at=lt.${encodeURIComponent(end)}&ends_at=gt.${encodeURIComponent(start)}`,
      holidays: `${REST_URL}/appointment_calendar_holidays?select=holiday_date,name,scope,source_url&holiday_date=gte.${startKey}&holiday_date=lt.${endKey}&order=holiday_date.asc`,
      openings: `${REST_URL}/appointment_date_openings?select=id,opening_date,starts_at,ends_at,reason&opening_date=gte.${startKey}&opening_date=lt.${endKey}&order=opening_date.asc,starts_at.asc`,
      exceptions: `${REST_URL}/appointment_date_exceptions?select=exception_date,reason&exception_date=gte.${startKey}&exception_date=lt.${endKey}&order=exception_date.asc`,
    };
    try {
      const [bookingsRes, blocksRes, holidaysRes, openingsRes, exceptionsRes] = await Promise.all(
        Object.values(urls).map(url => fetch(url, { headers: headers(), cache: "no-store" }))
      );
      const [bookingsBody, blocksBody, holidaysBody, openingsBody, exceptionsBody] = await Promise.all(
        [bookingsRes, blocksRes, holidaysRes, openingsRes, exceptionsRes].map(r => r.json().catch(() => []))
      );
      if (request !== monthRequest) return;
      if (!bookingsRes.ok) throw new Error(bookingsBody?.message || "No se ha podido cargar el mes.");
      if (!holidaysRes.ok) throw new Error(holidaysBody?.message || "No se han podido cargar los festivos.");
      if (!openingsRes.ok) throw new Error(openingsBody?.message || "No se han podido cargar las aperturas.");
      if (!exceptionsRes.ok) throw new Error(exceptionsBody?.message || "No se han podido cargar los cierres.");
      rows = bookingsBody.filter(row => !["cancelled", "canceled"].includes(row.status));
      blocks = blocksRes.ok ? blocksBody : null;
      holidays = holidaysBody || [];
      dateOpenings = openingsBody || [];
      dateExceptions = exceptionsBody || [];
      render(); status.textContent = "";
    } catch (error) {
      if (request !== monthRequest) return;
      grid.replaceChildren();
      [total, confirmed, completed].forEach(counter => { counter.textContent = "—"; });
      status.textContent = error instanceof Error ? error.message : "No se ha podido cargar el mes.";
    }
  }


  const scopeLabel = {
    national: "Nacional",
    catalonia: "Catalunya",
    barcelona: "Barcelona",
    arenys_de_mar: "Arenys de Mar",
  };

  function holidaysFor(keyValue) { return holidays.filter(h => h.holiday_date === keyValue); }
  function openingsFor(keyValue) { return dateOpenings.filter(o => o.opening_date === keyValue); }
  function exceptionFor(keyValue) { return dateExceptions.find(e => e.exception_date === keyValue); }
  function isoWeekday(keyValue) {
    const [yy,mm,dd] = keyValue.split("-").map(Number);
    const day = new Date(Date.UTC(yy,mm-1,dd,12)).getUTCDay();
    return day === 0 ? 7 : day;
  }

  function ensureAvailabilityDialog() {
    let d = document.querySelector("#day-availability-dialog");
    if (d) return d;
    d = document.createElement("dialog");
    d.id = "day-availability-dialog";
    d.className = "day-availability-dialog";
    d.innerHTML = `
      <form id="day-availability-form">
        <div class="dialog-heading">
          <div><p class="admin-eyebrow">Disponibilidad excepcional</p><h2>Abrir fecha</h2></div>
          <button id="day-availability-close" class="dialog-close" type="button" aria-label="Cerrar">×</button>
        </div>
        <input id="day-availability-date" type="hidden">
        <p id="day-availability-label" class="admin-note"></p>
        <div class="form-grid two-cols">
          <label>Desde<input id="day-availability-start" type="time" step="1800" value="09:00" required></label>
          <label>Hasta<input id="day-availability-end" type="time" step="1800" value="13:00" required></label>
        </div>
        <label>Motivo opcional<input id="day-availability-reason" type="text" maxlength="120" placeholder="Sábado de consulta, disponibilidad especial…"></label>
        <p id="day-availability-message" class="admin-message"></p>
        <div class="dialog-actions">
          <button id="day-availability-cancel" class="admin-secondary" type="button">Cancelar</button>
          <button class="admin-primary" type="submit">Abrir horario</button>
        </div>
      </form>`;
    document.body.append(d);
    d.querySelector("#day-availability-close").addEventListener("click",()=>d.close());
    d.querySelector("#day-availability-cancel").addEventListener("click",()=>d.close());
    d.querySelector("#day-availability-form").addEventListener("submit", async (event)=>{
      event.preventDefault();
      const date = d.querySelector("#day-availability-date").value;
      const starts_at = d.querySelector("#day-availability-start").value;
      const ends_at = d.querySelector("#day-availability-end").value;
      const reason = d.querySelector("#day-availability-reason").value.trim() || null;
      const msg = d.querySelector("#day-availability-message");
      if (!date || !starts_at || !ends_at || ends_at <= starts_at) {
        msg.textContent = "Comprueba la franja horaria.";
        return;
      }
      msg.textContent = "Guardando…";
      const response = await fetch(`${REST_URL}/appointment_date_openings`, {
        method:"POST", headers:{...headers(), Prefer:"return=minimal"},
        body:JSON.stringify({opening_date:date, starts_at, ends_at, reason})
      });
      const body = await response.json().catch(()=>({}));
      if (!response.ok) {
        msg.textContent = body?.code === "23505" ? "Esa apertura ya existe." : (body?.message || "No se ha podido abrir la fecha.");
        return;
      }
      d.close();
      window.dispatchEvent(new Event("agenda:blocks-changed"));
    });
    return d;
  }

  function openExceptionalDay(keyValue) {
    const d = ensureAvailabilityDialog();
    d.querySelector("#day-availability-date").value = keyValue;
    d.querySelector("#day-availability-label").textContent = `Abrir ${keyValue} para reservas públicas. Esta apertura no modifica el resto de sábados.`;
    d.querySelector("#day-availability-message").textContent = "";
    d.showModal();
  }

  async function removeOpening(opening) {
    if (!window.confirm("¿Cerrar esta apertura excepcional? Las citas ya existentes no se cancelarán.")) return;
    const response = await fetch(`${REST_URL}/appointment_date_openings?id=eq.${encodeURIComponent(opening.id)}`, {method:"DELETE",headers:headers()});
    if (!response.ok) return status.textContent = "No se ha podido cerrar la apertura excepcional.";
    window.dispatchEvent(new Event("agenda:blocks-changed"));
  }

  async function closeWholeDay(keyValue) {
    if (!window.confirm(`¿Cerrar el día ${keyValue} para nuevas reservas? Las citas ya existentes se conservan.`)) return;
    const response = await fetch(`${REST_URL}/appointment_date_exceptions`, {
      method:"POST", headers:{...headers(),Prefer:"resolution=merge-duplicates,return=minimal"},
      body:JSON.stringify({exception_date:keyValue,reason:"Cerrado manualmente desde la agenda"})
    });
    const body=await response.json().catch(()=>({}));
    if (!response.ok) return status.textContent = body?.message || "No se ha podido cerrar el día.";
    window.dispatchEvent(new Event("agenda:blocks-changed"));
  }

  async function reopenWholeDay(keyValue) {
    if (!window.confirm(`¿Reabrir el día ${keyValue} según su disponibilidad habitual o excepcional?`)) return;
    const response = await fetch(`${REST_URL}/appointment_date_exceptions?exception_date=eq.${encodeURIComponent(keyValue)}`, {method:"DELETE",headers:headers()});
    if (!response.ok) return status.textContent = "No se ha podido reabrir el día.";
    window.dispatchEvent(new Event("agenda:blocks-changed"));
  }

  function render() {
    const y = cursor.getUTCFullYear(); const m0 = cursor.getUTCMonth(); const m = m0 + 1;
    title.textContent = monthName.format(cursor).replace(/^./, s => s.toUpperCase());
    total.textContent = String(rows.length);
    confirmed.textContent = String(rows.filter(r => r.status === "confirmed").length);
    completed.textContent = String(rows.filter(r => r.status === "completed").length);
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
      const dayHolidays = holidaysFor(k);
      const dayOpenings = openingsFor(k);
      const dayException = exceptionFor(k);
      const weekday = isoWeekday(k);
      const cell = document.createElement("article");
      cell.className = `month-day${outside?" is-outside":""}${k===todayKey?" is-today":""}`;
      const head = document.createElement("div"); head.className="month-day-head";
      head.innerHTML = `<span class="month-day-number">${cd}</span><span class="month-day-count">${dayRows.length ? `${dayRows.length} ${dayRows.length===1?"cita":"citas"}` : ""}</span>`;
      const list = document.createElement("div"); list.className="month-appointments";
      if (!outside && dayHolidays.length) {
        const holidayBox = document.createElement("div"); holidayBox.className="month-holidays";
        dayHolidays.forEach(h => {
          const badge=document.createElement("span");
          badge.className=`month-holiday${["barcelona","arenys_de_mar"].includes(h.scope)?" is-local":""}`;
          badge.textContent=`${h.name} · ${scopeLabel[h.scope] || h.scope}`;
          badge.title="Festivo informativo. No bloquea reservas automáticamente.";
          holidayBox.append(badge);
        });
        list.append(holidayBox);
      }
      if (!outside) {
        cell.dataset.date = k;
        const availability=document.createElement("div"); availability.className="month-availability";
        const tag=document.createElement("span"); tag.className="month-availability-tag";
        if (dayException) { tag.classList.add("is-closed"); tag.textContent="Cerrado manualmente"; }
        else if (dayOpenings.length) { tag.classList.add("is-open"); tag.textContent="Apertura excepcional"; }
        else if (weekday===7) { tag.classList.add("is-closed"); tag.textContent="Domingo · cerrado por defecto"; }
        else if (weekday===6) { tag.textContent="Sábado · cerrado por defecto"; }
        else { tag.textContent="Según horario habitual"; }
        availability.append(tag);
        const blocked = blocks?.filter(block =>
          dayKeyFromIso(block.starts_at) <= k && dayKeyFromIso(new Date(Date.parse(block.ends_at) - 1)) >= k
        ).length;
        if (blocked !== 0) {
          const badge = document.createElement("span");
          badge.className = "month-availability-tag is-closed";
          badge.textContent = blocked == null ? "Bloqueos sin verificar" : blocked + (blocked === 1 ? " bloqueo" : " bloqueos");
          availability.append(badge);
        }
        list.append(availability);
      }
      if (!dayRows.length) {
        const empty = document.createElement("span"); empty.className="month-empty"; empty.textContent="Sin citas"; list.append(empty);
      } else {
        dayRows.slice(0,4).forEach(r => {
          const b=document.createElement("button"); b.type="button";
          b.className=`month-appointment${r.service_code==="neuropsicologia"?" is-neuro":""}`;
          b.textContent=`${timeFmt.format(new Date(r.starts_at))} · ${r.patient_name}`;
          b.title=`${r.patient_name} · ${r.status}`;
          b.addEventListener("click",() => window.dispatchEvent(new CustomEvent("agenda:edit-appointment", { detail: r })));
          list.append(b);
        });
        if(dayRows.length>4){const more=document.createElement("span");more.className="month-more";more.textContent=`+ ${dayRows.length-4} más`;list.append(more);}
      }
      if (!outside) {
        // Un único menú contextual por día: los controles no ocupan cada celda.
        const dayMenu=document.createElement("details"); dayMenu.className="month-day-menu";
        const menuTrigger=document.createElement("summary");
        menuTrigger.textContent="Opciones del día";
        menuTrigger.setAttribute("aria-label","Opciones del día "+k);
        const dayMenuPanel=document.createElement("div"); dayMenuPanel.className="month-day-menu-panel";
        const controls=document.createElement("div"); controls.className="month-day-controls";
        if (weekday === 6) {
          if (dayOpenings.length) {
            dayOpenings.forEach(opening => {
              const closeOpening=document.createElement("button"); closeOpening.type="button"; closeOpening.className="month-day-control";
              closeOpening.textContent=`Cerrar ${String(opening.starts_at).slice(0,5)}–${String(opening.ends_at).slice(0,5)}`;
              closeOpening.addEventListener("click",()=>removeOpening(opening)); controls.append(closeOpening);
            });
          } else if (!dayException) {
            const openSaturday=document.createElement("button"); openSaturday.type="button"; openSaturday.className="month-day-control";
            openSaturday.textContent="Abrir sábado"; openSaturday.addEventListener("click",()=>openExceptionalDay(k)); controls.append(openSaturday);
          }
        }
        if (dayException) {
          const reopen=document.createElement("button"); reopen.type="button"; reopen.className="month-day-control";
          reopen.textContent="Reabrir día"; reopen.addEventListener("click",()=>reopenWholeDay(k)); controls.append(reopen);
        } else if (weekday !== 7) {
          const closeDay=document.createElement("button"); closeDay.type="button"; closeDay.className="month-day-control is-danger";
          closeDay.textContent="Cerrar día"; closeDay.addEventListener("click",()=>closeWholeDay(k)); controls.append(closeDay);
        }
        dayMenuPanel.append(controls);
        const add=document.createElement("button"); add.type="button"; add.className="month-day-add"; add.textContent="Añadir cita";
        add.addEventListener("click",()=>openNew(k)); dayMenuPanel.append(add);
        dayMenu.append(menuTrigger,dayMenuPanel); list.append(dayMenu);
      }
      cell.append(head,list); grid.append(cell);
    }
    window.dispatchEvent(new Event("agenda:month-rendered"));
  }

  function setField(selector,value){const el=document.querySelector(selector); if(el) el.value=value ?? "";}
  function openNew(dateKey) {
    document.querySelector("#admin-new")?.click();
    setTimeout(()=>{setField("#appointment-date",dateKey);},30);
  }

  function refreshMonth() {
    if (!section.hidden) loadMonth();
  }

  window.addEventListener("agenda:appointments-changed", refreshMonth);
  window.addEventListener("agenda:blocks-changed", refreshMonth);
  monthButton.addEventListener("click", showMonth);
  section.querySelector("#month-prev").addEventListener("click",()=>{cursor=new Date(Date.UTC(cursor.getUTCFullYear(),cursor.getUTCMonth()-1,1,12));loadMonth();});
  section.querySelector("#month-next").addEventListener("click",()=>{cursor=new Date(Date.UTC(cursor.getUTCFullYear(),cursor.getUTCMonth()+1,1,12));loadMonth();});
  section.querySelector("#month-today").addEventListener("click",()=>{cursor=monthAtMadridNow();loadMonth();});

  ["#view-today","#view-tomorrow","#view-week","#view-patients"].forEach(sel=>document.querySelector(sel)?.addEventListener("click",()=>{section.hidden=true;monthButton.classList.remove("active");}));
})();
// build 20260915-2
