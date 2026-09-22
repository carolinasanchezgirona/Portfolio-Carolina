"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "../../lib/supabase-public";
import "./questions-admin.css";

const ADMIN_USER_ID = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const SESSION_KEY = "dememoria_admin_session";

type Session = { access_token: string; user?: { id?: string } };
type Status = "pending" | "answered" | "published" | "rejected";
type AdminQuestion = {
  id: string;
  created_at: string;
  updated_at: string;
  question_text: string;
  question_public: string | null;
  answer: string | null;
  category: string;
  contact_email: string | null;
  privacy_accepted: boolean;
  consent_health: boolean;
  consent_publish: boolean;
  status: Status;
  anchor_slug: string | null;
  related_page: string | null;
  published_at: string | null;
  display_order: number;
  notified_at: string | null;
};

const categories = [
  ["psicologia", "Psicología"],
  ["ansiedad-animo", "Ansiedad y estado de ánimo"],
  ["relaciones-duelo", "Relaciones y duelo"],
  ["neuropsicologia", "Neuropsicología"],
  ["memoria-deterioro", "Memoria y deterioro cognitivo"],
  ["familiares-cuidadores", "Familiares y cuidadores"],
  ["otra", "Otra consulta"],
] as const;

const statusLabels: Record<Status, string> = {
  pending: "Pendiente",
  answered: "Preparada",
  published: "Publicada",
  rejected: "Descartada",
};

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 150);
}
function storedSession(): Session | null {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
}

export default function AdminQuestionsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [selected, setSelected] = useState<AdminQuestion | null>(null);
  const [filter, setFilter] = useState<"all" | Status>("pending");
  const [message, setMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const authHeaders = useCallback((activeSession = session) => ({
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${activeSession?.access_token || ""}`,
    "Content-Type": "application/json",
  }), [session]);

  const loadQuestions = useCallback(async (activeSession: Session, selectedId?: string) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/expert_questions?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${activeSession.access_token}`,
      },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("No se han podido cargar las preguntas.");
    const rows: AdminQuestion[] = await response.json();
    setQuestions(rows);
    if (selectedId) setSelected(rows.find((item) => item.id === selectedId) || null);
  }, []);

  useEffect(() => {
    const activeSession = storedSession();
    if (!activeSession?.access_token) { setChecking(false); return; }
    fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${activeSession.access_token}` },
      cache: "no-store",
    }).then(async (response) => {
      if (!response.ok) throw new Error();
      const user = await response.json();
      if (user.id !== ADMIN_USER_ID) throw new Error();
      setSession(activeSession);
      await loadQuestions(activeSession);
    }).catch(() => sessionStorage.removeItem(SESSION_KEY)).finally(() => setChecking(false));
  }, [loadQuestions]);

  const counts = useMemo(() => questions.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {}), [questions]);
  const visible = useMemo(() => questions.filter((item) => filter === "all" || item.status === filter), [questions, filter]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoginMessage("Entrando…");
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.user?.id !== ADMIN_USER_ID) {
      setLoginMessage(result.error_description || "No se ha podido iniciar sesión.");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(result));
    setSession(result);
    setChecking(true);
    try { await loadQuestions(result); } finally { setChecking(false); }
  }

  function updateSelected<K extends keyof AdminQuestion>(key: K, value: AdminQuestion[K]) {
    setSelected((current) => current ? { ...current, [key]: value } : current);
  }

  async function patchQuestion(payload: Partial<AdminQuestion>, successMessage: string, notify = false) {
    if (!selected || !session) return;
    setBusy(true);
    setMessage("Guardando…");
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/expert_questions?id=eq.${encodeURIComponent(selected.id)}`, {
        method: "PATCH",
        headers: { ...authHeaders(), Prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => []);
      if (!response.ok) throw new Error(result.message || "No se ha podido guardar.");
      if (notify) {
        const notification = await fetch(`${SUPABASE_URL}/functions/v1/notify-expert-question-answer`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ id: selected.id }),
        });
        if (!notification.ok) successMessage += " La respuesta está publicada, pero revisa el aviso por correo.";
      }
      await loadQuestions(session, selected.id);
      setMessage(successMessage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se ha podido guardar.");
    } finally {
      setBusy(false);
    }
  }

  function editablePayload(nextStatus?: Status) {
    if (!selected) return {};
    const publicQuestion = selected.question_public?.trim() || "";
    const answer = selected.answer?.trim() || "";
    return {
      question_public: publicQuestion || null,
      answer: answer || null,
      category: selected.category,
      anchor_slug: selected.anchor_slug?.trim() || (publicQuestion ? slugify(publicQuestion) : null),
      related_page: selected.related_page || null,
      display_order: Number(selected.display_order) || 0,
      status: nextStatus || (selected.status === "published" ? "published" : answer.length >= 80 ? "answered" : "pending"),
    };
  }

  function saveDraft() {
    patchQuestion(editablePayload(), "Cambios guardados.");
  }

  function publish() {
    if (!selected) return;
    const publicQuestion = selected.question_public?.trim() || "";
    const answer = selected.answer?.trim() || "";
    if (!selected.consent_publish) return setMessage("No consta autorización para publicar esta pregunta.");
    if (publicQuestion.length < 20) return setMessage("Prepara una pregunta pública anonimizada de al menos 20 caracteres.");
    if (answer.length < 80) return setMessage("La respuesta necesita al menos 80 caracteres.");
    const payload = {
      ...editablePayload("published"),
      anchor_slug: selected.anchor_slug?.trim() || slugify(publicQuestion),
      published_at: selected.published_at || new Date().toISOString(),
    };
    patchQuestion(payload, "Pregunta publicada. Ya aparece en la página pública.", true);
  }

  function reject() {
    if (selected) patchQuestion({ status: "rejected" }, "Pregunta archivada como descartada.");
  }

  async function removeQuestion() {
    if (!selected || !session || !window.confirm("¿Eliminar definitivamente esta pregunta y sus datos de contacto?")) return;
    setBusy(true);
    const response = await fetch(`${SUPABASE_URL}/rest/v1/expert_questions?id=eq.${encodeURIComponent(selected.id)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (response.ok) {
      setSelected(null);
      await loadQuestions(session);
      setMessage("Pregunta eliminada definitivamente.");
    } else setMessage("No se ha podido eliminar.");
    setBusy(false);
  }

  function logOut() {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    setSelected(null);
  }

  if (checking) return <main className="questions-admin-loading">Cargando el buzón privado…</main>;

  if (!session) return (
    <main className="questions-admin-page">
      <section className="questions-admin-login-shell">
        <form className="questions-admin-login" onSubmit={signIn}>
          <p className="questions-admin-eyebrow">Área privada</p>
          <h1>Preguntas</h1>
          <p>Revisa, anonimiza y responde antes de publicar.</p>
          <label>Correo<input name="email" type="email" autoComplete="username" required /></label>
          <label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label>
          <p className="questions-admin-message" role="status">{loginMessage}</p>
          <button className="questions-admin-primary" type="submit">Entrar</button>
          <a href="/admin/agenda/">Volver a agenda</a>
        </form>
      </section>
    </main>
  );

  return (
    <main className="questions-admin-page">
      <header className="questions-admin-topbar">
        <div>
          <p className="questions-admin-eyebrow">Administración editorial</p>
          <h1>Pregunta a Carolina</h1>
          <p>El texto original y el correo son privados. Solo se publica la versión revisada.</p>
        </div>
        <nav>
          <a href="/admin/agenda/">Agenda</a>
          <a href="/admin/articulos/">Artículos</a>
          <a href="/pregunta-a-carolina/" target="_blank" rel="noopener noreferrer">Ver página</a>
          <button type="button" onClick={logOut}>Cerrar sesión</button>
        </nav>
      </header>

      <div className="questions-admin-workspace">
        <aside className="questions-admin-sidebar">
          <div className="questions-admin-count"><strong>Buzón</strong><span>{questions.length}</span></div>
          <div className="questions-admin-filters">
            {(["all", "pending", "answered", "published", "rejected"] as const).map((value) => (
              <button type="button" className={filter === value ? "active" : ""} key={value} onClick={() => setFilter(value)}>
                {value === "all" ? "Todas" : statusLabels[value]} <span>{value === "all" ? questions.length : counts[value] || 0}</span>
              </button>
            ))}
          </div>
          <div className="questions-admin-list">
            {visible.map((item) => (
              <button type="button" key={item.id} className={selected?.id === item.id ? "active" : ""} onClick={() => { setSelected(item); setMessage(""); }}>
                <small><i className={item.status} />{statusLabels[item.status]} · {new Date(item.created_at).toLocaleDateString("es-ES")}</small>
                <strong>{item.question_text}</strong>
              </button>
            ))}
            {!visible.length && <p className="questions-admin-list-empty">No hay preguntas en este estado.</p>}
          </div>
        </aside>

        <section className="questions-admin-editor">
          {!selected ? (
            <div className="questions-admin-empty"><strong>Selecciona una pregunta</strong><span>Aquí podrás revisarla y preparar la respuesta pública.</span></div>
          ) : (
            <div className="questions-admin-form">
              <div className="questions-admin-editor-heading">
                <div><p className="questions-admin-eyebrow">Revisión</p><h2>{statusLabels[selected.status]}</h2></div>
                <div className="questions-admin-actions">
                  <button type="button" onClick={saveDraft} disabled={busy}>Guardar</button>
                  <button className="primary" type="button" onClick={publish} disabled={busy}>Publicar</button>
                </div>
              </div>

              <section className="questions-admin-section original">
                <div className="questions-admin-section-heading"><h3>Consulta original · privada</h3><span>No se publica</span></div>
                <blockquote>{selected.question_text}</blockquote>
                <dl>
                  <div><dt>Correo</dt><dd>{selected.contact_email || "No facilitado"}</dd></div>
                  <div><dt>Privacidad</dt><dd>{selected.privacy_accepted ? "Aceptada" : "No"}</dd></div>
                  <div><dt>Datos de salud</dt><dd>{selected.consent_health ? "Consentidos" : "No"}</dd></div>
                  <div><dt>Publicación anónima</dt><dd>{selected.consent_publish ? "Autorizada" : "No"}</dd></div>
                </dl>
              </section>

              <section className="questions-admin-section">
                <div className="questions-admin-section-heading"><h3>Versión pública</h3><span>Revisa y elimina cualquier dato identificativo</span></div>
                <label>Pregunta anonimizada<textarea rows={4} value={selected.question_public || ""} maxLength={1200} onChange={(event) => updateSelected("question_public", event.target.value)} /></label>
                <label>Respuesta<textarea rows={12} value={selected.answer || ""} maxLength={8000} onChange={(event) => updateSelected("answer", event.target.value)} placeholder="Respuesta divulgativa, comprensible y prudente…" /></label>
                <div className="questions-admin-two-cols">
                  <label>Tema<select value={selected.category} onChange={(event) => updateSelected("category", event.target.value)}>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                  <label>Ancla URL<input value={selected.anchor_slug || ""} onChange={(event) => updateSelected("anchor_slug", slugify(event.target.value))} placeholder="se-genera-al-publicar" /></label>
                </div>
                <div className="questions-admin-two-cols">
                  <label>Página relacionada<select value={selected.related_page || ""} onChange={(event) => updateSelected("related_page", event.target.value || null)}>
                    <option value="">Sin enlace relacionado</option>
                    <option value="/psicologia/">Psicología</option><option value="/ansiedad/">Ansiedad</option><option value="/duelo/">Duelo</option>
                    <option value="/neuropsicologia/">Neuropsicología</option><option value="/problemas-de-memoria/">Problemas de memoria</option>
                    <option value="/deterioro-cognitivo/">Deterioro cognitivo</option><option value="/familiares-y-cuidadores-de-personas-con-demencia/">Familiares y cuidadores</option>
                  </select></label>
                  <label>Orden destacado<input type="number" value={selected.display_order} onChange={(event) => updateSelected("display_order", Number(event.target.value))} /></label>
                </div>
              </section>

              <div className="questions-admin-footer">
                <p className="questions-admin-message" role="status">{message}</p>
                <div>
                  <button type="button" onClick={reject} disabled={busy}>Descartar</button>
                  <button className="danger" type="button" onClick={removeQuestion} disabled={busy}>Eliminar datos</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
