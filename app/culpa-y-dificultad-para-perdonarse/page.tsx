import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Culpa y dificultad para perdonarse | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para culpa persistente, autorreproche y dificultad para perdonarse tras errores, pérdidas o decisiones difíciles. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/culpa-y-dificultad-para-perdonarse/" },
  openGraph: {
    title: "Culpa y dificultad para perdonarse | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar culpa, autorreproche, rumiación y una relación más equilibrada con los propios errores.",
    url: "https://carolinasanchezgirona.com/culpa-y-dificultad-para-perdonarse/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para culpa y dificultad para perdonarse",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en culpa, autorreproche y dificultad para perdonarse",
  url: "https://carolinasanchezgirona.com/culpa-y-dificultad-para-perdonarse/",
};

export default function GuiltPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Culpa y perdón personal</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Culpa</p>
        <h1>Culpa y dificultad para perdonarse</h1>
        <p className="seo-lead">La culpa puede ser útil cuando ayuda a reparar un daño o revisar una conducta. El problema aparece cuando se vuelve persistente, desproporcionada o se transforma en una condena global hacia uno mismo.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>No toda culpa significa haber hecho algo imperdonable</h2><p>La culpa suele aparecer cuando una persona percibe que ha actuado en contra de sus valores o ha causado daño. Puede favorecer responsabilidad y reparación, pero también puede mantenerse incluso cuando ya se ha asumido lo ocurrido y no existe ninguna acción adicional útil.</p><p>En esos casos, el autorreproche deja de ser una guía y empieza a funcionar como una forma de castigo repetitivo.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil trabajar este problema</h2><ul><li>Repasas una decisión o error una y otra vez sin obtener más claridad.</li><li>Sientes que no tienes derecho a estar bien después de lo ocurrido.</li><li>Te cuesta aceptar que actuaste con la información y recursos que tenías entonces.</li><li>Confundes asumir responsabilidad con castigarte indefinidamente.</li><li>Te cuesta recibir comprensión porque sientes que sería “demasiado fácil”.</li><li>La culpa interfiere en sueño, relaciones, concentración o estado de ánimo.</li><li>Sigues buscando una forma de reparar algo que ya no puede modificarse.</li></ul></section>
          <section><h2>Qué puede mantener la culpa</h2><h3>Rumiación</h3><p>Volver una y otra vez sobre lo ocurrido puede dar la sensación de estar intentando resolverlo, aunque en realidad mantenga activados el dolor y el autorreproche.</p><h3>Perfeccionismo moral</h3><p>Algunas personas se exigen haber sabido, previsto o gestionado mejor situaciones complejas, incluso cuando eso no era razonablemente posible.</p><h3>Confundir culpa con identidad</h3><p>No es lo mismo concluir “hice algo que no me gusta” que “soy una mala persona”. Cuando el juicio se vuelve global, la reparación resulta mucho más difícil.</p><h3>Miedo a repetir el error</h3><p>Castigarse puede parecer una forma de garantizar que algo no volverá a ocurrir, pero suele generar más vigilancia y menos aprendizaje útil.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir diferenciar responsabilidad real de responsabilidad imaginada, revisar estándares excesivos, analizar qué reparación es posible y trabajar una perspectiva más contextualizada sobre lo ocurrido.</p><p>También puede ser necesario reducir rumiación, trabajar autocrítica y aprender a tolerar que algunas experiencias dolorosas no pueden cerrarse con una explicación perfecta.</p></section>
          <section><h2>Culpa, duelo, rupturas y autoestima</h2><p>La culpa puede aparecer tras una pérdida, una <a href="/rupturas-de-pareja/">ruptura de pareja</a>, una decisión difícil o un conflicto relacional. También puede intensificarse cuando existen <a href="/autoestima-y-autocritica/">autocrítica</a>, <a href="/perfeccionismo-y-autoexigencia/">perfeccionismo</a> o <a href="/rumiacion-y-pensamientos-repetitivos/">pensamientos repetitivos</a>.</p><p>En procesos de <a href="/duelo/">duelo</a>, por ejemplo, es frecuente revisar conversaciones, decisiones médicas o momentos concretos buscando una certeza que ya no puede obtenerse.</p></section>
          <section><h2>Perdonarse no es justificarlo todo</h2><p>Perdonarse no implica negar el impacto de lo ocurrido ni renunciar a la responsabilidad. Puede significar reconocer un error, reparar cuando sea posible, aprender de él y dejar de convertirlo en una sentencia permanente sobre la propia identidad.</p><div className="seo-callout"><strong>Responsabilidad y castigo no son lo mismo.</strong><span>Aprender de un error puede exigir mirarlo con precisión, no castigarse sin límite.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/rumiacion-y-pensamientos-repetitivos/">Rumiación</a><a href="/autoestima-y-autocritica/">Autoestima y autocrítica</a><a href="/duelo/">Duelo</a><a href="/rupturas-de-pareja/">Rupturas de pareja</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en culpa, rumiación, duelo, autocrítica y dificultades relacionales desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}