import { createHmac } from 'node:crypto';
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';
import { digestSigningKey } from './psychology-digest.mjs';
import { fetchSocJobs } from './job-offers-soc.mjs';

// Ejecución diagnóstica sin envío habilitada solo mediante etiqueta de commit.
const endpoint='https://carolinasanchezgirona.com/api/automation/psychology-digest';
const localDay=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Madrid'}).format(new Date());
const localClock=()=>new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',hourCycle:'h23',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());
const norm=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ');
const key=j=>norm(j.employer)+'|'+norm(j.title)+'|'+norm(j.municipality);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function render(day,jobs,source){
  const parts=['<b>Ofertas de psicología y neuropsicología · '+day.split('-').reverse().join('/')+'</b>',
    source==='soc'?'Fuente: Feina Activa (SOC), ofertas publicadas en los últimos 7 días.':'Fuentes: búsqueda web verificada.'];
  if(!jobs.length)parts.push('Hoy no hay ofertas nuevas verificadas en esta fuente para Barcelona ciudad y Maresme.');
  for(const [index,j] of jobs.entries()){
    parts.push('<b>'+(index+1)+'. '+esc(j.title)+'</b>',
      esc(j.employer)+' · '+esc(j.municipality),
      'Publicación: '+esc(j.posted.split('-').reverse().join('/')),
      'Contrato: '+esc(j.contract)+' · '+esc(j.hours),
      ...(!/^no indicad/i.test(j.salary)&&j.salary?['Salario: '+esc(j.salary)]:[]),
      esc(j.fit),'<a href="'+esc(j.url)+'">Ver oferta y solicitar</a>','');
  }
  return parts.join('\n');
}
async function telegram(token,method,data){
  const response=await fetch('https://api.telegram.org/bot'+token+'/'+method,{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),
    signal:AbortSignal.timeout(30_000),redirect:'error',
  });
  const json=await response.json().catch(()=>({}));
  if(!response.ok||json.ok!==true||!json.result)throw Error('Telegram no confirmó '+method+'.');
  return json.result;
}
async function waitForDeployment(){
  // No consultar empleo contra una versión obsoleta de la API.
  const deadline=Date.now()+7*60_000;
  while(Date.now()<deadline){
    const res=await fetch(endpoint,{signal:AbortSignal.timeout(12000),redirect:'error'}).catch(()=>null);
    if(res?.status===405&&res.headers.get('X-Psychology-Digest')==='4')return;
    await setTimeout(20000);
  }
  throw Error('La API de empleo aún no está desplegada (versión 4).');
}
async function research(token,urls){
  const body=JSON.stringify({mode:'jobs',recentUrls:urls});
  const stamp=Math.floor(Date.now()/1000);
  const signature=createHmac('sha256',digestSigningKey(token)).update(String(stamp)+'\n'+body).digest('hex');
  const response=await fetch(endpoint,{method:'POST',
    headers:{'Content-Type':'application/json','X-Psychology-Digest-Signature':String(stamp)+'.'+signature},
    body,signal:AbortSignal.timeout(320_000),redirect:'error'});
  const json=await response.json().catch(()=>({}));
  if(!response.ok||json.mode!=='jobs'||!Array.isArray(json.items))throw Error(json.error||('La API devolvió una respuesta inválida (HTTP '+response.status+', modo '+String(json.mode||'sin indicar')+').'));
  return json.items;
}
async function main(){
  const { TELEGRAM_BOT_TOKEN:token,TELEGRAM_CHAT_ID:chat,
    SEND_JOB_OFFERS:sendFlag,DIAGNOSE_JOB_API:diagnosticFlag,DIAGNOSE_SOC:diagnoseSocFlag,JOB_ALERT_STATE_PATH:path,GITHUB_OUTPUT }=process.env;
  if(!token||!chat||!path)throw Error('Faltan credenciales o ruta de estado.');
  const send=sendFlag==='true',diagnose=diagnosticFlag==='true',diagnoseSoc=diagnoseSocFlag==='true',day=localDay();
  const previous=await readFile(path,'utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return [];throw e;});
  const cutoff=new Date(day+'T00:00:00Z');cutoff.setUTCDate(cutoff.getUTCDate()-90);
  const history=(Array.isArray(previous)?previous:[]).filter(x=>x.day>=cutoff.toISOString().slice(0,10));
  const sentUrls=new Set(history.map(x=>x.url).filter(x=>typeof x==='string'&&x.startsWith('https://')));
  const sentKeys=new Set(history.map(x=>x.key).filter(x=>typeof x==='string'));
  if(send&&history.some(x=>x.day===day&&x.checked===true)){
    console.log('Búsqueda diaria ya completada, no repetir peticiones ni avisos.');
    return;
  }
  if(!send&&!diagnose&&!diagnoseSoc){
    const test=await telegram(token,'getChat',{chat_id:chat});
    if(!Number.isSafeInteger(test.id))throw Error('Telegram no confirmó el chat.');
    console.log('Conexión con Telegram confirmada. Prueba sin búsquedas de pago ni envío.');
    return;
  }
  const source=diagnose||process.env.JOB_SEARCH_SOURCE==='api'&&!diagnoseSoc?'api':'soc';
  let results;
  if(source==='soc'){
    results=await fetchSocJobs(day);
  }else{
    await waitForDeployment();
    for(let attempt=0;attempt<2;attempt++){
      try{
        results=await research(token,history.filter(x=>typeof x.url==='string'&&x.url.startsWith('https://')).slice(-90).map(x=>x.url));
        break;
      }catch(error){
        const message=String(error.message||error);
        const temporary=/HTTP 429/.test(message)&&/api_code=(rate_limit_exceeded|unknown)|api_type=rate_limit_exceeded/.test(message);
        if(attempt===1||!temporary)throw error;
        console.warn('Límite temporal de peticiones de la API (429); un único reintento.');
        await setTimeout(45000);
      }
    }
  }
  if((diagnose||diagnoseSoc)&&!send){
    console.log('Diagnóstico '+source+' sin avisos ni escrituras. Ofertas válidas: '+results.length+'.');
    if(diagnoseSoc)for(const job of results.slice(0,8))console.log('SOC oferta: '+job.title+' | '+job.employer+' | '+job.municipality+' | '+job.posted+' | '+job.url);
    return;
  }
  const fresh=[];
  for(const job of results){
    if(!job.url?.startsWith('https://')||!job.title||!job.employer||!job.municipality)continue;
    if(sentUrls.has(job.url)||sentKeys.has(key(job)))continue;
    sentUrls.add(job.url);sentKeys.add(key(job));fresh.push(job);
    if(fresh.length>=8)break;
  }
  const [hour,minute,second]=localClock().split(':').map(Number);
  const wait=(8-hour)*3600000-minute*60000-second*1000;
  if(wait>0&&wait<1800000)await setTimeout(wait);
  const message=render(day,fresh,source);
  if(message.length>3900)throw Error('Boletín de empleo demasiado extenso; no enviado.');
  const result=await telegram(token,'sendMessage',{chat_id:chat,text:message,parse_mode:'HTML',link_preview_options:{is_disabled:true}});
  if(!result.message_id)throw Error('Telegram no confirmó el mensaje.');
  await writeFile(path,JSON.stringify([...history,...fresh.map(j=>({day,url:j.url,key:key(j)})),{day,checked:true}]));
  if(GITHUB_OUTPUT)await appendFile(GITHUB_OUTPUT,'state_saved=true\n');
  console.log('Resumen diario enviado por Telegram; nuevas ofertas verificadas: '+fresh.length+'. Fuente: '+source+'.');
}
main().catch(async error=>{
  const detail=String(error?.message||error);
  console.error('Aviso de empleo: '+detail);
  const reason=/api_code=(insufficient_quota|billing_hard_limit_reached)|api_type=insufficient_quota/.test(detail)?'quota':
    /HTTP 429/.test(detail)?'rate_limit':'other';
  if(process.env.GITHUB_OUTPUT){
    await appendFile(process.env.GITHUB_OUTPUT,'failure_reason='+reason+'\n').catch(()=>{});
  }
  process.exitCode=1;
});
