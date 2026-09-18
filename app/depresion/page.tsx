import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Psicóloga para depresión y bajo estado de ánimo | Arenys de Mar",
  description:
    "Atención psicológica para depresión, apatía y bajo estado de ánimo en adultos en Arenys de Mar y online. Evaluación clínica e intervención individualizada.",
  alternates: { canonical: "/depresion/" },
  openGraph: {
    title: "Depresión y bajo estado de ánimo | Carolina Sánchez Girona",
    description:
      "Psicología sanitaria para adultos con tristeza persistente, apatía, pérdida de interés o bajo estado de ánimo.",
    url: "https://carolinasanchezgirona.com/depresion/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para depresión y bajo estado de ánimo",
  provider: {
    "@type": "Person",
    name: "Carolina Sánchez Girona",
    jobTitle: "Psicóloga General Sanitaria",
    url: "https://carolinasanchezgirona.com",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en depresión y bajo estado de ánimo",
  url: "https://carolinasanchezgirona.com/depresion/",
};

export default function DepressionPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/psicologia/">Psicología</a>
          <a href="/ansiedad/">Ansiedad</a>
              <a href="/ataques-de-panico/">Ataques de pánico</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs">
            <a href="/">Inicio</a><span>·</span>
            <a href="/psicologia/">Psicología</a><span>·</span>
            <span>Depresión y bajo estado de ánimo</span>
          </p>
          <p className="editorial-eyebrow">Psicología General Sanitaria · Adultos</p>
          <h1>Depresión y bajo estado de ánimo</h1>
          <p className="seo-lead">
            Cuando la tristeza, la apatía, el agotamiento o la pérdida de interés se mantienen y empiezan a afectar al funcionamiento cotidiano, la intervención psicológica puede ayudar a comprender qué está sosteniendo el malestar y cómo recuperar capacidad de acción.
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
            <h2>No todo bajo estado de ánimo es una depresión</h2>
            <p>
              La tristeza forma parte de la experiencia humana y puede aparecer en respuesta a pérdidas, conflictos, cambios vitales o periodos de sobrecarga. Hablar de depresión requiere valorar un conjunto de síntomas, su duración, intensidad, repercusión funcional y contexto.
            </p>
            <p>
              Por eso la primera tarea clínica no es asumir un diagnóstico, sino comprender qué está ocurriendo: desde cuándo aparece el malestar, qué áreas de la vida se han visto afectadas, qué factores lo mantienen y qué recursos siguen disponibles.
            </p>
          </section>

          <section id="cuando-consultar">
            <h2>Cuándo puede ser útil pedir ayuda</h2>
            <ul>
              <li>Tristeza o vacío que se mantienen durante semanas.</li>
              <li>Pérdida de interés o placer en actividades que antes resultaban significativas.</li>
              <li>Apatía, dificultad para iniciar tareas o sensación de estar funcionando en automático.</li>
              <li>Fatiga persistente o sensación de agotamiento sin recuperación suficiente.</li>
              <li>Cambios importantes en sueño, apetito o ritmo cotidiano.</li>
              <li>Aislamiento, irritabilidad o dificultad para mantener vínculos y responsabilidades.</li>
              <li>Pensamientos muy negativos sobre uno mismo, el futuro o la propia capacidad para afrontar la situación.</li>
            </ul>
          </section>

          <section>
            <h2>Qué se evalúa en consulta</h2>
            <p>
              La evaluación incluye el estado de ánimo, la pérdida de interés, el nivel de actividad, los patrones de sueño, el funcionamiento laboral o familiar, la presencia de ansiedad, el consumo de sustancias, antecedentes relevantes y factores médicos o farmacológicos que puedan influir.
            </p>
            <p>
              También es importante diferenciar cuadros depresivos de procesos de duelo, agotamiento, trastornos de ansiedad, problemas de sueño u otras condiciones que pueden compartir síntomas como cansancio, dificultades de concentración o retraimiento.
            </p>
          </section>

          <section>
            <h2>Cómo se trabaja</h2>
            <h3>Recuperar actividad y funcionamiento</h3>
            <p>
              Cuando el estado de ánimo cae, es frecuente reducir actividades y contacto con fuentes de refuerzo. La activación conductual ayuda a reconstruir progresivamente rutinas y acciones que favorezcan funcionamiento, conexión y sensación de eficacia.
            </p>
            <h3>Trabajar patrones cognitivos</h3>
            <p>
              Puede ser útil identificar interpretaciones rígidas, sesgos negativos, autocrítica o anticipaciones que mantienen el malestar. El objetivo no es sustituir pensamientos por frases positivas, sino aumentar flexibilidad y generar respuestas más ajustadas.
            </p>
            <h3>Regular exigencia y sobrecarga</h3>
            <p>
              En algunos casos el problema no es falta de esfuerzo, sino sostener durante demasiado tiempo demandas incompatibles con los recursos disponibles. La intervención puede incluir límites, organización, descanso y toma de decisiones.
            </p>
            <h3>Revisar valores, vínculos y dirección vital</h3>
            <p>
              Cuando existe sensación de desconexión o pérdida de sentido, puede ser necesario trabajar qué áreas siguen siendo importantes, qué vínculos requieren atención y qué pasos concretos acercan a una vida más coherente con esos valores.
            </p>
          </section>

          <section>
            <h2>Depresión, ansiedad y duelo pueden solaparse</h2>
            <p>
              Es frecuente que el bajo estado de ánimo aparezca junto a preocupación, rumiación, síntomas físicos de ansiedad o una pérdida significativa. En esos casos la formulación clínica debe integrar ambos procesos en lugar de tratarlos como compartimentos separados.
            </p>
            <p>
              Si predomina la preocupación o la activación fisiológica, puedes consultar la información sobre <a href="/ansiedad/">ansiedad</a>. Si el malestar aparece tras una pérdida concreta, puede ser útil revisar también la página de <a href="/duelo/">duelo y pérdidas</a>.
            </p>
          </section>

          <section>
            <h2>Cuándo puede ser necesaria coordinación médica</h2>
            <p>
              Si los síntomas son intensos, existen antecedentes psiquiátricos, hay cambios importantes en sueño o alimentación, se está tomando medicación o aparecen dudas sobre otros factores médicos, puede ser útil coordinar la atención con medicina de familia o psiquiatría.
            </p>
            <p>
              La intervención psicológica puede formar parte de un abordaje combinado cuando está indicado.
            </p>
            <div className="seo-callout">
              <strong>El objetivo no es “animarse”.</strong>
              <span>El trabajo clínico busca comprender el patrón de mantenimiento y recuperar funcionamiento de forma gradual y sostenible.</span>
            </div>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card">
            <h2>Sesión de psicología</h2>
            <ul className="seo-facts">
              <li><span>Duración</span><strong>60 minutos</strong></li>
              <li><span>Tarifa</span><strong>60 €</strong></li>
              <li><span>Modalidad</span><strong>Presencial y online</strong></li>
              <li><span>Pacientes</span><strong>Adultos</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
          </div>
          <div className="seo-card">
            <h3>Áreas relacionadas</h3>
            <div className="seo-related">
              <a href="/psicologia/">Psicología General Sanitaria</a>
              <a href="/ansiedad/">Ansiedad</a>
              <a href="/duelo/">Duelo y pérdidas</a>
              <a href="/rupturas-de-pareja/">Rupturas de pareja</a>
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
              Trabajo en clínica de adultos integrando evaluación, formulación clínica y estrategias basadas en evidencia, adaptadas al contexto y a los objetivos de cada persona.
            </p>
            <div className="seo-authority-links">
              <a href="/sobre-mi/">Conocer mi trayectoria profesional →</a>
              <a href="/psicologia/">Ver Psicología General Sanitaria →</a>
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
