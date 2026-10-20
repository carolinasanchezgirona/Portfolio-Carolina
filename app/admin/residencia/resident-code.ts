import type {Resident} from './model';
export function codeForAdmission(date:string,center:string,existing:Pick<Resident,'code'|'center'>[]):string{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date+'T12:00:00Z'))||!center.trim())return '';
 const prefix=date.replace(/-/g,'')+'-';
 const same=existing.filter(r=>r.center.trim().toLocaleLowerCase('es')===center.trim().toLocaleLowerCase('es'));
 const used=new Set(same.map(r=>r.code));
 let sequence=1;
 while(used.has(prefix+String(sequence).padStart(3,'0')))sequence++;
 return prefix+String(sequence).padStart(3,'0');
}
