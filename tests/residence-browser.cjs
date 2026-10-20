const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage']}: {})});const page=await browser.newPage({viewport:{width:1400,height:1000}});
 let records=[],conflict=false;
 await page.route('https://grgyvdxkjdstdyumdfyg.supabase.co/**',async route=>{
 const req=route.request(),url=new URL(req.url());let body;
 if(url.pathname==='/auth/v1/user')body={id:'9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'};
 else if(url.pathname==='/rest/v1/residence_records'){
 if(req.method()==='GET')body=records;
 else {const payload=req.postDataJSON();if(conflict){body=[];conflict=false;}else{records=[payload];body=[payload];}}
 }else return route.abort();
 await route.fulfill({json:body});});
 await page.addInitScript(()=>sessionStorage.setItem('dememoria_admin_session',JSON.stringify({access_token:'TEST_ONLY'})));
 await page.goto('http://localhost:3000/admin/residencia/');
 await page.getByRole('button',{name:'+ Nuevo residente'}).click();
 await page.getByLabel('Código interno *',{exact:true}).fill('R-001');await page.getByLabel('Centro *',{exact:true}).fill('Centro de prueba');
 await page.getByRole('button',{name:'Guardar ficha',exact:true}).click();await page.getByRole('status').filter({hasText:'Guardado correctamente.'}).waitFor();
 for(const [tab,required,text] of [
 ['Valoraciones semestrales','Síntesis e implicaciones para el PIAI','Mantener apoyos'],
 ['Informes','Título','Informe semestral'],
 ['Actividades y asistencias','Actividad','Reminiscencia'],
 ['Seguimientos','Observaciones y fuente de información','Participación observada'],
 ['Objetivos PIAI','Objetivo significativo para la persona','Participar en una actividad elegida']]){
 await page.getByRole('button',{name:new RegExp('^'+tab+' ·')}).click();await page.getByRole('button',{name:'+ Añadir registro'}).click();
 await page.getByLabel(required,{exact:true}).fill(text);
 await page.getByRole('button',{name:'Guardar registro',exact:true}).click();await page.getByRole('status').filter({hasText:'Guardado correctamente.'}).waitFor();
 await page.locator('.res-record').getByText(text,{exact:false}).first().waitFor();
 }
 assert.equal(records[0].revision,6);assert.equal(records[0].data.assessments.length,1);assert.equal(records[0].data.attendance.length,1);
 await page.getByRole('button',{name:'Editar',exact:true}).click();await page.getByLabel('Objetivo significativo para la persona').fill('Borrador conservado');conflict=true;
 await page.getByRole('button',{name:'Guardar registro',exact:true}).click();await page.getByRole('status').filter({hasText:'otra ventana'}).waitFor();assert.equal(await page.getByLabel('Objetivo significativo para la persona').inputValue(),'Borrador conservado');
 page.on('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.screenshot({path:'/tmp/residence-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 await page.screenshot({path:'/tmp/residence-mobile.png',fullPage:true});
 const anon=await browser.newPage();await anon.goto('http://localhost:3000/admin/residencia/');await anon.getByText('Inicia sesión en el administrador para acceder.',{exact:true}).waitFor();assert.equal(await anon.getByRole('button',{name:'+ Nuevo residente'}).count(),0);
 await browser.close();console.log('PASS: five record types, persistence payloads, revision conflicts, anonymous gate, mobile overflow');
})().catch(e=>{console.error(e);process.exit(1)});
