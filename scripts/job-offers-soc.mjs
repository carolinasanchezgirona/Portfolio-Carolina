// Fuente pública sin clave de pago: oferta de empleo de Feina Activa (SOC).
// Catálogo oficial: https://datos.gob.es/es/catalogo/a09002970-portal-feina-activa-ofertas-de-empleo
const SOC_URL='https://feinaactiva.gencat.cat/api/offers/offers-xml';
const MARESME=new Set([
  'alella','arenys de mar','arenys de munt','argentona','cabrera de mar','cabrils',
  'caldes d estrac','calella','canet de mar','dosrius','malgrat de mar',
  'el masnou','masnou','mataro','montgat','orrius','palafolls','pineda de mar',
  'premia de dalt','premia de mar','sant andreu de llavaneres',
  'sant cebria de vallalta','sant iscle de vallalta','sant pol de mar',
  'sant vicenc de montalt','santa susanna','teia','tiana','tordera',
  'vilassar de dalt','vilassar de mar'
]);
const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
  .replace(/['’·]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();

function textValue(value){
  return String(value||'')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1')
    .replace(/<[^>]*>/g,' ')
    .replace(/&(?:amp|lt|gt|quot|apos|#39|#x27);/gi,entity=>{
      const key=entity.toLowerCase();
      return {'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&#39;':"'",'&#x27;':"'"}[key]||entity;
    }).replace(/&#(\d+);/g,(_,number)=>String.fromCodePoint(Math.min(Number(number),0x10ffff)))
    .replace(/\s+/g,' ').trim();
}
function field(ad,name){
  const match=new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+name+'>','i').exec(ad);
  return match?textValue(match[1]):'';
}
function isoDate(value){
  const ddmmyyyy=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  const yyyyMMdd=/^\d{4}-\d{2}-\d{2}$/.test(value)?value:null;
  const candidate=ddmmyyyy?ddmmyyyy[3]+'-'+ddmmyyyy[2]+'-'+ddmmyyyy[1]:yyyyMMdd;
  if(!candidate)return null;
  const date=new Date(candidate+'T00:00:00Z');
  return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===candidate?candidate:null;
}
function score(item,raw){
  const info=normalize(item.title+' '+raw);
  const terms=[/neuropsicolog/,/demenc|alzheimer|deteriorament cognitiu|deterioro cognitivo/,
    /geriatr|gerontol|gent gran|persones grans|personas mayores|residencia/,
    /terap|salut mental|salud mental|cogniti/];
  return terms.reduce((value,re,index)=>value+(re.test(info)?(5-index):0),0);
}
export function parseSocOffers(xml,day){
  if(typeof xml!=='string'||!/<ad(?:\s[^>]*)?>/i.test(xml))throw Error('SOC: XML sin registros de ofertas.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day))throw Error('SOC: fecha local no válida.');
  const limit=new Date(day+'T00:00:00Z');
  limit.setUTCDate(limit.getUTCDate()-7);
  const earliest=limit.toISOString().slice(0,10);
  const found=[];
  const seen=new Set();
  const records=xml.matchAll(/<ad(?:\s[^>]*)?>([\s\S]*?)<\/ad>/gi);
  for(const match of records){
    const ad=match[1];
    const title=field(ad,'title').slice(0,200);
    const titleNorm=normalize(title);
    if(!/\b(?:neuropsicolog\w*|psicolog\w*|psicoleg\w*|psicologia)\b/i.test(titleNorm))continue;
    const city=field(ad,'city').slice(0,100);
    const cityNorm=normalize(city);
    if(cityNorm!=='barcelona'&&!MARESME.has(cityNorm))continue;
    const date=isoDate(field(ad,'date'));
    if(!date||date<earliest||date>day)continue;
    const status=normalize(field(ad,'status'));
    if(status&&status!=='published')continue;
    const contract=field(ad,'contract').slice(0,180);
    const contractNorm=normalize(contract);
    if(!/(laboral|indefinid|tempor|interin|substituc|sustituc|fix discontinu)/.test(contractNorm))continue;
    if(/mercantil|autonom|freelance|practiqu|practic|voluntar|becari|becari|col laboraci/.test(contractNorm+' '+titleNorm))continue;
    const requirements=normalize(field(ad,'requirements')+' '+field(ad,'content'));
    if(/(?:imprescindible|obligatori|necessari|requisito obligatorio).{0,45}\bpir\b/i.test(requirements))continue;
    const sourceUrl=field(ad,'url');
    let url;
    try{url=new URL(sourceUrl);}catch{continue;}
    if(url.protocol!=='https:'||url.hostname!=='feinaactiva.gencat.cat'||!/^\/search\/offers\/detail\/FA\d+\/?$/.test(url.pathname))continue;
    const canon=url.origin+url.pathname;
    if(seen.has(canon))continue;
    const employer=field(ad,'company').slice(0,160);
    if(!employer)continue;
    seen.add(canon);
    const hours=field(ad,'workingHours').slice(0,150)||'No indicado';
    const min=field(ad,'salaryMin').replace(/[^\d.,]/g,'');
    const max=field(ad,'salaryMax').replace(/[^\d.,]/g,'');
    const salary=min&&max?(min===max?min:min+'–'+max)+' (según oferta, confirmar periodicidad)':'No indicado';
    const job={title,employer,municipality:city,posted:date,contract,hours,salary,
      fit:'Fuente: Feina Activa / SOC. Consulta los requisitos de la convocatoria.',url:canon};
    found.push({job,rank:score(job,field(ad,'content'))});
  }
  found.sort((a,b)=>b.rank-a.rank||b.job.posted.localeCompare(a.job.posted));
  return found.slice(0,35).map(item=>item.job);
}
export async function fetchSocJobs(day){
  const response=await fetch(SOC_URL,{signal:AbortSignal.timeout(45000),redirect:'error',
    headers:{'Accept':'application/xml,text/xml'}});
  if(!response.ok)throw Error('SOC: el feed público devuelve HTTP '+response.status+'.');
  const length=Number(response.headers.get('content-length')||0);
  if(length>14_000_000)throw Error('SOC: feed más grande de lo previsto.');
  const xml=await response.text();
  if(xml.length>14_000_000)throw Error('SOC: XML demasiado extenso.');
  const jobs=parseSocOffers(xml,day);
  console.log('SOC: XML comprobado, '+jobs.length+' candidaturas relevantes en los últimos siete días.');
  return jobs;
}
