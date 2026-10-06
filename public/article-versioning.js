(() => {
  "use strict";
  const SUPABASE_URL="https://grgyvdxkjdstdyumdfyg.supabase.co";
  const KEY="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY="dememoria_admin_session";
  const form=document.querySelector("#article-form");
  const idField=document.querySelector("#article-id");
  const actions=document.querySelector(".editor-actions");
  const message=document.querySelector("#article-message");
  if(!form||!idField||!actions)return;

  let dirty=false, saving=false, lastSavedAt=null;
  const fields={
    title:"#article-title",subtitle:"#article-subtitle",slug:"#article-slug",category:"#article-category",
    excerpt:"#article-excerpt",content:"#article-content",featured:"#article-featured",related_page:"#article-related-page",
    image_url:"#article-image-url",image_alt:"#article-image-alt",image_caption:"#article-image-caption",
    tags:"#article-tags",cta_label:"#article-cta-label",cta_url:"#article-cta-url",
    seo_title:"#article-seo-title",seo_description:"#article-seo-description",scheduled_at:"#article-scheduled-at"
  };
  const session=()=>{try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");}catch{return null;}};
  const headers=(extra={})=>({apikey:KEY,Authorization:`Bearer ${session()?.access_token||""}`,"Content-Type":"application/json",...extra});
  const value=(selector)=>{
    const el=document.querySelector(selector);
    if(!el)return null;
    if(selector==="#article-content")return el.innerHTML.trim();
    if(el.type==="checkbox")return Boolean(el.checked);
    return el.value?.trim?.()??el.value;
  };
  function payload(){
    const tags=String(value(fields.tags)||"").split(",").map(x=>x.trim()).filter(Boolean).slice(0,12);
    return {
      title:value(fields.title)||"",
      subtitle:value(fields.subtitle)||null,
      slug:value(fields.slug)||"",
      category:value(fields.category)||"psicologia",
      excerpt:value(fields.excerpt)||null,
      content:value(fields.content)||"",
      featured:value(fields.featured),
      related_page:value(fields.related_page)||null,
      image_url:value(fields.image_url)||null,
      image_alt:value(fields.image_alt)||null,
      image_caption:value(fields.image_caption)||null,
      tags,
      cta_label:value(fields.cta_label)||null,
      cta_url:value(fields.cta_url)||null,
      seo_title:value(fields.seo_title)||null,
      seo_description:value(fields.seo_description)||null,
      updated_at:new Date().toISOString()
    };
  }

  const status=document.createElement("span");
  status.id="article-autosave-status";
  status.style.cssText="font-size:.7rem;color:#788692;align-self:center;white-space:nowrap";
  status.textContent="Autoguardado listo";
  actions.prepend(status);

  const historyButton=document.createElement("button");
  historyButton.type="button";historyButton.className="articles-secondary";historyButton.textContent="Versiones";
  actions.insertBefore(historyButton,actions.firstChild);

  const dialog=document.createElement("dialog");
  dialog.id="article-version-dialog";
  dialog.style.cssText="width:min(760px,calc(100% - 28px));max-height:82vh;border:1px solid #d3dde4;border-radius:10px;padding:0;background:#fff";
  dialog.innerHTML='<div style="padding:16px"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><div><p class="articles-eyebrow">Historial editorial</p><h2 style="margin:2px 0;color:#173A5E">Versiones guardadas</h2></div><button id="article-version-close" class="articles-text" type="button">Cerrar</button></div><p style="font-size:.75rem;color:#788692">Cada modificación importante conserva la versión anterior. Restaurar no cambia automáticamente el estado de publicación.</p><div id="article-version-list" style="display:grid;gap:7px;margin-top:12px"></div></div>';
  document.body.append(dialog);
  dialog.querySelector("#article-version-close")?.addEventListener("click",()=>dialog.close());

  function markDirty(){
    if(form.hidden)return;
    dirty=true;
    status.textContent=idField.value?"Cambios sin guardar":"Guarda el artículo una vez para activar autoguardado";
  }
  form.addEventListener("input",markDirty,true);
  form.addEventListener("change",markDirty,true);

  async function autosave(){
    const id=idField.value;
    if(!dirty||saving||!id||form.hidden)return;
    saving=true; status.textContent="Autoguardando…";
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${encodeURIComponent(id)}`,{
        method:"PATCH",headers:headers({Prefer:"return=minimal"}),body:JSON.stringify(payload())
      });
      if(!r.ok){const b=await r.json().catch(()=>({}));throw new Error(b.message||"No se ha podido autoguardar.");}
      dirty=false;lastSavedAt=new Date();
      status.textContent=`Guardado automáticamente · ${lastSavedAt.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}`;
    }catch(error){
      status.textContent="Autoguardado pendiente";
      if(message&&!message.textContent)message.textContent=error?.message||"No se ha podido autoguardar.";
    }finally{saving=false;}
  }
  setInterval(autosave,45000);
  window.addEventListener("beforeunload",(event)=>{if(dirty&&idField.value){event.preventDefault();event.returnValue="";}});

  async function loadVersions(){
    const id=idField.value;
    const list=dialog.querySelector("#article-version-list");
    list.replaceChildren();
    if(!id){list.textContent="Primero guarda el artículo.";return;}
    list.textContent="Cargando versiones…";
    const r=await fetch(`${SUPABASE_URL}/rest/v1/article_versions?select=id,snapshot,reason,created_at&article_id=eq.${encodeURIComponent(id)}&order=created_at.desc&limit=30`,{headers:headers(),cache:"no-store"});
    const rows=await r.json().catch(()=>[]);
    list.replaceChildren();
    if(!r.ok||!Array.isArray(rows)){list.textContent="No se ha podido cargar el historial.";return;}
    if(!rows.length){list.textContent="Todavía no hay versiones anteriores.";return;}
    rows.forEach((row,index)=>{
      const card=document.createElement("article");
      card.style.cssText="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 10px;border:1px solid #e1e7ec;border-radius:8px";
      const meta=document.createElement("div");
      const title=row.snapshot?.title||"Versión anterior";
      meta.innerHTML=`<strong style="display:block;font-size:.8rem;color:#173A5E"></strong><span style="font-size:.7rem;color:#788692"></span>`;
      meta.querySelector("strong").textContent=title;
      meta.querySelector("span").textContent=`${new Date(row.created_at).toLocaleString("es-ES")} · versión ${index+1}`;
      const restore=document.createElement("button");restore.type="button";restore.className="articles-secondary";restore.textContent="Restaurar";
      restore.addEventListener("click",()=>restoreVersion(row.snapshot));
      card.append(meta,restore);list.append(card);
    });
  }
  async function restoreVersion(snapshot){
    const id=idField.value;if(!id||!snapshot)return;
    if(!window.confirm("¿Restaurar el contenido de esta versión? La versión actual quedará guardada en el historial."))return;
    const allowed=["title","subtitle","slug","excerpt","content","category","featured","image_url","related_page","seo_title","seo_description","tags","image_alt","image_caption","cta_label","cta_url","layout_template","hero_position","hero_width","header_align","text_width","show_toc","show_tags","show_reading_time","show_author","show_related","module_order"];
    const body={updated_at:new Date().toISOString()};
    allowed.forEach(k=>{if(Object.prototype.hasOwnProperty.call(snapshot,k))body[k]=snapshot[k];});
    const r=await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",headers:headers({Prefer:"return=minimal"}),body:JSON.stringify(body)});
    if(!r.ok){message.textContent="No se ha podido restaurar la versión.";return;}
    dialog.close();window.location.reload();
  }
  historyButton.addEventListener("click",()=>{dialog.showModal();loadVersions();});

  const observer=new MutationObserver(()=>{if(!form.hidden){dirty=false;status.textContent=idField.value?"Autoguardado listo":"Guarda el artículo una vez para activar autoguardado";}});
  observer.observe(form,{attributes:true,attributeFilter:["hidden"]});
})();