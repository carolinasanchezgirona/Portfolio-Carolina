import Script from "next/script";
import type { Metadata } from "next";
import AdminWorkspaceNav from "../workspace-nav";
import "./notifications.css";

export const metadata: Metadata = {
  title: "Centro de avisos | Dememoria",
  description: "Avisos privados de gestión profesional de Dememoria.",
  robots: { index: false, follow: false, nocache: true },
};

const groups = [
  ["all", "Todos"],
  ["agenda", "Agenda"],
  ["patients", "Pacientes"],
  ["clinical", "Gestión clínica"],
  ["portal", "Mi espacio"],
  ["economy", "Contabilidad"],
  ["security", "Seguridad"],
  ["system", "Sistema"],
] as const;

export default function AdminNotificationsPage() {
  return (
    <main className="admin-notice-page">
      <p id="admin-notice-loading" role="status">Comprobando acceso a los avisos…</p>
      <section id="admin-notice-app" hidden>
        <div className="admin-notice-header">
          <div>
            <p className="admin-eyebrow">Dememoria · Área profesional</p>
            <h1>Centro de avisos <span id="admin-notice-total" className="admin-notice-count" /></h1>
            <p>Información administrativa y tareas pendientes. Sin datos clínicos en las notificaciones.</p>
          </div>
          <button type="button" id="admin-notice-refresh" className="admin-notice-action">Actualizar avisos</button>
        </div>
        <AdminWorkspaceNav active="otra" />
        <section className="admin-notice-push" aria-labelledby="admin-notice-push-heading">
          <div className="admin-notice-push-top">
            <div>
              <h2 id="admin-notice-push-heading">Avisos en este dispositivo</h2>
              <p id="admin-notice-push-state" role="status" aria-live="polite">Comprobando compatibilidad…</p>
            </div>
            <div className="admin-notice-push-actions">
              <button type="button" id="admin-notice-push-enable" hidden>Activar avisos</button>
              <button type="button" id="admin-notice-push-test" hidden>Enviar prueba</button>
              <button type="button" id="admin-notice-push-disable" hidden>Desactivar</button>
              <button type="button" id="admin-notice-push-help-action" hidden>Cómo permitirlos</button>
            </div>
          </div>
          <div className="admin-notice-help" id="admin-notice-push-help">
            <details id="admin-notice-push-help-android">
              <summary>Cómo activarlos en Android</summary>
              <p>Abre <strong>Ajustes del teléfono → Aplicaciones → Chrome</strong> (o el navegador donde uses Dememoria) <strong>→ Notificaciones</strong> y permite los avisos. Si instalaste Dememoria como aplicación, revisa también sus permisos en Ajustes → Aplicaciones.</p>
              <p>En Chrome puedes revisar <strong>Configuración → Configuración de sitios → Notificaciones</strong> y permitir carolinasanchezgirona.com. Después vuelve aquí y comprueba el estado.</p>
            </details>
            <details id="admin-notice-push-help-ios">
              <summary>Cómo activarlos en iPhone o iPad</summary>
              <p>Abre la web en <strong>Safari</strong>, toca <strong>Compartir → Añadir a pantalla de inicio</strong> y entra desde el icono instalado. En esa aplicación toca «Activar avisos» y acepta el permiso.</p>
              <p>Si ya lo habías bloqueado, revisa <strong>Ajustes → Notificaciones → Dememoria</strong> (o el nombre de la aplicación instalada), permite las notificaciones y vuelve aquí.</p>
            </details>
          </div>
        </section>
        <details className="admin-notice-guidance">
          <summary>Privacidad y tipos de avisos</summary>
          <p>Las notificaciones del móvil son opcionales. <strong>En la pantalla de bloqueo solo aparece un texto genérico, sin nombres ni datos clínicos.</strong> Actualmente se envían avisos de reservas web y respuestas compartidas a ejercicios. El resto de categorías se consulta en este centro.</p>
        </details>
        <label className="admin-notice-mobile-filter" htmlFor="admin-notice-filter-select">
          Filtrar avisos por área
          <select id="admin-notice-filter-select" defaultValue="all">
            {groups.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </label>
        <nav className="admin-notice-filters" aria-label="Filtrar avisos por área">
          {groups.map(([key, label]) => (
            <button key={key} type="button" data-notice-filter={key} aria-pressed={key === "all" ? "true" : "false"}>{label}</button>
          ))}
        </nav>
        <div className="admin-notice-list-head">
          <h2>Actividad reciente</h2>
          <button type="button" id="admin-notice-mark-all" className="admin-notice-text">Marcar todos como leídos</button>
        </div>
        <p id="admin-notice-status" role="status" aria-live="polite" />
        <div id="admin-notice-list" className="admin-notice-list" />
        <p className="admin-notice-footnote">La lectura se recuerda en este navegador. Las alertas del móvil requieren permiso y solo se envían en las categorías expresamente habilitadas.</p>
      </section>
      <Script src="/admin-notifications.js?v=20261010-push-permission-ux-2" strategy="afterInteractive" />
    </main>
  );
}
