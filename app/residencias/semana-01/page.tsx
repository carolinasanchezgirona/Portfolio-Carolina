import type { Metadata } from "next";
import Link from "next/link";
import {days,dayparts,guides,sessions} from "./data";
import PrintWeekButton from "./print-button";
import "./week.css";

export const metadata:Metadata={
 title:"Vida Activa · Semana 1 | Programa profesional para residencias",
 description:"Ejemplo completo de programación semanal para residencias y centros de día: 20 actividades, cinco guías profesionales, adaptaciones y fichas imprimibles.",
 alternates:{canonical:"/residencias/semana-01/"},
 openGraph:{title:"Vida Activa · Semana 1 | Dememòria",description:"20 propuestas, 5 guías profesionales y fichas originales para participantes.",url:"https://carolinasanchezgirona.com/residencias/semana-01/",type:"article"},
};

export default function Semana01(){
 return <main className="vaweek">
  <section className="vaweek-webhero vaweek-no-print">
   <div className="editorial-wrap">
    <nav aria-label="Ruta de navegación" className="res-breadcrumb"><Link href="/">Inicio</Link><span>/</span><Link href="/residencias/">Residencias</Link><span>/</span><Link href="/residencias/vida-activa/">Vida Activa</Link><span>/</span><span>Semana 1</span></nav>
    <p className="vaweek-kicker">Vida Activa · Dossier profesional / 01</p>
    <h1>Semana 01. Actividades con sentido, día a día.</h1>
    <p>Una edición completa para explorar: 20 propuestas, cinco guías detalladas y cinco fichas originales para participantes. Consulta cada apartado en la web o imprime el material cuando lo necesites.</p>
    <div className="vaweek-actions"><PrintWeekButton/><Link href="/residencias/semana-01/fichas/" className="vaweek-btn-alt">Ver fichas para participantes</Link></div>
    <p className="vaweek-hint">La versión web es imprimible y complementa los PDF editoriales originales. Los contenidos son propuestas orientativas sujetas a valoración y adaptación por el equipo del centro.</p>
   </div>
  </section>
  <nav className="vaweek-chapter-nav vaweek-no-print" aria-label="Índice del programa semanal">
   <div><span>GUÍA DE LECTURA</span><strong>Ve directamente a lo que necesitas.</strong></div>
   <div className="vaweek-chapter-links">
    <a href="#calendario-vida-activa">Calendario <span aria-hidden="true">↗</span></a>
    <a href="#actividades-principales">Guías profesionales <span aria-hidden="true">↗</span></a>
    <a href="#actividades-complementarias">Otras actividades <span aria-hidden="true">↗</span></a>
    <Link href="/residencias/semana-01/fichas/">Fichas imprimibles <span aria-hidden="true">↗</span></Link>
   </div>
  </nav>
  <article className="vaweek-document" aria-label="Programa profesional de actividades, Semana 1">
   <header className="vaweek-cover">
    <div className="vaweek-top"><span>DEMEmÒRIA</span><span>PROGRAMACIÓN PARA RESIDENCIAS · 2026</span></div>
    <p>COLECCIÓN PROFESIONAL / 01</p>
    <h2>Vida <em>Activa.</em></h2>
    <strong>Más vida en cada día.</strong>
    <p>Una semana para participar, crear y compartir.</p>
    <div className="vaweek-cover-foot"><span>20 propuestas · 5 guías detalladas · 5 fichas originales</span><span>SEMANA 01</span></div>
   </header>
   <section className="vaweek-part" id="presentacion-semana-1">
    <p className="vaweek-kicker">01 / Orientaciones</p><h2>Una semana pensada para elegir.</h2>
    <p>La programación es modular y no sustituye un plan asistencial ni una prescripción clínica individual. Las personas pueden participar, observar, realizar actividades alternativas o descansar. La elección es parte del programa.</p>
    <div className="vaweek-note vaweek-note-salmon"><strong>Para aplicar el material con rigor</strong><p>El equipo deberá considerar preferencias personales, capacidades funcionales y sensoriales, disponibilidad de apoyos, accesibilidad, seguridad, descanso y dotación profesional.</p></div>
    <div className="vaweek-three">
      <div><b>Alta autonomía</b><p>Debates, planificación abierta, comparaciones y proyectos exigentes sin simplificación innecesaria.</p></div>
      <div><b>Con apoyos</b><p>Consignas graduadas, materiales accesibles, claves visuales, menos distractores y respuesta multimodal.</p></div>
      <div><b>Individualizado</b><p>Objetos, imágenes, música y elecciones breves, sin imponer fichas ni recuerdos autobiográficos.</p></div>
    </div>
   </section>
   <section className="vaweek-part" id="calendario-vida-activa">
    <p className="vaweek-kicker">02 / Calendario</p><h2>La semana, de un vistazo.</h2><p>Veinte propuestas de lunes a viernes dentro de los horarios marco de 10:00 a 13:00 y de 15:00 a 18:00. Los descansos no son sesiones dirigidas.</p>
    <div className="vaweek-schedule">{days.map((day,i)=><article className="vaweek-day" key={day}>
       <div className="vaweek-day-name"><strong>{day}</strong><small>{String(i+1).padStart(2,"0")}</small></div>
       <div className="vaweek-day-items">{sessions.filter(s=>s.day===day).map(s=><p key={s.id}><b>{s.time}</b><span>{s.id} · {s.title}{s.featured?" ★":""}</span></p>)}</div>
    </article>)}</div>
    <p className="vaweek-footnote">★ Actividad desarrollada en una guía completa. Las actividades corporales A05 y A17 exigen coordinación y supervisión profesional según valoración.</p>
    <h3>Franjas de la jornada</h3>
    <table className="vaweek-table"><thead><tr><th scope="col">Hora</th><th scope="col">Organización orientativa</th></tr></thead><tbody>{dayparts.map(([hour,desc])=><tr key={hour}><th scope="row">{hour}</th><td>{desc}</td></tr>)}</tbody></table>
   </section>
   <section className="vaweek-part" id="guia-aplicacion">
    <p className="vaweek-kicker">03 / Aplicación responsable</p><h2>Preparar, adaptar y acompañar.</h2>
    <ul className="vaweek-checks"><li>Comprobar que la actividad responde a intereses reales y permite no participar.</li><li>Verificar legibilidad, contrastes, audición, movilidad, accesibilidad y tiempos de pausa.</li><li>Prever roles alternativos: elegir, observar, comentar, manipular o descansar.</li><li>Confirmar que existen profesionales suficientes y autorizados para las propuestas físicas.</li><li>Revisar alergias, riesgos de materiales, sobrecarga y protocolos del centro.</li><li>No difundir imágenes, relatos o datos personales sin autorización específica.</li></ul>
    <div className="vaweek-note"><b>Seguridad y criterio clínico</b><p>Los ejercicios motores requieren valoración y seguimiento del profesional competente. No se atribuyen beneficios terapéuticos a una sesión por el mero hecho de realizarla.</p></div>
   </section>
   <section className="vaweek-part" id="actividades-principales">
    <p className="vaweek-kicker">04 / Guías profesionales</p><h2>Cinco actividades desarrolladas.</h2><p>Procedimientos orientativos, materiales, adaptaciones y precauciones listos para facilitar el trabajo del equipo. Los tiempos son flexibles.</p>
    {guides.map((g,index)=><section className="vaweek-guide" key={g.id} id={"guia-"+g.id}>
      <div className="vaweek-guide-head"><span>{g.id}</span><div><p className="vaweek-kicker">Actividad principal {index+1} de 5</p><h3>{g.title}</h3><p>{g.domain}</p></div></div>
      <div className="vaweek-tags"><span>{g.duration}</span><span>{g.group}</span><span>Ficha {g.sheet}</span></div>
      <div className="vaweek-guide-cards"><div><h4>Finalidad</h4><p>{g.purpose}</p></div><div><h4>Materiales</h4><p>{g.materials}</p></div></div>
      <h4>Secuencia de facilitación</h4>
      <ol className="vaweek-procedure">{g.steps.map(([minutes,text],j)=><li key={j}><span>{String(j+1).padStart(2,"0")}</span><p><strong>{minutes}</strong> · {text}</p></li>)}</ol>
      <div className="vaweek-guide-end"><h4>Adaptar sin infantilizar</h4><p>{g.adapt}</p><h4>Observaciones y precauciones</h4><p>{g.watch}</p></div>
      <p className="vaweek-worksheet-link vaweek-no-print"><Link href={"/residencias/semana-01/fichas/#ficha-"+g.sheet}>Abrir ficha {g.sheet} →</Link></p>
    </section>)}
   </section>
   <section className="vaweek-part" id="actividades-complementarias">
    <p className="vaweek-kicker">05 / Cápsulas operativas</p><h2>Quince propuestas complementarias.</h2><p>Actividades breves de aplicación adaptable. Los códigos corresponden al calendario de la Semana 1.</p>
    <div className="vaweek-capsules">{sessions.filter(s=>!s.featured).map(s=><article className="vaweek-capsule" key={s.id}>
      <div><span>{s.id}</span><small>{s.day} · {s.time}</small></div><h3>{s.title}</h3><p className="vaweek-area">{s.area}</p><p><strong>Propuesta.</strong> {s.short}</p><p><strong>Apoyos y precauciones.</strong> {s.adapt}</p>
    </article>)}</div>
   </section>
   <section className="vaweek-part" id="soluciones">
    <p className="vaweek-kicker">06 / Orientaciones de respuesta</p><h2>Soluciones y margen de elección.</h2><p>Los ejercicios con respuesta abierta requieren valorar el razonamiento, la expresión de preferencias y la participación, sin utilizar estas fichas como pruebas psicométricas.</p>
    <dl className="vaweek-solutions"><dt>P01 · Salida cultural</dt><dd>Museo: 8 × 7 + 20 = 76 €. Concierto: 8 × 9 + 20 = 92 €. Ambos viables. Jardín: 36 minutos y exterior, no cumple. Centro cultural: 8 × 8 + 40 = 104 €, supera presupuesto. Regreso del museo: 11:46, sin pausas. Comprobar accesibilidad y transporte reales.</dd>
    <dt>P02 · El barrio</dt><dd>La plaza pasa de aparcamiento a espacio peatonal; el cine pasa a centro cívico. Mercado y estación mantienen su función. La valoración es abierta.</dd>
    <dt>P03 · Exposición</dt><dd>Son válidas las distribuciones que mantienen acceso y recorrido libres. En un espacio real verificar anchuras, giro, evacuación, iluminación y apoyo necesario.</dd>
    <dt>P04 · Mesa editorial</dt><dd>1 y 4: potencialmente verificables (V); 2: opinión (O); 3: ambiguo o insuficiente (C). Para comprobar 3 habría que conocer fuente, fecha, muestra y metodología.</dd>
    <dt>P05 · Próxima semana</dt><dd>Respuesta abierta. Revisar variedad, recursos, descansos, accesibilidad y opciones individuales. La votación grupal no anula la preferencia personal.</dd></dl>
   </section>
   <section className="vaweek-part" id="registro">
    <p className="vaweek-kicker">07 / Seguimiento</p><h2>Observar para adaptar, no para etiquetar.</h2><p>Modelo sin identificadores personales. La información clínica se registra únicamente en los sistemas autorizados del centro.</p>
    <div className="vaweek-record">{["Actividad, fecha y unidad","Profesional facilitador","Personas invitadas / que decidieron participar (totales)","Participación y modalidades observadas","Preferencias expresadas y alternativas utilizadas","Dificultades, apoyos y adaptaciones para próxima sesión"].map(t=><div key={t}><strong>{t}</strong><span/></div>)}</div>
   </section>
   <footer className="vaweek-part vaweek-final">
    <h2>Participar también es elegir.</h2><p>Vida Activa · Semana 01 es una muestra de programación profesional con actividades originales y adaptaciones orientativas. Su uso exige adecuación a las personas, recursos y protocolos del centro.</p>
    <p>Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga · Dememòria · © 2026</p>
    <div className="vaweek-actions vaweek-no-print"><Link href="/residencias/semana-01/fichas/" className="vaweek-btn-alt">Consultar las cinco fichas</Link><Link href="/residencias/#contacto-profesional" className="vaweek-btn-primary">Explorar colaboración piloto</Link></div>
   </footer>
  </article>
 </main>;
}
