"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./attendance.css";

const BASE = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const API = BASE + "/rest/v1";
const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const OWNER = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const LOGIN = "/admin/clinica/acceso/?next=%2Fadmin%2Fasistencia%2F";

type Status = "pending" | "completed" | "no_show" | "cancelled";
type Patient = {
  id: string;
  full_name: string;
  public_code: string;
  care_context: string;
  status: string;
};
type Visit = {
  id: string;
  visit_date: string;
  visit_time: string;
  roster_name: string;
  patient_id: string | null;
  attendance_status: Status;
  attendance_note: string | null;
  status_recorded_at: string | null;
};

const STATUSES: { value: Status; label: string; className: string }[] = [
  { value: "completed", label: "Realizada", className: "completed" },
  { value: "no_show", label: "No se presenta", className: "no-show" },
  { value: "cancelled", label: "Cancelada", className: "cancelled" },
  { value: "pending", label: "Pendiente", className: "pending" }
];

function today() {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}
function accessToken() {
  try {
    const saved = JSON.parse(sessionStorage.getItem("dememoria_admin_session") || "null");
    return String(saved?.access_token || "");
  } catch { return ""; }
}
function headers(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: KEY, Authorization: "Bearer " + accessToken(),
    "Content-Type": "application/json", ...extra
  };
}
async function rest(path: string, opts: RequestInit = {}) {
  const response = await fetch(API + "/" + path, {
    ...opts, cache: "no-store", headers: headers((opts.headers || {}) as Record<string, string>)
  });
  const result = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || result?.hint || "No se ha podido guardar. Comprueba la conexión.");
  }
  return result;
}
function norm(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleUpperCase("es-ES")
    .replace(/[^A-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}
function normPerson(value: string) {
  const parts = value.split(",");
  const ordered = parts.length === 2 ? parts[1] + " " + parts[0] : value;
  return norm(ordered).split(" ").sort().join(" ");
}
function shortTime(value: string) { return value.slice(0, 5); }
function label(status: Status) {
  return STATUSES.find((item) => item.value === status)?.label || "Pendiente";
}
function count(rows: Visit[], status: Status) { return rows.filter((v) => v.attendance_status === status).length; }
function spanishDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(new Date(y, m - 1, d, 12));
}
function isValidDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(y, m - 1, d);
  return parsed.getFullYear() === y && parsed.getMonth() + 1 === m && parsed.getDate() === d;
}

export default function ManualAttendance() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [search, setSearch] = useState("");
  const [patientId, setPatientId] = useState("");
  const [note, setNote] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [authenticated, setAuthenticated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const patientSearchRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const data = await rest("clinical_external_attendance?select=*&order=visit_date.desc,visit_time.desc&limit=1000") as Visit[];
    if (!Array.isArray(data)) throw new Error("No se ha recibido el historial de asistencia.");
    setVisits(data);
    setNotesDraft(Object.fromEntries(data.map((v) => [v.id, v.attendance_note || ""])));
    if (data.length === 1000) setNotice("El registro alcanza 1000 visitas. Consulta con soporte para paginar el historial completo.");
  };

  useEffect(() => {
    setDate(today());
    (async () => {
      if (!accessToken()) { window.location.assign(LOGIN); return; }
      const [userRes, gateRes] = await Promise.all([
        fetch(BASE + "/auth/v1/user", { headers: headers(), cache: "no-store" }),
        fetch(API + "/rpc/admin_mobile_gate", { method: "POST", headers: headers(), body: "{}" })
      ]);
      const user = await userRes.json().catch(() => null);
      const gate = await gateRes.json().catch(() => false);
      if (!userRes.ok || !gateRes.ok || user?.id !== OWNER || gate !== true) {
        window.location.assign(LOGIN);
        return;
      }
      const people = await rest("clinical_patients?select=id,full_name,public_code,care_context,status&order=full_name.asc") as Patient[];
      if (!Array.isArray(people)) throw new Error("No se ha podido cargar el listado de pacientes.");
      setPatients(people);
      await load();
      setAuthenticated(true);
    })().catch((err) => setNotice(err instanceof Error ? err.message : "No se pudo iniciar el registro."));
  }, []);

  const patient = patients.find((p) => p.id === patientId);
  const matching = useMemo(() => {
    const text = norm(search);
    if (!text || patientId) return [];
    const parts = text.split(" ");
    return patients.filter((p) => p.status !== "archived" &&
      parts.every((part) => norm(p.full_name + " " + p.public_code).includes(part)))
      .slice(0, 8);
  }, [search, patientId, patients]);
  const daily = useMemo(() => visits.filter((v) => v.visit_date === date)
    .sort((a, b) => a.visit_time.localeCompare(b.visit_time)), [visits, date]);
  const patientHistory = useMemo(() => visits.filter((v) => v.patient_id === patientId)
    .sort((a, b) => (b.visit_date + b.visit_time).localeCompare(a.visit_date + a.visit_time)),
    [visits, patientId]);
  const patientById = useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients]);

  function choosePatient(p: Patient) {
    setPatientId(p.id);
    setSearch("");
    setNotice("");
  }
  function resetPatient() {
    setPatientId("");
    setSearch("");
    patientSearchRef.current?.focus();
  }
  async function saveVisit(status: Status) {
    if (!patient || !isValidDate(date) || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      setNotice("Selecciona una ficha clínica, una fecha válida y la hora de la cita.");
      return;
    }
    const samePatient = visits.filter((v) => v.patient_id === patient.id &&
      v.visit_date === date && shortTime(v.visit_time) === time);
    const unlinkedMatch = visits.filter((v) => !v.patient_id &&
      v.visit_date === date && shortTime(v.visit_time) === time &&
      normPerson(v.roster_name) === normPerson(patient.full_name));
    const existing = [...samePatient, ...unlinkedMatch];
    if (existing.length > 1) {
      setNotice("Hay varias visitas coincidentes. Revisa el registro diario antes de añadir otra.");
      return;
    }
    const old = existing[0];
    if (old && old.attendance_status !== "pending" && old.attendance_status !== status &&
        !window.confirm("Ya existe una asistencia registrada a esa hora. ¿Quieres corregir su estado? Se conservará el cambio en auditoría.")) {
      return;
    }
    setBusy(true); setNotice("Guardando la asistencia…");
    try {
      const data: Record<string, unknown> = {
        patient_id: patient.id, attendance_status: status
      };
      if (note.trim()) data.attendance_note = note.trim();
      if (old) {
        const saved = await rest("clinical_external_attendance?id=eq." + encodeURIComponent(old.id) + "&select=id", {
          method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(data)
        }) as { id: string }[];
        if (!Array.isArray(saved) || saved.length !== 1) throw new Error("La modificación no se ha confirmado.");
      } else {
        const saved = await rest("clinical_external_attendance?select=id", {
          method: "POST", headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            visit_date: date, visit_time: time, roster_name: patient.full_name,
            patient_id: patient.id, attendance_status: status, attendance_note: note.trim() || null,
            source_type: "manual"
          })
        }) as { id: string }[];
        if (!Array.isArray(saved) || saved.length !== 1) throw new Error("La nueva visita no se ha confirmado.");
      }
      await load();
      setNotice("Asistencia guardada: " + label(status) + ". Consta en la cronología de " + patient.full_name + ".");
      setNote(""); setTime("");
      resetPatient();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "No se pudo guardar la asistencia.");
    } finally { setBusy(false); }
  }
  async function updateVisit(visit: Visit, patch: Partial<Visit>) {
    if (patch.attendance_status && patch.attendance_status !== visit.attendance_status &&
        visit.attendance_status !== "pending" &&
        !window.confirm("¿Cambiar el estado de esta visita? La corrección quedará auditada.")) return;
    if (!visit.patient_id) {
      setNotice("Esta visita no tiene ficha vinculada. Selecciona primero el paciente y regístrala con la misma fecha y hora.");
      return;
    }
    setBusy(true); setNotice("Actualizando registro…");
    try {
      const updated = await rest("clinical_external_attendance?id=eq." + encodeURIComponent(visit.id) + "&select=id", {
        method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(patch)
      }) as { id: string }[];
      if (!Array.isArray(updated) || updated.length !== 1) throw new Error("El cambio no ha quedado confirmado.");
      await load();
      setNotice("Corrección guardada en el historial de asistencia.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "No se pudo actualizar el registro.");
    } finally { setBusy(false); }
  }
  async function saveNote(visit: Visit) {
    const updatedNote = notesDraft[visit.id]?.trim() || "";
    if (updatedNote === (visit.attendance_note || "")) return;
    await updateVisit(visit, { attendance_note: updatedNote || null });
  }
  return (
    <main className="attendance-page" id="admin-main-content">
      <header className="attendance-header">
        <div>
          <span className="attendance-eyebrow">Mi clínica · Creu Blava</span>
          <h1>Control de asistencia</h1>
          <p>Un registro por visita. Recuento automático en la historia de cada paciente.</p>
        </div>
        <a className="attendance-back" href="/admin/clinica/?panel=1">Volver a Mi clínica</a>
      </header>
      {!authenticated ? <div className="attendance-card"><p role="status">{notice || "Verificando acceso profesional…"}</p>
        {notice && <a href={LOGIN}>Volver a identificarme</a>}</div> : <>
        <section className="attendance-card attendance-registration" aria-label="Registrar asistencia">
          <div className="attendance-topline"><h2>Registrar sesión</h2><span className="attendance-step">1. Paciente · 2. Fecha y hora · 3. Estado</span></div>
          {patient ? <div className="attendance-selected">
            <div><strong>{patient.full_name}</strong><small>Ficha {patient.public_code}</small></div>
            <button type="button" className="attendance-light-button" onClick={resetPatient}>Cambiar paciente</button>
          </div> : <div className="attendance-patient-picker">
            <label htmlFor="attendance-patient-search">Buscar paciente por nombre o código de historia</label>
            <input ref={patientSearchRef} id="attendance-patient-search" type="search" autoComplete="off"
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Empieza a escribir el nombre…" />
            {search && <div className="attendance-suggestions" role="list" aria-label="Pacientes coincidentes">
              {matching.length ? matching.map((p) => <button type="button" key={p.id} role="listitem" onClick={() => choosePatient(p)}>
                <strong>{p.full_name}</strong><small>Historia {p.public_code}</small>
              </button>) : <p>No hay coincidencias. Comprueba el nombre o la ficha en Pacientes.</p>}
            </div>}
          </div>}
          <div className="attendance-fields">
            <label>Fecha de la cita<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
            <label>Hora de la cita<input type="time" step={60} value={time} onChange={(e) => setTime(e.target.value)} required /></label>
          </div>
          <label className="attendance-optional-note">Observación (opcional)
            <input value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} placeholder="Por ejemplo: avisó antes de la cita…" />
          </label>
          <div className="attendance-actions" aria-label="Guardar estado de asistencia">
            {STATUSES.map((item) => <button key={item.value} type="button"
              className={"attendance-action " + item.className}
              disabled={busy || !patient || !isValidDate(date) || !time}
              onClick={() => saveVisit(item.value)}>{item.label}</button>)}
          </div>
          <p className="attendance-hint">Pulsa el estado correspondiente para guardarlo. Si ya existe una visita del mismo paciente a esa hora, se actualizará sin duplicarla.</p>
        </section>
        <section className="attendance-card">
          <div className="attendance-topline"><h2>Resumen del día</h2><strong>{isValidDate(date) ? spanishDate(date) : "Fecha por seleccionar"}</strong></div>
          <div className="attendance-stats">
            <div><strong>{daily.length}</strong><span>Registradas</span></div>
            <div><strong>{count(daily,"completed")}</strong><span>Realizadas</span></div>
            <div><strong>{count(daily,"no_show")}</strong><span>No se presentan</span></div>
            <div><strong>{count(daily,"cancelled")}</strong><span>Canceladas</span></div>
            <div><strong>{count(daily,"pending")}</strong><span>Pendientes</span></div>
          </div>
          <div className="attendance-list">
            {!daily.length ? <p className="attendance-empty">Aún no hay visitas registradas en esta fecha.</p> :
              daily.map((v) => <article className="attendance-visit" key={v.id}>
                <div className="attendance-visit-person">
                  <strong>{shortTime(v.visit_time)} · {patientById.get(v.patient_id || "")?.full_name || v.roster_name}</strong>
                  <span>{patientById.get(v.patient_id || "")?.public_code || "Sin ficha vinculada"}</span>
                </div>
                <label>Estado
                  <select disabled={busy || !v.patient_id} value={v.attendance_status}
                    onChange={(e) => updateVisit(v, { attendance_status: e.target.value as Status })}>
                    {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </label>
                <div className="attendance-visit-note">
                  <label>Observación<input maxLength={1000} disabled={busy}
                    value={notesDraft[v.id] ?? v.attendance_note ?? ""}
                    onChange={(e) => setNotesDraft((prev) => ({ ...prev, [v.id]: e.target.value }))} /></label>
                  {(notesDraft[v.id] ?? "") !== (v.attendance_note || "") &&
                    <button type="button" disabled={busy} className="attendance-light-button"
                      onClick={() => saveNote(v)}>Guardar nota</button>}
                </div>
              </article>)}
          </div>
        </section>
        {patient && <section className="attendance-card" aria-label="Seguimiento del paciente">
          <div className="attendance-topline"><h2>Historial de asistencia</h2><span>{patient.full_name}</span></div>
          <p>Acumulado de Creu Blava, independientemente del día seleccionado.</p>
          <div className="attendance-stats">
            <div><strong>{patientHistory.length}</strong><span>Registradas</span></div>
            <div><strong>{count(patientHistory,"completed")}</strong><span>Realizadas</span></div>
            <div><strong>{count(patientHistory,"no_show")}</strong><span>Ausencias</span></div>
            <div><strong>{count(patientHistory,"cancelled")}</strong><span>Canceladas</span></div>
            <div><strong>{count(patientHistory,"pending")}</strong><span>Pendientes</span></div>
          </div>
          <div className="attendance-patient-history">
            {patientHistory.length ? patientHistory.map((v) => <div key={v.id}>
              <span>{spanishDate(v.visit_date)} · {shortTime(v.visit_time)}</span>
              <strong>{label(v.attendance_status)}</strong>
              {v.attendance_note && <small>{v.attendance_note}</small>}
            </div>) : <p className="attendance-empty">Todavía no hay registros de asistencia de este paciente.</p>}
          </div>
        </section>}
        <p className="attendance-feedback" role="status" aria-live="polite">{notice}</p>
        <p className="attendance-disclaimer">
          Registro asistencial administrativo privado. La asistencia no crea automáticamente una nota de evolución clínica.
          Cada corrección queda auditada. Utiliza este módulo con datos de Creu Blava únicamente si está autorizado por el responsable del tratamiento.
        </p>
      </>}
    </main>
  );
}
