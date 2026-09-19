import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Problemas de atención y concentración en adultos | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica de problemas de atención y concentración en adultos: despistes, lentitud, fatiga mental y dificultades para mantener el foco.",
  alternates: { canonical: "/problemas-de-atencion-y-concentracion-en-adultos/" },
  openGraph: {
    title: "Problemas de atención y concentración en adultos | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar dificultades atencionales y diferenciar causas cognitivas, emocionales y médicas.",
    url: "https://carolinasanchezgirona.com/problemas-de-atencion-y-concentracion-en-adultos/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica de problemas de atención y concentración en adultos",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica de atención y concentración en adultos",
  url: "https://carolinasanchezgirona.com/problemas-de-atencion-y-concentracion-en-adultos/",
};

export default function AttentionAdultsPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a>
              <a href="/funciones-ejecutivas-y-planificacion-en-adultos/">Funciones ejecutivas y planificación</a><a href="/evaluacion-neuropsicologica/">Evaluación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Atención y concentración</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Atención</p>
        <h1>Problemas de atención y concentración en adultos</h1>
        <p className="seo-lead">Tener dificultad para concentrarse no significa necesariamente tener TDAH. El sueño, la ansiedad, la depresión, el estrés, determinados medicamentos y distintas condiciones neurológicas pueden afectar a la atención. La evaluación neuropsicológica ayuda a describir el patrón y a entender qué factores pueden estar influyendo.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-valorar">Cuándo valorar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>La atención no es una sola capacidad</h2><p>Podemos hablar de atención sostenida, selectiva, dividida o de la capacidad para alternar el foco entre tareas. También influyen la velocidad de procesamiento, la memoria de trabajo y las funciones ejecutivas.</p><p>Por eso dos personas que dicen “me cuesta concentrarme” pueden presentar dificultades muy distintas.</p></section>
          <section id="cuando-valorar"><h2>Cuándo puede ser útil una evaluación</h2><ul><li>Te cuesta mantener el foco durante tareas largas o monótonas.</li><li>Cometes errores por despiste que antes eran poco habituales.</li><li>Necesitas releer varias veces porque pierdes el hilo.</li><li>Te cuesta seguir conversaciones o instrucciones con varios pasos.</li><li>Notas mucha fatiga mental o lentitud al trabajar.</li><li>Te cuesta alternar entre tareas sin perder información.</li><li>Las dificultades afectan al trabajo, estudios, organización o vida cotidiana.</li></ul></section>
          <section><h2>Qué puede influir en la concentración</h2><p>La atención puede verse afectada por <a href="/ansiedad/">ansiedad</a>, <a href="/depresion/">depresión</a>, <a href="/insomnio-y-dificultades-para-dormir/">problemas de sueño</a>, estrés, dolor, fatiga, medicación, consumo de sustancias o alteraciones neurológicas.</p><p>Por eso una evaluación útil no se limita a medir atención: también revisa el contexto clínico y funcional.</p></section>
          <section><h2>Atención y TDAH en adultos</h2><p>El TDAH es un trastorno del neurodesarrollo y no se diagnostica únicamente porque una persona adulta tenga despistes o problemas para concentrarse. La valoración requiere revisar la historia evolutiva, la presencia de síntomas desde etapas tempranas, la interferencia en distintos contextos y otras explicaciones posibles.</p><p>La evaluación neuropsicológica puede aportar información sobre el funcionamiento cognitivo, pero el diagnóstico debe integrarse con una valoración clínica completa.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> puede explorar atención, memoria de trabajo, velocidad de procesamiento, funciones ejecutivas y memoria, adaptando las pruebas al motivo de consulta.</p><p>Los resultados se interpretan junto con la entrevista y el impacto en la vida diaria para evitar conclusiones basadas únicamente en una puntuación.</p></section>
          <section><h2>Qué se puede hacer después</h2><p>Según el perfil, pueden recomendarse estrategias para reducir distractores, organizar tareas, dividir actividades complejas, introducir pausas, utilizar apoyos externos o trabajar factores emocionales y de sueño que estén interfiriendo.</p><div className="seo-callout"><strong>Concentrarse peor no identifica por sí solo la causa.</strong><span>La evaluación sirve para pasar de una queja general a un perfil concreto y clínicamente útil.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a><a href="/problemas-de-memoria/">Problemas de memoria</a><a href="/ictus-y-dano-cerebral-adquirido/">Ictus y daño cerebral</a><a href="/neuropsicologia/">Neuropsicología</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación neuropsicológica de personas adultas, integrando atención, memoria, funciones ejecutivas, estado emocional y repercusión funcional.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}