const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const routes=['/admin/','/admin/clinica/?panel=1&view=patients','/admin/agenda/','/admin/residencia/','/admin/tareas/','/admin/economia/','/admin/mensajes/','/admin/notificaciones/','/admin/articulos/','/admin/recursos/','/admin/preguntas/','/admin/marketing/','/admin/clinica/materiales-externos/'];
(async()=>{
 const server=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'dev','--hostname','127.0.0.1','--port','3300'],{stdio:'ignore'});let browser;
 try{for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:3300/admin/',{signal:AbortSignal.timeout(4000)})).ok)break;}catch{}if(i===49)throw Error('Server unavailable');await new Promise(r=>setTimeout(r,400));}
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({serviceWorkers:'allow',timezoneId:'Europe/Madrid'}),owner='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2';
 await context.addInitScript(owner=>{if(window.top===window)sessionStorage.setItem('dememoria_admin_session',JSON.stringify({access_token:'TEST_ONLY',refresh_token:'TEST',expires_at:9999999999,user:{id:owner,email:'test@example.org'}}));},owner);
 await context.route('https://grgyvdxkjdstdyumdfyg.supabase.co/**',async route=>{const u=new URL(route.request().url());await route.fulfill({json:u.pathname.endsWith('/user')?{id:owner}:u.pathname.endsWith('/token')?{access_token:'TEST_ONLY',user:{id:owner}}:[],headers:{'Content-Range':'0-0/0'}});});
 await context.route('**/api/**',async route=>{const p=new URL(route.request().url()).pathname;let data={ok:true,configured:true,items:[],notifications:[],unread:0,counts:{},messages:[],threads:[]};if(p.includes('brevo'))data={connected:true,list_found:true,subscriber_count:0};if(p.includes('messages'))data={messages:[],threads:[],authorized:true};await route.fulfill({json:data});});
 await context.route('**/sw.js',route=>route.fulfill({contentType:'application/javascript',body:'/* inert worker for isolated UX checks */'}));
 const page=await context.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));const results=[];
 for(const route of routes){for(const width of [1440,820,390]){
  errors=[];await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:3300'+route);await page.waitForTimeout(700);
  const report=await page.evaluate(()=>{const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';};const nav=document.querySelector('.admin-workspace-nav');const n=nav&&visible(nav)?nav.getBoundingClientRect():null;
   const main=document.querySelector('main'),head=[...document.querySelectorAll('main h1,main h2')].filter(visible);return {url:location.pathname,heading:head.map(e=>e.textContent.trim()).slice(0,3),overflow:document.documentElement.scrollWidth>innerWidth+1,overflowing:[...document.querySelectorAll('main *')].filter(visible).filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+2&&getComputedStyle(e).position!=='absolute';}).slice(0,6).map(e=>e.tagName+'.'+e.className),nav:n?{position:getComputedStyle(nav).position,left:n.left,right:n.right,bottom:n.bottom,labels:nav.innerText.trim().slice(0,100)}:null,navOverlaps:n&&getComputedStyle(nav).position==='fixed'&&n.top<200?head.filter(e=>{const r=e.getBoundingClientRect();return r.left<n.right&&r.right>n.left&&r.top<n.bottom&&r.bottom>n.top;}).map(e=>e.textContent.trim()):[],unlabelled:[...document.querySelectorAll('main input:not([type=hidden]),main select,main textarea')].filter(visible).filter(e=>!e.labels?.length&&!e.getAttribute('aria-label')&&!e.getAttribute('aria-labelledby')).map(e=>e.id||e.outerHTML.slice(0,80)).slice(0,8)};});
  results.push({route,width,...report,errors:[...errors]});console.log(JSON.stringify(results.at(-1)));
 }}
 fs.writeFileSync('/tmp/admin-ux-audit.json',JSON.stringify(results,null,2));
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
