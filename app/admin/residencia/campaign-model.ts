const addDays=(date:string,days:number)=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);};
const monday=(date:string)=>addDays(date,-((new Date(date+'T12:00:00Z').getUTCDay()+6)%7));
export type AssessmentSlot={id:string;date:string;start_min:number;end_min:number;resident_id:string|null;status:'planned'|'done'|'cancelled';notes:string};
export type AssessmentCampaign={id:string;title:string;center:string;start_date:string;target_count:number;revision:number;data:{weeks:4;slotMinutes:number;slots:AssessmentSlot[]}};
export const campaignPath='/rest/v1/residence_assessment_campaigns?select=*&order=start_date.desc,id.asc&limit=100&offset=';
export const campaignWindows:Record<number,number[][]>={2:[[600,720]],3:[[900,1140]],4:[[600,780],[900,1020]],5:[[600,780]]};
export function validDate(date:string){return /^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(Date.parse(date+'T12:00:00Z'))&&new Date(date+'T12:00:00Z').toISOString().slice(0,10)===date;}
export function campaignDates(start:string){return Array.from({length:4},(_,w)=>[1,2,3,4].map(d=>addDays(start,w*7+d))).flat();}
export function generateAssessmentSlots(start:string,duration=30):AssessmentSlot[]{
 if(!validDate(start)||monday(start)!==start||![30,60].includes(duration))throw Error('Elige un lunes y citas de 30 o 60 minutos.');
 return campaignDates(start).flatMap(date=>(campaignWindows[new Date(date+'T12:00:00Z').getUTCDay()]||[]).flatMap(([from,to])=>Array.from({length:Math.floor((to-from)/duration)},(_,i)=>({id:crypto.randomUUID(),date,start_min:from+i*duration,end_min:from+(i+1)*duration,resident_id:null,status:'planned' as const,notes:''}))));
}
export function slotError(slot:AssessmentSlot,campaign:AssessmentCampaign){
 if(!validDate(slot.date)||slot.date<campaign.start_date||slot.date>addDays(campaign.start_date,27))return 'Elige una fecha dentro de las cuatro semanas de campaña.';
 const windows=campaignWindows[new Date(slot.date+'T12:00:00Z').getUTCDay()]||[];
 if(!Number.isInteger(slot.start_min)||!Number.isInteger(slot.end_min)||slot.start_min%30||slot.end_min%30||slot.end_min<=slot.start_min||!windows.some(([a,b])=>slot.start_min>=a&&slot.end_min<=b))return 'La cita debe encajar en las franjas de valoración: martes 10–12, miércoles 15–19, jueves 10–13 o 15–17 y viernes 10–13.';
 if(!['planned','done','cancelled'].includes(slot.status))return 'Elige un estado válido.';
 if(slot.status==='done'&&!slot.resident_id)return 'Asigna un residente antes de marcar la cita como realizada.';
 if(slot.status==='cancelled')return '';
 const other=campaign.data.slots.filter(s=>s.id!==slot.id&&s.status!=='cancelled');
 if(other.some(s=>s.date===slot.date&&s.start_min<slot.end_min&&s.end_min>slot.start_min))return 'La cita se solapa con otro hueco. Libera o anula antes el hueco que quieras ocupar.';
 if(slot.resident_id&&other.some(s=>s.resident_id===slot.resident_id))return 'Este residente ya tiene cita en esta campaña. Reprograma su cita existente para evitar duplicados.';
 return '';
}
export function campaignError(c:AssessmentCampaign){
 if(!c.title.trim()||!c.center.trim())return 'Indica el nombre de la campaña y el centro.';
 if(!validDate(c.start_date)||monday(c.start_date)!==c.start_date)return 'La campaña debe empezar un lunes.';
 if(!Number.isInteger(c.target_count)||c.target_count<1||c.target_count>500)return 'Indica un objetivo entre 1 y 500 residentes.';
 if(c.data.weeks!==4||!Array.isArray(c.data.slots)||c.data.slots.length>1000)return 'La campaña debe contener cuatro semanas y un máximo de 1.000 citas.';
 if(new Set(c.data.slots.map(s=>s.id)).size!==c.data.slots.length)return 'Hay citas duplicadas en la campaña.';
 for(const s of c.data.slots){const error=slotError(s,c);if(error)return error;}
 return '';
}
export function campaignStats(c:AssessmentCampaign){const active=c.data.slots.filter(s=>s.status!=='cancelled');return {capacity:active.length,assigned:active.filter(s=>s.resident_id).length,done:active.filter(s=>s.status==='done'&&s.resident_id).length,free:active.filter(s=>!s.resident_id).length};}
// Moving onto empty template slots consumes them and leaves the old appointment free.
export function placeAssessmentSlot(c:AssessmentCampaign,slot:AssessmentSlot):AssessmentCampaign{
 const previous=c.data.slots.find(s=>s.id===slot.id);
 let slots=c.data.slots.map(s=>s.id===slot.id?slot:s);
 if(!previous)slots.push(slot);
 if(slot.status!=='cancelled')slots=slots.map(s=>s.id!==slot.id&&s.status==='planned'&&!s.resident_id&&s.date===slot.date&&s.start_min>=slot.start_min&&s.end_min<=slot.end_min?{...s,status:'cancelled'}:s);
 if(previous&&previous.status!=='cancelled'&&(previous.date!==slot.date||previous.start_min!==slot.start_min||previous.end_min!==slot.end_min)&&!(previous.date===slot.date&&previous.start_min<slot.end_min&&previous.end_min>slot.start_min))slots.push({...previous,id:crypto.randomUUID(),resident_id:null,status:'planned',notes:''});
 return {...c,data:{...c.data,slots}};
}
