import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "COVID persistente y niebla mental | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica de niebla mental y cambios cognitivos tras COVID persistente: atención, memoria, velocidad de procesamiento, fatiga y funciones ejecutivas.",
  alternates: { canonical: "/covid-persistente-y-niebla-mental/" },
  openGraph: {
    title: "COVID persistente y niebla mental | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar atención, memoria, fatiga cognitiva y velocidad de procesamiento en COVID persistente.",
    url: "https://carolinasanchezgirona.com/covid-persistente-y-niebla-mental/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica de cambios cognitivos en COVID persistente",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica de niebla mental y cambios cognitivos tras COVID persistente",
  url: "https://carolinasanchezgirona.com/covid-persistente-y-niebla-mental/",
};

export default function LongCovidCognitionPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/evaluacion-neuropsicologica/">Evaluación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>COVID persistente y niebla mental</span></p>
        <p className="editorial-eyebrow">Neuropsicología · COVID persistente</p>
        <h1>COVID persistente, niebla mental y cambios cognitivos</h1>
        <p className="seo-lead">Algunas personas con COVID persistente describen niebla mental, dificultad para concentrarse, lentitud, olvidos o fatiga cognitiva. Estos síntomas pueden tener un impacto real en el trabajo, los estudios y la vida cotidiana, y conviene valorarlos dentro del contexto médico completo.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-valorar">Cuándo valorar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Qué suele significar “niebla mental”</h2><p>No es un diagnóstico específico, sino una forma habitual de describir sensación de lentitud, dificultad para sostener la atención, problemas para encontrar palabras, fallos de memoria o mayor esfuerzo para realizar tareas cognitivas.</p><p>La evaluación ayuda a concretar qué procesos están implicados y cuánto interfieren en el funcionamiento diario.</p></section>
          <section id="cuando-valorar"><h2>Cuándo puede ser útil una evaluación</h2><ul><li>Te cuesta mantener el foco durante tareas que antes realizabas con normalidad.</li><li>Notas mayor lentitud para leer, responder o procesar información.</li><li>Necesitas más descansos por fatiga mental.</li><li>Dependes más de notas, recordatorios o apoyos externos.</li><li>Te cuesta seguir conversaciones largas o tareas con varios pasos.</li><li>Los síntomas interfieren en trabajo, estudios o autonomía.</li><li>Necesitas objetivar el perfil cognitivo para orientar seguimiento o adaptaciones.</li></ul></section>
          <section><h2>La fatiga puede modificar mucho el rendimiento</h2><p>En algunas personas, el rendimiento cognitivo varía según la hora del día, la carga acumulada o el esfuerzo físico y mental. Por eso una valoración útil debe tener en cuenta la fatiga y no interpretar una puntuación de forma aislada.</p></section>
          <section><h2>Atención, memoria y velocidad de procesamiento</h2><p>Muchas quejas de memoria pueden estar relacionadas con dificultades para codificar información cuando la atención está fatigada o el procesamiento es más lento. Puede ser útil revisar también <a href="/problemas-de-atencion-y-concentracion-en-adultos/">atención y concentración</a> y <a href="/funciones-ejecutivas-y-planificacion-en-adultos/">funciones ejecutivas</a>.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> permite explorar atención, velocidad de procesamiento, memoria, funciones ejecutivas y otras áreas según el motivo de consulta.</p><p>Los resultados se integran con antecedentes médicos, sueño, fatiga, dolor, estado emocional y funcionamiento cotidiano. La neuropsicología complementa el seguimiento médico y no sustituye la valoración sanitaria del COVID persistente.</p></section>
          <section><h2>Qué se puede hacer después</h2><p>Según el perfil, pueden ser útiles estrategias de compensación, priorización de tareas, pausas planificadas, reducción de multitarea, adaptación de cargas y uso sistemático de apoyos externos.</p><div className="seo-callout"><strong>La “niebla mental” es una descripción, no una explicación.</strong><span>La evaluación ayuda a convertir una sensación difusa en un perfil cognitivo más concreto y útil para tomar decisiones.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a><a href="/problemas-de-atencion-y-concentracion-en-adultos/">Atención y concentración</a><a href="/funciones-ejecutivas-y-planificacion-en-adultos/">Funciones ejecutivas</a><a href="/problemas-de-memoria/">Problemas de memoria</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación neuropsicológica de personas adultas con quejas cognitivas persistentes, integrando rendimiento, fatiga, estado emocional y repercusión funcional.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}