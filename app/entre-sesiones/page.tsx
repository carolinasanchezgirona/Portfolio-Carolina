import type { Metadata } from "next";
import Script from "next/script";
import "./entre-sesiones.css";

export const metadata: Metadata = {
  title: "Entre Sesiones",
  description: "Espacio privado para consultar el material terapéutico acordado en sesión.",
  robots: { index: false, follow: false, nocache: true },
};

export default function EntreSesionesPage() {
  return (
    <main className="between-page">
      <section className="between-hero">
        <div className="between-wrap">
          <p className="between-eyebrow">Carolina Sánchez · Área privada</p>
          <h1>Entre Sesiones</h1>
          <p className="between-lead">
            Aquí encontrarás únicamente los ejercicios y materiales que hemos acordado trabajar.
            No necesitas completar todo lo que aparezca: sigue las indicaciones dadas en sesión.
          </p>
        </div>
      </section>

      <section className="between-section">
        <div className="between-wrap">
          <div id="between-loading" className="between-state" role="status" aria-live="polite">
            <span className="between-loader" aria-hidden="true" />
            <div>
              <strong>Preparando tu espacio…</strong>
              <p>Estamos comprobando el enlace de acceso.</p>
            </div>
          </div>

          <div id="between-empty-access" className="between-state between-state-card" hidden>
            <div>
              <p className="between-kicker">Acceso personal</p>
              <h2>Abre el enlace que has recibido por correo</h2>
              <p>
                Por privacidad, este espacio no permite buscar pacientes ni introducir nombres.
                Si tu enlace ha caducado, solicita uno nuevo.
              </p>
            </div>
          </div>

          <div id="between-error" className="between-state between-state-card between-error" hidden>
            <div>
              <p className="between-kicker">No disponible</p>
              <h2 id="between-error-title">No hemos podido abrir tu material</h2>
              <p id="between-error-copy">Solicita un nuevo enlace a tu profesional.</p>
            </div>
          </div>

          <section id="between-portal" className="between-portal" hidden aria-labelledby="between-portal-title">
            <header className="between-portal-head">
              <div>
                <p className="between-kicker">Tu espacio de trabajo</p>
                <h2 id="between-portal-title">Material indicado</h2>
                <p>
                  Realiza solo los ejercicios que te haya indicado Carolina. Puedes volver a este enlace
                  mientras siga vigente.
                </p>
              </div>
              <div className="between-access-chip" aria-label="Acceso protegido">
                <span aria-hidden="true">●</span>
                Acceso protegido
              </div>
            </header>

            <div id="between-current" className="between-list" aria-live="polite" />

            <section id="between-reviewed-section" className="between-reviewed" hidden>
              <button
                id="between-reviewed-toggle"
                className="between-reviewed-toggle"
                type="button"
                aria-expanded="false"
                aria-controls="between-reviewed"
              >
                Ver material ya revisado
                <span aria-hidden="true">⌄</span>
              </button>
              <div id="between-reviewed" className="between-list between-list-reviewed" hidden />
            </section>

            <aside className="between-note">
              <strong>Importante</strong>
              <p>
                Este espacio complementa el trabajo realizado en consulta y no sustituye una sesión clínica.
                Si un ejercicio te genera un malestar intenso o dudas relevantes, puedes detenerlo y comentarlo
                en la próxima sesión.
              </p>
            </aside>
          </section>
        </div>
      </section>

      <Script src="/entre-sesiones.js?v=20261005-1" strategy="afterInteractive" />
    </main>
  );
}
