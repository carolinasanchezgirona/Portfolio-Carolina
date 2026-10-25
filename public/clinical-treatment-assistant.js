(() => {
  "use strict";
  const fields = {
    clinical_summary:"clinic-summary-note", medication_notes:"clinic-medication",
    reason_for_consultation:"clinic-reason-consultation", current_problem_history:"clinic-problem-history",
    psychological_psychiatric_history:"clinic-psych-history", medical_history:"clinic-medical-history",
    personal_family_context:"clinic-personal-family-context", social_context:"clinic-social-context",
    clinical_examination:"clinic-clinical-examination", psychometric_assessment:"clinic-psychometric-assessment",
    neuropsychological_assessment:"clinic-neuropsych-assessment", diagnoses:"clinic-diagnoses",
    diagnostic_hypotheses:"clinic-diagnostic-hypotheses", differential_diagnosis:"clinic-differential-diagnosis",
    current_clinical_problems:"clinic-current-problems", predisposing_factors:"clinic-predisposing-factors",
    precipitating_factors:"clinic-precipitating-factors", perpetuating_factors:"clinic-perpetuating-factors",
    protective_factors:"clinic-protective-factors", integrative_formulation:"clinic-integrative-formulation",
    clinical_evolution_summary:"clinic-evolution-summary", risk_safety:"clinic-risk-safety",
    therapeutic_goals:"clinic-therapeutic-goals", treatment_plan:"clinic-treatment-plan"
  };
  const $ = id => document.getElementById(id);
  let proposal = null;
  function text(tag,value,cls) {
    const node = document.createElement(tag);
    if(cls) node.className=cls;
    node.textContent=String(value || "");
    return node;
  }
  function appendDraft(id,value) {
    const target=$(id);
    if(!target || !value) return;
    const previous=target.value.trim();
    if(previous.includes(value.trim())) return;
    target.value=previous ? previous+"\n\n"+value : value;
    target.dispatchEvent(new Event("input",{bubbles:true}));
    const section=target.closest("details");
    if(section) section.open=true;
    target.focus();
  }
  function render() {
    const output=$("clinic-treatment-ai-results");
    if(!output || !proposal) return;
    output.replaceChildren();
    output.hidden=false;
    output.append(text("p", proposal.summary || "Propuesta pendiente de valoración."));
    const objectives=Array.isArray(proposal.objectives)?proposal.objectives:[];
    const interventions=Array.isArray(proposal.interventions)?proposal.interventions:[];
    const addSection=(name,values,format,targetId)=>{
      const section=document.createElement("section");
      section.append(text("h5",name));
      values.forEach((item)=>{
        const card=document.createElement("article");
        const lines=format(item);
        lines.forEach(([label,value])=>{if(value)card.append(text("p",label+": "+value))});
        const button=text("button","Incorporar tras revisión");
        button.type="button";
        button.className="clinic-secondary";
        button.addEventListener("click",()=>appendDraft(targetId,lines.filter(v=>v[1]).map(v=>v.join(": ")).join("\n")));
        card.append(button);
        section.append(card);
      });
      output.append(section);
    };
    addSection("Objetivos terapéuticos propuestos",objectives,v=>[["Objetivo",v.objective],["Justificación",v.rationale],["Indicador",v.indicator],["Prioridad",v.priority]],"clinic-therapeutic-goals");
    addSection("Intervenciones y tratamiento sugeridos",interventions,v=>[["Enfoque",v.approach],["Intervención",v.actions],["Fundamento clínico",v.rationale],["Precauciones",v.precautions]],"clinic-treatment-plan");
    [["Información pendiente",proposal.missing_information],["Riesgos y precauciones",proposal.safety_considerations],["Limitaciones",proposal.limitations]].forEach(([title,items])=>{
      if(!Array.isArray(items)||!items.length)return;
      const area=document.createElement("section");
      area.append(text("h5",title));
      const list=document.createElement("ul");
      items.forEach(item=>list.append(text("li",item)));
      area.append(list);
      output.append(area);
    });
    output.append(text("p","Borrador generado por IA. No se registra ni se aplica automáticamente. Verifica los antecedentes, la seguridad, la evidencia y la pertinencia para el caso.","clinic-muted"));
  }
  async function run(){
    const status=$("clinic-treatment-ai-status"),button=$("clinic-treatment-ai-run");
    let session;
    try{session=JSON.parse(sessionStorage.getItem("dememoria_admin_session")||"null")}catch{}
    if(!session?.access_token){status.textContent="Inicia sesión para utilizar el asistente.";return}
    const profile={};
    Object.entries(fields).forEach(([key,id])=>{const value=$(id)?.value?.trim();if(value)profile[key]=value});
    if(Object.values(profile).join(" ").length<80){status.textContent="Se necesita más información en la historia.";return}
    button.disabled=true;
    status.textContent="Generando objetivos y estrategias para revisión…";
    $("clinic-treatment-ai-results").hidden=true;
    try{
      const response=await fetch("/api/clinical/treatment-suggestion",{method:"POST",headers:{"Authorization":"Bearer "+session.access_token,"Content-Type":"application/json"},body:JSON.stringify({profile})});
      const body=await response.json();
      if(!response.ok)throw Error(body.error||"Error de análisis.");
      proposal=body.proposal;
      render();
      status.textContent="Propuesta lista para valoración profesional.";
    }catch(error){status.textContent=error.message||"No se pudo generar la propuesta."}
    finally{button.disabled=false}
  }
  function mount(){
    const field=$("clinic-therapeutic-goals");
    const body=field?.closest(".clinic-record-section-body");
    if(!body||$("clinic-treatment-ai"))return;
    const area=document.createElement("section");
    area.id="clinic-treatment-ai";
    area.className="clinic-treatment-ai clinic-full";
    area.append(text("h4","Sugerencias de objetivos y tratamiento"));
    area.append(text("p","Genera propuestas a partir de la historia disponible. Puedes incorporar cada sugerencia por separado después de revisarla."));
    const button=text("button","Sugerir objetivos y tratamiento");
    button.type="button";button.className="clinic-secondary";button.id="clinic-treatment-ai-run";
    button.addEventListener("click",run);
    area.append(button,text("span","","clinic-treatment-ai-status"));
    area.lastChild.id="clinic-treatment-ai-status";
    area.lastChild.setAttribute("role","status");
    const results=document.createElement("div");
    results.id="clinic-treatment-ai-results";results.hidden=true;
    area.append(results);
    body.prepend(area);
  }
  window.addEventListener("clinical:patient-opened",()=>{
    proposal=null;
    const result=$("clinic-treatment-ai-results");
    if(result){result.hidden=true;result.replaceChildren()}
    if($("clinic-treatment-ai-status"))$("clinic-treatment-ai-status").textContent="";
  });
  const observer=new MutationObserver(mount);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  mount();
})();