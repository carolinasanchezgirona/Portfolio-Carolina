import { createHmac } from 'node:crypto';
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';
import { digestSigningKey } from './psychology-digest.mjs';

const endpoint='https://carolinasanchezgirona.com/api/automation/psychology-digest';
const localDay=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Madrid'}).format(new Date());
const localClock=()=>new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',hourCycle:'h23',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());
const norm=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ');
const key=j=>norm(j.employer)+'|'+norm(j.title)+'|'+norm(j.municipality);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function render(day,jobs){
  const parts=['<b>Ofertas de psicología y neuropsicología · '+day.split('-').reverse().join('/')+'</b>'];
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
async function research(token,urls){
  const body=JSON.stringify({mode:'jobs',recentUrls:urls});
  const stamp=Math.floor(Date.now()/1000);
  const signature=createHmac('sha256',digestSigningKey(token)).update(String(stamp)+'\n'+body).digest('hex');
  const response=await fetch(endpoint,{method:'POST',
    headers:{'Content-Type':'application/json','X-Psychology-Digest-Signature':String(stamp)+'.'+signature},
    body,signal:AbortSignal.timeout(320_000),redirect:'error'});
  const json=await response.json().catch(()=>({}));
  if(!response.ok||json.mode!=='jobs'||!Array.isArray(json.items))throw Error(json.error||'La API no devolvió ofertas verificadas.');
  return json.items;
}
async function main(){
  const { TELEGRAM_BOT_TOKEN:token,TELEGRAM_CHAT_ID:chat,
    SEND_JOB_OFFERS:sendFlag,JOB_ALERT_STATE_PATH:path,GITHUB_OUTPUT }=process.env;
  if(!token||!chat||!path)throw Error('Faltan credenciales o ruta de estado.');
  const send=sendFlag==='true',day=localDay();
  const previous=await readFile(path,'utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return [];throw e;});
  const cutoff=new Date(day+'T00:00:00Z');cutoff.setUTCDate(cutoff.getUTCDate()-90);
  const history=(Array.isArray(previous)?previous:[]).filter(x=>x.day>=cutoff.toISOString().slice(0,10));
  const sentUrls=new Set(history.map(x=>x.url));
  const sentKeys=new Set(history.map(x=>x.key));
  if(!send)await telegram(token,'getChat',{chat_id:chat});
  const results=await research(token,history.slice(-90).map(x=>x.url));
  const fresh=[];
  for(const job of results){
    if(!job.url?.startsWith('https://')||!job.title||!job.employer||!job.municipality)continue;
    if(sentUrls.has(job.url)||sentKeys.has(key(job)))continue;
    sentUrls.add(job.url);sentKeys.add(key(job));fresh.push(job);
    if(fresh.length>=8)break;
  }
  if(!send){console.log('Prueba sin envío: '+fresh.length+' ofertas.');return;}
  if(!fresh.length){console.log('No hay ofertas nuevas, sin notificación.');return;}
  const [hour,minute,second]=localClock().split(':').map(Number);
  const wait=(8-hour)*3600000-minute*60000-second*1000;
  if(wait>0&&wait<1800000)await setTimeout(wait);
  const message=render(day,fresh);
  if(message.length>3900)throw Error('Boletín de empleo demasiado extenso; no enviado.');
  const result=await telegram(token,'sendMessage',{chat_id:chat,text:message,parse_mode:'HTML',link_preview_options:{is_disabled:true}});
  if(!result.message_id)throw Error('Telegram no confirmó el mensaje.');
  await writeFile(path,JSON.stringify([...history,...fresh.map(j=>({day,url:j.url,key:key(j)}))]));
  if(GITHUB_OUTPUT)await appendFile(GITHUB_OUTPUT,'sent=true\n');
  console.log('Ofertas enviadas por Telegram: '+fresh.length);
}
main().catch(error=>{console.error('Aviso de empleo: '+error.message);process.exitCode=1;});
