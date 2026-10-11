import type { Metadata } from "next";
import ResidentialEnquiry from "./residential-enquiry";

const url = "https://carolinasanchezgirona.com/residencias/";

export const metadata: Metadata = {
  title: "Servicios de neuropsicología y actividades para residencias",
  description: "Programas de estimulación cognitiva, actividades significativas y apoyo técnico para residencias y centros de día en Maresme y Barcelona. Conoce Vida Activa de Dememoria.",
  alternates: { canonical: "/residencias/" },
  openGraph: {
    title: "Programas de actividades para residencias | Dememoria",
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
              <a className="editorial-btn editorial-btn-secondary" href="/residencias/muestra/">Ver una semana de ejemplo</a>
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
          <p className="res-intro">Un calendario puede estar lleno y, aun así, ofrecer pocas oportunidades de participación significativa. La variedad se organiza en torno a intereses reales, necesidades de apoyo y elección personal.</p>
          <div className="res-card-grid">
            {activities.map(({number, title, text}) => <article key={number} className="res-card"><span className="res-index">{number}</span><h3>{title}</h3><p>{text}</p></article>)}
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

      <section className="res-section res-section-tint">
        <div className="editorial-wrap res-split">
          <div>
            <p className="res-eyebrow">Programa en desarrollo</p>
            <h2>Vida Activa, el sistema de programación de Dememoria.</h2>
            <p>Una propuesta modular con calendarios, guías para el equipo, materiales para los participantes y adaptaciones por niveles. Estamos definiendo el formato comercial y las condiciones de las primeras colaboraciones.</p>
            <a className="editorial-btn editorial-btn-primary" href="/residencias/vida-activa/">Ver el programa</a>
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
