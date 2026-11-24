"use client";
import {useEffect,useState} from "react";
import AdminWorkspaceNav from "../workspace-nav";
import "./seo.css";
type Metric={keys?:string[];clicks:number;impressions:number;ctr:number;position:number};
type Range={startDate:string;endDate:string};
type Data={connected:boolean;message?:string;error?:string;property?:string;periods?:{current:Range;previous:Range};totals?:Metric|null;previous?:Metric|null;dates?:Metric[];queries?:Metric[];pages?:Metric[];updatedAt?:string};
type Audit={url:string;status:number|null;issues:string[];title:string;description:string;canonical:string};
type Snapshot={at:string;rows:Audit[];total:number};
const site="https://carolinasanchezgirona.com";
const storage="portfolio-seo-technical-v1";
const sessionKey="dememoria_admin_session";
const nf=new Intl.NumberFormat("es-ES",{maximumFractionDigits:2});
const links=[["Google Search Console","https://search.google.com/search-console/"],["Google Business Profile","https://business.google.com/"],["Google Analytics","https://analytics.google.com/analytics/web/"],["PageSpeed Insights","https://pagespeed.web.dev/"],["Bing Webmaster Tools","https://www.bing.com/webmasters/"]];
const keywords=["psicóloga Arenys de Mar","psicòloga Arenys de Mar","psicóloga Maresme","psicóloga ansiedad Arenys de Mar","neuropsicóloga Arenys de Mar","neuropsicòloga Maresme","neuropsicóloga Maresme","evaluación neuropsicológica Maresme","diagnóstico TDAH adultos Maresme","avaluació TDAH adults Maresme","evaluación TEA adultos Maresme","valoración memoria Maresme","deterioro cognitivo Arenys de Mar","demencias Maresme","evaluación altas capacidades Maresme","evaluación dislexia Maresme","consultoría neuropsicológica jurídica"];
const priority=["/","/psicologa-arenys-de-mar/","/psicologa-maresme/","/psicologia/","/neuropsicologia/","/evaluacion-neuropsicologica/","/evaluacion-tdah-adultos/","/evaluacion-tea-adultos/","/problemas-de-memoria/","/consultoria-neuropsicologica-juridica/","/articulos/"];
const norm=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const format=(n:number|undefined)=>typeof n==="number"?nf.format(n):"—";
const localPath=(url:string)=>{try{return new URL(url).pathname;}catch{return url;}};
function publicUrl(raw:string) {
 try { const u=new URL(raw,site);return u.origin===site&&!u.pathname.startsWith("/admin")&&!u.pathname.startsWith("/api/")&&!u.pathname.startsWith("/mi-espacio")&&!u.search&&!u.hash?u.href:null; } catch {return null;}
}
async function inspect(url:string):Promise<Audit>{
 const row:Audit={url,status:null,issues:[],title:"",description:"",canonical:""};
 try{
  const response=await fetch(new URL(url).pathname,{cache:"no-store",credentials:"omit",signal:AbortSignal.timeout(15000)});
  row.status=response.status;
  if(!response.ok){row.issues.push("HTTP "+response.status);return row;}
  if(response.redirected)row.issues.push("Redirección");
  if(!response.headers.get("content-type")?.includes("text/html")){row.issues.push("No es HTML");return row;}
  const doc=new DOMParser().parseFromString(await response.text(),"text/html");
  row.title=doc.title.trim();
  row.description=doc.querySelector('meta[name="description" i]')?.getAttribute("content")?.trim()||"";
  row.canonical=doc.querySelector('link[rel="canonical"]')?.getAttribute("href")||"";
  const robots=[response.headers.get("x-robots-tag"),...Array.from(doc.querySelectorAll('meta[name="robots" i],meta[name="googlebot" i]'),m=>m.getAttribute("content"))].join(" ");
  if(/\bnoindex\b/i.test(robots))row.issues.push("Noindex");
  if(!row.title)row.issues.push("Sin título");else if(row.title.length>65)row.issues.push("Título largo (revisar)");
  if(!row.description)row.issues.push("Sin descripción");else if(row.description.length>165)row.issues.push("Descripción larga (revisar)");
  if(!row.canonical)row.issues.push("Sin canonical");else if(publicUrl(row.canonical)!==url)row.issues.push("Canonical diferente");
  if(doc.querySelectorAll("h1").length!==1)row.issues.push("Revisar H1");
 }catch{row.issues.push("No comprobada (error de red o tiempo límite)");}
 return row;
}
export default function SeoPage(){
 const [data,setData]=useState<Data|null>(null),[ready,setReady]=useState(false),[status,setStatus]=useState("Verificando acceso profesional…");
 const [tab,setTab]=useState("Resumen"),[busy,setBusy]=useState(false),[history,setHistory]=useState<Snapshot[]>([]),[progress,setProgress]=useState(""),[search,setSearch]=useState("");
 async function load(){
  setBusy(true);setReady(false);
  try{
   const token=JSON.parse(sessionStorage.getItem(sessionKey)||"null")?.access_token;
   if(!token)throw new Error("Inicia sesión en el panel profesional.");
   const response=await fetch("/api/admin/seo",{headers:{Authorization:"Bearer "+token},cache:"no-store"});
   const result=await response.json() as Data;
   if(response.status===401)throw new Error("Acceso no autorizado. Inicia sesión y verifica los dos factores.");
   if(!response.ok&&response.status!==502)throw new Error(result.error||"No se ha podido verificar el panel.");
   setData(result);setReady(true);setStatus(result.error||result.message||"Datos actualizados.");
   try{const saved=JSON.parse(localStorage.getItem(storage)||"[]");if(Array.isArray(saved))setHistory(saved.slice(0,20));}catch{}
  }catch(e){setStatus(e instanceof Error?e.message:"No se ha podido acceder.");}
  finally{setBusy(false);}
 }
 useEffect(()=>{void load();},[]);
 async function audit(){
  setBusy(true);setProgress("Leyendo sitemap…");
  try{
   const response=await fetch("/sitemap.xml",{cache:"no-store",credentials:"omit",signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw new Error("Sitemap no accesible (HTTP "+response.status+").");
   const xml=new DOMParser().parseFromString(await response.text(),"application/xml");
   if(xml.querySelector("parsererror"))throw new Error("Sitemap no válido.");
   const urls=Array.from(new Set(Array.from(xml.getElementsByTagName("loc"),n=>publicUrl(n.textContent||"")).filter((x):x is string=>!!x)));
   if(!urls.length)throw new Error("Sitemap sin URLs públicas comprobables.");
   const selected=Array.from(new Set([...priority.map(p=>site+p).filter(p=>urls.includes(p)),...urls])).slice(0,50);
   const rows:Audit[]=[];
   for(let i=0;i<selected.length;i+=4){rows.push(...await Promise.all(selected.slice(i,i+4).map(inspect)));setProgress(rows.length+" de "+selected.length+" páginas comprobadas…");}
   for(const field of ["title","description"] as const){const counts=new Map<string,number>();for(const row of rows){const value=norm(row[field]);if(value)counts.set(value,(counts.get(value)||0)+1);}for(const row of rows)if((counts.get(norm(row[field]))||0)>1)row.issues.push(field==="title"?"Título duplicado":"Descripción duplicada");}
   const next=[{at:new Date().toISOString(),rows,total:urls.length},...history].slice(0,20);
   setHistory(next);
   try{localStorage.setItem(storage,JSON.stringify(next));setProgress("Auditoría guardada en este navegador.");}catch{setProgress("Auditoría terminada; no se ha podido guardar el histórico local.");}
  }catch(e){setProgress(e instanceof Error?e.message:"Error de auditoría.");}finally{setBusy(false);}
 }
 const current=data?.totals,previous=data?.previous,latest=history[0];
 const tables=(rows:Metric[]|undefined)=> <div className="seo-table"><table><thead><tr><th>Consulta / página</th><th>Clics</th><th>Impresiones</th><th>CTR</th><th>Posición media</th></tr></thead><tbody>{(rows||[]).filter(r=>norm(r.keys?.[0]||"").includes(norm(search))).map(r=><tr key={r.keys?.[0]}><td>{r.keys?.[0]?.startsWith(site)?localPath(r.keys[0]):r.keys?.[0]}</td><td>{format(r.clicks)}</td><td>{format(r.impressions)}</td><td>{format(r.ctr*100)} %</td><td>{format(r.position)}</td></tr>)}</tbody></table>{!rows?.length&&<p>Sin filas disponibles para este periodo.</p>}</div>;
 function exportAudit(){if(!latest)return;const url=URL.createObjectURL(new Blob([JSON.stringify(latest,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="auditoria-seo-"+latest.at.slice(0,10)+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <main id="admin-main-content" className="seo-workspace"><a href="/admin/">← Administración</a><header><p className="seo-kicker">GESTIÓN Y DIFUSIÓN</p><h1>SEO y captación</h1><p>Visibilidad, rendimiento orgánico y estado de tus páginas públicas.</p></header>
 {!ready?<section className="seo-card" role="status"><p>{status}</p><a href="/admin/clinica/acceso/">Acceso profesional</a></section>:<>
 <AdminWorkspaceNav active="seo"/>
 <div className="seo-toolbar"><p role="status">{status}</p><button disabled={busy} onClick={()=>void load()}>Actualizar Google</button></div>
 <nav className="seo-tabs" aria-label="Secciones SEO">{["Resumen","Palabras clave","Páginas","Auditoría técnica","Histórico","SEO local y captación"].map(t=><button key={t} aria-pressed={tab===t} onClick={()=>{setTab(t);setSearch("");}}>{t}</button>)}</nav>
 {tab==="Resumen"&&<><section className="seo-card"><h2>Rendimiento orgánico</h2><p>{data?.periods?data.periods.current.startDate+" a "+data.periods.current.endDate+" · 28 días de datos finales":"Pendiente de conexión con Google Search Console."}</p><div className="seo-metrics">{([["Clics","clicks",1],["Impresiones","impressions",1],["CTR","ctr",100],["Posición media","position",1]] as const).map(([label,key,mult])=><article key={key}><span>{label}</span><strong>{format(current?current[key]*mult:undefined)}{current&&key==="ctr"?" %":""}</strong><small>{previous?("Anterior: "+format(previous[key]*mult)+(key==="ctr"?" %":"")):"Sin comparativa disponible"}</small></article>)}</div>
 {!!data?.dates?.length&&<><h3>Clics diarios</h3><div className="seo-bars" aria-label="Clics diarios">{[...data.dates].sort((a,b)=>(a.keys?.[0]||"").localeCompare(b.keys?.[0]||"")).map(r=><div key={r.keys?.[0]} title={(r.keys?.[0]||"")+": "+r.clicks+" clics"}><i style={{height:(r.clicks/Math.max(1,...data.dates!.map(x=>x.clicks))*100)+"%"}}/><small>{r.keys?.[0]?.slice(8)}</small></div>)}</div></>}
 <p className="seo-note">Posición media ponderada de Google, no ranking geolocalizado. Las filas de consultas pueden omitir búsquedas anonimizadas.</p></section><section className="seo-card"><h2>Estado técnico</h2><p>{latest?latest.rows.length+" páginas revisadas · "+latest.rows.filter(r=>r.issues.length).length+" con avisos":"Todavía no se ha realizado una auditoría."}</p><button onClick={()=>setTab("Auditoría técnica")}>Abrir auditoría</button></section></>}
 {(tab==="Palabras clave"||tab==="Páginas")&&<section className="seo-card"><h2>{tab}</h2><p>Hasta 100 filas principales de Google Search Console, ordenadas por clics. No es un listado exhaustivo.</p><input aria-label="Filtrar resultados" placeholder="Buscar…" value={search} onChange={e=>setSearch(e.target.value)}/>{tables(tab==="Palabras clave"?data?.queries:data?.pages)}
 {tab==="Palabras clave"&&<><h3>Consultas estratégicas</h3><p>Coincidencia textual exacta en las filas devueltas; ausencia no significa que no estés posicionada.</p><div className="seo-table"><table><thead><tr><th>Búsqueda</th><th>Posición media</th><th>Impresiones</th></tr></thead><tbody>{keywords.map(k=>{const r=data?.queries?.find(row=>norm(row.keys?.[0]||"")===norm(k));return <tr key={k}><td>{k}</td><td>{r?format(r.position):"Sin dato"}</td><td>{r?format(r.impressions):"—"}</td></tr>})}</tbody></table></div></>}</section>}
 {tab==="Auditoría técnica"&&<section className="seo-card"><h2>Comprobación de páginas públicas</h2><p>Revisa hasta 50 URLs del sitemap, priorizando los servicios. Los avisos son comprobaciones técnicas, no un diagnóstico de indexación de Google.</p><div className="seo-toolbar"><button disabled={busy} onClick={()=>void audit()}>{busy?"Comprobando…":"Ejecutar auditoría"}</button><button disabled={!latest} onClick={exportAudit}>Exportar JSON</button></div><p role="status">{progress}</p>{latest&&<><p>{new Date(latest.at).toLocaleString("es-ES")} · {latest.rows.length} de {latest.total} URLs del sitemap</p><div className="seo-table"><table><thead><tr><th>Página</th><th>HTTP</th><th>Avisos</th><th>Título</th></tr></thead><tbody>{latest.rows.map(r=><tr key={r.url}><td><a href={r.url} target="_blank" rel="noreferrer">{localPath(r.url)}</a></td><td>{r.status??"—"}</td><td>{r.issues.length?r.issues.join(" · "):"Sin avisos detectados"}</td><td>{r.title||"—"}</td></tr>)}</tbody></table></div></>}</section>}
 {tab==="Histórico"&&<section className="seo-card"><h2>Histórico de auditorías</h2><p>Hasta 20 comprobaciones en este navegador. No se sincroniza entre dispositivos. El histórico orgánico de Google se consulta por periodos.</p><div className="seo-table"><table><thead><tr><th>Fecha</th><th>URLs revisadas</th><th>Con avisos</th></tr></thead><tbody>{history.map(s=><tr key={s.at}><td>{new Date(s.at).toLocaleString("es-ES")}</td><td>{s.rows.length}</td><td>{s.rows.filter(r=>r.issues.length).length}</td></tr>)}</tbody></table></div>{!history.length&&<p>Sin auditorías guardadas.</p>}</section>}
 {tab==="SEO local y captación"&&<section className="seo-card"><h2>Fuentes y seguimiento comercial</h2><p>La integración directa con Google Business Profile, las posiciones de competidores y la atribución de reservas no están conectadas. No se muestran métricas ficticias.</p><div className="seo-links">{links.map(([name,url])=><a key={name} href={url} target="_blank" rel="noreferrer">{name} ↗</a>)}<a href="/admin/marketing/">Marketing y primeras visitas →</a></div><p>Los recuentos de reservas existentes no prueban que procedan de búsquedas orgánicas.</p></section>}
 </>}</main>;
}
