import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve("out");
const mime = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8",
  ".css":"text/css; charset=utf-8", ".json":"application/json", ".svg":"image/svg+xml",
  ".woff2":"font/woff2", ".png":"image/png", ".webp":"image/webp", ".ico":"image/x-icon" };
const server = createServer(async (req,res)=>{
  const pathname = decodeURIComponent(new URL(req.url||"/","http://127.0.0.1").pathname);
  let rel = pathname.endsWith("/") ? pathname+"index.html" : pathname;
  if (!path.extname(rel)) rel += "/index.html";
  const file = path.resolve(root,"."+rel);
  if (!(file===root||file.startsWith(root+path.sep))) {res.writeHead(403);res.end();return;}
  try {
    const body = await readFile(file);
    res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
    res.end(body);
  } catch {res.writeHead(404);res.end("Not found");}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const port=server.address().port, base="http://127.0.0.1:"+port;
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const context=await browser.newContext();
let authenticated=false, calls=[], analyticsCalls=[];
context.on("request",r=>{if(/google-analytics\.com|googletagmanager\.com/.test(r.url()))analyticsCalls.push(r.url());});
await context.route("**/api/patient-portal/**",async route=>{
  const p=new URL(route.request().url()).pathname;
  let body={},status=200;
  if(p.endsWith("/password-login")){
    const input=JSON.parse(route.request().postData()||"{}");
    authenticated=input.email==="paciente@example.test"&&input.password==="ContraseñaSegura123!";
    if(!authenticated){status=401;body={error:"Correo o contraseña incorrectos."};}
    else body={ok:true};
  }else if(p.endsWith("/password-link")){
    body={ok:true,message:"Si el correo está habilitado, recibirás instrucciones."};
  }else if(p.endsWith("/password-set")){
    const input=JSON.parse(route.request().postData()||"{}");
    status=input.password==="ContraseñaSegura123!"?200:400;
    body=status===200?{ok:true}:{error:"Enlace inválido."};
  }else if(p.endsWith("/session")){
    status=authenticated?200:401;
    body=authenticated?{authenticated:true,patient:{first_name:"Prueba"},next_appointment:null,materials:[]}:{authenticated:false};
  }else if(p.endsWith("/logout")){
    authenticated=false;body={ok:true};
  }else{status=404;body={error:"Ruta simulada no disponible."};}
  calls.push({path:p,status});
  await route.fulfill({status,contentType:"application/json",body:JSON.stringify(body)});
});
try {
  const page=await context.newPage();
  await page.goto(base+"/mi-espacio/");
  await page.locator("#space-login-form").waitFor({state:"visible",timeout:12000});
  assert.equal(await page.locator("#space-shell").isVisible(),false);
  // Initial setup and password-recovery actions must not grant clinical access.
  await page.locator("#space-first-access").click();
  assert.equal(await page.locator("#space-email-form").isVisible(),true);
  await page.locator("#space-access-email").fill("paciente@example.test");
  await page.locator('#space-email-form button[type="submit"]').click();
  await page.locator("#space-access-message").getByText(/recibirás un enlace/i).waitFor();
  assert.equal(await page.locator("#space-shell").isVisible(),false);
  await page.locator('[data-back-to-login]').first().click();
  await page.locator("#space-forgot-password").click();
  assert.match(await page.locator("#space-email-title").textContent(),/Recuperar contraseña/);

  // Link hash is never kept in the address bar while the password form is shown.
  const token="a".repeat(64);
  await page.goto(base+"/mi-espacio/#configurar="+token+"&tipo=invite");
  await page.locator("#space-set-password-form").waitFor({state:"visible"});
  assert.equal(new URL(page.url()).hash,"");
  await page.locator("#space-setup-email").fill("paciente@example.test");
  await page.locator("#space-new-password").fill("ContraseñaSegura123!");
  await page.locator("#space-confirm-password").fill("ContraseñaSegura123!");
  await page.locator('#space-set-password-form button[type="submit"]').click();
  await page.locator("#space-login-form").waitFor({state:"visible"});
  assert.equal(await page.locator("#space-shell").isVisible(),false);

  // Incorrect password must not grant access.
  await page.locator("#space-login-email").fill("paciente@example.test");
  await page.locator("#space-login-password").fill("incorrecta");
  await page.locator('#space-login-form button[type="submit"]').click();
  await page.locator("#space-access-message").getByText(/contraseña incorrectos/i).waitFor();
  assert.equal(authenticated,false);

  // Correct credentials create a clinical session and open a different tab.
  await page.locator("#space-login-password").fill("ContraseñaSegura123!");
  const popupPromise=context.waitForEvent("page",{timeout:10000});
  await page.locator('#space-login-form button[type="submit"]').click();
  const popup=await popupPromise;
  await popup.waitForURL(/vista=panel/,{timeout:10000});
  await popup.locator("#space-shell").waitFor({state:"visible"});
  await popup.locator("#space-today-title").getByText(/Hola, Prueba/).waitFor();
  assert.equal(await page.locator("#space-shell").isVisible(),false);
  assert.equal(analyticsCalls.length,0,"Clinical route loaded Google Analytics");
  assert.ok(calls.some(x=>x.path.endsWith("/password-login")&&x.status===401));
  assert.ok(calls.some(x=>x.path.endsWith("/password-login")&&x.status===200));
  console.log("PASS: first access, recovery, one-time setup UI, rejected login, new tab and analytics isolation.");
}finally {
  await context.close();
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
