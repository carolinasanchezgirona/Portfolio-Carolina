import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Ansiedad por la salud e hipocondría | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para ansiedad por la salud, miedo persistente a estar enfermo, comprobaciones corporales y búsqueda repetida de tranquilidad. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/ansiedad-por-la-salud-e-hipocondria/" },
  openGraph: {
    title: "Ansiedad por la salud e hipocondría | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar miedo a la enfermedad, hipervigilancia corporal, comprobaciones y necesidad de certeza médica.",
    url: "https://carolinasanchezgirona.com/ansiedad-por-la-salud-e-hipocondria/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para ansiedad por la salud e hipocondría",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en ansiedad por la salud e hipocondría",
  url: "https://carolinasanchezgirona.com/ansiedad-por-la-salud-e-hipocondria/",
};

export default function HealthAnxietyPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/ansiedad/">Ansiedad</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Ansiedad por la salud</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Ansiedad</p>
        <h1>Ansiedad por la salud e hipocondría</h1>
        <p className="seo-lead">Notar sensaciones corporales y preocuparse por la salud es normal. La dificultad aparece cuando el miedo a estar enfermo ocupa gran parte del día, lleva a comprobar el cuerpo, buscar información o pedir tranquilidad de forma repetida y aun así la duda vuelve.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>La ansiedad por la salud no significa inventarse síntomas</h2><p>Las sensaciones corporales pueden ser reales. El problema suele estar en cómo se interpretan, cuánto se vigilan y qué conductas se utilizan para intentar obtener certeza absoluta sobre su significado.</p><p>Buscar tranquilidad puede aliviar durante un rato, pero si la duda reaparece una y otra vez puede convertirse en parte del ciclo que mantiene la ansiedad.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Interpretas sensaciones habituales como posibles señales de enfermedad grave.</li><li>Revisas tu cuerpo con frecuencia buscando cambios o síntomas.</li><li>Buscas información médica repetidamente en internet.</li><li>Pides confirmación frecuente a familiares o profesionales sanitarios.</li><li>Una prueba médica tranquilizadora te calma solo durante poco tiempo.</li><li>Evitas actividades por miedo a notar síntomas o enfermar.</li><li>La preocupación por la salud afecta a sueño, concentración o vida cotidiana.</li></ul></section>
          <section><h2>Qué puede mantener este problema</h2><h3>Hipervigilancia corporal</h3><p>Cuanto más se observa el cuerpo, más sensaciones se detectan. Algunas son normales, pero bajo ansiedad pueden interpretarse como señales de peligro.</p><h3>Búsqueda de certeza</h3><p>La medicina rara vez puede ofrecer certeza absoluta. Intentar alcanzarla mediante pruebas, búsquedas o consultas repetidas puede mantener la necesidad de seguir comprobando.</p><h3>Interpretación catastrófica</h3><p>Un síntoma ambiguo puede adquirir rápidamente el significado más grave posible, incluso cuando existen explicaciones más probables.</p><h3>Alivio a corto plazo</h3><p>Comprobar, preguntar o buscar información reduce la ansiedad durante unos minutos, lo que hace más probable repetir esas conductas la próxima vez.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir psicoeducación sobre ansiedad y sensaciones corporales, reducción gradual de comprobaciones, trabajo sobre interpretaciones de amenaza, tolerancia a la incertidumbre y exposición a situaciones evitadas.</p><p>También se diferencia cuándo corresponde una evaluación médica y cuándo la búsqueda adicional de certeza está funcionando como una conducta de seguridad.</p></section>
          <section><h2>Ansiedad por la salud, anticipación y pánico</h2><p>Este problema puede relacionarse con <a href="/ansiedad/">ansiedad</a>, <a href="/ansiedad-anticipatoria-y-preocupacion-excesiva/">ansiedad anticipatoria</a> y <a href="/rumiacion-y-pensamientos-repetitivos/">rumiación</a>. Cuando el miedo se dispara ante sensaciones físicas intensas, también puede solaparse con <a href="/ataques-de-panico/">ataques de pánico</a>.</p></section>
          <section><h2>Reducir la vigilancia no significa ignorar la salud</h2><p>El objetivo no es desatender síntomas ni evitar revisiones médicas indicadas. Se trata de recuperar una relación más proporcionada con el cuerpo y dejar de tratar cada sensación como una emergencia potencial.</p><div className="seo-callout"><strong>Cuidarse no es comprobarse sin límite.</strong><span>Una parte importante del tratamiento consiste en aprender cuándo una conducta aporta información y cuándo solo alimenta la duda.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ansiedad/">Ansiedad</a><a href="/ansiedad-anticipatoria-y-preocupacion-excesiva/">Ansiedad anticipatoria</a><a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación</a><a href="/ataques-de-panico/">Ataques de pánico</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, preocupación por la salud, rumiación y miedo a las sensaciones corporales desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}