import type {Entry,Kind,Resident} from './model';

export const behaviorFields=[
 ['antecedent','Antecedentes y contexto'],['duration','Duración del episodio'],
 ['frequency','Frecuencia observada'],['consequence','Respuesta del entorno y consecuencias'],
 ['hypothesis','Hipótesis de trabajo (pendiente de contrastar)'],
] as const;
export const goalReviewResults=['Sin valorar','Sin cambios observados','Avance observado','Dificultades observadas','Requiere reformulación'] as const;
export const activeGoal=(entry:Entry)=>!['Cerrado','Alcanzado','Reformulado'].includes(entry.state);
export function clinicalOrder(a:Entry,b:Entry){return (b.date||'').localeCompare(a.date||'')||(b.createdAt||'').localeCompare(a.createdAt||'')||b.id.localeCompare(a.id);}
export function goalFollowups(resident:Resident,goalId:string){return resident.data.followups.filter(e=>e.goalId===goalId).sort(clinicalOrder);}
export function goalLabel(resident:Resident,id:string){return resident.data.goals.find(e=>e.id===id)?.objective||'Objetivo vinculado no disponible';}
export function sourceOptions(resident:Resident):{value:string;label:string;kind:Kind;entry:Entry}[]{
 const kinds=['assessments','scales','followups','incidents'] as const;
 return kinds.flatMap(kind=>resident.data[kind].map(entry=>({value:kind+':'+entry.id,kind,entry,label:(entry.date||'Sin fecha')+' · '+({assessments:'Valoración',scales:'Prueba',followups:'Diario',incidents:'Incidencia'}[kind]||kind)+' · '+(entry.instrument||entry.conclusion||entry.observation||entry.description||'Registro').slice(0,140)}))).sort((a,b)=>clinicalOrder(a.entry,b.entry));
}
export function resolveSource(resident:Resident,ref:string){return sourceOptions(resident).find(s=>s.value===ref);}
export function workflowError(resident:Resident,kind:Kind,entry:Entry){
 if(kind==='followups'&&entry.goalId&&!resident.data.goals.some(g=>g.id===entry.goalId))return 'El objetivo vinculado ya no está disponible. Revisa la vinculación antes de guardar.';
 if(kind==='goals'&&entry.sourceRef&&!resolveSource(resident,entry.sourceRef))return 'El registro de origen ya no está disponible. Revisa la vinculación antes de guardar.';
 return '';
}
export function newGoalFollowup(goal:Entry,date:string):Entry{return {id:crypto.randomUUID(),date,type:'Individual',topics:JSON.stringify(['Evolución global']),countForMonthly:'true',goalId:goal.id,goalReview:'Sin valorar'};}
export function followupDetails(entry:Entry):[string,string][]{
 return [...(entry.behaviorRecord==='true'?behaviorFields.map(([key,label])=>[key,label] as [string,string]):[]),['goalReview','Valoración del objetivo'],['goalEvidence','Indicador observado / evidencia del resultado']];
}
