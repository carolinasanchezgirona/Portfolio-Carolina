(() => {
  "use strict";
  const root = document.getElementById("clinic-patient-dialog");
  const form = document.getElementById("clinic-patient-form");
  if (!root || !form || document.getElementById("clinic-workspace-tabs")) return;

  const nav = root.querySelector(".clinic-record-quicknav");
  if (!nav) return;
  const panes = [
    { id:"resumen", label:"Resumen", targets:["clinic-section-preparation"] },
    { id:"historia", label:"Historia y evaluación", targets:["clinic-section-history"] },
    { id:"sesiones", label:"Sesiones", targets:["clinic-section-sessions","clinic-patient-history"] },
    { id:"documentos", label:"Documentos y materiales", targets:["clinic-section-materials","clinic-section-documents"] },
    { id:"informes", label:"Informes", targets:["clinic-section-reports","clinic-patient-reports"] },
    { id:"datos", label:"Datos personales", targets:["clinic-section-personal"] }
  ];
  const groups = new Map();
  const tabbar = document.createElement("nav");
  tabbar.id = "clinic-workspace-tabs";
  tabbar.className = "clinic-workspace-tabs";
  tabbar.setAttribute("aria-label","Áreas de la ficha clínica");

  const dashboard = document.createElement("section");
  dashboard.id = "clinic-patient-dashboard";
  dashboard.className = "clinic-patient-dashboard";
  dashboard.setAttribute("aria-label","Resumen del caso");
  dashboard.innerHTML = '<div class="clinic-dashboard-heading"><div><span class="clinic-eyebrow">Vista de trabajo</span><h3>Resumen clínico</h3></div><span class="clinic-dashboard-helper">Información registrada en la ficha</span></div><div class="clinic-dashboard-grid"><article><span>Síntesis clínica</span><p data-summary="clinic-summary-note">Sin síntesis registrada</p></article><article><span>Próxima sesión</span><p data-summary="clinic-next-focus">Sin planificación registrada</p></article><article><span>Objetivos terapéuticos</span><p data-summary="clinic-therapeutic-goals">Sin objetivos registrados</p></article><article><span>Última evolución</span><p data-summary="clinic-evolution-summary">Sin evolución registrada</p></article></div>';
  // These cards are read-only mirrors of the real form fields: no clinical values
  // are generated or persisted by this navigation component.
  const summaryFields = Array.from(dashboard.querySelectorAll("[data-summary]"));
  function refreshSummary() {
    summaryFields.forEach(node => {
      const field = document.getElementById(node.dataset.summary);
      const value = field && typeof field.value === "string" ? field.value.trim() : "";
      node.textContent = value || ({
        "clinic-summary-note":"Sin síntesis registrada",
        "clinic-next-focus":"Sin planificación registrada",
        "clinic-therapeutic-goals":"Sin objetivos registrados",
        "clinic-evolution-summary":"Sin evolución registrada"
      }[node.dataset.summary] || "Sin información registrada");
      node.title = value.length > 180 ? "Abre el apartado correspondiente para consultar el texto íntegro" : "";
    });
  }

  const prep = document.getElementById("clinic-section-preparation");
  if (prep) {
    const fields = prep.nextElementSibling;
    const save = fields && fields.nextElementSibling;
    if (fields && fields.classList.contains("clinic-form-grid")) panes[0].targets.push(fields);
    if (save && save.classList.contains("clinic-form-actions")) panes[0].targets.push(save);
  }
  const history = document.getElementById("clinic-section-history");
  if (history && history.nextElementSibling && history.nextElementSibling.classList.contains("clinic-form-actions-bottom")) {
    panes[1].targets.push(history.nextElementSibling);
  }
  const personal = document.getElementById("clinic-section-personal");
  if (personal) {
    const portal = root.querySelector(".clinic-portal-access");
    const deleteNote = document.getElementById("clinic-delete-patient-note");
    if (portal) panes[5].targets.push(portal);
    if (deleteNote) panes[5].targets.push(deleteNote);
  }

  panes.forEach((pane) => {
    const els = pane.targets.map(target => typeof target === "string" ? document.getElementById(target) : target).filter(Boolean);
    groups.set(pane.id, els);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = pane.label;
    btn.dataset.pane = pane.id;
    btn.setAttribute("aria-controls","clinic-patient-dashboard");
    btn.addEventListener("click", () => show(pane.id, true));
    tabbar.appendChild(btn);
  });
  nav.replaceWith(tabbar);
  tabbar.insertAdjacentElement("afterend",dashboard);

  const actionbar = root.querySelector(".clinic-record-actions");
  // Provide the save action in every workspace while preserving the existing
  // form submit handler and its validation.
  const save = document.createElement("button");
  save.type = "submit";
  save.className = "clinic-primary clinic-workspace-save";
  save.textContent = "Guardar ficha";
  if (actionbar) actionbar.prepend(save);

  let active = "";
  function show(id, scroll) {
    if (!groups.has(id)) id = "resumen";
    active = id;
    for (const pane of panes) {
      const selected = pane.id === id;
      groups.get(pane.id).forEach(el => {
        el.classList.toggle("clinic-workspace-hidden",!selected);
        if ("inert" in el) el.inert = !selected;
      });
      const btn = tabbar.querySelector('[data-pane="'+pane.id+'"]');
      btn.classList.toggle("active",selected);
      btn.setAttribute("aria-pressed",String(selected));
      if (selected) btn.setAttribute("aria-current","page");
      else btn.removeAttribute("aria-current");
    }
    dashboard.hidden = id !== "resumen";
    refreshSummary();
    if (id === "datos" && personal) personal.open = true;
    if (id === "historia" && history) {
      const first = history.querySelector("details");
      if (first) first.open = true;
    }
    if (scroll) {
      tabbar.scrollIntoView({behavior:"auto",block:"start"});
    }
  }

  form.addEventListener("input", (e) => {
    if (e.target && e.target.matches("textarea")) refreshSummary();
  });
  root.addEventListener("click", (e) => {
    const anchor = e.target.closest && e.target.closest('a[href^="#clinic-section-"]');
    if (!anchor) return;
    const targetId = anchor.getAttribute("href").slice(1);
    const found = panes.find(p => p.targets.some(t => (typeof t === "string" ? t : t.id) === targetId));
    if (found) show(found.id,false);
  });
  const name = document.getElementById("clinic-patient-name");
  if (name) new MutationObserver(() => {
    if (root.hidden || form.hidden) return;
    show("resumen",false);
    // Other code populates clinical fields after opening the record.
    window.requestAnimationFrame(refreshSummary);
  }).observe(name,{childList:true,characterData:true,subtree:true});
  const visibility = new MutationObserver(() => {
    if (!root.hidden && !form.hidden) {
      if (!active) show("resumen",false);
      window.requestAnimationFrame(refreshSummary);
    }
  });
  visibility.observe(root,{attributes:true,attributeFilter:["hidden"]});
  visibility.observe(form,{attributes:true,attributeFilter:["hidden"]});
  show("resumen",false);
})();
