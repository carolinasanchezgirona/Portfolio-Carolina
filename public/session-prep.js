/* Entre Sesiones · preparación de la siguiente sesión.
   El texto se mantiene solo en los campos de la página hasta que la persona
   decide incorporarlo a un ejercicio ya asignado. Ninguna acción de este
   módulo envía ni almacena información clínica automáticamente. */
(() => {
  "use strict";

  const root = document.getElementById("space-session-prep");
  const form = document.getElementById("space-session-prep-form");
  const shell = document.getElementById("space-shell");
  if (!root || !form || !shell) return;

  const prompts = Object.freeze([
    ["¿Qué me ha costado?", "space-prep-difficult"],
    ["¿Qué me ha ayudado?", "space-prep-helped"],
    ["¿De qué me gustaría hablar?", "space-prep-talk"]
  ]);
  const fields = prompts.map(([, id]) => document.getElementById(id));
  const preview = document.getElementById("space-session-prep-preview");
  const summary = document.getElementById("space-session-prep-summary");
  const previewButton = document.getElementById("space-prep-preview-button");
  const clearButton = document.getElementById("space-prep-clear");
  const select = document.getElementById("space-session-prep-target");
  const insertButton = document.getElementById("space-session-prep-insert");
  const copyButton = document.getElementById("space-session-prep-copy");
  const message = document.getElementById("space-session-prep-message");
  if (fields.some(field => !field) || !preview || !summary || !select || !message) return;

  const limit = 12000;
  let exportedSummary = "";

  function portalAvailable() {
    return !shell.hidden && !document.getElementById("space-access")?.hidden;
  }

  // Authentication is not inferred from a URL or the existence of DOM nodes.
  // The portal only exposes the shell after authenticating its server session.
  function patientIsInPortal() {
    return !shell.hidden && Boolean(document.getElementById("space-access")?.hidden);
  }

  function line(title, content) {
    const row = document.createElement("article");
    row.className = "space-session-prep-summary-row";
    const label = document.createElement("strong");
    label.textContent = title;
    const text = document.createElement("p");
    text.textContent = content;
    row.append(label, text);
    return row;
  }

  function composeSummary() {
    const entered = prompts
      .map(([prompt, id]) => [prompt, String(document.getElementById(id)?.value || "").trim()])
      .filter(([, text]) => text);
    if (!entered.length) return "";
    return ["PREPARACIÓN DE MI PRÓXIMA SESIÓN", ...entered.map(([heading, text]) => heading + "\n" + text)].join("\n\n");
  }

  function refreshTargets() {
    select.replaceChildren();
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Selecciona un ejercicio disponible";
    select.append(empty);
    if (!patientIsInPortal()) {
      select.disabled = true;
      if (insertButton) insertButton.disabled = true;
      return;
    }
    document.querySelectorAll("#space-patient-materials details[data-patient-material-id]").forEach((details) => {
      if (!details.querySelector("textarea[data-response-record]")) return;
      const title = details.querySelector(".space-patient-material-title strong")?.textContent || "Ejercicio";
      const option = document.createElement("option");
      option.value = details.dataset.patientMaterialId || "";
      option.textContent = title;
      select.append(option);
    });
    select.disabled = select.options.length <= 1;
    if (insertButton) insertButton.disabled = select.disabled;
  }

  function setMessage(text, isError = false) {
    message.textContent = text || "";
    message.classList.toggle("is-error", Boolean(isError));
  }

  function forgetPreview() {
    preview.hidden = true;
    summary.replaceChildren();
    exportedSummary = "";
    setMessage("");
  }

  function clearPrivateNotes() {
    form.reset();
    forgetPreview();
    select.value = "";
  }

  fields.forEach(field => field.addEventListener("input", forgetPreview));

  previewButton?.addEventListener("click", () => {
    if (!patientIsInPortal()) return;
    const entered = prompts
      .map(([heading, id]) => [heading, String(document.getElementById(id).value || "").trim()])
      .filter(([, value]) => value);
    if (!entered.length) {
      setMessage("Escribe algo en al menos una de las tres preguntas.", true);
      fields[0].focus();
      return;
    }
    exportedSummary = composeSummary();
    summary.replaceChildren(...entered.map(([heading, text]) => line(heading, text)));
    refreshTargets();
    preview.hidden = false;
    setMessage("Este resumen es privado. Puedes revisarlo, copiarlo o incorporarlo a un ejercicio.");
    preview.scrollIntoView({ block: "nearest", behavior: "auto" });
  });

  clearButton?.addEventListener("click", () => {
    if (fields.some(field => field.value.trim())) {
      if (!window.confirm("¿Descartar las notas de preparación? No se podrán recuperar.")) return;
    }
    clearPrivateNotes();
    setMessage("Notas descartadas. No se ha enviado ni guardado nada.");
  });

  insertButton?.addEventListener("click", () => {
    if (!patientIsInPortal() || !exportedSummary) {
      setMessage("Primero prepara el resumen para poder incorporarlo.", true);
      return;
    }
    const id = select.value;
    const candidates = [...document.querySelectorAll("#space-patient-materials details[data-patient-material-id]")];
    const target = candidates.find(item => item.dataset.patientMaterialId === id);
    const record = target?.querySelector("textarea[data-response-record]");
    if (!record || !id) {
      setMessage("Elige un ejercicio que permita escribir respuestas.", true);
      return;
    }
    if (record.value.includes(exportedSummary)) {
      setMessage("El resumen ya está en ese ejercicio. Puedes guardarlo o compartirlo desde Mi terapia.");
      return;
    }
    const newValue = record.value.trim() ? record.value.trimEnd() + "\n\n" + exportedSummary : exportedSummary;
    if (newValue.length > Math.min(limit, Number(record.maxLength) || limit)) {
      setMessage("El ejercicio no tiene espacio suficiente. Puedes elegir otro o copiar el resumen.", true);
      return;
    }
    // Only a voluntary action updates the unsaved response form.
    // The existing portal's two separate buttons perform save/share on the server.
    record.value = newValue;
    record.dispatchEvent(new Event("input", { bubbles: true }));
    target.open = true;
    const status = target.querySelector(".space-patient-response-status");
    if (status) {
      status.classList.remove("shared");
      status.textContent = "Resumen incorporado, con cambios SIN guardar. Elige «Guardar borrador» o «Compartir respuestas» si quieres conservarlo.";
    }
    setMessage("Resumen incorporado al ejercicio, todavía sin guardar ni compartir.");
    const therapyButton = document.querySelector('[data-space-view="therapy"]');
    therapyButton?.click();
    record.focus({ preventScroll: true });
    record.scrollIntoView({ block: "center", behavior: "auto" });
  });

  copyButton?.addEventListener("click", async () => {
    if (!patientIsInPortal() || !exportedSummary) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard_unavailable");
      await navigator.clipboard.writeText(exportedSummary);
      setMessage("Resumen copiado al portapapeles del dispositivo. No se ha compartido con Carolina; borra el portapapeles si compartes este móvil.");
    } catch {
      setMessage("El navegador no permite copiarlo. Puedes incorporarlo a un ejercicio o seleccionar el texto del resumen.", true);
    }
  });

  // The source portal only dispatches these events after verifying a session.
  window.addEventListener("patient-portal-view-ready", () => {
    refreshTargets();
    if (window.location.hash === "#space-session-prep") {
      root.scrollIntoView({ block: "start", behavior: "auto" });
      root.focus({ preventScroll: true });
    }
  });
  document.addEventListener("patient-portal-locked", () => {
    clearPrivateNotes();
    refreshTargets();
  });

  if (patientIsInPortal()) refreshTargets();
})();
