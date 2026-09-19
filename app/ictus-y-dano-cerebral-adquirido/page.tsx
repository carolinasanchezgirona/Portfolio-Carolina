import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Secuelas cognitivas tras ictus y daño cerebral | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación y seguimiento neuropsicológico tras ictus y daño cerebral adquirido: memoria, atención, lenguaje, funciones ejecutivas y autonomía. Consulta en Arenys de Mar.",
  alternates: { canonical: "/ictus-y-dano-cerebral-adquirido/" },
  openGraph: {
    title: "Secuelas cognitivas tras ictus y daño cerebral | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar cambios cognitivos y funcionales tras ictus u otras lesiones cerebrales adquiridas.",
    url: "https://carolinasanchezgirona.com/ictus-y-dano-cerebral-adquirido/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica tras ictus y daño cerebral adquirido",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación y seguimiento neuropsicológico tras ictus y daño cerebral adquirido",
  url: "https://carolinasanchezgirona.com/ictus-y-dano-cerebral-adquirido/",
};

export default function StrokeBrainInjuryPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a>
              <a href="/afasia-y-problemas-de-lenguaje/">Afasia y problemas de lenguaje</a><a href="/evaluacion-neuropsicologica/">Evaluación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Ictus y daño cerebral adquirido</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Daño cerebral adquirido</p>
        <h1>Secuelas cognitivas tras ictus y daño cerebral adquirido</h1>
        <p className="seo-lead">Después de un ictus u otra lesión cerebral adquirida pueden aparecer dificultades de memoria, atención, lenguaje, planificación, velocidad mental o regulación emocional. La evaluación neuropsicológica ayuda a describir qué funciones están afectadas, cuáles se mantienen y cómo repercuten en la vida diaria.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#que-valorar">Qué se puede valorar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>El impacto cognitivo puede ser muy diferente entre personas</h2><p>No todos los ictus ni todas las lesiones cerebrales producen el mismo perfil. La localización y extensión de la lesión, el tiempo transcurrido, la edad, el estado previo y otros factores médicos influyen en la forma en que se expresa el daño.</p><p>Por eso no basta con saber que ha habido un ictus: es necesario comprender qué capacidades concretas han cambiado y cómo afectan a la autonomía.</p></section>
          <section id="que-valorar"><h2>Qué se puede valorar</h2><ul><li>Atención sostenida, selectiva y dividida.</li><li>Memoria verbal y visual.</li><li>Lenguaje y acceso a palabras.</li><li>Funciones ejecutivas, planificación y flexibilidad mental.</li><li>Velocidad de procesamiento.</li><li>Percepción y habilidades visuoespaciales.</li><li>Cambios emocionales o conductuales que interfieren en la adaptación.</li><li>Impacto funcional en tareas cotidianas.</li></ul></section>
          <section><h2>Cuándo puede ser útil una evaluación neuropsicológica</h2><p>Puede ser especialmente útil cuando existen dudas sobre el grado de recuperación, cuando la persona refiere dificultades persistentes, cuando la familia observa cambios que no siempre son evidentes en consulta médica o cuando se necesita orientar una intervención o un seguimiento.</p><p>También puede ayudar a objetivar la evolución mediante comparaciones posteriores cuando existe una evaluación previa.</p></section>
          <section><h2>Evaluación no significa únicamente pasar pruebas</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> integra entrevista clínica, pruebas estandarizadas, observación, antecedentes médicos y funcionamiento cotidiano.</p><p>El objetivo es construir un perfil útil para la vida real: qué tareas puede realizar la persona de forma autónoma, cuáles requieren apoyo y qué estrategias pueden compensar las dificultades.</p></section>
          <section><h2>Intervención y estrategias compensatorias</h2><p>Según el perfil, el trabajo puede incluir entrenamiento de funciones cognitivas, uso de ayudas externas, planificación de rutinas, adaptación de tareas y estrategias para reducir errores o sobrecarga.</p><p>La <a href="/estimulacion-cognitiva/">estimulación cognitiva</a> tiene más sentido cuando responde a objetivos funcionales concretos y se integra con el resto del tratamiento médico y rehabilitador.</p></section>
          <section><h2>El entorno también forma parte de la recuperación</h2><p>Los cambios cognitivos pueden modificar la dinámica familiar y generar frustración si se interpretan como falta de esfuerzo o desinterés. Explicar el perfil neuropsicológico ayuda a ajustar expectativas y a ofrecer apoyos de forma más eficaz.</p><div className="seo-callout"><strong>Recuperar no siempre significa volver exactamente al punto de partida.</strong><span>La neuropsicología también busca identificar recursos, compensaciones y nuevas formas de recuperar autonomía.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a><a href="/estimulacion-cognitiva/">Estimulación cognitiva</a><a href="/problemas-de-memoria/">Problemas de memoria</a><a href="/neuropsicologia/">Neuropsicología</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación e intervención neuropsicológica con personas adultas, integrando rendimiento cognitivo, estado emocional y repercusión funcional.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}