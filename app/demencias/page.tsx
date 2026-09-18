import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Neuropsicología en demencias y Alzheimer | Arenys de Mar",
  description:
    "Evaluación y seguimiento neuropsicológico en demencias y enfermedad de Alzheimer en Arenys de Mar. Orientación a familias, adaptación funcional e intervención cognitiva.",
  alternates: { canonical: "/demencias/" },
  openGraph: {
    title: "Demencias y Alzheimer | Carolina Sánchez Girona",
    description:
      "Neuropsicología clínica para evaluación, seguimiento y orientación en demencias y enfermedad de Alzheimer.",
    url: "https://carolinasanchezgirona.com/demencias/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Neuropsicología en demencias y Alzheimer",
  provider: {
    "@type": "Person",
    name: "Carolina Sánchez Girona",
    jobTitle: "Neuropsicóloga",
    url: "https://carolinasanchezgirona.com",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  serviceType: "Evaluación, seguimiento e intervención neuropsicológica en demencias",
  url: "https://carolinasanchezgirona.com/demencias/",
};

export default function DementiaPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/neuropsicologia/">Neuropsicología</a>
          <a href="/deterioro-cognitivo/">Deterioro cognitivo</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs">
            <a href="/">Inicio</a><span>·</span>
            <a href="/neuropsicologia/">Neuropsicología</a><span>·</span>
            <span>Demencias</span>
          </p>
          <p className="editorial-eyebrow">Neuropsicología · Demencias</p>
          <h1>Neuropsicología en demencias y Alzheimer</h1>
          <p className="seo-lead">
            La evaluación neuropsicológica puede ayudar a describir el perfil cognitivo, seguir la evolución y traducir los cambios clínicos en recomendaciones útiles para la persona y su familia.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir primera visita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#como-ayuda">Cómo puede ayudar</a>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section>
            <h2>La demencia no es un único perfil clínico</h2>
            <p>
              El término demencia describe un síndrome clínico caracterizado por un deterioro cognitivo adquirido que interfiere de forma significativa en la autonomía. Puede aparecer en enfermedades distintas y afectar de manera diferente a memoria, lenguaje, atención, funciones ejecutivas, orientación, conducta y funcionamiento cotidiano.
            </p>
            <p>
              La enfermedad de Alzheimer es una de las causas más frecuentes, pero no es la única. También existen otros cuadros neurodegenerativos y condiciones neurológicas que pueden producir deterioro cognitivo. La valoración neuropsicológica aporta información sobre el patrón de capacidades preservadas y alteradas, siempre integrada con la historia clínica y la valoración médica.
            </p>
          </section>

          <section id="como-ayuda">
            <h2>Cómo puede ayudar la neuropsicología</h2>
            <h3>Caracterizar el perfil cognitivo</h3>
            <p>
              La exploración permite describir con mayor precisión qué procesos cognitivos presentan dificultades y cuáles permanecen relativamente preservados. Esta información puede complementar la valoración neurológica, geriátrica o psiquiátrica.
            </p>
            <h3>Establecer una línea base y seguir la evolución</h3>
            <p>
              Cuando existe un diagnóstico o una sospecha clínica, disponer de una evaluación inicial permite comparar cambios posteriores y valorar la evolución del funcionamiento cognitivo y funcional.
            </p>
            <h3>Traducir los resultados a la vida diaria</h3>
            <p>
              El objetivo no es quedarse en una puntuación. Los resultados deben ayudar a comprender qué tareas pueden mantenerse, qué apoyos conviene introducir y qué situaciones requieren adaptación o supervisión.
            </p>
          </section>

          <section>
            <h2>Intervención y estimulación cognitiva</h2>
            <p>
              En fases leves o moderadas puede plantearse intervención cognitiva dirigida a mantener capacidades, favorecer estrategias compensatorias y preservar el mayor nivel posible de autonomía. La selección de actividades debe ajustarse al perfil cognitivo, a la historia de la persona y a objetivos funcionales concretos.
            </p>
            <p>
              La intervención no consiste únicamente en realizar ejercicios de memoria. Puede incluir orientación temporal, planificación de rutinas, uso de ayudas externas, adaptación de tareas cotidianas y trabajo sobre actividades significativas para la persona.
            </p>
          </section>

          <section>
            <h2>Orientación a familiares y cuidadores</h2>
            <p>
              Los cambios cognitivos y conductuales pueden generar incertidumbre, discusiones y sobrecarga familiar. La orientación ayuda a comprender qué dificultades están relacionadas con el deterioro, qué expectativas son realistas y cómo estructurar mejor el entorno.
            </p>
            <p>
              También puede ser útil revisar pautas de comunicación, manejo de rutinas, nivel de supervisión, seguridad en actividades cotidianas y señales que aconsejan una nueva valoración sanitaria.
            </p>
          </section>

          <section>
            <h2>Cuándo puede ser útil una valoración</h2>
            <ul>
              <li>Existe un diagnóstico reciente de enfermedad de Alzheimer u otra demencia.</li>
              <li>Se necesita conocer con mayor detalle el perfil cognitivo actual.</li>
              <li>La familia observa cambios y quiere diferenciar qué capacidades se mantienen y cuáles requieren apoyo.</li>
              <li>Se quiere establecer una línea base para seguimiento posterior.</li>
              <li>Han aparecido cambios funcionales o conductuales que requieren adaptar rutinas y apoyos.</li>
              <li>Se necesita orientación para organizar mejor el cuidado y la autonomía cotidiana.</li>
            </ul>
          </section>

          <section>
            <h2>Relación con deterioro cognitivo y problemas de memoria</h2>
            <p>
              No toda queja de memoria ni todo deterioro cognitivo implica una demencia. Cuando la principal preocupación son olvidos sin un diagnóstico previo, puede ser más útil empezar por la información sobre <a href="/problemas-de-memoria/">problemas de memoria</a> o <a href="/deterioro-cognitivo/">deterioro cognitivo</a>.
            </p>
            <div className="seo-callout">
              <strong>El diagnóstico no define por completo el funcionamiento de una persona.</strong>
              <span>La evaluación debe servir para tomar decisiones prácticas y ajustar apoyos a capacidades reales.</span>
            </div>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card">
            <h2>Primera visita</h2>
            <ul className="seo-facts">
              <li><span>Duración</span><strong>60 minutos</strong></li>
              <li><span>Tarifa</span><strong>60 €</strong></li>
              <li><span>Ubicación</span><strong>Arenys de Mar</strong></li>
              <li><span>Área</span><strong>Neuropsicología</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
          </div>
          <div className="seo-card">
            <h3>Áreas relacionadas</h3>
            <div className="seo-related">
              <a href="/neuropsicologia/">Neuropsicología</a>
              <a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a>
              <a href="/problemas-de-memoria/">Problemas de memoria</a>
              <a href="/deterioro-cognitivo/">Deterioro cognitivo</a>
            </div>
          </div>
        </aside>
      </div>

      <section className="editorial-section seo-authority">
        <div className="editorial-wrap seo-authority-grid">
          <div>
            <p className="editorial-section-eyebrow">Profesional responsable</p>
            <h2>Carolina Sánchez Girona</h2>
            <p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p>
          </div>
          <div className="seo-authority-copy">
            <p>
              Mi experiencia profesional está especialmente vinculada al deterioro cognitivo, las demencias y el trabajo con personas mayores y sus familias. Integro evaluación, funcionamiento cotidiano y objetivos clínicos para que la información neuropsicológica tenga utilidad práctica.
            </p>
            <div className="seo-authority-links">
              <a href="/sobre-mi/">Conocer mi trayectoria profesional →</a>
              <a href="/evaluacion-neuropsicologica/">Cómo se realiza una evaluación neuropsicológica →</a>
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
