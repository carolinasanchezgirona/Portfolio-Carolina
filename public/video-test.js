(() => {
  'use strict';
  const start = document.getElementById('start');
  const leave = document.getElementById('leave');
  const message = document.getElementById('message');
  let call = null;
  let expiry = null;
  async function close() {
    clearTimeout(expiry);
    if (call) { const old = call; call = null; try { await old.destroy(); } catch (_) {} }
    leave.hidden = true;
    start.disabled = false;
  }
  start.addEventListener('click', async () => {
    start.disabled = true;
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
      call.on('left-meeting', () => { message.textContent = 'Has salido de la prueba.'; close(); });
      call.on('error', () => { message.textContent = 'La conexión ha fallado. Puedes volver a intentarlo.'; close(); });
      leave.hidden = false;
      expiry = setTimeout(() => { message.textContent = 'La prueba ha terminado. Puedes iniciar otra.'; close(); }, Math.max(0, data.expires_at * 1000 - Date.now()));
      await call.join({ url: data.url, token: data.token, userName: 'Prueba' });
      message.textContent = 'Sala de prueba abierta. Activa cámara y micrófono cuando quieras.';
    } catch (error) { await close(); message.textContent = error.message || 'No se ha podido iniciar la prueba.'; }
  });
  leave.addEventListener('click', async () => { await close(); message.textContent = 'Has salido de la prueba.'; });
  window.addEventListener('pagehide', close);
})();
