import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Cambios vitales y adaptación | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para cambios vitales, transiciones, adaptación a nuevas etapas y sensación de desbordamiento. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/cambios-vitales-y-adaptacion/" },
  openGraph: {
    title: "Cambios vitales y adaptación | Carolina Sánchez Girona",
    description: "Psicología sanitaria para afrontar transiciones, cambios importantes, incertidumbre y adaptación a nuevas etapas vitales.",
    url: "https://carolinasanchezgirona.com/cambios-vitales-y-adaptacion/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para cambios vitales y adaptación",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en cambios vitales y procesos de adaptación",
  url: "https://carolinasanchezgirona.com/cambios-vitales-y-adaptacion/",
};

export default function LifeChangesPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/ansiedad/">Ansiedad</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Cambios vitales y adaptación</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Transiciones</p>
        <h1>Cambios vitales y adaptación a nuevas etapas</h1>
        <p className="seo-lead">Incluso los cambios elegidos pueden generar incertidumbre, cansancio o sensación de desorientación. Mudanzas, cambios laborales, separaciones, maternidad, pérdidas, jubilación o nuevas responsabilidades obligan a reorganizar rutinas, expectativas y formas de relacionarse con uno mismo y con los demás.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Adaptarse no significa sentirse bien desde el primer momento</h2><p>Un cambio importante puede exigir tiempo para construir nuevas rutinas, redefinir prioridades y asumir que algunas cosas ya no funcionan como antes. Es habitual que convivan emociones aparentemente contradictorias, como alivio y tristeza, ilusión y miedo o ganas de avanzar y necesidad de parar.</p><p>La dificultad aparece cuando el malestar se mantiene, la persona se siente bloqueada o la transición empieza a afectar de forma importante al sueño, el estado de ánimo, las relaciones o el funcionamiento diario.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Te cuesta adaptarte a una etapa nueva aunque racionalmente entiendas el cambio.</li><li>Sientes que has perdido referencias, rutinas o sensación de identidad.</li><li>La incertidumbre ocupa gran parte del día.</li><li>Te cuesta tomar decisiones relacionadas con la nueva situación.</li><li>Notas irritabilidad, cansancio, ansiedad o bajo estado de ánimo persistentes.</li><li>Te comparas constantemente con cómo eras antes del cambio.</li><li>El proceso está afectando a relaciones, trabajo, descanso o autocuidado.</li></ul></section>
          <section><h2>Qué puede dificultar la adaptación</h2><h3>Intentar recuperar exactamente la etapa anterior</h3><p>Algunos cambios obligan a construir una nueva organización en lugar de volver al funcionamiento previo. Mantener como única referencia cómo eran las cosas antes puede aumentar la sensación de fracaso.</p><h3>Exigirse adaptarse demasiado rápido</h3><p>La presión por estar bien, ser productivo o tener respuestas claras puede añadir una segunda capa de malestar al propio proceso de cambio.</p><h3>Falta de apoyo o exceso de responsabilidades</h3><p>Las transiciones son más difíciles cuando se afrontan con pocos recursos, poca red de apoyo o demasiadas demandas simultáneas.</p><h3>Incertidumbre sostenida</h3><p>Cuando todavía no se conoce cómo quedará una situación laboral, familiar o personal, la mente puede intentar anticipar todos los escenarios posibles y aumentar la activación.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir clarificar qué ha cambiado y qué permanece, reorganizar prioridades, recuperar rutinas, identificar recursos, trabajar expectativas poco realistas y desarrollar estrategias para manejar la incertidumbre.</p><p>También puede ser necesario trabajar pérdidas asociadas al cambio, límites, toma de decisiones o recuperación de espacios personales.</p></section>
          <section><h2>Cambios vitales, ansiedad y duelo</h2><p>Los procesos de adaptación pueden solaparse con <a href="/ansiedad/">ansiedad</a>, <a href="/duelo/">duelo</a> o <a href="/estres-y-sobrecarga/">estrés y sobrecarga</a>. La evaluación permite diferenciar qué parte del malestar corresponde a una respuesta esperable ante la transición y qué factores están manteniendo el problema.</p></section>
          <section><h2>Adaptarse también implica redefinir</h2><p>No siempre se trata de volver a ser exactamente la persona que eras antes. Algunas etapas requieren revisar prioridades, expectativas, roles y formas de organizar la vida.</p><div className="seo-callout"><strong>Adaptarse no es resignarse.</strong><span>Es encontrar una forma viable de vivir la nueva realidad sin perder de vista lo que sigue siendo importante para ti.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ansiedad/">Ansiedad</a><a href="/duelo/">Duelo</a><a href="/estres-y-sobrecarga/">Estrés y sobrecarga</a><a href="/toma-de-decisiones-e-indecision/">Toma de decisiones</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en procesos de adaptación, ansiedad, duelo, sobrecarga y toma de decisiones desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}