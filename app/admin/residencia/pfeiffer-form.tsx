'use client';
import type {Entry} from './model';
export const pfeifferQuestions=[
'¿Cuál es la fecha de hoy? (día, mes y año)',
'¿Qué día de la semana es?',
'¿En qué lugar estamos?',
'¿Cuál es su número de teléfono? Si no tiene, ¿cuál es su dirección completa?',
'¿Cuántos años tiene?',
'¿Dónde nació?',
'¿Cuál es el nombre del presidente?',
'¿Cuál es el nombre del presidente anterior?',
'¿Cuál es el nombre de soltera de su madre?',
'Reste de tres en tres desde 29'
];
export function scorePfeiffer(entry:Entry):Entry{
 const values=pfeifferQuestions.map((_,i)=>entry['pf_item_'+i]||'');
 const answered=values.filter(v=>v==='correct'||v==='error'||v==='na').length;
 const errors=values.filter(v=>v==='error').length;
 const complete=answered===10&&values.every(v=>v!=='na');
 const education=entry.pfeifferEducation||'';
 const adjusted=complete?Math.max(0,Math.min(10,errors+(education==='high'?1:education==='low'?-1:0))):null;
 const category=adjusted===null?'':adjusted<=2?'Sin alteración en el cribado':adjusted<=4?'Dificultades leves en el cribado':adjusted<=7?'Dificultades moderadas en el cribado':'Dificultades marcadas en el cribado';
 return {...entry,version:'SPMSQ · versión facilitada por la profesional',errors:String(errors),items:String(answered),validity:complete?'Aplicado':'Incompleto',score:complete?String(errors):'',maximum:'10',direction:'Más bajo es más favorable',pfeifferAdjusted:adjusted===null?'':String(adjusted),pfeifferCategory:category,adjustment:education==='low'?'Ajuste orientativo: admitir un error adicional':education==='high'?'Ajuste orientativo: admitir un error menos':'Sin ajuste por escolaridad'};
}
export default function PfeifferForm({entry,onChange}:{entry:Entry;onChange:(value:Entry)=>void}){
 const set=(key:string,v:string)=>onChange(scorePfeiffer({...entry,[key]:v}));
 const completed=pfeifferQuestions.filter((_,i)=>['correct','error','na'].includes(entry['pf_item_'+i]||'')).length;
 return <section className="res-pfeiffer"><div className="res-score-summary"><strong>Pfeiffer · {completed}/10 preguntas</strong><span>{entry.validity==='Aplicado'?entry.errors+' errores · '+entry.pfeifferCategory:'Pendiente de completar'}</span></div><p className="res-help">1: fecha completa. 3: cualquier descripción correcta del lugar. 10: cualquier error en la serie desde 29 invalida ese ítem. Registra la respuesta literal cuando resulte relevante.</p><div className="res-pfeiffer-questions">{pfeifferQuestions.map((q,i)=><div key={i} className="res-pfeiffer-row"><strong>{i+1}. {q}</strong><input aria-label={'Respuesta pregunta '+(i+1)} placeholder="Respuesta / observación" value={entry['pf_response_'+i]||''} onChange={e=>set('pf_response_'+i,e.target.value)}/><select aria-label={'Corrección pregunta '+(i+1)} value={entry['pf_item_'+i]||''} onChange={e=>set('pf_item_'+i,e.target.value)}><option value="">Pendiente</option><option value="correct">Correcta</option><option value="error">Error</option><option value="na">No evaluable</option></select></div>)}</div><label>Nivel educativo para corrección<select value={entry.pfeifferEducation||''} onChange={e=>set('pfeifferEducation',e.target.value)}><option value="">Sin determinar</option><option value="low">Estudios elementales o escolaridad baja</option><option value="standard">Escolaridad intermedia</option><option value="high">Estudios universitarios</option></select></label><p className="res-help">Errores directos: {entry.errors||0}/10. {entry.validity==='Aplicado'?'Resultado ajustado orientativo: '+entry.pfeifferAdjusted+' · '+entry.pfeifferCategory:'No se interpreta una aplicación incompleta o con ítems no evaluables.'} La corrección por escolaridad debe contrastarse con los criterios de la versión aplicada.</p></section>;
}
