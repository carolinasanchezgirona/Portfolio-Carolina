import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Demencia con cuerpos de Lewy | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica en demencia con cuerpos de Lewy: fluctuaciones cognitivas, atención, funciones visuoespaciales, memoria y autonomía.",
  alternates: { canonical: "/demencia-con-cuerpos-de-lewy/" },
  openGraph: {
    title: "Demencia con cuerpos de Lewy | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar cambios cognitivos compatibles con demencia con cuerpos de Lewy y diferenciarlos de otros síndromes.",
    url: "https://carolinasanchezgirona.com/demencia-con-cuerpos-de-lewy/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica en demencia con cuerpos de Lewy",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica de cambios cognitivos compatibles con demencia con cuerpos de Lewy",
  url: "https://carolinasanchezgirona.com/demencia-con-cuerpos-de-lewy/",
};

export default function LewyBodyDementiaPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/demencias/">Demencias</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Demencia con cuerpos de Lewy</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Demencias</p>
        <h1>Demencia con cuerpos de Lewy</h1>
        <p className="seo-lead">La demencia con cuerpos de Lewy puede combinar cambios cognitivos, fluctuaciones en el nivel de atención, dificultades visuoespaciales y síntomas motores o perceptivos. La evaluación neuropsicológica ayuda a describir el perfil cognitivo y a diferenciarlo de otros cuadros, siempre dentro de una valoración médica completa.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#senales">Qué señales pueden aparecer</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Un perfil que puede fluctuar</h2><p>En algunas personas el rendimiento cognitivo cambia de forma notable a lo largo del día o entre distintos momentos. Pueden existir periodos de mayor claridad y otros de mayor lentitud, confusión o dificultad para mantener la atención.</p><p>Estas fluctuaciones son clínicamente relevantes y conviene registrarlas junto con el resto de síntomas.</p></section>
          <section id="senales"><h2>Qué señales pueden justificar una valoración</h2><ul><li>Fluctuaciones marcadas de atención o claridad mental.</li><li>Dificultades visuoespaciales o para interpretar correctamente el entorno.</li><li>Problemas de planificación, organización o flexibilidad mental.</li><li>Alucinaciones visuales recurrentes, especialmente si son bien formadas.</li><li>Síntomas motores de tipo parkinsoniano.</li><li>Cambios del sueño, especialmente conductas anómalas durante el sueño REM.</li><li>Pérdida progresiva de autonomía en tareas cotidianas.</li></ul></section>
          <section><h2>Memoria, atención y funciones visuoespaciales</h2><p>La memoria puede verse afectada, pero en fases iniciales a veces destacan más la atención, las funciones ejecutivas y las capacidades visuoespaciales. Esto ayuda a diferenciar el perfil de otros cuadros, aunque ningún patrón neuropsicológico aislado confirma por sí solo el diagnóstico.</p></section>
          <section><h2>Relación con Parkinson y Alzheimer</h2><p>La demencia con cuerpos de Lewy comparte características con la <a href="/parkinson-y-cambios-cognitivos/">enfermedad de Parkinson</a> y con la <a href="/alzheimer-primeros-sintomas-y-evaluacion/">enfermedad de Alzheimer</a>, pero el patrón clínico y la secuencia de aparición de los síntomas pueden ser distintos.</p><p>La interpretación requiere integrar evolución cognitiva, síntomas motores, alteraciones perceptivas, sueño y valoración neurológica.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> permite explorar atención, velocidad de procesamiento, funciones ejecutivas, memoria, lenguaje y habilidades visuoespaciales.</p><p>También ayuda a establecer una línea base, orientar el seguimiento y describir qué dificultades están afectando a la autonomía.</p></section>
          <section><h2>Importancia de la valoración médica</h2><p>El diagnóstico de demencia con cuerpos de Lewy requiere evaluación médica. La neuropsicología aporta información sobre el perfil cognitivo y funcional, pero no sustituye la valoración neurológica ni otras pruebas complementarias.</p><div className="seo-callout"><strong>El patrón importa, pero también la evolución.</strong><span>Fluctuaciones cognitivas, síntomas motores, alteraciones perceptivas y sueño deben interpretarse de forma conjunta.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/demencias/">Demencias</a><a href="/parkinson-y-cambios-cognitivos/">Parkinson y cambios cognitivos</a><a href="/alzheimer-primeros-sintomas-y-evaluacion/">Alzheimer: primeros síntomas</a><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación neuropsicológica de personas adultas con deterioro cognitivo y demencias, integrando perfil cognitivo, síntomas asociados, evolución y repercusión funcional.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}