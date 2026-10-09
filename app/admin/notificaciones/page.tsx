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
  ["economy", "Gestión económica"],
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
        <p className="admin-notice-note">Estos avisos se consultan dentro del panel. <strong>Las notificaciones push con la aplicación cerrada todavía no están activadas.</strong> No se enviarán alertas clínicas al bloqueo del móvil.</p>
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
        <p className="admin-notice-footnote">La lectura se recuerda en este navegador. La sincronización entre dispositivos y los avisos push requieren completar el sistema de notificaciones del servidor.</p>
      </section>
      <Script src="/admin-notifications.js?v=20261009-1" strategy="afterInteractive" />
    </main>
  );
}
