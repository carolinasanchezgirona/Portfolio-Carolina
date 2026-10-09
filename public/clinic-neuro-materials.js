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
      ? "Rehabilitación, estimulación y compensación cognitiva. Adapta materiales y apoyos al perfil funcional."
      : "Se conserva íntegramente el generador de materiales psicológicos.";
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
          const reader = new FileReader();
          reader.onload = () => {
            block.data = String(reader.result || "");
            redraw();
            if (message) message.textContent = "Imagen incorporada a la actividad. Comprueba la vista previa antes de prescribir.";
          };
          reader.readAsDataURL(file);
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
        functional_goal: $("clinic-neuro-functional-goal")?.value?.trim() || ""
      } : null,
      visual_blocks: blocks.map(b => ({ ...b }))
    };
    return result;
  }
  function hydrate(doc) {
    const clinicalArea = doc?.clinical_area === "neuropsychology" ? "neuropsychology" : "psychology";
    if ($("clinic-clinical-area")) $("clinic-clinical-area").value = clinicalArea;
    const neuro = doc?.neuro_profile || {};
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
  }
  window.ClinicNeuroMaterials = { read, hydrate, validate: validDocument };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
