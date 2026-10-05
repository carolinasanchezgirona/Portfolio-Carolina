(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = SUPABASE_URL + "/rest/v1";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";

  const fieldMap = {
    clinical_summary: "clinic-summary-note",
    next_session_focus: "clinic-next-focus",
    medication_notes: "clinic-medication",
    reason_for_consultation: "clinic-reason-consultation",
    current_problem_history: "clinic-problem-history",
    psychological_psychiatric_history: "clinic-psych-history",
    medical_history: "clinic-medical-history",
    family_history: "clinic-family-history",
    personal_family_context: "clinic-personal-family-context",
    social_context: "clinic-social-context",
    academic_work_context: "clinic-work-academic-context",
    significant_life_events: "clinic-life-events",
    clinical_examination: "clinic-clinical-examination",
    psychometric_assessment: "clinic-psychometric-assessment",
    neuropsychological_assessment: "clinic-neuropsych-assessment",
    diagnoses: "clinic-diagnoses",
    diagnostic_hypotheses: "clinic-diagnostic-hypotheses",
    differential_diagnosis: "clinic-differential-diagnosis",
    current_clinical_problems: "clinic-current-problems",
    predisposing_factors: "clinic-predisposing-factors",
    precipitating_factors: "clinic-precipitating-factors",
    perpetuating_factors: "clinic-perpetuating-factors",
    protective_factors: "clinic-protective-factors",
    integrative_formulation: "clinic-integrative-formulation",
    therapeutic_goals: "clinic-therapeutic-goals",
    treatment_plan: "clinic-treatment-plan",
    interventions_summary: "clinic-interventions-summary",
    clinical_evolution_summary: "clinic-evolution-summary",
    risk_safety: "clinic-risk-safety",
    professional_coordination: "clinic-professional-coordination",
    clinical_observations: "clinic-clinical-observations"
  };

  const fieldLabels = {
    clinical_summary: "Síntesis clínica",
    next_session_focus: "Para la próxima sesión",
    medication_notes: "Medicación registrada",
    reason_for_consultation: "Motivo de consulta",
    current_problem_history: "Historia del problema actual",
    psychological_psychiatric_history: "Antecedentes psicológicos / psiquiátricos",
    medical_history: "Antecedentes médicos",
    family_history: "Antecedentes familiares",
    personal_family_context: "Contexto personal y familiar",
    social_context: "Contexto social",
    academic_work_context: "Contexto académico / laboral",
    significant_life_events: "Acontecimientos vitales relevantes",
    clinical_examination: "Exploración clínica",
    psychometric_assessment: "Evaluación psicométrica",
    neuropsychological_assessment: "Evaluación neuropsicológica",
    diagnoses: "Diagnósticos registrados",
    diagnostic_hypotheses: "Hipótesis diagnósticas",
    differential_diagnosis: "Diagnóstico diferencial",
    current_clinical_problems: "Problemas clínicos actuales",
    predisposing_factors: "Factores predisponentes",
    precipitating_factors: "Factores precipitantes",
    perpetuating_factors: "Factores perpetuantes",
    protective_factors: "Factores protectores",
    integrative_formulation: "Formulación clínica integradora",
    therapeutic_goals: "Objetivos terapéuticos",
    treatment_plan: "Plan terapéutico",
    interventions_summary: "Intervenciones realizadas",
    clinical_evolution_summary: "Evolución clínica",
    risk_safety: "Riesgo y seguridad",
    professional_coordination: "Coordinación con otros profesionales",
    clinical_observations: "Observaciones clínicas"
  };

  let draft = null;
  let templates = null;

  function session() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }

  function authHeaders(extra = {}) {
    const value = session();
    return {
      apikey: KEY,
      Authorization: "Bearer " + (value?.access_token || ""),
      "Content-Type": "application/json",
      ...extra
    };
  }

  function el(id) { return document.getElementById(id); }

  function addStyles() {
    if (el("clinic-smart-intake-styles")) return;
    const style = document.createElement("style");
    style.id = "clinic-smart-intake-styles";
    style.textContent = `
      .clinic-smart-intake{margin:22px 0;padding:22px;border:1px solid #cfe0e9;border-radius:18px;background:linear-gradient(145deg,#fff,#f4fafc)}
      .clinic-smart-head,.clinic-smart-preview-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:16px}
      .clinic-smart-head h3,.clinic-smart-preview h4{margin:2px 0 5px;color:#173A5E}
      .clinic-smart-head p{margin:0;max-width:680px;color:#607483;line-height:1.5}
      .clinic-smart-badge{white-space:nowrap;border:1px solid #b9dfdc;background:#eefaf9;color:#116b67;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:750}
      .clinic-smart-intake textarea{width:100%;box-sizing:border-box;margin-top:6px}
      .clinic-smart-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:12px}
      .clinic-smart-preview{margin-top:20px;padding-top:20px;border-top:1px solid #d9e5ee}
      .clinic-smart-fields{display:grid;gap:9px;margin-bottom:18px}
      .clinic-smart-field{padding:12px 14px;border:1px solid #dbe7ee;border-radius:12px;background:#fff}
      .clinic-smart-field strong{display:block;color:#173A5E;margin-bottom:5px}
      .clinic-smart-field p{margin:0;white-space:pre-wrap;line-height:1.5}
      .clinic-smart-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
      .clinic-smart-grid article,.clinic-smart-exercises{padding:15px;border-radius:14px;background:#fff;border:1px solid #dbe7ee}
      .clinic-smart-list{display:grid;gap:8px;margin-top:10px}
      .clinic-smart-item{padding:9px 11px;border-radius:10px;background:#f6fafc;line-height:1.45}
      .clinic-smart-confidence{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#607483}
      .clinic-smart-exercises{margin-top:14px}
      .clinic-smart-process{display:grid;gap:3px}
      .clinic-smart-process strong{color:#173A5E}
      .clinic-smart-exercise-candidates{margin-top:12px;display:grid;gap:8px}
      .clinic-smart-exercise{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:10px 12px;border:1px solid #dbe7ee;border-radius:11px}
      .clinic-smart-exercise small{display:block;color:#607483;margin-top:3px}
      @media(max-width:760px){.clinic-smart-head,.clinic-smart-preview-head{display:grid}.clinic-smart-grid{grid-template-columns:1fr}.clinic-smart-badge{justify-self:start}}
    `;
    document.head.append(style);
  }

  function buildUi() {
    const form = el("clinic-patient-form");
    const prep = form?.querySelector(".clinic-preparation");
    if (!form || !prep || el("clinic-smart-intake")) return;

    addStyles();
    const section = document.createElement("section");
    section.id = "clinic-smart-intake";
    section.className = "clinic-smart-intake";
    section.innerHTML = `
      <div class="clinic-smart-head">
        <div>
          <p class="clinic-eyebrow">Entrada clínica inteligente</p>
          <h3>Pega tus notas una sola vez</h3>
          <p>Distribuye la información por el historial, señala inferencias y detecta aspectos que conviene explorar. Nada se incorpora hasta que lo revises.</p>
        </div>
        <span class="clinic-smart-badge">Borrador · requiere revisión</span>
      </div>
      <label class="clinic-full">Notas originales
        <textarea id="clinic-smart-note" rows="9" placeholder="Pega aquí tus notas de Word o escribe de forma libre. No necesitas ordenarlas ni utilizar terminología clínica."></textarea>
      </label>
      <div class="clinic-smart-actions">
        <button id="clinic-smart-analyze" class="clinic-primary" type="button">Analizar y distribuir</button>
        <button id="clinic-smart-clear" class="clinic-text" type="button">Limpiar</button>
        <span id="clinic-smart-status" class="clinic-message" role="status" aria-live="polite"></span>
      </div>
      <div id="clinic-smart-preview" class="clinic-smart-preview" hidden>
        <div class="clinic-smart-preview-head">
          <div><p class="clinic-eyebrow">Propuesta de integración</p><h4>Revisa antes de incorporar al historial</h4></div>
          <button id="clinic-smart-apply" class="clinic-primary" type="button">Aplicar y guardar en historial</button>
        </div>
        <div id="clinic-smart-fields" class="clinic-smart-fields"></div>
        <div class="clinic-smart-grid">
          <article><h4>Inferencias clínicas sugeridas</h4><p class="clinic-note">Hipótesis, nunca hechos.</p><div id="clinic-smart-inferences" class="clinic-smart-list"></div></article>
          <article><h4>Aspectos a explorar</h4><p class="clinic-note">Información relevante no localizada o insuficiente.</p><div id="clinic-smart-missing" class="clinic-smart-list"></div></article>
        </div>
        <article class="clinic-smart-exercises"><h4>Procesos y ejercicios a considerar</h4><div id="clinic-smart-processes" class="clinic-smart-list"></div><div id="clinic-smart-exercise-candidates" class="clinic-smart-exercise-candidates"></div></article>
      </div>
    `;
    prep.before(section);

    el("clinic-smart-analyze")?.addEventListener("click", analyze);
    el("clinic-smart-clear")?.addEventListener("click", clear);
    el("clinic-smart-apply")?.addEventListener("click", applyDraft);
  }

  function scrubKnownIdentifiers(text) {
    let result = String(text || "");
    const name = el("clinic-patient-name")?.textContent?.trim();
    const contact = el("clinic-patient-contact")?.textContent || "";
    if (name && name !== "Paciente") result = result.replaceAll(name, "[PACIENTE]");
    const emailMatches = contact.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
    emailMatches.forEach((value) => { result = result.replaceAll(value, "[EMAIL]"); });
    const phoneMatches = contact.match(/(?:\+?34[ .-]?)?(?:[6789]\d{2})(?:[ .-]?\d{3}){2}/g) || [];
    phoneMatches.forEach((value) => { result = result.replaceAll(value, "[TELÉFONO]"); });
    return result;
  }

  async function getTemplates() {
    if (templates) return templates;
    const response = await fetch(REST_URL + "/clinical_exercise_templates?select=id,title,summary,process_tags,duration_minutes,burden,material_type,phase,objectives,cautions,sequence_rank&status=eq.active&order=sequence_rank.asc,title.asc", {
      headers: authHeaders(), cache: "no-store"
    });
    if (!response.ok) return [];
    templates = await response.json();
    return templates;
  }

  function render() {
    const preview = el("clinic-smart-preview");
    if (!preview || !draft) return;

    const fields = el("clinic-smart-fields");
    fields.replaceChildren();
    Object.entries(draft.fields || {}).forEach(([key, value]) => {
      if (!value || !fieldLabels[key]) return;
      const item = document.createElement("article");
      item.className = "clinic-smart-field";
      const title = document.createElement("strong");
      title.textContent = fieldLabels[key];
      const text = document.createElement("p");
      text.textContent = value;
      item.append(title, text);
      fields.append(item);
    });

    const inferenceBox = el("clinic-smart-inferences");
    inferenceBox.replaceChildren();
    (draft.inferences || []).forEach((item) => {
      const node = document.createElement("div");
      node.className = "clinic-smart-item";
      const label = document.createElement("span");
      label.className = "clinic-smart-confidence";
      label.textContent = (item.confidence || "plausible") === "high" ? "Coherencia alta" : "Hipótesis plausible";
      const text = document.createElement("div");
      text.textContent = item.statement + (item.basis ? " · Base: " + item.basis : "");
      node.append(label, text);
      inferenceBox.append(node);
    });
    if (!draft.inferences?.length) inferenceBox.textContent = "No se han propuesto inferencias adicionales.";

    const missingBox = el("clinic-smart-missing");
    missingBox.replaceChildren();
    (draft.missing_to_explore || []).forEach((value) => {
      const node = document.createElement("div");
      node.className = "clinic-smart-item";
      node.textContent = value;
      missingBox.append(node);
    });
    if (!draft.missing_to_explore?.length) missingBox.textContent = "No se han detectado huecos prioritarios.";

    const processBox = el("clinic-smart-processes");
    processBox.replaceChildren();
    (draft.processes || []).forEach((item) => {
      const node = document.createElement("div");
      node.className = "clinic-smart-item clinic-smart-process";
      const title = document.createElement("strong");
      title.textContent = item.process;
      const reason = document.createElement("span");
      reason.textContent = item.reason || "";
      node.append(title, reason);
      processBox.append(node);
    });

    renderExerciseCandidates();
    preview.hidden = false;
  }

  async function renderExerciseCandidates() {
    const target = el("clinic-smart-exercise-candidates");
    if (!target || !draft) return;
    target.replaceChildren();

    const all = await getTemplates();
    const patientId = el("clinic-patient-id")?.value || "";
    const processNames = new Set((draft.processes || []).map((x) => x.process));
    let assignments = [];

    if (patientId) {
      const response = await fetch(
        REST_URL + "/clinical_exercise_assignments?select=template_id,status,assigned_at,reviewed_at&patient_id=eq." + encodeURIComponent(patientId) + "&order=created_at.desc",
        { headers: authHeaders(), cache: "no-store" }
      );
      if (response.ok) assignments = await response.json();
    }

    const templateMap = new Map(all.map((template) => [template.id, template]));
    const historyByProcess = new Map();
    assignments.forEach((assignment) => {
      const template = templateMap.get(assignment.template_id);
      (template?.process_tags || []).forEach((tag) => {
        const current = historyByProcess.get(tag) || { total: 0, reviewed: 0 };
        current.total += 1;
        if (["reviewed", "closed"].includes(assignment.status)) current.reviewed += 1;
        historyByProcess.set(tag, current);
      });
    });

    const candidates = all
      .map((template) => {
        const matches = (template.process_tags || []).filter((tag) => processNames.has(tag));
        if (!matches.length) return null;

        const same = assignments.filter((assignment) => assignment.template_id === template.id);
        if (same.some((assignment) => ["prepared", "assigned", "sent"].includes(assignment.status))) return null;

        const history = matches.reduce((sum, tag) => sum + (historyByProcess.get(tag)?.total || 0), 0);
        const reviewed = matches.reduce((sum, tag) => sum + (historyByProcess.get(tag)?.reviewed || 0), 0);
        let score = matches.length * 100;
        const reasons = ["encaja con " + matches.join(", ")];

        if (history === 0 && template.material_type === "psychoeducation") {
          score += 50;
          reasons.push("conviene orientar antes de practicar");
        }
        if (history === 0 && ["assessment", "skills"].includes(template.phase)) {
          score += 30;
          reasons.push("fase inicial");
        }
        if (history > 0 && ["skills", "practice", "exposure"].includes(template.phase)) {
          score += 36;
          reasons.push("ya existe trabajo previo");
        }
        if (reviewed >= 2 && template.phase === "consolidation") {
          score += 28;
          reasons.push("momento de consolidación");
        }
        if (reviewed >= 3 && template.phase === "relapse_prevention") {
          score += 25;
          reasons.push("compatible con mantenimiento");
        }
        if (same.some((assignment) => ["reviewed", "closed"].includes(assignment.status))) score -= 45;
        if (template.burden === "low") score += 5;
        score += Math.max(0, 22 - Math.min(22, Number(template.sequence_rank || 50) / 5));

        return { template, score, reasons };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || Number(a.template.sequence_rank || 50) - Number(b.template.sequence_rank || 50))
      .slice(0, 4);

    if (!candidates.length) {
      const node = document.createElement("div");
      node.className = "clinic-smart-item";
      node.textContent = "No hay una prescripción prioritaria con los procesos detectados. Puedes elegir material manualmente.";
      target.append(node);
      return;
    }

    candidates.forEach(({ template, reasons }, index) => {
      const row = document.createElement("div");
      row.className = "clinic-smart-exercise";
      const info = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = (index + 1) + ". " + template.title;
      const meta = document.createElement("small");
      meta.textContent =
        (template.material_type === "psychoeducation" ? "Psicoeducación" : "Ejercicio") +
        " · " + (template.process_tags || []).join(" · ") +
        (template.duration_minutes ? " · " + template.duration_minutes + " min" : "") +
        " · " + reasons.join(" · ");
      info.append(title, meta);

      const button = document.createElement("button");
      button.className = "clinic-secondary";
      button.type = "button";
      button.textContent = "Preparar";
      button.addEventListener("click", () => {
        const select = el("clinic-exercise-library");
        const assign = el("clinic-new-exercise");
        assign?.click();
        if (select) {
          select.value = template.id;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          const rationale = el("clinic-exercise-rationale");
          if (rationale) rationale.value = "Prescripción sugerida: " + reasons.join(". ") + ".";
        }
      });
      row.append(info, button);
      target.append(row);
    });
  }

  async function analyze() {
    const note = el("clinic-smart-note")?.value?.trim() || "";
    const status = el("clinic-smart-status");
    if (note.length < 20) {
      status.textContent = "Añade unas notas clínicas antes de analizar.";
      return;
    }
    const value = session();
    if (!value?.access_token) {
      status.textContent = "La sesión ha caducado. Vuelve a entrar en Gestión clínica.";
      return;
    }

    status.textContent = "Analizando y organizando…";
    el("clinic-smart-analyze").disabled = true;

    const existing = {};
    Object.entries(fieldMap).forEach(([key, id]) => {
      const value = el(id)?.value?.trim();
      if (value) existing[key] = value;
    });

    try {
      const response = await fetch("/api/clinical/structure", {
        method: "POST",
        headers: { Authorization: "Bearer " + value.access_token, "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: scrubKnownIdentifiers(note),
          existing_profile: existing
        })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "No se ha podido analizar la nota.");
      draft = body;
      render();
      status.textContent = "Propuesta preparada. Revisa los apartados antes de aplicarla.";
    } catch (error) {
      status.textContent = error?.message || "No se ha podido analizar la nota.";
    } finally {
      el("clinic-smart-analyze").disabled = false;
    }
  }

  function mergeText(previous, incoming) {
    const a = String(previous || "").trim();
    const b = String(incoming || "").trim();
    if (!b) return a;
    if (!a) return b;
    if (a.toLocaleLowerCase("es").includes(b.toLocaleLowerCase("es"))) return a;
    return a + "\n\n" + b;
  }

  async function applyDraft() {
    if (!draft) return;
    const status = el("clinic-smart-status");
    const patientId = el("clinic-patient-id")?.value;
    const originalNote = el("clinic-smart-note")?.value?.trim() || "";
    if (!patientId) {
      status.textContent = "No se ha podido identificar la ficha del paciente.";
      return;
    }

    status.textContent = "Integrando en el historial…";
    el("clinic-smart-apply").disabled = true;

    try {
      const response = await fetch(REST_URL + "/clinical_patients?id=eq." + encodeURIComponent(patientId) + "&select=id,clinical_profile,clinical_summary,next_session_focus,medication_notes&limit=1", {
        headers: authHeaders(), cache: "no-store"
      });
      if (!response.ok) throw new Error("No se ha podido leer la ficha actual.");
      const patient = (await response.json())?.[0];
      if (!patient) throw new Error("Ficha no encontrada.");

      const profile = patient.clinical_profile && typeof patient.clinical_profile === "object" ? { ...patient.clinical_profile } : {};

      Object.entries(draft.fields || {}).forEach(([key, incoming]) => {
        if (!incoming) return;
        if (["clinical_summary", "next_session_focus", "medication_notes"].includes(key)) return;
        profile[key] = mergeText(profile[key], incoming);
      });

      (draft.inferences || []).forEach((item) => {
        const target = fieldMap[item.target_field] && !["clinical_summary","next_session_focus","medication_notes"].includes(item.target_field)
          ? item.target_field
          : "clinical_observations";
        const line = "[Inferencia clínica sugerida · " + (item.confidence === "high" ? "coherencia alta" : "hipótesis plausible") + "] " + item.statement + (item.basis ? " Base: " + item.basis : "");
        profile[target] = mergeText(profile[target], line);
      });

      const log = Array.isArray(profile._smart_intake_log) ? profile._smart_intake_log.slice(-19) : [];
      log.push({
        at: new Date().toISOString(),
        source_note: originalNote,
        extracted_fields: draft.fields || {},
        inferences: draft.inferences || [],
        missing_to_explore: draft.missing_to_explore || [],
        processes: draft.processes || []
      });
      profile._smart_intake_log = log;

      const missingText = (draft.missing_to_explore || []).length
        ? "[Pendiente de explorar]\n" + draft.missing_to_explore.map((x) => "• " + x).join("\n")
        : "";

      const payload = {
        clinical_profile: profile,
        clinical_summary: mergeText(patient.clinical_summary, draft.fields?.clinical_summary),
        next_session_focus: mergeText(mergeText(patient.next_session_focus, draft.fields?.next_session_focus), missingText),
        medication_notes: mergeText(patient.medication_notes, draft.fields?.medication_notes),
        updated_at: new Date().toISOString()
      };

      const save = await fetch(REST_URL + "/clinical_patients?id=eq." + encodeURIComponent(patientId), {
        method: "PATCH",
        headers: authHeaders({ Prefer: "return=representation" }),
        body: JSON.stringify(payload)
      });
      if (!save.ok) throw new Error("No se ha podido guardar la integración.");

      Object.entries(fieldMap).forEach(([key, id]) => {
        const node = el(id);
        if (!node) return;
        let valueToShow;
        if (key === "clinical_summary") valueToShow = payload.clinical_summary;
        else if (key === "next_session_focus") valueToShow = payload.next_session_focus;
        else if (key === "medication_notes") valueToShow = payload.medication_notes;
        else valueToShow = profile[key] || "";
        node.value = valueToShow || "";
        node.dispatchEvent(new Event("input", { bubbles: true }));
      });

      status.textContent = "Integrado y guardado. La nota original queda conservada en la trazabilidad.";
    } catch (error) {
      status.textContent = error?.message || "No se ha podido guardar la integración.";
    } finally {
      el("clinic-smart-apply").disabled = false;
    }
  }

  function clear() {
    const note = el("clinic-smart-note");
    if (note) note.value = "";
    const preview = el("clinic-smart-preview");
    if (preview) preview.hidden = true;
    const status = el("clinic-smart-status");
    if (status) status.textContent = "";
    draft = null;
  }

  const observer = new MutationObserver(() => buildUi());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  buildUi();
})();