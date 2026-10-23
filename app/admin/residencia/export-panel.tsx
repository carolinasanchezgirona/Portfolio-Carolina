'use client';
import {useState} from 'react';
import type {Resident} from './model';
import {today} from './model';
import {residenceApi as api} from './api';
import {offlineStatus} from './offline-store';
import {addDays} from './schedule-model';
import {completeDocument,piaiReasons,weeklyPiaiDocument,weekRange} from './export-model';
import type {ExportBundle} from './export-model';
import './export-panel.css';

async function allRows<T>(path:string,size=500):Promise<T[]>{
 let all:T[]=[];for(let offset=0;;offset+=size){const page=await api(path+'&limit='+size+'&offset='+offset);if(!Array.isArray(page))throw Error('La respuesta de exportación no es válida.');all=all.concat(page);if(page.length<size)return all;}
}
export default function ResidenceExports({residents,disabled=false}:{residents:Resident[];disabled?:boolean}){
 const [open,setOpen]=useState(false),[mode,setMode]=useState('complete'),[date,setDate]=useState(today),[undated,setUndated]=useState(true);
 const [excluded,setExcluded]=useState<string[]>([]),[extra,setExtra]=useState<string[]>([]),[add,setAdd]=useState('');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const range=weekRange(date||today());
 const candidates=residents.filter(r=>r.status==='active'&&(piaiReasons(r,range.from,range.to,undated).length||extra.includes(r.id))).sort((a,b)=>(a.data.profile.name||a.code).localeCompare(b.data.profile.name||b.code,'es'));
 const selected=candidates.filter(r=>!excluded.includes(r.id));
 function reset(){setExcluded([]);setExtra([]);setMessage('');}
 async function download(){
  if(busy||disabled)return;setBusy(true);setMessage('Preparando el PDF…');
  try{
   const {downloadPdf}=await import('./pdf-export');
   const createdAt=new Date().toISOString();
   if(mode==='weekly'){
    if(!selected.length)throw Error('Selecciona al menos un residente para el PIAI semanal.');
    await downloadPdf(weeklyPiaiDocument(selected,range.from,range.to,createdAt));
   }else{
    const [schedule,types,campaigns,materials,tasks]=await Promise.all([
     allRows<ExportBundle['schedule'][number]>('/rest/v1/residence_schedule?select=*&order=event_date.asc,start_min.asc,id.asc'),
     allRows<ExportBundle['types'][number]>('/rest/v1/residence_schedule_types?select=*&order=label.asc,id.asc'),
     allRows<ExportBundle['campaigns'][number]>('/rest/v1/residence_assessment_campaigns?select=*&order=start_date.desc,id.asc',100),
     allRows<ExportBundle['materials'][number]>('/rest/v1/residence_materials?select=*&order=created_at.desc,id.asc',100),
     allRows<ExportBundle['tasks'][number]>('/rest/v1/clinical_admin_tasks?patient_id=is.null&note=eq.residence-checklist-v1&select=*&order=due_at.asc,id.asc'),
    ]);
    await downloadPdf(completeDocument({residents:structuredClone(residents),schedule,types,campaigns,materials,tasks},createdAt));
   }
   setMessage('PDF generado. Revisa las descargas de tu dispositivo.');
  }catch(error){setMessage('No se ha completado la exportación. '+(error as Error).message);}finally{setBusy(false);}
 }
 return <section className="res-exports res-no-print" aria-label="Exportaciones de residencia">
  <button type="button" aria-expanded={open} disabled={busy} onClick={()=>setOpen(v=>!v)}>Exportar PDF</button>
  {open&&<div className="res-export-panel">
   <h2>Exportar información</h2>
   <fieldset disabled={busy||disabled}><legend>Contenido del documento</legend><div className="res-export-modes"><label><input type="radio" name="res-export-mode" checked={mode==='complete'} onChange={()=>{setMode('complete');setMessage('');}}/>Volcado completo</label><label><input type="radio" name="res-export-mode" checked={mode==='weekly'} onChange={()=>{setMode('weekly');setMessage('');}}/>Solo PIAI de la semana</label></div>
   {mode==='complete'?<><p>Todos los residentes ({residents.length}), incluidos archivados y exitus: ficha, valoraciones y respuestas, diario, PIAI, informes, entrevistas, actividades, incidencias y documentación registrada.</p><p>Necesita conexión para comprobar todos los apartados. También incluye horario, campañas, tareas y biblioteca de materiales con sus soluciones. Las referencias a documentos externos se conservan; los archivos externos no se incorporan.</p></>:<>
    <div className="res-toolbar"><button type="button" onClick={()=>{setDate(addDays(range.from,-7));reset();}}>← Semana anterior</button><label>Semana de los PIAI<input type="date" required value={date} onChange={e=>{setDate(e.target.value);reset();}}/></label><button type="button" onClick={()=>{setDate(addDays(range.from,7));reset();}}>Semana siguiente →</button></div>
    <p>Del {range.from} al {range.to} (lunes a domingo). Se incluyen revisiones de objetivos y reuniones PIAI previstas o registradas esa semana.</p>
    <label className="res-check"><input type="checkbox" checked={undated} onChange={e=>{setUndated(e.target.checked);setExcluded([]);}}/>Incluir PIAI pendientes sin fecha asignada</label>
    <div className="res-toolbar"><label>Añadir otro residente al PDF<select value={add} onChange={e=>setAdd(e.target.value)}><option value="">Selecciona un residente…</option>{residents.filter(r=>r.status==='active'&&!candidates.some(c=>c.id===r.id)).map(r=><option key={r.id} value={r.id}>{r.data.profile.name||r.code} · {r.center}</option>)}</select></label><button type="button" disabled={!add} onClick={()=>{setExtra(old=>[...old,add]);setAdd('');}}>Añadir al documento</button></div>
    <p><strong>{selected.length} residentes seleccionados</strong> · Objetivos, preferencias, apoyos, síntesis clínica y acuerdos PIAI. El resto del historial queda fuera de este documento.</p>
    <ul className="res-export-residents">{candidates.map(r=><li key={r.id}><label><input type="checkbox" checked={!excluded.includes(r.id)} onChange={e=>setExcluded(old=>e.target.checked?old.filter(id=>id!==r.id):[...old,r.id])}/><span><strong>{r.data.profile.name||r.code}</strong><small>{r.code} · {r.center}</small><small>{piaiReasons(r,range.from,range.to,undated).join(' · ')||'Añadido manualmente'}</small></span></label></li>)}</ul>
    {!candidates.length&&<p>No hay PIAI previstos para esta semana. Puedes añadir residentes al documento.</p>}
   </>}
   <button type="button" disabled={!residents.length||(mode==='weekly'&&(!date||!selected.length))} onClick={()=>void download()}>Descargar {mode==='weekly'?'PIAI semanal':'volcado completo'} en PDF</button>
   </fieldset>
   {disabled&&<p role="status">Guarda o cierra los cambios en edición antes de exportar.</p>}
   {offlineStatus().pending>0&&<p>Hay cambios guardados en este dispositivo pendientes de sincronización. Se incluyen en el contenido disponible.</p>}
   <p role="status" aria-live="polite">{message}</p>
  </div>}
 </section>;
}
