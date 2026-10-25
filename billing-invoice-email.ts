type Env = { BREVO_API_KEY?:string; SUPABASE_SERVICE_ROLE_KEY?:string };
export type Invoice = {
  id:string; patient_id:string; status:string; invoice_number:string; issue_date:string; service_date:string;
  recipient_name:string; recipient_tax_id:string; recipient_address:string; description:string;
  quantity:number; unit_price_cents:number; vat_cents:number; total_cents:number; tax_treatment:string;
  issuer_snapshot:{legal_name:string;tax_id:string;fiscal_address:string;email:string};
};
const SUPA="https://grgyvdxkjdstdyumdfyg.supabase.co";
const uuid=(v:unknown):v is string=>typeof v==="string"&&/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(v);
const json=(v:unknown,status=200)=>Response.json(v,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const euro=(v:number)=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(v/100).replace(/\u00a0/g," ");
const date=(v:string)=>v.split("-").reverse().join("/");
const escape=(v:string)=>v.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));

/** Always render the frozen issued record, never attachment bytes or fiscal fields supplied by the client. */
export async function invoicePdf(invoice:Invoice):Promise<string>{
  const {jsPDF}=await import("jspdf");
  const doc=new jsPDF({unit:"mm",format:"a4",compress:true});
  const issuer=invoice.issuer_snapshot;
  doc.setProperties({title:"Factura "+invoice.invoice_number,author:issuer.legal_name});
  let y=22;
  function text(value:string,size=11,bold=false){
    doc.setFont("helvetica",bold?"bold":"normal");doc.setFontSize(size);
    const lines=doc.splitTextToSize(String(value),170) as string[];
    for(const line of lines){if(y>268){doc.addPage();y=22;}doc.text(line,20,y);y+=size*.45+1;}
    y+=2;
  }
  doc.setTextColor(23,58,94);text("FACTURA",23,true);text(invoice.invoice_number,14,true);
  doc.setTextColor(30,30,30);
  text("Fecha de emisión: "+date(invoice.issue_date));text("Fecha de prestación: "+date(invoice.service_date));y+=3;
  text("EMISOR",11,true);text(issuer.legal_name);text("NIF: "+issuer.tax_id);text(issuer.fiscal_address);text(issuer.email);y+=3;
  text("DESTINATARIO",11,true);text(invoice.recipient_name);text("NIF/NIE: "+invoice.recipient_tax_id);text(invoice.recipient_address);y+=3;
  text("CONCEPTO",11,true);text(invoice.description);text("Unidades: "+invoice.quantity+" · Precio unitario: "+euro(invoice.unit_price_cents));
  text("Base imponible: "+euro(invoice.quantity*invoice.unit_price_cents));
  text("IVA: "+euro(invoice.vat_cents));
  if(invoice.tax_treatment==="exempt_healthcare")text("Operación exenta de IVA conforme al artículo 20.Uno.3.º de la Ley 37/1992.",9);
  text("TOTAL: "+euro(invoice.total_cents),16,true);
  const bytes=new Uint8Array(doc.output("arraybuffer"));let raw="";
  for(let i=0;i<bytes.length;i+=8192)raw+=String.fromCharCode(...bytes.subarray(i,i+8192));
  return btoa(raw);
}

export async function billingInvoiceEmail(request:Request,env:Env,owner:(r:Request)=>Promise<boolean>):Promise<Response>{
  if(!["GET","POST"].includes(request.method))return json({error:"Método no permitido."},405);
  if(!await owner(request))return json({error:"Acceso profesional necesario."},401);
  if(!env.SUPABASE_SERVICE_ROLE_KEY)return json({error:"El servicio de facturas no está configurado."},503);
  const headers={apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,"Content-Type":"application/json"};
  const query=(path:string,init:RequestInit={})=>fetch(SUPA+"/rest/v1/"+path,{...init,headers:{...headers,...init.headers},cache:"no-store"});
  let body:Record<string,unknown>={};
  if(request.method==="POST"){
    if(Number(request.headers.get("content-length")||0)>4096)return json({error:"Solicitud demasiado grande."},413);
    try{const raw=await request.text();if(raw.length>4096)return json({error:"Solicitud demasiado grande."},413);body=JSON.parse(raw);}catch{return json({error:"Solicitud no válida."},400);}
    if(!body||typeof body!=="object"||Array.isArray(body))return json({error:"Solicitud no válida."},400);
  }
  const id=request.method==="GET"?new URL(request.url).searchParams.get("invoice_id"):body.invoice_id;
  if(!uuid(id))return json({error:"Factura no válida."},400);
  try{
    const found=await query("billing_invoices?select=*&id=eq."+id+"&limit=1");
    if(!found.ok)return json({error:"No se ha podido consultar la factura."},503);
    const invoice=(await found.json() as Invoice[])[0];
    if(!invoice||invoice.status!=="issued"||!invoice.issuer_snapshot)return json({error:"Solo pueden enviarse facturas emitidas."},409);
    const history=await query("billing_invoice_email_deliveries?select=id,recipient_email,status,created_at,sent_at&invoice_id=eq."+id+"&order=created_at.desc&limit=20");
    if(!history.ok)return json({error:"No se ha podido consultar el historial de envío."},503);
    const deliveries=await history.json() as {id:string;recipient_email:string;status:string;created_at:string;sent_at:string|null}[];
    if(request.method==="GET"){
      const patient=await query("clinical_patients?select=email&id=eq."+invoice.patient_id+"&limit=1");
      if(!patient.ok)return json({error:"No se ha podido consultar el correo del paciente."},503);
      const patients=await patient.json() as {email?:string}[];
      return json({email:patients[0]?.email||"",configured:!!env.BREVO_API_KEY,deliveries});
    }
    if(!env.BREVO_API_KEY)return json({error:"El envío de email no está configurado en el servidor."},503);
    const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
    if(email.length>254||!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)||body.confirm_recipient!==true)
      return json({error:"Comprueba y confirma el correo del destinatario."},400);
    const nonce=body.request_id;
    if(!uuid(nonce))return json({error:"Identificador de envío no válido."},400);
    const previous=await query("billing_invoice_email_deliveries?select=invoice_id,recipient_email,status,sent_at&id=eq."+nonce+"&limit=1");
    if(!previous.ok)return json({error:"No se ha podido comprobar el envío."},503);
    const prior=(await previous.json() as {invoice_id:string;recipient_email:string;status:string;sent_at:string}[])[0];
    if(prior){
      if(prior.invoice_id!==id||prior.recipient_email!==email)return json({error:"El identificador pertenece a otro envío."},409);
      if(prior.status==="accepted")return json({accepted:true,sent_at:prior.sent_at,repeated_request:true});
      return json({error:"Este intento ya se ha registrado. Revisa su estado antes de reenviar."},409);
    }
    if(deliveries.some(d=>["pending","unknown"].includes(d.status)))return json({error:"Hay un envío pendiente de verificar. Consulta el historial antes de reenviar."},409);
    if(deliveries.some(d=>d.status==="accepted")&&body.confirm_resend!==true)return json({error:"La factura ya se envió. Confirma expresamente el reenvío."},409);
    if(deliveries.some(d=>Date.now()-Date.parse(d.created_at)<60000))return json({error:"Espera un minuto antes de volver a enviar esta factura."},429);
    const attachment=await invoicePdf(invoice);
    const claim=await query("billing_invoice_email_deliveries",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({id:nonce,invoice_id:id,recipient_email:email,status:"pending"})});
    if(!claim.ok)return json({error:"Otro envío ya está en curso o el intento ya existe. Actualiza el historial."},409);
    let reply:Response;
    try{
      reply=await fetch("https://api.brevo.com/v3/smtp/email",{
        method:"POST",headers:{"api-key":env.BREVO_API_KEY,"Content-Type":"application/json"},
        body:JSON.stringify({
          sender:{name:"Carolina Sánchez Girona",email:"contact@carolinasanchezgirona.com"},to:[{email}],
          replyTo:{email:"contact@carolinasanchezgirona.com",name:"Carolina Sánchez Girona"},
          subject:"Factura "+invoice.invoice_number,
          htmlContent:"<p>Hola,</p><p>Te adjunto la factura "+escape(invoice.invoice_number)+".</p><p>Si necesitas alguna aclaración, puedes responder a este correo.</p><p>Un saludo,<br>Carolina Sánchez Girona</p>",
          attachment:[{name:"Factura-"+invoice.invoice_number.replace(/[^A-Za-z0-9_-]/g,"-")+".pdf",content:attachment}],
          tags:["billing-invoice"],
          headers:{"IdempotencyKey":nonce,"X-Mailin-Track-Opens":"0","X-Mailin-Track-Clicks":"0"}
        }),signal:AbortSignal.timeout(20000)
      });
    }catch{
      await query("billing_invoice_email_deliveries?id=eq."+nonce,{method:"PATCH",body:JSON.stringify({status:"unknown"})}).catch(()=>{});
      return json({error:"No se ha podido confirmar si el servicio aceptó el correo. El intento queda pendiente de verificar; no se reintentará automáticamente."},502);
    }
    const result=await reply.json().catch(()=>({})) as {messageId?:string};
    const accepted=reply.ok&&typeof result.messageId==="string"&&!!result.messageId;
    const sent_at=accepted?new Date().toISOString():null;
    const status=accepted?"accepted":reply.status>=400&&reply.status<500?"failed":"unknown";
    const recorded=await query("billing_invoice_email_deliveries?id=eq."+nonce,{method:"PATCH",body:JSON.stringify({status,sent_at,provider_message_id:accepted?result.messageId:null})});
    if(!accepted)return json({error:status==="failed"?"El servicio ha rechazado el correo. Revisa el destinatario y la configuración.":"No se ha confirmado el envío. Consulta su estado antes de reenviar."},502);
    return json({accepted:true,sent_at,audit_saved:recorded.ok});
  }catch{return json({error:"No se ha podido completar la operación. Revisa el historial antes de repetir un envío."},503);}
}
