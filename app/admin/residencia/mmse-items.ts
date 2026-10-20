import type {Entry} from './model';
export type MmseItem={key:string;prompt:string;expected?:string};
export type MmseGroup={key:string;title:string;items:MmseItem[];instruction?:string};
const words=['Bicicleta','Cuchara','Manzana'];
export const mmseGroups:MmseGroup[]=[
 {key:'orientationTime',title:'Orientación temporal',items:[['year','¿En qué año estamos?'],['monthDay','¿Qué día del mes es hoy?'],['month','¿En qué mes estamos?'],['weekDay','¿Qué día de la semana es hoy?'],['season','¿En qué estación del año estamos?']].map(([key,prompt])=>({key,prompt}))},
 {key:'orientationPlace',title:'Orientación espacial',items:[['country','¿En qué país estamos?'],['province','¿En qué provincia estamos?'],['city','¿En qué ciudad estamos?'],['place','¿Dónde estamos ahora?'],['floor','¿En qué piso o planta estamos?']].map(([key,prompt])=>({key,prompt}))},
 {key:'registration',title:'Fijación',instruction:'Presenta bicicleta, cuchara y manzana, a intervalos de un segundo. Puntúa solo el primer intento; registra las repeticiones adicionales en las notas.',items:words.map((word,i)=>({key:'register'+i,prompt:'Primera repetición: '+word}))},
 {key:'serial',title:'Atención: restas seriadas',instruction:'Solicita restar 7 desde 100, cinco veces. Registra la respuesta y puntúa cada resta según el protocolo aplicado, incluida la continuidad tras un error.',items:[93,86,79,72,65].map((n,i)=>({key:'subtract'+i,prompt:'Resta '+(i+1),expected:String(n)}))},
 {key:'spelling',title:'Atención: MUNDO al revés',items:['O','D','N','U','M'].map((letter,i)=>({key:'spell'+i,prompt:'Letra '+(i+1),expected:letter}))},
 {key:'recall',title:'Recuerdo diferido',instruction:'Solicita las tres palabras sin pistas ni ayuda.',items:words.map((word,i)=>({key:'recall'+i,prompt:'Recuerdo: '+word}))},
 {key:'naming',title:'Denominación',items:[{key:'pencil',prompt:'Mostrar un lápiz: ¿qué es esto?'},{key:'watch',prompt:'Mostrar un reloj: ¿qué es esto?'}]},
 {key:'repetition',title:'Repetición',items:[{key:'repeat',prompt:'Repita: «Ni sí, ni no, ni peros»'}]},
 {key:'commands',title:'Orden de tres pasos',items:[{key:'takePaper',prompt:'Coger el papel con la mano derecha'},{key:'foldPaper',prompt:'Doblarlo por la mitad'},{key:'placePaper',prompt:'Dejarlo en el suelo'}]},
 {key:'reading',title:'Lectura y ejecución',items:[{key:'closeEyes',prompt:'Mostrar «CIERRE LOS OJOS» y registrar si ejecuta la orden'}]},
 {key:'writing',title:'Escritura',items:[{key:'sentence',prompt:'Escriba una frase que tenga sentido'}]},
 {key:'copying',title:'Copia',instruction:'La copia puede realizarse en el espacio de dibujo o en papel. Registra la modalidad y describe la ejecución; la puntuación la asigna la profesional.',items:[{key:'pentagons',prompt:'Copiar los dos pentágonos entrelazados'}]}
];
export const isWebMmse=(e:Entry)=>e.instrument==='MMSE'&&e.administration==='mmse-web-v1';
export const mmseItemKey=(key:string,suffix='score')=>'mmse_'+key+'_'+suffix;
export function activeMmseGroups(e:Entry){return mmseGroups.filter(g=>g.key!=='serial'&&g.key!=='spelling'||g.key==='serial'&&['Restas seriadas','Ambos'].includes(e.attentionMethod)||g.key==='spelling'&&['MUNDO al revés','Ambos'].includes(e.attentionMethod));}
function groupScore(e:Entry,g:MmseGroup){const values=g.items.map(i=>e[mmseItemKey(i.key)]);return {complete:values.every(v=>v==='0'||v==='1'),answered:values.filter(v=>v==='0'||v==='1').length,sum:values.reduce((s,v)=>s+(v==='1'?1:0),0)};}
export function calculateMmse(e:Entry):Entry{
 const output:Entry={...e,maximum:'30'};const groups=activeMmseGroups(e);let complete=!!e.attentionMethod;
 for(const g of groups){const result=groupScore(e,g);if(!result.complete)complete=false;if(!['serial','spelling'].includes(g.key))output[g.key]=result.complete?String(result.sum):'';}
 const attention=groups.filter(g=>['serial','spelling'].includes(g.key)).map(g=>groupScore(e,g));
 output.attention=attention.length&&attention.every(v=>v.complete)?String(Math.max(...attention.map(v=>v.sum))):'';
 const keys=['orientationTime','orientationPlace','registration','attention','recall','naming','repetition','commands','reading','writing','copying'];
 output.score=complete?String(keys.reduce((s,k)=>s+Number(output[k]),0)):'';
 output.validity=complete?'Aplicado':groups.some(g=>g.items.some(i=>e[mmseItemKey(i.key)]==='NE'))?'No evaluable':'Incompleto';
 return output;
}
export function newWebMmse(e:Entry):Entry{return {...e,instrument:'MMSE',version:'NORMACODERM (Anexo 2)',administration:'mmse-web-v1',maximum:'30',language:'Español',attentionMethod:'Restas seriadas',validity:'Incompleto'};}
export function validateWebMmse(e:Entry):string{
 if(!isWebMmse(e))return '';
 if(!['Restas seriadas','MUNDO al revés','Ambos'].includes(e.attentionMethod))return 'Selecciona el procedimiento de atención.';
 for(const g of mmseGroups)for(const i of g.items){const v=e[mmseItemKey(i.key)];if(v!==undefined&&!['','0','1','NE'].includes(v))return 'Revisa la puntuación de '+i.prompt+'.';}
 return '';
}
