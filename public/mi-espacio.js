(() => {
  "use strict";

  const LEGACY_BETWEEN_KEY = "between_sessions_access_token";
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
    favorites: [],
    completed: [],
    storageScope: null,
    storageScopeVersion: 0,
    portalAuthenticated: false,
    portalData: null,
    guestMode: false,
    accessEmail: ""
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
  const accessGate = document.getElementById("space-access");
  const shell = document.getElementById("space-shell");
  const emailForm = document.getElementById("space-email-form");
  const loginForm = document.getElementById("space-login-form");
  const setupForm = document.getElementById("space-set-password-form");
  const accessEmail = document.getElementById("space-access-email");
  const loginEmail = document.getElementById("space-login-email");
  const loginPassword = document.getElementById("space-login-password");
  const setupEmail = document.getElementById("space-setup-email");
  const setupPassword = document.getElementById("space-new-password");
  const confirmPassword = document.getElementById("space-confirm-password");
  const openPanelButton = document.getElementById("space-open-panel");
  const accessMessage = document.getElementById("space-access-message");
  let passwordLinkFlow = "";
  let passwordTokenHash = "";
  let linkPurpose = "setup";
  const patientMaterials = document.getElementById("space-patient-materials");

  function loadJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function scopedWellnessKey(base) {
    return state.storageScope ? base + ":" + state.storageScope : null;
  }

  function useWellnessStorage(scope) {
    state.storageScope = scope || null;
    const legacyGuest = scope === "guest";
    state.favorites = scope ? loadJson(scopedWellnessKey(FAVORITES_KEY), legacyGuest ? loadJson(FAVORITES_KEY, []) : []) : [];
    state.completed = scope ? loadJson(scopedWellnessKey(COMPLETED_KEY), legacyGuest ? loadJson(COMPLETED_KEY, []) : []) : [];
    if (legacyGuest) {
      try {
        const favoritesKey = scopedWellnessKey(FAVORITES_KEY);
        const completedKey = scopedWellnessKey(COMPLETED_KEY);
        if (favoritesKey && !localStorage.getItem(favoritesKey)) localStorage.setItem(favoritesKey, JSON.stringify(state.favorites));
        if (completedKey && !localStorage.getItem(completedKey)) localStorage.setItem(completedKey, JSON.stringify(state.completed));
        localStorage.removeItem(FAVORITES_KEY);
        localStorage.removeItem(COMPLETED_KEY);
      } catch {}
    }
    renderWellness();
    renderProgress();
  }

  async function loadPatientWellnessStorage() {
    const revision = ++state.storageScopeVersion;
    useWellnessStorage(null);
    try {
      const response = await fetch("/api/patient-portal/preferences", {
        credentials: "include", cache: "no-store"
      });
      if (!response.ok) return;
      const body = await response.json();
      const scope = typeof body.storage_scope === "string" && /^[a-f0-9]{24}$/.test(body.storage_scope)
        ? body.storage_scope : null;
      if (revision === state.storageScopeVersion && state.portalAuthenticated && scope) {
        useWellnessStorage(scope);
      }
    } catch {
      // Nunca reutilizamos los favoritos de otra cuenta si falla la identificación.
    }
  }

  function saveState() {
    const favoritesKey = scopedWellnessKey(FAVORITES_KEY);
    const completedKey = scopedWellnessKey(COMPLETED_KEY);
    if (!favoritesKey || !completedKey) return;
    try {
      localStorage.setItem(favoritesKey, JSON.stringify(state.favorites));
      localStorage.setItem(completedKey, JSON.stringify(state.completed.slice(-100)));
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

  function setAccessMessage(message, isError = false) {
    if (!accessMessage) return;
    accessMessage.textContent = message || "";
    accessMessage.classList.toggle("is-error", Boolean(isError));
  }

  function showAccessForm(which) {
    if (loginForm) loginForm.hidden = which !== "login";
    if (emailForm) emailForm.hidden = which !== "email";
    if (setupForm) setupForm.hidden = which !== "setup";
    if (openPanelButton) openPanelButton.hidden = true;
    setAccessMessage("");
    if (which === "login") loginEmail?.focus();
    if (which === "email") accessEmail?.focus();
    if (which === "setup") setupEmail?.focus();
  }

  function showAccessGate() {
    if (accessGate) accessGate.hidden = false;
    if (shell) shell.hidden = true;
    if (!passwordTokenHash) showAccessForm("login");
  }

  function openPortal(view = "today") {
    if (accessGate) accessGate.hidden = true;
    if (shell) shell.hidden = false;
    showView(view);
  }

  function appointmentText(appointment) {
    if (!appointment?.starts_at) return null;
    try {
      const date = new Date(appointment.starts_at);
      const formatted = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      return null;
    }
  }

  function materialTypeLabel(document) {
    return document?.material_type === "psychoeducation" ? "Psicoeducación" : "Ejercicio";
  }

  function appendPatientSection(target, title, value) {
    const text = String(value || "").trim();
    if (!text) return;
    const section = document.createElement("section");
    section.className = "space-patient-section";
    const heading = document.createElement("h4");
    heading.textContent = title;
    const copy = document.createElement("p");
    copy.textContent = text;
    section.append(heading, copy);
    target.append(section);
  }

  function patientResponseData(item, questionCount) {
    const source = item?.patient_response && typeof item.patient_response === "object" ? item.patient_response : {};
    const answers = Array.isArray(source.answers) ? source.answers : [];
    return {
      record: String(source.record || ""),
      answers: Array.from({ length: questionCount }, (_, index) => String(answers[index] || ""))
    };
  }

  async function savePatientMaterialResponse(item, form, action, status) {
    const button = form.querySelector(`button[value="${action}"]`);
    const buttons = [...form.querySelectorAll("button")];
    buttons.forEach((node) => { node.disabled = true; });
    if (status) status.textContent = action === "share" ? "Compartiendo…" : "Guardando…";
    try {
      const record = form.querySelector("[data-response-record]")?.value || "";
      const answers = [...form.querySelectorAll("[data-response-answer]")].map((field) => field.value || "");
      const response = await fetch("/api/patient-portal/response", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material_id: item.id, action, record, answers })
      });
      const body = await response.json().catch(() => ({}));
      if (response.status === 401) {
        state.portalAuthenticated = false;
        state.portalData = null;
        showAccessGate();
        setAccessMessage("Tu sesión ha caducado. Solicita un nuevo enlace.", true);
        return;
      }
      if (!response.ok) throw new Error(body.error || "No se ha podido guardar.");
      item.patient_response = { version: 1, record, answers };
      item.patient_response_status = body.status;
      item.patient_response_updated_at = body.saved_at;
      item.patient_response_shared_at = body.status === "shared" ? body.saved_at : null;
      if (status) {
        status.classList.toggle("shared", body.status === "shared");
        status.textContent = body.status === "shared"
          ? "Respuestas compartidas con Carolina."
          : "Borrador guardado. Carolina todavía no ve estas respuestas.";
      }
    } catch (error) {
      if (status) status.textContent = error?.message || "No se ha podido guardar.";
    } finally {
      buttons.forEach((node) => { node.disabled = false; });
      if (button) button.blur();
    }
  }


  // Guide is attached to an existing exercise response; no clinical data in localStorage.
  function createGuidedRecord(recordField) {
    const panel = document.createElement("details");
    panel.className = "space-guided-record";
    const summary = document.createElement("summary");
    summary.textContent = "Hacer un autorregistro paso a paso";
    const description = document.createElement("p");
    description.textContent = "Contesta solo lo que quieras. Después añade el texto al ejercicio y guárdalo.";
    const prompts = [
      ["Situación", "¿Qué ocurrió?"],
      ["Pensamientos", "¿Qué pasó por tu mente?"],
      ["Emociones", "¿Qué sentiste?"],
      ["Sensaciones", "¿Qué notaste en tu cuerpo?"],
      ["Respuesta", "¿Qué hiciste o evitaste hacer?"],
      ["Reflexión", "¿Qué te gustaría recordar o probar?"]
    ];
    const fields = document.createElement("div");
    fields.className = "space-guided-fields";
    const inputs = prompts.map(([title, hint]) => {
      const label = document.createElement("label");
      label.className = "space-guided-field";
      const name = document.createElement("strong");
      name.textContent = title;
      const help = document.createElement("span");
      help.textContent = hint;
      const input = document.createElement("textarea");
      input.maxLength = 1800;
      input.rows = 2;
      label.append(name, help, input);
      fields.append(label);
      return { title, input };
    });
    const actions = document.createElement("div");
    actions.className = "space-guided-actions";
    const add = document.createElement("button");
    add.type = "button";
    add.className = "space-secondary";
    add.textContent = "Añadir a mi ejercicio";
    const status = document.createElement("span");
    status.className = "space-small";
    status.setAttribute("role", "status");
    add.addEventListener("click", () => {
      const answered = inputs.filter(({ input }) => input.value.trim());
      if (!answered.length) { status.textContent = "Escribe al menos una respuesta."; return; }
      const text = ["AUTORREGISTRO", ...answered.map(({ title, input }) => title + ":\n" + input.value.trim())].join("\n\n");
      const next = [recordField.value.trim(), text].filter(Boolean).join("\n\n────────\n\n");
      if (next.length > 12000) { status.textContent = "El ejercicio ha alcanzado su longitud máxima."; return; }
      recordField.value = next;
      inputs.forEach(({ input }) => { input.value = ""; });
      status.textContent = "Añadido al ejercicio. Pulsa Guardar borrador para conservarlo.";
      recordField.focus();
    });
    actions.append(add, status);
    panel.append(summary, description, fields, actions);
    return panel;
  }

  function createPatientMaterial(item, index) {
    const documentData = item?.patient_document && typeof item.patient_document === "object" ? item.patient_document : {};
    const details = document.createElement("details");
    details.className = "space-patient-material";
    if (index === 0) details.open = true;

    const summary = document.createElement("summary");
    const titleWrap = document.createElement("div");
    titleWrap.className = "space-patient-material-title";
    const title = document.createElement("strong");
    title.textContent = item.title || "Material";
    const meta = document.createElement("span");
    meta.textContent = materialTypeLabel(documentData) + (item.status === "reviewed" ? " · revisado" : "");
    titleWrap.append(title, meta);
    const chevron = document.createElement("span");
    chevron.className = "space-patient-material-chevron";
    chevron.textContent = "⌄";
    summary.append(titleWrap, chevron);

    const body = document.createElement("div");
    body.className = "space-patient-material-body";
    appendPatientSection(body, "Para qué sirve", documentData.introduction || documentData.why);
    appendPatientSection(body, documentData.material_type === "psychoeducation" ? "Contenido" : "Cómo hacerlo", documentData.instructions);
    appendPatientSection(body, "Ejemplo", documentData.example);
    appendPatientSection(body, "Qué conviene recordar", documentData.remember);

    if (documentData.material_type !== "psychoeducation") {
      const questions = Array.isArray(documentData.session_questions) && documentData.session_questions.length
        ? documentData.session_questions.slice(0, 6)
        : ["¿Qué te resultó más fácil o más difícil?", "¿Qué observaste al probarlo?", "¿Qué ajustarías para que te resulte más útil?"];
      const saved = patientResponseData(item, questions.length);
      const responseBox = document.createElement("div");
      responseBox.className = "space-patient-response";
      const heading = document.createElement("h4");
      heading.textContent = "Rellena el ejercicio aquí";
      const explainer = document.createElement("p");
      explainer.textContent = "Puedes escribir o utilizar el autorregistro guiado. Solo se comparte con Carolina si pulsas «Compartir respuestas».";
      const form = document.createElement("form");

      const recordLabel = document.createElement("label");
      recordLabel.textContent = documentData.record_prompt || "Mis notas y autorregistros";
      const record = document.createElement("textarea");
      record.dataset.responseRecord = "true";
      record.maxLength = 12000;
      record.value = saved.record;
      record.placeholder = "Escribe aquí…";
      recordLabel.append(record);
      form.append(createGuidedRecord(record), recordLabel);

      questions.forEach((question, questionIndex) => {
        const label = document.createElement("label");
        label.textContent = String(question);
        const field = document.createElement("textarea");
        field.dataset.responseAnswer = String(questionIndex);
        field.maxLength = 6000;
        field.value = saved.answers[questionIndex] || "";
        field.placeholder = "Tu respuesta…";
        label.append(field);
        form.append(label);
      });

      const actions = document.createElement("div");
      actions.className = "space-patient-response-actions";
      const draft = document.createElement("button");
      draft.className = "space-secondary";
      draft.type = "button";
      draft.value = "draft";
      draft.textContent = "Guardar borrador";
      const share = document.createElement("button");
      share.className = "space-primary";
      share.type = "button";
      share.value = "share";
      share.textContent = "Compartir respuestas con Carolina";
      actions.append(draft, share);

      const responseStatus = document.createElement("div");
      responseStatus.className = "space-patient-response-status";
      if (item.patient_response_status === "shared") {
        responseStatus.classList.add("shared");
        responseStatus.textContent = "Respuestas compartidas con Carolina.";
      } else if (item.patient_response_status === "draft") {
        responseStatus.textContent = "Borrador guardado. Carolina todavía no ve estas respuestas.";
      } else {
        responseStatus.textContent = "Todavía no has guardado respuestas.";
      }

      draft.addEventListener("click", () => savePatientMaterialResponse(item, form, "draft", responseStatus));
      share.addEventListener("click", () => savePatientMaterialResponse(item, form, "share", responseStatus));
      form.append(actions, responseStatus);
      responseBox.append(heading, explainer, form);
      body.append(responseBox);
    }

    details.append(summary, body);
    return details;
  }

  function renderPatientPortal(data) {
    state.portalData = data;
    state.portalAuthenticated = true;
    state.guestMode = false;

    const name = String(data?.patient?.first_name || "").trim();
    const title = document.getElementById("space-today-title");
    if (title) title.textContent = name ? `Hola, ${name}` : "Un espacio para ti";

    const appointment = data?.next_appointment || null;
    const appointmentTitle = document.getElementById("space-appointment-title");
    const appointmentCopy = document.getElementById("space-appointment-copy");
    const formatted = appointmentText(appointment);
    if (appointmentTitle) appointmentTitle.textContent = formatted || "No tienes una próxima cita registrada";
    if (appointmentCopy) appointmentCopy.textContent = formatted
      ? "Esta es la próxima cita que consta en tu agenda."
      : "Cuando haya una nueva cita vinculada a tu ficha aparecerá aquí.";

    const materials = Array.isArray(data?.materials) ? data.materials : [];
    const count = document.getElementById("space-material-count");
    if (count) count.textContent = materials.length === 1 ? "1 material disponible" : `${materials.length} materiales disponibles`;
    const quickCount = document.getElementById("space-quick-material-count");
    if (quickCount) quickCount.textContent = materials.length
      ? `Tienes ${materials.length} ${materials.length === 1 ? "material disponible" : "materiales disponibles"} para trabajar.`
      : "Aquí encontrarás los ejercicios que Carolina comparta contigo.";
    const therapyStatus = document.getElementById("space-therapy-status");
    if (therapyStatus) therapyStatus.textContent = materials.length
      ? "Tienes material disponible para trabajar entre sesiones."
      : "No tienes material pendiente en este momento.";

    if (patientMaterials) {
      patientMaterials.replaceChildren();
      if (!materials.length) {
        const empty = document.createElement("div");
        empty.className = "space-empty";
        empty.textContent = "No tienes materiales disponibles en este momento.";
        patientMaterials.append(empty);
      } else {
        materials.forEach((item, index) => patientMaterials.append(createPatientMaterial(item, index)));
      }
    }

    window.dispatchEvent(new Event("patient-portal-session-ready"));
    void loadPatientWellnessStorage();
    openPortal("today");
  }

  async function loadPatientSession() {
    try {
      const response = await fetch("/api/patient-portal/session", {
        cache: "no-store",
        credentials: "include"
      });
      if (!response.ok) {
        state.portalAuthenticated = false;
        showAccessGate();
        return false;
      }
      const data = await response.json();
      if (!data?.authenticated) {
        showAccessGate();
        return false;
      }
      renderPatientPortal(data);
      return true;
    } catch {
      showAccessGate();
      setAccessMessage("No se ha podido comprobar el acceso. Puedes volver a intentarlo.", true);
      return false;
    }
  }

  async function patientAuthRequest(action, data) {
    const response = await fetch("/api/patient-portal/" + action, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(data),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || "No se ha podido completar la solicitud.");
    return body;
  }

  function setBusy(form, busy) {
    form?.querySelectorAll('button[type="submit"]').forEach(button => {
      button.disabled = Boolean(busy);
    });
  }

  async function requestPatientLink(event) {
    event.preventDefault();
    const email = String(accessEmail?.value || "").trim().toLowerCase();
    if (!email) return;
    setBusy(emailForm, true);
    setAccessMessage("Solicitando un enlace seguro…");
    try {
      await patientAuthRequest("password-link", { email, purpose: linkPurpose });
      setAccessMessage("Si el correo está habilitado, recibirás un enlace. Comprueba también el correo no deseado.");
    } catch (error) {
      setAccessMessage(error?.message || "No se ha podido solicitar el enlace.", true);
    } finally {
      setBusy(emailForm, false);
    }
  }

  async function setNewPassword(event) {
    event.preventDefault();
    const email = String(setupEmail?.value || "").trim().toLowerCase();
    const password = String(setupPassword?.value || "");
    if (password.length < 12 || password.length > 128 || password !== String(confirmPassword?.value || "")) {
      setAccessMessage("Comprueba las contraseñas: deben coincidir y tener al menos 12 caracteres.", true);
      return;
    }
    setBusy(setupForm, true);
    setAccessMessage("Guardando tu contraseña…");
    try {
      await patientAuthRequest("password-set", {
        email, password, token_hash: passwordTokenHash, flow: passwordLinkFlow
      });
      passwordTokenHash = "";
      passwordLinkFlow = "";
      if (setupPassword) setupPassword.value = "";
      if (confirmPassword) confirmPassword.value = "";
      showAccessForm("login");
      if (loginEmail) loginEmail.value = email;
      setAccessMessage("Contraseña guardada. Introduce tu correo y contraseña para entrar.");
    } catch (error) {
      setAccessMessage(error?.message || "No se ha podido guardar la contraseña.", true);
    } finally {
      setBusy(setupForm, false);
    }
  }

  async function loginWithPassword(event) {
    event.preventDefault();
    const email = String(loginEmail?.value || "").trim().toLowerCase();
    const password = String(loginPassword?.value || "");
    if (!email || !password) return;
    // Reserve a tab from a direct user gesture so popup blockers don't suppress it.
    const newTab = window.open("about:blank", "_blank");
    if (newTab) newTab.opener = null;
    setBusy(loginForm, true);
    setAccessMessage("Comprobando tus datos de acceso…");
    try {
      await patientAuthRequest("password-login", { email, password });
      if (loginPassword) loginPassword.value = "";
      const response = await fetch("/api/patient-portal/session", { credentials: "include", cache: "no-store" });
      const session = await response.json().catch(() => ({}));
      if (!response.ok || !session.authenticated) throw new Error("No se ha podido confirmar la sesión.");
      const url = "/mi-espacio/?vista=panel";
      if (newTab && !newTab.closed) {
        newTab.location.replace(url);
        setAccessMessage("Sesión iniciada. Mi espacio se ha abierto en otra pestaña.");
      } else {
        if (openPanelButton) openPanelButton.hidden = false;
        setAccessMessage("Sesión iniciada. Pulsa «Abrir Mi espacio» para abrirlo en otra pestaña.");
      }
    } catch (error) {
      if (newTab && !newTab.closed) newTab.close();
      setAccessMessage(error?.message || "Correo o contraseña incorrectos.", true);
    } finally {
      setBusy(loginForm, false);
    }
  }

  function resetPatientAccess() {
    state.accessEmail = "";
    if (loginPassword) loginPassword.value = "";
    if (setupPassword) setupPassword.value = "";
    if (confirmPassword) confirmPassword.value = "";
    passwordTokenHash = "";
    passwordLinkFlow = "";
    showAccessForm("login");
  }

  function verifySetupLinkFromUrl() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const tokenHash = fragment.get("configurar");
    const flow = fragment.get("tipo");
    if (!tokenHash) return false;
    history.replaceState(null, "", window.location.pathname + window.location.search);
    if (!/^[A-Za-z0-9_-]{32,256}$/.test(tokenHash) || !["invite", "recovery"].includes(flow)) {
      showAccessForm("login");
      setAccessMessage("El enlace no es válido. Solicita otro.", true);
      return true;
    }
    passwordTokenHash = tokenHash;
    passwordLinkFlow = flow;
    showAccessGate();
    showAccessForm("setup");
    setAccessMessage("Introduce el correo que utilizas en consulta y crea tu contraseña.");
    return true;
  }

  async function logoutPatientPortal() {
    try {
      await fetch("/api/patient-portal/logout", { method: "POST", credentials: "include" });
    } catch {}
    state.portalAuthenticated = false;
    state.portalData = null;
    state.guestMode = false;
    state.storageScopeVersion++;
    useWellnessStorage(null);
    resetPatientAccess();
    showAccessGate();
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

  function clearLegacyAccessToken() {
    // Old URL tokens never grant clinical access. Remove them from browser URL and storage.
    const url = new URL(window.location.href);
    if (url.searchParams.has("token")) {
      url.searchParams.delete("token");
      history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
    try { sessionStorage.removeItem(LEGACY_BETWEEN_KEY); } catch (_) {}
  }

  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      const view = button.dataset.spaceView;
      if (view !== "wellness" && !state.portalAuthenticated) {
        state.guestMode = false;
        showAccessGate();
        setAccessMessage("Para ver tu terapia, inicia sesión con tu correo y contraseña.");
        return;
      }
      state.need = null;
      showView(view);
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
    const favoritesKey = scopedWellnessKey(FAVORITES_KEY);
    const completedKey = scopedWellnessKey(COMPLETED_KEY);
    if (favoritesKey) localStorage.removeItem(favoritesKey);
    if (completedKey) localStorage.removeItem(completedKey);
    renderProgress();
    renderWellness();
    const message = document.getElementById("space-clear-message");
    if (message) message.textContent = "Datos locales borrados.";
  });

  emailForm?.addEventListener("submit", requestPatientLink);
  loginForm?.addEventListener("submit", loginWithPassword);
  setupForm?.addEventListener("submit", setNewPassword);
  document.getElementById("space-first-access")?.addEventListener("click", () => {
    linkPurpose = "setup";
    const heading = document.getElementById("space-email-title");
    if (heading) heading.textContent = "Tu primer acceso";
    const info = document.getElementById("space-email-description");
    if (info) info.textContent = "Recibirás un enlace para configurar tu contraseña.";
    showAccessForm("email");
  });
  document.getElementById("space-forgot-password")?.addEventListener("click", () => {
    linkPurpose = "reset";
    const heading = document.getElementById("space-email-title");
    if (heading) heading.textContent = "Recuperar contraseña";
    const info = document.getElementById("space-email-description");
    if (info) info.textContent = "Te enviaremos un enlace para elegir una nueva contraseña.";
    if (accessEmail && loginEmail) accessEmail.value = loginEmail.value;
    showAccessForm("email");
  });
  document.querySelectorAll("[data-back-to-login]").forEach(button => button.addEventListener("click", () => {
    passwordTokenHash = "";
    passwordLinkFlow = "";
    showAccessForm("login");
  }));
  openPanelButton?.addEventListener("click", () => {
    window.open("/mi-espacio/?vista=panel", "_blank", "noopener,noreferrer");
  });

  document.getElementById("space-wellness-guest")?.addEventListener("click", () => {
    state.guestMode = true;
    state.portalAuthenticated = false;
    state.storageScopeVersion++;
    useWellnessStorage("guest");
    window.dispatchEvent(new Event("patient-portal-session-ready"));
    openPortal("wellness");
  });
  document.querySelectorAll("[data-go-therapy]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.portalAuthenticated) showView("therapy");
      else {
        showAccessGate();
        setAccessMessage("Para ver tu terapia, inicia sesión con tu contraseña.");
      }
    });
  });
  document.getElementById("space-logout")?.addEventListener("click", logoutPatientPortal);

  clearLegacyAccessToken();
  renderWellness();
  renderProgress();
  const configuringPassword = verifySetupLinkFromUrl();
  if (!configuringPassword) {
    if (new URLSearchParams(window.location.search).get("vista") === "panel") {
      loadPatientSession();
    } else {
      showAccessGate();
    }
  }
})();
