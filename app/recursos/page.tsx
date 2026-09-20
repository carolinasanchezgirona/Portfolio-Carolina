import type { Metadata } from "next";
import ResourcesCatalog from "./resources-catalog";

export const metadata: Metadata = {
  title: "Recursos psicológicos y neuropsicológicos",
  description:
    "Recursos prácticos de psicología y neuropsicología para trabajar ansiedad, rumiación, sueño y funciones cognitivas. Materiales elaborados desde la práctica clínica.",
  alternates: { canonical: "/recursos/" },
  openGraph: {
    title: "Recursos psicológicos y neuropsicológicos | Carolina Sánchez",
    description:
      "Cuadernos y materiales prácticos de psicología y neuropsicología para pacientes, familias y profesionales.",
    url: "https://carolinasanchezgirona.com/recursos/",
    type: "website",
  },
};

export default function RecursosPage() {
  return (
    <main className="resources-page">
      <section className="resources-hero">
        <div className="editorial-wrap resources-hero-grid">
          <div>
            <p className="editorial-eyebrow">Recursos · Psicología y neuropsicología</p>
            <h1>Materiales para comprender, practicar y avanzar entre sesiones.</h1>
            <p className="resources-lead">
              Cuadernos y herramientas prácticas elaborados desde la práctica clínica, con explicaciones claras,
              ejercicios estructurados y una finalidad concreta. Sin sustituir una evaluación o intervención
              profesional cuando sea necesaria.
            </p>
          </div>
          <aside className="resources-hero-note">
            <span>Biblioteca digital</span>
            <p>
              Los materiales se incorporarán progresivamente. Cuando un recurso esté publicado, podrá adquirirse
              mediante pago seguro y descargarse después de la confirmación.
            </p>
          </aside>
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="destacados-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head resources-heading">
            <p className="editorial-section-eyebrow">Recursos</p>
            <h2 id="destacados-title">Psicología aplicada y neuropsicología.</h2>
            <p>
              La biblioteca crecerá priorizando calidad, utilidad clínica y actualización, sin convertir la web en un
              catálogo masivo de materiales.
            </p>
          </div>
          <ResourcesCatalog />
        </div>
      </section>

      <section className="resources-audiences" aria-labelledby="audiences-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head resources-heading">
            <p className="editorial-section-eyebrow">Biblioteca en crecimiento</p>
            <h2 id="audiences-title">Recursos según para quién estén pensados.</h2>
          </div>
          <div className="resources-audience-grid">
            <article><span>01</span><h3>Uso personal</h3><p>Cuadernos de trabajo sobre ansiedad, sueño, duelo, autoestima y regulación emocional.</p></article>
            <article><span>02</span><h3>Neuropsicología</h3><p>Materiales de memoria, atención, funciones ejecutivas y estimulación cognitiva para el día a día.</p></article>
            <article><span>03</span><h3>Profesionales</h3><p>Psicoeducación, registros y hojas de trabajo preparadas para integrar en la práctica clínica.</p></article>
          </div>
        </div>
      </section>

      <section className="editorial-section resources-free" aria-labelledby="free-title">
        <div className="editorial-wrap resources-free-grid">
          <div><p className="editorial-section-eyebrow">También habrá recursos gratuitos</p><h2 id="free-title">Probar antes de comprar.</h2></div>
          <div>
            <p>La biblioteca incluirá materiales breves de acceso libre. Servirán como herramientas independientes y como muestra del enfoque de los cuadernos completos.</p>
            <a className="editorial-btn editorial-btn-secondary" href="/articulos/">Ver artículos</a>
          </div>
        </div>
      </section>

      <section className="editorial-section resources-clinical-note">
        <div className="editorial-wrap">
          <p>Estos materiales tienen finalidad psicoeducativa y de apoyo. No constituyen diagnóstico, tratamiento ni sustituyen una valoración psicológica o neuropsicológica individualizada.</p>
        </div>
      </section>
    </main>
  );
}
