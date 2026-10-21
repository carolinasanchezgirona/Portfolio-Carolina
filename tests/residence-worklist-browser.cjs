const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const server=process.env.RESIDENCE_START_SERVER?require('node:child_process').spawn(process.execPath,[require.resolve('next/dist/bin/next'),'dev','--hostname','127.0.0.1','--port','3100'],{stdio:'ignore'}):null;
 if(server){for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:3100/admin/residencia/',{signal:AbortSignal.timeout(3000)})).ok)break;}catch{}if(i===59){server.kill();throw Error('Server not ready');}await new Promise(r=>setTimeout(r,500));}}
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
 const context=await browser.newContext({viewport:{width:1280,height:1000},timezoneId:'Europe/Madrid',serviceWorkers:'block'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install({time:new Date('2026-10-21T12:00:00Z')});
 const registries=()=>Object.fromEntries(['assessments','scales','goals','followups','reports','interviews','attendance','incidents','meetings','documents'].map(k=>[k,[]]));
 let residents=[0,1,2].map((count,i)=>({id:'test-'+i,code:'R-'+i,center:'Centro ficticio',status:'active',revision:1,data:{...registries(),profile:{name:'Persona '+i,admission:'2026-01-01'},followups:Array.from({length:count},(_,j)=>({id:'followup-'+j,date:j===0?'2026-10-05':'2026-10-20',observation:'Registro ficticio',topics:'["Cognición"]'}))}}));
 residents.push({...residents[0],id:'archived',status:'archived',data:{...registries(),profile:{name:'Archivada'}}});
 let tasks=[];
 await context.route('https://grgyvdxkjdstdyumdfyg.supabase.co/**',async route=>{
  const req=route.request(),u=new URL(req.url());let body;
  if(u.pathname==='/auth/v1/user')body={id:'9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'};
  else if(u.pathname==='/rest/v1/residence_records'){
   if(req.method()==='GET')body=residents;
   else{const row=req.postDataJSON();residents=residents.map(r=>r.id===row.id?row:r);body=[row];}
  }else if(u.pathname==='/rest/v1/clinical_admin_tasks'){
   if(req.method()==='GET')body=tasks;
   else if(req.method()==='POST'){body=req.postDataJSON();assert(Array.isArray(body));assert(body.every(t=>t.patient_id===null&&t.note==='residence-checklist-v1'&&t.due_at==='2026-10-25T12:00:00Z'));tasks.push(...body);}
   else{const id=u.searchParams.get('id').slice(3);const before=tasks.find(t=>t.id===id);assert.equal(u.searchParams.get('updated_at'),'eq.'+before.updated_at);const updated={...before,...req.postDataJSON()};tasks=tasks.map(t=>t.id===id?updated:t);body=[updated];}
  }else if(['/rest/v1/residence_schedule','/rest/v1/residence_schedule_types'].includes(u.pathname))body=[];
  else throw Error('Unexpected request '+u.pathname);
  await route.fulfill({json:body});
 });
 await context.addInitScript(()=>sessionStorage.setItem('dememoria_admin_session',JSON.stringify({access_token:'TEST_TOKEN'})));
 await page.goto(process.env.RESIDENCE_BASE_URL||'http://127.0.0.1:3100/admin/residencia/');
 const upcoming=page.locator('section[aria-labelledby="res-upcoming-title"]');
 await upcoming.getByText('Persona 0',{exact:true}).waitFor();
 assert.equal(await upcoming.locator('.res-review-item').count(),3);
 assert.match(await upcoming.innerText(),/0\/2 realizados/);assert.match(await upcoming.innerText(),/1\/2 realizados/);assert.match(await upcoming.innerText(),/2\/2 realizados/);
 assert.match(await upcoming.innerText(),/15\/10\/2026/);assert.match(await upcoming.innerText(),/31\/10\/2026/);assert.match(await upcoming.innerText(),/15\/11\/2026/);
 const checklist=page.locator('.res-task-checklist');await checklist.getByText('No hay tareas pendientes.',{exact:true}).waitFor();
 await checklist.locator('summary').filter({hasText:'Elegir funciones habituales'}).click();
 await checklist.getByLabel('Entrevista con la familia',{exact:true}).check();await checklist.getByLabel('Elaboración de informe',{exact:true}).check();
 await checklist.getByLabel('Fecha de las tareas',{exact:true}).fill('2026-10-25');await checklist.getByRole('button',{name:'Añadir tareas (2)',exact:true}).click();
 await checklist.getByText('Tareas añadidas.',{exact:true}).waitFor();assert.equal(tasks.length,2);
 await checklist.locator('ul').first().getByRole('checkbox').first().click();await checklist.getByText('Tarea actualizada.',{exact:true}).waitFor();assert.equal(tasks.filter(t=>t.status==='done').length,1);
 await page.reload();await checklist.getByText('1 pendientes.',{exact:false}).waitFor();assert.match(await checklist.innerText(),/Completadas \(1\)/);
 await upcoming.locator('.res-review-item').filter({hasText:'Persona 0'}).getByRole('button',{name:'Registrar seguimiento'}).click();
 await page.getByLabel('Cognición',{exact:true}).check();await page.getByLabel('Entrada del diario *',{exact:true}).fill('Seguimiento individual ficticio de prueba.');
 await page.getByRole('button',{name:'Guardar registro',exact:true}).click();await page.getByText('Guardado correctamente.',{exact:true}).waitFor();
 await page.getByRole('navigation',{name:'Secciones de residencia'}).getByRole('button',{name:'Inicio',exact:true}).click();
 const person=upcoming.locator('.res-review-item').filter({hasText:'Persona 0'});await person.getByText('Centro ficticio · 1/2 realizados este mes',{exact:true}).waitFor();assert.match(await person.innerText(),/31\/10\/2026/);
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);console.log('PASS: monthly plans, batch tasks, completion, reload persistence, saved diary updates and mobile layout');
 }finally{await browser.close();server?.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
