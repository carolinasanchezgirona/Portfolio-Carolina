import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Demencia frontotemporal | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica en demencia frontotemporal: cambios de conducta, personalidad, lenguaje, funciones ejecutivas y autonomía.",
  alternates: { canonical: "/demencia-frontotemporal/" },
  openGraph: {
    title: "Demencia frontotemporal | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar cambios conductuales, ejecutivos y del lenguaje compatibles con demencia frontotemporal.",
    url: "https://carolinasanchezgirona.com/demencia-frontotemporal/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica en demencia frontotemporal",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica de cambios cognitivos, conductuales y del lenguaje compatibles con demencia frontotemporal",
  url: "https://carolinasanchezgirona.com/demencia-frontotemporal/",
};

export default function FrontotemporalDementiaPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/demencias/">Demencias</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Demencia frontotemporal</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Demencias</p>
        <h1>Demencia frontotemporal</h1>
        <p className="seo-lead">La demencia frontotemporal puede manifestarse con cambios de conducta, personalidad, iniciativa, juicio o lenguaje, y no siempre comienza con problemas de memoria. La evaluación neuropsicológica ayuda a describir el perfil y su repercusión funcional dentro de una valoración médica completa.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#senales">Qué señales pueden aparecer</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>No siempre empieza con olvidos</h2><p>En algunos casos predominan cambios en la forma de comportarse, menor empatía, desinhibición, apatía, rigidez mental o dificultades para tomar decisiones. En otros, el problema principal aparece en el lenguaje.</p><p>Esto puede hacer que las primeras señales se confundan con cambios de personalidad, estrés o problemas emocionales.</p></section>
          <section id="senales"><h2>Qué señales pueden justificar una valoración</h2><ul><li>Cambios progresivos de conducta o personalidad.</li><li>Pérdida de iniciativa o apatía llamativa.</li><li>Desinhibición o conductas socialmente inadecuadas.</li><li>Rigidez mental, perseveración o dificultad para cambiar de estrategia.</li><li>Pérdida de empatía o cambios en la sensibilidad hacia otras personas.</li><li>Dificultades progresivas para encontrar palabras, comprender o expresarse.</li><li>Problemas de planificación, juicio o autonomía cotidiana.</li></ul></section>
          <section><h2>Funciones ejecutivas y conducta</h2><p>Las regiones frontales participan en planificación, inhibición, flexibilidad mental, toma de decisiones y regulación de la conducta. Cuando estas funciones se alteran, una persona puede mantener algunas capacidades cognitivas básicas pero mostrar dificultades importantes en situaciones complejas o sociales.</p><p>Puede ser útil revisar también <a href="/funciones-ejecutivas-y-planificacion-en-adultos/">funciones ejecutivas y planificación</a>.</p></section>
          <section><h2>Relación con alteraciones del lenguaje</h2><p>Algunas variantes frontotemporales se presentan principalmente con alteraciones progresivas del lenguaje. En esos casos conviene valorar comprensión, expresión, denominación, fluidez y otros componentes lingüísticos.</p><p>Cuando el problema de lenguaje aparece tras una lesión cerebral aguda, el contexto es distinto y puede ser más útil revisar <a href="/afasia-y-problemas-de-lenguaje/">afasia y problemas de lenguaje</a>.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> permite explorar funciones ejecutivas, atención, memoria, lenguaje, cognición social y otras áreas según el caso.</p><p>También es importante recoger información de familiares cuando existen cambios conductuales o de conciencia de déficit, porque la percepción de las dificultades puede ser limitada.</p></section>
          <section><h2>Diferencias con Alzheimer y otras demencias</h2><p>La <a href="/alzheimer-primeros-sintomas-y-evaluacion/">enfermedad de Alzheimer</a> suele asociarse más a problemas de memoria episódica en sus formas típicas, mientras que en la demencia frontotemporal pueden destacar antes los cambios conductuales, ejecutivos o del lenguaje.</p><p>Sin embargo, los perfiles pueden solaparse y el diagnóstico requiere integrar evolución, neuroimagen, valoración médica y funcionamiento cotidiano.</p><div className="seo-callout"><strong>Cuando cambia la conducta, también puede haber un problema neurológico.</strong><span>La clave está en observar si el cambio es progresivo, persistente y claramente distinto del funcionamiento previo.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/demencias/">Demencias</a><a href="/funciones-ejecutivas-y-planificacion-en-adultos/">Funciones ejecutivas</a><a href="/afasia-y-problemas-de-lenguaje/">Lenguaje y afasia</a><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación neuropsicológica de personas adultas con deterioro cognitivo y demencias, integrando cognición, conducta, lenguaje, evolución y repercusión funcional.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}