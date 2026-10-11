import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vida Activa · Semana 01 | Vista previa para residencias",
  description: "Descubre cómo se organiza Vida Activa: programación semanal, guías profesionales, fichas y adaptaciones. Consulta una actividad de muestra y solicita una propuesta para tu centro.",
  alternates: { canonical: "/residencias/semana-01/" },
  openGraph: {
    title: "Vida Activa · Semana 01 | Dememòria",
    description: "Una muestra editorial de la programación para residencias y centros de día, sin publicar el material profesional completo.",
    url: "https://carolinasanchezgirona.com/residencias/semana-01/",
    type: "article",
  },
};

const elements = [
  { number:"01", title:"Programación", detail:"Una estructura semanal con bloques de actividad, pausas, opciones de elección y coordinación por unidades." },
  { number:"02", title:"Guías para el equipo", detail:"Objetivos, preparación, desarrollo, recursos, apoyos y precauciones para valorar cada actividad." },
  { number:"03", title:"Material para participantes", detail:"Fichas de trabajo y propuestas visuales o manipulativas elaboradas para adultos, con espacio y legibilidad." },
  { number:"04", title:"Adaptación y seguimiento", detail:"Alternativas según intereses, capacidades funcionales y necesidades de apoyo, y registro breve para revisar la viabilidad." },
];

export default function Semana01() {
  return <main className="res-page res-commercial" id="vida-activa-semana-01">
    <section className="res-hero res-hero-compact va-commercial-hero">
      <div className="editorial-wrap">
        <nav aria-label="Ruta de navegación" className="res-breadcrumb"><Link href="/">Inicio</Link><span>/</span><Link href="/residencias/">Residencias</Link><span>/</span><Link href="/residencias/vida-activa/">Vida Activa</Link><span>/</span><span>Semana 01</span></nav>
        <div className="va-commercial-hero-grid">
          <div>
            <p className="res-eyebrow">DEMEMÒRIA · VIDA ACTIVA · EDICIÓN 01</p>
            <h1>Una semana con sentido. Un programa con continuidad.</h1>
            <p className="res-lead">Vida Activa reúne propuestas cognitivas, creativas, sociales y funcionales pensadas para que los equipos de residencias y centros de día puedan ofrecer oportunidades reales de participación.</p>
            <p>Esta es una <strong>vista previa del producto profesional</strong>. Las guías completas, fichas, adaptaciones operativas y orientaciones de respuesta forman parte de la edición para centros.</p>
            <div className="res-actions">
              <Link className="editorial-btn editorial-btn-primary" href="/residencias/#contacto-profesional">Solicitar propuesta para mi centro</Link>
              <Link className="editorial-btn editorial-btn-secondary" href="/residencias/muestra/">Explorar una actividad de muestra</Link>
            </div>
          </div>
          <figure className="va-commercial-figure">
            <img src="https://images.pexels.com/photos/6023595/pexels-photo-6023595.jpeg?auto=compress&cs=tinysrgb&w=1100" alt="Actividad artística en un entorno de participación y creación" decoding="async" loading="eager" />
            <figcaption>Participar, crear y compartir. Fotografías ilustrativas.</figcaption>
          </figure>
        </div>
      </div>
    </section>
    <section className="res-section">
      <div className="editorial-wrap">
        <p className="res-eyebrow">Qué recibe el equipo</p>
        <h2>Detrás de cada semana hay planificación.</h2>
        <p className="res-intro">No es únicamente un calendario de actividades. Es una propuesta para reducir la improvisación sin limitar la autonomía de las personas residentes ni sustituir el criterio profesional.</p>
        <div className="res-card-grid">
          {elements.map(item=><article className="res-card" key={item.number}><span className="res-index">{item.number}</span><h3>{item.title}</h3><p>{item.detail}</p></article>)}
        </div>
      </div>
    </section>
    <section className="res-section res-section-tint">
      <div className="editorial-wrap va-commercial-sample">
        <div>
          <p className="res-eyebrow">Una actividad, no el programa completo</p>
          <h2>Comprueba la calidad antes de solicitar información.</h2>
          <p>La muestra permite valorar el enfoque adulto, la claridad de las instrucciones y las posibilidades de participación. La programación íntegra y sus recursos no se distribuyen desde la web pública.</p>
          <div className="res-actions"><Link className="editorial-btn editorial-btn-primary" href="/residencias/muestra/">Ver actividad de muestra</Link></div>
        </div>
        <aside className="va-commercial-summary">
          <span>SEMANA 01 · EDICIÓN PROFESIONAL</span>
          <strong>20 propuestas</strong>
          <p>Con cinco guías desarrolladas, cinco fichas originales y orientaciones para la adaptación y el seguimiento.</p>
          <small>El contenido íntegro se facilita según las condiciones acordadas con cada centro.</small>
        </aside>
      </div>
    </section>
    <section className="res-section">
      <div className="editorial-wrap">
        <p className="res-eyebrow">Modalidades de colaboración</p>
        <h2>Una solución proporcionada a cada residencia.</h2>
        <div className="res-card-grid">
          <article className="res-card"><span className="res-index">MATERIALES</span><h3>Programación y recursos</h3><p>Para equipos que quieren preparar las sesiones con autonomía y disponer de actividades renovables.</p></article>
          <article className="res-card"><span className="res-index">ACOMPAÑAMIENTO</span><h3>Apoyo profesional</h3><p>Orientación y revisión de la aplicación, según la dotación y las necesidades del centro.</p></article>
          <article className="res-card"><span className="res-index">A MEDIDA</span><h3>Diseño por unidades</h3><p>Una estructura ajustada a centros con grupos y necesidades heterogéneas.</p></article>
        </div>
      </div>
    </section>
    <section className="res-section res-end-cta">
      <div className="editorial-wrap">
        <p className="res-eyebrow">Vida Activa · Primer contacto</p>
        <h2>¿Cómo podría funcionar en vuestro centro?</h2>
        <p>Cuéntame el tipo de residencia, su organización y sus prioridades. Prepararemos el alcance de una propuesta sin necesitar datos clínicos individuales en esta primera fase.</p>
        <Link href="/residencias/#contacto-profesional" className="editorial-btn editorial-btn-primary">Solicitar una propuesta para mi centro</Link>
      </div>
    </section>
  </main>;
}
