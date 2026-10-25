import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import {parseCSV} from "../app/admin/economia/import-utils.ts";
const script=readFileSync(new URL("../public/admin-economia.js",import.meta.url),"utf8");
function harness(existing=[],issued=[]){
 const writes=[];const context={window:{dispatchEvent(){}},Event:class{},session:{access_token:"test"},externalIncome:[],invoices:[],receipts:[],expenses:[],
 allRows:async table=>table==="billing_external_income"?existing:issued,
 rest:async(path,opts)=>writes.push({path,rows:JSON.parse(opts.body)}),load:async()=>{},setStatus(){},
 stageImportedExpense(){},importReviewedExpenses(){}};
 vm.createContext(context);
 vm.runInContext(script.slice(script.indexOf("  function exposeImportBridge()"),script.indexOf('\n  $("#econ-expense-date").value = today();')),context);
 vm.runInContext("exposeImportBridge()",context);
 return {bridge:context.window.DememoriaIncomeBridge,writes,context};
}
const row={received_date:"2026-10-23",external_reference:"F-2026-117",concept:"Ingreso profesional documentado",amount_cents:6000,source:"external_invoice",payment_method:"bizum"};
test("annual CSV keeps more than 250 rows and rejects oversize rather than truncating",()=>{
 const csv="Fecha;Importe;Referencia\n"+Array.from({length:1200},(_,i)=>"23/10/2026;60,00;OP-"+i).join("\n");
 assert.equal(parseCSV(csv,10031).length,1201);
 assert.throws(()=>parseCSV("x\n"+"a\n".repeat(10033),10031),/supera/);
});
test("imports reviewed annual receipts in one atomic request",async()=>{
 const h=harness();const rows=Array.from({length:1200},(_,i)=>({...row,external_reference:"OP-"+i}));
 assert.equal(await h.bridge.importRows(rows),1200);
 assert.equal(h.writes.length,1);assert.equal(h.writes[0].path,"billing_external_income");assert.equal(h.writes[0].rows.length,1200);
});
test("rejects existing, voided, issued invoice and within-file references before writing",async()=>{
 for(const h of [harness([{external_reference:" f-2026-117 ",voided_at:"2026-10-24"}]),harness([],[{invoice_number:"F-2026-117"}])]){
  await assert.rejects(h.bridge.importRows([row]),/ya existe/);assert.equal(h.writes.length,0);
 }
 const h=harness();await assert.rejects(h.bridge.importRows([row,{...row}]),/ya existe/);assert.equal(h.writes.length,0);
});
test("rejects impossible dates, negative amounts and invalid payment methods",async()=>{
 for(const patch of [{received_date:"2026-02-31"},{amount_cents:-6000},{amount_cents:1.5},{payment_method:"invalid"}]){
  const h=harness();await assert.rejects(h.bridge.importRows([{...row,...patch}]));assert.equal(h.writes.length,0);
 }
});
test("requires an authenticated capability for bulk writes",async()=>{
 const h=harness();h.context.session=null;await assert.rejects(h.bridge.importRows([row]));assert.equal(h.writes.length,0);
});
