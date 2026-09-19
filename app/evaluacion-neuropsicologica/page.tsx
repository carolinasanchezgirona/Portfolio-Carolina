import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Evaluación neuropsicológica en Arenys de Mar",
  description:
    "Evaluación neuropsicológica en Arenys de Mar: memoria, atención, lenguaje, funciones ejecutivas y funcionamiento cotidiano. Valoración individualizada y devolución clínica.",
  alternates: { canonical: "/evaluacion-neuropsicologica/" },
  openGraph: {
    title: "Evaluación neuropsicológica | Carolina Sánchez Girona",
    description: "Valoración de memoria, atención, lenguaje y funciones ejecutivas en Arenys de Mar.",
    url: "https://carolinasanchezgirona.com/evaluacion-neuropsicologica/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  serviceType: "Evaluación neuropsicológica",
  url: "https://carolinasanchezgirona.com/evaluacion-neuropsicologica/",
};

export default function NeuropsychAssessmentPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/neuropsicologia/">Neuropsicología</a>
          <a href="/psicologa-arenys-de-mar/">Arenys de Mar</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Evaluación</span></p>
          <p className="editorial-eyebrow">Neuropsicología clínica</p>
          <h1>Evaluación neuropsicológica en Arenys de Mar</h1>
          <p className="seo-lead">
            Una evaluación neuropsicológica permite estudiar de forma estructurada el funcionamiento de memoria, atención, lenguaje, funciones ejecutivas y otras capacidades cognitivas, integrando los resultados con la historia y la vida cotidiana de la persona.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir primera visita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#proceso">Cómo es la evaluación</a>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section>
            <h2>¿Para qué sirve una evaluación neuropsicológica?</h2>
            <p>
              La evaluación ayuda a describir qué capacidades están preservadas, cuáles muestran dificultades y cómo se relacionan esos resultados con el funcionamiento diario. Puede aportar información útil cuando existen quejas cognitivas, cambios observados por la familia, antecedentes neurológicos o necesidad de seguimiento.
            </p>
            <p>
              No debe interpretarse como una batería de tests aislada. Las puntuaciones adquieren significado cuando se comparan con la historia clínica, el nivel previo de funcionamiento, la evolución de los síntomas y otros factores médicos, emocionales o contextuales.
            </p>
          </section>

          <section>
            <h2>Qué funciones pueden explorarse</h2>
            <ul>
              <li>Memoria y aprendizaje.</li>
              <li>Atención y velocidad de procesamiento.</li>
              <li>Lenguaje y acceso léxico.</li>
              <li>Funciones ejecutivas: planificación, flexibilidad, inhibición y resolución de problemas.</li>
              <li>Habilidades visuoespaciales y visuoconstructivas.</li>
              <li>Aspectos emocionales y conductuales cuando son relevantes para interpretar el rendimiento.</li>
              <li>Repercusión de las dificultades en autonomía y actividades de la vida diaria.</li>
            </ul>
          </section>

          <section id="proceso">
            <h2>Cómo es el proceso de evaluación</h2>
            <h3>Primera entrevista</h3>
            <p>
              Se revisa el motivo de consulta, la evolución de los cambios, antecedentes médicos y neurológicos, medicación, nivel educativo y laboral, funcionamiento cotidiano y documentación disponible. Si es necesario, puede incorporarse información de un familiar con autorización de la persona evaluada.
            </p>
            <h3>Selección y administración de pruebas</h3>
            <p>
              Las pruebas se eligen en función de la pregunta clínica. No existe una batería única válida para todos los casos. El objetivo es obtener la información necesaria sin convertir la evaluación en una aplicación mecánica de instrumentos.
            </p>
            <h3>Integración de resultados</h3>
            <p>
              Se analizan los resultados considerando edad, escolaridad, historia, funcionamiento previo, estado emocional y posibles factores médicos. Cuando existen datos de evaluaciones anteriores, la comparación longitudinal puede aportar información especialmente útil.
            </p>
            <h3>Devolución y recomendaciones</h3>
            <p>
              Los resultados se explican de forma comprensible, destacando fortalezas, dificultades y su posible repercusión funcional. A partir de ahí pueden plantearse recomendaciones de seguimiento, intervención, estrategias compensatorias o coordinación con otros profesionales sanitarios.
            </p>
          </section>

          <section>
            <h2>Qué documentación puede ser útil</h2>
            <p>
              Si dispones de informes de neurología, geriatría, psiquiatría, psicología, pruebas de imagen, analíticas relevantes, informes hospitalarios o evaluaciones neuropsicológicas previas, puedes traerlos a la primera visita. También es útil disponer de una lista actualizada de medicación.
            </p>
            <p>
              No es necesario enviar documentación clínica por el formulario de reserva. En la primera entrevista se decidirá qué información resulta pertinente para la evaluación.
            </p>
          </section>

          <section>
            <h2>Evaluación no significa diagnóstico automático</h2>
            <p>
              Un rendimiento bajo en una prueba no equivale por sí solo a un diagnóstico. Sueño, dolor, ansiedad, depresión, fatiga, medicación, alteraciones sensoriales y otras variables pueden influir en los resultados. La interpretación debe integrar todos esos factores y, cuando corresponde, coordinarse con la valoración médica.
            </p>
            <div className="seo-callout">
              <strong>El dato importante no es solo cuánto puntúa una persona.</strong>
              <span>También importa cómo funciona, qué ha cambiado respecto a antes y qué consecuencias tiene ese cambio en su vida diaria.</span>
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
            <p className="seo-local-note">La extensión total de una evaluación depende de la pregunta clínica y de las pruebas necesarias.</p>
          </div>
          <div className="seo-card">
            <h3>Relacionados</h3>
            <div className="seo-related">
              <a href="/neuropsicologia/">Neuropsicología</a>
              <a href="/deterioro-cognitivo/">Deterioro cognitivo</a>
              <a href="/deterioro-cognitivo-leve/">Deterioro cognitivo leve</a>
              <a href="/ictus-y-dano-cerebral-adquirido/">Ictus y daño cerebral adquirido</a>
              <a href="/problemas-de-atencion-y-concentracion-en-adultos/">Problemas de atención y concentración</a>
              <a href="/funciones-ejecutivas-y-planificacion-en-adultos/">Funciones ejecutivas y planificación</a>
              <a href="/parkinson-y-cambios-cognitivos/">Parkinson y cambios cognitivos</a>
              <a href="/esclerosis-multiple-y-cambios-cognitivos/">Esclerosis múltiple y cambios cognitivos</a>
              <a href="/epilepsia-y-cambios-cognitivos/">Epilepsia y cambios cognitivos</a>
              <a href="/covid-persistente-y-niebla-mental/">COVID persistente y niebla mental</a>
              <a href="/rehabilitacion-neuropsicologica/">Rehabilitación neuropsicológica</a>
              <a href="/psicologa-arenys-de-mar/">Consulta en Arenys de Mar</a>
            </div>
          </div>
        </aside>
      </div>

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
