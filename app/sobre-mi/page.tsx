import type { Metadata } from "next";
import "../seo-pages.css";
import SocialLinks from "../components/social-links";

export const metadata: Metadata = {
  title: "Carolina Sánchez Girona | Psicóloga General Sanitaria y Neuropsicóloga",
  description:
    "Conoce la trayectoria profesional de Carolina Sánchez Girona, Psicóloga General Sanitaria y Neuropsicóloga en Arenys de Mar, colegiada 24892.",
  alternates: { canonical: "/sobre-mi/" },
  openGraph: {
    title: "Carolina Sánchez Girona | Psicóloga General Sanitaria y Neuropsicóloga",
    description:
      "Psicología General Sanitaria y Neuropsicología en Arenys de Mar. Clínica de adultos, deterioro cognitivo, demencias y evaluación neuropsicológica.",
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
      "https://www.instagram.com/carolinasanchez.psicologia/",
      "https://www.linkedin.com/in/carolina-s%C3%A1nchez-girona-43b3b94a/",
      "https://www.doctoralia.es/carolina-sanchez-girona/psicologo/arenys-de-mar",
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
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/psicologia/">Psicología</a>
          <a href="/neuropsicologia/">Neuropsicología</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Sobre mí</span></p>
          <p className="editorial-eyebrow">Psicóloga General Sanitaria · Neuropsicóloga</p>
          <h1>Carolina Sánchez Girona</h1>
          <p className="seo-lead">
            Trabajo en psicología clínica de adultos y neuropsicología, con especial experiencia en evaluación cognitiva, deterioro cognitivo, demencias y acompañamiento psicológico. Mi forma de trabajar parte de comprender a la persona en su contexto, no solo de describir síntomas o puntuaciones.
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
              Soy Psicóloga General Sanitaria y Neuropsicóloga. Mi trayectoria profesional se ha desarrollado entre la consulta clínica, el trabajo con personas mayores, residencias y centros de día, con especial vinculación al deterioro cognitivo, las demencias y el funcionamiento cognitivo en la vida cotidiana.
            </p>
            <p>
              En la práctica con adultos trabajo también con ansiedad, estado de ánimo, duelo, relaciones, sobrecarga y procesos de cambio. El objetivo no es aplicar una técnica de forma automática, sino construir una formulación clínica que permita decidir qué puede resultar útil para esa persona y en ese momento.
            </p>
          </section>

          <section>
            <h2>Psicología y neuropsicología dentro de una misma mirada clínica</h2>
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
            <h2>Dememoria</h2>
            <p>
              Dememoria es mi consulta de Psicología y Neuropsicología en Arenys de Mar. Desde aquí realizo atención psicológica a adultos, evaluación e intervención neuropsicológica y trabajo relacionado con deterioro cognitivo y demencias.
            </p>
            <p>
              La consulta busca mantener un formato clínico individualizado, con objetivos claros y una comunicación comprensible. Cuando es necesario, el trabajo puede coordinarse con otros profesionales sanitarios o incorporar informes previos para construir una visión más completa del caso.
            </p>
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
            <h2>Neurociencia, tecnología y formación complementaria</h2>
            <p>
              Paralelamente a la práctica clínica estoy cursando Ingeniería Biomédica. Esta formación no sustituye mi identidad profesional como psicóloga y neuropsicóloga; la complementa desde el interés por la neurociencia, los sistemas biológicos, los datos, la tecnología sanitaria y las nuevas herramientas de evaluación.
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
              <li><span>Especialidad</span><strong>Neuropsicología</strong></li>
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

      <section className="editorial-section seo-authority">
        <div className="editorial-wrap seo-authority-grid">
          <div>
            <p className="editorial-section-eyebrow">Consulta clínica</p>
            <h2>Dememoria · Arenys de Mar</h2>
          </div>
          <div className="seo-authority-copy">
            <p>
              Atención psicológica para adultos y neuropsicología clínica con cita previa. Sesiones de 60 minutos, atención presencial en Arenys de Mar y modalidad online cuando resulta adecuada para el caso.
            </p>
            <div className="seo-authority-links">
              <a href="/psicologa-arenys-de-mar/">Ver información de la consulta →</a>
              <a href="/cita/">Pedir cita →</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="editorial-footer">
        <div className="editorial-wrap editorial-footer-inner">
          <div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div>
          <div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
    </main>
  );
}
