import type {Entry,Resident} from './model';
import {nextReview,today} from './model';
import {monthlyFollowups} from './followup-planning';
export default function ResidentSummary({resident:r}:{resident:Resident}){
 const latest=(entries:Entry[])=>[...entries].sort((a,b)=>(b.date||'').localeCompare(a.date||''))[0]?.date||'Sin registros';
 const plan=monthlyFollowups(r,today()),p=r.data.profile;
 return <aside className="res-summary" aria-label="Resumen del residente"><p><strong>Última valoración</strong>{latest(r.data.assessments)}<br/>Próxima revisión: {nextReview(r)||'Sin programar'}</p><p><strong>Seguimientos del mes</strong>{plan.completed}/2 · Último: {plan.last||'Sin registros'}<br/>Próximo: {plan.next}</p><p><strong>PIAI</strong>{p.piaiReviewPending==='true'?'Pendiente de revisión'+(p.piaiReviewDate?' · '+p.piaiReviewDate:' · Sin fecha asignada'):'Sin revisión marcada'}<br/>{r.data.goals.filter(e=>!['Cerrado','Alcanzado','Reformulado'].includes(e.state)).length} objetivos abiertos</p>{(p.communication||p.sensory||p.carePlan)&&<p><strong>Apoyos para la intervención</strong>{[p.communication,p.sensory,p.carePlan].filter(Boolean).join(' · ')}</p>}</aside>;
}
