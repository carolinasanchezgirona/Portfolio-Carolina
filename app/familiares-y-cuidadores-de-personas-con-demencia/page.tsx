import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Familiares y cuidadores de personas con demencia | Neuropsicóloga en Arenys de Mar",
  description: "Orientación para familiares y cuidadores de personas con demencia: comunicación, cambios de conducta, sobrecarga, rutinas y acompañamiento. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/familiares-y-cuidadores-de-personas-con-demencia/" },
  openGraph: {
    title: "Familiares y cuidadores de personas con demencia | Carolina Sánchez Girona",
    description: "Neuropsicología y orientación práctica para comprender cambios cognitivos, conductuales y emocionales asociados a la demencia.",
    url: "https://carolinasanchezgirona.com/familiares-y-cuidadores-de-personas-con-demencia/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Orientación a familiares y cuidadores de personas con demencia",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Orientación neuropsicológica a familiares y cuidadores de personas con demencia",
  url: "https://carolinasanchezgirona.com/familiares-y-cuidadores-de-personas-con-demencia/",
};

export default function CaregiversDementiaPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/demencias/">Demencias</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Familiares y cuidadores</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Demencias</p>
        <h1>Familiares y cuidadores de personas con demencia</h1>
        <p className="seo-lead">Cuidar a una persona con demencia exige adaptarse a cambios de memoria, lenguaje, autonomía, conducta y personalidad. La orientación a familiares ayuda a comprender qué está ocurriendo y a tomar decisiones más prácticas para el día a día sin convertir el cuidado en una sucesión constante de conflictos.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#orientacion">Qué podemos trabajar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Comprender los cambios reduce muchos conflictos</h2><p>Algunas conductas que desde fuera parecen desinterés, terquedad o falta de colaboración pueden estar relacionadas con dificultades cognitivas. Problemas para recordar instrucciones, organizar una tarea, comprender una situación o regular una emoción pueden modificar la forma en que la persona responde.</p><p>Entender qué capacidades están afectadas permite ajustar expectativas y encontrar estrategias más útiles.</p></section>
          <section id="orientacion"><h2>Qué podemos trabajar con la familia</h2><ul><li>Cómo comunicarse cuando existen problemas de memoria o comprensión.</li><li>Cómo organizar rutinas y reducir situaciones que generan confusión.</li><li>Qué hacer ante preguntas repetitivas, desorientación o resistencia a determinadas actividades.</li><li>Cómo adaptar el entorno para favorecer autonomía y seguridad.</li><li>Cómo responder a cambios de conducta sin entrar continuamente en confrontaciones.</li><li>Cómo repartir responsabilidades de cuidado dentro de la familia.</li><li>Cómo detectar y abordar sobrecarga en la persona cuidadora.</li></ul></section>
          <section><h2>Comunicar mejor no significa corregir más</h2><p>Insistir en que la persona recuerde correctamente o demostrarle que se equivoca puede aumentar frustración sin mejorar la situación. En muchos momentos resulta más útil simplificar mensajes, reducir estímulos, dar una instrucción cada vez y adaptar la conversación a las capacidades que conserva.</p></section>
          <section><h2>Cambios de conducta</h2><p>La apatía, irritabilidad, repetición, desinhibición, suspicacia o resistencia a los cuidados pueden tener múltiples causas. Conviene analizar cuándo aparecen, qué ocurre antes y después y si existen factores médicos, ambientales, emocionales o cognitivos que puedan estar influyendo.</p><p>Cuando aparece un cambio brusco o muy marcado de conducta, especialmente acompañado de síntomas físicos o mayor confusión, es importante descartar primero causas médicas.</p></section>
          <section><h2>La sobrecarga del cuidador también necesita atención</h2><p>Cuidar durante meses o años puede generar cansancio físico, aislamiento, irritabilidad, culpa y sensación de no poder desconectar nunca. Pedir apoyo no significa abandonar a la persona cuidada. Significa intentar sostener el cuidado de una manera viable.</p><p>La orientación puede ayudar a establecer límites, repartir tareas, revisar expectativas y reconocer cuándo hacen falta más recursos externos.</p></section>
          <section><h2>Relación con la evaluación y la estimulación cognitiva</h2><p>La orientación familiar puede complementarse con una <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> cuando es necesario conocer con mayor precisión el perfil cognitivo. También puede coordinarse con <a href="/estimulacion-cognitiva/">estimulación cognitiva</a> cuando esta resulta adecuada para la situación clínica y funcional de la persona.</p><p>Si todavía no existe un diagnóstico claro y predominan los olvidos o cambios cognitivos, puede ser útil revisar <a href="/problemas-de-memoria/">problemas de memoria</a> y <a href="/deterioro-cognitivo/">deterioro cognitivo</a>.</p></section>
          <section><h2>El objetivo es hacer el día a día más manejable</h2><p>No existe una única forma correcta de cuidar. Las estrategias deben adaptarse a la fase de la enfermedad, al perfil de la persona, a su historia previa y a los recursos reales de la familia.</p><div className="seo-callout"><strong>Cuidar también implica adaptar expectativas.</strong><span>Cuando cambia la capacidad de la persona, muchas veces también debe cambiar la forma en que el entorno le pide, explica y acompaña.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Consulta de orientación</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Dirigido a</span><strong>Familiares y cuidadores</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/demencias/">Demencias</a><a href="/deterioro-cognitivo/">Deterioro cognitivo</a><a href="/problemas-de-memoria/">Problemas de memoria</a><a href="/estimulacion-cognitiva/">Estimulación cognitiva</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con personas con deterioro cognitivo y demencia y con sus familias, ayudando a comprender los cambios cognitivos y a trasladar esa información a decisiones prácticas de cuidado.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}