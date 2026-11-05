import type { Metadata } from "next";
import Image from "next/image";
import "../seo-pages.css";
import SocialLinks from "../components/social-links";

export const metadata: Metadata = {
  title: { absolute: "Sobre Carolina Sánchez | Psicóloga y neuropsicóloga" },
  description:
    "Conoce la trayectoria profesional de Carolina Sánchez Girona, Psicóloga General Sanitaria y Neuropsicóloga en Arenys de Mar, colegiada 24892.",
  alternates: { canonical: "/sobre-mi/" },
  openGraph: {
    title: "Carolina Sánchez Girona | Psicóloga General Sanitaria y Neuropsicóloga",
    description:
      "Psicología sanitaria y neuropsicología clínica de adultos en Arenys de Mar. Evaluación cognitiva, atención psicológica y acompañamiento individualizado.",
    url: "https://carolinasanchezgirona.com/sobre-mi/",
  },
};

const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    "@id": "https://carolinasanchezgirona.com/#carolina-sanchez-girona",
    name: "Carolina Sánchez Girona",
    jobTitle: "Psicóloga General Sanitaria y Neuropsicóloga",
    url: "https://carolinasanchezgirona.com/sobre-mi/",
    image: "https://carolinasanchezgirona.com/carolina-sanchez-retrato.jpg",
    identifier: {
      "@type": "PropertyValue",
      propertyID: "COPC",
      value: "24892",
    },
    sameAs: [
      "https://www.instagram.com/carolina_tupsicologa/",
      "https://www.linkedin.com/in/carolina-s%C3%A1nchez-girona-43b3b94a/",
      "https://www.copc.cat/es/contacte/carolina-sanchez-girona-56949",
    ],
    memberOf: {
      "@type": "Organization",
      name: "Grup de Treball Neuropsicologia i salut mental del Col·legi Oficial de Psicologia de Catalunya",
    },
    knowsAbout: [
      "Psicología General Sanitaria",
      "Neuropsicología",
      "Evaluación neuropsicológica",
      "Deterioro cognitivo",
      "Demencias",
      "Ansiedad",
      "Duelo",
      "Estimulación cognitiva",
    ],
  },
};

export default function AboutPage() {
  return (
    <main className="editorial-site">
      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Sobre mí</span></p>
          <p className="editorial-eyebrow">Psicóloga General Sanitaria · Neuropsicóloga</p>
          <h1>Carolina Sánchez Girona</h1>
          <p className="seo-lead">
            Trabajo en psicología sanitaria y neuropsicología clínica con personas adultas. Atiendo dificultades emocionales y realizo evaluaciones de memoria, atención y otras funciones cognitivas, teniendo en cuenta el contexto y las necesidades de cada persona.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
            <a className="editorial-btn editorial-btn-secondary" href="/psicologa-arenys-de-mar/">Consulta en Arenys de Mar</a>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section>
            <h2>Trayectoria clínica</h2>
            <p>
              Mi trayectoria profesional combina la consulta clínica, la evaluación neuropsicológica y la atención a personas adultas en distintos contextos asistenciales. He trabajado también con personas mayores, residencias y centros de día, incluyendo el deterioro cognitivo y las demencias.
            </p>
            <p>
              En la práctica con adultos trabajo también con ansiedad, estado de ánimo, duelo, relaciones, sobrecarga y procesos de cambio. El objetivo no es aplicar una técnica de forma automática, sino construir una formulación clínica que permita decidir qué puede resultar útil para esa persona y en ese momento.
            </p>
          </section>

          <section>
            <h2>Una mirada clínica que integra psicología y neuropsicología</h2>
            <figure className="seo-professional-photo">
              <Image
                src="/carolina-sanchez-enfoque.webp"
                alt="Retrato profesional de Carolina Sánchez con camisa blanca y gafas"
                width={540}
                height={810}
                sizes="(max-width: 680px) min(calc(100vw - 36px), 360px), 360px"
                loading="lazy"
              />
            </figure>
            <p>
              La psicología y la neuropsicología aportan preguntas diferentes, pero comparten una misma necesidad: interpretar la información dentro de la historia, el entorno y el funcionamiento real de la persona.
            </p>
            <p>
              En neuropsicología, una puntuación aislada tiene un valor limitado. La evaluación cobra sentido cuando se integra con antecedentes, evolución, autonomía, observación clínica y demandas de la vida diaria. En psicoterapia sucede algo parecido: un diagnóstico puede orientar, pero no sustituye la comprensión del problema y de los factores que lo mantienen.
            </p>
            <div className="seo-callout">
              <strong>La clínica no empieza en una etiqueta diagnóstica.</strong>
              <span>Empieza intentando comprender qué ocurre, cómo afecta a la persona y qué necesita cambiar o adaptarse.</span>
            </div>
          </section>

          <section>
            <h2>Mi consulta en Arenys de Mar</h2>
            <p>
              En mi consulta de Arenys de Mar ofrezco atención psicológica a adultos, evaluación del funcionamiento cognitivo e intervención neuropsicológica según las necesidades de cada caso.
            </p>
            <p>
              La atención es individualizada, con objetivos claros y comunicación comprensible. Cuando es necesario, integro informes previos y coordino la intervención con otros profesionales sanitarios.
            </p>
            <p><a href="/psicologa-arenys-de-mar/">Conocer la consulta y cómo llegar →</a></p>
          </section>

          <section>
            <h2>Actividad profesional y divulgación</h2>
            <p>
              Formo parte del Grupo de Trabajo de Neuropsicología y Salud Mental del Col·legi Oficial de Psicologia de Catalunya. También participo en divulgación profesional sobre psicología sanitaria, neuropsicología, deterioro cognitivo y cuestiones en las que el funcionamiento psicológico y cognitivo se cruza con otros ámbitos de la salud y la sociedad.
            </p>
            <h3>Publicaciones seleccionadas</h3>
            <div className="seo-authority-links">
              <a href="https://psiara.cat/2026/08/06/cuando-el-dolor-no-encuentra-un-lugar/" target="_blank" rel="noopener noreferrer">
                Cuando el dolor no encuentra un lugar ↗
              </a>
              <a href="https://psiara.cat/2026/08/05/la-capacitat-per-testar-en-el-dret-civil-catala-des-duna-perspectiva-neuropsicologica/" target="_blank" rel="noopener noreferrer">
                La capacitat per testar en el dret civil català des d’una perspectiva neuropsicològica ↗
              </a>
              <a href="https://icab.cat/export/sites/icab/.content/icab-document/Mon-Juridic-365-Juliol-Agost.pdf" target="_blank" rel="noopener noreferrer">
                La ficció de la lucidesa? Capacitat testamentària, captació de voluntat i prova de la vulnerabilitat · Món Jurídic (ICAB) ↗
              </a>
            </div>
          </section>

          <section>
            <h2>Neurociencia, tecnología e intereses profesionales</h2>
            <p>
              Mi práctica clínica integra la psicología sanitaria y la neuropsicología, con especial interés por la neurociencia, la evaluación del funcionamiento cotidiano y el potencial de las herramientas tecnológicas en el ámbito sanitario.
            </p>
            <p>
              Me interesa especialmente cómo la neuroimagen, los biomarcadores digitales, la inteligencia artificial y las tecnologías médicas pueden contribuir a una evaluación más precisa sin perder el significado clínico de la historia y del funcionamiento cotidiano de la persona.
            </p>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Datos profesionales">
          <div className="seo-card">
            <h2>Datos profesionales</h2>
            <ul className="seo-facts">
              <li><span>Profesión</span><strong>Psicóloga General Sanitaria</strong></li>
              <li><span>Área clínica</span><strong>Neuropsicología</strong></li>
              <li><span>Colegiada</span><strong>COPC 24892</strong></li>
              <li><span>Consulta</span><strong>Arenys de Mar</strong></li>
              <li><span>Modalidad</span><strong>Presencial y online</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
          </div>

          <div className="seo-card">
            <h3>Perfil profesional</h3>
            <SocialLinks className="seo-social-links" />
            <div className="seo-related">
              <a href="/psicologia/">Psicología General Sanitaria</a>
              <a href="/neuropsicologia/">Neuropsicología</a>
              <a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a>
            </div>
          </div>
        </aside>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
    </main>
  );
}
