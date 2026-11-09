(() => {
  "use strict";
  // v2 deployment marker

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const ZONE = "Europe/Madrid";

  const patientDialog = document.querySelector("#clinic-patient-dialog");
  const patientIdField = document.querySelector("#clinic-patient-id");
  const preparation = document.querySelector(".clinic-preparation");
  if (!patientDialog || !patientIdField || !preparation) return;

  const section = document.createElement("section");
  section.className = "clinic-goals-manager";
  section.innerHTML = `
    <div class="clinic-goals-manager-heading">
      <div><p class="clinic-eyebrow">Plan terapéutico</p><h3>Objetivos terapéuticos</h3></div>
      <button id="clinic-goal-new" class="clinic-secondary" type="button">Nuevo objetivo</button>
    </div>
    <p id="clinic-goals-manager-status" class="clinic-message" role="status"></p>
    <div id="clinic-goals-manager-list" class="clinic-goals-manager-list"></div>`;
  preparation.after(section);

  const dialog = document.createElement("dialog");
  dialog.id = "clinic-goal-dialog";
  dialog.className = "clinic-dialog clinic-small-dialog";
  dialog.innerHTML = `
    <form id="clinic-goal-form" class="clinic-dialog-content">
      <input id="clinic-goal-id" type="hidden">
      <div class="clinic-dialog-heading">
        <div><p class="clinic-eyebrow">Objetivo terapéutico</p><h2 id="clinic-goal-dialog-title">Nuevo objetivo</h2></div>
        <button id="clinic-goal-close" class="clinic-close" type="button" aria-label="Cerrar">×</button>
      </div>
      <label>Título del objetivo<input id="clinic-goal-title" type="text" maxlength="220" required placeholder="Ej. Reducir evitación en situaciones sociales"></label>
      <div class="clinic-form-grid">
        <label>Prioridad<select id="clinic-goal-priority"><option value="current" selected>Actual</option><option value="secondary">Secundaria</option><option value="observation">En observación</option></select></label>
        <label>Estado<select id="clinic-goal-status"><option value="active">Activo</option><option value="review">En revisión</option><option value="paused">Pausado</option><option value="achieved">Conseguido</option><option value="closed">Cerrado</option></select></label>
      </div>
      <p class="clinic-note">Los objetivos son una guía de trabajo y pueden revisarse o reformularse. El cambio de estado queda fechado automáticamente.</p>
      <p id="clinic-goal-message" class="clinic-message" role="status"></p>
      <div class="clinic-dialog-actions">
        <button id="clinic-goal-cancel" class="clinic-secondary" type="button">Cancelar</button>
        <button class="clinic-primary" type="submit">Guardar objetivo</button>
      </div>
    </form>`;
  document.body.append(dialog);

  // Sharing is opt-in and uses a distinct patient-facing copy of each goal.
  const shareDialog = document.createElement("dialog");
  shareDialog.id = "clinic-goal-share-dialog";
  shareDialog.className = "clinic-dialog clinic-small-dialog";
  shareDialog.innerHTML = `
    <form id="clinic-goal-share-form" class="clinic-dialog-content">
      <div class="clinic-dialog-heading">
        <div><p class="clinic-eyebrow">Entre Sesiones</p><h2>Compartir objetivo con el paciente</h2></div>
        <button id="clinic-goal-share-close" type="button" class="clinic-close" aria-label="Cerrar">×</button>
      </div>
      <p class="clinic-note">Solo se compartirá el título y la explicación que escribas aquí. Nunca se enviarán notas clínicas, formulación ni diagnóstico. Puedes retirar el acceso posteriormente.</p>
      <label>Título para el paciente<input id="clinic-goal-share-title" type="text" maxlength="220" required></label>
      <label>Explicación para el paciente<textarea id="clinic-goal-share-description" rows="4" maxlength="2000" placeholder="Qué vamos a trabajar y con qué finalidad, en lenguaje comprensible."></textarea></label>
      <p class="clinic-message" id="clinic-goal-share-message" role="status"></p>
      <div class="clinic-dialog-actions">
        <button id="clinic-goal-share-cancel" class="clinic-secondary" type="button">Cancelar</button>
        <button class="clinic-primary" type="submit">Publicar en Entre Sesiones</button>
      </div>
    </form>`;
  document.body.append(shareDialog);

  const style = document.createElement("style");
  style.textContent = `
    .clinic-goals-manager{margin:18px 0;padding:18px;border:1px solid var(--admin-line);border-radius:15px;background:#fff}
    .clinic-goals-manager-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:12px}
    .clinic-goals-manager-heading h3{margin:0;font-family:Newsreader,Georgia,serif;font-size:1.35rem;font-weight:500}
    .clinic-goals-manager-list{display:grid;gap:9px}
    .clinic-goal-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px 14px;align-items:center;padding:12px 13px;border:1px solid var(--admin-soft);border-radius:12px;background:#ffffff}
    .clinic-goal-row.is-completed{opacity:.72}.clinic-goal-row.is-paused{opacity:.72}
    .clinic-goal-main{min-width:0}.clinic-goal-main strong{display:block;color:var(--admin-text);font-size:.9rem;overflow-wrap:anywhere}
    .clinic-goal-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:6px}
    .clinic-goal-chip{padding:4px 7px;border-radius:999px;background:var(--admin-soft);color:var(--admin-action);font-size:.68rem;font-weight:750}
    .clinic-goal-chip.priority-high{background:#fff0ea;color:#9b3516}.clinic-goal-chip.priority-low{background:var(--admin-soft);color:var(--admin-muted)}.clinic-goal-chip.status-completed{background:#edf6ea;color:#2d6658}.clinic-goal-chip.status-paused{background:#f2f2f2;color:var(--admin-muted)}.clinic-goal-chip.status-review{background:#fcf8e6;color:#665619}
    .clinic-goal-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.clinic-goal-actions button{min-height:34px;padding:6px 10px;font-size:.74rem}
    .clinic-goal-empty{padding:18px;border:1px dashed var(--admin-line);border-radius:11px;color:var(--admin-muted);text-align:center;font-size:.82rem}
    @media(max-width:620px){.clinic-goals-manager-heading{align-items:stretch;flex-direction:column}.clinic-goals-manager-heading button{width:100%}.clinic-goal-row{grid-template-columns:1fr}.clinic-goal-actions{justify-content:flex-start}.clinic-goal-actions button{flex:1}}
  `;
  style.textContent += `
    .clinic-goal-publication{font-size:.7rem;color:var(--admin-muted);margin-top:6px}
    .clinic-goal-actions .clinic-goal-share{border-color:var(--admin-line)}
    #clinic-goal-share-description{min-height:95px}
  `;
  document.head.append(style);

  const list = section.querySelector("#clinic-goals-manager-list");
  const statusText = section.querySelector("#clinic-goals-manager-status");
  const newButton = section.querySelector("#clinic-goal-new");
  const form = dialog.querySelector("#clinic-goal-form");
  const goalId = dialog.querySelector("#clinic-goal-id");
  const goalTitle = dialog.querySelector("#clinic-goal-title");
  const goalPriority = dialog.querySelector("#clinic-goal-priority");
  const goalStatus = dialog.querySelector("#clinic-goal-status");
  const goalMessage = dialog.querySelector("#clinic-goal-message");
  const dialogTitle = dialog.querySelector("#clinic-goal-dialog-title");
  let rows = [];
  let publications = new Map();
  let publishingAvailable = false;
  let selectedGoalId = "";
  let loadedPatientId = "";
  const shareForm = shareDialog.querySelector("#clinic-goal-share-form");
  const shareTitle = shareDialog.querySelector("#clinic-goal-share-title");
  const shareDescription = shareDialog.querySelector("#clinic-goal-share-description");
  const shareMessage = shareDialog.querySelector("#clinic-goal-share-message");

  const statusLabels = { active:"Activo", review:"En revisión", paused:"Pausado", achieved:"Conseguido", closed:"Cerrado" };
  const priorityLabels = { current:"Actual", secondary:"Secundaria", observation:"En observación" };

  function getSession(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");}catch{return null;}}
  function headers(extra={}){return {apikey:KEY,Authorization:`Bearer ${getSession()?.access_token||""}`,"Content-Type":"application/json",...extra};}
  function fmt(value){
    if(!value) return "";
    return new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"short",year:"numeric",timeZone:ZONE}).format(new Date(value));
  }
  function refreshDashboard(){ document.querySelector("#clinic-dashboard-refresh")?.click(); }

  async function load(){
    const patientId = patientIdField.value;
    if(!patientId || !!patientDialog.hidden) return;
    statusText.textContent = "Cargando objetivos…";
    publishingAvailable = false;
    publications = new Map();
    loadedPatientId = "";
    try{
      const res = await fetch(`${REST_URL}/clinical_goals?select=id,patient_id,title,status,priority,last_reviewed_at,created_at,updated_at&patient_id=eq.${encodeURIComponent(patientId)}&order=created_at.asc`,{headers:headers(),cache:"no-store"});
      const body = await res.json().catch(()=>[]);
      if(!res.ok) throw new Error(body?.message || "No se han podido cargar los objetivos.");
      if (patientIdField.value !== patientId || patientDialog.hidden) return;
      rows = Array.isArray(body) ? body : [];
      loadedPatientId = patientId;
      // Fail closed: a missing publication table or network error never implies "unshared".
      try {
        const sharingResponse = await fetch(
          `${REST_URL}/clinical_goal_publications?select=goal_id,patient_id,display_title,description,published_at,revoked_at&patient_id=eq.${encodeURIComponent(patientId)}&limit=500`,
          { headers: headers(), cache:"no-store" },
        );
        if (!sharingResponse.ok) throw new Error("No se ha podido consultar qué objetivos están compartidos.");
        const publishedRows = await sharingResponse.json();
        if (!Array.isArray(publishedRows)) throw new Error("Respuesta de compartición no válida.");
        if (patientIdField.value !== patientId || patientDialog.hidden) return;
        publications = new Map(publishedRows.map(item => [item.goal_id, item]));
        publishingAvailable = true;
        statusText.textContent = "";
      } catch {
        statusText.textContent = "Los objetivos clínicos están disponibles, pero no se puede verificar su publicación para el paciente. La compartición está desactivada.";
      }
      render();
    }catch(error){statusText.textContent = error instanceof Error ? error.message : "No se han podido cargar los objetivos.";}
  }

  function render(){
    list.replaceChildren();
    if(!rows.length){
      const empty=document.createElement("div"); empty.className="clinic-goal-empty"; empty.textContent="Todavía no hay objetivos terapéuticos registrados."; list.append(empty); return;
    }
    const order={active:0,review:1,paused:2,achieved:3,closed:4};
    [...rows].sort((a,b)=>(order[a.status]??9)-(order[b.status]??9) || new Date(a.created_at)-new Date(b.created_at)).forEach(row=>{
      const article=document.createElement("article");
      article.dataset.goalId=row.id;
      article.className=`clinic-goal-row is-${row.status || "active"}`;
      const main=document.createElement("div"); main.className="clinic-goal-main";
      const strong=document.createElement("strong"); strong.textContent=row.title;
      const meta=document.createElement("div"); meta.className="clinic-goal-meta";
      const p=document.createElement("span"); p.className=`clinic-goal-chip priority-${row.priority || "current"}`; p.textContent=`Prioridad ${priorityLabels[row.priority] || "Actual"}`;
      const s=document.createElement("span"); s.className=`clinic-goal-chip status-${row.status || "active"}`; s.textContent=statusLabels[row.status] || row.status;
      meta.append(p,s);
      if(row.last_reviewed_at){const r=document.createElement("span");r.className="clinic-goal-chip";r.textContent=`Revisado ${fmt(row.last_reviewed_at)}`;meta.append(r);}
      const publication = publications.get(row.id);
      const isPublished = Boolean(publication?.published_at && !publication?.revoked_at);
      if (publishingAvailable) {
        const visibility = document.createElement("span");
        visibility.className = "clinic-goal-chip";
        visibility.textContent = isPublished ? "Visible en Entre Sesiones" : "Solo profesional";
        meta.append(visibility);
      }
      main.append(strong,meta);
      const actions=document.createElement("div"); actions.className="clinic-goal-actions";
      const edit=document.createElement("button"); edit.type="button"; edit.className="clinic-secondary"; edit.textContent="Editar"; edit.addEventListener("click",()=>openEdit(row));
      actions.append(edit);
      const shareButton = document.createElement("button");
      shareButton.type = "button";
      shareButton.className = "clinic-secondary clinic-goal-share";
      shareButton.textContent = isPublished ? "Editar lo compartido" : "Compartir con paciente";
      shareButton.disabled = !publishingAvailable;
      shareButton.addEventListener("click", () => openShare(row));
      actions.append(shareButton);
      if (isPublished) {
        const revoke = document.createElement("button");
        revoke.type = "button";
        revoke.className = "clinic-text";
        revoke.textContent = "Retirar acceso";
        revoke.addEventListener("click", () => revokeShare(row));
        actions.append(revoke);
      }
      if(["active","review"].includes(row.status)){
        const reviewed=document.createElement("button"); reviewed.type="button"; reviewed.className="clinic-text"; reviewed.textContent="Marcar revisado"; reviewed.addEventListener("click",()=>markReviewed(row)); actions.append(reviewed);
      }
      article.append(main,actions); list.append(article);
    });
  }

  function openNew(){
    goalId.value=""; goalTitle.value=""; goalPriority.value="current"; goalStatus.value="active"; goalMessage.textContent=""; dialogTitle.textContent="Nuevo objetivo"; dialog.showModal(); goalTitle.focus();
  }
  function openEdit(row){
    goalId.value=row.id; goalTitle.value=row.title || ""; goalPriority.value=row.priority || "current"; goalStatus.value=row.status || "active"; goalMessage.textContent=""; dialogTitle.textContent="Editar objetivo"; dialog.showModal();
  }

  async function markReviewed(row){
    try{
      const now=new Date().toISOString();
      const res=await fetch(`${REST_URL}/clinical_goals?id=eq.${encodeURIComponent(row.id)}&select=*`,{method:"PATCH",headers:headers({Prefer:"return=representation"}),body:JSON.stringify({last_reviewed_at:now,updated_at:now})});
      const body=await res.json().catch(()=>[]); if(!res.ok) throw new Error(body?.message || "No se ha podido registrar la revisión.");
      rows=rows.map(x=>x.id===row.id?(body?.[0]||{...x,last_reviewed_at:now,updated_at:now}):x); render(); refreshDashboard();
    }catch(error){statusText.textContent=error instanceof Error?error.message:"No se ha podido registrar la revisión.";}
  }

  form.addEventListener("submit",async(event)=>{
    event.preventDefault();
    const patientId=patientIdField.value; if(!patientId || !goalTitle.value.trim()) return;
    const now=new Date().toISOString();
    const payload={patient_id:patientId,title:goalTitle.value.trim(),priority:goalPriority.value,status:goalStatus.value,updated_at:now,last_reviewed_at:now};
    try{
      goalMessage.textContent="Guardando…";
      const editing=!!goalId.value;
      const url=editing?`${REST_URL}/clinical_goals?id=eq.${encodeURIComponent(goalId.value)}&select=*`:`${REST_URL}/clinical_goals?select=*`;
      const res=await fetch(url,{method:editing?"PATCH":"POST",headers:headers({Prefer:"return=representation"}),body:JSON.stringify(payload)});
      const body=await res.json().catch(()=>[]); if(!res.ok) throw new Error(body?.message || "No se ha podido guardar el objetivo.");
      const saved=body?.[0];
      if(saved){rows=editing?rows.map(x=>x.id===saved.id?saved:x):[...rows,saved];}
      dialog.close(); render(); refreshDashboard();
    }catch(error){goalMessage.textContent=error instanceof Error?error.message:"No se ha podido guardar el objetivo.";}
  });


  function openShare(row) {
    if (!publishingAvailable || !loadedPatientId || loadedPatientId !== patientIdField.value) return;
    const previous = publications.get(row.id);
    selectedGoalId = row.id;
    shareTitle.value = previous?.display_title || row.title || "";
    shareDescription.value = previous?.description || "";
    shareMessage.textContent = "";
    shareDialog.showModal();
    shareTitle.focus();
  }

  async function revokeShare(row) {
    if (!publishingAvailable || loadedPatientId !== patientIdField.value) return;
    if (!window.confirm("¿Retirar este objetivo de Entre Sesiones? Se conservará en el expediente clínico.")) return;
    const publication = publications.get(row.id);
    if (!publication || publication.revoked_at) return;
    const patientId = loadedPatientId;
    try {
      const result = await fetch(
        `${REST_URL}/clinical_goal_publications?goal_id=eq.${encodeURIComponent(row.id)}&patient_id=eq.${encodeURIComponent(patientId)}&revoked_at=is.null&select=goal_id,patient_id,display_title,description,published_at,revoked_at`,
        { method: "PATCH", headers: headers({ Prefer:"return=representation" }), body: JSON.stringify({ revoked_at:new Date().toISOString(), updated_at:new Date().toISOString() }) },
      );
      const data = await result.json().catch(() => []);
      if (!result.ok || !Array.isArray(data) || data.length !== 1) throw new Error("No se ha podido confirmar la retirada del acceso.");
      if (patientIdField.value !== patientId) return;
      publications.set(row.id, data[0]);
      render();
      statusText.textContent = "Objetivo retirado del espacio del paciente.";
    } catch (error) {
      statusText.textContent = error instanceof Error ? error.message : "No se ha podido retirar el acceso.";
    }
  }

  shareForm.addEventListener("submit", async event => {
    event.preventDefault();
    const goalIdToPublish = selectedGoalId;
    const patientId = loadedPatientId;
    if (!publishingAvailable || !goalIdToPublish || patientId !== patientIdField.value || !rows.some(x => x.id === goalIdToPublish)) return;
    const title = shareTitle.value.trim();
    const description = shareDescription.value.trim();
    if (!title || title.length > 220 || description.length > 2000) return;
    shareMessage.textContent = "Publicando…";
    const now = new Date().toISOString();
    try {
      const response = await fetch(`${REST_URL}/clinical_goal_publications?on_conflict=goal_id&select=goal_id,patient_id,display_title,description,published_at,revoked_at`, {
        method:"POST", headers:headers({ Prefer:"resolution=merge-duplicates,return=representation" }),
        body:JSON.stringify({ goal_id:goalIdToPublish, patient_id:patientId, display_title:title, description, published_at:now, revoked_at:null, updated_at:now }),
      });
      const data = await response.json().catch(() => []);
      if (!response.ok || !Array.isArray(data) || data.length !== 1) throw new Error("No se ha podido confirmar la publicación.");
      if (patientIdField.value !== patientId) return;
      publications.set(goalIdToPublish, data[0]);
      shareDialog.close();
      render();
      statusText.textContent = "Objetivo publicado. El paciente podrá verlo al actualizar Entre Sesiones.";
    } catch (error) {
      shareMessage.textContent = error instanceof Error ? error.message : "No se ha podido publicar el objetivo.";
    }
  });
  shareDialog.querySelector("#clinic-goal-share-close").addEventListener("click", () => shareDialog.close());
  shareDialog.querySelector("#clinic-goal-share-cancel").addEventListener("click", () => shareDialog.close());

  newButton.addEventListener("click",openNew);
  dialog.querySelector("#clinic-goal-close").addEventListener("click",()=>dialog.close());
  dialog.querySelector("#clinic-goal-cancel").addEventListener("click",()=>dialog.close());

  const observer=new MutationObserver(()=>{if(!patientDialog.hidden&&patientIdField.value)setTimeout(load,80);});
  observer.observe(patientDialog,{attributes:true,attributeFilter:["hidden"]});
})();