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
 const monthLabel=new Date(now+'T12:00:00Z').toLocaleDateString('es-ES',{month:'long',year:'numeric',timeZone:'Europe/Madrid'});
  return <section className="res-overview" aria-labelledby="res-overview-title">
    <div className="res-heading">
      <div><h2 id="res-overview-title">Tu trabajo en residencia</h2><p className="res-help">Revisa lo pendiente y accede al historial de cada persona.</p></div>
      <button type="button" onClick={onSchedule}>Ver horario</button>
    </div>
    <div className="res-stats res-no-print">
      <button type="button" onClick={onDirectory}><strong>{active.length}</strong> residentes activos</button>
      <a href="#res-pending-reviews"><strong>{reviews.length}</strong> valoraciones por programar o revisar</a>
      <a href="#res-pending-goals"><strong>{pendingPiai.length}</strong> PIAI por revisar</a>
    </div>
    <TodayPanel residents={residents} onOpen={onOpen} onSchedule={onSchedule}/>
    <div className="res-overview-grid">
      <section className="res-content" id="res-pending-reviews" aria-labelledby="res-review-title">
        <h3 id="res-review-title">Valoraciones pendientes</h3>
        {reviews.length ? reviews.slice(0,allReviews?undefined:8).map(r => <article className="res-review-item" key={r.id}>
          <div><strong>{r.data.profile.name || r.code}</strong><p>{r.center}</p><small>{nextReview(r) ? 'Revisión prevista: ' + nextReview(r) : 'Sin revisión programada'}</small></div>
          <button type="button" onClick={() => onOpen(r, 'assessments')}>Revisar valoración</button>
        </article>) : <p>No hay valoraciones pendientes.</p>}{reviews.length>8&&<button type="button" onClick={()=>setAllReviews(v=>!v)}>{allReviews?'Mostrar solo las primeras 8':'Ver las '+reviews.length+' valoraciones pendientes'}</button>}
      </section>
      <section className="res-content" id="res-pending-goals" aria-labelledby="res-goals-title">
        <h3 id="res-goals-title">PIAI por revisar</h3>
        <label>Seleccionar residente<select aria-label="Residente con PIAI por revisar" value={selected} disabled={saving} onChange={e=>setSelected(e.target.value)}><option value="">Selecciona un residente…</option>{active.filter(r=>r.data.profile.piaiReviewPending!=='true').sort((a,b)=>(a.data.profile.name||a.code).localeCompare(b.data.profile.name||b.code,'es')).map(r=><option key={r.id} value={r.id}>{r.data.profile.name||r.code} · {r.code} · {r.center}</option>)}</select></label>
        <label className="res-piai-date">Fecha de revisión PIAI<input type="date" value={piaiDate} onChange={e=>setPiaiDate(e.target.value)}/></label><button type="button" disabled={saving||!selected} onClick={()=>{const r=active.find(r=>r.id===selected);if(r)void markReview(r,true,piaiDate);}}>Añadir a pendientes</button>
        {pendingPiai.length ? pendingPiai.map(r => <article className="res-review-item" key={r.id}>
          <div><strong>{r.data.profile.name || r.code}</strong><p>{r.center}</p><label className="res-piai-date">Revisión PIAI de {r.data.profile.name||r.code}<input type="date" disabled={saving} value={r.data.profile.piaiReviewDate||''} onChange={e=>void markReview(r,true,e.target.value)}/></label></div>
          <div className="res-toolbar"><button type="button" disabled={saving} onClick={() => onOpen(r, 'goals')}>Revisar PIAI</button><button type="button" disabled={saving} onClick={()=>void markReview(r,false)}>Quitar de pendientes</button></div>
        </article>) : <p>No hay PIAI pendientes de revisión.</p>}
      </section>
      <section className="res-content" aria-labelledby="res-drafts-title"><h3 id="res-drafts-title">Informes por terminar</h3>{active.flatMap(r=>r.data.reports.filter(e=>e.state!=='Finalizado').map(e=><article className="res-review-item" key={r.id+e.id}><div><strong>{r.data.profile.name||r.code}</strong><p>{e.title} · {e.state||'Borrador'}</p></div><button type="button" onClick={()=>onOpen(r,'reports',e)}>Continuar informe</button></article>))}{!active.some(r=>r.data.reports.some(e=>e.state!=='Finalizado'))&&<p>No hay informes pendientes.</p>}</section>
      <section className="res-content" aria-labelledby="res-actions-title">
        <h3 id="res-actions-title">Actuaciones pendientes</h3>
        <ResidenceTaskChecklist/>
        <details><summary>Recordatorios vinculados a los historiales</summary>{actions.length ? actions.map(({resident: r, kind, entry: e}) => <article className="res-review-item" key={r.id + kind + e.id}>
          <div><strong>{r.data.profile.name || r.code}</strong><p>{sections.find(s => s.key === kind)?.title}</p><small>Previsto: {e.next}</small></div>
          <button type="button" onClick={() => onOpen(r, kind, e)}>Ver actuación</button>
        </article>) : <p>No hay recordatorios con fecha de revisión pendiente.</p>}</details>
      </section>
      <section className="res-content" aria-labelledby="res-upcoming-title">
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
  </section>;
}
