type Deps = { owner(r:Request):Promise<boolean>; session(r:Request):Promise<{patient_id:string}|null>; origin(r:Request):boolean; query(p:string,i?:RequestInit):Promise<Response>; json(b:unknown,s?:number):Response };
export async function patientNotices(request:Request,d:Deps):Promise<Response>{
 const admin=new URL(request.url).pathname.startsWith("/api/admin/");
 if(admin ? !await d.owner(request) : !await d.session(request)) return d.json({error:"Acceso no autorizado."},401);
 const method=request.method;
 if(method!=="GET" && (!admin || !d.origin(request))) return d.json({error:"Operación no autorizada."},403);
 const base="patient_general_notices";
 try {
 if(method==="GET"){
 const now=encodeURIComponent(new Date().toISOString());
 const q=base+"?select=id,title,body,category,pinned,starts_at,ends_at,active,created_at&order=pinned.desc,created_at.desc&limit=100"+(admin?"":"&active=eq.true&starts_at=lte."+now+"&or=(ends_at.is.null,ends_at.gt."+now+")");
 const res=await d.query(q);if(!res.ok)throw Error();return d.json({notices:await res.json()});
 }
 if(!["POST","PATCH"].includes(method))return d.json({error:"Método no permitido."},405);
 const raw=await request.text();if(raw.length>15000)return d.json({error:"Aviso demasiado largo."},413);
 const v=JSON.parse(raw);
 const id=typeof v.id==="string"&&/^[0-9a-f-]{36}$/i.test(v.id)?v.id:null;
 if(method==="PATCH"&&!id)return d.json({error:"Identificador no válido."},400);
 let data:Record<string,unknown>;
 if(method==="PATCH"&&v.active===false&&v.title===undefined){data={active:false};}
 else {
 const title=typeof v.title==="string"?v.title.trim():"",body=typeof v.body==="string"?v.body.trim():"";
 if(!title||title.length>160||!body||body.length>4000||!["availability","holiday","promotion","general"].includes(v.category))return d.json({error:"Revisa título, contenido y categoría."},400);
 const start=new Date(v.starts_at||Date.now()),end=v.ends_at?new Date(v.ends_at):null;
 if(!Number.isFinite(start.getTime())||(end&&(!Number.isFinite(end.getTime())||end<=start)))return d.json({error:"Fechas no válidas."},400);
 data={title,body,category:v.category,pinned:v.pinned===true,active:v.active!==false,starts_at:start.toISOString(),ends_at:end?.toISOString()||null};
 }
 const res=await d.query(base+(method==="PATCH"?"?id=eq."+id:""),{method,body:JSON.stringify(data)});
 if(!res.ok)throw Error();return d.json({ok:true});
 }catch{return d.json({error:"No se ha podido completar la operación."},503);}
}
