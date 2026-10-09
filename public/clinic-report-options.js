// Clinical report options v2
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
    if (typeof window.ClinicReportPreparePrint === "function") window.ClinicReportPreparePrint();
    const hasContent = ["#clinic-report-context","#clinic-report-evolution","#clinic-report-interventions","#clinic-report-current","#clinic-health-conclusions"].some(q => document.querySelector(q)?.value?.trim());
    if (!hasContent) { const msg = document.querySelector("#clinic-report-message"); if (msg) msg.textContent = "No hay contenido clínico que imprimir. Genera el borrador o completa los apartados primero."; return; }
    const popup = window.open("", "_blank");
    if (!popup) return;

    const approved = Boolean(reportContext?.disabled);
    const title = document.querySelector("#clinic-report-title-preview")?.textContent || "Informe clínico";
    const meta = document.querySelector("#clinic-report-meta")?.textContent || "";
    const recipient = document.querySelector("#clinic-report-recipient")?.value || "No especificado";
    const purpose = document.querySelector("#clinic-report-purpose")?.value || "Asistencial";
    const health = document.querySelector("#clinic-report-type")?.value === "evolution_health";
    const healthFields = [
      ["sources","Fuentes y procedimiento"],["background","Antecedentes relevantes"],
      ["observation","Estado clínico y observación"],["results","Resultados y cambios documentados"],
      ["integration","Integración e impresión clínica"],["conclusions","Conclusiones"],
      ["plan","Plan de seguimiento"],["limitations","Limitaciones y alcance"]
    ];
    const sectionText = (label, selector) => {
      const value = document.querySelector(selector)?.value?.trim() || "";
      return value ? '<section><h2>'+escapeHtml(label)+'</h2><div class="text">'+escapeHtml(value)+'</div></section>' : "";
    };
    const sectionItems = health ? [
      ["Motivo del informe y pregunta clínica", "#clinic-report-context"],
      ...healthFields.slice(0,5).map(([key,label]) => [label, "#clinic-health-" + key]),
      ["Intervención y evolución","#clinic-report-interventions"],
      ["Evolución cronológica","#clinic-report-evolution"],
      ...healthFields.slice(5).map(([key,label]) => [label, "#clinic-health-" + key]),
      ["Situación actual y objetivos pendientes","#clinic-report-current"]
    ] : [
      ["Motivo del informe","#clinic-report-context"],["Evolución documentada","#clinic-report-evolution"],
      ["Intervenciones realizadas","#clinic-report-interventions"],["Situación actual y plan","#clinic-report-current"]
    ];
    const sectionsHtml = sectionItems.map(([label, selector]) => sectionText(label, selector)).join("");
    const legal = window.ClinicWordExport?.legalTexts;
    const scopeNote = legal?.scope || "Este informe tiene finalidad clínico-asistencial y corresponde al periodo y las fuentes indicadas. No constituye un informe pericial.";
    const privacyNote = legal?.confidentiality || "Documento clínico con datos de salud sujeto a confidencialidad y secreto profesional.";
    const legalHtml = '<section><h2>Alcance clínico del informe</h2><div class="text">'+escapeHtml(scopeNote)+'</div></section>'+'<section><h2>Confidencialidad y protección de datos</h2><div class="text legal">'+escapeHtml(privacyNote)+'</div></section>';
    const watermark = approved ? "" : '<p class="watermark">BORRADOR · NO APROBADO</p>';
    const metaParts = meta.split(" · ");
    const patientCode = metaParts.length > 1 ? metaParts.shift() : "";
    const patientName = metaParts.join(" · ") || meta;
    const date = new Date().toLocaleDateString("es-ES");
    const start = document.querySelector("#clinic-report-start")?.value || "";
    const end = document.querySelector("#clinic-report-end")?.value || "";
    const cells = [
      ["Paciente",patientName],["Código de historia",patientCode],["Periodo de seguimiento",[start,end].filter(Boolean).join(" a ")],
      ["Destinatario",recipient],["Finalidad",purpose],["Fecha",date]
    ].filter(([,v])=>Boolean(v));
    const identity = '<table class="identity">'+cells.map(([label,value])=>'<tr><th>'+escapeHtml(label)+'</th><td>'+escapeHtml(value)+'</td></tr>').join("")+'</table>';
    const head = '<header><div class="kicker">CAROLINA SÁNCHEZ GIRONA · DOCUMENTACIÓN CLÍNICA</div><h1>'+escapeHtml(title)+'</h1>'+watermark+'<p class="professional">Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga</p></header>';
    const css = '@page{size:A4;margin:18mm}body{font-family:Arial,sans-serif;color:#222C35;font-size:10.5pt;line-height:1.52}header{border-top:2px solid #6A7680;padding:18px 0 10px;margin-bottom:14px;border-bottom:1px solid #D5DCE1}.kicker{color:#5B6772;font-size:9pt;font-weight:700;letter-spacing:.11em}h1{font-size:18pt;line-height:1.22;margin:12px 0;color:#202B35}h2{font-size:11pt;margin:22px 0 8px;color:#303B45;break-after:avoid}section{break-inside:auto}.professional{color:#526B7A;font-size:9pt}.watermark{display:inline-block;border:1px solid #BBC4CB;color:#5B6875;font-size:8pt;padding:4px 8px;font-weight:normal}.identity{width:100%;border-collapse:collapse;margin:18px 0 22px}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid #D5DCE1}th{width:34%;background:#F4F6F7;color:#303B45}tr:nth-child(even) td{background:#FAFCFC}.text{white-space:pre-wrap;overflow-wrap:anywhere}.signature{margin-top:35px}.privacy{font-size:8.5pt;color:#526B7A;margin-top:20px}';
    const html = '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>'+escapeHtml(title)+'</title><style>'+css+'</style></head><body>'+head+'<h2>Datos de identificación</h2>'+identity+sectionsHtml+legalHtml+'<section class="signature"><h2>Cierre y firma</h2><p>Carolina Sánchez Girona</p></section><p class="privacy">Documento clínico confidencial destinado a la finalidad asistencial indicada.</p><script>window.onload=function(){window.print()};<\/script></body></html>';
    popup.opener = null;
    popup.document.write(html);
    popup.document.close();
  }, true);
})();