import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Procrastinación y bloqueo | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para procrastinación, bloqueo, dificultad para empezar tareas y miedo a equivocarse. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/procrastinacion-y-bloqueo/" },
  openGraph: {
    title: "Procrastinación y bloqueo | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar evitación, bloqueo, autoexigencia y dificultad para iniciar o terminar tareas.",
    url: "https://carolinasanchezgirona.com/procrastinacion-y-bloqueo/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para procrastinación y bloqueo",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en procrastinación, bloqueo y evitación",
  url: "https://carolinasanchezgirona.com/procrastinacion-y-bloqueo/",
};

export default function ProcrastinationPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/perfeccionismo-y-autoexigencia/">Perfeccionismo</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Procrastinación y bloqueo</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Evitación y bloqueo</p>
        <h1>Procrastinación y bloqueo</h1>
        <p className="seo-lead">Posponer no siempre significa pereza. A menudo aparece cuando una tarea activa miedo al error, aburrimiento, saturación, incertidumbre o una exigencia tan alta que empezar parece más difícil que seguir evitando.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Procrastinar no es simplemente “dejarlo para mañana”</h2><p>La procrastinación suele funcionar como una forma de evitar temporalmente una emoción incómoda asociada a una tarea. Puede reducir malestar a corto plazo, pero aumenta presión, culpa y sensación de incapacidad cuando se repite.</p><p>El bloqueo también puede aparecer cuando no está claro por dónde empezar, cuando la tarea es demasiado grande o cuando la persona cree que solo merece la pena hacerla si puede hacerla muy bien.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil trabajar este problema</h2><ul><li>Te cuesta empezar incluso tareas importantes o relativamente sencillas.</li><li>Esperas a tener ganas, energía o claridad perfectas antes de actuar.</li><li>Alternas periodos de evitación con carreras de última hora.</li><li>Te bloqueas si una tarea no tiene un primer paso muy claro.</li><li>Pospones por miedo a equivocarte o no estar a la altura.</li><li>La culpa por no avanzar consume más energía que la propia tarea.</li><li>El patrón afecta a trabajo, estudios, gestiones o proyectos personales.</li></ul></section>
          <section><h2>Qué puede mantener la procrastinación</h2><h3>Perfeccionismo</h3><p>Si solo se acepta un resultado excelente, empezar puede sentirse como exponerse a una evaluación constante.</p><h3>Ansiedad anticipatoria</h3><p>Cuanto más se anticipa el malestar asociado a una tarea, más tentador resulta buscar alivio inmediato haciendo otra cosa.</p><h3>Tareas poco definidas</h3><p>Objetivos demasiado amplios o ambiguos dificultan transformar una intención en una acción concreta.</p><h3>Autocrítica después de posponer</h3><p>Castigarse por haber evitado puede aumentar vergüenza y disminuir aún más la disposición a retomar la tarea.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir análisis funcional de la evitación, división de tareas, reducción del umbral de inicio, planificación realista, exposición gradual a tareas incómodas y revisión de creencias sobre rendimiento y error.</p><p>También puede ser útil aprender a diferenciar falta de motivación de falta de claridad, y trabajar la capacidad de actuar aunque no aparezca una sensación previa de ganas o seguridad.</p></section>
          <section><h2>Procrastinación, ansiedad y toma de decisiones</h2><p>La procrastinación puede relacionarse con <a href="/ansiedad/">ansiedad</a>, <a href="/perfeccionismo-y-autoexigencia/">perfeccionismo y autoexigencia</a>, <a href="/autoestima-y-autocritica/">autocrítica</a> o dificultad para <a href="/toma-de-decisiones-e-indecision/">tomar decisiones</a>. Identificar qué función cumple la evitación es clave para elegir una estrategia útil.</p></section>
          <section><h2>Empezar pequeño suele ser más útil que esperar el momento perfecto</h2><p>El objetivo no es convertirse en una persona productiva todo el tiempo. Se trata de poder iniciar y sostener acciones importantes sin depender por completo de la motivación, la certeza o una ausencia total de incomodidad.</p><div className="seo-callout"><strong>La acción puede preceder a la motivación.</strong><span>A veces avanzar unos minutos desbloquea más que seguir esperando a sentirse preparado.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ansiedad/">Ansiedad</a><a href="/perfeccionismo-y-autoexigencia/">Perfeccionismo</a><a href="/autoestima-y-autocritica/">Autoestima</a><a href="/toma-de-decisiones-e-indecision/">Toma de decisiones</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en procrastinación, ansiedad, autoexigencia, autocrítica y toma de decisiones desde una formulación clínica individualizada.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}