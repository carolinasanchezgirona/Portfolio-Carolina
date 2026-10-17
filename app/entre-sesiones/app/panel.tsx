"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type Appointment = { starts_at?: string; service_code?: string } | null;
type Material = {
  id: string;
  title?: string;
  status?: string;
  review_due_at?: string | null;
  patient_response_status?: "empty" | "draft" | "shared" | string;
  patient_document?: { introduction?: string; objective?: string; duration_minutes?: number | null };
};
type PortalData = {
  authenticated: boolean;
  patient?: { first_name?: string };
  materials?: Material[];
  next_appointment?: Appointment;
};
type AppStatus = "checking" | "ready" | "logged-out" | "error";
type InstallEvent = Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: string }> };

const workspace = "/mi-espacio/?vista=terapia";
const sessionEndpoint = "/api/patient-portal/session";

function readableDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function appointmentLabel(next: Appointment | undefined) {
  if (!next?.starts_at) return null;
  const date = new Date(next.starts_at);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "full", timeStyle: "short" }).format(date);
}

export default function EntreSesionesApp() {
  const [data, setData] = useState<PortalData | null>(null);
  const [status, setStatus] = useState<AppStatus>("checking");
  const [reloadCount, setReloadCount] = useState(0);
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [installHint, setInstallHint] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const reload = useCallback(() => setReloadCount(n => n + 1), []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch(sessionEndpoint, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!active) return;
        if (res.status === 401) {
          setData(null);
          setStatus("logged-out");
          return;
        }
        if (!res.ok) throw new Error("session_error");
        const incoming: PortalData = await res.json();
        if (!active) return;
        if (!incoming.authenticated) {
          setData(null);
          setStatus("logged-out");
          return;
        }
        setData(incoming);
        setStatus("ready");
      } catch {
        if (active && !controller.signal.aborted) {
          setData(null);
          setStatus("error");
        }
      }
    };
    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadCount]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Site worker is strictly network-only; never cache responses from the clinical portal.
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const installed = window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);
    setIsStandalone(installed);
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const installedHandler = () => {
      setIsStandalone(true);
      setInstallEvent(null);
    };
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  useEffect(() => {
    const visible = () => {
      if (document.visibilityState === "visible") reload();
    };
    document.addEventListener("visibilitychange", visible);
    return () => document.removeEventListener("visibilitychange", visible);
  }, [reload]);

  async function install() {
    if (!installEvent) {
      setInstallHint(true);
      return;
    }
    await installEvent.prompt();
    try {
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") setInstallEvent(null);
      else setInstallHint(true);
    } catch {
      setInstallHint(true);
    }
  }

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/patient-portal/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } finally {
      setData(null);
      setStatus("logged-out");
      setLoggingOut(false);
    }
  }

  const materials = status === "ready" && Array.isArray(data?.materials) ? data.materials : [];
  const active = materials.filter(item => item.status !== "reviewed");
  const reviewed = materials.filter(item => item.status === "reviewed");
  const shared = materials.filter(item => item.patient_response_status === "shared").length;
  const appointment = appointmentLabel(data?.next_appointment);

  return <main className="esapp">
    <header className="esapp-top">
      <div className="esapp-logo"><Image src="/entre-sesiones-icon-es.svg" alt="Entre Sesiones" width={48} height={48} priority /></div>
      <div className="esapp-brand"><strong>Entre Sesiones</strong><span>Carolina Sánchez · Psicología y neuropsicología</span></div>
      <div className="esapp-head-actions">
        {status === "ready" && <button className="esapp-light" type="button" disabled={loggingOut} onClick={logout}>{loggingOut ? "Saliendo…" : "Cerrar sesión"}</button>}
        {!isStandalone && <button type="button" className="esapp-install" onClick={install}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m-4-4 4 4 4-4M5 17v3h14v-3"/></svg><span>Instalar</span></button>}
      </div>
    </header>

    <div className="esapp-container">
      <nav className="esapp-quicknav" aria-label="Secciones del espacio personal">
        <a href="/entre-sesiones/app/" className="is-current" aria-current="page">Inicio</a>
        <a href="/mi-espacio/?vista=terapia">Ejercicios</a>
        <a href="/mi-espacio/?vista=wellness">Wellness</a>
        <a href="/mi-espacio/?vista=progreso">Progreso</a>
      </nav>
      <section className="esapp-welcome" aria-labelledby="esapp-welcome-title">
        <div className="esapp-welcome-copy">
          <p className="esapp-overline">{status === "ready" && data?.patient?.first_name
            ? `TU ESPACIO · HOLA, ${data.patient.first_name}`
            : "MI TERAPIA · ENTRE SESIONES"}</p>
          <h1 id="esapp-welcome-title">Tu trabajo<br />entre sesiones</h1>
          <p>Ejercicios, herramientas y materiales para aplicar en tu día a día, a tu ritmo.</p>
        </div>
        {status === "ready" && <div className="esapp-welcome-actions">
          <a href={workspace} className="esapp-primary">Abrir mis ejercicios <span aria-hidden="true">↗</span></a>
          <button type="button" className="esapp-quiet-action" onClick={reload} aria-label="Actualizar mis actividades">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.4 9A7.5 7.5 0 0 1 19 7M18.6 15A7.5 7.5 0 0 1 5 17"/></svg>
            Actualizar
          </button>
        </div>}
      </section>

      {status === "ready" && <section className="esapp-feature" aria-label="Materiales disponibles">
        <div className="esapp-feature-copy">
          <p className="esapp-overline">TU MATERIAL DISPONIBLE</p>
          <strong>{active.length} {active.length === 1 ? "ejercicio activo" : "ejercicios activos"}</strong>
          <span>Pequeños pasos, cambios reales. Trabaja lo que hemos acordado en consulta.</span>
        </div>
        <a className="esapp-feature-link" href={workspace}>Ver mis ejercicios <span aria-hidden="true">→</span></a>
      </section>}

      {installHint && !isStandalone && <aside className="esapp-hint" role="status">
        <strong>Instalación en el móvil:</strong> abre este enlace en Chrome (no dentro del navegador de otra aplicación). En el menú del navegador elige «Instalar aplicación» o «Añadir a pantalla de inicio». En iPhone, usa Compartir → «Añadir a pantalla de inicio».
        <button aria-label="Cerrar indicaciones" type="button" onClick={() => setInstallHint(false)}>×</button>
      </aside>}

      {status === "checking" && <section className="esapp-access esapp-access-loading" role="status" aria-live="polite">
        <span className="esapp-loader" aria-hidden="true" />
        <div><h2>Comprobando el acceso</h2><p>Un momento, estamos verificando tu sesión.</p></div>
      </section>}
      {status === "logged-out" && <section className="esapp-access" aria-labelledby="esapp-login-title">
        <span className="esapp-access-icon" aria-hidden="true">
          <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="10" width="14" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14.5v2.5"/>
          </svg>
        </span>
        <div className="esapp-access-copy">
          <h2 id="esapp-login-title">Accede con tu cuenta</h2>
          <p>El mismo correo y contraseña que utilizas en «Mi espacio». Sin registros nuevos.</p>
        </div>
        <a href={workspace} className="esapp-primary esapp-login-button">Entrar <span aria-hidden="true">→</span></a>
      </section>}
      {status === "error" && <section className="esapp-access" role="alert">
        <span className="esapp-access-icon" aria-hidden="true">!</span>
        <div className="esapp-access-copy"><h2>No se ha podido conectar</h2><p>No hemos cargado ninguna información clínica. Comprueba tu conexión.</p></div>
        <button type="button" className="esapp-primary esapp-login-button" onClick={reload}>Reintentar</button>
      </section>}

      {status === "ready" && <div className="esapp-columns">
        <div className="esapp-maincol">
          <section className="esapp-stats" aria-label="Resumen de mis materiales">
            <div><small>Ejercicios activos</small><strong>{active.length}</strong></div>
            <div><small>Respuestas compartidas</small><strong>{shared}</strong></div>
            <div><small>Material revisado</small><strong>{reviewed.length}</strong></div>
          </section>

          <section className="esapp-panel">
            <div className="esapp-sectionhead"><div><p className="esapp-overline">TRABAJO TERAPÉUTICO</p><h2>Mis materiales</h2></div><span>{active.length} activos</span></div>
            {!active.length && <div className="esapp-empty">Ahora mismo no tienes actividades pendientes. Si tu profesional te asigna nuevas tareas, aparecerán aquí.</div>}
            {active.map(item => <article className="esapp-material" key={item.id}>
              <div className="esapp-material-left"><span className="esapp-material-icon" aria-hidden="true"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3.5h8l4 4V21H5V3.5h2Z"/><path d="M15 3.5V8h4M8.5 12h7M8.5 16h7"/></svg></span>
                <div><h3>{item.title || "Actividad"}</h3>
                <p>{item.patient_document?.objective || item.patient_document?.introduction || "Actividad acordada en sesión"}</p>
                {item.review_due_at && <small>Revisión prevista: {readableDate(item.review_due_at)}</small>}</div>
              </div>
              <span className={"esapp-status " + (item.patient_response_status === "shared" ? "shared" : item.patient_response_status === "draft" ? "draft" : "")}>
                {item.patient_response_status === "shared" ? "Compartida" : item.patient_response_status === "draft" ? "Borrador" : "Por trabajar"}
              </span>
            </article>)}
            <a className="esapp-inline-link" href={workspace}>Abrir ejercicios, guardar borradores y compartir respuestas →</a>
          </section>

          {!!reviewed.length && <section className="esapp-panel">
            <div className="esapp-sectionhead"><div><p className="esapp-overline">TU RECORRIDO</p><h2>Ya revisado en consulta</h2></div></div>
            {reviewed.map(item => <div className="esapp-reviewed-row" key={item.id}><span aria-hidden="true">✓</span>{item.title || "Actividad"}</div>)}
          </section>}
        </div>

        <aside className="esapp-aside">
          <section className="esapp-note">
            <p className="esapp-overline">TU PRÓXIMO ENCUENTRO</p>
            <h2>{appointment ? "Próxima sesión" : "Tu agenda"}</h2>
            <p>{appointment || "Cuando haya una cita confirmada, podrás consultar aquí su fecha."}</p>
            <a href="/mi-espacio/?vista=panel">Ver mi espacio →</a>
          </section>
          <section className="esapp-smallcard"><h3>A tu ritmo</h3><p>Puedes guardar tus respuestas como borrador. Solo se comparten con tu profesional cuando eliges la opción de compartir.</p></section>
          <section className="esapp-smallcard"><h3>Privacidad</h3><p>Los datos se consultan mediante el portal seguro de tu consulta. No se guardan expedientes clínicos en la memoria sin conexión de esta aplicación.</p></section>
        </aside>
      </div>}

      <footer className="esapp-footer"><p>Entre Sesiones es una herramienta complementaria a la atención profesional. No es un canal de urgencias.</p><a href="/admin/clinica/">Acceso profesional</a></footer>
    </div>
  </main>;
}
