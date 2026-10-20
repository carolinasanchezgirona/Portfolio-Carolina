'use client';
import {useState} from 'react';
import {readXlsxLocally} from '../economia/xlsx-reader';
import {blankResident,normalizeResident,Resident} from './model';
import {residenceApi} from './api';
import {codeForAdmission} from './resident-code';
type Candidate={name:string;code:string;center:string;room:string;birthDate:string;admission:string;duplicate:boolean;selected:boolean};
const norm=(v:unknown)=>String(v??'').trim();
const columns=['Nombre y apellidos','Centro','Habitación','Fecha de nacimiento','Fecha de ingreso'];
const aliases=[['nombre','nombre y apellidos','residente','apellidos y nombre'],['codigo','código','codigo interno','código interno','id residente'],['centro','residencia'],['habitacion','habitación','nº habitacion'],['fecha de nacimiento','nacimiento'],['fecha de ingreso','ingreso']];
function parseDelimited(text:string){
 const first=text.replace(/^\uFEFF/,'');const line=first.split(/\r?\n/,1)[0]||'';const sep=(line.match(/;/g)||[]).length>(line.match(/,/g)||[]).length?';':',';
 const rows:string[][]=[];let row:string[]=[],cell='',quote=false;
 for(let i=0;i<first.length;i++){const c=first[i];if(c==='"'){if(quote&&first[i+1]==='"'){cell+='"';i++;}else quote=!quote;}else if(c===sep&&!quote){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quote){if(c==='\r'&&first[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';}else cell+=c;}
 row.push(cell);if(row.some(v=>v.trim()))rows.push(row);return rows;
}
function esc(x:string){return '"'+x.replace(/"/g,'""')+'"';}
export default function ResidentImport({existing,onImported}:{existing:Resident[];onImported:(rows:Resident[])=>void}){
 const [open,setOpen]=useState(false),[data,setData]=useState<Candidate[]>([]),[error,setError]=useState(''),[busy,setBusy]=useState(false),[result,setResult]=useState('');
 const known=new Set(existing.map(r=>r.center.trim().toLowerCase()+'|'+r.code.trim().toLowerCase()));
 function template(){const csv=[columns,['Ana Ejemplo','Centro Ejemplo','12','1941-06-12','2026-10-20']].map(r=>r.map(esc).join(';')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));a.download='plantilla_residentes.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
 async function load(file:File){setError('');setResult('');try{
  if(file.size>5000000)throw Error('El archivo no puede superar 5 MB.');
  const rows=/\.xlsx$/i.test(file.name)?(await readXlsxLocally(file))[0]?.rows||[]: /\.csv$/i.test(file.name)?parseDelimited(await file.text()):[];
  if(!rows.length)throw Error('Solo se admite CSV o Excel .xlsx con filas de datos.');
  const head=(rows[0]||[]).map(v=>norm(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''));
  const indices=aliases.map(list=>head.findIndex(v=>list.some(alias=>v===alias.normalize('NFD').replace(/[\u0300-\u036f]/g,''))));
  if(indices[0]<0||indices[2]<0||indices[5]<0)throw Error('Faltan columnas: nombre, centro o fecha de ingreso. Descarga la plantilla.');
  const used=[...existing.map(r=>({code:r.code,center:r.center}))];
  const parsed=rows.slice(1,501).map(row=>{const get=(i:number)=>i<0?'':norm(row[i]);const [name,,center,room,birthDate,admission]=indices.map(get);const code=codeForAdmission(admission,center,used);if(code)used.push({code,center});return {name,code,center,room,birthDate,admission,duplicate:false,selected:!!name&&!!code&&!!center};}).filter(r=>r.name||r.code||r.center);
  if(!parsed.length)throw Error('No se encontraron filas de residentes.');
  setData(parsed);
 }catch(e){setError((e as Error).message);setData([]);}}
 async function importRows(){const selected=data.filter(r=>r.selected&&!r.duplicate);if(!selected.length)return;setBusy(true);setError('');const saved:Resident[]=[];try{
  for(const item of selected){const resident=blankResident();resident.code=item.code;resident.center=item.center;resident.data.profile={name:item.name,room:item.room,birthDate:item.birthDate,admission:item.admission};
   const response=await residenceApi('/rest/v1/residence_records',{method:'POST',body:JSON.stringify({...resident,revision:1,updated_at:new Date().toISOString()})});
   if(!response?.[0])throw Error('No se pudo guardar el registro '+item.code);
   saved.push(normalizeResident(response[0]));
  }
  setResult('Importados '+saved.length+' residentes.');setData([]);onImported(saved);
 }catch(e){setError('Importados '+saved.length+' de '+selected.length+'. '+(e as Error).message);if(saved.length)onImported(saved);}finally{setBusy(false);}}
 return <div className="res-bulk"><button type="button" onClick={()=>setOpen(!open)} aria-expanded={open}>Importar residentes en bloque</button>{open&&<section className="res-bulk-panel"><h3>Importar desde Excel o CSV</h3><p>Los datos se leen primero en este dispositivo. Revisa la vista previa antes de guardarlos. Solo se crean fichas nuevas, sin sobrescribir historiales.</p><button type="button" onClick={template}>Descargar plantilla CSV</button><label>Seleccionar archivo<input type="file" accept=".csv,.xlsx" disabled={busy} onChange={e=>{const file=e.target.files?.[0];if(file)void load(file);}}/></label>{error&&<p role="alert">{error}</p>}{result&&<p role="status">{result}</p>}{data.length>0&&<><p>{data.filter(r=>r.selected&&!r.duplicate).length} seleccionados de {data.length}. Se asigna un código correlativo por fecha y centro; revisa los registros antes de guardar.</p><div className="res-import-table"><table><thead><tr><th>Importar</th><th>Nombre</th><th>Código</th><th>Centro</th><th>Habitación</th><th>Estado</th></tr></thead><tbody>{data.map((r,i)=><tr key={i}><td><input type="checkbox" disabled={r.duplicate||busy} checked={r.selected} onChange={e=>setData(old=>old.map((item,j)=>j===i?{...item,selected:e.target.checked}:item))}/></td><td>{r.name}</td><td>{r.code}</td><td>{r.center}</td><td>{r.room}</td><td>{r.duplicate?'Duplicado':r.name&&r.code&&r.center?'Preparado':'Incompleto'}</td></tr>)}</tbody></table></div><button type="button" disabled={busy||!data.some(r=>r.selected&&!r.duplicate)} onClick={()=>void importRows()}>{busy?'Importando…':'Confirmar importación'}</button></>}</section>}</div>;
}
