import type { Metadata } from "next";
import PrintSampleButton from "./print-button";
import ItineraryMap from "./itinerary-map";

const url = "https://carolinasanchezgirona.com/residencias/muestra/";

export const metadata: Metadata = {
  title: "Ejemplo de programación semanal para residencia de mayores",
  description: "Consulta e imprime un calendario de actividades para residencias de lunes a viernes, con dos talleres desarrollados y adaptaciones para distintos perfiles.",
  alternates: { canonical: "/residencias/muestra/" },
  openGraph: {
    title: "Semana de ejemplo de Vida Activa | Dememoria",
    description: "Horario semanal y actividades detalladas para equipos técnicos de residencias y centros de día.",
    url,
    type: "article",
  },
};

const days=[
  {day:"Lunes",morning:["Movimiento adaptado con el equipo responsable","Planificación de una salida cultural"],afternoon:["Taller de acuarela o collage","Club de lectura y conversación"]},
  {day:"Martes",morning:["Paseo o circuito funcional adaptado","Archivo de historias del barrio"],afternoon:["Música elegida y conversación","Juegos de estrategia, con apoyos opcionales"]},
  {day:"Miércoles",morning:["Movilidad y autonomía cotidiana","Lenguaje y razonamiento funcional"],afternoon:["Proyecto de jardinería accesible","Cinefórum con libre elección"]},
  {day:"Jueves",morning:["Actividad física multicomponente adaptada","Orientación y memoria aplicada a rutinas"],afternoon:["Taller de arte y diseño","Conexión con la comunidad o familias"]},
  {day:"Viernes",morning:["Música y movimiento adaptado","Cultura, prensa y debate"],afternoon:["Proyecto creativo colectivo","Ocio elegido y valoración de la semana"]},
];

const dayparts = [
  ["10:00–10:20","Acogida, orientación optativa y elección de actividad"],
  ["10:20–11:10","Primera propuesta de la mañana"],
  ["11:10–11:40","Descanso, hidratación y necesidades personales"],
  ["11:40–12:30","Segunda propuesta de la mañana"],
  ["12:30–13:00","Actividad libre, conversación o participación cotidiana"],
  ["15:00–15:30","Acogida, descanso y preparación"],
  ["15:30–16:20","Primera propuesta de la tarde"],
  ["16:20–16:40","Pausa y merienda, si corresponde"],
  ["16:40–17:30","Segunda propuesta de la tarde"],
  ["17:30–18:00","Cierre flexible y actividad elegida"],
];

export default function MuestraVidaActivaPage(){
  const schema={
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    itemListElement:[
      {"@type":"ListItem",position:1,name:"Inicio",item:"https://carolinasanchezgirona.com/"},
      {"@type":"ListItem",position:2,name:"Residencias",item:"https://carolinasanchezgirona.com/residencias/"},
      {"@type":"ListItem",position:3,name:"Muestra semanal",item:url}
    ]
  };
  return <main className="res-page res-sample">
    <section className="res-hero res-hero-compact res-no-print">
      <div className="editorial-wrap">
        <nav className="res-breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><a href="/residencias/">Residencias</a><span>/</span><span>Muestra semanal</span></nav>
        <p className="res-eyebrow">Vida Activa · Material de demostración</p>
        <h1>Una semana de actividades, con las instrucciones para llevarlas a cabo.</h1>
        <p className="res-lead">Ejemplo educativo para equipos profesionales. Incluye el marco horario y tres actividades desarrolladas. Puedes imprimir estas páginas o guardarlas como PDF desde el navegador.</p>
        <PrintSampleButton />
        <p className="res-small">En el diálogo de impresión elige «Guardar como PDF». El contenido está preparado para impresión A4.</p>\n        <div className="res-note" style={{marginTop:22}}><strong>Nueva edición · Vida Activa Semana 1</strong><p>Hemos preparado una versión completa, con 20 actividades, cinco guías, soluciones y cinco fichas de participantes en un espacio propio de la web.</p><a className="editorial-btn editorial-btn-primary" href="/residencias/semana-01/">Abrir el programa completo</a></div>
      </div>
    </section>

    <div className="res-sample-document">
      <header className="res-doc-header">
        <div><span className="res-doc-brand">DEMEmORIA · VIDA ACTIVA</span><h2>Programación semanal de muestra</h2><p>Residencias y centros de día · Semana orientativa, no prescripción individual.</p></div>
        <div className="res-doc-edition">MUESTRA<br/>01 / 2026</div>
      </header>

      <section className="res-doc-section">
        <h3>1. Organización de la jornada</h3>
        <p>El marco horario es de 10 a 13 h y de 15 a 18 h. Incluye pausas, propuestas simultáneas y actividad libre. Nadie tiene por qué participar en todos los bloques.</p>
        <div className="res-table-wrap">
          <table className="res-time-table">
            <thead><tr><th scope="col">Hora</th><th scope="col">Franja orientativa</th></tr></thead>
            <tbody>{dayparts.map(([time,label])=><tr key={time}><th scope="row">{time}</th><td>{label}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="res-doc-section">
        <h3>2. Propuestas de lunes a viernes</h3>
        <p>Actividades para programar por unidades o subgrupos, atendiendo a dotación profesional, preferencias, seguridad y accesibilidad.</p>
        <div className="res-days">
          {days.map(({day,morning,afternoon})=><article className="res-day" key={day}>
            <h4>{day}</h4>
            <div><span>MAÑANA</span><p>10:20 · {morning[0]}</p><p>11:40 · {morning[1]}</p></div>
            <div><span>TARDE</span><p>15:30 · {afternoon[0]}</p><p>16:40 · {afternoon[1]}</p></div>
          </article>)}
        </div>
      </section>

      <section className="res-doc-section res-break-before">
        <p className="res-doc-kicker">FICHA 01 · COGNICIÓN APLICADA Y PARTICIPACIÓN</p>
        <h3>3. Organizar una salida cultural</h3>
        <div className="res-chip-row"><span>45–50 minutos</span><span>4–8 participantes orientativos</span><span>Decisión conjunta</span></div>
        <p><strong>Finalidad:</strong> abordar una elección realista y adulta mediante comprensión de condiciones, comparación de opciones, planificación y argumentación. La finalidad principal es favorecer la participación en decisiones; no se infiere mejoría neuropsicológica de una sesión aislada.</p>
        <p><strong>Materiales:</strong> hoja de opciones, bolígrafo, calendario y soporte visual ampliado cuando sea necesario. El supuesto es ficticio y puede sustituirse por opciones culturales reales del entorno.</p>
        <ol className="res-procedure">
          <li>Presentar un pequeño grupo que desea escoger una salida cultural. Preguntar qué valora más cada participante.</li>
          <li>Leer las condiciones y comparar las tres propuestas. Invitar a comprobar presupuesto, duración, desplazamiento y accesibilidad.</li>
          <li>Argumentar qué alternativa encaja mejor. No existe una única elección correcta si se respetan las condiciones y se justifican las prioridades.</li>
          <li>Cerrar con una propuesta de horario y reparto de tareas, dejando constancia de las preferencias del grupo.</li>
        </ol>
        <div className="res-sheet">
          <p className="res-sheet-label">MATERIAL PARA PARTICIPANTES · DECIDIMOS UNA SALIDA</p>
          <p><strong>Situación:</strong> ocho personas desean realizar una salida cultural. Se dispone de un máximo de 65 € para entradas, se prevé lluvia y el desplazamiento no debe superar 30 minutos por trayecto. El grupo necesita disponer de lugares para sentarse.</p>
          <table className="res-options-table">
            <thead><tr><th scope="col">Actividad</th><th scope="col">Entrada/persona</th><th scope="col">Trayecto</th><th scope="col">Características</th></tr></thead>
            <tbody>
              <tr><th scope="row">Museo local</th><td>6 €</td><td>20 min</td><td>Interior, bancos; visita de 80 min</td></tr>
              <tr><th scope="row">Jardín botánico</th><td>4 €</td><td>35 min</td><td>Exterior, asientos limitados; 70 min</td></tr>
              <tr><th scope="row">Auditorio</th><td>8 €</td><td>25 min</td><td>Interior, asientos; actividad de 60 min</td></tr>
            </tbody>
          </table>
          <p className="res-task"><strong>1.</strong> ¿Qué opciones cumplen todas las condiciones indicadas? Justifica por qué.</p><div className="res-answer-lines" aria-hidden="true"><span/><span/></div>
          <p className="res-task"><strong>2.</strong> Calcula el gasto total de entradas para ocho personas en las opciones viables.</p><div className="res-answer-lines" aria-hidden="true"><span/><span/></div>
          <p className="res-task"><strong>3.</strong> Elegid una opción. ¿Qué ventajas tiene y qué dudas habría que resolver antes de reservar?</p><div className="res-answer-lines" aria-hidden="true"><span/><span/><span/></div>
          <p className="res-task"><strong>4.</strong> Si la salida empieza a las 10:00, ¿a qué hora se regresaría aproximadamente, considerando trayecto de ida, actividad y trayecto de vuelta?</p><div className="res-answer-lines" aria-hidden="true"><span/><span/></div>
        </div>
        <div className="res-adapt-grid">
          <div><strong>Con autonomía</strong><p>Incluir elección por criterios ponderados, horarios y posibles imprevistos. Mantener complejidad y debate.</p></div>
          <div><strong>Con apoyos</strong><p>Comparar dos opciones a la vez, usar pictogramas de interior/exterior y realizar los cálculos conjuntamente.</p></div>
          <div><strong>Alta dependencia</strong><p>No imponer la hoja. Presentar fotografías o recuerdos de espacios culturales y facilitar expresión de preferencias.</p></div>
        </div>
        <p className="res-facilitator-note"><strong>Para el equipo:</strong> museo (48 €) y auditorio (64 €) cumplen presupuesto, trayecto y accesibilidad descrita; el jardín no cumple el límite de trayecto y presenta barreras adicionales. Verificar siempre accesibilidad y transporte reales antes de una salida.</p>
      </section>

      <section className="res-doc-section res-break-before">
        <p className="res-doc-kicker">FICHA 02 · IDENTIDAD, CULTURA Y PROYECTO COLECTIVO</p>
        <h3>4. Archivo de historias del barrio</h3>
        <div className="res-chip-row"><span>50 minutos</span><span>4–6 personas orientativas</span><span>Proyecto con continuidad</span></div>
        <p><strong>Finalidad:</strong> favorecer el intercambio de experiencias y el sentido de pertenencia mediante un producto colectivo, sin convertir la memoria autobiográfica en un examen de recuerdos.</p>
        <p><strong>Preparación:</strong> reunir dos o tres imágenes históricas de calles, mercados o comercios locales con derechos de uso apropiados. Si hay material personal, solicitar permiso antes de compartirlo.</p>
        <ol className="res-procedure">
          <li>Invitar a elegir una fotografía y describir qué elementos llaman la atención.</li>
          <li>Abrir una conversación voluntaria sobre cómo eran los espacios públicos, trabajos y costumbres. No corregir recuerdos personales como si fueran pruebas.</li>
          <li>Proponer un título para cada imagen y una breve cartela colectiva. También se puede dibujar, escoger colores o seleccionar música de la época.</li>
          <li>Preparar una pequeña exposición interna. Cualquier difusión de fotografías o testimonios identificables requiere las autorizaciones pertinentes.</li>
        </ol>
        <div className="res-sheet res-story-sheet">
          <p className="res-sheet-label">MATERIAL PARA EL GRUPO · CARTELA DE LA EXPOSICIÓN</p>
          <div className="res-story-placeholder" role="img" aria-label="Espacio para colocar una fotografía del barrio con autorización">Espacio para fotografía elegida por el grupo</div>
          <div className="res-story-field"><strong>Nombre del lugar o tema</strong><span/></div>
          <div className="res-story-field"><strong>¿Qué queremos contar sobre este lugar?</strong><span/><span/></div>
          <div className="res-story-field"><strong>Título elegido para la exposición</strong><span/></div>
        </div>
        <div className="res-adapt-grid">
          <div><strong>Con autonomía</strong><p>Investigar cambios urbanos, comparar épocas y redactar relatos para una exposición comunitaria.</p></div>
          <div><strong>Con apoyos</strong><p>Ofrecer dos fotografías, preguntas abiertas breves y apoyo verbal o escrito para construir la cartela.</p></div>
          <div><strong>Alta dependencia</strong><p>Exploración visual y afectiva breve, música vinculada al entorno y comunicación verbal o no verbal, respetando el cansancio.</p></div>
        </div>
        <p className="res-facilitator-note"><strong>Precaución:</strong> no exigir recuerdos, no interpretar silencios como fallos y detener o redirigir la propuesta si aparecen malestar o emociones difíciles.</p>
      </section>

      <section className="res-doc-section res-break-before">
        <p className="res-doc-kicker">FICHA 03 · PLANIFICACIÓN, ORIENTACIÓN ESPACIAL Y TOMA DE DECISIONES</p>
        <h3>5. Diseñamos una ruta por el barrio</h3>
        <div className="res-chip-row"><span>40–50 minutos</span><span>4–6 participantes orientativos</span><span>Mapa visual original</span></div>
        <p><strong>Finalidad:</strong> favorecer el razonamiento espacial aplicado, la búsqueda de alternativas y la planificación de una secuencia funcional. Se plantea como tarea de participación y estimulación, no como prueba estandarizada ni medida de navegación real.</p>
        <p><strong>Materiales:</strong> plano impreso en A4 con buen contraste, rotuladores de colores y espacio para anotar un recorrido. Se puede ampliar a A3 para personas con necesidades visuales.</p>
        <ol className="res-procedure">
          <li>Presentar el barrio ficticio y señalar el centro de día, la farmacia y la biblioteca. Confirmar comprensión de la leyenda.</li>
          <li>Proponer una salida: primero recoger un encargo en la farmacia y después llegar a la biblioteca, evitando el tramo cortado por obras.</li>
          <li>Invitar a dibujar un itinerario sobre el plano o explicarlo verbalmente. Comparar distintas rutas sin reducir la tarea a una sola respuesta.</li>
          <li>Conversar sobre lo que habría que comprobar antes de una salida real: distancias, accesibilidad, descanso, tiempo, compañía y preferencias.</li>
        </ol>
        <div className="res-sheet res-map-sheet">
          <p className="res-sheet-label">MATERIAL PARA PARTICIPANTES · PLANIFICAMOS UNA SALIDA</p>
          <p><strong>Situación:</strong> salimos del centro de día. Tenemos que pasar por la farmacia y terminar en la biblioteca. Una calle está cerrada por obras. Elige un recorrido posible usando las vías abiertas.</p>
          <ItineraryMap />
          <p className="res-task"><strong>1.</strong> Marca sobre el plano una ruta que pase por la farmacia y termine en la biblioteca. Puedes usar un lápiz o describirla en voz alta.</p>
          <div className="res-answer-lines" aria-hidden="true"><span/><span/></div>
          <p className="res-task"><strong>2.</strong> ¿Qué calle no podemos atravesar? ¿Cómo lo sabemos?</p>
          <div className="res-answer-lines" aria-hidden="true"><span/><span/></div>
          <p className="res-task"><strong>3.</strong> Si además alguien quiere pasar por la plaza, ¿habría que cambiar el trayecto? Explica una alternativa.</p>
          <div className="res-answer-lines" aria-hidden="true"><span/><span/><span/></div>
          <p className="res-task"><strong>4.</strong> Antes de salir con un grupo real, ¿qué datos necesitaríamos comprobar para que la actividad fuese viable y segura?</p>
          <div className="res-answer-lines" aria-hidden="true"><span/><span/><span/></div>
        </div>
        <div className="res-adapt-grid">
          <div><strong>Con autonomía</strong><p>Comparar recorridos, justificar elecciones y proponer cómo coordinar a un pequeño grupo.</p></div>
          <div><strong>Con apoyos</strong><p>Presentar únicamente tres lugares, usar flechas de color y dividir el recorrido en dos pasos.</p></div>
          <div><strong>Alta dependencia</strong><p>Explorar el plano o imágenes significativas y facilitar decisiones sencillas sin exigir trazado ni respuesta escrita.</p></div>
        </div>
        <p className="res-facilitator-note"><strong>Orientación para el equipo:</strong> una ruta posible consiste en bajar desde el centro de día hasta la cafetería, continuar hacia la farmacia, seguir por la calle inferior hacia la izquierda y después subir hasta la biblioteca. La plaza se puede incorporar subiendo desde otra intersección sin cruzar el tramo en obras. Hay más de un itinerario válido.</p>
      </section>

      <section className="res-doc-section res-final-doc">
        <h3>6. Registro mínimo tras la actividad</h3>
        <div className="res-register">
          <div><strong>Actividad / fecha</strong><span/></div>
          <div><strong>Personas que eligieron participar</strong><span/></div>
          <div><strong>Intereses y respuestas observadas</strong><span/><span/></div>
          <div><strong>Adaptaciones útiles para la próxima ocasión</strong><span/><span/></div>
        </div>
        <p>Registro orientativo, sin identificadores personales. La información clínica debe permanecer en los sistemas autorizados del centro y con los controles correspondientes.</p>
        <p className="res-doc-fineprint">Muestra educativa elaborada por Dememoria · Carolina Sánchez Girona, Psicóloga General Sanitaria y Neuropsicóloga (COPC 24892). No sustituye valoración individual, intervención sanitaria ni la planificación asistencial del equipo. © 2026 Carolina Sánchez Girona.</p>
      </section>
    </div>
    <section className="res-section res-no-print">
      <div className="editorial-wrap res-split">
        <div><p className="res-eyebrow">¿Te resultaría útil en tu centro?</p><h2>Esta es una muestra, no el catálogo completo.</h2><p>La propuesta Vida Activa está en fase de desarrollo. Podemos valorar un piloto adaptado a las necesidades y recursos de cada residencia.</p></div>
        <div className="res-actions res-cta-stack"><a className="editorial-btn editorial-btn-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Muestra%20Vida%20Activa%20-%20Consulta">Solicitar información</a><a className="editorial-btn editorial-btn-secondary" href="/residencias/vida-activa/">Ver el programa</a></div>
      </div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
  </main>
}
