(() => {
  "use strict";

  const SESSION_KEY = "dememoria_admin_session";
  let suggestion = null;

  const inputMap = {
    age: "clinic-personal-age",
    clinical_summary: "clinic-summary-note",
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
    clinical_evolution_summary: "clinic-evolution-summary",
    risk_safety: "clinic-risk-safety",
    clinical_observations: "clinic-clinical-observations"
  };

  function el(id) { return document.getElementById(id); }

  function session() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); }
    catch { return null; }
  }

  function addStyles() {
    if (el("clinic-dx-ai-styles")) return;
    const style = document.createElement("style");
    style.id = "clinic-dx-ai-styles";
    style.textContent = `
      .clinic-dx-ai{grid-column:1/-1;margin:0 0 8px;padding:16px;border:1px solid #cfe0e9;border-radius:14px;background:linear-gradient(145deg,#fff,#f5fafc)}
      .clinic-dx-ai-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
      .clinic-dx-ai-head h4{margin:2px 0 5px;color:#173A5E}
      .clinic-dx-ai-head p{margin:0;max-width:740px;color:#607483;line-height:1.5;font-size:.82rem}
      .clinic-dx-ai-badge{white-space:nowrap;border:1px solid #b9dfdc;background:#eefaf9;color:#116b67;border-radius:999px;padding:6px 9px;font-size:.7rem;font-weight:800}
      .clinic-dx-ai-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;align-items:center}
      .clinic-dx-ai-status{font-size:.76rem;color:#607483}
      .clinic-dx-ai-result{margin-top:16px;padding-top:16px;border-top:1px solid #dbe7ee;display:grid;gap:12px}
      .clinic-dx-ai-primary{padding:14px;border:1px solid #c9dce6;border-radius:12px;background:#fff}
      .clinic-dx-ai-primary h5,.clinic-dx-ai-card h5{margin:0 0 7px;color:#173A5E;font-size:.9rem}
      .clinic-dx-ai-primary p,.clinic-dx-ai-card p{margin:0;color:#405766;line-height:1.5;font-size:.8rem;white-space:pre-wrap}
      .clinic-dx-ai-signal{display:inline-flex;margin-bottom:8px;border-radius:999px;padding:5px 8px;font-size:.68rem;font-weight:800;background:#edf4f8;color:#526977}
      .clinic-dx-ai-signal.provisional{background:#eaf9f8;color:#145d5a}
      .clinic-dx-ai-signal.insufficient{background:#fff4df;color:#835e17}
      .clinic-dx-ai-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .clinic-dx-ai-card{padding:13px;border:1px solid #dbe7ee;border-radius:12px;background:#fff}
      .clinic-dx-ai-list{margin:8px 0 0;padding-left:18px;color:#405766;font-size:.78rem;line-height:1.5}
      .clinic-dx-ai-differential{display:grid;gap:8px}
      .clinic-dx-ai-diff{padding:12px;border:1px solid #dbe7ee;border-radius:11px;background:#fff}
      .clinic-dx-ai-diff strong{display:block;color:#173A5E;margin-bottom:5px;font-size:.82rem}
      .clinic-dx-ai-diff p{margin:3px 0;color:#4b6170;font-size:.76rem;line-height:1.45}
      .clinic-dx-ai-caution{padding:10px 12px;border-left:3px solid #F2766B;border-radius:9px;background:#fff8f6;color:#6f4b47;font-size:.74rem;line-height:1.5}
      @media(max-width:760px){.clinic-dx-ai-head,.clinic-dx-ai-grid{display:grid}.clinic-dx-ai-badge{justify-self:start}}
    `;
    document.head.append(style);
  }

  function mergeText(previous, incoming) {
    const a = String(previous || "").trim();
    const b = String(incoming || "").trim();
    if (!b) return a;
    if (!a) return b;
    if (a.toLocaleLowerCase("es").includes(b.toLocaleLowerCase("es"))) return a;
    return a + "\n\n" + b;
  }

  function collectProfile() {
    const profile = {};
    Object.entries(inputMap).forEach(([key, id]) => {
      const value = el(id)?.value?.trim();
      if (value) profile[key] = value;
    });
    return profile;
  }

  function listBlock(title, values) {
    const card = document.createElement("article");
    card.className = "clinic-dx-ai-card";
    const heading = document.createElement("h5");
    heading.textContent = title;
    card.append(heading);
    const list = document.createElement("ul");
    list.className = "clinic-dx-ai-list";
    (values || []).forEach((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      list.append(item);
    });
    if (!list.childNodes.length) {
      const p = document.createElement("p");
      p.textContent = "No se han señalado datos específicos.";
      card.append(p);
    } else {
      card.append(list);
    }
    return card;
  }

  function renderSuggestion() {
    const target = el("clinic-dx-ai-result");
    if (!target || !suggestion) return;
    target.replaceChildren();

    const primary = suggestion.primary || {};
    const primaryCard = document.createElement("article");
    primaryCard.className = "clinic-dx-ai-primary";

    const signal = document.createElement("span");
    const insufficient = suggestion.assessment_status === "insufficient_information";
    signal.className = "clinic-dx-ai-signal " + (insufficient ? "insufficient" : "provisional");
    signal.textContent = suggestion.assessment_status === "provisional_diagnosis_possible"
      ? "Hipótesis provisional posible"
      : suggestion.assessment_status === "no_specific_diagnosis_supported"
        ? "Sin diagnóstico específico suficientemente apoyado"
        : "Información insuficiente";

    const title = document.createElement("h5");
    title.textContent = primary.diagnosis || "No se propone una etiqueta diagnóstica principal";
    const rationale = document.createElement("p");
    rationale.textContent = primary.rationale || "La información disponible no permite una formulación diagnóstica prudente.";
    primaryCard.append(signal, title, rationale);
    target.append(primaryCard);

    const evidenceGrid = document.createElement("div");
    evidenceGrid.className = "clinic-dx-ai-grid";
    evidenceGrid.append(
      listBlock("Datos que apoyan la hipótesis", primary.supporting_evidence),
      listBlock("Datos que la cuestionan o faltan", primary.conflicting_or_missing_evidence)
    );
    target.append(evidenceGrid);

    const diffCard = document.createElement("article");
    diffCard.className = "clinic-dx-ai-card";
    const diffTitle = document.createElement("h5");
    diffTitle.textContent = "Diagnóstico diferencial";
    const diffList = document.createElement("div");
    diffList.className = "clinic-dx-ai-differential";

    (suggestion.differential || []).forEach((item) => {
      const row = document.createElement("div");
      row.className = "clinic-dx-ai-diff";
      const name = document.createElement("strong");
      name.textContent = item.diagnosis;
      const why = document.createElement("p");
      why.textContent = "A considerar: " + (item.why_consider || "—");
      const against = document.createElement("p");
      against.textContent = "En contra / pendiente: " + (item.against_or_missing || "—");
      row.append(name, why, against);
      if (item.discriminators?.length) {
        const disc = document.createElement("ul");
        disc.className = "clinic-dx-ai-list";
        item.discriminators.forEach((value) => {
          const li = document.createElement("li");
          li.textContent = value;
          disc.append(li);
        });
        row.append(disc);
      }
      diffList.append(row);
    });
    if (!diffList.childNodes.length) {
      const p = document.createElement("p");
      p.textContent = "No se han propuesto alternativas diferenciales prioritarias.";
      diffList.append(p);
    }
    diffCard.append(diffTitle, diffList);
    target.append(diffCard);

    const extraGrid = document.createElement("div");
    extraGrid.className = "clinic-dx-ai-grid";
    extraGrid.append(
      listBlock("Descartar / considerar causas médicas, medicación o sustancias", suggestion.medical_or_substance_considerations),
      listBlock("Información prioritaria por explorar", suggestion.priority_missing_information)
    );
    target.append(extraGrid);

    const caution = document.createElement("div");
    caution.className = "clinic-dx-ai-caution";
    caution.textContent = suggestion.caution || "Sugerencia generada con IA para revisión profesional. No equivale a un diagnóstico confirmado.";
    target.append(caution);

    const actions = document.createElement("div");
    actions.className = "clinic-dx-ai-actions";

    const hypothesis = document.createElement("button");
    hypothesis.type = "button";
    hypothesis.className = "clinic-secondary";
    hypothesis.textContent = "Pasar a hipótesis diagnósticas";
    hypothesis.disabled = !suggestion.record_hypothesis;
    hypothesis.addEventListener("click", () => {
      const field = el("clinic-diagnostic-hypotheses");
      if (!field) return;
      field.value = mergeText(field.value, suggestion.record_hypothesis);
      field.dispatchEvent(new Event("input", { bubbles: true }));
    });

    const differential = document.createElement("button");
    differential.type = "button";
    differential.className = "clinic-secondary";
    differential.textContent = "Pasar a diagnóstico diferencial";
    differential.disabled = !suggestion.record_differential;
    differential.addEventListener("click", () => {
      const field = el("clinic-differential-diagnosis");
      if (!field) return;
      field.value = mergeText(field.value, suggestion.record_differential);
      field.dispatchEvent(new Event("input", { bubbles: true }));
    });

    const diagnosis = document.createElement("button");
    diagnosis.type = "button";
    diagnosis.className = "clinic-primary";
    diagnosis.textContent = "Registrar diagnóstico tras revisión";
    diagnosis.disabled = suggestion.assessment_status !== "provisional_diagnosis_possible" || !primary.diagnosis;
    diagnosis.addEventListener("click", () => {
      const confirmed = window.confirm(
        "La IA solo ha propuesto una hipótesis. Confirma que has revisado personalmente los criterios clínicos, el diagnóstico diferencial y las posibles exclusiones antes de copiarlo a Diagnósticos registrados."
      );
      if (!confirmed) return;
      const field = el("clinic-diagnoses");
      if (!field) return;
      field.value = mergeText(field.value, primary.diagnosis);
      field.dispatchEvent(new Event("input", { bubbles: true }));
    });

    actions.append(hypothesis, differential, diagnosis);
    target.append(actions);
    target.hidden = false;
  }

  async function analyzeDiagnosis() {
    const status = el("clinic-dx-ai-status");
    const button = el("clinic-dx-ai-run");
    const value = session();
    if (!value?.access_token) {
      status.textContent = "La sesión ha caducado. Vuelve a entrar en Gestión clínica.";
      return;
    }

    const profile = collectProfile();
    const textLength = Object.values(profile).join(" ").length;
    if (textLength < 80) {
      status.textContent = "La ficha todavía contiene poca información para un diferencial útil.";
      return;
    }

    status.textContent = "Analizando el historial y construyendo el diferencial…";
    button.disabled = true;
    el("clinic-dx-ai-result").hidden = true;

    try {
      const response = await fetch("/api/clinical/diagnostic-suggestion", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + value.access_token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ profile })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "No se ha podido generar la sugerencia diagnóstica.");
      suggestion = body;
      renderSuggestion();
      status.textContent = "Propuesta preparada. Revisa criterios y diferencial antes de incorporarla.";
    } catch (error) {
      status.textContent = error?.message || "No se ha podido generar la sugerencia diagnóstica.";
    } finally {
      button.disabled = false;
    }
  }

  function buildUi() {
    const diagnoses = el("clinic-diagnoses");
    const body = diagnoses?.closest(".clinic-record-section-body");
    if (!diagnoses || !body || el("clinic-dx-ai")) return;

    addStyles();
    const panel = document.createElement("section");
    panel.id = "clinic-dx-ai";
    panel.className = "clinic-dx-ai";
    panel.innerHTML = `
      <div class="clinic-dx-ai-head">
        <div>
          <p class="clinic-eyebrow">Apoyo al razonamiento diagnóstico</p>
          <h4>Sugerencia diagnóstica asistida por IA</h4>
          <p>Analiza la información ya registrada en la ficha y propone una hipótesis principal, datos a favor y en contra y un diagnóstico diferencial. No guarda nada automáticamente.</p>
        </div>
        <span class="clinic-dx-ai-badge">Requiere revisión profesional</span>
      </div>
      <div class="clinic-dx-ai-actions">
        <button id="clinic-dx-ai-run" class="clinic-secondary" type="button">Sugerir diagnóstico con IA</button>
        <span id="clinic-dx-ai-status" class="clinic-dx-ai-status" role="status" aria-live="polite"></span>
      </div>
      <div id="clinic-dx-ai-result" class="clinic-dx-ai-result" hidden></div>
    `;
    body.prepend(panel);
    el("clinic-dx-ai-run")?.addEventListener("click", analyzeDiagnosis);
  }

  function reset() {
    suggestion = null;
    const result = el("clinic-dx-ai-result");
    if (result) {
      result.hidden = true;
      result.replaceChildren();
    }
    const status = el("clinic-dx-ai-status");
    if (status) status.textContent = "";
  }

  window.addEventListener("clinical:patient-opened", reset);

  const observer = new MutationObserver(buildUi);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  buildUi();
})();
