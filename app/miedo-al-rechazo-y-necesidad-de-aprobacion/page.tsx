import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Miedo al rechazo y necesidad de aprobación | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para miedo al rechazo, necesidad de aprobación, inseguridad interpersonal y dificultad para mostrar desacuerdo. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/miedo-al-rechazo-y-necesidad-de-aprobacion/" },
  openGraph: {
    title: "Miedo al rechazo y necesidad de aprobación | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar miedo al rechazo, dependencia de la validación externa e inseguridad en las relaciones.",
    url: "https://carolinasanchezgirona.com/miedo-al-rechazo-y-necesidad-de-aprobacion/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para miedo al rechazo y necesidad de aprobación",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en miedo al rechazo, inseguridad interpersonal y necesidad de aprobación",
  url: "https://carolinasanchezgirona.com/miedo-al-rechazo-y-necesidad-de-aprobacion/",
};

export default function RejectionFearPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/autoestima-y-autocritica/">Autoestima</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Miedo al rechazo</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Relaciones</p>
        <h1>Miedo al rechazo y necesidad de aprobación</h1>
        <p className="seo-lead">Buscar aceptación es humano. La dificultad aparece cuando la opinión de los demás determina en exceso cómo te valoras, qué dices, qué decides o cuánto te permites ocupar espacio en una relación.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>El miedo al rechazo puede condicionar más de lo que parece</h2><p>Puede hacer que una persona evite expresar desacuerdo, revise demasiado lo que ha dicho, intente agradar a todo el mundo o interprete señales ambiguas como indicios de desaprobación.</p><p>A corto plazo, adaptarse a los demás puede reducir tensión. A largo plazo, puede aumentar inseguridad, resentimiento y desconexión de las propias necesidades.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil trabajarlo</h2><ul><li>Te cuesta decir que no por miedo a decepcionar.</li><li>Repasas conversaciones para comprobar si has causado mala impresión.</li><li>Necesitas señales frecuentes de aprobación o tranquilidad.</li><li>Evitas mostrar opiniones que podrían generar desacuerdo.</li><li>Cambias mucho tu comportamiento según con quién estés.</li><li>Te cuesta sostener una decisión si alguien importante no la valida.</li><li>Un gesto distante o una respuesta breve puede activar mucha inseguridad.</li></ul></section>
          <section><h2>Qué puede mantener esta dificultad</h2><h3>Valor personal ligado a la aprobación</h3><p>Si sentirse válido depende en gran medida de la respuesta externa, cualquier cambio en la actitud de los demás puede vivirse como una amenaza.</p><h3>Interpretación negativa de señales ambiguas</h3><p>Silencios, mensajes breves o cambios de tono pueden leerse como rechazo aunque existan otras explicaciones posibles.</p><h3>Evitar conflicto a cualquier precio</h3><p>No expresar necesidades reduce el riesgo inmediato de discusión, pero también impide comprobar que una relación puede tolerar diferencias.</p><h3>Búsqueda de tranquilidad</h3><p>Pedir confirmación repetida puede aliviar de forma momentánea, aunque a largo plazo aumente la dependencia de la validación externa.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir identificar situaciones que activan miedo al rechazo, revisar interpretaciones automáticas, reducir conductas de comprobación y búsqueda de tranquilidad, y practicar una comunicación más clara y directa.</p><p>También puede ser necesario trabajar autoestima, tolerancia al desacuerdo, límites y exposición gradual a situaciones en las que no se puede controlar completamente la opinión de los demás.</p></section>
          <section><h2>Miedo al rechazo, autoestima y dependencia emocional</h2><p>La necesidad intensa de aprobación puede relacionarse con <a href="/autoestima-y-autocritica/">autoestima y autocrítica</a>, <a href="/dependencia-emocional/">dependencia emocional</a> o dificultad para poner <a href="/limites-y-relaciones-dificiles/">límites</a>. También puede aumentar la <a href="/ansiedad/">ansiedad</a> en situaciones sociales o relacionales.</p></section>
          <section><h2>No necesitas gustar a todo el mundo para estar a salvo</h2><p>Trabajar este patrón no significa dejar de valorar las relaciones ni volverse indiferente a la opinión ajena. El objetivo es que la aprobación deje de ser el único termómetro para decidir qué puedes decir, hacer o necesitar.</p><div className="seo-callout"><strong>El desacuerdo no equivale necesariamente a rechazo.</strong><span>Una relación sana puede incluir diferencias sin que eso obligue a renunciar a ti.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/autoestima-y-autocritica/">Autoestima y autocrítica</a><a href="/dependencia-emocional/">Dependencia emocional</a><a href="/limites-y-relaciones-dificiles/">Límites</a><a href="/ansiedad/">Ansiedad</a>
              <a href="/ansiedad-social-y-miedo-al-ridiculo/">Ansiedad social</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en inseguridad, autoestima, ansiedad, límites y dificultades relacionales desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}