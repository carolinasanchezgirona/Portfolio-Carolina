import Script from "next/script";
import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Mi agenda | Carolina Sánchez",
  description: "Agenda profesional privada de Carolina Sánchez.",
  manifest: "/admin-manifest.webmanifest",
  icons: { icon: "/pwa-icon.svg", apple: "/pwa-icon.svg" },
  appleWebApp: { capable: true, title: "Mi agenda", statusBarStyle: "default" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminAgendaPage() {
  return (
    <main className="admin-page">
      <section id="admin-login" className="admin-login-shell">
        <form id="admin-login-form" className="admin-login-card">
          <p className="admin-eyebrow">Área privada</p>
          <h1>Agenda profesional</h1>
          <p>Acceso reservado a Carolina Sánchez.</p>

          <label>
            Correo
            <input id="admin-email" type="email" autoComplete="username" required />
          </label>
          <label>
            Contraseña
            <input id="admin-password" type="password" autoComplete="current-password" required />
          </label>
          <p id="admin-login-message" className="admin-message" role="status" />
          <button type="submit" className="admin-primary">Entrar</button>
          <button id="admin-forgot-password" type="button" className="admin-text">He olvidado mi contraseña</button>
          <a className="admin-back-link" href="/">Volver a la web</a>
        </form>
      </section>

      <section id="admin-app" className="admin-app" hidden>
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">Administración</p>
            <h1>Agenda de pacientes</h1>
          </div>
          <div className="admin-top-actions">
            <button id="admin-new" className="admin-primary" type="button">Nueva cita</button>
            <button id="admin-block" className="admin-secondary" type="button">Bloquear horario</button>
            <button id="pwa-install" className="admin-secondary" type="button" hidden>Instalar app</button>
            <button id="admin-print" className="admin-secondary" type="button">Imprimir semana</button>
            <button id="admin-access" className="admin-secondary" type="button">Acceso</button>
            <button id="admin-logout" className="admin-text" type="button">Cerrar sesión</button>
          </div>
        </header>

        <p id="pwa-install-hint" className="admin-muted" hidden />

        <nav className="admin-view-tabs" aria-label="Vistas de la agenda">
          <button id="view-today" className="active" type="button">Hoy</button>
          <button id="view-week" type="button">Semana</button>
          <button id="view-patients" type="button">Pacientes</button>
        </nav>

        <section id="today-view" className="admin-view">
          <div className="today-heading">
            <div><p className="admin-eyebrow">Vista rápida</p><h2 id="today-title">Hoy</h2></div>
            <button id="today-new" className="admin-primary" type="button">Añadir cita</button>
          </div>
          <div id="today-summary" className="today-summary" />
          <div id="today-list" className="today-list" />
        </section>

        <section id="week-view" className="admin-view" hidden>
        <section className="admin-toolbar" aria-label="Navegación de agenda">
          <div className="admin-week-nav">
            <button id="week-prev" type="button" aria-label="Semana anterior">←</button>
            <button id="week-today" type="button">Hoy</button>
            <button id="week-next" type="button" aria-label="Semana siguiente">→</button>
          </div>
          <div>
            <strong id="week-title">Semana</strong>
            <p id="week-subtitle" className="admin-muted" />
          </div>
          <div className="admin-legend" aria-label="Leyenda">
            <span><i className="dot dot-psych" /> Psicología</span>
            <span><i className="dot dot-neuro" /> Neuropsicología</span>
          </div>
        </section>

        <section className="admin-summary" aria-label="Resumen semanal">
          <article><strong id="summary-total">0</strong><span>Citas</span></article>
          <article><strong id="summary-confirmed">0</strong><span>Confirmadas</span></article>
          <article><strong id="summary-pending">0</strong><span>Pendientes</span></article>
          <article><strong id="summary-cancelled">0</strong><span>Canceladas</span></article>
        </section>

        <p id="admin-status" className="admin-message" role="status" aria-live="polite" />
        <section id="week-calendar" className="week-calendar" aria-label="Calendario semanal" />
        </section>

        <section id="patients-view" className="admin-view" hidden>
          <div className="patients-heading">
            <div><p className="admin-eyebrow">Historial administrativo</p><h2>Pacientes y citas</h2></div>
            <input id="patient-search" type="search" placeholder="Buscar por nombre, correo o teléfono" autoComplete="off" />
          </div>
          <p className="admin-note">Se muestran únicamente datos de contacto y citas. No se incluyen notas ni información clínica.</p>
          <p id="patient-search-status" className="admin-message" role="status" />
          <div id="patient-results" className="patient-results" />
        </section>
      </section>

      <dialog id="appointment-dialog" className="appointment-dialog">
        <form id="appointment-form" method="dialog">
          <div className="dialog-heading">
            <div>
              <p className="admin-eyebrow">Cita</p>
              <h2 id="dialog-title">Nueva cita</h2>
            </div>
            <button id="dialog-close" className="dialog-close" type="button" aria-label="Cerrar">×</button>
          </div>

          <input id="appointment-id" type="hidden" />

          <div className="form-grid two-cols">
            <label>
              Fecha
              <input id="appointment-date" type="date" required />
            </label>
            <label>
              Hora
              <input id="appointment-time" type="time" step="1800" required />
            </label>
          </div>

          <label>
            Nombre del paciente
            <input id="appointment-name" type="text" maxLength={120} required />
          </label>

          <div className="form-grid two-cols">
            <label>
              Correo
              <input id="appointment-email" type="email" maxLength={254} />
            </label>
            <label>
              Teléfono
              <input id="appointment-phone" type="tel" maxLength={30} />
            </label>
          </div>

          <div className="form-grid two-cols">
            <label>
              Servicio
              <select id="appointment-service" required>
                <option value="psicologia_general_sanitaria">Psicología General Sanitaria</option>
                <option value="neuropsicologia">Neuropsicología</option>
              </select>
            </label>
            <label>
              Estado
              <select id="appointment-status" required>
                <option value="confirmed">Confirmada</option>
                <option value="pending">Pendiente</option>
                <option value="completed">Realizada</option>
                <option value="no_show">No presentado</option>
                <option value="cancelled">Cancelada</option>
                <option value="rescheduled">Reprogramada</option>
              </select>
            </label>
          </div>

          <div className="form-grid two-cols">
            <label>
              Tipo de paciente
              <select id="appointment-patient-type">
                <option value="existing">Paciente existente</option>
                <option value="new">Primera visita</option>
              </select>
            </label>
            <label>
              Precio (€)
              <input id="appointment-price" type="number" min="0" step="0.01" defaultValue="60" />
            </label>
          </div>

          <p className="admin-note">Este formulario administrativo no registra consentimiento clínico. Las citas creadas aquí quedan marcadas como creadas por la profesional.</p>
          <p id="appointment-message" className="admin-message" role="status" />

          <div className="dialog-actions">
            <button id="appointment-close" className="admin-secondary" type="button">Cerrar sin guardar</button>
            <button id="appointment-cancel-booking" className="admin-danger" type="button" hidden>Cancelar cita</button>
            <button id="appointment-save" className="admin-primary" type="submit">Crear cita</button>
          </div>
        </form>
      </dialog>

      <dialog id="block-dialog" className="appointment-dialog">
        <form id="block-form">
          <div className="dialog-heading">
            <div><p className="admin-eyebrow">Disponibilidad</p><h2>Bloquear horario</h2></div>
            <button id="block-close" className="dialog-close" type="button" aria-label="Cerrar">×</button>
          </div>
          <div className="form-grid two-cols">
            <label>Fecha<input id="block-date" type="date" required /></label>
            <label>Motivo<input id="block-reason" type="text" maxLength={120} placeholder="Personal, reunión…" /></label>
          </div>
          <div className="form-grid two-cols">
            <label>Desde<input id="block-start" type="time" step="1800" required /></label>
            <label>Hasta<input id="block-end" type="time" step="1800" required /></label>
          </div>
          <p className="admin-note">La franja dejará de aparecer inmediatamente en la reserva pública. No modifica citas ya existentes.</p>
          <p id="block-message" className="admin-message" role="status" />
          <div className="dialog-actions">
            <button id="block-cancel" className="admin-secondary" type="button">Cerrar</button>
            <button className="admin-primary" type="submit">Bloquear</button>
          </div>
        </form>
      </dialog>

      <dialog id="access-dialog" className="appointment-dialog">
        <form id="access-form">
          <div className="dialog-heading">
            <div>
              <p className="admin-eyebrow">Seguridad</p>
              <h2>Correo y contraseña</h2>
            </div>
            <button id="access-close" className="dialog-close" type="button" aria-label="Cerrar">×</button>
          </div>

          <p className="admin-note">Puedes cambiar el correo, la contraseña o ambos. La contraseña no se guarda en esta web.</p>

          <label>
            Correo actual
            <input id="access-current-email" type="email" readOnly />
          </label>

          <label>
            Nuevo correo
            <input id="access-new-email" type="email" autoComplete="email" placeholder="Dejar vacío si no quieres cambiarlo" />
          </label>

          <div className="form-grid two-cols">
            <label>
              Nueva contraseña
              <input id="access-new-password" type="password" autoComplete="new-password" minLength={8} placeholder="Mínimo 8 caracteres" />
            </label>
            <label>
              Repetir contraseña
              <input id="access-repeat-password" type="password" autoComplete="new-password" minLength={8} />
            </label>
          </div>

          <p id="access-message" className="admin-message" role="status" />

          <div className="dialog-actions">
            <button id="access-cancel" className="admin-secondary" type="button">Cancelar</button>
            <button className="admin-primary" type="submit">Guardar cambios</button>
          </div>
        </form>
      </dialog>

      <Script src="/admin-agenda-v3.js?v=20260913-app" strategy="afterInteractive" />
      <Script src="/pwa.js?v=20260913-admin" strategy="afterInteractive" />
    </main>
  );
}
