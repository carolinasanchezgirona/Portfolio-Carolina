(() => {
 "use strict";
 const page=document.getElementById("clinic-patient-dialog");
 const idField=document.getElementById("clinic-patient-id");
 const panel=document.getElementById("clinic-electronic-signature");
 const block=document.getElementById("clinic-simple-consents");
 const kind=document.getElementById("clinic-signature-kind");
 const send=document.getElementById("clinic-simple-send");
 const recipient=document.getElementById("clinic-simple-recipient");
 const check=document.getElementById("clinic-simple-confirm");
 const message=document.getElementById("clinic-simple-message");
 const history=document.getElementById("clinic-simple-history");
 if(!page||!idField||!panel||!block||!kind||!send||!recipient||!check||!message||!history)return;
 const endpoint="/api/admin/clinical-simple-consents";
 const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 const labels={psicologico:"Atención psicológica",neuro_evaluacion:"Evaluación neuropsicológica",
  neuro_intervencion:"Intervención neuropsicológica"};
 const statuses={preparing:"Preparación pendiente",pending:"Preparado, correo pendiente",
  email_accepted:"Correo aceptado; pendiente de aceptación",email_unknown:"Entrega del correo no confirmada",
  recording:"Declaración recibida; revisar archivo de evidencias",archived:"Aceptación electrónica simple archivada",
  expired:"Caducada",rejected:"No aceptado",failed:"Preparación fallida"};
 let active="",email="",enabled=false,available=false,busy=false,sequence=0,rows=[];
 const current=()=>page.hidden?"":String(idField.value||"").trim();
 function token(){try{return JSON.parse(sessionStorage.getItem("dememoria_admin_session")||"null")?.access_token||"";}catch{return "";}}
 function setMessage(text){message.textContent=text||"";}
 function refresh(){send.disabled=busy||!uuid.test(current())||active!==current()||!email||!enabled||!available||!check.checked;}
 function fmt(value){const dt=new Date(value);return Number.isFinite(dt.getTime())?dt.toLocaleDateString("es-ES"):"";}
 function render(){
  history.replaceChildren();
  if(!rows.length){const p=document.createElement("p");p.textContent="Todavía no hay solicitudes de firma simple.";history.append(p);return;}
  for(const item of rows){
   const entry=document.createElement("article");entry.className="clinic-simple-item";
   const title=document.createElement("strong");title.textContent=labels[item.kind]||"Documento clínico";
   const detail=document.createElement("p");detail.textContent=(statuses[item.status]||item.status)+" · "+fmt(item.created_at);
   entry.append(title,detail);
   if(item.status==="archived"){
    const info=document.createElement("small");
    info.textContent="PDF original y acta de aceptación archivados de forma privada en «Documentos y archivos compartidos».";
    entry.append(info);
   }
   if(item.status==="recording"){
    const notice=document.createElement("small");
    notice.textContent="Se recibió una aceptación, pero el archivo no está completo. No reenviar ni marcar como firmado. Revisión técnica necesaria.";
    entry.append(notice);
   }
   history.append(entry);
  }
 }
 async function load(){
  const id=current();if(!uuid.test(id))return;
  const seq=++sequence;
  active=id;email="";enabled=false;available=false;check.checked=false;
  recipient.textContent="Comprobando ficha…";setMessage("");refresh();
  try{
   const res=await fetch(endpoint+"?patient_id="+encodeURIComponent(id),
    {headers:{Authorization:"Bearer "+token()},cache:"no-store"});
   const data=await res.json().catch(()=>({}));
   if(seq!==sequence||current()!==id)return;
   if(!res.ok)throw Error(data.error||"No se ha podido consultar la ficha.");
   email=String(data.email||"").trim().toLowerCase();
   enabled=data.portal_enabled===true;available=data.available===true;
   rows=Array.isArray(data.requests)?data.requests:[];
   recipient.textContent=email||"No consta un correo";
   if(!enabled)setMessage("Debes habilitar manualmente «Mi espacio» para esta persona antes de enviar.");
   else if(!available)setMessage("No se ha configurado el servicio de correo para invitaciones.");
   else setMessage("Selecciona un consentimiento, confirma la información ofrecida y decide cuándo enviarlo.");
   render();refresh();
  }catch(error){
   if(seq!==sequence||current()!==id)return;
   recipient.textContent="No disponible";setMessage(error?.message||"Error de lectura.");refresh();
  }
 }
 send.addEventListener("click",async()=>{
  const id=current();
  if(busy||!enabled||!available||!email||id!==active||!check.checked)return;
  const label=labels[kind.value]||"consentimiento";
  if(!window.confirm("Se enviará AHORA una invitación neutra a "+email+
   " para leer y aceptar electrónicamente "+label+" desde su cuenta privada. La firma será SIMPLE, no cualificada. ¿Confirmas el envío manual?"))return;
  busy=true;refresh();setMessage("Creando documento individualizado y registrando envío…");
  try{
   const res=await fetch(endpoint,{method:"POST",headers:{Authorization:"Bearer "+token(),"Content-Type":"application/json"},
    body:JSON.stringify({action:"send",patient_id:id,kind:kind.value,confirm_email:email,
     send_manually:true,information_provided:true,patient_self_consents:true}),cache:"no-store"});
   const result=await res.json().catch(()=>({}));
   if(current()!==id)return;
   if(!res.ok)throw Error(result.error||"No se ha podido confirmar el envío.");
   setMessage("Correo aceptado por Brevo. La recepción y la firma siguen pendientes. Refresca el historial para consultar el resultado.");
  }catch(error){
   if(current()===id)setMessage((error?.message||"No se ha confirmado el envío.")+" No vuelvas a pulsar sin revisar el historial.");
  }finally{busy=false;refresh();}
 });
 check.addEventListener("change",refresh);
 panel.addEventListener("toggle",()=>{if(panel.open&&current()&&!busy)void load();});
 new MutationObserver(()=>{
  if(page.hidden){
   sequence++;active="";email="";enabled=false;available=false;rows=[];check.checked=false;
   recipient.textContent="Selecciona un paciente";setMessage("");history.replaceChildren();refresh();
  }else if(panel.open&&current()&&current()!==active&&!busy)void load();
 }).observe(page,{attributes:true,attributeFilter:["hidden"]});
})();
