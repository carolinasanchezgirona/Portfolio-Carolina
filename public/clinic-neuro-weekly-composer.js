/* Editor neuropsicológico: fichas por función y cuadernos multicomponente de siete días.
 * Estímulos originales y ficticios: son actividades de intervención, no instrumentos psicométricos. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
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
    ["orientacion_espacial","Leer un plano sencillo","Utiliza el plano ficticio. Sitúa la biblioteca en relación con el parque y señala el recorrido indicado por flechas.","Biblioteca | Parque | Centro cultural\nNorte | Centro | Sur","La biblioteca está al norte del parque según el plano de ejemplo.","table","Lugares del plano"],
    ["orientacion_espacial","Referencias en una habitación","Sobre un dibujo de una habitación, coloca una ficha a la izquierda de la mesa y otra detrás de la silla.","Ventana | Mesa | Silla\nIzquierda | Centro | Derecha","Comprobar posiciones respecto al dibujo, aclarando cuál es la izquierda de referencia.","diagram","Referencias espaciales"],
    ["orientacion_personal","Mis preferencias actuales","Elige entre tres actividades agradables (música, paseo, lectura) y explica o señala cuál te apetece hoy.","Música | Paseo | Lectura","No hay respuesta correcta; registrar elección libre sin imponer recuerdos autobiográficos.","table","Preferencias sin datos personales"],
    ["orientacion_personal","Tarjetas de elección","Selecciona una imagen entre cocinar, escuchar música y cuidar plantas para indicar qué actividad deseas hacer.","Cocinar | Música | Plantas","No exigir identificación de familiares, nombres o biografía no verificada.","diagram","Elecciones cotidianas"],
    ["atencion","Cancelación de símbolos","Rodea todas las estrellas de esta secuencia y revisa si has dejado alguna sin marcar.","★ ○ ▲ ★ ◇ ○ ★ △ ★ ○","Hay cuatro estrellas.","table","Búsqueda visual"],
    ["atencion","Buscar diferencias relevantes","Encuentra qué elementos aparecen en la segunda lista pero no en la primera.","Lista A: taza, llave, libro, flor.\nLista B: taza, flor, libro, sombrero.","Aparece sombrero y no aparece llave en la segunda lista.","table","Comparación de listas"],
    ["memoria","Codificación con categorías","Observa durante el tiempo acordado estas seis palabras agrupadas: pera, manzana, plátano / mesa, silla, sofá. Luego recuerda o reconoce las que puedas.","Frutas: pera, manzana, plátano.\nMuebles: mesa, silla, sofá.","Ofrecer claves por categoría o reconocimiento; no exigir seis aciertos.","table","Palabras agrupadas"],
    ["memoria","Recuerdo de una secuencia","Escucha o lee la secuencia ficticia: preparar una bolsa, poner una botella y cerrar la cremallera. Ordena después las tres tarjetas.","Bolsa | Botella | Cremallera","Preparar bolsa, introducir botella y cerrar cremallera.","diagram","Tres pasos para recordar"],
    ["funciones_ejecutivas","Planificación cotidiana","Ordena estos cuatro pasos ficticios para preparar una merienda sin utilizar electrodomésticos.","Lavarse manos | Preparar plato | Colocar alimento | Recoger","Un orden válido: lavarse las manos, preparar plato, colocar alimento y recoger.","diagram","Secuencia funcional"],
    ["funciones_ejecutivas","Flexibilidad de criterios","Agrupa primero por color y después por forma: círculo rojo, triángulo azul, círculo azul y triángulo rojo.","Círculo rojo | Triángulo azul\nCírculo azul | Triángulo rojo","Por color: dos rojos y dos azules; por forma: dos círculos y dos triángulos.","table","Dos reglas para clasificar"],
    ["lenguaje","Asociaciones semánticas","Relaciona cada objeto con su función cotidiana: tijeras, paraguas y reloj.","Objeto | Función\nTijeras | Cortar\nParaguas | Proteger de lluvia\nReloj | Consultar hora","Tijeras-cortar, paraguas-lluvia y reloj-hora.","table","Asociación objeto y uso"],
    ["lenguaje","Construir una frase","Ordena estas palabras para crear una oración comprensible, aceptando respuestas orales o señaladas.","palabras: el | libro | está | sobre | la | mesa","El libro está sobre la mesa.","diagram","Tarjetas de palabras"],
    ["visuoespacial","Matriz de posiciones","En la cuadrícula de ejemplo localiza el elemento situado a la derecha del círculo y debajo del triángulo.","Triángulo | Cuadrado | Estrella\nCírculo | Rombo | Luna","A la derecha del círculo aparece el rombo; debajo del triángulo aparece el círculo.","table","Cuadrícula espacial"],
    ["visuoespacial","Rotaciones de objetos","Presenta una flecha orientada hacia arriba y pide elegir entre flechas que apuntan arriba, abajo y derecha.","↑ | ↓ | → | ←","La flecha con idéntica orientación es ↑.","table","Dirección de flechas"],
    ["praxias_gnosias","Reconocer objetos por su uso","Observa dibujos de una cuchara, un peine y un vaso. Señala cuál utilizarías para beber.","Cuchara | Peine | Vaso","Señalar el vaso; si es necesario mostrar un objeto real, sin inferir agnosia.","table","Objetos cotidianos"],
    ["praxias_gnosias","Secuenciar un gesto funcional","Con objetos inocuos, describe o muestra los pasos para doblar una servilleta. La ejecución motora puede sustituirse por ordenar tarjetas.","Extender servilleta | Doblar por mitad | Guardar","Orden: extender, doblar por mitad y guardar.","diagram","Secuencia de acción"],
    ["calculo","Compra simulada","En una tienda ficticia, una manzana cuesta 2 € y un pan cuesta 3 €. ¿Cuánto suman los dos productos?","Producto | Precio\nManzana | 2 €\nPan | 3 €","Total: 5 €, sin inferir capacidad financiera real.","table","Precios ficticios"],
    ["calculo","Leer cantidades","Compara las cantidades 4, 7 y 5. Señala la mayor, la menor y ordénalas.","Cantidad | 4 | 7 | 5\nOrden | ? | ? | ?","Mayor 7, menor 4; orden ascendente 4, 5, 7.","table","Cantidades de ejemplo"],
    ["cognicion_social","Interpretar una situación ambigua","Lee la escena ficticia: una persona no saluda al entrar porque está hablando por teléfono. Propón dos explicaciones alternativas.","Escena: conversación telefónica | ausencia de saludo.","Puede que no te haya visto o que necesitara atender la llamada; ninguna explicación es segura.","diagram","Situación cotidiana"],
    ["cognicion_social","Elegir una respuesta respetuosa","En una escena ficticia, alguien dice que hoy prefiere descansar. Elige una respuesta que respete su preferencia.","Opciones: insistir | preguntar si necesita algo | aceptar y acordar otro momento.","Aceptar su preferencia y preguntar solo si desea ayuda.","table","Opciones de respuesta"],
    ["velocidad_procesamiento","Clasificación con ritmo propio","En la lista siguiente marca todos los números pares sin utilizar cronómetro; ofrece pausas.","2 | 5 | 8 | 3 | 4 | 7 | 6 | 9","Pares: 2, 8, 4 y 6; no interpretar el tiempo como baremo.","table","Números para selección"],
    ["velocidad_procesamiento","Emparejar signos","Encuentra pares idénticos entre estos símbolos: círculo, triángulo, estrella, círculo, rombo, triángulo.","○ | △ | ★ | ○ | ◇ | △","Dos círculos y dos triángulos; ajustar número de estímulos y permitir descansos.","table","Emparejamiento visual"],
    ["cognicion_funcional","Preparar una lista de salida","Selecciona los objetos que corresponden a un paseo ficticio con lluvia: abrigo, paraguas, pelota, libro y llaves.","Abrigo | Paraguas | Pelota | Libro | Llaves","Una selección posible: abrigo, paraguas y llaves; adaptar a contexto real cuando se conozca.","table","Lista de objetos"],
    ["cognicion_funcional","Recordatorio externo","Relaciona tres tareas ficticias con una ayuda externa: cita, compra y tomar nota de una llamada.","Actividad | Apoyo\nCita | Calendario\nCompra | Lista\nLlamada | Bloc de notas","Cita-calendario; compra-lista; llamada-notas. No administrar medicación real.","table","Ayudas externas"]
  ].map(([domain,title,task,stimuli,solution,visualType,visualTitle])=>({domain,title,task,stimuli,solution,visualType,visualTitle}));
  const label = value => GROUPS.find(row=>row[0]===value)?.[1] || value;
  const weekNumber = () => Math.max(1,Math.min(52,Number($("clinic-neuro-week-number")?.value)||1));
  function currentMonth() {
    const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit"}).formatToParts(new Date());
    return parts.find(p=>p.type==="year").value+"-"+parts.find(p=>p.type==="month").value;
  }
  function options() {
    return {
      mode:$("clinic-neuro-mode")?.value==="single"?"single":"weekly",
      domain:$("clinic-neuro-domain")?.value||"atencion",
      week:weekNumber(),
      level:$("clinic-neuro-level")?.value||"apoyo_moderado",
      intervention:$("clinic-neuro-intervention")?.value||"estimulacion",
      response:$("clinic-neuro-response-mode")?.value||"flexible",
      accessibility:$("clinic-neuro-accessibility")?.value?.trim()||"",
      goal:$("clinic-neuro-functional-goal")?.value?.trim()||"",
      theme:$("clinic-neuro-theme")?.value?.trim()||""
    };
  }
  function selectRecipes(opts) {
    if(opts.mode==="weekly"){
      const selection=GROUPS.map(([domain],index)=>{
        const matches=RECIPES.filter(x=>x.domain===domain);
        return matches[(opts.week+index)%matches.length];
      });
      const extra=RECIPES.filter(x=>x.domain===["atencion","memoria","funciones_ejecutivas"][opts.week%3]);
      selection.push(extra[(opts.week+1)%extra.length]);
      return selection;
    }
    const entries=RECIPES.filter(r=>r.domain===opts.domain);
    const chosen=entries.length?entries:RECIPES.filter(r=>r.domain==="atencion");
    return [chosen[opts.week%chosen.length],chosen[(opts.week+1)%chosen.length],{
      ...chosen[opts.week%chosen.length],title:"Transferencia funcional: "+label(opts.domain),
      task:"En una situación cotidiana segura y simulada, aplica la misma regla o estrategia practicada. Explica qué ayuda externa o pista permitiría completar la actividad sin exigir autonomía no comprobada.",
      stimuli:"Apoyo visual disponible | Ejemplo de uso | Alternativa accesible",
      solution:"La respuesta se contrasta con la tarea concreta acordada por la profesional; no se presupone una situación biográfica real.",
      visualType:"diagram",visualTitle:"Transferencia de estrategia"
    }];
  }
  function visualFor(recipe, opts) {
    if(recipe.visualType==="calendar")return {type:"calendar",title:recipe.visualTitle,content:currentMonth()};
    if(recipe.visualType==="chart")return {type:"chart",title:recipe.visualTitle,content:recipe.stimuli};
    if(recipe.visualType==="table"){
      const raw=recipe.stimuli.split("\n");
      const rows=raw.length>1&&raw.every(x=>x.includes("|"))?raw: ["Estímulo|Dato","1|"+recipe.stimuli.slice(0,160)];
      return {type:"table",title:recipe.visualTitle,content:rows.join("\n")};
    }
    return {type:"diagram",title:recipe.visualTitle,content:recipe.stimuli.split("|").map(x=>x.trim()).filter(Boolean).slice(0,8).join("\n")||"Leer consigna\nRevisar solución"};
  }
  function exercise(recipe, index, opts) {
    const day=opts.mode==="weekly"?Math.floor(index/2)+1:null;
    const supports=opts.level==="apoyo_alto"
      ?"Modelar una respuesta, presentar dos opciones, facilitar reconocimiento y detener si hay frustración."
      :opts.level==="autonomo"
      ?"Dar tiempo para una estrategia propia, ofrecer una pista tras petición y comprobar la solución sin cronómetro."
      :"Dividir la consigna, dar una clave visual o semántica y comprobar comprensión antes de repetir.";
    const response={flexible:"oral, escrita, señalada o mediante gesto",verbal:"oral",escrita:"escrita",senalamiento:"señalada o con tarjetas"}[opts.response]||"flexible";
    return [
      "Ejercicio "+(index+1)+": "+(day?"Día "+day+" · ":"")+recipe.title+" ("+label(recipe.domain)+")",
      "Objetivo: Practicar "+label(recipe.domain).toLowerCase()+" mediante una tarea concreta y observable. "+(opts.goal?"Objetivo funcional priorizado: "+opts.goal+".":"Registrar estrategias útiles sin equiparar el resultado a una puntuación diagnóstica."),
      "Materiales: Utilizar el estímulo de la ficha y el recurso visual «"+recipe.visualTitle+"» cuando aparezca en el cuaderno. Contenido: "+recipe.stimuli,
      "Preparación: Leer o escuchar la consigna, mostrar un ejemplo sin resolver el resto, comprobar acceso sensorial y ofrecer una pausa. "+(opts.accessibility?"Adaptación individual: "+opts.accessibility+".":"Elegir tamaño de letra legible y espacio despejado."),
      "Pasos: 1) Observa o escucha el material. 2) "+recipe.task+" 3) Responde de forma "+response+" con el apoyo acordado. 4) Revisa junto con la profesional o acompañante la estrategia y las dificultades.",
      "Ejemplo: "+recipe.solution+" Este ejemplo es una solución de referencia de una tarea ficticia, no una respuesta biográfica del paciente.",
      "Ayudas: "+supports+" No facilitar soluciones antes de dar oportunidad a participar.",
      "Adaptación: Simplificar reduciendo el número de estímulos o manteniendo pistas visibles; incrementar la demanda solo mediante un cambio cada vez. Considerar problemas visuales, motores y de comprensión.",
      "Duración y frecuencia: Aproximadamente 5–12 minutos según tolerancia. "+(day?"Propuesta de día "+day+"; los días son orientativos y no obligatorios.":"Una práctica breve esta semana, ajustable en sesión."),
      "Qué observar: Registrar participación, tipo e intensidad de ayuda, errores cualitativos, fatiga, dudas y posible transferencia; detener si la actividad no resulta adecuada."
    ].join("\n");
  }
  function build(opts) {
    const tasks=selectRecipes(opts);
    const covered=new Set(tasks.map(x=>x.domain));
    const visuals=[];
    for(const recipe of tasks){
      if(visuals.length>=8)break;
      const block=visualFor(recipe,opts);
      if(!visuals.some(x=>x.type===block.type&&x.content===block.content))visuals.push(block);
    }
    const weekly=opts.mode==="weekly";
    return {
      version:4,clinical_area:"neuropsychology",material_type:"exercise",duration_minutes:12,
      frequency:weekly?"Semana "+opts.week+": hasta dos actividades breves por día durante siete días orientativos; descanso y adaptación según tolerancia.":"Semana "+opts.week+": tres propuestas breves adaptables; no es obligatorio completar todas.",
      introduction:weekly?"Cuaderno neuropsicológico multicomponente · Semana "+opts.week+". Encontrarás 7 jornadas orientativas con 2 tareas diferentes cada una. Puedes distribuirlas, descansar o hacer menos según el acuerdo terapéutico.":"Ficha de "+label(opts.domain).toLowerCase()+" · Semana "+opts.week+". Trabaja a tu ritmo y pide ayudas cuando las necesites.",
      why:"Estas actividades permiten practicar distintas habilidades cognitivas, identificar estrategias útiles y explorar su aplicación cotidiana. No son pruebas psicométricas y los resultados no indican por sí mismos una mejoría clínica.",
      objective:opts.goal||(weekly?"Estimulación multicomponente con cobertura semanal y adaptación individual.":"Trabajar "+label(opts.domain).toLowerCase()+" con apoyos graduados."),
      instructions:["Semana "+opts.week,...tasks.map((task,i)=>exercise(task,i,opts))].join("\n\n"),
      example:"Cada tarea aporta estímulos y una respuesta de referencia. Las soluciones sirven a la profesional o persona de apoyo para comprobar los ejemplos; no se utilizan para juzgar al paciente.",
      record_prompt:tasks.map((r,i)=>"Ejercicio "+(i+1)+" · "+r.title+": participación ___  ayuda ___  fatiga ___  observaciones ___").join("\n")+"\n\nDudas para comentar en consulta: ¿qué ayuda sirvió?, ¿qué actividad fue más llevadera?, ¿qué quieres cambiar?",
      safety_note:"Realiza las actividades de manera flexible. No fuerces recuerdos, no corrijas confrontativamente y evita practicar situaciones funcionales de riesgo sin supervisión adecuada.",
      remember:"La semana siguiente se diseña tras revisar juntos qué actividades y apoyos fueron útiles. Este material no constituye una evaluación diagnóstica.",
      session_questions:["¿Qué ejercicios resultaron más accesibles?","¿Qué apoyos se necesitaron?","¿Se observó transferencia funcional?","¿Qué conviene adaptar la semana siguiente?"],
      neuro_profile:{mode:opts.mode,domain:weekly?"multidominio":opts.domain,intervention:opts.intervention,level:opts.level,theme:opts.theme,functional_goal:opts.goal,week_number:opts.week,response_mode:opts.response,accessibility:opts.accessibility,covered_domains:Array.from(covered)},
      visual_blocks:visuals
    };
  }
  function generate() {
    const opts=options();
    if(opts.mode==="single"&&!GROUPS.some(row=>row[0]===opts.domain)){
      $("clinic-exercise-message").textContent="Selecciona una función cognitiva para crear su ficha.";
      return;
    }
    const patientDocument=build(opts);
    const title=opts.mode==="weekly"?"Cuaderno neuropsicológico multicomponente · Semana "+opts.week:
      "Actividades de "+label(opts.domain).toLowerCase()+" · Semana "+opts.week;
    window.dispatchEvent(new CustomEvent("clinic-neuro-load-starter",{detail:{
      title,code:"PROGRAMA-NEURO-"+opts.week,domain:patientDocument.neuro_profile.domain,
      patient_document:patientDocument,caution:"Borrador original; comprobar pertinencia clínica, estímulos, soluciones, accesibilidad y carga antes de prescribir.",
      record:"Registrar observaciones y corrección de fotografías manuscritas en Seguimiento neuropsicológico."
    }}));
    $("clinic-exercise-title")?.scrollIntoView({behavior:"smooth",block:"center"});
  }
  function init(){
    $("clinic-neuro-generate")?.addEventListener("click",generate);
    $("clinic-neuro-mode")?.addEventListener("change",()=>{
      const weekly=$("clinic-neuro-mode").value==="weekly";
      const label=$("clinic-neuro-domain")?.closest("label");
      if(label)label.hidden=weekly;
      const note=$("clinic-neuro-mode-note");
      if(note)note.textContent=weekly?"7 días orientativos, 14 ejercicios distintos y cobertura de 13 dominios.":"3 ejercicios centrados en una función, con variaciones y transferencia.";
    });
    $("clinic-neuro-mode")?.dispatchEvent(new Event("change"));
  }
  window.NeuroWeeklyComposer={GROUPS,RECIPES,build,selectRecipes,visualFor};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();