(() => {
  "use strict";

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
        <label>Prioridad<select id="clinic-goal-priority"><option value="high">Alta</option><option value="normal" selected>Normal</option><option value="low">Baja</option></select></label>
        <label>Estado<select id="clinic-goal-status"><option value="active">Activo</option><option value="review">En revisión</option><option value="paused">Pausado</option><option value="completed">Conseguido / cerrado</option></select></label>
      </div>
      <p class="clinic-note">Los objetivos son una guía de trabajo y pueden revisarse o reformularse. El cambio de estado queda fechado automáticamente.</p>
      <p id="clinic-goal-message" class="clinic-message" role="status"></p>
      <div class="clinic-dialog-actions">
        <button id="clinic-goal-cancel" class="clinic-secondary" type="button">Cancelar</button>
        <button class="clinic-primary" type="submit">Guardar objetivo</button>
      </div>
    </form>`;
  document.body.append(dialog);

  const style = document.createElement("style");
  style.textContent = `
    .clinic-goals-manager{margin:18px 0;padding:18px;border:1px solid #CFE9EE;border-radius:15px;background:#fff}
    .clinic-goals-manager-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:12px}
    .clinic-goals-manager-heading h3{margin:0;font-family:Newsreader,Georgia,serif;font-size:1.35rem;font-weight:500}
    .clinic-goals-manager-list{display:grid;gap:9px}
    .clinic-goal-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px 14px;align-items:center;padding:12px 13px;border:1px solid #DDECEF;border-radius:12px;background:#FDFEFE}
    .clinic-goal-row.is-completed{opacity:.72}.clinic-goal-row.is-paused{opacity:.72}
    .clinic-goal-main{min-width:0}.clinic-goal-main strong{display:block;color:#24343d;font-size:.9rem;overflow-wrap:anywhere}
    .clinic-goal-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:6px}
    .clinic-goal-chip{padding:4px 7px;border-radius:999px;background:#EAF6F8;color:#075A68;font-size:.68rem;font-weight:750}
    .clinic-goal-chip.priority-high{background:#fff0ea;color:#9b3516}.clinic-goal-chip.priority-low{background:#f1f3f4;color:#667983}.clinic-goal-chip.status-completed{background:#e7f4eb;color:#23613a}.clinic-goal-chip.status-paused{background:#f2f2f2;color:#667983}.clinic-goal-chip.status-review{background:#fff1cf;color:#745800}
    .clinic-goal-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.clinic-goal-actions button{min-height:34px;padding:6px 10px;font-size:.74rem}
    .clinic-goal-empty{padding:18px;border:1px dashed #CFE9EE;border-radius:11px;color:#667983;text-align:center;font-size:.82rem}
    @media(max-width:620px){.clinic-goals-manager-heading{align-items:stretch;flex-direction:column}.clinic-goals-manager-heading button{width:100%}.clinic-goal-row{grid-template-columns:1fr}.clinic-goal-actions{justify-content:flex-start}.clinic-goal-actions button{flex:1}}
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

  const statusLabels = { active:"Activo", review:"En revisión", paused:"Pausado", completed:"Conseguido" };
  const priorityLabels = { high:"Alta", normal:"Normal", low:"Baja" };

  function getSession(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");}catch{return null;}}
  function headers(extra={}){return {apikey:KEY,Authorization:`Bearer ${getSession()?.access_token||""}`,"Content-Type":"application/json",...extra};}
  function fmt(value){
    if(!value) return "";
    return new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"short",year:"numeric",timeZone:ZONE}).format(new Date(value));
  }
  function refreshDashboard(){ document.querySelector("#clinic-dashboard-refresh")?.click(); }

  async function load(){
    const patientId = patientIdField.value;
    if(!patientId || !patientDialog.open) return;
    statusText.textContent = "Cargando objetivos…";
    try{
      const res = await fetch(`${REST_URL}/clinical_goals?select=id,patient_id,title,status,priority,last_reviewed_at,created_at,updated_at&patient_id=eq.${encodeURIComponent(patientId)}&order=created_at.asc`,{headers:headers(),cache:"no-store"});
      const body = await res.json().catch(()=>[]);
      if(!res.ok) throw new Error(body?.message || "No se han podido cargar los objetivos.");
      rows = body || [];
      render();
      statusText.textContent = "";
    }catch(error){statusText.textContent = error instanceof Error ? error.message : "No se han podido cargar los objetivos.";}
  }

  function render(){
    list.replaceChildren();
    if(!rows.length){
      const empty=document.createElement("div"); empty.className="clinic-goal-empty"; empty.textContent="Todavía no hay objetivos terapéuticos registrados."; list.append(empty); return;
    }
    const order={active:0,review:1,paused:2,completed:3};
    [...rows].sort((a,b)=>(order[a.status]??9)-(order[b.status]??9) || new Date(a.created_at)-new Date(b.created_at)).forEach(row=>{
      const article=document.createElement("article");
      article.className=`clinic-goal-row is-${row.status || "active"}`;
      const main=document.createElement("div"); main.className="clinic-goal-main";
      const strong=document.createElement("strong"); strong.textContent=row.title;
      const meta=document.createElement("div"); meta.className="clinic-goal-meta";
      const p=document.createElement("span"); p.className=`clinic-goal-chip priority-${row.priority || "normal"}`; p.textContent=`Prioridad ${priorityLabels[row.priority] || "Normal"}`;
      const s=document.createElement("span"); s.className=`clinic-goal-chip status-${row.status || "active"}`; s.textContent=statusLabels[row.status] || row.status;
      meta.append(p,s);
      if(row.last_reviewed_at){const r=document.createElement("span");r.className="clinic-goal-chip";r.textContent=`Revisado ${fmt(row.last_reviewed_at)}`;meta.append(r);}
      main.append(strong,meta);
      const actions=document.createElement("div"); actions.className="clinic-goal-actions";
      const edit=document.createElement("button"); edit.type="button"; edit.className="clinic-secondary"; edit.textContent="Editar"; edit.addEventListener("click",()=>openEdit(row));
      actions.append(edit);
      if(["active","review"].includes(row.status)){
        const reviewed=document.createElement("button"); reviewed.type="button"; reviewed.className="clinic-text"; reviewed.textContent="Marcar revisado"; reviewed.addEventListener("click",()=>markReviewed(row)); actions.append(reviewed);
      }
      article.append(main,actions); list.append(article);
    });
  }

  function openNew(){
    goalId.value=""; goalTitle.value=""; goalPriority.value="normal"; goalStatus.value="active"; goalMessage.textContent=""; dialogTitle.textContent="Nuevo objetivo"; dialog.showModal(); goalTitle.focus();
  }
  function openEdit(row){
    goalId.value=row.id; goalTitle.value=row.title || ""; goalPriority.value=row.priority || "normal"; goalStatus.value=row.status || "active"; goalMessage.textContent=""; dialogTitle.textContent="Editar objetivo"; dialog.showModal();
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

  newButton.addEventListener("click",openNew);
  dialog.querySelector("#clinic-goal-close").addEventListener("click",()=>dialog.close());
  dialog.querySelector("#clinic-goal-cancel").addEventListener("click",()=>dialog.close());

  const observer=new MutationObserver(()=>{if(patientDialog.open&&patientIdField.value)setTimeout(load,80);});
  observer.observe(patientDialog,{attributes:true,attributeFilter:["open"]});
})();