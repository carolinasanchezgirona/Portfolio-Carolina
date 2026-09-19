import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Demencia vascular y cambios cognitivos | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica de cambios cognitivos asociados a enfermedad cerebrovascular y demencia vascular: atención, funciones ejecutivas, memoria y autonomía.",
  alternates: { canonical: "/demencia-vascular-y-cambios-cognitivos/" },
  openGraph: {
    title: "Demencia vascular y cambios cognitivos | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar cambios cognitivos relacionados con enfermedad cerebrovascular y su impacto funcional.",
    url: "https://carolinasanchezgirona.com/demencia-vascular-y-cambios-cognitivos/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica de cambios cognitivos asociados a enfermedad cerebrovascular",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica en deterioro cognitivo vascular y demencia vascular",
  url: "https://carolinasanchezgirona.com/demencia-vascular-y-cambios-cognitivos/",
};

export default function VascularDementiaPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/demencias/">Demencias</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Demencia vascular</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Demencias</p>
        <h1>Demencia vascular y cambios cognitivos</h1>
        <p className="seo-lead">La enfermedad cerebrovascular puede producir cambios cognitivos de intensidad y perfil muy variables. Algunas personas presentan lentitud, dificultades de atención o funciones ejecutivas; otras muestran alteraciones de memoria u otras capacidades. La evaluación neuropsicológica ayuda a describir ese patrón y su impacto en la autonomía.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#senales">Qué señales observar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Qué significa deterioro cognitivo vascular</h2><p>El término describe cambios cognitivos relacionados con enfermedad cerebrovascular. Puede aparecer tras un ictus o asociarse a lesiones vasculares acumuladas a lo largo del tiempo.</p><p>El perfil depende de las áreas cerebrales afectadas, la extensión de las lesiones, la evolución y la coexistencia de otros factores neurológicos o médicos.</p></section>
          <section id="senales"><h2>Qué señales pueden justificar una valoración</h2><ul><li>Mayor lentitud para pensar o responder.</li><li>Dificultad para organizar o planificar tareas.</li><li>Problemas para mantener o alternar la atención.</li><li>Cambios de memoria que interfieren en la vida cotidiana.</li><li>Necesidad creciente de ayuda para gestiones o actividades antes autónomas.</li><li>Cambios cognitivos después de un ictus o de varios eventos vasculares.</li><li>Progresión o fluctuación de dificultades que requieren seguimiento.</li></ul></section>
          <section><h2>El perfil no siempre es igual al del Alzheimer</h2><p>En algunos cuadros vasculares pueden destacar más la lentitud, la atención y las funciones ejecutivas que la memoria episódica. Sin embargo, existe mucha variabilidad y también pueden coexistir procesos vasculares y neurodegenerativos.</p><p>Por eso una comparación simple entre diagnósticos no basta para interpretar el caso individual.</p></section>
          <section><h2>Relación con ictus y daño cerebral adquirido</h2><p>Cuando los cambios aparecen tras un evento cerebrovascular concreto, puede ser útil revisar también la información sobre <a href="/ictus-y-dano-cerebral-adquirido/">ictus y daño cerebral adquirido</a>. La evolución, el momento desde la lesión y el grado de recuperación son relevantes para interpretar el rendimiento.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> permite explorar atención, velocidad de procesamiento, memoria, lenguaje, funciones ejecutivas y habilidades visuoespaciales, junto con la autonomía cotidiana.</p><p>Los resultados pueden ayudar a orientar diagnóstico diferencial, seguimiento y estrategias de apoyo, siempre integrados con la valoración médica y la información de neuroimagen cuando está disponible.</p></section>
          <section><h2>Demencia vascular y autonomía</h2><p>El término demencia se utiliza cuando las dificultades cognitivas interfieren de forma significativa en la independencia cotidiana. Si existe afectación objetiva pero la autonomía se mantiene en gran medida, puede hablarse de un deterioro cognitivo de menor entidad.</p><p>La página general sobre <a href="/demencias/">demencias</a> explica con más detalle esta diferencia y otros tipos de demencia.</p><div className="seo-callout"><strong>El origen vascular no se deduce solo por cómo se comporta la memoria.</strong><span>La interpretación requiere integrar perfil cognitivo, historia vascular, evolución funcional y evaluación médica.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/demencias/">Demencias</a><a href="/ictus-y-dano-cerebral-adquirido/">Ictus y daño cerebral</a><a href="/deterioro-cognitivo/">Deterioro cognitivo</a><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación neuropsicológica de personas adultas con deterioro cognitivo, demencias y secuelas de enfermedad cerebrovascular, integrando perfil cognitivo, evolución y autonomía.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}