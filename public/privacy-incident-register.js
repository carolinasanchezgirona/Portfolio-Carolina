(() => {
  "use strict";
  const BASE = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const OWNER = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
  const $ = id => document.getElementById(id);
  const gate = $("privacy-gate");
  const content = $("privacy-private");
  const records = $("privacy-records");
  const detailPanel = $("privacy-details");
  let session = null;
  let selected = null;
  let currentRecords = [];

  function message(element, text, error = false) {
    if (!element) return;
    element.textContent = text;
    element.dataset.error = error ? "true" : "false";
  }
  function headers(extra = {}) {
    return { apikey: KEY, Authorization: "Bearer " + session.access_token, ...extra };
  }
  async function api(path, options = {}) {
    const response = await fetch(BASE + path, { ...options, cache: "no-store",
      headers: headers({ ...(options.body && !(options.body instanceof Blob) ? { "Content-Type": "application/json" } : {}), ...options.headers }) });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error("Acceso no autorizado o servicio no disponible (" + response.status + ").");
    return data;
  }
  function labelDate(value) {
    if (!value) return "Sin fecha";
    try { return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Madrid" }).format(new Date(value)); }
    catch { return "Fecha no válida"; }
  }
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = String(text);
    if (className) node.className = className;
    return node;
  }
  async function verify() {
    try {
      const raw = sessionStorage.getItem("dememoria_admin_session");
      session = raw ? JSON.parse(raw) : null;
      if (!session?.access_token) throw new Error("Accede primero a Gestión clínica con tu cuenta administrativa.");
      const user = await api("/auth/v1/user");
      if (user?.id !== OWNER) throw new Error("Esta cuenta no tiene permisos para el registro RGPD.");
      // RLS separately enforces the administrative MFA gate on every table/object.
      await load();
      gate.hidden = true;
      content.hidden = false;
    } catch (error) {
      content.hidden = true;
      gate.hidden = false;
      message(gate, error.message || "No se ha podido comprobar el acceso.", true);
      const a = document.createElement("a");
      a.href = "/admin/clinica/?panel=1";
      a.textContent = "Volver al acceso clínico";
      gate.append(document.createTextNode(" "), a);
    }
  }
  async function load() {
    const data = await api("/rest/v1/privacy_incidents?select=id,reference,title,occurred_at,summary,external_reference,risk_assessment,status,attachment_path,attachment_mime,attachment_sha256&order=occurred_at.desc.nullslast");
    if (!Array.isArray(data)) throw new Error("Respuesta inesperada del archivo RGPD.");
    currentRecords = data;
    render();
    if (selected) {
      selected = currentRecords.find(row => row.id === selected.id) || null;
      await showSelected();
    }
  }
  function render() {
    records.replaceChildren();
    if (!currentRecords.length) {
      records.append(el("p", "Todavía no se han registrado incidencias en este archivo privado."));
      return;
    }
    for (const incident of currentRecords) {
      const card = el("article", null, "privacy-record");
      card.append(el("h3", incident.reference + " · " + incident.title));
      const tags = el("div", null, "privacy-tags");
      tags.append(el("span", "Estado: " + ({ investigating: "En evaluación", contained: "Contenida", closed: "Cerrada" }[incident.status] || "Sin determinar"), "privacy-tag"));
      tags.append(el("span", labelDate(incident.occurred_at), "privacy-tag"));
      tags.append(el("span", incident.attachment_path ? "Documento archivado" : "Documento pendiente de adjuntar", "privacy-tag"));
      card.append(tags, el("p", incident.summary));
      const button = el("button", "Abrir expediente");
      button.type = "button";
      button.addEventListener("click", async () => {
        selected = incident;
        try { await showSelected(); } catch { message($("privacy-event-status"), "No se ha podido abrir el expediente.", true); }
      });
      card.append(button);
      records.append(card);
    }
  }
  async function showSelected() {
    if (!selected) { detailPanel.hidden = true; return; }
    detailPanel.hidden = false;
    const evidence = $("privacy-evidence");
    evidence.replaceChildren();
    evidence.append(el("p", "Expediente " + selected.reference + ". Valoración inicial: " + selected.risk_assessment));
    if (selected.external_reference) {
      const a = el("a", "Referencia técnica del incidente");
      a.href = selected.external_reference;
      a.rel = "noopener noreferrer";
      a.target = "_blank";
      evidence.append(a);
    }
    if (selected.attachment_path) {
      const button = el("button", "Descargar documento original archivado");
      button.type = "button";
      button.addEventListener("click", () => { void download(); });
      evidence.append(button);
      if (selected.attachment_sha256) evidence.append(el("p", "SHA-256 del archivo: " + selected.attachment_sha256, "privacy-help"));
    }
    $("privacy-file").value = "";
    message($("privacy-upload-status"), selected.attachment_path
      ? "El archivo ya está guardado. Para preservar la trazabilidad, las nuevas versiones se archivan como documentos adicionales."
      : "El documento original todavía no se ha adjuntado. Selecciona el PDF del registro interno.");
    const events = await api("/rest/v1/privacy_incident_events?select=id,event_type,detail,recorded_at&incident_id=eq." + encodeURIComponent(selected.id) + "&order=recorded_at.desc&limit=100");
    const log = $("privacy-event-log");
    log.replaceChildren();
    for (const event of (Array.isArray(events) ? events : [])) {
      const node = el("article", null, "privacy-event");
      node.append(el("strong", labelDate(event.recorded_at) + " · " + event.event_type), el("p", event.detail));
      log.append(node);
    }
    if (!log.children.length) log.append(el("p", "Sin actuaciones adicionales registradas."));
  }
  async function sha256(file) {
    const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
    return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
  }
  async function upload() {
    if (!selected) return;
    const status = $("privacy-upload-status");
    const input = $("privacy-file");
    const file = input.files?.[0];
    if (!file) { message(status, "Selecciona primero el archivo original.", true); return; }
    const types = { "application/pdf": "pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx" };
    const ext = types[file.type];
    if (!ext || !new RegExp("\\." + ext + "$", "i").test(file.name) || file.size > 10485760 || file.size < 100) {
      message(status, "Solo se admiten PDF o DOCX de menos de 10 MB.", true);
      return;
    }
    const button = $("privacy-upload");
    button.disabled = true;
    message(status, "Verificando y almacenando el documento en el archivo privado…");
    try {
      const hash = await sha256(file);
      const objectPath = selected.id + "/registro-" + new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14) + "-" + crypto.randomUUID().slice(0, 8) + "." + ext;
      const uploadResponse = await fetch(BASE + "/storage/v1/object/privacy-incident-evidence/" + objectPath, {
        method: "POST",
        headers: headers({ "Content-Type": file.type, "Cache-Control": "no-store", "x-upsert": "false" }),
        body: file,
        cache: "no-store"
      });
      if (!uploadResponse.ok) throw new Error("El almacenamiento privado ha rechazado el archivo (" + uploadResponse.status + ").");
      const update = await api("/rest/v1/privacy_incidents?id=eq." + encodeURIComponent(selected.id), {
        method: "PATCH", headers: { Prefer: "return=representation" },
        body: JSON.stringify({ attachment_path: objectPath, attachment_mime: file.type, attachment_sha256: hash, updated_at: new Date().toISOString() })
      });
      if (!Array.isArray(update) || update.length !== 1) throw new Error("Archivo subido, pero no se pudo asociar al expediente. No lo vuelvas a subir hasta revisar el archivo.");
      await api("/rest/v1/privacy_incident_events", { method: "POST",
        body: JSON.stringify({ incident_id: selected.id, event_type: "document", detail: "Informe interno archivado en almacenamiento privado. Huella SHA-256: " + hash })
      });
      message(status, "Documento archivado. Descárgalo desde aquí para comprobar su integridad.");
      await load();
    } catch (error) {
      message(status, error.message || "No se ha podido guardar el documento.", true);
    } finally { button.disabled = false; }
  }
  async function download() {
    if (!selected?.attachment_path) return;
    const url = BASE + "/storage/v1/object/authenticated/privacy-incident-evidence/" +
      selected.attachment_path.split("/").map(encodeURIComponent).join("/");
    const res = await fetch(url, { headers: headers(), cache: "no-store" });
    if (!res.ok) { message($("privacy-upload-status"), "No se ha podido abrir el archivo protegido.", true); return; }
    const blob = await res.blob();
    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = selected.reference + (selected.attachment_mime === "application/pdf" ? ".pdf" : ".docx");
    link.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
  }
  $("privacy-upload")?.addEventListener("click", upload);
  $("privacy-refresh")?.addEventListener("click", () => { void verify(); });
  $("privacy-event-form")?.addEventListener("submit", async event => {
    event.preventDefault();
    if (!selected) return;
    const status = $("privacy-event-status");
    const detail = $("privacy-event-detail").value.trim();
    if (!detail) return;
    try {
      await api("/rest/v1/privacy_incident_events", { method: "POST",
        body: JSON.stringify({ incident_id: selected.id, event_type: $("privacy-event-type").value, detail })
      });
      $("privacy-event-detail").value = "";
      message(status, "Actuación registrada en el expediente privado.");
      await showSelected();
    } catch { message(status, "No se ha podido registrar la actuación.", true); }
  });
  void verify();
})();