(() => {
  "use strict";
  if (!window.location.pathname.startsWith("/admin/clinica")) return;

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const dialog = document.querySelector("#clinic-patient-dialog");
  const idField = document.querySelector("#clinic-patient-id");
  const nameField = document.querySelector("#clinic-personal-full-name");
  const contact = document.querySelector("#clinic-patient-contact");
  const recordActions = document.querySelector(".clinic-record-actions");
  if (!dialog || !idField || !nameField || !recordActions) return;

  function session() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } }
  function headers(prefer) {
    const h = { apikey: KEY, Authorization: `Bearer ${session()?.access_token || ""}`, "Content-Type": "application/json" };
    if (prefer) h.Prefer = prefer;
    return h;
  }
  function esc(v) { return String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }
  function normalize(v) { return String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  function patientId() { return idField.value || ""; }
  function setMessage(text, danger=false) {
    let el = document.querySelector("#clinic-patient-admin-enhancement-message");
    if (!el) {
      el = document.createElement("p");
      el.id = "clinic-patient-admin-enhancement-message";
      el.className = "clinic-message";
      recordActions.after(el);
    }
    el.textContent = text || "";
    el.dataset.danger = danger ? "true" : "false";
  }

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.id = "clinic-delete-patient";
  deleteButton.className = "clinic-text clinic-patient-danger-action";
  deleteButton.textContent = "Eliminar ficha vacía";
  recordActions.append(deleteButton);

  async function rpc(name, body) {
    const res = await fetch(`${REST_URL}/rpc/${name}`, { method:"POST", headers:headers(), body:JSON.stringify(body), cache:"no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || data?.hint || "No se ha podido completar la operación.");
    return data;
  }

  deleteButton.addEventListener("click", async () => {
    const id = patientId();
    if (!id) return;
    const label = nameField.value.trim() || "esta ficha";
    if (!window.confirm(`Vas a eliminar ${label}. Solo se permitirá si la ficha está completamente vacía. ¿Continuar?`)) return;
    if (window.prompt('Escribe ELIMINAR para confirmar') !== "ELIMINAR") return;
    deleteButton.disabled = true;
    setMessage("Comprobando que la ficha esté vacía…");
    try {
      const result = await rpc("delete_empty_clinical_patient", { p_patient_id:id });
      if (!result?.deleted) {
        const blockers = Array.isArray(result?.blockers) ? result.blockers.join(", ") : "contiene información";
        setMessage(`No se ha eliminado. La ficha contiene: ${blockers}.`, true);
        return;
      }
      dialog.close();
      setMessage("Ficha eliminada.");
      window.location.reload();
    } catch (error) { setMessage(error?.message || "No se ha podido eliminar.", true); }
    finally { deleteButton.disabled = false; }
  });

  const duplicatePanel = document.createElement("section");
  duplicatePanel.id = "clinic-duplicate-panel";
  duplicatePanel.className = "clinic-duplicate-panel";
  duplicatePanel.hidden = true;
  contact?.after(duplicatePanel);

  async function loadDuplicates() {
    const id = patientId();
    const currentName = normalize(nameField.value);
    if (!id || !currentName) { duplicatePanel.hidden = true; return; }
    const select = "id,full_name,email,phone,public_code,created_at";
    const res = await fetch(`${REST_URL}/clinical_patients?select=${encodeURIComponent(select)}&id=neq.${encodeURIComponent(id)}&order=created_at.asc`, { headers:headers(), cache:"no-store" });
    const rows = await res.json().catch(() => []);
    if (!res.ok || !Array.isArray(rows)) return;
    const email = normalize(document.querySelector("#clinic-personal-email")?.value);
    const phone = normalize(document.querySelector("#clinic-personal-phone")?.value);
    const matches = rows.filter(r => {
      const sameName = normalize(r.full_name) === currentName;
      const sameEmail = email && normalize(r.email) === email;
      const samePhone = phone && normalize(r.phone) === phone;
      return sameName || sameEmail || samePhone;
    });
    if (!matches.length) { duplicatePanel.hidden = true; duplicatePanel.replaceChildren(); return; }
    duplicatePanel.hidden = false;
    duplicatePanel.innerHTML = `<div class="clinic-duplicate-heading"><div><strong>Posible ficha duplicada</strong><p>Compara antes de eliminar o fusionar. La ficha eliminada se archiva internamente al fusionar.</p></div></div>`;
    matches.forEach(row => {
      const card = document.createElement("div");
      card.className = "clinic-duplicate-card";
      card.innerHTML = `<div><strong>${esc(row.full_name)}</strong><span>${esc(row.public_code || "Sin código")} · ${esc(row.email || row.phone || "Sin contacto")}</span></div>`;
      const keepCurrent = document.createElement("button");
      keepCurrent.type = "button"; keepCurrent.className = "clinic-secondary"; keepCurrent.textContent = "Conservar esta ficha y fusionar la otra";
      keepCurrent.addEventListener("click", () => mergePatients(id, row.id, row.full_name));
      const keepOther = document.createElement("button");
      keepOther.type = "button"; keepOther.className = "clinic-text"; keepOther.textContent = "Conservar la otra ficha";
      keepOther.addEventListener("click", () => mergePatients(row.id, id, nameField.value.trim()));
      const actions = document.createElement("div"); actions.className = "clinic-duplicate-actions"; actions.append(keepCurrent, keepOther);
      card.append(actions); duplicatePanel.append(card);
    });
  }

  async function mergePatients(keepId, mergeId, removedName) {
    if (!window.confirm(`Se fusionarán ambas fichas. Se conservarán sesiones, documentos, escalas, informes, objetivos, citas y materiales. ¿Fusionar la ficha de ${removedName || "la persona duplicada"}?`)) return;
    if (window.prompt('Escribe FUSIONAR para confirmar') !== "FUSIONAR") return;
    setMessage("Fusionando fichas…");
    try {
      const result = await rpc("merge_clinical_patients", { p_keep_id:keepId, p_merge_id:mergeId });
      if (!result?.merged) throw new Error("La fusión no se ha completado.");
      dialog.close();
      window.location.reload();
    } catch (error) { setMessage(error?.message || "No se han podido fusionar las fichas.", true); }
  }

  const personalSection = document.querySelector(".clinic-personal-admin-section");
  const consentSection = document.createElement("details");
  consentSection.className = "clinic-record-section clinic-consent-section";
  consentSection.innerHTML = `<summary><span>Consentimientos</span><small>Estado, fecha y versión del consentimiento informado</small></summary><div class="clinic-record-section-body"><div id="clinic-consent-grid" class="clinic-consent-grid"></div><p id="clinic-consent-message" class="clinic-message"></p></div>`;
  personalSection?.after(consentSection);

  const consentTypes = [
    ["psychological","Psicología sanitaria"],
    ["neuropsychological","Neuropsicología"],
  ];
  function renderConsentRows(rows=[]) {
    const grid = consentSection.querySelector("#clinic-consent-grid");
    grid.replaceChildren();
    consentTypes.forEach(([type,label]) => {
      const existing = rows.find(r => r.consent_type===type) || {};
      const row = document.createElement("article");
      row.className = "clinic-consent-row";
      const date = existing.signed_at ? new Date(existing.signed_at).toISOString().slice(0,10) : "";
      row.innerHTML = `<strong>${label}</strong><label>Estado<select data-consent-status><option value="pending">Pendiente</option><option value="granted">Recibido</option><option value="revoked">Revocado</option></select></label><label>Fecha<input data-consent-date type="date" value="${date}"></label><label>Versión<input data-consent-version type="text" value="${esc(existing.version || "")}" placeholder="Ej. 2026-10"></label><label class="clinic-consent-notes">Notas<input data-consent-notes type="text" value="${esc(existing.notes || "")}" placeholder="Opcional"></label>`;
      row.querySelector("[data-consent-status]").value = existing.status || "pending";
      const save = document.createElement("button"); save.type="button"; save.className="clinic-secondary"; save.textContent="Guardar";
      save.addEventListener("click", () => saveConsent(type,row,save)); row.append(save); grid.append(row);
    });
  }
  async function loadConsents() {
    const id = patientId(); if (!id) return;
    const res = await fetch(`${REST_URL}/clinical_patient_consents?select=*&patient_id=eq.${encodeURIComponent(id)}&order=consent_type.asc`, { headers:headers(), cache:"no-store" });
    const rows = await res.json().catch(() => []);
    renderConsentRows(Array.isArray(rows) ? rows : []);
  }
  async function saveConsent(type,row,button) {
    const id=patientId(); if(!id) return; button.disabled=true;
    const status=row.querySelector("[data-consent-status]").value;
    const date=row.querySelector("[data-consent-date]").value;
    const payload={patient_id:id,consent_type:type,status,version:row.querySelector("[data-consent-version]").value.trim()||null,notes:row.querySelector("[data-consent-notes]").value.trim()||null,signed_at:status==="granted"&&date?`${date}T12:00:00Z`:null,revoked_at:status==="revoked"?new Date().toISOString():null,updated_at:new Date().toISOString()};
    const res=await fetch(`${REST_URL}/clinical_patient_consents?on_conflict=patient_id,consent_type`,{method:"POST",headers:headers("resolution=merge-duplicates,return=minimal"),body:JSON.stringify(payload)});
    consentSection.querySelector("#clinic-consent-message").textContent=res.ok?"Consentimiento actualizado.":"No se ha podido guardar el consentimiento.";
    button.disabled=false;
  }

  const auditSection = document.createElement("section");
  auditSection.className = "clinic-audit-section";
  auditSection.innerHTML = `<div class="clinic-goals-heading"><div><p class="clinic-eyebrow">Trazabilidad</p><h3>Registro de cambios</h3></div><button id="clinic-audit-refresh" class="clinic-text" type="button">Actualizar</button></div><div id="clinic-audit-list" class="clinic-history"></div>`;
  const reportsHeading = Array.from(dialog.querySelectorAll("h3")).find(el => el.textContent.includes("Informes guardados"));
  reportsHeading?.before(auditSection);
  auditSection.querySelector("#clinic-audit-refresh")?.addEventListener("click", loadAudit);
  async function loadAudit() {
    const id=patientId(); if(!id) return;
    const list=auditSection.querySelector("#clinic-audit-list"); list.textContent="Cargando cambios…";
    const res=await fetch(`${REST_URL}/clinical_audit_log?select=id,entity_type,action,summary,metadata,created_at&patient_id=eq.${encodeURIComponent(id)}&order=created_at.desc&limit=25`,{headers:headers(),cache:"no-store"});
    const rows=await res.json().catch(()=>[]); list.replaceChildren();
    if(!res.ok||!Array.isArray(rows)){list.textContent="No se ha podido cargar el registro.";return;}
    if(!rows.length){list.textContent="Todavía no hay cambios registrados.";return;}
    rows.forEach(r=>{const item=document.createElement("article");const changed=Array.isArray(r.metadata?.changed_fields)&&r.metadata.changed_fields.length?` · ${r.metadata.changed_fields.join(", ")}`:"";item.innerHTML=`<strong>${esc(r.summary)}</strong><span>${new Intl.DateTimeFormat("es-ES",{dateStyle:"short",timeStyle:"short"}).format(new Date(r.created_at))}${esc(changed)}</span>`;list.append(item);});
  }

  let lastId="";
  async function refreshEnhancements() {
    const id=patientId(); if(!dialog.open||!id||id===lastId) return; lastId=id;
    setMessage("");
    await Promise.allSettled([loadDuplicates(),loadConsents(),loadAudit()]);
  }
  const observer=new MutationObserver(()=>{if(dialog.open){lastId="";setTimeout(refreshEnhancements,60);}else{lastId="";duplicatePanel.hidden=true;}});
  observer.observe(dialog,{attributes:true,attributeFilter:["open"]});
})();
