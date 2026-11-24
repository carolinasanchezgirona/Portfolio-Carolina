(() => {
  "use strict";
  const patientInput=document.getElementById("clinic-patient-id");
  const select=document.getElementById("clinic-signature-kind");
  const assign=document.getElementById("clinic-consent-assign");
  const refresh=document.getElementById("clinic-consent-refresh");
  const list=document.getElementById("clinic-consent-status-list");
  const message=document.getElementById("clinic-consent-workflow-message");
  const onsiteBox=document.getElementById("clinic-consent-onsite-link");
  if(!patientInput||!select||!assign||!refresh||!list||!message)return;
  const idPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const kindNames={
    psicologico:"Atención psicológica",
    neuro_evaluacion:"Evaluación neuropsicológica",
    neuro_intervencion:"Intervención neuropsicológica",
    privacidad:"Acuse de protección de datos"
  };
  const stateNames={pending:"Pendiente de firma",submitted:"Firmado: pendiente de revisión",verified:"Revisado por la profesional",cancelled:"Solicitud anulada"};
  let currentId="",busy=false,refreshId=0;
  const token=()=>{
    try{return JSON.parse(sessionStorage.getItem("dememoria_admin_session")||"null")?.access_token||"";}
    catch{return "";}
  };
  function label(value){return new Date(value).toLocaleDateString("es-ES");}
  async function request(path,init={}){
    const t=token();
    if(!t)throw Error("Inicia sesión en Gestión clínica y completa la verificación profesional.");
    const response=await fetch("/api/admin/consent-workflow"+path,{
      ...init,cache:"no-store",
      headers:{Authorization:"Bearer "+t,...(init.headers||{})},
    });
    if(!response.ok){
      const data=await response.json().catch(()=>({}));
      throw Error(data.error||"No se pudo completar la operación.");
    }
    return response;
  }
  function txt(tag,text,klass=""){
    const node=document.createElement(tag); if(klass)node.className=klass;node.textContent=text;return node;
  }
  function reset(){
    list.replaceChildren();onsiteBox?.replaceChildren();message.textContent="";
    if(!idPattern.test(currentId))list.append(txt("p","Abre una ficha clínica para consultar sus consentimientos."));
  }
  async function download(item){
    const resp=await request("?patient_id="+encodeURIComponent(currentId)+"&download="+encodeURIComponent(item.id));
    const content=await resp.blob();
    const url=URL.createObjectURL(content);
    const anchor=document.createElement("a");anchor.href=url;anchor.download="consentimiento-"+item.kind+"-"+item.id+".pdf";
    document.body.append(anchor);anchor.click();anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
  }
  function displayOnsiteLink(url,expires){
    if(!onsiteBox)return;
    onsiteBox.replaceChildren();
    const title=txt("strong","Enlace presencial temporal de un solo uso");
    const description=txt("p","Caduca a las "+new Date(expires).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})+
      ". Ábrelo en el dispositivo donde firmará la persona. No lo envíes por canales inseguros ni lo compartas fuera de la consulta.");
    const link=txt("a","Abrir formulario de firma presencial");
    link.href=url;link.target="_blank";link.rel="noopener noreferrer";
    const copy=txt("button","Copiar enlace temporal");
    copy.type="button";
    copy.onclick=async()=>{
      try{await navigator.clipboard.writeText(url);message.textContent="Enlace copiado. Úsalo solo con la persona presente en consulta.";}
      catch{message.textContent="Tu navegador no permite copiar. Abre el enlace en este dispositivo.";}
    };
    onsiteBox.append(title,description,link,copy);
  }
  async function startOnsite(item){
    if(busy||!currentId)return;
    if(!window.confirm("¿La persona está presente y has comprobado su identidad? Este enlace solo permite firmar el documento de esta ficha durante 15 minutos."))return;
    busy=true;message.textContent="Generando acceso presencial de un solo uso…";
    onsiteBox?.replaceChildren();
    try{
      const resp=await request("",{method:"POST",headers:{"Content-Type":"application/json"},
       body:JSON.stringify({action:"onsite_link",patient_id:currentId,request_id:item.id})});
      const result=await resp.json();
      displayOnsiteLink(result.url,result.expires_at);
      message.textContent="Acceso presencial generado. Una vez firmada la solicitud, pulsa «Actualizar estado y firmas».";
    }catch(e){message.textContent=e.message||"No pudo generarse el enlace.";}
    finally{busy=false;}
  }
  async function updateStatus(item,action){
    if(busy)return;
    const verifying=action==="verify";
    if(!window.confirm(verifying
      ?"¿Has revisado el documento, la identidad de quien firma y, en su caso, la representación acreditada?"
      :"¿Anular esta solicitud pendiente? El paciente dejará de poder firmarla."))return;
    busy=true;message.textContent="Guardando...";
    try{
      await request("",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,patient_id:currentId,request_id:item.id})});
      await load();
      message.textContent=verifying?"Revisión profesional documentada.":"Solicitud anulada.";
    }catch(err){message.textContent=err.message||"No se pudo guardar.";}
    finally{busy=false;}
  }
  async function load(){
    const id=currentId;
    const sequence=++refreshId;
    if(!idPattern.test(id)){reset();return;}
    list.replaceChildren(txt("p","Consultando las firmas de esta ficha…"));
    try{
      const response=await request("?patient_id="+encodeURIComponent(id));
      const data=await response.json();
      if(sequence!==refreshId||id!==currentId)return;
      list.replaceChildren();
      if(!Array.isArray(data.requests)||!data.requests.length){
        list.append(txt("p","Todavía no se ha asignado ningún documento para firma."));
        return;
      }
      data.requests.forEach(item=>{
        const row=txt("article","","clinic-consent-row");
        row.append(txt("strong",kindNames[item.kind]||item.kind));
        row.append(txt("span",(stateNames[item.status]||item.status)+" · "+label(item.assigned_at)));
        if(item.signed_at){
          const methods={drawn_portal:"Dibujada en Mi espacio",typed_email_otp:"Nombre escrito + código de correo",drawn_onsite:"Presencial en dispositivo"};
          row.append(txt("small","Firma recibida: "+new Date(item.signed_at).toLocaleString("es-ES")+
            " · "+(methods[item.signing_method]||"Firma en pantalla")));
        }
        const buttons=txt("div","","clinic-consent-buttons");
        if(["submitted","verified"].includes(item.status)){
          const pdf=txt("button","Descargar PDF firmado");
          pdf.type="button";
          pdf.onclick=()=>download(item).catch(err=>{message.textContent=err.message||"Error al descargar.";});
          buttons.append(pdf);
        }
        if(item.status==="submitted"){
          const verify=txt("button","Validar tras revisión");
          verify.type="button";verify.onclick=()=>updateStatus(item,"verify");buttons.append(verify);
        }
        if(item.status==="pending"){
          const onsite=txt("button","Firma presencial en este dispositivo");
          onsite.type="button";onsite.onclick=()=>void startOnsite(item);buttons.append(onsite);
          const cancel=txt("button","Anular solicitud");
          cancel.type="button";cancel.onclick=()=>updateStatus(item,"cancel");buttons.append(cancel);
        }
        row.append(buttons);list.append(row);
      });
    }catch(err){
      if(sequence!==refreshId)return;
      list.replaceChildren(txt("p",err.message||"No se han podido cargar los consentimientos."));
    }
  }
  assign.addEventListener("click",async()=>{
    const id=String(patientInput.value||"").trim();
    if(busy||!idPattern.test(id)) {message.textContent="Abre primero una ficha clínica.";return;}
    if(id!==currentId){currentId=id;}
    if(!window.confirm("¿Crear una solicitud de firma en esta ficha clínica? Podrás firmarla desde Mi espacio o en la consulta. No se enviará ningún correo automáticamente."))return;
    busy=true;assign.disabled=true;message.textContent="Asignando documento…";
    try{
      await request("",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"assign",patient_id:id,kind:select.value})});
      await load();
      message.textContent="Documento asignado. El paciente puede firmarlo desde Mi espacio si tiene acceso habilitado, o puedes iniciar la firma presencial desde la solicitud.";
    }catch(err){message.textContent=err.message||"No se pudo asignar.";}
    finally{busy=false;assign.disabled=false;}
  });
  refresh.addEventListener("click",()=>{void load();});
  window.addEventListener("clinic-patient-opened",event=>{
    const id=event.detail?.id||"";
    currentId=idPattern.test(id)?id:"";onsiteBox?.replaceChildren();void load();
  });
  reset();
})();
