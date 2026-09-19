import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Envejecimiento cognitivo normal o deterioro | Neuropsicóloga en Arenys de Mar",
  description: "Diferencias entre cambios cognitivos esperables con la edad y señales que pueden justificar una evaluación neuropsicológica. Consulta en Arenys de Mar.",
  alternates: { canonical: "/envejecimiento-cognitivo-normal-o-deterioro/" },
  openGraph: {
    title: "Envejecimiento cognitivo normal o deterioro | Carolina Sánchez Girona",
    description: "Neuropsicología para orientar dudas sobre memoria, atención y cambios cognitivos asociados al envejecimiento.",
    url: "https://carolinasanchezgirona.com/envejecimiento-cognitivo-normal-o-deterioro/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Orientación y evaluación neuropsicológica de cambios cognitivos asociados al envejecimiento",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica de cambios cognitivos en el envejecimiento",
  url: "https://carolinasanchezgirona.com/envejecimiento-cognitivo-normal-o-deterioro/",
};

export default function CognitiveAgingPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/problemas-de-memoria/">Memoria</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Envejecimiento cognitivo</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Memoria y envejecimiento</p>
        <h1>Envejecimiento cognitivo normal o deterioro cognitivo</h1>
        <p className="seo-lead">Con la edad pueden aparecer cambios en la velocidad mental, la recuperación de nombres o la necesidad de más tiempo para aprender información nueva. La dificultad está en distinguir esos cambios esperables de otros patrones que pueden justificar una evaluación neuropsicológica.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#senales">Qué señales observar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Qué cambios pueden aparecer con el envejecimiento</h2><p>Es frecuente necesitar más tiempo para recuperar una palabra, aprender material nuevo algo más despacio o notar menor agilidad cuando se hacen varias cosas a la vez. Estos cambios no implican por sí mismos una enfermedad neurodegenerativa.</p><p>Lo importante es valorar el patrón, la evolución y el impacto real en la vida cotidiana.</p></section>
          <section id="senales"><h2>Qué señales conviene observar</h2><ul><li>Olvidos repetidos de información reciente que antes se retenía sin dificultad.</li><li>Necesidad creciente de ayuda para tareas que antes se realizaban de forma autónoma.</li><li>Desorientación en lugares conocidos o problemas para seguir rutas habituales.</li><li>Dificultades nuevas para gestionar medicación, dinero, citas o trámites.</li><li>Cambios persistentes en lenguaje, planificación o juicio.</li><li>Comentarios de familiares sobre cambios que la propia persona no percibe.</li><li>Una progresión clara de las dificultades con el paso de los meses.</li></ul></section>
          <section><h2>No todo olvido significa deterioro cognitivo</h2><p>El sueño, la ansiedad, la depresión, el estrés, el dolor, determinados medicamentos y problemas médicos pueden afectar a memoria y atención. Por eso conviene evitar conclusiones a partir de un síntoma aislado.</p><p>Si predominan los olvidos pero todavía no está claro qué ocurre, puede ser útil revisar <a href="/problemas-de-memoria/">problemas de memoria y olvidos</a>.</p></section>
          <section><h2>Cuándo hablamos de deterioro cognitivo leve</h2><p>El <a href="/deterioro-cognitivo-leve/">deterioro cognitivo leve</a> implica dificultades cognitivas objetivables con una autonomía relativamente conservada. No es sinónimo de demencia ni permite predecir por sí solo una evolución concreta.</p><p>El seguimiento ayuda a observar si el perfil permanece estable, mejora o progresa.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> permite explorar memoria, atención, lenguaje, funciones ejecutivas y otras áreas, comparando el rendimiento con lo esperado según edad, formación y contexto clínico.</p><p>Además de las pruebas, se revisa la autonomía cotidiana y la evolución de los cambios para interpretar los resultados de forma clínica.</p></section>
          <section><h2>Cuándo puede ser necesario ampliar el estudio</h2><p>Si la evaluación detecta un patrón que merece estudio médico, puede recomendarse valoración por neurología, geriatría u otros profesionales. La neuropsicología aporta una descripción detallada del funcionamiento cognitivo, pero no sustituye el diagnóstico médico de una enfermedad neurológica.</p><div className="seo-callout"><strong>Envejecer no significa necesariamente deteriorarse.</strong><span>La clave está en observar el patrón, la progresión y el impacto en la autonomía, no en alarmarse por cada olvido aislado.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/problemas-de-memoria/">Problemas de memoria</a><a href="/deterioro-cognitivo-leve/">Deterioro cognitivo leve</a><a href="/deterioro-cognitivo/">Deterioro cognitivo</a><a href="/demencias/">Demencias</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Mi trabajo está especialmente vinculado a la evaluación de problemas de memoria, deterioro cognitivo y demencias, integrando perfil cognitivo, funcionamiento cotidiano y evolución clínica.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}