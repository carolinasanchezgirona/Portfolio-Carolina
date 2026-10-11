import type { Metadata } from "next";
import PrintDossierAction from "./print-action";

export const metadata: Metadata = {
  title: "Dossier profesional Vida Activa | Dememoria",
  description: "Presentación profesional de Vida Activa: programación de actividades para residencias y centros de día, colaboración piloto y principios de trabajo.",
  alternates: { canonical: "/residencias/dossier/" },
  robots: { index: false, follow: true },
};

const deliverables = [
  { title: "Planificación semanal", text: "Propuestas por franjas, grupos y unidades, incluyendo descansos y opciones de libre elección." },
  { title: "Guías para profesionales", text: "Finalidad, materiales, instrucciones, tiempos, apoyos, adaptaciones y precauciones." },
  { title: "Materiales originales", text: "Recursos visuales, fichas y propuestas listas para preparar o imprimir cuando sea necesario." },
  { title: "Adaptaciones", text: "Variaciones según intereses y necesidades funcionales, cognitivas y sensoriales, sin clasificar solo por diagnóstico." },
  { title: "Seguimiento sencillo", text: "Observaciones de participación, preferencias y dificultades, para revisar la viabilidad." },
  { title: "Coordinación del equipo", text: "Una estructura de trabajo que respeta las funciones de cada disciplina y los recursos disponibles." },
];

const pilot = [
  { week: "01", title: "Conocer", text: "Escuchar a dirección y equipo técnico; revisar horarios, espacios y prioridades." },
  { week: "02", title: "Proponer", text: "Facilitar propuestas, materiales y alternativas acordes con la capacidad de implantación." },
  { week: "03", title: "Ajustar", text: "Recoger dudas e incidencias y adaptar el uso de los recursos." },
  { week: "04", title: "Revisar", text: "Valorar utilidad operativa, participación y condiciones para una posible continuidad." },
];

export default function DossierVidaActivaPage() {
  return (
    <main className="res-page res-dossier-page">
      <section className="res-dossier-toolbar res-no-print">
        <div className="editorial-wrap">
          <nav className="res-breadcrumb" aria-label="Ruta de navegación">
            <a href="/">Inicio</a><span>/</span><a href="/residencias/">Residencias</a><span>/</span><span>Dossier profesional</span>
          </nav>
          <div className="res-dossier-actions">
            <a className="editorial-btn editorial-btn-secondary" href="/residencias/vida-activa/">Volver a Vida Activa</a>
            <PrintDossierAction />
          </div>
        </div>
      </section>

      <article className="res-dossier-sheet" aria-label="Dossier Vida Activa para direcciones de residencias">
        <header className="res-dossier-cover">
          <div className="res-dossier-headerline"><strong>DEMEmÒRIA</strong><span>VIDA ACTIVA · DOSSIER PROFESIONAL</span></div>
          <p className="res-eyebrow">Residencias y centros de día · Maresme y Barcelona</p>
          <h1>Más vida en cada día.</h1>
          <p className="res-dossier-subtitle">Programas de actividades significativas, estimulación cognitiva y participación para residencias y centros de día.</p>
          <div className="res-dossier-signature">
            <strong>Carolina Sánchez Girona</strong>
            <span>Psicóloga General Sanitaria y Neuropsicóloga · COPC 24892</span>
          </div>
        </header>

        <section className="res-dossier-section">
          <p className="res-eyebrow">01 · El enfoque</p>
          <h2>Una buena programación no consiste solo en ocupar horas.</h2>
          <p>Una actividad puede ser agradable y tener valor por sí misma. También puede abrir oportunidades para conversar, crear, tomar decisiones o mantener la conexión con los intereses personales. Vida Activa propone organizar estas oportunidades de forma más variada y accesible, con materiales que faciliten el trabajo cotidiano del equipo.</p>
          <div className="res-dossier-values">
            <div><strong>Personas</strong><span>Preferencias, autonomía y derecho a elegir.</span></div>
            <div><strong>Profesionales</strong><span>Guías utilizables y margen para adaptar.</span></div>
            <div><strong>Centros</strong><span>Planificación coherente y revisión posible.</span></div>
          </div>
        </section>

        <section className="res-dossier-section">
          <p className="res-eyebrow">02 · Qué contempla</p>
          <h2>Del calendario al material de trabajo.</h2>
          <div className="res-dossier-deliverables">
            {deliverables.map(({title,text}) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </section>

        <section className="res-dossier-section res-dossier-break">
          <p className="res-eyebrow">03 · Cómo empezar</p>
          <h2>Explorar un piloto de cuatro semanas.</h2>
          <p>Antes de plantear una colaboración continuada, podemos definir una prueba ajustada al centro. El contenido exacto, el calendario, el coste y las condiciones deben acordarse previamente. Esta es una propuesta en validación, no una suscripción ya comercializada.</p>
          <div className="res-dossier-pilot">
            {pilot.map(({week,title,text})=><div key={week}><span>{week}</span><div><strong>{title}</strong><p>{text}</p></div></div>)}
          </div>
        </section>

        <section className="res-dossier-section">
          <p className="res-eyebrow">04 · Modalidades orientativas</p>
          <h2>Distintos centros, distintas necesidades.</h2>
          <div className="res-dossier-models">
            <div><h3>Materiales</h3><p>Planificaciones y recursos para equipos que trabajan con autonomía.</p></div>
            <div><h3>Acompañamiento</h3><p>Recursos más orientación y revisión de su implantación.</p></div>
            <div><h3>Diseño a medida</h3><p>Programación específica para centros con varias unidades o necesidades organizativas particulares.</p></div>
          </div>
        </section>

        <section className="res-dossier-section">
          <p className="res-eyebrow">05 · Compromiso profesional</p>
          <h2>Rigor, respeto y colaboración.</h2>
          <p>Se diferencian las actividades de ocio, participación y estimulación de las intervenciones sanitarias específicas. Vida Activa no sustituye las valoraciones individuales, las decisiones asistenciales ni las competencias de psicología, terapia ocupacional, fisioterapia u otras disciplinas. No se atribuyen mejoras clínicas a un calendario por sí solo.</p>
          <p>Para una primera conversación no se solicitan datos identificativos ni información clínica de personas residentes.</p>
        </section>

        <footer className="res-dossier-contact">
          <div>
            <p className="res-eyebrow">Hablemos de tu centro</p>
            <h2>¿Qué os gustaría poder ofrecer mejor?</h2>
            <p>Primer contacto sin compromiso, con una conversación real sobre las necesidades y los recursos disponibles.</p>
            <a href="mailto:contact@carolinasanchezgirona.com?subject=Vida%20Activa%20-%20Consulta%20profesional">contact@carolinasanchezgirona.com</a>
            <p>carolinasanchezgirona.com/residencias/</p>
          </div>
          <div className="res-no-print"><a className="editorial-btn editorial-btn-primary" href="/residencias/#contacto-profesional">Consultar un piloto</a></div>
        </footer>
        <p className="res-dossier-legal">Dememoria · Carolina Sánchez Girona · Presentación orientativa de un programa en desarrollo · Octubre de 2026.</p>
      </article>
    </main>
  );
}
