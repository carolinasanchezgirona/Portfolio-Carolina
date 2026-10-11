import type { Metadata } from "next";

const url = "https://carolinasanchezgirona.com/residencias/recursos/";

export const metadata: Metadata = {
  title: "Recursos y actividades para residencias de mayores",
  description: "Recursos gratuitos para equipos técnicos de residencias: criterios para programar actividades significativas, adaptar la estimulación cognitiva y revisar la participación.",
  alternates: { canonical: "/residencias/recursos/" },
  openGraph: {
    title: "Recursos para equipos de residencias | Dememoria",
    description: "Guía práctica para planificar y adaptar actividades en residencias y centros de día.",
    url,
    type: "article",
  },
};

const checks = [
  "La actividad responde a intereses y preferencias conocidas, no solo a una categoría diagnóstica.",
  "Está definido qué aporta: disfrute, participación, mantenimiento funcional u objetivo clínico.",
  "Se indican duración orientativa, materiales, accesibilidad y número razonable de participantes.",
  "Hay una versión con apoyos y una alternativa para quien no quiere o no puede participar.",
  "Se prevén descansos, tolerancia a la fatiga y necesidades sensoriales o de movilidad.",
  "El profesional tiene instrucciones claras y capacidad para modificar la propuesta.",
  "La actividad conserva significado adulto y evita un trato infantilizador.",
  "Se distingue el ocio voluntario de la intervención terapéutica con indicación clínica.",
  "El equipo puede registrar participación y observaciones sin cargar con documentación innecesaria.",
  "La programación se revisa con la voz de las personas residentes y, cuando procede, sus familias.",
];

export default function RecursosResidenciasPage(){
  const schema={
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    itemListElement:[
      {"@type":"ListItem",position:1,name:"Inicio",item:"https://carolinasanchezgirona.com/"},
      {"@type":"ListItem",position:2,name:"Residencias",item:"https://carolinasanchezgirona.com/residencias/"},
      {"@type":"ListItem",position:3,name:"Recursos",item:url}
    ]
  };
  return <main className="res-page">
    <section className="res-hero res-hero-compact">
      <div className="editorial-wrap">
        <nav className="res-breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><a href="/residencias/">Residencias</a><span>/</span><span>Recursos</span></nav>
        <p className="res-eyebrow">Recursos gratuitos · Equipos técnicos</p>
        <h1>Cómo programar actividades que tengan sentido en una residencia.</h1>
        <p className="res-lead">Ideas y herramientas para revisar el calendario, adaptar propuestas y diferenciar ocio, participación significativa e intervención clínica.</p>
        <div className="res-actions"><a className="editorial-btn editorial-btn-primary" href="/residencias/muestra/">Ver una actividad de muestra</a></div>
      </div>
    </section>
    <section className="res-section">
      <div className="editorial-wrap res-split">
        <div>
          <p className="res-eyebrow">Revisión rápida</p>
          <h2>Diez preguntas antes de publicar el calendario.</h2>
          <p>No basta con enumerar actividades. Una programación útil necesita considerar quién podrá participar, cómo se adaptará y qué papel tiene la persona residente en la elección.</p>
        </div>
        <ol className="res-checklist">{checks.map(item=><li key={item}>{item}</li>)}</ol>
      </div>
    </section>
    <section className="res-section res-section-tint">
      <div className="editorial-wrap">
        <p className="res-eyebrow">Ejemplos prácticos</p>
        <h2>Un mismo recurso puede tener usos diferentes.</h2>
        <div className="res-card-grid">
          <article className="res-card"><span className="res-index">CINE</span><h3>Película compartida</h3><p>Puede ser ocio elegido. Como cinefórum, añade conversación, interpretación y participación. Solo sería intervención cognitiva estructurada si se diseñan objetivos, apoyos y seguimiento adecuados.</p></article>
          <article className="res-card"><span className="res-index">JUEGO</span><h3>Rummikub y Trivial</h3><p>Juegos válidos como disfrute y relación social. Su uso como recurso cognitivo exige graduar reglas y dificultad, conocer el perfil de cada persona y evitar frustración o exclusión.</p></article>
          <article className="res-card"><span className="res-index">PROYECTO</span><h3>Exposición del barrio</h3><p>Un proyecto colectivo permite elegir fotografías, reconstruir recuerdos, conversar, crear cartelas y abrir la exposición a familias. Integra participación, identidad y cultura.</p></article>
        </div>
      </div>
    </section>
    <section className="res-section">
      <div className="editorial-wrap res-split">
        <div>
          <p className="res-eyebrow">Muestra de Vida Activa</p>
          <h2>Una muestra para valorar el material profesional.</h2>
          <p>Consulta una actividad de demostración con instrucciones, materiales y alternativas de participación. Las programaciones completas, fichas y orientaciones profesionales están reservadas a las colaboraciones con centros.</p>
          <a className="editorial-btn editorial-btn-primary" href="/residencias/muestra/">Consultar la actividad de muestra</a>
        </div>
        <aside className="res-note"><strong>Uso responsable</strong><p>La programación compartida aquí no sustituye la valoración individual, la planificación asistencial ni las competencias propias de cada disciplina.</p><a href="/residencias/vida-activa/" className="res-text-link">Conocer Vida Activa →</a></aside>
      </div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
  </main>
}
