import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Psicóloga General Sanitaria en Arenys de Mar",
  description:
    "Psicología General Sanitaria para adultos en Arenys de Mar y online. Ansiedad, estado de ánimo, duelo, relaciones, sobrecarga y cambios vitales.",
  alternates: { canonical: "/psicologia/" },
  openGraph: {
    title: "Psicología General Sanitaria | Carolina Sánchez Girona",
    description:
      "Atención psicológica para adultos en Arenys de Mar y online.",
    url: "https://carolinasanchezgirona.com/psicologia/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología General Sanitaria",
  provider: {
    "@type": "Person",
    name: "Carolina Sánchez Girona",
    jobTitle: "Psicóloga General Sanitaria",
    url: "https://carolinasanchezgirona.com",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Psicología General Sanitaria para adultos",
  url: "https://carolinasanchezgirona.com/psicologia/",
};

export default function PsychologyPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/psicologa-arenys-de-mar/">Arenys de Mar</a>
          <a href="/neuropsicologia/">Neuropsicología</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Psicología</span></p>
          <p className="editorial-eyebrow">Psicología General Sanitaria · Adultos</p>
          <h1>Psicología para adultos en Arenys de Mar y online</h1>
          <p className="seo-lead">
            Un espacio clínico para comprender qué está sosteniendo el malestar y trabajar con objetivos concretos, sin reducir la experiencia de la persona a una etiqueta diagnóstica.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#motivos-consulta">Motivos de consulta</a>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section>
            <h2>¿Cuándo puede ser útil consultar?</h2>
            <p>
              Pedir ayuda psicológica no requiere esperar a que el malestar sea extremo. A veces la consulta comienza porque una dificultad concreta se ha mantenido demasiado tiempo; otras, porque varias áreas de la vida empiezan a resentirse a la vez.
            </p>
            <p>
              La primera sesión sirve para ordenar la situación actual, revisar antecedentes relevantes, comprender qué factores mantienen el problema y valorar qué tipo de intervención puede ser más adecuada.
            </p>
          </section>

          <section id="motivos-consulta">
            <h2>Motivos de consulta frecuentes</h2>
            <h3>Ansiedad y preocupación persistente</h3>
            <p>
              Preocupación difícil de frenar, sensación de alerta, síntomas físicos, anticipación, miedo a determinadas situaciones o sensación de no poder desconectar. El trabajo no se limita a reducir síntomas: también busca comprender qué función están cumpliendo y qué patrones los mantienen. <a href="/ansiedad/">Más información sobre el trabajo con ansiedad.</a>
            </p>
            <h3>Estado de ánimo y apatía</h3>
            <p>
              Periodos de tristeza, pérdida de interés, agotamiento, irritabilidad o sensación de desconexión. La intervención puede centrarse en recuperar funcionamiento, identificar factores de mantenimiento y reconstruir rutinas, vínculos y objetivos que tengan sentido para la persona.
            </p>
            <h3>Duelo y pérdidas</h3>
            <p>
              El duelo puede aparecer tras una muerte, una ruptura, una pérdida de salud, un cambio de rol o una etapa vital que termina. No se trata de acelerar el proceso, sino de ayudar a integrar lo ocurrido y recuperar capacidad de adaptación sin negar el impacto de la pérdida. <a href="/duelo/">Más información sobre duelo y pérdidas.</a>
            </p>
            <h3>Relaciones, límites y decisiones</h3>
            <p>
              Dificultades para poner límites, relaciones que generan sufrimiento, dependencia emocional, conflictos repetidos o decisiones que se vuelven difíciles de sostener. En estos casos se trabaja sobre patrones relacionales, necesidades, expectativas y capacidad de elección.
            </p>
            <h3>Sobrecarga y cambios vitales</h3>
            <p>
              Etapas de mucha exigencia, responsabilidades acumuladas, cambios laborales, familiares o personales pueden generar sensación de saturación. La terapia ayuda a discriminar qué puede modificarse, qué necesita ser aceptado y qué recursos conviene reforzar.
            </p>
          </section>

          <section>
            <h2>Cómo trabajo en terapia</h2>
            <p>
              El proceso parte de una formulación clínica individualizada. Eso significa integrar síntomas, historia, contexto, aprendizaje, relaciones, factores de vulnerabilidad y recursos actuales para construir una explicación útil del problema.
            </p>
            <p>
              A partir de ahí se acuerdan objetivos y se seleccionan estrategias basadas en evidencia. Según el caso, pueden incorporarse procedimientos cognitivo-conductuales, estrategias de regulación emocional, aceptación y compromiso, exposición, activación conductual, trabajo con toma de decisiones o intervención sobre patrones relacionales.
            </p>
            <div className="seo-callout">
              <strong>Comprender primero. Intervenir después.</strong>
              <span>La técnica tiene sentido cuando responde a una hipótesis clínica y a un objetivo concreto.</span>
            </div>
          </section>

          <section>
            <h2>Qué ocurre en la primera visita</h2>
            <p>
              La primera sesión dura 60 minutos y se centra en comprender el motivo de consulta, la situación actual y los antecedentes que puedan ser relevantes. No necesitas preparar un relato perfecto ni explicar tu historia por escrito antes de venir.
            </p>
            <p>
              Si dispones de informes previos de psicología, psiquiatría u otros profesionales sanitarios que consideres relacionados con la consulta, puedes traerlos a la sesión. No es necesario enviarlos mediante el formulario de reserva.
            </p>
          </section>

          <section>
            <h2>Psicología presencial y online</h2>
            <p>
              La atención presencial se realiza en Arenys de Mar. También se ofrece modalidad online cuando resulta adecuada para el motivo de consulta y las necesidades de la persona. En ambos casos se mantiene el mismo encuadre clínico, duración y confidencialidad.
            </p>
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
              <a href="/ansiedad/">Ansiedad</a>
              <a href="/ataques-de-panico/">Ataques de pánico</a>
              <a href="/depresion/">Depresión y bajo estado de ánimo</a>
              <a href="/duelo/">Duelo y pérdidas</a>
              <a href="/rupturas-de-pareja/">Rupturas de pareja</a>
              <a href="/dependencia-emocional/">Dependencia emocional</a>
              <a href="/limites-y-relaciones-dificiles/">Límites y relaciones difíciles</a>
              <a href="/autoestima-y-autocritica/">Autoestima y autocrítica</a>
              <a href="/perfeccionismo-y-autoexigencia/">Perfeccionismo y autoexigencia</a>
              <a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación y pensamientos repetitivos</a>
              <a href="/estres-y-sobrecarga/">Estrés y sobrecarga</a>
              <a href="/insomnio-y-dificultades-para-dormir/">Insomnio y dificultades para dormir</a>
              <a href="/toma-de-decisiones-e-indecision/">Toma de decisiones e indecisión</a>
              <a href="/cambios-vitales-y-adaptacion/">Cambios vitales y adaptación</a>
              <a href="/culpa-y-dificultad-para-perdonarse/">Culpa y dificultad para perdonarse</a>
              <a href="/miedo-al-rechazo-y-necesidad-de-aprobacion/">Miedo al rechazo y necesidad de aprobación</a>
              <a href="/procrastinacion-y-bloqueo/">Procrastinación y bloqueo</a>
              <a href="/dificultad-para-desconectar-del-trabajo/">Dificultad para desconectar del trabajo</a>
              <a href="/burnout-y-agotamiento-laboral/">Burnout y agotamiento laboral</a>
              <a href="/ansiedad-social-y-miedo-al-ridiculo/">Ansiedad social y miedo al ridículo</a>
              <a href="/ansiedad-anticipatoria-y-preocupacion-excesiva/">Ansiedad anticipatoria y preocupación excesiva</a>
              <a href="/ansiedad-por-la-salud-e-hipocondria/">Ansiedad por la salud e hipocondría</a>
              <a href="/pensamientos-intrusivos-y-miedo-a-perder-el-control/">Pensamientos intrusivos y miedo a perder el control</a>
              <a href="/toc-obsesiones-y-compulsiones/">TOC, obsesiones y compulsiones</a>
              <a href="/psicologa-arenys-de-mar/">Consulta en Arenys de Mar</a>
              <a href="/neuropsicologia/">Neuropsicología</a>
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
              Trabajo en clínica de adultos y neuropsicología desde una perspectiva basada en evidencia, integrando evaluación, formulación clínica y objetivos terapéuticos concretos.
            </p>
            <div className="seo-authority-links">
              <a href="https://psiara.cat/2026/08/06/cuando-el-dolor-no-encuentra-un-lugar/" target="_blank" rel="noopener noreferrer">Leer publicación en PsiAra sobre dolor persistente y práctica psicológica ↗</a>
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
