(() => {
  'use strict';
  const start = document.getElementById('start');
  const leave = document.getElementById('leave');
  const message = document.getElementById('message');
  let call = null;
  let expiry = null;
  let failure = '';
  function errorText(error) {
    const raw = typeof error === 'string' ? error : error?.errorMsg || error?.message || error?.error?.message;
    if (!raw) return 'Daily no ha podido completar la entrada a la sala.';
    // Provider errors may contain URLs or credentials; show only redacted text.
    return String(raw).replace(/https?:\/\/[^\s]+/g, '[enlace]').replace(/eyJ[A-Za-z0-9_.-]+/g, '[acceso]').slice(0, 400);
  }
  async function close() {
    clearTimeout(expiry);
    if (call) { const old = call; call = null; try { await old.destroy(); } catch (_) {} }
    leave.hidden = true;
    start.disabled = false;
  }
  start.addEventListener('click', async () => {
    start.disabled = true;
    failure = '';
    message.textContent = 'Comprobando acceso y preparando sala…';
    try {
      const session = JSON.parse(sessionStorage.getItem('dememoria_admin_session') || 'null');
      if (!session?.access_token) {
        location.assign('/admin/clinica/acceso/?next=/admin/videoconsulta/prueba/');
        return;
      }
      const response = await fetch('/api/video/test', { method: 'POST', headers: { Authorization: 'Bearer ' + session.access_token }, cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se ha podido iniciar la prueba.');
      if (!window.DailyIframe) throw new Error('No se ha podido cargar la videollamada. Recarga la página.');
      call = window.DailyIframe.createFrame(document.getElementById('call'), { showLeaveButton: true });
      call.on('left-meeting', () => { if (!failure) message.textContent = 'Has salido de la prueba.'; close(); });
      call.on('error', (event) => { failure = errorText(event); message.textContent = 'Error de conexión: ' + failure; close(); });
      leave.hidden = false;
      expiry = setTimeout(() => { message.textContent = 'La prueba ha terminado. Puedes iniciar otra.'; close(); }, Math.max(0, data.expires_at * 1000 - Date.now()));
      await call.join({ url: data.url, token: data.token, userName: 'Prueba' });
      message.textContent = 'Sala de prueba abierta. Activa cámara y micrófono cuando quieras.';
    } catch (error) { failure = failure || errorText(error); await close(); message.textContent = 'No se ha podido iniciar la prueba: ' + failure; }
  });
  leave.addEventListener('click', async () => { await close(); message.textContent = 'Has salido de la prueba.'; });
  window.addEventListener('pagehide', close);
})();
