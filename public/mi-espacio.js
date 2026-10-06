(() => {
  "use strict";

  const BETWEEN_KEY = "between_sessions_access_token";
  const FAVORITES_KEY = "wellness_favorites_v1";
  const COMPLETED_KEY = "wellness_completed_v1";

  const activities = [
    {
      id: "bajar-revoluciones",
      title: "Bajar revoluciones",
      type: "emocional",
      duration: "4 min",
      needs: ["calmarme"],
      summary: "Reducir activación antes de intentar pensar con claridad.",
      intro: "Cuando el cuerpo va por delante, empezar por el cuerpo suele ser más útil que discutir con cada pensamiento.",
      steps: [
        "Apoya bien los pies y deja que los hombros bajen un poco.",
        "Haz cinco respiraciones cómodas, procurando que la salida del aire dure algo más que la entrada. No fuerces el ritmo.",
        "Mira alrededor y localiza tres cosas concretas que puedas ver ahora mismo.",
        "Pregúntate: “¿Qué necesita mi cuerpo durante los próximos diez minutos?” Elige una respuesta pequeña y posible."
      ],
      note: "Si respirar de forma consciente te resulta incómodo o aumenta tu malestar, omite ese paso y céntrate solo en el contacto con el entorno."
    },
    {
      id: "aterrizar-presente",
      title: "Volver al presente",
      type: "emocional",
      duration: "3 min",
      needs: ["calmarme", "rumiacion"],
      summary: "Sacar atención del torbellino mental y llevarla al entorno.",
      intro: "No se trata de dejar la mente en blanco. Solo de cambiar durante unos minutos el lugar al que estás prestando atención.",
      steps: [
        "Nombra cinco cosas que ves, sin valorarlas.",
        "Identifica cuatro sensaciones físicas: apoyo de los pies, temperatura, ropa, contacto con la silla.",
        "Escucha tres sonidos, incluso si son muy pequeños.",
        "Busca dos colores y una textura.",
        "Termina diciendo en voz baja dónde estás y qué estás haciendo ahora."
      ],
      note: "Puedes repetirlo sin intentar hacerlo perfecto. El objetivo es orientar la atención, no conseguir una sensación concreta."
    },
    {
      id: "problema-o-prediccion",
      title: "¿Problema o predicción?",
      type: "emocional",
      duration: "5 min",
      needs: ["rumiacion", "orden"],
      summary: "Separar lo que requiere una acción de lo que tu mente intenta anticipar.",
      intro: "Pensar mucho no siempre significa estar resolviendo. Esta herramienta ayuda a distinguir acción de anticipación.",
      steps: [
        "Formula la preocupación en una sola frase.",
        "Pregunta: “¿Hay algo concreto que pueda hacer respecto a esto hoy?”",
        "Si la respuesta es sí, define una única acción observable y cuándo la harás.",
        "Si la respuesta es no, etiqueta el contenido como una predicción, una duda o una posibilidad, no como una tarea pendiente.",
        "Vuelve a la siguiente acción real que tengas delante."
      ],
      note: "No necesitas demostrar que la preocupación es falsa. Basta con decidir si ahora exige acción."
    },
    {
      id: "pensamiento-no-orden",
      title: "Un pensamiento no es una orden",
      type: "emocional",
      duration: "4 min",
      needs: ["rumiacion", "entender"],
      summary: "Tomar algo de distancia respecto a pensamientos insistentes.",
      intro: "La mente puede producir mensajes muy convincentes. Que aparezcan no obliga a obedecerlos ni a resolverlos.",
      steps: [
        "Elige el pensamiento que más se repite.",
        "Añade delante: “Estoy teniendo el pensamiento de que…”",
        "Después añade: “Mi mente me cuenta que…”",
        "Observa si cambia ligeramente la distancia con el contenido.",
        "Decide qué acción quieres hacer tú durante los próximos cinco minutos, aunque el pensamiento siga presente."
      ],
      note: "La meta no es eliminar el pensamiento, sino reducir el poder que tiene para dirigir automáticamente tu conducta."
    },
    {
      id: "poner-nombre",
      title: "Ponerle nombre a lo que siento",
      type: "emocional",
      duration: "5 min",
      needs: ["entender"],
      summary: "Ordenar una experiencia emocional sin convertirla en un interrogatorio.",
      intro: "Nombrar con precisión puede ayudar más que intentar decidir si una emoción es correcta o incorrecta.",
      steps: [
        "Elige una o dos palabras aproximadas: enfado, tristeza, miedo, vergüenza, culpa, frustración, alivio, soledad u otra.",
        "Pregúntate qué ocurrió justo antes de que apareciera.",
        "Distingue entre emoción, pensamiento y necesidad. No son lo mismo.",
        "Completa mentalmente: “Ahora siento… y probablemente necesito…”",
        "Elige una necesidad que puedas atender de forma realista hoy."
      ],
      note: "Si no encuentras la palabra exacta, no pasa nada. “Mal”, “raro” o “mezclado” también pueden ser un comienzo."
    },
    {
      id: "pausa-enfado",
      title: "Pausa antes de responder",
      type: "emocional",
      duration: "4 min",
      needs: ["entender", "limites", "calmarme"],
      summary: "Crear unos minutos entre el enfado y la respuesta impulsiva.",
      intro: "No busca quitarte razón. Busca que la forma de responder no te cree un problema adicional.",
      steps: [
        "No envíes todavía el mensaje ni continúes la discusión.",
        "Identifica qué te ha dolido, molestado o asustado detrás del enfado.",
        "Escribe mentalmente la frase que dirías si quisieras ser clara sin castigar.",
        "Reduce la frase a un hecho, una necesidad y una petición.",
        "Vuelve a leerla después de unos minutos antes de decidir si la envías."
      ],
      note: "Posponer una respuesta no significa ceder. Puede ser una forma de proteger mejor lo que quieres expresar."
    },
    {
      id: "energia-minima",
      title: "Versión mínima del día",
      type: "autocuidado",
      duration: "4 min",
      needs: ["energia"],
      summary: "Ajustar expectativas cuando la energía está baja.",
      intro: "Hay días para avanzar y días para conservar recursos. Reducir la exigencia puede ser una decisión funcional.",
      steps: [
        "Elige tres cosas que hoy serían suficientes, no ideales.",
        "Marca una como imprescindible, una como conveniente y una como prescindible.",
        "Reduce la imprescindible a su versión más pequeña posible.",
        "Decide qué vas a dejar expresamente para otro momento.",
        "Al terminar lo mínimo, vuelve a valorar energía antes de añadir más."
      ],
      note: "Hacer menos de forma deliberada es diferente de abandonar. Puede ser una estrategia de regulación de carga."
    },
    {
      id: "primer-paso",
      title: "Solo el primer paso",
      type: "cognitivo",
      duration: "3 min",
      needs: ["energia", "orden", "concentrarme"],
      summary: "Reducir una tarea hasta que sea suficientemente pequeña para empezar.",
      intro: "Cuando una tarea parece enorme, el cerebro puede reaccionar ante todo el proyecto a la vez.",
      steps: [
        "Nombra la tarea que estás evitando.",
        "Pregúntate cuál sería la primera acción física visible.",
        "Hazla tan pequeña que pueda completarse en menos de cinco minutos.",
        "Pon el resto de la tarea fuera de foco por ahora.",
        "Cuando termines, decide de nuevo. No te obligues a prometer toda la tarea antes de empezar."
      ],
      note: "Empezar pequeño sirve para crear movimiento, no para engañarte y acabar haciendo veinte cosas."
    },
    {
      id: "descarga-mental",
      title: "Descarga mental",
      type: "cognitivo",
      duration: "6 min",
      needs: ["orden", "rumiacion"],
      summary: "Sacar pendientes de la memoria de trabajo y convertirlos en un mapa manejable.",
      intro: "Intentar recordar a la vez todo lo pendiente consume recursos. Externalizar reduce carga.",
      steps: [
        "Anota todo lo que ocupa espacio mental, sin ordenar todavía.",
        "Separa después en tres grupos: requiere acción, puede esperar y no depende de mí.",
        "De lo que requiere acción, elige solo tres asuntos.",
        "Define el siguiente paso de cada uno en una frase.",
        "Escoge cuál va primero. El resto deja de competir por tu atención durante este bloque."
      ],
      note: "No conviertas la descarga en una lista infinita de obligaciones. Su función es liberar memoria, no fabricar culpa."
    },
    {
      id: "bloque-foco",
      title: "Bloque de foco realista",
      type: "cognitivo",
      duration: "5 min",
      needs: ["concentrarme", "orden"],
      summary: "Preparar las condiciones para una única tarea.",
      intro: "La concentración no depende solo de fuerza de voluntad. También depende de reducir decisiones y distractores.",
      steps: [
        "Elige una sola tarea y define qué significa terminar este bloque.",
        "Retira o silencia una fuente principal de distracción.",
        "Deja a mano únicamente lo que necesitas.",
        "Decide un bloque breve de trabajo que puedas sostener.",
        "Al acabar, para y revisa si continúas, cambias o descansas."
      ],
      note: "Un bloque útil no tiene que ser largo. La calidad del foco importa más que acumular minutos."
    },
    {
      id: "memoria-externa",
      title: "No obligues a tu memoria a hacerlo todo",
      type: "cognitivo",
      duration: "4 min",
      needs: ["orden", "concentrarme"],
      summary: "Elegir una ayuda externa para reducir olvidos cotidianos.",
      intro: "Usar apoyos externos no es hacer trampa. Es descargar funciones para reservar recursos mentales.",
      steps: [
        "Elige una cosa que estés intentando recordar repetidamente.",
        "Decide el mejor soporte externo: alarma, calendario, nota visible, lista o ubicación fija.",
        "Coloca la señal exactamente donde ocurrirá la acción.",
        "Evita duplicar el mismo recordatorio en cinco sitios.",
        "Comprueba durante unos días si esa ayuda reduce el esfuerzo de recordar."
      ],
      note: "Si los fallos de memoria son nuevos, importantes o interfieren claramente con tu vida diaria, una herramienta Wellness no sustituye una valoración profesional."
    },
    {
      id: "frase-limite",
      title: "Preparar un límite",
      type: "emocional",
      duration: "5 min",
      needs: ["limites"],
      summary: "Construir una frase clara sin justificarte durante cinco párrafos.",
      intro: "Un límite comunica qué harás, qué necesitas o qué no puedes asumir. No necesita una defensa infinita.",
      steps: [
        "Describe el hecho sin interpretar intenciones.",
        "Nombra tu necesidad en una frase corta.",
        "Formula el límite o la petición de forma concreta.",
        "Elimina explicaciones repetidas que solo intentan evitar que la otra persona se moleste.",
        "Ensaya la frase una vez con tono neutro."
      ],
      note: "Que otra persona no esté de acuerdo con tu límite no significa automáticamente que lo hayas expresado mal."
    },
    {
      id: "culpa-limite",
      title: "Después de poner un límite",
      type: "emocional",
      duration: "4 min",
      needs: ["limites", "rumiacion"],
      summary: "Distinguir culpa de haber hecho algo incorrecto.",
      intro: "A veces la incomodidad aparece precisamente porque estás haciendo algo diferente a lo habitual.",
      steps: [
        "Pregunta: “¿He hecho daño deliberadamente o simplemente he dicho que no?”",
        "Separa la reacción de la otra persona de la validez automática de tu decisión.",
        "Recuerda qué necesidad estabas protegiendo.",
        "Evita corregir el límite inmediatamente solo para dejar de sentir culpa.",
        "Date un tiempo antes de volver a decidir."
      ],
      note: "Sentir culpa no es una prueba. Es información emocional que necesita contexto."
    },
    {
      id: "cierre-trabajo",
      title: "Cerrar el día de trabajo",
      type: "autocuidado",
      duration: "6 min",
      needs: ["desconectar", "orden"],
      summary: "Ayudar al cerebro a dejar de mantener pendientes abiertos fuera de horario.",
      intro: "Desconectar es más fácil cuando los asuntos pendientes quedan localizados y no flotando en la cabeza.",
      steps: [
        "Anota en una sola lista lo que queda abierto.",
        "Escribe cuál será el primer paso de mañana.",
        "Cierra físicamente las herramientas de trabajo que puedas cerrar.",
        "Haz una transición breve: cambiarte, caminar, ducharte o preparar otra actividad.",
        "Si reaparece un pendiente, recuérdate dónde está anotado."
      ],
      note: "La transición no necesita ser especial. Lo importante es que marque un cambio de contexto."
    },
    {
      id: "bajar-noche",
      title: "Bajar el volumen antes de dormir",
      type: "autocuidado",
      duration: "7 min",
      needs: ["desconectar", "calmarme"],
      summary: "Cerrar asuntos pendientes sin intentar obligarte a dormir.",
      intro: "Dormir no funciona bien como una orden. Esta rutina busca preparar condiciones de menor activación.",
      steps: [
        "Anota cualquier pendiente que estés intentando retener.",
        "Reduce luz y estimulación si puedes.",
        "Evita resolver conversaciones o decisiones importantes desde la cama.",
        "Haz una actividad repetitiva y de baja demanda durante unos minutos.",
        "Si aparecen pensamientos, vuelve a la idea: “Esto puede esperar a mañana”."
      ],
      note: "Si el sueño es un problema persistente o grave, estas pautas generales no sustituyen una valoración específica."
    },
    {
      id: "voz-critica",
      title: "Cambiar de posición ante la voz crítica",
      type: "emocional",
      duration: "5 min",
      needs: ["entender", "rumiacion"],
      summary: "Observar autocrítica sin convertirla automáticamente en una descripción objetiva.",
      intro: "La autocrítica suele hablar en tono de sentencia. Cambiar de posición permite examinarla con más contexto.",
      steps: [
        "Escribe mentalmente la frase crítica exacta.",
        "Pregúntate si describe un hecho o emite un juicio global sobre ti.",
        "Busca qué intenta evitar o controlar esa voz: error, rechazo, vergüenza, fracaso.",
        "Reformula la frase para que sea específica y útil, sin necesidad de convertirla en una frase positiva.",
        "Elige una acción que responda al problema real, no al insulto."
      ],
      note: "El objetivo no es convencerte de que todo está bien, sino sustituir castigo global por información más precisa."
    }
  ];

  const routines = {
    "cabeza-llena": {
      title: "Tengo la cabeza llena",
      type: "Rutina emocional + cognitiva",
      intro: "Una secuencia corta para sacar pendientes de la cabeza y recuperar una dirección concreta.",
      steps: [
        "Haz una descarga mental de todo lo que tienes abierto.",
        "Separa qué requiere acción y qué puede esperar.",
        "Elige una sola prioridad.",
        "Define el siguiente paso visible.",
        "Antes de empezar, haz una pausa breve para bajar activación."
      ],
      note: "No tienes que terminar todo. La rutina termina cuando sabes qué va primero."
    },
    "desconectar-trabajo": {
      title: "Quiero desconectar del trabajo",
      type: "Rutina de autocuidado",
      intro: "Cierra el contexto laboral para que tu cabeza no tenga que mantenerlo abierto toda la tarde.",
      steps: [
        "Anota lo que queda pendiente.",
        "Deja escrito el primer paso de mañana.",
        "Cierra herramientas de trabajo.",
        "Haz una acción física de transición.",
        "Empieza una actividad que pertenezca claramente a tu tiempo personal."
      ],
      note: "Si vuelve un pendiente, no necesitas resolverlo: recuerda dónde ha quedado anotado."
    },
    "antes-empezar": {
      title: "No consigo empezar",
      type: "Rutina cognitiva",
      intro: "Reduce fricción y convierte una tarea grande en un comienzo concreto.",
      steps: [
        "Elige una sola tarea.",
        "Define el primer paso de menos de cinco minutos.",
        "Retira una distracción.",
        "Haz solo ese primer paso.",
        "Después decide si continúas. No antes."
      ],
      note: "Empezar es el objetivo de esta rutina. Terminar todo no forma parte del contrato."
    },
    "bajar-revoluciones": {
      title: "Voy demasiado acelerada",
      type: "Rutina emocional",
      intro: "Primero baja el volumen del cuerpo y después decide qué hacer.",
      steps: [
        "Apoya pies y espalda.",
        "Alarga suavemente la salida del aire durante varias respiraciones cómodas.",
        "Nombra tres cosas que ves y dos sonidos que escuchas.",
        "Relaja una zona que estés tensando sin darte cuenta.",
        "Elige solo qué necesitas durante los próximos diez minutos."
      ],
      note: "No busques quedarte perfectamente tranquila. Basta con recuperar un poco de margen."
    }
  };

  const state = {
    currentActivity: null,
    filter: "all",
    need: null,
    favorites: loadJson(FAVORITES_KEY, []),
    completed: loadJson(COMPLETED_KEY, [])
  };

  const panels = [...document.querySelectorAll("[data-space-panel]")];
  const navButtons = [...document.querySelectorAll("[data-space-view]")];
  const wellnessList = document.getElementById("wellness-list");
  const wellnessContext = document.getElementById("wellness-context");
  const dialog = document.getElementById("wellness-dialog");
  const dialogType = document.getElementById("wellness-dialog-type");
  const dialogTitle = document.getElementById("wellness-dialog-title");
  const dialogIntro = document.getElementById("wellness-dialog-intro");
  const dialogSteps = document.getElementById("wellness-dialog-steps");
  const dialogNote = document.getElementById("wellness-dialog-note");
  const favoriteButton = document.getElementById("wellness-favorite");
  const completeButton = document.getElementById("wellness-complete");

  function loadJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(state.completed.slice(-100)));
    } catch {
      // La experiencia sigue funcionando aunque el navegador bloquee almacenamiento local.
    }
  }

  function showView(name) {
    panels.forEach(panel => {
      panel.hidden = panel.dataset.spacePanel !== name;
    });
    navButtons.forEach(button => {
      button.classList.toggle("is-active", button.dataset.spaceView === name);
    });
    if (name === "wellness") renderWellness();
    if (name === "progress") renderProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function typeLabel(type) {
    if (type === "emocional") return "Wellness emocional";
    if (type === "cognitivo") return "Wellness cognitivo";
    return "Autocuidado";
  }

  function isFavorite(id) {
    return state.favorites.includes(id);
  }

  function filteredActivities() {
    return activities.filter(activity => {
      if (state.filter === "favoritos" && !isFavorite(activity.id)) return false;
      if (!["all", "favoritos"].includes(state.filter) && activity.type !== state.filter) return false;
      if (state.need && !activity.needs.includes(state.need)) return false;
      return true;
    });
  }

  function renderWellness() {
    if (!wellnessList) return;
    const items = filteredActivities();
    wellnessList.replaceChildren();

    if (state.need) {
      const labels = {
        calmarme: "Herramientas para bajar activación",
        rumiacion: "Herramientas para salir del bucle mental",
        entender: "Herramientas para entender lo que sientes",
        energia: "Herramientas para días con poca energía",
        orden: "Herramientas para ordenar la cabeza",
        concentrarme: "Herramientas para recuperar foco",
        limites: "Herramientas para preparar y sostener límites",
        desconectar: "Herramientas para cerrar y desconectar"
      };
      wellnessContext.textContent = labels[state.need] || "";
      wellnessContext.hidden = false;
    } else {
      wellnessContext.hidden = true;
    }

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "space-empty";
      empty.textContent = state.filter === "favoritos"
        ? "Todavía no has guardado herramientas favoritas en este dispositivo."
        : "No hay herramientas en este filtro. Prueba otra categoría.";
      wellnessList.append(empty);
      return;
    }

    items.forEach(activity => {
      const card = document.createElement("article");
      card.className = "wellness-card";
      card.innerHTML = `
        <div class="wellness-card-top">
          <span class="wellness-card-type">${typeLabel(activity.type)}</span>
          <button class="wellness-fav-mini ${isFavorite(activity.id) ? "is-favorite" : ""}" type="button" aria-label="${isFavorite(activity.id) ? "Quitar de favoritos" : "Guardar en favoritos"}" data-favorite-id="${activity.id}">♥</button>
        </div>
        <h3></h3>
        <p></p>
        <div class="wellness-card-meta"><span>${activity.duration}</span><button type="button" data-activity-id="${activity.id}">Abrir herramienta</button></div>
      `;
      card.querySelector("h3").textContent = activity.title;
      card.querySelector("p").textContent = activity.summary;
      wellnessList.append(card);
    });
  }

  function openActivity(activity) {
    state.currentActivity = activity;
    favoriteButton.hidden = false;
    completeButton.hidden = false;
    dialogType.textContent = typeLabel(activity.type);
    dialogTitle.textContent = activity.title;
    dialogIntro.textContent = activity.intro;
    dialogSteps.replaceChildren();
    activity.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      dialogSteps.append(li);
    });
    dialogNote.textContent = activity.note || "";
    favoriteButton.textContent = isFavorite(activity.id) ? "Quitar de favoritos" : "Guardar en favoritos";
    completeButton.textContent = "Marcar como realizada";
    dialog.showModal();
  }

  function openRoutine(routine) {
    state.currentActivity = null;
    dialogType.textContent = routine.type;
    dialogTitle.textContent = routine.title;
    dialogIntro.textContent = routine.intro;
    dialogSteps.replaceChildren();
    routine.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      dialogSteps.append(li);
    });
    dialogNote.textContent = routine.note || "";
    favoriteButton.hidden = true;
    completeButton.hidden = true;
    dialog.showModal();
  }

  function toggleFavorite(id) {
    if (isFavorite(id)) state.favorites = state.favorites.filter(item => item !== id);
    else state.favorites.push(id);
    saveState();
    renderWellness();
    renderProgress();
  }

  function completeActivity(id) {
    state.completed.push({ id, at: new Date().toISOString() });
    saveState();
    completeButton.textContent = "Realizada ✓";
    renderProgress();
  }

  function renderProgress() {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const week = state.completed.filter(item => {
      const when = new Date(item.at).getTime();
      return Number.isFinite(when) && now - when <= sevenDays;
    });

    document.getElementById("progress-total").textContent = String(state.completed.length);
    document.getElementById("progress-week").textContent = String(week.length);
    document.getElementById("progress-favorites").textContent = String(state.favorites.length);

    const history = document.getElementById("progress-history");
    history.replaceChildren();
    const recent = [...state.completed].reverse().slice(0, 12);
    if (!recent.length) {
      const empty = document.createElement("div");
      empty.className = "space-empty";
      empty.textContent = "Todavía no has marcado ninguna actividad como realizada.";
      history.append(empty);
      return;
    }

    recent.forEach(item => {
      const activity = activities.find(entry => entry.id === item.id);
      if (!activity) return;
      const row = document.createElement("div");
      row.className = "space-history-item";
      const left = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = activity.title;
      const type = document.createElement("span");
      type.textContent = typeLabel(activity.type);
      left.append(title, type);
      const time = document.createElement("time");
      const date = new Date(item.at);
      time.dateTime = item.at;
      time.textContent = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(date);
      row.append(left, time);
      history.append(row);
    });
  }

  function importBetweenSessionsToken() {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token") || "";
    if (/^[A-Za-z0-9_-]{40,}$/.test(token)) {
      sessionStorage.setItem(BETWEEN_KEY, token);
      url.searchParams.delete("token");
      history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
    const hasAccess = /^[A-Za-z0-9_-]{40,}$/.test(sessionStorage.getItem(BETWEEN_KEY) || "");
    const status = document.getElementById("space-therapy-status");
    if (hasAccess && status) {
      status.textContent = "Tienes un acceso protegido activo para consultar el material que Carolina te ha enviado.";
    }
  }

  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      state.need = null;
      showView(button.dataset.spaceView);
    });
  });

  document.querySelectorAll("[data-need]").forEach(button => {
    button.addEventListener("click", () => {
      state.need = button.dataset.need;
      state.filter = "all";
      document.querySelectorAll("[data-wellness-filter]").forEach(filter => {
        filter.classList.toggle("is-active", filter.dataset.wellnessFilter === "all");
      });
      showView("wellness");
    });
  });

  document.querySelectorAll("[data-wellness-filter]").forEach(button => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.wellnessFilter;
      state.need = null;
      document.querySelectorAll("[data-wellness-filter]").forEach(other => {
        other.classList.toggle("is-active", other === button);
      });
      renderWellness();
    });
  });

  wellnessList?.addEventListener("click", event => {
    const open = event.target.closest("[data-activity-id]");
    if (open) {
      const activity = activities.find(item => item.id === open.dataset.activityId);
      if (activity) openActivity(activity);
      return;
    }
    const fav = event.target.closest("[data-favorite-id]");
    if (fav) toggleFavorite(fav.dataset.favoriteId);
  });

  document.querySelectorAll("[data-routine]").forEach(button => {
    button.addEventListener("click", () => {
      const routine = routines[button.dataset.routine];
      if (routine) openRoutine(routine);
    });
  });

  document.querySelector("[data-open-featured]")?.addEventListener("click", () => {
    const featured = activities.find(item => item.id === "problema-o-prediccion");
    if (featured) openActivity(featured);
  });

  document.getElementById("wellness-dialog-close")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  favoriteButton?.addEventListener("click", () => {
    if (!state.currentActivity) return;
    toggleFavorite(state.currentActivity.id);
    favoriteButton.textContent = isFavorite(state.currentActivity.id) ? "Quitar de favoritos" : "Guardar en favoritos";
  });

  completeButton?.addEventListener("click", () => {
    if (state.currentActivity) completeActivity(state.currentActivity.id);
  });

  document.getElementById("space-clear-local")?.addEventListener("click", () => {
    const ok = window.confirm("¿Quieres borrar de este dispositivo tus favoritos y el registro de actividades realizadas?");
    if (!ok) return;
    state.favorites = [];
    state.completed = [];
    localStorage.removeItem(FAVORITES_KEY);
    localStorage.removeItem(COMPLETED_KEY);
    renderProgress();
    renderWellness();
    const message = document.getElementById("space-clear-message");
    if (message) message.textContent = "Datos locales borrados.";
  });

  importBetweenSessionsToken();
  renderWellness();
  renderProgress();
})();
