import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Funciones ejecutivas y planificación en adultos | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica de dificultades de planificación, organización, flexibilidad mental, memoria de trabajo y control de tareas en adultos.",
  alternates: { canonical: "/funciones-ejecutivas-y-planificacion-en-adultos/" },
  openGraph: {
    title: "Funciones ejecutivas y planificación en adultos | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar organización, planificación, memoria de trabajo y control ejecutivo en adultos.",
    url: "https://carolinasanchezgirona.com/funciones-ejecutivas-y-planificacion-en-adultos/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica de funciones ejecutivas en adultos",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica de planificación y funciones ejecutivas",
  url: "https://carolinasanchezgirona.com/funciones-ejecutivas-y-planificacion-en-adultos/",
};

export default function ExecutiveFunctionsAdultsPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/evaluacion-neuropsicologica/">Evaluación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Funciones ejecutivas</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Funciones ejecutivas</p>
        <h1>Funciones ejecutivas y dificultades de planificación en adultos</h1>
        <p className="seo-lead">Las funciones ejecutivas permiten organizar una meta, decidir por dónde empezar, mantener información activa, cambiar de estrategia y supervisar si una tarea se está resolviendo bien. Cuando fallan, una persona puede saber qué quiere hacer pero tener dificultades para ponerlo en marcha de forma ordenada.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-valorar">Cuándo valorar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Qué son las funciones ejecutivas</h2><p>Incluyen procesos como planificación, flexibilidad cognitiva, inhibición, memoria de trabajo, monitorización y toma de decisiones. Son especialmente importantes en tareas nuevas, complejas o poco estructuradas.</p><p>Una persona puede rendir bien en actividades rutinarias y encontrar muchas más dificultades cuando necesita organizar varios pasos, priorizar o adaptarse a cambios imprevistos.</p></section>
          <section id="cuando-valorar"><h2>Cuándo puede ser útil una evaluación</h2><ul><li>Te cuesta empezar tareas aunque sepas perfectamente qué tienes que hacer.</li><li>Te bloqueas cuando una actividad tiene varios pasos.</li><li>Saltas de una tarea a otra y dejas muchas a medias.</li><li>Te cuesta priorizar o calcular cuánto tiempo necesitarás.</li><li>Cometes errores por no revisar el resultado final.</li><li>Te cuesta cambiar de estrategia cuando algo no funciona.</li><li>La organización cotidiana se ha vuelto claramente más difícil que antes.</li></ul></section>
          <section><h2>Funciones ejecutivas, atención y memoria</h2><p>Estos procesos están muy relacionados. Una dificultad de <a href="/problemas-de-atencion-y-concentracion-en-adultos/">atención</a> puede interferir en la planificación, y una memoria de trabajo limitada puede hacer difícil mantener varios pasos activos a la vez.</p><p>Por eso conviene evaluar el perfil completo y no atribuir todos los errores a una sola función.</p></section>
          <section><h2>No todo problema de organización es TDAH</h2><p>Las dificultades ejecutivas pueden aparecer en TDAH, pero también en trastornos del estado de ánimo, ansiedad, falta de sueño, daño cerebral, enfermedades neurológicas y situaciones de fatiga o sobrecarga.</p><p>La historia evolutiva, el contexto y la interferencia funcional son fundamentales para entender qué explicación encaja mejor.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> puede explorar memoria de trabajo, flexibilidad, inhibición, velocidad de procesamiento, planificación y otras funciones relacionadas.</p><p>Los resultados se interpretan junto con ejemplos de la vida diaria para traducir una puntuación en recomendaciones útiles.</p></section>
          <section><h2>Qué se puede hacer después</h2><p>Según el perfil, puede ser útil estructurar tareas en pasos, externalizar información con agendas o listas, reducir decisiones simultáneas, establecer puntos de revisión y trabajar estrategias para priorizar y estimar tiempos.</p><div className="seo-callout"><strong>Organizarse no depende solo de “poner más ganas”.</strong><span>Cuando las funciones ejecutivas fallan, hacer visible la estructura de una tarea puede reducir mucho la carga cognitiva.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/problemas-de-atencion-y-concentracion-en-adultos/">Atención y concentración</a><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a><a href="/problemas-de-memoria/">Problemas de memoria</a><a href="/ictus-y-dano-cerebral-adquirido/">Ictus y daño cerebral</a>
              <a href="/demencia-frontotemporal/">Demencia frontotemporal</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación neuropsicológica de personas adultas, integrando atención, memoria, funciones ejecutivas, estado emocional y repercusión funcional.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}