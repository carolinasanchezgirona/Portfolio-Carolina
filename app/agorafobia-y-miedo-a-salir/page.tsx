import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Agorafobia y miedo a salir | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para agorafobia, miedo a salir, alejarse de lugares seguros, usar transporte o quedarse sin ayuda. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/agorafobia-y-miedo-a-salir/" },
  openGraph: {
    title: "Agorafobia y miedo a salir | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar miedo a salir, transporte, espacios concurridos y situaciones en las que escapar o recibir ayuda parece difícil.",
    url: "https://carolinasanchezgirona.com/agorafobia-y-miedo-a-salir/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para agorafobia y miedo a salir",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en agorafobia y evitación de situaciones temidas",
  url: "https://carolinasanchezgirona.com/agorafobia-y-miedo-a-salir/",
};

export default function AgoraphobiaPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/ansiedad/">Ansiedad</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Agorafobia</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Ansiedad</p>
        <h1>Agorafobia y miedo a salir de lugares seguros</h1>
        <p className="seo-lead">La agorafobia no consiste simplemente en tener miedo a los espacios abiertos. Puede aparecer al usar transporte, estar entre mucha gente, hacer colas, alejarse de casa o encontrarse en situaciones donde escapar o recibir ayuda se percibe como difícil.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Por qué el miedo puede ir ocupando cada vez más espacio</h2><p>Después de una experiencia de ansiedad intensa, algunas situaciones empiezan a asociarse con peligro. La persona puede evitarlas, realizarlas solo acompañada o llevar objetos y estrategias de seguridad para sentirse protegida.</p><p>Ese alivio inmediato refuerza la idea de que evitar era necesario y puede hacer que el mundo cotidiano se vaya reduciendo poco a poco.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Evitas transporte público, centros comerciales, colas o lugares concurridos.</li><li>Te cuesta alejarte de casa o hacerlo sin compañía.</li><li>Buscas siempre rutas o salidas rápidas por si aparece ansiedad.</li><li>Temes quedarte atrapado, marearte o no poder recibir ayuda.</li><li>Has dejado de hacer actividades por miedo a tener una crisis fuera de un lugar seguro.</li><li>Necesitas llevar medicación, agua, teléfono u otros elementos como condición para salir.</li><li>La evitación limita trabajo, relaciones, ocio o autonomía.</li></ul></section>
          <section><h2>Qué puede mantener la agorafobia</h2><h3>Evitación</h3><p>Evitar reduce ansiedad a corto plazo, pero impide aprender que la situación puede afrontarse y que la activación disminuye sin escapar.</p><h3>Conductas de seguridad</h3><p>Ir siempre acompañado, sentarse cerca de una salida o controlar constantemente el cuerpo puede mantener la sensación de peligro.</p><h3>Miedo a las sensaciones físicas</h3><p>Palpitaciones, mareo o sensación de falta de aire pueden interpretarse como señales de que algo grave está a punto de ocurrir.</p><h3>Anticipación</h3><p>Imaginar durante horas lo que podría pasar antes de salir aumenta la activación y hace que la situación parezca todavía más difícil.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención suele incluir psicoeducación, exposición gradual a situaciones evitadas, reducción de conductas de seguridad y trabajo sobre las interpretaciones asociadas a las sensaciones corporales y a la posibilidad de no poder escapar.</p><p>El ritmo se adapta a la persona. El objetivo no es forzar, sino recuperar autonomía de forma progresiva y sostenible.</p></section>
          <section><h2>Agorafobia y ataques de pánico</h2><p>La agorafobia puede aparecer con o sin <a href="/ataques-de-panico/">ataques de pánico</a>. También puede estar muy relacionada con <a href="/ansiedad-anticipatoria-y-preocupacion-excesiva/">ansiedad anticipatoria</a> y con el miedo a interpretar ciertas sensaciones físicas como peligrosas.</p><p>Por eso conviene valorar qué parte del problema está relacionada con el contexto, qué parte con el miedo a las sensaciones y qué estrategias de evitación se han ido consolidando.</p></section>
          <section><h2>Recuperar libertad, no eliminar toda ansiedad</h2><p>El objetivo terapéutico no es conseguir que nunca aparezca ansiedad, sino que la presencia de ansiedad deje de decidir dónde puedes ir, cuánto puedes alejarte o qué actividades puedes hacer.</p><div className="seo-callout"><strong>La autonomía se recupera paso a paso.</strong><span>La exposición gradual permite ampliar de nuevo el mapa cotidiano sin depender tanto de evitar o escapar.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ataques-de-panico/">Ataques de pánico</a><a href="/ansiedad-anticipatoria-y-preocupacion-excesiva/">Ansiedad anticipatoria</a><a href="/ansiedad/">Ansiedad</a><a href="/ansiedad-por-la-salud-e-hipocondria/">Ansiedad por la salud</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, ataques de pánico, evitación y recuperación progresiva de autonomía desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}