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
      </section>

      <Script src="/clinical-access.js?v=20261020-general-entry-1" strategy="afterInteractive" />
    </main>
  );
}
