import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Cambios cognitivos en esclerosis múltiple | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica de cambios cognitivos en esclerosis múltiple: atención, velocidad de procesamiento, memoria, fatiga y funciones ejecutivas.",
  alternates: { canonical: "/esclerosis-multiple-y-cambios-cognitivos/" },
  openGraph: {
    title: "Cambios cognitivos en esclerosis múltiple | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar atención, memoria, velocidad de procesamiento, funciones ejecutivas y repercusión funcional en esclerosis múltiple.",
    url: "https://carolinasanchezgirona.com/esclerosis-multiple-y-cambios-cognitivos/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica de cambios cognitivos en esclerosis múltiple",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica en esclerosis múltiple",
  url: "https://carolinasanchezgirona.com/esclerosis-multiple-y-cambios-cognitivos/",
};

export default function MultipleSclerosisCognitionPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/evaluacion-neuropsicologica/">Evaluación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Esclerosis múltiple y cognición</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Esclerosis múltiple</p>
        <h1>Cambios cognitivos en la esclerosis múltiple</h1>
        <p className="seo-lead">La esclerosis múltiple puede afectar no solo al funcionamiento físico, sino también a procesos como la atención, la velocidad de procesamiento, la memoria o las funciones ejecutivas. La evaluación neuropsicológica ayuda a describir el perfil cognitivo y a distinguir qué dificultades requieren seguimiento o estrategias específicas.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-valorar">Cuándo valorar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Los cambios cognitivos pueden ser sutiles</h2><p>Algunas personas notan que tardan más en procesar información, que se fatigan antes al concentrarse o que necesitan más tiempo para organizar tareas complejas. Estos cambios pueden pasar desapercibidos si solo se observa el rendimiento general.</p><p>La evaluación permite analizar áreas concretas y relacionarlas con las demandas reales del trabajo, los estudios y la vida cotidiana.</p></section>
          <section id="cuando-valorar"><h2>Cuándo puede ser útil una evaluación</h2><ul><li>Notas más lentitud mental o necesitas más tiempo para responder.</li><li>Te cuesta mantener la concentración durante periodos prolongados.</li><li>Te fatigas mentalmente con tareas que antes eran manejables.</li><li>Has empezado a depender más de recordatorios o apoyos externos.</li><li>Te cuesta organizar varias tareas o cambiar de una actividad a otra.</li><li>Los cambios interfieren en trabajo, estudios o autonomía.</li><li>Necesitas una línea base para comparar la evolución en el tiempo.</li></ul></section>
          <section><h2>Qué áreas pueden explorarse</h2><p>La valoración puede incluir velocidad de procesamiento, atención, memoria, funciones ejecutivas y otros procesos según el motivo de consulta.</p><p>También se revisan fatiga, sueño, dolor, estado emocional y medicación, porque pueden influir de forma importante en el rendimiento cognitivo.</p></section>
          <section><h2>Atención, velocidad y fatiga</h2><p>Una de las quejas más frecuentes es sentir que “la cabeza va más lenta”. Esto puede relacionarse con velocidad de procesamiento, atención sostenida o fatiga cognitiva. Puede ser útil revisar también la información sobre <a href="/problemas-de-atencion-y-concentracion-en-adultos/">atención y concentración</a>.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> permite objetivar el perfil actual y compararlo con lo esperado según edad, formación y contexto clínico.</p><p>Los resultados pueden orientar estrategias, adaptaciones y seguimientos posteriores, especialmente cuando la persona necesita ajustar cargas cognitivas o comprobar si existen cambios respecto a una evaluación previa.</p></section>
          <section><h2>Qué se puede hacer después</h2><p>Según el perfil, pueden ser útiles estrategias de organización, pausas planificadas, distribución de tareas exigentes en momentos de menor fatiga, apoyos externos y trabajo específico sobre funciones alteradas.</p><p>La <a href="/estimulacion-cognitiva/">estimulación cognitiva</a> puede formar parte del abordaje cuando responde a objetivos concretos y se integra con el seguimiento médico.</p><div className="seo-callout"><strong>Rendir más despacio no significa rendir peor en todo.</strong><span>Conocer el perfil ayuda a ajustar tiempos, estrategias y expectativas de forma más precisa.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a><a href="/problemas-de-atencion-y-concentracion-en-adultos/">Atención y concentración</a><a href="/funciones-ejecutivas-y-planificacion-en-adultos/">Funciones ejecutivas</a><a href="/estimulacion-cognitiva/">Estimulación cognitiva</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación neuropsicológica de personas adultas con cambios cognitivos asociados a condiciones neurológicas, integrando rendimiento, fatiga, estado emocional y repercusión funcional.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}