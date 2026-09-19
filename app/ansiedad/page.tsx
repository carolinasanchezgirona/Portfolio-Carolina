import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Psicóloga para ansiedad en Arenys de Mar y online",
  description:
    "Atención psicológica para ansiedad en adultos en Arenys de Mar y online. Preocupación persistente, anticipación, bloqueo, síntomas físicos y sensación de desbordamiento.",
  alternates: { canonical: "/ansiedad/" },
  openGraph: {
    title: "Psicóloga para ansiedad | Carolina Sánchez Girona",
    description: "Psicología para ansiedad en adultos, presencial en Arenys de Mar y online.",
    url: "https://carolinasanchezgirona.com/ansiedad/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Atención psicológica para ansiedad",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria" },
  areaServed: ["Arenys de Mar", "Maresme", "España"],
  serviceType: "Psicología General Sanitaria para ansiedad en adultos",
  url: "https://carolinasanchezgirona.com/ansiedad/",
};

export default function AnxietyPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/psicologia/">Psicología</a>
          <a href="/psicologa-arenys-de-mar/">Arenys de Mar</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Ansiedad</span></p>
          <p className="editorial-eyebrow">Psicología General Sanitaria · Adultos</p>
          <h1>Psicóloga para ansiedad en Arenys de Mar y online</h1>
          <p className="seo-lead">
            La ansiedad puede aparecer como preocupación constante, anticipación, tensión, síntomas físicos, evitación o sensación de no poder desconectar. El trabajo terapéutico busca comprender qué la mantiene y recuperar margen de acción en la vida cotidiana.
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
            <h2>La ansiedad no siempre se presenta de la misma manera</h2>
            <p>
              Algunas personas identifican claramente que están ansiosas. Otras llegan a consulta porque llevan semanas durmiendo peor, revisando una y otra vez decisiones, evitando situaciones, sintiendo molestias físicas o funcionando con una tensión que ya parece haberse vuelto habitual.
            </p>
            <p>
              La ansiedad es una respuesta útil cuando ayuda a detectar una amenaza y prepararse para actuar. Se convierte en un problema cuando aparece con demasiada frecuencia o intensidad, se mantiene aunque el peligro haya pasado o empieza a condicionar decisiones, relaciones, descanso o funcionamiento cotidiano.
            </p>
          </section>

          <section id="cuando-consultar">
            <h2>Señales de que puede ser útil pedir ayuda</h2>
            <ul>
              <li>Preocupación difícil de frenar incluso cuando intentas distraerte.</li>
              <li>Anticipar continuamente que algo puede salir mal.</li>
              <li>Tensión muscular, sensación de alerta o dificultad para relajarte.</li>
              <li>Evitar lugares, conversaciones, decisiones o situaciones por miedo a cómo te sentirás.</li>
              <li>Dar muchas vueltas a lo ocurrido o necesitar comprobar repetidamente si has hecho algo bien.</li>
              <li>Dificultad para dormir o descansar porque la mente sigue activa.</li>
              <li>Sensación de bloqueo, irritabilidad o agotamiento asociado a mantenerte en alerta.</li>
            </ul>
          </section>

          <section>
            <h2>Cómo se trabaja la ansiedad en terapia</h2>
            <p>
              La intervención empieza por identificar el patrón concreto de ansiedad: qué la activa, qué pensamientos o imágenes aparecen, qué sensaciones físicas la acompañan, qué haces para intentar reducirla y qué consecuencias tienen esas estrategias a corto y largo plazo.
            </p>
            <p>
              Según el caso pueden utilizarse técnicas cognitivo-conductuales, exposición gradual, trabajo sobre evitación y conductas de seguridad, regulación emocional, aceptación y compromiso, solución de problemas o intervención sobre sueño y hábitos. La elección depende de la formulación clínica, no de aplicar el mismo protocolo a todo el mundo.
            </p>
            <div className="seo-callout">
              <strong>El objetivo no es no sentir nunca ansiedad.</strong>
              <span>Se trata de que deje de dirigir la vida, ampliar tolerancia a la incertidumbre y recuperar decisiones guiadas por necesidades y objetivos reales.</span>
            </div>
          </section>

          <section>
            <h2>Ansiedad y síntomas físicos</h2>
            <p>
              La ansiedad puede acompañarse de taquicardia, opresión, molestias digestivas, temblor, mareo, tensión muscular, sensación de falta de aire u otras respuestas corporales. Estos síntomas deben interpretarse en contexto. La presencia de ansiedad no convierte automáticamente cualquier síntoma físico en psicológico.
            </p>
            <p>
              Cuando existen síntomas nuevos, intensos o dudas sobre su origen, la valoración médica puede ser necesaria. La intervención psicológica puede trabajar el impacto de esos síntomas, la anticipación, el miedo o la evitación sin sustituir una evaluación sanitaria cuando esté indicada.
            </p>
          </section>

          <section>
            <h2>Primera visita</h2>
            <p>
              La primera sesión dura 60 minutos. Revisaremos qué está ocurriendo, desde cuándo, cómo afecta a tu vida y qué has intentado hasta ahora. Si tienes informes de otros profesionales sanitarios que consideres relevantes, puedes traerlos a la consulta.
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
              <li><span>Ubicación</span><strong>Arenys de Mar</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
          </div>
          <div className="seo-card">
            <h3>Relacionados</h3>
            <div className="seo-related">
              <a href="/psicologia/">Psicología General Sanitaria</a>
              <a href="/ataques-de-panico/">Ataques de pánico</a>
              <a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación y pensamientos repetitivos</a>
              <a href="/estres-y-sobrecarga/">Estrés y sobrecarga</a>
              <a href="/insomnio-y-dificultades-para-dormir/">Insomnio y dificultades para dormir</a>
              <a href="/toma-de-decisiones-e-indecision/">Toma de decisiones e indecisión</a>
              <a href="/cambios-vitales-y-adaptacion/">Cambios vitales y adaptación</a>
              <a href="/miedo-al-rechazo-y-necesidad-de-aprobacion/">Miedo al rechazo y necesidad de aprobación</a>
              <a href="/procrastinacion-y-bloqueo/">Procrastinación y bloqueo</a>
              <a href="/ansiedad-social-y-miedo-al-ridiculo/">Ansiedad social y miedo al ridículo</a>
              <a href="/ansiedad-anticipatoria-y-preocupacion-excesiva/">Ansiedad anticipatoria y preocupación excesiva</a>
              <a href="/ansiedad-por-la-salud-e-hipocondria/">Ansiedad por la salud e hipocondría</a>
              <a href="/pensamientos-intrusivos-y-miedo-a-perder-el-control/">Pensamientos intrusivos y miedo a perder el control</a>
              <a href="/toc-obsesiones-y-compulsiones/">TOC, obsesiones y compulsiones</a>
              <a href="/perfeccionismo-y-autoexigencia/">Perfeccionismo y autoexigencia</a>
              <a href="/depresion/">Depresión y bajo estado de ánimo</a>
              <a href="/duelo/">Duelo y pérdidas</a>
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
