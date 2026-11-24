// Read-only Search Console connector. No clinical data or credentials are returned.
type SeoEnv = { GSC_SERVICE_ACCOUNT_JSON?: string; GSC_SITE_URL?: string };
type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };
const tokenEndpoint = "https://oauth2.googleapis.com/token";
const scope = "https://www.googleapis.com/auth/webmasters.readonly";
const encode = (data: Uint8Array) => btoa(Array.from(data, b => String.fromCharCode(b)).join("")).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const enc = (s: string) => encode(new TextEncoder().encode(s));
const json = (body: unknown,status=200) => Response.json(body,{status,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow","X-Content-Type-Options":"nosniff"}});
async function getToken(raw: string) {
  const account = JSON.parse(raw) as {client_email?: string; private_key?: string};
  if (!account.client_email || !account.private_key) throw new Error("credentials");
  const now = Math.floor(Date.now()/1000);
  const claims = enc(JSON.stringify({iss:account.client_email,scope,aud:tokenEndpoint,iat:now,exp:now+900}));
  const unsigned = enc(JSON.stringify({alg:"RS256",typ:"JWT"}))+"."+claims;
  const pem = account.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g,"");
  const key = await crypto.subtle.importKey("pkcs8",Uint8Array.from(atob(pem),c=>c.charCodeAt(0)),{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5",key,new TextEncoder().encode(unsigned));
  const response = await fetch(tokenEndpoint,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:unsigned+"."+encode(new Uint8Array(signature))})});
  const data = await response.json() as {access_token?:string};
  if (!response.ok || !data.access_token) throw new Error("token");
  return data.access_token;
}
export function seoPeriods(now = new Date()) {
  // Search Console dates use Pacific time; leave four full days for final data.
  const date = new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
  const day = (offset:number) => new Date(Date.parse(date+"T00:00:00Z")+offset*86400000).toISOString().slice(0,10);
  return {current:{startDate:day(-31),endDate:day(-4)},previous:{startDate:day(-59),endDate:day(-32)}};
}
export async function seoSearchConsole(request:Request,env:SeoEnv,authorize:(request:Request)=>Promise<boolean>) {
  if(request.method!=="GET") return json({error:"Método no permitido."},405);
  if(!await authorize(request)) return json({error:"Acceso profesional no autorizado."},401);
  if(!env.GSC_SERVICE_ACCOUNT_JSON) return json({connected:false,message:"Conexión de Google pendiente de configurar."});
  const property = env.GSC_SITE_URL || "sc-domain:carolinasanchezgirona.com";
  if(!["sc-domain:carolinasanchezgirona.com","https://carolinasanchezgirona.com/"].includes(property)) return json({error:"Propiedad de Search Console no válida."},503);
  try {
    const token = await getToken(env.GSC_SERVICE_ACCOUNT_JSON);
    const periods = seoPeriods();
    const query = async (range:{startDate:string;endDate:string},dimensions:string[],rowLimit:number) => {
      const response = await fetch("https://www.googleapis.com/webmasters/v3/sites/"+encodeURIComponent(property)+"/searchAnalytics/query",{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({...range,dimensions,rowLimit,type:"web",dataState:"final"})});
      if(!response.ok) throw new Error("google-"+response.status);
      return ((await response.json()) as {rows?:Row[]}).rows || [];
    };
    const [totals,previous,dates,queries,pages] = await Promise.all([query(periods.current,[],1),query(periods.previous,[],1),query(periods.current,["date"],28),query(periods.current,["query"],100),query(periods.current,["page"],100)]);
    return json({connected:true,property,periods,totals:totals[0]||null,previous:previous[0]||null,dates,queries,pages,updatedAt:new Date().toISOString()});
  } catch {
    return json({error:"Google no ha devuelto los datos. Comprueba la API, los permisos de lectura de la propiedad y las credenciales."},502);
  }
}
