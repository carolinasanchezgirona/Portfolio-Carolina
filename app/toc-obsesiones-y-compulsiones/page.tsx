import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "TOC, obsesiones y compulsiones | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para trastorno obsesivo-compulsivo, obsesiones, compulsiones, comprobaciones y rituales. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/toc-obsesiones-y-compulsiones/" },
  openGraph: {
    title: "TOC, obsesiones y compulsiones | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar obsesiones, compulsiones, rituales, comprobaciones y neutralizaciones.",
    url: "https://carolinasanchezgirona.com/toc-obsesiones-y-compulsiones/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para TOC, obsesiones y compulsiones",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en trastorno obsesivo-compulsivo, obsesiones y compulsiones",
  url: "https://carolinasanchezgirona.com/toc-obsesiones-y-compulsiones/",
};

export default function OCDPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/ansiedad/">Ansiedad</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>TOC</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Trastorno obsesivo-compulsivo</p>
        <h1>TOC, obsesiones y compulsiones</h1>
        <p className="seo-lead">En el trastorno obsesivo-compulsivo, las obsesiones generan ansiedad o malestar y la persona realiza compulsiones, rituales o neutralizaciones para reducir esa sensación o prevenir una consecuencia temida. El alivio suele durar poco y el ciclo vuelve a empezar.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Qué diferencia una obsesión de una preocupación habitual</h2><p>Las obsesiones son pensamientos, imágenes o impulsos recurrentes e intrusivos que se viven como no deseados y generan malestar. Suelen activar una necesidad intensa de comprobar, neutralizar o conseguir certeza.</p><p>Las compulsiones son conductas o actos mentales repetitivos realizados para reducir ansiedad o evitar una consecuencia temida. Pueden ser visibles, como comprobar una puerta, o internas, como repetir frases, revisar recuerdos o buscar una sensación de certeza.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Repites comprobaciones aunque racionalmente sepas que ya has revisado algo.</li><li>Realizas rituales para sentir que algo queda “bien” o seguro.</li><li>Buscas certeza absoluta sobre temas que no pueden resolverse al cien por cien.</li><li>Necesitas pedir tranquilidad a otras personas una y otra vez.</li><li>Evitas objetos, lugares o situaciones por miedo a activar obsesiones.</li><li>Realizas neutralizaciones mentales para deshacer o contrarrestar pensamientos.</li><li>Las obsesiones y compulsiones consumen tiempo o interfieren en tu vida cotidiana.</li></ul></section>
          <section><h2>Qué puede mantener el ciclo obsesivo-compulsivo</h2><h3>Alivio inmediato tras la compulsión</h3><p>La compulsión reduce ansiedad a corto plazo, lo que hace más probable repetirla la próxima vez que aparece la duda.</p><h3>Necesidad de certeza</h3><p>Intentar estar completamente seguro puede convertir cualquier pequeña duda en un problema que exige nuevas comprobaciones.</p><h3>Sobrevaloración del pensamiento</h3><p>Interpretar un pensamiento como peligroso, significativo o moralmente relevante aumenta la urgencia por neutralizarlo.</p><h3>Evitación</h3><p>Evitar situaciones asociadas a las obsesiones impide aprender que la ansiedad puede disminuir sin realizar el ritual.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención psicológica de referencia incluye exposición con prevención de respuesta, adaptada de forma gradual al perfil de cada persona. El objetivo es exponerse a la duda o al disparador sin realizar la compulsión habitual y permitir que la ansiedad cambie sin depender del ritual.</p><p>También se trabaja psicoeducación, tolerancia a la incertidumbre, reducción de búsqueda de tranquilidad y revisión de creencias que mantienen el problema.</p></section>
          <section><h2>Pensamientos intrusivos y miedo a perder el control</h2><p>Los pensamientos intrusivos son pensamientos, imágenes o impulsos no deseados que pueden aparecer en muchas personas sin que exista TOC. Tener un pensamiento no equivale a querer actuar sobre él ni demuestra una intención oculta.</p><p>La evaluación clínica ayuda a diferenciar cuándo existe un patrón obsesivo-compulsivo y cuándo se trata de pensamientos intrusivos asociados a ansiedad, estrés u otros procesos. Lo relevante es cómo se interpretan, cuánto malestar generan y si desencadenan comprobaciones, neutralizaciones, evitación o búsqueda repetida de tranquilidad.</p><p>El TOC también puede relacionarse con <a href="/ansiedad/">ansiedad</a>, <a href="/rumiacion-y-pensamientos-repetitivos/">rumiación</a> y una fuerte necesidad de certeza, pero no todo pensamiento intrusivo implica un diagnóstico.</p></section>
          <section><h2>La terapia no busca demostrar que el miedo es imposible</h2><p>Intentar demostrar una seguridad total suele alimentar el ciclo. El objetivo es poder convivir con un grado razonable de incertidumbre sin responder automáticamente con compulsiones.</p><div className="seo-callout"><strong>La certeza absoluta es una trampa frecuente en el TOC.</strong><span>El tratamiento ayuda a reducir la necesidad de comprobar y a recuperar libertad de acción.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related">
<a href="/ansiedad/">Ansiedad</a><a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación</a>
</div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, obsesiones, compulsiones y pensamientos intrusivos desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}