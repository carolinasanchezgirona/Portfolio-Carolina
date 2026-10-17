"use client";

import { useCallback, useEffect, useState } from "react";

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
      <div className="esapp-logo" aria-hidden="true"><span>e</span><b>s</b></div>
      <div className="esapp-brand"><strong>Entre Sesiones</strong><span>Carolina Sánchez · Psicología y Neuropsicología</span></div>
      <div className="esapp-head-actions">
        {status === "ready" && <button className="esapp-light" type="button" disabled={loggingOut} onClick={logout}>{loggingOut ? "Saliendo…" : "Cerrar sesión"}</button>}
        {!isStandalone && <button type="button" className="esapp-install" onClick={install}>Instalar app</button>}
      </div>
    </header>

    <div className="esapp-container">
      <section className="esapp-hero">
        <p className="esapp-overline">TU ESPACIO ENTRE SESIONES</p>
        <h1>{status === "ready" && data?.patient?.first_name
          ? `Hola, ${data.patient.first_name}.`
          : "Un lugar para seguir avanzando."}</h1>
        <p>Consulta los materiales que se han acordado en sesión, trabaja a tu ritmo y comparte tus respuestas cuando decidas hacerlo.</p>
        <div className="esapp-hero-actions">
          <a href={workspace} className="esapp-primary">Ir a mis ejercicios <span aria-hidden="true">↗</span></a>
          <button type="button" className="esapp-hero-quiet" onClick={reload}>Actualizar mi espacio</button>
        </div>
      </section>

      {installHint && !isStandalone && <aside className="esapp-hint" role="status">
        <strong>Instalación en el móvil:</strong> abre el menú de tu navegador y elige «Instalar aplicación» o «Añadir a pantalla de inicio». En iPhone: Compartir → «Añadir a pantalla de inicio».
        <button aria-label="Cerrar indicaciones" type="button" onClick={() => setInstallHint(false)}>×</button>
      </aside>}

      {status === "checking" && <section className="esapp-state" role="status"><h2>Comprobando tu acceso…</h2><p>Estamos verificando tu sesión actual. La app no conserva datos clínicos sin conexión.</p></section>}
      {status === "logged-out" && <section className="esapp-state">
        <div className="esapp-state-icon" aria-hidden="true">🔒</div>
        <h2>Accede con tu cuenta habitual</h2>
        <p>Utiliza el mismo correo y contraseña que ya tienes en «Mi espacio». No necesitas crear otra cuenta.</p>
        <a href="/mi-espacio/?vista=terapia" className="esapp-primary">Entrar en Mi espacio</a>
      </section>}
      {status === "error" && <section className="esapp-state" role="alert">
        <h2>No se ha podido comprobar la conexión</h2>
        <p>No hemos cargado información clínica. Revisa tu conexión e inténtalo otra vez.</p>
        <button type="button" onClick={reload} className="esapp-primary">Reintentar</button>
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
              <div className="esapp-material-left"><span className="esapp-material-icon" aria-hidden="true">✓</span>
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
