import type { Metadata } from "next";
import Image from "next/image";
import "../seo-pages.css";
import "./maresme.css";

const pageUrl = "https://carolinasanchezgirona.com/psicologa-maresme/";

export const metadata: Metadata = {
  title: "Psicóloga en el Maresme para adultos | Carolina Sánchez",
  description:
    "Psicóloga General Sanitaria y neuropsicóloga en Arenys de Mar, Maresme. Psicoterapia para adultos, evaluación neuropsicológica y atención online.",
  alternates: { canonical: "/psicologa-maresme/" },
  openGraph: {
    title: "Psicóloga en el Maresme | Carolina Sánchez Girona",
    description: "Atención psicológica para adultos y evaluación neuropsicológica en Arenys de Mar. Consulta presencial y psicoterapia online cuando está indicada.",
    url: pageUrl,
    type: "website",
    images: [{ url: "/consulta-carolina-sanchez-sala-espera.webp", width: 1086, height: 1448, alt: "Sala de espera de la consulta de Carolina Sánchez en Arenys de Mar" }],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": pageUrl + "#servicio",
      name: "Atención psicológica y neuropsicológica para adultos en el Maresme",
      serviceType: ["Psicología General Sanitaria para adultos", "Evaluación neuropsicológica de adultos"],
      description: "Psicoterapia para adultos y evaluaciones neuropsicológicas en la consulta de Arenys de Mar, con psicoterapia online cuando resulta clínicamente adecuada.",
      url: pageUrl,
      provider: { "@id": "https://carolinasanchezgirona.com/#consulta" },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Maresme" },
        { "@type": "Place", name: "Arenys de Mar" },
        { "@type": "Place", name: "Arenys de Munt" },
        { "@type": "Place", name: "Canet de Mar" },
        { "@type": "Place", name: "Caldes d'Estrac" },
        { "@type": "Place", name: "Sant Vicenç de Montalt" },
        { "@type": "Place", name: "Sant Andreu de Llavaneres" },
        { "@type": "Place", name: "Sant Pol de Mar" },
        { "@type": "Place", name: "Mataró" },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://carolinasanchezgirona.com/" },
        { "@type": "ListItem", position: 2, name: "Psicóloga en el Maresme", item: pageUrl },
      ],
    },
  ],
};

export default function PsychologistMaresmePage() {
  return (
    <main className="editorial-site maresme-page">
      <section className="seo-hero" aria-labelledby="maresme-title">
        <div className="editorial-wrap maresme-hero-grid">
          <div className="maresme-hero-copy">
            <nav className="seo-breadcrumbs" aria-label="Ruta de navegación">
              <a href="/">Inicio</a><span aria-hidden="true">·</span><span>Psicóloga en el Maresme</span>
            </nav>
            <p className="editorial-eyebrow">Psicología General Sanitaria · Consulta en Arenys de Mar</p>
            <h1 id="maresme-title">Psicóloga en el Maresme para adultos</h1>
            <p className="seo-lead">Soy Carolina Sánchez Girona, psicóloga general sanitaria y neuropsicóloga (COPC 24892). Ofrezco atención psicológica a personas adultas y evaluación neuropsicológica desde mi consulta en Arenys de Mar.</p>
            <p className="maresme-intro">Un espacio para comprender lo que ocurre, delimitar el motivo de consulta y trabajar con objetivos clínicos concretos, sin aplicar el mismo protocolo a todas las personas.</p>
            <div className="seo-actions">
              <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
              <a className="editorial-btn editorial-btn-secondary" href="#servicios-maresme">Ver servicios</a>
            </div>
            <p className="maresme-hero-facts">Arenys de Mar · Maresme · Psicoterapia online cuando es adecuada</p>
          </div>
          <figure className="maresme-hero-photo">
            <Image
              src="/consulta-carolina-sanchez-sala-espera.webp"
              alt="Sala de espera real de la consulta de psicología de Carolina Sánchez Girona en Arenys de Mar"
              width={1086}
              height={1448}
              sizes="(max-width: 760px) calc(100vw - 36px), 340px"
              priority
            />
            <figcaption>Consulta presencial en Arenys de Mar</figcaption>
          </figure>
        </div>
      </section>

      <section className="editorial-section" id="servicios-maresme" aria-labelledby="maresme-services-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head">
            <p className="editorial-section-eyebrow">Áreas de atención</p>
            <h2 id="maresme-services-title">Dos ámbitos clínicos, un mismo enfoque individualizado</h2>
            <p>La demanda puede ser emocional o cognitiva. La primera entrevista permite orientarla y valorar qué tipo de atención resulta indicada.</p>
          </div>
          <div className="maresme-service-grid">
            <article className="maresme-service-card">
              <p className="editorial-section-eyebrow">Psicología sanitaria</p>
              <h3>Atención psicológica para adultos</h3>
              <p>Ansiedad y rumiación, estrés, estado de ánimo, duelo, dificultades relacionales, límites y adaptación a cambios vitales. La intervención parte de una evaluación clínica y de objetivos acordados.</p>
              <a className="editorial-card-link" href="/psicologia/">Conocer los motivos de consulta →</a>
            </article>
            <article className="maresme-service-card">
              <p className="editorial-section-eyebrow">Neuropsicología clínica</p>
              <h3>Evaluación del funcionamiento cognitivo</h3>
              <p>Valoración de memoria, atención y funciones ejecutivas, incluyendo el estudio de cambios cognitivos, deterioro cognitivo y, según la indicación, evaluaciones específicas de TDAH y TEA en adultos.</p>
              <a className="editorial-card-link" href="/neuropsicologia/">Conocer la evaluación neuropsicológica →</a>
            </article>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout maresme-detail">
        <article className="seo-copy">
          <section aria-labelledby="maresme-consult-title">
            <h2 id="maresme-consult-title">¿Cuándo puede ser útil consultar?</h2>
            <p>No es necesario esperar a que el malestar sea extremo. Una consulta psicológica puede ayudar cuando la preocupación constante, la autocrítica, la sobrecarga o los conflictos interpersonales están interfiriendo en el día a día.</p>
            <p>Si el motivo principal son dificultades de memoria, concentración, planificación o cambios cognitivos, puede ser más útil comenzar por una valoración neuropsicológica. La indicación se establece a partir de la demanda y los antecedentes, sin asumir diagnósticos de antemano.</p>
          </section>
          <section aria-labelledby="maresme-first-title">
            <h2 id="maresme-first-title">¿Cómo es la primera visita?</h2>
            <p>La primera sesión de psicología dura 60 minutos. Revisamos el motivo de consulta, su evolución y el contexto, y acordamos los siguientes pasos. La evaluación neuropsicológica sigue un proceso propio, ajustado a la pregunta clínica y a las pruebas necesarias.</p>
            <p>Si dispones de informes previos que puedan aportar información relevante, puedes traerlos a consulta. No hace falta remitir documentación clínica mediante el formulario de reserva.</p>
          </section>
          <section aria-labelledby="maresme-area-title">
            <h2 id="maresme-area-title">Atención desde Arenys de Mar para el Maresme</h2>
            <p>La consulta presencial está situada en <strong>Carrer Barcelona 8, local, Arenys de Mar</strong>. Pueden acudir personas de Arenys de Munt, Canet de Mar, Sant Pol de Mar, Caldes d&apos;Estrac, Sant Vicenç de Montalt, Sant Andreu de Llavaneres, Mataró y otras localidades de la comarca.</p>
            <p>No dispongo de otros despachos físicos en estas poblaciones. Cuando el tipo de intervención lo permite, también ofrezco psicoterapia online.</p>
            <a href="/psicologa-arenys-de-mar/">Ver fotografías de la consulta y cómo llegar →</a>
          </section>
          <section aria-labelledby="maresme-faq-title">
            <h2 id="maresme-faq-title">Preguntas habituales</h2>
            <h3>¿Atienes de forma presencial en Mataró?</h3>
            <p>No. La atención presencial se realiza en Arenys de Mar. También puedes consultar la modalidad online cuando resulte clínicamente adecuada.</p>
            <h3>¿Realizas evaluaciones de TDAH y TEA en adultos?</h3>
            <p>Sí. Son valoraciones diferenciadas de la psicoterapia. Puedes consultar la <a href="/evaluacion-tdah-adultos/">evaluación de TDAH adulto</a> y la <a href="/evaluacion-tea-adultos/">evaluación de TEA adulto</a>, que incluyen un proceso clínico y diagnóstico diferencial ajustado a cada caso.</p>
            <h3>¿Realizas evaluaciones de memoria y deterioro cognitivo?</h3>
            <p>Sí. La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> permite explorar el funcionamiento cognitivo, integrar antecedentes y estudiar su repercusión en la vida diaria.</p>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Información de la consulta">
          <div className="seo-card">
            <h2>Información práctica</h2>
            <ul className="seo-facts">
              <li><span>Psicología</span><strong>60 € / 60 min</strong></li>
              <li><span>Neuropsicología</span><strong>75 € / 60 min</strong></li>
              <li><span>Consulta presencial</span><strong>Arenys de Mar</strong></li>
              <li><span>Atención online</span><strong>Según indicación</strong></li>
            </ul>
            <p className="maresme-card-note">Las evaluaciones neuropsicológicas completas tienen un presupuesto específico según su alcance.</p>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
          </div>
          <div className="seo-card">
            <h3>Quién te atenderá</h3>
            <p><strong>Carolina Sánchez Girona</strong>, Psicóloga General Sanitaria y Neuropsicóloga. Número de colegiada COPC 24892.</p>
            <div className="seo-related">
              <a href="/sobre-mi/">Conocer mi trayectoria profesional →</a>
              <a href="https://maps.app.goo.gl/ubCSFYZRgbv7vpqF9" target="_blank" rel="noopener noreferrer">Ver ubicación en Google Maps ↗</a>
            </div>
          </div>
        </aside>
      </div>

      <section className="editorial-section maresme-final-cta" aria-labelledby="maresme-contact-title">
        <div className="editorial-wrap maresme-final-inner">
          <div>
            <p className="editorial-section-eyebrow">Consulta en el Maresme</p>
            <h2 id="maresme-contact-title">Puedes empezar por una primera visita</h2>
            <p>Consulta los horarios disponibles y elige la modalidad de atención que corresponde a tu motivo de consulta.</p>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar horarios y pedir cita</a>
          </div>
          <figure className="maresme-exterior-photo">
            <Image src="/consulta-carolina-sanchez-fachada.webp" alt="Entrada de la consulta profesional de Carolina Sánchez en Carrer Barcelona, Arenys de Mar" width={1122} height={1402} sizes="(max-width: 760px) 260px, 245px" loading="lazy" />
            <figcaption>Entrada a la consulta</figcaption>
          </figure>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}
