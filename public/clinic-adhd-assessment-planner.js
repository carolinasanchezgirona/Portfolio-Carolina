(() => {
  "use strict";
  const BASE="https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1";
  const PUB="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION="dememoria_admin_session";
  const UID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const $=(selector,scope=document)=>scope.querySelector(selector);
  const node=(tag,text,cls)=>{
    const n=document.createElement(tag);
    if(text!==undefined&&text!==null)n.textContent=text;
    if(cls)n.className=cls;
    return n;
  };
  const button=(text,callback,cls="")=>{
    const el=node("button",text,"adhd-plan-btn "+cls);el.type="button";el.addEventListener("click",callback);return el;
  };
  const core=[
    ["anamnesis","Anamnesis clínica y evolutiva","Núcleo","Historia del desarrollo, cronología, compensaciones e informantes."],
    ["diva_registro","DIVA-5","Núcleo","Entrevista estructurada original: síntomas actuales e infantiles y criterios clínicos."],
    ["funcionamiento","Repercusión funcional","Núcleo","Impacto en diferentes contextos, ejemplos concretos y apoyos compensatorios."],
    ["diferencial","Diagnóstico diferencial","Núcleo","Comorbilidades, diagnóstico alternativo, sueño, sustancias y factores médicos."],
    ["asrs_registro","ASRS-v1.1","Cribado complementario","Escala de cribado. Nunca confirma ni descarta el diagnóstico por sí sola."],
    ["phq9_registro","PHQ-9","Según sospecha","Sintomatología depresiva; si ítem 9 positivo, valoración clínica de seguridad."],
    ["gad7_registro","GAD-7","Según sospecha","Sintomatología ansiosa y posible interferencia cognitiva."],
    ["wfirs_registro","WFIRS-S","Según disponibilidad y adecuación","Medida funcional opcional; verificar versión lingüística y licencia."],
  ];
  const pediatricCore=[
    ["child_anamnesis","Anamnesis evolutiva","Núcleo","Desarrollo, inicio, escolarización y evolución."],
    ["child_functioning","Repercusión funcional","Núcleo","Autonomía, escuela, hogar y relaciones."],
    ["family_report","Información familiar","Núcleo","Entrevista familiar y ejemplos en domicilio."],
    ["school_report","Información escolar","Núcleo","Observaciones del profesorado y documentos del centro."],
    ["child_differential","Diagnóstico diferencial","Núcleo","TEA, aprendizaje, ansiedad, sueño y otros factores."],
    ["atento_registro","ATENTO","Complementario","Familia y escuela. Autoinforme a partir de 8 años, si procede."],
    ["etdah_registro","e-TDAH","Alternativa escolar","Alternativa según disponibilidad y edad (6–12 años)."],
    ["sena_registro","SENA","Según indicación","Síntomas emocionales y conductuales, con distintos informantes."],
    ["sdq_registro","SDQ","Complementario","Registro de resultados de versión autorizada."]
  ];
  const pediatricNeuro=[
    {key:"d2r",name:"d2-R",min:6,max:17,when:"Atención selectiva",reasons:["selective"],note:"Baremos por tramo de edad."},
    {key:"carasr",name:"CARAS-R",min:6,max:17,when:"Atención perceptiva",reasons:["selective"],note:"Opcional; evita redundancia sin motivo clínico."},
    {key:"fdt",name:"FDT",min:7,max:17,when:"Inhibición/alternancia",reasons:["inhibition"],note:"A partir de 7 años. No disponible a los 6."},
    {key:"enfen",name:"ENFEN",min:6,max:12,when:"Funciones ejecutivas",reasons:["planning","inhibition"],note:"Exclusivo de 6 a 12 años."},
    {key:"taveci",name:"TAVECI",min:6,max:16,when:"Aprendizaje y memoria verbal",reasons:["memory"],note:"Alternativa infantojuvenil por indicación."},
    {key:"tavec",name:"TAVEC",min:16,max:17,when:"Memoria verbal",reasons:["memory"],note:"Solo 16–17 años, según madurez y manual."},
    {key:"working_memory",name:"Memoria de trabajo",min:6,max:17,when:"Memoria de trabajo",reasons:["working"],note:"Instrumento y baremo específico de edad."},
    {key:"other",name:"Otra prueba",min:6,max:17,when:"Otros dominios",reasons:["other"],note:"Solo si existe una pregunta clínica específica."}
  ];
  const indications=[
    ["selective","Atención selectiva y precisión"],
    ["inhibition","Inhibición y flexibilidad cognitiva"],
    ["memory","Quejas de aprendizaje o memoria verbal"],
    ["working","Memoria de trabajo"],
    ["sustained","Vigilancia o atención sostenida"],
    ["planning","Planificación / alternancia visomotora"],
    ["other","Otra pregunta neuropsicológica específica"]
  ];
  const neuro=[
    {key:"d2r",name:"d2-R",when:"Atención selectiva, precisión y velocidad de respuesta.",reasons:["selective"],note:"Priorizar cuando la pregunta clínica requiera explorar rendimiento en una tarea de cancelación."},
    {key:"fdt",name:"FDT",when:"Inhibición, interferencia, velocidad y alternancia.",reasons:["inhibition"],note:"Puede aportar índices ejecutivos; rendimiento alterado no es específico de TDAH."},
    {key:"tavec",name:"TAVEC",when:"Aprendizaje y memoria episódica verbal.",reasons:["memory"],note:"Considerar si existen dificultades mnésicas relevantes que requieren estudio diferencial."},
    {key:"working_memory",name:"Memoria de trabajo",when:"Mantenimiento y manipulación de información.",reasons:["working"],note:"Selecciona después el instrumento y edición autorizados disponibles."},
    {key:"cpt3",name:"CPT-3",when:"Vigilancia y control de respuesta a lo largo del tiempo.",reasons:["sustained"],note:"Complementario, no requisito ni prueba de confirmación diagnóstica."},
    {key:"tesen",name:"TESEN",when:"Planificación y flexibilidad visomotora.",reasons:["planning"],note:"Solo si hay pregunta clínica y baremos pertinentes."},
    {key:"tmt",name:"TMT A/B",when:"Velocidad y alternancia atencional.",reasons:["planning","inhibition"],note:"Emplear una edición apropiada con normas identificables."},
    {key:"other",name:"Otra prueba",when:"Otra pregunta clínica no cubierta por la selección.",reasons:["other"],note:"Registrar indicación, versión y baremos. No generar un protocolo fijo por defecto."}
  ];
  const statusLabels={
    draft:"Borrador",sent:"Enviado",in_progress:"En curso",submitted:"Recibido",
    reviewed:"Revisado",revoked:"Revocado",
    planned:"Planificada",administered:"Administrada"
  };
  let root=null,host=null,content=null;
  let currentId="",currentMode="",currentGroup="adult",currentAge=null,patientId="",status="",savedIndications=[],forms=[],tests=[],generation=0;
  const auth=()=>{try{return JSON.parse(sessionStorage.getItem(SESSION)||"null")?.access_token||""}catch{return ""}};
  async function api(path,{method="GET",data=null,returnRows=false}={}){
    if(!auth())throw Error("Inicia sesión de nuevo en Gestión Clínica.");
    const r=await fetch(BASE+"/"+path,{method,cache:"no-store",headers:{
      apikey:PUB,Authorization:"Bearer "+auth(),"Content-Type":"application/json",
      ...(returnRows?{Prefer:"return=representation"}:{})
    },...(data===null?{}:{body:JSON.stringify(data)})});
    if(!r.ok)throw Error("No se ha podido consultar o guardar el plan ("+r.status+").");
    const raw=await r.text();return raw?JSON.parse(raw):null;
  }
  function attach(){
    const parent=$("#adhd-assessment-module");
    if(!parent||root===parent)return;
    root=parent;
    host=node("section",undefined,"adhd-test-planner");
    host.id="adhd-test-planner";
    host.hidden=true;
    const head=node("div",undefined,"adhd-plan-heading");
    head.append(node("p","GUÍA DE PRUEBAS · APOYO A LA DECISIÓN CLÍNICA","adhd-plan-eyebrow"),node("h3","¿Qué instrumentos aplicar?"),
      node("p","La modalidad orienta el circuito. La elección final de cada instrumento depende de la pregunta clínica y de su utilidad para el diagnóstico diferencial."));
    content=node("div",undefined,"adhd-plan-content");
    host.append(head,content);
    const target=$(".adhd-editor",parent);
    if(target)parent.insertBefore(host,target);
    else parent.append(host);
    root.addEventListener("adhd:assessment",()=>sync(true));
    root.addEventListener("adhd:neuro-updated",()=>sync(true));
    new MutationObserver(()=>sync(false)).observe(root,{attributes:true,attributeFilter:["data-assessment-id","data-assessment-modality","data-assessment-patient-id"]});
    sync(true);
  }
  function sync(refresh=false){
    if(!root||!host)return;
    const id=root.dataset.assessmentId||"";
    const mode=root.dataset.assessmentModality||"";
    const p=root.dataset.assessmentPatientId||"";
    if(!UID.test(id)||!UID.test(p)||!["expanded","diagnostic"].includes(mode)){
      currentId="";patientId="";currentMode="";host.hidden=true;content.replaceChildren();generation++;return;
    }
    const changed=id!==currentId||mode!==currentMode||p!==patientId;
    if(!refresh&&!changed)return;
    currentId=id;currentMode=mode;patientId=p;host.hidden=false;
    load();
  }
  async function load(){
    const now=++generation,id=currentId;
    content.replaceChildren(node("p","Actualizando el plan…","adhd-plan-message"));
    try{
      const [a,f,t]=await Promise.all([
        api("clinical_adhd_assessments?select=id,modality,status,age_group,age_at_assessment,fee_eur,neuro_selection_indications,upgrade_budget_acknowledged_at&id=eq."+id+"&limit=1"),
        api("clinical_adhd_forms?select=form_key,status,delivery_mode&assessment_id=eq."+id),
        currentMode==="expanded"
          ?api("clinical_adhd_neuro_tests?select=id,instrument_key,status,created_at&assessment_id=eq."+id+"&order=created_at.asc")
          :Promise.resolve([])
      ]);
      if(now!==generation||id!==currentId)return;
      const assessment=Array.isArray(a)?a[0]:null;
      if(!assessment||assessment.modality!==currentMode)throw Error("No se ha podido verificar la modalidad de evaluación.");
      currentGroup=assessment.age_group||"adult";
      currentAge=Number.isInteger(assessment.age_at_assessment)?assessment.age_at_assessment:null;
      savedIndications=Array.isArray(assessment.neuro_selection_indications)?
        assessment.neuro_selection_indications.filter(x=>indications.some(i=>i[0]===x)):[];
      forms=Array.isArray(f)?f:[];
      tests=Array.isArray(t)?t:[];
      status=assessment.status;
      render();
    }catch(e){if(now!==generation)return;content.replaceChildren(node("p",e.message||"No se pudo cargar la guía.","adhd-plan-error"));}
  }
  function render(){
    content.replaceChildren();
    const overview=node("div",undefined,"adhd-plan-overview");
    overview.append(node("strong",(currentGroup==="child"?"Infantil":currentGroup==="adolescent"?"Adolescente":"Adultos")+" · "+(currentMode==="expanded"?"Neuropsicológica ampliada":"Clínica diagnóstica")+" · "+(currentGroup==="adult"?(currentMode==="expanded"?600:450):(currentMode==="expanded"?700:500))+" €"),
      node("p",currentMode==="expanded"
        ?"Incluye el núcleo diagnóstico. La batería de rendimiento se adapta a los dominios que necesites explorar."
        :"Incluye valoración clínica, entrevistas y escalas pertinentes. Las pruebas de rendimiento extensas son opcionales y requieren una indicación adicional."));
    content.append(overview);
    const a=node("section",undefined,"adhd-plan-section");
    a.append(node("h4","1. Evaluación clínica"),node("p","Instrumentos y registros de base, más apoyos al diagnóstico diferencial según los hallazgos.","adhd-plan-muted"));
    const grid=node("div",undefined,"adhd-plan-list");
    for(const [key,title,kind,description] of (currentGroup==="adult"?core:pediatricCore.filter(x=>x[0]!=="etdah_registro"||currentAge===null||currentAge<=12))){
      const record=forms.find(f=>f.form_key===key);
      const item=node("div",undefined,"adhd-plan-row adhd-plan-clickable");
      const open=()=>root.dispatchEvent(new CustomEvent("adhd:open-form",{bubbles:true,detail:{assessmentId:currentId,formKey:key}}));
      item.addEventListener("click",open);
      item.addEventListener("keydown",e=>{if(e.target===item&&(e.key==="Enter"||e.key===" ")){e.preventDefault();open();}});
      item.tabIndex=0;item.setAttribute("role","button");item.setAttribute("aria-label","Editar "+title);
      const info=node("div",undefined,"adhd-plan-row-info");
      const top=node("div",undefined,"adhd-plan-row-top");
      top.append(node("strong",title),node("span",kind,"adhd-plan-tag"));
      info.append(top,node("p",description));
      const action=node("div",undefined,"adhd-plan-row-action");
      action.append(node("span",record?(statusLabels[record.status]||record.status):"Sin registrar","adhd-plan-state"));
      const documentKey={diva_registro:"diva5",asrs_registro:"asrs",phq9_registro:"phq9",gad7_registro:"gad7",wfirs_registro:"wfirs",anamnesis:"anamnesis",diferencial:"differential",
        atento_registro:"atento",etdah_registro:"etdah",sena_registro:"sena",sdq_registro:"sdq"}[key];
      if(documentKey)action.append(button("PDF original",e=>{
        e.stopPropagation();
        root.dispatchEvent(new CustomEvent("adhd:open-pdf",{bubbles:true,detail:{assessmentId:currentId,testKey:documentKey}}));
      },"small"));
      item.append(info,action);grid.append(item);
    }
    a.append(grid);content.append(a);
    renderNeuro();
  }
  function renderNeuro(){
    const section=node("section",undefined,"adhd-plan-section adhd-plan-neuro");
    section.append(node("h4","2. Exploración neuropsicológica"),
      node("p","La selección es orientativa. Ninguna prueba cognitiva confirma ni descarta por sí sola el TDAH. Solo se aplican instrumentos disponibles, autorizados y clínicamente indicados.","adhd-plan-muted"));
    const reasons=node("div",undefined,"adhd-plan-reasons");
    const title=node("h5","¿Qué necesitas explorar?");
    reasons.append(title);
    const options=node("div",undefined,"adhd-plan-reason-options");
    const checked=new Set(savedIndications);
    const inputs=[];
    for(const [key,label] of indications){
      const l=node("label",undefined,"adhd-plan-reason");
      const inp=document.createElement("input");inp.type="checkbox";inp.value=key;inp.checked=checked.has(key);
      l.append(inp,node("span",label));options.append(l);inputs.push(inp);
    }
    reasons.append(options);
    const saveReasons=button("Guardar motivos de selección",async()=>{
      if(!currentId)return;
      const selected=inputs.filter(x=>x.checked).map(x=>x.value);
      try{
        saveReasons.disabled=true;
        const updated=await api("clinical_adhd_assessments?id=eq."+currentId+"&status=not.in.(completed,cancelled)",{
          method:"PATCH",data:{neuro_selection_indications:selected,updated_at:new Date().toISOString()},returnRows:true
        });
        if(!Array.isArray(updated)||!updated.length)throw Error("La evaluación está cerrada o ya no está disponible.");
        savedIndications=selected;render();setNotice("Motivos clínicos guardados. Se han actualizado las sugerencias.");
      }catch(e){setNotice(e.message||"No se pudo guardar.",true);saveReasons.disabled=false;}
    },"secondary");
    if(status==="completed"||status==="cancelled"){
      inputs.forEach(x=>x.disabled=true);saveReasons.disabled=true;
      reasons.append(node("p","Evaluación cerrada: este plan es de solo lectura.","adhd-plan-muted"));
    }
    reasons.append(saveReasons);
    section.append(reasons);
    const selected=savedIndications.length>0;
    const available=currentGroup==="adult"?neuro:pediatricNeuro.filter(t=>currentAge===null||(currentAge>=t.min&&currentAge<=t.max));
    const recommendations=available.filter(t=>t.reasons.some(x=>savedIndications.includes(x)));
    const others=available.filter(t=>!recommendations.includes(t));
    const recommendedSet=selected?recommendations:available.filter(t=>currentGroup==="adult"?["d2r","fdt"].includes(t.key):["d2r","carasr"].includes(t.key));
    section.append(node("h5",selected?"Pruebas relacionadas con las áreas seleccionadas":"Pruebas que podrías considerar"));
    section.append(node("p",selected?"Estas pruebas merecen revisión por su posible aportación a la pregunta clínica.":"d2-R y las pruebas de atención seleccionables por edad son opciones, no requisitos del diagnóstico.","adhd-plan-muted"));
    const grid=node("div",undefined,"adhd-plan-list");
    for(const test of recommendedSet)grid.append(testRow(test));
    section.append(grid);
    const otherOptions=selected?others:available.filter(t=>currentGroup==="adult"?!["d2r","fdt"].includes(t.key):!["d2r","carasr"].includes(t.key));
    if(otherOptions.length){
      const details=node("details",undefined,"adhd-plan-extra");
      details.append(node("summary","Ver otras pruebas opcionales"));
      const rest=node("div",undefined,"adhd-plan-list");
      for(const test of otherOptions)rest.append(testRow(test));
      details.append(rest);section.append(details);
    }
    if(currentMode==="diagnostic"){
      const note=node("div",undefined,"adhd-plan-upgrade");
      note.append(node("strong","¿Necesitas añadir pruebas neuropsicológicas a esta evaluación?"),
        node("p","Puedes ampliar la modalidad sin repetir entrevistas ni formularios ya guardados. El cambio será de 450 a 600 € en adultos o de 500 a 700 € en menores, con aceptación documentada."));
      if(status!=="completed"&&status!=="cancelled")note.append(button("Preparar ampliación a "+(currentGroup==="adult"?600:700)+" €",()=>showUpgrade(note),"primary"));
      else note.append(node("p","La evaluación está cerrada. No se permite modificar la modalidad de un expediente finalizado.","adhd-plan-muted"));
      section.append(note);
    }
    content.append(section);
  }
  function testRow(test){
    const existing=tests.filter(t=>t.instrument_key===test.key);
    const active=existing.some(t=>t.status!=="reviewed")?existing.find(t=>t.status!=="reviewed"):existing.at(-1);
    const item=node("div",undefined,"adhd-plan-row");
    const info=node("div",undefined,"adhd-plan-row-info");
    const top=node("div",undefined,"adhd-plan-row-top");
    top.append(node("strong",test.name),node("span",test.when,"adhd-plan-tag"));
    info.append(top,node("p",test.note));
    const action=node("div",undefined,"adhd-plan-row-action");
    const modeOK=currentMode==="expanded"&&status!=="completed"&&status!=="cancelled";
    action.append(node("span",active?(statusLabels[active.status]||active.status):"No planificada","adhd-plan-state"));
    action.append(button("PDF original",e=>{
      e.stopPropagation();
      root.dispatchEvent(new CustomEvent("adhd:open-pdf",{bubbles:true,detail:{assessmentId:currentId,testKey:test.key}}));
    },"small"));
    if(currentMode==="expanded"){
      if(!active){
        const b=button("Añadir a la batería",()=>{
          root.dispatchEvent(new CustomEvent("adhd:plan-test",{bubbles:true,detail:{assessmentId:currentId,testKey:test.key}}));
        },"small");
        if(!modeOK)b.disabled=true;
        action.append(b);
      }
    }
    if(active&&currentMode==="expanded"){
      const open=()=>root.dispatchEvent(new CustomEvent("adhd:plan-test",{bubbles:true,detail:{assessmentId:currentId,testKey:test.key}}));
      item.classList.add("adhd-plan-clickable");
      item.tabIndex=0;item.setAttribute("role","button");item.setAttribute("aria-label","Editar resultados de "+test.name);
      item.addEventListener("click",open);
      item.addEventListener("keydown",e=>{if(e.target===item&&(e.key==="Enter"||e.key===" ")){e.preventDefault();open();}});
    }
    item.append(info,action);return item;
  }
  function showUpgrade(parent){
    const old=$(".adhd-plan-upgrade-form",parent);if(old){old.remove();return;}
    const box=node("div",undefined,"adhd-plan-upgrade-form");
    const field=node("label","Indicación clínica de la exploración adicional");
    const reason=document.createElement("textarea");reason.rows=3;reason.maxLength=1000;
    reason.placeholder="Ej.: quejas de memoria y planificación no suficientemente caracterizadas en entrevista.";
    field.append(reason);
    const confirm=node("label",undefined,"adhd-plan-acknowledge");
    const checkbox=document.createElement("input");checkbox.type="checkbox";
    confirm.append(checkbox,node("span","Confirmo que se ha explicado el cambio de alcance y el presupuesto total correspondiente, que ha sido aceptado y que registraré su aceptación en la historia clínica."));
    const actions=node("div",undefined,"adhd-plan-toolbar");
    const confirmBtn=button("Confirmar ampliación",()=>{
      if(reason.value.trim().length<8){setNotice("Escribe la justificación clínica de la ampliación.",true);return;}
      if(!checkbox.checked){setNotice("Debes confirmar la aceptación del nuevo presupuesto para cambiar la modalidad.",true);return;}
      if(!window.confirm("Se ampliará este expediente a "+(currentGroup==="adult"?600:700)+" € sin generar cobros ni facturas. ¿Confirmas que el presupuesto ha sido aceptado?"))return;
      root.dispatchEvent(new CustomEvent("adhd:upgrade-request",{bubbles:true,detail:{assessmentId:currentId,accepted:true,indication:reason.value.trim()}}));
    },"primary");
    actions.append(confirmBtn,button("Cancelar",()=>box.remove(),"secondary"));
    box.append(field,confirm,actions);parent.append(box);
    reason.focus();
  }
  function setNotice(text,error=false){
    const old=$("#adhd-plan-inline-message",content);
    if(old)old.remove();
    const p=node("p",text,error?"adhd-plan-error":"adhd-plan-success");
    p.id="adhd-plan-inline-message";
    content.prepend(p);
  }
  function init(){
    attach();
    if(root)return;
    const observer=new MutationObserver(()=>{attach();if(root)observer.disconnect()});
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
  else init();
})();