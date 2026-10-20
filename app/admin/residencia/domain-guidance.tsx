'use client';
import type {Entry} from './model';
import {assessmentMetric,comparisonFor,applicationOrder} from './assessment-history';

type DomainId='orientation'|'attention'|'memory'|'language'|'executive'|'visuospatial'|'mood'|'function'|'behavior';
type Domain={id:DomainId;label:string;results:string[];last?:Entry;change?:string};
const definitions:{id:DomainId;label:string;residence:string;family:string;objective:string;indicator:string}[]=[
{id:'orientation',label:'Orientación',residence:'Mantener referentes temporoespaciales consistentes y señalización accesible.',family:'Facilitar referentes personales y de orientación sin confrontar los errores.',objective:'Favorecer la orientación funcional y el bienestar en espacios habituales.',indicator:'Observación del uso de señales y desplazamientos con apoyos.'},
{id:'attention',label:'Atención',residence:'Ajustar duración de las actividades, distractores y ritmo de consignas.',family:'Dar consignas breves y reducir estímulos simultáneos.',objective:'Promover la participación en tareas atencionales significativas con apoyos graduados.',indicator:'Participación, necesidad de ayudas y tolerancia a la actividad.'},
{id:'memory',label:'Memoria',residence:'Facilitar claves externas y rutinas consistentes; evitar examinar continuamente al residente.',family:'Emplear recordatorios respetuosos, fotografías y conversación autobiográfica si resulta agradable.',objective:'Favorecer el recuerdo funcional mediante apoyos externos individualizados.',indicator:'Uso de claves y recuerdo de información funcional con ayudas.'},
{id:'language',label:'Lenguaje y comunicación',residence:'Ofrecer tiempo de respuesta y apoyos comunicativos adaptados.',family:'Utilizar frases claras, escucha activa y apoyos visuales si son útiles.',objective:'Mantener la comunicación funcional y la expresión de preferencias.',indicator:'Comprensión, iniciativa y comunicación de necesidades.'},
{id:'executive',label:'Funciones ejecutivas',residence:'Secuenciar tareas y favorecer decisiones guiadas preservando la autonomía.',family:'Ofrecer opciones acotadas, sin sustituir decisiones que la persona conserva.',objective:'Sostener la autonomía decisional mediante apoyos ejecutivos graduados.',indicator:'Decisiones expresadas y pasos de tareas realizados con ayudas.'},
{id:'visuospatial',label:'Capacidades visuoconstructivas',residence:'Valorar accesibilidad visual y facilitar materiales con contraste y estructura.',family:'Usar referencias visuales familiares y comprobar dificultades sensoriales.',objective:'Favorecer la realización de actividades visuoconstructivas adaptadas.',indicator:'Ejecución cualitativa, estrategias y apoyos requeridos.'},
{id:'mood',label:'Estado emocional',residence:'Explorar malestar, apatía y actividades significativas; coordinar una valoración clínica si procede.',family:'Validar el malestar y favorecer contacto y actividades elegidas por la persona.',objective:'Favorecer el bienestar emocional y la participación significativa.',indicator:'Entrevista clínica, bienestar referido y observaciones contextualizadas.'},
{id:'function',label:'Funcionamiento',residence:'Contrastar hallazgos con ABVD/AIVD y necesidades de apoyo del equipo interdisciplinar.',family:'Respetar capacidades conservadas y coordinar apoyos acordados.',objective:'Mantener la máxima autonomía funcional posible con apoyos personalizados.',indicator:'Participación y grado de ayuda observado en actividades habituales.'},
{id:'behavior',label:'Conducta',residence:'Registrar antecedentes, conducta y consecuencias; descartar factores físicos y ambientales.',family:'Compartir pautas acordadas sin etiquetar ni atribuir intencionalidad.',objective:'Comprender y reducir el malestar asociado a conductas de preocupación.',indicator:'Frecuencia, contexto, intensidad y respuesta a los apoyos.'}
];
function idsFor(e:Entry):DomainId[]{
 switch(e.instrument){
 case 'MMSE':case 'MEC':return ['orientation','attention','memory','language','visuospatial'];
 case 'Pfeiffer':return ['orientation','memory','attention'];
 case 'Test del reloj':return ['executive','visuospatial'];
 case 'Fluencia verbal':return ['language','executive'];
 case 'Yesavage':return ['mood'];
 case 'GDS de Reisberg':return ['function','memory'];
 default:return [];
 }
}
const mmseParts:Record<string,string[]>={orientation:['orientationTime','orientationPlace'],attention:['attention'],memory:['registration','recall'],language:['naming','repetition','commands','reading','writing'],visuospatial:['copying']};
function evidence(e:Entry,id:DomainId):string{
 const areas=mmseParts[id];if(e.instrument==='MMSE'&&areas){const available=areas.filter(k=>e[k]!==undefined&&e[k]!==''),sum=available.reduce((n,k)=>n+Number(e[k]),0);if(available.length)return e.instrument+' '+e.date+': '+available.join(' + ')+' = '+sum+' puntos (puntuación directa)';}
 const m=assessmentMetric(e);return e.instrument+' '+e.date+': '+(m?m.value+(m.maximum?' / '+m.maximum:''):'registro documentado');
}
export function buildDomainGuidance(records:Entry[]):Domain[]{
 const completed=[...records].filter(e=>e.validity==='Aplicado'&&e.date&&e.instrument).sort(applicationOrder);
 return definitions.map(d=>{
 const selected=completed.filter(e=>idsFor(e).includes(d.id));
 const last=selected.at(-1);
 const change=last?comparisonFor(completed,last):null;
 let changeText='';
 if(change){const delta=change.delta;changeText=delta===0?'Sin variación en puntuación directa respecto a aplicación comparable anterior.':('Variación descriptiva de '+(delta>0?'+':'')+delta+' puntos respecto a aplicación comparable anterior.');}
 return {id:d.id,label:d.label,results:selected.slice(-3).map(e=>evidence(e,d.id)),last,change:changeText||undefined};
 });
}
export default function DomainGuidance({records,onAdopt}:{records:Entry[];onAdopt:(entry:Entry)=>void}){
 const domains=buildDomainGuidance(records);
 const withEvidence=domains.filter(d=>d.results.length).length;
 return <section className="res-domain-panel" aria-label="Perfil por dominios y propuestas PIAI">
 <div className="res-heading"><div><h3>Perfil clínico por dominios</h3><p className="res-help">Actualización automática a partir de las valoraciones completas guardadas. {withEvidence} de {domains.length} dominios con evidencia registrada.</p></div></div>
 <p className="res-help"><strong>Interpretación prudente:</strong> las puntuaciones no determinan automáticamente normalidad, déficit, diagnóstico ni deterioro. La propuesta de intervención es un borrador que requiere valoración profesional, contexto funcional, baremos y preferencias del residente. Los dominios sin prueba no se consideran preservados.</p>
 <div className="res-domain-grid">{domains.map(d=>{const def=definitions.find(x=>x.id===d.id)!;return <article className="res-domain-card" key={d.id}><h4>{d.label}</h4><p><strong>{d.results.length?'Explorado':'Sin información suficiente'}</strong></p>{d.results.map((v,i)=><p key={i} className="res-domain-evidence">{v}</p>)}{d.change&&<p className="res-domain-change">{d.change} No equivale por sí sola a cambio clínicamente significativo.</p>}
 <details><summary>Propuesta para PIAI, residencia y familia</summary><p><strong>PIAI:</strong> {def.objective}</p><p><strong>Indicador:</strong> {def.indicator}</p><p><strong>Residencia:</strong> {def.residence}</p><p><strong>Familia:</strong> {def.family}</p><button type="button" disabled={!d.results.length} onClick={()=>onAdopt({id:crypto.randomUUID(),date:new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Madrid'}),area:d.label,objective:def.objective,indicator:def.indicator,intervention:'Residencia: '+def.residence+'\nFamilia: '+def.family,baseline:d.results.join('\n')+'\nHipótesis pendiente de validación clínica.',state:'Pendiente',evaluation:'Propuesta automática pendiente de revisión, adaptación y aprobación profesional.'})}>Trasladar borrador al PIAI</button></details>
 </article>})}</div>
 </section>;
}
