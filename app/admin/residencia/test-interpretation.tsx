import type {Entry} from './model';
import {assessmentMetric} from './assessment-history';
const mmse:[string,string,number][]=[['orientationTime','Orientación temporal',5],['orientationPlace','Orientación espacial',5],['registration','Fijación',3],['attention','Atención y cálculo',5],['recall','Recuerdo diferido',3],['naming','Denominación',2],['repetition','Repetición',1],['commands','Órdenes',3],['reading','Lectura',1],['writing','Escritura',1],['copying','Visuoconstrucción',1]];
export default function TestInterpretation({entry}:{entry:Entry}){
 const result=assessmentMetric(entry);
 const observed=entry.instrument==='MMSE'?mmse.filter(([key])=>entry[key]!==''&&entry[key]!==undefined&&Number.isFinite(Number(entry[key]))):[];
 const errors=observed.filter(([key,,max])=>Number(entry[key])<max);
 const score=entry.instrument==='Pfeiffer'?entry.errors:entry.instrument==='GDS de Reisberg'?entry.stage:entry.instrument==='Fluencia verbal'?entry.correct:entry.score;
 const numeric=score!==undefined&&score!==''&&Number.isFinite(Number(score));
 const yesavage=entry.instrument==='Yesavage';
 return <aside className="res-test-interpretation"><h4>Resultado e interpretación orientativa</h4><p><strong>{entry.instrument||'Prueba'}</strong> · {entry.date||'Fecha no registrada'} · {numeric?('Resultado: '+score+(entry.maximum?' / '+entry.maximum:'')):'Sin puntuación interpretable'}</p>
 {entry.validity&&entry.validity!=='Aplicado'?<p>Aplicación {entry.validity.toLowerCase()}: no se genera interpretación cuantitativa.</p>:<>
 {observed.length>0&&<><p><strong>Áreas con errores observados:</strong> {errors.length?errors.map(([key,label,max])=>label+' ('+entry[key]+'/'+max+')').join('; '):'No se han registrado errores en los apartados puntuados.'}</p><p>Estos resultados describen aciertos y errores, no acreditan por sí solos afectación neuropsicológica específica ni normalidad.</p></>}
 {entry.instrument==='Pfeiffer'&&<p>Un mayor número de errores sugiere mayor dificultad en el cribado cognitivo. La interpretación depende de la escolaridad, la corrección aplicada y la versión.</p>}
 {entry.instrument==='GDS de Reisberg'&&<p>El estadio registrado expresa una estimación clínica de gravedad global, no una medida aislada de memoria ni una etiología.</p>}
 {yesavage&&<p>Una puntuación mayor suele reflejar más síntomas depresivos. Para clasificar el resultado es imprescindible conocer la versión (5, 15 o 30 ítems), el punto de corte validado y el contexto clínico.</p>}
 {entry.instrument==='Test del reloj'&&<p>La ejecución puede implicar planificación, comprensión, representación visuoespacial y habilidades motoras. La dirección y magnitud del resultado dependen del sistema de corrección utilizado.</p>}
 {entry.instrument==='Fluencia verbal'&&<p>El número de palabras correctas requiere normas por edad, escolaridad, idioma, categoría o letra y tiempo. La ejecución integra búsqueda léxica, velocidad y control ejecutivo.</p>}
 {entry.instrument==='MEC'&&<p>La puntuación total es un indicador de cribado global. Deben documentarse la versión y puntuación máxima antes de aplicar puntos de corte; no permite inferir dominios específicos sin desglose.</p>}
 {!result&&numeric&&<p>Resultado registrado sin comparabilidad establecida. Revisa versión, procedimiento, idioma y condiciones de administración.</p>}
 </>}
 <p className="res-help">Interpretación descriptiva automática. No sustituye normas, entrevista, funcionalidad ni juicio clínico.</p></aside>;
}
