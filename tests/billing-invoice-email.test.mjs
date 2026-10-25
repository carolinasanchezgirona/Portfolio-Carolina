import test from "node:test";
import assert from "node:assert/strict";
import {billingInvoiceEmail,invoicePdf} from "../billing-invoice-email.ts";
const id="11111111-1111-4111-8111-111111111111",nonce="22222222-2222-4222-8222-222222222222";
const invoice={id,patient_id:"33333333-3333-4333-8333-333333333333",status:"issued",invoice_number:"CSG-2026-00117",issue_date:"2026-10-23",service_date:"2026-10-23",recipient_name:"Paciente de prueba",recipient_tax_id:"00000000T",recipient_address:"Dirección ficticia 1, Barcelona",description:"Servicio sanitario profesional",quantity:1,unit_price_cents:6000,vat_cents:0,total_cents:6000,tax_treatment:"exempt_healthcare",issuer_snapshot:{legal_name:"Carolina Sánchez Girona",tax_id:"00000000T",fiscal_address:"Dirección de prueba",email:"contact@example.com"}};
const env={BREVO_API_KEY:"fake",SUPABASE_SERVICE_ROLE_KEY:"fake"};
const request=(body={})=>new Request("https://example.com/api/admin/invoices/email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({invoice_id:id,email:"recipient@example.com",request_id:nonce,confirm_recipient:true,...body})});
async function mock(options,run){
 const real=globalThis.fetch, calls=[];
 globalThis.fetch=async(url,init={})=>{
   calls.push({url,init});
   if(String(url).startsWith("https://api.brevo.com/")){
     if(options.networkFailure)throw Error("Timeout");
     return Response.json(options.providerBody??{messageId:"provider-test-id"},{status:options.providerStatus??201});
   }
   const path=String(url).split("/rest/v1/")[1];
   if(path.startsWith("billing_invoices?"))return Response.json([options.draft?{...invoice,status:"draft"}:invoice]);
   if(path.startsWith("clinical_patients?"))return Response.json([{email:"recipient@example.com"}]);
   if(path.startsWith("billing_invoice_email_deliveries")){
     if(init.method==="POST"||init.method==="PATCH")return new Response(null,{status:204});
     return Response.json(path.includes("&id=eq.")?(options.prior?[options.prior]:[]):options.history??[]);
   }
   throw Error("Unexpected mock endpoint: "+url);
 };
 try{await run(calls);}finally{globalThis.fetch=real;}
}
test("unauthorized callers cannot read invoices or trigger emails",async()=>{
 await mock({},async calls=>{
   assert.equal((await billingInvoiceEmail(request(),env,async()=>false)).status,401);
   assert.equal(calls.length,0);
 });
});
test("drafts cannot be sent and recipient confirmation is mandatory",async()=>{
 await mock({draft:true},async calls=>{
   assert.equal((await billingInvoiceEmail(request(),env,async()=>true)).status,409);
   assert.equal(calls.filter(c=>c.init.method==="POST").length,0);
 });
 await mock({},async calls=>{
   assert.equal((await billingInvoiceEmail(request({confirm_recipient:false}),env,async()=>true)).status,400);
   assert.equal(calls.filter(c=>c.init.method==="POST").length,0);
 });
});
test("accepts only issued server invoice PDF and logs provider acceptance",async()=>{
 await mock({},async calls=>{
   const response=await billingInvoiceEmail(request({attachment:"tampered",total_cents:1}),env,async()=>true);
   assert.equal(response.status,200);assert.equal((await response.json()).accepted,true);
   const sends=calls.filter(c=>c.url==="https://api.brevo.com/v3/smtp/email");
   assert.equal(sends.length,1);
   const data=JSON.parse(sends[0].init.body);
   assert.equal(data.to[0].email,"recipient@example.com");
   assert.equal(data.attachment[0].name,"Factura-CSG-2026-00117.pdf");
   assert.equal(Buffer.from(data.attachment[0].content,"base64").subarray(0,5).toString(),"%PDF-");
   assert.equal(data.headers.IdempotencyKey,nonce);
   assert.ok(calls.some(c=>c.init.method==="PATCH"&&JSON.parse(c.init.body).status==="accepted"));
 });
});
test("GET only previews recipient and delivery history and never sends",async()=>{
 await mock({},async calls=>{
   const response=await billingInvoiceEmail(new Request("https://example.com/api/admin/invoices/email?invoice_id="+id),env,async()=>true);
   assert.equal((await response.json()).email,"recipient@example.com");
   assert.equal(calls.filter(c=>c.init.method==="POST").length,0);
 });
});
test("same request is idempotent and resending requires explicit confirmation",async()=>{
 await mock({prior:{invoice_id:id,recipient_email:"recipient@example.com",status:"accepted",sent_at:"2026-10-23T10:00:00Z"}},async calls=>{
   const response=await billingInvoiceEmail(request(),env,async()=>true);
   assert.equal((await response.json()).repeated_request,true);
   assert.equal(calls.filter(c=>c.init.method==="POST").length,0);
 });
 await mock({history:[{status:"accepted",created_at:"2026-01-01T10:00:00Z"}]},async calls=>{
   assert.equal((await billingInvoiceEmail(request(),env,async()=>true)).status,409);
   assert.equal(calls.filter(c=>c.init.method==="POST").length,0);
 });
});
test("network uncertainty is audited without automatic retry",async()=>{
 await mock({networkFailure:true},async calls=>{
   assert.equal((await billingInvoiceEmail(request(),env,async()=>true)).status,502);
   assert.equal(calls.filter(c=>c.url==="https://api.brevo.com/v3/smtp/email").length,1);
   assert.ok(calls.some(c=>c.init.method==="PATCH"&&JSON.parse(c.init.body).status==="unknown"));
 });
});
test("provider rejection is not reported as sent",async()=>{
 await mock({providerStatus:400,providerBody:{message:"Invalid recipient"}},async calls=>{
   assert.equal((await billingInvoiceEmail(request(),env,async()=>true)).status,502);
   assert.ok(calls.some(c=>c.init.method==="PATCH"&&JSON.parse(c.init.body).status==="failed"));
 });
});
test("PDF generation preserves long fiscal data across pages",async()=>{
 const content=await invoicePdf({...invoice,recipient_address:"Dirección completa ".repeat(30)});
 assert.ok(Buffer.from(content,"base64").length>1000);
});
