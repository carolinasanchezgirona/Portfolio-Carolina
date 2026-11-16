/* Historial clínico: edición directa y persistencia a través del formulario original. */
(() => {
  "use strict";

  const form = document.querySelector("#clinic-patient-form");
  if (!form || form.dataset.readableHistory === "direct-edit") return;

  const profileFieldIds = [
    "clinic-reason-consultation",
    "clinic-clinical-examination",
    "clinic-current-problems",
    "clinic-therapeutic-goals",
    "clinic-risk-safety"
  ];

  const sections = profileFieldIds
    .map((id) => form.querySelector("#" + id)?.closest("details.clinic-record-section"))
    .filter(Boolean);

  if (sections.length !== profileFieldIds.length || new Set(sections).size !== sections.length) return;

  form.dataset.readableHistory = "direct-edit";

  const style = document.createElement("style");
  style.textContent = `
    #clinic-patient-dialog details.clinic-record-section.readable-history{
      overflow:hidden;
      border:1px solid var(--admin-line,#dce1e3);
      border-radius:14px;
      background:#fff;
      margin-bottom:14px
    }
    #clinic-patient-dialog details.clinic-record-section.readable-history>summary{
      padding:16px 19px;
      gap:12px;
      align-items:center
    }
    #clinic-patient-dialog details.clinic-record-section.readable-history>summary span{font-weight:650}
    #clinic-patient-dialog details.clinic-record-section.readable-history>summary small{
      font-weight:400;
      font-size:.78rem;
      color:var(--admin-muted,#63737c)
    }
    #clinic-patient-dialog details.clinic-record-section.readable-history .clinic-record-section-body{
      display:grid!important;
      padding:15px 19px 20px
    }
    #clinic-patient-dialog details.clinic-record-section.readable-history textarea{
      font-weight:400!important;
      min-height:100px
    }
    #clinic-patient-dialog details.clinic-record-section.readable-history textarea:focus{
      border-color:var(--admin-action,#506570);
      box-shadow:0 0 0 3px color-mix(in srgb,var(--admin-accent,#809da8) 18%,transparent);
      outline:none
    }
    @media(max-width:640px){
      #clinic-patient-dialog details.clinic-record-section.readable-history>summary{padding:13px}
      #clinic-patient-dialog details.clinic-record-section.readable-history .clinic-record-section-body{
        padding:13px
      }
    }
  `;
  document.head.appendChild(style);

  sections.forEach((section, index) => {
    section.classList.add("readable-history");
    section.classList.remove("history-editing");
    // Mantener la primera sección abierta al entrar en la ficha; el resto conserva
    // el comportamiento nativo de <details> y se puede editar en cuanto se abre.
    if (index === 0) section.open = true;
  });

  // Si un campo recibe foco por validación, búsqueda o accesibilidad, abrir su bloque.
  form.addEventListener("focusin", (event) => {
    const section = event.target?.closest?.("details.clinic-record-section");
    if (section && sections.includes(section)) section.open = true;
  });

  window.addEventListener("clinical:patient-opened", () => {
    sections[0].open = true;
  });
})();
