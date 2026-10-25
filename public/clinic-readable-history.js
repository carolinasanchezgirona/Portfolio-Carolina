/* Vista clínica de lectura: mejora progresiva sin modificar persistencia ni datos. */
(() => {
  const root = document.querySelector(".clinic-record-sections");
  if (!root || root.dataset.readableHistory === "1") return;
  root.dataset.readableHistory = "1";
  const style = document.createElement("style");
  style.textContent = `
    .clinic-record-sections.readable-history .clinic-record-section-body{display:block}
    .clinic-record-sections.readable-history .clinic-record-section:not(.history-editing) .clinic-record-section-body{display:none!important}
    .clinic-record-sections.readable-history .clinic-record-section:not(.history-editing) .history-preview{display:grid}
    .clinic-record-sections.readable-history .history-preview{gap:12px;padding:16px 18px}
    .clinic-record-sections.readable-history .history-entry{min-width:0;border-bottom:1px solid rgba(23,58,94,.11);padding:0 0 10px}
    .clinic-record-sections.readable-history .history-entry:last-child{border-bottom:0}
    .clinic-record-sections.readable-history .history-entry-title{display:block;font-size:.82rem;font-weight:600;color:#173a5e;margin-bottom:4px}
    .clinic-record-sections.readable-history .history-entry-text{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font-size:.94rem;font-weight:400!important;line-height:1.55;color:#354b60}
    .clinic-record-sections.readable-history .history-empty{font-weight:400;color:#748397;font-size:.9rem;margin:0}
    .clinic-record-sections.readable-history .history-top-actions{display:flex;justify-content:flex-end;gap:8px;padding:6px 12px}
    .clinic-record-sections.readable-history .history-toggle{border:1px solid #c7dbe6;background:white;border-radius:10px;color:#173a5e;padding:7px 13px;cursor:pointer;font:inherit;font-size:.85rem}
    .clinic-record-sections.readable-history .history-editing .clinic-record-section-body{display:grid!important}
    .clinic-record-sections.readable-history .history-editing .history-preview{display:none}
    .clinic-record-sections.readable-history .history-editing textarea{font-weight:400!important;min-height:110px}
    .clinic-record-sections.readable-history .clinic-record-section summary small{font-weight:400}
    .clinic-record-sections.readable-history .history-entry[data-category="factor"]{border:1px solid #e4edf3;border-radius:10px;padding:10px}
    @media(min-width:780px){.clinic-record-sections.readable-history .history-preview:has(.history-entry[data-category="factor"]){grid-template-columns:repeat(2,minmax(0,1fr))}.clinic-record-sections.readable-history .history-entry[data-wide="true"]{grid-column:1/-1}}
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
    edit.textContent = "Editar apartados";
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
        empty.textContent = "Sin información registrada. Pulsa «Editar apartados» para completarla.";
        preview.appendChild(empty);
      }
    }
    edit.addEventListener("click", () => {
      const editing = section.classList.toggle("history-editing");
      edit.textContent = editing ? "Terminar edición" : "Editar apartados";
      edit.setAttribute("aria-expanded", String(editing));
      section.open = true;
      if (!editing) render();
      else body.querySelector("textarea")?.focus({preventScroll:true});
    });
    body.addEventListener("input", () => { if (!section.classList.contains("history-editing")) render(); });
    section.open = sectionIndex === 0 || sectionIndex === 2 || sectionIndex === 4;
    render();
    section._renderHistoryPreview = render;
  });
  const refresh = () => sections.forEach(section => section._renderHistoryPreview?.());
  // La aplicación rellena los campos de forma programática al cambiar de paciente.
  document.addEventListener("click", () => { setTimeout(refresh, 120); setTimeout(refresh, 600); }, true);
  document.addEventListener("change", () => setTimeout(refresh, 100), true);
  document.addEventListener("clinic:patient-loaded", refresh);
  window.setInterval(() => { if (root.getClientRects().length) refresh(); }, 2500);
})();
