(() => {
 "use strict";
 const patientPage = document.getElementById("clinic-patient-dialog");
 const patientId = document.getElementById("clinic-patient-id");
 const kind = document.getElementById("clinic-signature-kind");
 const prepareButton = document.getElementById("clinic-signature-prepare");
 const archiveButton = document.getElementById("clinic-signature-archive");
 const status = document.getElementById("clinic-signature-message");
 if(!patientPage || !patientId || !kind || !prepareButton || !archiveButton || !status) return;
 let busy = false;
 const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 function sessionToken(){
   try{return JSON.parse(sessionStorage.getItem("dememoria_admin_session")||"null")?.access_token || "";}
   catch{return "";}
 }
 function activePatientId(){return patientPage.hidden?"":String(patientId.value||"").trim();}
 function message(value){status.textContent=value;}
 prepareButton.addEventListener("click",async()=>{
   if(busy)return;
   const id=activePatientId();
   if(!uuid.test(id)){message("Abre primero la ficha de un paciente.");return;}
   const selection=kind.value;
   if(!["psicologico","neuro_evaluacion","neuro_intervencion"].includes(selection))return;
   const token=sessionToken();
   if(!token){message("Inicia sesión en el panel profesional.");return;}
   busy=true;prepareButton.disabled=true;message("Preparando documento individualizado…");
   try{
     const response=await fetch("/api/admin/clinical-consent-packet",{
       method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},
       body:JSON.stringify({patient_id:id,kind:selection}),cache:"no-store"
     });
     if(!response.ok){
       const error=await response.json().catch(()=>({}));
       throw Error(error.error || "No se pudo preparar el PDF.");
     }
     if(!response.headers.get("content-type")?.includes("application/pdf"))throw Error("El servidor no devolvió un PDF.");
     const blob=await response.blob();
     if(!blob.size)throw Error("El documento recibido está vacío.");
     // Nunca abrir automáticamente un PDF clínico en otra pestaña.
     const url=URL.createObjectURL(blob);
     const link=document.createElement("a");
     link.href=url;link.download="Consentimiento-"+selection+"-"+new Date().toISOString().slice(0,10)+".pdf";
     document.body.appendChild(link);link.click();link.remove();
     window.setTimeout(()=>URL.revokeObjectURL(url),30000);
     const hash=response.headers.get("X-Consent-SHA256");
     message("PDF generado para revisión y firma externa. Aún NO está firmado ni enviado."+(hash?" SHA-256 del original: "+hash:""));
   }catch(error){
     message(error instanceof Error?error.message:"No se pudo preparar el documento.");
   }finally{busy=false;prepareButton.disabled=false;}
 });
 archiveButton.addEventListener("click",()=>{
   if(!uuid.test(activePatientId())){message("Abre primero la ficha de un paciente.");return;}
   const open=document.getElementById("clinic-add-document");
   if(!open){message("La subida de documentos no está disponible.");return;}
   open.click();
   window.setTimeout(()=>{
     const title=document.getElementById("clinic-document-title");
     const category=document.getElementById("clinic-document-category");
     const share=document.getElementById("clinic-document-share");
     if(title && !title.value)title.value="Consentimiento firmado o certificado probatorio";
     if(category)category.value="consent";
     if(share)share.checked=false;
   },0);
 });
})();
