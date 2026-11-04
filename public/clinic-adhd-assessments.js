(() => {
 "use strict";
 const URL="https://grgyvdxkjdstdyumdfyg.supabase.co";
 const REST=URL+"/rest/v1";
 const API=URL+"/functions/v1/adhd-clinical-forms";
 const PUB="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
 const SESSION="dememoria_admin_session";
 const $=(q,root=document)=>root.querySelector(q);
 const labels={
  anamnesis:{title:"Anamnesis clínica y evolutiva",remote:true,fields:[
   ["motivo","Motivo de consulta y expectativas"],["inicio_actual","Inicio, curso y fluctuaciones de las dificultades actuales"],
   ["infancia","Hitos del desarrollo, regulación conductual, contexto familiar y primeros recuerdos"],["escuela","Primaria: aprendizaje, comportamiento y observaciones del profesorado"],
   ["adolescencia","Adolescencia: autonomía, rendimiento, organización, relaciones y conducta"],
   ["universidad","Estudios posteriores y trayectoria formativa"],["trabajo","Trayectoria laboral, estabilidad y dificultades actuales"],
   ["organizacion","Planificación, tiempo, tareas domésticas y gestión de obligaciones"],
   ["relaciones","Relaciones familiares, de pareja y sociales"],["estrategias","Estrategias compensatorias y coste de mantener el rendimiento"],
   ["sueno","Sueño, turnos, somnolencia y fatiga"],["salud","Antecedentes médicos, neurológicos, traumatismos y otros factores"],
   ["medicacion","Tratamientos actuales y previos"],["consumos","Consumo de alcohol, cannabis y otras sustancias (si corresponde)"],
   ["antecedentes","Antecedentes psicológicos, psiquiátricos y familiares"],
   ["informantes","Informantes y documentación disponible: infancia y actualidad"],["otros","Observaciones adicionales"]
  ]},
  funcionamiento:{title:"Funcionamiento e impacto cotidiano",remote:true,fields:[
   ["trabajo_estudio","Dificultades objetivas en trabajo o estudios y sus consecuencias"],
   ["hogar","Gestión doméstica, autocuidado y obligaciones"],
   ["economia","Organización económica, olvidos, pagos y gastos"],
   ["tiempo","Gestión del tiempo, citas, puntualidad y priorización"],
   ["relaciones","Repercusión en relaciones y comunicación"],
   ["familia","Repercusión en convivencia y responsabilidades familiares"],
   ["ocio","Actividades de ocio, descanso y aficiones"],
   ["autoconcepto","Autoimagen, frustración y experiencias acumuladas"],
   ["compensaciones","Apoyos externos, sobreesfuerzo y compensaciones"],
   ["interferencia","Ámbitos afectados, frecuencia y gravedad percibida"],
   ["ejemplos","Ejemplos concretos verificables y evolución"]
  ]},
  diva_registro:{title:"Registro clínico DIVA-5",remote:false,fields:[
   ["adulto_inatencion","Inatención en adulto: número de criterios 0–9 y evidencia"],["adulto_hi","Hiperactividad/impulsividad en adulto: número de criterios 0–9 y evidencia"],
   ["inicio_antes_12","Evidencia de varios síntomas antes de los 12 años y fuentes"],
   ["curso","Persistencia, contexto y cambios evolutivos"],["contextos","Dos o más contextos y repercusión funcional"],
   ["informantes","Informantes y discrepancias relevantes"],["factores","Explicaciones alternativas y/o comorbilidades"],
   ["observaciones","Referencia al protocolo DIVA-5 original archivado; no transcribir sus ítems"]
  ]},
  diferencial:{title:"Diagnóstico diferencial",remote:false,fields:[
   ["cronologia","Cronología: síntomas del neurodesarrollo vs. dificultades de inicio reciente"],
   ["ansiedad","Ansiedad: evidencia a favor, en contra y cronología"],["depresion","Depresión: episodios, anhedonia y enlentecimiento"],
   ["bipolaridad","Bipolaridad: hipomanía/manía, episodicidad y sueño"],["sueno","Sueño: insomnio, apnea, turnos y somnolencia"],
   ["trauma","TEPT, trauma y disociación"],["tea","TEA y otras condiciones del neurodesarrollo"],
   ["sustancias","Sustancias, fármacos y efectos cognitivos"],["medicas","Enfermedades médicas, neurológicas y causas adquiridas"],
   ["personalidad","Patrones de personalidad y funcionamiento interpersonal"],
   ["seguridad","Valoración clínica de seguridad y acciones efectuadas, cuando corresponda"],
   ["conclusion","Hipótesis apoyadas, alternativas, incertidumbres, derivaciones y plan de contrastación"]
  ]},
  asrs_registro:{title:"ASRS-v1.1 · registro de cribado",remote:false,fields:[["puntuacion","Resultado de cribado según instrucciones originales"],["fecha","Fecha, versión y circunstancias"],["interpretacion","Interpretación clínica y limitaciones"]]},
  phq9_registro:{title:"PHQ-9 · registro",remote:false,fields:[["puntuacion","Puntuación total 0–27"],["fecha","Fecha de administración"],["item9","Respuesta al ítem 9 y valoración clínica realizada si fue positiva"],["interpretacion","Interpretación contextualizada"]]},
  gad7_registro:{title:"GAD-7 · registro",remote:false,fields:[["puntuacion","Puntuación total 0–21"],["fecha","Fecha de administración"],["interpretacion","Interpretación contextualizada"]]},
  wfirs_registro:{title:"WFIRS-S · registro",remote:false,fields:[["version","Versión, idioma y condiciones de uso"],["subescalas","Puntuaciones por dominio, si procede"],["interpretacion","Interpretación funcional e información complementaria"]]}
 };
 let patientId="",assessment=null,forms=[],selection="anamnesis",currentInputs=null,loadNumber=0;
 let region=null,status=null,list=null,editor=null;
 const auth=()=>{try{return JSON.parse(sessionStorage.getItem(SESSION)||"null")?.access_token||""}catch{return ""}};
 const headers=(extra={})=>({apikey:PUB,Authorization:"Bearer "+auth(),"Content-Type":"application/json",...extra});
 async function api(path,options={}){
  if(!auth())throw Error("Inicia sesión de nuevo.");
  const r=await fetch(REST+"/"+path,{cache:"no-store",...options,headers:{...headers(),...(options.headers||{})}});
  if(!r.ok)throw Error("No se pudo consultar o guardar la evaluación ("+r.status+").");
  const text=await r.text();return text?JSON.parse(text):null;
 }
 function msg(text,fail=false){status.textContent=text;status.classList.toggle("adhd-error",fail)}
 function optionForm(k){return forms.find(f=>f.form_key===k)}
 function h(tag,text,cl){const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cl)x.className=cl;return x}
 function button(text,callback,kind="secondary"){const b=h("button",text,"adhd-btn "+kind);b.type="button";b.addEventListener("click",callback);return b}
 function init(){
  const d=$("#clinic-patient-dialog");if(!d)return;
  const tryAttach=()=>{
   const slot=$("#clinic-panel-evaluacion"); if(!slot||$("#adhd-assessment-module"))return;
   region=h("section",undefined,"adhd-module");region.id="adhd-assessment-module";
   const head=h("div",undefined,"adhd-head");head.append(h("div","EVALUACIONES · TDAH ADULTO","adhd-eyebrow"),h("h3","Proceso de evaluación"));
   head.append(h("p","Anamnesis, entrevista clínica y diagnóstico diferencial. Formularios en consulta o enviados con acceso verificado."));
   region.append(head);
   list=h("div",undefined,"adhd-assessment-controls");
   status=h("p","","adhd-feedback");status.setAttribute("role","status");
   editor=h("div",undefined,"adhd-editor");
   region.append(list,status,editor);
   region.addEventListener("adhd:open-form",event=>{
     const d=event.detail||{};
     if(!assessment||d.assessmentId!==assessment.id||!labels[d.formKey])return;
     selection=d.formKey;paint();
     editor.querySelector(".adhd-sheet")?.scrollIntoView({behavior:"smooth",block:"nearest"});
   });
   region.addEventListener("adhd:upgrade-request",async event=>{
     const d=event.detail||{};
     if(!assessment||assessment.id!==d.assessmentId||assessment.modality!=="diagnostic")return;
     if(assessment.status==="completed"||assessment.status==="cancelled"){msg("No se puede cambiar una evaluación cerrada.",true);return;}
     if(d.accepted!==true||typeof d.indication!=="string"||d.indication.trim().length<8){msg("Falta la aceptación presupuestaria o la justificación clínica.",true);return;}
     try{
       msg("Actualizando modalidad…");
       const updated=await api("rpc/upgrade_adhd_assessment",{
         method:"POST",
         body:JSON.stringify({p_assessment_id:assessment.id,p_budget_accepted:true,p_clinical_indication:d.indication.trim()})
       });
       if(!updated||updated.modality!=="expanded")throw Error("No se confirmó la ampliación.");
       Object.assign(assessment,{modality:"expanded",fee_eur:600,upgrade_budget_acknowledged_at:updated.upgrade_budget_acknowledged_at||null});
       const option=Array.from(list.querySelector("select")?.options||[]).find(o=>o.value===assessment.id);
       if(option)option.textContent="Ampliada 600 € · "+new Date(assessment.created_at).toLocaleDateString("es-ES")+" · "+assessment.status;
       paint();
       msg("Ampliación registrada. Puedes planificar las pruebas complementarias. Revisa y archiva el presupuesto aceptado en la historia.");
     }catch(error){msg(error.message||"No se pudo actualizar la modalidad.",true);}
   });
   slot.append(region);
  };
  tryAttach();
  new MutationObserver(()=>{tryAttach();if(!d.hidden){const next=$("#clinic-patient-id")?.value||"";if(next&&next!==patientId){patientId=next;loadPatient();}}}).observe(d,{attributes:true,attributeFilter:["hidden"]});
  $("#clinic-patient-close")?.addEventListener("click",()=>{loadNumber++;patientId="";assessment=null;forms=[]; if(editor)editor.replaceChildren();});
 }
 async function loadPatient(){
  const revision=++loadNumber;if(!region)return;
  assessment=null;forms=[];list.replaceChildren();editor.replaceChildren();region.removeAttribute("data-assessment-id");region.removeAttribute("data-assessment-modality");region.removeAttribute("data-assessment-patient-id");msg("Cargando evaluaciones…");
  try{
   const records=await api("clinical_adhd_assessments?select=id,modality,fee_eur,status,created_at,chief_question,evidence_summary,diagnostic_conclusion&patient_id=eq."+encodeURIComponent(patientId)+"&order=created_at.desc&limit=15");
   if(revision!==loadNumber)return;
   const panel=h("div",undefined,"adhd-control-row");
   const choice=document.createElement("select");choice.setAttribute("aria-label","Seleccionar evaluación de TDAH");
   panel.append(choice);
   const create=button("Nueva evaluación",()=>newAssessment(),"primary");panel.append(create);
   list.append(panel);
   if(!records.length){choice.append(new Option("No hay evaluaciones", ""));list.append(h("p","Aún no se ha abierto ninguna valoración de TDAH para esta persona.","adhd-muted"));msg("");return;}
   records.forEach((a,i)=>choice.append(new Option((a.modality==="diagnostic"?"Diagnóstica 450 €":"Ampliada 600 €")+" · "+new Date(a.created_at).toLocaleDateString("es-ES")+" · "+a.status,a.id)));
   choice.onchange=()=>openAssessment(records.find(a=>a.id===choice.value));
   await openAssessment(records[0]);
  }catch(e){msg(e.message||"No se pudo cargar.",true)}
 }
 async function newAssessment(){
  const existing=list.querySelector(".adhd-new-evaluation");
  if(existing){existing.remove();return;}
  const box=h("section",undefined,"adhd-new-evaluation");
  const heading=h("div",undefined,"adhd-new-evaluation-head");
  heading.append(h("h4","Seleccionar modalidad de evaluación"),h("p","El protocolo guía la elección de instrumentos, pero la indicación y las conclusiones son clínicas."));
  box.append(heading);
  const options=h("div",undefined,"adhd-mode-options");
  const descriptions=[
   ["diagnostic","Evaluación diagnóstica","450 €","5–6 horas estimadas","Entrevista evolutiva, DIVA-5, funcionamiento, síntomas y diagnóstico diferencial. Pruebas cognitivas solo si están indicadas y se acuerda la ampliación."],
   ["expanded","Evaluación neuropsicológica ampliada","600 €","10 horas estimadas","Incluye todo lo anterior y permite planificar pruebas de atención, funciones ejecutivas, memoria y otros dominios en función de la pregunta clínica."]
  ];
  let selected="diagnostic";
  const radios=[];
  for(const [value,title,price,hours,description] of descriptions){
    const label=h("label",undefined,"adhd-mode-option");
    const input=document.createElement("input");
    input.type="radio";input.name="adhd-modality-choice";input.value=value;
    input.checked=value===selected;
    input.addEventListener("change",()=>{if(input.checked)selected=value;});
    const content=h("span",undefined,"adhd-mode-option-copy");
    const line=h("span",undefined,"adhd-mode-option-line");
    line.append(h("strong",title),h("b",price));
    content.append(line,h("small",hours),h("span",description));
    label.append(input,content);options.append(label);radios.push(input);
  }
  box.append(options);
  const actions=h("div",undefined,"adhd-actions");
  const create=button("Crear evaluación",async()=>{
    if(!patientId||!/^[0-9a-f-]{36}$/i.test(patientId)){msg("Selecciona una ficha de paciente válida.",true);return;}
    create.disabled=true;
    try{
      const rows=await api("clinical_adhd_assessments",{
        method:"POST",headers:{Prefer:"return=representation"},
        body:JSON.stringify({patient_id:patientId,modality:selected,fee_eur:selected==="diagnostic"?450:600})
      });
      if(!rows?.[0])throw Error("No se pudo crear la evaluación.");
      await loadPatient();
      msg("Evaluación creada. La guía muestra los instrumentos indicados y cuáles son opcionales.");
    }catch(e){msg(e.message||"No se pudo crear.",true);create.disabled=false;}
  },"primary");
  actions.append(create,button("Cancelar",()=>box.remove(),"secondary"));
  box.append(actions);
  list.append(box);
 }
 async function openAssessment(record){
  if(!record)return;
  const revision=++loadNumber;assessment=record;editor.replaceChildren();msg("Cargando formularios…");
  try{
    forms=await api("clinical_adhd_forms?select=*&assessment_id=eq."+record.id+"&order=created_at.asc");
    if(revision!==loadNumber)return;
    paint();
    msg("");
  }catch(e){msg(e.message,true)}
 }
 function paint(){
   editor.replaceChildren();
   if(!assessment)return;
   region.dataset.assessmentId=assessment.id;
   region.dataset.assessmentModality=assessment.modality;
   region.dataset.assessmentPatientId=patientId;
   region.dispatchEvent(new Event("adhd:assessment",{bubbles:true}));
   const top=h("div",undefined,"adhd-case-top");
   const info=h("div");info.append(h("strong",assessment.modality==="diagnostic"?"Evaluación diagnóstica · 450 €":"Evaluación neuropsicológica ampliada · 600 €"),h("small","Paciente vinculado a la historia clínica. Solo la profesional decide la conclusión diagnóstica."));
   const sel=document.createElement("select");sel.setAttribute("aria-label","Estado de la evaluación");
   ["in_progress","review","completed","cancelled"].forEach(s=>sel.append(new Option(({in_progress:"En curso",review:"En revisión",completed:"Finalizada",cancelled:"Cancelada"})[s],s)));
   sel.value=assessment.status;
   sel.onchange=async()=>{try{await api("clinical_adhd_assessments?id=eq."+assessment.id,{method:"PATCH",body:JSON.stringify({status:sel.value,updated_at:new Date().toISOString(),...(sel.value==="completed"?{clinical_review_at:new Date().toISOString()}: {})})});assessment.status=sel.value;msg("Estado actualizado.");paint()}catch(e){msg(e.message,true)}};
   top.append(info,sel);editor.append(top);
   const nav=h("div",undefined,"adhd-form-nav");
   for(const [key,meta] of Object.entries(labels)){
     const f=optionForm(key);
     const b=button(meta.title+(f?" · "+({draft:"Borrador",sent:"Enviado",in_progress:"En curso",submitted:"Recibido",reviewed:"Revisado",revoked:"Revocado"}[f.status]||f.status):""),()=>{selection=key;paint()},selection===key?"selected":"light");
     nav.append(b);
   }
   editor.append(nav);
   const meta=labels[selection];const form=optionForm(selection);
   const sheet=h("div",undefined,"adhd-sheet");
   sheet.append(h("h4",meta.title));
   if(meta.remote){
     const actions=h("div",undefined,"adhd-delivery");
     actions.append(button("Hacer en consulta",()=>switchToClinic(selection),form?.delivery_mode==="in_session"?"selected":"secondary"),
      button("Enviar al paciente",()=>sendForm(selection),"secondary"));
     sheet.append(actions);
     sheet.append(h("p","Ambas opciones utilizan el mismo expediente. El enlace enviado exige verificación por correo y no contiene resultados clínicos.","adhd-help"));
   }else sheet.append(h("p","Registro profesional: no se reproducen ítems protegidos de pruebas comerciales.","adhd-help"));
   if(form?.delivery_mode==="remote"&&["sent","in_progress"].includes(form.status)){
     sheet.append(h("p","Formulario enviado. La persona puede cumplimentarlo desde casa. Si lo pasas a consulta, se invalidará el acceso remoto.","adhd-remote-note"));
   }
   const readOnly=form&&(form.status==="submitted"||form.status==="reviewed"||(form.delivery_mode==="remote"&&["sent","in_progress"].includes(form.status)));
   const fields=h("div",undefined,"adhd-fields");const values=form?.answers||{};
   meta.fields.forEach(([k,title])=>{
     const label=h("label",title);const area=document.createElement("textarea");area.rows=3;area.dataset.adhdField=k;area.value=typeof values[k]==="string"?values[k]:"";area.maxLength=4000;area.disabled=Boolean(readOnly);area.placeholder="Escribe aquí la información clínica relevante…";
     label.append(area);fields.append(label);
   });
   sheet.append(fields);
   const footer=h("div",undefined,"adhd-actions");
   if(!readOnly){
    footer.append(button("Guardar borrador",()=>saveCurrent("in_progress"),"primary"));
    footer.append(button("Marcar revisado",()=>saveCurrent("reviewed"),"secondary"));
   }else if(form?.status==="submitted"){
    sheet.append(h("p","Respuestas del paciente recibidas. Son de solo lectura; la revisión profesional se documenta por separado.","adhd-remote-note"));
    const note=h("label","Observaciones de revisión profesional");
    const input=document.createElement("textarea");input.id="adhd-review-note";input.rows=3;input.value=form.clinician_notes||"";note.append(input);sheet.append(note);
    footer.append(button("Validar revisión clínica",()=>reviewForm(form,input.value),"primary"));
   }else if(form?.status==="reviewed"){
    sheet.append(h("p","Formulario revisado. Si necesitas rectificar una respuesta, documenta la corrección en un nuevo registro clínico, sin modificar el original.","adhd-remote-note"));
   }
   sheet.append(footer);editor.append(sheet);currentInputs=fields;
 }
 async function ensureForm(key){
   let f=optionForm(key);if(f)return f;
   const rows=await api("clinical_adhd_forms",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({patient_id:patientId,assessment_id:assessment.id,form_key:key,delivery_mode:"in_session",status:"draft"})});
   if(!rows?.[0])throw Error("No se pudo crear el formulario.");
   forms.push(rows[0]);return rows[0];
 }
 function valuesFromForm(){const v={};currentInputs?.querySelectorAll("[data-adhd-field]").forEach(t=>v[t.dataset.adhdField]=t.value.trim());return v}
 async function saveCurrent(state){
  if(!assessment)return;
  const key=selection;const answers=valuesFromForm();msg("Guardando…");
  try{
    const f=await ensureForm(key);if(f.status==="submitted"||f.status==="reviewed"||f.delivery_mode==="remote")throw Error("Este formulario está protegido. Revísalo o cambia a modo consulta.");
    const rows=await api("clinical_adhd_forms?id=eq."+f.id,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({answers,completed_by:"clinician",delivery_mode:"in_session",status:state,updated_at:new Date().toISOString(),...(state==="reviewed"?{reviewed_at:new Date().toISOString()}: {})})});
    Object.assign(f,rows[0]||{});paint();msg(state==="reviewed"?"Formulario registrado como revisado.":"Borrador guardado.");
  }catch(e){msg(e.message,true)}
 }
 async function switchToClinic(key){
  if(!assessment)return;
  const f=optionForm(key);
  if(f?.status==="submitted"||f?.status==="reviewed"){msg("Las respuestas finalizadas son inmutables. Crea una nueva evaluación si necesitas volver a administrarlo.",true);return;}
  if(f?.delivery_mode==="remote"&&!confirm("¿Cambiar a consulta? El enlace anterior dejará de funcionar."))return;
  try{
   const row=await ensureForm(key);
   const rows=await api("clinical_adhd_forms?id=eq."+row.id,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({delivery_mode:"in_session",status:"in_progress",access_token_hash:null,access_expires_at:null,otp_hash:null,otp_expires_at:null,remote_session_hash:null,remote_session_expires_at:null,updated_at:new Date().toISOString()})});
   Object.assign(row,rows[0]||{});selection=key;paint();msg("Modo consulta activado.");
  }catch(e){msg(e.message,true)}
 }
 async function sendForm(key){
  if(!assessment)return;
  const f=optionForm(key);
  if(f?.status==="submitted"||f?.status==="reviewed"){msg("Ya se ha recibido y/o revisado. No se puede sobrescribir.",true);return;}
  if(!confirm("Se enviará una invitación al correo de la ficha y el paciente podrá responder con verificación de acceso. ¿Continuar?"))return;
  try{
   const row=await ensureForm(key);
   const r=await fetch(API,{method:"POST",headers:headers(),body:JSON.stringify({action:"send",form_id:row.id})});
   const body=await r.json().catch(()=>({}));
   if(!r.ok)throw Error(body.error||"No se pudo enviar.");
   const refreshed=await api("clinical_adhd_forms?select=*&id=eq."+row.id);
   Object.assign(row,refreshed[0]||{});paint();msg(body.message||"Invitación enviada.");
  }catch(e){msg(e.message,true)}
 }
 async function reviewForm(f,note){
   try{
    const rows=await api("clinical_adhd_forms?id=eq."+f.id,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({clinician_notes:note,status:"reviewed",reviewed_at:new Date().toISOString(),updated_at:new Date().toISOString()})});
    Object.assign(f,rows[0]||{});paint();msg("Respuestas revisadas y registradas.");
   }catch(e){msg(e.message,true)}
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();