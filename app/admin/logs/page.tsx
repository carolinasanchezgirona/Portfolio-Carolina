"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminWorkspaceNav from "../workspace-nav";
import "./logs.css";

type AuditEvent = {
  key: string;
  source: string;
  category: string;
  action: string;
  summary: string;
  detail: string;
  patientId: string | null;
  actorId: string | null;
  createdAt: string;
};
type Patient = { id: string; public_code: string | null; full_name: string | null };
type Source = { name: string; path: string; transform: (row: any) => AuditEvent };
const API = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const OWNER = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const SESSION_KEY = "dememoria_admin_session";
const LOGIN = "/admin/clinica/acceso/?next=%2Fadmin%2Flogs%2F";
const formatter = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", dateStyle: "medium", timeStyle: "short" });

function authHeaders(): Record<string, string> {
  const token = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null")?.access_token;
  if (!token) throw new Error("Necesitas iniciar sesión como profesional.");
  return { apikey: KEY, Authorization: "Bearer " + token };
}
async function get(path: string, headers: Record<string, string>): Promise<any> {
  const res = await fetch(API + path, { headers, cache: "no-store" });
  if (!res.ok) throw new Error("No se ha podido consultar el registro (HTTP " + res.status + ").");
  return res.json();
}
async function verifyAccess(headers: Record<string, string>) {
  const user = await get("/auth/v1/user", headers);
  if (user?.id !== OWNER) throw new Error("Esta cuenta no dispone de acceso a los registros privados.");
  const gate = await fetch(API + "/rest/v1/rpc/admin_mobile_gate", {
    method: "POST", headers: { ...headers, "Content-Type": "application/json" },
    body: "{}", cache: "no-store"
  });
  if (!gate.ok || await gate.json() !== true) throw new Error("Completa la verificación profesional de dos factores.");
}
function when(value: unknown) {
  const d = new Date(String(value || ""));
  return Number.isNaN(d.getTime()) ? "Fecha no disponible" : formatter.format(d);
}
function fields(metadata: any) {
  const changed = metadata?.changed_fields;
  return Array.isArray(changed) && changed.length
    ? "Campos modificados: " + changed.filter((x: unknown) => typeof x === "string").slice(0, 30).join(", ")
    : "";
}
const sources: Source[] = [
  {
    name: "Historiales clínicos",
    path: "/rest/v1/clinical_audit_log?select=id,patient_id,entity_type,action,summary,metadata,actor_user_id,created_at&order=created_at.desc&limit=500",
    transform: r => ({
      key: "clinical:" + r.id, source: "Historiales clínicos", category: "Clínica",
      action: String(r.action || "Cambio"), summary: String(r.summary || "Modificación registrada"),
      detail: fields(r.metadata), patientId: r.patient_id || null, actorId: r.actor_user_id || null,
      createdAt: r.created_at
    })
  },
  {
    name: "Asistencia",
    path: "/rest/v1/clinical_external_attendance_events?select=id,patient_id,old_status,new_status,actor_id,changed_at&order=changed_at.desc&limit=500",
    transform: r => ({
      key: "attendance:" + r.id, source: "Asistencia", category: "Clínica",
      action: "Cambio de asistencia", summary: "Estado de asistencia actualizado",
      detail: [r.old_status, r.new_status].filter(Boolean).join(" → "),
      patientId: r.patient_id || null, actorId: r.actor_id || null, createdAt: r.changed_at
    })
  },
  {
    name: "Incidencias de privacidad",
    path: "/rest/v1/privacy_incident_events?select=id,event_type,detail,recorded_at,recorded_by&order=recorded_at.desc&limit=500",
    transform: r => ({
      key: "privacy:" + r.id, source: "Incidencias de privacidad", category: "Seguridad",
      action: String(r.event_type || "Evento"), summary: "Actuación de privacidad registrada",
      detail: String(r.detail || "").slice(0, 220),
      patientId: null, actorId: r.recorded_by || null, createdAt: r.recorded_at
    })
  },
  {
    name: "Conservación de datos",
    path: "/rest/v1/data_retention_log?select=id,run_at,deleted_count&order=run_at.desc&limit=500",
    transform: r => ({
      key: "retention:" + r.id, source: "Conservación de datos", category: "Seguridad",
      action: "Retención", summary: "Ejecución de política de conservación",
      detail: "Registros depurados: " + String(r.deleted_count ?? "sin dato"),
      patientId: null, actorId: null, createdAt: r.run_at
    })
  },
  {
    name: "Ejercicios compartidos",
    path: "/rest/v1/clinical_exercise_response_events?select=id,patient_id,title,recorded_at&order=recorded_at.desc&limit=500",
    transform: r => ({
      key: "exercise:" + r.id, source: "Ejercicios compartidos", category: "Clínica",
      action: "Respuesta compartida", summary: String(r.title || "Respuesta de ejercicio registrada"),
      detail: "Se omite el contenido de la respuesta.", patientId: r.patient_id || null,
      actorId: null, createdAt: r.recorded_at
    })
  }
];

export default function AdminLogsPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [status, setStatus] = useState("Verificando acceso profesional…");
  const [errors, setErrors] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState("Todas");
  const [search, setSearch] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setStatus("Consultando registros…"); setErrors([]);
    try {
      const headers = authHeaders();
      await verifyAccess(headers);
      setReady(true);
      const results = await Promise.allSettled([
        ...sources.map(s => get(s.path, headers)),
        get("/rest/v1/clinical_patients?select=id,public_code,full_name&order=full_name.asc&limit=1000", headers)
      ]);
      const collected: AuditEvent[] = [];
      const failed: string[] = [];
      for (let i = 0; i < sources.length; i++) {
        const result = results[i];
        if (result.status === "fulfilled" && Array.isArray(result.value)) {
          collected.push(...result.value.map(sources[i].transform));
          if (result.value.length >= 500) failed.push(sources[i].name + ": se muestran solo los 500 registros más recientes");
        } else failed.push(sources[i].name + ": no disponible");
      }
      const people = results[sources.length];
      if (people.status === "fulfilled" && Array.isArray(people.value)) setPatients(people.value);
      else failed.push("Directorio de pacientes: no disponible");
      collected.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setEvents(collected); setErrors(failed);
      setStatus(failed.length ? "Consulta parcial: revisa las advertencias." : "Registros actualizados.");
    } catch (err) {
      setReady(false);
      setStatus(err instanceof Error ? err.message : "No se ha podido verificar el acceso.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  const patientMap = useMemo(() => new Map(patients.map(p => [p.id, p])), [patients]);
  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("es");
    return events.filter(e => {
      if (source !== "Todas" && e.source !== source) return false;
      const day = e.createdAt?.slice(0, 10) || "";
      if (start && day < start) return false;
      if (end && day > end) return false;
      const person = e.patientId ? patientMap.get(e.patientId) : null;
      const searchable = [e.summary, e.detail, e.action, e.source, e.patientId,
        person?.public_code, person?.full_name].join(" ").toLocaleLowerCase("es");
      return !q || searchable.includes(q);
    });
  }, [events, patientMap, source, search, start, end]);

  return (
    <main id="admin-main-content" className="admin-logs-page">
      <div className="admin-logs-top"><a href="/admin/">← Administración</a><h1>Logs y auditoría</h1></div>
      {!ready ? <section className="admin-logs-access" role="status">
        <p>{status}</p><a href={LOGIN}>Acceso profesional</a>
      </section> : <>
        <AdminWorkspaceNav active="seguridad" />
        <header className="admin-logs-intro">
          <div><h2>Registro centralizado de actividad</h2>
            <p>Consulta de eventos registrados por el sistema. Los datos originales permanecen en sus tablas protegidas; esta pantalla no permite editarlos ni eliminarlos.</p>
          </div>
          <button type="button" onClick={() => void load()} disabled={loading}>{loading ? "Actualizando…" : "Actualizar"}</button>
        </header>
        <p role="status" className="admin-logs-status">{status}</p>
        {errors.length > 0 && <div className="admin-logs-warning" role="alert">
          <strong>Fuentes pendientes o límites de consulta</strong>
          <ul>{errors.map(item => <li key={item}>{item}</li>)}</ul>
        </div>}
        <section className="admin-logs-filters" aria-label="Filtrar registros">
          <label>Origen<select value={source} onChange={e => setSource(e.target.value)}>
            <option>Todas</option>{sources.map(s => <option key={s.name}>{s.name}</option>)}
          </select></label>
          <label>Buscar por evento o paciente<input type="search" value={search}
            onChange={e => setSearch(e.target.value)} placeholder="Código, nombre, acción…" /></label>
          <label>Desde<input type="date" value={start} onChange={e => setStart(e.target.value)} /></label>
          <label>Hasta<input type="date" value={end} onChange={e => setEnd(e.target.value)} /></label>
        </section>
        <p className="admin-logs-count">{filtered.length} eventos visibles de {events.length} consultados</p>
        <div className="admin-logs-items">
          {filtered.length === 0 && <p className="admin-logs-empty">No hay eventos que coincidan con los filtros.</p>}
          {filtered.map(e => {
            const p = e.patientId ? patientMap.get(e.patientId) : null;
            return <article key={e.key} className="admin-logs-item">
              <div className="admin-logs-item-head">
                <span>{e.source}</span><time dateTime={e.createdAt}>{when(e.createdAt)}</time>
              </div>
              <strong>{e.summary}</strong>
              <p>{e.action}{e.detail ? " · " + e.detail : ""}</p>
              {e.patientId && <small>Paciente: {p?.public_code || "Identificador interno disponible"}{p?.full_name ? " · " + p.full_name : ""}</small>}
              {e.actorId && <small> · Responsable: profesional autenticado</small>}
            </article>;
          })}
        </div>
        <p className="admin-logs-footnote">Esta vista reúne las fuentes de auditoría actualmente conectadas. No equivale a un registro exhaustivo de todas las acciones del administrador; las actividades sin instrumentación todavía no generan eventos aquí.</p>
      </>}
    </main>
  );
}
