import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { amountCents, dateISO, parseCSV, guessColumns, createReviewRows, expenseIssue, fingerprint, categoryFrom } from "../app/admin/economia/import-utils.ts";

const read = path => readFileSync(new URL("../" + path, import.meta.url),"utf8");
const ui=read("app/admin/economia/import-tools.tsx");
const page=read("app/admin/economia/page.tsx");
const bridge=read("public/admin-economia.js");
const xlsx=read("app/admin/economia/xlsx-reader.ts");

test("importa el CSV de gastos exportado por la misma aplicación, con punto decimal",()=>{
 const rows=parseCSV("Fecha,Categoría,Proveedor,Concepto,Importe EUR\n2026-10-09,software,Software Uno,Suscripción,27.90\n2026-10-08,training,Academia,Curso,120.00");
 const map=guessColumns(rows[0]);
 assert.deepEqual([map.date,map.supplier,map.concept,map.amount,map.category],[0,2,3,4,1]);
 const parsed=createReviewRows(rows,map);
 assert.equal(parsed.length,2);
 assert.equal(parsed[0].amount_cents,2790);
 assert.equal(parsed[1].amount_cents,12000);
 assert.equal(parsed[0].issue,"");
});
test("interpreta formatos españoles y rechaza cantidades inseguras o negativas",()=>{
 for(const [value,expected] of [["1.234,56",123456],["1,20",120],["75.00",7500],["0,99",99],["-45,00",0],["1e6",0],["15,123",0],["",0]])assert.equal(amountCents(value),expected,String(value));
 assert.equal(amountCents(75.25),7525);
 assert.equal(amountCents(Number.NaN),0);
});
test("fechas Excel, DD/MM/AAAA y fechas imposibles no se confunden",()=>{
 assert.equal(dateISO("09/10/2026"),"2026-10-09");
 assert.equal(dateISO("2026-10-09"),"2026-10-09");
 assert.equal(dateISO("31/02/2026"),"");
 assert.equal(dateISO("2026-13-09"),"");
 assert.equal(dateISO(46000),"2025-12-09");
});
test("detecta filas incompletas y posibles duplicados por contenido normalizado",()=>{
 const a={expense_date:"2026-10-09",supplier:"Papelería",concept:"Papel A4",amount_cents:2100,category:"materials"};
 const b={...a,supplier:"PAPELERIA",concept:"Papel A-4"};
 assert.equal(fingerprint(a),fingerprint(b));
 assert.equal(expenseIssue(a),"");
 assert.match(expenseIssue({...a,supplier:""}),/proveedor/i);
 assert.match(expenseIssue({...a,amount_cents:0}),/importe/i);
 assert.equal(categoryFrom("formación"),"training");
});
test("CSV con separador de punto y coma y comillas no rompe filas",()=>{
 const parsed=parseCSV('Fecha;Categoría;Proveedor;Concepto;Importe EUR\n09/10/2026;Otros;"Tienda, S.L.";"Servicio; mensual";"75,00"\n');
 assert.equal(parsed[1][2],"Tienda, S.L.");
 assert.equal(parsed[1][3],"Servicio; mensual");
 assert.equal(createReviewRows(parsed,guessColumns(parsed[0]))[0].amount_cents,7500);
});
test("la importación exige autorización, confirmación y no emite facturas",()=>{
 assert.match(page,/EconomyImportTools/);
 assert.match(bridge,/user\?\.id !== OWNER/);
 assert.match(bridge,/function exposeImportBridge/);
 assert.match(bridge,/function importReviewedExpenses/);
 assert.match(bridge,/window\.dispatchEvent\(new Event\("dememoria-econ-ready"\)\)/);
 assert.match(ui,/checked=\{confirmed\}/);
 assert.match(ui,/!selected\.length\|\|!confirmed/);
 assert.match(ui,/No se suben ni se guardan como adjuntos/);
 assert.doesNotMatch(ui,/billing_invoices/);
 assert.match(bridge,/return:minimal/);
});
test("OCR se ejecuta en navegador y los datos no se guardan sin revisión",()=>{
 assert.match(ui,/createWorker\("spa"\)/);
 assert.match(ui,/worker\.recognize\(file\)/);
 assert.match(ui,/stageExpense\(ocr\)/);
 assert.match(ui,/image\/jpeg/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|api\.openai\.com/);
});
test("el lector XLSX tiene límites y no contacta con plataformas externas",()=>{
 assert.match(xlsx,/MAX_FILE = 5_000_000/);
 assert.match(xlsx,/MAX_XML = 7_000_000/);
 assert.match(xlsx,/DecompressionStream\("deflate-raw"\)/);
 assert.match(xlsx,/\.xlsx/);
 assert.doesNotMatch(xlsx,/fetch\(|XMLHttpRequest|https:\/\//);
});
