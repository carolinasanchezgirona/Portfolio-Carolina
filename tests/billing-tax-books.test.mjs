import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
import {inflateRawSync} from "node:zlib";
import ts from "typescript";
const base=fileURLToPath(new URL("../app/admin/economia/",import.meta.url)),cache=new Map();
function load(file){
 const full=path.resolve(base,file.endsWith(".ts")?file:file+".ts");
 if(cache.has(full))return cache.get(full);
 const module={exports:{}};
 const code=ts.transpileModule(fs.readFileSync(full,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,require:id=>load(path.relative(base,path.resolve(path.dirname(full),id))),Blob,CompressionStream,Response,TextEncoder,TextDecoder,crypto,Date,Map,Set,Uint8Array,DataView});
 cache.set(full,module.exports);return module.exports;
}
const {schema,blank,detectMapping,detectHeader,mappedRows,errors,decimal,sourceKey,duplicateIds}=load("tax-book-utils");
const {makeWorkbook}=load("tax-book-xlsx");
const {workspaceRows,groups,amount,yearOf}=load("accounting-workspace");
test("AEAT schema preserves official column order and all 36/42/42 columns",()=>{
 assert.deepEqual(Object.values(schema).map(s=>s.columns.length),[36,42,42]);
 assert.equal(schema.income.columns[15].label,"NIF Destinatario · Identificación");
 assert.equal(schema.expense.columns[41].label,"Referencia Externa");
});
test("automatic mapping fills known fields and leaves unknown fiscal data blank",()=>{
 const matrix=[["Nº factura","Fecha expedición","Cliente","NIF","Total"],["F-2026-117","23/10/2026","Pagador","00000000T","60,00"]];
 const data=mappedRows("income",matrix,0,detectMapping("income",matrix,0))[0].data;
 assert.equal(data.c12,"F-2026-117");assert.equal(data.c09,"23/10/2026");assert.equal(data.c21,"60,00");
 for(const k of ["c01","c03","c05","c07","c08","c18","c19","c20","c22","c23","c24","c31","c32"])assert.equal(data[k],"",k);
 assert.ok(errors("income",data).length>0);
});
test("ambiguous columns are left unmapped; bank receipts do not become invoice totals",()=>{
 const ambiguous=[["NIF","NIF","Fecha","Importe"],["one","two","23/10/2026","35"]];
 const map=detectMapping("income",ambiguous,0);assert.equal(map.c16,-1);assert.equal(map.c09,-1);
 const bank=[["Fecha","Fecha valor","Concepto","Importe"],["23/10/2026","23/10/2026","BIZUM RECIBIDO","35"]];
 const data=mappedRows("income",bank,0,detectMapping("income",bank,0))[0].data;
 assert.equal(data.c27,"23/10/2026");assert.equal(data.c28,"35,00");assert.equal(data.c21,"");assert.equal(data.c22,"");
});
test("blank, known zero and negative rectification amounts remain distinct",()=>{
 assert.equal(decimal(""),"");assert.equal(decimal(0),"0,00");assert.equal(decimal("-60,00"),"-60,00");assert.equal(decimal("1.234,56"),"1234,56");
 const m=[["Total"],[""],["0"],["-60,00"]];
 const rows=mappedRows("income",m,0,detectMapping("income",m,0));assert.equal(rows.length,2);assert.equal(rows[0].data.c21,"0,00");assert.equal(rows[1].data.c21,"-60,00");
});
test("official two-row headers and optional type row are recognized without importing headings",()=>{
 const s=schema.expense,data=blank("expense");data.c01="2026";data.c42="REF-42";
 const m=[...s.headers,s.columns.map(c=>c.format),s.columns.map(c=>data[c.key])];
 assert.equal(detectHeader("expense",m),0);
 const rows=mappedRows("expense",m,0,detectMapping("expense",m,0));assert.equal(rows.length,1);assert.equal(rows[0].data.c42,"REF-42");
});
test("repeated source rows have stable identities, separate identical rows retain position",async()=>{
 const a=await sourceKey("income","INGRESOS",2,blank("income"));
 assert.equal(a,await sourceKey("income","INGRESOS",2,blank("income")));
 assert.notEqual(a,await sourceKey("income","INGRESOS",3,blank("income")));
});
function unzip(bytes){
 const files=new Map();let offset=0;
 while(bytes.readUInt32LE(offset)===0x04034b50){
  const method=bytes.readUInt16LE(offset+8),size=bytes.readUInt32LE(offset+18),nameLength=bytes.readUInt16LE(offset+26),extra=bytes.readUInt16LE(offset+28);
  const name=bytes.subarray(offset+30,offset+30+nameLength).toString(),start=offset+30+nameLength+extra;
  const raw=bytes.subarray(start,start+size);files.set(name,(method===8?inflateRawSync(raw):raw).toString());offset=start+size;
 }
 return files;
}
test("XLSX export has annual official tabs, full headers, no formulas, and distinct empty/zero values",async()=>{
 const data=blank("income");data.c12="F-117";data.c21="60,00";data.c24="0,00";data.c17="=HYPERLINK(unsafe)";
 const rows=[{book:"income",data}];
 const file=await makeWorkbook(rows,"IRPF"),files=unzip(Buffer.from(await file.arrayBuffer()));
 assert.match(files.get("xl/workbook.xml"),/name="INGRESOS"/);assert.match(files.get("xl/workbook.xml"),/name="GASTOS"/);
 const sheet=files.get("xl/worksheets/sheet1.xml");
 assert.match(sheet,/r="U3"[^]*?60,00/);assert.match(sheet,/r="X3"[^]*?0,00/);assert.doesNotMatch(sheet,/<f>/);
 assert.doesNotMatch(sheet,/<c r="V3"/);assert.match(sheet,/HYPERLINK/);
 assert.equal((sheet.match(/<row /g)||[]).length,3);
});
test("incomplete drafts can exist without inventing required fields",()=>{
 const d=blank("expense");d.c26="60,00";assert.equal(d.c08,"");assert.ok(errors("expense",d).length);
 assert.equal(blank("investment").c15,"");
});
test("reimport detects reordered rows while preserving multiple identical lines within a new file",()=>{
 const data=blank("income");data.c12="F-117";data.c21="60,00";
 const a={id:"a",book:"income",data,source_key:"first-position"},b={...a,id:"b",source_key:"different-position"};
 assert.equal(duplicateIds([b],[a]).has("b"),true);
 assert.equal(duplicateIds([a,b],[]).size,0);
 assert.equal(duplicateIds([a,b],[a]).size,1);
});
test("editor groups preserve every official column exactly once",()=>{
 for(const book of ["income","expense","investment"]){
  const keys=groups(book).flatMap(g=>g.keys);
  assert.equal(keys.length,schema[book].columns.length);assert.equal(new Set(keys).size,keys.length);
  assert.deepEqual([...keys].sort(),Array.from(schema[book].columns,c=>c.key).sort());
 }
});
const ledgerInvoice={id:"invoice-1",status:"issued",invoice_number:"F-2026-117",issue_date:"2026-10-23",service_date:"2026-10-23",recipient_name:"Pagador de prueba",recipient_tax_id:"00000000T",quantity:1,unit_price_cents:6000,total_cents:6000,vat_cents:0,tax_treatment:"exempt_healthcare"};
test("issued invoices and receipts share one fiscal row without presuming computable income",async()=>{
 const ledger={invoices:[ledgerInvoice],receipts:[{invoice_id:"invoice-1",amount_cents:3500,paid_date:"2026-10-23"}],expenses:[],income:[]};
 const rows=await workspaceRows([],ledger);
 assert.equal(rows.length,1);assert.equal(amount(rows[0]),6000);assert.equal(rows[0].linked.paid,3500);
 assert.equal(rows[0].data.c08,"");assert.equal(rows[0].data.c03,"");assert.equal(rows[0].data.c20,"E1");
 assert.ok(rows[0].linked.locked.includes("c21"));assert.equal(rows[0].virtual,true);
 const persisted={...rows[0],virtual:undefined,data:{...rows[0].data,c01:"2026"}};
 const again=await workspaceRows([persisted],ledger);assert.equal(again.length,1);assert.equal(again[0].data.c01,"2026");
});
test("imported invoice reference links to the issued source instead of creating another row",async()=>{
 const data=blank("income");data.c12="F-2026-117";data.c21="60,00";
 const imported={id:"tax-1",book:"income",data,source_key:"original",source_name:"archivo",source_row:2,notes:""};
 const rows=await workspaceRows([imported],{invoices:[ledgerInvoice],receipts:[],expenses:[],income:[]});
 assert.equal(rows.length,1);assert.equal(rows[0].id,"tax-1");assert.equal(rows[0].linked.id,"invoice-1");assert.equal(amount(rows[0]),6000);
});
test("cash-only income stays distinct from invoice gross and is not duplicated for a known issued reference",async()=>{
 const ledger={invoices:[ledgerInvoice],receipts:[],expenses:[],income:[{id:"external-1",received_date:"2026-10-23",external_reference:"F-2026-117",amount_cents:6000,payment_method:"bizum"},{id:"external-2",received_date:"2026-10-24",external_reference:"OP-2",amount_cents:3500,payment_method:"bizum"}]};
 const rows=await workspaceRows([],ledger);assert.equal(rows.length,2);
 const cash=rows.find(r=>r.id==="external-2");assert.equal(cash.data.c21,"");assert.equal(cash.data.c28,"35,00");assert.equal(cash.data.c08,"");assert.equal(yearOf(cash),"2026");
 const reloaded=await workspaceRows([cash],ledger);assert.equal(reloaded.filter(r=>r.id==="external-2").length,1);
});

