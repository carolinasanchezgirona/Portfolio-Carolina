import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Burnout y agotamiento laboral | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para burnout, agotamiento laboral, distancia emocional respecto al trabajo y sensación de no poder más. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/burnout-y-agotamiento-laboral/" },
  openGraph: {
    title: "Burnout y agotamiento laboral | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar desgaste laboral sostenido, recuperación, límites y reorganización de demandas.",
    url: "https://carolinasanchezgirona.com/burnout-y-agotamiento-laboral/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para burnout y agotamiento laboral",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en burnout y agotamiento laboral",
  url: "https://carolinasanchezgirona.com/burnout-y-agotamiento-laboral/",
};

export default function BurnoutPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/estres-y-sobrecarga/">Estrés</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Burnout</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Salud laboral</p>
        <h1>Burnout y agotamiento laboral</h1>
        <p className="seo-lead">El agotamiento laboral sostenido puede ir más allá del cansancio. Cuando aparecen distancia emocional respecto al trabajo, sensación de desgaste continuo y pérdida de eficacia percibida, conviene revisar no solo cómo descansar, sino también qué está manteniendo la sobrecarga.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Burnout no es simplemente estar cansado</h2><p>El burnout se asocia a un contexto laboral y suele construirse de forma progresiva cuando las demandas superan durante demasiado tiempo la capacidad de recuperación. Puede combinar agotamiento, cinismo o distancia respecto al trabajo y sensación de bajo rendimiento.</p><p>No sustituye a una evaluación clínica. Sí orienta a revisar la relación entre carga, contexto, límites, recursos y estado emocional.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Te levantas agotado incluso después de haber descansado.</li><li>Notas rechazo, irritación o desconexión creciente respecto al trabajo.</li><li>Sientes que hagas lo que hagas nunca es suficiente.</li><li>Te cuesta recuperar energía fuera del horario laboral.</li><li>Has perdido motivación por tareas que antes tolerabas o disfrutabas.</li><li>El trabajo está afectando al sueño, al ánimo o a tus relaciones.</li><li>Te planteas dejarlo todo, pero te sientes bloqueado para decidir.</li></ul></section>
          <section><h2>Qué puede mantener el agotamiento laboral</h2><h3>Demandas sostenidas sin recuperación suficiente</h3><p>Los picos de carga pueden ser asumibles si existen pausas reales. El problema aparece cuando el esfuerzo extraordinario se convierte en la norma.</p><h3>Falta de control o apoyo</h3><p>Los entornos muy impredecibles, con poco margen de decisión o apoyo insuficiente, pueden aumentar el desgaste.</p><h3>Autoexigencia y sobreimplicación</h3><p>Sentir que todo depende de uno mismo, no delegar o no tolerar un resultado simplemente correcto puede ampliar todavía más la carga.</p><h3>Límites laborales difusos</h3><p>La disponibilidad constante impide una recuperación clara y mantiene el trabajo activo mentalmente fuera de horario.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir análisis de demandas, recuperación de hábitos básicos, límites, delegación, revisión de creencias sobre rendimiento, identificación de factores modificables y planificación de decisiones laborales.</p><p>También se trabaja la activación fisiológica, el descanso, el sueño y la reconstrucción de espacios personales cuando el trabajo ha colonizado demasiado la vida cotidiana.</p></section>
          <section><h2>Burnout, estrés y desconexión del trabajo</h2><p>El burnout se relaciona con <a href="/estres-y-sobrecarga/">estrés y sobrecarga</a>, pero no son exactamente lo mismo. Si el problema principal es que la jornada termina pero la mente sigue trabajando, puede ser útil revisar <a href="/dificultad-para-desconectar-del-trabajo/">dificultad para desconectar del trabajo</a>.</p><p>Cuando el desgaste se sostiene sobre estándares muy altos, también puede ser relevante trabajar <a href="/perfeccionismo-y-autoexigencia/">perfeccionismo y autoexigencia</a>.</p></section>
          <section><h2>Recuperarse no siempre significa volver al mismo ritmo</h2><p>A veces la solución no consiste en aprender a soportar mejor una situación que sigue siendo excesiva. Parte del trabajo terapéutico puede ser identificar qué debe cambiar para que la recuperación sea sostenible.</p><div className="seo-callout"><strong>El agotamiento sostenido es información.</strong><span>Puede estar señalando que la forma actual de trabajar necesita ajustes, no solo más resistencia.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/estres-y-sobrecarga/">Estrés y sobrecarga</a><a href="/dificultad-para-desconectar-del-trabajo/">Desconectar del trabajo</a><a href="/perfeccionismo-y-autoexigencia/">Perfeccionismo</a><a href="/insomnio-y-dificultades-para-dormir/">Insomnio</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en estrés, agotamiento laboral, autoexigencia y toma de decisiones desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}