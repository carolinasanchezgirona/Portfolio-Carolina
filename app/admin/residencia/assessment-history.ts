import type {Entry} from './model';
export const displayTimestamp=(value?:string)=>value&&!Number.isNaN(Date.parse(value))?new Date(value).toLocaleString('es-ES',{timeZone:'Europe/Madrid'}):'No registrada (registro anterior)';
export function stampEntry(entry:Entry,previous?:Entry,now=new Date().toISOString()):Entry{return {...entry,createdAt:previous?previous.createdAt||'':entry.createdAt||now,updatedAt:now};}
export function applicationOrder(a:Entry,b:Entry){return (a.date||'').localeCompare(b.date||'')||(a.createdAt||'').localeCompare(b.createdAt||'')||a.id.localeCompare(b.id);}
const clean=(s?:string)=>(s||'').trim().toLocaleLowerCase('es');
export type Metric={key:string;maximum:number;value:number;direction:'higher'|'lower'|'unknown';signature:string};
export function assessmentMetric(e:Entry):Metric|null{
 if(e.validity!=='Aplicado'||e.comparability==='No comparable'||!e.date||!e.version?.trim()||!e.language?.trim())return null;
 let key='score',maximum=Number(e.maximum),direction:Metric['direction']='unknown',extra:string[]=[];
 if(['MMSE','MEC'].includes(e.instrument)){direction='higher';if(e.instrument==='MMSE'){if(!e.attentionMethod)return null;extra=[e.attentionMethod];}}
 else if(e.instrument==='Pfeiffer'){key='errors';maximum=Number(e.items);direction='lower';extra=[e.adjustment||'Sin corrección registrada'];}
 else if(e.instrument==='GDS de Reisberg'){key='stage';maximum=7;direction='lower';}
 else if(e.instrument==='Yesavage')direction='lower';
 else if(e.instrument==='Fluencia verbal'){key='correct';maximum=0;direction='higher';if(!e.modality||!e.stimulus||!(Number(e.durationSeconds)>0))return null;extra=[e.modality,e.stimulus,e.durationSeconds];}
 else if(e.instrument==='Test del reloj'){if(!e.method||!e.modality||!e.requestedTime)return null;extra=[e.method,e.modality,e.requestedTime];}
 if(e.direction==='Más alto es más favorable')direction='higher';if(e.direction==='Más bajo es más favorable')direction='lower';
 const raw=e[key];if(raw===undefined||raw.trim()===''||!Number.isFinite(Number(raw))||Number(raw)<0)return null;
 const value=Number(raw);if(key!=='correct'&&(!Number.isFinite(maximum)||maximum<=0||value>maximum))return null;
 if(e.instrument==='GDS de Reisberg'&&(!Number.isInteger(value)||value<1))return null;
 return {key,maximum,value,direction,signature:JSON.stringify([e.instrument,clean(e.version),clean(e.language),key,maximum,direction,...extra.map(clean)])};
}
export function comparableSeries(records:Entry[],reference:Entry):Entry[]{const metric=assessmentMetric(reference);if(!metric)return [];return records.filter(e=>assessmentMetric(e)?.signature===metric.signature).sort(applicationOrder);}
export function comparisonFor(records:Entry[],current:Entry){const metric=assessmentMetric(current);if(!metric)return null;const series=comparableSeries(records,current),index=series.findIndex(e=>e.id===current.id);if(index<1)return null;const previous=series[index-1],first=series[0];return {previous,first,delta:metric.value-assessmentMetric(previous)!.value,baselineDelta:metric.value-assessmentMetric(first)!.value,metric};}
