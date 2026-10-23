import type {Entry,Kind,Resident} from './model';
import {nextReview,today} from './model';
import {monthlyFollowups} from './followup-planning';
import {activeGoal,clinicalOrder,goalFollowups} from './clinical-workflow';

export default function ResidentSummary({resident:r,onOpen,disabled=false}:{resident:Resident;onOpen?:(kind:Kind,entry?:Entry)=>void;disabled?:boolean}){
 const latest=(entries:Entry[])=>[...entries].sort(clinicalOrder)[0]?.date||'Sin registros';
 const date=today(),plan=monthlyFollowups(r,date),p=r.data.profile;
 const goals=r.data.goals.filter(activeGoal).sort((a,b)=>(a.next||'9999').localeCompare(b.next||'9999'));
 const recent=[...r.data.followups].sort(clinicalOrder).slice(0,3);
 return <section className="res-clinical-summary" aria-label="Resumen clínico del residente">
 <h3>Resumen clínico</h3>
 <aside className="res-summary" aria-label="Resumen del residente"><p><strong>Última valoración</strong>{latest(r.data.assessments)}<br/>Próxima revisión: {nextReview(r)||'Sin programar'}</p><p><strong>Seguimientos del mes</strong>{plan.completed}/2 · Último: {plan.last||'Sin registros'}<br/>Próximo: {plan.next}</p><p><strong>PIAI</strong>{p.piaiReviewPending==='true'?'Pendiente de revisión'+(p.piaiReviewDate?' · '+p.piaiReviewDate:' · Sin fecha asignada'):'Sin revisión marcada'}<br/>{goals.length} objetivos abiertos</p>{(p.communication||p.sensory||p.carePlan)&&<p><strong>Apoyos para la intervención</strong>{[p.communication,p.sensory,p.carePlan].filter(Boolean).join(' · ')}</p>}</aside>
 <details className="res-profile-group" open><summary>Situación basal, objetivos y observaciones recientes</summary><div className="res-clinical-cards">
 <article><h4>Situación habitual de referencia</h4><p>{p.clinicalBaseline||'Pendiente de documentar la situación basal.'}</p><p className="res-help">Fecha de referencia: {p.baselineDate||'Sin indicar'} · Fuente: {p.baselineSource||'Sin indicar'}</p>{p.premorbidPersonality&&<p><strong>Personalidad premórbida: </strong>{p.premorbidPersonality}</p>}</article>
 <article><h4>Objetivos PIAI activos</h4>{goals.length?<ul>{goals.slice(0,3).map(g=>{const last=goalFollowups(r,g.id)[0];return <li key={g.id}><p><strong>{g.objective}</strong><br/>{g.state||'Sin estado'} · Revisión: {g.next||'Sin programar'}{g.next&&g.next<date?' · Fecha vencida':''}</p><p>Último seguimiento vinculado: {last?last.date+' · '+(last.goalReview||'Sin valoración del objetivo'):'Sin registros'}</p>{onOpen&&<button type="button" className="res-no-print" disabled={disabled} onClick={()=>onOpen('goals',g)}>Abrir objetivo</button>}</li>;})}</ul>:<p>No hay objetivos activos registrados.</p>}{goals.length>3&&<p>{goals.length-3} objetivos más en PIAI.</p>}</article>
 <article><h4>Observaciones recientes</h4>{recent.length?<ul>{recent.map(e=><li key={e.id}><p><strong>{e.date||'Sin fecha'}{e.behaviorRecord==='true'?' · Registro conductual':''}</strong></p><p>{e.observation}</p><p className="res-help">Fuente: {e.source||'Sin indicar'}{e.professional?' · Profesional: '+e.professional:''}</p>{onOpen&&<button type="button" className="res-no-print" disabled={disabled} onClick={()=>onOpen('followups',e)}>Abrir seguimiento</button>}</li>)}</ul>:<p>No hay observaciones registradas.</p>}<p className="res-help">Observaciones registradas, pendientes de interpretación clínica profesional.</p></article>
 </div></details></section>;
}
