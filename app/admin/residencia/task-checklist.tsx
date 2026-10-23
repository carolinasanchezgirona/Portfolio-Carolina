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
 const [composer,setComposer]=useState(false),[filter,setFilter]=useState('pending'),[search,setSearch]=useState(''),[loadError,setLoadError]=useState(false);
 const batch=useRef<Task[]|null>(null),inFlight=useRef(false);
 useEffect(()=>{let active=true;setLoading(true);void(async()=>{try{
  let all:Task[]=[];for(let offset=0;;offset+=500){const page=await api(scope+'&select=*&order=due_at.asc,id.asc&limit=500&offset='+offset);if(!Array.isArray(page))throw Error('No se han podido leer las tareas.');all=all.concat(page);if(page.length<500)break;}
  if(active){setTasks(all);setMessage('');setLoadError(false);}
 }catch(e){if(active){setMessage((e as Error).message);setLoadError(true);}}finally{if(active)setLoading(false);}})();return()=>{active=false;};},[retry]);
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
   setTasks(old=>[...old.filter(t=>!rows.some(r=>r.id===t.id)),...rows]);setSelected([]);batch.current=null;setComposer(false);setFilter('pending');setMessage('Tareas añadidas.');
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
  {t.status==='open'&&date(t)&&date(t)<today()&&<small>Vencida</small>}
 </li>;}
 const now=today();
 const groups=[
  {key:'overdue',title:'Vencidas',hint:'Pendientes de días anteriores',items:pending.filter(t=>date(t)&&date(t)<now)},
  {key:'today',title:'Hoy',hint:'Para completar en esta jornada',items:pending.filter(t=>date(t)===now)},
  {key:'next',title:'Próximas',hint:'Ya planificadas para otros días',items:pending.filter(t=>date(t)>now)},
  {key:'undated',title:'Sin fecha',hint:'Pendientes de organizar',items:pending.filter(t=>!date(t))}
 ];
 const matches=(t:Task)=>label(t).toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es'));
 const shown=filter==='done'?[{key:'done',title:'Completadas',hint:'Puedes desmarcar una tarea para recuperarla',items:completed.filter(matches)}]:groups.filter(g=>filter==='pending'||g.key===filter).map(g=>({...g,items:g.items.filter(matches)}));
 const totalShown=shown.reduce((n,g)=>n+g.items.length,0);
 return <div className="res-task-checklist res-tasks-visual" aria-busy={busy||loading}>
  <div className="res-task-top"><div><h4>Tu lista de tareas</h4><p>Marca lo que terminas y deja preparada la siguiente jornada.</p></div><button type="button" aria-expanded={composer} aria-controls="res-task-composer" disabled={busy||loading||loadError} onClick={()=>setComposer(v=>!v)}>{composer?'Cerrar selección':'+ Añadir tareas'}</button></div>
  <div className="res-task-summary" aria-label="Resumen de tareas">{[{key:'pending',title:'Pendientes',count:pending.length},...groups.filter(g=>g.key!=='undated').map(g=>({key:g.key,title:g.title,count:g.items.length})),{key:'done',title:'Completadas',count:completed.length}].map(item=><button type="button" key={item.key} aria-pressed={filter===item.key} onClick={()=>setFilter(item.key)}><strong>{loading||loadError?'—':item.count}</strong><span>{item.title}</span></button>)}</div>
  <form id="res-task-composer" hidden={!composer} onSubmit={e=>{e.preventDefault();void add();}}><fieldset disabled={busy||loading||loadError} className="res-task-picker"><legend>¿Qué necesitas hacer?</legend>
   <p className="res-help">Selecciona una o varias funciones y asigna su fecha.</p>
   <div className="res-duty-options">{residenceDuties.map(duty=><label key={duty} className={selected.includes(duty)?'is-selected':''}><input type="checkbox" checked={selected.includes(duty)} onChange={e=>{setSelected(old=>e.target.checked?[...old,duty]:old.filter(v=>v!==duty));batch.current=null;}}/>{duty}</label>)}</div>
   <div className="res-toolbar"><label>Fecha de las tareas<input required aria-label="Fecha de las tareas" type="date" value={due} onChange={e=>{setDue(e.target.value);batch.current=null;}}/></label><button type="button" onClick={()=>{setDue(today());batch.current=null;}}>Para hoy</button><button type="submit" disabled={!selected.length||!due}>{busy?'Guardando…':'Añadir tareas'+(selected.length?' ('+selected.length+')':'')}</button></div>
  </fieldset></form>
  <p role="status">{loading?'Cargando tareas…':message}</p>
  {!loading&&!loadError&&<>
   <label className="res-task-search">Buscar tarea<input type="search" placeholder="Por ejemplo: familia, informe, PIAI…" value={search} onChange={e=>setSearch(e.target.value)}/></label>
   {shown.filter(g=>g.items.length>0).map(group=><section key={group.key} className={'res-task-group is-'+group.key} aria-label={group.title}><header><h4>{group.title} <span>{group.items.length}</span></h4><p>{group.hint}</p></header><ul className="res-task-list">{group.items.map(row)}</ul></section>)}
   {!totalShown&&<div className="res-task-empty"><strong>{search?'No hay tareas con esa búsqueda.':filter==='pending'?'No tienes tareas pendientes.':'No hay tareas en esta vista.'}</strong><p>{filter==='pending'&&!search?'Añade las próximas tareas para tenerlas presentes.':'Cambia el filtro para consultar el resto.'}</p>{filter!=='pending'&&<button type="button" onClick={()=>setFilter('pending')}>Ver todas las pendientes</button>}</div>}
  </>}
  <button type="button" className="res-task-refresh" disabled={busy||loading} onClick={()=>setRetry(n=>n+1)}>Recargar tareas</button>
 </div>;
}
