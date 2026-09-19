import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Conmoción cerebral y TCE leve | Neuropsicóloga en Arenys de Mar",
  description: "Evaluación neuropsicológica tras conmoción cerebral o traumatismo craneoencefálico leve: atención, memoria, fatiga mental, velocidad de procesamiento y retorno a la actividad.",
  alternates: { canonical: "/conmocion-cerebral-y-tce-leve/" },
  openGraph: {
    title: "Conmoción cerebral y TCE leve | Carolina Sánchez Girona",
    description: "Neuropsicología para valorar cambios cognitivos persistentes tras conmoción cerebral o traumatismo craneoencefálico leve.",
    url: "https://carolinasanchezgirona.com/conmocion-cerebral-y-tce-leve/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación neuropsicológica tras conmoción cerebral o TCE leve",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Neuropsicóloga y Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Evaluación neuropsicológica tras traumatismo craneoencefálico leve",
  url: "https://carolinasanchezgirona.com/conmocion-cerebral-y-tce-leve/",
};

export default function MildTBIPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/neuropsicologia/">Neuropsicología</a><a href="/evaluacion-neuropsicologica/">Evaluación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>Conmoción cerebral y TCE leve</span></p>
        <p className="editorial-eyebrow">Neuropsicología · Traumatismo craneoencefálico leve</p>
        <h1>Cambios cognitivos tras conmoción cerebral o TCE leve</h1>
        <p className="seo-lead">Después de una conmoción cerebral o traumatismo craneoencefálico leve pueden aparecer dificultades de atención, fatiga mental, lentitud, problemas de memoria, cefalea o mayor sensibilidad al esfuerzo cognitivo. En muchas personas estos síntomas mejoran con el tiempo, pero si persisten o interfieren en la vida diaria puede ser útil una valoración específica.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-valorar">Cuándo valorar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>No todos los síntomas persistentes significan daño cognitivo permanente</h2><p>Tras un TCE leve pueden coexistir factores neurológicos, emocionales, de sueño, dolor, fatiga y estrés que influyen en el rendimiento. Por eso conviene evitar interpretaciones simplistas y valorar el conjunto.</p><p>La evaluación neuropsicológica puede ayudar a objetivar qué funciones están más afectadas y qué factores pueden estar modulando los síntomas.</p></section>
          <section id="cuando-valorar"><h2>Cuándo puede ser útil una evaluación</h2><ul><li>Te cuesta mantener la atención durante tareas que antes realizabas con normalidad.</li><li>Notas mayor lentitud para leer, pensar o responder.</li><li>Te fatigas mentalmente con más facilidad.</li><li>Tienes problemas de memoria o necesitas más apoyos para organizarte.</li><li>Te cuesta retomar trabajo, estudios o actividades complejas.</li><li>Los síntomas persisten y generan dudas sobre tu funcionamiento cognitivo.</li><li>Necesitas orientar una vuelta progresiva a la actividad.</li></ul></section>
          <section><h2>Qué se puede explorar</h2><p>La valoración puede incluir atención, velocidad de procesamiento, memoria, funciones ejecutivas, lenguaje y otros procesos según el motivo de consulta.</p><p>También se revisan sueño, dolor, estado emocional, fatiga y demanda de las actividades cotidianas, porque pueden influir de forma importante en el rendimiento.</p></section>
          <section><h2>Relación con atención y funciones ejecutivas</h2><p>Después de una conmoción cerebral es frecuente que la persona describa dificultades para concentrarse, hacer varias cosas a la vez o sostener tareas exigentes. Puede ser útil revisar la información sobre <a href="/problemas-de-atencion-y-concentracion-en-adultos/">atención y concentración</a> y <a href="/funciones-ejecutivas-y-planificacion-en-adultos/">funciones ejecutivas</a>.</p></section>
          <section><h2>Qué aporta la evaluación neuropsicológica</h2><p>La <a href="/evaluacion-neuropsicologica/">evaluación neuropsicológica</a> permite comparar el rendimiento actual con lo esperado según edad, formación y contexto clínico, e integrar esos resultados con el funcionamiento cotidiano.</p><p>El objetivo es orientar decisiones prácticas, no etiquetar cada síntoma como secuela permanente.</p></section>
          <section><h2>Retorno progresivo a la actividad</h2><p>Cuando la persona se fatiga con facilidad puede ser necesario graduar la carga cognitiva, introducir pausas, ajustar tiempos de exposición a pantallas o tareas complejas y aumentar la demanda de forma progresiva.</p><p>Si aparecen síntomas neurológicos nuevos o un empeoramiento claro, corresponde una valoración médica.</p><div className="seo-callout"><strong>Volver a la actividad no siempre consiste en hacer todo de golpe.</strong><span>Una progresión ajustada puede ayudar a recuperar tolerancia al esfuerzo sin convertir cada síntoma en una señal de alarma.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Primera visita</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Ubicación</span><strong>Arenys de Mar</strong></li><li><span>Área</span><strong>Neuropsicología</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ictus-y-dano-cerebral-adquirido/">Daño cerebral adquirido</a><a href="/problemas-de-atencion-y-concentracion-en-adultos/">Atención y concentración</a><a href="/funciones-ejecutivas-y-planificacion-en-adultos/">Funciones ejecutivas</a><a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo en evaluación neuropsicológica de personas adultas con cambios cognitivos tras daño cerebral, integrando rendimiento cognitivo, estado emocional y repercusión funcional.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/neuropsicologia/">Ver Neuropsicología →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}