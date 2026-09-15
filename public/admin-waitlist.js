(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";

  const tabs = document.querySelector(".admin-view-tabs");
  const todayView = document.querySelector("#today-view");
  const weekView = document.querySelector("#week-view");
  const patientsView = document.querySelector("#patients-view");
  if (!tabs || !todayView || !weekView || !patientsView) return;

  const waitButton = document.createElement("button");
  waitButton.id = "view-waitlist";
  waitButton.type = "button";
  waitButton.textContent = "Espera";
  tabs.append(waitButton);

  const section = document.createElement("section");
  section.id = "waitlist-view";
  section.className = "admin-view";
  section.hidden = true;
  section.innerHTML = `
    <div class="waitlist-heading">
      <div><p class="admin-eyebrow">Huecos y disponibilidad</p><h2>Lista de espera</h2></div>
      <button id="waitlist-new" class="admin-primary" type="button">Añadir persona</button>
    </div>
    <div class="waitlist-match-panel">
      <div><strong>Buscar candidatos para un hueco</strong><p>Filtra por fecha, hora y servicio según las preferencias guardadas.</p></div>
      <label>Fecha<input id="waitlist-match-date" type="date"></label>
      <label>Hora<input id="waitlist-match-time" type="time" step="1800"></label>
      <label>Servicio<select id="waitlist-match-service"><option value="">Cualquiera</option><option value="psicologia_general_sanitaria">Psicología</option><option value="neuropsicologia">Neuropsicología</option></select></label>
      <button id="waitlist-clear-match" class="admin-secondary" type="button">Limpiar</button>
    </div>
    <div class="waitlist-filters">
      <select id="waitlist-status-filter" aria-label="Estado"><option value="active">Activas</option><option value="waiting">En espera</option><option value="offered">Hueco ofrecido</option><option value="paused">Pausadas</option><option value="booked">Citadas</option><option value="removed">Retiradas</option><option value="all">Todas</option></select>
      <select id="waitlist-service-filter" aria-label="Servicio"><option value="all">Todos los servicios</option><option value="psicologia_general_sanitaria">Psicología</option><option value="neuropsicologia">Neuropsicología</option></select>
      <input id="waitlist-search" type="search" placeholder="Buscar por nombre, correo o teléfono" autocomplete="off">
    </div>
    <p id="waitlist-status" class="admin-message" role="status"></p>
    <div id="waitlist-summary" class="waitlist-summary"></div>
    <div id="waitlist-list" class="waitlist-list"></div>`;
  patientsView.after(section);

  const dialog = document.createElement("dialog");
  dialog.id = "waitlist-dialog";
  dialog.className = "appointment-dialog";
  dialog.innerHTML = `
    <form id="waitlist-form">
      <input id="waitlist-id" type="hidden">
      <div class="dialog-heading"><div><p class="admin-eyebrow">Lista de espera</p><h2 id="waitlist-dialog-title">Añadir persona</h2></div><button id="waitlist-close" class="dialog-close" type="button" aria-label="Cerrar">×</button></div>
      <label>Nombre<input id="waitlist-name" type="text" maxlength="120" required></label>
      <div class="form-grid two-cols"><label>Correo<input id="waitlist-email" type="email" maxlength="254"></label><label>Teléfono<input id="waitlist-phone" type="tel" maxlength="30"></label></div>
      <div class="form-grid two-cols"><label>Servicio<select id="waitlist-service"><option value="psicologia_general_sanitaria">Psicología General Sanitaria</option><option value="neuropsicologia">Neuropsicología</option></select></label><label>Prioridad<select id="waitlist-priority"><option value="1">Alta</option><option value="2" selected>Normal</option><option value="3">Baja</option></select></label></div>
      <fieldset class="waitlist-days"><legend>Días preferidos</legend><div><label><input type="checkbox" value="1">Lun</label><label><input type="checkbox" value="2">Mar</label><label><input type="checkbox" value="3">Mié</label><label><input type="checkbox" value="4">Jue</label><label><input type="checkbox" value="5">Vie</label><label><input type="checkbox" value="6">Sáb</label><label><input type="checkbox" value="7">Dom</label></div><small>Si no marcas ninguno, se considerará cualquier día.</small></fieldset>
      <div class="form-grid two-cols"><label>Desde<input id="waitlist-time-start" type="time" step="1800"></label><label>Hasta<input id="waitlist-time-end" type="time" step="1800"></label></div>
      <label>Notas administrativas<textarea id="waitlist-notes" rows="3" maxlength="600" placeholder="Por ejemplo: disponibilidad flexible, prefiere mañanas…"></textarea></label>
      <p class="admin-note">Guarda solo información necesaria para gestionar disponibilidad. No añadas notas clínicas en la lista de espera.</p>
      <p id="waitlist-form-message" class="admin-message" role="status"></p>
      <div class="dialog-actions"><button id="waitlist-cancel" class="admin-secondary" type="button">Cancelar</button><button class="admin-primary" type="submit">Guardar</button></div>
    </form>`;
  document.body.append(dialog);

  const style = document.createElement("style");
  style.textContent = `
    .waitlist-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;padding:22px;border:1px solid rgba(45,50,47,.14);border-radius:16px;background:#fffdf9}.waitlist-heading h2{margin:0;font-family:Newsreader,Georgia,serif;font-size:1.8rem;font-weight:500}.waitlist-match-panel{display:grid;grid-template-columns:minmax(220px,1.5fr) repeat(3,minmax(130px,.65fr)) auto;gap:10px;align-items:end;margin:14px 0;padding:16px;border:1px solid #9EDCE7;border-radius:14px;background:#EAF6F8}.waitlist-match-panel p{margin:4px 0 0;color:#52615a;font-size:.78rem}.waitlist-match-panel label,.waitlist-filters{font-size:.8rem;font-weight:700}.waitlist-match-panel input,.waitlist-match-panel select,.waitlist-filters input,.waitlist-filters select{width:100%;min-height:42px;padding:9px 11px;border:1px solid #c9dfe4;border-radius:10px;background:#fffdf9;font:inherit}.waitlist-filters{display:grid;grid-template-columns:180px 220px 1fr;gap:10px;margin:14px 0}.waitlist-summary{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 14px}.waitlist-summary span{padding:6px 10px;border-radius:999px;background:#EAF6F8;color:#075A68;font-size:.76rem;font-weight:700}.waitlist-list{display:grid;gap:10px}.waitlist-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px 18px;padding:17px 18px;border:1px solid rgba(45,50,47,.14);border-left:4px solid #11A6C2;border-radius:14px;background:#fffdf9}.waitlist-card.priority-1{border-left-color:#9b3516}.waitlist-card.priority-3{border-left-color:#9aa7ae}.waitlist-card.is-paused,.waitlist-card.is-removed,.waitlist-card.is-booked{opacity:.62}.waitlist-main h3{margin:0 0 5px;font-size:1rem}.waitlist-meta{display:flex;gap:8px;flex-wrap:wrap;color:#667983;font-size:.78rem}.waitlist-notes{grid-column:1/-1;margin:0;color:#625b54;font-size:.8rem;line-height:1.5}.waitlist-actions{display:flex;align-items:center;justify-content:flex-end;gap:7px;flex-wrap:wrap}.waitlist-actions button{min-height:34px;padding:6px 10px;border-radius:999px;font:inherit;font-size:.74rem;font-weight:700;cursor:pointer}.waitlist-chip{padding:5px 8px;border-radius:999px;background:#f2f5f6;color:#52615a;font-size:.7rem;font-weight:700}.waitlist-chip.match{background:#dff5ea;color:#23613a}.waitlist-empty{padding:38px;border:1px dashed #d8ccbc;border-radius:15px;background:#fffdf9;color:#7b7167;text-align:center}.waitlist-days{margin:16px 0 0;padding:12px;border:1px solid #d8ccbc;border-radius:11px}.waitlist-days legend{padding:0 5px;font-size:.84rem;font-weight:700}.waitlist-days>div{display:flex;gap:7px;flex-wrap:wrap}.waitlist-days label{display:flex;align-items:center;gap:5px;margin:0;padding:7px 9px;border:1px solid #d8ccbc;border-radius:999px;font-size:.76rem}.waitlist-days small{display:block;margin-top:8px;color:#7b7167}.waitlist-dialog textarea{width:100%;padding:10px 12px;border:1px solid #d8ccbc;border-radius:10px;background:#fffdf9;font:inherit;resize:vertical}@media(max-width:900px){.waitlist-match-panel{grid-template-columns:1fr 1fr}.waitlist-match-panel>div:first-child{grid-column:1/-1}.waitlist-filters{grid-template-columns:1fr 1fr}.waitlist-filters input{grid-column:1/-1}}@media(max-width:620px){.waitlist-heading{align-items:stretch;flex-direction:column;padding:18px}.waitlist-heading button{width:100%}.waitlist-match-panel,.waitlist-filters{grid-template-columns:1fr}.waitlist-match-panel>div:first-child,.waitlist-filters input{grid-column:auto}.waitlist-card{grid-template-columns:1fr}.waitlist-actions{justify-content:flex-start}.waitlist-notes{grid-column:1}}
  `;
  document.head.append(style);

  const list = section.querySelector("#waitlist-list");
  const summary = section.querySelector("#waitlist-summary");
  const statusEl = section.querySelector("#waitlist-status");
  const statusFilter = section.querySelector("#waitlist-status-filter");
  const serviceFilter = section.querySelector("#waitlist-service-filter");
  const searchInput = section.querySelector("#waitlist-search");
  const matchDate = section.querySelector("#waitlist-match-date");
  const matchTime = section.querySelector("#waitlist-match-time");
  const matchService = section.querySelector("#waitlist-match-service");
  const form = dialog.querySelector("#waitlist-form");
  let rows = [];

  const dayNames = {1:"Lun",2:"Mar",3:"Mié",4:"Jue",5:"Vie",6:"Sáb",7:"Dom"};
  const statusNames = {waiting:"En espera",offered:"Hueco ofrecido",booked:"Citada",paused:"Pausada",removed:"Retirada"};
  const serviceNames = {psicologia_general_sanitaria:"Psicología",neuropsicologia:"Neuropsicología"};
  const priorityNames = {1:"Alta",2:"Normal",3:"Baja"};

  function getSession(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");}catch{return null;}}
  function headers(extra={}){return {apikey:KEY,Authorization:`Bearer ${getSession()?.access_token||""}`,"Content-Type":"application/json",...extra};}
  function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
  function setMessage(text){statusEl.textContent=text||"";}
  function weekday(date){if(!date)return null;const d=new Date(`${date}T12:00:00Z`).getUTCDay();return d===0?7:d;}
  function timeFits(row,time){if(!time)return true;const t=time.slice(0,5);const s=row.preferred_time_start?.slice(0,5);const e=row.preferred_time_end?.slice(0,5);if(s&&t<s)return false;if(e&&t>e)return false;return true;}
  function matchesSlot(row){
    const d=matchDate.value; const t=matchTime.value; const service=matchService.value;
    if(service && row.service_code!==service)return false;
    if(d){const wd=weekday(d); if(Array.isArray(row.preferred_days)&&row.preferred_days.length&&!row.preferred_days.includes(wd))return false;}
    return timeFits(row,t);
  }
  function filteredRows(){
    const sf=statusFilter.value; const sv=serviceFilter.value; const q=searchInput.value.trim().toLowerCase();
    return rows.filter(r=>{
      if(sf==="active"&&!['waiting','offered'].includes(r.status))return false;
      if(!['active','all'].includes(sf)&&r.status!==sf)return false;
      if(sv!=="all"&&r.service_code!==sv)return false;
      if(q&&!`${r.patient_name||""} ${r.patient_email||""} ${r.patient_phone||""}`.toLowerCase().includes(q))return false;
      if((matchDate.value||matchTime.value||matchService.value)&&!matchesSlot(r))return false;
      return true;
    }).sort((a,b)=>(a.priority-b.priority)||new Date(a.created_at)-new Date(b.created_at));
  }

  async function load(){
    setMessage("Cargando lista de espera…");
    const select="id,patient_name,patient_email,patient_phone,service_code,preferred_days,preferred_time_start,preferred_time_end,priority,notes,status,last_offered_at,booked_appointment_id,created_at,updated_at";
    try{
      const res=await fetch(`${REST_URL}/appointment_waitlist?select=${encodeURIComponent(select)}&order=priority.asc,created_at.asc`,{headers:headers(),cache:"no-store"});
      const body=await res.json().catch(()=>[]);
      if(!res.ok)throw new Error(body?.message||"No se ha podido cargar la lista de espera.");
      rows=body||[]; render(); setMessage("");
    }catch(error){setMessage(error instanceof Error?error.message:"No se ha podido cargar la lista de espera.");}
  }

  function render(){
    const shown=filteredRows();
    const active=rows.filter(r=>['waiting','offered'].includes(r.status)).length;
    const waiting=rows.filter(r=>r.status==='waiting').length;
    const offered=rows.filter(r=>r.status==='offered').length;
    summary.innerHTML=`<span>${active} activas</span><span>${waiting} en espera</span><span>${offered} con hueco ofrecido</span>${(matchDate.value||matchTime.value||matchService.value)?`<span>${shown.length} compatibles</span>`:""}`;
    list.replaceChildren();
    if(!shown.length){const empty=document.createElement("div");empty.className="waitlist-empty";empty.textContent=(matchDate.value||matchTime.value||matchService.value)?"No hay personas que encajen con ese hueco.":"No hay personas en esta vista de la lista de espera.";list.append(empty);return;}
    shown.forEach(row=>{
      const card=document.createElement("article");
      card.className=`waitlist-card priority-${row.priority}${['paused','removed','booked'].includes(row.status)?` is-${row.status}`:""}`;
      const days=row.preferred_days?.length?row.preferred_days.map(d=>dayNames[d]).join(", "):"Cualquier día";
      const times=row.preferred_time_start||row.preferred_time_end?`${row.preferred_time_start?.slice(0,5)||"—"}–${row.preferred_time_end?.slice(0,5)||"—"}`:"Cualquier hora";
      const slotMatch=(matchDate.value||matchTime.value||matchService.value)&&matchesSlot(row);
      card.innerHTML=`<div class="waitlist-main"><h3>${esc(row.patient_name)}</h3><div class="waitlist-meta"><span>${esc(serviceNames[row.service_code]||row.service_code)}</span><span>Prioridad: ${esc(priorityNames[row.priority])}</span><span>${esc(days)}</span><span>${esc(times)}</span><span>${esc(statusNames[row.status]||row.status)}</span>${slotMatch?'<span class="waitlist-chip match">Compatible</span>':''}</div></div><div class="waitlist-actions"></div>${row.notes?`<p class="waitlist-notes">${esc(row.notes)}</p>`:""}`;
      const actions=card.querySelector(".waitlist-actions");
      if(['waiting','offered'].includes(row.status)){
        actions.append(actionButton("Crear cita","admin-primary",()=>createAppointment(row)));
        actions.append(actionButton("Editar","admin-secondary",()=>openEdit(row)));
        actions.append(actionButton(row.status==='offered'?"Volver a espera":"Marcar ofrecido","admin-secondary",()=>updateStatus(row,row.status==='offered'?"waiting":"offered")));
        actions.append(actionButton("Pausar","admin-secondary",()=>updateStatus(row,"paused")));
        actions.append(actionButton("Citada","admin-secondary",()=>updateStatus(row,"booked")));
      } else if(row.status==='paused'){
        actions.append(actionButton("Reactivar","admin-secondary",()=>updateStatus(row,"waiting")));
        actions.append(actionButton("Editar","admin-secondary",()=>openEdit(row)));
      } else if(row.status==='booked'){
        actions.append(actionButton("Volver a espera","admin-secondary",()=>updateStatus(row,"waiting")));
      }
      if(row.status!=="removed") actions.append(actionButton("Retirar","admin-text",()=>updateStatus(row,"removed",true)));
      list.append(card);
    });
  }

  function actionButton(label,cls,fn){const b=document.createElement("button");b.type="button";b.className=cls;b.textContent=label;b.addEventListener("click",fn);return b;}

  function resetForm(){
    form.reset(); dialog.querySelector("#waitlist-id").value=""; dialog.querySelector("#waitlist-priority").value="2"; dialog.querySelector("#waitlist-service").value="psicologia_general_sanitaria"; dialog.querySelector("#waitlist-dialog-title").textContent="Añadir persona"; dialog.querySelector("#waitlist-form-message").textContent="";
  }
  function openNew(){resetForm();dialog.showModal();}
  function openEdit(row){
    resetForm(); dialog.querySelector("#waitlist-id").value=row.id; dialog.querySelector("#waitlist-name").value=row.patient_name||""; dialog.querySelector("#waitlist-email").value=row.patient_email||""; dialog.querySelector("#waitlist-phone").value=row.patient_phone||""; dialog.querySelector("#waitlist-service").value=row.service_code||"psicologia_general_sanitaria"; dialog.querySelector("#waitlist-priority").value=String(row.priority||2); dialog.querySelector("#waitlist-time-start").value=row.preferred_time_start?.slice(0,5)||""; dialog.querySelector("#waitlist-time-end").value=row.preferred_time_end?.slice(0,5)||""; dialog.querySelector("#waitlist-notes").value=row.notes||""; dialog.querySelectorAll('.waitlist-days input[type="checkbox"]').forEach(c=>{c.checked=(row.preferred_days||[]).includes(Number(c.value));}); dialog.querySelector("#waitlist-dialog-title").textContent="Editar espera"; dialog.showModal();
  }

  form.addEventListener("submit",async e=>{
    e.preventDefault(); const msg=dialog.querySelector("#waitlist-form-message");
    const id=dialog.querySelector("#waitlist-id").value; const name=dialog.querySelector("#waitlist-name").value.trim(); if(!name){msg.textContent="Escribe el nombre.";return;}
    const days=[...dialog.querySelectorAll('.waitlist-days input[type="checkbox"]:checked')].map(c=>Number(c.value));
    const payload={patient_name:name,patient_email:dialog.querySelector("#waitlist-email").value.trim()||null,patient_phone:dialog.querySelector("#waitlist-phone").value.trim()||null,service_code:dialog.querySelector("#waitlist-service").value,priority:Number(dialog.querySelector("#waitlist-priority").value||2),preferred_days:days,preferred_time_start:dialog.querySelector("#waitlist-time-start").value||null,preferred_time_end:dialog.querySelector("#waitlist-time-end").value||null,notes:dialog.querySelector("#waitlist-notes").value.trim()||null};
    if(payload.preferred_time_start&&payload.preferred_time_end&&payload.preferred_time_start>payload.preferred_time_end){msg.textContent="La hora inicial no puede ser posterior a la final.";return;}
    msg.textContent="Guardando…";
    try{
      const url=id?`${REST_URL}/appointment_waitlist?id=eq.${encodeURIComponent(id)}`:`${REST_URL}/appointment_waitlist`;
      const res=await fetch(url,{method:id?"PATCH":"POST",headers:headers({Prefer:"return=minimal"}),body:JSON.stringify(payload)});
      const body=await res.json().catch(()=>null); if(!res.ok)throw new Error(body?.message||"No se ha podido guardar.");
      dialog.close(); await load();
    }catch(error){msg.textContent=error instanceof Error?error.message:"No se ha podido guardar.";}
  });

  async function updateStatus(row,newStatus,confirmRemove=false){
    if(confirmRemove&&!window.confirm(`Retirar a ${row.patient_name} de la lista de espera?`))return;
    const payload={status:newStatus,last_offered_at:newStatus==='offered'?new Date().toISOString():row.last_offered_at};
    try{
      const res=await fetch(`${REST_URL}/appointment_waitlist?id=eq.${encodeURIComponent(row.id)}`,{method:"PATCH",headers:headers({Prefer:"return=minimal"}),body:JSON.stringify(payload)});
      const body=await res.json().catch(()=>null); if(!res.ok)throw new Error(body?.message||"No se ha podido actualizar."); await load();
    }catch(error){setMessage(error instanceof Error?error.message:"No se ha podido actualizar.");}
  }

  async function createAppointment(row){
    try{await updateStatus(row,"offered");}catch{}
    document.querySelector("#admin-new")?.click();
    setTimeout(()=>{
      const set=(sel,val)=>{const el=document.querySelector(sel);if(el)el.value=val??"";};
      set("#appointment-name",row.patient_name);set("#appointment-email",row.patient_email||"");set("#appointment-phone",row.patient_phone||"");set("#appointment-service",row.service_code||"psicologia_general_sanitaria");set("#appointment-patient-type","existing");set("#appointment-price","60");
    },40);
  }

  function showView(){
    [todayView,weekView,patientsView,document.querySelector("#month-view")].filter(Boolean).forEach(v=>v.hidden=true);
    section.hidden=false; tabs.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b===waitButton)); load();
  }
  waitButton.addEventListener("click",showView);
  tabs.querySelectorAll("button:not(#view-waitlist)").forEach(b=>b.addEventListener("click",()=>{section.hidden=true;waitButton.classList.remove("active");}));
  section.querySelector("#waitlist-new").addEventListener("click",openNew);
  dialog.querySelector("#waitlist-close").addEventListener("click",()=>dialog.close());
  dialog.querySelector("#waitlist-cancel").addEventListener("click",()=>dialog.close());
  [statusFilter,serviceFilter,searchInput,matchDate,matchTime,matchService].forEach(el=>el.addEventListener(el===searchInput?"input":"change",render));
  section.querySelector("#waitlist-clear-match").addEventListener("click",()=>{matchDate.value="";matchTime.value="";matchService.value="";render();});
})();