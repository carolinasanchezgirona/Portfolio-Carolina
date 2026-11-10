/* Vista clínica de lectura: mejora progresiva sin modificar persistencia ni datos. */
(() => {
  const root = document.querySelector(".clinic-record-sections");
  if (!root || root.dataset.readableHistory === "1") return;
  root.dataset.readableHistory = "1";
  const style = document.createElement("style");
  style.textContent = `
    #clinic-patient-dialog .clinic-record-sections.readable-history .clinic-record-section{overflow:hidden;border:1px solid var(--admin-line,#dce1e3);border-radius:14px;background:#fff;margin-bottom:14px}
    #clinic-patient-dialog .clinic-record-sections.readable-history .clinic-record-section>summary{padding:16px 19px;gap:12px;align-items:center}
    #clinic-patient-dialog .clinic-record-sections.readable-history .clinic-record-section>summary span{font-weight:650}
    #clinic-patient-dialog .clinic-record-sections.readable-history .clinic-record-section>summary small{font-weight:400;font-size:.78rem;color:var(--admin-muted,#63737c)}
    #clinic-patient-dialog .clinic-record-sections.readable-history .clinic-record-section-body{display:block}
    #clinic-patient-dialog .clinic-record-sections.readable-history .clinic-record-section:not(.history-editing) .clinic-record-section-body{display:none!important}
    #clinic-patient-dialog .clinic-record-sections.readable-history .clinic-record-section:not(.history-editing) .history-preview{display:grid}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-preview{gap:0;padding:0 19px 12px}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-entry{min-width:0;border-bottom:1px solid var(--admin-line,#e5e9eb);padding:13px 0 15px}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-entry:last-child{border-bottom:0}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-entry-title{display:block;font-size:.76rem;font-weight:700;color:var(--admin-action,#506570);margin-bottom:5px;letter-spacing:.01em}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-entry-text{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font-size:.9rem;font-weight:400!important;line-height:1.62;color:var(--admin-ink,#293a42)}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-empty{font-weight:400;color:var(--admin-muted,#748397);font-size:.85rem;margin:0;padding:10px 0 17px}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-top-actions{display:flex;justify-content:flex-end;gap:8px;padding:7px 19px 4px}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-toggle{border:1px solid var(--admin-line,#c7dbe6);background:#fff;border-radius:9px;color:var(--admin-action,#506570);padding:8px 13px;cursor:pointer;font:600 .8rem var(--font-inter),system-ui,sans-serif}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-toggle:hover{background:var(--admin-soft,#f2f5f6)}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-toggle:focus-visible{outline:3px solid var(--admin-accent,#809da8);outline-offset:2px}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-editing .clinic-record-section-body{display:grid!important;padding:15px 19px 20px}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-editing .history-preview{display:none}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-editing textarea{font-weight:400!important;min-height:100px}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-entry[data-category="factor"]{border:0;border-bottom:1px solid var(--admin-line,#e5e9eb);border-radius:0;padding:13px 0 15px}
    #clinic-patient-dialog .clinic-record-sections.readable-history .history-entry[data-wide="true"]{grid-column:1/-1}
    @media(max-width:640px){#clinic-patient-dialog .clinic-record-sections.readable-history .clinic-record-section>summary{padding:13px}#clinic-patient-dialog .clinic-record-sections.readable-history .history-preview{padding:0 13px 9px}#clinic-patient-dialog .clinic-record-sections.readable-history .history-top-actions{padding:7px 13px 4px}}
  `;
  document.head.appendChild(style);
  root.classList.add("readable-history");
  const sections = [...root.querySelectorAll(".clinic-record-section")];
  sections.forEach((section, sectionIndex) => {
    const body = section.querySelector(".clinic-record-section-body");
    if (!body) return;
    const actions = document.createElement("div");
    actions.className = "history-top-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "history-toggle";
    edit.textContent = "Editar información";
    edit.setAttribute("aria-expanded", "false");
    actions.appendChild(edit);
    const preview = document.createElement("div");
    preview.className = "history-preview";
    preview.setAttribute("aria-label", "Resumen de la información registrada");
    body.before(actions, preview);
    function render() {
      if (section.classList.contains("history-editing")) return;
      preview.replaceChildren();
      const fields = [...body.querySelectorAll("textarea")];
      let filled = 0;
      fields.forEach(field => {
        const value = field.value.trim();
        if (!value) return;
        filled++;
        const label = field.closest("label");
        const heading = label?.childNodes[0]?.textContent?.trim() || field.id;
        const entry = document.createElement("div");
        entry.className = "history-entry";
        if (/factor(es)?/i.test(heading)) entry.dataset.category = "factor";
        if (label?.classList.contains("clinic-full")) entry.dataset.wide = "true";
        const title = document.createElement("span");
        title.className = "history-entry-title";
        title.textContent = heading;
        const content = document.createElement("p");
        content.className = "history-entry-text";
        content.textContent = value;
        entry.append(title, content);
        preview.appendChild(entry);
      });
      if (!filled) {
        const empty = document.createElement("p");
        empty.className = "history-empty";
        empty.textContent = "Sin información registrada. Pulsa «Editar información» para completarla.";
        preview.appendChild(empty);
      }
    }
    edit.addEventListener("click", () => {
      const editing = section.classList.toggle("history-editing");
      edit.textContent = editing ? "Terminar edición" : "Editar información";
      edit.setAttribute("aria-expanded", String(editing));
      section.open = true;
      if (!editing) render();
      else body.querySelector("textarea")?.focus({preventScroll:true});
    });
    body.addEventListener("input", () => { if (!section.classList.contains("history-editing")) render(); });
    section.open = sectionIndex === 0;
    render();
    section._renderHistoryPreview = render;
  });
  // Acceso a los asistentes existentes, manteniendo sus controles de revisión.
  const aiPanel = document.createElement("section");
  aiPanel.className = "clinic-record-section";
  aiPanel.style.padding = "16px";
  aiPanel.innerHTML = '<h3 style="margin:0 0 6px;color:#173a5e">Sugerencias clínicas con IA</h3><p style="font-weight:400;margin:0 0 12px;color:#52677b">Hipótesis y propuestas para revisión profesional. No se incorporan automáticamente a la historia validada.</p>';
  const aiActions = document.createElement("div");
  aiActions.style.cssText = "display:flex;flex-wrap:wrap;gap:10px";
  [["Sugerir diagnóstico",1,"clinic-dx-ai-run"],["Sugerir objetivos y tratamiento",3,"clinic-treatment-ai-run"]].forEach(([caption,index,id]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "history-toggle";
    button.textContent = caption;
    button.addEventListener("click", () => {
      const section = sections[index];
      section.open = true;
      const edit = section.querySelector(".history-toggle");
      if (!section.classList.contains("history-editing")) edit?.click();
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({block:"center",behavior:"smooth"});
        target.click();
      }
    });
    aiActions.appendChild(button);
  });
  aiPanel.appendChild(aiActions);
  root.appendChild(aiPanel);
  const refresh = () => sections.forEach(section => section._renderHistoryPreview?.());
  // La aplicación rellena los campos de forma programática al cambiar de paciente.
  document.addEventListener("click", () => { setTimeout(refresh, 120); setTimeout(refresh, 600); }, true);
  document.addEventListener("change", () => setTimeout(refresh, 100), true);
  document.addEventListener("clinic:patient-loaded", refresh);
  window.setInterval(() => { if (root.getClientRects().length) refresh(); }, 2500);
})();
