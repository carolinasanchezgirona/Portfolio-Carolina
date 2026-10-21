import type {Resident} from './model';

function validDate(value:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const d=new Date(value+'T12:00:00Z');
 return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===value;
}
function isoDate(year:number,month:number,day:number){return new Date(Date.UTC(year,month,day,12)).toISOString().slice(0,10);}
export function monthlyFollowups(resident:Resident,now:string){
 const month=now.slice(0,7),year=Number(now.slice(0,4)),monthIndex=Number(now.slice(5,7))-1;
 const admission=resident.data.profile.admission||'';
 const entries=resident.data.followups.filter(e=>validDate(e.date||'')&&e.date<=now&&(!validDate(admission)||e.date>=admission));
 // Multiple notes on a single day describe one follow-up, rather than several visits.
 const dates=[...new Set(entries.filter(e=>e.date.startsWith(month+'-')).map(e=>e.date))].sort();
 const completed=dates.length,remaining=Math.max(0,2-completed);
 const first=isoDate(year,monthIndex,15),last=isoDate(year,monthIndex+1,0);
 let next=completed===0?first:completed===1?last:isoDate(year,monthIndex+1,15);
 if(validDate(admission)&&admission>next)next=admission;
 const latest=[...entries].sort((a,b)=>b.date.localeCompare(a.date)||(b.createdAt||'').localeCompare(a.createdAt||'')||b.id.localeCompare(a.id))[0];
 const explicit=latest?.next||'';
 if(validDate(explicit)&&explicit<next)next=explicit;
 return {completed,remaining,next,last:entries.map(e=>e.date).sort().at(-1)||'',overdue:next<now,dueToday:next===now};
}
