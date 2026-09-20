(() => {
  "use strict";
  const SUPABASE_URL="https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL=`${SUPABASE_URL}/rest/v1`;
  const AUTH_URL=`${SUPABASE_URL}/auth/v1`;
  const STORAGE_URL=`${SUPABASE_URL}/storage/v1`;
  const KEY="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY="dememoria_admin_session";
  const ALLOWED_USER_ID="9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
  const $=(s)=>document.querySelector(s);
  const els={
    login:$("#resources-login"),loginForm:$("#resources-login-form"),email:$("#resources-email"),password:$("#resources-password"),loginMessage:$("#resources-login-message"),
    app:$("#resources-app"),logout:$("#resources-logout"),newButton:$("#resource-new"),list:$("#resources-list"),count:$("#resources-count"),
    form:$("#resource-form"),empty:$("#resources-empty"),editorTitle:$("#resource-editor-title"),id:$("#resource-id"),title:$("#resource-title"),subtitle:$("#resource-subtitle"),slug:$("#resource-slug"),price:$("#resource-price"),
    description:$("#resource-description"),category:$("#resource-category"),audience:$("#resource-audience"),format:$("#resource-format"),featured:$("#resource-featured"),
    coverFile:$("#resource-cover-file"),coverUrl:$("#resource-cover-url"),coverAlt:$("#resource-cover-alt"),coverPreview:$("#resource-cover-preview"),
    downloadFile:$("#resource-download-file"),filePath:$("#resource-file-path"),fileState:$("#resource-file-state"),
    relatedPage:$("#resource-related-page"),relatedArticle:$("#resource-related-article"),seoTitle:$("#resource-seo-title"),seoDescription:$("#resource-seo-description"),
    saveDraft:$("#resource-save-draft"),publish:$("#resource-publish"),archive:$("#resource-archive"),deleteButton:$("#resource-delete"),statusLabel:$("#resource-status-label"),message:$("#resource-message")
  };
  let session=null, resources=[], articles=[], activeFilter="all";

  const slugify=(value)=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,180);
  const escapeHtml=(value)=>String(value||"").replace(/[&<>'"]/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const setMessage=(text)=>{ if(els.message) els.message.textContent=text||""; };
  const setLoginMessage=(text)=>{ if(els.loginMessage) els.loginMessage.textContent=text||""; };
  const authHeaders=(extra={})=>({apikey:KEY,Authorization:`Bearer ${session.access_token}`,"Content-Type":"application/json",...extra});
  function saveSession(value){session=value;if(value)sessionStorage.setItem(SESSION_KEY,JSON.stringify(value));else sessionStorage.removeItem(SESSION_KEY);}
  function getSession(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");}catch{return null;}}
  async function currentUser(){
    if(!session?.access_token)return null;
    const r=await fetch(`${AUTH_URL}/user`,{headers:{apikey:KEY,Authorization:`Bearer ${session.access_token}`},cache:"no-store"});
    if(!r.ok)return null; const user=await r.json(); return user?.id===ALLOWED_USER_ID?user:null;
  }
  async function signIn(email,password){
    const r=await fetch(`${AUTH_URL}/token?grant_type=password`,{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
    const body=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(body.error_description||body.msg||"No se ha podido iniciar sesión.");
    if(body.user?.id!==ALLOWED_USER_ID)throw new Error("Esta cuenta no tiene acceso.");
    saveSession(body);
  }
  function showApp(){els.login.hidden=true;els.app.hidden=false;}
  function showLogin(){els.app.hidden=true;els.login.hidden=false;}
  function euro(cents){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format((Number(cents)||0)/100);}
  function statusText(status){return status==="published"?"Publicado":status==="archived"?"Archivado":"Borrador";}
  async function loadData(selectId=null){
    const [rr,ar]=await Promise.all([
      fetch(`${REST_URL}/digital_resources?select=*&order=updated_at.desc`,{headers:authHeaders(),cache:"no-store"}),
      fetch(`${REST_URL}/articles?select=id,title,status&order=updated_at.desc`,{headers:authHeaders(),cache:"no-store"})
    ]);
    if(rr.status===401){saveSession(null);showLogin();return;}
    const rb=await rr.json().catch(()=>[]), ab=await ar.json().catch(()=>[]);
    if(!rr.ok)throw new Error(rb.message||"No se han podido cargar los recursos.");
    if(!ar.ok)throw new Error(ab.message||"No se han podido cargar los artículos.");
    resources=Array.isArray(rb)?rb:[]; articles=Array.isArray(ab)?ab:[];
    renderArticleOptions(); renderList();
    if(selectId){const item=resources.find(r=>r.id===selectId);if(item)openResource(item);}
  }
  function renderArticleOptions(){
    const current=els.relatedArticle.value;
    els.relatedArticle.replaceChildren(new Option("Sin artículo relacionado",""));
    articles.forEach(a=>els.relatedArticle.add(new Option(`${a.title}${a.status==="published"?"":" · borrador"}`,a.id)));
    els.relatedArticle.value=current;
  }
  function renderList(){
    const rows=resources.filter(r=>activeFilter==="all"||r.status===activeFilter);
    els.count.textContent=String(resources.length); els.list.replaceChildren();
    if(!rows.length){const d=document.createElement("div");d.className="resources-empty";d.style.minHeight="120px";d.textContent="No hay recursos en este estado.";els.list.append(d);return;}
    rows.forEach(r=>{
      const b=document.createElement("button");b.type="button";b.className=`resource-list-item${els.id.value===r.id?" active":""}`;
      b.innerHTML=`<strong>${escapeHtml(r.title)}</strong><span><i>${statusText(r.status)}</i><i>${euro(r.price_cents)}</i></span>`;
      b.addEventListener("click",()=>openResource(r));els.list.append(b);
    });
  }
  function resetCover(){
    els.coverPreview.replaceChildren();
    if(els.coverUrl.value){const img=document.createElement("img");img.src=els.coverUrl.value;img.alt=els.coverAlt.value||"";els.coverPreview.append(img);}
    else{const s=document.createElement("span");s.textContent="Sin portada";els.coverPreview.append(s);}
  }
  function newResource(){
    els.form.reset(); els.id.value=""; els.filePath.value=""; els.category.value="psicologia";els.audience.value="general";els.format.value="PDF";
    els.editorTitle.textContent="Nuevo recurso";els.statusLabel.textContent="Borrador nuevo";els.archive.hidden=true;els.deleteButton.hidden=true;els.fileState.textContent="Todavía no hay archivo subido.";
    els.empty.hidden=true;els.form.hidden=false;setMessage("");resetCover();renderList();els.title.focus();
  }
  function openResource(r){
    els.id.value=r.id;els.title.value=r.title||"";els.subtitle.value=r.subtitle||"";els.slug.value=r.slug||"";els.price.value=((r.price_cents||0)/100).toFixed(2);
    els.description.value=r.description||"";els.category.value=r.category||"psicologia";els.audience.value=r.audience||"general";els.format.value=r.format_label||"PDF";els.featured.checked=Boolean(r.featured);
    els.coverUrl.value=r.cover_url||"";els.coverAlt.value=r.cover_alt||"";els.filePath.value=r.file_path||"";els.relatedPage.value=r.related_page||"";els.relatedArticle.value=r.related_article_id||"";
    els.seoTitle.value=r.seo_title||"";els.seoDescription.value=r.seo_description||"";els.statusLabel.textContent=statusText(r.status);els.editorTitle.textContent="Editar recurso";
    els.archive.hidden=false;els.deleteButton.hidden=false;els.empty.hidden=true;els.form.hidden=false;els.fileState.textContent=r.file_path?`Archivo privado: ${r.file_path}`:"Todavía no hay archivo subido.";
    setMessage("");resetCover();renderList();
  }
  function payload(status){
    const title=els.title.value.trim(); if(!title)throw new Error("Escribe el título.");
    const slug=slugify(els.slug.value||title); if(!slug)throw new Error("La URL no es válida.");
    const price=Math.round((Number(els.price.value)||0)*100);
    if(status==="published"&&!els.filePath.value)throw new Error("Sube el archivo descargable antes de publicar.");
    return {
      title,slug,subtitle:els.subtitle.value.trim()||null,description:els.description.value.trim()||null,category:els.category.value,audience:els.audience.value,
      format_label:els.format.value.trim()||"PDF",price_cents:price,status,featured:els.featured.checked,cover_url:els.coverUrl.value||null,cover_alt:els.coverAlt.value.trim()||null,
      file_path:els.filePath.value||null,related_page:els.relatedPage.value||null,related_article_id:els.relatedArticle.value||null,
      seo_title:els.seoTitle.value.trim()||null,seo_description:els.seoDescription.value.trim()||null,updated_at:new Date().toISOString(),
      published_at:status==="published"?(resources.find(r=>r.id===els.id.value)?.published_at||new Date().toISOString()):null
    };
  }
  async function save(status){
    const body=payload(status), id=els.id.value;
    setMessage(status==="published"?"Publicando…":"Guardando…");
    const url=id?`${REST_URL}/digital_resources?id=eq.${encodeURIComponent(id)}`:`${REST_URL}/digital_resources`;
    const r=await fetch(url,{method:id?"PATCH":"POST",headers:authHeaders({Prefer:"return=representation"}),body:JSON.stringify(body)});
    const result=await r.json().catch(()=>[]);
    if(!r.ok)throw new Error(result.message||"No se ha podido guardar.");
    const savedId=id||result?.[0]?.id;await loadData(savedId);setMessage(status==="published"?"Recurso publicado.":"Borrador guardado.");
  }
  async function archiveResource(){
    if(!els.id.value)return;const r=await fetch(`${REST_URL}/digital_resources?id=eq.${encodeURIComponent(els.id.value)}`,{method:"PATCH",headers:authHeaders({Prefer:"return=representation"}),body:JSON.stringify({status:"archived",updated_at:new Date().toISOString()})});
    if(!r.ok)throw new Error("No se ha podido archivar.");await loadData(els.id.value);setMessage("Recurso archivado.");
  }
  async function deleteResource(){
    const id=els.id.value;if(!id)return;if(!window.confirm(`¿Eliminar definitivamente “${els.title.value.trim()}”?`))return;
    const r=await fetch(`${REST_URL}/digital_resources?id=eq.${encodeURIComponent(id)}`,{method:"DELETE",headers:authHeaders()});if(!r.ok)throw new Error("No se ha podido eliminar.");
    els.form.hidden=true;els.empty.hidden=false;els.id.value="";await loadData();
  }
  async function upload(bucket,file,isPublic){
    if(!file)throw new Error("Selecciona un archivo.");
    const safe=slugify(file.name.replace(/\.[^.]+$/,""))||"archivo";const ext=(file.name.split(".").pop()||"bin").toLowerCase().replace(/[^a-z0-9]/g,"");
    const objectName=`${Date.now()}-${safe}.${ext}`;
    const r=await fetch(`${STORAGE_URL}/object/${bucket}/${encodeURIComponent(objectName)}`,{method:"POST",headers:{apikey:KEY,Authorization:`Bearer ${session.access_token}`,"Content-Type":file.type||"application/octet-stream","x-upsert":"false"},body:file});
    const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body.message||"No se ha podido subir el archivo.");
    return isPublic?`${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURIComponent(objectName)}`:objectName;
  }
  async function uploadCover(file){
    if(file.size>8*1024*1024)throw new Error("La portada no puede superar 8 MB.");setMessage("Subiendo portada…");
    const url=await upload("resource-covers",file,true);els.coverUrl.value=url;if(!els.coverAlt.value.trim())els.coverAlt.value=file.name.replace(/\.[^.]+$/,"").replace(/[-_]+/g," ");resetCover();setMessage("Portada subida.");
  }
  async function uploadDownload(file){
    if(file.size>30*1024*1024)throw new Error("El archivo no puede superar 30 MB.");setMessage("Subiendo archivo privado…");
    const path=await upload("resource-files",file,false);els.filePath.value=path;els.fileState.textContent=`Archivo privado: ${path}`;setMessage("Archivo subido de forma privada.");
  }
  els.loginForm?.addEventListener("submit",async e=>{e.preventDefault();setLoginMessage("Entrando…");try{await signIn(els.email.value.trim(),els.password.value);els.password.value="";showApp();await loadData();setLoginMessage("");}catch(err){setLoginMessage(err.message);}});
  els.logout?.addEventListener("click",()=>{saveSession(null);showLogin();});
  els.newButton?.addEventListener("click",newResource);
  els.title?.addEventListener("input",()=>{if(!els.id.value)els.slug.value=slugify(els.title.value);});
  els.coverFile?.addEventListener("change",()=>{const f=els.coverFile.files?.[0];els.coverFile.value="";if(f)uploadCover(f).catch(e=>setMessage(e.message));});
  els.downloadFile?.addEventListener("change",()=>{const f=els.downloadFile.files?.[0];els.downloadFile.value="";if(f)uploadDownload(f).catch(e=>setMessage(e.message));});
  els.coverUrl?.addEventListener("input",resetCover);
  els.saveDraft?.addEventListener("click",()=>save("draft").catch(e=>setMessage(e.message)));
  els.publish?.addEventListener("click",()=>save("published").catch(e=>setMessage(e.message)));
  els.archive?.addEventListener("click",()=>archiveResource().catch(e=>setMessage(e.message)));
  els.deleteButton?.addEventListener("click",()=>deleteResource().catch(e=>setMessage(e.message)));
  document.querySelectorAll(".resources-filters button").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;document.querySelectorAll(".resources-filters button").forEach(x=>x.classList.toggle("active",x===b));renderList();}));
  (async function init(){session=getSession();const user=await currentUser();if(user){showApp();loadData().catch(e=>setMessage(e.message));}else{saveSession(null);showLogin();}})();
})();