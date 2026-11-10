"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./attendance.css";

const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const API = SUPABASE_URL + "/rest/v1";
const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const OWNER = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const LOGIN = "/admin/clinica/acceso/?next=%2Fadmin%2Fasistencia%2F";

type AttendanceStatus = "pending" | "completed" | "no_show" | "cancelled";
type Patient = { id: string; full_name: string; public_code: string; care_context: string };
type Attendance = {
  id: string; visit_date: string; visit_time: string; roster_name: string;
  patient_id: string | null; attendance_status: AttendanceStatus;
  attendance_note: string | null; status_recorded_at: string | null;
};
type Draft = { key: string; visit_time: string; roster_name: string; patient_id: string | null; selected: boolean };

const choices: { value: AttendanceStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "completed", label: "Realizada" },
  { value: "no_show", label: "No se presenta" },
  { value: "cancelled", label: "Cancelada" }
];
function localDate() {
  const d = new Date();
  return String(d.getFullYear()) + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function accessToken() {
  try {
    const stored = JSON.parse(sessionStorage.getItem("dememoria_admin_session") || "null");
    return String(stored?.access_token || "");
  } catch { return ""; }
}
function headers(extra?: Record<string, string>): Record<string, string> {
  return { apikey: KEY, Authorization: "Bearer " + accessToken(), "Content-Type": "application/json", ...(extra || {}) };
}
async function rest(path: string, options: RequestInit = {}) {
  const response = await fetch(API + "/" + path, { ...options, cache: "no-store", headers: headers(options.headers as Record<string, string> || {}) });
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || body?.hint || "No se ha podido completar la operación.");
  return body;
}
function normalizeName(value: string) {
  const parts = value.toLocaleUpperCase("es-ES").split(",");
  const inOrder = parts.length === 2 ? parts[1] + " " + parts[0] : value;
  return inOrder.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
    .replace(/[^A-Z ]/g, " ").trim().split(/\s+/).filter(Boolean).sort().join(" ");
}
function normalizeTime(s: string) {
  const match = s.trim().match(/^(\d{1,2})[:.;]([0-5]\d)$/);
  return match && +match[1] < 24 ? match[1].padStart(2, "0") + ":" + match[2] : "";
}
function parseRoster(content: string): Draft[] {
  const parsed: Draft[] = [];
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*(\d{1,2}[:.;][0-5]\d)\s+(.+?)\s*$/);
    if (match) {
      const visit_time = normalizeTime(match[1]);
      const roster_name = match[2].replace(/\s+/g, " ").replace(/[|]/g, "I").trim();
      if (visit_time && /[A-ZÁÉÍÓÚÑÇÀÈÏÜa-záéíóúñçàèïü]/.test(roster_name)) {
        parsed.push({ key: String(parsed.length), visit_time, roster_name, patient_id: null, selected: true });
      }
    } else if (parsed.length && line.trim() && /^[A-ZÁÉÍÓÚÑÇÀÈÏÜ\s,.'-]+$/.test(line.trim()) && !/^(HORA|PACIENTE|TOTAL|FECHA)$/i.test(line.trim())) {
      parsed[parsed.length - 1].roster_name += " " + line.trim();
    }
  }
  return Array.from(new Map(parsed.map((item) => [item.visit_time + "|" + normalizeName(item.roster_name), item])).values());
}
function formatTime(s: string) { return s.slice(0, 5); }

export default function ExternalAttendancePage() {
  const [date, setDate] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [sourceText, setSourceText] = useState("");
  const [linksReviewed, setLinksReviewed] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDate(localDate());
    (async () => {
      const token = accessToken();
      if (!token) { location.replace(LOGIN); return; }
      const [userResponse, gateResponse] = await Promise.all([
        fetch(SUPABASE_URL + "/auth/v1/user", { headers: headers() }),
        fetch(API + "/rpc/admin_mobile_gate", { method: "POST", headers: headers(), body: "{}" })
      ]);
      const user = await userResponse.json().catch(() => null);
      const gate = await gateResponse.json().catch(() => false);
      if (!userResponse.ok || !gateResponse.ok || user?.id !== OWNER || gate !== true) {
        location.replace(LOGIN); return;
      }
      const found = await rest("clinical_patients?select=id,full_name,public_code,care_context&order=full_name.asc") as Patient[];
      setPatients(found || []);
      setAuthorized(true);
    })().catch((error) => setMessage(error instanceof Error ? error.message : "No se pudo validar el acceso."));
  }, []);

  useEffect(() => {
    if (!authorized || !date) return;
    rest("clinical_external_attendance?select=*&visit_date=eq." + date + "&order=visit_time.asc,roster_name.asc")
      .then((data) => setRecords(data || []))
      .catch((error) => setMessage(error instanceof Error ? error.message : "No se pudo cargar el día."));
  }, [date, authorized]);

  const counts = useMemo(() => ({
    completed: records.filter((r) => r.attendance_status === "completed").length,
    noShow: records.filter((r) => r.attendance_status === "no_show").length,
    cancelled: records.filter((r) => r.attendance_status === "cancelled").length,
    pending: records.filter((r) => r.attendance_status === "pending").length
  }), [records]);

  function proposedPatient(name: string) {
    const target = normalizeName(name);
    const matches = patients.filter((p) => ["creu_blava", "combined"].includes(p.care_context) && normalizeName(p.full_name) === target);
    return matches.length === 1 ? matches[0].id : null;
  }
  function prepare(text: string) {
    const items = parseRoster(text).map((r) => ({ ...r, patient_id: proposedPatient(r.roster_name) }));
    setDrafts(items);
    setLinksReviewed(false);
    setMessage(items.length
      ? "Se han detectado " + items.length + " filas. Corrige nombres y vinculaciones antes de guardar."
      : "No se han reconocido filas. Pega el listado con hora y nombre en cada línea.");
  }
  async function readPhoto() {
    const file = photoRef.current?.files?.[0];
    if (!file) { prepare(sourceText); return; }
    setExtracting(true);
    setMessage("Reconociendo la fotografía en el navegador. No se almacena la imagen.");
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      try {
        const result = await worker.recognize(file, { rotateAuto: true });
        setSourceText(result.data.text);
        prepare(result.data.text);
      } finally { await worker.terminate(); }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error leyendo la fotografía. Puedes pegar el texto.");
    } finally { setExtracting(false); }
  }
  async function reload() {
    const data = await rest("clinical_external_attendance?select=*&visit_date=eq." + date + "&order=visit_time.asc,roster_name.asc");
    setRecords(data || []);
  }
  async function importDrafts() {
    if (!date) return;
    const selected = drafts.filter((item) => item.selected);
    if (selected.some((item) => item.patient_id) && !linksReviewed) {
      setMessage("Antes de guardar, confirma que has comprobado las fichas vinculadas."); return;
    }
    if (!selected.length) { setMessage("Selecciona al menos una fila."); return; }
    if (selected.some((item) => !normalizeTime(item.visit_time) || !item.roster_name.trim())) {
      setMessage("Hay filas sin nombre u hora válida."); return;
    }
    const existing = new Set(records.map((r) => formatTime(r.visit_time) + "|" + normalizeName(r.roster_name)));
    const newRows = selected.filter((r) => !existing.has(r.visit_time + "|" + normalizeName(r.roster_name)));
    if (!newRows.length) { setMessage("Estas citas ya están guardadas para la fecha seleccionada."); return; }
    setBusy(true);
    try {
      await rest("clinical_external_attendance", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(newRows.map((r) => ({
          visit_date: date, visit_time: r.visit_time, roster_name: r.roster_name.trim(),
          patient_id: r.patient_id, attendance_status: "pending", source_type: "photo_roster"
        })))
      });
      await reload();
      setDrafts([]);
      setMessage(newRows.length + " citas guardadas como pendientes. Ninguna se ha marcado como realizada.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo importar."); }
    finally { setBusy(false); }
  }
  async function updateRecord(record: Attendance, patch: Partial<Attendance>) {
    if (patch.attendance_status && patch.attendance_status !== "pending" && !(patch.patient_id || record.patient_id)) {
      setMessage("Vincula primero la cita con una ficha clínica antes de marcar su asistencia.");
      return;
    }
    setBusy(true);
    try {
      const saved = await rest("clinical_external_attendance?id=eq." + encodeURIComponent(record.id) + "&select=id", {
        method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(patch)
      }) as { id: string }[];
      if (!Array.isArray(saved) || saved.length !== 1) throw new Error("No se ha confirmado el cambio en la base de datos.");
      await reload();
      setMessage("Cambio guardado y reflejado en la historia del paciente vinculado.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo guardar el cambio."); }
    finally { setBusy(false); }
  }
  function editDraft(key: string, patch: Partial<Draft>) {
    setLinksReviewed(false);
    setDrafts((previous) => previous.map((row) => row.key === key ? { ...row, ...patch } : row));
  }

  return (
    <main className="attendance-page">
      <header className="attendance-header">
        <div><span className="attendance-eyebrow">Gestión clínica · Creu Blava</span><h1>Control de asistencia</h1><p>Listados diarios, ausencias y registro vinculado a la historia clínica.</p></div>
        <a className="attendance-back" href="/admin/clinica/?panel=1">Volver a Mi clínica</a>
      </header>
      {!authorized ? <p role="status">{message || "Verificando acceso profesional…"}</p> : <>
        <section className="attendance-card">
          <div className="attendance-head-row"><h2>Jornada</h2><label>Fecha de las citas <input type="date" value={date} onChange={(event) => { setDate(event.target.value); setDrafts([]); setLinksReviewed(false); }} /></label></div>
          <div className="attendance-stats">
            <div><strong>{records.length}</strong><span>Programadas</span></div>
            <div><strong>{counts.completed}</strong><span>Realizadas</span></div>
            <div><strong>{counts.noShow}</strong><span>No se presentan</span></div>
            <div><strong>{counts.cancelled}</strong><span>Canceladas</span></div>
            <div><strong>{counts.pending}</strong><span>Pendientes</span></div>
          </div>
        </section>
        <section className="attendance-card">
          <h2>Importar listado de la Creu</h2>
          <p>Selecciona la fecha exacta de la fotografía. La lectura se realiza en este dispositivo y debes revisar sus resultados antes de guardarlos.</p>
          <div className="attendance-import">
            <label>Fotografía del listado <input ref={photoRef} type="file" accept="image/*" /></label>
            <button type="button" onClick={readPhoto} disabled={extracting || busy}>{extracting ? "Leyendo imagen…" : "Leer fotografía o texto"}</button>
          </div>
          <label className="attendance-full">Texto alternativo (hora y paciente por línea)
            <textarea rows={3} value={sourceText} onChange={(event) => setSourceText(event.target.value)} placeholder={"09:00 APELLIDOS, NOMBRE\n09:20 APELLIDOS, NOMBRE"} />
          </label>
          {drafts.length > 0 && <div className="attendance-preview"><h3>Revisión antes de guardar ({drafts.length})</h3>
            {drafts.map((row) => <div className="attendance-edit-row" key={row.key}>
              <input type="checkbox" aria-label="Importar fila" checked={row.selected} onChange={(event) => editDraft(row.key, { selected: event.target.checked })} />
              <input aria-label="Hora" value={row.visit_time} onChange={(event) => editDraft(row.key, { visit_time: event.target.value })} />
              <input aria-label="Nombre" value={row.roster_name} onChange={(event) => editDraft(row.key, { roster_name: event.target.value, patient_id: null })} />
              <select aria-label="Vincular paciente" value={row.patient_id || ""} onChange={(event) => editDraft(row.key, { patient_id: event.target.value || null })}>
                <option value="">Sin vincular</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.full_name} · {p.public_code}</option>)}
              </select>
            </div>)}
            <label className="attendance-confirm-links"><input type="checkbox" checked={linksReviewed} onChange={(event) => setLinksReviewed(event.target.checked)} />He revisado la identidad de las personas y las fichas sugeridas. Ninguna asistencia se confirma con esta importación.</label>
            <button type="button" disabled={busy || (drafts.some((r) => r.selected && r.patient_id) && !linksReviewed)} onClick={importDrafts}>Guardar {drafts.filter((r) => r.selected).length} citas pendientes</button>
          </div>}
        </section>
        <section className="attendance-card">
          <h2>Registro diario</h2>
          {!records.length ? <p>No hay visitas registradas para esta fecha.</p> : <div className="attendance-records">
            {records.map((r) => <div className="attendance-record" key={r.id}>
              <div className="attendance-patient"><strong>{formatTime(r.visit_time)} · {r.roster_name}</strong><span>{r.patient_id ? "Vinculado a historia clínica" : "Sin ficha vinculada"}</span></div>
              <label>Ficha
                <select disabled={busy} value={r.patient_id || ""} onChange={(event) => updateRecord(r, { patient_id: event.target.value || null })}>
                  <option value="">Sin vincular</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.full_name} · {p.public_code}</option>)}
                </select>
              </label>
              <label>Asistencia
                <select disabled={busy} value={r.attendance_status} onChange={(event) => updateRecord(r, { attendance_status: event.target.value as AttendanceStatus })}>
                  {choices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
                </select>
              </label>
              <label className="attendance-note">Observación administrativa
                <input key={r.id + (r.attendance_note || "")} disabled={busy} defaultValue={r.attendance_note || ""} placeholder="Avisó, cancelación, etc." maxLength={1000}
                  onBlur={(event) => { if (event.target.value !== (r.attendance_note || "")) updateRecord(r, { attendance_note: event.target.value || null }); }} />
              </label>
            </div>)}
          </div>}
        </section>
        <p className="attendance-feedback" role="status" aria-live="polite">{message}</p>
        <p className="attendance-disclaimer">Las coincidencias de nombre son sugerencias que requieren verificación manual. Las citas importadas no acreditan asistencia. Solo los cambios confirmados quedan registrados. No se envía ninguna comunicación al paciente y no se crea automáticamente una nota de evolución clínica.</p>
      </>}
    </main>
  );
}
