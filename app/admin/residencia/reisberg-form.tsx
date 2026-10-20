'use client';
import type {Entry} from './model';
const phases=[
['1','Sin alteración cognitiva evidente y autonomía conservada en actividades complejas'],
['2','Quejas cognitivas subjetivas sin deterioro funcional objetivo'],
['3','Dificultades objetivas en actividades ocupacionales o sociales complejas'],
['4','Limitaciones en actividades instrumentales complejas, como compras y dinero'],
['5','Necesita ayuda para actividades básicas de rutina; especialmente elección de ropa apropiada'],
['6','Dependencia progresiva para vestirse, baño, aseo y continencia'],
['7','Dependencia grave con pérdida progresiva de lenguaje y capacidades motoras']
] as const;
const subphases:Record<string,[string,string][]>={
 '6':[['6a','Dificultad para vestirse correctamente'],['6b','Dificultad para bañarse de forma independiente'],['6c','Dificultad para realizar el aseo'],['6d','Incontinencia urinaria vinculada a las dificultades descritas'],['6e','Incontinencia fecal vinculada a las dificultades descritas']],
 '7':[['7a','Lenguaje limitado a unas pocas palabras'],['7b','Lenguaje inteligible reducido a una palabra o vocalizaciones'],['7c','Pérdida de capacidad ambulatoria'],['7d','Pérdida de capacidad para permanecer sentado'],['7e','Pérdida de la capacidad de sonreír'],['7f','Pérdida del sostén de la cabeza']]
};
export function scoreReisberg(e:Entry):Entry{
 const phase=e.stage||'',sub=e.reisbergSubstage||'';
 return {...e,instrument:'GDS de Reisberg',version:'Escala de deterioro global de Reisberg (7 fases)',validity:phase&&e.evidence?.trim()&&(!['6','7'].includes(phase)||sub)?'Aplicado':'Incompleto',score:phase,maximum:'7',direction:'Más bajo es más favorable'};
}
export default function ReisbergForm({entry,onChange}:{entry:Entry;onChange:(e:Entry)=>void}){
 const set=(key:string,value:string)=>onChange(scoreReisberg({...entry,[key]:value,...(key==='stage'?{reisbergSubstage:''}:{})}));
 return <section className="res-reisberg"><h3>GDS de Reisberg · valoración clínica por fases</h3><p className="res-help">Selecciona la fase sustentada por la evaluación. Esta escala no es un cuestionario de respuestas correctas o incorrectas.</p><label>Fase global<select value={entry.stage||''} onChange={e=>set('stage',e.target.value)}><option value="">Seleccionar estadio…</option>{phases.map(([v,label])=><option key={v} value={v}>GDS {v} · {label}</option>)}</select></label>{entry.stage&&<p><strong>Descripción del estadio:</strong> {phases.find(([v])=>v===entry.stage)?.[1]}</p>}
 {subphases[entry.stage||'']&&<label>Subfase clínica<select value={entry.reisbergSubstage||''} onChange={e=>set('reisbergSubstage',e.target.value)}><option value="">Seleccionar subfase…</option>{subphases[entry.stage].map(([v,label])=><option key={v} value={v}>{v} · {label}</option>)}</select></label>}
 <label>Evidencia funcional y ejemplos concretos<textarea value={entry.evidence||''} onChange={e=>set('evidence',e.target.value)} placeholder="Actividades conservadas, dificultades objetivas, ayudas que requiere, fuentes de información…" /></label><label>Capacidades preservadas y apoyos<textarea value={entry.reisbergStrengths||''} onChange={e=>set('reisbergStrengths',e.target.value)} placeholder="Qué puede seguir realizando, con qué adaptaciones…" /></label><label>Limitaciones de la valoración<textarea value={entry.conditions||''} onChange={e=>set('conditions',e.target.value)} placeholder="Enfermedad aguda, limitaciones motoras, sensoriales, variabilidad, discrepancias entre informantes…" /></label><p className="res-help">Estadificación orientativa basada en la función cognitiva y cotidiana. No determina por sí sola el diagnóstico etiológico. Las subfases 6 y 7 requieren especial atención a condiciones físicas y necesidades de apoyo.</p></section>;
}
