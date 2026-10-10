/* EntreSesiones: motor determinista original. Ejercicios de intervención, NO psicometría. */
export type NeuroDigitalType="cancelacion"|"secuencia"|"flexibilidad";
export type NeuroLevel="apoyo_alto"|"apoyo_moderado"|"autonomo";
export type NeuroDigitalPrescription={type:NeuroDigitalType;version:1;level:NeuroLevel;seed:number;domain:string};
export type NeuroDigitalTask={
  type:NeuroDigitalType;level:NeuroLevel;seed:number;title:string;instruction:string;
  stimuli:string[];choices?:string[];rules?:string[];
};
const LEVELS:NeuroLevel[]=["apoyo_alto","apoyo_moderado","autonomo"];
const TYPES:NeuroDigitalType[]=["cancelacion","secuencia","flexibilidad"];
export const DIGITAL_NAMES:Record<NeuroDigitalType,string>={
  cancelacion:"Búsqueda visual selectiva",
  secuencia:"Memoria de secuencias",
  flexibilidad:"Cambio de criterio"
};
export const DIGITAL_DOMAINS:Record<NeuroDigitalType,string>={
  cancelacion:"atencion",secuencia:"memoria",flexibilidad:"funciones_ejecutivas"
};
function rng(seed:number){
 let state=(seed>>>0)||0x629a77f5;
 return ()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};
}
function shuffle<T>(items:T[],rand:()=>number):T[]{
 const copy=items.slice();for(let i=copy.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;
}
export function validDigitalPrescription(input:unknown):input is NeuroDigitalPrescription {
 if(!input||typeof input!=="object"||Array.isArray(input))return false;
 const x=input as Record<string,unknown>;
 return TYPES.includes(x.type as NeuroDigitalType)&&x.version===1&&
 LEVELS.includes(x.level as NeuroLevel)&&Number.isSafeInteger(x.seed)&&Number(x.seed)>0&&Number(x.seed)<=2147483647&&x.domain===DIGITAL_DOMAINS[x.type as NeuroDigitalType];
}
export function digitalPrescriptions(mode:string,domain:string,level:NeuroLevel,week:number,variant:number):NeuroDigitalPrescription[]{
 if(!LEVELS.includes(level))return [];
 const types=mode==="weekly"?TYPES:TYPES.filter(t=>DIGITAL_DOMAINS[t]===domain);
 return types.map((type,index)=>({
  type,version:1 as const,level,domain:DIGITAL_DOMAINS[type],
  seed:1+((Math.imul((Math.trunc(week)||1),7919)+Math.imul((Math.trunc(variant)||0)+1,15427)+(index+1)*31847)>>>0)%2147483646
 }));
}
export function createDigitalTask(spec:NeuroDigitalPrescription):NeuroDigitalTask {
 if(!validDigitalPrescription(spec))throw new Error("Actividad no admitida.");
 const rand=rng(spec.seed),depth=LEVELS.indexOf(spec.level);
 if(spec.type==="cancelacion"){
  const total=[18,28,40][depth],symbols=["○","△","□","◇","★"];
  // Posiciones equilibradas por diseño, al menos 4 objetivos y distractores variados.
  const targetCount=[5,7,10][depth];
  const positions=shuffle(Array.from({length:total},(_,i)=>i),rand).slice(0,targetCount);
  const targets=new Set(positions);
  const stimuli=Array.from({length:total},(_,i)=>targets.has(i)?"★":symbols[Math.floor(rand()*4)]);
  return {type:spec.type,level:spec.level,seed:spec.seed,title:DIGITAL_NAMES[spec.type],
    instruction:"Marca todas las estrellas (★) y ninguna otra figura. Puedes revisar antes de finalizar. No hay límite de tiempo.",
    stimuli};
 }
 if(spec.type==="secuencia"){
  const count=[3,4,5][depth],pool=["●","▲","■","◆","✦","☀","⬟"];
  const stimuli=shuffle(pool,rand).slice(0,count);
  const choices=shuffle(stimuli,rand);
  return {type:spec.type,level:spec.level,seed:spec.seed,title:DIGITAL_NAMES[spec.type],
    instruction:"Observa los símbolos y memoriza su orden. Cuando lo decidas, ocúltalos y reproduce la secuencia pulsando los símbolos.",
    stimuli,choices};
 }
 const count=[6,8,10][depth],shapes=["Círculo","Triángulo"],colors=["Azul","Coral"];
 // Ciclo equilibrado; la regla cambia una única vez y se señala explícitamente.
 const stimuli=Array.from({length:count},(_,i)=>{
  const shape=shapes[(i+Math.floor(rand()*2))%2],color=colors[(Math.floor(i/2)+Math.floor(rand()*2))%2];
  return shape+" · "+color;
 });
 const ruleSwitch=Math.floor(count/2);
 const rules=Array.from({length:count},(_,i)=>i<ruleSwitch?"forma":"color");
 return {type:spec.type,level:spec.level,seed:spec.seed,title:DIGITAL_NAMES[spec.type],
  instruction:"En la primera parte clasifica por FORMA; cuando cambie la regla, clasifica por COLOR. Lee la regla visible antes de responder.",
  stimuli,rules};
}
export type DigitalScore={
  correct:number;opportunities:number;omissions:number;commissions:number;
  cues_used:number;responses:(number|string)[];
};
export function scoreDigitalAttempt(spec:NeuroDigitalPrescription,raw:unknown,cues:unknown):DigitalScore {
 const task=createDigitalTask(spec);
 if(!Array.isArray(raw)||raw.length>50||!Number.isInteger(cues)||Number(cues)<0||Number(cues)>10)throw new Error("Respuestas no válidas.");
 const responses=raw as unknown[];
 if(task.type==="cancelacion"){
  if(responses.length>task.stimuli.length||responses.some(x=>!Number.isInteger(x)||Number(x)<0||Number(x)>=task.stimuli.length)||new Set(responses).size!==responses.length)throw new Error("Selección visual no válida.");
  const marked=new Set(responses as number[]);
  let correct=0,omissions=0,commissions=0;
  task.stimuli.forEach((symbol,index)=>{if(symbol==="★"){if(marked.has(index))correct++;else omissions++;}else if(marked.has(index))commissions++;});
  return {correct,opportunities:correct+omissions,omissions,commissions,cues_used:Number(cues),responses:responses as number[]};
 }
 if(task.type==="secuencia"){
  const options=new Set(task.choices);
  if(responses.length>task.stimuli.length||responses.some(x=>typeof x!=="string"||!options.has(x))||new Set(responses).size!==responses.length)throw new Error("Secuencia no válida.");
  const correct=responses.filter((v,i)=>v===task.stimuli[i]).length;
  return {correct,opportunities:task.stimuli.length,omissions:task.stimuli.length-responses.length,commissions:responses.length-correct,cues_used:Number(cues),responses:responses as string[]};
 }
 if(responses.length!==task.stimuli.length||responses.some(x=>x!=="A"&&x!=="B"))throw new Error("La clasificación está incompleta.");
 let correct=0;
 responses.forEach((answer,i)=>{
  const symbol=task.stimuli[i];
  const rule=task.rules?.[i];
  const expected=rule==="forma"?(symbol.startsWith("Círculo")?"A":"B"):(symbol.endsWith("Azul")?"A":"B");
  if(answer===expected)correct++;
 });
 return {correct,opportunities:task.stimuli.length,omissions:0,commissions:task.stimuli.length-correct,cues_used:Number(cues),responses:responses as string[]};
}
