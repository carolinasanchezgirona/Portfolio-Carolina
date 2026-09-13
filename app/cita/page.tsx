import type { Metadata } from "next";
import Script from "next/script";
import "./booking.css";

export const metadata: Metadata = {
  title: "Pedir cita | Carolina Sánchez Girona",
  description: "Reserva una sesión de psicología o neuropsicología con Carolina Sánchez Girona.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/pwa-icon.svg",
    apple: "/pwa-icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Citas Carolina",
    statusBarStyle: "default",
  },
};

export default function BookingPage() {
  return (
    <main className="editorial-site booking-page">
      <header className="site-header booking-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación de cita">
          <a href="/">Volver a la web</a>
        </nav>
      </header>

      <section className="booking-intro">
        <div className="editorial-wrap booking-intro-inner">
          <p className="editorial-eyebrow">Consulta profesional · Reserva online</p>
          <h1>Pedir cita</h1>
          <p className="booking-lead">
            Consulta la primera cita disponible o abre el calendario para elegir otra fecha.
          </p>
          <button id="pwa-install" className="text-button" type="button" hidden>
            Instalar citas en el móvil
          </button>
          <p id="pwa-install-hint" className="form-help" hidden />
        </div>
      </section>

      <section className="editorial-wrap booking-flow" aria-labelledby="booking-heading">
        <section className="booking-panel service-panel">
          <div className="booking-panel-heading">
            <span className="booking-step" aria-hidden="true">01</span>
            <div>
              <p className="booking-kicker">Tipo de atención</p>
              <h2 id="booking-heading">Elige el tipo de consulta</h2>
            </div>
          </div>

          <fieldset className="patient-type-fieldset service-type-fieldset">
            <legend>¿Qué tipo de atención necesitas?</legend>
            <div className="patient-type-options">
              <label className="patient-type-option">
                <input type="radio" name="service_code" value="psicologia_general_sanitaria" form="booking-form" defaultChecked />
                <span>
                  <strong>Psicóloga General Sanitaria</strong>
                  <small>Atención psicológica para adultos.</small>
                </span>
              </label>
              <label className="patient-type-option">
                <input type="radio" name="service_code" value="neuropsicologia" form="booking-form" />
                <span>
                  <strong>Neuropsicóloga</strong>
                  <small>Evaluación e intervención neuropsicológica.</small>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="service-fixed">
            <div>
              <strong id="selected-service-name">Psicología General Sanitaria</strong>
              <small>60 minutos</small>
            </div>
            <b>60 €</b>
          </div>

          <fieldset className="patient-type-fieldset">
            <legend>¿Es tu primera visita?</legend>
            <div className="patient-type-options">
              <label className="patient-type-option">
                <input type="radio" name="patient_type" value="new" form="booking-form" defaultChecked />
                <span>
                  <strong>Primera visita</strong>
                  <small>Completarás privacidad, consentimiento y firma electrónica.</small>
                </span>
              </label>
              <label className="patient-type-option">
                <input type="radio" name="patient_type" value="existing" form="booking-form" />
                <span>
                  <strong>Paciente existente</strong>
                  <small>También completarás privacidad, consentimiento, cancelación y firma electrónica.</small>
                </span>
              </label>
            </div>
          </fieldset>
        </section>

        <section className="booking-panel availability-panel">
          <div className="booking-panel-heading">
            <span className="booking-step" aria-hidden="true">02</span>
            <div>
              <p className="booking-kicker">Disponibilidad</p>
              <h2>Elige fecha y hora</h2>
            </div>
          </div>

          <div id="slots-status" className="booking-status" role="status" aria-live="polite">
            Consultando disponibilidad…
          </div>
          <div id="first-available" className="first-available" hidden />
          <button id="toggle-calendar" className="text-button" type="button" hidden>
            Elegir otra fecha
          </button>

          <div id="calendar-section" className="calendar-section" hidden>
            <div className="calendar-toolbar">
              <button id="calendar-prev" className="calendar-nav" type="button" aria-label="Mes anterior">←</button>
              <h3 id="calendar-title" />
              <button id="calendar-next" className="calendar-nav" type="button" aria-label="Mes siguiente">→</button>
            </div>
            <div className="calendar-weekdays" aria-hidden="true">
              <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>
            <div id="calendar-grid" className="calendar-grid" role="grid" aria-label="Calendario de citas" />
            <div id="day-times" className="day-times" aria-live="polite" />
          </div>
        </section>

        <form id="booking-form" className="booking-panel booking-form">
          <div className="booking-panel-heading">
            <span className="booking-step" aria-hidden="true">03</span>
            <div>
              <p className="booking-kicker">Datos y aceptación</p>
              <h2>Completa la reserva</h2>
            </div>
          </div>

          <input id="selected-slot" name="starts_at" type="hidden" />
          <div id="selection-summary" className="selection-summary">Todavía no has elegido un horario.</div>

          <div className="form-field">
            <label htmlFor="patient-name">Nombre y apellidos</label>
            <input id="patient-name" name="patient_name" type="text" autoComplete="name" maxLength={120} required />
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="patient-email">Correo electrónico</label>
              <input id="patient-email" name="patient_email" type="email" autoComplete="email" maxLength={254} required />
            </div>
            <div className="form-field">
              <label htmlFor="patient-phone">Teléfono</label>
              <input id="patient-phone" name="patient_phone" type="tel" autoComplete="tel" maxLength={30} required />
            </div>
          </div>
          <p className="form-help">Todos los campos mostrados son obligatorios. No incluyas información clínica ni el motivo de consulta en este formulario.</p>

          <div id="new-patient-documents" className="acceptances">
            <div className="first-visit-note" role="note">
              <strong>Para la primera visita</strong>
              <p>
                Si dispones de informes o documentación previa que pueda ser relevante para la atención, puedes traerla a la sesión: informes de psicología o psiquiatría, valoraciones médicas, pruebas, informes hospitalarios o información sobre tratamientos actuales. No es necesario aportar documentación que no consideres relacionada con el motivo de consulta ni enviarla a través de este formulario.
              </p>
            </div>
            <label className="privacy-check">
              <input name="privacy_acknowledged" type="checkbox" required />
              <span>
                Declaro haber leído la <a href="/privacidad/" target="_blank" rel="noopener">Política de privacidad y protección de datos</a>.
              </span>
            </label>
            <label className="privacy-check">
              <input name="informed_consent_accepted" type="checkbox" required />
              <span>
                He leído y acepto el <a id="consent-link" href="/consentimiento-psicologico/" target="_blank" rel="noopener">consentimiento informado para intervención psicológica</a>.
              </span>
            </label>
          </div>

          <div className="acceptances cancellation-acceptance">
            <label className="privacy-check">
              <input name="cancellation_accepted" type="checkbox" required />
              <span>
                He leído y acepto la <a href="#cancellation-information">política de cancelación</a>. Si necesito cambiar o cancelar la cita, avisaré con al menos 24 horas de antelación.
              </span>
            </label>
          </div>

          <div id="new-patient-signature" className="form-field signature-field">
            <label htmlFor="signer-name">Firma electrónica · escribe tu nombre y apellidos</label>
            <input id="signer-name" name="signer_name" type="text" autoComplete="name" maxLength={120} required />
            <p className="form-help">Debe coincidir exactamente con el campo «Nombre y apellidos». Al confirmar, esta firma queda asociada a la fecha, la cita y los documentos aceptados.</p>
          </div>

          <div id="new-patient-information" className="legal-information">
            <details id="privacy-information" className="privacy-details">
              <summary>Información de privacidad</summary>
              <p>
                Puedes consultar la <a href="/privacidad/" target="_blank" rel="noopener">Política de privacidad y protección de datos completa</a> antes de confirmar la reserva.
              </p>
            </details>
            <details id="consent-information" className="privacy-details">
              <summary>Consentimiento informado</summary>
              <p id="consent-description">
                Consulta el <a href="/consentimiento-psicologico/" target="_blank" rel="noopener">consentimiento informado para intervención psicológica</a>.
              </p>
            </details>
          </div>

          <details id="cancellation-information" className="privacy-details">
            <summary>Cancelaciones y cambios</summary>
            <p>
              Si necesitas cancelar o cambiar la cita, avisa con al menos 24 horas de antelación. Las situaciones imprevistas se valorarán individualmente.
            </p>
          </details>

          <div id="form-message" className="form-message" role="status" aria-live="polite" />
          <button id="booking-submit" className="booking-submit" type="submit" disabled>
            Confirmar reserva <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>

      <footer className="editorial-footer booking-footer">
        <div className="editorial-wrap editorial-footer-inner">
          <div>
            <p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p>
            <p>Dememoria · Consulta de Psicología y Neuropsicología</p>
          </div>
          <div>
            <p>Arenys de Mar · Atención online</p>
            <p>© 2026 Carolina Sánchez Girona</p>
          </div>
        </div>
      </footer>

      <Script src="/booking.js" strategy="afterInteractive" />
      <Script src="/booking-calendar.js?v=20260913-calendar-1" strategy="afterInteractive" />
      <Script src="/pwa.js" strategy="afterInteractive" />
    </main>
  );
}
