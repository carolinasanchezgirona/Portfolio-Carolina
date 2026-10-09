type VideoEnv = { SUPABASE_SERVICE_ROLE_KEY?: string };
const root = 'https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1/';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const reply = (body: unknown, status = 200) => Response.json(body, {status, headers: {'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}});
export function normalizeMeetUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value.trim());
    if (url.origin !== 'https://meet.google.com' || url.username || url.password || !/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(url.pathname)) return null;
    return url.origin + url.pathname;
  } catch { return null; }
}
function headers(env: VideoEnv, extra = {}) {
  return {apikey:env.SUPABASE_SERVICE_ROLE_KEY!,Authorization:'Bearer '+env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'application/json',...extra};
}
export async function adminAppointmentVideo(request: Request, env: VideoEnv, authorize: (r: Request) => Promise<boolean>): Promise<Response> {
  if (!['GET','POST'].includes(request.method)) return reply({error:'Método no permitido.'},405);
  if (request.method === 'POST' && request.headers.get('Origin') !== new URL(request.url).origin) return reply({error:'Origen no permitido.'},403);
  if (!await authorize(request)) return reply({error:'Inicia sesión con tu cuenta profesional.'},401);
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return reply({error:'Servicio temporalmente no disponible.'},503);
  try {
    const input = request.method === 'POST' ? await request.json() as Record<string,unknown> : null;
    const id = String(input?.appointment_id || new URL(request.url).searchParams.get('appointment_id') || '');
    if (!uuid.test(id)) return reply({error:'Selecciona una cita válida.'},400);
    const bookingResponse = await fetch(root+'appointment_bookings?select=id,clinical_patient_id,status,ends_at&id=eq.'+id+'&limit=1',{headers:headers(env),cache:'no-store'});
    if (!bookingResponse.ok) return reply({error:'No se ha podido comprobar la cita.'},502);
    const booking = (await bookingResponse.json() as Record<string,unknown>[])[0];
    if (!booking?.clinical_patient_id || !['confirmed','pending'].includes(String(booking.status)) || Date.parse(String(booking.ends_at)) <= Date.now()) return reply({error:'La cita debe estar activa y vinculada a una ficha clínica.'},409);
    if (request.method === 'GET') {
      const response = await fetch(root+'appointment_video_links?select=meet_url,published&appointment_id=eq.'+id+'&limit=1',{headers:headers(env),cache:'no-store'});
      if (!response.ok) return reply({error:'No se ha podido cargar la videoconsulta.'},502);
      const rows = await response.json() as unknown[];
      return reply({video: rows[0] || null});
    }
    if (input?.remove === true) {
      const response = await fetch(root+'appointment_video_links?appointment_id=eq.'+id,{method:'DELETE',headers:headers(env)});
      return response.ok ? reply({ok:true}) : reply({error:'No se ha podido retirar el enlace.'},502);
    }
    const meetUrl = normalizeMeetUrl(input?.meet_url);
    if (!meetUrl || typeof input?.published !== 'boolean') return reply({error:'Introduce un enlace válido de Google Meet y el estado de publicación.'},400);
    const response = await fetch(root+'appointment_video_links?on_conflict=appointment_id',{method:'POST',headers:headers(env,{Prefer:'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify({appointment_id:id,meet_url:meetUrl,published:input.published,updated_at:new Date().toISOString()})});
    if (response.status === 409) return reply({error:'Este enlace pertenece a otra cita. Crea una reunión distinta.'},409);
    return response.ok ? reply({ok:true}) : reply({error:'No se ha podido guardar el enlace.'},502);
  } catch { return reply({error:'No se ha podido completar la solicitud.'},502); }
}
export async function patientAppointmentVideo(request: Request, env: VideoEnv, patientId: string | null): Promise<Response> {
  if (request.method !== 'GET') return reply({error:'Método no permitido.'},405);
  if (!patientId || !uuid.test(patientId)) return reply({error:'Inicia sesión en Mi espacio.'},401);
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return reply({error:'Servicio temporalmente no disponible.'},503);
  try {
    const patientResponse = await fetch(root+'clinical_patients?select=id&id=eq.'+patientId+'&status=neq.archived&limit=1',{headers:headers(env),cache:'no-store'});
    if (!patientResponse.ok || !(await patientResponse.json() as unknown[]).length) return reply({error:'Acceso no disponible.'},401);
    const now = new Date().toISOString();
    const response = await fetch(root+'appointment_bookings?select=id,starts_at,ends_at&clinical_patient_id=eq.'+patientId+'&status=eq.confirmed&ends_at=gt.'+encodeURIComponent(now)+'&order=starts_at.asc&limit=1',{headers:headers(env),cache:'no-store'});
    if (!response.ok) return reply({error:'No se ha podido comprobar la próxima sesión.'},502);
    const booking = (await response.json() as Record<string,unknown>[])[0];
    if (!booking) return reply({video:null});
    const linkResponse = await fetch(root+'appointment_video_links?select=meet_url&published=eq.true&appointment_id=eq.'+String(booking.id)+'&limit=1',{headers:headers(env),cache:'no-store'});
    if (!linkResponse.ok) return reply({error:'No se ha podido comprobar la videoconsulta.'},502);
    const link = (await linkResponse.json() as Record<string,unknown>[])[0];
    const meetUrl = normalizeMeetUrl(link?.meet_url);
    if (!meetUrl) return reply({video:null});
    const availableAt = Date.parse(String(booking.starts_at))-15*60*1000;
    const available = Date.now() >= availableAt;
    return reply({video:{starts_at:booking.starts_at,ends_at:booking.ends_at,available_at:new Date(availableAt).toISOString(),available,...(available ? {url:meetUrl} : {})}});
  } catch { return reply({error:'No se ha podido cargar la videoconsulta.'},502); }
}
