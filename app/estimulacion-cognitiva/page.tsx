import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Estimulación cognitiva en adultos y mayores | Arenys de Mar",
  description:
    "Estimulación cognitiva individualizada para adultos y personas mayores en Arenys de Mar. Intervención basada en perfil cognitivo, autonomía y objetivos funcionales.",
  alternates: { canonical: "/estimulacion-cognitiva/" },
  openGraph: {
    title: "Estimulación cognitiva | Carolina Sánchez Girona",
    description:
      "Intervención neuropsicológica orientada a mantener capacidades, apoyar la autonomía y trabajar objetivos funcionales.",
    url: "https://carolinasanchezgirona.com/estimulacion-cognitiva/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Estimulación cognitiva",
  provider: {
    "@type": "Person",
    name: "Carolina Sánchez Girona",
    jobTitle: "Neuropsicóloga",
    url: "https://carolinasanchezgirona.com",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  serviceType: "Intervención y estimulación cognitiva en adultos y personas mayores",
  url: "https://carolinasanchezgirona.com/estimulacion-cognitiva/",
};

export default function CognitiveStimulationPage() {
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
            <span>Estimulación cognitiva</span>
          </p>
          <p className="editorial-eyebrow">Neuropsicología · Intervención cognitiva</p>
          <h1>Estimulación cognitiva en adultos y personas mayores</h1>
          <p className="seo-lead">
            Intervención individualizada para trabajar capacidades cognitivas, estrategias compensatorias y funcionamiento cotidiano a partir del perfil real de la persona.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir primera visita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#como-trabajo">Cómo se plantea</a>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section>
            <h2>La estimulación cognitiva no consiste solo en hacer ejercicios</h2>
            <p>
              Trabajar la cognición de forma útil requiere partir de una pregunta clínica concreta: qué capacidades se quieren mantener, qué dificultades interfieren en la vida diaria y qué objetivos funcionales tienen sentido para la persona.
            </p>
            <p>
              Por eso la intervención puede incluir tareas sobre memoria, atención, lenguaje, funciones ejecutivas o velocidad de procesamiento, pero también estrategias externas, adaptación de rutinas y entrenamiento en situaciones de la vida cotidiana.
            </p>
          </section>

          <section id="como-trabajo">
            <h2>Cómo se plantea la intervención</h2>
            <h3>1. Definir el perfil y los objetivos</h3>
            <p>
              Antes de diseñar un plan conviene conocer qué capacidades están preservadas, qué áreas presentan mayor dificultad y cómo repercuten en el día a día. Cuando existe una evaluación neuropsicológica previa, esa información orienta la selección de tareas y estrategias.
            </p>
            <h3>2. Priorizar objetivos funcionales</h3>
            <p>
              El objetivo no es mejorar una puntuación aislada, sino favorecer un funcionamiento más eficiente y autónomo. Puede trabajarse, por ejemplo, la organización de actividades, el uso de agenda, la planificación de compras, el recuerdo de citas o la secuenciación de tareas.
            </p>
            <h3>3. Ajustar dificultad y apoyos</h3>
            <p>
              Las tareas deben ser suficientemente exigentes para resultar útiles, pero no tan difíciles que generen frustración continua. Se adaptan el nivel, el ritmo y los apoyos según la evolución.
            </p>
            <h3>4. Revisar resultados</h3>
            <p>
              La intervención se revisa periódicamente para comprobar si las estrategias elegidas están ayudando y si conviene mantenerlas, modificarlas o introducir nuevos objetivos.
            </p>
          </section>

          <section>
            <h2>Qué capacidades pueden trabajarse</h2>
            <ul>
              <li>Memoria y aprendizaje.</li>
              <li>Atención sostenida y selectiva.</li>
              <li>Funciones ejecutivas: planificación, flexibilidad, organización e inhibición.</li>
              <li>Lenguaje y acceso léxico.</li>
              <li>Velocidad de procesamiento.</li>
              <li>Orientación y manejo de información cotidiana.</li>
              <li>Uso de estrategias compensatorias y ayudas externas.</li>
            </ul>
          </section>

          <section>
            <h2>En qué situaciones puede ser útil</h2>
            <p>
              Puede formar parte del seguimiento de personas con deterioro cognitivo leve, demencias en fases iniciales o moderadas, secuelas neurológicas u otras condiciones que afecten al funcionamiento cognitivo. También puede utilizarse cuando existen dificultades cognitivas persistentes que interfieren en la vida diaria y se han definido objetivos de intervención concretos.
            </p>
            <p>
              En presencia de una enfermedad neurológica, la estimulación cognitiva debe entenderse como una parte del abordaje global y no como sustituto del seguimiento médico.
            </p>
          </section>

          <section>
            <h2>Trabajo con la familia y el entorno</h2>
            <p>
              En algunos casos, una parte importante de la intervención consiste en modificar el entorno para reducir errores y facilitar la autonomía. Esto puede incluir rutinas estables, apoyos visuales, simplificación de tareas, sistemas de recordatorio o cambios en la forma de dar instrucciones.
            </p>
            <p>
              Cuando la familia participa, el objetivo es que los apoyos sean consistentes y proporcionados, evitando tanto la sobreexigencia como sustituir capacidades que la persona todavía puede utilizar.
            </p>
          </section>

          <section>
            <h2>Relación con evaluación y deterioro cognitivo</h2>
            <p>
              Si todavía no está claro qué está ocurriendo a nivel cognitivo, puede ser más adecuado empezar por una <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a>. Si ya existe un patrón de cambios persistentes, puedes consultar también la información sobre <a href="/deterioro-cognitivo/">deterioro cognitivo</a> o <a href="/demencias/">demencias y Alzheimer</a>.
            </p>
            <div className="seo-callout">
              <strong>La intervención cognitiva debe responder a objetivos concretos.</strong>
              <span>Más ejercicios no significa necesariamente mejor tratamiento.</span>
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
              <a href="/deterioro-cognitivo/">Deterioro cognitivo</a>
              <a href="/demencias/">Demencias y Alzheimer</a>
              <a href="/familiares-y-cuidadores-de-personas-con-demencia/">Familiares y cuidadores</a>
              <a href="/ictus-y-dano-cerebral-adquirido/">Ictus y daño cerebral adquirido</a>
              <a href="/parkinson-y-cambios-cognitivos/">Parkinson y cambios cognitivos</a>
              <a href="/esclerosis-multiple-y-cambios-cognitivos/">Esclerosis múltiple y cambios cognitivos</a>
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
              Trabajo en intervención neuropsicológica con personas adultas y mayores, especialmente en deterioro cognitivo y demencias, priorizando objetivos funcionales, autonomía y adaptación al contexto cotidiano.
            </p>
            <div className="seo-authority-links">
              <a href="/sobre-mi/">Conocer mi trayectoria profesional →</a>
              <a href="/problemas-de-memoria/">Problemas de memoria y olvidos →</a>
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
