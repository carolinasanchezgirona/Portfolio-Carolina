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
          <h1>Acceso al panel de administración</h1>
          <p className="clinical-access-intro">
            Área privada desde la que puedes acceder a pacientes, agenda, facturación, contenidos y recursos digitales.
          </p>
          <div className="clinical-access-trust" aria-label="Características del acceso">
            <span>Acceso restringido</span>
            <span>Datos clínicos protegidos</span>
            <span>Sesión privada</span>
          </div>
        </div>

        <form id="clinical-access-form" className="clinical-access-card">
          <div className="clinical-access-card-head">
            <p>Identificación</p>
            <h2>Entrar</h2>
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

          <button id="clinical-access-submit" type="submit">Acceder al panel de administración</button>

          <div className="clinical-access-footer">
            <a href="/admin/agenda/">Volver a la agenda</a>
            <span>Uso profesional privado</span>
          </div>
        </form>
      </section>

      <Script src="/clinical-access.js?v=20261005-single-auth-3" strategy="afterInteractive" />
    </main>
  );
}
