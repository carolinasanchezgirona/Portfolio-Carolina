import type { Metadata } from "next";
import Image from "next/image";
import { commerceConfigured, getPublishedResources } from "../lib/commerce-server";

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

export const revalidate = 60;

function euro(cents: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

const plannedResources = [
  {
    eyebrow: "Ansiedad y rumiación",
    title: "Salir del bucle",
    description:
      "Cuaderno práctico para identificar patrones de rumiación, reducir el enganche con los pensamientos y recuperar margen de acción.",
    meta: "Cuaderno descargable",
    price: "12,90 €",
    tone: "teal",
  },
  {
    eyebrow: "Psicología",
    title: "Ansiedad: comprender y regular",
    description:
      "Psicoeducación y ejercicios para reconocer el ciclo de la ansiedad, trabajar la evitación y practicar estrategias de regulación.",
    meta: "Guía + ejercicios",
    price: "14,90 €",
    tone: "coral",
  },
  {
    eyebrow: "Neuropsicología",
    title: "Memoria y atención en casa",
    description:
      "Propuesta estructurada de actividades para estimular procesos atencionales y mnésicos en la vida cotidiana.",
    meta: "Programa descargable",
    price: "19,90 €",
    tone: "indigo",
  },
];

export default async function RecursosPage() {
  const resources = await getPublishedResources();
  const checkoutReady = commerceConfigured();

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
            <span>{resources.length ? "Biblioteca digital" : "Próxima apertura"}</span>
            <p>
              {resources.length
                ? "Los materiales publicados pueden adquirirse mediante pago seguro y descargarse después de la confirmación."
                : "Los primeros materiales están en preparación y se incorporarán progresivamente a esta sección."}
            </p>
          </aside>
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="destacados-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head resources-heading">
            <p className="editorial-section-eyebrow">{resources.length ? "Recursos disponibles" : "Primeros recursos"}</p>
            <h2 id="destacados-title">{resources.length ? "Biblioteca de materiales." : "Tres líneas para empezar."}</h2>
            <p>
              Psicología aplicada, neuropsicología y materiales de uso profesional. La biblioteca crecerá priorizando
              calidad, utilidad clínica y actualización.
            </p>
          </div>

          <div className="resources-grid">
            {resources.length
              ? resources.map((resource) => (
                  <article key={resource.id} className="resource-card">
                    {resource.cover_url ? (
                      <div className="resource-card-cover">
                        <Image
                          src={resource.cover_url}
                          alt={resource.cover_alt || resource.title}
                          width={560}
                          height={700}
                          sizes="(max-width: 900px) 100vw, 33vw"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="resource-card-accent" />
                    )}
                    <p className="resource-card-eyebrow">
                      {resource.category === "neuropsicologia"
                        ? "Neuropsicología"
                        : resource.category === "profesionales"
                          ? "Profesionales"
                          : "Psicología"}
                    </p>
                    <h2>{resource.title}</h2>
                    {resource.subtitle ? <p className="resource-card-subtitle">{resource.subtitle}</p> : null}
                    <p className="resource-card-copy">{resource.description}</p>
                    <div className="resource-card-meta">
                      <span>{resource.format_label}</span>
                      <strong>{euro(resource.price_cents)}</strong>
                    </div>
                    {checkoutReady ? (
                      <form action="/api/recursos/checkout/" method="post" className="resource-buy-form">
                        <input type="hidden" name="resourceId" value={resource.id} />
                        <button className="editorial-btn editorial-btn-primary" type="submit">
                          Comprar y descargar
                        </button>
                      </form>
                    ) : (
                      <span className="resource-card-status">Compra temporalmente no disponible</span>
                    )}
                  </article>
                ))
              : plannedResources.map((resource) => (
                  <article key={resource.title} className={`resource-card resource-card-${resource.tone}`}>
                    <div className="resource-card-accent" />
                    <p className="resource-card-eyebrow">{resource.eyebrow}</p>
                    <h2>{resource.title}</h2>
                    <p className="resource-card-copy">{resource.description}</p>
                    <div className="resource-card-meta">
                      <span>{resource.meta}</span>
                      <strong>{resource.price}</strong>
                    </div>
                    <span className="resource-card-status">Próximamente</span>
                  </article>
                ))}
          </div>
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
