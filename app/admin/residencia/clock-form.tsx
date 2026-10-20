'use client';
import {useState} from 'react';
import type {Entry} from './model';

export const clockCriteria={
 sphere:[['2','Esfera circular u ovalada, pequeñas distorsiones por temblor'],['1','Esfera incompleta, asimétrica o con distorsión significativa'],['0','Ausencia de esfera o dibujo totalmente distorsionado']],
 numbers:[['4','Todos los números presentes y en orden correcto'],['3.5','Pequeños errores de ubicación espacial en cuatro o más números'],['3','Todos presentes, error espacial significativo'],['2','Omisión o adición de algún número sin grandes distorsiones del resto'],['1','Ausencia o exceso de números con gran distorsión espacial'],['0','Ausencia o menos de seis números representados']],
 hands:[['4','Posición correcta y proporción de tamaños adecuada'],['3.5','Posición correcta, pero ambas manecillas del mismo tamaño'],['3','Pequeños errores en la posición de las manecillas'],['2','Gran distorsión en la posición'],['1','No se unen en el centro y señalan hora incorrecta'],['0','Manecillas ausentes o perseveración en su dibujo']]
} as const;
export function scoreClock(entry:Entry):Entry{
 const vals=[entry.clockSphere,entry.clockNumbers,entry.clockHands];
 const complete=vals.every(x=>x!==undefined&&x!==''&&Number.isFinite(Number(x)));
 const sum=complete?vals.reduce<number>((n,v)=>n+Number(v),0):null;
 return {...entry,instrument:'Test del reloj',version:'Cacho et al. (1999) · copia · 10 puntos',method:'Cacho (esfera 2, números 4, manecillas 4)',maximum:'10',score:sum===null?'':String(sum),validity:sum===null?'Incompleto':'Aplicado',direction:'Más alto es más favorable',clockResult:sum===null?'':sum<=8?'Cribado positivo (≤8)':'Cribado negativo (>8)'};
}
export default function ClockForm({entry,onChange}:{entry:Entry;onChange:(e:Entry)=>void}){
 const [error,setError]=useState('');
 const change=(k:string,v:string)=>onChange(scoreClock({...entry,[k]:v}));
 async function photo(file?:File){if(!file)return;setError('');try{
 if(!file.type.startsWith('image/'))throw Error('Selecciona una fotografía o imagen.');
 if(file.size>8000000)throw Error('La imagen no debe superar 8 MB.');
 const bitmap=await createImageBitmap(file);
 const scale=Math.min(1,1100/Math.max(bitmap.width,bitmap.height));
 const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
 canvas.getContext('2d')?.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
 const url=canvas.toDataURL('image/jpeg',.68);if(url.length>550000)throw Error('La imagen es demasiado grande. Recorta la fotografía y vuelve a intentarlo.');
 change('clockImage',url);
 }catch(e){setError((e as Error).message);}}
 return <section className="res-clock-form"><div className="res-score-summary"><strong>Test del reloj · Cacho (copia)</strong><span>{entry.score!==''?entry.score+' / 10 · '+entry.clockResult:'Corrección pendiente'}</span></div><p className="res-help">Consigna del documento facilitado: copiar el reloj de la forma más exacta posible. Puntúa por separado esfera, números y manecillas. No mezclar con otros sistemas de puntuación.</p>
 {([['clockSphere','Esfera',clockCriteria.sphere],['clockNumbers','Números',clockCriteria.numbers],['clockHands','Manecillas',clockCriteria.hands]] as const).map(([key,label,options])=><label key={key}>{label}<select value={entry[key]||''} onChange={e=>change(key,e.target.value)}><option value="">Sin puntuar</option>{options.map(([value,description])=><option key={value} value={value}>{value} puntos · {description}</option>)}</select></label>)}
 <label>Fotografía del dibujo (opcional)<input type="file" accept="image/*" onChange={e=>{void photo(e.target.files?.[0]);e.currentTarget.value='';}}/></label>{error&&<p role="alert">{error}</p>}{entry.clockImage?.startsWith('data:image/')&&<div className="res-clock-image"><img src={entry.clockImage} alt="Reloj realizado por el residente"/><button type="button" onClick={()=>change('clockImage','')}>Eliminar fotografía</button></div>}
 <p className="res-help">Puntuación posible: 0–10, incluidos medios puntos. ≤8: cribado positivo; &gt;8: cribado negativo según esta versión. No equivale por sí solo a un diagnóstico.</p></section>;
}