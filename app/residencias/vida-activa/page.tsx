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
  ["Calendario de actividades", "Distribución por días, franjas horarias y unidades, con alternativas y tiempos de descanso."],
  ["Guías para el equipo", "Objetivo, preparación, instrucciones de facilitación, tiempos, apoyos y precauciones."],
  ["Material para residentes", "Fichas y recursos visuales originales, diseñados para usarse, no solo para leerse."],
  ["Adaptaciones", "Versiones graduadas según características cognitivas y funcionales, sin asignaciones automáticas por diagnóstico."],
  ["Registro sencillo", "Asistencia, implicación, preferencias observadas y aspectos que conviene revisar."],
  ["Variedad mensual", "Rotación temática de actividades cognitivas, creativas, sociales, funcionales y de ocio elegido."],
];

const process = [
  { number:"01", title:"Seleccionar", body:"El centro indica el tamaño de sus grupos, la franja horaria y los recursos disponibles." },
  { number:"02", title:"Preparar", body:"El profesional consulta la guía y descarga las fichas y elementos necesarios." },
  { number:"03", title:"Acompañar", body:"Cada persona puede participar, adaptar su tarea, escoger una alternativa o descansar." },
  { number:"04", title:"Observar", body:"El equipo registra información útil para ajustar actividades posteriores." },
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
            <p className="res-eyebrow">Dememoria · Vida Activa · Programa en desarrollo</p>
            <h1>Una programación bien pensada, lista para adaptar a tu residencia.</h1>
            <p className="res-lead">Vida Activa nace para facilitar el trabajo de los equipos técnicos: propuestas variadas, instrucciones completas y materiales para los participantes, sin convertir la actividad diaria en una sucesión de fichas.</p>
            <div className="res-actions">
              <a href="#presentacion-vida-activa" className="editorial-btn editorial-btn-primary">Ver presentación del programa</a>
              <a href="/residencias/#contacto-profesional" className="editorial-btn editorial-btn-secondary">Solicitar información</a>
            </div>
          </div>
          <div className="res-product-display" aria-label="Estructura de ejemplo del programa">
            <div className="res-product-top"><span>VIDA ACTIVA</span><span>SEMANA 01</span></div>
            <p>Programación adaptable</p>
            <div><strong>Lunes</strong><span>Cognición y expresión artística</span></div>
            <div><strong>Martes</strong><span>Movimiento y reminiscencia</span></div>
            <div><strong>Miércoles</strong><span>Vida cotidiana y creatividad</span></div>
            <div><strong>Jueves</strong><span>Lenguaje y vínculos</span></div>
            <div><strong>Viernes</strong><span>Música y proyectos compartidos</span></div>
            <small>Ejemplo editorial, no prescripción para todos los residentes.</small>
          </div>
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
          <h2>Del calendario al material de trabajo.</h2>
          <p className="res-intro">Cada propuesta incluye contexto suficiente para que los profesionales puedan decidir si es adecuada, ajustarla y aplicarla con sentido.</p>
          <div className="res-card-grid">
            {contents.map(([title,text],index)=><article className="res-card" key={title}><span className="res-index">{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="res-section res-section-tint">
        <div className="editorial-wrap res-split">
          <div>
            <p className="res-eyebrow">Residencias con varias unidades</p>
            <h2>Una misma estructura. Distintas experiencias.</h2>
            <p>El programa se concibe para unidades y grupos de diferentes tamaños, con actividades en paralelo y adaptación a preferencias y capacidades. No se agrupa a las personas únicamente por una puntuación cognitiva.</p>
            <p>La participación debe ser voluntaria. Siempre se contempla una alternativa de ocio, descanso o apoyo individual cuando sea necesario.</p>
          </div>
          <div className="res-levels">
            <article><span>A</span><div><strong>Participación autónoma</strong><p>Retos, debate, planificación y proyectos abiertos.</p></div></article>
            <article><span>B</span><div><strong>Participación con apoyos</strong><p>Consignas graduadas, claves, materiales adaptados y acompañamiento.</p></div></article>
            <article><span>C</span><div><strong>Participación individualizada</strong><p>Actividades breves significativas, accesibilidad y comunicación ajustada.</p></div></article>
          </div>
        </div>
      </section>

      <section className="res-section res-centre-scenario" aria-labelledby="escenario-title">
        <div className="editorial-wrap">
          <p className="res-eyebrow">Ejemplo de organización · Centro de 120 plazas</p>
          <h2 id="escenario-title">Seis unidades. Una coordinación común.</h2>
          <p className="res-intro">En un centro grande, el mismo calendario no tiene por qué implicar la misma actividad para todo el mundo. Este ejemplo muestra cómo distribuir propuestas simultáneas sin asignar profesionales ni niveles a personas concretas.</p>
          <div className="res-unit-grid">
            {[
              {unit:"Unidad 1",activity:"Club de actualidad",mode:"Grupo de conversación"},
              {unit:"Unidad 2",activity:"Taller de reminiscencia",mode:"Propuesta con apoyos"},
              {unit:"Unidad 3",activity:"Arte y expresión",mode:"Proyecto creativo"},
              {unit:"Unidad 4",activity:"Actividad significativa individual",mode:"Sesiones breves"},
              {unit:"Unidad 5",activity:"Juegos de estrategia",mode:"Ocio elegido"},
              {unit:"Unidad 6",activity:"Música y participación",mode:"Grupo adaptable"},
            ].map(item=><article className="res-unit-card" key={item.unit}>
              <p>{item.unit} <span>10:20–11:10</span></p>
              <h3>{item.activity}</h3>
              <small>{item.mode}</small>
            </article>)}
          </div>
          <p className="res-scenario-note">Escenario ilustrativo. Las actividades simultáneas requieren disponibilidad real de profesionales y espacios. No sustituye el cálculo de ratios ni la valoración del centro.</p>
        </div>
      </section>

      <section className="res-section">
        <div className="editorial-wrap">
          <p className="res-eyebrow">Cómo se usaría</p>
          <h2>Cuatro pasos, sin un panel interminable.</h2>
          <div className="res-steps">
            {process.map(({number,title,body})=><article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="res-section res-section-tint">
        <div className="editorial-wrap res-split">
          <div>
            <p className="res-eyebrow">Muestra gratuita</p>
            <h2>Abre la programación de ejemplo antes de decidir.</h2>
            <p>Incluye una propuesta de horario semanal y tres actividades desarrolladas con indicaciones para el equipo, adaptaciones y material de trabajo. Puedes imprimirla o guardarla como PDF.</p>
            <a className="editorial-btn editorial-btn-primary" href="/residencias/muestra/">Consultar la muestra imprimible</a>
          </div>
          <aside className="res-note">
            <strong>Estado del proyecto</strong>
            <p>Esta es la presentación inicial de Vida Activa. El catálogo mensual, la suscripción y las licencias corporativas todavía no están a la venta.</p>
            <p>Se pueden solicitar conversaciones exploratorias con direcciones y equipos técnicos.</p>
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
          <h2>¿Tu centro quiere explorar Vida Activa?</h2>
          <p>Podemos valorar qué dificultades tiene actualmente la programación y qué formato sería viable. Sin datos personales de residentes en el primer contacto.</p>
          <a className="editorial-btn editorial-btn-primary" href="/residencias/#contacto-profesional">Contactar para un piloto</a>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    </main>
  );
}
