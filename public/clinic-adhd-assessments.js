(() => {
 "use strict";
 const URL="https://grgyvdxkjdstdyumdfyg.supabase.co";
 const REST=URL+"/rest/v1";
 const PUB="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
 const SESSION="dememoria_admin_session";
 const $=(q,root=document)=>root.querySelector(q);
 const labels={
  anamnesis:{title:"Anamnesis clínica y evolutiva",fields:[
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
  funcionamiento:{title:"Funcionamiento e impacto cotidiano",fields:[
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
  diva_registro:{title:"Registro clínico DIVA-5",fields:[
   ["adulto_inatencion","Inatención en adulto: número de criterios 0–9 y evidencia"],["adulto_hi","Hiperactividad/impulsividad en adulto: número de criterios 0–9 y evidencia"],
   ["inicio_antes_12","Evidencia de varios síntomas antes de los 12 años y fuentes"],
   ["curso","Persistencia, contexto y cambios evolutivos"],["contextos","Dos o más contextos y repercusión funcional"],
   ["informantes","Informantes y discrepancias relevantes"],["factores","Explicaciones alternativas y/o comorbilidades"],
   ["observaciones","Referencia al protocolo DIVA-5 original archivado; no transcribir sus ítems"]
  ]},
  diferencial:{title:"Diagnóstico diferencial",fields:[
   ["cronologia","Cronología: síntomas del neurodesarrollo vs. dificultades de inicio reciente"],
   ["ansiedad","Ansiedad: evidencia a favor, en contra y cronología"],["depresion","Depresión: episodios, anhedonia y enlentecimiento"],
   ["bipolaridad","Bipolaridad: hipomanía/manía, episodicidad y sueño"],["sueno","Sueño: insomnio, apnea, turnos y somnolencia"],
   ["trauma","TEPT, trauma y disociación"],["tea","TEA y otras condiciones del neurodesarrollo"],
   ["sustancias","Sustancias, fármacos y efectos cognitivos"],["medicas","Enfermedades médicas, neurológicas y causas adquiridas"],
   ["personalidad","Patrones de personalidad y funcionamiento interpersonal"],
   ["seguridad","Valoración clínica de seguridad y acciones efectuadas, cuando corresponda"],
   ["conclusion","Hipótesis apoyadas, alternativas, incertidumbres, derivaciones y plan de contrastación"]
  ]},
  asrs_registro:{title:"ASRS-v1.1 · registro de cribado",fields:[["puntuacion","Resultado de cribado según instrucciones originales"],["fecha","Fecha, versión y circunstancias"],["interpretacion","Interpretación clínica y limitaciones"]]},
  phq9_registro:{title:"PHQ-9 · registro",fields:[["puntuacion","Puntuación total 0–27"],["fecha","Fecha de administración"],["item9","Respuesta al ítem 9 y valoración clínica realizada si fue positiva"],["interpretacion","Interpretación contextualizada"]]},
  gad7_registro:{title:"GAD-7 · registro",fields:[["puntuacion","Puntuación total 0–21"],["fecha","Fecha de administración"],["interpretacion","Interpretación contextualizada"]]},
  wfirs_registro:{title:"WFIRS-S · registro",fields:[["version","Versión, idioma y condiciones de uso"],["subescalas","Puntuaciones por dominio, si procede"],["interpretacion","Interpretación funcional e información complementaria"]]},
  child_anamnesis:{title:"Anamnesis clínica y evolutiva infantil",fields:[
    ["motivo","Motivo de evaluación, demandas familiares y escolares"],["desarrollo","Gestación, parto, hitos madurativos, lenguaje y desarrollo neurológico"],
    ["inicio","Inicio y evolución de síntomas atencionales, hiperactividad e impulsividad"],
    ["escolaridad","Historia educativa, adaptaciones, informes y rendimiento académico"],
    ["hogar","Rutinas, autonomía, organización y conducta en casa"],["social","Socialización, relaciones y regulación emocional"],
    ["aprendizaje","Lectoescritura, cálculo, dificultades de aprendizaje y lenguaje"],
    ["salud","Salud, sueño, audición, visión, medicación y antecedentes médicos"],
    ["familia","Antecedentes familiares y factores contextuales"],["fuentes","Informantes, documentos y discrepancias entre contextos"]
  ]},
  child_functioning:{title:"Funcionamiento en infancia y adolescencia",fields:[
    ["familia","Impacto en el hogar, convivencia y autonomía"],["escuela","Impacto académico, tareas, comportamiento y apoyos"],
    ["social","Relaciones con iguales y actividades extraescolares"],["regulacion","Regulación emocional y conductual"],
    ["autopercepcion","Autoconcepto, malestar y fortalezas"],["persistencia","Persistencia y repercusión en dos o más contextos"]
  ]},
  family_report:{title:"Información familiar",fields:[
    ["informante","Quién aporta la información y relación"],["sintomas","Ejemplos observados de inatención, hiperactividad e impulsividad"],
    ["funcionamiento","Impacto y frecuencia en domicilio"],["inicio","Historia evolutiva e inicio"],
    ["instrumentos","Cuestionarios originales aplicados y puntuaciones normativas"],
    ["observaciones","Concordancias, divergencias y limitaciones de la fuente"]
  ]},
  school_report:{title:"Información escolar",fields:[
    ["informante","Docente o profesional que informa y curso escolar"],
    ["sintomas","Ejemplos observados en aula y actividades escolares"],
    ["rendimiento","Rendimiento, adaptaciones, asistencia, organización y tareas"],
    ["comparacion","Comparación con iguales y contexto escolar"],
    ["instrumentos","Cuestionarios originales utilizados y resultados"],
    ["observaciones","Concordancias, divergencias y documentos escolares aportados"]
  ]},
  child_differential:{title:"Diagnóstico diferencial infantojuvenil",fields:[
    ["cronologia","Cronología de síntomas y evolución del neurodesarrollo"],
    ["aprendizaje","Trastornos específicos del aprendizaje, lenguaje y discapacidad intelectual"],
    ["tea","TEA, comunicación social, perfiles sensoriales y funciones ejecutivas"],
    ["emocional","Ansiedad, depresión, trauma y regulación emocional"],
    ["sueno","Sueño, fatiga, apnea y otros factores médicos"],
    ["conducta","Trastornos de conducta, oposicionismo y patrones contextuales"],
    ["adolescencia","Cambios puberales, consumo de sustancias y riesgo si procede"],
    ["sintesis","Hipótesis diferenciales, comorbilidades, evidencia pendiente y derivaciones"]
  ]},
  atento_registro:{title:"ATENTO · puntuaciones por informante",fields:[
    ["version","Versión autorizada, idioma, edad y baremos"],
    ["familia","Puntuaciones T/índices informante familiar"],
    ["escuela","Puntuaciones T/índices informante escolar"],
    ["autoinforme","Autoinforme desde los 8 años, si procede"],
    ["concordancia","Comparación entre fuentes, validez e interpretación clínica"]
  ]},
  etdah_registro:{title:"e-TDAH · registro",fields:[["version","Manual, versión, edad y baremos"],["familia","Resultados familiares"],["escuela","Resultados escolares"],["interpretacion","Contextualización e interpretación"]]},
  sena_registro:{title:"SENA · registro",fields:[["version","Nivel y edad, versiones utilizadas"],["familia","Resultados familia"],["escuela","Resultados escuela"],["autoinforme","Autoinforme/entrevista según edad"],["interpretacion","Integración clínica"]]},
  sdq_registro:{title:"SDQ · registro",fields:[["version","Versión, idioma y condiciones de uso"],["familia","Resultados familia"],["escuela","Resultados escuela"],["autoinforme","Autoinforme si corresponde"],["interpretacion","Interpretación y limitaciones"]]}
 };
 let patientId="",assessment=null,forms=[],selection="anamnesis",currentInputs=null,loadNumber=0;
 let patientDob=null,patientAge=null,patientGroup=null;
 const adultForms=["anamnesis","diva_registro","funcionamiento","diferencial","asrs_registro","phq9_registro","gad7_registro","wfirs_registro"];
 const childForms=["child_anamnesis","child_functioning","family_report","school_report","child_differential","atento_registro","etdah_registro","sena_registro","sdq_registro"];
 const visibleForms=()=>assessment?.age_group==="adult"?adultForms:childForms;
 const yearsOld=(iso,reference=new Date())=>{
   if(!/^\d{4}-\d{2}-\d{2}$/.test(String(iso||"")))return null;
   const [y,m,d]=iso.split("-").map(Number);
   const date=new Date(Date.UTC(y,m-1,d));
   if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)return null;
   let age=reference.getFullYear()-y;
   if((reference.getMonth()+1)<m||((reference.getMonth()+1)===m&&reference.getDate()<d))age--;
   return age>=0&&age<=120?age:null;
 };
 const groupFromAge=age=>age===null?null:age<6?"under6":age<=11?"child":age<=17?"adolescent":"adult";
 const groupLabel=group=>({adult:"Adultos",child:"Infantil",adolescent:"Adolescente",under6:"Menores de 6 años"})[group]||"Sin edad";
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
   head.append(h("p","Anamnesis, entrevistas y pruebas en consulta. Abre el PDF original y guarda aquí el registro profesional de resultados."));
   region.append(head);
   list=h("div",undefined,"adhd-assessment-controls");
   status=h("p","","adhd-feedback");status.setAttribute("role","status");
   editor=h("div",undefined,"adhd-editor");
   region.append(list,status,editor);
   region.addEventListener("adhd:open-form",event=>{
     const d=event.detail||{};
     if(!assessment||d.assessmentId!==assessment.id||!visibleForms().includes(d.formKey))return;
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
       Object.assign(assessment,{modality:"expanded",fee_eur:updated.fee_eur,upgrade_budget_acknowledged_at:updated.upgrade_budget_acknowledged_at||null});
       const option=Array.from(list.querySelector("select")?.options||[]).find(o=>o.value===assessment.id);
       if(option)option.textContent=groupLabel(assessment.age_group)+" · Ampliada "+updated.fee_eur+" € · "+new Date(assessment.created_at).toLocaleDateString("es-ES")+" · "+assessment.status;
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
  assessment=null;forms=[];list.replaceChildren();editor.replaceChildren();region.removeAttribute("data-assessment-id");region.removeAttribute("data-assessment-modality");region.removeAttribute("data-assessment-patient-id");region.removeAttribute("data-assessment-age-group");region.removeAttribute("data-assessment-age");msg("Cargando evaluaciones…");
  try{
   const [records,patient]=await Promise.all([
     api("clinical_adhd_assessments?select=id,modality,fee_eur,status,age_group,age_at_assessment,birth_date_at_assessment,created_at,chief_question,evidence_summary,diagnostic_conclusion&patient_id=eq."+encodeURIComponent(patientId)+"&order=created_at.desc&limit=15"),
     api("clinical_patients?select=birth_date&id=eq."+encodeURIComponent(patientId)+"&limit=1")
   ]);
   patientDob=patient?.[0]?.birth_date||null;
   patientAge=yearsOld(patientDob);patientGroup=groupFromAge(patientAge);
   if(revision!==loadNumber)return;
   const panel=h("div",undefined,"adhd-control-row");
   const choice=document.createElement("select");choice.setAttribute("aria-label","Seleccionar evaluación de TDAH");
   panel.append(choice);
   const create=button("Nueva evaluación",()=>newAssessment(),"primary");
   create.disabled=!patientGroup||patientGroup==="under6";
   panel.append(create);
   const details=h("p",patientAge===null?"Indica la fecha de nacimiento en la ficha antes de crear una evaluación.":patientAge<6?"Este protocolo empieza a los 6 años. Utiliza una valoración del neurodesarrollo específica.":groupLabel(patientGroup)+" · "+patientAge+" años · "+(patientGroup==="adult"?"450 € / 600 €":"500 € / 700 €"),"adhd-muted");
   list.append(details);
   list.append(panel);
   if(!records.length){choice.append(new Option("No hay evaluaciones", ""));list.append(h("p","Aún no se ha abierto ninguna valoración de TDAH para esta persona.","adhd-muted"));msg("");return;}
   records.forEach(a=>choice.append(new Option(groupLabel(a.age_group)+" · "+(a.modality==="diagnostic"?"Diagnóstica":"Ampliada")+" "+a.fee_eur+" € · "+new Date(a.created_at).toLocaleDateString("es-ES")+" · "+a.status,a.id)));
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
   ["diagnostic","Evaluación diagnóstica",patientGroup==="adult"?"450 €":"500 €","Protocolo clínico por edad",patientGroup==="adult"?"Anamnesis evolutiva, DIVA-5, funcionamiento y diagnóstico diferencial.":"Entrevista infantojuvenil, datos familiares y escolares, impacto funcional y diagnóstico diferencial. ATENTO y otras escalas solo si están indicadas."],
   ["expanded","Evaluación neuropsicológica ampliada",patientGroup==="adult"?"600 €":"700 €","Más exploración cognitiva por dominios","Incluye el circuito diagnóstico e incorpora pruebas estandarizadas adecuadas a la edad y pregunta clínica."]
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
    if(!patientId||!/^[0-9a-f-]{36}$/i.test(patientId)||!patientGroup||patientGroup==="under6"){
      msg("Necesitas una fecha de nacimiento válida y un paciente de 6 años o más.",true);return;
    }
    create.disabled=true;
    try{
      const rows=await api("clinical_adhd_assessments",{
        method:"POST",headers:{Prefer:"return=representation"},
        body:JSON.stringify({patient_id:patientId,modality:selected,fee_eur:selected==="diagnostic"?(patientGroup==="adult"?450:500):(patientGroup==="adult"?600:700)})
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
   region.dataset.assessmentAgeGroup=assessment.age_group||"adult";
   region.dataset.assessmentAge=assessment.age_at_assessment??"";
   region.dataset.assessmentBirthDate=assessment.birth_date_at_assessment||"";
   region.dispatchEvent(new Event("adhd:assessment",{bubbles:true}));
   const top=h("div",undefined,"adhd-case-top");
   const info=h("div");
   info.append(h("strong",groupLabel(assessment.age_group)+" · "+(assessment.modality==="diagnostic"?"Evaluación diagnóstica":"Evaluación neuropsicológica ampliada")+" · "+assessment.fee_eur+" €"),
     h("small",(assessment.age_at_assessment!==null?assessment.age_at_assessment+" años al iniciar la evaluación. ":"")+"Solo la profesional valida los resultados y las conclusiones."));
   const sel=document.createElement("select");sel.setAttribute("aria-label","Estado de la evaluación");
   ["in_progress","review","completed","cancelled"].forEach(s=>sel.append(new Option(({in_progress:"En curso",review:"En revisión",completed:"Finalizada",cancelled:"Cancelada"})[s],s)));
   sel.value=assessment.status;
   sel.onchange=async()=>{try{await api("clinical_adhd_assessments?id=eq."+assessment.id,{method:"PATCH",body:JSON.stringify({status:sel.value,updated_at:new Date().toISOString(),...(sel.value==="completed"?{clinical_review_at:new Date().toISOString()}: {})})});assessment.status=sel.value;msg("Estado actualizado.");paint()}catch(e){msg(e.message,true)}};
   top.append(info,sel);editor.append(top);
   const nav=h("div",undefined,"adhd-form-nav");
   if(!visibleForms().includes(selection))selection=visibleForms()[0];
   for(const key of visibleForms()){
     const meta=labels[key];
     const f=optionForm(key);
     const b=button(meta.title+(f?" · "+({draft:"Borrador",sent:"Enviado",in_progress:"En curso",submitted:"Recibido",reviewed:"Revisado",revoked:"Revocado"}[f.status]||f.status):""),()=>{selection=key;paint()},selection===key?"selected":"light");
     nav.append(b);
   }
   editor.append(nav);
   const meta=labels[selection];const form=optionForm(selection);
   const sheet=h("div",undefined,"adhd-sheet");
   const titlebar=h("div",undefined,"adhd-test-titlebar");
   titlebar.append(h("h4",meta.title));
   const testPdfKey={diva_registro:"diva5",asrs_registro:"asrs",phq9_registro:"phq9",gad7_registro:"gad7",wfirs_registro:"wfirs",
    atento_registro:"atento",etdah_registro:"etdah",sena_registro:"sena",sdq_registro:"sdq"}[selection];
   if(testPdfKey){
     titlebar.append(button("Abrir PDF original / imprimir",()=>{
       region.dispatchEvent(new CustomEvent("adhd:pdf-open-request",{
         bubbles:true,detail:{assessmentId:assessment.id,testKey:testPdfKey}
       }));
     },"secondary"));
   }
   sheet.append(titlebar);
   if(testPdfKey)sheet.append(h("p","Consulta el instrumento original y registra sus resultados a continuación. Se guardarán en la historia de esta evaluación.","adhd-help"));
   sheet.append(h("p","Aplicación exclusivamente presencial. Registra aquí tus observaciones y resultados; para los test utiliza siempre la copia original autorizada.","adhd-help"));
   const readOnly=form&&(form.status==="submitted"||form.status==="reviewed");
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
    const f=await ensureForm(key);if(f.status==="submitted"||f.status==="reviewed")throw Error("Este formulario está cerrado. Crea una evaluación nueva si necesitas repetirlo.");
    const rows=await api("clinical_adhd_forms?id=eq."+f.id,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({answers,completed_by:"clinician",delivery_mode:"in_session",status:state,updated_at:new Date().toISOString(),...(state==="reviewed"?{reviewed_at:new Date().toISOString()}: {})})});
    Object.assign(f,rows[0]||{});paint();msg(state==="reviewed"?"Formulario registrado como revisado.":"Borrador guardado.");
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