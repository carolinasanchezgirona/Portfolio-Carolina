const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
(async()=>{
 const server=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'dev','--hostname','127.0.0.1','--port','3400'],{stdio:'ignore'});let browser;
 try{
  for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:3400/admin/',{signal:AbortSignal.timeout(4000)})).ok)break;}catch{}if(i===49)throw Error('Server unavailable');await new Promise(r=>setTimeout(r,400));}
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
  const context=await browser.newContext({serviceWorkers:'block',timezoneId:'Europe/Madrid',viewport:{width:1440,height:1000}});
  const owner='9d2cfdb1-fed6-4f76-b47a-d58507eb14f2';let articles=[],failSave=true,writes=0;
  await context.addInitScript(owner=>{if(window.top===window)sessionStorage.setItem('dememoria_admin_session',JSON.stringify({access_token:'TEST_ONLY',expires_at:9999999999,user:{id:owner}}));},owner);
  await context.route('https://grgyvdxkjdstdyumdfyg.supabase.co/**',async route=>{
   const req=route.request(),u=new URL(req.url());let body=[];
   if(u.pathname.endsWith('/user'))body={id:owner};
   else if(u.pathname==='/rest/v1/articles'){
    if(req.method()==='GET')body=articles;
    else{writes++;if(failSave)return route.fulfill({status:503,json:{message:'Fallo de guardado simulado'}});const row={...req.postDataJSON(),id:'article-test'};articles=[row];body=[row];}
   }
   await route.fulfill({json:body});
  });
  await context.route('**/api/**',async route=>{const u=new URL(route.request().url());let body={ok:true,configured:true,items:[],notifications:[],unread:0};
   if(u.pathname.includes('brevo'))body={connected:true,list_found:true,subscriber_count:0};
   if(u.pathname.includes('patient-messages')){const patient=u.searchParams.get('patient_id');body={messages:patient?[]:['p1','p2'].map((id,i)=>({id:'m'+i,patient_id:id,sender:'patient',read_at:null,created_at:'2026-10-21T09:00:00Z',patient:{full_name:'Persona ficticia '+(i+1)}}))};}
   await route.fulfill({json:body});
  });
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:3400/admin/');await page.locator('#admin-home:not([hidden])').waitFor();
  await page.getByLabel('Buscar una herramienta',{exact:true}).fill('residencia');assert.equal(await page.locator('.admin-hub-module:visible').count(),1);assert.match(await page.locator('.admin-hub-module:visible').innerText(),/Residencia/);
  await page.getByLabel('Buscar una herramienta',{exact:true}).fill('sin-coincidencias');await page.getByText('No hay herramientas con esa búsqueda.',{exact:true}).waitFor();
  assert(await page.evaluate(()=>document.querySelector('.admin-hub-priority-section').compareDocumentPosition(document.querySelector('#admin-hub-tools'))&Node.DOCUMENT_POSITION_FOLLOWING));
  await page.goto('http://127.0.0.1:3400/admin/marketing/');const menu=page.locator('.admin-workspace-more');await menu.locator('summary').click();await page.keyboard.press('Escape');assert.equal(await menu.getAttribute('open'),null);assert(await menu.locator('summary').evaluate(e=>e===document.activeElement));
  await menu.locator('summary').click();await page.getByRole('heading',{name:'Suscriptores y captación',exact:true}).click();assert.equal(await menu.getAttribute('open'),null);
  await page.goto('http://127.0.0.1:3400/admin/articulos/');await page.locator('#articles-app:not([hidden])').waitFor();await page.locator('#article-new').click();await page.locator('#article-title').fill('Un borrador de prueba');await page.locator('#article-content').fill('Contenido ficticio para verificar que no se pierde al navegar.');
  await page.locator('#article-save-draft').evaluate(button=>{button.click();button.click();});await page.getByText('Fallo de guardado simulado',{exact:true}).waitFor();assert(await page.evaluate(()=>window.adminUX.isDirty('article-form')));
  page.once('dialog',d=>d.dismiss());await page.locator('.admin-workspace-nav>a[href="/admin/"]').click();assert.equal(new URL(page.url()).pathname,'/admin/articulos/');assert.equal(await page.locator('#article-title').inputValue(),'Un borrador de prueba');
  failSave=false;await page.locator('#article-save-draft').click();await page.getByText('Borrador guardado.',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>window.adminUX.isDirty('article-form')),false);assert.equal(writes,2);
  await page.locator('.admin-workspace-nav>a[href="/admin/"]').click();await page.waitForURL('**/admin/');
  await page.goto('http://127.0.0.1:3400/admin/mensajes/');await page.locator('.private-messages select').selectOption('p1');await page.getByLabel('Responder al paciente',{exact:true}).fill('Borrador privado de prueba.');await page.locator('.private-messages select').selectOption('p2');assert.equal(await page.getByLabel('Responder al paciente',{exact:true}).inputValue(),'');await page.locator('.private-messages select').selectOption('p1');assert.equal(await page.getByLabel('Responder al paciente',{exact:true}).inputValue(),'Borrador privado de prueba.');
  await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  console.log('PASS: hub search/priority order, keyboard/outside menu dismissal, failed save preserves draft, canceled navigation, successful save clears guard, per-conversation drafts and mobile layout');
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
