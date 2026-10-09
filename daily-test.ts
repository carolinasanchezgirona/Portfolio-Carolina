type DailyEnv = { DAILY_API_KEY?: string };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' } });

/** Professional-only smoke test. No patient access or patient identifiers. */
export async function dailyTest(request: Request, env: DailyEnv, authorize: (request: Request) => Promise<boolean>): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Método no permitido.' }, 405);
  if (request.headers.get('Origin') !== new URL(request.url).origin) return json({ error: 'Origen no permitido.' }, 403);
  if (!await authorize(request)) return json({ error: 'Inicia sesión con tu cuenta profesional.' }, 401);
  if (!env.DAILY_API_KEY) return json({ error: 'Falta configurar DAILY_API_KEY en producción.' }, 503);
  const now = Math.floor(Date.now() / 1000);
  // Reuse one room per 30-minute window; requests cannot create arbitrary rooms.
  const slot = Math.floor(now / 1800);
  const exp = (slot + 1) * 1800;
  if (exp - now < 120) return json({ error: 'Espera dos minutos para iniciar una prueba con tiempo suficiente.' }, 409);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.DAILY_API_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`professional-test:${slot}`)));
  const name = 'test-' + Array.from(signature.slice(0, 16), b => b.toString(16).padStart(2, '0')).join('');
  const api = (path: string, method = 'GET', body?: unknown) => fetch('https://api.daily.co/v1' + path, {
    method, headers: { Authorization: 'Bearer ' + env.DAILY_API_KEY, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000), cache: 'no-store'
  });
  try {
    let response = await api('/rooms/' + name);
    if (response.status === 404) {
      response = await api('/rooms', 'POST', { name, privacy: 'private', properties: {
        exp, eject_at_room_exp: true, max_participants: 2, enable_knocking: false,
        enable_recording: false, enable_chat: false, enable_live_captions_ui: false,
        enable_transcription_storage: false, enable_prejoin_ui: true, enable_terse_logging: true,
        start_video_off: true, start_audio_off: true, sfu_switchover: 3, geo: 'eu-central-1', lang: 'es'
      } });
      // Another instance may have created the same room concurrently.
      if (!response.ok) response = await api('/rooms/' + name);
    }
    if (!response.ok) return json({ error: 'Daily no ha permitido crear la sala. Comprueba la clave y la cuenta.' }, 502);
    const room = await response.json() as { url?: string; privacy?: string; config?: Record<string, unknown> };
    // Report only fixed configuration names; never expose room URLs, tokens or keys.
    const expected: Record<string, unknown> = {
      max_participants: 2, sfu_switchover: 3, exp,
      eject_at_room_exp: true, enable_knocking: false, enable_chat: false,
      enable_live_captions_ui: false, enable_transcription_storage: false
    };
    const mismatches = Object.entries(expected).filter(([field, value]) => room.config?.[field] !== value)
      .map(([field]) => `${field}: ${room.config?.[field] === undefined ? 'no devuelto' : 'valor distinto'}`);
    if (room.privacy !== 'private') mismatches.push('privacidad');
    if (!room.url || new URL(room.url).hostname !== 'carolinasanchezgirona.daily.co') mismatches.push('dominio');
    if (room.config?.enable_recording) mismatches.push('grabación');
    if (mismatches.length) {
      return json({ error: 'La sala no cumple la configuración privada de prueba. Comprobación: ' + mismatches.join('; ') + '.' }, 502);
    }
    const tokenResponse = await api('/meeting-tokens', 'POST', { properties: { room_name: name, exp, eject_at_token_exp: true, is_owner: false, user_name: 'Prueba', start_video_off: true, start_audio_off: true, enable_recording: false, start_cloud_recording: false } });
    if (!tokenResponse.ok) return json({ error: 'No se ha podido autorizar la entrada a la prueba.' }, 502);
    const data = await tokenResponse.json() as { token?: string };
    if (!data.token) return json({ error: 'Daily no ha devuelto un acceso válido.' }, 502);
    return json({ url: room.url, token: data.token, expires_at: exp });
  } catch { return json({ error: 'No se ha podido conectar con Daily. Inténtalo de nuevo.' }, 502); }
}
