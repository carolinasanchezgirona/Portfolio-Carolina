import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Ansiedad anticipatoria y preocupación excesiva | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para ansiedad anticipatoria, preocupación excesiva, necesidad de control e incertidumbre. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/ansiedad-anticipatoria-y-preocupacion-excesiva/" },
  openGraph: {
    title: "Ansiedad anticipatoria y preocupación excesiva | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar anticipación de escenarios, preocupación persistente, incertidumbre y necesidad de control.",
    url: "https://carolinasanchezgirona.com/ansiedad-anticipatoria-y-preocupacion-excesiva/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para ansiedad anticipatoria y preocupación excesiva",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en ansiedad anticipatoria y preocupación excesiva",
  url: "https://carolinasanchezgirona.com/ansiedad-anticipatoria-y-preocupacion-excesiva/",
};

export default function AnticipatoryAnxietyPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/ansiedad/">Ansiedad</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Ansiedad anticipatoria</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Ansiedad</p>
        <h1>Ansiedad anticipatoria y preocupación excesiva</h1>
        <p className="seo-lead">Anticipar puede ayudar a prepararse. El problema aparece cuando la mente genera escenarios una y otra vez, intenta prever todas las posibilidades y convierte la incertidumbre en una amenaza constante.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Preocuparse no siempre ayuda a estar más preparado</h2><p>La preocupación útil suele conducir a una acción concreta. La preocupación excesiva, en cambio, tiende a multiplicar escenarios hipotéticos, aumentar la activación y dejar una sensación de no haber pensado todavía lo suficiente.</p><p>Cuanto más se intenta conseguir certeza total antes de actuar, más difícil puede resultar tolerar cualquier duda pendiente.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Piensas con frecuencia en lo que podría salir mal aunque no haya señales claras de peligro.</li><li>Te cuesta disfrutar de algo porque ya estás anticipando el siguiente problema.</li><li>Necesitas revisar, confirmar o preguntar repetidamente para quedarte tranquilo.</li><li>La incertidumbre sobre trabajo, salud o relaciones ocupa gran parte del día.</li><li>Notas tensión, inquietud, dificultad para concentrarte o problemas de sueño.</li><li>Te cuesta tomar decisiones si no puedes prever bien todas las consecuencias.</li><li>Incluso cuando un problema se resuelve, la preocupación se desplaza rápidamente a otro.</li></ul></section>
          <section><h2>Qué puede mantener la ansiedad anticipatoria</h2><h3>Necesidad de certeza</h3><p>Cuando la duda se vive como intolerable, la mente intenta eliminarla generando más análisis, comprobaciones y escenarios.</p><h3>Confundir posibilidad con probabilidad</h3><p>Que algo pueda ocurrir no significa que sea probable, pero la ansiedad puede hacer que ambos conceptos se sientan casi equivalentes.</p><h3>Búsqueda de control</h3><p>Planificar y prever puede dar alivio a corto plazo, aunque también reforzar la idea de que solo estarás seguro si consigues anticiparlo todo.</p><h3>Atención selectiva a señales de amenaza</h3><p>Cuanto más se vigila lo que podría salir mal, más fácil es encontrar indicios ambiguos que parecen confirmar la preocupación.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir diferenciar problemas reales de hipotéticos, limitar comprobaciones, trabajar tolerancia a la incertidumbre, revisar estimaciones de riesgo y reducir conductas destinadas a obtener tranquilidad inmediata.</p><p>También puede ser útil entrenar resolución de problemas cuando existe una acción concreta y aprender a dejar sin resolver aquello que, por definición, no puede conocerse de antemano.</p></section>
          <section><h2>Ansiedad anticipatoria, rumiación y decisiones</h2><p>La preocupación excesiva forma parte de los problemas de <a href="/ansiedad/">ansiedad</a> y puede solaparse con <a href="/rumiacion-y-pensamientos-repetitivos/">rumiación</a>. Cuando la necesidad de certeza bloquea elecciones, puede ser útil trabajar también la <a href="/toma-de-decisiones-e-indecision/">toma de decisiones</a>.</p><p>Si la anticipación se intensifica al exponerse al juicio de otras personas, puede ser relevante revisar la <a href="/ansiedad-social-y-miedo-al-ridiculo/">ansiedad social</a>.</p></section>
          <section><h2>No puedes eliminar toda incertidumbre</h2><p>El objetivo no es garantizar que nada saldrá mal, sino poder actuar con información suficiente sin exigir una certeza imposible.</p><div className="seo-callout"><strong>Prepararse y preocuparse no son lo mismo.</strong><span>La preparación termina cuando hay una acción útil. La preocupación excesiva sigue girando aunque ya no aporte nada nuevo.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ansiedad/">Ansiedad</a><a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación</a><a href="/toma-de-decisiones-e-indecision/">Toma de decisiones</a><a href="/ansiedad-social-y-miedo-al-ridiculo/">Ansiedad social</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, preocupación excesiva, rumiación e indecisión desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}