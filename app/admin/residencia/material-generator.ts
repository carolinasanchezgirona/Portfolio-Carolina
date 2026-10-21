export type Language='es'|'ca'|'en';
export const domains=['Atención','Memoria','Lenguaje','Funciones ejecutivas','Cálculo','Visuoespacial'] as const;
export type Domain=typeof domains[number];
export type MaterialConfig={difficulty:number;education:string;format:'Ficha'|'Cuaderno';language:Language;domains:Domain[];pages:number;facilitators:string[];notes:string;aiInstructions?:string};
export type Exercise={id:string;domain:Domain;title:string;instruction:string;body:string;answer:string;kind:'text'|'grid';cells?:string[];columns?:number};
export type Material={id:string;revision:number;created_at:string;title:string;data:{config:MaterialConfig;exercises:Exercise[];reviewed:boolean;generator:string;warnings?:string[]};links:{id:string;date:string}[]};
export const defaultConfig:MaterialConfig={difficulty:2,education:'Primaria',format:'Ficha',language:'es',domains:['Atención'],pages:6,facilitators:[],notes:'',aiInstructions:''};
const text={
 es:{words:['PAN','CASA','MESA','SOL','GATO','FLOR','TREN','VASO','LLAVE','LIBRO','SILLA','PERA','BOLSA','RELOJ','PLAYA','CAMPO'],shopping:['pan','leche','arroz','manzanas','jabón','café','queso','tomates'],attention:'Busca y marca',target:'Marca únicamente',memory:'Recuerda la compra',study:'Observa o escucha la lista. Después tápala y recuerda los productos. Realiza otra actividad antes de evocarlos de nuevo.',language:'Palabras de la vida diaria',category:'Di palabras de la categoría indicada. Puedes responder oralmente.',categories:['animales','alimentos','objetos de cocina','medios de transporte','prendas de vestir','profesiones'],plan:'Ordena los pasos',order:'Ordena los pasos para completar la actividad. Explica por qué.',steps:[['Preparar una bebida caliente',['Servir la bebida','Preparar la taza','Calentar el agua','Añadir la bebida a la taza']],['Ir a comprar',['Pagar','Preparar la lista','Elegir los productos','Volver con la compra']],['Cuidar una planta',['Guardar la regadera','Comprobar la tierra','Llenar la regadera','Regar la planta']]],calc:'Cuentas cotidianas',calculate:'Resuelve las operaciones. Puedes explicar cómo lo has hecho.',space:'Copia el patrón',copy:'Observa el modelo y reproduce las posiciones de los puntos en la cuadrícula vacía.',responses:'Respuestas',example:'Ejemplo',support:'Si es necesario, el profesional puede presentar los elementos uno a uno.',noTime:'Sin límite de tiempo.',wordBank:'Banco de palabras',memoryHint:'Pista: son productos de una compra.',answerCategory:'Respuesta abierta. Verificar pertenencia a la categoría y registrar repeticiones.',answerSteps:'Secuencia habitual: 2 → 3 → 4 → 1. Aceptar alternativas funcionales justificadas.',memoryAnswer:'Evocación libre o con las claves seleccionadas; anotar los apoyos utilizados.'},
 ca:{words:['PA','CASA','TAULA','SOL','GAT','FLOR','TREN','GOT','CLAU','LLIBRE','CADIRA','PERA','BOSSA','RELLOTGE','PLATJA','CAMP'],shopping:['pa','llet','arròs','pomes','sabó','cafè','formatge','tomàquets'],attention:'Busca i marca',target:'Marca únicament',memory:'Recorda la compra',study:'Observa o escolta la llista. Després tapa-la i recorda els productes. Fes una altra activitat abans de recordar-los de nou.',language:'Paraules de la vida diària',category:'Digues paraules de la categoria indicada. Pots respondre oralment.',categories:['animals','aliments','objectes de cuina','mitjans de transport','peces de vestir','professions'],plan:'Ordena els passos',order:'Ordena els passos per completar l’activitat. Explica per què.',steps:[['Preparar una beguda calenta',['Servir la beguda','Preparar la tassa','Escalfar l’aigua','Afegir la beguda a la tassa']],['Anar a comprar',['Pagar','Preparar la llista','Triar els productes','Tornar amb la compra']],['Cuidar una planta',['Guardar la regadora','Comprovar la terra','Omplir la regadora','Regar la planta']]],calc:'Comptes quotidians',calculate:'Resol les operacions. Pots explicar com ho has fet.',space:'Copia el patró',copy:'Observa el model i reprodueix les posicions dels punts a la quadrícula buida.',responses:'Respostes',example:'Exemple',support:'Si cal, el professional pot presentar els elements d’un en un.',noTime:'Sense límit de temps.',wordBank:'Banc de paraules',memoryHint:'Pista: són productes d’una compra.',answerCategory:'Resposta oberta. Verificar la pertinença a la categoria i registrar les repeticions.',answerSteps:'Seqüència habitual: 2 → 3 → 4 → 1. Acceptar alternatives funcionals justificades.',memoryAnswer:'Evocació lliure o amb les pistes seleccionades; anotar els suports utilitzats.'},
 en:{words:['BREAD','HOUSE','TABLE','SUN','CAT','FLOWER','TRAIN','GLASS','KEY','BOOK','CHAIR','PEAR','BAG','CLOCK','BEACH','FIELD'],shopping:['bread','milk','rice','apples','soap','coffee','cheese','tomatoes'],attention:'Find and mark',target:'Mark only',memory:'Remember the shopping',study:'Look at or listen to the list. Then cover it and recall the items. Complete another activity before recalling them again.',language:'Everyday words',category:'Name words belonging to the category. You may answer aloud.',categories:['animals','foods','kitchen objects','means of transport','clothes','occupations'],plan:'Order the steps',order:'Order the steps to complete the activity. Explain why.',steps:[['Make a hot drink',['Serve the drink','Prepare a cup','Heat the water','Add the drink to the cup']],['Go shopping',['Pay','Prepare a list','Choose the products','Return with the shopping']],['Care for a plant',['Put away the watering can','Check the soil','Fill the watering can','Water the plant']]],calc:'Everyday calculations',calculate:'Solve the calculations. You may explain your approach.',space:'Copy the pattern',copy:'Look at the model and copy the positions of the dots into the empty grid.',responses:'Answers',example:'Example',support:'If needed, the professional can present one item at a time.',noTime:'No time limit.',wordBank:'Word bank',memoryHint:'Hint: these are shopping items.',answerCategory:'Open response. Check category membership and record repetitions.',answerSteps:'Usual sequence: 2 → 3 → 4 → 1. Accept justified functional alternatives.',memoryAnswer:'Free recall or recall with the selected cues; record the support provided.'}
};
function random(seed:number){let n=seed>>>0;return()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296;};}
function shuffle<T>(items:T[],rand:()=>number){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function validateConfig(c:MaterialConfig){if(!c.domains.length)return 'Selecciona al menos una función cognitiva.';if(c.format==='Ficha'&&c.domains.length>1)return 'Para una ficha elige una función. Selecciona Cuaderno para combinar varias.';if(!Number.isInteger(c.difficulty)||c.difficulty<1||c.difficulty>4)return 'Revisa el nivel de dificultad.';if(c.format==='Cuaderno'&&(!Number.isInteger(c.pages)||c.pages<2||c.pages>24))return 'Elige entre 2 y 24 fichas.';if(c.education==='Sin lectoescritura funcional'&&c.domains.some(d=>!['Atención','Visuoespacial'].includes(d))&&!c.facilitators.includes('Presentación oral'))return 'Activa Presentación oral para estas tareas sin lectoescritura funcional.';return '';}
export function generateMaterial(config:MaterialConfig,seed:number=Date.now()):Material{
 const error=validateConfig(config);if(error)throw Error(error);
 const c=structuredClone(config),t=text[c.language],rand=random(seed),oral=c.education==='Sin lectoescritura funcional',amount=c.format==='Ficha'?1:c.pages;
 const exercises:Exercise[]=Array.from({length:amount},(_,index)=>{
 const domain=c.domains[index%c.domains.length],level=c.difficulty,n=level+2,id=crypto.randomUUID();let exercise:Exercise={id,domain,title:'',instruction:'',body:'',answer:'',kind:'text'};
 if(domain==='Atención'){
  const pool=oral?['●','▲','■','◆','★','○','△','□']:c.education==='Primaria incompleta'?t.words.filter(w=>w.length<=4):c.education==='Estudios superiores'&&level>=3?[...t.words].sort((a,b)=>b.length-a.length):t.words,targets=shuffle(pool,rand).slice(0,level>=3?2:1),columns=c.facilitators.includes('Letra grande')?3:c.facilitators.includes('Menor carga visual')?4:level+3,count=columns*(level+3),cells=Array.from({length:count},()=>pool[Math.floor(rand()*Math.min(pool.length,level*3+3))]);targets.forEach((target,i)=>cells[i*columns]=target);const positions=cells.map((v,i)=>targets.includes(v)?`${Math.floor(i/columns)+1}.${i%columns+1}`:'').filter(Boolean);
  exercise={...exercise,title:t.attention,instruction:`${t.target}: ${targets.join(' / ')}.`,body:'',kind:'grid',cells,columns,answer:positions.join(' · ')};
 }else if(domain==='Memoria'){
  const words=shuffle(t.shopping,rand).slice(0,Math.min(8,n));exercise={...exercise,title:t.memory,instruction:t.study,body:words.join(' · '),answer:words.join(' · ')+'. '+t.memoryAnswer};
 }else if(domain==='Lenguaje'){
  const category=t.categories[Math.floor(rand()*t.categories.length)];exercise={...exercise,title:t.language,instruction:t.category,body:`${category.toUpperCase()}\n\n${Array.from({length:level+3},(_,i)=>`${i+1}. __________________________________`).join('\n')}`,answer:t.answerCategory};
 }else if(domain==='Funciones ejecutivas'){
  const task=t.steps[Math.floor(rand()*t.steps.length)],raw=task[1] as string[],ordered=[raw[1],raw[2],raw[3],raw[0]];
  const extra=c.language==='es'?['Comprobar el resultado','Recoger el material utilizado']:c.language==='ca'?['Comprovar el resultat','Recollir el material utilitzat']:['Check the result','Put away the materials'];
  const steps=level===1?[ordered[0],ordered[1]+' / '+ordered[2],ordered[3]]:[...ordered,...extra.slice(0,level-2)];
  const mixed=shuffle(steps.map((label,i)=>({label,i})),rand);const solution=steps.map((_,i)=>mixed.findIndex(v=>v.i===i)+1).join(' → ');
  exercise={...exercise,title:t.plan,instruction:t.order,body:task[0]+'\n\n'+mixed.map((v,i)=>`${i+1}. ${v.label}`).join('\n\n'),answer:solution};
 }else if(domain==='Cálculo'){
  const max=c.education==='Sin lectoescritura funcional'||c.education==='Primaria incompleta'?Math.min(10,level*3):level===1?10:level===2?30:level===3?100:500;
  const operations=Array.from({length:n},()=>{const a=1+Math.floor(rand()*max),b=1+Math.floor(rand()*max);return level>=3&&rand()>.5?{q:`${Math.max(a,b)} − ${Math.min(a,b)} =`,a:Math.abs(a-b)}:{q:`${a} + ${b} =`,a:a+b};});exercise={...exercise,title:t.calc,instruction:t.calculate,body:operations.map(v=>v.q+' __________').join('\n\n'),answer:operations.map(v=>v.q+' '+v.a).join('\n')};
 }else{
  const columns=c.facilitators.includes('Menor carga visual')?Math.min(4,level+2):level+2,cells=Array.from({length:columns*columns},()=>rand()>.65?'●':'');cells[Math.floor(rand()*cells.length)]='●';exercise={...exercise,title:t.space,instruction:t.copy,body:'',kind:'grid',columns,cells,answer:cells.map((v,i)=>v?`${Math.floor(i/columns)+1}.${i%columns+1}`:'').filter(Boolean).join(' · ')};
 }
 if(c.facilitators.includes('Consigna por pasos'))exercise.instruction=exercise.instruction.split('. ').join('.\n');
 if(c.facilitators.includes('Ejemplo resuelto')&&domain==='Cálculo')exercise.instruction+=`\n${t.example}: 2 + 1 = 3.`;
 if(c.facilitators.includes('Ejemplo resuelto')&&domain==='Atención')exercise.instruction+=`\n${t.example}: ${exercise.instruction.split(': ')[1]||''} ✓`;
 if(c.facilitators.includes('Ejemplo resuelto')&&domain==='Funciones ejecutivas')exercise.instruction+=`\n${t.example}: ${exercise.answer.split(' → ')[0]} → …`;
 if(c.facilitators.includes('Claves semánticas')&&domain==='Memoria')exercise.instruction+='\n'+t.memoryHint;
 
 if(c.facilitators.includes('Presentación oral'))exercise.instruction+='\n'+t.support;
 if(c.facilitators.includes('Sin límite de tiempo'))exercise.instruction+='\n'+t.noTime;
 return exercise;
 });
 return {id:crypto.randomUUID(),revision:0,created_at:new Date().toISOString(),title:(c.format==='Ficha'?exercises[0].title:c.language==='ca'?'Quadern d’estimulació cognitiva':c.language==='en'?'Cognitive stimulation workbook':'Cuaderno de estimulación cognitiva'),data:{config:c,exercises,reviewed:false,generator:'residence-procedural-v1'},links:[]};
}
export function searchMaterials(rows:Material[],query:string,domain:string,language:string,residentId:string){const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const terms=normalize(query).split(/\s+/).filter(Boolean);return rows.filter(m=>(!domain||m.data.config.domains.includes(domain as Domain))&&(!language||m.data.config.language===language)&&(!residentId||m.links.some(l=>l.id===residentId))&&terms.every(q=>normalize([m.title,m.data.config.education,m.data.config.notes,m.data.config.aiInstructions||'',...m.data.config.domains,...m.data.config.facilitators,...m.data.exercises.map(e=>e.title+' '+e.body)].join(' ')).includes(q)));}

/** Allowlisted generation brief; never forwards resident records to the model. */
export function validateAiConfig(input:unknown):MaterialConfig{
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Configuración no válida.');
 const x=input as Record<string,unknown>;
 const education=['Sin lectoescritura funcional','Primaria incompleta','Primaria','Secundaria','Estudios superiores'];
 const supports=['Letra grande','Alto contraste','Menor carga visual','Consigna por pasos','Ejemplo resuelto','Presentación oral','Claves semánticas','Sin límite de tiempo'];
 if(!education.includes(String(x.education))||!['es','ca','en'].includes(String(x.language))||!['Ficha','Cuaderno'].includes(String(x.format)))throw Error('Revisa el idioma, la escolaridad y el formato.');
 if(!Array.isArray(x.domains)||!x.domains.length||x.domains.length>domains.length||x.domains.some(d=>!domains.includes(d as Domain)))throw Error('Revisa las funciones cognitivas.');
 if(!Array.isArray(x.facilitators)||x.facilitators.length>supports.length||x.facilitators.some(f=>!supports.includes(String(f))))throw Error('Revisa los facilitadores.');
 if(typeof x.notes!=='string'||x.notes.length>3000||typeof x.aiInstructions!=='string'||x.aiInstructions.trim().length<10||x.aiInstructions.length>5000)throw Error('Describe el material en Instrucciones para la IA (entre 10 y 5000 caracteres).');
 const c:MaterialConfig={difficulty:x.difficulty as number,education:String(x.education),format:x.format as MaterialConfig['format'],language:x.language as Language,domains:[...new Set(x.domains)] as Domain[],pages:x.format==='Ficha'?1:x.pages as number,facilitators:[...new Set(x.facilitators)] as string[],notes:x.notes,aiInstructions:x.aiInstructions.trim()};
 const error=validateConfig(c);if(error)throw Error(error);return c;
}
export function materialFromAi(value:unknown,config:MaterialConfig):Material{
 const fail=()=>{throw Error('La propuesta de IA está incompleta o no se ajusta al material solicitado. Conserva tus instrucciones y vuelve a generar.');};
 if(!value||typeof value!=='object'||Array.isArray(value))return fail();
 const x=value as Record<string,unknown>,count=config.format==='Ficha'?1:config.pages;
 if(typeof x.title!=='string'||!x.title.trim()||x.title.length>200||!Array.isArray(x.exercises)||x.exercises.length!==count||!Array.isArray(x.warnings)||x.warnings.length>8||x.warnings.some(w=>typeof w!=='string'||w.length>600))return fail();
 const exercises:Exercise[]=x.exercises.map((raw:unknown)=>{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return fail();
  const e=raw as Record<string,unknown>;
  if(!config.domains.includes(e.domain as Domain)||!['text','grid'].includes(String(e.kind)))return fail();
  for(const [key,max] of [['title',200],['instruction',5000],['body',10000],['answer',5000]] as const)if(typeof e[key]!=='string'||(key!=='body'&&!(e[key] as string).trim())||(e[key] as string).length>max)return fail();
  const result:Exercise={id:crypto.randomUUID(),domain:e.domain as Domain,kind:e.kind as Exercise['kind'],title:(e.title as string).trim(),instruction:e.instruction as string,body:e.body as string,answer:e.answer as string};
  if(e.kind==='grid'){
   if(!['Atención','Visuoespacial'].includes(result.domain)||!Number.isInteger(e.columns)||Number(e.columns)<2||Number(e.columns)>8||!Array.isArray(e.cells)||!e.cells.length||e.cells.length>80||e.cells.length%Number(e.columns)!==0||e.cells.some(v=>typeof v!=='string'||v.length>30))return fail();
   result.columns=Number(e.columns);result.cells=e.cells as string[];
  }else if(!(e.body as string).trim())return fail();
  return result;
 });
 return {id:crypto.randomUUID(),revision:0,created_at:new Date().toISOString(),title:x.title.trim(),data:{config:structuredClone(config),exercises,reviewed:false,generator:'residence-ai-v1',warnings:x.warnings as string[]},links:[]};
}
