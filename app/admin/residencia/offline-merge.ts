// Three-way merge: concurrent additions survive; contradictory edits require review.
type Value=any;
function same(a:Value,b:Value):boolean{if(a===b)return true;if(a===null||b===null||typeof a!=='object'||typeof b!=='object')return false;if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i]));const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.prototype.hasOwnProperty.call(b,k)&&same(a[k],b[k]));}
export function mergeVersions(base:Value,local:Value,remote:Value,prefer?:'local'|'remote'):{value:Value;conflicts:string[]}{
 const conflicts:string[]=[];
 function merge(b:Value,l:Value,r:Value,path:string):Value{
  if(same(l,r)||same(b,r))return l;
  if(same(b,l))return r;
  if(Array.isArray(l)&&Array.isArray(r)&&[...l,...r].every(x=>x&&typeof x==='object'&&typeof x.id==='string')){
   const bs=Array.isArray(b)?b:[],ids=[...new Set([...r,...l,...bs].map(x=>x.id))];
   return ids.map(id=>merge(bs.find(x=>x.id===id),l.find(x=>x.id===id),r.find(x=>x.id===id),path+'/'+id)).filter(x=>x!==undefined);
  }
  if(l&&r&&typeof l==='object'&&typeof r==='object'&&!Array.isArray(l)&&!Array.isArray(r)){
   return Object.fromEntries([...new Set([...Object.keys(b||{}),...Object.keys(l),...Object.keys(r)])].filter(k=>!['revision','updated_at'].includes(k)).map(k=>[k,merge(b?.[k],l[k],r[k],path+'/'+k)]).filter(([,v])=>v!==undefined));
  }
  conflicts.push(path);return prefer==='remote'?r:l;
 }
 return {value:merge(base,local,remote,''),conflicts};
}
export function matchesPayload(remote:Value,payload:Value):boolean{
 return remote!=null&&Object.keys(payload).every(k=>k==='updated_at'||same(remote[k],payload[k]));
}
