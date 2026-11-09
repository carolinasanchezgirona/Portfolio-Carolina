(() => {
  "use strict";
  // All nodes stay inside the original clinical form. Tabs change presentation only:
  // no records are copied to browser storage and no new medical conclusions are inferred.
  const page = document.querySelector("#clinic-patient-dialog");
  const form = document.querySelector("#clinic-patient-form");
  const note = document.querySelector("#clinic-delete-patient-note");
  if (!page || !form || !note || form.querySelector("#clinic-patient-workspace-nav")) return;

  const select = q => form.querySelector(q);
  const record = select(".clinic-record-sections");
  const details = record ? Array.from(record.children).filter(x => x.matches("details.clinic-record-section")) : [];
  const tools = select(".clinic-patient-tools-grid");
  const toolCards = tools ? Array.from(tools.children).filter(x => x.matches("article")) : [];
  const summaryGrid = select("#clinic-summary-note")?.closest(".clinic-form-grid");
  const summarySave = select("#clinic-patient-message")?.closest(".clinic-form-actions");
  const bottomSave = select(".clinic-form-actions-bottom");
  const exercise = select(".clinic-exercises-section");
  const dashboard = select("#clinic-patient-dashboard");
  const preparation = select(".clinic-preparation");
  const goals = select(".clinic-goals-manager");
  const reviews = select(".clinic-process-reviews");
  const tasks = select(".clinic-task-box");
  const consents = select(".clinic-consent-section");
  const audit = select(".clinic-audit-section");
  const duplicates = select("#clinic-duplicate-panel");
  const savedReports = select("#clinic-patient-reports");
  const history = select("#clinic-patient-history");
  if (details.length !== 5 || toolCards.length !== 3 || !summaryGrid || !preparation || !bottomSave || !exercise || !savedReports || !history) return;

  const layout = [
    ["resumen","Resumen","Situación clínica actual y foco de la próxima sesión"],
    ["sesiones","Sesiones","Registro de sesiones, citas y evolución longitudinal"],
    ["tratamiento","Tratamiento","Objetivos, evolución, técnicas y material"],
    ["evaluacion","Evaluación","Pruebas, mediciones e hipótesis diagnósticas"],
    ["historia","Historia","Anamnesis, formulación, seguridad y coordinación"],
    ["documentos","Informes","Informes, documentos y archivos compartidos"],
    ["datos","Datos","Identificación, acceso del paciente y administración"]
  ];

  const navigation = document.createElement("nav");
  navigation.id = "clinic-patient-workspace-nav";
  navigation.className = "clinic-patient-workspace-nav";
  navigation.setAttribute("aria-label", "Apartados de la ficha clínica");
  navigation.setAttribute("role", "tablist");

  const workspace = document.createElement("div");
  workspace.id = "clinic-patient-workspace";
  workspace.className = "clinic-patient-workspace";
  const panels = new Map();
  const buttons = new Map();

  for (const [id,label,description] of layout) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "clinic-workspace-tab";
    button.textContent = label;
    button.dataset.workspaceTab = id;
    button.id = "clinic-tab-" + id;
    button.setAttribute("aria-controls","clinic-panel-" + id);
    button.setAttribute("role","tab");
    button.setAttribute("aria-selected","false");
    button.tabIndex = -1;
    navigation.append(button);
    buttons.set(id,button);

    const panel = document.createElement("section");
    panel.id = "clinic-panel-" + id;
    panel.dataset.workspacePanel = id;
    panel.className = "clinic-workspace-panel";
    panel.setAttribute("role","tabpanel");
    panel.setAttribute("aria-labelledby",button.id);
    panel.tabIndex = 0;
    const header = document.createElement("div");
    header.className = "clinic-workspace-panel-heading";
    const h3 = document.createElement("h3");
    h3.textContent = label;
    const p = document.createElement("p");
    p.textContent = description;
    header.append(h3,p);
    panel.append(header);
    workspace.append(panel);
    panels.set(id,panel);
  }

  function add(id, node) { if (node) panels.get(id).append(node); }
  // Preserve native form submission and all existing input IDs.
  add("resumen",dashboard);
  add("resumen",preparation);
  add("resumen",summaryGrid);
  add("resumen",summarySave);
  add("resumen",tasks);
  add("datos",select(".clinic-personal-admin-section"));
  add("datos",consents);
  add("datos",duplicates);
  add("datos",select(".clinic-portal-access"));
  add("historia",details[0]);
  add("historia",details[2]);
  add("historia",details[4]);
  add("evaluacion",details[1]);
  add("evaluacion",toolCards[2]); // instruments and longitudinal chart stay together
  add("tratamiento",details[3]);
  add("tratamiento",goals);
  add("tratamiento",reviews);
  add("tratamiento",exercise);
  add("sesiones",toolCards[0]);
  add("sesiones",history.previousElementSibling?.matches("h3") ? history.previousElementSibling : null);
  add("sesiones",history);
  add("documentos",toolCards[1]);
  add("documentos",audit);
  add("documentos",savedReports.previousElementSibling?.matches("h3") ? savedReports.previousElementSibling : null);
  add("documentos",savedReports);

  // Reubicar los botones originales, sin recrearlos ni perder sus listeners.
  const reportActions = document.createElement("div");
  reportActions.className = "clinic-workspace-panel-actions";
  for (const selector of ["#clinic-new-report", "#clinic-print-history"]) {
    const button = select(selector);
    if (button) reportActions.append(button);
  }
  panels.get("documentos").querySelector(".clinic-workspace-panel-heading").append(reportActions);

  const adminTools = document.createElement("details");
  adminTools.className = "clinic-patient-admin-tools";
  const adminTitle = document.createElement("summary");
  adminTitle.textContent = "Gestión administrativa de la ficha";
  adminTools.append(adminTitle);
  const recordActions = select(".clinic-record-actions");
  if (recordActions) adminTools.append(recordActions);

  note.after(navigation,workspace);
  adminTools.append(note);
  add("datos",adminTools);
  if (record && !record.children.length) record.remove();
  if (tools && !tools.children.length) tools.remove();
  // The save button must be available on every tab, not only in the final section.
  form.append(bottomSave);

  let active = "resumen";
  function activate(id,{scroll = true} = {}) {
    if (!panels.has(id)) return;
    active = id;
    for (const [key,panel] of panels) panel.hidden = key !== id;
    for (const [key,button] of buttons) {
      const selected = key === id;
      button.classList.toggle("active",selected);
      button.setAttribute("aria-selected",String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    if (scroll) navigation.scrollIntoView({behavior:"smooth",block:"start"});
  }
  const shortcuts = document.createElement("div");
  shortcuts.className = "clinic-workspace-shortcuts";
  for (const [label, target] of [
    ["Consultar sesiones", "sesiones"],
    ["Plan y evolución", "tratamiento"],
    ["Informes", "documentos"]
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "clinic-secondary";
    button.textContent = label;
    button.addEventListener("click", () => activate(target));
    shortcuts.append(button);
  }
  panels.get("resumen").querySelector(".clinic-workspace-panel-heading").append(shortcuts);

  buttons.forEach((button,id) => button.addEventListener("click",() => activate(id)));
  const tabOrder = layout.map(([id]) => id);
  navigation.addEventListener("keydown", event => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    const current = event.target.closest(".clinic-workspace-tab");
    if (!current || !navigation.contains(current)) return;
    const index = tabOrder.indexOf(current.dataset.workspaceTab);
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? tabOrder.length - 1
      : (index + (event.key === "ArrowRight" ? 1 : -1) + tabOrder.length) % tabOrder.length;
    activate(tabOrder[next], { scroll: false });
    buttons.get(tabOrder[next]).focus();
  });
  form.addEventListener("invalid", event => {
    const parent = event.target.closest("[data-workspace-panel]");
    if (parent && parent.hidden) activate(parent.dataset.workspacePanel,{scroll:false});
    const collapsed = event.target.closest("details.clinic-record-section");
    if (collapsed) collapsed.open = true;
  },true);
  window.addEventListener("clinical:patient-opened",() => activate("resumen",{scroll:false}));
  window.ClinicPatientWorkspace = Object.freeze({activate});

  // Presentación centralizada en patient-workspace.css.

  activate(active,{scroll:false});
})();