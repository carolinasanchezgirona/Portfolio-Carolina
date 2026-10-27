import type { ReactNode } from "react";
import LegalLinks from "./legal-links";
import "../legal.css";

export default function LegalDocument({ title, children }: { title: string; children: ReactNode }) {
  return <main className="legal-page" lang="es">
    <header className="legal-wrap legal-header">
      <a className="legal-brand" href="/"><strong>Carolina Sánchez</strong><span>Psicóloga · Neuropsicóloga</span></a>
      <a className="legal-back" href="/">Volver a la web</a>
    </header>
    <section className="legal-hero"><div className="legal-wrap">
      <p className="legal-eyebrow">Carolina Sánchez Girona · Dememoria</p>
      <h1>{title}</h1>
      <p>Actualizado el 27 de octubre de 2026.</p>
    </div></section>
    <article className="legal-wrap legal-document">{children}</article>
    <footer className="legal-footer"><div className="legal-wrap">
      <LegalLinks /><p>© 2026 Carolina Sánchez Girona · Dememoria</p>
    </div></footer>
  </main>;
}
