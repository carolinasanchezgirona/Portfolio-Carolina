import type { Metadata } from "next";
import ResidentialEnquiry from "./residential-enquiry";

const url = "https://carolinasanchezgirona.com/residencias/";

export const metadata: Metadata = {
  title: "Actividades para residencias y centros de día | Vida Activa",
  description: "Programación semanal de actividades significativas, estimulación cognitiva y materiales adaptables para residencias y centros de día del Maresme y Barcelona. Conoce Vida Activa.",
  alternates: { canonical: "/residencias/" },
  openGraph: {
    title: "Vida Activa | Programas para residencias y centros de día",
    description: "Propuestas adaptables de estimulación cognitiva, participación ocupacional y bienestar para residencias y centros de día.",
    url,
    type: "website",
  },
};

const activities = [
  { number: "01", title: "Estimulación cognitiva", text: "Atención, lenguaje, memoria, funciones ejecutivas y orientación, con tareas graduadas y objetivos definidos." },
  { number: "02", title: "Participación y ocupación", text: "Talleres creativos, proyectos compartidos, actividades cotidianas y oportunidades de elección." },
  { number: "03", title: "Bienestar emocional", text: "Espacios de expresión, reminiscencia, comunicación, vínculo y acompañamiento, respetando el contexto de cada persona." },
  { number: "04", title: "Movimiento y autonomía", text: "Propuestas de actividad física y funcional para coordinar con fisioterapia, terapia ocupacional y el equipo responsable." },
];

const audiences = [
  { label: "Para las personas residentes", title: "Elegir, participar y disfrutar.", description: "Propuestas adultas vinculadas a sus intereses, historia, preferencias y posibilidades de participación. También hay espacio para decir que no." },
  { label: "Para los equipos", title: "Menos preparación. Más acompañamiento.", description: "Guías claras, materiales utilizables y alternativas por niveles para preparar actividades sin empezar de cero cada semana." },
  { label: "Para la dirección", title: "Una programación que se puede revisar.", description: "Organización por unidades, objetivos razonables y seguimiento sencillo de la participación, sin confundir actividades con resultados clínicos." },
];

const formats = [
  { name: "Programa de materiales", tag: "Autonomía del centro", text: "Calendarios, guías de aplicación y recursos preparados para que el equipo adapte las propuestas a sus residentes." },
  { name: "Programa acompañado", tag: "Apoyo profesional", text: "Materiales más reuniones de ajuste, orientación a los equipos y revisión de dificultades durante la implantación." },
  { name: "Diseño para el centro", tag: "A medida", text: "Revisión de necesidades organizativas y diseño específico para centros con varias unidades o requerimientos distintos." },
];

const steps = [
  { label: "Conocer el centro", text: "Organización por unidades, dotación del equipo, intereses y características de las personas residentes." },
  { label: "Diseñar la semana", text: "Distribuir actividades por franjas y grupos, incorporando descanso, alternativas y actividades de libre elección." },
  { label: "Facilitar la ejecución", text: "Ofrecer instrucciones, materiales para participantes y adaptaciones que reduzcan el tiempo de preparación." },
  { label: "Revisar y ajustar", text: "Registrar participación, utilidad percibida e incidencias, evitando atribuir resultados clínicos a un simple calendario." },
];

const questions = [
  { q: "¿El programa sustituye a terapia ocupacional, fisioterapia o psicología?", a: "No. Es una herramienta de planificación y apoyo. La valoración, indicación y ejecución de actos sanitarios corresponden a los profesionales cualificados del centro o colaboradores acreditados." },
  { q: "¿Sirve para centros grandes?", a: "Se plantea para poder organizar propuestas por unidades de convivencia y grupos de necesidades distintas, sin imponer una actividad idéntica a toda la residencia." },
  { q: "¿Todas las actividades son terapéuticas?", a: "No. Se diferencian el ocio elegido, las oportunidades de participación y las intervenciones con objetivos clínicos específicos. Disfrutar de una actividad también es un objetivo legítimo." },
  { q: "¿Se puede solicitar una prueba del programa?", a: "Estamos explorando colaboraciones piloto de cuatro semanas. Su alcance, coste y calendario se acordarían con cada centro antes de iniciarse; actualmente no existe una suscripción abierta." },
  { q: "¿Hay que facilitar datos de salud de residentes para solicitar información?", a: "No. Para una primera conversación únicamente necesitamos datos generales del centro y sus necesidades de programación. No se deben enviar datos identificativos ni clínicos de residentes." },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": url + "#servicio",
      name: "Diseño de programas de actividades y neuropsicología para residencias",
      serviceType: "Asesoramiento y diseño de programas para centros residenciales y de día",
      areaServed: ["Maresme", "Barcelona", "Cataluña"],
      provider: { "@id": "https://carolinasanchezgirona.com/#dememoria" },
      url,
      description: "Programación adaptable de actividades significativas, estimulación cognitiva y apoyo a la organización del equipo profesional.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://carolinasanchezgirona.com/" },
        { "@type": "ListItem", position: 2, name: "Residencias", item: url },
      ],
    },
  ],
};

export default function ResidenciasPage() {
  return (
    <main className="res-page">
      <section className="res-hero">
        <div className="editorial-wrap res-hero-grid">
          <div>
            <nav className="res-breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><span>Residencias</span></nav>
            <p className="res-eyebrow">Dememoria · Vida Activa · Servicios para centros</p>
            <h1>Más vida en cada día. Actividades con sentido para residencias.</h1>
            <p className="res-lead">Programas semanales, materiales y acompañamiento profesional para residencias y centros de día. Una forma de facilitar el trabajo del equipo sin perder de vista lo importante: las preferencias y la participación de cada persona.</p>
            <div className="res-actions">
              <a className="editorial-btn editorial-btn-primary" href="/residencias/vida-activa/">Conocer Vida Activa <span aria-hidden="true">↗</span></a>
              <a className="editorial-btn editorial-btn-secondary" href="#contacto-profesional">Consultar un piloto</a>
            </div>
            <p className="res-small">Maresme y Barcelona · Recursos digitales para otros territorios · <a className="res-inline-link" href="/residencias/muestra/">Ver una muestra gratuita</a></p>
          </div>
          <aside className="res-hero-aside" aria-label="Principios de programación">
            <p className="res-aside-overline">Una programación útil responde a tres preguntas</p>
            <div><span>01</span><strong>¿Para quién?</strong><p>Capacidades, preferencias, apoyos y objetivos.</p></div>
            <div><span>02</span><strong>¿Para qué?</strong><p>Participación, bienestar y objetivos verificables.</p></div>
            <div><span>03</span><strong>¿Cómo?</strong><p>Materiales adecuados, profesionales y evaluación.</p></div>
          </aside>
        </div>
      </section>

      <section className="res-section">
        <div className="editorial-wrap">
          <p className="res-eyebrow">Áreas del programa</p>
          <h2>Mucho más que rellenar el horario.</h2>
          <p className="res-intro">Un calendario puede estar lleno y, aun así, ofrecer pocas oportunidades de participación significativa. La variedad se organiza en torno a intereses reales, necesidades de apoyo y elección personal.</p>
          <div className="res-card-grid">
            {activities.map(({number, title, text}) => <article key={number} className="res-card"><span className="res-index">{number}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="res-section res-benefits" aria-labelledby="res-benefits-title">
        <div className="editorial-wrap">
          <p className="res-eyebrow">Pensado desde tres perspectivas</p>
          <h2 id="res-benefits-title">Una propuesta humana y práctica.</h2>
          <div className="res-audience-grid">
            {audiences.map(({label,title,description}) => <article className="res-audience-card" key={label}>
              <p className="res-eyebrow">{label}</p><h3>{title}</h3><p>{description}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="res-section res-section-tint">
        <div className="editorial-wrap res-split">
          <div>
            <p className="res-eyebrow">De 10 a 13 h · De 15 a 18 h</p>
            <h2>Una semana organizada, pero no rígida.</h2>
            <p>La programación considera acogidas, tiempos de descanso, actividades grupales e individuales, y alternativas para quienes no desean participar en una propuesta concreta.</p>
            <p>En una residencia con varias unidades, el modelo permite planificar actividades paralelas y no depender de una sesión masiva para todos los residentes.</p>
            <a className="res-text-link" href="/residencias/muestra/">Explorar la programación de ejemplo →</a>
          </div>
          <div className="res-schedule-preview" aria-label="Ejemplos de franjas de actividad">
            <div className="res-schedule-head"><span>Hora</span><span>Propuesta</span></div>
            <div><time>10:00</time><span>Acogida y orientación</span></div>
            <div><time>10:20</time><span>Actividad física o cognitiva adaptada</span></div>
            <div><time>11:10</time><span>Descanso y elección personal</span></div>
            <div><time>11:40</time><span>Taller o proyecto significativo</span></div>
            <div><time>15:30</time><span>Actividad creativa, social o funcional</span></div>
            <div><time>16:40</time><span>Ocio elegido o participación comunitaria</span></div>
          </div>
        </div>
      </section>

      <section className="res-section">
        <div className="editorial-wrap">
          <p className="res-eyebrow">Metodología</p>
          <h2>Diseñado para utilizarlo, no para archivarlo.</h2>
          <div className="res-steps">
            {steps.map(({label, text},i) => <article key={label}><span>0{i+1}</span><h3>{label}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="res-section" aria-labelledby="res-formats-title">
        <div className="editorial-wrap">
          <p className="res-eyebrow">Opciones de colaboración</p>
          <h2 id="res-formats-title">Un formato para cada equipo.</h2>
          <p className="res-intro">No todos los centros necesitan el mismo acompañamiento. Estas tres modalidades orientan las conversaciones comerciales; alcance y presupuesto se concretarán individualmente, ya que el servicio se encuentra en fase de validación.</p>
          <div className="res-formats-grid">
            {formats.map(({name,tag,text})=><article className="res-format-card" key={name}>
              <span className="res-format-tag">{tag}</span>
              <h3>{name}</h3><p>{text}</p>
              <a className="res-text-link" href="#contacto-profesional">Consultar esta modalidad →</a>
            </article>)}
          </div>
        </div>
      </section>

      <section className="res-section res-section-tint" aria-labelledby="res-pilot-title">
        <div className="editorial-wrap res-split">
          <div>
            <p className="res-eyebrow">Primeras colaboraciones</p>
            <h2 id="res-pilot-title">Un piloto de cuatro semanas para empezar con criterio.</h2>
            <p>Primero escuchamos al equipo y revisamos sus necesidades. Después se define una programación de prueba, con materiales y adaptaciones acordes con los recursos disponibles.</p>
            <p>Al terminar, se revisan la viabilidad, la participación observada y las necesidades de ajuste. Un piloto no constituye por sí mismo una demostración de eficacia clínica.</p>
            <div className="res-actions"><a className="editorial-btn editorial-btn-primary" href="#contacto-profesional">Hablar sobre un piloto</a><a className="editorial-btn editorial-btn-secondary" href="/residencias/dossier/">Ver dossier profesional</a></div>
          </div>
          <ol className="res-pilot-list">
            <li><strong>Escuchamos.</strong><span>Unidades, horarios, equipo y prioridades.</span></li>
            <li><strong>Diseñamos.</strong><span>Propuestas, guías, materiales y alternativas.</span></li>
            <li><strong>Acompañamos.</strong><span>Resolución de dudas y ajustes durante la prueba.</span></li>
            <li><strong>Revisamos.</strong><span>Viabilidad y propuesta de continuidad, si procede.</span></li>
          </ol>
        </div>
      </section>

      <section className="res-section res-section-tint">
        <div className="editorial-wrap res-split">
          <div>
            <p className="res-eyebrow">Programa en desarrollo</p>
            <h2>Vida Activa, el sistema de programación de Dememoria.</h2>
            <p>Una propuesta modular con calendarios, guías profesionales, materiales para participantes y adaptaciones por niveles. Las primeras colaboraciones servirán para comprobar su utilidad operativa y ajustar su formato comercial.</p>
            <div className="res-actions"><a className="editorial-btn editorial-btn-primary" href="/residencias/vida-activa/">Conocer Vida Activa</a><a className="res-text-link" href="/residencias/dossier/">Leer el dossier →</a></div>
          </div>
          <div className="res-quote">«No se trata de ocupar todas las horas. Se trata de abrir oportunidades para participar, elegir y seguir siendo uno mismo».</div>
        </div>
      </section>

      <section className="res-section">
        <div className="editorial-wrap res-faq">
          <p className="res-eyebrow">Preguntas habituales</p>
          <h2>Una propuesta rigurosa y realista.</h2>
          {questions.map(({q,a}) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </section>

      <section className="res-section res-end-cta" aria-label="Contacto para residencias">
        <div className="editorial-wrap">
          <ResidentialEnquiry />
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}} />
    </main>
  );
}
