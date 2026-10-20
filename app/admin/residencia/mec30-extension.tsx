'use client';
import type {Entry} from './model';
import {mmseItemKey} from './mmse-items';
const extra=[
 ['coins','Si tiene 30 monedas y le quitan 3, ¿cuántas quedan? ¿Y si le quitan otras 3? (27, 24, 21, 18, 15)'],
 ['mecRepeat','Repita: «En un trigal había cinco perros»'],
 ['mecNames','Denominación de lápiz y reloj según consignas MEC'],
 ['mecCommand','Coja este papel con la mano derecha, dóblelo por la mitad y déjelo en la mesa'],
 ['mecDrawing','Copia de la figura geométrica específica del MEC']
] as const;
const mecWords=['Peseta','Caballo','Manzana'];
const keys=[...mecWords.map((_,i)=>'fix'+i),...mecWords.map((_,i)=>'recall'+i),...extra.map(([k])=>k)];
function value(entry:Entry,key:string){return entry['mec30_'+key+'_score']||'';}
export function calculateMec30(entry:Entry):Entry{
 if(entry.mec30Enabled!=='yes')return {...entry,mec30Score:'',mec30Validity:'No solicitado'};
 const common=[...['year','monthDay','month','weekDay','season','country','province','city','place','floor'].map(k=>entry[mmseItemKey(k)]||''),
 ...['pencil','watch','closeEyes','sentence'].map(k=>entry[mmseItemKey(k)]||'')];
 const required=[...common,...keys.map(k=>value(entry,k))];
 const done=required.every(x=>x==='0'||x==='1');
 const orientation=common.slice(0,10).filter(x=>x==='1').length;
 const fix=mecWords.map((_,i)=>value(entry,'fix'+i)).filter(x=>x==='1').length;
 const recall=mecWords.map((_,i)=>value(entry,'recall'+i)).filter(x=>x==='1').length;
 const generic=common.slice(10).filter(x=>x==='1').length;
 // The MEC-specific coins item is five points and the remaining substitutions require protocol-specific subitem counts.
 // Avoid a pseudo-total while the mapping to the exact MEC sheet is unverified.
 return {...entry,mec30Score:'',mec30Validity:done?'Pendiente de validación del baremo y equivalencias':'Incompleto',mec30Progress:String(required.filter(x=>x==='0'||x==='1').length)+'/'+required.length,mec30Shared:String(orientation+generic),mec30Fixation:String(fix),mec30Recall:String(recall)};
}
export default function Mec30Extension({entry,onChange}:{entry:Entry;onChange:(e:Entry)=>void}){
 const set=(key:string,v:string)=>onChange(calculateMec30({...entry,[key]:v}));
 return <section className="res-mec30"><h3>Complemento MEC-30 de Lobo</h3><p className="res-help">Responde solo los elementos diferentes. Las respuestas de orientación y otros ítems comunes se reutilizan. No se expedirá una puntuación MEC-30 hasta verificar el reparto exacto de los puntos y las consignas diferentes del protocolo aportado.</p>
 {mecWords.map((word,i)=><div key={i}><strong>Fijación: {word}</strong><input placeholder="Respuesta literal" value={entry['mec30_fix'+i+'_response']||''} onChange={e=>set('mec30_fix'+i+'_response',e.target.value)}/><select value={value(entry,'fix'+i)} onChange={e=>set('mec30_fix'+i+'_score',e.target.value)}><option value="">Pendiente</option><option value="1">Correcto</option><option value="0">Incorrecto</option></select></div>)}
 {mecWords.map((word,i)=><div key={i}><strong>Recuerdo diferido: {word}</strong><input placeholder="Respuesta literal" value={entry['mec30_recall'+i+'_response']||''} onChange={e=>set('mec30_recall'+i+'_response',e.target.value)}/><select value={value(entry,'recall'+i)} onChange={e=>set('mec30_recall'+i+'_score',e.target.value)}><option value="">Pendiente</option><option value="1">Correcto</option><option value="0">Incorrecto</option></select></div>)}
 {extra.map(([key,question])=><div key={key}><strong>{question}</strong><input placeholder="Respuesta / observación" value={entry['mec30_'+key+'_response']||''} onChange={e=>set('mec30_'+key+'_response',e.target.value)}/><select value={value(entry,key)} onChange={e=>set('mec30_'+key+'_score',e.target.value)}><option value="">Pendiente</option><option value="1">Correcto</option><option value="0">Incorrecto</option></select></div>)}
 <p>Ítems registrados: {entry.mec30Progress||'0'}. La puntuación MEC-30 queda pendiente de validación clínica.</p></section>;
}
