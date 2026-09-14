import Script from "next/script";
import type { Metadata } from "next";
import "./clinica.css";

export const metadata: Metadata = {
  title: "Gestión clínica | Carolina Sánchez",
  description: "Aplicación privada para la gestión clínica de Dememoria.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminClinicaPage() {
  return (
    <main className="clinic-page">
      <section id="clinic-login" className="clinic-login-shell">
        <form id="clinic-login-form" className="clinic-login-card">
          <p className="clinic-eyebrow">Dememoria · Área privada</p>
          <h1>Gestión clínica</h1>
          <p>Acceso reservado a Carolina Sánchez.</p>
          <label>
            Correo
            <input id="clinic-email" type="email" autoComplete="username" required />
          </label>
          <label>
            Contraseña
            <input id="clinic-password" type="password" autoComplete="current-password" required />
          </label>
          <p id="clinic-login-message" className="clinic-message" role="status" />
          <button className="clinic-primary clinic-login-button" type="submit">Entrar</button>
          <a className="clinic-back" href="/admin/agenda/">Volver a la agenda</a>
        </form>
      </section>

      <section id="clinic-app" className="clinic-app" hidden>
        <header className="clinic-topbar">
          <div>
            <p className="clinic-eyebrow">Dememoria</p>
            <h1>Gestión clínica</h1>
            <p id="clinic-date" className="clinic-muted" />
          </div>
          <div className="clinic-top-actions">
            <a className="clinic-secondary" href="/admin/agenda/">Agenda</a>
            <a className="clinic-secondary" href="/admin/articulos/">Artículos</a>
            <button id="clinic-refresh" className="clinic-secondary" type="button">Actualizar</button>
            <button id="clinic-logout" className="clinic-text" type="button">Cerrar sesión</button>
          </div>
        </header>

        <nav className="clinic-tabs" aria-label="Vistas de gestión clínica">
          <button id="clinic-view-today" className="active" type="button">Hoy</button>
          <button id="clinic-view-patients" type="button">Pacientes</button>
        </nav>

        <p id="clinic-status" className="clinic-message" role="status" aria-live="polite" />

        <section id="clinic-today-view" className="clinic-view">
          <div className="clinic-section-heading">
            <div>
              <p className="clinic-eyebrow">Vista rápida</p>
              <h2>Consultas de hoy</h2>
            </div>
            <a className="clinic-primary" href="/admin/agenda/">Nueva cita</a>
          </div>
          <div className="clinic-summary" aria-label="Resumen del día">
            <article><strong id="clinic-total-today">0</strong><span>Citas hoy</span></article>
            <article><strong id="clinic-confirmed-today">0</strong><span>Confirmadas</span></article>
            <article><strong id="clinic-pending-today">0</strong><span>Pendientes</span></article>
            <article><strong id="clinic-finished-today">0</strong><span>Realizadas</span></article>
          </div>
          <div id="clinic-today-list" className="clinic-list" />
        </section>

        <section id="clinic-patients-view" className="clinic-view" hidden>
          <div className="clinic-section-heading clinic-patients-heading">
            <div>
              <p className="clinic-eyebrow">Dememoria</p>
              <h2>Pacientes</h2>
            </div>
            <input id="clinic-patient-search" type="search" placeholder="Buscar por nombre, correo o teléfono" autoComplete="off" />
          </div>
          <p className="clinic-note">
            Esta primera versión vincula cada paciente con su historial de citas. Las notas clínicas se incorporarán en el siguiente bloque.
          </p>
          <div id="clinic-patient-list" className="clinic-patient-list" />
        </section>
      </section>

      <dialog id="clinic-patient-dialog" className="clinic-dialog">
        <div className="clinic-dialog-content">
          <div className="clinic-dialog-heading">
            <div>
              <p className="clinic-eyebrow">Ficha de paciente</p>
              <h2 id="clinic-patient-name">Paciente</h2>
            </div>
            <button id="clinic-patient-close" className="clinic-close" type="button" aria-label="Cerrar">×</button>
          </div>
          <div id="clinic-patient-contact" className="clinic-contact" />
          <div className="clinic-next-step">
            <strong>Continuidad clínica</strong>
            <p>La ficha clínica, Preparar sesión y Cierre asistido se añadirán aquí sin mezclar los datos con Mineuri.</p>
          </div>
          <h3>Historial de citas</h3>
          <div id="clinic-patient-history" className="clinic-history" />
        </div>
      </dialog>

      <Script src="/admin-clinica.js?v=20260914-1" strategy="afterInteractive" />
    </main>
  );
}
