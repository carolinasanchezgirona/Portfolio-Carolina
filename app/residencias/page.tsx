import type { Metadata } from "next";
import ResidentialEnquiry from "./residential-enquiry";

const url = "https://carolinasanchezgirona.com/residencias/";

export const metadata: Metadata = {
  title: "Servicios de neuropsicología y actividades para residencias",
  description: "Diseño de actividades significativas para residencias y centros de día en Maresme y Barcelona, adaptadas a cada centro, con ACP y formación opcional al equipo.",
  alternates: { canonical: "/residencias/" },
  openGraph: {
    title: "Programas de actividades para residencias | Dememoria",
    description: "Propuestas adaptables de estimulación cognitiva, participación ocupacional y bienestar para residencias y centros de día.",
    url,
    type: "website",
  },
};

const activities = [
  { number: "01", title: "Estimulación cognitiva", text: "Memoria, atención, lenguaje, orientación y funciones ejecutivas mediante propuestas adultas, funcionales y graduables." },
  { number: "02", title: "Arte y expresión", text: "Talleres creativos, música, expresión plástica y proyectos culturales con diferentes maneras de participar." },
  { number: "03", title: "Vida cotidiana", text: "Actividades significativas relacionadas con las rutinas, la autonomía, la planificación y la toma de decisiones." },
  { number: "04", title: "Bienestar y vínculos", text: "Conversación, identidad, reminiscencia voluntaria, comunicación y oportunidades de relación social." },
  { number: "05", title: "Movimiento y funcionalidad", text: "Propuestas coordinadas con los profesionales competentes, atendiendo a seguridad, movilidad y capacidades funcionales." },
  { number: "06", title: "Ocio y comunidad", text: "Cinefórum, juegos adaptados, lectura, proyectos compartidos y actividades relacionadas con el entorno." },
];

const steps = [
  { label: "Conocer el centro", text: "Escuchar a dirección y personal de referencia, identificar recursos, organización e intereses de los residentes." },
  { label: "Diseñar con el equipo", text: "Seleccionar propuestas, formatos y materiales que encajen con la vida cotidiana de cada unidad." },
  { label: "Formar y acompañar", text: "Ofrecer, si se acuerda, formación práctica en la preparación, facilitación y adaptación de las actividades." },
  { label: "Revisar y ajustar", text: "Recoger la experiencia de las personas residentes y del equipo para mejorar la utilidad y viabilidad." },
];

const questions = [
  { q: "¿El programa sustituye a terapia ocupacional, fisioterapia o psicología?", a: "No. Es una herramienta de planificación y apoyo. La valoración, indicación y ejecución de actos sanitarios corresponden a los profesionales cualificados del centro o colaboradores acreditados." },
  { q: "¿Sirve para centros grandes?", a: "Se plantea para poder organizar propuestas por unidades de convivencia y grupos de necesidades distintas, sin imponer una actividad idéntica a toda la residencia." },
  { q: "¿Todas las actividades son terapéuticas?", a: "No. Se diferencian el ocio elegido, las oportunidades de participación y las intervenciones con objetivos clínicos específicos. Disfrutar de una actividad también es un objetivo legítimo." },
  { q: "¿Cómo se incorpora la Atención Centrada en la Persona?", a: "El programa se alinea con la ACP: parte de la biografía, las preferencias y las decisiones de cada residente, respeta el derecho a no participar y se coordina con el personal de referencia. No sustituye el modelo de cuidados ni los planes individuales del centro." },
  { q: "¿Se puede formar al equipo?", a: "Sí. La propuesta puede incluir formación inicial, orientación de aplicación y acompañamiento al personal de referencia, según las necesidades y el alcance contratado." },
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
            <p className="res-eyebrow">Dememoria · Servicios para centros</p>
            <h1>Actividades con sentido para cada persona, también en una residencia grande.</h1>
            <p className="res-lead">Diseño de programas de estimulación cognitiva, participación ocupacional y bienestar para residencias y centros de día. Una estructura clara para el equipo, con opciones adaptadas a las capacidades e intereses de los residentes.</p>
            <div className="res-actions">
              <a className="editorial-btn editorial-btn-primary" href="/residencias/vida-activa/">Conocer Vida Activa <span aria-hidden="true">↗</span></a>
              <a className="editorial-btn editorial-btn-secondary" href="/residencias/muestra/">Ver una actividad de muestra</a>
            </div>
            <p className="res-small">Propuesta para centros del Maresme, Barcelona y otros territorios mediante recursos digitales.</p>
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
          <p className="res-intro">El programa combina áreas cognitivas, creativas, sociales, funcionales y culturales. La variedad no consiste en acumular fichas, sino en proponer experiencias adultas con sentido, elección y diferentes formas de implicación.</p>
          <div className="res-card-grid">
            {activities.map(({number, title, text}) => <article key={number} className="res-card"><span className="res-index">{number}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="res-section res-section-tint res-tailored-section">
        <div className="editorial-wrap res-split">
          <div>
            <p className="res-eyebrow">Diseñado con cada centro</p>
            <h2>Vuestra organización marca el ritmo.</h2>
            <p>Vida Activa no impone franjas horarias ni un calendario idéntico a todas las residencias. La propuesta se adapta a los recursos, a las unidades de convivencia y a la disponibilidad del equipo.</p>
            <p>Podemos combinar actividades en grupo, pequeños grupos, intervenciones individuales y proyectos compartidos, tanto con fichas como con materiales manipulativos, conversación o recursos visuales.</p>
            <a className="res-text-link" href="/residencias/vida-activa/">Descubrir cómo se adapta Vida Activa →</a>
          </div>
          <div className="res-tailored-panel">
            <p className="res-panel-eyebrow">FORMATOS POSIBLES</p>
            <div className="res-format-grid">
              <span>Pequeños grupos</span><span>Atención individual</span><span>Por unidades</span>
              <span>Proyectos colectivos</span><span>Recursos visuales</span><span>Materiales manipulativos</span>
            </div>
            <p className="res-panel-note">La elección del formato depende de las preferencias, necesidades de apoyo y condiciones reales del centro.</p>
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

      <section className="res-section res-section-tint res-care-section">
        <div className="editorial-wrap res-split">
          <div>
            <p className="res-eyebrow">Atención Centrada en la Persona · ACP</p>
            <h2>Primero la persona. Después, la actividad.</h2>
            <p>El enfoque se alinea con la Atención Centrada en la Persona: conocer historias de vida, intereses, decisiones y preferencias, respetando la dignidad, la voluntad y el derecho a no participar.</p>
            <p>La participación puede expresarse de muchas maneras: crear, conversar, elegir, observar o disfrutar de una alternativa. No todas las personas necesitan hacer lo mismo.</p>
          </div>
          <aside className="res-care-note">
            <p className="res-panel-eyebrow">FORMACIÓN Y APOYO AL EQUIPO</p>
            <h3>Para que el programa funcione en el día a día.</h3>
            <p>Podemos incorporar formación inicial, orientación práctica y acompañamiento al personal de referencia, coordinándonos con los profesionales responsables de cada área.</p>
            <a className="editorial-btn editorial-btn-primary" href="/residencias/#contacto-profesional">Solicitar propuesta para mi centro</a>
          </aside>
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
