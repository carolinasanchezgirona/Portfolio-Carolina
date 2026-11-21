(() => {
  "use strict";
  const REST = "https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1";
  // Clave pública (publishable), idéntica a la del módulo clínico existente. Nunca es service_role.
  const PUBLIC_KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION = "dememoria_admin_session";

  const COMMON = [
    { title: "Encuadre, demanda y fuentes", description: "Registra la pregunta clínica y la procedencia de cada dato. No sustituye el consentimiento informado firmado.", fields: [
      ["motivo", "Motivo de consulta y pregunta que debe responder la valoración"],
      ["solicitante", "Solicitante, expectativas y finalidad clínica o funcional del informe"],
      ["fuentes", "Entrevistas, informantes, documentos disponibles y fecha de cada fuente"],
      ["consentimiento", "Consentimientos, capacidad para participar y adaptaciones necesarias"],
      ["contexto", "Idioma, escolaridad, contexto sociocultural y factores que afectan la interpretación"]
    ]},
    { title: "Antecedentes y situación actual", description: "Información transversal; evita repetir automáticamente datos ya recogidos en la historia general.", fields: [
      ["inicio", "Inicio, cronología, curso y circunstancias de aparición de las dificultades"],
      ["medicos", "Antecedentes médicos, neurológicos, sensoriales y tratamientos relevantes"],
      ["psiquiatricos", "Antecedentes psicopatológicos y estado emocional actual"],
      ["familiares", "Antecedentes familiares relevantes para la pregunta de evaluación"],
      ["sueno", "Sueño, fatiga, dolor, sustancias y otros factores potencialmente modificadores"],
      ["funcionamiento", "Impacto funcional, participación, autonomía y apoyos"],
      ["fortalezas", "Capacidades preservadas, recursos y estrategias compensatorias"]
    ]},
    { title: "Integración profesional", description: "Apartados opcionales para actualizar tras la exploración. Diferencia siempre información referida, observada e inferida.", fields: [
      ["observacion", "Observaciones conductuales y condiciones de evaluación"],
      ["pruebas", "Instrumentos aplicados, fechas, normas y resultados pertinentes"],
      ["validez", "Validez, fiabilidad de las fuentes, discrepancias y limitaciones"],
      ["diferencial", "Hipótesis diagnósticas y explicaciones alternativas por contrastar"],
      ["integracion", "Síntesis clínica provisional, necesidades y pasos siguientes"]
    ]}
  ];
  const TYPES = {
    tea_adultos: { title: "TEA en adultos", age: "adult", sections: [
      { title: "Historia del neurodesarrollo", fields: [
        ["tea_infancia", "Reciprocidad social y comunicación en infancia; ejemplos e informantes"],
        ["tea_lenguaje", "Desarrollo del lenguaje y comunicación verbal y no verbal"],
        ["tea_relaciones", "Relaciones sociales, amistad, pareja y comprensión del contexto social"],
        ["tea_intereses", "Intereses restringidos, repetición, rutinas y resistencia a cambios"],
        ["tea_sensorial", "Perfil sensorial, interocepción y sobrecarga ambiental"]
      ]},
      { title: "Presentación actual y diferencial", fields: [
        ["tea_pragmatica", "Pragmática, reciprocidad, claves no verbales y comunicación actual"],
        ["tea_camuflaje", "Camuflaje social, aprendizaje compensatorio y coste subjetivo"],
        ["tea_regulacion", "Regulación emocional, agotamiento, shutdown o meltdown si se describen"],
        ["tea_adaptacion", "Funcionamiento adaptativo en hogar, trabajo, estudios y vínculos"],
        ["tea_diferencial", "TDAH, ansiedad social, trauma, personalidad y otras hipótesis"],
        ["tea_evidencia", "Evidencia evolutiva disponible y lagunas de información"]
      ]}
    ]},
    memoria_deterioro: { title: "Memoria, deterioro cognitivo y demencias", age: "adult", sections: [
      { title: "Fenomenología y evolución", fields: [
        ["memoria_demanda", "Queja cognitiva de la persona y de terceros; discrepancias"],
        ["memoria_evolucion", "Inicio, progresión, fluctuaciones, episodios agudos y evolución temporal"],
        ["memoria_dominios", "Memoria episódica, atención, lenguaje, funciones ejecutivas y orientación"],
        ["memoria_neuroconducta", "Cambios afectivos, conductuales, neuropsiquiátricos y conciencia de déficit"],
        ["memoria_neurologia", "Antecedentes vasculares, neurológicos, caídas, delirium y pruebas médicas"]
      ]},
      { title: "Autonomía, seguridad y red de apoyo", fields: [
        ["memoria_avd", "AVD básicas e instrumentales, cambios respecto al nivel premórbido"],
        ["memoria_seguridad", "Medicación, cocina, conducción, manejo económico y seguridad domiciliaria"],
        ["memoria_informante", "Identificación del informante, frecuencia de contacto y fiabilidad"],
        ["memoria_apoyos", "Cuidados, convivencia, sobrecarga y necesidades de apoyo"],
        ["memoria_reversibles", "Depresión, sueño, audición, medicación y otros factores potencialmente reversibles"],
        ["memoria_capacidad", "Preferencias y participación en decisiones; capacidades específicas que requieren valoración"]
      ]}
    ]},
    altas_capacidades: { title: "Altas capacidades", age: "six", sections: [
      { title: "Historia del aprendizaje y perfil", fields: [
        ["aac_objetivo", "Demanda concreta y finalidad de la identificación"],
        ["aac_desarrollo", "Desarrollo temprano, intereses, lenguaje y hitos de aprendizaje"],
        ["aac_escolaridad", "Historia académica, nivel de reto, cambios de centro y adaptaciones"],
        ["aac_perfil", "Razonamiento, aprendizaje, memoria, creatividad y áreas de especial interés"],
        ["aac_desajuste", "Discrepancias entre capacidad, rendimiento y oportunidades educativas"]
      ]},
      { title: "Contexto y necesidades", fields: [
        ["aac_motivacion", "Motivación, perfeccionismo, autorregulación y experiencias de aburrimiento"],
        ["aac_bienestar", "Bienestar emocional, relaciones con iguales y autoconcepto"],
        ["aac_doble", "Posibles dificultades concurrentes de aprendizaje, TDAH, TEA u otras"],
        ["aac_informantes", "Información de familia, centro educativo u otras fuentes pertinentes"],
        ["aac_contexto", "Idiomas, acceso a oportunidades y factores socioculturales"],
        ["aac_necesidades", "Necesidades educativas o funcionales que se pretenden orientar"]
      ]}
    ]},
    dislexia: { title: "Dislexia y dificultades de lectoescritura", age: "six", sections: [
      { title: "Desarrollo lector y escolaridad", fields: [
        ["dis_aprendizaje", "Inicio de la alfabetización y evolución del aprendizaje lector y escritor"],
        ["dis_lectura", "Exactitud, fluidez, velocidad, decodificación y comprensión lectora"],
        ["dis_escritura", "Ortografía, codificación, dictado, expresión escrita y automatización"],
        ["dis_fonologia", "Conciencia fonológica, denominación rápida y memoria verbal"],
        ["dis_idiomas", "Lenguas de escolarización y uso habitual; aprendizaje multilingüe"],
        ["dis_historia", "Antecedentes familiares, informes escolares y apoyos previos"]
      ]},
      { title: "Repercusión y diagnóstico diferencial", fields: [
        ["dis_rendimiento", "Impacto académico, laboral y actividades cotidianas de lectura"],
        ["dis_ajustes", "Intervenciones, adaptaciones y respuesta documentada"],
        ["dis_atencion", "Atención, funciones ejecutivas y otras dificultades del aprendizaje"],
        ["dis_sensorial", "Audición, visión, escolarización y oportunidades de enseñanza"],
        ["dis_bienestar", "Ansiedad ante tareas, evitación, autoconcepto y estrategias"],
        ["dis_criterios", "Persistencia de dificultades, datos normativos y alternativas explicativas"]
      ]}
    ]},
    neuropsicologia_general: { title: "Valoración neuropsicológica general", age: "six", sections: [
      { title: "Perfil cognitivo y antecedentes", fields: [
        ["neuro_motivo", "Pregunta neuropsicológica y cambios respecto al funcionamiento previo"],
        ["neuro_etiologia", "Antecedentes neurológicos, lesión/enfermedad, neuroimagen e informes médicos"],
        ["neuro_atencion", "Atención, velocidad de procesamiento y funciones ejecutivas"],
        ["neuro_memoria", "Aprendizaje, memoria episódica y memoria de trabajo"],
        ["neuro_lenguaje", "Lenguaje, lectura, escritura y funciones instrumentales"],
        ["neuro_visual", "Funciones visuoespaciales, praxias, gnosias y percepción"]
      ]},
      { title: "Validez, autonomía y alcance", fields: [
        ["neuro_funcionalidad", "Autonomía, AVD/AIVD, desempeño académico o laboral"],
        ["neuro_premorbido", "Funcionamiento premórbido, escolaridad, idioma y reserva cognitiva"],
        ["neuro_conducta", "Conducta, estado afectivo, sueño y factores de interferencia"],
        ["neuro_fuentes", "Informantes y documentos; concordancia entre fuentes"],
        ["neuro_validez", "Condiciones de evaluación, esfuerzo, validez y limitaciones interpretativas"],
        ["neuro_objetivos", "Objetivos de rehabilitación, apoyos y recomendaciones a explorar"]
      ]}
    ]}
  };
  const statusNames = {draft:"Borrador", in_progress:"En curso", reviewed:"Revisada"};
  let root, patientId="", birthDate=null, records=[], record=null, editor, statusNode, typeSelect, recordsSelect;
  let dirty=false, changeCounter=0, saveTimer=null, saving=null, loadCounter=0, loading=false, progressNode=null;
  const bank=()=>window.ClinicAnamnesisForms||null;
  // Recuperación volátil, solo en esta pestaña y nunca en localStorage, para errores de conexión.
  const recoveries=new Map();

  function node(tag, text, css) {
    const element=document.createElement(tag);
    if (text !== undefined && text !== null) element.textContent=String(text);
    if (css) element.className=css;
    return element;
  }
  function button(text, handler, css) {
    const element=node("button",text,css||"am-btn");
    element.type="button";
    element.addEventListener("click",handler);
    return element;
  }
  function notify(message, error) {
    if (!statusNode) return;
    statusNode.textContent=message||"";
    statusNode.classList.toggle("am-error",Boolean(error));
  }
  function token() {
    try { return JSON.parse(sessionStorage.getItem(SESSION)||"null")?.access_token||""; }
    catch { return ""; }
  }
  async function api(path, init) {
    const jwt=token();
    if (!jwt) throw Error("La sesión profesional ha caducado. Vuelve a iniciar sesión.");
    const response=await fetch(REST+"/"+path,{
      cache:"no-store",...(init||{}),
      headers:{
        apikey:PUBLIC_KEY,Authorization:"Bearer "+jwt,
        "Content-Type":"application/json",
        ...(init?.headers||{})
      }
    });
    if (!response.ok) throw Error("No se ha podido acceder al registro clínico ("+response.status+"). No se han confirmado cambios.");
    const content=await response.text();
    return content ? JSON.parse(content) : null;
  }
  function ageAt(dateString, reference) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString||"")) return null;
    const [y,m,d]=dateString.split("-").map(Number);
    const date=new Date(Date.UTC(y,m-1,d));
    if (date.getUTCFullYear()!==y || date.getUTCMonth()+1!==m || date.getUTCDate()!==d) return null;
    const ref=reference||new Date();
    let years=ref.getFullYear()-y;
    if (ref.getMonth()+1<m || (ref.getMonth()+1===m && ref.getDate()<d)) years--;
    return years>=0&&years<=120?years:null;
  }
  function permitted(type) {
    const age=ageAt(birthDate);
    if (age===null) return "Indica primero la fecha de nacimiento en los datos del paciente.";
    if (age<6) return "Este circuito comienza a los 6 años; se requiere valoración específica del desarrollo.";
    if (TYPES[type]?.age==="adult" && age<18) return "Esta anamnesis está configurada para personas adultas (18+).";
    return "";
  }
  function formatDate(value) {
    if (!value) return "Sin fecha";
    const date=new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}) : "Sin fecha";
  }
  function sectionList(type) {
    return [...COMMON.slice(0,2),...(TYPES[type]?.sections||[]),COMMON[2]];
  }
  function formSections(current) {
    if (!current || String(current.protocol_version||"1.0")==="1.0") {
      return sectionList(current?.assessment_type).map(section=>({
        ...section,
        questions:section.fields.map(([key,label])=>({key,label,kind:"textarea"}))
      }));
    }
    const forms=bank();
    if (!forms?.profiles?.[current.assessment_type]) return null;
    const common=forms.common||[];
    return [...common.slice(0,3),...forms.profiles[current.assessment_type].sections,...common.slice(3)];
  }
  function hasAnswer(answer) {
    return bank()?.isAnswer?.(answer) ??
      (Array.isArray(answer)?answer.length>0:answer!==undefined&&answer!==null&&String(answer).trim()!=="");
  }
  function values() {
    // Conservar respuestas de versiones previas y no borrar claves desconocidas.
    const result={...(record?.answers||{})};
    const controls=editor?.querySelectorAll("[data-am-field]")||[];
    const handled=new Set();
    for (const field of controls) {
      const key=field.dataset.amField;
      if (!key || handled.has(key)) continue;
      handled.add(key);
      if (field.type==="checkbox") {
        const selected=Array.from(controls).filter(c=>c.dataset.amField===key && c.type==="checkbox" && c.checked).map(c=>c.value);
        if (selected.length) result[key]=selected; else delete result[key];
        continue;
      }
      const value=String(field.value??"").trim();
      if (!value) delete result[key];
      else result[key]=field.type==="number"?Number(value):value;
    }
    return result;
  }
  function updateProgress() {
    if (!progressNode || !record) return;
    const sections=formSections(record);
    if (!sections) return;
    const answers=values();
    const all=sections.flatMap(s=>s.questions);
    const answered=all.filter(q=>hasAnswer(answers[q.key])).length;
    progressNode.replaceChildren();
    const info=node("span","Campos respondidos: "+answered+" de "+all.length
      +". Los campos no explorados pueden dejarse vacíos y documentarse como límite de la valoración.");
    const progress=node("progress");
    progress.max=all.length;progress.value=answered;
    progress.setAttribute("aria-label","Campos de anamnesis cumplimentados");
    progressNode.append(info,progress);
  }
  function renderQuestion(question, previous, readonly) {
    const key=question.key, old=previous[key], kind=question.kind||"textarea";
    const wrapper=node("div",null,"am-question am-kind-"+kind);
    const title=node("span",question.label,"am-question-title");
    if (kind==="checks") {
      const group=node("fieldset",null,"am-checkbox-group");
      group.append(node("legend",question.label));
      const items=node("div",null,"am-checkbox-options");
      const selected=Array.isArray(old)?old:[];
      for (const option of question.options||[]) {
        const label=node("label",null,"am-check-option");
        const checkbox=node("input");
        checkbox.type="checkbox";
        checkbox.value=option;
        checkbox.dataset.amField=key;
        checkbox.checked=selected.includes(option);
        checkbox.disabled=readonly;
        checkbox.addEventListener("change",()=>{
          if (checkbox.checked) {
            const isExclusive=value=>/^(ningun|sin datos|no identificad|no explorad)/i.test(value);
            const siblings=items.querySelectorAll('input[type="checkbox"]');
            for(const sibling of siblings){
              if(sibling===checkbox||!sibling.checked)continue;
              if(isExclusive(option)||isExclusive(sibling.value))sibling.checked=false;
            }
          }
          updateDirty();updateProgress();
        });
        label.append(checkbox,node("span",option));
        items.append(label);
      }
      group.append(items);
      wrapper.append(group);
    } else {
      const label=node("label",null,"am-field-label");
      label.append(title);
      let input;
      if (kind==="textarea") {
        input=node("textarea");
        input.rows=3;input.maxLength=4000;
        input.placeholder="Describe ejemplos, fuente, cronología y repercusión si procede…";
      } else if (kind==="select") {
        input=node("select");
        input.add(new Option("Sin responder / seleccionar…",""));
        for (const option of question.options||[]) input.add(new Option(option,option));
      } else {
        input=node("input");
        input.type=kind==="date"||kind==="number"?kind:"text";
        if (kind==="text") {input.maxLength=400;input.placeholder="Cumplimentar…";}
        if (kind==="number") {
          if(question.min!==undefined) input.min=String(question.min);
          if(question.max!==undefined) input.max=String(question.max);
          input.step=question.step||"1";
        }
      }
      input.value=(old===undefined||old===null)?"":String(old);
      input.dataset.amField=key;
      input.disabled=readonly;
      input.addEventListener(kind==="select"||kind==="date"?"change":"input",()=>{updateDirty();updateProgress();});
      label.append(input);
      wrapper.append(label);
    }
    if (question.help) wrapper.append(node("p",question.help,"am-question-help"));
    return wrapper;
  }
  function renderRecords() {
    const selected=record?.id||"";
    recordsSelect.replaceChildren();
    if (!records.length) recordsSelect.add(new Option("No hay anamnesis iniciadas",""));
    for (const item of records) {
      const label=(TYPES[item.assessment_type]?.title||item.assessment_type)
        +" · "+(statusNames[item.status]||item.status)
        +" · v"+(item.protocol_version||"1.0")+" · "+formatDate(item.created_at);
      recordsSelect.add(new Option(label,item.id));
    }
    recordsSelect.disabled=!records.length;
    recordsSelect.value=selected||records[0]?.id||"";
  }
  function renderEditor() {
    editor.replaceChildren();progressNode=null;
    if (!record) {
      editor.append(node("p","Selecciona el tipo de valoración para iniciar una anamnesis, o abre una evaluación anterior.","am-empty"));
      return;
    }
    const sections=formSections(record);
    if (!sections) {
      editor.append(node("p","Cargando la plantilla estructurada de esta valoración. Si el aviso persiste, actualiza la página y comprueba la conexión.","am-empty"));
      return;
    }
    const readonly=record.status==="reviewed";
    const header=node("div",null,"am-record-head");
    const titleArea=node("div");
    titleArea.append(node("h4",TYPES[record.assessment_type]?.title||"Valoración"));
    titleArea.append(node("p",(statusNames[record.status]||record.status)
      +" · Versión "+(record.protocol_version||"1.0")
      +" · Iniciada "+formatDate(record.created_at)
      +" · Actualizada "+formatDate(record.updated_at)
      +" · Revisión interna "+record.revision,"am-muted"));
    header.append(titleArea);
    editor.append(header);
    if (readonly) editor.append(node("p","Registro revisado y bloqueado. Para añadir datos, inicia una nueva evaluación: la anterior se conserva íntegra.","am-readonly"));
    else editor.append(node("p","Entrevista clínica profesional editable, no instrumento psicométrico validado. Ninguna respuesta se interpreta automáticamente como diagnóstico. Puedes completar los bloques en varias sesiones; se guardan automáticamente y con el botón de guardado.","am-help"));

    if(String(record.protocol_version||"1.0")!=="1.0"){
      const info=bank().profiles[record.assessment_type];
      const summary=node("p",info.subtitle,"am-form-summary");
      editor.append(summary);
      const citations=node("div",null,"am-references");
      citations.append(node("strong","Documentación de referencia: "));
      for (const [label,url] of info.sources) {
        const link=node("a",label);
        link.href=url;link.target="_blank";link.rel="noopener noreferrer";
        citations.append(link);
      }
      editor.append(citations);
    }
    progressNode=node("div",null,"am-progress");
    progressNode.setAttribute("role","status");
    progressNode.setAttribute("aria-live","polite");
    editor.append(progressNode);

    const previous=record.answers||{};
    sections.forEach((section,index)=>{
      // En los formularios 2.0 la entrevista se divide en bloques plegables.
      const details=node("details",null,"am-section am-section-details");
      details.open=index<2;
      const summary=node("summary",section.title,"am-section-toggle");
      details.append(summary);
      if (section.description) details.append(node("p",section.description,"am-muted"));
      const grid=node("div",null,"am-fields");
      for (const question of section.questions) grid.append(renderQuestion(question,previous,readonly));
      details.append(grid);
      editor.append(details);
    });
    const actions=node("div",null,"am-actions");
    if (!readonly) {
      actions.append(button("Guardar borrador",()=>{void saveCurrent();},"am-btn am-primary"));
      actions.append(button("Marcar como revisada",()=>{void reviewCurrent();},"am-btn"));
    }
    actions.append(button("Copiar para informe",()=>{void copyForReport();},"am-btn"));
    actions.append(button("Imprimir / guardar PDF",()=>{void printRecord();},"am-btn"));
    editor.append(actions);
    updateProgress();
  }
  function updateDirty() {
    if (!record || record.status==="reviewed") return;
    dirty=true;
    changeCounter++;
    notify("Cambios pendientes. Guardado automático en curso…");
    clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>{ void saveCurrent(); },1300);
  }
  function renderRecords() {
    const selected=record?.id||"";
    recordsSelect.replaceChildren();
    if (!records.length) recordsSelect.add(new Option("No hay anamnesis iniciadas",""));
    for (const item of records) {
      const label=(TYPES[item.assessment_type]?.title||item.assessment_type)
        +" · "+(statusNames[item.status]||item.status)+" · "+formatDate(item.created_at);
      recordsSelect.add(new Option(label,item.id));
    }
    recordsSelect.disabled=!records.length;
    recordsSelect.value=selected||records[0]?.id||"";
  }
  function renderEditor() {
    editor.replaceChildren();
    if (!record) {
      editor.append(node("p","Selecciona el tipo de valoración para iniciar una anamnesis, o abre una evaluación anterior.","am-empty"));
      return;
    }
    const readonly=record.status==="reviewed";
    const header=node("div",null,"am-record-head");
    const text=node("div");
    text.append(node("h4",TYPES[record.assessment_type]?.title||"Valoración"));
    text.append(node("p",(statusNames[record.status]||record.status)+" · Iniciada "+formatDate(record.created_at)+" · Última actualización "+formatDate(record.updated_at)+" · Revisión "+record.revision,"am-muted"));
    header.append(text);
    editor.append(header);
    if (readonly) editor.append(node("p","Registro revisado y bloqueado. Para incorporar nueva información abre una nueva evaluación: la anterior se conserva íntegra.","am-readonly"));
    else editor.append(node("p","Puedes completar esta entrevista en varias sesiones. Los cambios se guardan automáticamente y también puedes guardarlos manualmente.","am-help"));

    const existing=record.answers||{};
    for (const section of sectionList(record.assessment_type)) {
      const fieldset=node("fieldset",null,"am-section");
      fieldset.append(node("legend",section.title));
      if (section.description) fieldset.append(node("p",section.description,"am-muted"));
      const grid=node("div",null,"am-fields");
      for (const [key,labelText] of section.fields) {
        const label=node("label");
        label.append(node("span",labelText));
        const area=node("textarea");
        area.rows=3;
        area.maxLength=4000;
        area.dataset.amField=key;
        area.value=typeof existing[key]==="string"?existing[key]:"";
        area.placeholder="Anotaciones clínicas, ejemplos y fuente de información…";
        area.disabled=readonly;
        area.addEventListener("input",updateDirty);
        label.append(area);
        grid.append(label);
      }
      fieldset.append(grid);
      editor.append(fieldset);
    }
    const actions=node("div",null,"am-actions");
    if (!readonly) {
      actions.append(button("Guardar borrador",()=>{void saveCurrent();},"am-btn am-primary"));
      actions.append(button("Marcar como revisada",()=>{void reviewCurrent();},"am-btn"));
    }
    actions.append(button("Copiar para informe",()=>{void copyForReport();},"am-btn"));
    actions.append(button("Imprimir / guardar PDF",()=>{void printRecord();},"am-btn"));
    editor.append(actions);
  }
  async function saveCurrent() {
    clearTimeout(saveTimer);
    if (!record) return false;
    if (record.status==="reviewed") return true;
    if (saving) {
      const ok=await saving;
      if (!ok) return false;
      return dirty ? saveCurrent() : true;
    }
    if (!dirty) return true;
    const target=record;
    const change=changeCounter;
    const snapshot=values();
    const previousRevision=target.revision;
    notify("Guardando la anamnesis…");
    saving=(async()=>{
      try {
        const rows=await api(
          "clinical_anamnesis_records?id=eq."+encodeURIComponent(target.id)
          +"&patient_id=eq."+encodeURIComponent(target.patient_id)
          +"&revision=eq."+previousRevision+"&status=neq.reviewed",
          {method:"PATCH",headers:{Prefer:"return=representation"},
           body:JSON.stringify({answers:snapshot,status:"in_progress"})}
        );
        if (!rows?.length) throw Error("No se guardó: el registro cambió en otra sesión. Conserva este texto y vuelve a cargar antes de sobrescribir.");
        Object.assign(target,rows[0]);
        if (record===target) {
          dirty=change!==changeCounter;
          renderRecords();
          notify(dirty ? "Hay cambios nuevos pendientes de guardar." : "Guardado correctamente · "+formatDate(target.updated_at));
        }
        return true;
      } catch(e) {
        if (record===target) notify(e.message||"Error de guardado.",true);
        return false;
      }
    })();
    let success=false;
    try { success=await saving; return success; }
    finally {
      saving=null;
      if (success && dirty && record===target) {
        clearTimeout(saveTimer);
        saveTimer=setTimeout(()=>{void saveCurrent();},2000);
      }
    }
  }
  async function reviewCurrent() {
    if (!record||record.status==="reviewed") return;
    if (!confirm("¿Marcar esta anamnesis como revisada? Se bloqueará para evitar modificaciones retrospectivas. Las ampliaciones se documentarán en una nueva evaluación.")) return;
    if (!await saveCurrent()) return;
    const sourceOk=Array.isArray(record.answers?.fuentes)
      ? record.answers.fuentes.length>0
      : Boolean(String(record.answers?.fuentes||"").trim());
    if (!record.answers?.motivo || !sourceOk || Object.keys(record.answers||{}).length<3) {
      notify("Antes de cerrar, documenta el motivo, las fuentes y al menos un hallazgo clínico pertinente.",true);
      return;
    }
    if (String(record.protocol_version||"1.0")!=="1.0") {
      const all=formSections(record)?.flatMap(section=>section.questions)||[];
      const answered=all.filter(question=>hasAnswer(record.answers?.[question.key])).length;
      if (answered<12) {
        notify("Completa al menos 12 campos, incluidos motivo y fuentes, antes de marcar la anamnesis como revisada.",true);
        return;
      }
      if (answered<Math.ceil(all.length*0.65) &&
          !confirm("Se han cumplimentado "+answered+" de "+all.length+" campos. ¿Marcar como revisada a pesar de la información no explorada? Esta decisión quedará reflejada en el registro.")) return;
    }
    const target=record;
    try {
      const rows=await api(
        "clinical_anamnesis_records?id=eq."+encodeURIComponent(target.id)+"&revision=eq."+target.revision+"&status=neq.reviewed",
        {method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({status:"reviewed"})}
      );
      if (!rows?.length) throw Error("No se pudo cerrar. Comprueba si otro dispositivo ha actualizado la evaluación.");
      Object.assign(target,rows[0]);
      dirty=false;
      renderRecords();
      renderEditor();
      notify("Anamnesis revisada y bloqueada.");
    } catch(e) { notify(e.message,true); }
  }
  async function selectRecord(id) {
    if (record?.id===id) return;
    const previous=record;
    if (dirty&&!await saveCurrent()) { recordsSelect.value=previous.id; return; }
    record=records.find(item=>item.id===id)||null;
    dirty=false;changeCounter=0;
    renderRecords();
    renderEditor();
    notify(record?"Evaluación abierta.":"");
  }
  async function startAssessment() {
    if (loading||!patientId) return;
    const type=typeSelect.value;
    if (!type) { notify("Selecciona primero el tipo de valoración.",true); return; }
    if (type==="tdah") {
      window.ClinicPatientWorkspace?.activate?.("evaluacion");
      document.querySelector("#adhd-assessment-module")?.scrollIntoView({block:"nearest",behavior:"smooth"});
      return;
    }
    const error=permitted(type);
    if (error) { notify(error,true); return; }
    if (!bank()?.profiles?.[type]) {
      notify("No se ha cargado la plantilla estructurada. Actualiza la página antes de iniciar.",true);
      return;
    }
    const existing=records.find(item=>item.assessment_type===type
      && item.status!=="reviewed" && String(item.protocol_version)==="2.0");
    if (existing) {
      await selectRecord(existing.id);
      notify("Se ha abierto la anamnesis estructurada en curso para evitar duplicados.");
      return;
    }
    const earlier=records.find(item=>item.assessment_type===type
      && item.status!=="reviewed" && String(item.protocol_version||"1.0")==="1.0");
    if (earlier &&
        !confirm("Existe una entrevista anterior (versión 1.0) de esta valoración. Se conservará sin cambios. ¿Quieres iniciar un nuevo formulario estructurado 2.0 independiente?")) {
      await selectRecord(earlier.id); return;
    }
    if (dirty&&!await saveCurrent()) return;
    loading=true;
    try {
      const rows=await api("clinical_anamnesis_records",
        {method:"POST",headers:{Prefer:"return=representation"},
         body:JSON.stringify({patient_id:patientId,assessment_type:type,protocol_version:"2.0",status:"draft",answers:{}})}
      );
      if (!rows?.[0]) throw Error("No se confirmó la creación de la anamnesis.");
      records.unshift(rows[0]);
      record=rows[0];dirty=false;changeCounter=0;
      renderRecords();renderEditor();
      notify("Nueva anamnesis creada. Puedes empezar a registrar la entrevista.");
    } catch(e) {notify(e.message,true);}
    finally {loading=false;}
  }
  function reportText() {
    if (!record) return "";
    const out=[
      "REGISTRO DE ANAMNESIS · "+(TYPES[record.assessment_type]?.title||record.assessment_type),
      "Paciente: "+(document.querySelector("#clinic-patient-name")?.textContent||""),
      "Fecha de apertura: "+formatDate(record.created_at),
      "Estado: "+(statusNames[record.status]||record.status),
      "Última actualización: "+formatDate(record.updated_at),
      "Versión de formulario: "+record.protocol_version+" · Revisión de registro: "+record.revision,
      "Origen: entrevista y documentación clínica. Pendiente de integración y revisión profesional.",
      ""
    ];
    const sections=formSections(record)||[];
    for (const section of sections) {
      const items=section.questions.filter(question=>hasAnswer(record.answers?.[question.key]));
      if (!items.length) continue;
      out.push(section.title.toUpperCase());
      for (const question of items) {
        const answer=record.answers[question.key];
        const display=Array.isArray(answer)?answer.join(", "):String(answer);
        out.push(question.label+"\n"+display+"\n");
      }
    }
    return out.join("\n");
  }
  async function copyForReport() {
    if (!record) return;
    if (dirty&&!await saveCurrent()) return;
    const summary=reportText();
    try {
      await navigator.clipboard.writeText(summary);
      notify("Síntesis copiada para incorporarla al informe. Revisa la integración antes de emitirlo.");
    } catch {
      const area=node("textarea");area.value=summary;area.className="am-copy-fallback";
      editor.append(area);area.focus();area.select();
      notify("Selecciona y copia el texto que aparece al final; el portapapeles automático no está disponible.",true);
    }
  }
  async function printRecord() {
    if (!record) return;
    // Abrir sin esperar a una promesa preserva el permiso de ventana emergente en móvil.
    const windowPrint=window.open("","anamnesis_print","width=900,height=760");
    if (!windowPrint) {notify("El navegador ha bloqueado la ventana de impresión. Utiliza «Copiar para informe».",true);return;}
    if (dirty&&!await saveCurrent()) {windowPrint.close();return;}
    const doc=windowPrint.document;
    doc.title="Anamnesis clínica";
    const style=doc.createElement("style");
    style.textContent="body{font:12px/1.55 Arial,sans-serif;color:#1e293b;margin:35px auto;max-width:760px}h1{font-size:20px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}button{padding:10px 16px;border:1px solid #475569;background:white;border-radius:8px;cursor:pointer}@media print{button{display:none}body{margin:0;max-width:none}}";
    doc.head.append(style);
    const h=doc.createElement("h1");h.textContent="Anamnesis de valoración";
    const pre=doc.createElement("pre");pre.textContent=reportText();
    const printButton=doc.createElement("button");printButton.type="button";printButton.textContent="Imprimir o guardar como PDF";printButton.addEventListener("click",()=>windowPrint.print());
    doc.body.replaceChildren(h,pre,printButton);
    windowPrint.focus();
    windowPrint.print();
    notify("Vista de impresión preparada. Selecciona «Guardar como PDF» en el navegador.");
  }
  async function loadPatient(force=false) {
    if (!root) return;
    const next=document.querySelector("#clinic-patient-id")?.value||"";
    const dialog=document.querySelector("#clinic-patient-dialog");
    if (!next||dialog?.hidden) return;
    if (next===patientId && !force) return;
    if (dirty&&!await saveCurrent()) {
      if (record && patientId) recoveries.set(patientId,{
        recordId:record.id, assessmentType:record.assessment_type,
        revision:record.revision, answers:values()
      });
      clearTimeout(saveTimer);
      dirty=false;
    }
    const generation=++loadCounter;
    patientId=next;birthDate=null;records=[];record=null;dirty=false;changeCounter=0;
    editor.replaceChildren(node("p","Cargando anamnesis…","am-muted"));
    renderRecords();notify("Consultando registros privados…");
    try {
      const [patient,items]=await Promise.all([
        api("clinical_patients?select=birth_date&id=eq."+encodeURIComponent(next)+"&limit=1"),
        api("clinical_anamnesis_records?select=id,patient_id,assessment_type,status,protocol_version,answers,revision,reviewed_at,created_at,updated_at&patient_id=eq."+encodeURIComponent(next)+"&order=created_at.desc&limit=50")
      ]);
      if (generation!==loadCounter||patientId!==next) return;
      birthDate=patient?.[0]?.birth_date||null;
      records=Array.isArray(items)?items:[];
      record=records[0]||null;
      const recovery=recoveries.get(next);
      let recovered=false;
      if (recovery) {
        const previous=records.find(item=>item.id===recovery.recordId);
        if (previous && previous.revision===recovery.revision && previous.status!=="reviewed") {
          previous.answers=recovery.answers;
          record=previous;
          dirty=true;changeCounter++;
          recoveries.delete(next);
          recovered=true;
        }
      }
      renderRecords();renderEditor();
      if (recovered) {
        notify("Borrador sin guardar recuperado para este paciente. Revisa y pulsa «Guardar borrador» para conservarlo.",true);
      } else if (recovery) {
        const details=node("details",null,"am-recovery");
        details.append(node("summary","Hay cambios pendientes de recuperar de esta evaluación"));
        details.append(node("p","Otro cambio pudo haber modificado el registro. Copia y contrasta estas anotaciones antes de incorporarlas; no se sobrescribirá nada automáticamente."));
        const area=node("textarea");area.rows=10;area.readOnly=true;
        area.value=Object.entries(recovery.answers).map(([key,value])=>key+": "+value).join("\n\n");
        details.append(area);
        editor.prepend(details);
        notify("Se han conservado anotaciones de esta ficha en memoria temporal. Revisa las diferencias.",true);
      } else {
        notify(records.length?records.length+" proceso(s) de anamnesis disponible(s).":"Todavía no hay anamnesis específicas para este paciente.");
      }
    } catch(e) { if(generation===loadCounter) {editor.replaceChildren();notify(e.message,true);} }
  }
  function mount() {
    if (root) return true;
    const panel=document.querySelector("#clinic-panel-anamnesis");
    const dialog=document.querySelector("#clinic-patient-dialog");
    if (!panel||!dialog) return false;
    root=node("section",null,"am-module");root.id="clinic-anamnesis-module";
    root.append(node("h3","Anamnesis y evaluaciones"));
    root.append(node("p","Formularios de entrevista clínica especializados, con casillas, desplegables, fechas y campos para ejemplos. Información privada vinculada a cada paciente; no se comparte con su portal. El formulario no sustituye pruebas estandarizadas ni el juicio clínico.","am-intro"));
    const top=node("div",null,"am-toolbar");
    const newBox=node("label",null,"am-control");
    newBox.append(node("span","Tipo de valoración"));
    typeSelect=node("select");
    typeSelect.add(new Option("Selecciona una valoración…",""));
    for (const [key,item] of Object.entries(TYPES)) typeSelect.add(new Option(item.title,key));
    typeSelect.add(new Option("TDAH · utilizar evaluación existente","tdah"));
    typeSelect.value="";
    newBox.append(typeSelect);
    const start=button("Iniciar / continuar",()=>{void startAssessment();},"am-btn am-primary");
    top.append(newBox,start);
    const pastBox=node("label",null,"am-control");
    pastBox.append(node("span","Anamnesis del paciente"));
    recordsSelect=node("select");
    recordsSelect.addEventListener("change",()=>{void selectRecord(recordsSelect.value);});
    pastBox.append(recordsSelect);
    const refresh=button("Actualizar",()=>{void loadPatient(true);},"am-btn");
    top.append(pastBox,refresh);
    root.append(top);
    statusNode=node("p","","am-status");statusNode.setAttribute("role","status");statusNode.setAttribute("aria-live","polite");
    root.append(statusNode);
    editor=node("div",null,"am-editor");
    root.append(editor);
    panel.append(root);
    renderRecords();renderEditor();
    const check=()=>{void loadPatient();};
    window.addEventListener("clinical:patient-opened",check);
    window.addEventListener("clinic-anamnesis-forms-ready",()=>{
      if(root&&record&&String(record.protocol_version||"1.0")!=="1.0"&&!dirty) renderEditor();
    });
    new MutationObserver(check).observe(dialog,{attributes:true,attributeFilter:["hidden"]});
    document.querySelector("#clinic-patient-close")?.addEventListener("click",()=>{
      clearTimeout(saveTimer);
      if (dirty) void saveCurrent();
    });
    window.addEventListener("beforeunload",event=>{
      if (dirty || recoveries.size) { event.preventDefault(); event.returnValue=""; }
    });
    void loadPatient();
    return true;
  }
  function init() {
    if (mount()) return;
    const observer=new MutationObserver(()=>{if(mount()) observer.disconnect();});
    observer.observe(document.body,{subtree:true,childList:true});
    setTimeout(()=>observer.disconnect(),20000);
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();