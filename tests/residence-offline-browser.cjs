// Runs against the exported site served on OFFLINE_TEST_URL. Uses only synthetic records.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const server=require('node:child_process').spawn('python3',['-m','http.server','3120','--bind','127.0.0.1','--directory','out'],{stdio:'ignore'});
 for(let i=0;i<30;i++){try{if((await fetch('http://127.0.0.1:3120/admin/residencia/')).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1280,height:1000}}),page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 const keys=['assessments','reports','attendance','followups','goals','scales','interviews','incidents','meetings','documents'];
 let records=[{id:'fictitious-1',code:'TEST-001',center:'Centro ficticio',status:'active',revision:1,updated_at:'2026-10-21T09:00:00Z',data:{...Object.fromEntries(keys.map(k=>[k,[]])),profile:{name:'Persona ficticia',admission:'2026-01-01',room:'1'}}}];
 let offline=false,loseAck=false,patches=0,events=[];
 await context.route('https://grgyvdxkjdstdyumdfyg.supabase.co/**',async route=>{
  if(offline)return route.abort('internetdisconnected');
  const request=route.request(),url=new URL(request.url());
  if(url.pathname==='/auth/v1/user')return route.fulfill({json:{id:'9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'}});
  if(url.pathname==='/rest/v1/residence_records'){
   if(request.method()==='GET'){
    const id=url.searchParams.get('id')?.slice(3);let rows=records.filter(r=>!id||r.id===id);
    const offset=Number(url.searchParams.get('offset')||0),limit=Number(url.searchParams.get('limit')||rows.length);return route.fulfill({json:rows.slice(offset,offset+limit)});
   }
   const row=request.postDataJSON();if(request.method()==='PATCH'){
    const rev=Number(url.searchParams.get('revision')?.slice(3));if(!records.some(r=>r.id===row.id&&r.revision===rev))return route.fulfill({json:[]});patches++;
   }
   records=[...records.filter(r=>r.id!==row.id),row];if(loseAck){loseAck=false;return route.abort('connectionreset');}return route.fulfill({json:[row]});
  }
  if(url.pathname==='/rest/v1/residence_schedule_types')return route.fulfill({json:[{id:'type-1',label:'Valoración',color:'#173a5e',revision:1}]});
  if(url.pathname==='/rest/v1/residence_schedule'){
   if(request.method()==='GET'){const id=url.searchParams.get('id')?.slice(3);return route.fulfill({json:events.filter(e=>!id||e.id===id)});}
   const raw=request.postDataJSON(),batch=Array.isArray(raw)?raw:[raw];for(const e of batch)assert.equal('slot' in e,false);
   const returned=batch.map(e=>({...e,slot:'generated range'}));events=[...events.filter(e=>!batch.some(b=>b.id===e.id)),...returned];return route.fulfill({json:returned});
  }
  throw Error('Unexpected API '+url.pathname);
 });
 await page.addInitScript(()=>sessionStorage.setItem('dememoria_admin_session',JSON.stringify({access_token:'SYNTHETIC_TOKEN'})));
 const base=process.env.OFFLINE_TEST_URL||'http://127.0.0.1:3120';
 try{
  await page.goto(base+'/admin/residencia/');await page.getByRole('heading',{name:'Tu trabajo en residencia'}).waitFor();
  await page.getByText('Preparar este dispositivo para trabajar sin cobertura',{exact:true}).click();
  await page.getByLabel('Nueva contraseña de la copia local',{exact:true}).fill('Una clave ficticia segura');await page.getByLabel('Repetir contraseña',{exact:true}).fill('Una clave ficticia segura');
  await page.getByRole('button',{name:'Activar y descargar copia cifrada'}).click();
  await page.getByText('Opciones sin conexión',{exact:true}).waitFor({timeout:90000});await page.getByText('Opciones sin conexión',{exact:true}).click();await page.getByText(/Historiales descargados:/).waitFor();
  assert.equal(await page.evaluate(async()=>{const c=await caches.open('residence-shell-v1');return !!await c.match('/admin/residencia/');}),true);
  console.log('PASS: encrypted vault and complete shell prepared');
  await page.getByRole('button',{name:'Residentes',exact:true}).click();await page.getByRole('button',{name:/Persona ficticia/}).click();
  offline=true;await context.setOffline(true);
  await page.getByLabel('Nombre y apellidos',{exact:true}).fill('Nombre local ficticio');await page.getByRole('button',{name:'Guardar ficha',exact:true}).click();
  await page.getByText('Guardado en este dispositivo. Pendiente de sincronizar.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Diario',exact:true}).click();await page.getByRole('button',{name:'+ Nueva entrada',exact:true}).click();
  await page.getByLabel('Cognición',{exact:true}).check();await page.getByLabel('Entrada del diario *',{exact:true}).fill('Observación clínica completamente ficticia.');
  await page.getByRole('button',{name:'Guardar registro',exact:true}).click();await page.getByText('Guardado en este dispositivo. Pendiente de sincronizar.',{exact:true}).waitFor();
  assert.equal(records[0].data.profile.name,'Persona ficticia');
  const vault=await page.evaluate(async()=>{const d=await new Promise((resolve,reject)=>{const r=indexedDB.open('dememoria-residence-encrypted-v1',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});const v=await new Promise(resolve=>{const r=d.transaction('vault').objectStore('vault').get('main');r.onsuccess=()=>resolve(r.result);});d.close();return {keys:Object.keys(v),ciphertext:new TextDecoder().decode(v.data)};});
  assert.deepEqual(vault.keys.sort(),['data','iv','salt','version']);assert.equal(vault.ciphertext.includes('Observación clínica'),false);
  await page.reload();await page.getByRole('button',{name:'Desbloquear copia local',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Residentes',exact:true}).count(),0);
  await page.getByLabel('Contraseña de la copia local',{exact:true}).fill('contraseña incorrecta');await page.getByRole('button',{name:'Desbloquear copia local',exact:true}).click();await page.getByText(/Contraseña incorrecta/).waitFor();
  await page.getByLabel('Contraseña de la copia local',{exact:true}).fill('Una clave ficticia segura');await page.getByRole('button',{name:'Desbloquear copia local',exact:true}).click();
  await page.getByRole('button',{name:'Residentes',exact:true}).click();await page.getByRole('button',{name:/Nombre local ficticio/}).click();await page.getByRole('button',{name:'Diario',exact:true}).click();
  await page.getByText('Observación clínica completamente ficticia.',{exact:false}).waitFor();console.log('PASS: offline save, encrypted data, reload and password unlock preserve the diary');
  await page.getByText('Opciones sin conexión',{exact:true}).click();
  // A server change in an independent field must survive synchronization.
  records[0].data.profile.room='2';records[0].revision=2;loseAck=true;
  offline=false;await context.setOffline(false);
  await page.getByRole('button',{name:'Sincronizar ahora',exact:true}).click();
  // The first transmission is accepted but the connection closes before the acknowledgment.
  await page.getByRole('button',{name:'Sincronizar ahora',exact:true}).waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('.res-offline')?.textContent.includes('guardados pendientes'));
  await page.getByRole('button',{name:'Sincronizar ahora',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.res-offline')?.textContent.includes('Todo sincronizado'),{timeout:30000});
  assert.equal(records[0].data.profile.room,'2');assert.equal(records[0].data.profile.name,'Nombre local ficticio');assert.equal(records[0].data.followups.length,1);
  console.log('PASS: independent server change survives and lost acknowledgment does not duplicate diary entries');
  // An already-open editor must retain its original base after a merged synchronization.
  await page.getByRole('button',{name:'Historia clínica',exact:true}).click();await page.getByLabel('Nombre y apellidos',{exact:true}).fill('Segundo nombre local');
  await page.getByRole('button',{name:'Guardar ficha',exact:true}).click();
  await page.getByRole('button',{name:'Sincronizar ahora',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.res-offline')?.textContent.includes('Todo sincronizado'));
  assert.equal(records[0].data.profile.room,'2');assert.equal(records[0].data.followups.length,1);
  // Same-field simultaneous edits must stop rather than silently overwrite.
  offline=true;await context.setOffline(true);await page.getByLabel('Nombre y apellidos',{exact:true}).fill('Nombre elegido en dispositivo');await page.getByRole('button',{name:'Guardar ficha',exact:true}).click();await page.getByText('Guardado en este dispositivo. Pendiente de sincronizar.',{exact:true}).waitFor();
  records[0].data.profile.name='Nombre cambiado en servidor';records[0].revision++;
  offline=false;await context.setOffline(false);await page.getByRole('button',{name:'Sincronizar ahora',exact:true}).click();
  await page.getByRole('button',{name:'Conservar mis campos en conflicto',exact:true}).waitFor();assert.equal(records[0].data.profile.name,'Nombre cambiado en servidor');
  await page.getByRole('button',{name:'Conservar mis campos en conflicto',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.res-offline')?.textContent.includes('Todo sincronizado'));
  assert.equal(records[0].data.profile.name,'Nombre elegido en dispositivo');assert.equal(records[0].data.profile.room,'2');assert.equal(records[0].data.followups.length,1);
  console.log('PASS: contradictory edits require review and explicit resolution preserves independent fields');
  await page.getByRole('button',{name:'Horario',exact:true}).click();await page.getByRole('button',{name:'+ Programar actividad',exact:true}).waitFor();
  offline=true;await context.setOffline(true);await page.getByRole('button',{name:'+ Programar actividad',exact:true}).click();await page.getByLabel('Título de la actividad',{exact:true}).fill('Valoración ficticia sin conexión');await page.getByRole('button',{name:'Guardar actividad',exact:true}).click();await page.getByText('Actividad guardada en este dispositivo. Pendiente de sincronizar.',{exact:true}).waitFor();
  offline=false;await context.setOffline(false);await page.getByRole('button',{name:'Sincronizar ahora',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.res-offline')?.textContent.includes('Todo sincronizado'));assert.equal(events.length,1);
  await page.getByRole('button',{name:/Valoración ficticia sin conexión/}).click();await page.getByLabel('Título de la actividad',{exact:true}).fill('Valoración ficticia modificada');await page.getByRole('button',{name:'Guardar actividad',exact:true}).click();await page.getByRole('button',{name:'Sincronizar ahora',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.res-offline')?.textContent.includes('Todo sincronizado'));assert.equal(events[0].title,'Valoración ficticia modificada');
  console.log('PASS: offline schedule creation and later editing omit generated database columns');
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/residence-offline-mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.getByRole('button',{name:'Bloquear copia local',exact:true}).click();await page.getByRole('button',{name:'Desbloquear copia local',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Residentes',exact:true}).count(),0);
  // Cold start from the native app's home URL falls back to the prepared residence shell.
  offline=true;await context.setOffline(true);await page.goto(base+'/admin/?source=android');await page.getByRole('button',{name:'Desbloquear copia local',exact:true}).waitFor();
  assert.equal(new URL(page.url()).pathname,'/admin/residencia/');
  const cached=await page.evaluate(async()=>{const c=await caches.open('residence-shell-v1');return (await c.keys()).map(r=>r.url);});assert.equal(cached.some(u=>u.includes('supabase')||u.includes('/api/')),false);
  assert.deepEqual(errors,[]);console.log('PASS: mobile layout, lock, offline app launch and no clinical HTTP cache');
 }finally{await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exit(1);});
