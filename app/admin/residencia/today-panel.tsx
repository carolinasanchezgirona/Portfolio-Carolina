'use client';
import {useEffect,useState} from 'react';
import type {Entry,Kind,Resident} from './model';
import {newEntry,today} from './model';
import {residenceApi as api} from './api';
import {syncedEvent} from './offline-store';
import type {AssessmentCampaign} from './campaign-model';
import {campaignPath} from './campaign-model';
import type {ScheduleEvent} from './schedule-model';
import {addDays,timeLabel} from './schedule-model';

export default function TodayPanel({residents,onOpen,onSchedule}:{residents:Resident[];onOpen:(r:Resident,kind?:Kind|'profile',record?:Entry|null)=>void;onSchedule:()=>void}){
 const [events,setEvents]=useState<ScheduleEvent[]>([]),[campaigns,setCampaigns]=useState<AssessmentCampaign[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[retry,setRetry]=useState(0),[selected,setSelected]=useState('');
 const now=today();
 useEffect(()=>{const refresh=()=>setRetry(n=>n+1);window.addEventListener(syncedEvent,refresh);window.addEventListener('residence-assessment-completed',refresh);return()=>{window.removeEventListener(syncedEvent,refresh);window.removeEventListener('residence-assessment-completed',refresh);};},[]);
 useEffect(()=>{let active=true;setLoading(true);setError('');void(async()=>{try{
  const [schedule,campaignRows]=await Promise.all([(async()=>{const all:ScheduleEvent[]=[];for(let offset=0;;offset+=500){const page=await api('/rest/v1/residence_schedule?select=id,event_date,start_min,end_min,category_id,title,center,resident_id,location,notes,status,revision&event_date=gte.2026-10-19&event_date=lte.'+addDays('2026-10-19',5)+'&order=event_date.asc,start_min.asc,id.asc&limit=500&offset='+offset);if(!Array.isArray(page))throw Error('Horario no disponible.');all.push(...page);if(page.length<500)return all;}})(),(async()=>{const all:AssessmentCampaign[]=[];for(let offset=0;;offset+=100){const page=await api(campaignPath+offset);if(!Array.isArray(page))throw Error('Campañas no disponibles.');all.push(...page);if(page.length<100)return all;}})()]);
  if(active){setEvents(schedule);setCampaigns(campaignRows);}
 }catch(e){if(active)setError((e as Error).message);}finally{if(active)setLoading(false);}})();return()=>{active=false;};},[retry]);
 const appointments=campaigns.flatMap(c=>c.data.slots.filter(s=>s.date===now&&s.status!=='cancelled'&&s.resident_id).map(s=>({...s,campaign:c.title})));
 const recurring=events.filter(e=>e.status!=='cancelled'&&new Date(e.event_date+'T12:00:00Z').getUTCDay()===new Date(now+'T12:00:00Z').getUTCDay());
 const picked=residents.find(r=>r.id===selected);
 return <section className="res-content" aria-labelledby="res-today-title"><div className="res-heading"><div><h3 id="res-today-title">Hoy · {new Date(now+'T12:00:00Z').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',timeZone:'Europe/Madrid'})}</h3><p className="res-help">Citas de campaña y referencia del horario habitual. Durante una campaña, revisa qué bloques ordinarios se sustituyen.</p></div><button type="button" onClick={onSchedule}>Organizar jornada</button></div>
  {loading?<p role="status">Cargando la jornada…</p>:error?<p role="status">No se ha podido cargar la jornada: {error} <button type="button" onClick={()=>setRetry(n=>n+1)}>Reintentar jornada</button></p>:<>
  <ul className="res-today-list">{appointments.sort((a,b)=>a.start_min-b.start_min).map(s=>{const r=residents.find(r=>r.id===s.resident_id);return <li key={s.id}><strong>{timeLabel(s.start_min)}-{timeLabel(s.end_min)} · {r?.data.profile.name||r?.code||'Residente no disponible'}</strong><small>{s.campaign} · {s.status==='done'?'Realizada':'Valoración programada'}</small>{r&&<button type="button" onClick={()=>onOpen(r,'scales')}>Abrir valoración</button>}</li>;})}</ul>
  {!appointments.length&&<p>No hay residentes con cita de campaña para hoy.</p>}
  <details><summary>Horario habitual de hoy ({recurring.length} bloques)</summary><ul className="res-today-list">{recurring.sort((a,b)=>a.start_min-b.start_min).map(e=><li key={e.id}><strong>{timeLabel(e.start_min)}-{timeLabel(e.end_min)} · {e.title}</strong><small>{e.center} · {e.location}</small>{e.resident_id&&residents.some(r=>r.id===e.resident_id)&&<button type="button" onClick={()=>onOpen(residents.find(r=>r.id===e.resident_id)!)}>Abrir residente</button>}</li>)}</ul></details></>}
  <label>Acción rápida para un residente<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Selecciona un residente…</option>{residents.filter(r=>r.status==='active').sort((a,b)=>(a.data.profile.name||a.code).localeCompare(b.data.profile.name||b.code,'es')).map(r=><option key={r.id} value={r.id}>{r.data.profile.name||r.code} · {r.code}</option>)}</select></label>
  <div className="res-quick-actions"><button type="button" disabled={!picked} onClick={()=>picked&&onOpen(picked,'followups',newEntry('followups'))}>Registrar seguimiento</button><button type="button" disabled={!picked} onClick={()=>picked&&onOpen(picked,'scales')}>Nueva valoración</button><button type="button" disabled={!picked} onClick={()=>picked&&onOpen(picked,'reports',newEntry('reports'))}>Redactar informe</button></div>
 </section>;
}
