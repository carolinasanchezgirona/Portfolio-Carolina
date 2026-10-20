const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
const page=await browser.newPage({viewport:{width:1400,height:1000}});
let tasks=[],notes=[],conflict=false;
await page.route('https://grgyvdxkjdstdyumdfyg.supabase.co/**',async route=>{
const req=route.request(),url=new URL(req.url());let body;
if(url.pathname==='/auth/v1/user')body={id:'9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'};
else if(url.pathname==='/rest/v1/clinical_admin_tasks'){
 assert.equal(url.searchParams.get('patient_id'),req.method()==='POST'?null:'is.null');
 if(req.method()==='GET')body=tasks;else{const value=req.postDataJSON();assert.equal(value.patient_id,null);tasks=[value,...tasks.filter(t=>t.id!==value.id)];body=[value];}
}else if(url.pathname==='/rest/v1/professional_notebook'){
 if(req.method()==='GET')body=notes;else if(conflict){body=[];conflict=false;}else{const value=req.postDataJSON();notes=[value];body=[value];}
}else return route.abort();await route.fulfill({json:body});});
await page.addInitScript(()=>sessionStorage.setItem('dememoria_admin_session',JSON.stringify({access_token:'TEST_ONLY'})));
await page.goto('http://localhost:3000/admin/tareas/');
await page.getByRole('button',{name:'+ Nueva tarea',exact:true}).click();
await page.getByLabel('Qué tengo que hacer',{exact:true}).fill('Preparar documentación del centro');
await page.getByLabel('Fecha límite (opcional)',{exact:true}).fill('2026-01-01');
await page.getByLabel(/Prioridad/).selectOption('high');
await page.getByLabel('Detalles',{exact:true}).fill('Revisar el material pendiente.');
await page.getByRole('button',{name:'Guardar tarea',exact:true}).click();
await page.locator('.professional-task').getByRole('heading',{name:'Preparar documentación del centro'}).waitFor();
assert.equal(tasks.length,1);assert.equal(tasks[0].priority,'high');
await page.getByRole('button',{name:'Marcar hecha',exact:true}).click();await page.getByText('No hay tareas en esta vista.',{exact:true}).waitFor();
await page.getByLabel(/Mostrar/).selectOption('done');
await page.getByRole('button',{name:'Reabrir',exact:true}).click();await page.getByText('No hay tareas en esta vista.',{exact:true}).waitFor();
await page.getByLabel(/Mostrar/).selectOption('overdue');await page.locator('.professional-task').waitFor();
await page.getByLabel('Mis notas',{exact:true}).fill('Llamar al centro y revisar facturas.');await page.getByRole('button',{name:'Guardar notas',exact:true}).click();await page.getByText('Notas guardadas.',{exact:true}).waitFor();assert.equal(notes[0].revision,1);
await page.reload();await page.getByLabel('Mis notas',{exact:true}).waitFor();assert.equal(await page.getByLabel('Mis notas',{exact:true}).inputValue(),'Llamar al centro y revisar facturas.');
await page.getByLabel('Mis notas',{exact:true}).fill('Borrador conservado');conflict=true;await page.getByRole('button',{name:'Guardar notas',exact:true}).click();await page.getByText(/Las notas han cambiado en otra ventana/).waitFor();assert.equal(await page.getByLabel('Mis notas',{exact:true}).inputValue(),'Borrador conservado');
await page.screenshot({path:'/tmp/professional-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/professional-mobile.png',fullPage:true});
const anon=await browser.newPage();await anon.goto('http://localhost:3000/admin/tareas/');await anon.getByText('Inicia sesión para abrir tu agenda profesional.',{exact:true}).waitFor();assert.equal(await anon.getByLabel('Mis notas',{exact:true}).count(),0);
await browser.close();console.log('PASS: independent tasks, due date and priority, complete/reopen, notebook persistence and conflicts, anonymous gate, mobile width');
})().catch(e=>{console.error(e);process.exit(1)});
