(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const area = () => $("clinic-clinical-area")?.value || "psychology";
  let blocks = [];
  const LIMIT = 8;
  const types = {
    image: "Fotografía o imagen",
    table: "Tabla de trabajo",
    chart: "Gráfico de barras",
    diagram: "Secuencia visual",
    calendar: "Calendario mensual"
  };
  const descriptors = {
    image: "Imagen: selecciona PNG o JPEG sin datos identificativos. Añade una descripción accesible.",
    table: "Primera línea: encabezados separados por |. Siguientes líneas: una fila por línea, también con |.",
    chart: "Una categoría por línea: etiqueta | número. Solo datos reales o ficticios identificados como tales.",
    diagram: "Un paso por línea. Orden y contenido comprobados por el profesional.",
    calendar: "Mes en formato AAAA-MM. Opcional: acontecimientos como día | descripción, uno por línea."
  };
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function field(labelText, value, onChange, multiline = false) {
    const label = el("label", labelText);
    const input = el(multiline ? "textarea" : "input");
    if (multiline) input.rows = 4;
    input.value = value || "";
    input.addEventListener("input", () => onChange(input.value));
    label.append(input);
    return label;
  }
  function panelVisible() {
    const visible = area() === "neuropsychology";
    const section = $("clinic-neuro-settings");
    if (section) section.hidden = !visible;
    const hint = $("clinic-clinical-area-hint");
    if (hint) hint.textContent = visible
      ? "Un cuaderno por semana: ejercicios desarrollados, con ayudas y recursos visuales revisados."
      : "Se conserva íntegramente el generador de materiales psicológicos.";
    const period = $("clinic-material-period-help");
    if (period) period.textContent = visible
      ? "Neuropsicología: programa de 7 días con 3–4 ejercicios completos. La semana siguiente se genera después de revisar la evolución."
      : "Psicología: cuaderno para dos semanas con psicoeducación, actividades y espacio para dudas.";
  }
  function redraw() {
    panelVisible();
    const list = $("clinic-visual-block-list");
    if (!list) return;
    list.replaceChildren();
    blocks.forEach((block, index) => {
      const card = el("div", undefined, "clinic-visual-block");
      const top = el("div", undefined, "clinic-visual-block-top");
      top.append(el("strong", (index + 1) + ". " + (types[block.type] || "Recurso")));
      const del = el("button", "Eliminar", "clinic-secondary");
      del.type = "button";
      del.addEventListener("click", () => { blocks.splice(index, 1); redraw(); });
      top.append(del);
      card.append(top);
      card.append(field("Título del recurso", block.title, v => { block.title = v; }));
      if (block.type === "image") {
        const label = el("label", "Seleccionar imagen educativa (PNG o JPEG, máximo 450 KB)");
        const input = el("input");
        input.type = "file";
        input.accept = "image/png,image/jpeg";
        input.addEventListener("change", async () => {
          const file = input.files?.[0];
          if (!file) return;
          const message = $("clinic-exercise-message");
          if (!["image/png", "image/jpeg"].includes(file.type) || file.size > 450000) {
            if (message) message.textContent = "Utiliza PNG o JPEG de un máximo de 450 KB.";
            input.value = "";
            return;
          }
          const buffer = await file.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          const signaturePng = file.type === "image/png" && bytes.length > 8 &&
            bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
          const signatureJpeg = file.type === "image/jpeg" && bytes.length > 3 &&
            bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
          if (!signaturePng && !signatureJpeg) {
            if (message) message.textContent = "El contenido no coincide con un archivo de imagen válido.";
            input.value = "";
            return;
          }
          try {
            // Rasterizar elimina metadatos EXIF/GPS antes de guardar la fotografía.
            const bitmap = await createImageBitmap(file);
            const side = Math.max(bitmap.width, bitmap.height);
            const factor = Math.min(1, 1100 / side);
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(bitmap.width * factor));
            canvas.height = Math.max(1, Math.round(bitmap.height * factor));
            const context = canvas.getContext("2d");
            if (!context) throw new Error("No se puede preparar esta imagen.");
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
            bitmap.close?.();
            let encoded = canvas.toDataURL("image/jpeg", 0.8);
            if (encoded.length > 650000) encoded = canvas.toDataURL("image/jpeg", 0.6);
            if (encoded.length > 650000) throw new Error("La imagen sigue siendo demasiado grande; reduce sus dimensiones.");
            const others = blocks.filter(entry => entry !== block && entry.type === "image" && entry.data);
            if (others.length >= 2 || others.reduce((sum, entry) => sum + (entry.data?.length || 0), 0) + encoded.length > 1600000) {
              throw new Error("Límite del cuaderno: tres imágenes y 1,6 MB entre todas.");
            }
            block.data = encoded;
            redraw();
            if (message) message.textContent = "Imagen normalizada sin metadatos e incorporada. Revisa su contenido antes de prescribir.";
          } catch (error) {
            input.value = "";
            if (message) message.textContent = error?.message || "No se ha podido preparar la fotografía.";
          }
        });
        label.append(input);
        card.append(label);
        card.append(field("Descripción accesible de la imagen", block.alt || "", v => { block.alt = v; }));
        if (block.data) {
          const img = el("img");
          img.src = block.data;
          img.alt = block.alt || "Vista previa de imagen";
          img.className = "clinic-visual-preview-image";
          card.append(img);
        }
      } else {
        card.append(el("p", descriptors[block.type], "clinic-material-helper"));
        card.append(field(block.type === "calendar" ? "Mes / acontecimientos" : "Contenido estructurado", block.content || "", v => { block.content = v; }, true));
      }
      list.append(card);
    });
    $("clinic-visual-add")?.toggleAttribute("disabled", blocks.length >= LIMIT);
  }
  function validDocument(doc) {
    const issues = [];
    if (doc.clinical_area === "neuropsychology") {
      if (!doc.neuro_profile?.domain) issues.push("seleccionar dominio neuropsicológico");
      if (!doc.neuro_profile?.level) issues.push("seleccionar nivel de demanda");
      if (!String(doc.objective || "").trim()) issues.push("definir objetivo observable");
      const expectedWeek = Math.max(1,Math.min(52,Number(doc.neuro_profile?.week_number)||1));
      const headings = (doc.instructions || "").match(/(?:^|\n)\s*Semana\s+\d+\b/gi) || [];
      const exercises = (doc.instructions || "").match(/(?:^|\n)\s*Ejercicio\s+\d+\s*:/gi) || [];
      if (headings.length !== 1 || !new RegExp("(?:^|\\n)\\s*Semana\\s+" + expectedWeek + "\\b","i").test(doc.instructions || "")) issues.push("un único apartado Semana " + expectedWeek + " por cuaderno");
      if (exercises.length < 3 || exercises.length > 4) issues.push("entre tres y cuatro ejercicios desarrollados en esta semana");
    }
    (doc.visual_blocks || []).forEach((b, i) => {
      if (!b.title?.trim()) issues.push("titular recurso " + (i + 1));
      if (b.type === "image" && (!b.data || !b.alt?.trim())) issues.push("imagen " + (i + 1) + " sin archivo o descripción");
      if (b.type !== "image" && !b.content?.trim()) issues.push("completar recurso " + (i + 1));
      const lines = (b.content || "").split(/\r?\n/).map(x => x.trim()).filter(Boolean);
      if (b.type === "chart" && (lines.length < 2 || lines.length > 8 || lines.some(row => {
        const p = row.split("|");
        const value = Number(p[1]);
        return p.length !== 2 || !p[0].trim() || !Number.isFinite(value) || value < 0 || value > 10000;
      }))) issues.push("revisar el gráfico " + (i + 1) + ": de 2 a 8 etiquetas con valores de 0 a 10.000");
      if (b.type === "table" && (() => {
        const cells = lines.map(row => row.split("|"));
        const columns = cells[0]?.length || 0;
        return lines.length < 2 || lines.length > 13 || columns < 2 || columns > 6 || cells.some(row => row.length !== columns);
      })()) issues.push("revisar la tabla " + (i + 1) + ": encabezados y filas con iguales columnas (2 a 6)");
      if (b.type === "diagram" && (lines.length < 2 || lines.length > 8)) issues.push("la secuencia " + (i + 1) + " necesita entre 2 y 8 pasos");
      if (b.type === "calendar" && (() => {
        const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(lines[0] || "");
        if (!match) return true;
        const year = Number(match[1]), month = Number(match[2]);
        const maxDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
        return year < 1900 || year > 2100 || lines.slice(1).some(row => {
          const parts = row.split("|");
          const day = Number(parts[0]);
          return parts.length < 2 || !Number.isInteger(day) || day < 1 || day > maxDay || !parts.slice(1).join("|").trim();
        });
      })()) issues.push("revisar el calendario " + (i + 1) + ": AAAA-MM y líneas día | actividad");
    });
    return { ok: !issues.length, issues };
  }
  function read() {
    const result = {
      clinical_area: area(),
      neuro_profile: area() === "neuropsychology" ? {
        domain: $("clinic-neuro-domain")?.value || "",
        intervention: $("clinic-neuro-intervention")?.value || "",
        level: $("clinic-neuro-level")?.value || "",
        theme: $("clinic-neuro-theme")?.value?.trim() || "",
        functional_goal: $("clinic-neuro-functional-goal")?.value?.trim() || "",
        week_number: Math.max(1, Math.min(52, Number($("clinic-neuro-week-number")?.value) || 1))
      } : null,
      visual_blocks: blocks.map(b => ({ ...b }))
    };
    return result;
  }
  function hydrate(doc) {
    const clinicalArea = doc?.clinical_area === "neuropsychology" ? "neuropsychology" : "psychology";
    if ($("clinic-neuro-reviewed")) $("clinic-neuro-reviewed").checked = false;
    if ($("clinic-clinical-area")) $("clinic-clinical-area").value = clinicalArea;
    const neuro = doc?.neuro_profile || {};
    if ($("clinic-neuro-week-number")) $("clinic-neuro-week-number").value = String(Math.max(1,Math.min(52,Number(neuro.week_number)||1)));
    for (const [name, id] of Object.entries({
      domain: "clinic-neuro-domain", intervention: "clinic-neuro-intervention",
      level: "clinic-neuro-level", theme: "clinic-neuro-theme",
      functional_goal: "clinic-neuro-functional-goal"
    })) {
      if ($(id)) $(id).value = neuro[name] || "";
    }
    blocks = Array.isArray(doc?.visual_blocks) ? doc.visual_blocks.filter(b => types[b.type]).slice(0, LIMIT).map(b => ({ ...b })) : [];
    redraw();
  }

  const DOMAIN_LABELS = {
    orientacion_temporal: "Orientación temporal", orientacion_espacial: "Orientación espacial",
    orientacion_personal: "Orientación personal", atencion: "Atención", memoria: "Memoria",
    funciones_ejecutivas: "Funciones ejecutivas", lenguaje: "Lenguaje",
    visuoespacial: "Visuoespacial", praxias_gnosias: "Praxias y gnosias",
    cognicion_funcional: "Cognición funcional"
  };
  let starterEntries = [];
  function starterToDocument(item) {
    const tasks=Array.isArray(item.steps)?item.steps.slice(0,4):[];
    const week=Math.max(1,Math.min(52,Number($("clinic-neuro-week-number")?.value)||1));
    const domain=DOMAIN_LABELS[item.domain]||"funciones cognitivas";
    const visual=Array.isArray(item.visual_blocks)?item.visual_blocks[0]:null;
    const visualName=visual?.title||"material de apoyo seleccionado por la profesional";
    const visualSample=(visual?.content||"").split(/\r?\n/).slice(1,3).join("; ")||"un ejemplo previamente modelado";
    const support=item.level==="apoyo_alto"
      ?"Mostrar primero la respuesta mediante modelado, ofrecer dos opciones y permitir señalamiento o respuesta no verbal. Evitar corregir confrontando."
      :item.level==="apoyo_moderado"
      ?"Comenzar con una pista contextual o visual; si no basta, dividir la consigna y ofrecer dos alternativas. Anotar qué pista ayudó."
      :"Permitir intento autónomo con apoyos a la vista; proporcionar una pista por vez y favorecer la autocorrección sin presionar.";
    const phases=[
      ["Familiarización y ejemplo guiado","Leer la consigna y presentar un modelo resuelto antes de solicitar la primera respuesta.","Comprobar que entiende la tarea sin usar la velocidad como criterio."],
      ["Práctica dirigida con apoyo graduado","Repetir con uno o dos estímulos diferentes, según tolerancia, y aplicar una pista solo cuando sea necesaria.","Comparar respuesta espontánea y respuesta con ayuda."],
      ["Variación contextual","Modificar un solo elemento de la actividad para comprobar que la estrategia sigue siendo comprensible.","Observar si mantiene la consigna o necesita volver al modelo."],
      ["Aplicación cotidiana y revisión (opcional)","Intentar la habilidad en una situación real y segura, con acompañamiento cuando corresponda.","Registrar utilidad funcional, iniciativa, fatiga y preferencias."]
    ];
    const exercises=tasks.map((task,i)=>{
      const [phase,guide,observed]=phases[i];
      return [
        "Ejercicio "+(i+1)+": "+phase,
        "Objetivo: "+item.objective+". En esta actividad: "+task+".",
        "Materiales: "+visualName+". Preparar el estímulo en tamaño legible y comprobar que es correcto, familiar y culturalmente apropiado.",
        "Preparación: Trabajar en un lugar tranquilo, con iluminación adecuada y sin distractores innecesarios. Explicar que se puede pedir ayuda o detener la actividad. Revisar las adaptaciones sensoriales y motoras.",
        "Pasos: 1) "+task+". 2) "+guide+" 3) Mostrar el recurso, dar una única consigna clara y permitir tiempo suficiente para responder. 4) Comprobar con la persona qué estrategia ha resultado útil y cerrar sin examen final.",
        "Ejemplo: En el recurso «"+visualName+"», trabajar con "+visualSample+". El profesional verificará el ejemplo y decidirá qué respuesta se considera adecuada para este caso.",
        "Ayudas: "+support,
        "Adaptación: Si resulta difícil, reducir el número de elementos, mantener a la vista una clave y pasar de evocación a reconocimiento. Si resulta fácil y es pertinente, retirar una pista, no aumentar la velocidad automáticamente.",
        "Duración y frecuencia: Propuesta de 10–15 minutos, una ocasión durante esta semana; la cuarta actividad es opcional. Interrumpir antes si surge fatiga o frustración. La pauta definitiva la acordará la profesional.",
        "Qué observar: "+observed+" Registrar participación, respuesta espontánea, errores cualitativos, ayudas, cansancio y posibilidad de transferencia."
      ].join("\n");
    });
    return {
      version:2,clinical_area:"neuropsychology",material_type:"exercise",duration_minutes:12,
      frequency:"Semana "+week+": elegir tres prácticas breves y, si resulta apropiado, una cuarta opcional. Ajustar días, duración y ayudas a la tolerancia.",
      introduction:"Semana "+week+" de intervención en "+domain.toLowerCase()+". Encontrarás ejercicios diferenciados, ejemplos y apoyos; no necesitas terminarlos todos ni responder sin ayuda.",
      why:"Esta propuesta trabaja «"+item.objective+"» mediante tareas concretas, apoyos graduados y una posible aplicación cotidiana. Su finalidad es favorecer la participación y las estrategias funcionales, no obtener una puntuación diagnóstica.",
      objective:item.objective,
      instructions:["Semana "+week, ...exercises].join("\n\n"),
      example:"Esquema: Preparar material → Modelar consigna → Practicar con apoyo → Revisar en consulta\nEjemplo específico: revisar «"+visualName+"» con el estímulo «"+visualSample+"» antes de comenzar. La profesional debe confirmar la exactitud y pertinencia.",
      record_prompt:tasks.map((task,i)=>
        "Ejercicio "+(i+1)+": "+task+"\nRespuesta o participación: ______________________\nAyuda utilizada: _______________________________\nFatiga, interés o dudas: _________________________"
      ).join("\n\n")+
        "\n\nDudas para comentar en consulta: ¿qué resultó más fácil?, ¿qué ayuda funcionó?, ¿qué habría que modificar?, ¿se utilizó algo en la vida diaria?",
      safety_note:"Respeta las pausas y la comodidad de la persona. Detén la tarea si aparecen frustración, cansancio o malestar. No fuerces recuerdos ni prácticas que impliquen riesgos.",
      remember:"Al finalizar esta semana revisaremos participación, ayudas y utilidad cotidiana. La profesional decidirá si conviene mantener, modificar o sustituir las actividades para la semana siguiente.",
      session_questions:["¿Qué facilitó la participación?","¿Cuáles fueron las ayudas necesarias?","¿Qué se pudo trasladar a una situación real?","¿Qué dudas o ajustes deben abordarse?"],
      neuro_profile:{domain:item.domain,intervention:item.intervention,level:item.level,theme:item.theme||"",functional_goal:item.objective,week_number:week},
      visual_blocks:Array.isArray(item.visual_blocks)?item.visual_blocks.map(block=>({...block})):[]
    };
  }

  async function initializeStarterLibrary() {
    const selector = $("clinic-neuro-starter");
    if (!selector) return;
    try {
      const response = await fetch("/clinic-neuro-starter-library.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Biblioteca no disponible");
      const parsed = await response.json();
      starterEntries = Array.isArray(parsed.activities) ? parsed.activities : [];
      starterEntries.forEach(item => {
        if (!item.code || !item.title || !item.domain || !Array.isArray(item.steps) || item.steps.length !== 4) return;
        const option = document.createElement("option");
        option.value = item.code;
        option.textContent = (DOMAIN_LABELS[item.domain] || item.domain) + " · " + item.title;
        selector.append(option);
      });
    } catch {
      const status = $("clinic-exercise-message");
      if (status) status.textContent = "No se pudo recuperar la biblioteca inicial. Puedes seguir creando actividades manualmente.";
    }
    $("clinic-neuro-starter-load")?.addEventListener("click", () => {
      const selected = starterEntries.find(item => item.code === selector.value);
      if (!selected) return;
      window.dispatchEvent(new CustomEvent("clinic-neuro-load-starter", {
        detail: { title: selected.title, code: selected.code, domain: selected.domain,
          patient_document: starterToDocument(selected), caution: selected.caution,
          record: selected.record }
      }));
    });
  }

  function init() {
    if (!$("clinic-clinical-area")) return;
    $("clinic-clinical-area").addEventListener("change", panelVisible);
    $("clinic-visual-add")?.addEventListener("click", () => {
      const type = $("clinic-visual-type")?.value;
      if (!types[type] || blocks.length >= LIMIT) return;
      blocks.push({ type, title: "", content: type === "calendar" ? new Date().toISOString().slice(0, 7) : "", alt: "", data: "" });
      redraw();
    });
    redraw();
    initializeStarterLibrary();
  }
  window.ClinicNeuroMaterials = { read, hydrate, validate: validDocument };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
