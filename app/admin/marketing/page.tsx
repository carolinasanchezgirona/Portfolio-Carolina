"use client";
import { useEffect, useState } from "react";
import AdminWorkspaceNav from "../workspace-nav";
type Stats = {connected?:boolean; list_found?:boolean; subscriber_count?:number|null; error?:string};
const sessionKey = "dememoria_admin_session";
export default function MarketingPage(){
 const [stats,setStats]=useState<Stats|null>(null);
 const [state,setState]=useState("Comprobando acceso…");
 useEffect(()=>{
  const load=async()=>{
   try{
    const stored=sessionStorage.getItem(sessionKey);
    const session=stored?JSON.parse(stored):null;
    if(!session?.access_token){setState("Necesitas iniciar sesión desde Recursos digitales para acceder a Marketing.");return;}
    const response=await fetch("/api/marketing/brevo-stats",{headers:{Authorization:"Bearer "+session.access_token},cache:"no-store"});
    const data=await response.json();
    if(response.status===401){setState("La sesión ha caducado. Vuelve a iniciar sesión en Recursos digitales.");return;}
    setStats(data);
    setState(response.ok?"":"No se han podido cargar las estadísticas.");
   }catch{setState("No se ha podido conectar con el servidor.");}
  };
  void load();
 },[]);
 return <main style={{minHeight:"100vh",background:"#f8fbfd",padding:"32px clamp(18px,4vw,60px)",color:"#173A5E"}}>
 <div style={{maxWidth:1250,margin:"auto"}}>
 <p style={{color:"#08A6A0",fontWeight:700,letterSpacing:".12em",fontSize:13}}>ADMINISTRACIÓN · MARKETING</p>
 <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(34px,4vw,52px)",margin:"12px 0"}}>Suscriptores y captación</h1>
 <p style={{fontSize:18,maxWidth:780,lineHeight:1.6}}>Consulta las suscripciones confirmadas de Brevo y accede a las herramientas de difusión de tus recursos gratuitos.</p>
 <AdminWorkspaceNav active="otra"/>
 <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:16,margin:"30px 0"}}>
 {["Suscriptores confirmados","Nuevas altas","Bajas","Descargas gratuitas"].map((label,i)=><article key={label} style={{background:"#eaf6fb",borderRadius:18,padding:22,minHeight:134}}>
 <h2 style={{fontSize:17,margin:0}}>{label}</h2>
 <p style={{fontSize:i===0?32:18,fontWeight:700,margin:"20px 0 0"}}>{i===0&&typeof stats?.subscriber_count==="number"?stats.subscriber_count: i===0&&stats?.error?stats.error:i===0&&stats&&!stats.list_found?"Lista no localizada":i===0?"Pendiente":"Sin medición"}</p>
 </article>)}
 </section>
 {state?<p role="status" style={{color:"#9e4e43"}}>{state}</p>:null}
 <div style={{display:"flex",flexWrap:"wrap",gap:14,marginTop:25}}>
 <a href="https://c6645869.sibforms.com/serve/MUIFAIuvbjgYqrRqmmfpA-O89yKi9fH-Kb6Yp0UkGDyZKb_O1wjUF1SHUqEcp20MeACDjXZHQBzDuXijbIdqi8CB692onRlW0SA6IVn-N_ym1RIdQjptK-couFyXNVAQiyPtFM4hkdWfLmwNQgVfnarzCyzZDYkTDXyOH2O8g5m7BN-Gw--aM1hnRHHMfp39FyhRtcurRMbxfwtgMQ==" target="_blank" rel="noopener noreferrer" style={{background:"#08A6A0",color:"#fff",padding:"14px 22px",borderRadius:10,textDecoration:"none"}}>Ver formulario de suscripción ↗</a>
 <a href="https://app.brevo.com/" target="_blank" rel="noopener noreferrer" style={{background:"#173A5E",color:"#fff",padding:"14px 22px",borderRadius:10,textDecoration:"none"}}>Ver contactos en Brevo ↗</a>
 <a href="/admin/recursos/" style={{border:"1px solid #173A5E",padding:"14px 22px",borderRadius:10,color:"#173A5E",textDecoration:"none"}}>Gestionar recursos</a>
 </div>
 <p style={{marginTop:25,color:"#526c82",lineHeight:1.6}}>Solo el contador de suscriptores procede de Brevo. Las métricas de altas, bajas y descargas requieren una implementación de seguimiento adicional.</p>
 </div></main>;
}