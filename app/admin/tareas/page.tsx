'use client';
import {useEffect,useState} from 'react';
import AdminWorkspaceNav from '../workspace-nav';
import './tareas.css';
type Task={id:string;patient_id:null;title:string;note:string|null;priority:'high'|'normal'|'low';status:'open'|'done'|'cancelled';due_at:string|null;updated_at:string;task_type:string;completed_at?:string|null};
type Notebook={id:string;body:string;revision:number;updated_at?:string};
const owner='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2';
const today=()=>new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Madrid'});
const date=(t:Task)=>t.due_at?.slice(0,10)||'';
const priorityLabel={high:'Alta',normal:'Normal',low:'Baja'};
const fresh=():Task=>({id:crypto.randomUUID(),patient_id:null,title:'',note:'',priority:'normal',status:'open',due_at:null,updated_at:'',task_type:'other'});
async function api(path:string,init:RequestInit={}){
 const session=JSON.parse(sessionStorage.getItem('dememoria_admin_session')||'null');
 if(!session?.access_token)throw Error('Inicia sesión para abrir tu agenda profesional.');
 const response=await fetch('https://grgyvdxkjdstdyumdfyg.supabase.co'+path,{...init,cache:'no-store',headers:{apikey:'sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii',Authorization:'Bearer '+session.access_token,'Content-Type':'application/json',Prefer:'return=representation'}});
 const data=await response.json().catch(()=>null);
 if(!response.ok)throw Error([401,403].includes(response.status)?'Tu sesión ha caducado o no tienes acceso. Vuelve a iniciar sesión.':'No se ha podido guardar o cargar. Conservamos tu borrador en esta pantalla; comprueba la conexión.');
 return data;
}
export default function ProfessionalOrganizer(){
 const [tasks,setTasks]=useState<Task[]>([]),[notebook,setNotebook]=useState<Notebook>({id:'main',body:'',revision:0}),[notes,setNotes]=useState('');
 const [draft,setDraft]=useState<Task|null>(null),[taskDirty,setTaskDirty]=useState(false),[busy,setBusy]=useState(false),[ready,setReady]=useState(false);
 const [message,setMessage]=useState('Comprobando acceso…'),[noteMessage,setNoteMessage]=useState(''),[filter,setFilter]=useState('open'),[search,setSearch]=useState('');
 const notesDirty=notes!==notebook.body;
 useEffect(()=>{void(async()=>{try{
  const user=await api('/auth/v1/user');if(user?.id!==owner)throw Error('Acceso reservado a la administradora.');
  const [all,note]=await Promise.all([(async()=>{let all:Task[]=[];for(let offset=0;;offset+=500){const page=await api('/rest/v1/clinical_admin_tasks?select=*&patient_id=is.null&order=created_at.desc,id.asc&limit=500&offset='+offset);if(!Array.isArray(page))throw Error('No se ha podido leer la lista de tareas.');all=all.concat(page);if(page.length<500)return all;}})(),api('/rest/v1/professional_notebook?id=eq.main&select=*')]);
  setTasks(all);if(note?.[0]){setNotebook(note[0]);setNotes(note[0].body);}setReady(true);setMessage('');
 }catch(e){setMessage((e as Error).message);}})();},[]);
 useEffect(()=>{const leave=(e:BeforeUnloadEvent)=>{if(notesDirty||taskDirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',leave);return()=>window.removeEventListener('beforeunload',leave);},[notesDirty,taskDirty]);
 function edit(task:Task){if(taskDirty&&!window.confirm('¿Descartar los cambios de la tarea sin guardar?'))return;setDraft({...task});setTaskDirty(false);setMessage('');}
 async function saveTask(task:Task,fromEditor=false){if(busy)return;if(!task.title.trim()){setMessage('Escribe qué tienes que hacer.');return;}setBusy(true);try{
  const saved={...task,title:task.title.trim(),patient_id:null,updated_at:new Date().toISOString(),completed_at:task.status==='done'?new Date().toISOString():null};
  const query=task.updated_at?'?id=eq.'+task.id+'&patient_id=is.null&updated_at=eq.'+encodeURIComponent(task.updated_at):'';
  const rows=await api('/rest/v1/clinical_admin_tasks'+query,{method:task.updated_at?'PATCH':'POST',body:JSON.stringify(saved)});
  if(!rows?.[0])throw Error('La tarea ha cambiado en otra ventana. El borrador sigue aquí; vuelve a cargar la página después de copiarlo.');
  setTasks(old=>[rows[0],...old.filter(t=>t.id!==task.id)]);if(fromEditor||draft?.id===task.id){setDraft(null);setTaskDirty(false);}setMessage('Tarea guardada.');
 }catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}
 async function saveNotes(){if(busy||!notesDirty)return;setBusy(true);setNoteMessage('Guardando…');try{
  const payload={id:'main',body:notes,revision:notebook.revision+1,updated_at:new Date().toISOString()};
  const rows=await api('/rest/v1/professional_notebook'+(notebook.revision?'?id=eq.main&revision=eq.'+notebook.revision:''),{method:notebook.revision?'PATCH':'POST',body:JSON.stringify(payload)});
  if(!rows?.[0])throw Error('Las notas han cambiado en otra ventana. Tu borrador sigue aquí; cópialo antes de recargar.');
  setNotebook(rows[0]);setNoteMessage('Notas guardadas.');
 }catch(e){setNoteMessage((e as Error).message);}finally{setBusy(false);}}
 const now=today();const open=tasks.filter(t=>t.status==='open');
 const filtered=tasks.filter(t=>{
  if(filter==='open'&&t.status!=='open')return false;if(filter==='overdue'&&!(t.status==='open'&&date(t)&&date(t)<now))return false;
  if(filter==='today'&&!(t.status==='open'&&date(t)===now))return false;if(filter==='upcoming'&&!(t.status==='open'&&date(t)>now))return false;
  if(filter==='undated'&&!(t.status==='open'&&!t.due_at))return false;if(filter==='done'&&t.status!=='done')return false;
  return (t.title+' '+(t.note||'')).toLowerCase().includes(search.toLowerCase());
 }).sort((a,b)=>(date(a)||'9999').localeCompare(date(b)||'9999')||({high:0,normal:1,low:2}[a.priority]-{high:0,normal:1,low:2}[b.priority]));
 return <main className="professional"><header><p className="professional-kicker">MI ORGANIZACIÓN</p><h1>Mi agenda profesional</h1><p>Todo lo que tienes que hacer, en un solo sitio.</p><AdminWorkspaceNav active="otra"/></header><p role="status">{message}</p>
 {!ready?<a href="/admin/clinica/acceso/?next=/admin/tareas/">Iniciar sesión</a>:<>
 <div className="professional-stats"><button onClick={()=>setFilter('open')}><strong>{open.length}</strong> Pendientes</button><button onClick={()=>setFilter('today')}><strong>{open.filter(t=>date(t)===now).length}</strong> Para hoy</button><button onClick={()=>setFilter('overdue')}><strong>{open.filter(t=>date(t)&&date(t)<now).length}</strong> Vencidas</button></div>
 <div className="professional-columns"><section className="professional-card"><div className="professional-heading"><h2>Mis tareas</h2><button disabled={busy} className="professional-primary" onClick={()=>edit(fresh())}>+ Nueva tarea</button></div>
 {draft&&<form className="professional-editor" onSubmit={e=>{e.preventDefault();void saveTask(draft,true);}}><fieldset disabled={busy}><h3>{draft.updated_at?'Editar tarea':'Nueva tarea'}</h3><label>Qué tengo que hacer<input autoFocus required maxLength={220} value={draft.title} onChange={e=>{setDraft({...draft,title:e.target.value});setTaskDirty(true);}} placeholder="Preparar un informe, llamar al centro, revisar una factura…"/></label><div className="professional-grid"><label>Fecha límite (opcional)<input type="date" value={date(draft)} onChange={e=>{setDraft({...draft,due_at:e.target.value?e.target.value+'T12:00:00Z':null});setTaskDirty(true);}}/></label><label>Prioridad<select aria-label="Prioridad" value={draft.priority} onChange={e=>{setDraft({...draft,priority:e.target.value as Task['priority']});setTaskDirty(true);}}><option value="high">Alta</option><option value="normal">Normal</option><option value="low">Baja</option></select></label></div><label>Detalles<textarea rows={3} maxLength={10000} value={draft.note||''} onChange={e=>{setDraft({...draft,note:e.target.value});setTaskDirty(true);}}/></label><div className="professional-actions"><button className="professional-primary" type="submit">Guardar tarea</button><button type="button" onClick={()=>{if(!taskDirty||window.confirm('¿Descartar los cambios de la tarea?')){setDraft(null);setTaskDirty(false);}}}>Cancelar</button></div></fieldset></form>}
 <div className="professional-grid"><label>Mostrar<select aria-label="Mostrar" value={filter} onChange={e=>setFilter(e.target.value)}><option value="open">Pendientes</option><option value="today">Para hoy</option><option value="overdue">Vencidas</option><option value="upcoming">Próximas</option><option value="undated">Sin fecha</option><option value="done">Hechas</option><option value="all">Todas</option></select></label><label>Buscar<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar en mis tareas"/></label></div>
 <div className="professional-list">{!filtered.length&&<p>No hay tareas en esta vista.</p>}{filtered.map(task=><article key={task.id} className={'professional-task '+(task.status==='open'&&date(task)&&date(task)<now?'overdue':'')}><h3>{task.title}</h3><div className="professional-meta"><span>Prioridad {priorityLabel[task.priority].toLowerCase()}</span><span>{date(task)?new Date(date(task)+'T12:00:00Z').toLocaleDateString('es-ES',{timeZone:'Europe/Madrid'}):'Sin fecha límite'}</span><span>{task.status==='done'?'Hecha':task.status==='cancelled'?'Cancelada':date(task)&&date(task)<now?'Vencida':'Pendiente'}</span></div>{task.note&&<p className="professional-task-note">{task.note}</p>}<div className="professional-actions"><button disabled={busy} onClick={()=>edit(task)}>Editar</button><button disabled={busy||taskDirty} onClick={()=>void saveTask({...task,status:task.status==='done'?'open':'done'})}>{task.status==='done'?'Reabrir':'Marcar hecha'}</button></div></article>)}</div></section>
 <section className="professional-card professional-notebook"><p className="professional-kicker">BLOC PERSONAL</p><h2>Notas y próximos pasos</h2><p>Ideas, gestiones y cosas que quieres recordar de tu trabajo.</p><label>Mis notas<textarea aria-label="Mis notas" rows={16} maxLength={50000} autoComplete="off" value={notes} onChange={e=>{setNotes(e.target.value);setNoteMessage('Cambios sin guardar.');}} placeholder="Apunta aquí lo que no quieres olvidar…"/></label><button className="professional-primary" disabled={busy||!notesDirty} onClick={()=>void saveNotes()}>{busy?'Guardando…':'Guardar notas'}</button><p role="status">{noteMessage}</p>{notebook.updated_at&&<small>Último guardado: {new Date(notebook.updated_at).toLocaleString('es-ES')}</small>}</section></div></>}
 </main>;
}
