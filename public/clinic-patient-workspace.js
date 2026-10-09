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
  const tasks = select(".clinic-task-box");
  const savedReports = select("#clinic-patient-reports");
  const history = select("#clinic-patient-history");
  if (details.length !== 5 || toolCards.length !== 3 || !summaryGrid || !preparation || !bottomSave || !exercise || !savedReports || !history) return;

  const layout = [
    ["resumen","Resumen","Preparación de la sesión y estado actual"],
    ["datos","Datos","Identificación y datos administrativos"],
    ["historia","Historia","Antecedentes, formulación y coordinación"],
    ["evaluacion","Evaluación","Evaluación clínica y medidas"],
    ["tratamiento","Tratamiento","Objetivos, técnicas y material"],
    ["sesiones","Sesiones","Cronología, citas y sesiones"],
    ["documentos","Documentos","Documentos e informes"]
  ];

  const navigation = document.createElement("nav");
  navigation.id = "clinic-patient-workspace-nav";
  navigation.className = "clinic-patient-workspace-nav";
  navigation.setAttribute("aria-label", "Apartados de la ficha clínica");

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
    navigation.append(button);
    buttons.set(id,button);

    const panel = document.createElement("section");
    panel.id = "clinic-panel-" + id;
    panel.dataset.workspacePanel = id;
    panel.className = "clinic-workspace-panel";
    panel.setAttribute("role","region");
    panel.setAttribute("aria-labelledby",button.id);
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
  add("historia",details[0]);
  add("historia",details[2]);
  add("historia",details[4]);
  add("evaluacion",details[1]);
  add("evaluacion",toolCards[2]); // instruments and longitudinal chart stay together
  add("tratamiento",details[3]);
  add("tratamiento",goals);
  add("tratamiento",exercise);
  add("sesiones",toolCards[0]);
  add("sesiones",history.previousElementSibling?.matches("h3") ? history.previousElementSibling : null);
  add("sesiones",history);
  add("documentos",toolCards[1]);
  add("documentos",savedReports.previousElementSibling?.matches("h3") ? savedReports.previousElementSibling : null);
  add("documentos",savedReports);

  note.after(navigation,workspace);
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
      button.setAttribute("aria-current",selected ? "page" : "false");
      button.setAttribute("aria-expanded",String(selected));
    }
    if (scroll) navigation.scrollIntoView({behavior:"smooth",block:"start"});
  }
  buttons.forEach((button,id) => button.addEventListener("click",() => activate(id)));
  form.addEventListener("invalid", event => {
    const parent = event.target.closest("[data-workspace-panel]");
    if (parent && parent.hidden) activate(parent.dataset.workspacePanel,{scroll:false});
  },true);
  window.addEventListener("clinical:patient-opened",() => activate("resumen",{scroll:false}));
  window.ClinicPatientWorkspace = Object.freeze({activate});

  const css = document.createElement("style");
  css.id = "clinic-patient-workspace-styles";
  css.textContent = `
    .clinic-patient-workspace-nav{display:flex;gap:7px;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:thin;padding:12px 0 9px;margin:16px 0 8px;position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid #d8e1e7}
    .clinic-workspace-tab{flex:0 0 auto;appearance:none;background:#f4f7f8;border:1px solid #d8e1e7;border-radius:7px;padding:11px 15px;color:#344a59;font:600 .85rem Arial,sans-serif;cursor:pointer}
    .clinic-workspace-tab.active,.clinic-workspace-tab:focus-visible{background:#173A5E;border-color:#173A5E;color:#fff;outline-offset:2px}
    .clinic-workspace-panel[hidden]{display:none!important}
    .clinic-workspace-panel{padding:10px 0 20px;min-height:200px}
    .clinic-workspace-panel-heading{margin:5px 0 20px}
    .clinic-workspace-panel-heading h3{font-family:Arial,sans-serif;font-size:1.2rem;color:#173A5E;margin:0 0 5px}
    .clinic-workspace-panel-heading p{font-size:.82rem;color:#5e6f7c;margin:0}
    .clinic-workspace-panel>.clinic-record-section{margin-bottom:16px}
    .clinic-workspace-panel>.clinic-form-grid{margin:12px 0}
    .clinic-patient-page-content>.clinic-form-actions-bottom{position:sticky;bottom:0;z-index:4;padding:12px 16px;border-top:1px solid #d8e1e7;background:rgba(255,255,255,.97)}
    .clinic-workspace-panel>.clinic-patient-tools-grid{display:block}
    @media(max-width:640px){.clinic-workspace-tab{padding:10px 13px}.clinic-patient-page-content>.clinic-form-actions-bottom{flex-wrap:wrap}.clinic-workspace-panel{min-height:100px}}
  `;
  document.head.append(css);
  activate(active,{scroll:false});
})();