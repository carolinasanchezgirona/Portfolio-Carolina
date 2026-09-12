import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Psicóloga en Arenys de Mar | Psicología y Neuropsicología",
  description:
    "Psicóloga General Sanitaria y Neuropsicóloga en Arenys de Mar. Atención psicológica para adultos, evaluación e intervención neuropsicológica, presencial y online.",
  alternates: { canonical: "/psicologa-arenys-de-mar/" },
  openGraph: {
    title: "Psicóloga en Arenys de Mar | Carolina Sánchez Girona",
    description:
      "Psicología General Sanitaria y Neuropsicología en Arenys de Mar y online.",
    url: "https://carolinasanchezgirona.com/psicologa-arenys-de-mar/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología y Neuropsicología en Arenys de Mar",
  provider: {
    "@type": "Person",
    name: "Carolina Sánchez Girona",
    jobTitle: "Psicóloga General Sanitaria y Neuropsicóloga",
    url: "https://carolinasanchezgirona.com",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  serviceType: ["Psicología General Sanitaria", "Neuropsicología"],
  url: "https://carolinasanchezgirona.com/psicologa-arenys-de-mar/",
};

export default function LocalPsychologistPage() {
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
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Arenys de Mar</span></p>
          <p className="editorial-eyebrow">Consulta en Arenys de Mar · Maresme</p>
          <h1>Psicóloga General Sanitaria y Neuropsicóloga en Arenys de Mar</h1>
          <p className="seo-lead">
            Atención psicológica para adultos y evaluación e intervención neuropsicológica desde una práctica clínica individualizada, basada en evidencia y adaptada a la persona, su contexto y sus objetivos.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#como-puedo-ayudarte">Ver áreas de atención</a>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section id="como-puedo-ayudarte">
            <h2>Psicología y neuropsicología en un mismo espacio clínico</h2>
            <p>
              No todas las consultas empiezan del mismo modo. Algunas personas llegan porque la ansiedad, el estado de ánimo, una pérdida o una situación relacional está interfiriendo en su vida. Otras necesitan comprender mejor cambios en memoria, atención, lenguaje o funciones ejecutivas. El punto de partida es diferente, pero el objetivo es el mismo: entender bien qué está ocurriendo antes de decidir cómo intervenir.
            </p>
            <p>
              En consulta trabajo dos áreas diferenciadas: Psicología General Sanitaria para adultos y Neuropsicología. La primera visita permite situar el motivo de consulta, revisar antecedentes relevantes y acordar los siguientes pasos sin aplicar un protocolo idéntico a todas las personas.
            </p>
          </section>

          <section>
            <h2>Atención psicológica para adultos</h2>
            <p>
              La consulta de Psicología General Sanitaria está orientada a adultos que atraviesan dificultades emocionales o vitales que empiezan a ocupar demasiado espacio en el día a día.
            </p>
            <ul>
              <li>Ansiedad, preocupación persistente y sensación de desbordamiento.</li>
              <li>Bajo estado de ánimo, apatía o pérdida de interés.</li>
              <li>Duelo y adaptación a pérdidas o cambios importantes.</li>
              <li>Dificultades en relaciones, límites y toma de decisiones.</li>
              <li>Sobrecarga, estrés y etapas de cambio vital.</li>
            </ul>
            <div className="seo-callout">
              <strong>La terapia empieza por comprender el problema, no por encajarlo en una etiqueta.</strong>
              <span>La formulación clínica orienta los objetivos y el tipo de intervención que puede ser más útil en cada caso.</span>
            </div>
          </section>

          <section>
            <h2>Evaluación e intervención neuropsicológica</h2>
            <p>
              La neuropsicología estudia la relación entre el funcionamiento cerebral y procesos como la memoria, la atención, el lenguaje, la planificación o la regulación de la conducta. Una evaluación puede ser útil cuando existen cambios cognitivos, dudas sobre el funcionamiento cotidiano o necesidad de definir un perfil cognitivo con mayor precisión.
            </p>
            <ul>
              <li>Quejas o cambios de memoria y atención.</li>
              <li>Dificultades de lenguaje o funciones ejecutivas.</li>
              <li>Deterioro cognitivo y demencias.</li>
              <li>Seguimiento de cambios cognitivos a lo largo del tiempo.</li>
              <li>Orientación a la persona y a la familia tras la evaluación.</li>
            </ul>
          </section>

          <section>
            <h2>Primera visita en Arenys de Mar</h2>
            <p>
              La primera sesión dura 60 minutos. Si dispones de informes previos de psicología, psiquiatría, neurología u otras especialidades médicas que consideres relevantes, puedes traerlos a la consulta. No es necesario enviar documentación clínica a través del formulario de reserva.
            </p>
            <p>
              La atención puede realizarse presencialmente en Arenys de Mar y, cuando el tipo de intervención lo permite, también online. La modalidad se valora según la necesidad clínica y el objetivo de la consulta.
            </p>
          </section>

          <section>
            <h2>Atención desde Arenys de Mar para el Maresme</h2>
            <p>
              La consulta está situada en Arenys de Mar y atiende a personas del entorno del Maresme, además de ofrecer atención online. La web está pensada para que puedas conocer previamente el tipo de trabajo clínico, consultar disponibilidad y reservar sin tener que compartir el motivo de consulta por correo o formularios abiertos.
            </p>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card">
            <h2>Información práctica</h2>
            <ul className="seo-facts">
              <li><span>Duración</span><strong>60 minutos</strong></li>
              <li><span>Tarifa</span><strong>60 €</strong></li>
              <li><span>Modalidad</span><strong>Presencial y online</strong></li>
              <li><span>Ubicación</span><strong>Arenys de Mar</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
          </div>

          <div className="seo-card">
            <p className="editorial-section-eyebrow">Valoraciones en Google</p>
            <h3>5,0 de 5 · 20 reseñas</h3>
            <p>Valoración actual publicada en el perfil de empresa de Dememòria en Google.</p>
            <div className="seo-related">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Dememoria+Arenys+de+Mar"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver reseñas en Google ↗
              </a>
            </div>
          </div>

          <div className="seo-card">
            <h3>Servicios</h3>
            <div className="seo-related">
              <a href="/psicologia/">Psicología General Sanitaria</a>
              <a href="/neuropsicologia/">Neuropsicología</a>
            </div>
          </div>
        </aside>
      </div>

      <section className="editorial-section seo-authority">
        <div className="editorial-wrap seo-authority-grid">
          <div>
            <p className="editorial-section-eyebrow">Quién te atenderá</p>
            <h2>Carolina Sánchez Girona</h2>
            <p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p>
          </div>
          <div className="seo-authority-copy">
            <p>
              Mi práctica combina clínica de adultos y neuropsicología, con experiencia especialmente vinculada al deterioro cognitivo y las demencias. Trabajo desde una evaluación estructurada, razonamiento clínico y objetivos terapéuticos concretos.
            </p>
            <p>
              También participo en divulgación profesional y publicaciones vinculadas a psicología sanitaria y neuropsicología.
            </p>
            <div className="seo-authority-links">
              <a href="https://psiara.cat/2026/08/06/cuando-el-dolor-no-encuentra-un-lugar/" target="_blank" rel="noopener noreferrer">Publicación en PsiAra: Cuando el dolor no encuentra un lugar ↗</a>
              <a href="https://psiara.cat/2026/08/05/la-capacitat-per-testar-en-el-dret-civil-catala-des-duna-perspectiva-neuropsicologica/" target="_blank" rel="noopener noreferrer">Publicación en PsiAra sobre capacidad testamentaria y neuropsicología ↗</a>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}
