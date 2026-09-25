
/* Instagram factory integrated into the existing private articles editor. */
(function () {
  "use strict";
  const root=document.getElementById("ig-root"),blog=document.getElementById("article-workspace");
  if(!root || !blog) return;
  const SB="https://grgyvdxkjdstdyumdfyg.supabase.co";
  const KEY="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const STORE=SB+"/rest/v1/instagram_posts",ARTICLES=SB+"/rest/v1/articles";
  const SESSION_KEY="dememoria_admin_session";
  const $=function(id){return document.getElementById(id);};
  const state={current:null,articles:[],posts:[],sourceText:"",slide:0,busy:false,renderer:null,paintToken:0,loaded:false};
  function session(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");}catch{return null;}}
  function auth(extra){const s=session();if(!s?.access_token)throw Error("Accede con tu cuenta del área privada.");return Object.assign({apikey:KEY,Authorization:"Bearer "+s.access_token,"Content-Type":"application/json"},extra||{});}
  function text(value){return String(value||"").trim();}
  function strip(html){const div=document.createElement("div");div.innerHTML=html||"";div.querySelectorAll("script,style,span[data-article-layout],span[data-public-article-layout],link").forEach(function(n){n.remove();});return text(div.textContent).replace(/\s+/g," ");}
  function html(value){return String(value||"").replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];});}
  function skeleton(family){return {titulo:"",texto:"",composicion:family==="pregunta"?"pregunta":"tipografica",foto_prompt:"",alt:"",photo_url:""};}
  function blank(){return {id:null,topic:"",family:"educativa",format:"carrusel",accent:"turquesa",status:"draft",source_article_id:null,source_article_slug:null,notes:"",evidence_reviewed:false,design_reviewed:false,content:{concepto:"",titulo:"",subtitulo:"",diapositivas:Array.from({length:5},function(){return skeleton("educativa");}),pie:"",cta:"",hashtags:[],referencias:[],aviso_revision:"Los contenidos de IA requieren comprobación clínica y bibliográfica."}};}
  const markup=[
    '<div class="ig-workspace">',
      '<aside class="ig-panel ig-sidebar">',
        '<div class="ig-sidebar-header"><h2>Biblioteca social</h2><p>Tu contenido, sus versiones y el vínculo con los artículos.</p><button class="ig-btn ig-btn-accent" id="ig-new" type="button">+ Nueva publicación</button></div>',
        '<div class="ig-list" id="ig-list"><div class="ig-empty">Abre la fábrica para ver tus borradores.</div></div>',
      '</aside>',
      '<section class="ig-panel">',
        '<header class="ig-shell-header"><div><span class="ig-kicker">Carolina Sánchez · Instagram</span><h2>Fábrica de publicaciones</h2></div>',
        '<div class="ig-actions"><button id="ig-generate" type="button" class="ig-btn ig-btn-accent">Crear publicación completa</button><button id="ig-save" type="button" class="ig-btn">Guardar</button><button id="ig-export" type="button" class="ig-btn ig-btn-primary">Descargar paquete ZIP</button></div></header>',
        '<div class="ig-content"><div class="ig-controls">',
          '<section class="ig-block"><h3>1 · Brief editorial</h3>',
            '<label class="ig-field">Tema<input id="ig-topic" maxlength="200" placeholder="P. ej. ¿Por qué me cuesta desconectar?" /></label>',
            '<div class="ig-two"><label class="ig-field">Familia<select id="ig-family"><option value="educativa">Educativa</option><option value="pregunta">Pregunta a Carolina (ejemplo)</option><option value="profesional">Perspectiva profesional</option></select></label>',
              '<label class="ig-field">Formato<select id="ig-format"><option value="carrusel">Carrusel</option><option value="individual">Publicación individual</option></select></label></div>',
            '<div class="ig-two"><label class="ig-field">Número de diapositivas<select id="ig-count"><option value="3">3</option><option value="4">4</option><option value="5" selected>5</option><option value="6">6</option><option value="7">7</option></select></label>',
              '<label class="ig-field">Artículo de origen<select id="ig-source"><option value="">Sin artículo vinculado</option></select></label></div>',
            '<button class="ig-btn" type="button" id="ig-current-article">Usar artículo abierto en el editor</button>',
            '<div class="ig-link-note" id="ig-link-note" hidden></div>',
            '<div class="ig-field"><span>Acento de esta publicación</span><div class="ig-palette">',
              '<label class="ig-color"><input name="ig-accent" type="radio" value="turquesa" checked/><span class="ig-swatch" style="background:#08A6A0"></span>Turquesa</label>',
              '<label class="ig-color"><input name="ig-accent" type="radio" value="coral"/><span class="ig-swatch" style="background:#F2766B"></span>Coral</label>',
            '</div></div>',
            '<label class="ig-field">Indicaciones adicionales para la IA<textarea id="ig-notes" rows="3" maxlength="1600" placeholder="Enfoque, población o conceptos importantes. Nunca introduzcas datos de pacientes."></textarea></label>',
            '<p class="ig-help">Las fotografías se generan automáticamente y el texto se compone después con Fraunces + DM Sans. Nunca se publica en Instagram desde aquí.</p>',
          '</section>',
          '<section class="ig-block"><h3>2 · Contenido de la publicación</h3>',
            '<label class="ig-field">Concepto editorial<textarea id="ig-concept" rows="2"></textarea></label>',
            '<label class="ig-field">Título global<input id="ig-title" maxlength="90" /></label>',
            '<label class="ig-field">Subtítulo<input id="ig-subtitle" maxlength="160" /></label>',
            '<div class="ig-slide-menu" id="ig-slides"></div>',
            '<div class="ig-two"><button class="ig-btn" type="button" id="ig-add">+ Añadir diapositiva</button><button class="ig-btn" type="button" id="ig-remove">Eliminar diapositiva</button></div>',
            '<label class="ig-field">Titular de la diapositiva<input id="ig-slide-title" maxlength="90" /></label>',
            '<label class="ig-field">Desarrollo<textarea id="ig-slide-text" rows="4" maxlength="480"></textarea></label>',
            '<label class="ig-field">Composición<select id="ig-layout"><option value="fotografica">Fotografía editorial</option><option value="dividida">Imagen y explicación</option><option value="tipografica">Tipografía protagonista</option><option value="pregunta">Pregunta frecuente</option><option value="profesional">Perspectiva profesional</option></select></label>',
            '<label class="ig-field">Descripción de la fotografía (sin letras ni texto)<textarea id="ig-photo-prompt" rows="3"></textarea></label>',
            '<div class="ig-photo-preview"><img id="ig-photo-preview" alt="Fotografía seleccionada para la diapositiva" hidden /><button class="ig-btn" id="ig-photo-generate" type="button">Generar esta foto</button><label class="ig-btn">Subir foto<input id="ig-photo-file" type="file" accept="image/jpeg,image/png,image/webp" hidden /></label><button class="ig-btn" id="ig-photo-remove" type="button">Quitar foto</button></div>',
            '<label class="ig-field">Texto alternativo de esta imagen<textarea id="ig-slide-alt" rows="2" maxlength="260"></textarea></label>',
          '</section>',
          '<section class="ig-block"><h3>3 · Texto para Instagram</h3>',
            '<label class="ig-field">Pie de publicación<textarea id="ig-caption" rows="7"></textarea></label>',
            '<label class="ig-field">Llamada a la acción<input id="ig-cta" maxlength="260" /></label>',
            '<label class="ig-field">Hashtags, separados por espacios<input id="ig-hashtags" maxlength="400" /></label>',
            '<label class="ig-field">Referencias bibliográficas verificadas, una por línea<textarea id="ig-references" rows="3" placeholder="Solo fuentes comprobadas personalmente. La IA no inventará citas."></textarea></label>',
            '<p class="ig-help">Si el artículo vinculado está publicado, su dirección se incluirá en el paquete de entrega.</p>',
            '<button id="ig-to-article" class="ig-btn" type="button">Convertir este contenido en borrador del blog</button>',
          '</section>',
          '<section class="ig-block"><h3>4 · Control de calidad</h3>',
            '<div class="ig-quality-list" id="ig-quality"></div>',
            '<div class="ig-review"><label class="ig-check"><input id="ig-evidence" type="checkbox"/>He revisado las afirmaciones clínicas, el alcance de los consejos y las referencias.</label>',
            '<label class="ig-check"><input id="ig-design" type="checkbox"/>He revisado la ortografía, las fotografías, la legibilidad y los textos alternativos.</label></div>',
            '<p class="ig-help" id="ig-status">Borrador sin revisar</p><button type="button" id="ig-delete" class="ig-btn">Eliminar borrador guardado</button>',
          '</section>',
        '</div>',
        '<aside class="ig-preview"><div class="ig-preview-heading"><h2>Vista previa real</h2><span id="ig-page">1 / 5</span></div>',
          '<canvas id="ig-canvas" width="1080" height="1350" aria-label="Vista previa de diapositiva de Instagram"></canvas>',
          '<div class="ig-preview-toolbar"><button class="ig-btn" type="button" id="ig-prev">← Anterior</button><span>1080 × 1350 px</span><button class="ig-btn" type="button" id="ig-next">Siguiente →</button></div>',
          '<button class="ig-btn" id="ig-download-one" type="button">Descargar diapositiva actual</button>',
          '<div class="ig-notice">El cuadrado central de la cuadrícula de Instagram conserva los titulares. Descarga solo después de las dos revisiones.</div>',
        '</aside></div>',
        '<div class="ig-footer"><p id="ig-message" aria-live="polite" class="ig-notice">Redacta un brief o reutiliza un artículo existente.</p></div>',
      '</section>',
    '</div>'
  ].join("");
  root.innerHTML=markup;

  function note(message,kind){const el=$("ig-message");el.textContent=message;el.className="ig-notice"+(kind?" "+kind:"");}
  function busy(value){state.busy=value;["ig-generate","ig-save","ig-export","ig-photo-generate","ig-delete"].forEach(function(id){$(id).disabled=value;});}
  async function jsonResponse(r){const body=await r.json().catch(function(){return {};});if(!r.ok)throw Error(body.error||body.message||(r.status===404?"La fábrica aún no está instalada en el servidor.":"Error "+r.status));return body;}
  function published(a){return a && a.status==="published" && (!a.published_at || new Date(a.published_at).getTime()<=Date.now());}
  function sourceArticle(a,preserveTopic) {
    state.current.source_article_id=a?.id||null;
    state.current.source_article_slug=published(a)?a.slug:null;
    state.sourceText=a ? [a.title,a.subtitle||"",a.excerpt||"",strip(a.content)].filter(Boolean).join("\n\n").slice(0,15000) : "";
    if(a && !preserveTopic)state.current.topic=a.title;
    const label=$("ig-link-note");
    if(a) {label.hidden=false;label.textContent=published(a)?"Artículo relacionado publicado. Se incorporará su enlace al pie del paquete.":"Artículo de origen todavía no publicado. No se añadirá un enlace público.";}
    else {label.hidden=true;label.textContent="";}
  }
  function refreshSources() {
    const select=$("ig-source"),selected=state.current?.source_article_id||"";
    select.replaceChildren(new Option("Sin artículo vinculado",""));
    state.articles.forEach(function(a){select.add(new Option(a.title+(published(a)?" · Publicado":" · Borrador"),a.id));});
    select.value=selected;
  }
  async function loadSources() {
    const r=await fetch(ARTICLES+"?select=id,title,subtitle,excerpt,content,category,slug,status,published_at&order=updated_at.desc&limit=80",{headers:auth(),cache:"no-store"});
    state.articles=await jsonResponse(r);refreshSources();
  }
  async function loadPosts(selectId) {
    const r=await fetch(STORE+"?select=*&order=updated_at.desc&limit=100",{headers:auth(),cache:"no-store"});
    state.posts=await jsonResponse(r);renderLibrary();
    if(selectId){const found=state.posts.find(function(x){return x.id===selectId;});if(found)openPost(found);}
  }
  function renderLibrary(){
    const list=$("ig-list");list.replaceChildren();
    if(!state.posts.length){const p=document.createElement("p");p.className="ig-empty";p.textContent="Sin publicaciones guardadas. Crea la primera.";list.append(p);return;}
    state.posts.forEach(function(post){
      const b=document.createElement("button");b.type="button";b.setAttribute("aria-current",post.id===state.current?.id?"true":"false");
      const title=document.createElement("strong");title.textContent=post.topic||"Sin tema";
      const sub=document.createElement("small");sub.textContent=({draft:"Borrador",ready:"Revisado",exported:"Exportado"}[post.status]||"Borrador")+" · "+new Date(post.updated_at).toLocaleDateString("es-ES");
      b.append(title,sub);b.addEventListener("click",function(){openPost(post);});list.append(b);
    });
  }
  function openPost(db) {
    state.current=Object.assign(blank(),db,{content:Object.assign(blank().content,db.content||{})});
    state.current.content.diapositivas=(Array.isArray(db.content?.diapositivas)?db.content.diapositivas:[]).map(function(s){return Object.assign(skeleton(db.family),s);});
    if(!state.current.content.diapositivas.length)state.current.content.diapositivas=[skeleton(db.family)];
    state.slide=0;state.sourceText="";const source=state.articles.find(function(a){return a.id===db.source_article_id;});
    if(source)sourceArticle(source,true);else {const label=$("ig-link-note");label.hidden=!db.source_article_id;label.textContent=db.source_article_id?"El artículo de origen no figura en la lista cargada; se conserva su vínculo guardado.":"";}
    fill();renderLibrary();
  }
  function createNew() {
    state.current=blank();state.slide=0;state.sourceText="";fill();renderLibrary();note("Nuevo borrador. Define el tema o parte de un artículo.");
  }
  function fill(){
    const p=state.current,c=p.content;
    $("ig-topic").value=p.topic;$("ig-family").value=p.family;$("ig-format").value=p.format;$("ig-count").value=String(p.format==="individual"?1:c.diapositivas.length);
    $("ig-count").disabled=p.format==="individual";
    document.querySelectorAll('input[name="ig-accent"]').forEach(function(r){r.checked=r.value===p.accent;});
    $("ig-notes").value=p.notes||"";$("ig-concept").value=c.concepto||"";$("ig-title").value=c.titulo||"";$("ig-subtitle").value=c.subtitulo||"";
    $("ig-caption").value=c.pie||"";$("ig-cta").value=c.cta||"";
    $("ig-hashtags").value=(c.hashtags||[]).join(" ");$("ig-references").value=(c.referencias||[]).join("\n");
    $("ig-evidence").checked=Boolean(p.evidence_reviewed);$("ig-design").checked=Boolean(p.design_reviewed);
    refreshSources();refreshSlides();showSlide();quality();
  }
  function selectedSlide(){return state.current.content.diapositivas[state.slide];}
  function showSlide() {
    const s=selectedSlide();if(!s)return;
    $("ig-slide-title").value=s.titulo||"";$("ig-slide-text").value=s.texto||"";
    $("ig-layout").value=s.composicion||"tipografica";$("ig-photo-prompt").value=s.foto_prompt||"";$("ig-slide-alt").value=s.alt||"";
    const image=$("ig-photo-preview");image.hidden=!s.photo_url;if(s.photo_url)image.src=s.photo_url;else image.removeAttribute("src");
    $("ig-page").textContent=(state.slide+1)+" / "+state.current.content.diapositivas.length;
    refreshSlides();preview();
  }
  function refreshSlides() {
    const list=$("ig-slides"),slides=state.current.content.diapositivas;list.replaceChildren();
    slides.forEach(function(s,i){
      const btn=document.createElement("button");btn.type="button";btn.textContent=String(i+1);
      btn.title=s.titulo||"Diapositiva "+(i+1);btn.setAttribute("aria-current",i===state.slide?"true":"false");
      btn.addEventListener("click",function(){state.slide=i;showSlide();});list.append(btn);
    });
  }
  function markEdited(designOnly) {
    if(designOnly) {state.current.design_reviewed=false;$("ig-design").checked=false;}
    else {state.current.evidence_reviewed=false;state.current.design_reviewed=false;$("ig-evidence").checked=false;$("ig-design").checked=false;}
    state.current.status="draft";quality();
  }
  function syncFields(changed) {
    const p=state.current,c=p.content;if(!p)return;
    p.topic=text($("ig-topic").value);p.family=$("ig-family").value;p.format=$("ig-format").value;
    p.accent=document.querySelector('input[name="ig-accent"]:checked')?.value||"turquesa";
    p.notes=$("ig-notes").value;c.concepto=$("ig-concept").value;c.titulo=$("ig-title").value;c.subtitulo=$("ig-subtitle").value;
    c.pie=$("ig-caption").value;c.cta=$("ig-cta").value;c.hashtags=$("ig-hashtags").value.split(/\s+/).map(function(t){return t.trim();}).filter(Boolean).slice(0,8);
    c.referencias=$("ig-references").value.split("\n").map(text).filter(Boolean).slice(0,20);
    const s=selectedSlide();
    if(s){
      s.titulo=$("ig-slide-title").value;s.texto=$("ig-slide-text").value;s.composicion=$("ig-layout").value;
      s.foto_prompt=$("ig-photo-prompt").value;s.alt=$("ig-slide-alt").value;
    }
    if(changed)markEdited(changed==="ig-layout"||changed==="ig-accent");
    refreshSlides();preview();
  }
  function issues() {
    const p=state.current,c=p.content,slides=c.diapositivas||[],problems=[];
    if(p.topic.length<4)problems.push("Falta un tema concreto.");
    if(!c.titulo.trim())problems.push("Falta el título editorial.");
    if(!text(c.pie))problems.push("Falta el pie de publicación.");
    if(!slides.length)problems.push("No hay diapositivas.");
    slides.forEach(function(s,i){
      const n=i+1;
      if(!text(s.titulo))problems.push("Diapositiva "+n+": titular pendiente.");
      if(text(s.titulo).length>70)problems.push("Diapositiva "+n+": acorta el titular a 70 caracteres.");
      if(text(s.texto).length>340)problems.push("Diapositiva "+n+": simplifica el desarrollo a 340 caracteres.");
      if(!text(s.alt))problems.push("Diapositiva "+n+": texto alternativo pendiente.");
      if(["fotografica","dividida","profesional"].includes(s.composicion)&&!s.photo_url)problems.push("Diapositiva "+n+": falta la fotografía de esta composición.");
    });
    return problems;
  }
  function quality() {
    if(!state.current)return;
    const list=$("ig-quality"),bad=issues();list.replaceChildren();
    if(bad.length===0){const el=document.createElement("span");el.className="ok";el.textContent="Estructura, fotografías y ALT completos.";list.append(el);}
    else bad.forEach(function(issue){const el=document.createElement("span");el.textContent=issue;list.append(el);});
    const reviewed=state.current.evidence_reviewed&&state.current.design_reviewed;
    const ready=reviewed&&!bad.length;
    $("ig-status").textContent=ready?"Contenido listo para exportar. Estado: "+(state.current.status||"draft"):"Pendiente de revisión: "+bad.length+" comprobaciones y dos validaciones profesionales.";
    $("ig-export").disabled=state.busy||!ready;$("ig-download-one").disabled=state.busy||!ready;
  }
  async function renderer(){
    if(window.CarolinaInstagramRenderer)return window.CarolinaInstagramRenderer;
    if(!state.renderer){
      state.renderer=new Promise(function(resolve,reject){
        const script=document.createElement("script");script.src="/editorial-instagram-renderer.js?v=20260925-1";script.onload=function(){resolve(window.CarolinaInstagramRenderer);};script.onerror=function(){reject(Error("No se ha podido cargar el motor gráfico."));};document.head.append(script);
      });
    }
    return state.renderer;
  }
  async function preview() {
    if(!state.current)return;
    const token=++state.paintToken,index=state.slide;
    try {
      const api=await renderer(),canvas=await api.draw(state.current,index);
      if(token!==state.paintToken)return;
      const screen=$("ig-canvas"),ctx=screen.getContext("2d");ctx.clearRect(0,0,1080,1350);ctx.drawImage(canvas,0,0);
    } catch(error) {if(token===state.paintToken)note(error.message||"No se ha podido dibujar la vista previa.","error");}
  }
  function caption(){
    const p=state.current,c=p.content,sections=[text(c.pie),text(c.cta)];
    if(p.source_article_slug)sections.push("Artículo completo en carolinasanchezgirona.com/articulos/"+p.source_article_slug+"/");
    if(c.hashtags?.length)sections.push(c.hashtags.join(" "));
    return sections.filter(Boolean).join("\n\n");
  }
  async function savePost(announce) {
    syncFields(null);const p=state.current,bad=issues();
    const mode=p.evidence_reviewed&&p.design_reviewed&&!bad.length?"ready":"draft";
    const item={topic:p.topic||"Sin tema",family:p.family,format:p.format,accent:p.accent,status:p.status==="exported"&&mode==="ready"?"exported":mode,
      source_article_id:p.source_article_id,source_article_slug:p.source_article_slug,
      content:p.content,photos:{version:1},evidence_reviewed:p.evidence_reviewed,design_reviewed:p.design_reviewed,updated_at:new Date().toISOString()};
    const existing=Boolean(p.id),url=existing?STORE+"?id=eq."+encodeURIComponent(p.id):STORE;
    const r=await fetch(url,{method:existing?"PATCH":"POST",headers:auth({Prefer:"return=representation"}),body:JSON.stringify(item)});
    const result=await jsonResponse(r),saved=result?.[0];if(saved?.id)p.id=saved.id;p.status=item.status;
    await loadPosts();quality();
    if(announce)note("Borrador guardado en tu biblioteca editorial.","success");
  }
  async function uploadPhoto(blob,name){
    const s=session();if(!s?.access_token)throw Error("Vuelve a iniciar sesión.");
    if(blob.size>5*1024*1024)throw Error("La fotografía supera el límite de 5 MB.");
    const ext=blob.type==="image/webp"?"webp":blob.type==="image/png"?"png":"jpg";
    const filename=Date.now()+"-"+Math.random().toString(36).slice(2,9)+"-"+String(name||"foto").replace(/[^a-z0-9-]/gi,"-").slice(0,35)+"."+ext;
    const r=await fetch(SB+"/storage/v1/object/instagram-assets/"+filename,{
      method:"POST",headers:{apikey:KEY,Authorization:"Bearer "+s.access_token,"Content-Type":blob.type,"x-upsert":"false"},body:blob
    });
    await jsonResponse(r);return SB+"/storage/v1/object/public/instagram-assets/"+filename;
  }
  async function photoFromFile(file){
    if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw Error("Elige una fotografía JPG, PNG o WebP.");
    const url=URL.createObjectURL(file);
    try {
      const img=new Image();img.src=url;await img.decode();
      const scale=Math.min(1,1600/Math.max(img.naturalWidth,img.naturalHeight));
      const canvas=document.createElement("canvas");canvas.width=Math.round(img.naturalWidth*scale);canvas.height=Math.round(img.naturalHeight*scale);
      canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
      return await new Promise(function(resolve,reject){canvas.toBlob(function(b){if(b)resolve(b);else reject(Error("No se pudo optimizar la foto."));},"image/webp",0.84);});
    } finally {URL.revokeObjectURL(url);}
  }
  async function createPhoto(i,silent) {
    const slide=state.current.content.diapositivas[i];if(!slide)return;
    if(!text(slide.foto_prompt))throw Error("Escribe primero la escena para la fotografía "+(i+1)+".");
    if(!silent)note("Generando fotografía "+(i+1)+". Puede tardar un poco.");
    const r=await fetch("/api/editorial/image",{method:"POST",headers:auth(),body:JSON.stringify({photo_prompt:slide.foto_prompt})});
    const payload=await jsonResponse(r);
    const b=await fetch(payload.data_url).then(function(response){return response.blob();});
    slide.photo_url=await uploadPhoto(b,"foto-"+(i+1));
    markEdited(true);
    if(i===state.slide)showSlide();
    if(!silent)note("Fotografía generada y guardada.","success");
  }
  async function generate(){
    if(state.busy)return;
    syncFields(null);if(state.current.topic.length<4)return note("Escribe el tema de la publicación.","error");
    const saved=state.current,source=state.sourceText;busy(true);
    try {
      note("Preparando narrativa y textos clínicos. Después se crearán las fotografías.");
      const r=await fetch("/api/editorial/generate",{method:"POST",headers:auth(),body:JSON.stringify({
        topic:saved.topic,family:saved.family,slide_count:saved.format==="individual"?1:Number($("ig-count").value)||5,notes:saved.notes,source:source
      })});
      const generated=await jsonResponse(r);
      saved.content=generated;
      saved.content.diapositivas=generated.diapositivas.map(function(slide){return Object.assign(skeleton(saved.family),slide,{photo_url:""});});
      state.slide=0;saved.evidence_reviewed=false;saved.design_reviewed=false;saved.status="draft";fill();
      try {await savePost(false);}catch(e){note("Texto generado, pero no se ha podido guardar: "+e.message,"error");}
      const wants=saved.content.diapositivas.map(function(slide,i){return {slide:slide,i:i};}).filter(function(item){
        return text(item.slide.foto_prompt)&&["fotografica","dividida","profesional"].includes(item.slide.composicion);
      }).slice(0,3);
      let failures=0;
      for(const item of wants){
        note("Fotografía "+(wants.indexOf(item)+1)+" de "+wants.length+"…");
        try{await createPhoto(item.i,true);}catch(error){failures++;console.error("Instagram photo could not be created",error?.message);}
      }
      try{await savePost(false);}catch(error){note("Comprueba la conexión y guarda el borrador: "+error.message,"error");return;}
      note(failures?"Textos listos; "+failures+" fotografía(s) requieren reintento y revisión.":"Publicación creada con imágenes. Revisa rigurosamente antes de exportar.",failures?"error":"success");
    }catch(error){note(error.message||"No se pudo generar el contenido.","error");}
    finally{busy(false);quality();}
  }
  async function exportPack(all){
    if(state.busy)return;syncFields(null);const bad=issues();
    if(bad.length||!state.current.evidence_reviewed||!state.current.design_reviewed)return note("Completa los controles y marca las dos revisiones antes de descargar.","error");
    busy(true);
    try {
      const api=await renderer();
      if(!document.fonts.check('700 100px "Fraunces"')||!document.fonts.check('500 40px "DM Sans"'))throw Error("Las tipografías aún no se han cargado. Espera y vuelve a intentarlo.");
      if(all){await api.exportPack(state.current,caption(),function(i,n){note("Preparando imagen "+i+" de "+n+"…");});}
      else{const canvas=await api.draw(state.current,state.slide),blob=await api.asBlob(canvas);api.save(blob,String(state.slide+1).padStart(2,"0")+"-instagram.png");}
      state.current.status="exported";await savePost(false);note(all?"Paquete ZIP preparado con imágenes individuales, texto y ALT.":"Imagen individual lista.","success");
    }catch(error){note(error.message||"No se ha podido completar la exportación.","error");}
    finally{busy(false);quality();}
  }
  function fromCurrentBlog(){
    const title=text($("article-title")?.value),content=strip($("article-content")?.innerHTML||"");
    if(!title||!content)return note("Abre primero un artículo con título y contenido en el editor del blog.","error");
    createNew();const id=text($("article-id")?.value);
    const known=state.articles.find(function(a){return a.id===id;});
    state.current.topic=title;
    if(known)sourceArticle(known,true);
    else{state.sourceText=[title,text($("article-subtitle")?.value),text($("article-excerpt")?.value),content].filter(Boolean).join("\n\n");}
    fill();note("Tema y contenido importados del editor. Genera el carrusel sin copiar el artículo literalmente.","success");
  }
  function toBlog(){
    syncFields(null);const c=state.current.content;
    if(!text(c.titulo))return note("Prepara primero el título de la publicación.","error");
    if(state.current.source_article_id&&!window.confirm("Esta publicación ya está vinculada a un artículo. ¿Crear otro borrador independiente?"))return;
    changeTab("blog");
    $("article-new")?.click();
    $("article-title").value=c.titulo;
    $("article-subtitle").value=c.subtitulo||"";
    $("article-excerpt").value=c.concepto||c.subtitulo||"";
    const sections=(c.diapositivas||[]).map(function(s){return "<h2>"+html(s.titulo)+"</h2><p>"+html(s.texto)+"</p>";});
    const refs=(c.referencias||[]).length?"<h2>Referencias por revisar</h2><ul>"+c.referencias.map(function(r){return "<li>"+html(r)+"</li>";}).join("")+"</ul>":"";
    $("article-content").innerHTML="<p><em>Borrador ampliable: desarrolla y verifica el contenido antes de publicarlo.</em></p>"+sections.join("")+refs;
    $("article-title").dispatchEvent(new Event("input",{bubbles:true}));
    $("article-content").dispatchEvent(new Event("input",{bubbles:true}));
  }
  async function removePost(){
    if(!state.current.id)return note("Este borrador aún no se ha guardado.","error");
    if(!window.confirm("¿Eliminar esta publicación de la biblioteca? Las fotografías subidas seguirán almacenadas."))return;
    busy(true);
    try{await jsonResponse(await fetch(STORE+"?id=eq."+encodeURIComponent(state.current.id),{method:"DELETE",headers:auth()}));createNew();await loadPosts();note("Borrador eliminado.","success");}
    catch(error){note(error.message,"error");}
    finally{busy(false);}
  }
  async function changeTab(which) {
    const social=which==="instagram";root.hidden=!social;blog.hidden=social;
    $("editorial-tab-instagram").setAttribute("aria-selected",social?"true":"false");
    $("editorial-tab-articles").setAttribute("aria-selected",social?"false":"true");
    if(social){
      if(!state.current)createNew();
      if(!state.loaded){
        state.loaded=true;
        try{await Promise.all([loadSources(),loadPosts()]);refreshSources();}
        catch(error){note("El editor funciona en modo local, pero no se pueden cargar los guardados: "+error.message,"error");state.loaded=false;}
      }
      preview();
    }
  }
  $("editorial-tab-articles").addEventListener("click",function(){changeTab("blog");});
  $("editorial-tab-instagram").addEventListener("click",function(){changeTab("instagram");});
  $("article-to-instagram")?.addEventListener("click",async function(){await changeTab("instagram");fromCurrentBlog();});
  $("ig-new").addEventListener("click",createNew);
  $("ig-current-article").addEventListener("click",fromCurrentBlog);
  $("ig-source").addEventListener("change",function(){
    const selected=state.articles.find(function(a){return a.id===$("ig-source").value;});sourceArticle(selected,false);fill();markEdited(false);
  });
  $("ig-format").addEventListener("change",function(){
    const individual=$("ig-format").value==="individual";
    $("ig-count").disabled=individual;state.current.format=$("ig-format").value;
    const slides=state.current.content.diapositivas;
    if(individual)slides.splice(1);else while(slides.length<5)slides.push(skeleton(state.current.family));
    state.slide=0;fill();markEdited(false);
  });
  $("ig-count").addEventListener("change",function(){
    const target=Number($("ig-count").value),slides=state.current.content.diapositivas;
    while(slides.length<target)slides.push(skeleton(state.current.family));
    if(slides.length>target)slides.splice(target);
    state.slide=Math.min(state.slide,slides.length-1);fill();markEdited(false);
  });
  $("ig-add").addEventListener("click",function(){
    const slides=state.current.content.diapositivas;if(slides.length>=7)return note("Máximo siete diapositivas.","error");
    if(state.current.format==="individual"){state.current.format="carrusel";$("ig-format").value="carrusel";$("ig-count").disabled=false;}
    slides.push(skeleton(state.current.family));state.slide=slides.length-1;fill();markEdited(false);
  });
  $("ig-remove").addEventListener("click",function(){
    const slides=state.current.content.diapositivas;if(slides.length<=1)return note("Debe quedar al menos una diapositiva.","error");
    slides.splice(state.slide,1);state.slide=Math.min(state.slide,slides.length-1);fill();markEdited(false);
  });
  const simple=["ig-topic","ig-family","ig-notes","ig-concept","ig-title","ig-subtitle","ig-caption","ig-cta","ig-hashtags","ig-references","ig-slide-title","ig-slide-text","ig-layout","ig-photo-prompt","ig-slide-alt"];
  simple.forEach(function(id){$(id).addEventListener("input",function(){syncFields(id);});});
  document.querySelectorAll('input[name="ig-accent"]').forEach(function(r){r.addEventListener("change",function(){syncFields("ig-accent");});});
  $("ig-evidence").addEventListener("change",function(){state.current.evidence_reviewed=this.checked;quality();});
  $("ig-design").addEventListener("change",function(){state.current.design_reviewed=this.checked;quality();});
  $("ig-prev").addEventListener("click",function(){state.slide=(state.slide+state.current.content.diapositivas.length-1)%state.current.content.diapositivas.length;showSlide();});
  $("ig-next").addEventListener("click",function(){state.slide=(state.slide+1)%state.current.content.diapositivas.length;showSlide();});
  $("ig-save").addEventListener("click",async function(){if(state.busy)return;busy(true);try{await savePost(true);}catch(e){note(e.message,"error");}finally{busy(false);quality();}});
  $("ig-generate").addEventListener("click",generate);
  $("ig-export").addEventListener("click",function(){exportPack(true);});
  $("ig-download-one").addEventListener("click",function(){exportPack(false);});
  $("ig-delete").addEventListener("click",removePost);
  $("ig-to-article").addEventListener("click",toBlog);
  $("ig-photo-generate").addEventListener("click",async function(){
    if(state.busy)return;syncFields(null);busy(true);
    try{await createPhoto(state.slide,false);await savePost(false);}catch(e){note(e.message,"error");}finally{busy(false);quality();}
  });
  $("ig-photo-file").addEventListener("change",async function(){
    const file=this.files?.[0];this.value="";if(!file)return;busy(true);
    try{const prepared=await photoFromFile(file);selectedSlide().photo_url=await uploadPhoto(prepared,file.name);markEdited(true);showSlide();await savePost(false);note("Fotografía añadida al borrador.","success");}
    catch(error){note(error.message,"error");}finally{busy(false);quality();}
  });
  $("ig-photo-remove").addEventListener("click",function(){selectedSlide().photo_url="";markEdited(true);showSlide();});
})();
