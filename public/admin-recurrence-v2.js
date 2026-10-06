(() => {
  "use strict";
  const SUPABASE_URL="https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL=`${SUPABASE_URL}/rest/v1`;
  const KEY="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY="dememoria_admin_session";
  const ZONE="Europe/Madrid";
  const form=document.querySelector("#appointment-form");
  if(!form||document.querySelector("#appointment-recurrence-select")) return;
  const note=form.querySelector(".admin-note");
  const block=document.createElement("div");
  block.className="form-grid two-cols";
  block.id="appointment-recurrence-controls-v2";
  block.innerHTML=`<label>Periodicidad<select id="appointment-recurrence-select"><option value="none">Cita única</option><option value="weekly">Cada semana</option><option value="biweekly">Cada 15 días</option><option value="monthly">Una vez al mes</option></select></label><label id="appointment-recurrence-total-wrap" hidden>Número total de citas<input id="appointment-recurrence-total" type="number" min="2" max="52" value="4"></label>`;
  form.insertBefore(block,note||document.querySelector("#appointment-message"));
  const helper=document.createElement("p"); helper.className="admin-note"; helper.id="appointment-recurrence-helper"; helper.textContent="Las citas periódicas se comprueban como una serie. Si una fecha está ocupada o bloqueada, no se crea la serie incompleta."; helper.hidden=true; block.after(helper);
  const repeat=block.querySelector("#appointment-recurrence-select");
  const total=block.querySelector("#appointment-recurrence-total");
  const wrap=block.querySelector("#appointment-recurrence-total-wrap");
  function getSession(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");}catch{return null;}}
  function headers(){return{apikey:KEY,Authorization:`Bearer ${getSession()?.access_token||""}`,"Content-Type":"application/json"};}
  function zoneOffsetMs(value){const parts=new Intl.DateTimeFormat("en-US",{timeZone:ZONE,hour12:false,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).formatToParts(value);const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)-value.getTime();}
  function localIso(dateKey,timeValue){const[y,m,d]=dateKey.split("-").map(Number);const[hh,mm]=timeValue.split(":").map(Number);const guess=Date.UTC(y,m-1,d,hh,mm,0);let instant=new Date(guess);let offset=zoneOffsetMs(instant);instant=new Date(guess-offset);const refined=zoneOffsetMs(instant);if(refined!==offset)instant=new Date(guess-refined);return instant.toISOString();}
  function msg(t){const el=document.querySelector("#appointment-message");if(el)el.textContent=t||"";}
  function visibility(){const active=repeat.value!=="none";wrap.hidden=!active;helper.hidden=!active;total.required=active;}
  repeat.addEventListener("change",visibility);
  document.querySelector("#appointment-dialog")?.addEventListener("close",()=>{repeat.value="none";total.value="4";visibility();});
  form.addEventListener("submit",async event=>{
    if(repeat.value==="none")return;
    event.preventDefault();event.stopImmediatePropagation();if(!form.checkValidity())return form.reportValidity();
    const count=Number(total.value||0);if(!Number.isInteger(count)||count<2||count>52){msg("Indica entre 2 y 52 citas en total.");return;}
    const button=document.querySelector("#appointment-save");const existingId=document.querySelector("#appointment-id")?.value||null;
    if(button){button.disabled=true;button.textContent="Guardando serie…";}
    try{
      msg("Comprobando y guardando toda la serie…");
      const response=await fetch(`${REST_URL}/rpc/admin_create_appointment_series`,{method:"POST",headers:headers(),body:JSON.stringify({p_existing_id:existingId,p_starts_at:localIso(document.querySelector("#appointment-date").value,document.querySelector("#appointment-time").value),p_patient_name:document.querySelector("#appointment-name").value.trim(),p_patient_email:document.querySelector("#appointment-email").value.trim()||null,p_patient_phone:document.querySelector("#appointment-phone").value.trim()||null,p_patient_type:document.querySelector("#appointment-patient-type").value,p_service_code:document.querySelector("#appointment-service").value,p_status:document.querySelector("#appointment-status").value,p_price_eur:Number(document.querySelector("#appointment-price").value||60),p_pattern:repeat.value,p_total:count}),cache:"no-store"});
      const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.message||data.hint||"No se ha podido guardar la serie.");
      msg(`Serie guardada correctamente: ${count} citas.`);setTimeout(()=>window.location.reload(),450);
    }catch(error){msg(error?.message||"No se ha podido guardar la serie.");}
    finally{if(button){button.disabled=false;button.textContent=existingId?"Guardar cambios":"Crear cita";}}
  },true);
  visibility();
})();
