"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import "./patient-messages.css";
type Message = { id: string; patient_id: string; sender: string; body?: string; created_at: string; read_at: string | null; patient?: { full_name?: string } };
export default function PatientMessages({ admin = false }: { admin?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<Message[]>([]);
  const [selected, setSelected] = useState("");
  const selection = useRef(selected); selection.current = selected;
  const [body, setBody] = useState("");
  const drafts=useRef<Record<string,string>>({});
  useEffect(()=>{const leave=(event:BeforeUnloadEvent)=>{if(body.trim()||Object.values(drafts.current).some(v=>v.trim())){event.preventDefault();event.returnValue='';}};window.addEventListener('beforeunload',leave);return()=>window.removeEventListener('beforeunload',leave);},[body]);
  const [nonce, setNonce] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [authorized, setAuthorized] = useState(!admin);
  const api = useCallback(async (method: string, data?: object, list = false) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (admin) {
      const stored = JSON.parse(sessionStorage.getItem("dememoria_admin_session") || "null");
      if (!stored?.access_token) { window.location.assign("/admin/clinica/acceso/?next=/admin/mensajes/"); throw new Error("Inicia sesión en el panel profesional."); }
      headers.Authorization = "Bearer " + stored.access_token;
    }
    const endpoint = admin ? "/api/admin/patient-messages" + (!list && selected ? "?patient_id=" + selected : "") : "/api/patient-portal/messages";
    const res = await fetch(endpoint, { method, headers, credentials: "include", cache: "no-store", ...(data ? { body: JSON.stringify(data) } : {}) });
    const result = await res.json();
    if (!res.ok) { if (res.status === 401 || res.status === 403) { setMessages([]); setLoaded(false); } if (admin && res.status === 401) { setAuthorized(false); window.location.assign("/admin/clinica/acceso/?next=/admin/mensajes/"); } throw new Error(result.error || "No se han podido cargar los mensajes."); }
    if (admin) setAuthorized(true);
    return result;
  }, [admin, selected]);
  const load = useCallback(async () => {
    try {
      if (admin) {
        const result = await api("GET", undefined, true);
        if (selection.current !== selected) return;
        setThreads(result.messages);
        if (!selected) { setLoaded(true); setError(""); return; }
      }
      const result = await api("GET");
      if (selection.current !== selected) return;
      setMessages(result.messages.reverse()); setLoaded(true); setError("");
    } catch (err) { setError(err instanceof Error ? err.message : "Comprueba tu conexión."); }
  }, [admin, selected, api]);
  useEffect(() => {
    setMessages([]); setLoaded(false); setNotice("");
    void load();
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void load(); }, 30000);
    return () => window.clearInterval(timer);
  }, [load]);
  async function send(event: React.FormEvent) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError(""); setNotice("");
    const sendNonce = nonce || crypto.randomUUID(); setNonce(sendNonce);
    try { await api("POST", { body, nonce: sendNonce }); delete drafts.current[selected]; setBody(""); setNonce(""); setNotice("Mensaje enviado."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "No se ha enviado el mensaje."); }
    finally { setBusy(false); }
  }
  async function markRead() {
    const ids = messages.filter(m => !m.read_at && m.sender === (admin ? "patient" : "clinician")).map(m => m.id);
    if (!ids.length) return;
    try { await api("PATCH", { ids }); await load(); } catch (err) { setError(err instanceof Error ? err.message : "No se ha podido marcar como leído."); }
  }
  const unique = threads.filter((m, i, all) => all.findIndex(other => other.patient_id === m.patient_id) === i);
  const unread = messages.filter(m => !m.read_at && m.sender === (admin ? "patient" : "clinician")).length;
  return <section id="mensajes" className="private-messages" aria-labelledby="private-messages-title">
    <h2 id="private-messages-title">{admin ? "Mensajes de pacientes" : "Mensajes a Carolina"}</h2>
    {!admin && <p>Escríbeme entre sesiones y consulta aquí mis respuestas. Este espacio no se atiende de forma inmediata ni es un canal de urgencias.</p>}
    {authorized && admin && <label>Conversaciones <select aria-label="Conversaciones" disabled={busy} value={selected} onChange={e => { drafts.current[selected]=body;setSelected(e.target.value); setBody(drafts.current[e.target.value]||""); setNonce(""); }}><option value="">Selecciona un paciente</option>{unique.map(m => {
      const pending = threads.filter(t => t.patient_id === m.patient_id && t.sender === "patient" && !t.read_at).length;
      return <option key={m.patient_id} value={m.patient_id}>{m.patient?.full_name || "Paciente"}{pending ? ` · ${pending} sin leer` : ""}</option>;
    })}</select></label>}
    {error && <p role="alert">{error} <button type="button" onClick={() => void load()}>Reintentar</button></p>}
    {authorized && (!admin || selected) && <>
      {!loaded && !error && <p role="status">Cargando mensajes…</p>}
      {loaded && messages.length === 0 && <p>Todavía no hay mensajes.</p>}
      {unread > 0 && <button type="button" onClick={() => void markRead()}>Marcar {unread} como leído{unread > 1 ? "s" : ""}</button>}
      <div className="private-messages-history" aria-label="Historial de mensajes">{messages.map(m => <article key={m.id} className={m.sender === "clinician" ? "from-clinician" : "from-patient"}>
        <strong>{m.sender === "clinician" ? "Carolina" : admin ? "Paciente" : "Tú"}</strong><time dateTime={m.created_at}>{new Date(m.created_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}</time>
        <p>{m.body}</p><small>{m.read_at ? "Leído" : "Enviado · pendiente de lectura"}</small>
      </article>)}</div>
      {messages.length >= 200 && <p>Se muestran los 200 mensajes más recientes.</p>}
      {loaded && <form onSubmit={send}><label htmlFor="private-message-body">{admin ? "Responder al paciente" : "Tu mensaje"}</label><textarea id="private-message-body" required maxLength={4000} rows={4} value={body} disabled={busy} onChange={e => { setBody(e.target.value);drafts.current[selected]=e.target.value; setNonce(""); }} />
        <div className="private-messages-actions"><small>{body.length}/4000</small><button disabled={busy || !body.trim()} type="submit">{busy ? "Enviando…" : "Enviar mensaje"}</button></div>
        <p role="status" aria-live="polite">{notice}</p>
      </form>}
    </>}
    <p className="private-messages-refresh">Actualización cada 30 segundos. <button type="button" onClick={() => void load()}>Actualizar</button></p>
  </section>;
}
