import type {Entry,Field} from './model';

export const mmseVersion='NORMACODERM (Anexo 2)';
export const isNormacoderm=(entry:Entry)=>entry.instrument==='MMSE'&&entry.version===mmseVersion;
export const mmseAreas:[string,string,number][]=[
 ['orientationTime','Orientación temporal',5],['orientationPlace','Orientación espacial',5],
 ['registration','Fijación',3],['attention','Atención y cálculo (mejor opción aplicada)',5],
 ['recall','Recuerdo diferido',3],['naming','Denominación',2],['repetition','Repetición',1],
 ['commands','Orden de tres pasos',3],['reading','Lectura y ejecución',1],
 ['writing','Escritura de una frase',1],['copying','Copia de pentágonos',1]
];
export const mmseFields:Field[]=[
 ['ageAtAssessment','Edad en la fecha de aplicación','number'],
 ['schoolLeavingAge','Edad al finalizar los estudios','number'],
 ['literacy','Lectoescritura|Lee y escribe|Solo lee|Solo escribe|No lee ni escribe|No consta'],
 ...mmseAreas.map(([key,label,max]):Field=>[key,label+' (0–'+max+')','number']),
 ['attentionMethod','Procedimiento de atención aplicado|Restas seriadas|MUNDO al revés|Ambos'],
 ['score','Puntuación total registrada','number'],['maximum','Puntuación máxima de la versión','number'],
 ['correctedScore','Puntuación corregida registrada por la profesional','number'],
 ['correctionReference','Corrección aplicada y tabla de referencia utilizada'],
 ['subscores','Respuestas, incidencias y observaciones cualitativas']
];
export function validateMmse(entry:Entry):string{
 if(!isNormacoderm(entry))return '';
 for(const [key,label,max] of [...mmseAreas,['score','Puntuación total',30] as [string,string,number]]){
  if(entry[key]!==undefined&&entry[key]!==''){
   const n=Number(entry[key]);
   if(!Number.isInteger(n)||n<0||n>max)return label+': introduce un entero entre 0 y '+max+'.';
  }
 }
 if(entry.maximum!=='30')return 'La puntuación máxima del MMSE NORMACODERM es 30.';
 // Missing domains remain missing; an incomplete administration must not become zero.
 if(mmseAreas.every(([key])=>entry[key]!==undefined&&entry[key]!=='' )&&entry.score!==undefined&&entry.score!==''){
  const sum=mmseAreas.reduce((total,[key])=>total+Number(entry[key]),0);
  if(sum!==Number(entry.score))return 'La suma de las áreas no coincide con la puntuación total. Revisa el registro.';
 }
 return '';
}
