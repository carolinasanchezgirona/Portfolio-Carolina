import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Ansiedad social y miedo a hacer el ridículo | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para ansiedad social, miedo al juicio, vergüenza y evitación de situaciones sociales. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/ansiedad-social-y-miedo-al-ridiculo/" },
  openGraph: {
    title: "Ansiedad social y miedo a hacer el ridículo | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar miedo al juicio, vergüenza, evitación y seguridad en situaciones sociales.",
    url: "https://carolinasanchezgirona.com/ansiedad-social-y-miedo-al-ridiculo/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para ansiedad social y miedo al ridículo",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en ansiedad social y miedo al juicio",
  url: "https://carolinasanchezgirona.com/ansiedad-social-y-miedo-al-ridiculo/",
};

export default function SocialAnxietyPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/ansiedad/">Ansiedad</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Ansiedad social</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Ansiedad social</p>
        <h1>Ansiedad social y miedo a hacer el ridículo</h1>
        <p className="seo-lead">Sentirse observado o evaluado puede activar mucha ansiedad. Cuando el miedo al juicio, a quedarse en blanco o a hacer el ridículo lleva a evitar situaciones, preparar en exceso cada interacción o repasar después lo ocurrido, puede ser útil trabajarlo en terapia.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>La ansiedad social va más allá de ser tímido</h2><p>Puede aparecer al hablar en grupo, conocer gente, participar en reuniones, comer delante de otros, hacer una llamada, expresar una opinión o simplemente sentir que se está siendo observado.</p><p>La dificultad no depende solo de cuántas situaciones sociales se evitan, sino de cuánto condiciona el miedo la conducta y la vida cotidiana.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Evitas reuniones, llamadas o situaciones en las que podrías sentirte observado.</li><li>Preparas en exceso lo que vas a decir por miedo a equivocarte.</li><li>Notas rubor, temblor, bloqueo, tensión o dificultad para hablar en situaciones sociales.</li><li>Después de una interacción repasas lo ocurrido buscando errores.</li><li>Te cuesta mostrar desacuerdo o pedir algo por miedo a quedar mal.</li><li>La opinión de los demás pesa demasiado en tus decisiones.</li><li>La ansiedad limita relaciones, trabajo, estudios o actividades que te importan.</li></ul></section>
          <section><h2>Qué puede mantener la ansiedad social</h2><h3>Atención excesiva sobre uno mismo</h3><p>Vigilar cómo suena la voz, qué expresión tiene la cara o si los demás notan nervios puede aumentar todavía más la activación.</p><h3>Conductas de seguridad</h3><p>Hablar poco, ensayar mentalmente cada frase, evitar mirar a los ojos o esconder signos de ansiedad puede dar alivio a corto plazo, pero mantener el miedo.</p><h3>Interpretaciones negativas</h3><p>Es frecuente asumir que una reacción ambigua significa desaprobación o que cualquier error será muy visible y tendrá consecuencias importantes.</p><h3>Rumiación posterior</h3><p>Revisar una interacción durante horas puede reforzar una memoria sesgada de lo ocurrido y aumentar el miedo a la próxima situación.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir psicoeducación, exposición gradual a situaciones evitadas, reducción de conductas de seguridad, entrenamiento atencional y revisión de interpretaciones sobre juicio, error y vergüenza.</p><p>También puede ser necesario trabajar autoestima, límites y necesidad de aprobación cuando la ansiedad social se sostiene sobre una dependencia muy alta de la valoración externa.</p></section>
          <section><h2>Ansiedad social, rechazo y autoestima</h2><p>La ansiedad social puede relacionarse con <a href="/autoestima-y-autocritica/">miedo al rechazo y necesidad de aprobación</a>, <a href="/autoestima-y-autocritica/">autoestima y autocrítica</a> y <a href="/rumiacion-y-pensamientos-repetitivos/">rumiación</a>. También forma parte del espectro de problemas de <a href="/ansiedad/">ansiedad</a>, aunque su foco principal sea la evaluación social.</p></section>
          <section><h2>El objetivo no es dejar de sentir nervios</h2><p>La meta no es controlar cada señal de ansiedad, sino poder participar, hablar, decidir o exponerse a situaciones relevantes aunque exista cierta incomodidad.</p><div className="seo-callout"><strong>La seguridad no aparece siempre antes de actuar.</strong><span>Muchas veces se construye al comprobar que puedes afrontar la situación sin necesitar hacerlo perfecto.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ansiedad/">Ansiedad</a><a href="/autoestima-y-autocritica/">Miedo al rechazo</a><a href="/autoestima-y-autocritica/">Autoestima</a><a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, inseguridad, miedo al juicio y dificultades relacionales desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}