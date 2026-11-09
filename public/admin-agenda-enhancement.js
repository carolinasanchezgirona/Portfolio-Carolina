(() => {
  "use strict";
  const $ = (q) => document.querySelector(q);
  const REST = "https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const TZ = "Europe/Madrid";
  const fmt = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: TZ, hour12: false });
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
  let week = monday(today());
  let slots = [];
  let availabilityReady = false;
  let availabilityRequestId = 0;
  const free = (key) => slots.filter((s) => keyOf(s.starts_at) === key);
  const availabilityLabel = (key) => {
    if (!availabilityReady) return "Disponibilidad sin verificar";
    if (key < today() || key > addDay(today(), 30)) return "Fuera del periodo de reserva";
    if (key === today()) return "Reserva online: mínimo 24 h de antelación";
    return "Sin horarios habilitados para reserva online";
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
    const request = ++availabilityRequestId;
    try {
      const response = await fetch(REST + "/rpc/get_public_appointment_starts", {
        method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
        body: "{}", cache: "no-store",
      });
      if (!response.ok) throw new Error("Error HTTP " + response.status);
      const result = await response.json();
      if (!Array.isArray(result)) throw new Error("Formato incorrecto");
      if (request !== availabilityRequestId) return;
      slots = result.filter((s) => s && s.starts_at && s.ends_at);
      availabilityReady = true;
    } catch (error) {
      if (request !== availabilityRequestId) return;
      slots = []; availabilityReady = false;
      console.error("[agenda] No se pudo obtener disponibilidad", error);
    }
    showFreePanels();
    showMonthFreePanels();
  }
  function showMonthFreePanels() {
    document.querySelectorAll("#month-grid [data-date]").forEach((cell) => {
      const list = cell.querySelector(".month-appointments");
      list.querySelector(".agenda-free-panel")?.remove();
      list.querySelector(".month-day-menu").before(freePanel(cell.dataset.date, true));
    });
  }
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
  window.addEventListener("agenda:month-rendered", showMonthFreePanels);
  window.addEventListener("agenda:appointments-changed", loadAvailability);
  window.addEventListener("agenda:blocks-changed", loadAvailability);
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