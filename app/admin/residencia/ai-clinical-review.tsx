'use client';
import {useState} from 'react';
import type {Entry,Resident} from './model';

type Domain={name:string;status:string;argument:string;evidence:string[];contradictions:string[];missing:string[]};
type Analysis={summary:string;domains:Domain[];integrated_interpretation:string;piai:{domain:string;objective:string;indicator:string}[];residence:string[];family:string[];caveats:string[]};
export default function AiClinicalReview({records,resident,onAdopt}:{records:Entry[];resident:Resident;onAdopt:(entry:Entry)=>void}){
 const [analysis,setAnalysis]=useState<Analysis|null>(null);
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const clean=records.filter(e=>e.validity==='Aplicado').map(e=>Object.fromEntries(Object.entries(e).filter(([key])=>['date','instrument','version','language','education','validity','comparability','score','maximum','errors','items','adjustment','stage','correct','durationSeconds','modality','stimulus','method','orientationTime','orientationPlace','registration','attention','recall','naming','repetition','commands','reading','writing','copying','conditions','executionNotes','interpretation','qualitative','clinicalChange','direction'].includes(key))));
 async function run(){
  setBusy(true);setError('');setAnalysis(null);
  try{
   const session=JSON.parse(sessionStorage.getItem('dememoria_admin_session')||'null');
   if(!session?.access_token)throw Error('Inicia sesión en el administrador.');
   const resp=await fetch('/api/residence/clinical-analysis',{method:'POST',headers:{Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'},body:JSON.stringify({assessments:clean})});
   const data=await resp.json();
   if(!resp.ok)throw Error(data.error||'No se ha podido generar el análisis.');
   if(!data.analysis||!Array.isArray(data.analysis.domains))throw Error('Respuesta de análisis incompleta.');
   setAnalysis(data.analysis);
  }catch(e){setError(e instanceof Error?e.message:'Error en el análisis.');}
  finally{setBusy(false);}
 }
 return <section className="res-ai-review res-no-print" aria-label="Interpretación clínica asistida por IA">
  <div className="res-heading"><div><h3>Interpretación integrada con IA</h3><p className="res-help">Contraste razonado de resultados, dominios y evolución. Borrador sujeto a revisión clínica.</p></div><button type="button" disabled={busy||!clean.length} onClick={()=>void run()}>{busy?'Analizando…':'Analizar valoraciones con IA'}</button></div>
  {!clean.length&&<p>Registra una valoración completa antes de solicitar el análisis.</p>}{error&&<p role="alert">{error}</p>}
  {analysis&&<div className="res-ai-output"><h4>Síntesis</h4><p>{analysis.summary}</p><p>{analysis.integrated_interpretation}</p><h4>Dominios e hipótesis clínicas</h4>{analysis.domains.map((d,i)=><article key={i} className="res-domain-card"><h4>{d.name} · {d.status}</h4><p>{d.argument}</p>{d.evidence?.length>0&&<p><strong>A favor:</strong> {d.evidence.join(' · ')}</p>}{d.contradictions?.length>0&&<p><strong>Discrepancias:</strong> {d.contradictions.join(' · ')}</p>}{d.missing?.length>0&&<p><strong>Por comprobar:</strong> {d.missing.join(' · ')}</p>}</article>)}
   <h4>Objetivos sugeridos de PIAI</h4>{analysis.piai.map((item,i)=><article className="res-ai-proposal" key={i}><p><strong>{item.domain}:</strong> {item.objective}</p><p>Indicador: {item.indicator}</p><button type="button" onClick={()=>onAdopt({id:crypto.randomUUID(),date:new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Madrid'}),area:item.domain,objective:item.objective,indicator:item.indicator,baseline:analysis.summary,intervention:'Pendiente de acordar con la persona y el equipo.',state:'Pendiente',evaluation:'Propuesta generada por IA, pendiente de revisión profesional.'})}>Revisar en PIAI</button></article>)}
   <h4>Pautas para residencia</h4><ul>{analysis.residence?.map((v,i)=><li key={i}>{v}</li>)}</ul><h4>Pautas para la familia</h4><ul>{analysis.family?.map((v,i)=><li key={i}>{v}</li>)}</ul><h4>Limitaciones</h4><ul>{analysis.caveats?.map((v,i)=><li key={i}>{v}</li>)}</ul>
   <p className="res-help">Análisis generado en esta sesión, no guardado automáticamente en el historial. Debe contrastarse con baremos, observación, anamnesis y funcionalidad antes de incorporarlo al PIAI.</p>
  </div>}
 </section>;
}
