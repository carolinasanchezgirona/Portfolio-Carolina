import test from "node:test";
import assert from "node:assert/strict";
import { manualPatientDocumentsEmail } from "../manual-patient-documents-email.ts";

const patientId = "11111111-1111-4111-8111-111111111111";
const email = "patient@example.invalid";
const env = { SUPABASE_SERVICE_ROLE_KEY: "test-key", BREVO_API_KEY: "test-brevo-key" };
const owner = async () => true;
const sameOrigin = () => true;
const post = (details = {}) => new Request("https://carolinasanchezgirona.com/api/admin/patient-documents-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ patient_id: patientId, documents: ["consentimientos", "privacidad"],
    email_confirmation: email, confirm_recipient: true, ...details }),
});
const get = () => new Request("https://carolinasanchezgirona.com/api/admin/patient-documents-email?patient_id=" + patientId);

async function mockFetch(run, patient = [{id:patientId,email,status:"active"}]) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({url:String(url),options});
    if (String(url).includes("/rest/v1/clinical_patients?")) return Response.json(patient);
    if (String(url)==="https://api.brevo.com/v3/smtp/email") return Response.json({messageId:"accepted-id"},{status:201});
    throw Error("unexpected endpoint: " + url);
  };
  try { return await run(calls); } finally { globalThis.fetch = original; }
}

test("GET solo muestra el correo guardado y nunca envía", async () => {
  await mockFetch(async calls => {
    const result = await manualPatientDocumentsEmail(get(), env, owner, sameOrigin);
    assert.equal(result.status,200);
    assert.deepEqual(await result.json(),{email,configured:true});
    assert.equal(calls.filter(c=>c.url.includes("api.brevo.com")).length,0);
  });
});

test("no permite envío a una persona no autenticada o con origen ajeno",async()=>{
  await mockFetch(async calls=>{
    assert.equal((await manualPatientDocumentsEmail(post(),env,async()=>false,sameOrigin)).status,401);
    assert.equal((await manualPatientDocumentsEmail(post(),env,owner,()=>false)).status,403);
    assert.equal(calls.length,0);
  });
});

test("requiere verificación explícita del correo y seleccionar documentos",async()=>{
  await mockFetch(async calls=>{
    assert.equal((await manualPatientDocumentsEmail(post({confirm_recipient:false}),env,owner,sameOrigin)).status,409);
    assert.equal((await manualPatientDocumentsEmail(post({email_confirmation:"other@example.invalid"}),env,owner,sameOrigin)).status,409);
    assert.equal((await manualPatientDocumentsEmail(post({documents:[]}),env,owner,sameOrigin)).status,400);
    assert.equal((await manualPatientDocumentsEmail(post({documents:["consentimientos","consentimientos"]}),env,owner,sameOrigin)).status,400);
    assert.equal((await manualPatientDocumentsEmail(post({documents:["consentimientos","clinical_report"]}),env,owner,sameOrigin)).status,400);
    assert.equal(calls.filter(c=>c.url.includes("api.brevo.com")).length,0);
  });
});

test("envía enlaces neutros solo después de la acción POST autorizada",async()=>{
  await mockFetch(async calls=>{
    const result=await manualPatientDocumentsEmail(post(),env,owner,sameOrigin);
    assert.equal(result.status,200);
    assert.equal((await result.json()).accepted,true);
    const sends=calls.filter(c=>c.url==="https://api.brevo.com/v3/smtp/email");
    assert.equal(sends.length,1);
    const message=JSON.parse(sends[0].options.body);
    assert.equal(message.to[0].email,email);
    assert.equal(message.subject,"Documentación informativa de la consulta");
    assert.ok(message.textContent.includes("/consentimientos/"));
    assert.ok(message.textContent.includes("/privacidad/"));
    assert.ok(!message.textContent.includes(email));
    assert.ok(!message.textContent.includes(patientId));
    assert.ok(!message.attachment);
    assert.equal(message.headers["X-Mailin-Track-Opens"],"0");
    assert.equal(message.headers["X-Mailin-Track-Clicks"],"0");
  });
});

test("permite enviar solo la privacidad si la profesional lo selecciona",async()=>{
  await mockFetch(async calls=>{
    const result=await manualPatientDocumentsEmail(post({documents:["privacidad"]}),env,owner,sameOrigin);
    assert.equal(result.status,200);
    const payload=JSON.parse(calls.find(c=>c.url.includes("api.brevo.com")).options.body);
    assert.ok(payload.textContent.includes("/privacidad/"));
    assert.ok(!payload.textContent.includes("/consentimientos/"));
  });
});

test("no envía a fichas archivadas o sin destinatario válido",async()=>{
  await mockFetch(async calls=>{
    assert.equal((await manualPatientDocumentsEmail(post(),env,owner,sameOrigin)).status,404);
    assert.equal(calls.filter(c=>c.url.includes("api.brevo.com")).length,0);
  },[{id:patientId,email,status:"archived"}]);
  await mockFetch(async calls=>{
    assert.equal((await manualPatientDocumentsEmail(post(),env,owner,sameOrigin)).status,409);
    assert.equal(calls.filter(c=>c.url.includes("api.brevo.com")).length,0);
  },[{id:patientId,email:null,status:"active"}]);
});
