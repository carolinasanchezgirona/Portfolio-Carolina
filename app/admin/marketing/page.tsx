"use client";
import { useEffect, useState } from "react";
import AdminWorkspaceNav from "../workspace-nav";
type Stats = {connected?:boolean; list_found?:boolean; subscriber_count?:number|null; error?:string};
type BookingCounts = { total: number; first: number; activeFirst: number; completedFirst: number; truncated: boolean };
const sessionKey = "dememoria_admin_session";
export default function MarketingPage(){
 const [stats,setStats]=useState<Stats|null>(null);
 const [state,setState]=useState("Comprobando acceso…");
 const [bookingCounts,setBookingCounts]=useState<BookingCounts|null>(null);
 const [bookingStatus,setBookingStatus]=useState("Consultando primeras visitas…");
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
 useEffect(()=>{
   let live=true;
   const loadBookings=async()=>{
     try{
       const saved=sessionStorage.getItem(sessionKey);
       const session=saved?JSON.parse(saved):null;
       if(!session?.access_token){if(live)setBookingStatus("Inicia sesión para consultar las reservas.");return;}
       const from=new Date(Date.now()-30*24*60*60*1000).toISOString();
       const query=new URLSearchParams({select:"patient_type,status,created_at",created_at:"gte."+from,order:"created_at.desc",limit:"1001"});
       const response=await fetch("https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1/appointment_bookings?"+query.toString(),{
         headers:{apikey:"sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii",Authorization:"Bearer "+session.access_token},
         cache:"no-store"
       });
       if(!response.ok)throw new Error("No se pueden consultar las reservas.");
       const data=await response.json();
       if(!Array.isArray(data))throw new Error("Respuesta no válida.");
       if(!live)return;
       const rows=data.slice(0,1000) as Array<{patient_type?:string;status?:string}>;
       const first=rows.filter(r=>r.patient_type==="new");
       const active=first.filter(r=>!["cancelled","canceled"].includes(r.status||""));
       setBookingCounts({total:rows.length,first:first.length,activeFirst:active.length,completedFirst:first.filter(r=>r.status==="completed").length,truncated:data.length>1000});
       setBookingStatus("");
     }catch{if(live)setBookingStatus("No se ha podido cargar el recuento de reservas. Comprueba tu sesión.");}
   };
   void loadBookings();
   return()=>{live=false;};
 },[]);
 return <main className="admin-marketing-page" style={{minHeight:"100vh",background:"#ffffff",padding:"32px clamp(18px,4vw,60px)",color:"#0e5c7c"}}>
 <div style={{maxWidth:1250,margin:"auto"}}>
 <p style={{color:"#0e5c7c",fontWeight:700,letterSpacing:".12em",fontSize:13}}>ADMINISTRACIÓN · MARKETING</p>
 <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(34px,4vw,52px)",margin:"12px 0"}}>Suscriptores y captación</h1>
 <p style={{fontSize:18,maxWidth:780,lineHeight:1.6}}>Consulta las suscripciones confirmadas de Brevo y accede a las herramientas de difusión de tus recursos gratuitos.</p>
 <AdminWorkspaceNav active="otra"/>
 <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:16,margin:"30px 0"}}>
 {["Suscriptores confirmados","Nuevas altas","Bajas","Descargas gratuitas"].map((label,i)=><article key={label} style={{background:"#edf7f7",borderRadius:18,padding:22,minHeight:134}}>
 <h2 style={{fontSize:17,margin:0}}>{label}</h2>
 <p style={{fontSize:i===0?32:18,fontWeight:700,margin:"20px 0 0"}}>{i===0&&typeof stats?.subscriber_count==="number"?stats.subscriber_count: i===0&&stats?.error?stats.error:i===0&&stats&&!stats.list_found?"Lista no localizada":i===0?"Pendiente":"Sin medición"}</p>
 </article>)}
 </section>
 <section aria-labelledby="captacion-reservas-title" style={{margin:"35px 0",padding:"clamp(18px,3vw,28px)",border:"1px solid #edf7f7",borderRadius:18,background:"#fff"}}>
 <p style={{color:"#0e5c7c",fontSize:12,fontWeight:750,letterSpacing:".08em",margin:"0 0 6px"}}>RESERVAS · ÚLTIMOS 30 DÍAS</p>
 <h2 id="captacion-reservas-title" style={{fontFamily:"Georgia,serif",fontSize:"clamp(22px,3vw,30px)",margin:"0 0 12px"}}>Primeras visitas que entran en la consulta</h2>
 <p style={{color:"#536e78",lineHeight:1.6,marginTop:0}}>Datos de tu agenda privada, no de Google Analytics. Se muestran recuentos sin nombres, teléfonos, correos ni información clínica.</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>
 {[
   ["Solicitudes de primera visita",bookingCounts?.first],
   ["Primeras citas no canceladas",bookingCounts?.activeFirst],
   ["Primeras visitas realizadas",bookingCounts?.completedFirst],
   ["Todas las reservas",bookingCounts?.total]
 ].map(([label,value])=><div key={String(label)} style={{padding:17,borderRadius:12,background:"#edf7f7"}}>
   <p style={{fontSize:14,margin:0}}>{label}</p>
   <strong style={{display:"block",fontSize:30,marginTop:8}}>{typeof value==="number"?value:"—"}</strong>
 </div>)}
 </div>
 {bookingStatus?<p role="status" style={{color:"#9e4e43"}}>{bookingStatus}</p>:null}
 {bookingCounts?.truncated?<p role="note" style={{color:"#9e4e43"}}>Hay más de 1.000 registros; esta vista muestra solo los 1.000 más recientes.</p>:null}
 <p style={{color:"#536e78",lineHeight:1.6,fontSize:14}}>«Primera visita» se basa en la opción elegida al reservar. «Realizada» depende de que la cita esté marcada como completada en la agenda.</p>
 </section>
 <section style={{margin:"26px 0",padding:"22px",border:"1px solid #edf7f7",borderRadius:16,background:"#fff"}}>
 <h2 style={{margin:"0 0 8px",fontSize:21}}>¿En qué parte de la reserva se pierden visitas?</h2>
 <p style={{color:"#536e78",lineHeight:1.65,margin:"0 0 13px"}}>En Google Analytics, cuando la persona ha aceptado las cookies, puedes consultar los eventos <strong>booking_click</strong> (abre la reserva), <strong>booking_slot_selected</strong> (elige horario), <strong>booking_submit</strong> (intenta reservar) y <strong>booking_complete</strong> (la solicitud se ha registrado). Son métricas parciales, porque quienes rechazan la analítica no se incluyen.</p>
 <a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener noreferrer" style={{display:"inline-block",borderRadius:9,padding:"11px 16px",background:"var(--admin-plum)",color:"white",textDecoration:"none"}}>Abrir Google Analytics ↗</a>
 </section>
 {state?<p role="status" style={{color:"#9e4e43"}}>{state}</p>:null}
 <div style={{display:"flex",flexWrap:"wrap",gap:14,marginTop:25}}>
 <a href="https://c6645869.sibforms.com/serve/MUIFAIuvbjgYqrRqmmfpA-O89yKi9fH-Kb6Yp0UkGDyZKb_O1wjUF1SHUqEcp20MeACDjXZHQBzDuXijbIdqi8CB692onRlW0SA6IVn-N_ym1RIdQjptK-couFyXNVAQiyPtFM4hkdWfLmwNQgVfnarzCyzZDYkTDXyOH2O8g5m7BN-Gw--aM1hnRHHMfp39FyhRtcurRMbxfwtgMQ==" target="_blank" rel="noopener noreferrer" style={{background:"var(--admin-plum)",color:"#fff",padding:"14px 22px",borderRadius:10,textDecoration:"none"}}>Ver formulario de suscripción ↗</a>
 <a href="https://app.brevo.com/" target="_blank" rel="noopener noreferrer" style={{background:"var(--admin-plum)",color:"#fff",padding:"14px 22px",borderRadius:10,textDecoration:"none"}}>Ver contactos en Brevo ↗</a>
 <a href="/admin/recursos/" style={{border:"1px solid #0e5c7c",padding:"14px 22px",borderRadius:10,color:"#0e5c7c",textDecoration:"none"}}>Gestionar recursos</a>
 </div>
 <p style={{marginTop:25,color:"#536e78",lineHeight:1.6}}>Solo el contador de suscriptores procede de Brevo. Las métricas de altas, bajas y descargas requieren una implementación de seguimiento adicional.</p>
 </div></main>;
}