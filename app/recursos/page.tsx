import type { Metadata } from "next";

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

type ResourceCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  meta: string;
  price: string;
  tone?: "teal" | "coral" | "indigo";
};

function ResourceCard({
  eyebrow,
  title,
  description,
  meta,
  price,
  tone = "teal",
}: ResourceCardProps) {
  return (
    <article className={`resource-card resource-card-${tone}`}>
      <div className="resource-card-accent" />
      <p className="resource-card-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="resource-card-copy">{description}</p>
      <div className="resource-card-meta">
        <span>{meta}</span>
        <strong>{price}</strong>
      </div>
      <span className="resource-card-status">Próximamente</span>
    </article>
  );
}

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
            <span>Próxima apertura</span>
            <p>
              Esta sección está preparada para incorporar recursos descargables. Los primeros materiales estarán
              disponibles progresivamente.
            </p>
          </aside>
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="destacados-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head resources-heading">
            <p className="editorial-section-eyebrow">Primeros recursos</p>
            <h2 id="destacados-title">Tres líneas para empezar.</h2>
            <p>
              Psicología aplicada, neuropsicología y materiales de uso profesional. La selección inicial será pequeña
              para priorizar calidad, utilidad y actualización.
            </p>
          </div>

          <div className="resources-grid">
            <ResourceCard
              eyebrow="Ansiedad y rumiación"
              title="Salir del bucle"
              description="Cuaderno práctico para identificar patrones de rumiación, reducir el enganche con los pensamientos y recuperar margen de acción."
              meta="Cuaderno descargable"
              price="12,90 €"
              tone="teal"
            />
            <ResourceCard
              eyebrow="Psicología"
              title="Ansiedad: comprender y regular"
              description="Psicoeducación y ejercicios para reconocer el ciclo de la ansiedad, trabajar la evitación y practicar estrategias de regulación."
              meta="Guía + ejercicios"
              price="14,90 €"
              tone="coral"
            />
            <ResourceCard
              eyebrow="Neuropsicología"
              title="Memoria y atención en casa"
              description="Propuesta estructurada de actividades para estimular procesos atencionales y mnésicos en la vida cotidiana."
              meta="Programa descargable"
              price="19,90 €"
              tone="indigo"
            />
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
            <article>
              <span>01</span>
              <h3>Uso personal</h3>
              <p>Cuadernos de trabajo sobre ansiedad, sueño, duelo, autoestima y regulación emocional.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Neuropsicología</h3>
              <p>Materiales de memoria, atención, funciones ejecutivas y estimulación cognitiva para el día a día.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Profesionales</h3>
              <p>Psicoeducación, registros y hojas de trabajo preparadas para integrar en la práctica clínica.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="editorial-section resources-free" aria-labelledby="free-title">
        <div className="editorial-wrap resources-free-grid">
          <div>
            <p className="editorial-section-eyebrow">También habrá recursos gratuitos</p>
            <h2 id="free-title">Probar antes de comprar.</h2>
          </div>
          <div>
            <p>
              La biblioteca incluirá materiales breves de acceso libre. Servirán como herramientas independientes y
              como muestra del enfoque de los cuadernos completos.
            </p>
            <a className="editorial-btn editorial-btn-secondary" href="/articulos/">
              Ver artículos
            </a>
          </div>
        </div>
      </section>

      <section className="editorial-section resources-clinical-note">
        <div className="editorial-wrap">
          <p>
            Estos materiales tienen finalidad psicoeducativa y de apoyo. No constituyen diagnóstico, tratamiento ni
            sustituyen una valoración psicológica o neuropsicológica individualizada.
          </p>
        </div>
      </section>
    </main>
  );
}
