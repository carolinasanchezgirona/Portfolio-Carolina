// Run against the static build served on port 3100. All clinical data is fictitious.
const assert=require('node:assert/strict');
const {readFileSync,mkdirSync}=require('node:fs');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
(async()=>{
 const server=require('node:child_process').spawn('python3',['-m','http.server','3100','--bind','127.0.0.1','--directory','out'],{stdio:['ignore','ignore','pipe']});server.stderr.on('data',data=>{if(process.env.RESIDENCE_DEBUG)process.stderr.write(data)});
 for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:3100/admin/residencia/',{signal:AbortSignal.timeout(2000)})).ok)break;}catch{}if(i===59){server.kill();throw Error('Static server failed to start');}await new Promise(resolve=>setTimeout(resolve,100));}
 let page;const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},timezoneId:'Europe/Madrid',serviceWorkers:'block',acceptDownloads:true});
  page=await context.newPage();const errors=[];page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install({time:new Date('2026-10-23T12:00:00Z')});
  const data=()=>Object.fromEntries(['assessments','reports','attendance','followups','goals','scales','interviews','incidents','meetings','documents'].map(k=>[k,[]]));
  let residents=['Esta semana','Semana siguiente','Archivada'].map((name,i)=>({id:'ficticia-'+i,code:'F-'+i,center:'Centro ficticio',revision:1,status:i===2?'archived':'active',data:{...data(),profile:{name,admission:'2026-01-01',piaiReviewPending:'true',piaiReviewDate:i===0?'2026-10-23':'2026-10-26',preferences:'PREFERENCIAS FICTICIAS'},goals:[{id:'goal-'+i,date:'2026-01-01',objective:'OBJETIVO FICTICIO '+name,state:'En curso',indicator:'Dos participaciones',responsible:'Profesional ficticia',next:i===0?'2026-10-23':'2026-10-26'}]}}));
  residents[0].data.followups=[{id:'note',date:'2026-10-01',observation:'DIARIO SOLO VOLCADO COMPLETO',topics:'["Cognición"]'}];
  residents[0].data.scales=[{id:'clock',date:'2026-10-01',instrument:'Test del reloj',clockImage:'data:image/png;base64,'+readFileSync('tests/fixtures/residence-clock.png').toString('base64')}];
  let campaign={id:'campaign',title:'Campaña ficticia',center:'Centro ficticio',start_date:'2026-10-19',target_count:2,revision:1,data:{weeks:4,slotMinutes:30,slots:[{id:'slot',date:'2026-10-23',start_min:600,end_min:630,resident_id:'ficticia-0',status:'planned',notes:'Cita ficticia'}]}};
  let failMaterials=false,taskOffsets=[];
  await context.route('https://grgyvdxkjdstdyumdfyg.supabase.co/**',async route=>{
   const req=route.request(),url=new URL(req.url());let body=[];
   if(url.pathname==='/auth/v1/user')body={id:'9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'};
   else if(url.pathname==='/rest/v1/residence_records'){if(req.method()==='GET')body=residents;else{const row=req.postDataJSON();residents=residents.map(r=>r.id===row.id?row:r);body=[row];}}
   else if(url.pathname==='/rest/v1/residence_assessment_campaigns'){if(req.method()==='GET')body=[campaign];else{assert.equal(url.searchParams.get('revision'),'eq.'+campaign.revision);campaign=req.postDataJSON();body=[campaign];}}
   else if(url.pathname==='/rest/v1/clinical_admin_tasks'){
    assert.equal(url.searchParams.get('note'),'eq.residence-checklist-v1');
    const offset=Number(url.searchParams.get('offset')||0);taskOffsets.push(offset);body=offset===0?Array.from({length:500},(_,i)=>({id:'task-'+i,title:'[Residencia] Tarea ficticia '+i,status:'done',due_at:'2026-10-23',completed_at:'2026-10-23'})):offset===500?[{id:'task-last',title:'[Residencia] ULTIMA TAREA PAGINADA',status:'open',due_at:'2026-10-23'}]:[];
   }else if(url.pathname==='/rest/v1/residence_materials'&&failMaterials){await route.fulfill({status:500,json:{error:'fictitious'}});return;}
   await route.fulfill({json:body});
  });
  await context.addInitScript(()=>sessionStorage.setItem('dememoria_admin_session',JSON.stringify({access_token:'TEST_FICTITIOUS_TOKEN'})));
  await page.goto('http://127.0.0.1:3100/admin/residencia/');await page.getByRole('heading',{name:'Tu trabajo en residencia'}).waitFor();
  await page.locator('.res-today-list').getByText('10:00-10:30 · Esta semana',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Exportar PDF',exact:true}).click();
  const panel=page.getByRole('region',{name:'Exportaciones de residencia'});
  await panel.getByLabel('Solo PIAI de la semana',{exact:true}).check();
  assert.equal(await panel.locator('.res-export-residents li').count(),1);
  const output=process.env.RESIDENCE_PDF_QA_DIR||'/tmp/residence-pdf-browser';mkdirSync(output,{recursive:true});
  async function download(name,file){const waiting=page.waitForEvent('download');await panel.getByRole('button',{name,exact:true}).click();const saved=await waiting;await saved.saveAs(output+'/'+file);assert((await saved.failure())===null);return execFileSync('pdftotext',[output+'/'+file,'-'],{encoding:'utf8'});}
  const weekly=await download('Descargar PIAI semanal en PDF','weekly.pdf');assert.match(weekly,/OBJETIVO FICTICIO Esta semana/);assert.doesNotMatch(weekly,/DIARIO SOLO|OBJETIVO FICTICIO Semana siguiente|Archivada/);
  await panel.getByRole('button',{name:'Semana siguiente →',exact:true}).click();assert.equal(await panel.locator('.res-export-residents li').count(),1);assert.match(await panel.locator('.res-export-residents').innerText(),/Semana siguiente/);
  await panel.getByRole('button',{name:'← Semana anterior',exact:true}).click();
  await panel.getByLabel('Volcado completo',{exact:true}).check();const full=await download('Descargar volcado completo en PDF','complete.pdf');
  assert.match(full,/DIARIO SOLO VOLCADO COMPLETO/);assert.match(full,/OBJETIVO FICTICIO Semana siguiente/);assert.match(full,/OBJETIVO FICTICIO Archivada/);assert.match(full,/ULTIMA TAREA PAGINADA/);assert(taskOffsets.includes(500));
  await panel.getByLabel('Un residente',{exact:true}).check();await panel.getByLabel('Residente del volcado individual',{exact:true}).selectOption('ficticia-0');
  const individual=await download('Descargar historial del residente en PDF','individual.pdf');assert.match(individual,/DIARIO SOLO VOLCADO COMPLETO/);assert.doesNotMatch(individual,/OBJETIVO FICTICIO Semana siguiente|OBJETIVO FICTICIO Archivada|ULTIMA TAREA PAGINADA|Campañas de valoración/);
  await panel.getByLabel('Residente del volcado individual',{exact:true}).selectOption('ficticia-2');const archived=await download('Descargar historial del residente en PDF','archived.pdf');assert.match(archived,/OBJETIVO FICTICIO Archivada/);assert.doesNotMatch(archived,/DIARIO SOLO VOLCADO COMPLETO/);
  await panel.getByLabel('Volcado completo',{exact:true}).check();
  failMaterials=true;await panel.getByRole('button',{name:'Descargar volcado completo en PDF',exact:true}).click();await panel.getByText(/No se ha completado la exportación/).waitFor();failMaterials=false;
  for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Export overflow at '+width);}
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:output+'/exports-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Exportar PDF',exact:true}).click();
  const nav=page.getByRole('navigation',{name:'Secciones de residencia'});await nav.getByRole('button',{name:'Horario',exact:true}).click();
  await page.getByRole('button',{name:'Campañas de valoración',exact:true}).click();await page.getByLabel('Vista de campaña').selectOption('week');await page.locator('.res-assessment-slot').first().click();
  await page.getByRole('button',{name:'Registrar valoración de esta cita',exact:true}).click();
  await page.getByLabel('Síntesis e implicaciones para el PIAI',{exact:true}).fill('SÍNTESIS CLÍNICA FICTICIA');await page.getByRole('button',{name:'Guardar registro',exact:true}).click();
  await page.getByText('Valoración guardada y cita marcada como realizada.',{exact:true}).waitFor();assert.equal(campaign.data.slots[0].status,'done');assert.equal(residents[0].data.assessments[0].next,'2027-04-23');
  const directDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar historial completo en PDF',exact:true}).click();const direct=await directDownload;await direct.saveAs(output+'/individual-direct.pdf');const directText=execFileSync('pdftotext',[output+'/individual-direct.pdf','-'],{encoding:'utf8'});assert.match(directText,/SÍNTESIS CLÍNICA FICTICIA/);assert.doesNotMatch(directText,/OBJETIVO FICTICIO Semana siguiente|Archivada/);
  await page.getByRole('navigation',{name:'Áreas clínicas del historial'}).getByRole('button',{name:'Diario',exact:true}).click();await page.getByRole('button',{name:'+ Nueva entrada',exact:true}).click();
  await page.getByLabel('Cognición',{exact:true}).check();await page.getByLabel('Entrada del diario *',{exact:true}).fill('Nota ficticia de coordinación');await page.getByLabel('Contabilizar como seguimiento mensual',{exact:true}).uncheck();
  await page.getByRole('button',{name:'Guardar registro',exact:true}).click();await page.getByText('Guardado correctamente.',{exact:true}).waitFor();assert.equal(residents[0].data.followups.at(-1).countForMonthly,'false');
  await nav.getByRole('button',{name:'Inicio',exact:true}).click();const summary=page.locator('#res-pending-goals .res-review-item').filter({hasText:'Esta semana'});await summary.getByLabel('Revisión PIAI de Esta semana',{exact:true}).fill('2026-10-30');await page.getByText('PIAI añadido a pendientes de revisión.',{exact:true}).waitFor();assert.equal(residents[0].data.profile.piaiReviewDate,'2026-10-30');
  await page.screenshot({path:output+'/home-mobile.png',fullPage:true});assert.deepEqual(errors,[]);
  console.log('PASS: direct PDFs, individual selector and record button, archived residents, weekly boundaries, full pagination, images, failed-source block, mobile layout, campaign completion, follow-up exclusion and PIAI dates');
 }catch(error){if(page){await page.screenshot({path:'/tmp/residence-export-failure.png',fullPage:true});require('node:fs').writeFileSync('/tmp/residence-export-failure.html',await page.content());}throw error;}finally{await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
