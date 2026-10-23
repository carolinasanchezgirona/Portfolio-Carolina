'use client';
import {useState} from 'react';
import type {Entry, Kind, Resident} from './model';
import {newEntry,nextReview, sections, today} from './model';

import {monthlyFollowups} from './followup-planning';
import ResidenceTaskChecklist from './task-checklist';
import TodayPanel from './today-panel';

const displayDate=(date:string)=>new Date(date+'T12:00:00Z').toLocaleDateString('es-ES',{timeZone:'Europe/Madrid'});

type Props = {
  residents: Resident[];
  onSetPiaiReview: (resident: Resident, pending: boolean, date?:string) => Promise<boolean>;
  onDirectory: () => void;
  onSchedule: () => void;
  onOpen: (resident: Resident, kind?: Kind | 'profile', entry?: Entry | null) => void;
};

export default function ResidenceOverview({residents, onDirectory, onSchedule, onOpen, onSetPiaiReview}: Props) {
  const now = today();
  const active = residents.filter(r => r.status === 'active');
  const reviews = active.filter(r => !nextReview(r) || nextReview(r) <= now)
    .sort((a, b) => nextReview(a).localeCompare(nextReview(b)));
  const [selected,setSelected]=useState('');
  const [view,setView]=useState('today');
  function openView(value:string){setView(value);setAllReviews(false);setAllFollowups(false);}

  const [saving,setSaving]=useState(false),[allReviews,setAllReviews]=useState(false),[allFollowups,setAllFollowups]=useState(false);
  const [piaiDate,setPiaiDate]=useState(today),[query,setQuery]=useState(''),[followFilter,setFollowFilter]=useState('all');
  const pendingPiai=active.filter(r=>r.data.profile.piaiReviewPending==='true').sort((a,b)=>(a.data.profile.name||a.code).localeCompare(b.data.profile.name||b.code,'es'));
  async function markReview(r:Resident,pending:boolean,date?:string){if(saving)return;setSaving(true);try{if(await onSetPiaiReview(r,pending,date))setSelected('');}finally{setSaving(false);}}
  const actions = active.flatMap(r => (['followups', 'interviews', 'scales', 'meetings', 'incidents', 'documents'] as Kind[])
    .flatMap(kind => r.data[kind].filter(e => e.next && e.next <= now)
      .map(entry => ({resident: r, kind, entry}))))
    .sort((a, b) => a.entry.next.localeCompare(b.entry.next));
  const upcoming = active.filter(r=>!r.data.profile.admission||r.data.profile.admission<=now).map(resident=>({resident,plan:monthlyFollowups(resident,now)}))
    .sort((a,b)=>a.plan.next.localeCompare(b.plan.next)||(a.resident.data.profile.name||a.resident.code).localeCompare(b.resident.data.profile.name||b.resident.code,'es'));
  const filteredUpcoming=upcoming.filter(({resident:r,plan})=>(!query||(r.data.profile.name+' '+r.code).toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')))&&(followFilter==='all'||followFilter==='pending'&&plan.remaining>0||followFilter==='due'&&(plan.overdue||plan.dueToday)||followFilter==='complete'&&plan.remaining===0));
 const drafts=active.flatMap(r=>r.data.reports.filter(e=>e.state!=='Finalizado').map(entry=>({resident:r,entry})));
  const dueFollowups=upcoming.filter(x=>x.plan.overdue||x.plan.dueToday);
  const priorities=[
   ...reviews.filter(r=>nextReview(r)&&nextReview(r)<=now).map(r=>({id:r.id+'review',resident:r,date:nextReview(r),label:'Valoración pendiente',kind:'assessments' as Kind,entry:null as Entry|null})),
   ...pendingPiai.filter(r=>r.data.profile.piaiReviewDate&&r.data.profile.piaiReviewDate<=now).map(r=>({id:r.id+'piai',resident:r,date:r.data.profile.piaiReviewDate,label:'Revisar PIAI',kind:'goals' as Kind,entry:null as Entry|null})),
   ...dueFollowups.map(({resident:r,plan})=>({id:r.id+'followup',resident:r,date:plan.next,label:'Registrar seguimiento',kind:'followups' as Kind,entry:newEntry('followups')})),
   ...actions.filter(a=>a.kind!=='followups').map(a=>({id:a.resident.id+a.kind+a.entry.id,resident:a.resident,date:a.entry.next,label:sections.find(s=>s.key===a.kind)?.title||'Actuación',kind:a.kind,entry:a.entry}))
  ].sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
  const tabs=[{key:'today',label:'Hoy'},{key:'tasks',label:'Tareas'},{key:'followups',label:'Seguimientos',count:upcoming.filter(x=>x.plan.remaining>0).length},{key:'reviews',label:'Valoraciones',count:reviews.length},{key:'piai',label:'PIAI',count:pendingPiai.length},{key:'reports',label:'Informes',count:drafts.length}];
 const monthLabel=new Date(now+'T12:00:00Z').toLocaleDateString('es-ES',{month:'long',year:'numeric',timeZone:'Europe/Madrid'});
  return <section className="res-overview" aria-labelledby="res-overview-title">
    <div className="res-heading">
      <div><h2 id="res-overview-title">Bienvenida, Carolina</h2><p className="res-help">Qué toca hoy, qué está pendiente y dónde continuar.</p></div>
      <button type="button" onClick={onSchedule}>Ver horario</button>
    </div>
    <div className="res-dashboard-summary">
      <button type="button" onClick={()=>openView('today')}><strong>{priorities.length}</strong><span>Revisiones clínicas vencidas o para hoy</span></button>
      <button type="button" onClick={()=>{openView('followups');setFollowFilter('pending');}}><strong>{upcoming.reduce((n,x)=>n+x.plan.remaining,0)}</strong><span>Seguimientos para completar el mes</span></button>
      <button type="button" onClick={onDirectory}><strong>{active.length}</strong><span>Residentes activos · abrir listado</span></button>
    </div>
    <nav className="res-dashboard-tabs" aria-label="Pendientes de residencia">{tabs.map(tab=><button key={tab.key} type="button" aria-pressed={view===tab.key} onClick={()=>openView(tab.key)}>{tab.label}{tab.count!==undefined&&<span>{tab.count}</span>}</button>)}</nav>
    {view==='today'&&<section className="res-content res-priority-panel" aria-labelledby="res-priority-title">
      <div className="res-heading"><h3 id="res-priority-title">Primero, lo que requiere atención</h3><small>{priorities.length} pendientes con fecha</small></div>
      {priorities.slice(0,5).map(item=><article className="res-priority-row" key={item.id}><div><strong>{item.resident.data.profile.name||item.resident.code}</strong><p>{item.label} · <span>{item.date<now?'Vencido: ':'Hoy: '}{displayDate(item.date)}</span></p></div><button type="button" onClick={()=>onOpen(item.resident,item.kind,item.entry)}>Abrir</button></article>)}
      {!priorities.length&&<p>No hay pendientes con fecha vencida o para hoy. Revisa las tareas y los pendientes sin fecha en sus apartados.</p>}
      {priorities.length>5&&<details><summary>Ver los {priorities.length-5} pendientes restantes</summary>{priorities.slice(5).map(item=><article className="res-priority-row" key={item.id}><div><strong>{item.resident.data.profile.name||item.resident.code}</strong><p>{item.label} · {displayDate(item.date)}</p></div><button type="button" onClick={()=>onOpen(item.resident,item.kind,item.entry)}>Abrir</button></article>)}</details>}
    </section>}
    {view==='today'&&<TodayPanel residents={residents} onOpen={onOpen} onSchedule={onSchedule}/>}
    <div className="res-overview-grid res-dashboard-panels">
      <section className="res-content" id="res-pending-reviews" hidden={view!=='reviews'} aria-labelledby="res-review-title">
        <h3 id="res-review-title">Valoraciones pendientes</h3>
        {reviews.length ? reviews.slice(0,allReviews?undefined:8).map(r => <article className="res-review-item" key={r.id}>
          <div><strong>{r.data.profile.name || r.code}</strong><p>{r.center}</p><small>{nextReview(r) ? 'Revisión prevista: ' + nextReview(r) : 'Sin revisión programada'}</small></div>
          <button type="button" onClick={() => onOpen(r, 'assessments')}>Revisar valoración</button>
        </article>) : <p>No hay valoraciones pendientes.</p>}{reviews.length>8&&<button type="button" onClick={()=>setAllReviews(v=>!v)}>{allReviews?'Mostrar solo las primeras 8':'Ver las '+reviews.length+' valoraciones pendientes'}</button>}
      </section>
      <section className="res-content" id="res-pending-goals" hidden={view!=='piai'} aria-labelledby="res-goals-title">
        <h3 id="res-goals-title">PIAI por revisar</h3>
        <label>Seleccionar residente<select aria-label="Residente con PIAI por revisar" value={selected} disabled={saving} onChange={e=>setSelected(e.target.value)}><option value="">Selecciona un residente…</option>{active.filter(r=>r.data.profile.piaiReviewPending!=='true').sort((a,b)=>(a.data.profile.name||a.code).localeCompare(b.data.profile.name||b.code,'es')).map(r=><option key={r.id} value={r.id}>{r.data.profile.name||r.code} · {r.code} · {r.center}</option>)}</select></label>
        <label className="res-piai-date">Fecha de revisión PIAI<input type="date" value={piaiDate} onChange={e=>setPiaiDate(e.target.value)}/></label><button type="button" disabled={saving||!selected} onClick={()=>{const r=active.find(r=>r.id===selected);if(r)void markReview(r,true,piaiDate);}}>Añadir a pendientes</button>
        {pendingPiai.length ? pendingPiai.map(r => <article className="res-review-item" key={r.id}>
          <div><strong>{r.data.profile.name || r.code}</strong><p>{r.center}</p><label className="res-piai-date">Revisión PIAI de {r.data.profile.name||r.code}<input type="date" disabled={saving} value={r.data.profile.piaiReviewDate||''} onChange={e=>void markReview(r,true,e.target.value)}/></label></div>
          <div className="res-toolbar"><button type="button" disabled={saving} onClick={() => onOpen(r, 'goals')}>Revisar PIAI</button><button type="button" disabled={saving} onClick={()=>void markReview(r,false)}>Quitar de pendientes</button></div>
        </article>) : <p>No hay PIAI pendientes de revisión.</p>}
      </section>
      <section className="res-content" hidden={view!=='reports'} aria-labelledby="res-drafts-title"><h3 id="res-drafts-title">Informes por terminar</h3>{active.flatMap(r=>r.data.reports.filter(e=>e.state!=='Finalizado').map(e=><article className="res-review-item" key={r.id+e.id}><div><strong>{r.data.profile.name||r.code}</strong><p>{e.title} · {e.state||'Borrador'}</p></div><button type="button" onClick={()=>onOpen(r,'reports',e)}>Continuar informe</button></article>))}{!active.some(r=>r.data.reports.some(e=>e.state!=='Finalizado'))&&<p>No hay informes pendientes.</p>}</section>
      <section className="res-content" hidden={view!=='tasks'&&view!=='today'} aria-labelledby="res-actions-title">
        <h3 id="res-actions-title">Actuaciones pendientes</h3>
        <ResidenceTaskChecklist/>
        <details open><summary>Recordatorios vinculados a los historiales ({actions.length})</summary>{actions.length ? actions.map(({resident: r, kind, entry: e}) => <article className="res-review-item" key={r.id + kind + e.id}>
          <div><strong>{r.data.profile.name || r.code}</strong><p>{sections.find(s => s.key === kind)?.title}</p><small>Previsto: {e.next}</small></div>
          <button type="button" onClick={() => onOpen(r, kind, e)}>Ver actuación</button>
        </article>) : <p>No hay recordatorios con fecha de revisión pendiente.</p>}</details>
      </section>
      <section className="res-content" hidden={view!=='followups'} aria-labelledby="res-upcoming-title">
        <h3 id="res-upcoming-title">Próximas revisiones · Seguimientos</h3>
        <p className="res-help">Mínimo de 2 seguimientos al mes por residente · {monthLabel}. Fechas orientativas: día 15 y último día del mes.</p>
        <p className="res-help">Se cuentan los días con entradas marcadas para el seguimiento mensual. Varias anotaciones del mismo día cuentan como un seguimiento. Puedes excluir coordinaciones o notas que no correspondan.</p><div className="res-overview-filter"><label>Buscar seguimiento de residente<input value={query} onChange={e=>setQuery(e.target.value)}/></label><label>Mostrar seguimientos<select value={followFilter} onChange={e=>setFollowFilter(e.target.value)}><option value="all">Todos</option><option value="pending">Pendientes del mes</option><option value="due">Vencidos o para hoy</option><option value="complete">Mínimo completado</option></select></label></div>
        {upcoming.length ? filteredUpcoming.slice(0,allFollowups?undefined:8).map(({resident:r,plan}) => <article className="res-review-item" key={r.id}>
          <div><strong>{r.data.profile.name || r.code}</strong><p>{r.center} · {plan.completed}/2 realizados este mes</p>
          <p className={'res-followup-status'+(plan.overdue?' is-overdue':'')}>{plan.overdue?'Seguimiento pendiente desde el ':plan.dueToday?'Seguimiento para hoy: ':'Próximo seguimiento: '}{displayDate(plan.next)}</p>
          <small>{plan.remaining?plan.remaining+' seguimiento'+(plan.remaining===1?' pendiente':'s pendientes')+' para completar el mínimo mensual.':'Mínimo mensual completado.'}{plan.last?' Último seguimiento: '+displayDate(plan.last)+'.':' Sin seguimientos registrados.'}</small></div>
          <button type="button" onClick={() => onOpen(r, 'followups',newEntry('followups'))}>Registrar seguimiento</button>
        </article>) : <p>Añade residentes activos para ver sus próximos seguimientos.</p>}{filteredUpcoming.length>8&&<button type="button" onClick={()=>setAllFollowups(v=>!v)}>{allFollowups?'Mostrar solo los primeros 8':'Ver los '+filteredUpcoming.length+' residentes de esta lista'}</button>}{!!upcoming.length&&!filteredUpcoming.length&&<p>No hay residentes con estos filtros.</p>}
      </section>
    </div>
    <style>{`
     .res-dashboard-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0}
     .res-dashboard-summary button{display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:6px;padding:16px;background:#fff;border:1px solid #c8dfe0;border-radius:12px;color:#173a5e;min-width:0}
     .res-dashboard-summary strong{font-size:28px}.res-dashboard-summary span{font-size:13px;line-height:1.4}
     .res-dashboard-tabs{display:flex;flex-wrap:wrap;gap:8px;padding:12px 0;margin-bottom:12px}
     .res-dashboard-tabs button{display:flex;gap:8px;align-items:center;min-height:44px}
     .res-dashboard-tabs button[aria-pressed=true]{background:#173a5e;color:white;border-color:#173a5e}
     .res-dashboard-tabs span{border:1px solid currentColor;border-radius:20px;padding:1px 7px;font-size:12px}
     .res-dashboard-panels{grid-template-columns:minmax(0,1fr)}
     .res-dashboard-panels>[hidden]{display:none!important}
     .res-priority-panel{border-left:4px solid #f2766b;margin-bottom:16px}
     .res-priority-panel h3{margin:0;font-size:18px}
     .res-priority-row{display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid #edf7f7;padding:12px 0}
     .res-priority-row>div{min-width:0;overflow-wrap:anywhere}.res-priority-row p{margin:5px 0;font-size:13px}.res-priority-row button{flex-shrink:0}
     .res-overview button:focus-visible{outline:3px solid #08a6a0;outline-offset:3px}
     @media(max-width:600px){.res-dashboard-summary{gap:6px}.res-dashboard-summary button{padding:10px}.res-dashboard-summary strong{font-size:24px}.res-dashboard-summary span{font-size:12px}.res-dashboard-tabs{gap:6px}.res-dashboard-tabs button{padding:9px;font-size:13px}}
    `}</style>
  </section>;
}
