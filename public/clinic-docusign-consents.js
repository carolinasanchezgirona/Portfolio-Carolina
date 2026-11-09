(() => {
 "use strict";
 const patientPage=document.getElementById("clinic-patient-dialog");
 const idField=document.getElementById("clinic-patient-id");
 const pane=document.getElementById("clinic-electronic-signature");
 const providerStatus=document.getElementById("clinic-signature-provider-status");
 const recipient=document.getElementById("clinic-signature-recipient");
 const adult=document.getElementById("clinic-signature-self-adult");
 const send=document.getElementById("clinic-signature-send");
 const list=document.getElementById("clinic-signature-requests");
 const kind=document.getElementById("clinic-signature-kind");
 if(!patientPage||!idField||!pane||!providerStatus||!recipient||!adult||!send||!list||!kind)return;
 const endpoint="/api/admin/clinical-signatures";
 let currentId="",loadedEmail="",configured=false,busy=false;
 let requests=[],generation=0;
 const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 function active(){return patientPage.hidden?"":String(idField.value||"").trim();}
 function token(){try{return JSON.parse(sessionStorage.getItem("dememoria_admin_session")||"null")?.access_token||"";}catch{return "";}}
 function message(s){providerStatus.textContent=s;}
 function updateButton(){send.disabled=busy||!configured||!loadedEmail||!adult.checked||currentId!==active();}
 function datetime(v){if(!v)return"";try{return new Date(v).toLocaleString("es-ES");}catch{return"";}}
 const titles={psicologico:"Atención psicológica",neuro_evaluacion:"Evaluación neuropsicológica",neuro_intervencion:"Intervención neuropsicológica"};
 const statuses={preparing:"Preparando",draft:"Borrador, no enviado",sent:"Enviado, pendiente de firma",
  delivered:"Abierto, pendiente de firma",unknown:"Estado incierto: verificar",
  completed_unarchived:"Completado; pendiente de archivo seguro",archived:"Firmado y archivado",
  declined:"Rechazado",voided:"Anulado",error:"Error, no enviado"};
 function render(){
  list.replaceChildren();
  if(!requests.length){const p=document.createElement("p");p.textContent="No hay solicitudes de firma registradas.";list.append(p);return;}
  for(const r of requests){
   const item=document.createElement("article");
   item.className="clinic-signature-request";
   const text=document.createElement("div");
   const title=document.createElement("strong");title.textContent=titles[r.kind]||"Consentimiento";
   const state=document.createElement("p");state.textContent=(statuses[r.status]||"Pendiente de verificación")+(r.archived_at?" · "+datetime(r.archived_at):"");
   text.append(title,state);item.append(text);
   if(r.status!=="archived"&&r.status!=="error"&&r.status!=="preparing"){
    const check=document.createElement("button");check.type="button";check.className="clinic-secondary";
    check.textContent="Verificar estado y archivar";check.disabled=busy||!configured;
    check.addEventListener("click",()=>sync(r.id));item.append(check);
   }
   if(r.status==="archived"){
    const note=document.createElement("small");
    note.textContent="PDF firmado y certificado disponibles en Documentos privados de esta ficha.";
    item.append(note);
   }
   list.append(item);
  }
 }
 async function load(){
  const id=active();
  if(!uuid.test(id))return;
  const n=++generation;
  currentId=id;busy=true;loadedEmail="";configured=false;recipient.textContent="Verificando destinatario…";
  message("Comprobando firma y custodia segura…");updateButton();
  try{
   const res=await fetch(endpoint+"?patient_id="+encodeURIComponent(id),{
    headers:{Authorization:"Bearer "+token()},cache:"no-store"});
   const data=await res.json().catch(()=>({}));
   if(n!==generation||active()!==id)return;
   if(!res.ok)throw Error(data.error||"No se ha podido consultar la custodia.");
   configured=data.configured===true;
   loadedEmail=String(data.email||"");
   recipient.textContent=loadedEmail||"Sin dirección registrada";
   requests=Array.isArray(data.requests)?data.requests:[];
   message(configured?"Proveedor configurado. Revisa el consentimiento y confirma cada envío manualmente.":
     "Firma integrada no activada. Necesita cuenta Docusign con verificación de identidad, contrato de encargado y credenciales aprobadas. Puedes usar la preparación manual del PDF.");
   render();
  }catch(e){
   if(n!==generation||active()!==id)return;
   message(e?.message||"No se ha podido comprobar el sistema.");
   recipient.textContent="No disponible";
  }finally{if(n===generation){busy=false;updateButton();}}
 }
 async function sendRequest(){
  const id=active(),email=loadedEmail,selection=kind.value;
  if(busy||!configured||!uuid.test(id)||id!==currentId||!email||!adult.checked)return;
  if(!window.confirm("Se enviará el consentimiento de "+(titles[selection]||selection)+
    " a "+email+" mediante Docusign con verificación de identidad. No se puede deshacer este correo. ¿Enviar ahora?"))return;
  busy=true;updateButton();message("Registrando y preparando solicitud sin papel…");
  const requestId=crypto.randomUUID();
  try{
   const res=await fetch(endpoint,{method:"POST",headers:{Authorization:"Bearer "+token(),
    "Content-Type":"application/json"},body:JSON.stringify({action:"send",patient_id:id,kind:selection,
    request_id:requestId,email_confirmation:email,confirm_send:true,self_consenting_adult:true}),cache:"no-store"});
   const data=await res.json().catch(()=>({}));
   if(active()!==id)return;
   if(!res.ok)throw Error((data.error||"No se ha podido completar la solicitud.")+
    (data.signature_id?" Referencia: "+data.signature_id:""));
   message("Solicitud aceptada por Docusign. Sigue pendiente de firma y archivo de evidencias.");
  }catch(e){if(active()===id)message(e?.message||"No se ha podido confirmar el envío; no repitas sin comprobarlo.");}
  finally{busy=false;updateButton();if(active()===id)void load();}
 }
 async function sync(signatureId){
  const id=active();
  if(busy||!configured||!uuid.test(id))return;
  busy=true;updateButton();message("Verificando el estado directamente con Docusign…");render();
  try{
   const res=await fetch(endpoint,{method:"POST",headers:{Authorization:"Bearer "+token(),
    "Content-Type":"application/json"},body:JSON.stringify({action:"sync",patient_id:id,signature_id:signatureId}),cache:"no-store"});
   const data=await res.json().catch(()=>({}));
   if(active()!==id)return;
   if(!res.ok)throw Error(data.error||"No se ha podido verificar el sobre.");
   message(data.status==="archived"?"Firma verificada: PDF firmado y certificado archivados.":"Estado verificado: "+(statuses[data.status]||data.status));
  }catch(e){if(active()===id)message(e?.message||"Verificación no disponible.");}
  finally{busy=false;updateButton();if(active()===id)void load();}
 }
 send.addEventListener("click",sendRequest);
 adult.addEventListener("change",updateButton);
 pane.addEventListener("toggle",()=>{if(pane.open&&active()&&!busy)void load();});
 new MutationObserver(()=>{
  if(patientPage.hidden){
   generation++;currentId="";loadedEmail="";configured=false;requests=[];adult.checked=false;
   recipient.textContent="Pendiente de verificar";message("");list.replaceChildren();updateButton();
  }else if(pane.open&&active()!==currentId)void load();
 }).observe(patientPage,{attributes:true,attributeFilter:["hidden"]});
})();
