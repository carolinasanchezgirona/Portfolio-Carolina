(() => {
 "use strict";
 const section=document.getElementById("space-simple-consents");
 const list=document.getElementById("space-simple-consents-list");
 const status=document.getElementById("space-simple-consents-message");
 if(!section||!list||!status)return;
 const endpoint="/api/patient-portal/clinical-simple-consents";
 let epoch=0,busy=false,requests=[];
 const labels={psicologico:"Atención psicológica",neuro_evaluacion:"Evaluación neuropsicológica",
  neuro_intervencion:"Intervención neuropsicológica"};
 function clear(){epoch++;requests=[];list.replaceChildren();status.textContent="";section.hidden=true;}
 function message(t){status.textContent=t||"";}
 function node(tag,text,where,cls){
  const n=document.createElement(tag);n.textContent=text||"";if(cls)n.className=cls;where.append(n);return n;
 }
 async function download(id,evidence=false){
  const target=endpoint+"?"+(evidence?"evidence_id=":"document_id=")+encodeURIComponent(id);
  const response=await fetch(target,{cache:"no-store",credentials:"include"});
  if(!response.ok){
   const data=await response.json().catch(()=>({}));
   throw Error(data.error||"No se ha podido recuperar el PDF.");
  }
  if(!response.headers.get("Content-Type")?.includes("application/pdf"))throw Error("El servidor no devolvió un PDF.");
  const blob=await response.blob();
  if(!blob.size)throw Error("El archivo está vacío.");
  const url=URL.createObjectURL(blob),link=document.createElement("a");
  link.href=url;link.download=evidence?"acta-aceptacion-electronica.pdf":"consentimiento-informado.pdf";
  document.body.append(link);link.click();link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),30000);
 }
 async function sign(record,form,button){
  if(busy)return;
  const name=form.querySelector("[data-consent-name]").value.trim();
  const read=form.querySelector("[data-consent-read]").checked;
  const voluntary=form.querySelector("[data-consent-free]").checked;
  if(name.length<3||!read||!voluntary){message("Escribe tu nombre y confirma ambas declaraciones.");return;}
  if(!window.confirm("¿Confirmas que has leído el documento completo y lo ACEPTAS mediante firma electrónica simple? Esta decisión quedará registrada en tu expediente."))return;
  const seq=epoch;busy=true;button.disabled=true;message("Registrando tu aceptación…");
  try{
   const response=await fetch(endpoint,{method:"POST",credentials:"include",cache:"no-store",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({action:"accept",request_id:record.id,typed_name:name,
     confirm_read:read,confirm_voluntary:voluntary,sign_intent:"accept"})});
   const data=await response.json().catch(()=>({}));
   if(seq!==epoch)return;
   if(!response.ok)throw Error(data.error||"No se ha podido confirmar la aceptación.");
   message("Aceptación electrónica simple registrada y acta archivada. Puedes descargar una copia de ambos PDF.");
   await load();
  }catch(error){if(seq===epoch)message(error?.message||"No se ha completado la aceptación. Consulta con la profesional.");}
  finally{busy=false;button.disabled=false;}
 }
 function render(fresh){
  list.replaceChildren();
  const pending=requests.filter(x=>x.status!=="archived");
  for(const row of requests){
   const box=node("article","",list,"space-simple-consent");
   node("h4",labels[row.kind]||"Documento de consentimiento",box);
   const date=Date.parse(row.created_at);
   if(Number.isFinite(date))node("small","Disponible desde "+new Date(date).toLocaleDateString("es-ES"),box);
   if(row.status==="archived"){
    node("p","Aceptación electrónica simple registrada; el PDF original y el acta de evidencias están disponibles para descargar.",box);
    const buttons=node("div","",box,"space-simple-consent-actions");
    const original=node("button","Descargar consentimiento",buttons,"space-secondary");original.type="button";
    const evidence=node("button","Descargar acta de aceptación",buttons,"space-secondary");evidence.type="button";
    original.addEventListener("click",async()=>{try{await download(row.id);}catch(e){message(e?.message||"Error de descarga.");}});
    evidence.addEventListener("click",async()=>{try{await download(row.id,true);}catch(e){message(e?.message||"Error de descarga.");}});
    continue;
   }
   if(row.status==="recording"){
    node("p","Tu declaración está registrada, pero el archivo de evidencias requiere revisión. No vuelvas a firmar; contacta con Carolina.",box);
    continue;
   }
   node("p","Lee el documento completo antes de decidir. Si tienes dudas, habla con Carolina antes de aceptarlo.",box);
   const readBtn=node("button","Descargar PDF para leer",box,"space-secondary");
   readBtn.type="button";
   let wasDownloaded=false;
   const form=node("form","",box,"space-simple-consent-form");
   const label=node("label","Tu nombre y apellidos, tal como figuran en tu ficha",form);
   const name=document.createElement("input");
   name.type="text";name.maxLength=150;name.required=true;
   name.autocomplete="name";name.placeholder="Nombre y apellidos";name.dataset.consentName="1";
   label.append(name);
   const check1=node("label","",form,"space-simple-consent-check");
   const a=document.createElement("input");a.type="checkbox";a.dataset.consentRead="1";
   check1.append(a,document.createTextNode(" He leído el documento completo y he tenido la posibilidad de consultar mis dudas."));
   const check2=node("label","",form,"space-simple-consent-check");
   const b=document.createElement("input");b.type="checkbox";b.dataset.consentFree="1";
   check2.append(b,document.createTextNode(" Acepto libremente el procedimiento indicado y conozco la posibilidad de rechazarlo o retirar mi consentimiento."));
   const info=node("p",fresh?"Identificación reciente con contraseña verificada.":"Para registrar la firma, cierra sesión y entra de nuevo con tu contraseña. La sesión para firmar debe ser reciente.",form,"space-simple-consent-note");
   const submit=node("button","Firmar electrónicamente y aceptar",form,"space-primary");
   submit.type="submit";submit.disabled=true;
   function refresh(){submit.disabled=!fresh||!wasDownloaded||!name.value.trim()||!a.checked||!b.checked||busy;}
   readBtn.addEventListener("click",async()=>{
    readBtn.disabled=true;
    try {await download(row.id);wasDownloaded=true;refresh();}
    catch(error){message(error?.message||"No se ha podido descargar el documento.");}
    finally{readBtn.disabled=false;}
   });
   [name,a,b].forEach(x=>x.addEventListener("input",refresh));
   form.addEventListener("submit",event=>{event.preventDefault();if(!submit.disabled)void sign(row,form,submit);});
   if(!fresh){readBtn.disabled=false;info.dataset.freshLoginRequired="true";}
  }
  section.hidden=requests.length===0;
  if(requests.length&&!pending.length)message("Tus consentimientos archivados siguen disponibles para descargar.");
 }
 async function load(){
  const seq=++epoch;
  try{
   const response=await fetch(endpoint,{credentials:"include",cache:"no-store"});
   if(seq!==epoch)return;
   if(response.status===401){clear();return;}
   const data=await response.json().catch(()=>({}));
   if(!response.ok)throw Error(data.error||"No se han podido cargar los documentos.");
   requests=Array.isArray(data.requests)?data.requests:[];
   render(data.fresh_password===true);
  }catch(error){
   if(seq!==epoch)return;
   requests=[];list.replaceChildren();
   section.hidden=false;
   message(error?.message||"No se han podido consultar los consentimientos.");
  }
 }
 window.addEventListener("patient-portal-session-ready",()=>void load());
 document.addEventListener("patient-portal-locked",clear);
 // Al entrar directamente desde un correo, comprobar también si ya existe sesión.
 if(document.getElementById("space-shell")&&!document.getElementById("space-shell").hidden)void load();
})();
