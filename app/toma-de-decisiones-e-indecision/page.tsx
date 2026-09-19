import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Indecisión y toma de decisiones | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para indecisión, miedo a equivocarse, bloqueo al elegir y necesidad de certeza. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/toma-de-decisiones-e-indecision/" },
  openGraph: {
    title: "Toma de decisiones e indecisión | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar bloqueo al decidir, miedo al error, sobreanálisis y dificultad para sostener elecciones.",
    url: "https://carolinasanchezgirona.com/toma-de-decisiones-e-indecision/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para toma de decisiones e indecisión",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en indecisión, miedo al error y toma de decisiones",
  url: "https://carolinasanchezgirona.com/toma-de-decisiones-e-indecision/",
};

export default function DecisionMakingPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Toma de decisiones</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Decisiones</p>
        <h1>Toma de decisiones e indecisión</h1>
        <p className="seo-lead">Algunas decisiones se vuelven difíciles no porque falte información, sino porque aparece miedo a equivocarse, necesidad de certeza o una búsqueda interminable de la opción perfecta. La terapia puede ayudar a decidir con más claridad y sostener mejor la incertidumbre.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>No todas las decisiones difíciles necesitan más análisis</h2><p>Cuando una elección importa, es normal comparar opciones y valorar consecuencias. El problema aparece cuando el análisis deja de acercar a una decisión y se convierte en un intento de eliminar por completo el riesgo o la incertidumbre.</p><p>En ese punto, buscar más información puede aumentar el bloqueo en lugar de reducirlo.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil trabajar este problema</h2><ul><li>Das vueltas a la misma decisión durante días o semanas sin avanzar.</li><li>Necesitas confirmar repetidamente con otras personas qué deberías hacer.</li><li>Te cuesta elegir si ninguna opción parece completamente segura.</li><li>Después de decidir, vuelves a revisar si te has equivocado.</li><li>Pospones decisiones por miedo a arrepentirte.</li><li>Te bloqueas cuando hay varias opciones razonables.</li><li>La indecisión afecta a trabajo, relaciones o proyectos personales.</li></ul></section>
          <section><h2>Qué puede mantener la indecisión</h2><h3>Miedo al error</h3><p>Si equivocarse se interpreta como una prueba de incapacidad o como algo que debería evitarse a toda costa, decidir se vuelve mucho más amenazante.</p><h3>Necesidad de certeza</h3><p>Algunas decisiones no permiten saber de antemano cuál será el resultado. Intentar alcanzar una certeza imposible puede prolongar indefinidamente el análisis.</p><h3>Perfeccionismo</h3><p>Buscar la opción óptima en lugar de una opción suficientemente buena puede convertir cualquier elección en un examen.</p><h3>Rumiación posterior</h3><p>Revisar una decisión una y otra vez puede debilitar la confianza en el propio criterio, incluso cuando no existe información nueva.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir clarificar criterios relevantes, diferenciar riesgos reales de escenarios hipotéticos, limitar el análisis cuando deja de aportar información, trabajar tolerancia a la incertidumbre y revisar creencias sobre error, responsabilidad y arrepentimiento.</p><p>También puede ser útil aprender a sostener una decisión después de tomarla sin convertir cada duda posterior en una señal de que hay que empezar de nuevo.</p></section>
          <section><h2>Indecisión, ansiedad y rumiación</h2><p>La indecisión puede aparecer junto a <a href="/ansiedad/">ansiedad</a>, <a href="/rumiacion-y-pensamientos-repetitivos/">rumiación</a> o <a href="/perfeccionismo-y-autoexigencia/">perfeccionismo y autoexigencia</a>. Cuando la confianza personal es baja, también puede relacionarse con <a href="/autoestima-y-autocritica/">autoestima y autocrítica</a>.</p></section>
          <section><h2>Decidir no elimina la incertidumbre</h2><p>Una buena decisión no garantiza un resultado perfecto. El objetivo es poder elegir con información suficiente, criterios claros y un nivel de incertidumbre tolerable, en lugar de esperar una certeza que muchas veces no existe.</p><div className="seo-callout"><strong>Elegir también implica renunciar a seguir comparando.</strong><span>La claridad no siempre aparece antes de decidir; a veces se construye después al sostener la elección.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación</a><a href="/perfeccionismo-y-autoexigencia/">Perfeccionismo</a><a href="/ansiedad/">Ansiedad</a><a href="/autoestima-y-autocritica/">Autoestima y autocrítica</a>
              <a href="/procrastinacion-y-bloqueo/">Procrastinación y bloqueo</a>
              <a href="/ansiedad-anticipatoria-y-preocupacion-excesiva/">Ansiedad anticipatoria y preocupación excesiva</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, rumiación, autoexigencia, límites y toma de decisiones desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}