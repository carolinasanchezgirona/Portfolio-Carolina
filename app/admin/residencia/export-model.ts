import type {Entry, Kind, Resident} from './model';
import {sections} from './model';
import {behaviorFields,goalLabel,resolveSource} from './clinical-workflow';
import {profileGroups} from './profile-fields';
import {reportSections} from './care-documentation';
import {testFields} from './test-fields';
import {mmseGroups,mmseItemKey} from './mmse-items';
import type {AssessmentCampaign} from './campaign-model';
import type {ScheduleEvent, ScheduleType} from './schedule-model';
import {addDays, monday, timeLabel, weekDays} from './schedule-model';
import type {Material} from './material-generator';

export type ExportTask={id:string;title:string;due_at:string|null;status:string;completed_at?:string|null};
export type ExportBundle={residents:Resident[];schedule:ScheduleEvent[];types:ScheduleType[];campaigns:AssessmentCampaign[];materials:Material[];tasks:ExportTask[]};
export type ExportBlock={type:'title'|'heading'|'text'|'image';text:string;value?:string;page?:boolean};
export type ExportDocument={title:string;subtitle:string;filename:string;blocks:ExportBlock[];createdAt:string};
export function weekRange(date:string){const from=monday(date);return {from,to:addDays(from,6)};}
const within=(date:string,from:string,to:string)=>!!date&&date>=from&&date<=to;
const latest=(entries:Entry[])=>[...entries].sort((a,b)=>(b.date||'').localeCompare(a.date||'')||(b.createdAt||'').localeCompare(a.createdAt||''))[0];
const activeGoal=(e:Entry)=>!['Cerrado','Alcanzado','Reformulado'].includes(e.state);
export function piaiReasons(r:Resident,from:string,to:string,includeUndated=true){
 const p=r.data.profile,reasons:string[]=[];
 if(p.piaiReviewPending==='true'&&within(p.piaiReviewDate,from,to))reasons.push('Revisión PIAI: '+p.piaiReviewDate);
 if(includeUndated&&p.piaiReviewPending==='true'&&!p.piaiReviewDate)reasons.push('PIAI pendiente sin fecha asignada');
 for(const e of r.data.goals){if(activeGoal(e)&&within(e.next,from,to))reasons.push('Objetivo por revisar: '+e.next);if(within((e.updatedAt||e.createdAt||e.date||'').slice(0,10),from,to))reasons.push('Objetivo PIAI registrado o actualizado esta semana');}
 for(const e of r.data.meetings){if(within(e.next,from,to))reasons.push('Coordinación / PIAI: '+e.next);if(within(e.date,from,to))reasons.push('Reunión registrada: '+e.date);}
 return [...new Set(reasons)];
}
const extraLabels:Record<string,string>={
 ...Object.fromEntries(behaviorFields),behaviorRecord:'Registro conductual estructurado',goalId:'Objetivo PIAI vinculado',goalReview:'Valoración del objetivo',goalEvidence:'Indicador observado / evidencia del resultado',sourceRef:'Registro de origen',sourceLabel:'Referencia del registro de origen',
 geriatricFormat:'Modalidad de registro de la prueba',geriCategory:'Categoría de Katz',resultSummary:'Resultado descriptivo',informant:'Informante',sourceUrl:'Fuente del protocolo',protocolReference:'Referencia del protocolo aplicado',
 code:'Código',center:'Centro',status:'Estado',createdAt:'Fecha y hora de creación',updatedAt:'Última edición',
 piaiReviewPending:'PIAI pendiente de revisión',piaiReviewDate:'Fecha de revisión del PIAI',
 topics:'Temáticas',source:'Fuente',executionNotes:'Observaciones de ejecución',validity:'Estado de aplicación',
 version:'Versión',maximum:'Puntuación máxima',answers:'Respuestas registradas',subscores:'Puntuaciones por dominios',
 copyImage:'Dibujo de copia',clockImage:'Dibujo del reloj',periodFrom:'Inicio del periodo',periodTo:'Fin del periodo',
 reportType:'Tipo de informe',purpose:'Finalidad',registration:'Número de colegiación',reviewed:'Revisado por la profesional',
 sourceAt:'Fecha de recuperación de la información',countForMonthly:'Cuenta como seguimiento mensual',
};
const profileLabels=Object.fromEntries(profileGroups.flatMap(g=>g.fields.map(([key,label])=>[key,label.split('|')[0]])));
const mmseLabels=Object.fromEntries(mmseGroups.flatMap(group=>[[group.key,group.title],['mmse_note_'+group.key,'Notas de '+group.title],...group.items.flatMap(item=>[[mmseItemKey(item.key),group.title+' · '+item.prompt+' · Puntuación'],[mmseItemKey(item.key,'response'),group.title+' · '+item.prompt+' · Respuesta']])]));
const labels:Record<string,string>={...Object.fromEntries(profileGroups.flatMap(g=>g.fields.map(([key,label])=>[key,label.split('|')[0]]))),...Object.fromEntries(sections.flatMap(s=>s.fields.map(([key,label])=>[key,label.split('|')[0]]))),...Object.fromEntries(reportSections),...extraLabels};
export const fieldLabel=(key:string)=>labels[key]||key.replace(/([a-z])([A-Z])/g,'$1 $2').replaceAll('_',' ');
function readable(value:unknown):string{
 if(value===true||value==='true')return 'Sí';if(value===false||value==='false')return 'No';
 if(Array.isArray(value))return value.map(readable).join('\n');
 if(value&&typeof value==='object')return Object.entries(value).map(([k,v])=>fieldLabel(k)+': '+readable(v)).join('\n');
 const text=String(value??'');if(/^[\[{]/.test(text)){try{return readable(JSON.parse(text));}catch{/* Preserve original text. */}}
 return text;
}
function fields(blocks:ExportBlock[],record:Record<string,unknown>,context:Record<string,string>={}){
 for(const [key,value] of Object.entries(record)){
  if((key.startsWith('geri_')&&record.answers)||['id','revision','format'].includes(key)||value===undefined||value===null||value==='')continue;
  if(typeof value==='string'&&/^data:image\/(png|jpeg|jpg);base64,/.test(value))blocks.push({type:'image',text:context[key]||fieldLabel(key),value});
  else blocks.push({type:'text',text:(context[key]||fieldLabel(key))+': '+readable(value)});
 }
}
function records(blocks:ExportBlock[],r:Resident,kind:Kind,entries=r.data[kind]){
 blocks.push({type:'heading',text:sections.find(s=>s.key===kind)!.title+' ('+entries.length+')'});
 if(!entries.length)blocks.push({type:'text',text:'Sin registros.'});
 for(const e of [...entries].sort((a,b)=>(a.date||'').localeCompare(b.date||''))){blocks.push({type:'heading',text:e.date||'Sin fecha'});fields(blocks,{...e,...(e.goalId?{goalId:goalLabel(r,e.goalId)}:{}),...(e.sourceRef?{sourceRef:resolveSource(r,e.sourceRef)?.label||e.sourceLabel||'Origen no disponible'}:{})},{...Object.fromEntries(sections.find(s=>s.key===kind)!.fields.map(([k,label])=>[k,label.split('|')[0]])),...(kind==='scales'?{...Object.fromEntries(testFields(e).map(([k,label])=>[k,label.split('|')[0]])),...mmseLabels}:{}),...(kind==='reports'?Object.fromEntries(reportSections):{})});}
}
function residentTitle(blocks:ExportBlock[],r:Resident){blocks.push({type:'title',text:r.data.profile.name||r.code,page:true},{type:'text',text:r.code+' · '+r.center+' · '+({active:'Activo',archived:'Archivado',exitus:'Exitus'}[r.status]||r.status)});}
function clinicalBlocks(blocks:ExportBlock[],r:Resident){residentTitle(blocks,r);if(r.updated_at)blocks.push({type:'text',text:'Última actualización de la ficha: '+r.updated_at});blocks.push({type:'heading',text:'Historia clínica y ficha'});fields(blocks,r.data.profile,profileLabels);for(const f of r.data.customFields||[])blocks.push({type:'text',text:(f.label||'Campo personalizado')+': '+f.value});for(const s of sections)records(blocks,r,s.key);}
function materialBlocks(blocks:ExportBlock[],materials:Material[],residents:Resident[]){
 blocks.push({type:'title',text:'Biblioteca de materiales',page:materials.length>0});if(!materials.length)blocks.push({type:'text',text:'Sin materiales guardados.'});for(const m of materials){blocks.push({type:'heading',text:m.title});fields(blocks,{fecha:m.created_at,configuracion:m.data.config,revisado:m.data.reviewed,avisos:m.data.warnings||[],residentes:m.links.map(l=>(residents.find(r=>r.id===l.id)?.data.profile.name||l.id)+' · '+l.date)});for(const e of m.data.exercises){blocks.push({type:'heading',text:e.title});fields(blocks,{area:e.domain,consigna:e.instruction,contenido:e.body,cuadricula:e.cells?Array.from({length:Math.ceil(e.cells.length/(e.columns||1))},(_,i)=>e.cells!.slice(i*(e.columns||1),(i+1)*(e.columns||1)).join(' | ')).join('\n'):'',solucion:e.answer});}}
}
export function completeDocument(bundle:ExportBundle,createdAt:string):ExportDocument{
 const blocks:ExportBlock[]=[];
 blocks.push({type:'heading',text:'Contenido del volcado'},{type:'text',text:bundle.residents.length+' residentes · '+bundle.residents.reduce((n,r)=>n+sections.reduce((s,k)=>s+r.data[k.key].length,0),0)+' registros clínicos · '+bundle.materials.length+' materiales.'},{type:'text',text:'Incluye residentes activos, archivados y exitus. Recoge los datos guardados, las respuestas de las pruebas, imágenes integradas, materiales y organización. La documentación externa se incluye mediante sus referencias registradas; no se descargan archivos externos.'});
 for(const r of [...bundle.residents].sort((a,b)=>(a.data.profile.name||a.code).localeCompare(b.data.profile.name||b.code,'es'))){clinicalBlocks(blocks,r);}
 blocks.push({type:'title',text:'Organización de la residencia',page:true},{type:'heading',text:'Horario habitual'});
 for(const e of bundle.schedule){const weekday=weekDays[(new Date(e.event_date+'T12:00:00Z').getUTCDay()+6)%7]||'Domingo';blocks.push({type:'heading',text:weekday+' · '+timeLabel(e.start_min)+'-'+timeLabel(e.end_min)+' · '+e.title});fields(blocks,{centro:e.center,tipo:bundle.types.find(t=>t.id===e.category_id)?.label||'Sin tipo',residente:bundle.residents.find(r=>r.id===e.resident_id)?.data.profile.name||bundle.residents.find(r=>r.id===e.resident_id)?.code||'',lugar:e.location,notas:e.notes,estado:e.status});}
 if(!bundle.schedule.length)blocks.push({type:'text',text:'Sin actividades guardadas.'});
 blocks.push({type:'heading',text:'Campañas de valoración'});for(const c of bundle.campaigns){blocks.push({type:'heading',text:c.title+' · '+c.center+' · '+c.start_date});for(const s of c.data.slots)blocks.push({type:'text',text:s.date+' · '+timeLabel(s.start_min)+'-'+timeLabel(s.end_min)+' · '+(bundle.residents.find(r=>r.id===s.resident_id)?.data.profile.name||bundle.residents.find(r=>r.id===s.resident_id)?.code||'Sin residente asignado')+' · '+s.status+(s.notes?'\n'+s.notes:'')});}
 blocks.push({type:'heading',text:'Tareas profesionales'});for(const t of bundle.tasks)blocks.push({type:'text',text:t.title.replace(/^\[Residencia\] /,'')+' · '+(t.due_at?.slice(0,10)||'Sin fecha')+' · '+t.status+(t.completed_at?' · Completada: '+t.completed_at:'')});
 materialBlocks(blocks,bundle.materials,bundle.residents);
 return {title:'Volcado completo de residencia',subtitle:'Historiales y organización',filename:'Residencia_Completa_'+createdAt.slice(0,10)+'.pdf',blocks,createdAt};
}
export function residentDocument(resident:Resident,materials:Material[],createdAt:string):ExportDocument{
 const blocks:ExportBlock[]=[{type:'text',text:'Historial individual: ficha, valoraciones y respuestas, diario, PIAI, informes y demás registros guardados de esta persona. Los documentos externos se incluyen como referencias registradas.'}];
 clinicalBlocks(blocks,resident);
 const linked=materials.filter(m=>m.links.some(link=>link.id===resident.id)).map(m=>({...m,links:m.links.filter(link=>link.id===resident.id)}));
 materialBlocks(blocks,linked,[resident]);
 const code=resident.code.replace(/[^a-z0-9_-]/gi,'_')||'individual';
 return {title:'Historial completo del residente',subtitle:(resident.data.profile.name||resident.code)+' · '+resident.center,filename:'Historial_Residente_'+code+'_'+createdAt.slice(0,10)+'.pdf',blocks,createdAt};
}
export function weeklyPiaiDocument(residents:Resident[],from:string,to:string,createdAt:string):ExportDocument{
 const blocks:ExportBlock[]=[{type:'text',text:'Semana del '+from+' al '+to+' · '+residents.length+' residentes. Documento de trabajo con la información PIAI guardada; conserva el estado de cada objetivo.'}];
 for(const r of residents){residentTitle(blocks,r);for(const reason of piaiReasons(r,from,to))blocks.push({type:'text',text:reason});blocks.push({type:'heading',text:'Síntesis para el PIAI'});const p=r.data.profile;fields(blocks,Object.fromEntries(['clinicalBaseline','baselineDate','baselineSource','premorbidPersonality','preferences','cognitiveProfile','emotionalState','behavior','dailyLiving','communication','sensory','carePlan','interventionPlan','familyNeeds'].filter(k=>p[k]).map(k=>[k,p[k]])),profileLabels);const assessment=latest(r.data.assessments.filter(e=>e.date<=to));if(assessment)fields(blocks,{fechaValoracion:assessment.date,sintesis:assessment.conclusion},{fechaValoracion:'Fecha de la última valoración',sintesis:'Síntesis clínica registrada'});
  records(blocks,r,'goals',r.data.goals.filter(e=>(!e.date||e.date<=to)&&(activeGoal(e)||within(e.next,from,to)||within(e.date,from,to)||within((e.updatedAt||e.createdAt||'').slice(0,10),from,to))));
  const goalIds=new Set(r.data.goals.filter(e=>(!e.date||e.date<=to)&&(activeGoal(e)||within(e.next,from,to)||within(e.date,from,to)||within((e.updatedAt||e.createdAt||'').slice(0,10),from,to))).map(e=>e.id));
  records(blocks,r,'followups',r.data.followups.filter(e=>!!e.goalId&&goalIds.has(e.goalId)&&within(e.date,from,to)));
  records(blocks,r,'meetings',r.data.meetings.filter(e=>within(e.date,from,to)||within(e.next,from,to)));
 }
 return {title:'PIAI de la semana',subtitle:from+' - '+to,filename:'PIAI_Semana_'+from+'.pdf',blocks,createdAt};
}
