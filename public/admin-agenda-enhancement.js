(() => {
  "use strict";
  const $ = (q) => document.querySelector(q);
  const REST = "https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const TZ = "Europe/Madrid";
  const fmt = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: TZ, hour12: false });
  const monthFmt = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "UTC" });
  const keyOf = (iso) => {
    const v = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(iso)).map((p) => [p.type, p.value]));
    return v.year + "-" + v.month + "-" + v.day;
  };
  const today = () => keyOf(new Date());
  const addDay = (key, days) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d + days, 12)).toISOString().slice(0, 10);
  };
  const monday = (key) => {
    const d = new Date(key + "T12:00:00Z");
    return addDay(key, 1 - (d.getUTCDay() || 7));
  };
  let month = today().slice(0, 7) + "-01";
  let week = monday(today());
  let slots = [];
  let availabilityReady = false;
  let monthRequestId = 0;
  const sessionToken = () => {
    try { return JSON.parse(sessionStorage.getItem("dememoria_admin_session") || "null")?.access_token || ""; }
    catch { return ""; }
  };
  const authHeaders = () => ({ apikey: KEY, Authorization: "Bearer " + sessionToken() });
  const free = (key) => slots.filter((s) => keyOf(s.starts_at) === key);
  const availabilityLabel = (key) => {
    if (!availabilityReady) return "Disponibilidad sin verificar";
    if (key < today() || key > addDay(today(), 30)) return "Fuera del periodo de reserva";
    return "Sin huecos reservables";
  };
  function newAppointment(key, time) {
    $("#admin-new")?.click();
    const date = $("#appointment-date"), hour = $("#appointment-time");
    if (date) date.value = key;
    if (hour) hour.value = time;
  }
  function freePanel(key, compact = false) {
    const panel = document.createElement("section");
    panel.className = "agenda-free-panel";
    const times = free(key);
    const title = document.createElement("strong");
    title.textContent = times.length ? times.length + " horas libres" : availabilityLabel(key);
    panel.append(title);
    if (times.length) {
      const row = document.createElement("div");
      row.className = "agenda-free-buttons";
      times.forEach((s) => {
        const time = fmt.format(new Date(s.starts_at));
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = time;
        b.setAttribute("aria-label", "Crear cita el " + key + " a las " + time);
        b.addEventListener("click", () => newAppointment(key, time));
        row.append(b);
      });
      panel.append(row);
    }
    if (compact) panel.classList.add("compact");
    return panel;
  }
  function showFreePanels() {
    const todayList = $("#today-list"), tomorrowList = $("#tomorrow-list"), calendar = $("#week-calendar");
    [["#today-view", todayList, today()], ["#tomorrow-view", tomorrowList, addDay(today(), 1)]].forEach(([selector, list, key]) => {
      if (!list) return;
      const view = $(selector);
      view?.querySelector(".agenda-free-panel.top-level")?.remove();
      const node = freePanel(key);
      node.classList.add("top-level");
      list.before(node);
    });
    if (!calendar) return;
    const columns = calendar.querySelectorAll(".calendar-day-column");
    columns.forEach((column, i) => {
      column.querySelector(".agenda-free-panel")?.remove();
      const body = column.querySelector(".calendar-day-body");
      if (body) body.append(freePanel(addDay(week, i), true));
    });
  }
  async function loadAvailability() {
    try {
      const response = await fetch(REST + "/rpc/get_public_appointment_starts", {
        method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
        body: "{}", cache: "no-store",
      });
      if (!response.ok) throw new Error("Error HTTP " + response.status);
      const result = await response.json();
      if (!Array.isArray(result)) throw new Error("Formato incorrecto");
      slots = result.filter((s) => s && s.starts_at && s.ends_at);
      availabilityReady = true;
    } catch (error) {
      slots = []; availabilityReady = false;
      console.error("[agenda] No se pudo obtener disponibilidad", error);
    }
    showFreePanels();
    if (!$("#month-view")?.hidden) await renderMonth();
  }
  function setMonthView() {
    ["#today-view", "#tomorrow-view", "#week-view", "#patients-view"].forEach((id) => {
      const el = $(id); if (el) el.hidden = true;
    });
    const el = $("#month-view");
    if (el) el.hidden = false;
    document.querySelectorAll(".agenda-view-tabs-source button").forEach((b) => b.classList.toggle("active", b.id === "view-month"));
    if ($("#admin-agenda-view-select")) $("#admin-agenda-view-select").value = "view-month";
    renderMonth();
  }
  async function renderMonth() {
    const calendar = $("#month-calendar"), title = $("#month-title"), status = $("#month-status");
    if (!calendar || !title) return;
    const requestId = ++monthRequestId;
    const [y, m] = month.split("-").map(Number);
    const first = new Date(Date.UTC(y, m - 1, 1, 12));
    const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
    title.textContent = monthFmt.format(first);
    status.textContent = "Consultando ocupación…";
    const start = month + "T00:00:00";
    const endMonth = new Date(Date.UTC(y, m, 1, 12)).toISOString().slice(0, 7) + "-01";
    const end = endMonth + "T00:00:00";
    // Offset by a day on both edges to cover Madrid midnight and DST transitions.
    const dateStart = new Date(Date.parse(start + "Z") - 86400000).toISOString();
    const dateEnd = new Date(Date.parse(end + "Z") + 86400000).toISOString();
    let bookings = [], blocks = [], verified = false;
    try {
      const headers = authHeaders();
      if (!sessionToken()) throw new Error("No hay sesión administrativa.");
      const bookUrl = REST + "/appointment_bookings?select=starts_at,status&starts_at=gte." + encodeURIComponent(dateStart) + "&starts_at=lt." + encodeURIComponent(dateEnd) + "&order=starts_at.asc";
      const blockUrl = REST + "/appointment_schedule_blocks?select=starts_at,ends_at&starts_at=lt." + encodeURIComponent(dateEnd) + "&ends_at=gt." + encodeURIComponent(dateStart);
      const [a, b] = await Promise.all([
        fetch(bookUrl, { headers, cache: "no-store" }),
        fetch(blockUrl, { headers, cache: "no-store" }),
      ]);
      if (!a.ok || !b.ok) throw new Error("No se puede verificar la ocupación.");
      bookings = await a.json();
      blocks = await b.json();
      verified = true;
    } catch (error) {
      console.error("[agenda] Calendario mensual", error);
    }
    if (requestId !== monthRequestId) return;
    calendar.replaceChildren();
    ["L", "M", "X", "J", "V", "S", "D"].forEach((label) => {
      const cell = document.createElement("div");
      cell.className = "agenda-month-dayname"; cell.textContent = label; calendar.append(cell);
    });
    for (let n = 0; n < (first.getUTCDay() + 6) % 7; n++) {
      const empty = document.createElement("span"); empty.className = "agenda-month-empty"; calendar.append(empty);
    }
    for (let n = 1; n <= days; n++) {
      const key = y + "-" + String(m).padStart(2, "0") + "-" + String(n).padStart(2, "0");
      const busy = verified ? bookings.filter((b) => keyOf(b.starts_at) === key && !["cancelled", "canceled"].includes(b.status)).length : null;
      const blocked = verified ? blocks.filter((b) => keyOf(b.starts_at) <= key && keyOf(new Date(Date.parse(b.ends_at) - 1000)) >= key).length : null;
      const times = free(key);
      const cell = document.createElement("article");
      cell.className = "agenda-month-cell" + (key === today() ? " today" : "");
      const day = document.createElement("strong"); day.textContent = String(n);
      const counts = document.createElement("span"); counts.textContent = verified ? busy + " citas · " + blocked + " bloqueos" : "Ocupación sin verificar";
      const freeText = document.createElement("em"); freeText.textContent = times.length ? times.length + " horas libres" : availabilityLabel(key);
      cell.append(day, counts, freeText);
      if (times.length) {
        const buttons = document.createElement("div"); buttons.className = "agenda-month-hours";
        times.forEach((slot) => {
          const time = fmt.format(new Date(slot.starts_at));
          const b = document.createElement("button"); b.type = "button"; b.textContent = time;
          b.addEventListener("click", () => newAppointment(key, time)); buttons.append(b);
        });
        cell.append(buttons);
      }
      calendar.append(cell);
    }
    status.textContent = verified
      ? "Horas libres obtenidas de la reserva pública (próximos 30 días). Los días fuera de ese periodo no tienen disponibilidad verificada."
      : "No se ha podido comprobar la ocupación. No interpretes los huecos como libres.";
  }
  function changeMonth(delta) {
    const [y, m] = month.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1 + delta, 1, 12));
    month = date.toISOString().slice(0, 7) + "-01";
    renderMonth();
  }
  const dropdown = $("#admin-agenda-view-select");
  dropdown?.addEventListener("change", () => {
    if (dropdown.value === "view-month") setMonthView();
    else $("#" + dropdown.value)?.click();
  });
  $("#view-month")?.addEventListener("click", setMonthView);
  ["view-today", "view-tomorrow", "view-week", "view-patients"].forEach((id) => {
    $("#" + id)?.addEventListener("click", () => {
      if ($("#month-view")) $("#month-view").hidden = true;
      if (dropdown) dropdown.value = id;
    });
  });
  $("#month-prev")?.addEventListener("click", () => changeMonth(-1));
  $("#month-next")?.addEventListener("click", () => changeMonth(1));
  $("#month-today")?.addEventListener("click", () => { month = today().slice(0, 7) + "-01"; renderMonth(); });
  $("#week-prev")?.addEventListener("click", () => { week = addDay(week, -7); });
  $("#week-next")?.addEventListener("click", () => { week = addDay(week, 7); });
  $("#week-today")?.addEventListener("click", () => { week = monday(today()); });
  $("#view-today")?.addEventListener("click", () => { week = monday(today()); });
  $("#view-tomorrow")?.addEventListener("click", () => { week = monday(addDay(today(), 1)); });
  const weekGrid = $("#week-calendar");
  let refreshPending = false;
  weekGrid && new MutationObserver((records) => {
    if (!records.some((r) => [...r.addedNodes].some((node) => node.nodeType === 1 && node.classList?.contains("calendar-day-column")))) return;
    if (refreshPending) return;
    refreshPending = true;
    queueMicrotask(() => { refreshPending = false; showFreePanels(); });
  }).observe(weekGrid, { childList: true });
  const app = $("#admin-app");
  const start = () => {
    if (app.hidden) return;
    showFreePanels();
    loadAvailability();
  };
  if (app && !app.hidden) start();
  else if (app) {
    const watch = new MutationObserver(() => {
      if (!app.hidden) { watch.disconnect(); start(); }
    });
    watch.observe(app, { attributes: true, attributeFilter: ["hidden"] });
  }
})();