(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const ZONE = "Europe/Madrid";

  const printButton = document.querySelector("#clinic-print-history");
  const patientIdField = document.querySelector("#clinic-patient-id");
  const patientName = document.querySelector("#clinic-patient-name");
  const patientMessage = document.querySelector("#clinic-patient-message");
  if (!printButton || !patientIdField) return;

  const dateShort = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric", timeZone: ZONE });

  function session() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }

  function headers() {
    const current = session();
    return { apikey: KEY, Authorization: `Bearer ${current?.access_token || ""}` };
  }

  async function rest(path) {
    const response = await fetch(`${REST_URL}/${path}`, { headers: headers(), cache: "no-store" });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || "No se ha podido preparar el historial.");
    return body || [];
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function textSection(title, value) {
    return value ? `<section><h2>${escapeHtml(title)}</h2><div class="text">${escapeHtml(value)}</div></section>` : "";
  }

  function openPrintWindow(body) {
    const popup = window.open("", "_blank");
    if (!popup) throw new Error("El navegador ha bloqueado la ventana de impresión.");
    popup.opener = null;
    popup.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Historial clínico</title><style>
      @page{size:A4;margin:16mm}
      body{font-family:Arial,sans-serif;color:#1f2933;font-size:10.5pt;line-height:1.48}
      header{border-bottom:2px solid #1f5f99;margin-bottom:22px;padding-bottom:14px}
      h1{font-size:20pt;color:#1f5f99;margin:4px 0}h2{font-size:12.5pt;margin:22px 0 8px;color:#233746}h3{font-size:10.5pt;margin:14px 0 5px}
      .meta{color:#526b7a;font-size:9.3pt}.text{white-space:pre-wrap}.entry{break-inside:avoid;border-bottom:1px solid #d5e3ee;padding-bottom:12px;margin-bottom:14px}
      table{width:100%;border-collapse:collapse;margin-top:8px}th,td{text-align:left;vertical-align:top;padding:7px 8px;border-bottom:1px solid #dbe5eb}th{font-size:9pt;color:#526b7a}
      .privacy{margin-top:28px;color:#607786;font-size:8.3pt}
    </style></head><body>${body}<script>window.onload=()=>window.print()<\/script></body></html>`);
    popup.document.close();
  }

  printButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const patientId = patientIdField.value;
    if (!patientId) return;
    patientMessage.textContent = "Preparando historial clínico…";
    try {
      const [patients, sessions, scales, documents, reports] = await Promise.all([
        rest(`clinical_patients?id=eq.${encodeURIComponent(patientId)}&select=id,public_code,full_name,email,phone,clinical_summary,next_session_focus,medication_notes&limit=1`),
        rest(`clinical_sessions?patient_id=eq.${encodeURIComponent(patientId)}&status=eq.approved&select=session_date,session_number,evolution_note,intervention_note,response_note,agreements_note,homework_note,next_session_note&order=session_date.asc`),
        rest(`clinical_scale_measurements?patient_id=eq.${encodeURIComponent(patientId)}&select=instrument,measured_at,total_score,interpretation,notes&order=measured_at.asc`),
        rest(`clinical_documents?patient_id=eq.${encodeURIComponent(patientId)}&select=title,category,file_name,document_date,created_at&order=created_at.asc`),
        rest(`clinical_reports?patient_id=eq.${encodeURIComponent(patientId)}&select=title,status,created_at,approved_at&order=created_at.asc`),
      ]);
      const patient = patients[0];
      if (!patient) throw new Error("No se ha encontrado la ficha del paciente.");

      const sessionHtml = sessions.length ? sessions.map((item) => `<article class="entry"><h3>Sesión ${escapeHtml(item.session_number || "")} · ${escapeHtml(dateShort.format(new Date(item.session_date)))}</h3>${item.evolution_note ? `<b>Evolución</b><div class="text">${escapeHtml(item.evolution_note)}</div>` : ""}${item.intervention_note ? `<h3>Intervención</h3><div class="text">${escapeHtml(item.intervention_note)}</div>` : ""}${item.response_note ? `<h3>Respuesta</h3><div class="text">${escapeHtml(item.response_note)}</div>` : ""}${item.agreements_note ? `<h3>Acuerdos</h3><div class="text">${escapeHtml(item.agreements_note)}</div>` : ""}${item.homework_note ? `<h3>Tarea</h3><div class="text">${escapeHtml(item.homework_note)}</div>` : ""}${item.next_session_note ? `<h3>Próxima sesión</h3><div class="text">${escapeHtml(item.next_session_note)}</div>` : ""}</article>`).join("") : "<p>No constan sesiones clínicas aprobadas.</p>";

      const scalesHtml = scales.length ? `<table><thead><tr><th>Fecha</th><th>Instrumento</th><th>Puntuación</th><th>Interpretación</th></tr></thead><tbody>${scales.map((item) => `<tr><td>${escapeHtml(dateShort.format(new Date(`${item.measured_at}T12:00:00`)))}</td><td>${escapeHtml(item.instrument)}</td><td>${item.total_score ?? "—"}</td><td>${escapeHtml(item.interpretation || item.notes || "")}</td></tr>`).join("")}</tbody></table>` : "<p>No constan escalas registradas.</p>";

      const documentsHtml = documents.length ? `<table><thead><tr><th>Fecha</th><th>Documento</th><th>Archivo</th></tr></thead><tbody>${documents.map((item) => `<tr><td>${escapeHtml(dateShort.format(new Date((item.document_date || item.created_at))))}</td><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.file_name)}</td></tr>`).join("")}</tbody></table>` : "<p>No constan documentos adjuntos.</p>";

      const reportsHtml = reports.length ? `<table><thead><tr><th>Fecha</th><th>Informe</th><th>Estado</th></tr></thead><tbody>${reports.map((item) => `<tr><td>${escapeHtml(dateShort.format(new Date(item.approved_at || item.created_at)))}</td><td>${escapeHtml(item.title)}</td><td>${item.status === "approved" ? "Aprobado" : "Borrador"}</td></tr>`).join("")}</tbody></table>` : "<p>No constan informes guardados.</p>";

      openPrintWindow(`<header><p>Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga</p><h1>Historial clínico</h1><p class="meta">Paciente: ${escapeHtml(patient.full_name)} · Código: ${escapeHtml(patient.public_code)}<br>Emitido: ${escapeHtml(dateShort.format(new Date()))}</p></header>${textSection("Síntesis clínica", patient.clinical_summary)}${textSection("Medicación registrada", patient.medication_notes)}${textSection("Foco actual / próxima sesión", patient.next_session_focus)}<section><h2>Sesiones aprobadas</h2>${sessionHtml}</section><section><h2>Escalas y puntuaciones</h2>${scalesHtml}</section><section><h2>Documentos registrados</h2>${documentsHtml}</section><section><h2>Informes</h2>${reportsHtml}</section><p class="privacy">Documento confidencial que contiene datos de salud. Los archivos adjuntos se relacionan por nombre, pero no se incorporan al documento impreso.</p>`);
      patientMessage.textContent = "";
    } catch (error) {
      patientMessage.textContent = error instanceof Error ? error.message : "No se ha podido preparar el historial.";
    }
  }, true);
})();
