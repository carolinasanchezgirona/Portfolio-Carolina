/* Clinical process reviews. Private clinician-only records.
   A consolidation report is created as an editable draft using the existing report editor.
   This module does not share records with Entre Sesiones or change patient discharge status. */
(() => {
  "use strict";
  const REST = "https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1/";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const patientDialog = document.getElementById("clinic-patient-dialog");
  const patientField = document.getElementById("clinic-patient-id");
  const goals = document.querySelector(".clinic-goals-manager");
  if (!patientDialog || !patientField || !goals) return;

  const section = document.createElement("section");
  section.className = "clinic-process-reviews";
  section.innerHTML = '<div class="clinic-process-reviews-head"><div><p class="clinic-eyebrow">Seguimiento clínico</p><h3>Revisiones del proceso</h3><p>Revisa el cambio clínico y funcional, las metas y la continuidad asistencial, sin puntuaciones arbitrarias.</p></div><button type="button" class="clinic-secondary" id="clinic-review-new">Nueva revisión</button></div><p id="clinic-review-status" class="clinic-message" role="status"></p><div id="clinic-review-list" class="clinic-review-list"></div>';
  const treatmentPanel = document.getElementById("clinic-panel-tratamiento");
  if (treatmentPanel) treatmentPanel.append(section);
  else goals.after(section);

  const dialog = document.createElement("dialog");
  dialog.id = "clinic-review-dialog";
  dialog.className = "clinic-dialog clinic-small-dialog clinic-review-dialog";
  dialog.innerHTML = '<form class="clinic-dialog-content" id="clinic-review-form">' +
    '<div class="clinic-dialog-heading"><div><p class="clinic-eyebrow">Registro profesional · privado</p><h2 id="clinic-review-heading">Revisión clínica</h2></div><button type="button" id="clinic-review-close" class="clinic-close" aria-label="Cerrar">×</button></div>' +
    '<p class="clinic-note">Documento clínico de trabajo. No modifica el diagnóstico, el alta, ni publica nada en Entre Sesiones.</p>' +
    '<div class="clinic-form-grid"><label>Tipo de revisión<select id="clinic-review-kind"><option value="periodic">Seguimiento periódico</option><option value="transition">Cambio de fase terapéutica</option><option value="closing">Preparación de consolidación o cierre</option></select></label>' +
    '<label>Fecha de revisión<input type="date" id="clinic-review-date" required></label></div>' +
    '<label>Objetivos revisados y cambios observados<textarea id="clinic-review-goals" rows="3" maxlength="4000" placeholder="Señala objetivos abordados, logros, dificultades y pendientes."></textarea></label>' +
    '<label>Cambio sintomático y evolución clínica<textarea id="clinic-review-symptoms" rows="3" maxlength="4000" placeholder="Datos clínicos observados o referidos. Evita inferir cambio fiable sin medida adecuada."></textarea></label>' +
    '<label>Funcionamiento cotidiano<textarea id="clinic-review-functioning" rows="3" maxlength="4000" placeholder="Autonomía, relaciones, actividad, desempeño u otras áreas pertinentes."></textarea></label>' +
    '<label>Perspectiva del paciente<textarea id="clinic-review-perspective" rows="3" maxlength="4000" placeholder="Valoración subjetiva, necesidades y prioridades expresadas."></textarea></label>' +
    '<label>Medidas de resultado e interpretación<textarea id="clinic-review-measures" rows="3" maxlength="4000" placeholder="Instrumento, fechas, puntuaciones ya verificadas y limitaciones, si procede."></textarea></label>' +
    '<label>Estrategias e intervenciones relevantes<textarea id="clinic-review-strategies" rows="3" maxlength="4000" placeholder="Qué se ha trabajado y respuesta clínica observada."></textarea></label>' +
    '<label>Valoración clínica integrada<textarea id="clinic-review-assessment" rows="3" maxlength="4000" placeholder="Interpretación contextualizada; hipótesis revisables."></textarea></label>' +
    '<label>Decisiones y siguientes pasos<textarea id="clinic-review-next" rows="3" maxlength="4000" placeholder="Continuar, ajustar, espaciar, derivar o valorar cierre, según criterio clínico."></textarea></label>' +
    '<label>Plan de mantenimiento y señales para retomar contacto<textarea id="clinic-review-maintenance" rows="3" maxlength="4000" placeholder="Recursos que han ayudado, señales de alerta, apoyos y seguimiento acordado."></textarea></label>' +
    '<p id="clinic-review-form-status" class="clinic-message" role="status"></p><div class="clinic-dialog-actions"><button type="button" class="clinic-secondary" id="clinic-review-cancel">Cancelar</button><button type="submit" class="clinic-primary">Guardar revisión</button></div>' +
    '</form>';
  document.body.append(dialog);

  const style = document.createElement("style");
  style.textContent =
    '.clinic-process-reviews{margin:18px 0;padding:18px;border:1px solid var(--admin-line);border-radius:15px;background:#fff}' +
    '.clinic-process-reviews-head{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:14px}' +
    '.clinic-process-reviews-head h3{font-family:Newsreader,Georgia,serif;font-size:1.35rem;font-weight:500;margin:0 0 5px}' +
    '.clinic-process-reviews-head p:last-child{font-size:.83rem;color:var(--admin-muted);margin:0}' +
    '.clinic-review-list{display:grid;gap:10px}.clinic-review-item{border:1px solid var(--admin-line);border-radius:12px;padding:13px;display:grid;gap:8px}' +
    '.clinic-review-item strong{font-size:.9rem;color:var(--admin-text)}.clinic-review-item p{font-size:.8rem;color:var(--admin-muted);margin:0;overflow-wrap:anywhere;white-space:pre-wrap}' +
    '.clinic-review-item-actions{display:flex;flex-wrap:wrap;gap:8px}.clinic-review-item-actions button{font-size:.8rem}' +
    '.clinic-review-empty{color:var(--admin-muted);font-size:.83rem;border:1px dashed var(--admin-line);padding:16px;border-radius:10px}' +
    '.clinic-review-dialog .clinic-dialog-content{max-height:min(90vh,900px);overflow-y:auto}.clinic-review-dialog textarea{width:100%}' +
    '@media(max-width:640px){.clinic-process-reviews-head{align-items:stretch;flex-direction:column}.clinic-process-reviews-head button{width:100%}}';
  document.head.append(style);

  const list = section.querySelector("#clinic-review-list");
  const status = section.querySelector("#clinic-review-status");
  const form = dialog.querySelector("#clinic-review-form");
  const formStatus = dialog.querySelector("#clinic-review-form-status");
  const heading = dialog.querySelector("#clinic-review-heading");
  const kindField = dialog.querySelector("#clinic-review-kind");
  const dateField = dialog.querySelector("#clinic-review-date");
  const fieldNames = ["goals", "symptoms", "functioning", "perspective", "measures", "strategies", "assessment", "next", "maintenance"];
  const inputs = Object.fromEntries(fieldNames.map(name => [name, dialog.querySelector("#clinic-review-" + name)]));
  const kindLabels = { periodic: "Revisión periódica", transition: "Cambio de fase", closing: "Preparación de cierre" };
  const columns = {
    goals: "goal_review", symptoms: "symptom_change", functioning: "functional_change",
    perspective: "patient_perspective", measures: "measurement_interpretation",
    strategies: "strategies_worked", assessment: "clinical_assessment",
    next: "next_steps", maintenance: "maintenance_plan"
  };
  let rows = [];
  let selectedReviewId = "";
  let loadedPatientId = "";
  let requestEpoch = 0;
  let loadingController = null;
  let saving = false;

  function jwt() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null")?.access_token || ""; }
    catch { return ""; }
  }
  function headers(extra = {}) {
    return { apikey: KEY, Authorization: "Bearer " + jwt(), "Content-Type": "application/json", ...extra };
  }
  function fmt(iso) {
    if (!iso) return "Sin fecha";
    const date = new Date(String(iso).slice(0, 10) + "T12:00:00");
    return isNaN(date.getTime()) ? "Sin fecha" : new Intl.DateTimeFormat("es-ES", { day:"2-digit", month:"short", year:"numeric" }).format(date);
  }
  function localDate() {
    return new Intl.DateTimeFormat("en-CA", { timeZone:"Europe/Madrid", year:"numeric",month:"2-digit",day:"2-digit" }).format(new Date());
  }
  function clear() {
    loadedPatientId = "";
    rows = [];
    selectedReviewId = "";
    list.replaceChildren();
    status.textContent = "";
    if (dialog.open && !saving) dialog.close();
  }
  function render() {
    list.replaceChildren();
    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "clinic-review-empty";
      empty.textContent = "No hay revisiones registradas. Puedes crear una cuando resulte clínicamente pertinente.";
      list.append(empty);
      return;
    }
    for (const review of rows) {
      const article = document.createElement("article");
      article.className = "clinic-review-item";
      const title = document.createElement("strong");
      title.textContent = (kindLabels[review.review_kind] || "Revisión clínica") + " · " + fmt(review.review_date);
      const excerpt = document.createElement("p");
      excerpt.textContent = String(review.clinical_assessment || review.next_steps || review.goal_review || "Revisión guardada sin síntesis textual.").slice(0, 280);
      const actions = document.createElement("div");
      actions.className = "clinic-review-item-actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "clinic-secondary";
      edit.textContent = "Consultar / editar";
      edit.addEventListener("click", () => openEditor(review));
      const report = document.createElement("button");
      report.type = "button";
      report.className = "clinic-secondary";
      report.textContent = "Preparar documento de consolidación";
      report.addEventListener("click", () => prepareReport(review));
      actions.append(edit, report);
      article.append(title, excerpt, actions);
      list.append(article);
    }
  }
  async function load() {
    const patientId = patientField.value;
    if (!patientId || patientDialog.hidden) { clear(); return; }
    const current = ++requestEpoch;
    if (loadingController) loadingController.abort();
    loadingController = new AbortController();
    loadedPatientId = "";
    rows = [];
    list.replaceChildren();
    status.textContent = "Consultando revisiones…";
    try {
      const response = await fetch(REST + "clinical_process_reviews?select=*&patient_id=eq." + encodeURIComponent(patientId) + "&order=review_date.desc,created_at.desc&limit=100", {
        headers: headers(), cache:"no-store", signal:loadingController.signal
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(typeof data?.message === "string" ? data.message : "No se han podido consultar las revisiones.");
      if (!Array.isArray(data)) throw new Error("La respuesta de revisiones no es válida.");
      if (current !== requestEpoch || patientField.value !== patientId || patientDialog.hidden) return;
      loadedPatientId = patientId;
      rows = data;
      status.textContent = "";
      render();
    } catch (error) {
      if (current !== requestEpoch || loadingController?.signal.aborted) return;
      status.textContent = error instanceof Error ? error.message : "Error al cargar las revisiones.";
    }
  }

  function openEditor(review = null) {
    const patientId = patientField.value;
    if (!loadedPatientId || loadedPatientId !== patientId || patientDialog.hidden) {
      status.textContent = "Actualiza la ficha antes de editar una revisión.";
      return;
    }
    selectedReviewId = review?.id || "";
    heading.textContent = review ? "Editar revisión clínica" : "Nueva revisión clínica";
    kindField.value = review?.review_kind || "periodic";
    dateField.value = review?.review_date || localDate();
    for (const name of fieldNames) inputs[name].value = review?.[columns[name]] || "";
    formStatus.textContent = "";
    dialog.showModal();
  }

  async function save(event) {
    event.preventDefault();
    const patientId = patientField.value;
    if (saving || !loadedPatientId || loadedPatientId !== patientId || patientDialog.hidden) return;
    if (!dateField.value || dateField.value > localDate()) {
      formStatus.textContent = "Indica una fecha de revisión válida, no posterior a hoy.";
      return;
    }
    const payload = {
      patient_id: patientId,
      review_date:dateField.value,
      review_kind:kindField.value,
      updated_at:new Date().toISOString()
    };
    for (const name of fieldNames) payload[columns[name]] = inputs[name].value.trim();
    if (fieldNames.every(name => !payload[columns[name]])) {
      formStatus.textContent = "Completa al menos un apartado clínico antes de guardar.";
      return;
    }
    saving = true;
    form.querySelector('button[type="submit"]').disabled = true;
    formStatus.textContent = "Guardando…";
    const editing = Boolean(selectedReviewId);
    const path = editing
      ? "clinical_process_reviews?id=eq." + encodeURIComponent(selectedReviewId) + "&patient_id=eq." + encodeURIComponent(patientId) + "&select=*"
      : "clinical_process_reviews?select=*";
    try {
      const response = await fetch(REST + path, {
        method: editing ? "PATCH" : "POST",
        headers: headers({ Prefer:"return=representation" }),
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => []);
      if (!response.ok || !Array.isArray(result) || result.length !== 1) {
        throw new Error(typeof result?.message === "string" ? result.message : "No se ha podido verificar el guardado.");
      }
      dialog.close();
      if (patientField.value === patientId) {
        status.textContent = "Revisión guardada en el expediente privado. No se ha compartido con el paciente.";
        await load();
      }
    } catch (error) {
      formStatus.textContent = error instanceof Error ? error.message : "No se ha podido guardar.";
    } finally {
      saving = false;
      form.querySelector('button[type="submit"]').disabled = false;
    }
  }

  function prepareReport(review) {
    const patientId = patientField.value;
    if (!loadedPatientId || loadedPatientId !== patientId || patientDialog.hidden || !rows.some(row => row.id === review.id)) return;
    const openButton = document.getElementById("clinic-new-report");
    const reportDialog = document.getElementById("clinic-report-dialog");
    if (!openButton || !reportDialog) {
      status.textContent = "El editor de informes no está disponible. Actualiza la página.";
      return;
    }
    if (reportDialog.open) {
      status.textContent = "Cierra primero el informe abierto para evitar sobrescribir un borrador.";
      return;
    }
    openButton.click();
    if (!reportDialog.open || patientField.value !== patientId) {
      status.textContent = "No se ha podido abrir el editor de informes.";
      return;
    }
    const byId = id => document.getElementById(id);
    const set = (id, value, change = false) => {
      const el = byId(id);
      if (!el || el.disabled) return;
      el.value = value || "";
      el.dispatchEvent(new Event(change ? "change" : "input", { bubbles:true }));
    };
    set("clinic-report-type", "clinical_summary", true);
    set("clinic-report-recipient", "Paciente (revisar destinatario)");
    set("clinic-report-end", review.review_date);
    set("clinic-report-context", "Documento de trabajo a partir de la revisión clínica del " + fmt(review.review_date) +
      ". La finalidad es consolidar el proceso y precisar los próximos pasos. La preparación de este documento no implica alta asistencial automática.");
    set("clinic-report-evolution", [
      ["Objetivos revisados", review.goal_review],
      ["Evolución clínica", review.symptom_change],
      ["Funcionamiento cotidiano", review.functional_change],
      ["Perspectiva del paciente", review.patient_perspective],
      ["Mediciones e interpretación", review.measurement_interpretation]
    ].filter(item => item[1]).map(item => item[0] + ":\n" + item[1]).join("\n\n"));
    set("clinic-report-interventions", review.strategies_worked ? "Intervenciones y recursos trabajados:\n" + review.strategies_worked : "");
    set("clinic-report-current", [
      ["Valoración clínica integrada", review.clinical_assessment],
      ["Siguientes pasos acordados o propuestos", review.next_steps],
      ["Consolidación, mantenimiento y señales para retomar contacto", review.maintenance_plan]
    ].filter(item => item[1]).map(item => item[0] + ":\n" + item[1]).join("\n\n"));
    // Purpose is set last, so the existing delayed autosave only receives a complete draft.
    set("clinic-report-purpose", "Resumen asistencial de revisión, consolidación y continuidad");
    const note = byId("clinic-report-message");
    if (note) note.textContent = "Borrador preparado desde una revisión clínica documentada. Revisa y adapta todos los apartados antes de guardarlo o aprobarlo. No se ha compartido con el paciente.";
  }

  section.querySelector("#clinic-review-new").addEventListener("click", () => openEditor());
  form.addEventListener("submit", save);
  dialog.querySelector("#clinic-review-close").addEventListener("click", () => { if (!saving) dialog.close(); });
  dialog.querySelector("#clinic-review-cancel").addEventListener("click", () => { if (!saving) dialog.close(); });
  dialog.addEventListener("cancel", event => { if (saving) event.preventDefault(); });
  const observer = new MutationObserver(() => {
    if (patientDialog.hidden) {
      requestEpoch++;
      if (loadingController) loadingController.abort();
      clear();
    } else if (patientField.value) void load();
  });
  observer.observe(patientDialog, { attributes:true, attributeFilter:["hidden"] });
  window.addEventListener("clinical:patient-opened", () => { if (!patientDialog.hidden) void load(); });
})();
