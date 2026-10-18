import type { Metadata } from "next";
import Script from "next/script";
import "./booking.css";
import "./booking-quick.css";

export const metadata: Metadata = {
  title: { absolute: "Pedir cita | Carolina Sánchez Girona" },
  description: "Reserva una sesión de psicología o neuropsicología con Carolina Sánchez Girona.",
  alternates: {
    canonical: "/cita/",
  },
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
          <p className="booking-lead">Elige el tipo de atención, consulta la disponibilidad y reserva tu sesión. No tendrás que explicar tu motivo de consulta en este formulario.</p>
          <button id="pwa-install" className="text-button" type="button" hidden>Instalar citas en el móvil</button>
          <p id="pwa-install-hint" className="form-help" hidden />
        </div>
      </section>

      <section className="editorial-wrap booking-flow" aria-labelledby="booking-heading">
        <section className="booking-panel service-panel">
          <div className="booking-panel-heading">
            <span className="booking-step" aria-hidden="true">01</span>
            <div><p className="booking-kicker">Tipo de atención</p><h2 id="booking-heading">Elige el tipo de consulta</h2></div>
          </div>

          <fieldset className="patient-type-fieldset service-type-fieldset">
            <legend>¿Qué tipo de atención necesitas?</legend>
            <div className="patient-type-options">
              <label className="patient-type-option"><input type="radio" name="service_code" value="psicologia_general_sanitaria" form="booking-form" defaultChecked /><span><strong>Psicóloga General Sanitaria</strong><small>Atención psicológica para adultos.</small></span></label>
              <label className="patient-type-option"><input type="radio" name="service_code" value="neuropsicologia" form="booking-form" /><span><strong>Neuropsicóloga</strong><small>Evaluación e intervención neuropsicológica.</small></span></label>
            </div>
          </fieldset>

          <div className="service-fixed"><div><strong id="selected-service-name">Psicología General Sanitaria</strong><small>60 minutos</small></div><b id="selected-service-price">60 €</b></div>
          <p className="form-help">Psicología General Sanitaria: 60 € por 60 minutos. Neuropsicología: 75 € por 60 minutos. Las evaluaciones neuropsicológicas completas que requieran varias sesiones, pruebas específicas o informe se valoran aparte.</p>

          <fieldset className="patient-type-fieldset">
            <legend>¿Es tu primera visita?</legend>
            <div className="patient-type-options">
              <label className="patient-type-option"><input type="radio" name="patient_type" value="new" form="booking-form" defaultChecked /><span><strong>Primera visita</strong><small>Elige un horario y deja tus datos. El encuadre y los documentos clínicos se revisan en consulta.</small></span></label>
              <label className="patient-type-option"><input type="radio" name="patient_type" value="existing" form="booking-form" /><span><strong>Paciente existente</strong><small>Selecciona esta opción si ya has acudido a consulta. Se aplicará la política de cancelación.</small></span></label>
            </div>
          </fieldset>
        </section>

        <section className="booking-panel availability-panel">
          <div className="booking-panel-heading"><span className="booking-step" aria-hidden="true">02</span><div><p className="booking-kicker">Disponibilidad</p><h2>Elige fecha y hora</h2></div></div>
          <div id="slots-status" className="booking-status" role="status" aria-live="polite">Consultando disponibilidad…</div>
          <button id="retry-availability" className="text-button" type="button" hidden>Reintentar consulta de horarios</button>
          <p className="form-help">
            ¿No aparecen horarios o necesitas ayuda con la reserva? Puedes escribir a{" "}
            <a href="mailto:contact@carolinasanchezgirona.com?subject=Consulta%20sobre%20disponibilidad">contact@carolinasanchezgirona.com</a>.
            Indica solo que deseas consultar disponibilidad, sin incluir datos de salud. El correo no confirma ninguna cita.
          </p>
          <div id="first-available" className="first-available" hidden />
          <button id="toggle-calendar" className="text-button" type="button" hidden>Elegir otra fecha</button>
          <div id="calendar-section" className="calendar-section" hidden>
            <div className="calendar-toolbar">
              <button id="calendar-prev" className="calendar-nav" type="button" aria-label="Mes anterior">←</button>
              <h3 id="calendar-title">Calendario</h3>
              <button id="calendar-next" className="calendar-nav" type="button" aria-label="Mes siguiente">→</button>
            </div>
            <div className="calendar-weekdays" aria-hidden="true"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div>
            <div id="calendar-grid" className="calendar-grid" role="grid" aria-label="Calendario de citas" />
            <div id="day-times" className="day-times" aria-live="polite" />
          </div>
        </section>

        <form id="booking-form" className="booking-panel booking-form">
          <div className="booking-panel-heading"><span className="booking-step" aria-hidden="true">03</span><div><p className="booking-kicker">Un último paso</p><h2>¿A quién confirmamos la cita?</h2></div></div>
          <input id="selected-slot" name="starts_at" type="hidden" />
          <div id="selection-summary" className="selection-summary">Todavía no has elegido un horario.</div>
          <div className="form-field"><label htmlFor="patient-name">Nombre y apellidos</label><input id="patient-name" name="patient_name" type="text" autoComplete="name" maxLength={120} required /></div>
          <div className="form-grid">
            <div className="form-field"><label htmlFor="patient-email">Correo electrónico</label><input id="patient-email" name="patient_email" type="email" autoComplete="email" maxLength={254} required /></div>
            <div className="form-field"><label htmlFor="patient-phone">Teléfono</label><input id="patient-phone" name="patient_phone" type="tel" autoComplete="tel" maxLength={30} required /></div>
          </div>
          <p className="form-help">Todos los campos mostrados son obligatorios. No incluyas información clínica ni el motivo de consulta en este formulario.</p>

          <div className="booking-privacy" role="note" aria-label="Información básica sobre protección de datos">
            <strong>Protección de datos.</strong> Responsable: Carolina Sánchez Girona (Dememoria).
            Finalidad: gestionar tu reserva y comunicarnos contigo. Base jurídica: gestión de tu solicitud de cita
            (art. 6.1.b del RGPD). Destinatarios: proveedores tecnológicos necesarios y organismos cuando exista
            obligación legal; pueden existir transferencias internacionales con garantías.
            Puedes ejercer tus derechos escribiendo a{" "}
            <a href="mailto:contact@carolinasanchezgirona.com">contact@carolinasanchezgirona.com</a>.
            Consulta la <a href="/privacidad/" target="_blank" rel="noopener noreferrer">información de privacidad completa</a>.
          </div>
          <p className="booking-terms">Al confirmar la reserva aceptas las{" "}
            <a href="#cancellation-information">condiciones de cancelación</a>.
            Si necesitas cambiar o cancelar, avisa con al menos 24 horas; los imprevistos se valorarán individualmente.
          </p>
          <details id="cancellation-information" className="privacy-details"><summary>Ver condiciones de cancelación</summary><p>Si necesitas cancelar o cambiar la cita, avisa con al menos 24 horas de antelación. Las situaciones imprevistas se valorarán individualmente.</p></details>
          <details className="privacy-details booking-first-visit-help"><summary>¿Es tu primera visita?</summary><p>Podrás revisar el encuadre y el consentimiento clínico con la profesional al comenzar la atención. Si tienes informes relevantes, puedes traerlos, pero no es necesario adjuntarlos para pedir cita.</p></details>
          <div id="form-message" className="form-message" role="status" aria-live="polite" />
          <button id="booking-submit" className="booking-submit" type="submit" disabled>Confirmar reserva <span aria-hidden="true">→</span></button>
        </form>
      </section>

      <footer className="editorial-footer booking-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>

      <Script src="/booking.js?v=20261018-captacion-1" strategy="afterInteractive" />
      <Script src="/booking-calendar.js?v=20260913-calendar-1" strategy="afterInteractive" />
      <Script src="/pwa.js" strategy="afterInteractive" />
    </main>
  );
}
