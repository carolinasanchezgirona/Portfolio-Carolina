import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Autoestima y autocrítica | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para baja autoestima, autocrítica intensa, inseguridad y dificultad para valorarse. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/autoestima-y-autocritica/" },
  openGraph: {
    title: "Autoestima y autocrítica | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar inseguridad, autoexigencia, comparación y una relación más flexible con uno mismo.",
    url: "https://carolinasanchezgirona.com/autoestima-y-autocritica/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para autoestima y autocrítica",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en autoestima, inseguridad y autocrítica",
  url: "https://carolinasanchezgirona.com/autoestima-y-autocritica/",
};

export default function SelfEsteemPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/limites-y-relaciones-dificiles/">Límites</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>

      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Autoestima y autocrítica</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Autoconcepto</p>
        <h1>Autoestima, inseguridad y autocrítica</h1>
        <p className="seo-lead">Cuando la valoración personal depende demasiado de hacerlo todo bien, gustar a los demás o no cometer errores, la autocrítica puede convertirse en una fuente constante de ansiedad, bloqueo y desgaste.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>La autoestima no es sentirse bien todo el tiempo</h2><p>Una autoestima estable no implica verse de forma positiva en cada momento. Tiene más que ver con poder reconocer fortalezas y limitaciones sin convertir cada error, crítica o rechazo en una prueba de falta de valor personal.</p><p>Cuando la autoevaluación es muy rígida, la persona puede quedar atrapada entre exigirse demasiado y sentir que nunca alcanza el nivel esperado.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil trabajar este tema</h2><ul><li>Te comparas con frecuencia y casi siempre sales perdiendo.</li><li>Un error pequeño cambia de forma brusca la opinión que tienes de ti.</li><li>Te cuesta reconocer logros o cualidades sin restarles importancia.</li><li>Necesitas mucha aprobación externa para sentir seguridad.</li><li>Evitas situaciones por miedo a quedar en evidencia o no hacerlo suficientemente bien.</li><li>La crítica interna es más dura de lo que usarías con otras personas.</li><li>La inseguridad afecta a relaciones, trabajo o toma de decisiones.</li></ul></section>
          <section><h2>Qué puede mantener la baja autoestima</h2><h3>Autoexigencia y perfeccionismo</h3><p>Si el valor personal depende de cumplir estándares muy altos, cualquier fallo puede vivirse como una confirmación de insuficiencia.</p><h3>Comparación constante</h3><p>Compararse de forma selectiva con los puntos fuertes de otras personas puede reforzar una visión sesgada de las propias capacidades.</p><h3>Necesidad de validación</h3><p>Cuando la seguridad depende sobre todo de la aprobación externa, los cambios en la respuesta de los demás adquieren un peso desproporcionado.</p><h3>Sesgos en la forma de interpretarse</h3><p>Es frecuente prestar mucha atención a errores y críticas mientras se minimizan avances, recursos y experiencias que contradicen la imagen negativa.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir revisión de creencias centrales, identificación de estándares poco realistas, reducción de conductas de comparación, trabajo sobre autocrítica y entrenamiento en decisiones más alineadas con necesidades y valores propios.</p><p>También puede ser necesario trabajar exposición a situaciones evitadas, límites, habilidades sociales o patrones relacionales cuando la inseguridad se mantiene a través de la búsqueda constante de aprobación.</p></section>
          <section><h2>Autoestima, relaciones y dependencia emocional</h2><p>La baja autoestima puede aparecer junto a <a href="/dependencia-emocional/">dependencia emocional</a> o dificultad para poner <a href="/limites-y-relaciones-dificiles/">límites</a>, pero no son exactamente lo mismo. La formulación clínica permite identificar qué procesos son relevantes en cada caso.</p></section>
          <section><h2>El objetivo no es construir una imagen perfecta</h2><p>Trabajar la autoestima no consiste en convencerte de que todo en ti es positivo. El objetivo es desarrollar una valoración más amplia, realista y estable que no dependa de cada resultado o reacción externa.</p><div className="seo-callout"><strong>La seguridad no exige ausencia de dudas.</strong><span>Puede construirse aprendiendo a actuar incluso cuando la autocrítica todavía aparece.</span></div></section>
        </article>

        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/limites-y-relaciones-dificiles/">Límites y relaciones difíciles</a><a href="/dependencia-emocional/">Dependencia emocional</a><a href="/ansiedad/">Ansiedad</a><a href="/depresion/">Depresión y bajo estado de ánimo</a></div></div>
        </aside>
      </div>

      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en dificultades relacionadas con autocrítica, inseguridad, ansiedad, límites y toma de decisiones desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>

      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}