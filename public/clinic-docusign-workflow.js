(() => {
 "use strict";
 const page=document.getElementById("clinic-patient-dialog");
 const patientField=document.getElementById("clinic-patient-id");
 const panel=document.getElementById("clinic-electronic-signature");
 const kind=document.getElementById("clinic-signature-kind");
 const send=document.getElementById("clinic-signature-send");
 const emailEl=document.getElementById("clinic-signature-email");
 const confirmAdult=document.getElementById("clinic-signature-adult");
 const message=document.getElementById("clinic-signature-request-message");
 const list=document.getElementById("clinic-signature-requests");
 if(!page||!patientField||!panel||!kind||!send||!emailEl||!confirmAdult||!message||!list)return;
 const endpoint="/api/admin/clinical-signatures";
 const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 let openedId="",verifiedEmail="",configured=false,busy=false,loadSerial=0,requests=[];
 const activeId=()=>page.hidden?"":String(patientField.value||"").trim();
 function token(){
  try{return JSON.parse(sessionStorage.getItem("dememoria_admin_session")||"null")?.access_token||"";}catch{return "";}
 }
 function updateButton(){
  send.disabled=busy||!configured||!verifiedEmail||!uuid.test(activeId())||activeId()!==openedId||!confirmAdult.checked;
 }
 function setMessage(value){message.textContent=value||"";}
 async function api(method,body){
  const patientId=activeId();
  if(!uuid.test(patientId))throw Error("Abre una ficha de paciente.");
  const res=await fetch(endpoint+(method==="GET"?"?patient_id="+encodeURIComponent(patientId):""),{
   method,headers:{Authorization:"Bearer "+token(),...(method==="POST"?{"Content-Type":"application/json"}:{})},
   ...(method==="POST"?{body:JSON.stringify({patient_id:patientId,...body})}:{}),cache:"no-store"
  });
  const data=await res.json().catch(()=>({}));
  if(!res.ok)throw Error(data.error||"No se ha podido verificar el estado de la firma.");
  return data;
 }
 const labels={psicologico:"Atención psicológica",neuro_evaluacion:"Evaluación neuropsicológica",neuro_intervencion:"Intervención neuropsicológica"};
 const states={preparing:"Preparándose",draft:"Borrador sin enviar",sent:"Enviado, pendiente de firma",
  delivered:"Leído, pendiente de firma",unknown:"Envío o estado por verificar",
  completed_unarchived:"Firmado; custodia incompleta",archived:"Firmado y archivado",
  declined:"Rechazado",voided:"Anulado",error:"Error antes del envío"};
 function stamp(value){
  if(!value)return "";
  const time=new Date(value);
  return Number.isFinite(time.getTime())?time.toLocaleString("es-ES",{dateStyle:"short",timeStyle:"short"}):"";
 }
 function render(){
  list.replaceChildren();
  if(!requests.length){const p=document.createElement("p");p.textContent="No hay solicitudes de firma registradas para este paciente.";list.append(p);return;}
  for(const record of requests){
   const article=document.createElement("article");
   article.className="clinic-signature-request";
   const heading=document.createElement("strong");
   heading.textContent=(labels[record.kind]||"Consentimiento")+" · "+(states[record.status]||record.status);
   const date=document.createElement("small");date.textContent="Solicitado: "+stamp(record.requested_at)+(record.archived_at?" · Archivado: "+stamp(record.archived_at):"");
   article.append(heading,date);
   if(record.status==="archived"){
    const detail=document.createElement("p");
    detail.textContent="Documento firmado y certificado guardados en «Documentos y archivos compartidos». Consulta los PDF y sus huellas SHA-256 desde la historia clínica.";
    article.append(detail);
   }else if(configured&&record.status!=="preparing"){
    const check=document.createElement("button");check.type="button";check.className="clinic-secondary";check.textContent="Verificar firma y archivar";
    check.disabled=busy;
    check.addEventListener("click",()=>void sync(record.id,check));
    article.append(check);
   }
   list.append(article);
  }
 }
 async function load(){
  const id=activeId();if(!uuid.test(id))return;
  const turn=++loadSerial;
  openedId=id;verifiedEmail="";configured=false;requests=[];
  confirmAdult.checked=false;emailEl.textContent="Consultando destinatario…";
  setMessage("");updateButton();
  try{
   const data=await api("GET");
   if(turn!==loadSerial||id!==activeId())return;
   verifiedEmail=String(data.email||"");
   configured=data.configured===true;
   requests=Array.isArray(data.requests)?data.requests:[];
   emailEl.textContent=verifiedEmail||"Sin correo válido en ficha";
   if(!configured)setMessage("Firma automática desactivada: falta configurar Docusign, aprobar el tratamiento y comprobar el flujo de identidad. Puedes seguir preparando el PDF para firma externa.");
   render();updateButton();
  }catch(error){
   if(turn!==loadSerial||id!==activeId())return;
   emailEl.textContent="No disponible";setMessage(error.message||"No disponible");render();updateButton();
  }
 }
 async function sync(id,button){
  if(!uuid.test(id)||busy||!configured)return;
  busy=true;button.disabled=true;updateButton();
  setMessage("Consultando el estado real en Docusign…");
  const patient=activeId();
  try{
   const data=await api("POST",{action:"sync",signature_id:id});
   if(patient!==activeId())return;
   setMessage(data.status==="archived"?"Firma verificada y ambos PDF archivados. Actualiza Documentos en la ficha para verlos.":
    "Estado comprobado: "+(states[data.status]||data.status)+". No se marcará como firmado sin ambos documentos.");
   await load();
  }catch(error){if(patient===activeId())setMessage(error.message||"No se ha podido sincronizar.");}
  finally{busy=false;updateButton();}
 }
 send.addEventListener("click",async()=>{
  const id=activeId();
  if(busy||!configured||!verifiedEmail||!uuid.test(id)||id!==openedId||!confirmAdult.checked)return;
  const documentLabel=labels[kind.value]||"consentimiento";
  if(!window.confirm("Vas a enviar para firma electrónica verificada: "+documentLabel+" a "+verifiedEmail+
    ". Debes haber explicado el procedimiento y confirmado que el paciente es adulto y firma por sí mismo. ¿Enviar AHORA?"))return;
  const nonce=crypto.randomUUID();
  busy=true;updateButton();setMessage("Registrando solicitud y preparando el documento…");
  try{
   const data=await api("POST",{action:"send",kind:kind.value,email_confirmation:verifiedEmail,
    confirm_send:true,self_consenting_adult:true,request_id:nonce});
   if(id!==activeId())return;
   setMessage(data.status==="sent"?"Solicitud aceptada por Docusign. Pendiente de firma. No equivale a consentimiento otorgado.":
    "Consulta el estado del envío antes de volver a intentarlo.");
  }catch(error){
   if(id===activeId())setMessage(error.message||"No se ha confirmado el envío. Comprueba el historial antes de repetir.");
  }finally{busy=false;if(id===activeId())await load();updateButton();}
 });
 confirmAdult.addEventListener("change",updateButton);
 panel.addEventListener("toggle",()=>{if(panel.open&&activeId()&&!busy)void load();});
 new MutationObserver(()=>{
  if(page.hidden){loadSerial++;openedId="";verifiedEmail="";configured=false;requests=[];setMessage("");list.replaceChildren();updateButton();}
  else if(panel.open&&activeId()&&activeId()!==openedId&&!busy)void load();
 }).observe(page,{attributes:true,attributeFilter:["hidden"]});
})();