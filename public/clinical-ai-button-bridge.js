(() => {
  "use strict";
  // Compatibility layer for the patient editor's alternative AI toolbar.
  // It never writes to the clinical record; the assistants require review.
  const normalize = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");
  const messages = {
    diagnostic: "clinic-dx-ai-status",
    treatment: "clinic-treatment-ai-status"
  };
  function showMessage(kind, message, source) {
    let status = document.getElementById(messages[kind]);
    if (!status) {
      status = document.createElement("p");
      status.id = "clinic-ai-bridge-" + kind;
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.style.cssText = "margin:10px 0;color:#173A5E;font-size:14px;white-space:pre-wrap";
      source.insertAdjacentElement("afterend", status);
    }
    status.textContent = message;
  }
  document.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button") : null;
    if (!button || button.disabled) return;
    const label = normalize(button.textContent);
    const kind = label === "sugerir diagnostico" ? "diagnostic"
      : label === "sugerir objetivos y tratamiento" ? "treatment" : null;
    if (!kind) return;
    const targetId = kind === "diagnostic" ? "clinic-dx-ai-run" : "clinic-treatment-ai-run";
    const target = document.getElementById(targetId);
    if (!target || target === button) return;
    event.preventDefault();
    event.stopPropagation();
    if (target.disabled) return;
    showMessage(kind, "Iniciando análisis clínico…", button);
    target.click();
    const panel = document.getElementById(kind === "diagnostic" ? "clinic-dx-ai" : "clinic-treatment-ai");
    const status = document.getElementById(messages[kind]);
    if (panel) {
      let parent = panel.closest("details");
      while (parent) { parent.open = true; parent = parent.parentElement?.closest("details"); }
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (status) {
      status.setAttribute("aria-live", "polite");
      status.style.cssText += ";display:block;min-height:18px";
    }
  }, true);
})();