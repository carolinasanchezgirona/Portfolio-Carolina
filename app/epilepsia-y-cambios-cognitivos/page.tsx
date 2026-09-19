import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Epilepsia y cambios cognitivos | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica de cambios cognitivos en epilepsia: memoria, atención, velocidad de procesamiento, funciones ejecutivas y repercusión funcional.",
  alternates: { canonical: "/epilepsia-y-cambios-cognitivos/" },
  openGraph: {
    title: "Epilepsia y cambios cognitivos | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar memoria, atención, funciones ejecutivas y repercusión funcional en personas con epilepsia.",
    url: "https://carolinasanchezgirona.com/epilepsia-y-cambios-cognitivos/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica de cambios cognitivos en epilepsia",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica en epilepsia",
  url: "https://carolinasanchezgirona.com/epilepsia-y-cambios-cognitivos/",
};

export default function EpilepsyCognitionPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/evaluacion-neuropsicologica/">Evaluación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Epilepsia y cognición</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Epilepsia</p>
        <h1>Epilepsia y cambios cognitivos</h1>
        <p className="seo-lead">Algunas personas con epilepsia pueden notar cambios en memoria, atención, velocidad de procesamiento o funciones ejecutivas. El perfil puede variar según el tipo de epilepsia, la localización de las crisis, la frecuencia, el tratamiento y otros factores clínicos. La evaluación neuropsicológica ayuda a describir cómo está funcionando la cognición en cada caso.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-valorar">Cuándo valorar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Los cambios cognitivos pueden tener varias causas</h2><p>La cognición puede verse influida por la propia epilepsia, el momento de aparición de las crisis, su frecuencia, determinadas lesiones cerebrales, el sueño, el estado emocional o los efectos de algunos tratamientos.</p><p>Por eso no conviene atribuir cualquier dificultad de memoria o concentración a una única causa sin revisar el contexto clínico completo.</p></section>
          <section id="cuando-valorar"><h2>Cuándo puede ser útil una evaluación</h2><ul><li>Notas olvidos más frecuentes o problemas para aprender información nueva.</li><li>Te cuesta mantener la atención o seguir tareas complejas.</li><li>Sientes más lentitud mental de la habitual.</li><li>Te cuesta organizar, planificar o cambiar de estrategia.</li><li>Los cambios afectan al trabajo, estudios o autonomía.</li><li>Necesitas una línea base para comparar la evolución.</li><li>Neurología recomienda explorar el funcionamiento cognitivo con más detalle.</li></ul></section>
          <section><h2>Qué áreas pueden explorarse</h2><p>La valoración puede incluir memoria verbal y visual, atención, velocidad de procesamiento, funciones ejecutivas, lenguaje y habilidades visuoespaciales, según el motivo de consulta.</p><p>También se revisan sueño, fatiga, estado emocional, medicación y funcionamiento cotidiano, porque pueden modificar el rendimiento.</p></section>
          <section><h2>Memoria, atención y funciones ejecutivas</h2><p>Las quejas de memoria no siempre reflejan un problema puramente mnésico. Una atención inestable o una velocidad de procesamiento reducida pueden dificultar el aprendizaje de nueva información. Por eso puede ser útil valorar también <a href="/problemas-de-atencion-y-concentracion-en-adultos/">atención y concentración</a> y <a href="/funciones-ejecutivas-y-planificacion-en-adultos/">funciones ejecutivas</a>.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> ayuda a identificar fortalezas y dificultades, establecer una referencia para seguimiento y orientar estrategias de compensación.</p><p>En determinados contextos hospitalarios, la neuropsicología también puede formar parte de valoraciones más amplias relacionadas con cirugía de epilepsia. En esos casos, el estudio debe realizarse dentro del circuito especializado correspondiente.</p></section>
          <section><h2>Seguimiento y estrategias</h2><p>Según el perfil, pueden plantearse apoyos externos, organización de rutinas, estrategias de memoria, reducción de distractores y adaptación de tareas cognitivamente exigentes.</p><p>La neuropsicología complementa el seguimiento neurológico y no sustituye la valoración médica ni el ajuste del tratamiento antiepiléptico.</p><div className="seo-callout"><strong>Una dificultad cognitiva no se interpreta aislada del contexto neurológico.</strong><span>El valor de la evaluación está en integrar rendimiento, tratamiento, evolución y vida cotidiana.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a><a href="/problemas-de-memoria/">Problemas de memoria</a><a href="/problemas-de-atencion-y-concentracion-en-adultos/">Atención y concentración</a><a href="/funciones-ejecutivas-y-planificacion-en-adultos/">Funciones ejecutivas</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación neuropsicológica de personas adultas con cambios cognitivos asociados a condiciones neurológicas, integrando rendimiento, estado emocional y repercusión funcional.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}