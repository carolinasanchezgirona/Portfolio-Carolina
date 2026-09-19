import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Cambios cognitivos en Parkinson | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica de cambios cognitivos en enfermedad de Parkinson: atención, velocidad de procesamiento, funciones ejecutivas, memoria y autonomía.",
  alternates: { canonical: "/parkinson-y-cambios-cognitivos/" },
  openGraph: {
    title: "Cambios cognitivos en Parkinson | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar atención, memoria, funciones ejecutivas y repercusión funcional en enfermedad de Parkinson.",
    url: "https://carolinasanchezgirona.com/parkinson-y-cambios-cognitivos/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica de cambios cognitivos en enfermedad de Parkinson",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica en enfermedad de Parkinson",
  url: "https://carolinasanchezgirona.com/parkinson-y-cambios-cognitivos/",
};

export default function ParkinsonCognitionPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/evaluacion-neuropsicologica/">Evaluación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Parkinson y cognición</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Enfermedad de Parkinson</p>
        <h1>Cambios cognitivos en la enfermedad de Parkinson</h1>
        <p className="seo-lead">La enfermedad de Parkinson se asocia principalmente a síntomas motores, pero algunas personas también presentan cambios en atención, velocidad de procesamiento, funciones ejecutivas, memoria o habilidades visuoespaciales. La evaluación neuropsicológica ayuda a describir ese perfil y su impacto en la vida cotidiana.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-valorar">Cuándo valorar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Los cambios cognitivos no aparecen igual en todas las personas</h2><p>Algunas personas mantienen un funcionamiento cognitivo estable durante mucho tiempo. Otras notan más lentitud mental, dificultad para alternar entre tareas, problemas de planificación o cambios en la memoria.</p><p>La presencia de estas dificultades no implica automáticamente una demencia. Es importante valorar su intensidad, evolución y repercusión funcional.</p></section>
          <section id="cuando-valorar"><h2>Cuándo puede ser útil una evaluación</h2><ul><li>Notas mayor lentitud para pensar o responder.</li><li>Te cuesta organizar tareas con varios pasos.</li><li>Te resulta más difícil mantener o cambiar el foco de atención.</li><li>Has empezado a olvidar información con más frecuencia.</li><li>La familia observa cambios en autonomía, juicio o funcionamiento cotidiano.</li><li>Existe la necesidad de establecer una línea base para seguimiento.</li><li>Neurología recomienda explorar el funcionamiento cognitivo con más detalle.</li></ul></section>
          <section><h2>Qué áreas pueden explorarse</h2><p>La valoración puede incluir atención, velocidad de procesamiento, memoria, funciones ejecutivas, lenguaje y habilidades visuoespaciales, adaptando las pruebas a la situación clínica.</p><p>También se revisan factores como sueño, estado de ánimo, fatiga, medicación y fluctuaciones, porque pueden influir en el rendimiento.</p></section>
          <section><h2>Parkinson, deterioro cognitivo y demencia</h2><p>Puede existir <a href="/deterioro-cognitivo-leve/">deterioro cognitivo leve</a> sin pérdida importante de autonomía. En otros casos, si los cambios cognitivos llegan a interferir de forma significativa en la vida diaria, puede ser necesario valorar un cuadro de mayor entidad.</p><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> aporta información complementaria al seguimiento neurológico, pero no sustituye la valoración médica.</p></section>
          <section><h2>Seguimiento y estrategias</h2><p>Cuando se identifican dificultades concretas, pueden plantearse estrategias compensatorias, apoyos externos, organización de rutinas y seguimiento periódico para observar la evolución.</p><p>En algunos casos también puede ser útil la <a href="/estimulacion-cognitiva/">estimulación cognitiva</a>, siempre vinculada a objetivos funcionales y coordinada con el abordaje sanitario global.</p></section>
          <section><h2>La evolución importa tanto como una fotografía puntual</h2><p>Una evaluación inicial puede servir como referencia para comparar cambios posteriores. Esto resulta especialmente útil cuando existen dudas sobre progresión o cuando se modifican las demandas de la vida cotidiana.</p><div className="seo-callout"><strong>Una puntuación aislada no cuenta toda la historia.</strong><span>Lo clínicamente útil es integrar el perfil cognitivo, la evolución y el impacto real en la autonomía.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a><a href="/deterioro-cognitivo-leve/">Deterioro cognitivo leve</a><a href="/funciones-ejecutivas-y-planificacion-en-adultos/">Funciones ejecutivas</a><a href="/estimulacion-cognitiva/">Estimulación cognitiva</a>
              <a href="/demencia-con-cuerpos-de-lewy/">Demencia con cuerpos de Lewy</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación neuropsicológica de personas adultas con cambios cognitivos asociados a condiciones neurológicas, integrando rendimiento, evolución y repercusión funcional.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}