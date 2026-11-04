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
  let currentId="",currentMode="",patientId="",status="",savedIndications=[],forms=[],tests=[],generation=0;
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
        api("clinical_adhd_assessments?select=id,modality,status,neuro_selection_indications,upgrade_budget_acknowledged_at&id=eq."+id+"&limit=1"),
        api("clinical_adhd_forms?select=form_key,status,delivery_mode&assessment_id=eq."+id),
        currentMode==="expanded"
          ?api("clinical_adhd_neuro_tests?select=id,instrument_key,status,created_at&assessment_id=eq."+id+"&order=created_at.asc")
          :Promise.resolve([])
      ]);
      if(now!==generation||id!==currentId)return;
      const assessment=Array.isArray(a)?a[0]:null;
      if(!assessment||assessment.modality!==currentMode)throw Error("No se ha podido verificar la modalidad de evaluación.");
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
    overview.append(node("strong",currentMode==="expanded"?"Neuropsicológica ampliada · 600 €":"Clínica diagnóstica · 450 €"),
      node("p",currentMode==="expanded"
        ?"Incluye el núcleo diagnóstico. La batería de rendimiento se adapta a los dominios que necesites explorar."
        :"Incluye valoración clínica, entrevistas y escalas pertinentes. Las pruebas de rendimiento extensas son opcionales y requieren una indicación adicional."));
    content.append(overview);
    const a=node("section",undefined,"adhd-plan-section");
    a.append(node("h4","1. Evaluación clínica"),node("p","Instrumentos y registros de base, más apoyos al diagnóstico diferencial según los hallazgos.","adhd-plan-muted"));
    const grid=node("div",undefined,"adhd-plan-list");
    for(const [key,title,kind,description] of core){
      const record=forms.find(f=>f.form_key===key);
      const item=node("div",undefined,"adhd-plan-row");
      const info=node("div",undefined,"adhd-plan-row-info");
      const top=node("div",undefined,"adhd-plan-row-top");
      top.append(node("strong",title),node("span",kind,"adhd-plan-tag"));
      info.append(top,node("p",description));
      const action=node("div",undefined,"adhd-plan-row-action");
      action.append(node("span",record?(statusLabels[record.status]||record.status):"Sin registrar","adhd-plan-state"));
      action.append(button(record?"Abrir":"Registrar",()=>{
        root.dispatchEvent(new CustomEvent("adhd:open-form",{bubbles:true,detail:{assessmentId:currentId,formKey:key}}));
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
    const recommendations=neuro.filter(t=>t.reasons.some(x=>savedIndications.includes(x)));
    const others=neuro.filter(t=>!recommendations.includes(t));
    const recommendedSet=selected?recommendations:neuro.filter(t=>["d2r","fdt"].includes(t.key));
    section.append(node("h5",selected?"Pruebas relacionadas con las áreas seleccionadas":"Pruebas que podrías considerar"));
    section.append(node("p",selected?"Estas pruebas merecen revisión por su posible aportación a la pregunta clínica.":"d2-R y FDT son opciones frecuentes cuando procede explorar rendimiento atencional y ejecutivo, pero no forman una batería obligatoria.","adhd-plan-muted"));
    const grid=node("div",undefined,"adhd-plan-list");
    for(const test of recommendedSet)grid.append(testRow(test));
    section.append(grid);
    const otherOptions=selected?others:neuro.filter(t=>!["d2r","fdt"].includes(t.key));
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
        node("p","Puedes ampliar la modalidad sin repetir entrevistas ni formularios ya guardados. Pasaría de 450 € a 600 € exclusivamente tras documentar que el paciente acepta el nuevo alcance y presupuesto."));
      if(status!=="completed"&&status!=="cancelled")note.append(button("Preparar ampliación a 600 €",()=>showUpgrade(note),"primary"));
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
    if(currentMode==="expanded"){
      const b=button(active?"Abrir registro":"Añadir a la batería",()=>{
        root.dispatchEvent(new CustomEvent("adhd:plan-test",{bubbles:true,detail:{assessmentId:currentId,testKey:test.key}}));
      },"small");
      if(!modeOK)b.disabled=true;
      action.append(b);
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
    confirm.append(checkbox,node("span","Confirmo que se ha explicado al paciente el cambio de alcance y el presupuesto total de 600 €, que ha sido aceptado y que registraré su aceptación en la historia clínica."));
    const actions=node("div",undefined,"adhd-plan-toolbar");
    const confirmBtn=button("Confirmar ampliación",()=>{
      if(reason.value.trim().length<8){setNotice("Escribe la justificación clínica de la ampliación.",true);return;}
      if(!checkbox.checked){setNotice("Debes confirmar la aceptación del nuevo presupuesto para cambiar la modalidad.",true);return;}
      if(!window.confirm("Se ampliará este mismo expediente a 600 € sin generar cobros ni facturas. ¿Confirmas que el presupuesto ha sido aceptado?"))return;
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