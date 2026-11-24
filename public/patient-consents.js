(() => {
 "use strict";
 const host=document.getElementById("space-consent-requests");
 const count=document.getElementById("space-consent-count");
 if(!host)return;
 const titles={
  psicologico:"Consentimiento para atención psicológica",
  neuro_evaluacion:"Consentimiento para evaluación neuropsicológica",
  neuro_intervencion:"Consentimiento para intervención neuropsicológica",
  privacidad:"Constancia de información sobre protección de datos"
 };
 const route={
  psicologico:"/consentimiento-psicologico/",
  neuro_evaluacion:"/consentimiento-neuropsicologico/",
  neuro_intervencion:"/consentimiento-neuropsicologico/",
  privacidad:"/privacidad/"
 };
 let sequence=0;
 function paragraph(content){
  const el=document.createElement("p");el.textContent=content;return el;
 }
 async function render(){
  const now=++sequence;
  host.replaceChildren(paragraph("Consultando los documentos de tu ficha…"));
  try{
   const response=await fetch("/api/patient-portal/consents",{credentials:"include",cache:"no-store"});
   if(now!==sequence||document.getElementById("space-shell")?.hidden)return;
   if(!response.ok)throw Error(response.status===401?"Tu sesión ha caducado.":"No se pudo consultar esta información.");
   const data=await response.json();
   if(now!==sequence||document.getElementById("space-shell")?.hidden)return;
   const rows=Array.isArray(data.requests)?data.requests:[];
   const pending=rows.filter(x=>x.status==="pending");
   if(count)count.textContent=pending.length===1?"1 pendiente":pending.length+" pendientes";
   host.replaceChildren();
   if(!rows.length){host.append(paragraph("No tienes documentos pendientes de firma."));return;}
   for(const item of rows){
    if(!Object.prototype.hasOwnProperty.call(titles,item.kind))continue;
    const card=document.createElement("article");card.className="space-consent-item";
    const title=document.createElement("strong");title.textContent=titles[item.kind];
    card.append(title);
    if(item.status==="pending"){
      card.append(paragraph("Pendiente: revisa la información y firma después de resolver tus dudas con la profesional."));
      const a=document.createElement("a");
      a.className="space-primary";
      a.href=route[item.kind]+"?solicitud="+encodeURIComponent(item.id)+"#firma-digital";
      a.textContent="Revisar y firmar en pantalla";
      card.append(a);
    }else if(item.status==="submitted"){
      card.append(paragraph("Documento recibido. La profesional está pendiente de verificarlo."));
    }else if(item.status==="verified"){
      card.append(paragraph("Documento revisado por la profesional."));
    }
    // Canceled requests need not be advertised on the patient's home screen.
    if(item.status!=="cancelled")host.append(card);
   }
   if(!host.childElementCount)host.append(paragraph("No tienes documentos pendientes de firma."));
  }catch(error){
   if(now===sequence)host.replaceChildren(paragraph(error.message||"No se pudieron cargar los documentos."));
  }
 }
 window.addEventListener("patient-portal-session-ready",()=>{void render();});
 document.getElementById("space-logout")?.addEventListener("click",()=>{
   sequence++;host.replaceChildren();if(count)count.textContent="Acceso privado";
 });
})();
