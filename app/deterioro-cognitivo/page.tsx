import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Deterioro cognitivo y problemas de memoria en Arenys de Mar",
  description:
    "Neuropsicología para deterioro cognitivo y problemas de memoria en Arenys de Mar. Evaluación, seguimiento, orientación a familias e intervención cognitiva.",
  alternates: { canonical: "/deterioro-cognitivo/" },
  openGraph: {
    title: "Deterioro cognitivo y memoria | Carolina Sánchez Girona",
    description: "Evaluación y seguimiento neuropsicológico en problemas de memoria y deterioro cognitivo.",
    url: "https://carolinasanchezgirona.com/deterioro-cognitivo/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación y seguimiento de deterioro cognitivo",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  serviceType: "Neuropsicología para deterioro cognitivo y problemas de memoria",
  url: "https://carolinasanchezgirona.com/deterioro-cognitivo/",
};

export default function CognitiveDeclinePage() {
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
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Deterioro cognitivo</span></p>
          <p className="editorial-eyebrow">Neuropsicología · Memoria y envejecimiento</p>
          <h1>Deterioro cognitivo y problemas de memoria en Arenys de Mar</h1>
          <p className="seo-lead">
            Cuando aparecen olvidos, desorientación, dificultades de planificación o cambios en la autonomía, una valoración neuropsicológica puede ayudar a comprender mejor qué está ocurriendo y qué seguimiento necesita la persona.
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
            <h2>No todos los olvidos significan lo mismo</h2>
            <p>
              La memoria cambia con la edad y también puede verse afectada por sueño, ansiedad, depresión, dolor, estrés, medicación, enfermedades médicas o situaciones vitales exigentes. Por eso un olvido aislado no permite concluir que exista deterioro cognitivo.
            </p>
            <p>
              Lo relevante es observar el patrón: qué ha cambiado respecto al funcionamiento previo, desde cuándo, con qué frecuencia ocurre y si empieza a interferir en tareas que antes se realizaban con normalidad.
            </p>
          </section>

          <section id="cuando-consultar">
            <h2>Cuándo puede ser recomendable una valoración</h2>
            <ul>
              <li>Olvidos frecuentes que generan preocupación en la persona o en la familia.</li>
              <li>Repetir preguntas o conversaciones sin recordar haberlas tenido.</li>
              <li>Dificultad creciente para organizar citas, pagos, medicación o tareas cotidianas.</li>
              <li>Desorientación en lugares conocidos o problemas para seguir rutas habituales.</li>
              <li>Cambios llamativos en lenguaje, planificación, juicio o resolución de problemas.</li>
              <li>Pérdida de autonomía o necesidad creciente de supervisión.</li>
              <li>Necesidad de comparar el funcionamiento actual con una evaluación previa.</li>
            </ul>
          </section>

          <section>
            <h2>Qué aporta la evaluación neuropsicológica</h2>
            <p>
              La evaluación permite describir el perfil cognitivo y valorar qué áreas se encuentran preservadas y cuáles presentan dificultades. Esa información puede ayudar a orientar el seguimiento, plantear estrategias para la vida diaria y aportar datos complementarios a la valoración médica.
            </p>
            <p>
              La neuropsicología no sustituye el diagnóstico médico de las enfermedades neurológicas. Su aportación es caracterizar el funcionamiento cognitivo, emocional y funcional de forma detallada y relacionarlo con la vida cotidiana de la persona.
            </p>
          </section>

          <section>
            <h2>Seguimiento e intervención</h2>
            <p>
              Cuando existe deterioro cognitivo, el trabajo puede incluir seguimiento periódico, estimulación o rehabilitación cognitiva, estrategias compensatorias, adaptación de rutinas y orientación a familiares o cuidadores. El objetivo no es únicamente entrenar ejercicios, sino mantener la mayor autonomía y calidad de vida posibles dentro de la situación de cada persona.
            </p>
            <p>
              En algunos casos resulta especialmente útil revisar el entorno: cómo se organiza la medicación, qué apoyos existen, qué tareas todavía puede realizar la persona con seguridad y cuáles requieren supervisión o adaptación.
            </p>
            <div className="seo-callout">
              <strong>El diagnóstico no explica por sí solo cómo funciona una persona.</strong>
              <span>La intervención debe partir de capacidades reales, dificultades concretas y necesidades del día a día.</span>
            </div>
          </section>

          <section>
            <h2>Trabajo con familias y cuidadores</h2>
            <p>
              Los cambios cognitivos afectan también al entorno. La familia puede necesitar comprender qué conductas dependen del deterioro, cómo comunicarse de forma más eficaz, qué expectativas son realistas y cómo reducir conflictos o situaciones de sobrecarga.
            </p>
            <p>
              La orientación busca traducir la información clínica en decisiones prácticas: cómo ayudar sin sustituir innecesariamente, cómo estructurar rutinas y cómo reconocer señales que requieren nueva valoración sanitaria.
            </p>
          </section>

          <section>
            <h2>Qué traer a la primera visita</h2>
            <p>
              Si dispones de informes de neurología, geriatría, psiquiatría, psicología, pruebas de imagen, analíticas, informes hospitalarios o evaluaciones previas, puedes traerlos. También es útil conocer la medicación actual y los cambios observados en la vida cotidiana.
            </p>
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
            <h3>Relacionados</h3>
            <div className="seo-related">
              <a href="/neuropsicologia/">Neuropsicología</a>
              <a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a>
              <a href="/problemas-de-memoria/">Problemas de memoria y olvidos</a>
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
