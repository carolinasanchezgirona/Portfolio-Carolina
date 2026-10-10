/* Editor neuropsicológico: fichas por función y cuadernos multicomponente de siete días.
 * Estímulos originales y ficticios: son actividades de intervención, no instrumentos psicométricos. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  let variantCounter=0;
  const GROUPS = [
    ["orientacion_temporal","Orientación temporal"],["orientacion_espacial","Orientación espacial"],
    ["orientacion_personal","Orientación personal"],["atencion","Atención"],
    ["memoria","Memoria"],["funciones_ejecutivas","Funciones ejecutivas"],["lenguaje","Lenguaje"],
    ["visuoespacial","Procesamiento visuoespacial"],["praxias_gnosias","Praxias y gnosias"],
    ["calculo","Cálculo funcional"],["cognicion_social","Cognición social"],
    ["velocidad_procesamiento","Velocidad de procesamiento"],["cognicion_funcional","Cognición funcional"]
  ];
  /* Dos formatos con estímulos explícitos por dominio, sin baremos ni ítems de test. */
  const RECIPES = [
    ["orientacion_temporal","Explorar un calendario","Localiza el día de hoy en un calendario verdadero, marca el día anterior y señala qué día viene después.","Días de la semana: lunes | martes | miércoles | jueves | viernes | sábado | domingo.","La fecha actual debe comprobarse con un calendario real; no existe una fecha de respuesta universal.","calendar","Calendario real del mes"],
    ["orientacion_temporal","Organizar una semana","Asocia estas actividades ficticias a un día: paseo el martes, compra el jueves y llamada el sábado. ¿Qué ocurre primero?","Martes | Paseo\nJueves | Compra\nSábado | Llamada","Primero sucede el paseo del martes.","table","Agenda ficticia"],
    ["orientacion_espacial","Leer un plano sencillo","En el plano, indica dónde queda la biblioteca respecto al parque y propón un recorrido de la biblioteca al centro cultural moviéndote por casillas contiguas.","Fila/col|A|B|C\n1|Biblioteca|Calle|Centro cultural\n2|Calle|Parque|Calle\n3|Plaza|Calle|Jardín","La biblioteca (A1) queda al noroeste del parque (B2). Itinerario válido al centro cultural: A1→B1→C1.","table","Lugares del plano"],
    ["orientacion_espacial","Referencias en una habitación","En el plano visto desde arriba, indica qué objeto está detrás de la mesa (hacia el fondo) y cuál está a su izquierda.","Fila/col|Izquierda|Centro|Derecha\nFondo|Lámpara|Silla|Estante\nDelante|Libro|Mesa|Vaso","La silla está detrás de la mesa; el libro está a su izquierda, según las referencias explícitas del plano.","diagram","Referencias espaciales"],
    ["orientacion_personal","Mis preferencias actuales","Elige entre tres actividades agradables (música, paseo, lectura) y explica o señala cuál te apetece hoy.","Música | Paseo | Lectura","No hay respuesta correcta; registrar elección libre sin imponer recuerdos autobiográficos.","table","Preferencias sin datos personales"],
    ["orientacion_personal","Tarjetas de elección","Selecciona una imagen entre cocinar, escuchar música y cuidar plantas para indicar qué actividad deseas hacer.","Cocinar | Música | Plantas","No exigir identificación de familiares, nombres o biografía no verificada.","diagram","Elecciones cotidianas"],
    ["atencion","Cancelación de símbolos","Rodea todas las estrellas de esta secuencia y revisa si has dejado alguna sin marcar.","★ ○ ▲ ★ ◇ ○ ★ △ ★ ○","Hay cuatro estrellas.","table","Búsqueda visual"],
    ["atencion","Buscar diferencias relevantes","Encuentra qué elementos aparecen en la segunda lista pero no en la primera.","Lista A: taza, llave, libro, flor.\nLista B: taza, flor, libro, sombrero.","Aparece sombrero y no aparece llave en la segunda lista.","table","Comparación de listas"],
    ["memoria","Codificación con categorías","Observa durante el tiempo acordado estas seis palabras agrupadas: pera, manzana, plátano / mesa, silla, sofá. Luego recuerda o reconoce las que puedas.","Frutas: pera, manzana, plátano.\nMuebles: mesa, silla, sofá.","Ofrecer claves por categoría o reconocimiento; no exigir seis aciertos.","table","Palabras agrupadas"],
    ["memoria","Recuerdo de una secuencia","Escucha o lee la secuencia ficticia: preparar una bolsa, poner una botella y cerrar la cremallera. Ordena después las tres tarjetas.","Cremallera | Bolsa | Botella","Preparar bolsa, introducir botella y cerrar cremallera.","diagram","Tres pasos para recordar"],
    ["funciones_ejecutivas","Planificación cotidiana","Ordena estos cuatro pasos ficticios para preparar una merienda sin utilizar electrodomésticos.","Recoger | Colocar alimento | Lavarse manos | Preparar plato","Un orden válido: lavarse las manos, preparar plato, colocar alimento y recoger.","diagram","Secuencia funcional"],
    ["funciones_ejecutivas","Flexibilidad de criterios","Agrupa primero por color y después por forma: círculo rojo, triángulo azul, círculo azul y triángulo rojo.","Círculo rojo | Triángulo azul\nCírculo azul | Triángulo rojo","Por color: dos rojos y dos azules; por forma: dos círculos y dos triángulos.","table","Dos reglas para clasificar"],
    ["lenguaje","Asociaciones semánticas","Relaciona cada objeto con su función cotidiana: tijeras, paraguas y reloj.","Objeto|Funciones para elegir\nTijeras|hora, cortar, proteger lluvia\nParaguas|cortar, hora, proteger lluvia\nReloj|proteger lluvia, cortar, hora","Tijeras-cortar, paraguas-lluvia y reloj-hora.","table","Asociación objeto y uso"],
    ["lenguaje","Construir una frase","Ordena estas palabras para crear una oración comprensible, aceptando respuestas orales o señaladas.","palabras: mesa | sobre | el | la | está | libro","El libro está sobre la mesa.","diagram","Tarjetas de palabras"],
    ["visuoespacial","Matriz de posiciones","En la cuadrícula responde dos preguntas distintas: ¿qué elemento aparece a la derecha del círculo? ¿Qué elemento aparece debajo del triángulo?","Triángulo | Cuadrado | Estrella\nCírculo | Rombo | Luna","A la derecha del círculo aparece el rombo; debajo del triángulo aparece el círculo.","table","Cuadrícula espacial"],
    ["visuoespacial","Rotaciones de objetos","Presenta una flecha orientada hacia arriba y pide elegir entre flechas que apuntan arriba, abajo y derecha.","↑ | ↓ | → | ←","La flecha con idéntica orientación es ↑.","table","Dirección de flechas"],
    ["praxias_gnosias","Reconocer objetos por su uso","Lee o escucha los nombres cuchara, peine y vaso. Señala cuál utilizarías habitualmente para beber.","Objeto|Elección\nCuchara|?\nPeine|?\nVaso|?","Señalar el vaso; si es necesario mostrar un objeto real, sin inferir agnosia.","table","Palabras de objetos, no imágenes no disponibles"],
    ["praxias_gnosias","Secuenciar un gesto funcional","Con objetos inocuos, describe o muestra los pasos para doblar una servilleta. La ejecución motora puede sustituirse por ordenar tarjetas.","Extender servilleta | Doblar por mitad | Guardar","Orden: extender, doblar por mitad y guardar.","diagram","Secuencia de acción"],
    ["calculo","Compra simulada","En una tienda ficticia, una manzana cuesta 2 € y un pan cuesta 3 €. ¿Cuánto suman los dos productos?","Producto | Precio\nManzana | 2 €\nPan | 3 €","Total: 5 €, sin inferir capacidad financiera real.","table","Precios ficticios"],
    ["calculo","Leer cantidades","Compara las cantidades 4, 7 y 5. Señala la mayor, la menor y ordénalas.","Cantidad | 4 | 7 | 5\nOrden | ? | ? | ?","Mayor 7, menor 4; orden ascendente 4, 5, 7.","table","Cantidades de ejemplo"],
    ["cognicion_social","Interpretar una situación ambigua","Lee la escena ficticia: una persona no saluda al entrar porque está hablando por teléfono. Propón dos explicaciones alternativas.","Escena: conversación telefónica | ausencia de saludo.","Puede que no te haya visto o que necesitara atender la llamada; ninguna explicación es segura.","diagram","Situación cotidiana"],
    ["cognicion_social","Elegir una respuesta respetuosa","En una escena ficticia, alguien dice que hoy prefiere descansar. Elige una respuesta que respete su preferencia.","Opciones: insistir | preguntar si necesita algo | aceptar y acordar otro momento.","Aceptar su preferencia y preguntar solo si desea ayuda.","table","Opciones de respuesta"],
    ["velocidad_procesamiento","Clasificación con ritmo propio","En la lista siguiente marca todos los números pares sin utilizar cronómetro; ofrece pausas.","2 | 5 | 8 | 3 | 4 | 7 | 6 | 9","Pares: 2, 8, 4 y 6; no interpretar el tiempo como baremo.","table","Números para selección"],
    ["velocidad_procesamiento","Emparejar signos","Encuentra pares idénticos entre estos símbolos: círculo, triángulo, estrella, círculo, rombo, triángulo.","○ | △ | ★ | ○ | ◇ | △","Dos círculos y dos triángulos; ajustar número de estímulos y permitir descansos.","table","Emparejamiento visual"],
    ["cognicion_funcional","Preparar una lista de salida","Selecciona los objetos que corresponden a un paseo ficticio con lluvia: abrigo, paraguas, pelota, libro y llaves.","Abrigo | Paraguas | Pelota | Libro | Llaves","Una selección posible: abrigo, paraguas y llaves; adaptar a contexto real cuando se conozca.","table","Lista de objetos"],
    ["cognicion_funcional","Recordatorio externo","Relaciona tres tareas ficticias con una ayuda externa: cita, compra y tomar nota de una llamada.","Actividad | Apoyo\nCita | Calendario\nCompra | Lista\nLlamada | Bloc de notas","Cita-calendario; compra-lista; llamada-notas. No administrar medicación real.","table","Ayudas externas"]
  ].map(([domain,title,task,stimuli,solution,visualType,visualTitle])=>({
    domain,title,task,stimuli,solution,visualType,visualTitle,
    level:"apoyo_moderado",
    format:["lenguaje","cognicion_social"].includes(domain)?"verbal":
      ["cognicion_funcional","orientacion_personal"].includes(domain)?"funcional":"visual"
  }));
  const catalog=()=>RECIPES.concat(Array.isArray(window.NeuroGradedRecipes)?window.NeuroGradedRecipes:[]);
  const LEVEL_NAMES={apoyo_alto:"Inicial",apoyo_moderado:"Intermedio",autonomo:"Avanzado"};
  const FORMAT_NAMES={mixto:"Variado",visual:"Visual",verbal:"Verbal",funcional:"Funcional",logico:"Razonamiento"};
  const label = value => GROUPS.find(row=>row[0]===value)?.[1] || value;
  const weekNumber = () => Math.max(1,Math.min(52,Number($("clinic-neuro-week-number")?.value)||1));
  function currentMonth() {
    const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit"}).formatToParts(new Date());
    return parts.find(p=>p.type==="year").value+"-"+parts.find(p=>p.type==="month").value;
  }
  function options() {
    return {
      mode:["single","individual"].includes($("clinic-neuro-mode")?.value)?$("clinic-neuro-mode").value:"weekly",
      selectedRecipe:window.NeuroSelectedRecipe||null,
      priority:$("clinic-neuro-focus")?.value||"equilibrado",
      domain:$("clinic-neuro-domain")?.value||"atencion",
      week:weekNumber(),
      level:$("clinic-neuro-level")?.value||"",
      activity_type:$("clinic-neuro-activity-type")?.value||"mixto",
      support:$("clinic-neuro-support")?.value||"moderado",
      format:$("clinic-neuro-format")?.value||"mixto",
      intervention:$("clinic-neuro-intervention")?.value||"estimulacion",
      response:$("clinic-neuro-response-mode")?.value||"flexible",
      accessibility:$("clinic-neuro-accessibility")?.value?.trim()||"",
      goal:$("clinic-neuro-functional-goal")?.value?.trim()||"",
      theme:$("clinic-neuro-theme")?.value?.trim()||""
    };
  }
  function eligibleRecipes(domain,opts) {
    const level=LEVEL_NAMES[opts.level]?opts.level:"apoyo_moderado";
    const choices=catalog().filter(recipe=>recipe.domain===domain&&recipe.level===level);
    const byFormat=opts.format&&opts.format!=="mixto"?choices.filter(recipe=>recipe.format===opts.format):[];
    // Si el formato deseado limita la variedad, se priorizan dos ejercicios distintos.
    return byFormat.length>=(opts.mode==="individual"?1:2)?byFormat:choices;
  }
  const PRIORITY_DOMAINS=["orientacion_espacial","atencion","visuoespacial","velocidad_procesamiento","calculo","memoria","praxias_gnosias","funciones_ejecutivas","orientacion_temporal","lenguaje","cognicion_funcional","cognicion_social","orientacion_personal"];
  const domainPriority=domain=>PRIORITY_DOMAINS.indexOf(domain);
  // Tras las dos primeras semanas se cambian operaciones y estímulos verificables;
  // la rotación de únicamente dos recetas no constituye variedad longitudinal.
  function variedRecipe(recipe,opts,slot=0) {
    if(opts.activity_type==="ficha")return recipe;
    if(opts.activity_type!=="generador"&&(Number(opts.week)||1)<=2&&(Number(opts.variant)||0)<2)return recipe;
    const builder=window.NeuroVariantFactory?.create;
    if(typeof builder!=="function")return recipe;
    const index=GROUPS.findIndex(row=>row[0]===recipe.domain);
    const level={apoyo_alto:0,apoyo_moderado:1,autonomo:2}[recipe.level]??1;
    const seed=((Number(opts.week)||1)-1)*41+index*13+level*7+(Number(opts.variant)||0)*29+slot*17;
    const result=builder(recipe.domain,recipe.level,seed);
    return result?.task&&result?.stimuli&&result?.solution?result:recipe;
  }
  function selectRecipes(opts) {
    const week=Math.max(1,Math.min(52,Number(opts.week)||1));
    const variation=Math.max(0,Math.floor(Number(opts.variant)||0));
    if(opts.mode==="weekly"){
      const selection=GROUPS.map(([domain],index)=>{
        const matches=eligibleRecipes(domain,opts);
        return variedRecipe(matches[(week-1+index+variation)%matches.length],opts,index);
      });
      const requested=GROUPS.some(([name])=>name===opts.priority)?opts.priority:null;
      const extraDomain=requested||["atencion","memoria","funciones_ejecutivas"][(week-1)%3];
      const candidates=eligibleRecipes(extraDomain,opts);
      const base=candidates.find(r=>!selection.some(p=>p.title===r.title&&p.domain===r.domain))||candidates[0];
      if(base){
        const seed=week*97+variation*31+GROUPS.findIndex(row=>row[0]===extraDomain)*11;
        const alternate=opts.activity_type==="ficha"?base:
          (week<=2&&variation<2&&typeof window.NeuroVariantFactory?.create==="function")?
          window.NeuroVariantFactory.create(extraDomain,base.level,seed):variedRecipe(base,opts,50);
        selection.push({...alternate,title:"Actividad complementaria: "+alternate.title});
      }
      return selection;
    }
    const domain=GROUPS.some(row=>row[0]===opts.domain)?opts.domain:"atencion";
    const chosen=eligibleRecipes(domain,opts);
    const selected=opts.selectedRecipe?.domain===domain&&opts.selectedRecipe?.level===opts.level
      ?chosen.find(recipe=>recipe.title===opts.selectedRecipe.title):null;
    const first=selected||variedRecipe(chosen[(week-1+variation)%chosen.length],opts,0);
    const second=opts.activity_type==="generador"?
      variedRecipe(chosen[(week+variation)%chosen.length],opts,1):
      chosen[(week+variation)%chosen.length];
    if(opts.mode==="individual")return [first];
    return [first,second,{
      ...first,title:"Transferencia funcional: "+label(domain),
      task:"En una situación cotidiana segura y simulada, aplica la estrategia practicada en la tarea anterior. Elige una clave o ayuda externa y explica cómo comprobarías el resultado sin presuponer autonomía.",
      stimuli:"Identificar la estrategia | Elegir una ayuda | Practicar sin riesgo | Revisar",
      solution:"La solución depende del objetivo funcional acordado; no se presupone información autobiográfica real.",
      visualType:"diagram",visualTitle:"Generalización de la estrategia",format:"funcional",generated:false
    }];
  }
  function visualFor(recipe, opts) {
    if(recipe.visualType==="calendar")return {type:"calendar",title:recipe.visualTitle,content:currentMonth()};
    if(recipe.visualType==="chart")return {type:"chart",title:recipe.visualTitle,content:recipe.stimuli};
    if(recipe.visualType==="table"){
      const raw=recipe.stimuli.split("\n");
      const candidate=raw.map(x=>x.split("|").map(v=>v.trim()));
      const valid=raw.length>1&&candidate[0].length>=2&&candidate[0].length<=6&&candidate.every(r=>r.length===candidate[0].length);
      const items=recipe.stimuli.split(/[|\n]/).map(x=>x.trim()).filter(Boolean).slice(0,12);
      const rows=valid?candidate.map(r=>r.join("|")):["Posición|Estímulo",...items.map((item,index)=>(index+1)+"|"+item.slice(0,90))];
      return {type:"table",title:recipe.visualTitle,content:rows.join("\n")};
    }
    return {type:"diagram",title:recipe.visualTitle,content:recipe.stimuli.split(/[|\n]/).map(x=>x.trim()).filter(Boolean).slice(0,8).join("\n")||"Leer consigna\nRevisar solución"};
  }
  // Este texto se entrega a la PERSONA que hará la actividad. Sin pauta de corrección ni jerga clínica.
  function patientTask(text) {
    return String(text||"")
      .replace(/; ofrece pausas\.?$/i,". Puedes hacer una pausa cuando la necesites.")
      .replace(/Si es necesario, permite verla escrita\.?/gi,"Si lo necesitas, consulta también la consigna escrita.")
      .replace(/; permite explicación oral sin gesto real\.?/gi,". También puedes explicarlo con palabras.")
      .replace(/Registra pausas sin comparar el tiempo con normas clínicas\.?/gi,"Haz una pausa si lo necesitas.");
  }
  function exercise(recipe,index,opts) {
    const day=opts.mode==="weekly"?Math.floor(index/2)+1:null;
    const response=({verbal:"Puedes responder en voz alta.",escrita:"Escribe tu respuesta.",senalamiento:"Puedes señalar las opciones o elegir con ayuda.",flexible:"Puedes escribir, responder en voz alta o señalar."})[opts.response]||"Puedes responder como te resulte más cómodo.";
    return [
      "Ejercicio "+(index+1)+": "+(day?"Día "+day+" · ":"")+recipe.title,
      "Consigna: "+patientTask(recipe.task),
      "Material: Observa el cuadro, los símbolos o el calendario que aparece debajo de este ejercicio.",
      "Cómo responder: "+response+" No necesitas hacerlo deprisa. Si algo no se entiende, anótalo para comentarlo.",
      "Tu respuesta:",
      "Dudas o notas:"
    ].join("\n");
  }
  function build(opts) {
    const tasks=selectRecipes(opts);
    const covered=new Set(tasks.map(x=>x.domain));
    // Cada actividad debe llevar su propio material a la vista, sin anexos desconectados.
    const visuals=tasks.map((recipe,index)=>({
      ...visualFor(recipe,opts),title:"Ejercicio "+(index+1)+" · "+recipe.visualTitle
    }));
    const weekly=opts.mode==="weekly";
    const individual=opts.mode==="individual";
    return {
      version:6,clinical_area:"neuropsychology",material_type:"exercise",duration_minutes:12,
      frequency:weekly?"Semana "+opts.week+": siete días orientativos, con dos actividades breves cada día. Puedes repartirlas según te encuentres.":individual?"Una actividad para realizar cuando te venga bien.":"Tres actividades que puedes distribuir durante la semana.",
      introduction:weekly?"Este es tu cuaderno de la semana "+opts.week+". Encontrarás catorce actividades diferentes, organizadas por días. Puedes hacerlas en el orden propuesto o adaptar el ritmo a tus necesidades.":individual?"Aquí tienes una actividad para trabajar "+label(opts.domain).toLowerCase()+" a tu ritmo.":"Aquí tienes tres actividades para trabajar "+label(opts.domain).toLowerCase()+" durante la semana.",
      why:"Practicarás con situaciones, palabras, imágenes y pequeños retos cotidianos. Lo importante es intentarlo, encontrar estrategias que te sirvan y anotar las dudas. No es un examen.",
      objective:opts.goal||"Practicar con diferentes tipos de actividades y descubrir qué estrategias te resultan más útiles.",
      instructions:["Semana "+opts.week,...tasks.map((task,i)=>exercise(task,i,opts))].join("\n\n"),
      example:"Antes de empezar, lee la consigna y observa el material que acompaña a cada actividad. Si no sabes cómo continuar, puedes dejarla para otro momento o pedir ayuda.",
      record_prompt:"Al terminar, escribe qué actividades hiciste y qué dudas te surgieron. Puedes usar los espacios que encontrarás después de cada ejercicio.",
      safety_note:"Si notas cansancio, haz una pausa o deja la actividad para otro momento. Puedes responder hablando, escribiendo o señalando según lo que te resulte más cómodo.",
      remember:"No tienes que terminarlo todo ni acertar siempre. Lleva tus dudas a la próxima sesión y revisaremos juntos lo que necesites.",
      session_questions:["¿Qué actividad te interesó más?","¿En cuál te hubiera venido bien una ayuda?","¿Qué dudas quieres comentar?"],
      neuro_profile:{mode:opts.mode,domain:weekly?"multidominio":opts.domain,intervention:opts.intervention,level:opts.level,support:opts.support||"moderado",format:opts.format||"mixto",activity_type:opts.activity_type||"mixto",theme:opts.theme,functional_goal:opts.goal,week_number:opts.week,response_mode:opts.response,accessibility:opts.accessibility,covered_domains:Array.from(covered),priority_domain:weekly?(opts.priority||"equilibrado"):opts.domain,selected_activity:opts.mode!=="weekly"&&opts.selectedRecipe?.domain===opts.domain&&opts.selectedRecipe?.level===opts.level?opts.selectedRecipe.title:null},
      visual_blocks:visuals
    };
  }
  // Corrección de uso exclusivamente profesional. NO añadir al patient_document.
  function tasksAnswerKey(opts){
    const tasks=selectRecipes(opts);
    return tasks.map((r,i)=>{
      const criterion=String(r.solution||"Respuesta abierta: revisar de forma individual.");
      return "Ejercicio "+(i+1)+" · "+r.title+"\nCriterio de revisión: "+criterion;
    }).join("\n\n");
  }
  function generate() {
    const opts=options();
    const summary=$("clinic-neuro-draft-summary");
    const reportError=(message)=>{if(summary){summary.hidden=false;summary.textContent=message;}const old=$("clinic-exercise-message");if(old)old.textContent=message;};

    if(!LEVEL_NAMES[opts.level]){
      reportError("Selecciona la demanda cognitiva: inicial, intermedia o avanzada.");
      $("clinic-neuro-level")?.focus();
      return;
    }
    if(opts.mode!=="weekly"&&!GROUPS.some(row=>row[0]===opts.domain)){
      reportError("Selecciona una función cognitiva para crear su ficha.");
      return;
    }
    if(catalog().length<78||typeof window.NeuroVariantFactory?.create!=="function"){
      reportError("La biblioteca no ha terminado de cargar. Recarga la página.");
      return;
    }
    opts.variant=variantCounter++;
    const patientDocument=build(opts);
    const button=$("clinic-neuro-generate");
    if(button)button.textContent="Generar otra versión";
    const title=opts.mode==="weekly"?"Tu cuaderno de actividades · Semana "+opts.week:
      opts.mode==="individual"?"Tu actividad de "+label(opts.domain).toLowerCase()+" · Semana "+opts.week:
      "Tus actividades de "+label(opts.domain).toLowerCase()+" · Semana "+opts.week;
    window.dispatchEvent(new CustomEvent("clinic-neuro-load-starter",{detail:{
      title,code:"PROGRAMA-NEURO-"+opts.week,domain:patientDocument.neuro_profile.domain,
      patient_document:patientDocument,caution:"Borrador original; comprobar pertinencia clínica, estímulos, soluciones, accesibilidad y carga antes de prescribir.",
      professional_answer_key:tasksAnswerKey(opts),
      record:"Registrar observaciones y corrección de fotografías manuscritas en Seguimiento neuropsicológico."
    }}));
    const dialog=$("clinic-exercise-dialog");
    if(dialog)dialog.classList.add("neuro-ready");
    if(summary){summary.hidden=false;summary.textContent="Borrador generado: "+(opts.mode==="weekly"?"14 actividades para 7 días":opts.mode==="single"?"3 actividades":"1 actividad")+". Revísalo abajo antes de guardar o enviar."}
    $("clinic-exercise-title")?.scrollIntoView({behavior:"smooth",block:"center"});
  }
  function init(){
    const mode=$("clinic-neuro-mode"),focus=$("clinic-neuro-focus"),domain=$("clinic-neuro-domain"),
          action=$("clinic-neuro-generate"),note=$("clinic-neuro-mode-note"),
          summary=$("clinic-neuro-draft-summary"),dialog=$("clinic-exercise-dialog");
    const names=Object.fromEntries(GROUPS);
    function syncMode(changed=false){
      if(!mode || !focus)return;
      const weekly=mode.value==="weekly";
      if(!weekly&&focus.value==="equilibrado")focus.value="atencion";
      if(domain)domain.value=weekly?"multidominio":focus.value;
      if(note)note.textContent=weekly
        ? "Una semana, 14 tareas en 7 jornadas. "+(focus.value==="equilibrado"?"Todas las funciones en equilibrio.":"Todas las funciones y una tarea extra de "+(names[focus.value]||"la prioridad seleccionada").toLowerCase()+".")
        :mode.value==="single"?"Tres actividades: dos focales y una de transferencia cotidiana.":"Una actividad de la función seleccionada.";
      if(action)action.textContent=weekly?"Generar cuaderno":mode.value==="single"?"Generar ficha":"Generar ejercicio";
      if(changed&&dialog?.classList.contains("neuro-ready")){
        dialog.classList.remove("neuro-ready");
        if(summary){summary.hidden=false;summary.textContent="Has cambiado las opciones. Vuelve a generar para actualizar el borrador antes de guardarlo o enviarlo.";}
      }
      const domainLabel=domain?.closest("label");
      if(domainLabel)domainLabel.hidden=true;
    }
    mode?.addEventListener("change",()=>syncMode(true));
    focus?.addEventListener("change",()=>syncMode(true));
    $("clinic-neuro-level")?.addEventListener("change",()=>syncMode(true));
    syncMode(false);
    action?.addEventListener("click",generate);
  }
  window.NeuroWeeklyComposer={GROUPS,RECIPES,catalog,build,selectRecipes,visualFor};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();