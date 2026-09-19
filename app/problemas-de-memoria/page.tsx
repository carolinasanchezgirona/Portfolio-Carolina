import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Problemas de memoria y olvidos en adultos | Arenys de Mar",
  description:
    "Valoración neuropsicológica de problemas de memoria y olvidos en adultos en Arenys de Mar. Diferenciar quejas subjetivas, factores emocionales y posibles cambios cognitivos.",
  alternates: { canonical: "/problemas-de-memoria/" },
  openGraph: {
    title: "Problemas de memoria y olvidos | Carolina Sánchez Girona",
    description:
      "Valoración neuropsicológica cuando aparecen olvidos, fallos de memoria o dudas sobre cambios cognitivos.",
    url: "https://carolinasanchezgirona.com/problemas-de-memoria/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Valoración neuropsicológica de problemas de memoria",
  provider: {
    "@type": "Person",
    name: "Carolina Sánchez Girona",
    jobTitle: "Neuropsicóloga",
    url: "https://carolinasanchezgirona.com",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  serviceType: "Valoración neuropsicológica de problemas de memoria y olvidos en adultos",
  url: "https://carolinasanchezgirona.com/problemas-de-memoria/",
};

export default function MemoryProblemsPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/neuropsicologia/">Neuropsicología</a>
          <a href="/evaluacion-neuropsicologica/">Evaluación</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs">
            <a href="/">Inicio</a><span>·</span>
            <a href="/neuropsicologia/">Neuropsicología</a><span>·</span>
            <span>Problemas de memoria</span>
          </p>
          <p className="editorial-eyebrow">Neuropsicología · Memoria</p>
          <h1>Problemas de memoria y olvidos en adultos</h1>
          <p className="seo-lead">
            Cuando los olvidos empiezan a preocupar, una valoración neuropsicológica puede ayudar a describir qué está ocurriendo, qué factores pueden estar influyendo y si conviene realizar un seguimiento más específico.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir primera visita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section>
            <h2>Los fallos de memoria no tienen una única explicación</h2>
            <p>
              Olvidar una cita, tardar en encontrar una palabra o necesitar más apoyos para organizarse no significa por sí solo que exista deterioro cognitivo. La memoria puede verse afectada por múltiples factores, entre ellos el sueño, la ansiedad, el estado de ánimo, el dolor, el estrés, determinados tratamientos farmacológicos y algunas enfermedades médicas.
            </p>
            <p>
              La valoración neuropsicológica permite analizar el patrón de dificultades, compararlo con otras capacidades cognitivas y relacionarlo con el funcionamiento cotidiano. El objetivo no es etiquetar un olvido aislado, sino comprender si existe un cambio relevante respecto al funcionamiento previo.
            </p>
          </section>

          <section id="cuando-consultar">
            <h2>Cuándo puede ser útil valorar la memoria</h2>
            <ul>
              <li>Olvidos que se repiten y generan preocupación.</li>
              <li>Dificultad para recordar conversaciones, citas o información reciente.</li>
              <li>Necesidad creciente de agendas, notas o recordatorios para tareas que antes se manejaban con facilidad.</li>
              <li>Sensación de tener la memoria peor que antes, aunque se mantenga la autonomía.</li>
              <li>Preocupación de familiares por cambios recientes en memoria o atención.</li>
              <li>Dudas sobre si los cambios forman parte del envejecimiento habitual o requieren una exploración más completa.</li>
              <li>Necesidad de establecer una línea base para poder comparar la evolución en el futuro.</li>
            </ul>
          </section>

          <section>
            <h2>Qué se explora además de la memoria</h2>
            <p>
              La memoria no funciona de forma aislada. Para interpretar adecuadamente una queja de memoria puede ser necesario explorar atención, velocidad de procesamiento, lenguaje, funciones ejecutivas, aprendizaje y otros procesos cognitivos.
            </p>
            <p>
              También se revisan antecedentes, evolución de los síntomas, estado emocional, sueño, medicación y autonomía en actividades de la vida diaria. Esta integración ayuda a diferenciar perfiles que pueden parecer similares en la vida cotidiana pero responden a mecanismos distintos.
            </p>
          </section>

          <section>
            <h2>Queja subjetiva, envejecimiento y deterioro cognitivo</h2>
            <p>
              Algunas personas perciben cambios de memoria sin que la exploración muestre un deterioro objetivo. En otros casos aparecen dificultades medibles que todavía no comprometen de forma importante la autonomía. Cuando los cambios son persistentes y empiezan a afectar al funcionamiento cotidiano, puede ser necesario ampliar la valoración y coordinar el seguimiento con otros profesionales sanitarios.
            </p>
            <p>
              La evaluación neuropsicológica aporta información sobre el perfil cognitivo, pero no sustituye la valoración médica cuando existe sospecha de una enfermedad neurológica. Si ya hay cambios funcionales relevantes o un diagnóstico previo, puedes consultar la página específica sobre <a href="/deterioro-cognitivo/">deterioro cognitivo</a>.
            </p>
          </section>

          <section>
            <h2>Qué cambios pueden formar parte del envejecimiento normal</h2>
            <p>
              Con la edad puede ser normal necesitar algo más de tiempo para recuperar una palabra, aprender información nueva con menor rapidez o notar menos agilidad cuando se realizan varias tareas a la vez. Estos cambios, por sí solos, no indican una enfermedad neurodegenerativa.
            </p>
            <p>
              Conviene prestar más atención cuando los olvidos son repetitivos, existe desorientación, aparecen dificultades nuevas para gestionar medicación, dinero o citas, la familia observa una progresión clara o empieza a reducirse la autonomía. En esos casos, una evaluación puede ayudar a distinguir cambios esperables de un patrón que requiera seguimiento.
            </p>
          </section>

          <section>
            <h2>Cómo es la valoración</h2>
            <h3>1. Entrevista clínica</h3>
            <p>
              Se revisan los cambios percibidos, desde cuándo aparecen, en qué situaciones se hacen más evidentes y cómo repercuten en la vida cotidiana. Cuando resulta útil y la persona lo autoriza, puede incorporarse información de un familiar.
            </p>
            <h3>2. Exploración neuropsicológica</h3>
            <p>
              Se seleccionan pruebas estandarizadas según la pregunta clínica. No existe una única batería válida para todos los casos: el protocolo se adapta a la edad, antecedentes, nivel educativo, síntomas y objetivos de la evaluación.
            </p>
            <h3>3. Integración de resultados</h3>
            <p>
              Las puntuaciones se interpretan junto con la entrevista, la observación clínica y el funcionamiento cotidiano. Esto permite describir capacidades preservadas, áreas de dificultad y posibles factores moduladores.
            </p>
            <h3>4. Devolución y recomendaciones</h3>
            <p>
              Se explican los resultados y se plantean los siguientes pasos. Según el caso, puede ser suficiente ofrecer estrategias y seguimiento, o puede recomendarse ampliar el estudio médico o realizar controles neuropsicológicos posteriores.
            </p>
          </section>

          <section>
            <h2>Qué puedes traer a la primera visita</h2>
            <p>
              Si dispones de informes de neurología, geriatría, psiquiatría, psicología, analíticas, pruebas de imagen o evaluaciones cognitivas previas, puedes traerlos. También resulta útil conocer la medicación actual y ejemplos concretos de situaciones en las que notas los fallos de memoria.
            </p>
            <div className="seo-callout">
              <strong>Un olvido aislado aporta poca información.</strong>
              <span>Lo clínicamente útil es analizar el patrón, la evolución y su impacto en la vida diaria.</span>
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
              <a href="/problemas-de-atencion-y-concentracion-en-adultos/">Problemas de atención y concentración</a>
              <a href="/epilepsia-y-cambios-cognitivos/">Epilepsia y cambios cognitivos</a>
              <a href="/covid-persistente-y-niebla-mental/">COVID persistente y niebla mental</a>
              <a href="/alzheimer-primeros-sintomas-y-evaluacion/">Alzheimer: primeros síntomas y evaluación</a>
              <a href="/psicologa-arenys-de-mar/">Consulta en Arenys de Mar</a>
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
              Mi experiencia está especialmente vinculada a la evaluación y el seguimiento del deterioro cognitivo y las demencias. La valoración de memoria se integra siempre con el resto del perfil cognitivo, el estado emocional y el funcionamiento cotidiano.
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
