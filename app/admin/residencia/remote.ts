export const residenceOwner='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2';
export class ResidenceApiError extends Error {constructor(message:string,public status:number){super(message);}}
export async function remoteApi(path:string,init:RequestInit={}){
 const session=JSON.parse(sessionStorage.getItem('dememoria_admin_session')||'null');
 if(!session?.access_token)throw new ResidenceApiError('Inicia sesión en el administrador para acceder.',401);
 const res=await fetch('https://grgyvdxkjdstdyumdfyg.supabase.co'+path,{...init,signal:init.signal||AbortSignal.timeout(15000),cache:'no-store',headers:{apikey:'sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii',Authorization:'Bearer '+session.access_token,'Content-Type':'application/json',Prefer:'return=representation'}});
 const body=await res.json().catch(()=>null);
 if(!res.ok)throw new ResidenceApiError(res.status===409?'El horario se solapa con otra actividad o ya existe ese código o tipo. Revisa los datos.':[401,403].includes(res.status)?'Sesión caducada o acceso no autorizado. Inicia sesión para sincronizar. Tu copia local se conserva.':'No se ha podido completar la operación. Los cambios se conservan.',res.status);
 return body;
}
