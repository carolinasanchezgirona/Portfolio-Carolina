import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Insomnio y dificultades para dormir | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para insomnio, dificultad para conciliar o mantener el sueño y preocupación por no dormir. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/insomnio-y-dificultades-para-dormir/" },
  openGraph: {
    title: "Insomnio y dificultades para dormir | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar hábitos de sueño, activación, preocupación nocturna y factores que mantienen el insomnio.",
    url: "https://carolinasanchezgirona.com/insomnio-y-dificultades-para-dormir/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para insomnio y dificultades para dormir",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en insomnio y dificultades de sueño",
  url: "https://carolinasanchezgirona.com/insomnio-y-dificultades-para-dormir/",
};

export default function InsomniaPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/ansiedad/">Ansiedad</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Insomnio</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Sueño</p>
        <h1>Insomnio y dificultades para dormir</h1>
        <p className="seo-lead">Dormir mal de forma puntual es frecuente. El problema aparece cuando la dificultad para conciliar o mantener el sueño se repite, genera preocupación anticipatoria y empieza a afectar al funcionamiento durante el día.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>El insomnio no es solo dormir pocas horas</h2><p>Puede presentarse como dificultad para quedarse dormido, despertares frecuentes, despertar demasiado pronto o sensación de sueño poco reparador. Para valorar su relevancia clínica importa la frecuencia, la duración y la repercusión durante el día.</p><p>También conviene revisar horarios, rutinas, consumo de estimulantes, medicación, dolor, estado emocional y posibles problemas médicos que puedan afectar al sueño.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Tardas mucho en dormirte varias noches por semana.</li><li>Te despiertas repetidamente y te cuesta volver a dormir.</li><li>Empiezas a preocuparte por el sueño desde muchas horas antes de acostarte.</li><li>Miras el reloj de forma repetitiva durante la noche.</li><li>Pasas más tiempo en la cama intentando compensar el cansancio, pero el sueño no mejora.</li><li>El cansancio afecta a concentración, ánimo, trabajo o relaciones.</li><li>Has empezado a organizar tu vida alrededor del miedo a dormir mal.</li></ul></section>
          <section><h2>Qué puede mantener el problema</h2><h3>Preocupación por no dormir</h3><p>Cuanto más importante se vuelve conseguir dormir, más fácil es que aparezca activación y vigilancia sobre cualquier señal de insomnio.</p><h3>Pasar demasiado tiempo en la cama</h3><p>Intentar compensar una mala noche acostándose antes o permaneciendo más tiempo en la cama puede debilitar la asociación entre cama y sueño.</p><h3>Horarios irregulares</h3><p>Cambios frecuentes en la hora de levantarse o dormir pueden dificultar la regulación del ritmo de sueño.</p><h3>Activación mental nocturna</h3><p>Rumiación, planificación y preocupación pueden mantener la mente en modo de resolución de problemas justo cuando se necesita reducir activación.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir psicoeducación sobre sueño, revisión de hábitos, regularización de horarios, control de estímulos, reducción de conductas que mantienen el problema y trabajo sobre pensamientos de amenaza asociados a no dormir.</p><p>Cuando existe preocupación intensa, también puede ser necesario trabajar tolerancia a una mala noche ocasional y reducir la vigilancia constante del sueño.</p></section>
          <section><h2>Insomnio, ansiedad y rumiación</h2><p>El sueño puede verse afectado por <a href="/ansiedad/">ansiedad</a>, <a href="/estres-y-sobrecarga/">estrés y sobrecarga</a> o <a href="/rumiacion-y-pensamientos-repetitivos/">rumiación</a>. En esos casos, tratar solo los hábitos nocturnos puede ser insuficiente si durante el día se mantiene un nivel alto de activación.</p></section>
          <section><h2>Cuándo conviene valoración médica</h2><p>Si existen ronquidos intensos, pausas respiratorias observadas, movimientos anómalos durante el sueño, somnolencia diurna marcada, dolor persistente, síntomas neurológicos o cambios recientes importantes, puede ser necesario complementar la valoración psicológica con una evaluación médica.</p><div className="seo-callout"><strong>Forzar el sueño suele alejarlo.</strong><span>El objetivo es recuperar condiciones que faciliten dormir, no convertir cada noche en una prueba que haya que aprobar.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ansiedad/">Ansiedad</a><a href="/estres-y-sobrecarga/">Estrés y sobrecarga</a><a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación</a><a href="/depresion/">Depresión y bajo estado de ánimo</a>
              <a href="/dificultad-para-desconectar-del-trabajo/">Dificultad para desconectar del trabajo</a>
              <a href="/trauma-psicologico-y-estres-postraumatico/">Trauma psicológico y estrés postraumático</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, sueño, rumiación y sobrecarga desde una formulación clínica individualizada y orientada a objetivos concretos.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}