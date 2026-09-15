(() => {
  "use strict";
  const dialog = document.querySelector("#clinic-report-dialog");
  const toolbar = dialog?.querySelector(".clinic-report-toolbar");
  const sheet = document.querySelector("#clinic-report-sheet");
  const printButton = document.querySelector("#clinic-print-report");
  if (!dialog || !toolbar || !sheet || !printButton) return;

  const fields = [
    ["context", "Motivo y contexto", "#clinic-report-context"],
    ["evolution", "Evolución clínica", "#clinic-report-evolution"],
    ["interventions", "Intervenciones realizadas", "#clinic-report-interventions"],
    ["current", "Situación actual y recomendaciones", "#clinic-report-current"],
  ];

  const box = document.createElement("section");
  box.className = "clinic-note";
  box.id = "clinic-report-section-options";
  box.innerHTML = `<strong>Contenido del informe</strong><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:9px">${fields.map(([key,label]) => `<label style="display:flex;align-items:center;gap:6px"><input type="checkbox" data-report-section="${key}" checked>${label}</label>`).join("")}</div>`;
  toolbar.after(box);

  const badge = document.createElement("div");
  badge.id = "clinic-report-draft-badge";
  badge.textContent = "BORRADOR · NO APROBADO";
  badge.style.cssText = "margin:0 0 18px;padding:10px 14px;border:2px solid #b64a2b;border-radius:10px;color:#9b3516;font-weight:800;text-align:center;letter-spacing:.04em";
  sheet.prepend(badge);

  const reportContext = document.querySelector("#clinic-report-context");
  const updateBadge = () => { badge.hidden = Boolean(reportContext?.disabled); };
  const observer = new MutationObserver(() => { if (dialog.open) setTimeout(updateBadge, 0); });
  observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });

  function escapeHtml(value) {
    return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
  function selected(key) {
    return Boolean(box.querySelector(`[data-report-section="${key}"]`)?.checked);
  }
  function section(title, selector, key) {
    if (!selected(key)) return "";
    const value = document.querySelector(selector)?.value?.trim() || "";
    return value ? `<h2>${escapeHtml(title)}</h2><div class="text">${escapeHtml(value)}</div>` : "";
  }

  printButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const popup = window.open("", "_blank");
    if (!popup) return;

    const approved = Boolean(reportContext?.disabled);
    const title = document.querySelector("#clinic-report-title-preview")?.textContent || "Informe clínico";
    const meta = document.querySelector("#clinic-report-meta")?.textContent || "";
    const recipient = document.querySelector("#clinic-report-recipient")?.value || "No especificado";
    const purpose = document.querySelector("#clinic-report-purpose")?.value || "Asistencial";
    const watermark = approved ? "" : `<div class="watermark">BORRADOR · NO APROBADO</div>`;

    popup.opener = null;
    popup.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>@page{size:A4;margin:18mm}body{font-family:Arial,sans-serif;color:#1f2933;font-size:11pt;line-height:1.5}.watermark{border:2px solid #b64a2b;color:#9b3516;font-weight:800;text-align:center;padding:10px;margin-bottom:18px;letter-spacing:.05em}header{border-bottom:2px solid #1f5f99;margin-bottom:24px;padding-bottom:14px}h1{font-size:20pt;color:#1f5f99;margin:4px 0}h2{font-size:13pt;margin:24px 0 8px}.meta{color:#526b7a;font-size:9.5pt}.text{white-space:pre-wrap}.signature{margin-top:48px}.privacy{margin-top:30px;color:#607786;font-size:8.5pt}@media print{button{display:none}}</style></head><body>${watermark}<header><p>Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga</p><h1>${escapeHtml(title)}</h1><p class="meta">${escapeHtml(meta)}<br>Destinatario: ${escapeHtml(recipient)} · Finalidad: ${escapeHtml(purpose)}</p></header>${section("Motivo y contexto", "#clinic-report-context", "context")}${section("Evolución clínica", "#clinic-report-evolution", "evolution")}${section("Intervenciones realizadas", "#clinic-report-interventions", "interventions")}${section("Situación actual y recomendaciones", "#clinic-report-current", "current")}<div class="signature"><p>Carolina Sánchez Girona</p></div><p class="privacy">Documento confidencial que contiene datos de salud.</p><script>window.onload=()=>window.print()<\/script></body></html>`);
    popup.document.close();
  }, true);
})();