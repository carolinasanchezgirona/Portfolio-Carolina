(() => {
  'use strict';
  const page = document.getElementById('clinic-patient-dialog');
  const patient = document.getElementById('clinic-patient-id');
  const form = document.getElementById('clinic-patient-form');
  if (!page || !patient || !form) return;
  const panel = document.createElement('section');
  panel.className = 'clinic-patient-dashboard';
  panel.innerHTML = '<h3>Videoconsulta con Google Meet</h3><p>Crea una reunión distinta por cita y pega aquí su enlace. No incluyas nombres ni datos clínicos en el título de Google.</p><p>La cuenta Gmail gratuita sigue pendiente de cobertura contractual para la consulta. Puedes usar <a href="https://workspace.google.com/essentials/" target="_blank" rel="noopener noreferrer">Workspace Essentials Starter sin cuota</a> con un correo de tu dominio, o Workspace Individual. Conserva el acuerdo de tratamiento aplicable antes de publicar enlaces clínicos.</p><label>Cita <select id="video-booking"></select></label><label>Enlace de Google Meet <input id="video-url" type="url" placeholder="https://meet.google.com/xxx-xxxx-xxx" autocomplete="off"></label><label><input id="video-published" type="checkbox"> Mostrar acceso en Mi espacio</label><p>La paciente podrá entrar desde 15 minutos antes hasta el final de su cita confirmada. Retirar el enlace aquí no cierra la reunión en Google Meet.</p><div><button id="video-save" type="button" class="clinic-primary">Guardar videoconsulta</button> <button id="video-remove" type="button" class="clinic-text">Retirar enlace</button> <a href="https://meet.google.com/" target="_blank" rel="noopener noreferrer">Crear reunión en Google Meet</a></div><p id="video-status" role="status" aria-live="polite"></p>';
  form.after(panel);
  const select = panel.querySelector('#video-booking'), input = panel.querySelector('#video-url'), published = panel.querySelector('#video-published'), status = panel.querySelector('#video-status');
  const save = panel.querySelector('#video-save'), remove = panel.querySelector('#video-remove');
  let generation = 0, loadedPatient = '';
  const token = () => { try { return JSON.parse(sessionStorage.getItem('dememoria_admin_session') || 'null')?.access_token || ''; } catch { return ''; } };
  async function api(url, options = {}) {
    const response = await fetch(url, {...options,headers:{Authorization:'Bearer '+token(),'Content-Type':'application/json',...options.headers},cache:'no-store'});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'No se ha podido completar la solicitud.');
    return data;
  }
  async function loadLink() {
    const current = ++generation, id = select.value;
    input.value = ''; published.checked = false; save.disabled = remove.disabled = true;
    if (!id) return;
    status.textContent = 'Cargando videoconsulta…';
    try {
      const data = await api('/api/video/appointment?appointment_id='+encodeURIComponent(id));
      if (current !== generation) return;
      input.value = data.video?.meet_url || ''; published.checked = data.video?.published === true;
      save.disabled = remove.disabled = false;
      status.textContent = data.video ? (published.checked ? 'Acceso publicado para esta cita.' : 'Enlace guardado como borrador.') : 'Esta cita todavía no tiene enlace.';
    } catch (error) { if (current === generation) status.textContent = error.message; }
  }
  async function load() {
    if (page.hidden || !patient.value || patient.value === loadedPatient) return;
    loadedPatient = patient.value;
    const current = ++generation;
    select.replaceChildren();input.value='';published.checked=false;save.disabled=remove.disabled=true;
    status.textContent='Cargando citas…';
    try {
      const rows = await api('https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1/appointment_bookings?select=id,starts_at&clinical_patient_id=eq.'+encodeURIComponent(loadedPatient)+'&ends_at=gt.'+encodeURIComponent(new Date().toISOString())+'&status=in.(confirmed,pending)&order=starts_at.asc&limit=30',{headers:{apikey:'sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii'}});
      if (current !== generation) return;
      const fmt=new Intl.DateTimeFormat('es-ES',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Madrid'});
      for (const row of rows) { const option=document.createElement('option');option.value=row.id;option.textContent=fmt.format(new Date(row.starts_at));select.append(option); }
      if (!rows.length) { status.textContent='No hay citas activas vinculadas a esta ficha.';return; }
      await loadLink();
    } catch (error) { if (current === generation) {status.textContent=error.message;loadedPatient='';} }
  }
  select.addEventListener('change',loadLink);
  async function persist(removeLink) {
    const current=generation;
    save.disabled=remove.disabled=true;
    try {
      await api('/api/video/appointment',{method:'POST',body:JSON.stringify({appointment_id:select.value,...(removeLink ? {remove:true} : {meet_url:input.value,published:published.checked})})});
      if (current !== generation) return;
      await loadLink();
      status.textContent=removeLink ? 'Enlace retirado de Mi espacio.' : published.checked ? 'Acceso publicado para esta cita.' : 'Enlace guardado como borrador.';
    } catch (error) {if(current===generation)status.textContent=error.message;}
    finally {if(current===generation)save.disabled=remove.disabled=false;}
  }
  save.addEventListener('click',()=>persist(false));remove.addEventListener('click',()=>persist(true));
  new MutationObserver(()=>{if(page.hidden){loadedPatient='';generation++;}else load();}).observe(page,{attributes:true,attributeFilter:['hidden']});
  load();
})();
