'use client';
import {useState} from 'react';
import type {Entry} from './model';
import {activeMmseGroups,calculateMmse,mmseItemKey} from './mmse-items';
function CopyImage({value,onChange}:{value:string;onChange:(value:string)=>void}){
 const [error,setError]=useState('');
 async function upload(file?:File){if(!file)return;setError('');try{
  if(!file.type.startsWith('image/'))throw Error('Selecciona una imagen.');
  if(file.size>8_000_000)throw Error('La imagen supera 8 MB.');
  const bitmap=await createImageBitmap(file);const scale=Math.min(1,1100/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
  canvas.getContext('2d')?.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
  const url=canvas.toDataURL('image/jpeg',0.7);
  if(url.length>550000)throw Error('La imagen sigue siendo demasiado grande. Fotografía solo el dibujo y vuelve a intentarlo.');
  onChange(url);
 }catch(e){setError((e as Error).message);}}
 return <div className="res-copy-upload"><label>Fotografía de la copia (opcional)<input type="file" accept="image/*" onChange={e=>{void upload(e.target.files?.[0]);e.target.value='';}}/></label>{error&&<p role="alert">{error}</p>}{value.startsWith('data:image/')&&<div><img src={value} alt="Copia del MMSE adjuntada" /><button type="button" onClick={()=>onChange('')}>Eliminar imagen</button></div>}<small>La fotografía se reduce de tamaño antes de guardar la aplicación.</small></div>;
}
export default function MmseForm({entry,onChange}:{entry:Entry;onChange:(e:Entry)=>void}){
 const result=calculateMmse(entry),groups=activeMmseGroups(entry);
 const [activeGroup,setActiveGroup]=useState<string|null>(groups[0]?.key||null);
 const answered=groups.flatMap(g=>g.items).filter(i=>['0','1'].includes(entry[mmseItemKey(i.key)])).length,total=groups.reduce((n,g)=>n+g.items.length,0);
 const set=(key:string,value:string)=>onChange(calculateMmse({...entry,[key]:value}));
 return <section className="res-mmse" aria-label="MMSE respondido en la web"><div className="res-score-summary"><div><h3>Aplicación MMSE · NORMACODERM</h3><p>Registra la respuesta de la persona y valora su ejecución en cada ítem.</p></div><strong aria-live="polite">{result.score!==''?result.score+' / 30':'Aplicación incompleta'}</strong><span>{answered} de {total} ítems puntuados</span></div>
 <label>Procedimiento de atención<select aria-label="Procedimiento de atención" value={entry.attentionMethod} onChange={e=>set('attentionMethod',e.target.value)}><option>Restas seriadas</option><option>MUNDO al revés</option><option>Ambos</option></select></label>
 <p className="res-help">Los ítems pendientes o no evaluables no suman cero. Si aplicas ambos procedimientos de atención, se conserva el mejor de los dos completos, con un máximo de 5 puntos.</p>
 <nav className="res-mmse-nav" aria-label="Apartados del MMSE">{groups.map(g=><button type="button" key={g.key} aria-pressed={activeGroup===g.key} onClick={()=>setActiveGroup(g.key)}>{g.title}<small>{g.items.filter(i=>['0','1','NE'].includes(entry[mmseItemKey(i.key)])).length}/{g.items.length}</small></button>)}</nav>
 {groups.filter(g=>g.key===activeGroup).map(g=><section key={g.key} className="res-mmse-group"><h4>{g.title}</h4>{g.instruction&&<p>{g.instruction}</p>}{g.key==='reading'&&<div className="res-reading-stimulus">CIERRE LOS OJOS</div>}{g.key==='copying'&&<><p>Realiza la copia en papel. Puedes adjuntar una fotografía del resultado.</p><CopyImage value={entry.copyImage||''} onChange={v=>set('copyImage',v)}/></>}
 {g.items.map(i=><div key={i.key} className="res-mmse-item"><h4>{i.prompt}{i.expected&&<small>Referencia: {i.expected}</small>}</h4><div className="res-grid"><label>Respuesta / ejecución<textarea aria-label={'Respuesta: '+i.prompt} maxLength={4000} value={entry[mmseItemKey(i.key,'response')]||''} onChange={e=>set(mmseItemKey(i.key,'response'),e.target.value)}/></label><label>Puntuación del ítem<select aria-label={'Puntuación: '+i.prompt} value={entry[mmseItemKey(i.key)]||''} onChange={e=>set(mmseItemKey(i.key),e.target.value)}><option value="">Pendiente</option><option value="1">Correcto · 1</option><option value="0">Incorrecto · 0</option><option value="NE">No evaluable</option></select></label></div></div>)}
 <label>Notas de ejecución · {g.title}<textarea aria-label={'Notas: '+g.key} maxLength={10000} value={entry['mmse_note_'+g.key]||''} onChange={e=>set('mmse_note_'+g.key,e.target.value)} placeholder="Ayudas, autocorrecciones, repeticiones, latencia, fatiga…"/></label><div className="res-mmse-next"><button type="button" disabled={groups.findIndex(x=>x.key===g.key)===0} onClick={()=>setActiveGroup(groups[groups.findIndex(x=>x.key===g.key)-1].key)}>Anterior</button><button type="button" disabled={groups.findIndex(x=>x.key===g.key)===groups.length-1} onClick={()=>setActiveGroup(groups[groups.findIndex(x=>x.key===g.key)+1].key)}>Siguiente apartado →</button></div></section>)}
 <div className="res-score-summary"><strong>Total: {result.score!==''?result.score+' / 30':'pendiente de completar'}</strong><span>{result.validity}</span></div><p className="res-help">La puntuación directa se calcula a partir de tu valoración de los ítems. La corrección normativa y la interpretación clínica se registran por separado.</p></section>;
}
export function MmseAnswers({entry,expanded=false}:{entry:Entry;expanded?:boolean}){return <details open={expanded} className="res-mmse-saved"><summary>Respuestas y ejecución de esta aplicación</summary>{activeMmseGroups(entry).map(g=><section key={g.key}><h4>{g.title}</h4>{g.items.map(i=><p key={i.key}><strong>{i.prompt}: </strong>{entry[mmseItemKey(i.key,'response')]||'Sin respuesta transcrita'} · {entry[mmseItemKey(i.key)]==='1'?'Correcto (1)':entry[mmseItemKey(i.key)]==='0'?'Incorrecto (0)':entry[mmseItemKey(i.key)]==='NE'?'No evaluable':'Pendiente'}</p>)}{entry['mmse_note_'+g.key]&&<p><strong>Notas: </strong>{entry['mmse_note_'+g.key]}</p>}</section>)}{entry.copyImage?.startsWith('data:image/')&&<img className="res-copy-saved-image" src={entry.copyImage} alt="Fotografía guardada de la copia del MMSE"/>}</details>;}
