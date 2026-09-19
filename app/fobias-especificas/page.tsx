import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Fobias específicas | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para fobias específicas: animales, alturas, conducir, sangre, agujas, volar u otras situaciones concretas. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/fobias-especificas/" },
  openGraph: {
    title: "Fobias específicas | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar miedos intensos y evitación ante objetos o situaciones concretas.",
    url: "https://carolinasanchezgirona.com/fobias-especificas/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para fobias específicas",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en fobias específicas y evitación",
  url: "https://carolinasanchezgirona.com/fobias-especificas/",
};

export default function SpecificPhobiasPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/ansiedad/">Ansiedad</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Fobias específicas</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Fobias</p>
        <h1>Fobias específicas</h1>
        <p className="seo-lead">Una fobia específica es un miedo intenso y persistente ante un objeto o situación concreta. Puede aparecer ante animales, alturas, sangre, agujas, conducir, volar, tormentas u otros estímulos y llevar a evitar cada vez más situaciones.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>El problema no es solo sentir miedo</h2><p>El miedo es una respuesta normal cuando existe peligro. En una fobia, la reacción es muy intensa en relación con el riesgo real y puede activarse incluso al anticipar el estímulo.</p><p>La evitación reduce la ansiedad a corto plazo, pero también impide comprobar que la situación puede afrontarse y que la activación acaba disminuyendo.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Evitas actividades, trayectos o lugares por miedo a encontrarte con el estímulo.</li><li>La sola anticipación de la situación genera ansiedad intensa.</li><li>Necesitas ir acompañado o utilizar estrategias de seguridad para afrontarla.</li><li>El miedo interfiere en viajes, salud, trabajo, ocio o vida cotidiana.</li><li>Has ido ampliando la evitación con el paso del tiempo.</li><li>Sabes que el miedo es excesivo, pero aun así te resulta muy difícil acercarte a la situación.</li></ul></section>
          <section><h2>Ejemplos frecuentes</h2><p>Las fobias específicas pueden centrarse en animales, sangre o procedimientos médicos, alturas, ascensores, tormentas, conducir, viajar en avión o determinados espacios. El tratamiento se adapta al estímulo concreto y al patrón de evitación de cada persona.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención suele incluir psicoeducación, exposición gradual y planificada al estímulo temido, reducción de conductas de seguridad y revisión de interpretaciones catastróficas.</p><p>El objetivo no es eliminar toda sensación de miedo, sino aprender que puede aparecer ansiedad sin que sea necesario escapar o evitar.</p></section>
          <section><h2>Fobias, agorafobia y pánico</h2><p>Una fobia específica se centra en un estímulo concreto. La <a href="/agorafobia-y-miedo-a-salir/">agorafobia</a> implica miedo a situaciones en las que escapar o recibir ayuda se percibe como difícil, mientras que los <a href="/ataques-de-panico/">ataques de pánico</a> se relacionan con crisis intensas de ansiedad y miedo a sus consecuencias.</p><p>La evaluación permite diferenciar estos problemas y ajustar el tratamiento.</p></section>
          <section><h2>La exposición se construye, no se improvisa</h2><p>Trabajar una fobia no significa enfrentarse de golpe a la situación más difícil. La exposición se organiza de forma gradual, repetida y suficientemente sostenida para generar aprendizaje.</p><div className="seo-callout"><strong>Evitar protege a corto plazo, pero mantiene el miedo.</strong><span>Acercarse de forma gradual permite recuperar libertad y confianza.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ansiedad/">Ansiedad</a><a href="/agorafobia-y-miedo-a-salir/">Agorafobia</a><a href="/ataques-de-panico/">Ataques de pánico</a><a href="/ansiedad-anticipatoria-y-preocupacion-excesiva/">Ansiedad anticipatoria</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, fobias, evitación y exposición gradual desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}