import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Perfeccionismo y autoexigencia | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para perfeccionismo, autoexigencia, miedo a equivocarse y dificultad para descansar. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/perfeccionismo-y-autoexigencia/" },
  openGraph: {
    title: "Perfeccionismo y autoexigencia | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar estándares rígidos, miedo al error, sobrecarga y autocrítica.",
    url: "https://carolinasanchezgirona.com/perfeccionismo-y-autoexigencia/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para perfeccionismo y autoexigencia",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en perfeccionismo y autoexigencia",
  url: "https://carolinasanchezgirona.com/perfeccionismo-y-autoexigencia/",
};

export default function PerfectionismPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/autoestima-y-autocritica/">Autoestima</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Perfeccionismo y autoexigencia</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Autoexigencia</p>
        <h1>Perfeccionismo y autoexigencia</h1>
        <p className="seo-lead">Exigirse puede ayudar a avanzar, pero cuando el valor personal depende de hacerlo todo bien, no fallar y rendir constantemente, el esfuerzo deja de ser una herramienta y se convierte en una fuente de ansiedad y agotamiento.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>El perfeccionismo no es simplemente querer hacer las cosas bien</h2><p>El problema aparece cuando los estándares son tan rígidos que cualquier error se interpreta como fracaso, insuficiencia o pérdida de valor personal. Esto puede llevar a revisar en exceso, posponer tareas, trabajar de más o evitar situaciones en las que no existe garantía de hacerlo perfecto.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil trabajarlo</h2><ul><li>Te cuesta dar una tarea por terminada porque siempre podría estar mejor.</li><li>Procrastinas porque empezar implica exponerte a no hacerlo perfecto.</li><li>Un error pequeño te afecta mucho más de lo que objetivamente justificaría.</li><li>Te cuesta descansar sin sentir culpa.</li><li>Asumes demasiadas responsabilidades porque delegar genera inseguridad.</li><li>El rendimiento académico o laboral ocupa demasiado espacio mental.</li><li>Te exiges más de lo que exigirías a otras personas.</li></ul></section>
          <section><h2>Qué puede mantener la autoexigencia</h2><h3>Estándares rígidos</h3><p>Cuando solo se considera válido un resultado excelente, todo lo demás puede vivirse como insuficiente.</p><h3>Miedo al error</h3><p>Equivocarse puede sentirse como una amenaza a la imagen personal, profesional o relacional, lo que aumenta comprobaciones y control.</p><h3>Refuerzo por rendimiento</h3><p>Si durante años la aprobación ha estado muy asociada a logros, productividad o responsabilidad, puede ser difícil separar rendimiento de valía personal.</p><h3>Autocrítica como motor</h3><p>Algunas personas temen que tratarse con menos dureza las vuelva conformistas. Sin embargo, la crítica constante suele aumentar ansiedad, bloqueo y agotamiento.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir flexibilizar estándares, revisar reglas internas, reducir comprobaciones, trabajar exposición al error, mejorar la capacidad de priorizar y diferenciar excelencia de perfección.</p><p>También puede ser necesario trabajar descanso, delegación, límites y una forma de autoevaluación menos dependiente del rendimiento.</p></section>
          <section><h2>Perfeccionismo, ansiedad y autoestima</h2><p>La autoexigencia puede relacionarse con <a href="/ansiedad/">ansiedad</a> y con una autoestima muy dependiente del resultado. Cuando la autocrítica tiene mucho peso, puede ser útil revisar también <a href="/autoestima-y-autocritica/">autoestima y autocrítica</a>.</p></section>
          <section><h2>Rendimiento sostenible frente a exigencia constante</h2><p>El objetivo no es renunciar a la ambición ni dejar de esforzarse. Se trata de poder elegir dónde merece la pena invertir energía y aceptar resultados suficientemente buenos cuando la excelencia no aporta un beneficio real.</p><div className="seo-callout"><strong>Hacerlo bien no exige hacerlo perfecto.</strong><span>La flexibilidad permite mantener estándares sin convertirlos en una amenaza constante.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/autoestima-y-autocritica/">Autoestima y autocrítica</a><a href="/ansiedad/">Ansiedad</a><a href="/limites-y-relaciones-dificiles/">Límites y relaciones difíciles</a><a href="/psicologia/">Psicología General Sanitaria</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, autoexigencia, autocrítica, límites y toma de decisiones desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}