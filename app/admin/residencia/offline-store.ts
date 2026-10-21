import {remoteApi,ResidenceApiError,residenceOwner} from './remote';
import {mergeVersions,matchesPayload} from './offline-merge';
import {monday,addDays} from './schedule-model';
import {today} from './model';
type Row={id:string;revision:number;[key:string]:any};
type Pending={id:string;table:string;rows:Row[];base:(Row|null)[];created:string;error?:string;remote?:Row[]};
type Draft={resident:Row;tab:string;entry:any;dirty:boolean};
type State={owner:string;cache:Record<string,Row[]>;pending:Pending[];draft?:Draft;lastSync?:string;prepared?:string;persistent?:boolean;history?:Pending[];versions?:Record<string,Row>;complete?:Record<string,boolean>;localRevision?:number};
type Vault={version:1;salt:Uint8Array;iv:Uint8Array;data:ArrayBuffer};
let key:CryptoKey|null=null;
let salt:Uint8Array;
let memory:State|null=null;
const dbName='dememoria-residence-encrypted-v1';
export const offlineEvent='residence-offline-change';
export const syncedEvent='residence-offline-synced';
function notify(){window.dispatchEvent(new Event(offlineEvent));}
async function db(){return new Promise<IDBDatabase>((resolve,reject)=>{const req=indexedDB.open(dbName,1);req.onupgradeneeded=()=>req.result.createObjectStore('vault');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(Error('No se puede abrir el almacenamiento del dispositivo.'));});}
async function readVault():Promise<Vault|undefined>{const d=await db();try{return await new Promise((resolve,reject)=>{const t=d.transaction('vault'),r=t.objectStore('vault').get('main');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}finally{d.close();}}
async function derive(password:string,s:Uint8Array){const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:s as BufferSource,iterations:600000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function decode(v:Vault):Promise<State>{if(!key)throw Error('Desbloquea la copia local.');return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:v.iv as BufferSource},key,v.data)));}
async function persist(s:State){if(!key)throw Error('Desbloquea la copia local.');const iv=crypto.getRandomValues(new Uint8Array(12)),data=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(s)));const d=await db();try{await new Promise<void>((resolve,reject)=>{const t=d.transaction('vault','readwrite');t.objectStore('vault').put({version:1,salt,iv,data},'main');t.oncomplete=()=>resolve();t.onabort=()=>reject(Error('No se pudo guardar en el dispositivo. No cierres el editor.'));t.onerror=()=>reject(Error('Almacenamiento lleno o no disponible. No cierres el editor.'));});memory=s;notify();}finally{d.close();}}
// Web Locks serialize every vault mutation AND remote replay across tabs.
async function locked<T>(work:(s:State)=>Promise<T>):Promise<T>{if(!navigator.locks)throw Error('Este navegador no permite proteger la sincronización entre ventanas. Usa Chrome actualizado.');return navigator.locks.request(dbName,async()=>{const v=await readVault();if(!v||!key)throw Error('Desbloquea la copia local.');const s=await decode(v);memory=s;return work(s);});}
export async function hasVault(){return !!(await readVault());}
export function isUnlocked(){return !!key&&!!memory;}
export function offlineStatus(){return {enabled:isUnlocked(),pending:memory?.pending.length||0,issues:memory?.pending.filter(p=>p.error)||[],lastSync:memory?.lastSync,prepared:memory?.prepared,persistent:memory?.persistent};}
export async function enableOffline(password:string){
 if(password.length<10)throw Error('Usa una contraseña de al menos 10 caracteres.');
 if(!navigator.locks)throw Error('Actualiza el navegador para utilizar el modo sin conexión.');
 const user=await remoteApi('/auth/v1/user');if(user?.id!==residenceOwner)throw Error('Acceso reservado a la administradora.');
 await navigator.locks.request(dbName,async()=>{if(await readVault())throw Error('Ya existe una copia local. Desbloquéala con su contraseña.');salt=crypto.getRandomValues(new Uint8Array(16));key=await derive(password,salt);await persist({owner:user.id,cache:{},pending:[]});});
}
export async function unlockOffline(password:string){const v=await readVault();if(!v)throw Error('No hay copia local preparada.');const candidate=await derive(password,v.salt);try{const s=JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:v.iv as BufferSource},candidate,v.data)));if(s.owner!==residenceOwner)throw Error();key=candidate;salt=v.salt;memory=s;notify();}catch{throw Error('Contraseña incorrecta o copia local dañada. No se ha borrado ningún dato.');}}
export async function lockOffline(){await navigator.locks.request(dbName,()=>{key=null;memory=null;notify();});}
export function savedDraft(){return memory?.draft;}
export async function storeDraft(draft:Draft|undefined){if(isUnlocked())await locked(async s=>{s.draft=draft;await persist(s);});}
function tableOf(path:string){return path.match(/^\/rest\/v1\/(residence_records|residence_schedule_types|residence_schedule)(?:\?|$)/)?.[1];}
function overlay(s:State,table:string,rows:Row[]){const result=new Map(rows.map(r=>[r.id,r]));for(const p of s.pending.filter(p=>p.table===table))for(const r of p.rows)result.set(r.id,r);return [...result.values()];}
function cachedRows(s:State,table:string){return [...new Map(Object.entries(s.cache).filter(([p])=>tableOf(p)===table).flatMap(([,rows])=>rows).map(r=>[r.id,r])).values()];}
function filterRows(path:string,rows:Row[]){const u=new URL(path,'https://local');let result=rows.filter(r=>[...u.searchParams].every(([k,v])=>!['id','event_date'].includes(k)||(v.startsWith('eq.')?String(r[k])===v.slice(3):v.startsWith('gte.')?String(r[k])>=v.slice(4):v.startsWith('lte.')?String(r[k])<=v.slice(4):true)));const order=u.searchParams.get('order')?.split(',')||[];result.sort((a,b)=>{for(const field of order){const [k,d]=field.split('.'),av=a[k],bv=b[k];const diff=av===bv?0:av>bv?1:-1;if(diff)return d==='desc'?-diff:diff;}return 0;});const offset=Number(u.searchParams.get('offset')||0),limit=Number(u.searchParams.get('limit')||result.length);return result.slice(offset,offset+limit);}
function remember(s:State,table:string,rows:Row[]){s.versions ||= {};for(const r of rows)s.versions[table+'/'+r.id+'/'+r.revision]=r;}
function scopeOf(path:string){const u=new URL(path,'https://local');u.searchParams.delete('offset');return u.pathname+'?'+u.searchParams.toString();}
function networkFailure(e:unknown){return !(e instanceof ResidenceApiError)&&(e instanceof TypeError||e instanceof DOMException);}
export async function offlineApi(path:string,init:RequestInit={}){
 if(!isUnlocked())return remoteApi(path,init);
 if(path==='/auth/v1/user'){
  try{const user=await remoteApi(path);if(user?.id!==residenceOwner)throw new ResidenceApiError('Acceso no autorizado.',403);return user;}catch(e){if(networkFailure(e)||(e instanceof ResidenceApiError&&e.status===401))return {id:memory!.owner};throw e;}
 }
 const table=tableOf(path);if(!table)return remoteApi(path,init);
 if(!init.method||init.method==='GET'){
  try{const rows=await remoteApi(path,init);if(!Array.isArray(rows))throw Error('Respuesta no válida.');return await locked(async s=>{for(const [cachedPath,cached] of Object.entries(s.cache))if(tableOf(cachedPath)===table)s.cache[cachedPath]=cached.map(r=>rows.find(n=>n.id===r.id)||r);s.cache[path]=rows;const params=new URL(path,'https://local').searchParams,limit=Number(params.get('limit')||0);s.complete ||= {};if(!params.get('offset')||params.get('offset')==='0')s.complete[scopeOf(path)]=false;if(limit&&rows.length<limit)s.complete[scopeOf(path)]=true;const result=filterRows(path,overlay(s,table,cachedRows(s,table)));remember(s,table,result);await persist(s);return result;});}
  catch(e){if(!networkFailure(e)&&!(e instanceof ResidenceApiError&&e.status===401))throw e;return locked(async s=>{if(!(path in s.cache)&&!s.complete?.[scopeOf(path)])throw Error('Este apartado o semana todavía no está descargado. Ábrelo con conexión antes de usarlo aquí.');const result=filterRows(path,overlay(s,table,cachedRows(s,table)));remember(s,table,result);await persist(s);return result;});}
 }
 if(!['POST','PATCH'].includes(init.method))throw Error('Esta operación requiere conexión.');
 const raw=JSON.parse(String(init.body)),rows:Row[]=Array.isArray(raw)?raw:[raw];
 if(!rows.length||rows.some(r=>!r.id||!Number.isInteger(r.revision)))throw Error('Registro no válido para guardado local.');
 await locked(async s=>{const all=overlay(s,table,Object.entries(s.cache).filter(([p])=>tableOf(p)===table).flatMap(([,r])=>r));const expected=Number(new URL(path,'https://local').searchParams.get('revision')?.slice(3));const base=rows.map(r=>init.method==='POST'?null:s.versions?.[table+'/'+r.id+'/'+expected]||all.find(x=>x.id===r.id)||null);for(const r of rows){s.localRevision=(s.localRevision||0)-1;r.revision=s.localRevision;}remember(s,table,rows);const failed=s.pending.find(p=>p.table===table&&p.error&&rows.every(r=>p.rows.some(x=>x.id===r.id)));if(failed){failed.rows=failed.rows.map(r=>rows.find(x=>x.id===r.id)||r);failed.error=undefined;failed.remote=undefined;}else s.pending.push({id:crypto.randomUUID(),table,rows,base,created:new Date().toISOString()});await persist(s);});
 // Only a committed IndexedDB transaction allows the editor to close.
 void synchronize().catch(()=>{});return rows;
}
// Local revisions are negative and unique per vault, so optimistic edits in two
// windows cannot alias a server revision or each other's base snapshot.
function acknowledged(remote:Row|undefined,payload:Row){return !!remote&&matchesPayload(remote,{...payload,revision:remote.revision});}
function readPath(table:string,id:string){return '/rest/v1/'+table+'?select=*&id=eq.'+encodeURIComponent(id);}
async function replay(p:Pending,prefer?:'local'|'remote'){
 const result:Row[]=[];
 // POST batches stay atomic (e.g. repeated weekly appointments).
 const existing=await Promise.all(p.rows.map(r=>remoteApi(readPath(p.table,r.id)).then(rows=>rows[0] as Row|undefined)));
 if(p.base.every(b=>!b)){
  if(existing.every((r,i)=>acknowledged(r,p.rows[i])))return existing as Row[];
  if(existing.some(Boolean))throw Error('El registro ya existe con otra versión. La copia local sigue pendiente.');
  return remoteApi('/rest/v1/'+p.table,{method:'POST',body:JSON.stringify(p.rows.length===1?{...p.rows[0],revision:1}:p.rows.map(r=>({...r,revision:1})))});
 }
 for(let i=0;i<p.rows.length;i++){
  const local=p.rows[i],base=p.base[i],remote=existing[i];
  if(remote&&acknowledged(remote,local)){result.push(remote);continue;}
  if(!remote)throw Error('El registro no está disponible en el servidor. La copia local se conserva.');
  const merged=mergeVersions(base,local,remote,prefer);
  if(merged.conflicts.length&&!prefer){p.remote=existing.filter(Boolean) as Row[];throw Error('Hay cambios diferentes en el mismo registro. Revisa las dos versiones.');}
  const value={...merged.value,id:local.id,revision:remote.revision+1,updated_at:new Date().toISOString()};
  if(p.table!=='residence_records')delete value.updated_at;
  if(p.table==='residence_schedule')delete value.slot;
  const saved=await remoteApi('/rest/v1/'+p.table+'?id=eq.'+encodeURIComponent(local.id)+'&revision=eq.'+remote.revision,{method:'PATCH',body:JSON.stringify(value)});
  if(!saved?.[0])throw Error('El registro ha vuelto a cambiar. Reintenta la sincronización.');result.push(saved[0]);
 }
 return result;
}
let syncing:Promise<void>|null=null;
export function synchronize(prefer?:'local'|'remote'):Promise<void>{
 if(syncing)return syncing;
 if(!isUnlocked()||!navigator.onLine)return Promise.resolve();
 syncing=locked(async s=>{
  const user=await remoteApi('/auth/v1/user');if(user?.id!==s.owner)throw new ResidenceApiError('Inicia sesión con la cuenta de la administradora.',403);
  while(s.pending.length){const p=s.pending[0];try{const returned=await replay(p,prefer);if(prefer){s.history=[...(s.history||[]),structuredClone(p)];prefer=undefined;}
   // Rebase dependent local saves onto the acknowledged merged server version.
   for(let i=0;i<p.rows.length;i++){const local=p.rows[i],server=returned.find((r:Row)=>r.id===local.id);if(!server)throw Error('El servidor no ha confirmado todos los registros.');
    for(const next of s.pending.slice(1).filter(n=>n.table===p.table)){const j=next.rows.findIndex(r=>r.id===local.id);if(j>=0){const old=next.rows[j],merged=mergeVersions(next.base[j],old,server);if(!merged.conflicts.length){next.base[j]=server;next.rows[j]={...merged.value,revision:old.revision};}break;}}
    for(const [path,cached] of Object.entries(s.cache))if(tableOf(path)===p.table)s.cache[path]=[...cached.filter(r=>r.id!==server.id),server];
   }
   s.pending.shift();s.lastSync=new Date().toISOString();await persist(s);
  }catch(e){p.error=(e as Error).message;await persist(s);throw e;}}
 });
 return syncing.then(()=>{window.dispatchEvent(new Event(syncedEvent));}).finally(()=>{syncing=null;notify();});
}
export async function prepareOffline(){
 if(!isUnlocked())throw Error('Activa y desbloquea primero el modo sin conexión.');
 await synchronize();
 // Capture exact paginated queries used by the workspace, including an empty final page.
 for(let offset=0;;offset+=500){const rows=await offlineApi('/rest/v1/residence_records?select=*&order=code.asc,id.asc&limit=500&offset='+offset);if(rows.length<500)break;}
 await offlineApi('/rest/v1/residence_schedule_types?select=*&order=label.asc&limit=1000');
 const week=monday(today());for(let offset=0;;offset+=500){const rows=await offlineApi('/rest/v1/residence_schedule?select=id,event_date,start_min,end_min,category_id,title,center,resident_id,location,notes,status,revision&event_date=gte.'+week+'&event_date=lte.'+addDays(week,5)+'&order=event_date.asc,start_min.asc,id.asc&limit=500&offset='+offset);if(rows.length<500)break;}
 if(!('serviceWorker' in navigator))throw Error('El navegador no permite preparar la aplicación sin conexión.');
 const reg=await navigator.serviceWorker.register('/sw.js');await reg.update();await navigator.serviceWorker.ready;
 const installing=reg.installing||reg.waiting;if(installing&&installing.state!=='activated')await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('La actualización de la aplicación sigue pendiente. Reintenta la descarga.')),20000);installing.addEventListener('statechange',()=>{if(installing.state==='activated'){clearTimeout(timer);resolve();}else if(installing.state==='redundant'){clearTimeout(timer);reject(Error('No se ha podido actualizar la aplicación.'));}});});
 const worker=reg.active;if(!worker)throw Error('Espera unos segundos y vuelve a preparar la copia.');
 const assets=[...document.querySelectorAll<HTMLScriptElement>('script[src]')].map(e=>e.src).concat([...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"],link[rel="preload"],link[rel="modulepreload"]')].map(e=>e.href));
 await new Promise<void>((resolve,reject)=>{const channel=new MessageChannel(),timer=setTimeout(()=>reject(Error('No se ha podido descargar la aplicación completa. Reintenta con conexión.')),60000);channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();e.data.ok?resolve():reject(Error('No se ha podido descargar la aplicación completa.'));};worker.postMessage({type:'PREPARE_RESIDENCE_OFFLINE',assets},[channel.port2]);});
 const persistent=await navigator.storage?.persist?.().catch(()=>false)||false;
 await locked(async s=>{s.prepared=new Date().toISOString();s.persistent=persistent;await persist(s);});
}
