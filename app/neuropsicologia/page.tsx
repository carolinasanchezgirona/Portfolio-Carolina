import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Neuropsicóloga en Arenys de Mar | Evaluación Neuropsicológica",
  description:
    "Neuropsicología en Arenys de Mar: evaluación e intervención en memoria, atención, lenguaje, funciones ejecutivas, deterioro cognitivo y demencias.",
  alternates: { canonical: "/neuropsicologia/" },
  openGraph: {
    title: "Neuropsicología en Arenys de Mar | Carolina Sánchez Girona",
    description:
      "Evaluación e intervención neuropsicológica en Arenys de Mar y seguimiento cuando es necesario comprender mejor el perfil cognitivo.",
    url: "https://carolinasanchezgirona.com/neuropsicologia/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Neuropsicología",
  provider: {
    "@type": "Person",
    name: "Carolina Sánchez Girona",
    jobTitle: "Neuropsicóloga",
    url: "https://carolinasanchezgirona.com",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  serviceType: "Evaluación e intervención neuropsicológica",
  url: "https://carolinasanchezgirona.com/neuropsicologia/",
};

export default function NeuropsychologyPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/psicologa-arenys-de-mar/">Arenys de Mar</a>
          <a href="/psicologia/">Psicología</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Neuropsicología</span></p>
          <p className="editorial-eyebrow">Evaluación e intervención neuropsicológica</p>
          <h1>Neuropsicología en Arenys de Mar</h1>
          <p className="seo-lead">
            Evaluación del funcionamiento cognitivo y acompañamiento neuropsicológico cuando existen cambios o dificultades en memoria, atención, lenguaje, funciones ejecutivas o autonomía cotidiana.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section>
            <h2>¿Qué evalúa la neuropsicología?</h2>
            <p>
              La neuropsicología estudia cómo funcionan procesos cognitivos como la memoria, la atención, el lenguaje, la planificación, la velocidad de procesamiento o la regulación de la conducta, y cómo ese funcionamiento se relaciona con la vida cotidiana de la persona.
            </p>
            <p>
              Una evaluación no consiste únicamente en obtener puntuaciones. El objetivo es integrar entrevista clínica, historia, observación, pruebas estandarizadas y funcionamiento diario para construir un perfil cognitivo que sea clínicamente útil. <a href="/evaluacion-neuropsicologica/">Ver cómo se realiza una evaluación neuropsicológica.</a>
            </p>
          </section>

          <section id="cuando-consultar">
            <h2>Cuándo puede ser útil una valoración neuropsicológica</h2>
            <ul>
              <li>Olvidos o cambios de memoria que generan preocupación.</li>
              <li>Dificultades para mantener la atención o seguir tareas complejas.</li>
              <li>Problemas de lenguaje, planificación u organización.</li>
              <li>Cambios cognitivos asociados al envejecimiento o a una enfermedad neurológica.</li>
              <li>Dudas sobre deterioro cognitivo o evolución de una demencia.</li>
              <li>Necesidad de seguimiento para comparar cambios a lo largo del tiempo.</li>
            </ul>
            <p>
              No toda queja cognitiva implica una enfermedad neurodegenerativa. El sueño, el estado de ánimo, la ansiedad, el dolor, la medicación, el estrés y otros factores médicos también pueden influir en el rendimiento. Por eso es importante interpretar los resultados dentro del contexto completo de la persona.
            </p>
          </section>

          <section>
            <h2>Cómo es una evaluación neuropsicológica</h2>
            <h3>1. Entrevista clínica</h3>
            <p>
              Se revisa el motivo de consulta, la evolución de los cambios, antecedentes médicos y neurológicos, medicación, funcionamiento diario y cualquier información relevante. Cuando es útil y la persona lo autoriza, puede incorporarse información de familiares o cuidadores.
            </p>
            <h3>2. Exploración cognitiva</h3>
            <p>
              Se seleccionan pruebas estandarizadas según la pregunta clínica. No todas las evaluaciones requieren exactamente los mismos instrumentos: el protocolo se adapta al objetivo, la edad, los antecedentes y las dificultades observadas.
            </p>
            <h3>3. Integración e interpretación</h3>
            <p>
              Los resultados se interpretan junto con la historia y el funcionamiento cotidiano. La finalidad es diferenciar capacidades preservadas, áreas de dificultad y posibles factores que estén influyendo en el rendimiento.
            </p>
            <h3>4. Devolución y recomendaciones</h3>
            <p>
              Se explican los resultados de forma comprensible y se plantean recomendaciones. Según el caso, puede ser conveniente seguimiento, intervención cognitiva, estrategias compensatorias, coordinación con otros profesionales o nueva valoración en el futuro.
            </p>
          </section>

          <section>
            <h2>Deterioro cognitivo y demencias</h2>
            <p>
              En personas mayores, la valoración neuropsicológica puede ayudar a distinguir entre cambios esperables asociados a la edad, dificultades relacionadas con factores emocionales o médicos y patrones que requieren una exploración más profunda.
            </p>
            <p>
              En situaciones de deterioro cognitivo o demencia, el trabajo no termina en el diagnóstico. También puede incluir seguimiento, estimulación o rehabilitación cognitiva, adaptación de estrategias para la vida diaria, orientación a familiares y coordinación con el resto del equipo sanitario. <a href="/deterioro-cognitivo/">Más información sobre deterioro cognitivo y problemas de memoria.</a>
            </p>
          </section>

          <section>
            <h2>Qué traer a la primera visita</h2>
            <p>
              Si dispones de informes de neurología, psiquiatría, psicología, geriatría u otras especialidades, resultados de pruebas, informes hospitalarios o información sobre tratamientos actuales, puedes traerlos a la sesión. Esa documentación puede ayudar a reconstruir la evolución clínica y evitar repetir información innecesariamente.
            </p>
            <p>
              No es necesario enviarla previamente a través del formulario de reserva. La primera visita permite valorar qué documentación es realmente relevante para el proceso.
            </p>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card">
            <h2>Consulta de neuropsicología</h2>
            <ul className="seo-facts">
              <li><span>Primera sesión</span><strong>60 minutos</strong></li>
              <li><span>Tarifa sesión</span><strong>60 €</strong></li>
              <li><span>Ubicación</span><strong>Arenys de Mar</strong></li>
              <li><span>Área</span><strong>Maresme</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
          </div>
          <div className="seo-card">
            <h3>Áreas relacionadas</h3>
            <div className="seo-related">
              <a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a>
              <a href="/problemas-de-memoria/">Problemas de memoria y olvidos</a>
              <a href="/deterioro-cognitivo/">Deterioro cognitivo</a>
              <a href="/demencias/">Demencias y Alzheimer</a>
              <a href="/psicologa-arenys-de-mar/">Consulta en Arenys de Mar</a>
              <a href="/psicologia/">Psicología General Sanitaria</a>
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
              Mi experiencia está especialmente vinculada al deterioro cognitivo, las demencias y el trabajo clínico con personas y familias. Integro evaluación estructurada, funcionamiento cotidiano y contexto para que los resultados tengan utilidad práctica.
            </p>
            <div className="seo-authority-links">
              <a href="https://psiara.cat/2026/08/05/la-capacitat-per-testar-en-el-dret-civil-catala-des-duna-perspectiva-neuropsicologica/" target="_blank" rel="noopener noreferrer">Leer publicación en PsiAra sobre capacidad y evaluación neuropsicológica ↗</a>
              <a href="https://www.linkedin.com/in/carolina-s%C3%A1nchez-girona-43b3b94a/" target="_blank" rel="noopener noreferrer">Perfil profesional en LinkedIn ↗</a>
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
