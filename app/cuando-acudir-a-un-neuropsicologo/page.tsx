import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Cuándo acudir a un neuropsicólogo | Neuropsicóloga en Arenys de Mar",
  description: "Cuándo puede ser útil acudir a un neuropsicólogo por problemas de memoria, atención, lenguaje, cambios tras ictus o TCE, deterioro cognitivo o demencia.",
  alternates: { canonical: "/cuando-acudir-a-un-neuropsicologo/" },
  openGraph: {
    title: "Cuándo acudir a un neuropsicólogo | Carolina Sánchez Girona",
    description: "Señales y situaciones en las que puede ser útil una valoración neuropsicológica en adultos.",
    url: "https://carolinasanchezgirona.com/cuando-acudir-a-un-neuropsicologo/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Orientación y evaluación neuropsicológica en adultos",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica en adultos",
  url: "https://carolinasanchezgirona.com/cuando-acudir-a-un-neuropsicologo/",
};

export default function WhenToSeeNeuropsychologistPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/evaluacion-neuropsicologica/">Evaluación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Cuándo acudir a un neuropsicólogo</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Orientación</p>
        <h1>Cuándo acudir a un neuropsicólogo</h1>
        <p className="seo-lead">Puede ser útil consultar cuando aparecen cambios persistentes en memoria, atención, lenguaje, planificación o autonomía, especialmente si afectan a la vida cotidiana o han surgido después de una enfermedad neurológica, un ictus o un traumatismo craneoencefálico.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#motivos">Motivos frecuentes</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Qué hace un neuropsicólogo</h2><p>La neuropsicología estudia la relación entre el funcionamiento cerebral, la cognición, la conducta y la autonomía. En consulta se analizan áreas como memoria, atención, lenguaje, funciones ejecutivas y velocidad de procesamiento, siempre dentro del contexto clínico de cada persona.</p><p>El objetivo no es solo obtener puntuaciones, sino entender qué está ocurriendo y cómo afecta al día a día.</p></section>
          <section id="motivos"><h2>Motivos frecuentes para consultar</h2><ul><li>Olvidos que se repiten o han aumentado con el tiempo.</li><li>Dificultades de atención, concentración o lentitud mental.</li><li>Problemas para organizar, planificar o terminar tareas.</li><li>Cambios de lenguaje, como dificultad para encontrar palabras o comprender mensajes.</li><li>Cambios cognitivos después de un ictus, TCE u otra lesión cerebral.</li><li>Dudas sobre envejecimiento normal, deterioro cognitivo o demencia.</li><li>Cambios cognitivos asociados a Parkinson, esclerosis múltiple, epilepsia u otras condiciones neurológicas.</li><li>Necesidad de establecer una línea base o realizar seguimiento de la evolución.</li></ul></section>
          <section><h2>Cuándo una dificultad merece más atención</h2><p>No todos los despistes requieren una evaluación. Resulta especialmente útil consultar cuando el cambio es nuevo, progresivo, claramente distinto del funcionamiento previo o empieza a interferir en trabajo, estudios, gestiones, conducción, medicación u otras actividades cotidianas.</p><p>También conviene prestar atención cuando familiares cercanos observan cambios que la propia persona no percibe.</p></section>
          <section><h2>Qué puede explicar los síntomas</h2><p>Las dificultades cognitivas pueden relacionarse con múltiples factores. El sueño, la ansiedad, la depresión, el dolor, la fatiga, determinados medicamentos y problemas médicos pueden afectar a memoria y atención.</p><p>Por eso la <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> se interpreta siempre junto con la entrevista y, cuando corresponde, con la valoración médica.</p></section>
          <section><h2>Qué ocurre en una evaluación</h2><p>La valoración suele comenzar con una entrevista para conocer el motivo de consulta, la evolución de los cambios y su impacto funcional. Después se seleccionan pruebas adaptadas a las áreas que interesa explorar.</p><p>El resultado es un perfil que permite identificar fortalezas, dificultades y recomendaciones, y decidir si conviene seguimiento, rehabilitación, estrategias compensatorias o ampliar el estudio médico.</p></section>
          <section><h2>Qué áreas puedes consultar según tu situación</h2><p>Si la principal preocupación son los olvidos, puedes revisar <a href="/problemas-de-memoria/">problemas de memoria</a>. Si predominan despistes o lentitud, <a href="/problemas-de-atencion-y-concentracion-en-adultos/">atención y concentración</a>. Si el cambio ha ocurrido tras una lesión neurológica, <a href="/ictus-y-dano-cerebral-adquirido/">ictus y daño cerebral adquirido</a>. Y si existen dudas relacionadas con la edad, <a href="/envejecimiento-cognitivo-normal-o-deterioro/">envejecimiento cognitivo normal o deterioro</a>.</p><div className="seo-callout"><strong>No hace falta saber qué diagnóstico encaja antes de consultar.</strong><span>Precisamente una valoración puede ayudar a ordenar los síntomas y decidir qué pasos tienen sentido.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a><a href="/problemas-de-memoria/">Problemas de memoria</a><a href="/deterioro-cognitivo/">Deterioro cognitivo</a><a href="/rehabilitacion-neuropsicologica/">Rehabilitación neuropsicológica</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con personas adultas que consultan por cambios de memoria, atención, lenguaje, funciones ejecutivas, deterioro cognitivo y secuelas de condiciones neurológicas.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}