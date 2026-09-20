import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Alzheimer: primeros síntomas y evaluación | Neuropsicóloga en Arenys de Mar",
  description: "Primeros síntomas de Alzheimer y papel de la evaluación neuropsicológica: memoria reciente, orientación, lenguaje, autonomía y cuándo consultar.",
  alternates: { canonical: "/alzheimer-primeros-sintomas-y-evaluacion/" },
  openGraph: {
    title: "Alzheimer: primeros síntomas y evaluación | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar señales iniciales compatibles con enfermedad de Alzheimer y diferenciarlas de otros cambios cognitivos.",
    url: "https://carolinasanchezgirona.com/alzheimer-primeros-sintomas-y-evaluacion/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica ante sospecha de enfermedad de Alzheimer",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica de memoria y otros cambios cognitivos compatibles con enfermedad de Alzheimer",
  url: "https://carolinasanchezgirona.com/alzheimer-primeros-sintomas-y-evaluacion/",
};

export default function AlzheimerEarlySymptomsPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/demencias/">Demencias</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Alzheimer: primeros síntomas</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Memoria y demencias</p>
        <h1>Alzheimer: primeros síntomas y evaluación neuropsicológica</h1>
        <p className="seo-lead">La enfermedad de Alzheimer suele asociarse a problemas de memoria, pero sus primeras manifestaciones pueden incluir también dificultades de orientación, lenguaje, planificación o autonomía. Ningún síntoma aislado confirma un diagnóstico: lo importante es valorar el patrón, la progresión y su impacto en la vida cotidiana.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#senales-iniciales">Señales iniciales</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Qué cambios pueden llamar la atención al inicio</h2><p>En las fases iniciales, algunas personas repiten preguntas, olvidan conversaciones recientes, necesitan más ayuda con citas o gestiones, se desorientan en situaciones que antes manejaban bien o muestran dificultades nuevas para encontrar palabras.</p><p>La evolución progresiva y la interferencia funcional son datos especialmente relevantes.</p></section>
          <section id="senales-iniciales"><h2>Señales que pueden justificar una valoración</h2><ul><li>Olvidos repetidos de información reciente.</li><li>Repetición frecuente de preguntas o conversaciones.</li><li>Dificultad creciente para gestionar citas, medicación, dinero o trámites.</li><li>Desorientación en fechas, lugares o rutas conocidas.</li><li>Problemas nuevos de lenguaje o para encontrar palabras habituales.</li><li>Dificultades para planificar tareas que antes eran rutinarias.</li><li>Cambios progresivos observados también por familiares.</li></ul></section>
          <section><h2>No todo problema de memoria es Alzheimer</h2><p>El envejecimiento normal, la ansiedad, la depresión, el sueño, determinados medicamentos y otras enfermedades pueden afectar a la memoria. También existen otras causas de deterioro cognitivo y otros tipos de demencia.</p><p>Por eso conviene evitar conclusiones a partir de olvidos aislados. Si todavía no está claro si los cambios son esperables por edad, puede ser útil revisar <a href="/problemas-de-memoria/">envejecimiento cognitivo normal o deterioro</a>.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> permite explorar memoria, atención, lenguaje, funciones ejecutivas, orientación y otras capacidades según el motivo de consulta.</p><p>Los resultados se interpretan junto con la historia clínica, la evolución y la autonomía cotidiana. Esto ayuda a describir si existe un patrón compatible con deterioro cognitivo y a orientar los siguientes pasos.</p></section>
          <section><h2>Relación con deterioro cognitivo leve y demencia</h2><p>Algunas personas presentan <a href="/deterioro-cognitivo/">deterioro cognitivo leve</a>, con dificultades objetivables pero autonomía relativamente conservada. En otros casos, el impacto funcional es mayor y puede ser necesario estudiar una <a href="/demencias/">demencia</a>.</p><p>La enfermedad de Alzheimer es una causa frecuente de demencia, pero no la única. El diagnóstico médico requiere integrar información clínica, neurológica y, cuando está indicado, pruebas complementarias.</p></section>
          <section><h2>Cuándo conviene ampliar el estudio</h2><p>Si la valoración muestra un patrón preocupante, puede recomendarse consulta con neurología, geriatría u otros profesionales. La neuropsicología aporta información detallada sobre el funcionamiento cognitivo, pero no sustituye el diagnóstico médico etiológico.</p><div className="seo-callout"><strong>Detectar señales pronto no significa adelantar conclusiones.</strong><span>Significa obtener información útil antes de que la duda crezca sola y poder decidir qué seguimiento necesita cada persona.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/problemas-de-memoria/">Problemas de memoria</a><a href="/deterioro-cognitivo/">Deterioro cognitivo leve</a><a href="/demencias/">Demencias</a><a href="/familiares-y-cuidadores-de-personas-con-demencia/">Familiares y cuidadores</a>
</div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Mi experiencia está especialmente vinculada a la evaluación y seguimiento de problemas de memoria, deterioro cognitivo y demencias, integrando perfil cognitivo, funcionamiento cotidiano y evolución clínica.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}