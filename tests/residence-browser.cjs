const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block'});const page=await context.newPage();
let residents=[],events=[],types=[{id:'a',label:'Ejercicios',color:'#087f8c',revision:1},{id:'b',label:'Valoraciones',color:'#2855a2',revision:1},{id:'c',label:'Entrevistas',color:'#cc6759',revision:1},{id:'d',label:'PIAI',color:'#8056a4',revision:1}],conflict=false;
await context.route('https://grgyvdxkjdstdyumdfyg.supabase.co/**',async route=>{
 const req=route.request(),u=new URL(req.url());let body;
 if(u.pathname==='/auth/v1/user')body={id:'9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'};
 else if(u.pathname==='/rest/v1/residence_records'){
 if(req.method()==='GET')body=residents;else if(conflict){body=[];conflict=false;}else{const r=req.postDataJSON();residents=[...residents.filter(x=>x.id!==r.id),r];body=[r];}
 }else if(u.pathname==='/rest/v1/residence_schedule_types'){
 if(req.method()==='GET')body=types;else {const t=req.postDataJSON();types=[...types.filter(x=>x.id!==t.id),t];body=[t];}
 }else if(u.pathname==='/rest/v1/residence_schedule'){
 if(req.method()==='GET'){const vals=u.searchParams.getAll('event_date'),from=vals.find(v=>v.startsWith('gte.'))?.slice(4),to=vals.find(v=>v.startsWith('lte.'))?.slice(4);body=events.filter(e=>(!from||e.event_date>=from)&&(!to||e.event_date<=to));}
 else {const raw=req.postDataJSON(),batch=Array.isArray(raw)?raw:[raw];for(const row of batch)assert.equal('slot' in row,false);const returned=batch.map(row=>({...row,slot:'generated range'}));events=[...events.filter(e=>!batch.some(b=>b.id===e.id)),...returned];body=returned;}
 }else throw Error('Unexpected external data access: '+u.pathname);
 await route.fulfill({json:body});
});
await page.addInitScript(()=>{sessionStorage.setItem('dememoria_admin_session',JSON.stringify({access_token:'TEST_ONLY'}));window.print=()=>{};});
page.on('dialog',d=>d.accept());await page.goto('http://localhost:3000/admin/residencia/');
assert.equal(await page.locator('.admin-workspace-nav').count(),0);
await page.getByRole('button',{name:'+ Nuevo residente',exact:true}).click();
await page.getByLabel('Código interno',{exact:true}).fill('R-001');await page.getByLabel('Centro de la ficha',{exact:true}).fill('Centro de prueba');await page.getByLabel('Nombre y apellidos',{exact:true}).fill('Residente de prueba');await page.getByRole('button',{name:'Guardar ficha',exact:true}).click();await page.getByText('Guardado correctamente.',{exact:true}).waitFor();
const id=residents[0].id;
await page.getByRole('button',{name:'Valoraciones',exact:true}).click();
const protocol=page.getByRole('complementary',{name:'Protocolo MMSE NORMACODERM'});
await protocol.waitFor();
await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.screenshot({path:'/tmp/res-mmse-protocol-mobile.png',fullPage:true});
const pdf=await page.request.get(new URL(await protocol.getByRole('link',{name:'Abrir protocolo PDF',exact:true}).getAttribute('href'),page.url()).href);
assert.equal(pdf.status(),200);assert((await pdf.body()).subarray(0,5).equals(Buffer.from('%PDF-')));
await page.getByLabel('Residente del nuevo registro',{exact:true}).selectOption(id);
await protocol.getByRole('button',{name:'+ Registrar MMSE NORMACODERM',exact:true}).click();
assert.equal(await page.getByLabel('Versión / adaptación utilizada',{exact:true}).inputValue(),'NORMACODERM (Anexo 2)');
assert.equal(await page.getByLabel('Puntuación máxima de la versión',{exact:true}).inputValue(),'30');
assert.equal(await page.getByLabel('Fijación (0–3)',{exact:true}).inputValue(),'');
await page.getByLabel('Fijación (0–3)',{exact:true}).fill('4');
await page.getByRole('button',{name:'Guardar registro',exact:true}).click();await page.getByText('Fijación: introduce un entero entre 0 y 3.',{exact:true}).waitFor();assert.equal(residents[0].data.scales.length,0);
await page.getByLabel('Fijación (0–3)',{exact:true}).fill('3');
await page.getByLabel('Puntuación total registrada',{exact:true}).fill('24');
await page.getByLabel('Puntuación corregida registrada por la profesional',{exact:true}).fill('25');
await page.getByLabel('Corrección aplicada y tabla de referencia utilizada',{exact:true}).fill('Corrección manual, tabla de página 7');
await page.screenshot({path:'/tmp/res-mmse-entry-mobile.png',fullPage:true});
await page.getByRole('button',{name:'Guardar registro',exact:true}).click();await page.getByText('Guardado correctamente.',{exact:true}).waitFor();
assert.equal(residents[0].data.scales[0].registration,'3');assert.equal(residents[0].data.scales[0].score,'24');assert.equal(residents[0].data.scales[0].correctedScore,'25');assert.equal(residents[0].data.scales[0].recall,undefined);
await page.reload();await page.getByRole('button',{name:'Valoraciones',exact:true}).click();await page.getByLabel('Residente del nuevo registro',{exact:true}).selectOption(id);
await page.getByRole('button',{name:'Editar',exact:true}).click();assert.equal(await page.getByLabel('Puntuación corregida registrada por la profesional',{exact:true}).inputValue(),'25');await page.getByRole('button',{name:'Cancelar',exact:true}).click();
await page.setViewportSize({width:1440,height:1000});

for(const instrument of ['MMSE','MEC','Pfeiffer','GDS de Reisberg','Yesavage','Test del reloj','Fluencia verbal']){
 await page.getByRole('button',{name:'Valoraciones',exact:true}).click();await page.getByLabel('Residente del nuevo registro',{exact:true}).selectOption(id);await page.getByRole('button',{name:'+ Registrar test',exact:true}).click();
 await page.getByLabel('Prueba',{exact:true}).selectOption(instrument);await page.getByLabel('Versión / adaptación utilizada',{exact:true}).fill('Versión de prueba');
 if(instrument==='Pfeiffer')await page.getByLabel('Número de errores registrados',{exact:true}).fill('2');
 else if(instrument==='GDS de Reisberg')await page.getByLabel('Estadio registrado',{exact:true}).fill('3');
 else if(instrument==='Fluencia verbal'){await page.getByLabel('Modalidad',{exact:true}).selectOption('Semántica');await page.getByLabel('Respuestas correctas',{exact:true}).fill('12');}
 else if(instrument==='Test del reloj')await page.getByLabel('Puntuación registrada',{exact:true}).fill('6');
 else await page.getByLabel('Puntuación total registrada',{exact:true}).fill('20');
 await page.getByRole('button',{name:'Guardar registro',exact:true}).click();await page.getByText('Guardado correctamente.',{exact:true}).waitFor();
}
assert.equal(residents[0].data.scales.length,8);assert.equal(new Set(residents[0].data.scales.map(e=>e.instrument)).size,7);
await page.getByRole('button',{name:'Valoraciones',exact:true}).click();await page.getByRole('button',{name:'+ Nueva valoración',exact:true}).click();await page.getByLabel('Síntesis e implicaciones para el PIAI',{exact:true}).fill('Revisar objetivos con la persona');await page.getByRole('button',{name:'Guardar registro',exact:true}).click();await page.getByText('Guardado correctamente.',{exact:true}).waitFor();assert.equal(residents[0].data.assessments.length,1);
await page.getByRole('button',{name:'Informes',exact:true}).click();await page.getByRole('button',{name:'+ Nuevo informe',exact:true}).click();await page.getByLabel('Título',{exact:true}).fill('Informe de residencia');await page.getByLabel('Contenido del informe',{exact:true}).fill('Contenido profesional de prueba');await page.getByRole('button',{name:'Guardar registro',exact:true}).click();await page.getByText('Guardado correctamente.',{exact:true}).waitFor();
await page.getByRole('button',{name:'Informes',exact:true}).click();await page.getByText('Contenido profesional de prueba',{exact:false}).waitFor();await page.getByRole('button',{name:'Imprimir / PDF',exact:true}).click();await page.emulateMedia({media:'print'});assert(await page.locator('.res-print-record').isVisible());assert.equal(await page.locator('.res-print-record').getByText('Contenido profesional de prueba',{exact:true}).count(),1);await page.emulateMedia({media:'screen'});await page.evaluate(()=>dispatchEvent(new Event('afterprint')));
await page.getByRole('button',{name:'Horario semanal',exact:true}).click();await page.getByLabel('Vista del horario',{exact:true}).selectOption('week');await page.getByLabel('Semana del',{exact:true}).fill('2026-10-19');await page.getByText('Tipos de actividad y colores',{exact:true}).click();await page.getByRole('button',{name:'+ Nuevo tipo',exact:true}).click();await page.getByLabel('Nombre del tipo',{exact:true}).fill('Terapia individual');await page.getByLabel('Color del tipo',{exact:true}).fill('#23693f');await page.getByRole('button',{name:'Guardar tipo',exact:true}).click();await page.getByText('Tipo de actividad guardado.',{exact:true}).waitFor();
await page.getByRole('button',{name:'+ Programar actividad',exact:true}).click();await page.getByLabel('Título de la actividad',{exact:true}).fill('Trabajo de memoria');await page.getByLabel('Tipo de actividad',{exact:true}).selectOption(types.find(t=>t.label==='Terapia individual').id);await page.getByLabel('Fecha de actividad',{exact:true}).fill('2026-10-19');await page.getByLabel('Hora de inicio',{exact:true}).selectOption('540');await page.getByLabel('Hora de fin',{exact:true}).selectOption('600');await page.getByLabel('Residente de la actividad',{exact:true}).selectOption(id);await page.getByLabel('Repetición semanal',{exact:true}).selectOption('4');await page.getByRole('button',{name:'Guardar actividad',exact:true}).click();await page.getByText('Actividad guardada en 4 semanas.',{exact:true}).waitFor();assert.equal(events.length,4);assert.equal(events[0].resident_id,id);assert.equal(await page.locator('.res-event').count(),1);
await page.getByRole('button',{name:'+ Programar actividad',exact:true}).click();await page.getByLabel('Título de la actividad',{exact:true}).fill('Solapamiento');await page.getByLabel('Fecha de actividad',{exact:true}).fill('2026-10-19');await page.getByLabel('Hora de inicio',{exact:true}).selectOption('570');await page.getByRole('button',{name:'Guardar actividad',exact:true}).click();await page.getByText(/Esta actividad se solapa/).waitFor();assert.equal(events.length,4);await page.getByRole('button',{name:'Cerrar editor',exact:true}).click();
await page.locator('.res-event').click();await page.getByLabel('Estado de actividad',{exact:true}).selectOption('done');await page.getByRole('button',{name:'Guardar actividad',exact:true}).click();await page.getByText('Actividad guardada.',{exact:true}).waitFor();assert.equal(events.find(e=>e.event_date==='2026-10-19').status,'done');await page.screenshot({path:'/tmp/res-v2-schedule-desktop.png',fullPage:true});
await page.getByRole('button',{name:'Residentes e historiales',exact:true}).click();await page.getByLabel('Apartado del historial',{exact:true}).selectOption('profile');await page.getByText('Contactos, representación y consentimientos',{exact:true}).click();await page.getByLabel('Contacto principal y parentesco',{exact:true}).fill('Persona referente');await page.getByText('Campos personalizados del centro',{exact:true}).click();await page.getByRole('button',{name:'+ Añadir campo',exact:true}).click();await page.getByLabel('Nombre del campo 1',{exact:true}).fill('Dato del centro');await page.getByLabel('Contenido del campo 1',{exact:true}).fill('Información propia');await page.getByRole('button',{name:'Guardar ficha',exact:true}).click();await page.getByText('Guardado correctamente.',{exact:true}).waitFor();
assert.equal(residents[0].data.profile.contactName,'Persona referente');assert.equal(residents[0].data.customFields[0].value,'Información propia');
await page.getByLabel('Nombre y apellidos',{exact:true}).fill('Borrador preservado');conflict=true;await page.getByRole('button',{name:'Guardar ficha',exact:true}).click();await page.getByText(/La ficha ha cambiado en otra ventana/).waitFor();assert.equal(await page.getByLabel('Nombre y apellidos',{exact:true}).inputValue(),'Borrador preservado');
await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/res-v2-resident-mobile.png',fullPage:true});
await page.getByRole('button',{name:'Horario semanal',exact:true}).click();await page.getByLabel('Vista del horario',{exact:true}).selectOption('day');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/res-v2-schedule-mobile.png',fullPage:true});
const anon=await browser.newPage();await anon.goto('http://localhost:3000/admin/residencia/');await anon.getByText('Inicia sesión en el administrador para acceder.',{exact:true}).waitFor();assert.equal(await anon.getByRole('button',{name:'+ Nuevo residente',exact:true}).count(),0);
await browser.close();console.log('PASS: residential navigation, seven test registries, assessment/report entry and print, custom clinical fields, revision conflicts, coloured recurring planner, overlap protection, anonymous access and mobile layout');
})().catch(e=>{console.error(e);process.exit(1)});
