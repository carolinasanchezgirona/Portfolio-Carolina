(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const area = () => $("clinic-clinical-area")?.value || "psychology";
  let blocks = [];
  let coveredDomains = [];
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
    const review=$("clinic-neuro-review-wrapper");
    if(review) review.hidden=!visible;
    const hint = $("clinic-clinical-area-hint");
    if (hint) hint.textContent = visible
      ? "Crea fichas por función o cuadernos de 7 días con ejercicios, ayudas y recursos visuales revisados."
      : "Se conserva íntegramente el generador de materiales psicológicos.";
    const period = $("clinic-material-period-help");
    if (period) period.textContent = visible
      ? ($("clinic-neuro-mode")?.value==="weekly" ? "Cuaderno: 7 días orientativos, dos actividades por día y cobertura cognitiva." : $("clinic-neuro-mode")?.value==="individual" ? "Ejercicio individual: una actividad graduada, lista para revisar e imprimir." : "Ficha focal: tres actividades desarrolladas y adaptables.")
      : "Psicología: cuaderno para dos semanas con psicoeducación, actividades y espacio para dudas.";
  }

  function renderStructuredPreview(block, container) {
    container.replaceChildren();
    const lines=String(block.content||"").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    if(!lines.length)return;
    if(block.type==="table"){
      const rows=lines.map(row=>row.split("|").map(x=>x.trim())).slice(0,13);
      if(rows[0].length<2||rows[0].length>6||rows.some(row=>row.length!==rows[0].length)) {
        container.append(el("p","Revisa que todas las filas contengan las mismas columnas."));return;
      }
      const table=el("table");const head=el("thead");const row=el("tr");
      rows[0].forEach(value=>row.append(el("th",value)));
      head.append(row);table.append(head);
      const body=el("tbody");
      rows.slice(1).forEach(values=>{const r=el("tr");values.forEach(value=>r.append(el("td",value)));body.append(r);});
      table.append(body);container.append(table);
    }else if(block.type==="chart"){
      const parsed=lines.map(row=>row.split("|").map(x=>x.trim())).filter(row=>row.length===2&&row[0]&&Number.isFinite(Number(row[1]))&&Number(row[1])>=0&&Number(row[1])<=10000).slice(0,8);
      if(parsed.length<2){container.append(el("p","Escribe dos o más pares «categoría | valor» para visualizar el gráfico."));return;}
      const max=Math.max(1,...parsed.map(r=>Number(r[1])));
      parsed.forEach(([name,value])=>{
        const item=el("div",undefined,"clinic-visual-bar-row");
        item.append(el("span",name));
        const track=el("div",undefined,"clinic-visual-bar-track");
        const bar=el("div",undefined,"clinic-visual-bar-fill");
        bar.style.width=Math.max(0,Math.min(100,Number(value)/max*100))+"%";
        track.append(bar);item.append(track,el("strong",value));container.append(item);
      });
      container.append(el("p","Los gráficos representan exclusivamente los valores introducidos. No son resultados clínicos."));
    }else if(block.type==="diagram"){
      const list=el("ol");
      lines.slice(0,8).forEach(row=>list.append(el("li",row)));
      container.append(list);
    }else if(block.type==="calendar"){
      const month=lines[0]||"";
      if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)){container.append(el("p","Formato necesario: AAAA-MM en la primera línea."));return;}
      const [year,m]=month.split("-").map(Number);
      const count=new Date(Date.UTC(year,m,0)).getUTCDate();
      container.append(el("strong","Calendario de "+month+" · "+count+" días"));
      const note=el("p","Los acontecimientos se mostrarán en su día correspondiente en el PDF.");
      container.append(note);
    }
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
        const prompt = field("Describe la ilustración que necesitas (sin datos personales)",block.prompt||"",v=>{block.prompt=v;},true);
        const generate = el("button","Generar ilustración con IA","clinic-secondary");
        generate.type="button";
        generate.addEventListener("click",async()=>{
          const message=$("clinic-exercise-message");
          const brief=(block.prompt||"").trim();
          if(brief.length<12){if(message)message.textContent="Describe el contenido de la imagen con al menos 12 caracteres.";return;}
          let token="";
          try{token=JSON.parse(sessionStorage.getItem("dememoria_admin_session")||"null")?.access_token||"";}catch{}
          if(!token){if(message)message.textContent="Necesitas iniciar sesión profesional.";return;}
          generate.disabled=true;generate.textContent="Generando ilustración…";
          if(message)message.textContent="Generando ilustración genérica sin datos del paciente…";
          try{
            const response=await fetch("/api/clinical/visual-image",{
              method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
              body:JSON.stringify({brief})
            });
            const json=await response.json().catch(()=>({}));
            if(!response.ok||!json.data_url)throw new Error(json.error||"No se ha generado la ilustración.");
            const blob=await fetch(json.data_url).then(x=>x.blob());
            const bitmap=await createImageBitmap(blob);
            const factor=Math.min(1,1000/Math.max(bitmap.width,bitmap.height));
            const canvas=document.createElement("canvas");
            canvas.width=Math.max(1,Math.round(bitmap.width*factor));
            canvas.height=Math.max(1,Math.round(bitmap.height*factor));
            const ctx=canvas.getContext("2d");
            if(!ctx)throw new Error("No se ha podido preparar la imagen.");
            ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();
            let encoded=canvas.toDataURL("image/jpeg",.74);
            if(encoded.length>650000)encoded=canvas.toDataURL("image/jpeg",.54);
            const others=blocks.filter(x=>x!==block&&x.type==="image"&&x.data);
            if(encoded.length>650000||others.length>=2||others.reduce((sum,x)=>sum+(x.data?.length||0),0)+encoded.length>1600000)
              throw new Error("Límite de tres imágenes y 1,6 MB entre ellas. Elimina imágenes o usa otras más pequeñas.");
            block.data=encoded;block.alt||=brief.slice(0,180);
            redraw();
            if(message)message.textContent="Ilustración añadida. Antes de enviar verifica cada elemento, cantidad y relación espacial.";
          }catch(error){if(message)message.textContent=error?.message||"No se ha podido crear la ilustración.";}
          finally{generate.disabled=false;generate.textContent="Generar ilustración con IA";}
        });
        card.append(prompt,generate);
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
        const preview=el("div",undefined,"clinic-visual-block-preview");
        card.append(field(block.type === "calendar" ? "Mes / acontecimientos" : "Contenido estructurado", block.content || "", v => { block.content = v; renderStructuredPreview(block,preview); }, true));
        card.append(preview);
        renderStructuredPreview(block,preview);
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
      const instructions=doc.instructions||"";
      const exercises=instructions.match(/(?:^|\n)\s*Ejercicio\s+\d+\s*:/gi)||[];
      const weekly=doc.neuro_profile?.mode==="weekly";
      const individual=doc.neuro_profile?.mode==="individual";
      if(headings.length!==1||!new RegExp("(?:^|\\n)\\s*Semana\\s+"+expectedWeek+"\\b","i").test(instructions))issues.push("un único apartado Semana "+expectedWeek+" por cuaderno");
      if(weekly){
        if(exercises.length!==14)issues.push("14 ejercicios, dos por cada uno de los siete días");
        for(let day=1;day<=7;day++)if((instructions.match(new RegExp("Día "+day+"\\s*[·:]","g"))||[]).length!==2)issues.push("dos ejercicios de Día "+day);
        for(const name of Object.values(DOMAIN_LABELS).filter(x=>x!=="Todas las funciones"))if(!instructions.toLowerCase().includes(name.toLowerCase()))issues.push("cobertura de "+name);
      }else if(individual&&exercises.length!==1)issues.push("un ejercicio en el material individual");
      else if(!individual&&(exercises.length<3||exercises.length>4))issues.push("entre tres y cuatro ejercicios desarrollados en la ficha");
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
        mode:$("clinic-neuro-mode")?.value||"single",
        domain: $("clinic-neuro-mode")?.value === "weekly" ? "multidominio" : ($("clinic-neuro-domain")?.value || ""),
        covered_domains:[...coveredDomains],
        intervention: $("clinic-neuro-intervention")?.value || "",
        level: $("clinic-neuro-level")?.value || "",
        support: $("clinic-neuro-support")?.value || "moderado",
        format: $("clinic-neuro-format")?.value || "mixto",
        theme: $("clinic-neuro-theme")?.value?.trim() || "",
        functional_goal: $("clinic-neuro-functional-goal")?.value?.trim() || "",
        week_number: Math.max(1, Math.min(52, Number($("clinic-neuro-week-number")?.value) || 1)),
        response_mode: $("clinic-neuro-response-mode")?.value || "flexible",
        accessibility: $("clinic-neuro-accessibility")?.value?.trim() || ""
      } : null,
      visual_blocks: blocks.map(({prompt,...b}) => ({ ...b }))
    };
    return result;
  }
  function hydrate(doc) {
    const clinicalArea = doc?.clinical_area === "neuropsychology" ? "neuropsychology" : "psychology";
    if ($("clinic-neuro-reviewed")) $("clinic-neuro-reviewed").checked = false;
    if ($("clinic-clinical-area")) $("clinic-clinical-area").value = clinicalArea;
    const neuro = doc?.neuro_profile || {};
    coveredDomains=Array.isArray(neuro.covered_domains)?neuro.covered_domains.slice(0,15):[];
    if($("clinic-neuro-mode"))$("clinic-neuro-mode").value=neuro.mode==="weekly"||neuro.domain==="multidominio"?"weekly":neuro.mode==="individual"?"individual":"single";
    if ($("clinic-neuro-week-number")) $("clinic-neuro-week-number").value = String(Math.max(1,Math.min(52,Number(neuro.week_number)||1)));
    for (const [name, id] of Object.entries({
      domain: "clinic-neuro-domain", intervention: "clinic-neuro-intervention",
      level: "clinic-neuro-level", support: "clinic-neuro-support",
      format: "clinic-neuro-format", theme: "clinic-neuro-theme",
      functional_goal: "clinic-neuro-functional-goal", response_mode: "clinic-neuro-response-mode", accessibility: "clinic-neuro-accessibility"
    })) {
      if ($(id)) $(id).value = neuro[name] || "";
    }
    blocks = Array.isArray(doc?.visual_blocks) ? doc.visual_blocks.filter(b => types[b.type]).slice(0, LIMIT).map(b => ({ ...b })) : [];
    redraw();
    $("clinic-neuro-mode")?.dispatchEvent(new Event("change"));
    if(blocks.length&&$("clinic-visual-details"))$("clinic-visual-details").open=true;
  }

  const DOMAIN_LABELS = {
    orientacion_temporal: "Orientación temporal", orientacion_espacial: "Orientación espacial",
    orientacion_personal: "Orientación personal", atencion: "Atención", memoria: "Memoria",
    funciones_ejecutivas: "Funciones ejecutivas", lenguaje: "Lenguaje",
    visuoespacial: "Procesamiento visuoespacial", praxias_gnosias: "Praxias y gnosias",
    calculo:"Cálculo funcional",cognicion_social:"Cognición social",velocidad_procesamiento:"Velocidad de procesamiento",
    cognicion_funcional: "Cognición funcional",multidominio:"Todas las funciones"
  };
  let starterEntries = [];
  // Biblioteca de borradores originales: ejercicios distintos y parámetros de adaptación.
  // Los campos observacionales pertenecen al profesional; el documento al paciente no es una prueba.
  const DOMAIN_PRACTICE = {
    orientacion_temporal: {
      process:"orientación temporal con claves externas",
      simplify:"mantener el calendario visible y trabajar una sola referencia temporal",
      extend:"relacionar una segunda referencia verificada con una rutina real",
      access:"utilizar calendario grande y lectura asistida si es necesaria"
    },
    orientacion_espacial: {
      process:"referencias espaciales y orientación funcional",
      simplify:"mostrar dos referencias familiares y señalar una de ellas",
      extend:"añadir una referencia verificada sin exigir desplazamientos autónomos",
      access:"usar imágenes o planos ampliados y evitar recorridos no supervisados"
    },
    orientacion_personal: {
      process:"identidad, preferencias y reconocimiento personal no confrontativo",
      simplify:"ofrecer dos opciones de preferencias presentes sin forzar recuerdos",
      extend:"vincular la elección a una actividad agradable actual",
      access:"aceptar señalamiento, silencio o rechazo, sin imponer datos biográficos"
    },
    atencion: {
      process:"atención selectiva y mantenimiento de la consigna",
      simplify:"reducir estímulos y distractores y utilizar una sola consigna",
      extend:"añadir distractores en una matriz más amplia conservando la legibilidad",
      access:"controlar visión, audición, barrido espacial y fatiga"
    },
    memoria: {
      process:"aprendizaje funcional, codificación y recuperación apoyada",
      simplify:"reducir elementos y mantener claves externas disponibles",
      extend:"variar una sola condición de recuperación sin imponer velocidad",
      access:"priorizar reconocimiento o uso de ayudas si la evocación resulta inaccesible"
    },
    funciones_ejecutivas: {
      process:"planificación, secuenciación y flexibilidad funcional",
      simplify:"usar dos pasos visibles y una única regla",
      extend:"introducir una alternativa previsible o cambio explícito de criterio",
      access:"usar tarjetas grandes y evitar tareas que impliquen riesgos reales"
    },
    lenguaje: {
      process:"comprensión, acceso léxico y comunicación funcional",
      simplify:"ofrecer dos opciones y claves semánticas antes de fonológicas cuando proceda",
      extend:"ampliar vocabulario funcional o añadir un segundo componente de consigna",
      access:"aceptar habla, gesto, escritura o señalamiento según las capacidades"
    },
    visuoespacial: {
      process:"discriminación y organización visuoespacial",
      simplify:"reducir el tamaño de la matriz y aumentar el contraste",
      extend:"añadir una posición o relación espacial manteniendo el mismo soporte",
      access:"comprobar visión y demandas motoras; no interpretar errores como exclusivamente espaciales"
    },
    praxias_gnosias: {
      process:"reconocimiento funcional, secuenciación y gestos",
      simplify:"ofrecer el objeto real y modelar una acción conocida",
      extend:"añadir un paso de secuencia sin aumentar exigencia motora",
      access:"adaptar para limitaciones motoras y no inferir apraxia a partir de una sola tarea"
    },
    cognicion_funcional: {
      process:"uso de apoyos en una actividad cotidiana",
      simplify:"trabajar con dos elementos y lista visible",
      extend:"añadir un elemento pertinente y comprobar uso autónomo del apoyo",
      access:"trasladar a la vida real solo si la actividad es segura y acordada"
    }
  };
  function starterToDocument(item) {
    const tasks = Array.isArray(item.steps) ? item.steps.slice(0,4) : [];
    const week = Math.max(1,Math.min(52,Number($("clinic-neuro-week-number")?.value)||1));
    const domain = DOMAIN_LABELS[item.domain] || "funciones cognitivas";
    const profile = DOMAIN_PRACTICE[item.domain] || DOMAIN_PRACTICE.cognicion_funcional;
    // Orientación temporal: generar el calendario real del mes de la consulta, nunca reutilizar fechas fijas de la biblioteca.
    const todayParts = new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit"}).formatToParts(new Date());
    const currentMonth = todayParts.find(p=>p.type==="year")?.value+"-"+todayParts.find(p=>p.type==="month")?.value;
    const visuals = Array.isArray(item.visual_blocks) ? item.visual_blocks
      .filter(b => b && b.title && b.content)
      .map(b => b.type==="calendar" ? {...b,content:currentMonth} : {...b}) : [];
    const responseMode = $("clinic-neuro-response-mode")?.value || "flexible";
    const sensoryNotes = $("clinic-neuro-accessibility")?.value?.trim() || "";
    const responseText = ({
      verbal:"aceptar respuesta verbal sin exigir escritura",
      escrita:"permitir respuesta escrita siempre que sea accesible",
      senalamiento:"permitir señalar o elegir sin exigir denominación",
      flexible:"aceptar respuesta oral, escrita, mediante gesto o señalamiento"
    })[responseMode] || "aceptar respuestas accesibles";
    const support = item.level === "apoyo_alto"
      ? "Modelar primero, ofrecer como máximo dos alternativas, retirar ayudas solo si mejora la participación y no confrontar respuestas."
      : item.level === "apoyo_moderado"
      ? "Primero clave contextual o visual; después dividir la tarea; por último ofrecer dos alternativas, anotando la pista eficaz."
      : "Dar tiempo autónomo, ofrecer una pista de cada vez y utilizar autocorrección si es bien tolerada.";
    const formats = [
      {
        prefix:"Reconocer y comprender",
        cue:"Mostrar un ejemplo resuelto, explicar exactamente qué se hará y comprobar la consigna con una práctica.",
        change:"Trabajar con una cantidad pequeña de estímulos, manteniendo los apoyos a la vista.",
        observe:"Comprensión de la instrucción y respuesta con o sin modelado."
      },
      {
        prefix:"Practicar con material visual",
        cue:"Presentar el soporte principal; permitir señalar, nombrar, escribir o manipular según capacidad.",
        change:"Introducir solo los elementos necesarios para practicar la consigna; evitar presión por tiempo.",
        observe:"Precisión cualitativa, omisiones, perseveraciones y tipo de ayuda necesaria."
      },
      {
        prefix:"Variar una sola condición",
        cue:"Recordar el ejemplo y explicar qué único aspecto cambia antes del nuevo intento.",
        change:"Modificar un estímulo, una clave o una regla sin cambiar simultáneamente el resto.",
        observe:"Mantenimiento de la estrategia y respuesta al cambio con apoyos graduados."
      },
      {
        prefix:"Usarlo en la vida cotidiana (opcional)",
        cue:"Elegir una aplicación real segura, acordada y significativa, o simularla si no procede hacerla.",
        change:"Practicar el uso de una ayuda externa sin evaluar autonomía más allá de lo comprobado.",
        observe:"Aceptación, utilidad percibida, transferencia y seguridad de la tarea."
      }
    ];
    const materialName = visuals.map(v => "«"+v.title+"»").join(" y ") || "un soporte real seleccionado y revisado";
    const examples = visuals.map(v => {
      const text = String(v.content || "").split(/\r?\n/).slice(0,3).map(row => row.split("|").map(cell=>cell.trim()).join(" / ")).join("; ");
      return v.title + ": " + text;
    }).join(". ");
    const exercises = tasks.map((task,i) => {
      const variation = formats[i];
      const title = task.replace(/[.\s]+$/,"");
      const supportName = visuals.length ? "«"+visuals[i % visuals.length].title+"»" : materialName;
      const option = i===0 ? profile.simplify : i===2 ? profile.extend : i===3 ? "mantener el apoyo que haya resultado útil" : profile.simplify;
      const specificExample = Array.isArray(item.examples) && item.examples[i] ? item.examples[i] :
        "Usa " + supportName + " con un ejemplo de la propia ficha previamente comprobado; no completes con nombres, fechas o respuestas ficticias que puedan confundirse con hechos personales.";
      return [
        "Ejercicio "+(i+1)+": "+variation.prefix+" — "+title,
        "Objetivo: "+item.objective+". Tarea concreta: "+task+". Proceso principal: "+profile.process+".",
        "Materiales: "+supportName+". Preparar material impreso legible o el equivalente en pantalla, comprobando contraste, exactitud, contenido y pertinencia cultural.",
        "Preparación: Disponer de una superficie despejada, luz adecuada y una única consigna. Preguntar si desea participar; permitir pausas. "+profile.access+".",
        "Pasos: 1) "+variation.cue+" 2) "+task+". 3) "+variation.change+" 4) Revisar con la persona qué apoyo facilitó la actividad y cerrar sin convertirla en un examen.",
        "Ejemplo: "+specificExample+" Estímulos disponibles: "+examples.slice(0,250)+".",
        "Ayudas: "+support+" Para responder, "+responseText+".",
        "Adaptación: Si aumenta la dificultad, "+profile.simplify+". Si la tarea resulta cómoda, "+option+". No incrementar velocidad por defecto.",
        "Duración y frecuencia: 8–15 minutos ajustables, una práctica esta semana, con pausa antes si hay fatiga o frustración. La cuarta práctica es opcional; ajustar la pauta al caso.",
        "Qué observar: ¿Necesitaste alguna pista?, ¿qué parte resultó más cómoda?, ¿cuándo preferiste descansar? Puedes comentarlo sin contar aciertos."
      ].join("\n");
    });
    return {
      version:3,clinical_area:"neuropsychology",material_type:"exercise",duration_minutes:12,
      frequency:"Semana "+week+": tres actividades breves y una cuarta opcional. Repartir según tolerancia; revisar la siguiente semana tras la sesión.",
      introduction:"Cuaderno de la semana "+week+" sobre "+domain.toLowerCase()+". Trabaja con calma, utiliza los apoyos acordados y no necesitas completar todas las actividades.",
      why:"Estas propuestas practican "+profile.process+" a través de tareas concretas. Lo importante es la participación, la estrategia y su posible utilidad cotidiana; no obtener una puntuación diagnóstica.",
      objective:item.objective,
      instructions:["Semana "+week,...exercises].join("\n\n"),
      example:"Esquema: Comprender la consigna → Probar con apoyo → Ajustar dificultad → Aplicar cuando sea seguro\nLa profesional revisará los estímulos y las posibles respuestas antes de entregar el material.",
      record_prompt:tasks.map((task,i) =>
        "Ejercicio "+(i+1)+": "+task+"\n¿Pudiste hacerlo o participar? ____________________\n¿Qué ayuda te sirvió? ____________________________\n¿Te cansaste o quisiste parar? _____________________"
      ).join("\n\n")+
        "\n\nDudas para comentar en consulta: qué no entendí, qué me ayudó y qué me gustaría cambiar.",
      safety_note:"Las actividades se pueden adaptar o detener. Evita forzar recuerdos, corregir de manera confrontativa o realizar prácticas funcionales de riesgo sin acompañamiento adecuado.",
      remember:"Al terminar esta semana revisaremos contigo las ayudas, la participación y su utilidad. Solo después ajustaremos la siguiente semana.",
      session_questions:["¿Qué recurso ayudó más?","¿Qué actividad preferiste y por qué?","¿Hubo fatiga o alguna dificultad sensorial?","¿Qué podría ser útil en el día a día?"],
      neuro_profile:{domain:item.domain,intervention:item.intervention,level:item.level,theme:item.theme||"",functional_goal:item.objective,week_number:week,response_mode:responseMode,accessibility:sensoryNotes},
      visual_blocks:visuals.map(block => ({...block}))
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
    $("clinic-neuro-mode")?.addEventListener("change",panelVisible);
    $("clinic-exercise-form")?.addEventListener("input",event=>{
      if(area()!=="neuropsychology"||event.target?.id==="clinic-neuro-reviewed")return;
      const check=$("clinic-neuro-reviewed");if(check)check.checked=false;
    });
    $("clinic-visual-add")?.addEventListener("click", () => {
      const type = $("clinic-visual-type")?.value;
      if (!types[type] || blocks.length >= LIMIT) return;
      blocks.push({ type, title: type==="chart" ? "Gráfico de ejemplo (datos ficticios)" : "", content: type === "calendar" ? new Date().toISOString().slice(0, 7) : type==="chart" ? "Actividad A (ficticia)|3\nActividad B (ficticia)|6\nActividad C (ficticia)|4" : "", alt: "", data: "" });
      if($("clinic-visual-details"))$("clinic-visual-details").open=true;
      redraw();
    });
    redraw();
    initializeStarterLibrary();
  }
  window.ClinicNeuroMaterials = { read, hydrate, validate: validDocument };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
