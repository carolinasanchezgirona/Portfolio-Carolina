(() => {
  "use strict";
  const BASE = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const API = BASE + "/rest/v1";
  const STORAGE = BASE + "/storage/v1";
  const AUTH = BASE + "/auth/v1";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const OWNER = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
  const SESSION_KEY = "dememoria_admin_session";
  const BUCKET = "clinical-external-materials";
  const MAX_BYTES = 25 * 1024 * 1024;
  const MIME = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg"
  };
  const AREA = {neuropsychology:"Neuropsicología",psychology:"Psicología"};
  const DOMAIN = {multidomain:"Multidominio",orientation:"Orientación",attention:"Atención",memory:"Memoria",executive:"Funciones ejecutivas",language:"Lenguaje",visuospatial:"Visuoespacial",calculation:"Cálculo",praxis:"Praxias y gnosias",psychology:"Psicología",other:"Otras"};
  const LEVEL = {unspecified:"Sin especificar",basic:"Básico",intermediate:"Intermedio",advanced:"Avanzado"};
  const byId = id => document.getElementById(id);
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = String(text);
    return node;
  };
  const state = {session:null, materials:[], patients:[], assignItem:null, busy:false};
  function message(id, value) {
    const target = byId(id);
    if (target) target.textContent = value || "";
  }
  function headers(extra={}) {
    return {apikey:KEY,Authorization:"Bearer " + state.session.access_token,...extra};
  }
  async function errorText(response) {
    const d = await response.json().catch(() => ({}));
    return d.message || d.error_description || d.error || ("Error " + response.status);
  }
  async function rest(endpoint, options={}) {
    const response = await fetch(API + "/" + endpoint, {
      ...options,cache:"no-store",
      headers:headers({"Content-Type":"application/json",...(options.headers || {})})
    });
    if (!response.ok) throw new Error(await errorText(response));
    if (response.status === 204) return null;
    return response.json().catch(() => null);
  }
  function safeFilename(value) {
    const name = String(value || "material.pdf").normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._-]+/g,"_")
      .replace(/^\.+/,"").slice(-120);
    return name || "archivo.pdf";
  }
  function storageUrl(bucket,path) {
    return STORAGE + "/object/authenticated/" + bucket + "/" +
      String(path).split("/").map(encodeURIComponent).join("/");
  }
  function uploadUrl(bucket,path) {
    return STORAGE + "/object/" + bucket + "/" +
      String(path).split("/").map(encodeURIComponent).join("/");
  }
  function extension(file) {
    return (file.name.split(".").pop() || "").toLowerCase();
  }
  async function validateFile(file) {
    if (!file) throw new Error("Selecciona un archivo para el paciente.");
    if (!file.size || file.size > MAX_BYTES) throw new Error("Cada documento debe ocupar entre 1 byte y 25 MB.");
    const ext=extension(file), mime=MIME[ext];
    if (!mime) throw new Error("Solo se admiten PDF, DOCX, JPG o PNG.");
    const bytes=new Uint8Array(await file.slice(0,8).arrayBuffer());
    const pdf=ext==="pdf" && [37,80,68,70,45].every((x,i)=>bytes[i]===x);
    const png=ext==="png" && [137,80,78,71,13,10,26,10].every((x,i)=>bytes[i]===x);
    const jpg=(ext==="jpg" || ext==="jpeg") && [255,216,255].every((x,i)=>bytes[i]===x);
    const docx=ext==="docx" && bytes[0]===80 && bytes[1]===75;
    if (!(pdf || png || jpg || docx)) throw new Error("El archivo «" + file.name + "» no coincide con el formato indicado.");
    return mime;
  }
  async function uploadFile(file, collectionId, role, mime) {
    const path = "library/" + collectionId + "/" + role + "-" + crypto.randomUUID() + "-" + safeFilename(file.name);
    const response = await fetch(uploadUrl(BUCKET,path), {
      method:"POST",
      headers:headers({"Content-Type":mime,"x-upsert":"false","Cache-Control":"no-store"}),
      body:file
    });
    if (!response.ok) throw new Error("No se ha podido subir «" + file.name + "»: " + await errorText(response));
    return path;
  }
  async function removeFile(path,bucket=BUCKET) {
    if (!path) return;
    const response = await fetch(uploadUrl(bucket,path),{method:"DELETE",headers:headers()});
    if (!response.ok) throw new Error("No se ha podido retirar un archivo de una subida fallida.");
  }
  async function loadMaterials() {
    state.materials = await rest("clinical_external_materials?select=*&order=updated_at.desc&limit=500") || [];
    render();
  }
  async function ensurePatients() {
    if (state.patients.length) return;
    const rows = await rest("clinical_patients?select=id,full_name,status&order=full_name.asc&limit=500") || [];
    state.patients = rows.filter(p => p.status !== "archived" && p.full_name);
  }
  function startCreate() {
    byId("ext-form").reset();
    byId("ext-editor").hidden = false;
    byId("ext-open-form").hidden = true;
    message("ext-form-message","");
    byId("ext-title").focus();
    byId("ext-editor").scrollIntoView({behavior:"smooth",block:"start"});
  }
  function closeCreate() {
    byId("ext-editor").hidden = true;
    byId("ext-open-form").hidden = false;
    byId("ext-form").reset();
    message("ext-form-message","");
  }
  async function save(event) {
    event.preventDefault();
    if (state.busy) return;
    const title=byId("ext-title").value.trim();
    const patientFile=byId("ext-patient-file").files?.[0];
    const solutionFile=byId("ext-solution-file").files?.[0];
    if (title.length<3) {message("ext-form-message","Escribe un título de al menos tres caracteres.");return;}
    state.busy=true;byId("ext-save").disabled=true;
    const uploaded=[];
    try {
      message("ext-form-message","Comprobando archivos…");
      const patientMime=await validateFile(patientFile);
      const solutionMime=solutionFile?await validateFile(solutionFile):null;
      if (solutionFile && patientFile.name===solutionFile.name && patientFile.size===solutionFile.size)
        throw new Error("El material del paciente y el solucionario deben ser documentos diferentes.");
      const id=crypto.randomUUID();
      message("ext-form-message","Subiendo el material del paciente…");
      const patientPath=await uploadFile(patientFile,id,"paciente",patientMime);
      uploaded.push(patientPath);
      let solutionPath=null;
      if (solutionFile) {
        message("ext-form-message","Guardando el solucionario en privado…");
        solutionPath=await uploadFile(solutionFile,id,"solucionario",solutionMime);
        uploaded.push(solutionPath);
      }
      message("ext-form-message","Registrando el material…");
      const payload={
        title,material_type:byId("ext-type").value,clinical_area:byId("ext-area").value,
        cognitive_domain:byId("ext-domain").value,level:byId("ext-level").value,
        description:byId("ext-description").value.trim() || null,
        patient_file_path:patientPath,patient_file_name:patientFile.name,
        patient_file_mime:patientMime,patient_file_size:patientFile.size,
        solution_file_path:solutionPath,solution_file_name:solutionFile?.name || null,
        solution_file_mime:solutionMime,solution_file_size:solutionFile?.size || null
      };
      await rest("clinical_external_materials",{
        method:"POST",headers:{"Prefer":"return=minimal"},body:JSON.stringify(payload)
      });
      closeCreate();
      await loadMaterials();
      message("ext-status","Material guardado en la biblioteca privada. Ya puedes descargarlo o asignarlo a un paciente.");
    } catch(e) {
      if (uploaded.length) {
        const results=await Promise.allSettled(uploaded.map(p=>removeFile(p)));
        const leftover=results.some(r=>r.status==="rejected");
        message("ext-form-message",(e.message || "No se pudo guardar.") + (leftover?" Puede haber archivos sin catalogar; revisa el almacenamiento.":" No se ha creado una ficha incompleta."));
      } else message("ext-form-message",e.message || "No se ha podido guardar el material.");
    } finally {
      state.busy=false;byId("ext-save").disabled=false;
    }
  }
  function badge(text,extra="") {
    return el("span","ext-pill"+(extra?" "+extra:""),text);
  }
  function action(text,handler,main=false) {
    const button=el("button","ext-action"+(main?" ext-action-main":""),text);
    button.type="button";
    button.addEventListener("click",async()=>{
      if(button.disabled)return;
      button.disabled=true;
      try{await handler();}catch(e){message("ext-status",e.message || "No se pudo completar la operación.");}
      finally{button.disabled=false;}
    });
    return button;
  }
  function render() {
    const search=byId("ext-search").value.toLocaleLowerCase("es").trim();
    const filter=byId("ext-filter").value;
    const items=state.materials.filter(m=>{
      if (filter==="active" && m.archived) return false;
      if (filter==="archived" && !m.archived) return false;
      if ((filter==="workbook" || filter==="worksheet") && (m.archived || m.material_type!==filter)) return false;
      return !search || [m.title,m.description,DOMAIN[m.cognitive_domain],m.patient_file_name].filter(Boolean)
        .join(" ").toLocaleLowerCase("es").includes(search);
    });
    message("ext-count",state.materials.filter(m=>!m.archived).length + " materiales activos");
    const host=byId("ext-items");host.replaceChildren();
    if(!items.length){host.append(el("p","ext-muted",search?"No hay coincidencias.":"Aún no hay materiales en esta vista. Pulsa «Añadir material» para empezar."));return;}
    for(const material of items) {
      const card=el("article","ext-item");
      const meta=el("div","ext-meta");
      meta.append(
        badge(material.material_type==="workbook"?"Cuaderno":"Ficha"),
        badge(AREA[material.clinical_area]||"Clínica"),
        badge(LEVEL[material.level]||"Sin nivel")
      );
      if (material.solution_file_path) meta.append(badge("Con solucionario","ext-pill-pro"));
      if (material.archived) meta.append(badge("Archivado"));
      card.append(meta,el("h3",null,material.title));
      card.append(el("p","ext-muted",(DOMAIN[material.cognitive_domain]||"Varias funciones")+" · "+new Date(material.created_at).toLocaleDateString("es-ES")));
      if(material.description)card.append(el("p","ext-muted",material.description));
      const actions=el("div","ext-actions");
      actions.append(action("Descargar paciente",()=>download(material.patient_file_path,material.patient_file_name)));
      if(material.solution_file_path)actions.append(action("Solucionario · solo profesional",()=>download(material.solution_file_path,material.solution_file_name)));
      if (!material.archived)actions.append(action("Asignar a paciente",()=>openAssign(material),true));
      const archive=el("button","ext-link-button",material.archived?"Recuperar":"Archivar");
      archive.type="button";
      archive.addEventListener("click",()=>setArchive(material,!material.archived));
      actions.append(archive);
      card.append(actions);host.append(card);
    }
  }
  async function download(path,name) {
    message("ext-status","Preparando descarga privada…");
    const response = await fetch(storageUrl(BUCKET,path),{headers:headers(),cache:"no-store"});
    if (!response.ok)throw new Error("No se ha podido descargar el archivo: " + await errorText(response));
    const blob=await response.blob();
    const blobUrl=URL.createObjectURL(blob);
    try{
      const a=document.createElement("a");
      a.href=blobUrl;a.download=name || "material";document.body.append(a);a.click();a.remove();
    } finally {setTimeout(()=>URL.revokeObjectURL(blobUrl),45000);}
    message("ext-status","Descarga preparada.");
  }
  async function setArchive(material,archived) {
    if (!window.confirm((archived?"¿Archivar":"¿Recuperar") + " «" + material.title + "»? Los documentos seguirán almacenados en privado."))return;
    await rest("clinical_external_materials?id=eq."+encodeURIComponent(material.id),{
      method:"PATCH",headers:{"Prefer":"return=minimal"},
      body:JSON.stringify({archived,updated_at:new Date().toISOString()})
    });
    await loadMaterials();
    message("ext-status",archived?"Material archivado.":"Material recuperado.");
  }
  async function openAssign(material) {
    if(material.archived)throw new Error("Recupera el material antes de asignarlo.");
    state.assignItem=material;
    byId("ext-assign-title").textContent=material.title;
    message("ext-assign-message","Cargando pacientes…");
    await ensurePatients();
    const select=byId("ext-patient-select");
    select.replaceChildren(new Option("Seleccionar paciente…",""));
    state.patients.forEach(p=>select.add(new Option(p.full_name,p.id)));
    message("ext-assign-message","");
    byId("ext-assign-dialog").showModal();
  }
  async function assign(event) {
    event.preventDefault();
    const material=state.assignItem;
    const patientId=byId("ext-patient-select").value;
    const patient=state.patients.find(p=>p.id===patientId);
    if(!material||!patient) {message("ext-assign-message","Selecciona un paciente.");return;}
    if(!window.confirm("¿Compartir «"+material.title+"» en Mi espacio de "+patient.full_name+"? Únicamente se copiará el material del paciente, nunca el solucionario."))return;
    const button=byId("ext-assign-confirm");button.disabled=true;
    let newPath=null;
    try{
      message("ext-assign-message","Preparando la copia para el paciente…");
      const source=await fetch(storageUrl(BUCKET,material.patient_file_path),{headers:headers(),cache:"no-store"});
      if(!source.ok)throw new Error("No se puede leer el archivo original: "+await errorText(source));
      const data=await source.blob();
      if(!data.size || data.size>MAX_BYTES) throw new Error("El archivo supera el límite de documentos clínicos.");
      newPath=patientId+"/"+crypto.randomUUID()+"-"+safeFilename(material.patient_file_name);
      message("ext-assign-message","Guardando en el espacio clínico del paciente…");
      const response=await fetch(uploadUrl("clinical-documents",newPath),{
        method:"POST",
        headers:headers({"Content-Type":material.patient_file_mime,"x-upsert":"false"}),
        body:data
      });
      if(!response.ok)throw new Error("No se ha podido copiar el documento: "+await errorText(response));
      await rest("clinical_documents",{
        method:"POST",headers:{"Prefer":"return=minimal"},
        body:JSON.stringify({
          patient_id:patientId,category:"other",title:material.title,
          file_path:newPath,file_name:material.patient_file_name,
          mime_type:material.patient_file_mime,file_size:data.size,
          notes:"Copia desde biblioteca de materiales externos (solo documento para paciente).",
          shared_at:new Date().toISOString()
        })
      });
      newPath=null;
      byId("ext-assign-dialog").close();
      state.assignItem=null;
      message("ext-status","«"+material.title+"» está disponible en Mi espacio de "+patient.full_name+". El solucionario sigue privado.");
    }catch(e){
      if(newPath) {
        try{await removeFile(newPath,"clinical-documents");}catch{}
      }
      message("ext-assign-message",e.message||"No se ha podido completar la asignación.");
    }finally{button.disabled=false;}
  }
  async function init() {
    if(!byId("ext-app"))return;
    const raw=sessionStorage.getItem(SESSION_KEY);
    try{state.session=raw?JSON.parse(raw):null;}catch{state.session=null;}
    if(!state.session?.access_token){window.location.replace("/admin/clinica/acceso/?next="+encodeURIComponent(location.pathname));return;}
    try{
      const response=await fetch(AUTH+"/user",{headers:headers(),cache:"no-store"});
      if(!response.ok)throw new Error("La sesión ha caducado.");
      const user=await response.json();
      if(user.id!==OWNER)throw new Error("Esta cuenta no tiene acceso a los materiales clínicos.");
      byId("ext-loading").hidden=true;
      byId("ext-app").hidden=false;
      byId("ext-open-form").addEventListener("click",startCreate);
      byId("ext-cancel").addEventListener("click",closeCreate);
      byId("ext-form").addEventListener("submit",save);
      byId("ext-search").addEventListener("input",render);
      byId("ext-filter").addEventListener("change",render);
      byId("ext-assign-form").addEventListener("submit",assign);
      byId("ext-assign-cancel").addEventListener("click",()=>byId("ext-assign-dialog").close());
      await loadMaterials();
    }catch(e){
      byId("ext-loading").textContent=e.message||"Error al comprobar el acceso.";
      byId("ext-app").hidden=true;
      if(/sesión/.test(e.message||""))window.location.replace("/admin/clinica/acceso/?next="+encodeURIComponent(location.pathname));
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();