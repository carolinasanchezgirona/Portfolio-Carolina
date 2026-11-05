import type { Metadata } from "next";
import Image from "next/image";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Psicología para adultos en Arenys de Mar y online",
  description:
    "Psicóloga para adultos en Arenys de Mar (Maresme) y online. Atención a la ansiedad, bajo estado de ánimo, duelo, relaciones y estrés. Consulta y reserva de cita.",
  alternates: { canonical: "/psicologia/" },
  twitter: { card: "summary", title: "Psicología para adultos en Arenys de Mar y online | Carolina Sánchez", description: "Psicóloga para adultos en Arenys de Mar (Maresme) y online. Atención a la ansiedad, bajo estado de ánimo, duelo, relaciones y estrés. Consulta y reserva de cita." },
  openGraph: {
    title: "Psicología para adultos en Arenys de Mar y online | Carolina Sánchez",
    description:
      "Psicóloga para adultos en Arenys de Mar (Maresme) y online. Atención a la ansiedad, bajo estado de ánimo, duelo, relaciones y estrés. Consulta y reserva de cita.",
    url: "https://carolinasanchezgirona.com/psicologia/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología General Sanitaria",
  provider: {
    "@id": "https://carolinasanchezgirona.com/#carolina-sanchez-girona",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Psicología General Sanitaria para adultos",
  url: "https://carolinasanchezgirona.com/psicologia/",
};

export default function PsychologyPage() {
  return (
    <main className="editorial-site psychology-page">
      <section className="editorial-section psychology-hero" aria-labelledby="psychology-title">
        <div className="editorial-wrap psychology-hero-grid">
          <div className="psychology-hero-copy">
            <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Psicología</span></p>
            <p className="editorial-eyebrow">Psicología General Sanitaria · Adultos</p>
            <h1 id="psychology-title">Psicología para adultos en Arenys de Mar y online</h1>
            <p className="psychology-intro">Un espacio para comprender lo que te ocurre y trabajar hacia cambios que tengan sentido para ti.</p>
            <div className="psychology-hero-facts" aria-label="Información de la sesión">
              <span>60 minutos</span>
              <span>60 € por sesión</span>
              <span>Presencial y online</span>
            </div>
            <div className="seo-actions">
              <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
              <a className="editorial-btn editorial-btn-secondary" href="#motivos-consulta">En qué puedo ayudarte</a>
            </div>
          </div>
          <figure className="psychology-hero-photo">
            <Image src="/consulta-carolina-sanchez-despacho.webp"
              alt="Consulta de psicología de Carolina Sánchez en Arenys de Mar"
              width={960} height={720} sizes="(max-width: 720px) 100vw, 45vw" priority />
          </figure>
        </div>
      </section>

      <section className="editorial-section psychology-reasons" id="motivos-consulta" aria-labelledby="psychology-reasons-title">
        <div className="editorial-wrap">
          <div className="psychology-section-heading">
            <p className="editorial-section-eyebrow">Motivos de consulta</p>
            <h2 id="psychology-reasons-title">¿En qué puedo ayudarte?</h2>
            <p>No necesitas esperar a que el malestar sea extremo para pedir ayuda.</p>
          </div>
          <div className="psychology-reason-grid">
            <article className="psychology-reason">
              <span className="psychology-reason-index">01</span>
              <h3>Ansiedad y preocupación</h3>
              <p>Rumiación, anticipación, tensión y dificultad para desconectar.</p>
              <a href="/ansiedad/">Explorar ansiedad →</a>
            </article>
            <article className="psychology-reason">
              <span className="psychology-reason-index">02</span>
              <h3>Estado de ánimo</h3>
              <p>Tristeza, desmotivación, agotamiento o pérdida de interés.</p>
              <a href="/depresion/">Explorar estado de ánimo →</a>
            </article>
            <article className="psychology-reason">
              <span className="psychology-reason-index">03</span>
              <h3>Duelo y pérdidas</h3>
              <p>Procesos de pérdida, rupturas y adaptación a nuevas etapas.</p>
              <a href="/duelo/">Explorar duelo →</a>
            </article>
            <article className="psychology-reason">
              <span className="psychology-reason-index">04</span>
              <h3>Relaciones y límites</h3>
              <p>Conflictos relacionales, dificultad para decir no o tomar decisiones.</p>
              <a href="/limites-y-relaciones-dificiles/">Explorar relaciones →</a>
            </article>
            <article className="psychology-reason">
              <span className="psychology-reason-index">05</span>
              <h3>Estrés y sobrecarga</h3>
              <p>Exigencia sostenida, saturación y dificultad para encontrar equilibrio.</p>
              <a href="/estres-y-sobrecarga/">Explorar estrés →</a>
            </article>
            <article className="psychology-reason">
              <span className="psychology-reason-index">06</span>
              <h3>Autoestima y autoexigencia</h3>
              <p>Autocrítica, perfeccionismo y patrones que limitan tu bienestar.</p>
              <a href="/autoestima-y-autocritica/">Explorar autoestima →</a>
            </article>
          </div>
        </div>
      </section>

      <section className="editorial-section psychology-approach" aria-labelledby="psychology-approach-title">
        <div className="editorial-wrap psychology-approach-grid">
          <figure className="psychology-approach-photo">
            <Image src="/carolina-sanchez-enfoque.webp"
              alt="Carolina Sánchez, psicóloga general sanitaria"
              width={540} height={810}
              sizes="(max-width: 720px) 260px, 320px" loading="lazy" />
          </figure>
          <div className="psychology-approach-copy">
            <p className="editorial-section-eyebrow">Mi forma de trabajar</p>
            <h2 id="psychology-approach-title">Una terapia adaptada a tu situación</h2>
            <p>La primera visita permite conocer tu historia, aclarar el motivo de consulta y acordar cómo abordar las dificultades.</p>
            <ol className="psychology-process">
              <li><strong>Comprender</strong><span>Qué ocurre y qué factores influyen.</span></li>
              <li><strong>Definir objetivos</strong><span>Qué necesitas cambiar o mejorar.</span></li>
              <li><strong>Intervenir y revisar</strong><span>Estrategias basadas en evidencia, ajustadas a tu evolución.</span></li>
            </ol>
            <a className="editorial-card-link" href="/sobre-mi/">Conocer mi trayectoria profesional →</a>
          </div>
        </div>
      </section>

      <section className="editorial-section psychology-visit" aria-labelledby="psychology-visit-title">
        <div className="editorial-wrap psychology-visit-grid">
          <div>
            <p className="editorial-section-eyebrow">Primera visita</p>
            <h2 id="psychology-visit-title">Empezar sin tenerlo todo claro</h2>
            <p>No necesitas preparar un relato perfecto. Durante la primera sesión exploraremos lo que te preocupa y valoraremos las siguientes opciones de trabajo.</p>
          </div>
          <div className="psychology-visit-details">
            <p><strong>Duración</strong><span>60 minutos</span></p>
            <p><strong>Precio</strong><span>60 €</span></p>
            <p><strong>Modalidad</strong><span>En Arenys de Mar u online, según el caso</span></p>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
            <a className="editorial-card-link" href="/psicologa-maresme/">Consulta de psicología en el Maresme →</a>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}
