(() => {
  "use strict";
  // Standalone handler for patient-view AI buttons. No clinical record is modified.
  const ids = {
    clinical_summary:"clinic-summary-note", medication_notes:"clinic-medication",
    reason_for_consultation:"clinic-reason-consultation",current_problem_history:"clinic-problem-history",
    psychological_psychiatric_history:"clinic-psych-history",medical_history:"clinic-medical-history",
    family_history:"clinic-family-history",personal_family_context:"clinic-personal-family-context",
    social_context:"clinic-social-context",academic_work_context:"clinic-work-academic-context",
    significant_life_events:"clinic-life-events",clinical_examination:"clinic-clinical-examination",
    psychometric_assessment:"clinic-psychometric-assessment",neuropsychological_assessment:"clinic-neuropsych-assessment",
    diagnoses:"clinic-diagnoses",diagnostic_hypotheses:"clinic-diagnostic-hypotheses",
    differential_diagnosis:"clinic-differential-diagnosis",current_clinical_problems:"clinic-current-problems",
    predisposing_factors:"clinic-predisposing-factors",precipitating_factors:"clinic-precipitating-factors",
    perpetuating_factors:"clinic-perpetuating-factors",protective_factors:"clinic-protective-factors",
    integrative_formulation:"clinic-integrative-formulation",clinical_evolution_summary:"clinic-evolution-summary",
    risk_safety:"clinic-risk-safety",clinical_observations:"clinic-clinical-observations",
    therapeutic_goals:"clinic-therapeutic-goals",treatment_plan:"clinic-treatment-plan",
    age:"clinic-personal-age"
  };
  const normalize = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase().replace(/\s+/g," ");
  const state = { diagnostic:false,treatment:false };
  const endpoint = {
    diagnostic:"/api/clinical/diagnostic-suggestion",
    treatment:"/api/clinical/treatment-suggestion"
  };
  function outputFor(button,kind) {
    const id="clinic-ai-direct-"+kind;
    let area=document.getElementById(id);
    if(!area) {
      area=document.createElement("section");
      area.id=id;
      area.style.cssText="padding:14px;margin:12px 0;border:1px solid #c8dfe0;border-radius:10px;background:white;max-width:850px";
      area.setAttribute("aria-live","polite");
      // Place results where the user clicked, not inside a hidden section.
      const parent=button.closest(".clinic-dx-ai,.clinic-treatment-ai,.clinic-dx-ai-actions") || button.parentElement;
      parent.insertAdjacentElement("afterend",area);
    }
    area.hidden=false;
    return area;
  }
  function appendValue(parent,key,value,depth=0) {
    if(value==null || value==="" || depth>5)return;
    if(Array.isArray(value)) {
      const list=document.createElement("ul");
      value.forEach(item=>{const li=document.createElement("li");appendValue(li,"",item,depth+1);list.append(li)});
      parent.append(list);return;
    }
    if(typeof value==="object") {
      const wrapper=document.createElement("div");
      wrapper.style.cssText="margin:8px 0;padding:8px;border-left:2px solid #c8dfe0";
      Object.entries(value).forEach(([k,v])=>appendValue(wrapper,k,v,depth+1));
      parent.append(wrapper);return;
    }
    const line=document.createElement("p");
    line.style.cssText="margin:6px 0;white-space:pre-wrap;overflow-wrap:anywhere";
    line.textContent=(key ? key.replace(/_/g," ")+": " : "")+String(value);
    parent.append(line);
  }
  function setMessage(area,message) {
    area.replaceChildren();
    const p=document.createElement("p");
    p.style.cssText="margin:0;white-space:pre-wrap;color:#173A5E";
    p.textContent=message;
    area.append(p);
  }
  async function run(kind,button) {
    const area=outputFor(button,kind);
    let session;
    try{session=JSON.parse(sessionStorage.getItem("dememoria_admin_session")||"null")}catch{}
    if(!session?.access_token){setMessage(area,"Tu sesión clínica no está activa. Vuelve a iniciar sesión.");return;}
    const profile={};
    for(const [key,id] of Object.entries(ids)) {
      if(kind==="diagnostic" && (key==="therapeutic_goals"||key==="treatment_plan"))continue;
      const value=document.getElementById(id)?.value?.trim();
      if(value)profile[key]=value;
    }
    if(Object.values(profile).join(" ").trim().length<80) {
      setMessage(area,"No hay suficiente información clínica en la ficha (mínimo 80 caracteres).");
      return;
    }
    state[kind]=true;button.disabled=true;
    setMessage(area,kind==="diagnostic" ? "Analizando información clínica…" : "Generando objetivos y tratamiento…");
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),60000);
    try {
      const response=await fetch(endpoint[kind],{
        method:"POST",signal:controller.signal,
        headers:{"Authorization":"Bearer "+session.access_token,"Content-Type":"application/json"},
        body:JSON.stringify({profile}),cache:"no-store"
      });
      const data=await response.json().catch(()=>null);
      if(!response.ok)throw new Error(data?.error || "El servidor ha respondido con HTTP "+response.status+".");
      const result=kind==="treatment" ? data?.proposal : data;
      if(!result || typeof result!=="object")throw new Error("El servidor ha devuelto una respuesta sin resultados válidos.");
      area.replaceChildren();
      const heading=document.createElement("strong");
      heading.textContent=kind==="diagnostic"?"Hipótesis diagnósticas para revisión":"Objetivos e intervenciones para revisión";
      area.append(heading);
      appendValue(area,"",result);
      const caution=document.createElement("p");
      caution.textContent="Propuesta no validada: revisa la evidencia, la seguridad y los criterios clínicos. No se ha guardado en el historial.";
      caution.style.cssText="font-size:13px;color:#536e78;margin-top:12px";
      area.append(caution);
    }catch(error) {
      setMessage(area,error?.name==="AbortError"?"Tiempo de espera agotado (60 s). Comprueba el servicio de IA.":(error?.message||"No se ha podido conectar con el servicio."));
    }finally{clearTimeout(timeout);state[kind]=false;button.disabled=false;}
  }
  document.addEventListener("click",event=>{
    const button=event.target instanceof Element ? event.target.closest("button"):null;
    if(!button)return;
    const label=normalize(button.textContent);
    const kind=label==="sugerir diagnostico"?"diagnostic":
      label==="sugerir objetivos y tratamiento"?"treatment":null;
    if(!kind)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(state[kind])return;
    void run(kind,button);
  },true);
})();
