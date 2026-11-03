import type { Metadata } from "next";
import Script from "next/script";
import "./access.css";

export const metadata: Metadata = {
  title: "Acceso a administración | Carolina Sánchez",
  description: "Acceso privado a la gestión clínica.",
  robots: { index: false, follow: false, nocache: true },
};

export default function ClinicalAccessPage() {
  return (
    <main className="clinical-access-page">
      <section className="clinical-access-panel">
        <div className="clinical-access-brand">
          <p className="clinical-access-kicker">Dememoria · Espacio profesional</p>
          <h1>Acceso a Mi clínica</h1>
          <p className="clinical-access-intro">
            Pacientes, agenda, facturación y recursos de tu consulta.
          </p>
          <p className="clinical-access-trust">Acceso privado · Uso profesional</p>
        </div>

        <form id="clinical-access-form" className="clinical-access-card">
          <div className="clinical-access-card-head">
            <h2>Iniciar sesión</h2>
          </div>

          <label>
            Correo
            <input id="clinical-access-email" type="email" autoComplete="username" required />
          </label>

          <label>
            Contraseña
            <input id="clinical-access-password" type="password" autoComplete="current-password" required />
          </label>

          <p id="clinical-access-message" className="clinical-access-message" role="status" aria-live="polite" />

          <button id="clinical-access-submit" type="submit">Entrar a Mi clínica</button>

          <div className="clinical-access-footer">
            <a href="/admin/agenda/">Volver a la agenda</a>
            <span>Uso profesional privado</span>
          </div>
        </form>
        <section id="clinical-mobile-wait" className="clinical-access-card" hidden aria-live="polite">
          <h2>Confirma desde tu móvil</h2>
          <p id="clinical-mobile-message">Comprueba la solicitud de acceso desde tu teléfono.</p>
          <button type="button" id="clinical-mobile-resend">Reenviar solicitud</button>
          <button type="button" id="clinical-mobile-cancel">Cancelar el acceso</button>
          <p><a href="/admin-mobile.html" target="_blank" rel="noopener noreferrer">Abrir confirmaciones en el teléfono</a></p>
        </section>
      </section>

      <Script src="/admin-mobile-auth.js?v=20261103" strategy="afterInteractive" />
      <Script src="/clinical-access.js?v=20261103-mobile-approval" strategy="afterInteractive" />
    </main>
  );
}
