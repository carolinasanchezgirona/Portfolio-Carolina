export const residenceOwner='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2';
export async function residenceApi(path:string,init:RequestInit={}){
 const session=JSON.parse(sessionStorage.getItem('dememoria_admin_session')||'null');
 if(!session?.access_token)throw Error('Inicia sesión en el administrador para acceder.');
 const res=await fetch('https://grgyvdxkjdstdyumdfyg.supabase.co'+path,{...init,cache:'no-store',headers:{apikey:'sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii',Authorization:'Bearer '+session.access_token,'Content-Type':'application/json',Prefer:'return=representation'}});
 const body=await res.json().catch(()=>null);
 if(!res.ok)throw Error(res.status===409?'El horario se solapa con otra actividad o ya existe ese código o tipo. Revisa los datos.':[401,403].includes(res.status)?'Sesión caducada o acceso no autorizado. Vuelve a iniciar sesión.':'No se ha podido completar la operación. Los cambios siguen en pantalla.');
 return body;
}
