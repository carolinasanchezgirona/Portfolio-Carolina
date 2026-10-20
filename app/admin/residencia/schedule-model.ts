export type ScheduleType={id:string;label:string;color:string;revision:number};
export type ScheduleEvent={id:string;event_date:string;start_min:number;end_min:number;category_id:string;title:string;center:string;resident_id:string|null;location:string;notes:string;status:'planned'|'done'|'cancelled';revision:number};
export const weekDays=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
export const timeLabel=(min:number)=>String(Math.floor(min/60)).padStart(2,'0')+':'+String(min%60).padStart(2,'0');
export function addDays(date:string,days:number){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
export function monday(date:string){const d=new Date(date+'T12:00:00Z').getUTCDay();return addDays(date,-((d+6)%7));}
export function validSchedule(e:ScheduleEvent){const day=new Date(e.event_date+'T12:00:00Z').getUTCDay();return !!e.title.trim()&&!!e.center.trim()&&!!e.category_id&&day>=1&&day<=6&&e.start_min>=540&&e.end_min<=1140&&e.end_min>e.start_min&&e.start_min%30===0&&e.end_min%30===0;}
export function overlaps(a:ScheduleEvent,b:ScheduleEvent){return a.id!==b.id&&a.status!=='cancelled'&&b.status!=='cancelled'&&a.event_date===b.event_date&&a.start_min<b.end_min&&a.end_min>b.start_min;}
