import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Trauma psicológico y estrés postraumático | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para secuelas de experiencias traumáticas, recuerdos intrusivos, evitación, hipervigilancia y estrés postraumático. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/trauma-psicologico-y-estres-postraumatico/" },
  openGraph: {
    title: "Trauma psicológico y estrés postraumático | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar secuelas de experiencias traumáticas, evitación, hipervigilancia y recuerdos intrusivos.",
    url: "https://carolinasanchezgirona.com/trauma-psicologico-y-estres-postraumatico/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para trauma psicológico y estrés postraumático",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en trauma psicológico y estrés postraumático",
  url: "https://carolinasanchezgirona.com/trauma-psicologico-y-estres-postraumatico/",
};

export default function TraumaPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/ansiedad/">Ansiedad</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Trauma y estrés postraumático</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Trauma</p>
        <h1>Trauma psicológico y estrés postraumático</h1>
        <p className="seo-lead">Después de una experiencia potencialmente traumática pueden aparecer recuerdos intrusivos, evitación, hipervigilancia, sobresaltos, dificultad para dormir o sensación de seguir en peligro. No todas las personas desarrollan un trastorno por estrés postraumático, y una evaluación clínica ayuda a diferenciar respuestas esperables de un problema que necesita tratamiento.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Trauma y TEPT no son exactamente lo mismo</h2><p>Una experiencia puede vivirse como traumática sin que necesariamente se cumplan criterios de trastorno por estrés postraumático. Para valorar un TEPT importa el tipo de exposición, la presencia de síntomas específicos, su duración y el grado de interferencia.</p><p>También pueden aparecer otras respuestas, como ansiedad, bajo estado de ánimo, culpa, insomnio o evitación, que requieren una formulación individualizada.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Los recuerdos aparecen de forma intrusiva y generan mucho malestar.</li><li>Evitas lugares, personas, conversaciones o situaciones relacionadas con lo ocurrido.</li><li>Te sobresaltas con facilidad o sientes que debes estar constantemente alerta.</li><li>Tienes pesadillas o dificultad para dormir desde la experiencia.</li><li>Notas desconexión, embotamiento emocional o sensación de irrealidad.</li><li>Aparecen culpa, vergüenza o autorreproche relacionados con lo sucedido.</li><li>El malestar persiste y limita relaciones, trabajo, descanso o actividades importantes.</li></ul></section>
          <section><h2>Qué puede mantener el malestar</h2><h3>Evitación</h3><p>Evitar todo lo que recuerda a la experiencia puede reducir el malestar a corto plazo, pero también impedir que el sistema aprenda que el peligro ya no está presente.</p><h3>Hipervigilancia</h3><p>Estar pendiente de señales de amenaza mantiene al organismo en un nivel elevado de activación y puede aumentar sobresaltos, fatiga y dificultades de sueño.</p><h3>Interpretaciones de culpa o responsabilidad</h3><p>Después de una experiencia traumática es frecuente revisar lo ocurrido y atribuirse una responsabilidad mayor de la que realmente correspondía.</p><h3>Aislamiento</h3><p>Retirarse de actividades y vínculos puede reducir estímulos, pero también disminuir apoyo, sensación de seguridad y oportunidades de recuperación.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención depende de la evaluación y puede incluir psicoeducación, regulación de la activación, reducción de evitación, trabajo con recuerdos y significados asociados a la experiencia y recuperación progresiva de actividades y contextos seguros.</p><p>El tratamiento no consiste en obligar a revivir el acontecimiento de forma indiscriminada. La intervención se planifica de manera gradual y ajustada al momento clínico de cada persona.</p></section>
          <section><h2>Trauma, ansiedad, sueño y pensamientos intrusivos</h2><p>Las secuelas traumáticas pueden coexistir con <a href="/ansiedad/">ansiedad</a>, <a href="/insomnio-y-dificultades-para-dormir/">dificultades de sueño</a> y <a href="/pensamientos-intrusivos-y-miedo-a-perder-el-control/">pensamientos o imágenes intrusivas</a>. También pueden aparecer culpa y autorreproche, por lo que en algunos casos puede ser útil trabajar la <a href="/culpa-y-dificultad-para-perdonarse/">culpa</a>.</p></section>
          <section><h2>Recuperarse no significa olvidar</h2><p>El objetivo es que el recuerdo deje de sentirse como una amenaza presente y que la persona pueda recuperar seguridad, autonomía y participación en su vida cotidiana.</p><div className="seo-callout"><strong>Recordar no es lo mismo que seguir reviviendo.</strong><span>El tratamiento busca que la experiencia quede integrada como parte del pasado, no que continúe gobernando el presente.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ansiedad/">Ansiedad</a><a href="/insomnio-y-dificultades-para-dormir/">Insomnio</a><a href="/pensamientos-intrusivos-y-miedo-a-perder-el-control/">Pensamientos intrusivos</a><a href="/culpa-y-dificultad-para-perdonarse/">Culpa</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, secuelas de experiencias traumáticas, pensamientos intrusivos y dificultades de adaptación desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}