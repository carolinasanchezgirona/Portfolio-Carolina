import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Rehabilitación neuropsicológica | Neuropsicóloga en Arenys de Mar",
  description: "Rehabilitación neuropsicológica en adultos tras ictus, TCE u otras condiciones neurológicas: atención, memoria, funciones ejecutivas, estrategias compensatorias y autonomía.",
  alternates: { canonical: "/rehabilitacion-neuropsicologica/" },
  openGraph: {
    title: "Rehabilitación neuropsicológica | Carolina Sánchez Girona",
    description: "Intervención neuropsicológica orientada a objetivos funcionales, estrategias compensatorias y recuperación de autonomía.",
    url: "https://carolinasanchezgirona.com/rehabilitacion-neuropsicologica/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Rehabilitación neuropsicológica en adultos",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Rehabilitación neuropsicológica",
  url: "https://carolinasanchezgirona.com/rehabilitacion-neuropsicologica/",
};

export default function NeurorehabilitationPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/evaluacion-neuropsicologica/">Evaluación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Rehabilitación neuropsicológica</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Intervención</p>
        <h1>Rehabilitación neuropsicológica</h1>
        <p className="seo-lead">La rehabilitación neuropsicológica busca reducir el impacto de las dificultades cognitivas en la vida cotidiana. No consiste solo en hacer ejercicios: combina entrenamiento específico, estrategias compensatorias, adaptación de tareas y trabajo sobre objetivos funcionales relevantes para cada persona.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-puede-ser-util">Cuándo puede ser útil</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Qué diferencia la rehabilitación de hacer ejercicios cognitivos</h2><p>Una intervención útil parte de un perfil neuropsicológico y de problemas concretos de la vida diaria. El objetivo puede ser recordar mejor citas, volver a organizar una jornada laboral, reducir errores al cocinar o aprender a utilizar apoyos externos de forma eficaz.</p><p>Los ejercicios pueden formar parte del tratamiento, pero no son el objetivo en sí mismos.</p></section>
          <section id="cuando-puede-ser-util"><h2>Cuándo puede ser útil</h2><ul><li>Tras un ictus o daño cerebral adquirido.</li><li>Después de un traumatismo craneoencefálico cuando persisten dificultades cognitivas.</li><li>En enfermedades neurológicas que afectan a atención, memoria o funciones ejecutivas.</li><li>Cuando existen dificultades cognitivas estables que interfieren en autonomía o trabajo.</li><li>Cuando se necesita aprender estrategias compensatorias para tareas concretas.</li><li>Como parte del seguimiento tras una evaluación neuropsicológica.</li></ul></section>
          <section><h2>Qué áreas pueden trabajarse</h2><p>Según el perfil, la intervención puede centrarse en atención, memoria, velocidad de procesamiento, lenguaje, funciones ejecutivas, planificación y organización.</p><p>También puede incluir estrategias para manejar fatiga cognitiva, estructurar rutinas, utilizar agendas o recordatorios y adaptar el entorno para reducir errores.</p></section>
          <section><h2>Restaurar, compensar y adaptar</h2><p>La rehabilitación puede combinar tres enfoques. En algunos casos se entrenan directamente determinadas funciones. En otros se compensa una dificultad con ayudas externas o estrategias alternativas. Y cuando una tarea sigue siendo demasiado exigente, se adapta para hacerla más segura o manejable.</p><p>La combinación depende del tipo de lesión, la evolución y las necesidades funcionales de la persona.</p></section>
          <section><h2>Relación con la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> ayuda a definir qué capacidades están alteradas y cuáles se conservan. Esa información permite seleccionar objetivos realistas y medir si las estrategias están teniendo utilidad fuera de la consulta.</p><p>En personas con <a href="/ictus-y-dano-cerebral-adquirido/">ictus o daño cerebral adquirido</a> o <a href="/conmocion-cerebral-y-tce-leve/">TCE leve</a>, la intervención debe coordinarse con el seguimiento médico y rehabilitador cuando sea necesario.</p></section>
          <section><h2>Rehabilitación y estimulación cognitiva</h2><p>La <a href="/estimulacion-cognitiva/">estimulación cognitiva</a> puede utilizarse en distintos contextos, especialmente cuando el objetivo es mantener o activar funciones cognitivas. La rehabilitación neuropsicológica suele plantearse de forma más individualizada y funcional, con objetivos ligados a dificultades concretas.</p><div className="seo-callout"><strong>Mejorar una puntuación no basta si la vida diaria sigue igual.</strong><span>La intervención neuropsicológica tiene sentido cuando ayuda a recuperar, compensar o adaptar actividades reales.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a><a href="/ictus-y-dano-cerebral-adquirido/">Ictus y daño cerebral</a><a href="/conmocion-cerebral-y-tce-leve/">Conmoción cerebral y TCE leve</a><a href="/estimulacion-cognitiva/">Estimulación cognitiva</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación e intervención neuropsicológica con personas adultas, priorizando objetivos funcionales, estrategias compensatorias y adaptación a las demandas de la vida cotidiana.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}