"use client";
import { useEffect, useState, type FormEvent } from "react";
type Campaign={code:string;label:string;discount_eur:number;enabled:boolean;starts_on:string;ends_on:string;max_uses:number|null};
type Redemption={id:string;patient_name:string;created_at:string;starts_at:string;promo_code:string;promo_discount_eur:number;price_eur:number;status:string};
const base="https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1";
const key="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const money=(n:number)=>n.toLocaleString("es-ES",{style:"currency",currency:"EUR"});
async function api(path:string,init:RequestInit={}){
  const raw=sessionStorage.getItem("dememoria_admin_session");
  const token=raw?JSON.parse(raw).access_token:null;
  if(!token)throw new Error("Inicia sesión para gestionar las campañas.");
  const response=await fetch(base+path,{...init,headers:{apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json",...init.headers},cache:"no-store"});
  if(!response.ok)throw new Error("No se ha podido acceder a las campañas. Comprueba la sesión y la configuración.");
  return response;
}
export default function PromoCampaigns(){
  const [codes,setCodes]=useState<Campaign[]>([]);
  const [redemptions,setRedemptions]=useState<Redemption[]>([]);
  const [filter,setFilter]=useState("");
  const [message,setMessage]=useState("Cargando campañas…");
  const [busy,setBusy]=useState(false);
  const [ready,setReady]=useState(false);
  async function load(){
    try{
      const [c,r]=await Promise.all([
        api("/booking_promo_codes?select=*&order=code.asc"),
        api("/appointment_bookings?select=id,patient_name,created_at,starts_at,promo_code,promo_discount_eur,price_eur,status&promo_code=not.is.null&order=created_at.desc&limit=1001")
      ]);
      setCodes(await c.json());setRedemptions(await r.json());setMessage("");setReady(true);
    }catch(e){setMessage(e instanceof Error?e.message:"Error de conexión.");setReady(false);}
  }
  useEffect(()=>{void load();},[]);
  async function save(event:FormEvent<HTMLFormElement>,code?:string){
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    const max=String(data.get("max_uses")||"");
    const item={code:(code||String(data.get("code")||"")).trim().toUpperCase(),label:String(data.get("label")||"").trim(),discount_eur:Number(data.get("discount_eur")),starts_on:String(data.get("starts_on")),ends_on:String(data.get("ends_on")),max_uses:max?Number(max):null,enabled:data.get("enabled")==="on"};
    if(!/^[A-Z0-9_-]{3,32}$/.test(item.code)||!item.label||!(item.discount_eur>0&&item.discount_eur<60)||item.ends_on<item.starts_on){setMessage("Revisa el código, el descuento y las fechas.");return;}
    setBusy(true);setMessage("Guardando…");
    try{
      const saved=await api("/booking_promo_codes"+(code?"?code=eq."+encodeURIComponent(code):""),{method:code?"PATCH":"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(item)});
      const rows=await saved.json();if(!Array.isArray(rows)||rows.length!==1)throw new Error("No se ha guardado la campaña. Comprueba los permisos.");
      if(!code)form.reset();
      await load();
    }catch(e){setMessage(e instanceof Error?e.message:"No se ha guardado.");}
    finally{setBusy(false);}
  }
  const fields=(c?:Campaign)=><>
    {!c?<label>Código <input name="code" required pattern="[A-Za-z0-9_-]{3,32}" maxLength={32}/></label>:null}
    <label>Canal o nombre <input name="label" required maxLength={100} defaultValue={c?.label||""}/></label>
    <label>Descuento en euros <input name="discount_eur" required type="number" min=".01" max="59.99" step=".01" defaultValue={c?.discount_eur||10}/></label>
    <label>Inicio <input type="date" name="starts_on" required defaultValue={c?.starts_on}/></label>
    <label>Fin (incluido) <input type="date" name="ends_on" required defaultValue={c?.ends_on}/></label>
    <label>Máximo de usos <input name="max_uses" type="number" min="1" step="1" placeholder="Sin límite" defaultValue={c?.max_uses??""}/></label>
    <label><input name="enabled" type="checkbox" defaultChecked={c?.enabled||false}/> Activo</label>
  </>;
  return <section aria-labelledby="promo-heading" style={{margin:"30px 0",padding:22,border:"1px solid var(--admin-soft)",borderRadius:16,background:"#fff"}}>
    <h2 id="promo-heading">Campañas y códigos promocionales</h2>
    <p>Primeras visitas de psicología (60 € de tarifa habitual). Un solo descuento de primera visita por paciente entre todas las campañas. Se comprueba el correo y el teléfono normalizados en el servidor; verifica manualmente posibles coincidencias o cambios de contacto. Las cancelaciones liberan el uso; las citas realizadas y las incomparecencias lo conservan.</p>
    <p role="status">{message}</p>
    {ready?<><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
      {codes.map(c=>{const used=redemptions.filter(r=>r.promo_code===c.code&&!["cancelled","canceled"].includes(r.status));const done=used.filter(r=>r.status==="completed");return <article key={c.code} style={{background:"var(--admin-soft)",padding:16,borderRadius:12}}>
        <h3>{c.code}</h3><p>{c.enabled?"Habilitado":"Desactivado"} · precio {money(60-Number(c.discount_eur))}</p>
        <p>Reservas no canceladas: {used.length}{c.max_uses?" / "+c.max_uses:""} · Realizadas: {done.length}</p>
        <p>Importe de citas realizadas (no equivale a cobros): {money(done.reduce((s,r)=>s+Number(r.price_eur),0))} · descuentos: {money(done.reduce((s,r)=>s+Number(r.promo_discount_eur),0))}</p>
        <form onSubmit={e=>void save(e,c.code)} style={{display:"grid",gap:9}}>{fields(c)}<button disabled={busy} type="submit">Guardar cambios</button></form>
      </article>})}
    </div>{redemptions.length>1000?<p>Estadísticas parciales: más de 1.000 reservas.</p>:null}
    <section style={{marginTop:26}} aria-labelledby="redemption-heading">
      <h3 id="redemption-heading">Registro de uso de cupones</h3>
      <p>Registro administrativo privado. Incluye cancelaciones; el descuento no implica pago recibido.</p>
      <label>Filtrar por cupón <select value={filter} onChange={e=>setFilter(e.target.value)}><option value="">Todos</option>{codes.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</select></label>
      <div style={{overflowX:"auto",marginTop:12}}><table style={{width:"100%",textAlign:"left",borderCollapse:"collapse"}}><thead><tr>{["Cupón","Paciente","Reserva","Fecha de cita","Estado","Descuento","Tarifa"].map(h=><th key={h} style={{padding:8}}>{h}</th>)}</tr></thead><tbody>
      {redemptions.filter(r=>!filter||r.promo_code===filter).map(r=><tr key={r.id} style={{borderTop:"1px solid var(--admin-soft)"}}><td style={{padding:8,fontWeight:700}}>{r.promo_code}</td><td style={{padding:8}}>{r.patient_name}</td><td style={{padding:8}}>{new Date(r.created_at).toLocaleString("es-ES",{timeZone:"Europe/Madrid"})}</td><td style={{padding:8}}>{r.starts_at?new Date(r.starts_at).toLocaleString("es-ES",{timeZone:"Europe/Madrid"}):"—"}</td><td style={{padding:8}}>{({pending:"Reservado",confirmed:"Confirmado",completed:"Utilizado",no_show:"No presentado (uso retenido)",cancelled:"Cancelado (liberado)",canceled:"Cancelado (liberado)",rescheduled:"Reprogramado"} as Record<string,string>)[r.status]||r.status}</td><td style={{padding:8}}>{money(Number(r.promo_discount_eur))}</td><td style={{padding:8}}>{money(Number(r.price_eur))}</td></tr>)}
      </tbody></table></div>
      {!redemptions.some(r=>!filter||r.promo_code===filter)?<p>Todavía no hay usos registrados para esta selección.</p>:null}
      <button type="button" onClick={()=>void load()}>Actualizar registro</button>
    </section>
    <details style={{marginTop:20}}><summary>Crear un código</summary><form onSubmit={e=>void save(e)} style={{display:"grid",gap:9,marginTop:12}}>{fields()}<button disabled={busy} type="submit">Crear código</button></form></details></>:null}
  </section>;
}
