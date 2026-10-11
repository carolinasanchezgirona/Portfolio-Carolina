import type { Metadata } from "next";
import VidaActivaPresentacion from "./presentacion";
import "./presentacion.css";

const url = "https://carolinasanchezgirona.com/residencias/vida-activa/";

export const metadata: Metadata = {
  title: "Vida Activa: programa de actividades para residencias",
  description: "Conoce Vida Activa en una presentación interactiva de seis diapositivas. Programas de actividades significativas, recursos y apoyo para residencias y centros de día.",
  alternates: { canonical: "/residencias/vida-activa/" },
  openGraph: {
    title: "Vida Activa | Programa de actividades para residencias",
    description: "Planificación por unidades, material imprimible y actividades significativas para profesionales de centros residenciales.",
    url,
    type: "website",
  },
};

const contents = [
  ["Programación a medida", "Selección y distribución flexible de propuestas según los horarios, las unidades y los recursos de cada centro."],
  ["Guías profesionales", "Objetivos, materiales, preparación, facilitación, apoyos y precauciones para una aplicación responsable."],
  ["Recursos variados", "Actividades conversacionales, creativas, funcionales, culturales, manipulativas y fichas cuando aportan valor."],
  ["Adaptación individual", "Consignas, accesibilidad, dificultad y modalidades de participación ajustadas a necesidades y preferencias."],
  ["Seguimiento útil", "Registro breve de participación, intereses, alternativas y aspectos que el equipo decide revisar."],
  ["Formación y acompañamiento", "Orientación práctica y apoyo opcional al personal de referencia para incorporar el programa a la rutina del centro."],
];

const process = [
  { number:"01", title:"Escuchar", body:"Conocer al centro, sus unidades, los recursos disponibles y las prioridades del equipo y de las personas residentes." },
  { number:"02", title:"Diseñar", body:"Proponer una combinación de actividades y formatos que encaje con la realidad organizativa y la ACP." },
  { number:"03", title:"Preparar al equipo", body:"Facilitar guías y, cuando se contrate, formación y orientación práctica al personal de referencia." },
  { number:"04", title:"Ajustar", body:"Revisar la participación, las preferencias y las dificultades de aplicación para introducir cambios realistas." },
];

export default function VidaActivaPage() {
  const schema = {
    "@context":"https://schema.org",
    "@graph":[
      { "@type":"Service", name:"Vida Activa: diseño de programas de actividades para residencias", serviceType:"Programación de actividades residenciales", provider:{"@id":"https://carolinasanchezgirona.com/#dememoria"}, areaServed:["Maresme","Barcelona","Cataluña"], url, description:"Propuesta de programación y materiales para equipos técnicos de residencias y centros de día." },
      { "@type":"BreadcrumbList", itemListElement:[
        {"@type":"ListItem",position:1,name:"Inicio",item:"https://carolinasanchezgirona.com/"},
        {"@type":"ListItem",position:2,name:"Residencias",item:"https://carolinasanchezgirona.com/residencias/"},
        {"@type":"ListItem",position:3,name:"Vida Activa",item:url},
      ]}
    ]
  };
  return (
    <main className="res-page">
      <section className="res-hero res-hero-product">
        <div className="editorial-wrap res-hero-grid">
          <div>
            <nav className="res-breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><a href="/residencias/">Residencias</a><span>/</span><span>Vida Activa</span></nav>
            <p className="res-eyebrow">DEMEMÒRIA · VIDA ACTIVA · PARA RESIDENCIAS Y CENTROS DE DÍA</p>
            <h1>Actividades con sentido, diseñadas para cada residencia.</h1>
            <p className="res-lead">Un programa de actividades significativas que se diseña alrededor de las personas residentes, la organización del centro y el personal de referencia. Con variedad, adaptaciones y posibilidad de formación al equipo.</p>
            <div className="res-actions">
              <a href="#presentacion-vida-activa" className="editorial-btn editorial-btn-primary">Ver presentación del programa</a>
              <a href="/residencias/#contacto-profesional" className="editorial-btn editorial-btn-secondary">Solicitar propuesta para mi centro</a>
            </div>
          </div>
          <aside className="res-offer-showcase" aria-label="Áreas de actividad del programa Vida Activa">
            <div className="res-offer-showcase-head"><span>VIDA ACTIVA</span><span>UN PROGRAMA, MUCHAS POSIBILIDADES</span></div>
            <div className="res-offer-showcase-title">Actividades que se adaptan a las personas, no al revés.</div>
            <ul>
              <li><span>01</span> Estimulación cognitiva</li>
              <li><span>02</span> Arte, música y expresión</li>
              <li><span>03</span> Vida cotidiana y autonomía</li>
              <li><span>04</span> Bienestar y vínculo</li>
              <li><span>05</span> Movimiento y funcionalidad</li>
              <li><span>06</span> Ocio, cultura y comunidad</li>
            </ul>
            <p>Sin horario predeterminado · Con enfoque de Atención Centrada en la Persona</p>
          </aside>
        </div>
      </section>

      <section className="res-section va-presentation-section" aria-label="Presentación interactiva del programa Vida Activa">
        <div className="editorial-wrap">
          <VidaActivaPresentacion />
        </div>
      </section>

      <section className="res-section">
        <div className="editorial-wrap">
          <p className="res-eyebrow">Qué incorpora</p>
          <h2>Más posibilidades, menos improvisación.</h2>
          <p className="res-intro">Vida Activa combina variedad de actividades, materiales originales, orientación profesional y recursos adaptables. El alcance se define para cada residencia y no se entrega como un horario cerrado.</p>
          <div className="res-card-grid">
            {contents.map(([title,text],index)=><article className="res-card" key={title}><span className="res-index">{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="res-section res-section-tint res-tailored-section">
        <div className="editorial-wrap res-split">
          <div>
            <p className="res-eyebrow">Variedad de formatos</p>
            <h2>No existe una única manera de participar.</h2>
            <p>Las propuestas pueden desarrollarse en grupo, en pequeño grupo, individualmente o por unidades de convivencia. También pueden formar parte de proyectos colectivos con continuidad, sin depender exclusivamente de fichas o ejercicios de mesa.</p>
            <p>El formato se acuerda con el equipo y puede incorporar recursos visuales, objetos manipulativos, experiencias culturales, conversación o actividades cotidianas.</p>
          </div>
          <div className="res-tailored-panel">
            <p className="res-panel-eyebrow">POSIBILIDADES DE APLICACIÓN</p>
            <div className="res-format-grid">
              <span>Grupo</span><span>Pequeños grupos</span><span>Individual</span>
              <span>Por unidades</span><span>Proyectos compartidos</span><span>Multimodal</span>
            </div>
            <p className="res-panel-note">La participación puede consistir en hacer, elegir, conversar, observar o descansar.</p>
          </div>
        </div>
      </section>

      <section className="res-section res-care-section">
        <div className="editorial-wrap">
          <p className="res-eyebrow">Adaptación y Atención Centrada en la Persona · ACP</p>
          <h2>Empezamos por conocer a quienes van a participar.</h2>
          <p className="res-intro">La ACP guía el planteamiento: preferencias, biografía, capacidades, apoyos, ritmo, elección y derecho a no participar. La actividad tiene que encajar en la vida de la persona y en la realidad asistencial, no al contrario.</p>
          <div className="res-adaptation-grid">
            <article><span>01</span><h3>Las personas residentes</h3><p>Intereses, historia personal, valores, motivación y maneras de expresar sus preferencias.</p></article>
            <article><span>02</span><h3>Necesidades de apoyo</h3><p>Características cognitivas, sensoriales, funcionales y comunicativas, así como descansos y accesibilidad.</p></article>
            <article><span>03</span><h3>El personal de referencia</h3><p>Coordinación con quienes conocen a cada residente y con el equipo técnico responsable de la actividad.</p></article>
            <article><span>04</span><h3>La organización del centro</h3><p>Unidades, espacios, materiales, turnos y disponibilidad real de profesionales.</p></article>
          </div>
          <p className="res-scenario-note">Vida Activa se alinea con los principios de la ACP y se adapta al modelo de cuidados del centro. No sustituye la valoración individual, los planes de atención ni las competencias de cada profesional.</p>
        </div>
      </section>

      <section className="res-section">
        <div className="editorial-wrap">
          <p className="res-eyebrow">Cómo se usaría</p>
          <h2>Del conocimiento del centro a una propuesta viable.</h2>
          <div className="res-steps">
            {process.map(({number,title,body})=><article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="res-section res-section-tint res-training-section">
        <div className="editorial-wrap res-split">
          <div>
            <p className="res-eyebrow">Formación y acompañamiento</p>
            <h2>Que el equipo sepa cómo llevarlo a la práctica.</h2>
            <p>El valor del programa no depende solo de los materiales. Podemos incluir formación inicial y orientación práctica para facilitar las actividades, ajustar las consignas y tomar decisiones ante dificultades reales.</p>
            <p>El acompañamiento se coordina con el personal de referencia y los profesionales responsables, evitando añadir tareas innecesarias o imponer dinámicas incompatibles con el centro.</p>
            <a className="res-text-link" href="/residencias/#contacto-profesional">Solicitar una propuesta que incluya formación →</a>
          </div>
          <aside className="res-care-note">
            <p className="res-panel-eyebrow">OPCIONES SEGÚN EL CENTRO</p>
            <h3>Materiales, formación o colaboración a medida.</h3>
            <ul className="res-support-list">
              <li>Formación inicial para profesionales</li>
              <li>Orientación de adaptación de actividades</li>
              <li>Coordinación con personal de referencia</li>
              <li>Revisión de la implantación y ajustes</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="res-section res-section-tint">
        <div className="editorial-wrap res-split">
          <div>
            <p className="res-eyebrow">Muestra gratuita</p>
            <h2>Una actividad de muestra para evaluar el enfoque.</h2>
            <p>Una demostración completa y cuidada permite valorar el enfoque profesional y la calidad editorial. La programación semanal completa, las guías y los solucionarios se facilitan únicamente dentro de la colaboración acordada con el centro.</p>
            <a className="editorial-btn editorial-btn-primary" href="/residencias/muestra/">Explorar una actividad de muestra</a>
          </div>
          <aside className="res-note">
            <strong>Estado del proyecto</strong>
            <p>Esta es la presentación inicial de Vida Activa. El alcance, la entrega de materiales y las condiciones económicas se concretan individualmente con cada centro.</p>
            <p>Puedes solicitar una propuesta inicial sin facilitar datos clínicos de residentes.</p>
          </aside>
        </div>
      </section>

      <section className="res-section">
        <div className="editorial-wrap">
          <p className="res-eyebrow">Criterio profesional</p>
          <h2>Apoyar al equipo, no sustituirlo.</h2>
          <p className="res-intro">Las actividades se presentan como recursos ocupacionales, sociales o de estimulación según sus objetivos. La indicación clínica, la valoración individual y las actuaciones de fisioterapia, psicología y terapia ocupacional requieren profesionales habilitados conforme a sus competencias. Ninguna actividad garantiza por sí sola mejoras cognitivas o funcionales.</p>
          <a className="res-text-link" href="/residencias/recursos/">Consultar recursos para equipos →</a>
        </div>
      </section>

      <section className="res-section res-end-cta">
        <div className="editorial-wrap">
          <p className="res-eyebrow">Colaboraciones piloto</p>
          <h2>Cada residencia merece una propuesta propia.</h2>
          <p>Diseñamos el alcance a partir de la organización, los intereses de los residentes y los recursos del equipo. Puedes solicitar una propuesta de materiales, formación o acompañamiento, sin facilitar datos personales ni clínicos en este primer contacto.</p>
          <a className="editorial-btn editorial-btn-primary" href="/residencias/#contacto-profesional">Solicitar propuesta para mi centro</a>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    </main>
  );
}
