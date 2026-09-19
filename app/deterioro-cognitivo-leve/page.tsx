import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Deterioro cognitivo leve | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica del deterioro cognitivo leve: memoria, atención, lenguaje y funciones ejecutivas. Consulta en Arenys de Mar.",
  alternates: { canonical: "/deterioro-cognitivo-leve/" },
  openGraph: {
    title: "Deterioro cognitivo leve | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar cambios cognitivos leves, su impacto funcional y la necesidad de seguimiento.",
    url: "https://carolinasanchezgirona.com/deterioro-cognitivo-leve/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica del deterioro cognitivo leve",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica del deterioro cognitivo leve",
  url: "https://carolinasanchezgirona.com/deterioro-cognitivo-leve/",
};

export default function MildCognitiveImpairmentPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/problemas-de-memoria/">Memoria</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Deterioro cognitivo leve</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Cambios cognitivos</p>
        <h1>Deterioro cognitivo leve</h1>
        <p className="seo-lead">El deterioro cognitivo leve describe una situación en la que existen dificultades cognitivas objetivables, por ejemplo en memoria, atención, lenguaje o funciones ejecutivas, pero la autonomía cotidiana está relativamente conservada. No es sinónimo de demencia y necesita una valoración clínica adecuada.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-valorar">Cuándo valorar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Qué significa deterioro cognitivo leve</h2><p>El término se utiliza cuando una persona presenta un rendimiento inferior al esperado en una o varias funciones cognitivas, pero todavía mantiene gran parte de su independencia en actividades cotidianas.</p><p>La evaluación no se basa únicamente en una puntuación. También importa la historia clínica, la evolución de los cambios, el nivel previo de funcionamiento y el impacto real en la vida diaria.</p></section>
          <section id="cuando-valorar"><h2>Cuándo puede ser útil una evaluación</h2><ul><li>Hay olvidos más frecuentes o repetitivos que antes.</li><li>Cuesta seguir conversaciones complejas o encontrar palabras con mayor frecuencia.</li><li>Aparecen dificultades para organizar tareas, gestionar citas o planificar actividades.</li><li>La familia observa cambios cognitivos persistentes aunque la persona siga siendo autónoma.</li><li>Existe la necesidad de comparar el funcionamiento actual con una evaluación previa.</li><li>Un profesional sanitario recomienda explorar el perfil cognitivo con más detalle.</li></ul></section>
          <section><h2>No todo cambio de memoria es deterioro cognitivo leve</h2><p>El sueño, la ansiedad, la depresión, determinados medicamentos, problemas médicos o situaciones de estrés pueden afectar al rendimiento cognitivo. Por eso no conviene asumir que cualquier olvido corresponde a un deterioro neurodegenerativo.</p><p>La valoración neuropsicológica ayuda a describir el patrón de dificultades y a identificar cuándo conviene ampliar el estudio médico.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> permite explorar memoria, atención, lenguaje, funciones ejecutivas, velocidad de procesamiento y otras capacidades según el motivo de consulta.</p><p>Los resultados se interpretan junto con el funcionamiento cotidiano y los antecedentes clínicos. Esto ayuda a diferenciar cambios subjetivos, dificultades asociadas a otros factores y perfiles compatibles con deterioro cognitivo.</p></section>
          <section><h2>Deterioro cognitivo leve y demencia</h2><p>El deterioro cognitivo leve no implica necesariamente que vaya a desarrollarse una <a href="/demencias/">demencia</a>. Algunas personas permanecen estables durante años, otras mejoran si existen factores reversibles y otras muestran progresión.</p><p>Por eso el seguimiento es importante: permite observar la evolución y detectar cambios funcionales o cognitivos relevantes.</p></section>
          <section><h2>Seguimiento e intervención</h2><p>Según el perfil y la situación clínica, puede ser útil realizar seguimiento periódico, trabajar estrategias compensatorias y valorar <a href="/estimulacion-cognitiva/">estimulación cognitiva</a> con objetivos concretos.</p><p>Cuando existen dudas iniciales y todavía no se sabe si hay un cambio objetivo, también puede ser útil consultar la información sobre <a href="/problemas-de-memoria/">problemas de memoria y olvidos</a>.</p><div className="seo-callout"><strong>Detectar un cambio no significa anticipar un diagnóstico.</strong><span>La utilidad de la evaluación está en describir qué ocurre ahora, cómo afecta a la vida diaria y qué seguimiento necesita.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/problemas-de-memoria/">Problemas de memoria</a><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a><a href="/deterioro-cognitivo/">Deterioro cognitivo</a><a href="/demencias/">Demencias</a>
              <a href="/parkinson-y-cambios-cognitivos/">Parkinson y cambios cognitivos</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo especialmente en evaluación y seguimiento de problemas de memoria, deterioro cognitivo y demencias, integrando pruebas cognitivas, funcionamiento cotidiano y contexto clínico.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}