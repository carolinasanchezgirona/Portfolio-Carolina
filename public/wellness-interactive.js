/* Entre Sesiones · prácticas interactivas de Wellness.
   Los textos libres permanecen exclusivamente en memoria hasta cerrar la práctica.
   No se envían ni guardan respuestas, elecciones, puntuaciones ni notas. */
(() => {
  "use strict";

  const host = document.getElementById("wellness-interactive");
  if (!host) return;

  const tools = [
    { id: "wi-decision", number: "01", label: "Decisión guiada", title: "¿Problema o posibilidad?", duration: "4 min", info: "Distingue una acción posible de algo que estás anticipando." },
    { id: "wi-energy", number: "02", label: "Autocuidado", title: "Mi energía, mi margen", duration: "3 min", info: "Ajusta una propuesta cotidiana al nivel que tú elijas." },
    { id: "wi-priorities", number: "03", label: "Funciones ejecutivas", title: "Ordenar la cabeza", duration: "5 min", info: "Agrupa pendientes sin convertirlos en otra lista de exigencias." },
    { id: "wi-focus", number: "04", label: "Atención flexible", title: "Cambiar de criterio", duration: "3 min", info: "Practica alternar consignas, sin puntuaciones ni cronómetro." }
  ];

  function node(tag, cls, value, parent) {
    const x = document.createElement(tag);
    if (cls) x.className = cls;
    if (value !== undefined && value !== null) x.textContent = value;
    if (parent) parent.append(x);
    return x;
  }
  function button(text, parent, handler, cls) {
    const x = node("button", cls || "wi-button", text, parent);
    x.type = "button";
    x.addEventListener("click", handler);
    return x;
  }
  function textField(parent, label, placeholder, maxLength = 180) {
    const wrapper = node("label", "wi-field", null, parent);
    node("span", "", label, wrapper);
    const input = node("textarea", "", null, wrapper);
    input.rows = 2;
    input.maxLength = maxLength;
    input.placeholder = placeholder;
    return input;
  }
  const cards = node("div", "wi-cards", null, host);
  const workspace = node("section", "wi-workspace", null, host);
  workspace.setAttribute("aria-label", "Práctica de bienestar interactiva");
  workspace.hidden = true;
  let selected = null;
  let toolButtons = [];

  function feedback(parent, message) {
    const line = node("p", "wi-feedback", message, parent);
    line.setAttribute("role", "status");
    return line;
  }
  function finish(parent, id) {
    const controls = node("div", "wi-actions", null, parent);
    const status = node("p", "wi-finish-state", "", parent);
    status.setAttribute("role", "status");
    const done = button("Terminar y registrar esta práctica", controls, () => {
      const detail = { id, saved: false };
      document.dispatchEvent(new CustomEvent("wellness:interactive-completed", { detail }));
      status.textContent = detail.saved
        ? "Práctica registrada en Mi progreso, únicamente en este dispositivo. No se han guardado tus respuestas."
        : "Práctica terminada. El registro no está disponible en este momento; tus respuestas no se han guardado.";
      done.disabled = true;
    }, "wi-button wi-button-primary");
  }

  function decision(root) {
    node("p", "wi-prompt", "Piensa en una preocupación cotidiana. No hace falta escribirla.", root);
    node("h5", "wi-question", "¿Hay alguna acción concreta que dependa de ti y puedas hacer hoy?", root);
    const choices = node("div", "wi-choice-grid", null, root);
    const result = node("div", "wi-result", null, root);
    result.hidden = true;
    [
      ["Sí, hay algo que puedo hacer", "action"],
      ["No, ahora no depende de mí", "wait"],
      ["Todavía no lo sé", "uncertain"]
    ].forEach(([label, value]) => {
      button(label, choices, () => {
        result.replaceChildren();
        result.hidden = false;
        if (value === "action") {
          node("h5", "", "Una sola acción observable", result);
          node("p", "", "Elige un paso pequeño y concreto. No hace falta que resuelvas todo hoy.", result);
          textField(result, "Mi siguiente paso (opcional, no se guarda)", "Por ejemplo: dedicar cinco minutos a consultar mi agenda");
        } else {
          node("h5", "", value === "wait" ? "Puede quedar pendiente" : "Puedes dejarlo abierto por ahora", result);
          node("p", "", value === "wait"
            ? "No tienes que resolver ahora lo que no depende de ti. Puedes volver a una tarea que sí esté a tu alcance."
            : "No saber aún qué hacer no te obliga a seguir pensando sin descanso. Quizá convenga esperar a tener más información.", result);
          node("p", "wi-secondary", "Si te resulta útil, mira alrededor, nombra tres objetos y vuelve a la actividad que tenías delante.", result);
        }
        finish(result, "wi-decision");
      }, "wi-button wi-choice");
    });
  }

  const guidance = [
    "Puedes reducir el día a lo imprescindible y permitirte descansar cuando sea posible.",
    "Quizá te sirva alternar una tarea breve con pausas reales, sin intentar recuperar todo el ritmo de golpe.",
    "Prueba elegir una prioridad manejable y deja otra cosa para más adelante.",
    "Elige en qué merece la pena invertir tu energía y reserva un margen para descansar.",
    "Puedes aprovechar la disponibilidad que percibes sin sentirte obligada a llenar el día."
  ];
  function energy(root) {
    node("p", "wi-prompt", "Elige cómo percibes tu energía en este momento. No es una medida clínica.", root);
    const row = node("div", "wi-energy-options", null, root);
    const output = node("div", "wi-result", null, root);
    output.hidden = true;
    for (let value = 1; value <= 5; value++) {
      const choice = button(String(value), row, () => {
        row.querySelectorAll("button").forEach(b => {
          b.setAttribute("aria-pressed", String(b === choice));
        });
        output.hidden = false;
        output.replaceChildren();
        node("h5", "", "Has elegido " + value + " de 5", output);
        const batteries = node("div", "wi-energy-display", null, output);
        batteries.setAttribute("aria-label", value + " de 5 niveles seleccionados");
        for (let k = 1; k <= 5; k++) node("span", k <= value ? "filled" : "", "", batteries);
        node("p", "", guidance[value - 1], output);
        node("p", "wi-secondary", "Puedes cambiar tu elección cuando quieras. Este nivel no se interpreta como un síntoma ni se almacena.", output);
        finish(output, "wi-energy");
      }, "wi-energy-choice");
      choice.setAttribute("aria-pressed", "false");
      choice.setAttribute("aria-label", value + " de 5");
    }
  }

  function priorities(root) {
    node("p", "wi-prompt", "Anota hasta ocho asuntos cotidianos y decide dónde colocarlos. Evita nombres y datos identificativos: el texto no se guarda.", root);
    const field = textField(root, "Algo que tengo en la cabeza", "Por ejemplo: organizar las tareas de mañana", 160);
    const add = node("div", "wi-actions", null, root);
    const notice = feedback(root, "");
    const list = node("div", "wi-priority-list", null, root);
    const buckets = [
      ["now", "Puedo ocuparme de ello", "wi-now"],
      ["later", "Puede esperar", "wi-later"],
      ["outside", "Ahora no depende de mí", "wi-outside"]
    ];
    const entries = [];
    const addButton = button("Añadir asunto", add, () => {
      const value = field.value.trim();
      if (!value) { notice.textContent = "Escribe primero un asunto breve."; return; }
      if (entries.length >= 8) { notice.textContent = "Has llegado al máximo de ocho. Puedes vaciar y empezar de nuevo."; return; }
      entries.push({ text: value, kind: "" });
      field.value = "";
      notice.textContent = "";
      update();
      field.focus();
    }, "wi-button");
    field.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        addButton.click();
      }
    });
    button("Vaciar", add, () => {
      entries.length = 0;
      field.value = "";
      notice.textContent = "Contenido descartado de esta práctica.";
      update();
    }, "wi-button wi-button-secondary");
    function update() {
      list.replaceChildren();
      entries.forEach((entry, index) => {
        const row = node("article", "wi-entry " + (entry.kind || ""), null, list);
        node("p", "wi-entry-text", entry.text, row);
        const options = node("div", "wi-entry-actions", null, row);
        for (const [key, label] of buckets) {
          const pick = button(label, options, () => {
            entry.kind = key;
            update();
          }, "wi-mini-choice");
          pick.setAttribute("aria-pressed", String(entry.kind === key));
        }
        button("Eliminar", options, () => { entries.splice(index, 1); update(); }, "wi-mini-choice wi-remove");
      });
      const old = root.querySelector(".wi-finish-area");
      if (old) old.remove();
      if (entries.length) {
        const finishArea = node("div", "wi-finish-area", null, root);
        const grouped = entries.filter(e => e.kind).length;
        node("p", "wi-secondary", grouped + " de " + entries.length + " asuntos clasificados. Puedes terminar sin clasificar todos.", finishArea);
        finish(finishArea, "wi-priorities");
      }
    }
  }

  const rounds = [
    { prompt: "Busca un alimento", choices: ["Ventana", "Pera", "Tranquilo"], correct: 1 },
    { prompt: "Busca una palabra que comience por M", choices: ["Nube", "Lago", "Música"], correct: 2 },
    { prompt: "Busca una emoción", choices: ["Silla", "Sorpresa", "Puerta"], correct: 1 },
    { prompt: "Busca una palabra con cinco letras", choices: ["Casa", "Nubes", "Ventana"], correct: 1 },
    { prompt: "Busca un objeto que sirva para escribir", choices: ["Lápiz", "Triste", "Lejos"], correct: 0 },
    { prompt: "Busca una palabra que termine en A", choices: ["Jardín", "Sonido", "Calma"], correct: 2 }
  ];
  function focus(root) {
    node("p", "wi-prompt", "Cada ronda cambia la consigna. Puedes ir a tu ritmo, sin límite de tiempo. No se calcula ningún resultado clínico.", root);
    const task = node("div", "wi-focus-task", null, root);
    let round = 0;
    function draw() {
      task.replaceChildren();
      if (round >= rounds.length) {
        node("h5", "", "Has llegado al final", task);
        node("p", "", "Has practicado cambiar de consigna. No hay nota, puntuación ni comparación con otras personas.", task);
        finish(task, "wi-focus");
        return;
      }
      const item = rounds[round];
      node("p", "wi-secondary", "Consigna " + (round + 1) + " de " + rounds.length, task);
      node("h5", "wi-question", item.prompt, task);
      const choices = node("div", "wi-focus-choices", null, task);
      const status = feedback(task, "");
      item.choices.forEach((label, index) => {
        button(label, choices, () => {
          if (index !== item.correct) {
            status.textContent = "Esa opción no cumple la consigna. Puedes volver a leerla e intentarlo de nuevo.";
            return;
          }
          status.textContent = "Consigna localizada. Cuando quieras, cambia a la siguiente.";
          choices.querySelectorAll("button").forEach(b => { b.disabled = true; });
          button(round === rounds.length - 1 ? "Finalizar práctica" : "Siguiente consigna", task, () => {
            round++;
            draw();
          }, "wi-button wi-button-primary");
        }, "wi-button wi-choice");
      });
    }
    draw();
  }

  const renderers = { "wi-decision": decision, "wi-energy": energy, "wi-priorities": priorities, "wi-focus": focus };
  function openPractice(tool) {
    selected = tool.id;
    toolButtons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.interactiveId === selected)));
    workspace.replaceChildren();
    workspace.hidden = false;
    const heading = node("div", "wi-workspace-heading", null, workspace);
    const title = node("div", "", null, heading);
    node("span", "wi-label", tool.label + " · " + tool.duration, title);
    node("h4", "wi-workspace-title", tool.title, title);
    button("Cerrar", heading, () => {
      selected = null;
      workspace.replaceChildren();
      workspace.hidden = true;
      toolButtons.forEach(b => b.setAttribute("aria-pressed", "false"));
    }, "wi-button wi-button-secondary");
    const stage = node("div", "wi-stage", null, workspace);
    renderers[tool.id](stage);
    node("p", "wi-data-note", "Las anotaciones y elecciones se descartan al cerrar esta práctica. Solo se registra su nombre y fecha si pulsas «Terminar y registrar».", workspace);
    workspace.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  }
  tools.forEach(tool => {
    const card = node("article", "wi-card", null, cards);
    node("span", "wi-index", tool.number, card);
    node("span", "wi-label", tool.label + " · " + tool.duration, card);
    node("h4", "", tool.title, card);
    node("p", "", tool.info, card);
    const start = button("Practicar ↗", card, () => openPractice(tool), "wi-open");
    start.dataset.interactiveId = tool.id;
    start.setAttribute("aria-pressed", "false");
    toolButtons.push(start);
  });
})();
