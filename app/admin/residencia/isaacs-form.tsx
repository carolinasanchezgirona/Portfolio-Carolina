'use client';
import type {Entry} from './model';
const categories=[['colors','Colores'],['animals','Animales'],['fruits','Frutas'],['cities','Ciudades']] as const;
export function scoreIsaacs(entry:Entry):Entry{
 let total=0,ready=true,errors=0;
 for(const [key] of categories){
 const raw=(entry['isaacs_'+key]||'').split(/[\n,;]+/).map(w=>w.trim()).filter(Boolean);
 const unique=new Set<string>();let valid=0,duplicates=0;
 raw.forEach(w=>{const normalized=w.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();if(unique.has(normalized))duplicates++;else unique.add(normalized);});
 const reviewed=entry['isaacs_'+key+'_correct'];
 if(reviewed===undefined||reviewed==='')ready=false;
 else{valid=Number(reviewed);if(!Number.isInteger(valid)||valid<0||valid>10)ready=false;else total+=valid;}
 errors+=duplicates+Math.max(0,Number(entry['isaacs_'+key+'_intrusions']||0));
 }
 return {...entry,instrument:'Fluencia verbal',version:'Set-Test de Isaacs (4 categorías)',modality:'Semántica',durationSeconds:'60 segundos máximo por categoría; detener al llegar a 10 respuestas válidas',correct:ready?String(total):'',score:ready?String(total):'',maximum:'40',errors:String(errors),validity:ready?'Aplicado':'Incompleto',direction:'Más alto es más favorable'};
}
export default function IsaacsForm({entry,onChange}:{entry:Entry;onChange:(e:Entry)=>void}){
 const set=(key:string,v:string)=>onChange(scoreIsaacs({...entry,[key]:v}));
 return <section className="res-isaacs"><h3>Set-Test de Isaacs</h3><p className="res-help">Solicita elementos de cada categoría. Hasta 60 segundos por categoría; al obtener diez respuestas distintas válidas se pasa a la siguiente. Conserva el orden de producción. Repeticiones e intrusiones se registran por separado y no se descuentan de los aciertos.</p>
 {categories.map(([key,label])=><section className="res-isaacs-category" key={key}><h4>{label} · máximo 10 aciertos</h4><label>Respuestas en orden (separadas por comas o saltos de línea)<textarea value={entry['isaacs_'+key]||''} onChange={e=>set('isaacs_'+key,e.target.value)} placeholder={'Anota los '+label.toLowerCase()+' mencionados'}/></label><div className="res-grid"><label>Aciertos verificados (0–10)<input type="number" min="0" max="10" value={entry['isaacs_'+key+'_correct']||''} onChange={e=>set('isaacs_'+key+'_correct',e.target.value)}/></label><label>Intrusiones / respuestas no válidas<input type="number" min="0" max="100" value={entry['isaacs_'+key+'_intrusions']||''} onChange={e=>set('isaacs_'+key+'_intrusions',e.target.value)}/></label></div></section>)}
 <div className="res-score-summary"><strong>{entry.correct!==''&&entry.correct!==undefined?entry.correct+' / 40':'Puntuación pendiente'}</strong><span>Errores anotados (estimación de repeticiones e intrusiones): {entry.errors||'0'}</span></div>
 <p className="res-help">Revisa los aciertos manualmente: el sistema detecta repeticiones textuales, pero no puede verificar de forma fiable la pertenencia semántica de todas las respuestas. La interpretación requiere considerar edad, escolaridad, idioma y circunstancias de administración.</p></section>;
}
