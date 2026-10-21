'use client';
import {useEffect,useRef,useState} from 'react';
import {residenceApi as api} from './api';
import {today} from './model';
import './task-checklist.css';

export const residenceDuties=[
 'Valoración psicológica de ingreso','Reevaluación cognitiva','Valoración emocional y conductual',
 'Seguimiento individual','Elaboración o revisión del PIAI','Intervención psicológica individual',
 'Sesión grupal de estimulación cognitiva','Taller de bienestar emocional','Entrevista con la familia',
 'Reunión del equipo interdisciplinar','Asesoramiento al equipo de atención directa','Elaboración de informe',
 'Preparación de materiales de intervención','Registro de seguimientos y actualización de historiales',
 'Intervención en adaptación al centro','Apoyo en duelo y final de vida'
];
type Task={id:string;patient_id:null;title:string;note:string;task_type:string;priority:string;status:'open'|'done'|'cancelled';due_at:string|null;updated_at:string;completed_at:string|null};
const marker='residence-checklist-v1';
const scope='/rest/v1/clinical_admin_tasks?patient_id=is.null&note=eq.'+marker;
const date=(t:Task)=>t.due_at?.slice(0,10)||'';
const label=(t:Task)=>t.title.replace(/^\[Residencia\] /,'');

export default function ResidenceTaskChecklist(){
 const [tasks,setTasks]=useState<Task[]>([]),[selected,setSelected]=useState<string[]>([]),[due,setDue]=useState(today);
 const [busy,setBusy]=useState(false),[loading,setLoading]=useState(true),[message,setMessage]=useState(''),[retry,setRetry]=useState(0);
 const batch=useRef<Task[]|null>(null),inFlight=useRef(false);
 useEffect(()=>{let active=true;setLoading(true);void(async()=>{try{
  let all:Task[]=[];for(let offset=0;;offset+=500){const page=await api(scope+'&select=*&order=due_at.asc,id.asc&limit=500&offset='+offset);if(!Array.isArray(page))throw Error('No se han podido leer las tareas.');all=all.concat(page);if(page.length<500)break;}
  if(active){setTasks(all);setMessage('');}
 }catch(e){if(active)setMessage((e as Error).message);}finally{if(active)setLoading(false);}})();return()=>{active=false;};},[retry]);
 async function add(){
  if(inFlight.current||!selected.length||!due)return;
  inFlight.current=true;setBusy(true);setMessage('');
  const payload=batch.current||(batch.current=selected.map(title=>({id:crypto.randomUUID(),patient_id:null,title:'[Residencia] '+title,note:marker,task_type:'other',priority:'normal',status:'open',due_at:due+'T12:00:00Z',updated_at:new Date().toISOString(),completed_at:null})));
  try{
   let rows:Task[];
   try{rows=await api('/rest/v1/clinical_admin_tasks',{method:'POST',body:JSON.stringify(payload)});}
   catch(error){
    // A lost response may still have committed the batch. Reconcile the same IDs before retrying.
    const existing=await api(scope+'&select=*&id=in.('+payload.map(t=>t.id).join(',')+')').catch(()=>null);
    if(!Array.isArray(existing)||existing.length!==payload.length)throw error;rows=existing;
   }
   if(!Array.isArray(rows)||rows.length!==payload.length)throw Error('No se ha confirmado el guardado. Reintenta sin cambiar la selección.');
   setTasks(old=>[...old.filter(t=>!rows.some(r=>r.id===t.id)),...rows]);setSelected([]);batch.current=null;setMessage('Tareas añadidas.');
  }catch(e){setMessage((e as Error).message);}finally{inFlight.current=false;setBusy(false);}
 }
 async function update(task:Task,changes:Partial<Task>){
  if(inFlight.current)return;inFlight.current=true;setBusy(true);setMessage('');
  try{const rows=await api(scope+'&id=eq.'+task.id+'&updated_at=eq.'+encodeURIComponent(task.updated_at),{method:'PATCH',body:JSON.stringify({...changes,updated_at:new Date().toISOString()})});
   if(!rows?.[0])throw Error('La tarea ha cambiado en otra ventana. Pulsa Recargar tareas antes de continuar.');
   setTasks(old=>old.map(t=>t.id===task.id?rows[0]:t));setMessage('Tarea actualizada.');
  }catch(e){setMessage((e as Error).message);}finally{inFlight.current=false;setBusy(false);}
 }
 const pending=tasks.filter(t=>t.status==='open').sort((a,b)=>date(a).localeCompare(date(b))||label(a).localeCompare(label(b),'es'));
 const completed=tasks.filter(t=>t.status==='done').sort((a,b)=>(b.completed_at||'').localeCompare(a.completed_at||''));
 function row(t:Task){return <li key={t.id} className={t.status==='done'?'is-done':''}>
  <label className="res-task-check"><input type="checkbox" checked={t.status==='done'} disabled={busy||loading} onChange={e=>void update(t,{status:e.target.checked?'done':'open',completed_at:e.target.checked?new Date().toISOString():null})}/><span>{label(t)}</span></label>
  <label className="res-task-date">Fecha<input aria-label={'Fecha de '+label(t)} type="date" required value={date(t)} disabled={busy||loading} onChange={e=>{if(e.target.value)void update(t,{due_at:e.target.value+'T12:00:00Z'});}}/></label>
  {t.status==='open'&&date(t)<today()&&<small>Vencida</small>}
 </li>;}
 return <div className="res-task-checklist">
  <form onSubmit={e=>{e.preventDefault();void add();}}><fieldset disabled={busy||loading} className="res-task-picker"><legend>Selecciona las tareas que tienes que hacer</legend>
   <details><summary>Elegir funciones habituales {selected.length?'('+selected.length+')':''}</summary><div className="res-duty-options">{residenceDuties.map(duty=><label key={duty}><input type="checkbox" checked={selected.includes(duty)} onChange={e=>{setSelected(old=>e.target.checked?[...old,duty]:old.filter(v=>v!==duty));batch.current=null;}}/>{duty}</label>)}</div></details>
   <div className="res-toolbar"><label>Fecha de las tareas<input required aria-label="Fecha de las tareas" type="date" value={due} onChange={e=>{setDue(e.target.value);batch.current=null;}}/></label><button type="submit" disabled={!selected.length||!due}>{busy?'Guardando…':'Añadir tareas'+(selected.length?' ('+selected.length+')':'')}</button></div>
  </fieldset></form>
  <p role="status">{loading?'Cargando tareas…':message}</p>
  {!loading&&<><p className="res-help">{pending.length} pendientes. Marca la casilla de cada tarea cuando la completes.</p><ul className="res-task-list">{pending.map(row)}</ul>{!pending.length&&<p>No hay tareas pendientes.</p>}<details><summary>Completadas ({completed.length})</summary><ul className="res-task-list">{completed.map(row)}</ul></details></>}
  <button type="button" disabled={busy||loading} onClick={()=>setRetry(n=>n+1)}>Recargar tareas</button>
 </div>;
}
