import type { Metadata } from "next";
import { RESOURCE_TERMS, RESOURCE_TERMS_VERSION } from "../../resource-legal";
import "../../app/legal.css";

export const metadata: Metadata = {
  title: "Condiciones de compra de recursos digitales | Carolina Sánchez",
  description: "Condiciones aplicables a los recursos descargables adquiridos en Dememòria.",
  robots: { index: false, follow: true },
};

export default function CondicionesRecursosPage() {
  return (
    <main className="legal-page" lang="es">
      <header className="legal-wrap legal-header">
        <a className="legal-brand" href="/"><strong>Carolina Sánchez</strong><span>Psicóloga · Neuropsicóloga</span></a>
        <a className="legal-back" href="/recursos/">Volver a los recursos</a>
      </header>
      <section className="legal-hero"><div className="legal-wrap">
        <p className="legal-eyebrow">Dememòria · Información contractual</p>
        <h1>Condiciones de compra de recursos digitales</h1>
        <p>Versión {RESOURCE_TERMS_VERSION}</p>
      </div></section>
      <article className="legal-wrap legal-document">
        {RESOURCE_TERMS.map((paragraph, index) => (
          <section key={index}><p>{paragraph}</p></section>
        ))}
        <p>Consulta también la <a href="/privacidad/">política de privacidad</a>.</p>
      </article>
    </main>
  );
}
