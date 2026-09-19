import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Afasia y problemas de lenguaje | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica de afasia y problemas de lenguaje tras ictus o daño cerebral adquirido: comprensión, expresión, denominación y comunicación funcional.",
  alternates: { canonical: "/afasia-y-problemas-de-lenguaje/" },
  openGraph: {
    title: "Afasia y problemas de lenguaje | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar dificultades de comprensión, expresión y acceso a palabras tras daño cerebral.",
    url: "https://carolinasanchezgirona.com/afasia-y-problemas-de-lenguaje/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica de afasia y problemas de lenguaje",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica de afasia y alteraciones del lenguaje",
  url: "https://carolinasanchezgirona.com/afasia-y-problemas-de-lenguaje/",
};

export default function AphasiaLanguagePage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a>
<a href="/ictus-y-dano-cerebral-adquirido/">Ictus y daño cerebral</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Afasia y lenguaje</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Lenguaje</p>
        <h1>Afasia y problemas de lenguaje tras daño cerebral</h1>
        <p className="seo-lead">Tras un ictus u otra lesión cerebral pueden aparecer dificultades para encontrar palabras, comprender mensajes, construir frases, leer o escribir. La evaluación neuropsicológica ayuda a definir qué componentes del lenguaje están alterados y cómo repercuten en la comunicación cotidiana.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#que-valorar">Qué se puede valorar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>La afasia no afecta igual a todas las personas</h2><p>Algunas personas comprenden bien pero tienen mucha dificultad para expresarse. Otras hablan con fluidez pero presentan problemas de comprensión o producen palabras poco precisas. También pueden existir dificultades específicas para denominar objetos, repetir, leer o escribir.</p><p>El perfil depende de la localización y extensión de la lesión, del momento evolutivo y de otras funciones cognitivas que también pueden estar afectadas.</p></section>
          <section id="que-valorar"><h2>Qué se puede valorar</h2><ul><li>Comprensión de palabras, frases e instrucciones.</li><li>Expresión oral y fluidez verbal.</li><li>Denominación y acceso léxico.</li><li>Repetición.</li><li>Lectura y comprensión lectora.</li><li>Escritura.</li><li>Capacidad para mantener una conversación funcional.</li><li>Influencia de atención, memoria o funciones ejecutivas sobre la comunicación.</li></ul></section>
          <section><h2>Afasia, disartria y dificultades cognitivas no son lo mismo</h2><p>La afasia afecta al procesamiento del lenguaje. La disartria se relaciona principalmente con la ejecución motora del habla. Además, problemas de atención, memoria o planificación pueden hacer que una conversación resulte difícil sin que exista una alteración lingüística primaria.</p><p>Distinguir estos perfiles ayuda a orientar mejor la rehabilitación y las estrategias de comunicación.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> permite analizar el lenguaje dentro del conjunto del funcionamiento cognitivo. Esto es especialmente útil cuando existen secuelas tras <a href="/ictus-y-dano-cerebral-adquirido/">ictus o daño cerebral adquirido</a>.</p><p>El objetivo es identificar capacidades preservadas, dificultades concretas y apoyos que puedan mejorar la comunicación en situaciones reales.</p></section>
          <section><h2>Orientación para la vida cotidiana</h2><p>Según el perfil, pueden ser útiles mensajes breves, una idea cada vez, apoyos visuales, más tiempo para responder, preguntas cerradas cuando la situación lo requiera y evitar completar sistemáticamente todas las frases de la persona.</p><p>La coordinación con logopedia puede ser importante cuando se necesita una intervención específica sobre lenguaje y comunicación.</p></section>
          <section><h2>La comunicación funcional importa tanto como la puntuación</h2><p>Una prueba puede mostrar dificultades concretas, pero también es necesario saber cómo se comunica la persona en casa, en conversaciones reales y al resolver necesidades cotidianas.</p><div className="seo-callout"><strong>Hablar más no siempre significa comunicarse mejor.</strong><span>La evaluación busca entender qué necesita la persona para comprender, expresarse y participar con mayor autonomía.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ictus-y-dano-cerebral-adquirido/">Ictus y daño cerebral</a><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a><a href="/estimulacion-cognitiva/">Estimulación cognitiva</a><a href="/neuropsicologia/">Neuropsicología</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación neuropsicológica de personas adultas con cambios cognitivos tras daño cerebral, integrando lenguaje, atención, memoria, funciones ejecutivas y repercusión funcional.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}