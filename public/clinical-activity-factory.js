(() => {
  "use strict";
  const SUPABASE_URL="https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL=SUPABASE_URL+"/rest/v1";
  const AUTH_URL=SUPABASE_URL+"/auth/v1";
  const AI_URL=SUPABASE_URL+"/functions/v1/generate-clinical-activity-ai";
  const KEY="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY="dememoria_admin_session";
  const ALLOWED_USER_ID="9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  const labels={
    area:{ansiedad:"Ansiedad",depresion:"Depresión",duelo:"Duelo",trauma:"Trauma",relaciones:"Relaciones",autoestima:"Autoestima",regulacion:"Regulación emocional",perfeccionismo:"Perfeccionismo",procrastinacion:"Procrastinación",sueno:"Sueño",dolor:"Dolor crónico",cuidadores:"Cuidadores",tdah:"TDAH",tea:"TEA / neurodivergencia",neuropsicologia:"Adaptación neuropsicológica"},
    process:{rumiacion:"Rumiación",preocupacion:"Preocupación",incertidumbre:"Intolerancia a la incertidumbre",evitacion:"Evitación",reaseguro:"Búsqueda de reaseguro",seguridad:"Conductas de seguridad",catastrofismo:"Catastrofismo",hipervigilancia:"Hipervigilancia",control:"Necesidad de control",autocritica:"Autocrítica",perfeccionismo:"Perfeccionismo",inactividad:"Inactividad / retirada",fusion:"Fusión cognitiva",rigidez:"Rigidez cognitiva",limites:"Dificultad para poner límites",regulacion:"Regulación emocional",decisiones:"Indecisión",dolor:"Afrontamiento del dolor"},
    goal:{observar:"Identificar patrón",psicoeducar:"Psicoeducar",flexibilizar:"Flexibilizar interpretación",tolerar:"Aumentar tolerancia",exponerse:"Reducir evitación / exponerse",regular:"Regular emoción",activar:"Activación conductual",limites:"Entrenar límites",comunicar:"Mejorar comunicación",decidir:"Tomar decisiones",valores:"Clarificar valores",autocompasion:"Reducir autocrítica",prevencion:"Prevención de recaídas"},
    format:{hoja:"Hoja de trabajo",registro:"Registro",experimento:"Experimento conductual",roleplay:"Role-play",mapa:"Mapa visual",tarjetas:"Tarjetas",experiencial:"Ejercicio experiencial"},
    approach:{integrativo:"Integrativo",tcc:"TCC",act:"ACT",dbt:"DBT",metacognitiva:"Metacognitiva",cft:"CFT / compasión"}
  };
  const processRules={
    rumiacion:{mechanisms:["metacognición","flexibilidad atencional"],techniques:["discriminación funcional","cambio atencional"],format:"experiencial"},
    preocupacion:{mechanisms:["metacognición","solución de problemas"],techniques:["discriminación preocupación-problema","aplazamiento"],format:"hoja"},
    incertidumbre:{mechanisms:["tolerancia a la incertidumbre","aprendizaje experiencial"],techniques:["microexposición a incertidumbre","prevención de comprobación"],format:"experimento"},
    evitacion:{mechanisms:["aprendizaje inhibitorio","aproximación conductual"],techniques:["exposición graduada","experimento conductual"],format:"experimento"},
    reaseguro:{mechanisms:["tolerancia a la incertidumbre","prevención de respuesta"],techniques:["reducción graduada de reaseguro","experimento conductual"],format:"experimento"},
    seguridad:{mechanisms:["aprendizaje inhibitorio","desconfirmación experiencial"],techniques:["retirada de conductas de seguridad","exposición"],format:"experimento"},
    catastrofismo:{mechanisms:["flexibilidad cognitiva","contraste predictivo"],techniques:["diálogo socrático","predicción vs resultado"],format:"hoja"},
    hipervigilancia:{mechanisms:["flexibilidad atencional","discriminación de señales"],techniques:["entrenamiento atencional","observación contextual"],format:"experiencial"},
    control:{mechanisms:["aceptación","flexibilidad psicológica"],techniques:["círculos de control","acción con incertidumbre"],format:"mapa"},
    autocritica:{mechanisms:["autocompasión","distanciamiento cognitivo"],techniques:["diálogo compasivo","perspectiva alternativa"],format:"experiencial"},
    perfeccionismo:{mechanisms:["flexibilidad conductual","aprendizaje experiencial"],techniques:["experimento de suficiencia","reducción de sobrepreparación"],format:"experimento"},
    inactividad:{mechanisms:["activación conductual","refuerzo"],techniques:["programación de actividad","pasos mínimos"],format:"registro"},
    fusion:{mechanisms:["defusión","flexibilidad psicológica"],techniques:["defusión verbal","observación de pensamiento"],format:"experiencial"},
    rigidez:{mechanisms:["flexibilidad cognitiva","variabilidad conductual"],techniques:["generación de alternativas","experimento"],format:"hoja"},
    limites:{mechanisms:["habilidades interpersonales","autonomía"],techniques:["role-play","ensayo conductual"],format:"roleplay"},
    regulacion:{mechanisms:["regulación emocional","tolerancia al malestar"],techniques:["observación emocional","elección de respuesta"],format:"experiencial"},
    decisiones:{mechanisms:["tolerancia a la incertidumbre","solución de problemas"],techniques:["criterios de decisión","acción suficiente"],format:"hoja"},
    dolor:{mechanisms:["flexibilidad psicológica","activación graduada"],techniques:["pacing","acción orientada a valores"],format:"registro"}
  };
  const areaCodes={ansiedad:"ANS",depresion:"DEP",duelo:"DUE",trauma:"TRA",relaciones:"REL",autoestima:"AUT",regulacion:"EMO",perfeccionismo:"PER",procrastinacion:"PRO",sueno:"SUE",dolor:"DOL",cuidadores:"CUI",tdah:"TDA",tea:"TEA",neuropsicologia:"NEU"};
  const processCodes={rumiacion:"RUM",preocupacion:"PRE",incertidumbre:"INC",evitacion:"EVA",reaseguro:"REA",seguridad:"SEG",catastrofismo:"CAT",hipervigilancia:"HIP",control:"CON",autocritica:"ACR",perfeccionismo:"PER",inactividad:"INA",fusion:"FUS",rigidez:"RIG",limites:"LIM",regulacion:"REG",decisiones:"DEC",dolor:"DOL"};
  let mode="guided", current=null, variants=[];
  function session(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");}catch{return null}}
  function headers(extra={}){const s=session();return {apikey:KEY,Authorization:"Bearer "+(s?.access_token||""),"Content-Type":"application/json",...extra}}
  async function api(path,options={}){const r=await fetch(REST_URL+"/"+path,{cache:"no-store",...options,headers:headers(options.headers||{})});const b=r.status===204?null:await r.json().catch(()=>null);if(!r.ok)throw new Error(b?.message||b?.hint||"No se ha podido completar la operación.");return b}
  async function validateSession(){const s=session();if(!s?.access_token)return false;const r=await fetch(AUTH_URL+"/user",{headers:{apikey:KEY,Authorization:"Bearer "+s.access_token},cache:"no-store"});if(!r.ok)return false;const u=await r.json();return u?.id===ALLOWED_USER_ID}
  const value=id=>$(id)?.value||"";
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  function setMode(next){mode=next;$$("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===next));["guided","clinical","surprise"].forEach(x=>$("#factory-"+x+"-panel").hidden=x!==next)}
  function infer(text){
    const t=text.toLowerCase();
    const pick=(pairs,fallback)=>pairs.find(([words])=>words.some(w=>t.includes(w)))?.[1]||fallback;
    return {
      area:pick([[["duelo","pérdida","fallec"],"duelo"],[["pareja","relación","límite","conflicto"],"relaciones"],[["autoestima","autocrít","culpa","vergüenza"],"autoestima"],[["trauma","abuso","agresión"],"trauma"],[["dolor","brux","fibrom"],"dolor"],[["depres","apatía","anhedonia"],"depresion"]],"ansiedad"),
      process:pick([[["rumia","dar vueltas","sobrepens"],"rumiacion"],[["incertid","certeza","no saber"],"incertidumbre"],[["evit","cancel","no voy"],"evitacion"],[["reasegur","pregunta","confirm"],"reaseguro"],[["comprob","revis"],"seguridad"],[["control"],"control"],[["autocrít","exig"],"autocritica"],[["perfeccion"],"perfeccionismo"],[["límite","asert"],"limites"],[["decid","indecis"],"decisiones"]],"preocupacion"),
      goal:pick([[["límite","asert"],"limites"],[["evit","expos"],"exponerse"],[["decid"],"decidir"],[["regul","desbord"],"regular"],[["autocrít","compas"],"autocompasion"],[["activar","apatía"],"activar"]],"tolerar")
    }
  }
  function spec(){
    if(mode==="clinical"){const x=infer(value("#factory-clinical-text"));return {...x,phase:"intervencion",approach:"integrativo",format:"auto",population:value("#factory-clinical-population"),duration:Number(value("#factory-clinical-duration")),use:"sesion",depth:"intermedia",context:value("#factory-clinical-text")}}
    if(mode==="surprise"){return {area:value("#factory-surprise-area"),process:value("#factory-surprise-process"),goal:"flexibilizar",phase:"intervencion",approach:"integrativo",format:"auto",population:"adulto",duration:20,use:"sesion",depth:"intermedia",context:""}}
    return {area:value("#factory-area"),process:value("#factory-process"),goal:value("#factory-goal"),phase:value("#factory-phase"),approach:value("#factory-approach"),format:value("#factory-format"),population:value("#factory-population"),duration:Number(value("#factory-duration")),use:value("#factory-use"),depth:value("#factory-depth"),context:value("#factory-context")}
  }
  function formatFor(s,override){return override&&override!=="auto"?override:(s.format!=="auto"?s.format:(processRules[s.process]?.format||"hoja"))}
  function titleFor(s,format){
    const p=labels.process[s.process]||"Proceso";
    const stems={experimento:"Ponerlo a prueba",roleplay:"Ensayar otra respuesta",mapa:"Mapa del patrón",registro:"Observar para elegir",experiencial:"Hacer espacio y elegir",hoja:"Del bucle a una respuesta útil",tarjetas:"Opciones cuando aparece el patrón"};
    return `${stems[format]||"Actividad clínica"} · ${p}`;
  }
  function buildSteps(s,format){
    const process=labels.process[s.process]||s.process, goal=labels.goal[s.goal]||s.goal;
    const common=[
      `Delimitar una situación reciente en la que aparezca ${process.toLowerCase()}.`,
      "Identificar qué intenta conseguir la respuesta habitual y qué alivio produce a corto plazo.",
      `Introducir una alternativa coherente con el objetivo: ${goal.toLowerCase()}.`,
      "Comparar la predicción inicial con lo observado durante la práctica.",
      "Cerrar con una conclusión breve y una conducta concreta para probar después."
    ];
    if(format==="roleplay") return ["Elegir una escena interpersonal concreta.","Definir qué necesita comunicar o proteger la persona.","Representar primero la respuesta habitual.","Construir una respuesta alternativa breve, específica y observable.","Repetir el ensayo aumentando ligeramente la dificultad.","Acordar una situación realista para practicar."];
    if(format==="experimento") return ["Formular una predicción concreta antes de actuar.","Identificar la conducta protectora habitual.","Diseñar una prueba pequeña, segura y graduada reduciendo esa protección.","Realizar o ensayar la prueba.","Registrar qué ocurrió realmente.","Extraer un aprendizaje y decidir el siguiente nivel."];
    if(format==="mapa") return ["Situar el disparador.","Registrar interpretación, emoción y urgencia de actuar.","Identificar la respuesta protectora.","Anotar beneficio inmediato y coste posterior.","Marcar dos puntos posibles de intervención.","Elegir uno para experimentar esta semana."];
    if(format==="registro") return ["Elegir una conducta o momento diana.","Registrar contexto y nivel de dificultad de forma breve.","Anotar qué hizo la persona y con qué función.","Registrar consecuencia inmediata y posterior.","Buscar patrones al final de varios registros.","Elegir un pequeño ajuste para el siguiente intento."];
    if(format==="experiencial") return ["Evocar una situación de intensidad tolerable.","Observar durante unos segundos pensamiento, emoción, cuerpo e impulso sin modificarlos.","Nombrar qué está intentando conseguir la mente.","Introducir una respuesta alternativa breve.","Practicarla manteniendo contacto con la experiencia.","Describir qué cambió en la relación con el malestar, no solo en su intensidad."];
    return common;
  }
  function createActivity(s,formatOverride){
    const rule=processRules[s.process]||{mechanisms:["conciencia funcional"],techniques:["análisis funcional"],format:"hoja"};
    const format=formatFor(s,formatOverride), title=titleFor(s,format), area=labels.area[s.area]||s.area, process=labels.process[s.process]||s.process, goal=labels.goal[s.goal]||s.goal, approach=labels.approach[s.approach]||s.approach;
    const steps=buildSteps(s,format);
    const rationale=`Actividad para trabajar ${process.toLowerCase()} desde ${approach}, priorizando ${rule.mechanisms.join(" y ")}. El objetivo no es forzar una reducción inmediata del malestar, sino modificar la respuesta que puede estar manteniendo el patrón.`;
    const professional={
      purpose:`Trabajar ${process.toLowerCase()} con el objetivo de ${goal.toLowerCase()} mediante una intervención de ${s.duration} minutos aproximadamente.`,
      rationale,
      mechanisms:rule.mechanisms,
      techniques:rule.techniques,
      indications:[`El proceso ${process.toLowerCase()} aparece como diana clínicamente relevante.`,"El paciente puede observar una situación concreta sin desorganización intensa.","Existe margen para realizar una micropráctica o análisis funcional en sesión."],
      cautions:["Ajustar la intensidad si aumenta significativamente la activación.","No presentar la hipótesis funcional como una explicación cerrada.","Evitar convertir la actividad en una tarea de control o monitorización excesiva."],
      steps,
      questions:["¿Qué intentabas conseguir con tu respuesta habitual?","¿Qué alivió a corto plazo?","¿Qué coste tuvo después?","¿Qué sería diferente si no necesitaras resolver o controlar esto del mismo modo?","¿Qué prueba pequeña tendría sentido hacer ahora?"],
      close:"Resumir en una frase el patrón observado y acordar una conducta concreta, pequeña y verificable."
    };
    const patient={
      intro:`Vamos a observar cómo aparece ${process.toLowerCase()} y probar una manera diferente de responder. No buscamos hacerlo perfecto ni eliminar de inmediato lo que sientes.`,
      steps:steps.map((x,i)=>i===0?x:x.replace(/la persona|el paciente/gi,"tú")),
      reflection:["¿Qué has observado que antes pasaba más desapercibido?","¿Qué te ayudó a corto plazo pero quizá te mantuvo atrapado/a después?","¿Qué quieres probar de forma diferente?"],
      homework:s.use==="sesion"?"Opcional: prueba una vez la alternativa acordada antes de la próxima sesión.":"Repite la práctica en un máximo de tres situaciones y anota brevemente qué ocurrió."
    };
    return {id:null,title,summary:rationale,instructions:patient.intro+"\n\n"+steps.map((x,i)=>`${i+1}. ${x}`).join("\n")+"\n\n"+patient.homework,professional,patient,spec:{...s,format},rule,format};
  }
  function render(a){
    current=a;$("#factory-empty").hidden=true;$("#factory-output").hidden=false;$("#factory-save").disabled=false;
    $("#factory-output-title").value=a.title;$("#factory-output-code").textContent=a.aiModel?"Borrador enriquecido con IA · código al guardar":"Borrador generado · código al guardar";
    const aiMeta=a.aiModel?` · IA: ${a.aiModel}`:"";
    $("#factory-output-meta").textContent=`${labels.area[a.spec.area]||a.spec.area} · ${labels.process[a.spec.process]||a.spec.process} · ${labels.format[a.format]||a.format} · ${a.spec.duration} min${aiMeta}`;
    $("#factory-professional-preview").innerHTML=`<h2>Finalidad clínica</h2><p>${esc(a.professional.purpose)}</p><div class="factory-callout">${esc(a.professional.rationale)}</div><h2>Mecanismos de cambio</h2><p>${esc(a.professional.mechanisms.join(" · "))}</p><h2>Técnicas</h2><p>${esc(a.professional.techniques.join(" · "))}</p><h2>Indicaciones</h2><ul>${a.professional.indications.map(x=>"<li>"+esc(x)+"</li>").join("")}</ul><h2>Precauciones</h2><ul>${a.professional.cautions.map(x=>"<li>"+esc(x)+"</li>").join("")}</ul><h2>Aplicación</h2><ol>${a.professional.steps.map(x=>"<li>"+esc(x)+"</li>").join("")}</ol><h2>Preguntas de profundización</h2><ul>${a.professional.questions.map(x=>"<li>"+esc(x)+"</li>").join("")}</ul><h2>Cierre</h2><p>${esc(a.professional.close)}</p>`;
    $("#factory-patient-preview").innerHTML=`<h2>${esc(a.title)}</h2><p>${esc(a.patient.intro)}</p><ol>${a.patient.steps.map(x=>"<li>"+esc(x)+"</li>").join("")}</ol><h2>Para cerrar</h2><ul>${a.patient.reflection.map(x=>"<li>"+esc(x)+"</li>").join("")}</ul><div class="factory-callout"><strong>Entre sesiones</strong><br>${esc(a.patient.homework)}</div>`;
  }
  function renderVariants(list){
    variants=list;const host=$("#factory-variants-preview");host.innerHTML=list.map((a,i)=>`<article class="factory-variant"><h3>${esc(a.title)}</h3><p>${esc(labels.format[a.format]||a.format)} · ${esc(a.professional.mechanisms.join(" · "))}</p><button class="factory-primary" type="button" data-use-variant="${i}">Usar esta propuesta</button></article>`).join("");
    host.querySelectorAll("[data-use-variant]").forEach(b=>b.addEventListener("click",()=>{render(list[Number(b.dataset.useVariant)]);showPreview("professional")}))
  }
  function showPreview(name){$("[data-preview]").forEach(b=>b.classList.toggle("active",b.dataset.preview===name));$("#factory-professional-preview").hidden=name!=="professional";$("#factory-patient-preview").hidden=name!=="patient";$("#factory-variants-preview").hidden=name!=="variants"}
  async function enrichWithAI(activity){
    const response=await fetch(AI_URL,{method:"POST",headers:headers(),body:JSON.stringify({base:activity,spec:activity.spec})});
    const body=await response.json().catch(()=>({}));
    if(!response.ok){
      const error=new Error(body?.error||"No se ha podido enriquecer con IA.");
      error.code=body?.code||"";
      throw error;
    }
    const enriched=body.enriched;
    return {
      ...activity,
      title:enriched.title,
      summary:enriched.summary,
      professional:enriched.professional,
      patient:enriched.patient,
      instructions:enriched.patient.intro+"\n\n"+enriched.patient.steps.map((x,i)=>`${i+1}. ${x}`).join("\n")+"\n\n"+enriched.patient.homework,
      aiModel:body.model,
      aiEnrichedAt:new Date().toISOString()
    };
  }
  async function enrichCurrent(){
    if(!current)return;
    $("#factory-message").textContent="Enriqueciendo con IA…";
    $("#factory-ai-refresh").disabled=true;
    try{
      current=await enrichWithAI(current);
      render(current);
      $("#factory-message").textContent="Versión enriquecida con IA. Revisa el contenido antes de guardarlo.";
    }catch(error){
      $("#factory-message").textContent=error.code==="ai_not_configured"
        ?"El motor clínico está operativo. Falta configurar la clave de IA para activar el enriquecimiento."
        :error.message;
    }finally{$("#factory-ai-refresh").disabled=false}
  }
  async function generate(){
    const s=spec();
    if(mode==="surprise"){
      const choices=["experimento","experiencial","hoja"];
      const list=choices.map(f=>createActivity({...s,format:f},f));render(list[0]);renderVariants(list);showPreview("variants");
      $("#factory-message").textContent="Tres arquitecturas generadas. Elige una y, si quieres, enriquécela con IA.";
      return;
    }
    const base=createActivity(s);
    render(base);
    renderVariants([createActivity({...s,format:"experimento"},"experimento"),createActivity({...s,format:"experiencial"},"experiencial"),createActivity({...s,format:"hoja"},"hoja")]);
    showPreview("professional");
    if($("#factory-use-ai")?.checked){
      await enrichCurrent();
    }else{
      $("#factory-message").textContent="Actividad generada con el motor clínico.";
    }
  }
  async function nextCode(a){
    const area=areaCodes[a.spec.area]||"CLI",proc=processCodes[a.spec.process]||"GEN",prefix=`ACT-${area}-${proc}-`;
    const rows=await api(`clinical_exercise_templates?select=activity_code&activity_code=like.${encodeURIComponent(prefix+"%")}`);
    const max=(rows||[]).reduce((acc,row)=>{const n=Number(String(row.activity_code||"").slice(prefix.length));return Number.isFinite(n)?Math.max(acc,n):acc},0);
    return prefix+String(max+1).padStart(4,"0");
  }
  async function save(){
    if(!current)return;
    const title=$("#factory-output-title").value.trim();if(!title)throw new Error("El título no puede quedar vacío.");
    $("#factory-message").textContent="Guardando en biblioteca…";
    const code=await nextCode(current);
    const payload={title,summary:current.summary,instructions:current.instructions,process_tags:[labels.process[current.spec.process]||current.spec.process],duration_minutes:current.spec.duration,burden:"medium",status:"active",activity_code:code,version:1,review_status:"generated",phase:current.spec.phase,area_tags:[labels.area[current.spec.area]||current.spec.area],goal_tags:[labels.goal[current.spec.goal]||current.spec.goal],mechanism_tags:current.professional.mechanisms,approach_tags:[labels.approach[current.spec.approach]||current.spec.approach],technique_tags:current.professional.techniques,format_code:current.format,population:current.spec.population,use_context:current.spec.use,depth:current.spec.depth,structure_level:"structured",professional_content:current.professional,patient_content:current.patient,generation_spec:{...current.spec,ai_model:current.aiModel||null},origin:current.aiModel?"factory_ai":"factory",generated_at:new Date().toISOString(),ai_model:current.aiModel||null,ai_enriched_at:current.aiEnrichedAt||null};
    const saved=await api("clinical_exercise_templates?select=*",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(payload)});
    current.id=saved?.[0]?.id||null;$("#factory-output-code").textContent=`${code} · v1.0 · GENERADA`;$("#factory-message").textContent="Guardada. Ya está disponible en la biblioteca clínica.";
  }
  function adapt(kind){
    if(!current)return;
    if(kind==="shorter"){current.professional.steps=current.professional.steps.slice(0,4);current.patient.steps=current.patient.steps.slice(0,4);current.spec.duration=Math.max(10,Math.min(current.spec.duration,15))}
    if(kind==="experiential"){current=createActivity({...current.spec,format:"experiencial"},"experiencial")}
    if(kind==="homework"){current.spec.use="casa";current.patient.homework="Realiza esta práctica en dos o tres situaciones durante la semana. Registra solo qué ocurrió, qué hiciste diferente y qué aprendiste."}
    render(current);
  }
  function reset(){current=null;variants=[];$("#factory-empty").hidden=false;$("#factory-output").hidden=true;$("#factory-save").disabled=true;$("#factory-message").textContent=""}
  async function init(){const ok=await validateSession();$("#factory-login-required").hidden=ok;$("#factory-app").hidden=!ok;if(!ok)return;$("[data-mode]").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));$("[data-preview]").forEach(b=>b.addEventListener("click",()=>showPreview(b.dataset.preview)));$("[data-adapt]").forEach(b=>b.addEventListener("click",()=>adapt(b.dataset.adapt)));$("#factory-generate").addEventListener("click",()=>generate().catch(e=>$("#factory-message").textContent=e.message));$("#factory-ai-refresh").addEventListener("click",enrichCurrent);$("#factory-save").addEventListener("click",()=>save().catch(e=>$("#factory-message").textContent=e.message));$("#factory-new").addEventListener("click",reset)}
  init().catch(()=>{$("#factory-login-required").hidden=false;$("#factory-app").hidden=true});
})();