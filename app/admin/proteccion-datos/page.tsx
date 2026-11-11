"use client";

import { useCallback, useEffect, useState } from "react";
import AdminWorkspaceNav from "../workspace-nav";
import "./privacy-incidents.css";

type IncidentStatus = "investigating" | "contained" | "closed";
type Incident = {
  id: string; reference: string; title: string; occurred_at: string | null;
  summary: string; external_reference: string | null; risk_assessment: string;
  status: IncidentStatus; attachment_path: string | null;
  attachment_sha256: string | null; attachment_mime: string | null;
  created_at: string; updated_at: string;
};
type IncidentEvent = {
  id: string; incident_id: string; event_type: string;
  detail: string; recorded_at: string; recorded_by: string | null;
};

const API = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const ANON = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const OWNER = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const SESSION_KEY = "dememoria_admin_session";
const BUCKET = "privacy-incident-evidence";
const LOGIN = "/admin/clinica/acceso/?next=%2Fadmin%2Fproteccion-datos%2F";
const MAX_SIZE = 10 * 1024 * 1024;

const statusLabels: Record<IncidentStatus, string> = {
  investigating: "En investigación",
  contained: "Contenida",
  closed: "Cerrada",
};
const eventLabels: Record<string, string> = {
  created: "Registro creado",
  verification: "Verificación",
  evidence_attached: "Documento incorporado",
  evidence_access_requested: "Consulta del documento",
  evidence_access_verified: "Integridad verificada",
  integrity_warning: "Advertencia de integridad",
  risk_review: "Evaluación del riesgo revisada",
  status_change: "Cambio de estado",
  note: "Anotación profesional",
};

function dateLabel(date: string | null) {
  if (!date) return "Sin fecha documentada";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid", dateStyle: "medium", timeStyle: "short"
  }).format(parsed);
}

function getSessionHeaders() {
  let accessToken: string | undefined;
  try { accessToken = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null")?.access_token; }
  catch { /* The caller will be redirected. */ }
  if (!accessToken) throw new Error("La sesión profesional no está disponible.");
  return { apikey: ANON, Authorization: "Bearer " + accessToken };
}

async function api(path: string, init: RequestInit = {}) {
  const response = await fetch(API + path, {
    ...init, cache: "no-store",
    headers: { ...getSessionHeaders(), ...(init.headers || {}) }
  });
  if (response.status === 401 || response.status === 403) {
    throw new Error("Acceso denegado o sesión caducada. Vuelve a identificarte.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || body.error || "No se ha podido completar la operación.");
  }
  return response;
}

async function verifyAccess() {
  const userResponse = await api("/auth/v1/user");
  const user = await userResponse.json();
  if (user?.id !== OWNER) throw new Error("Esta cuenta no tiene acceso al registro privado.");
  const gateResponse = await api("/rest/v1/rpc/admin_mobile_gate", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{}"
  });
  if (await gateResponse.json() !== true) throw new Error("Completa la verificación de acceso profesional.");
}

async function getIncidents(): Promise<Incident[]> {
  const response = await api("/rest/v1/privacy_incidents?select=*&order=created_at.desc&limit=100");
  return response.json();
}
async function getEvents(id: string): Promise<IncidentEvent[]> {
  const response = await api("/rest/v1/privacy_incident_events?select=*&incident_id=eq." +
    encodeURIComponent(id) + "&order=recorded_at.asc&limit=500");
  return response.json();
}
async function createEvent(id: string, eventType: string, detail: string) {
  await api("/rest/v1/privacy_incident_events", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ incident_id: id, event_type: eventType, detail })
  });
}
async function hashFile(file: Blob) {
  if (!crypto?.subtle) throw new Error("Este navegador no permite verificar la integridad criptográfica.");
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest)).map(x => x.toString(16).padStart(2, "0")).join("");
}
function errorText(error: unknown) {
  return error instanceof Error ? error.message : "No se ha podido completar la operación.";
}

export default function PrivacyIncidentsPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [events, setEvents] = useState<IncidentEvent[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [risk, setRisk] = useState("");
  const [status, setStatus] = useState<IncidentStatus>("investigating");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [newReference, setNewReference] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newOccurred, setNewOccurred] = useState("");
  const [newSummary, setNewSummary] = useState("");

  const selected = incidents.find(row => row.id === selectedId) || null;

  const refresh = useCallback(async (keepId?: string | null) => {
    const list = await getIncidents();
    setIncidents(list);
    setSelectedId(previous => {
      const target = keepId || previous;
      return list.some(row => row.id === target) ? target : (list[0]?.id || null);
    });
  }, []);

  useEffect(() => {
    let disposed = false;
    (async () => {
      await verifyAccess();
      if (disposed) return;
      await refresh();
      if (!disposed) setAuthorized(true);
    })().catch(e => {
      if (disposed) return;
      setError(errorText(e));
    }).finally(() => { if (!disposed) setLoading(false); });
    return () => { disposed = true; };
  }, [refresh]);

  useEffect(() => {
    if (!selectedId || !authorized) return;
    let cancelled = false;
    getEvents(selectedId).then(items => { if (!cancelled) setEvents(items); })
      .catch(e => { if (!cancelled) setError(errorText(e)); });
    return () => { cancelled = true; };
  }, [selectedId, authorized]);

  useEffect(() => {
    if (!selected) { setEvents([]); return; }
    setRisk(selected.risk_assessment);
    setStatus(selected.status);
    setNote("");
    setFile(null);
    setNotice("");
  }, [selected?.id, selected?.updated_at]);

  async function runAction(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setError(""); setNotice("");
    try { await action(); }
    catch (e) { setError(errorText(e)); }
    finally { setBusy(false); }
  }

  const refreshCurrent = async () => {
    await refresh(selectedId);
    if (selectedId) setEvents(await getEvents(selectedId));
  };

  async function saveReview() {
    if (!selected) return;
    await runAction(async () => {
      if (risk.trim().length < 15) throw new Error("La valoración de riesgo debe estar motivada.");
      const response = await api("/rest/v1/privacy_incidents?id=eq." + encodeURIComponent(selected.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({ risk_assessment: risk.trim(), status })
      });
      const rows: Incident[] = await response.json();
      if (rows.length !== 1) throw new Error("No se confirmó el cambio del registro.");
      await refreshCurrent();
      setNotice("Revisión guardada. Los cambios quedan registrados en el historial.");
    });
  }

  async function appendNote() {
    if (!selected) return;
    await runAction(async () => {
      const detail = note.trim();
      if (detail.length < 8 || detail.length > 2000) throw new Error("Introduce una anotación de entre 8 y 2000 caracteres.");
      await createEvent(selected.id, "note", detail);
      setNote("");
      setEvents(await getEvents(selected.id));
      setNotice("Anotación incorporada al historial, sin alterar las anteriores.");
    });
  }

  async function uploadEvidence() {
    if (!selected || !file) return;
    await runAction(async () => {
      if (selected.attachment_path) throw new Error("Ya existe un documento original y no puede sustituirse.");
      if (file.size === 0 || file.size > MAX_SIZE) throw new Error("El PDF debe tener un tamaño entre 1 byte y 10 MB.");
      if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
        throw new Error("Únicamente se admite un PDF original.");
      }
      const signature = new Uint8Array(await file.slice(0, 5).arrayBuffer());
      if (String.fromCharCode(...signature) !== "%PDF-") throw new Error("El archivo no tiene una cabecera PDF válida.");
      const sha256 = await hashFile(file);
      const path = "incidents/" + selected.id + "/" + crypto.randomUUID() + ".pdf";
      await api("/storage/v1/object/" + BUCKET + "/" + path, {
        method: "POST", headers: { "Content-Type": "application/pdf", "x-upsert": "false" }, body: file
      });
      try {
        const response = await api("/rest/v1/privacy_incidents?id=eq." + encodeURIComponent(selected.id) + "&attachment_path=is.null", {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Prefer: "return=representation" },
          body: JSON.stringify({
            attachment_path: path, attachment_sha256: sha256, attachment_mime: "application/pdf"
          })
        });
        const rows: Incident[] = await response.json();
        if (rows.length !== 1) throw new Error("La evidencia se subió, pero no se vinculó al registro.");
      } catch(e) {
        throw new Error("Archivo cargado en Storage privado, pero falta confirmar su vinculación. No repitas la subida sin revisar el registro. " + errorText(e));
      }
      await refreshCurrent();
      setFile(null);
      setNotice("PDF incorporado al almacenamiento privado; SHA-256 registrada y evento auditado.");
    });
  }

  async function downloadEvidence() {
    if (!selected?.attachment_path || !selected.attachment_sha256) return;
    await runAction(async () => {
      await createEvent(selected.id, "evidence_access_requested", "Acceso solicitado al PDF custodiado.");
      const objectPath = selected.attachment_path.split("/").map(encodeURIComponent).join("/");
      const response = await api("/storage/v1/object/authenticated/" + BUCKET + "/" + objectPath);
      const data = await response.blob();
      const actual = await hashFile(data);
      if (actual !== selected.attachment_sha256) {
        await createEvent(selected.id, "integrity_warning", "La comprobación SHA-256 del documento recuperado no coincide con el registro.");
        throw new Error("La huella SHA-256 no coincide. No se descargará el archivo.");
      }
      await createEvent(selected.id, "evidence_access_verified", "PDF recuperado y contrastado mediante SHA-256.");
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = selected.reference + "-registro.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
      setEvents(await getEvents(selected.id));
      setNotice("Integridad verificada y descarga iniciada. Acceso anotado en el historial.");
    });
  }

  async function createIncident() {
    await runAction(async () => {
      if (newReference.trim().length < 8 || newReference.trim().length > 60 ||
          newTitle.trim().length < 8 || newSummary.trim().length < 25)
        throw new Error("Completa la referencia, el título y la descripción objetiva.");
      const record = {
        reference: newReference.trim().toUpperCase(),
        title: newTitle.trim(),
        summary: newSummary.trim(),
        occurred_at: newOccurred ? new Date(newOccurred).toISOString() : null,
        risk_assessment: "Pendiente de evaluación definitiva",
        status: "investigating"
      };
      const response = await api("/rest/v1/privacy_incidents", {
        method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(record)
      });
      const rows: Incident[] = await response.json();
      if (rows.length !== 1) throw new Error("No se pudo confirmar el alta de la incidencia.");
      await refresh(rows[0].id);
      setNewOpen(false); setNewReference(""); setNewTitle(""); setNewOccurred(""); setNewSummary("");
      setNotice("Incidencia registrada y anotada automáticamente en el historial.");
    });
  }

  return (
    <main id="admin-main-content" className="privacy-incidents-page">
      {loading && <p className="privacy-access" role="status">Comprobando acceso profesional al registro de incidencias…</p>}
      {!loading && !authorized && <div className="privacy-access" role="alert">
        <h1>Registro de acceso restringido</h1>
        <p>{error || "No se pudo verificar la sesión."}</p>
        <a href={LOGIN}>Acceder con verificación profesional</a>
      </div>}
      {authorized && <>
        <AdminWorkspaceNav active="seguridad" />
        <header className="privacy-header">
          <div>
            <p className="privacy-eyebrow">Área profesional · Registro privado</p>
            <h1>Protección de datos e incidencias</h1>
            <p>Registro interno de brechas, documentación probatoria y seguimiento de actuaciones. Separado de las fichas de pacientes.</p>
          </div>
          <a href="/admin/">Panel general</a>
        </header>
        <div className="privacy-warning"><strong>Registro RGPD, art. 33.5.</strong> Documenta la investigación y las decisiones profesionales. No supone notificación a la AEPD ni a la persona afectada. Las posibles obligaciones y plazos deben valorarse sin demora.</div>
        <div className="privacy-columns">
          <aside className="privacy-index">
            <div className="privacy-index-heading"><h2>Incidencias</h2><button onClick={() => setNewOpen(v => !v)} type="button" disabled={busy}>{newOpen ? "Cancelar" : "+ Nueva"}</button></div>
            {newOpen && <form onSubmit={e => { e.preventDefault(); void createIncident(); }} className="privacy-form">
              <label>Referencia<input value={newReference} onChange={e => setNewReference(e.target.value)} required maxLength={60} placeholder="INC-AAAA-MM-DD-02"/></label>
              <label>Título (sin datos identificativos)<input value={newTitle} onChange={e => setNewTitle(e.target.value)} required maxLength={140}/></label>
              <label>Fecha y hora del suceso<input type="datetime-local" value={newOccurred} onChange={e => setNewOccurred(e.target.value)}/></label>
              <label>Descripción objetiva<textarea value={newSummary} onChange={e => setNewSummary(e.target.value)} rows={4} required maxLength={4000}/></label>
              <button type="submit" disabled={busy}>Guardar incidencia</button>
            </form>}
            {!incidents.length && <p>No hay incidencias registradas.</p>}
            <div className="privacy-case-list">{incidents.map(item =>
              <button type="button" key={item.id} onClick={() => setSelectedId(item.id)}
                aria-pressed={selectedId === item.id} className={selectedId === item.id ? "is-selected" : ""}>
                <strong>{item.reference}</strong><span>{item.title}</span>
                <small>{statusLabels[item.status]} · {dateLabel(item.occurred_at)}</small>
              </button>
            )}</div>
          </aside>
          {selected && <article className="privacy-case">
            <div className="privacy-case-heading">
              <div>
                <p className="privacy-eyebrow">{selected.reference}</p>
                <h2>{selected.title}</h2>
                <p>Suceso: {dateLabel(selected.occurred_at)}</p>
              </div>
              <span className="privacy-status">{statusLabels[selected.status]}</span>
            </div>
            <section className="privacy-section">
              <h3>Descripción documentada</h3>
              <p className="privacy-preserve">{selected.summary}</p>
              {selected.external_reference?.startsWith("https://") && <a href={selected.external_reference} target="_blank" rel="noopener noreferrer">Referencia técnica externa</a>}
            </section>
            <section className="privacy-section">
              <h3>Valoración de riesgo y estado</h3>
              <label>Motivación y decisiones pendientes
                <textarea rows={5} value={risk} onChange={e => setRisk(e.target.value)} maxLength={6000} />
              </label>
              <label>Estado de investigación
                <select value={status} onChange={e => setStatus(e.target.value as IncidentStatus)}>
                  <option value="investigating">En investigación</option>
                  <option value="contained">Contenida</option>
                  <option value="closed">Cerrada</option>
                </select>
              </label>
              <p className="privacy-hint">Cerrar el registro exige una decisión clínica-jurídica documentada. La aplicación no evalúa automáticamente el riesgo ni determina si hay que notificar.</p>
              <button type="button" onClick={() => void saveReview()} disabled={busy || (status === selected.status && risk === selected.risk_assessment)}>Guardar revisión y dejar trazabilidad</button>
            </section>
            <section className="privacy-section">
              <h3>Documento original y evidencias</h3>
              {selected.attachment_path ? <>
                <p>PDF custodiado en almacenamiento privado. No existe un enlace público.</p>
                <p className="privacy-hash">SHA-256: {selected.attachment_sha256}</p>
                <button type="button" onClick={() => void downloadEvidence()} disabled={busy}>Verificar integridad y descargar PDF</button>
              </> : <>
                <p>El registro existe, pero el PDF todavía no se ha vinculado. Selecciona el documento original para conservarlo sin modificar su contenido.</p>
                <label>Seleccionar PDF original (máximo 10 MB)
                  <input type="file" accept=".pdf,application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} disabled={busy}/>
                </label>
                <button type="button" disabled={busy || !file} onClick={() => void uploadEvidence()}>Adjuntar PDF original con SHA-256</button>
              </>}
              <p className="privacy-hint">El primer documento queda vinculado de forma inmutable. El nombre original no se utiliza como ruta pública ni se envía al repositorio de código.</p>
            </section>
            <section className="privacy-section">
              <h3>Cronología y auditoría</h3>
              {events.length === 0 && <p>No hay eventos anotados.</p>}
              <ol className="privacy-timeline">{events.map(event => <li key={event.id}>
                <span>{dateLabel(event.recorded_at)}</span>
                <strong>{eventLabels[event.event_type] || event.event_type}</strong>
                <p>{event.detail}</p>
              </li>)}</ol>
              <form onSubmit={e => {e.preventDefault(); void appendNote();}} className="privacy-form">
                <label>Añadir actuación, verificación o decisión sin sobrescribir entradas previas
                  <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} maxLength={2000} placeholder="Indica fecha, medida realizada, resultado, evidencias pendientes y responsable."/>
                </label>
                <button type="submit" disabled={busy || note.trim().length < 8}>Añadir al historial</button>
              </form>
            </section>
          </article>}
        </div>
        {notice && <p className="privacy-feedback" role="status">{notice}</p>}
        {error && <p className="privacy-feedback privacy-error" role="alert">{error}</p>}
      </>}
    </main>
  );
}
