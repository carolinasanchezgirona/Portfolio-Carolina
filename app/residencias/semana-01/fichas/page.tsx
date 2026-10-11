import type { Metadata } from "next";
import Link from "next/link";
import PrintWeekButton from "../print-button";
import "../week.css";
export const metadata:Metadata={
  title:"Vida Activa · Semana 1 | Cinco fichas para participantes",
  description:"Cinco fichas accesibles e imprimibles para las actividades de la Semana 1 de Vida Activa: decisiones, cultura, espacio, lenguaje y participación.",
  alternates:{canonical:"/residencias/semana-01/fichas/"}
};
const questions1=["¿Qué opciones cumplen el presupuesto, el trayecto y las otras condiciones? Razona la elección.","Calcula el coste total del museo y del concierto para ocho personas.","Si el grupo va al museo, sale a las 10:00 y la visita dura 70 minutos, ¿cuándo regresará aproximadamente?","¿Qué dato de accesibilidad o logística comprobarías antes de reservar?"];
const questions2=["Identifica dos cambios entre «antes» y «ahora».","¿Qué dos espacios permanecen con la misma función?","Elige un cambio. ¿Qué ventajas o inconvenientes puede tener para el barrio?","Proponed un título para una pequeña exposición sobre el barrio."];
const cityBefore=[["Mercado","Plaza / aparcamiento"],["Calle Mayor",""],["Cine","Estación de tren"],["Calle del Mercado",""]];
const cityAfter=[["Mercado","Plaza peatonal"],["Calle Mayor",""],["Centro cívico","Estación de tren"],["Calle del Mercado",""]];
function Lines({count=2}:{count?:number}){return <div className="vaweek-answer-lines" aria-hidden="true">{Array.from({length:count},(_,i)=><span key={i}/>)}</div>}
function Question({n,text,lines=2}:{n:number;text:string;lines?:number}){return <div className="vaweek-question"><p><strong>{n}.</strong> {text}</p><Lines count={lines}/></div>}
function Sheet({code,title,subtitle,children}:{code:string;title:string;subtitle:string;children:React.ReactNode}){return <section className="vaweek-worksheet" id={"ficha-"+code}><header><span>VIDA ACTIVA · MIS ACTIVIDADES</span><span>SEMANA 01 / {code}</span></header><p className="vaweek-kicker">MATERIAL PARA PARTICIPANTES</p><h2>{title}</h2><p className="vaweek-worksheet-lead">{subtitle}</p>{children}<footer>VIDA ACTIVA · DEMEMÒRIA <span>{code} / 05</span></footer></section>}
export default function FichasSemana01(){return <main className="vaweek vaweek-worksheets">
 <section className="vaweek-webhero vaweek-no-print"><div className="editorial-wrap"><nav className="res-breadcrumb" aria-label="Ruta de navegación"><Link href="/residencias/semana-01/">← Programa de Semana 1</Link></nav><p className="vaweek-kicker">Vida Activa · Colección de participantes</p><h1>Cinco fichas para participar.</h1><p>Documentos de actividad para imprimir o guardar. Los enunciados están separados de las guías profesionales, y cada ficha comienza en una página nueva al imprimir.</p><div className="vaweek-actions"><PrintWeekButton label="Imprimir fichas / guardar PDF"/><Link href="/residencias/semana-01/" className="vaweek-btn-alt">Volver al programa</Link></div><p className="vaweek-hint">El profesional determinará qué hoja o alternativa de participación es adecuada. No debe interpretarse el resultado como una prueba diagnóstica.</p></div></section>
 <div className="vaweek-worksheet-stack">
 <Sheet code="P01" title="Decidimos una salida cultural" subtitle="Ocho personas quieren escoger una salida. Presupuesto máximo: 100 € para entradas y minibús. Se prevé lluvia. El trayecto de ida no puede superar los 30 minutos y debe haber asientos.">
  <p className="vaweek-sheet-info">El minibús tiene un precio fijo por salida. Se suma una sola vez al coste de las ocho entradas.</p>
  <table className="vaweek-table"><thead><tr><th scope="col">Actividad</th><th scope="col">Entrada</th><th scope="col">Minibús</th><th scope="col">Trayecto</th><th scope="col">Espacio</th></tr></thead><tbody>{[["Museo","7 €","20 €","18 min","Interior / bancos"],["Concierto","9 €","20 €","28 min","Interior / asientos"],["Jardín","5 €","20 €","36 min","Exterior / pocos bancos"],["Centro cultural","8 €","40 €","22 min","Interior / asientos"]].map(row=><tr key={row[0]}>{row.map((v,i)=>i===0?<th scope="row" key={i}>{v}</th>:<td key={i}>{v}</td>)}</tr>)}</tbody></table>
  {questions1.map((t,i)=><Question key={i} n={i+1} text={t} lines={2}/>)}
 </Sheet>
 <Sheet code="P02" title="Un barrio, dos momentos" subtitle="Estos esquemas son ficticios. Observa qué cambia, qué permanece y qué usos te parecen más útiles.">
   <div className="vaweek-maps">{[["ANTES",cityBefore],["AHORA",cityAfter]].map(([label,rows])=><div className="vaweek-map" key={String(label)}><strong>{String(label)}</strong>{(rows as string[][]).map((row,i)=><div className={"vaweek-map-row"+(i===1||i===3?" vaweek-map-street":"")} key={i}><span>{row[0]}</span><span>{row[1]}</span></div>)}</div>)}</div>
   {questions2.map((t,i)=><Question key={i} n={i+1} text={t} lines={2}/>)}
 </Sheet>
 <Sheet code="P03" title="Diseñamos una exposición" subtitle="La sala del dibujo tiene una puerta, dos ventanas y un pilar. Coloca dos paneles (P) y dos asientos (S) sin bloquear el paso.">
  <svg viewBox="0 0 600 290" role="img" aria-label="Plano rectangular de sala con puerta en esquina inferior izquierda, dos ventanas en parte superior derecha y pilar en zona central" className="vaweek-room-map"><rect x="20" y="20" width="560" height="250" rx="3" fill="#fffdfa" stroke="#273b5e" strokeWidth="4"/><rect x="70" y="263" width="100" height="12" fill="#fffdfa"/><path d="M70 270v-91a91 91 0 0191 91" stroke="#a85d54" strokeWidth="3" fill="none" strokeDasharray="6 6"/><text x="75" y="250" fontSize="18" fill="#273b5e">PUERTA</text><rect x="430" y="14" width="55" height="11" fill="#b9d9f7"/><rect x="505" y="14" width="55" height="11" fill="#b9d9f7"/><text x="428" y="43" fontSize="13">VENTANAS</text><rect x="270" y="112" width="56" height="55" fill="#f1cba5" stroke="#273b5e" strokeWidth="2"/><text x="276" y="145" fontSize="14">PILAR</text></svg>
  <p className="vaweek-sheet-info">P = panel · S = asiento · Usa flechas para mostrar el itinerario. En una sala real la accesibilidad requiere medidas y revisión técnica.</p>
  <Question n={1} text="¿Dónde colocarías los paneles y asientos para favorecer la conversación y el paso?" lines={3}/>
  <Question n={2} text="¿Qué comprobarías antes de montar la exposición en una sala real?" lines={3}/>
 </Sheet>
 <Sheet code="P04" title="Mesa editorial: cuatro titulares" subtitle="Todas las frases son inventadas. Marca V (dato verificable), O (opinión) o C (mensaje ambiguo que necesita contexto). Que algo sea verificable no significa que sea verdadero.">
  {[ "El centro abrirá el taller los jueves a las 17:00.", "La nueva plaza es, sin duda, la más bonita de la ciudad.", "El 90 % de los vecinos prefiere el cambio.", "Se instalaron cuatro bancos nuevos en el parque."].map((t,i)=><div className="vaweek-headline" key={i}><span>{i+1}</span><div><p>{t}</p><strong>V ☐ &nbsp;&nbsp;&nbsp; O ☐ &nbsp;&nbsp;&nbsp; C ☐</strong></div></div>)}
  <Question n={1} text="Reescribe el titular 2 dejando claro que es una opinión." lines={2}/>
  <Question n={2} text="¿Qué dos preguntas harías antes de dar por válido el titular 3?" lines={3}/>
 </Sheet>
 <Sheet code="P05" title="Elegimos la próxima semana" subtitle="Puedes elegir, proponer otra actividad o no votar. El objetivo es diseñar cuatro franjas variadas; no existe una única solución correcta.">
  <div className="vaweek-choice-grid">{[["A","Cinefórum","Cultura y debate","Sala y proyector"],["B","Taller de collage","Creatividad","Papel y materiales"],["C","Club de lectura","Lenguaje y vínculo","Texto accesible"],["D","Paseo coordinado","Movimiento","Equipo responsable"],["E","Música elegida","Disfrute","Volumen cómodo"],["F","Proyecto del barrio","Cultura y comunidad","Fotos autorizadas"]].map(([code,title,area,needs])=><div key={code}><b>{code}</b><strong>{title}</strong><span>{area}</span><small>{needs}</small></div>)}</div>
  <Question n={1} text="Elige cuatro actividades que combinen al menos dos ámbitos diferentes. Puedes proponer otras." lines={2}/>
  <Question n={2} text="¿Cuál sería tu preferencia personal, aunque otras personas elijan algo distinto?" lines={2}/>
  <Question n={3} text="¿Qué apoyos, espacios o profesionales habría que prever?" lines={2}/>
  <Question n={4} text="¿Qué opción ofrecerías a alguien que prefiere descansar o no incorporarse al grupo?" lines={2}/>
 </Sheet>
 </div>
 </main>}
