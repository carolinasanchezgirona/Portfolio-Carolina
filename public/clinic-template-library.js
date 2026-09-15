(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";

  const sessionDialog = document.querySelector("#clinic-session-dialog");
  const reportDialog = document.querySelector("#clinic-report-dialog");
  const patientDialog = document.querySelector("#clinic-patient-dialog");
  const exerciseHost = document.querySelector(".clinic-exercises-section .clinic-goals-heading");
  if (!sessionDialog || !reportDialog || !patientDialog) return;

  const style = document.createElement("style");
  style.textContent = `
    .clinic-template-toolbar{display:grid;grid-template-columns:minmax(180px,1fr) auto auto;gap:8px;align-items:end;margin:14px 0;padding:12px;border:1px solid #CFE9EE;border-radius:12px;background:#F7FCFD}.clinic-template-toolbar label{display:grid;gap:6px;margin:0;color:#24343d;font-size:.78rem;font-weight:700}.clinic-template-toolbar select{min-height:40px;padding:8px 10px;border:1px solid #9EDCE7;border-radius:10px;background:#fff;color:#24343d;font:inherit}.clinic-template-library-dialog{width:min(760px,calc(100% - 24px))}.clinic-template-list{display:grid;gap:9px;margin-top:14px}.clinic-template-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:12px;border:1px solid #DDECEF;border-radius:11px;background:#fff}.clinic-template-row p{margin:4px 0 0;color:#667983;font-size:.76rem;line-height:1.4}.clinic-template-actions{display:flex;gap:7px;flex-wrap:wrap}.clinic-template-actions button{min-height:34px;padding:6px 10px;font-size:.74rem}.clinic-template-empty{padding:20px;border:1px dashed #CFE9EE;border-radius:11px;color:#667983;text-align:center}.clinic-template-form-grid{display:grid;gap:12px;margin-top:12px}.clinic-template-form-grid label{display:grid;gap:6px;font-weight:700}.clinic-template-form-grid input,.clinic-template-form-grid select,.clinic-template-form-grid textarea{width:100%;padding:10px 12px;border:1px solid #9EDCE7;border-radius:10px;background:#fff;font:inherit}.clinic-template-hint{margin:8px 0 0;color:#667983;font-size:.76rem;line-height:1.45}@media(max-width:620px){.clinic-template-toolbar{grid-template-columns:1fr}.clinic-template-toolbar button{width:100%}.clinic-template-row{grid-template-columns:1fr}.clinic-template-actions button{flex:1}}
  `;
  document.head.append(style);

  function session(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");}catch{return null;}}
  function headers(extra={}){return {apikey:KEY,Authorization:`Bearer ${session()?.access_token||""}`,"Content-Type":"application/json",...extra};}
  async function api(path,options={}){const res=await fetch(`${REST_URL}/${path}`,{cache:"no-store",...options,headers:headers(options.headers||{})});const body=res.status===204?null:await res.json().catch(()=>null);if(!res.ok)throw new Error(body?.message||"No se ha podido completar la operación.");return body;}
  const val=id=>document.querySelector(id)?.value||"";
  const set=(id,value)=>{const el=document.querySelector(id);if(el)el.value=value??"";};

  let textTemplates=[];
  let exerciseTemplates=[];

  function createToolbar(type, targetDialog, anchorSelector){
    const anchor=targetDialog.querySelector(anchorSelector);
    if(!anchor)return null;
    const bar=document.createElement("div");bar.className="clinic-template-toolbar";bar.dataset.templateType=type;
    bar.innerHTML=`<label>Plantilla<select><option value="">Sin plantilla</option></select></label><button type="button" class="clinic-secondary" data-action="apply">Cargar plantilla</button><button type="button" class="clinic-secondary" data-action="save">Guardar actual como plantilla</button>`;
    anchor.after(bar);
    return bar;
  }

  const sessionToolbar=createToolbar("session",sessionDialog,".clinic-dialog-heading");
  const reportToolbar=createToolbar("report",reportDialog,".clinic-dialog-heading");

  const manager=document.createElement("dialog");
  manager.className="clinic-dialog clinic-template-library-dialog";
  manager.innerHTML=`<form class="clinic-dialog-content" method="dialog"><div class="clinic-dialog-heading"><div><p class="clinic-eyebrow">Biblioteca clínica</p><h2 id="clinic-template-manager-title">Plantillas</h2></div><button class="clinic-close" type="button" data-close aria-label="Cerrar">×</button></div><div id="clinic-template-manager-list" class="clinic-template-list"></div><div class="clinic-dialog-actions"><button class="clinic-secondary" type="button" data-close>Cerrar</button></div></form>`;
  document.body.append(manager);

  const editor=document.createElement("dialog");
  editor.className="clinic-dialog clinic-small-dialog";
  editor.innerHTML=`<form id="clinic-template-editor-form" class="clinic-dialog-content"><input id="clinic-template-editor-id" type="hidden"><input id="clinic-template-editor-kind" type="hidden"><div class="clinic-dialog-heading"><div><p class="clinic-eyebrow">Plantilla reutilizable</p><h2 id="clinic-template-editor-title">Nueva plantilla</h2></div><button class="clinic-close" type="button" data-close aria-label="Cerrar">×</button></div><div class="clinic-template-form-grid"><label>Nombre<input id="clinic-template-name" maxlength="120" required></label><label>Descripción<textarea id="clinic-template-description" rows="2" maxlength="300"></textarea></label><div id="clinic-template-extra-fields"></div></div><p class="clinic-template-hint">La plantilla sirve como punto de partida. Siempre podrás editar el contenido antes de guardar una sesión, un informe o un ejercicio.</p><p id="clinic-template-editor-message" class="clinic-message"></p><div class="clinic-dialog-actions"><button class="clinic-secondary" type="button" data-close>Cancelar</button><button class="clinic-primary" type="submit">Guardar plantilla</button></div></form>`;
  document.body.append(editor);

  function contentFor(type){
    if(type==="session") return {work_notes:val("#clinic-work-notes"),evolution_note:val("#clinic-evolution-note"),intervention_note:val("#clinic-intervention-note"),response_note:val("#clinic-response-note"),agreements_note:val("#clinic-agreements-note"),homework_note:val("#clinic-homework-note"),next_session_note:val("#clinic-next-session-note")};
    if(type==="report") return {report_type:val("#clinic-report-type"),context:val("#clinic-report-context"),evolution:val("#clinic-report-evolution"),interventions:val("#clinic-report-interventions"),current:val("#clinic-report-current")};
    return {};
  }
  function applyContent(type,c){
    const hasExisting=type==="session"?["#clinic-work-notes","#clinic-evolution-note","#clinic-intervention-note","#clinic-response-note","#clinic-agreements-note","#clinic-homework-note","#clinic-next-session-note"].some(id=>val(id).trim()):["#clinic-report-context","#clinic-report-evolution","#clinic-report-interventions","#clinic-report-current"].some(id=>val(id).trim());
    if(hasExisting&&!window.confirm("La plantilla sustituirá el contenido actual de estos campos. ¿Continuar?"))return;
    if(type==="session"){
      set("#clinic-work-notes",c.work_notes);set("#clinic-evolution-note",c.evolution_note);set("#clinic-intervention-note",c.intervention_note);set("#clinic-response-note",c.response_note);set("#clinic-agreements-note",c.agreements_note);set("#clinic-homework-note",c.homework_note);set("#clinic-next-session-note",c.next_session_note);
    } else {
      if(c.report_type)set("#clinic-report-type",c.report_type);set("#clinic-report-context",c.context);set("#clinic-report-evolution",c.evolution);set("#clinic-report-interventions",c.interventions);set("#clinic-report-current",c.current);
    }
  }

  async function loadTextTemplates(){
    textTemplates=await api("clinical_text_templates?select=id,template_type,name,description,content,status,created_at,updated_at&status=eq.active&order=template_type.asc,name.asc")||[];
    [sessionToolbar,reportToolbar].forEach(bar=>{
      if(!bar)return;const type=bar.dataset.templateType;const select=bar.querySelector("select");const current=select.value;select.innerHTML='<option value="">Sin plantilla</option>';textTemplates.filter(t=>t.template_type===type).forEach(t=>{const o=document.createElement("option");o.value=t.id;o.textContent=t.name;select.append(o);});if([...select.options].some(o=>o.value===current))select.value=current;
    });
  }

  function bindToolbar(bar){
    if(!bar)return;const type=bar.dataset.templateType;const select=bar.querySelector("select");
    bar.querySelector('[data-action="apply"]').addEventListener("click",()=>{const t=textTemplates.find(x=>x.id===select.value);if(!t)return;applyContent(type,t.content||{});});
    bar.querySelector('[data-action="save"]').addEventListener("click",()=>openTextEditor(type));
  }
  bindToolbar(sessionToolbar);bindToolbar(reportToolbar);

  function openTextEditor(type,row=null){
    document.querySelector("#clinic-template-editor-id").value=row?.id||"";document.querySelector("#clinic-template-editor-kind").value=type;document.querySelector("#clinic-template-name").value=row?.name||"";document.querySelector("#clinic-template-description").value=row?.description||"";document.querySelector("#clinic-template-editor-title").textContent=row?"Editar plantilla":"Guardar como plantilla";document.querySelector("#clinic-template-extra-fields").replaceChildren();document.querySelector("#clinic-template-editor-message").textContent="";editor.showModal();
  }

  async function openExerciseManager(){await loadExerciseTemplates();renderManager("exercise");manager.showModal();}
  if(exerciseHost){
    const b=document.createElement("button");b.type="button";b.className="clinic-secondary";b.textContent="Plantillas";b.addEventListener("click",openExerciseManager);exerciseHost.append(b);
  }

  async function loadExerciseTemplates(){exerciseTemplates=await api("clinical_exercise_templates?select=id,title,summary,instructions,process_tags,duration_minutes,burden,status,created_at,updated_at&order=title.asc")||[];}

  function renderManager(kind){
    const host=document.querySelector("#clinic-template-manager-list");host.replaceChildren();document.querySelector("#clinic-template-manager-title").textContent=kind==="exercise"?"Plantillas de ejercicios":"Plantillas";
    const rows=kind==="exercise"?exerciseTemplates:textTemplates;
    if(!rows.length){const e=document.createElement("div");e.className="clinic-template-empty";e.textContent="No hay plantillas.";host.append(e);return;}
    rows.forEach(row=>{
      const a=document.createElement("article");a.className="clinic-template-row";const body=document.createElement("div");const strong=document.createElement("strong");strong.textContent=kind==="exercise"?row.title:row.name;const p=document.createElement("p");p.textContent=kind==="exercise"?(row.summary||`${row.duration_minutes||"—"} min · ${row.burden||""}`):(row.description||row.template_type);body.append(strong,p);const actions=document.createElement("div");actions.className="clinic-template-actions";
      if(kind==="exercise"){
        const use=document.createElement("button");use.type="button";use.className="clinic-primary";use.textContent="Usar";use.addEventListener("click",()=>useExercise(row));actions.append(use);
        const edit=document.createElement("button");edit.type="button";edit.className="clinic-secondary";edit.textContent="Editar";edit.addEventListener("click",()=>openExerciseEditor(row));actions.append(edit);
        const archive=document.createElement("button");archive.type="button";archive.className="clinic-text";archive.textContent=row.status==="active"?"Archivar":"Reactivar";archive.addEventListener("click",()=>toggleExercise(row));actions.append(archive);
      }
      a.append(body,actions);host.append(a);
    });
    if(kind==="exercise"){const add=document.createElement("button");add.type="button";add.className="clinic-primary";add.textContent="Nueva plantilla de ejercicio";add.addEventListener("click",()=>openExerciseEditor());host.prepend(add);}
  }

  function useExercise(row){
    manager.close();document.querySelector("#clinic-new-exercise")?.click();setTimeout(()=>{set("#clinic-exercise-template-id",row.id);set("#clinic-exercise-title",row.title);set("#clinic-exercise-content",row.instructions);set("#clinic-exercise-rationale",row.summary||"");},60);
  }

  function openExerciseEditor(row=null){
    manager.close();document.querySelector("#clinic-template-editor-id").value=row?.id||"";document.querySelector("#clinic-template-editor-kind").value="exercise";document.querySelector("#clinic-template-name").value=row?.title||"";document.querySelector("#clinic-template-description").value=row?.summary||"";document.querySelector("#clinic-template-editor-title").textContent=row?"Editar plantilla de ejercicio":"Nueva plantilla de ejercicio";
    const extra=document.querySelector("#clinic-template-extra-fields");extra.innerHTML=`<label>Instrucciones<textarea id="clinic-template-exercise-instructions" rows="8" required></textarea></label><div class="clinic-form-grid"><label>Duración estimada (min)<input id="clinic-template-exercise-duration" type="number" min="1" max="180"></label><label>Carga<select id="clinic-template-exercise-burden"><option value="low">Baja</option><option value="medium">Media</option><option value="high">Alta</option></select></label></div><label>Etiquetas de proceso<input id="clinic-template-exercise-tags" placeholder="ansiedad, evitación, duelo"></label>`;
    set("#clinic-template-exercise-instructions",row?.instructions||"");set("#clinic-template-exercise-duration",row?.duration_minutes||"");set("#clinic-template-exercise-burden",row?.burden||"medium");set("#clinic-template-exercise-tags",Array.isArray(row?.process_tags)?row.process_tags.join(", "):"");document.querySelector("#clinic-template-editor-message").textContent="";editor.showModal();
  }

  async function toggleExercise(row){const next=row.status==="active"?"archived":"active";await api(`clinical_exercise_templates?id=eq.${encodeURIComponent(row.id)}`,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({status:next,updated_at:new Date().toISOString()})});await loadExerciseTemplates();renderManager("exercise");}

  document.querySelector("#clinic-template-editor-form").addEventListener("submit",async e=>{
    e.preventDefault();const id=document.querySelector("#clinic-template-editor-id").value;const kind=document.querySelector("#clinic-template-editor-kind").value;const name=document.querySelector("#clinic-template-name").value.trim();const description=document.querySelector("#clinic-template-description").value.trim();const msg=document.querySelector("#clinic-template-editor-message");if(!name)return;
    try{msg.textContent="Guardando…";
      if(kind==="exercise"){
        const payload={title:name,summary:description||null,instructions:val("#clinic-template-exercise-instructions"),duration_minutes:val("#clinic-template-exercise-duration")?Number(val("#clinic-template-exercise-duration")):null,burden:val("#clinic-template-exercise-burden")||"medium",process_tags:val("#clinic-template-exercise-tags").split(",").map(x=>x.trim()).filter(Boolean),status:"active",updated_at:new Date().toISOString()};
        await api(`clinical_exercise_templates${id?`?id=eq.${encodeURIComponent(id)}`:""}`,{method:id?"PATCH":"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify(payload)});editor.close();await loadExerciseTemplates();renderManager("exercise");manager.showModal();
      } else {
        const payload={template_type:kind,name,description:description||null,content:contentFor(kind),status:"active",updated_at:new Date().toISOString()};
        await api(`clinical_text_templates${id?`?id=eq.${encodeURIComponent(id)}`:""}`,{method:id?"PATCH":"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify(payload)});editor.close();await loadTextTemplates();
      }
    }catch(err){msg.textContent=err instanceof Error?err.message:"No se ha podido guardar la plantilla.";}
  });

  [manager,editor].forEach(d=>d.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>d.close())));
  loadTextTemplates().catch(()=>{});
})();