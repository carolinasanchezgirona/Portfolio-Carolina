import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Estrés y sobrecarga | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para estrés, sobrecarga, agotamiento y dificultad para desconectar. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/estres-y-sobrecarga/" },
  openGraph: {
    title: "Estrés y sobrecarga | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar agotamiento, exceso de demandas, dificultad para parar y recuperación de equilibrio.",
    url: "https://carolinasanchezgirona.com/estres-y-sobrecarga/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para estrés y sobrecarga",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en estrés, sobrecarga y agotamiento",
  url: "https://carolinasanchezgirona.com/estres-y-sobrecarga/",
};

export default function StressPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/ansiedad/">Ansiedad</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Estrés y sobrecarga</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Estrés</p>
        <h1>Estrés, sobrecarga y dificultad para desconectar</h1>
        <p className="seo-lead">Cuando las demandas se acumulan durante demasiado tiempo, el cuerpo y la mente pueden entrar en un modo de alerta constante. La terapia puede ayudar a diferenciar qué se puede cambiar, qué necesita límites y qué hábitos están manteniendo el agotamiento.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>El estrés no depende solo de tener muchas cosas que hacer</h2><p>La sobrecarga aparece cuando las demandas superan durante demasiado tiempo los recursos disponibles o cuando la persona siente que no puede reducir el ritmo sin consecuencias importantes. También influyen la autoexigencia, la dificultad para delegar, la necesidad de control y la falta de recuperación.</p><p>Por eso dos personas con agendas parecidas pueden vivir niveles de estrés muy distintos.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Te cuesta desconectar incluso cuando ya no estás trabajando.</li><li>Notas irritabilidad, tensión muscular, fatiga o dificultad para concentrarte.</li><li>Sientes que siempre hay algo pendiente y nunca llegas a terminar.</li><li>Descansar te genera culpa o sensación de estar perdiendo el tiempo.</li><li>Te cuesta delegar o pedir ayuda aunque estés saturada.</li><li>Has reducido actividades agradables porque todo gira alrededor de obligaciones.</li><li>Empiezas a notar que el agotamiento afecta a relaciones, sueño o rendimiento.</li></ul></section>
          <section><h2>Qué puede mantener la sobrecarga</h2><h3>Autoexigencia elevada</h3><p>Si todo parece importante y hacerlo bien se convierte en una obligación constante, es difícil priorizar o aceptar un resultado suficientemente bueno.</p><h3>Dificultad para poner límites</h3><p>Asumir tareas adicionales, estar siempre disponible o evitar decir que no puede hacer que la carga crezca sin un límite claro.</p><h3>Falta de recuperación</h3><p>No basta con parar físicamente. Si el pensamiento sigue centrado en pendientes, problemas o anticipaciones, el sistema mantiene un nivel alto de activación.</p><h3>Sensación de control insuficiente</h3><p>Los contextos impredecibles o las responsabilidades que dependen de muchas variables externas pueden aumentar la sensación de no poder bajar la guardia.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir análisis de demandas reales, priorización, límites, delegación, organización, recuperación de rutinas de descanso y revisión de creencias sobre productividad, responsabilidad y control.</p><p>También se trabajan estrategias de regulación fisiológica y atención cuando la activación se ha vuelto muy persistente.</p></section>
          <section><h2>Estrés, ansiedad y perfeccionismo</h2><p>La sobrecarga puede solaparse con <a href="/ansiedad/">ansiedad</a>, especialmente cuando existe preocupación persistente o dificultad para desconectar. También puede estar muy relacionada con <a href="/perfeccionismo-y-autoexigencia/">perfeccionismo y autoexigencia</a>.</p><p>Cuando además aparece pensamiento repetitivo, puede ser útil revisar la información sobre <a href="/rumiacion-y-pensamientos-repetitivos/">rumiación y pensamientos repetitivos</a>.</p></section>
          <section><h2>El objetivo no es soportar más</h2><p>Trabajar el estrés no consiste únicamente en aprender a relajarse para seguir sosteniendo el mismo nivel de carga. A veces la intervención más importante es reorganizar demandas, proteger tiempo de recuperación y reducir obligaciones innecesarias.</p><div className="seo-callout"><strong>Recuperarse también forma parte del rendimiento.</strong><span>Sin recuperación suficiente, el sistema acaba funcionando cada vez con menos margen.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ansiedad/">Ansiedad</a><a href="/perfeccionismo-y-autoexigencia/">Perfeccionismo y autoexigencia</a><a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación</a><a href="/depresion/">Depresión y bajo estado de ánimo</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, sobrecarga, autoexigencia y cambios vitales desde una formulación clínica individualizada y orientada a objetivos concretos.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}