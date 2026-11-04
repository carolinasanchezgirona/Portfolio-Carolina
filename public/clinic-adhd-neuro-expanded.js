(() => {
  "use strict";
  const BASE = "https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1";
  const PUB = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const CATALOG = {
    d2r: { title:"d2-R · Atención selectiva", domain:"attention", minutes:"~8 min", why:"Explora velocidad, precisión y concentración bajo una tarea de cancelación." },
    fdt: { title:"FDT · Cinco Dígitos", domain:"executive", minutes:"~5 min", why:"Velocidad, interferencia y alternancia. No es específico del TDAH." },
    tavec: { title:"TAVEC · Aprendizaje verbal", domain:"memory", minutes:"~40 min", why:"Aprendizaje, evocación y reconocimiento verbal cuando hay una pregunta clínica de memoria." },
    tesen: { title:"TESEN · Senderos", domain:"executive", minutes:"~10 min", why:"Planificación visomotora y componentes ejecutivos según el manual." },
    tmt: { title:"TMT A/B · Senderos", domain:"executive", minutes:"Variable", why:"Velocidad y alternancia; verificar edición, autorización y baremos utilizados." },
    cpt3: { title:"CPT-3 · Ejecución continua", domain:"attention", minutes:"~14 min", why:"Vigilancia y control de respuesta; interpretación cautelosa y contextualizada." },
    working_memory: { title:"Memoria de trabajo", domain:"working_memory", minutes:"Variable", why:"Prueba estandarizada autorizada que hayas seleccionado, identificando la edición." },
    other: { title:"Otra prueba neuropsicológica", domain:"other", minutes:"Variable", why:"Únicamente cuando esté indicada y dispongas de material y baremos apropiados." },
    carasr: {title:"CARAS-R · Atención perceptiva",domain:"attention",minutes:"~3 min",why:"Atención perceptiva: baremos escolares de 6 a 18 años."},
    enfen: {title:"ENFEN · Funciones ejecutivas",domain:"executive",minutes:"Variable",why:"Exploración estandarizada de funciones ejecutivas (6–12 años)."},
    taveci: {title:"TAVECI · Memoria verbal infantil",domain:"memory",minutes:"~40 min",why:"Exploración del aprendizaje verbal (hasta 16 años)."},
    atento: {title:"ATENTO · Informantes",domain:"other",minutes:"15–25 min",why:"Registrar resultados editoriales de familia, escuela y autoinforme cuando procede."},
    etdah: {title:"e-TDAH · Informantes",domain:"other",minutes:"Variable",why:"Resultados del instrumento según manual original."},
    sena: {title:"SENA · Conducta y emociones",domain:"other",minutes:"Variable",why:"Registro complementario de resultados autorizados."}
  };
  const CLINICAL_FIELDS = [
    ["referral_question","Pregunta neuropsicológica","¿Qué decisión clínica pretende informar esta ampliación?"],
    ["conditions","Condiciones de exploración","Sueño, medicación, fatiga, dolor, ansiedad, idioma, escolaridad y contexto de administración."],
    ["performance_validity","Validez de la ejecución y limitaciones","Observaciones y evidencia disponible; evitar inferir invalidez a partir de un único índice."],
    ["cognitive_strengths","Capacidades conservadas y fortalezas","Describe recursos que puedan orientar adaptaciones e intervención."],
    ["cognitive_weaknesses","Dificultades observadas","Dominios y magnitud, incorporando dispersión y posibles factores de confusión."],
    ["ecological_concordance","Concordancia con el funcionamiento cotidiano","Relaciona hallazgos con anamnesis, informantes y limitaciones ecológicas de los tests."],
    ["differential_contribution","Contribución al diagnóstico diferencial","Hallazgos compatibles, alternativos o inespecíficos: nunca diagnóstico automático."],
    ["clinical_implications","Implicaciones para la formulación","Hipótesis de trabajo, alcance del perfil y decisiones que facilita."],
    ["limitations","Limitaciones de la interpretación","Baremos, variables demográficas, idioma, selección de pruebas o validez insuficiente."],
    ["recommendations","Recomendaciones individualizadas","Seguimiento, intervención y derivaciones si están justificadas."]
  ];
  const $ = (q,root=document) => root.querySelector(q);
  const el = (tag, text, cls) => {
    const n=document.createElement(tag);
    if(text !== undefined && text !== null)n.textContent=text;
    if(cls)n.className=cls;
    return n;
  };
  const btn = (text,fn,cls="") => {
    const b=el("button",text,"adhd-neuro-btn "+cls);
    b.type="button";
    b.addEventListener("click",fn);
    return b;
  };
  const validUUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const getToken=()=>{try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null")?.access_token||""}catch{return ""}};
  async function db(path,{method="GET",payload=null,returnRows=false}={}){
    const token=getToken();
    if(!token)throw Error("La sesión de Gestión Clínica ha caducado. Vuelve a iniciar sesión.");
    const response=await fetch(BASE+"/"+path,{method,cache:"no-store",headers:{
      apikey:PUB,Authorization:"Bearer "+token,
      "Content-Type":"application/json",
      ...(returnRows?{Prefer:"return=representation"}:{})
    },...(payload===null?{}:{body:JSON.stringify(payload)})});
    if(!response.ok)throw Error("No se pudo guardar o consultar el registro ("+response.status+").");
    const raw=await response.text();
    return raw?JSON.parse(raw):null;
  }
  let region=null,host=null,body=null,notice=null;
  let assessmentId="",patientId="",currentTestId="",testRows=[],integration=null,loading=0;
  let ageGroup="adult",assessmentAge=null;
  function applicable(key){
    if(ageGroup==="adult")return !["carasr","enfen","taveci","atento","etdah","sena"].includes(key);
    if(!Number.isInteger(assessmentAge))return false;
    if(key==="fdt")return assessmentAge>=7;
    if(key==="enfen")return assessmentAge>=6&&assessmentAge<=12;
    if(key==="carasr")return assessmentAge>=6&&assessmentAge<=17;
    if(key==="taveci")return assessmentAge>=6&&assessmentAge<=16;
    if(key==="tavec"||key==="tesen")return assessmentAge>=16;
    if(["cpt3","tmt"].includes(key))return false;
    return ["d2r","working_memory","other","atento","etdah","sena"].includes(key);
  }
  const noticeText=(msg,error=false)=>{if(notice){notice.textContent=msg;notice.classList.toggle("error",error)}};
  function attach(){
    const root=$("#adhd-assessment-module");
    if(!root||region===root)return;
    region=root;
    host=el("section",undefined,"adhd-neuro-module");
    host.hidden=true;
    host.id="adhd-neuro-workspace";
    const header=el("div",undefined,"adhd-neuro-heading");
    header.append(el("p","AMPLIACIÓN NEUROPSICOLÓGICA","adhd-neuro-eyebrow"),
      el("h3","Perfil cognitivo e integración profesional"),
      el("p","Escoge únicamente las pruebas indicadas. Los baremos, la corrección y las conclusiones se consignan por la profesional."));
    notice=el("p","","adhd-neuro-notice");notice.setAttribute("role","status");
    body=el("div",undefined,"adhd-neuro-body");
    host.append(header,notice,body);
    region.append(host);
    new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:["data-assessment-id","data-assessment-patient-id","data-assessment-modality"]});
    region.addEventListener("adhd:assessment",sync);
    region.addEventListener("adhd:plan-test",async event=>{
      const d=event.detail||{};
      if(d.assessmentId!==assessmentId||!CATALOG[d.testKey]||host.hidden)return;
      const existing=testRows.find(t=>t.instrument_key===d.testKey&&t.status!=="reviewed")
        ||testRows.find(t=>t.instrument_key===d.testKey);
      if(existing){
        currentTestId=existing.id;render();
        host.scrollIntoView({behavior:"smooth",block:"nearest"});
      }else{
        await addTest(d.testKey);
        if(currentTestId)host.scrollIntoView({behavior:"smooth",block:"nearest"});
      }
    });
    sync();
  }
  function sync(){
    if(!region||!host)return;
    const activeId=region.dataset.assessmentId||"",p=region.dataset.assessmentPatientId||"";
    const visible=region.dataset.assessmentModality==="expanded"&&validUUID.test(activeId)&&validUUID.test(p);
    host.hidden=!visible;
    if(!visible){
      assessmentId="";patientId="";testRows=[];integration=null;currentTestId="";
      if(body)body.replaceChildren();
      return;
    }
    const nextGroup=region.dataset.assessmentAgeGroup||"adult";
    const rawAge=Number(region.dataset.assessmentAge);
    const nextAge=region.dataset.assessmentAge!==""&&Number.isInteger(rawAge)?rawAge:null;
    if(activeId===assessmentId&&p===patientId&&nextGroup===ageGroup&&nextAge===assessmentAge)return;
    assessmentId=activeId;patientId=p;ageGroup=nextGroup;assessmentAge=nextAge;currentTestId="";
    reload();
  }
  async function reload(){
    const rev=++loading,aid=assessmentId;
    if(!aid)return;
    noticeText("Cargando pruebas y hoja de integración…");
    try{
      const [tests,integrations]=await Promise.all([
        db("clinical_adhd_neuro_tests?select=*&assessment_id=eq."+aid+"&order=created_at.asc"),
        db("clinical_adhd_neuro_integration?select=*&assessment_id=eq."+aid+"&limit=1")
      ]);
      if(rev!==loading||aid!==assessmentId)return;
      testRows=Array.isArray(tests)?tests:[];
      integration=Array.isArray(integrations)&&integrations.length?integrations[0]:null;
      if(currentTestId&&!testRows.some(t=>t.id===currentTestId))currentTestId="";
      render();
      noticeText("");
      region?.dispatchEvent(new Event("adhd:neuro-updated",{bubbles:true}));
    }catch(e){noticeText(e.message||"No se pudieron cargar los registros.",true)}
  }
  function inputField(label,value="",tag="textarea"){
    const wrap=el("label",label);
    const input=document.createElement(tag);
    input.value=value??"";
    if(tag==="textarea"){input.rows=3;input.maxLength=12000;}
    wrap.append(input);
    return {wrap,input};
  }
  function optionSelect(entries,value,aria){
    const s=document.createElement("select");s.setAttribute("aria-label",aria);
    for(const [k,label] of entries)s.append(new Option(label,k));
    s.value=value;
    return s;
  }
  function render(){
    if(!body)return;
    body.replaceChildren();
    const group=ageGroup==="adult"?"Adultos":ageGroup==="adolescent"?"Adolescentes (12–17 años)":"Infantil (6–11 años)";
    body.append(el("p",group+" · "+(ageGroup==="adult"?"600 €":"700 €")+(assessmentAge!==null?" · Edad al inicio: "+assessmentAge+" años":""),"adhd-neuro-help"));
    const summary=el("div",undefined,"adhd-neuro-metrics");
    summary.append(
      metric(String(testRows.length),"Pruebas registradas"),
      metric(String(testRows.filter(t=>t.status==="reviewed").length),"Pruebas revisadas"),
      metric(integration?.status==="reviewed"?"Revisada":"Pendiente","Integración clínica")
    );
    body.append(summary);
    renderTests(body);
    renderIntegration(body);
  }
  function metric(value,label){
    const w=el("div",undefined,"adhd-neuro-metric");w.append(el("strong",value),el("span",label));return w;
  }
  function renderTests(target){
    const section=el("section",undefined,"adhd-neuro-section");
    section.append(el("h4","1. Selección y resultados de pruebas"),
      el("p","Crea un registro por administración; si se repite o corrige una prueba, conserva su trazabilidad. No se reproducen ítems, estímulos ni tablas de puntuación.","adhd-neuro-help"));
    const actions=el("div",undefined,"adhd-neuro-toolbar");
    const select=optionSelect(
      Object.entries(CATALOG).filter(([key])=>applicable(key)).map(([k,v])=>[k,v.title]),
      "d2r","Elegir instrumento neuropsicológico"
    );
    actions.append(select,btn("Añadir prueba",()=>addTest(select.value),"primary"));
    section.append(actions);
    const cards=el("div",undefined,"adhd-neuro-tests");
    if(!testRows.length)cards.append(el("p","Todavía no se han incluido pruebas. Selecciona las que estén justificadas para este paciente.","adhd-neuro-empty"));
    for(const test of testRows){
      const row=el("div",undefined,"adhd-neuro-testrow"+(test.id===currentTestId?" active":""));
      const details=el("div");details.append(el("strong",test.instrument_label),
        el("span",({
          planned:"Planificada",administered:"Administrada",draft:"Corrección pendiente",reviewed:"Revisada"
        })[test.status]||test.status,"adhd-neuro-small"));
      row.append(details,btn(test.id===currentTestId?"Ocultar":"Abrir registro",()=>{
        currentTestId=currentTestId===test.id?"":test.id;render();
      }));
      cards.append(row);
    }
    section.append(cards);
    if(currentTestId){
      const selected=testRows.find(x=>x.id===currentTestId);
      if(selected)section.append(renderTestEditor(selected));
    }
    target.append(section);
  }
  async function addTest(key){
    const instrument=CATALOG[key];
    if(!instrument||!applicable(key)){noticeText("El instrumento seleccionado no corresponde al rango de edad registrado.",true);return;}
    if(!window.confirm("¿Añadir "+instrument.title+" a la evaluación? Se registrará como planificada."))return;
    try{
      const result=await db("clinical_adhd_neuro_tests",{method:"POST",returnRows:true,payload:{
        patient_id:patientId,assessment_id:assessmentId,
        instrument_key:key,instrument_label:instrument.title,
        domain:instrument.domain,status:"planned",
        rationale:""
      }});
      const row=Array.isArray(result)?result[0]:null;
      if(!row)throw Error("No se ha creado el registro.");
      currentTestId=row.id;await reload();noticeText("Prueba añadida a la planificación.");
    }catch(e){noticeText(e.message||"No se pudo añadir la prueba.",true)}
  }
  function renderTestEditor(item){
    const locked=item.status==="reviewed";
    const wrap=el("section",undefined,"adhd-neuro-editor");
    const heading=el("div",undefined,"adhd-neuro-test-heading");
    heading.append(el("h5",item.instrument_label),el("span",locked?"Resultado validado":"Registro profesional editable"));
    heading.append(btn("Abrir PDF original / imprimir",()=>{
      region.dispatchEvent(new CustomEvent("adhd:pdf-open-request",{
        bubbles:true,detail:{assessmentId:assessmentId,testKey:item.instrument_key}
      }));
    },"secondary"));
    wrap.append(heading);
    const fields=el("div",undefined,"adhd-neuro-grid");
    const form={};
    if(item.instrument_key==="other"||item.instrument_key==="working_memory"){
      const custom=inputField("Nombre concreto del instrumento y edición",item.instrument_label,"input");
      custom.input.maxLength=120;custom.input.disabled=locked;
      form.instrument_label=custom.input;fields.append(custom.wrap);
    }
    function field(key,label,text=item[key]||"",tag="textarea"){
      const f=inputField(label,text,tag);
      f.input.disabled=locked;form[key]=f.input;fields.append(f.wrap);
    }
    field("rationale","Motivo individualizado de selección");
    field("test_date","Fecha de aplicación",item.test_date||"","input");
    form.test_date.type="date";
    field("normative_reference","Baremos empleados: manual, edición, país, grupo normativo, edad y escolaridad");
    field("standardization_notes","Condiciones de aplicación: idioma, medicación, sueño, fatiga, adaptaciones");
    field("behavioral_observations","Observación cualitativa de la ejecución");
    field("validity_notes","Calidad/validez de los datos, limitaciones y posibles factores de confusión");
    field("interpretation","Interpretación clínica del patrón, sin equivalencia automática con TDAH");
    wrap.append(fields);
    wrap.append(el("h6","Puntuaciones registradas con las normas del manual"));
    wrap.append(el("p","No se realizan transformaciones ni asignaciones automáticas de percentiles. Introduce solo índices autorizados y puntuaciones que hayas corregido profesionalmente.","adhd-neuro-help"));
    const scoreArea=el("div",undefined,"adhd-neuro-scorearea");
    const entries=Array.isArray(item.results)?item.results:[];
    function addScore(data={}){
      const row=el("div",undefined,"adhd-neuro-score-row");
      const specs=[
        ["index","Índice o medida"],["raw","Puntuación directa"],["standard","Puntuación normativa y tipo"],["percentile","Percentil (si procede)"]
      ];
      for(const [key,label] of specs){
        const f=inputField(label,String(data[key]??""),"input");
        f.input.dataset.scoreKey=key;f.input.maxLength=180;f.input.disabled=locked;row.append(f.wrap);
      }
      if(!locked)row.append(btn("Quitar",()=>row.remove(),"small"));
      scoreArea.append(row);
    }
    if(entries.length)entries.forEach(addScore);
    else if(!locked)addScore();
    wrap.append(scoreArea);
    if(!locked)wrap.append(btn("+ Añadir índice",()=>addScore(),"secondary"));
    const controls=el("div",undefined,"adhd-neuro-toolbar");
    if(!locked){
      controls.append(
        btn("Guardar registro",()=>saveTest(item,form,scoreArea,false),"secondary"),
        btn("Validar resultado",()=>saveTest(item,form,scoreArea,true),"primary")
      );
    }else{
      wrap.append(el("p","Este resultado permanece inmutable como evidencia clínica. Para rectificarlo, crea un nuevo registro vinculado.","adhd-neuro-help"));
      controls.append(btn("Registrar corrección",()=>correctTest(item),"secondary"));
    }
    wrap.append(controls);
    return wrap;
  }
  function readScores(area){
    const rows=[];
    for(const row of area.querySelectorAll(".adhd-neuro-score-row")){
      const entry={};
      for(const input of row.querySelectorAll("[data-score-key]")){
        entry[input.dataset.scoreKey]=input.value.trim();
      }
      if(Object.values(entry).some(Boolean))rows.push(entry);
    }
    return rows;
  }
  async function saveTest(item,fields,scoreArea,review){
    const results=readScores(scoreArea);
    const data={
      ...(fields.instrument_label?{instrument_label:fields.instrument_label.value.trim()}:{}),
      rationale:fields.rationale.value.trim(),
      test_date:fields.test_date.value||null,
      normative_reference:fields.normative_reference.value.trim(),
      standardization_notes:fields.standardization_notes.value.trim(),
      behavioral_observations:fields.behavioral_observations.value.trim(),
      validity_notes:fields.validity_notes.value.trim(),
      interpretation:fields.interpretation.value.trim(),
      results,
      status:review?"reviewed":(fields.test_date.value?"draft":"planned"),
      updated_at:new Date().toISOString()
    };
    if(data.instrument_label && (data.instrument_label.length<2||data.instrument_label.length>120)){
      noticeText("Indica el nombre y edición del instrumento (2–120 caracteres).",true);return;
    }
    if(review){
      if(!data.test_date||!data.normative_reference||!data.interpretation||!results.length){
        noticeText("Para validar hace falta fecha, baremo, puntuaciones corregidas e interpretación.",true);return;
      }
      if(!window.confirm("¿Validar este resultado? Quedará cerrado; las rectificaciones posteriores se registrarán por separado."))return;
      data.reviewed_at=new Date().toISOString();
    }
    try{
      await db("clinical_adhd_neuro_tests?id=eq."+item.id+"&status=neq.reviewed",{
        method:"PATCH",payload:data,returnRows:true
      }).then(rows=>{if(!Array.isArray(rows)||rows.length!==1)throw Error("Registro ya validado o no disponible.");});
      await reload();
      noticeText(review?"Resultado validado y conservado.":"Registro guardado.");
    }catch(e){noticeText(e.message||"No se pudo guardar el resultado.",true)}
  }
  async function correctTest(old){
    if(!window.confirm("Se abrirá una corrección nueva conservando el resultado validado original. ¿Continuar?"))return;
    try{
      const values={
        patient_id:patientId,assessment_id:assessmentId,
        instrument_key:old.instrument_key,instrument_label:old.instrument_label,
        domain:old.domain,supersedes_id:old.id,status:"draft",
        rationale:old.rationale,test_date:old.test_date,
        results:old.results,normative_reference:old.normative_reference,
        standardization_notes:old.standardization_notes,
        behavioral_observations:old.behavioral_observations,
        validity_notes:old.validity_notes,
        interpretation:old.interpretation
      };
      const rows=await db("clinical_adhd_neuro_tests",{method:"POST",payload:values,returnRows:true});
      if(!rows?.[0]?.id)throw Error("No se ha creado la corrección.");
      currentTestId=rows[0].id;await reload();noticeText("Corrección abierta. El original permanece archivado.");
    }catch(e){noticeText(e.message||"No se pudo abrir la corrección.",true)}
  }
  function renderIntegration(target){
    const section=el("section",undefined,"adhd-neuro-section");
    section.append(el("h4","2. Integración neuropsicológica"),
      el("p","Relaciona las pruebas con la entrevista, la información colateral y el funcionamiento real. No confirma ni excluye TDAH por sí sola.","adhd-neuro-help"));
    const reviewed=integration?.status==="reviewed";
    const editor=el("div",undefined,"adhd-neuro-grid");
    const inputs={};
    for(const [key,label,prompt] of CLINICAL_FIELDS){
      const f=inputField(label,integration?.[key]||"");
      f.input.rows=3;f.input.placeholder=prompt;f.input.disabled=reviewed;
      editor.append(f.wrap);inputs[key]=f.input;
    }
    section.append(editor);
    const actions=el("div",undefined,"adhd-neuro-toolbar");
    if(!reviewed){
      actions.append(
        btn("Guardar síntesis",()=>saveIntegration(inputs,false),"secondary"),
        btn("Validar síntesis",()=>saveIntegration(inputs,true),"primary")
      );
    }else section.append(el("p","Integración revisada y cerrada. Se conserva como parte del expediente clínico.","adhd-neuro-help"));
    actions.append(btn("Preparar anexo para informe",()=>prepareReport(),"secondary"));
    section.append(actions);
    const output=el("div",undefined,"adhd-neuro-report");
    output.id="adhd-neuro-report-area";
    section.append(output);
    target.append(section);
  }
  async function saveIntegration(inputs,review){
    const data={};
    for(const [key] of CLINICAL_FIELDS)data[key]=inputs[key].value.trim();
    data.status=review?"reviewed":"draft";
    data.updated_at=new Date().toISOString();
    if(review){
      const reviewedTests=testRows.filter(t=>t.status==="reviewed");
      if(!reviewedTests.length||!data.referral_question||!data.differential_contribution||!data.limitations){
        noticeText("Para validar indica pregunta clínica, integración diferencial, limitaciones y revisa al menos una prueba.",true);return;
      }
      if(!window.confirm("¿Validar la síntesis neuropsicológica? Se bloqueará para preservar su contenido."))return;
      data.reviewed_at=new Date().toISOString();
    }
    try{
      let rows;
      if(integration?.id){
        rows=await db("clinical_adhd_neuro_integration?id=eq."+integration.id+"&status=eq.draft",{
          method:"PATCH",payload:data,returnRows:true
        });
      }else{
        rows=await db("clinical_adhd_neuro_integration",{method:"POST",returnRows:true,payload:{
          patient_id:patientId,assessment_id:assessmentId,...data
        }});
      }
      if(!rows?.[0])throw Error("La integración ya está cerrada o no puede editarse.");
      integration=rows[0];await reload();
      noticeText(review?"Síntesis revisada y archivada.":"Síntesis guardada.");
    }catch(e){noticeText(e.message||"No se pudo guardar la síntesis.",true)}
  }
  function prepareReport(){
    const approved=testRows.filter(t=>t.status==="reviewed" && !testRows.some(other=>other.supersedes_id===t.id&&other.status==="reviewed"));
    if(!approved.length){noticeText("Valida al menos una prueba para preparar el anexo.",true);return}
    const sections=[];
    sections.push("ANEXO NEUROPSICOLÓGICO · EVALUACIÓN TDAH ADULTO");
    sections.push("Documento de trabajo para revisión profesional, no es un diagnóstico automático.");
    sections.push("Instrumentos y resultados:");
    for(const item of approved){
      sections.push("\n"+item.instrument_label+
        (item.test_date?" · "+item.test_date:""));
      if(item.rationale)sections.push("Indicación: "+item.rationale);
      if(item.normative_reference)sections.push("Referencia normativa: "+item.normative_reference);
      for(const score of Array.isArray(item.results)?item.results:[]){
        sections.push("Medida: "+(score.index||"")+" | Directa: "+(score.raw||"no registrada")+" | Normativa: "+(score.standard||"no registrada")+" | Percentil: "+(score.percentile||"no registrado"));
      }
      if(item.standardization_notes)sections.push("Condiciones: "+item.standardization_notes);
      if(item.behavioral_observations)sections.push("Observación: "+item.behavioral_observations);
      if(item.validity_notes)sections.push("Calidad de datos: "+item.validity_notes);
      if(item.interpretation)sections.push("Interpretación profesional: "+item.interpretation);
      if(item.supersedes_id)sections.push("Nota: este resultado corrige un registro anterior conservado.");
    }
    if(integration){
      sections.push("\nINTEGRACIÓN CLÍNICA");
      for(const [key,title] of CLINICAL_FIELDS){
        if(integration[key])sections.push(title+": "+integration[key]);
      }
      if(integration.status!=="reviewed")sections.push("Estado: síntesis pendiente de validación profesional.");
    }else sections.push("\nIntegración: pendiente de cumplimentar.");
    sections.push("\nLa conclusión diagnóstica integra la evaluación clínica, anamnesis y entrevista DIVA-5 por separado.");
    const report=sections.join("\n");
    const area=$("#adhd-neuro-report-area",body);
    if(!area)return;
    area.replaceChildren();
    area.append(el("h5","Anexo para incorporar al informe clínico"));
    const textArea=document.createElement("textarea");
    textArea.readOnly=true;textArea.value=report;textArea.rows=16;
    textArea.setAttribute("aria-label","Borrador de anexo neuropsicológico");
    area.append(textArea,btn("Copiar anexo",async()=>{
      try{await navigator.clipboard.writeText(report);noticeText("Anexo copiado para integrarlo en el informe revisado.");}
      catch{textArea.select();noticeText("Selecciona el texto y cópialo manualmente.");}
    },"secondary"));
    noticeText("Anexo preparado con resultados revisados. Comprueba su contenido antes de incorporarlo al informe.");
  }
  function init(){
    attach();
    if(region)return;
    const parent=$("#clinic-patient-dialog")||document.body;
    const observer=new MutationObserver(()=>{
      attach();
      if(region)observer.disconnect();
    });
    observer.observe(parent,{childList:true,subtree:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();