'use client';
import type {Entry,Resident} from './model';
import {goalFollowups,resolveSource,sourceOptions} from './clinical-workflow';

export function GoalSourceEditor({resident,entry,onChange}:{resident:Resident;entry:Entry;onChange:(e:Entry)=>void}){
 const options=sourceOptions(resident),source=resolveSource(resident,entry.sourceRef||'');
 return <div className="res-goal-source"><label>Valoración o registro de origen<select value={entry.sourceRef||''} onChange={ev=>{const selected=options.find(s=>s.value===ev.target.value);onChange({...entry,sourceRef:ev.target.value,sourceLabel:selected?.label||''});}}><option value="">Sin vincular / objetivo definido en entrevista</option>{entry.sourceRef&&!source&&<option value={entry.sourceRef}>Origen no disponible · revisar vinculación</option>}{options.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</select></label><p className="res-help">Vincula la evidencia de partida. La situación basal, el indicador y la intervención se completan con tu criterio profesional.</p></div>;
}
export function GoalProgress({resident,goal,onFollowup,disabled}:{resident:Resident;goal:Entry;onFollowup:(goal:Entry)=>void;disabled:boolean}){
 const notes=goalFollowups(resident,goal.id),source=resolveSource(resident,goal.sourceRef||'');
 return <section className="res-goal-progress" aria-label="Seguimiento del objetivo PIAI">
 {goal.sourceRef&&<p><strong>Origen: </strong>{source?.label||goal.sourceLabel||'Registro no disponible'}{!source?' · El registro de origen no está disponible.':''}</p>}
 <h4>Seguimientos vinculados · {notes.length}</h4>
 {notes.length?<ul>{notes.map(note=><li key={note.id}><strong>{note.date||'Sin fecha'} · {note.goalReview||'Sin valoración del objetivo'}</strong><p>{note.goalEvidence||note.response||note.observation}</p>{note.professional&&<small>{note.professional}</small>}</li>)}</ul>:<p className="res-help">Todavía no hay seguimientos vinculados a este objetivo.</p>}
 <p className="res-help">El estado del objetivo se revisa en su ficha; registrar un seguimiento no lo cambia automáticamente.</p>
 <button className="res-no-print" type="button" disabled={disabled} onClick={()=>onFollowup(goal)}>+ Seguimiento de este objetivo</button>
 </section>;
}
