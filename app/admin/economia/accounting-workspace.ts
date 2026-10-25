import {blank,normalize,rowYear,sourceKey,errors,type BookData,type BookKind,type BookRow} from "./tax-book-utils";
export type Linked = {kind:"invoice"|"expense"|"income";id:string;label:string;paid?:number;locked:string[]};
export type WorkspaceRow=BookRow&{linked?:Linked;virtual?:boolean;yearHint?:string;possible?:boolean};
type Invoice={id:string;status:string;invoice_number:string;issue_date:string;service_date:string;recipient_name:string;recipient_tax_id:string;quantity:number;unit_price_cents:number;total_cents:number;vat_cents:number;tax_treatment:string};
export type Ledger={invoices:Invoice[];receipts:{invoice_id:string;amount_cents:number;paid_date:string}[];expenses:{id:string;expense_date:string;supplier:string;amount_cents:number}[];income:{id:string;received_date:string;external_reference:string;amount_cents:number;payment_method:string;voided_at?:string}[]};
export const emptyLedger:Ledger={invoices:[],receipts:[],expenses:[],income:[]};
const decimal=(c:number)=>(Number(c)/100).toFixed(2).replace(".",",");
const date=(v:string)=>v?v.split("-").reverse().join("/"):"";
export const ref=(r:BookRow)=>normalize(r.book==="income"?(r.data.c11||"")+(r.data.c12||""):r.book==="expense"?r.data.c11||"":r.data.c07||"");
export const amount=(r:BookRow):number|null=>{
 const keys=r.book==="income"?["c21","c08","c28"]:r.book==="expense"?["c26","c08","c34"]:["c10"];
 for(const k of keys){const v=r.data[k];if(v!==""&&v!=null&&/^-?\d+,\d{2}$/.test(v))return Math.round(Number(v.replace(",","."))*100);}
 return null;
};
export const rowDate=(r:BookRow)=>r.data[r.book==="investment"?"c18":"c09"]||r.data[r.book==="income"?"c27":r.book==="expense"?"c33":"c09"]||"";
export const party=(r:BookRow)=>r.data[r.book==="income"?"c17":r.book==="expense"?"c19":"c08"]||"";
export const partyId=(r:BookRow)=>r.data[r.book==="income"?"c16":r.book==="expense"?"c18":"c25"]||"";
export const yearOf=(r:WorkspaceRow)=>rowYear(r)||r.yearHint||"";
export function missing(r:BookRow,kind:"nif"|"invoice"|"amount"|"pending",mode:"IRPF"|"UNIFICADO"){
 if(kind==="pending")return errors(r.book,r.data,mode).length>0;
 if(kind==="nif")return !partyId(r);
 if(kind==="invoice")return !ref(r);
 return amount(r)===null;
}
/** Projections show the same operation in the register and its receipt context without creating accounting entries. */
export async function workspaceRows(saved:BookRow[],ledger:Ledger):Promise<WorkspaceRow[]>{
 const result:WorkspaceRow[]=saved.map(r=>({...r,data:{...r.data}}));
 const issued=ledger.invoices.filter(i=>i.status==="issued"),knownInvoiceRefs=new Set(issued.map(i=>normalize(i.invoice_number)));
 const add=async(book:BookKind,id:string,label:string,data:BookData,linked:Linked,yearHint:string)=>{
  const source_key=await sourceKey(book,"linked-"+linked.kind+"-"+id,1,{});
  const persisted=result.find(r=>r.source_key===source_key);
  if(persisted){persisted.linked=linked;persisted.yearHint=yearHint.slice(0,4);return;}
  if(linked.kind==="invoice"||linked.kind==="income"){
   const number=ref({book,data} as BookRow),matching=result.filter(r=>r.book===book&&number&&ref(r)===number);
   if(matching.length){matching.forEach(r=>{r.linked=linked;r.yearHint=yearHint.slice(0,4);});return;}
  }
  // An old cash expense with the same date/supplier/amount as a fiscal row is queued for review, not added to totals twice.
  result.push({id,book,data,source_key,source_name:label,source_row:1,notes:"",linked,virtual:true,yearHint:yearHint.slice(0,4)});
 };
 for(const i of issued){
  const data=blank("income"),base=i.quantity*i.unit_price_cents;
  Object.assign(data,{c06:"F1",c09:date(i.issue_date),c10:date(i.service_date),c12:i.invoice_number,c16:i.recipient_tax_id,c17:i.recipient_name,c21:decimal(i.total_cents),c22:decimal(base),c24:decimal(i.vat_cents)});
  if(i.tax_treatment==="exempt_healthcare")data.c20="E1";
  if(i.tax_treatment==="vat_21"){data.c19="S1";data.c23="21,00";}
  const payments=ledger.receipts.filter(r=>r.invoice_id===i.id),paid=payments.reduce((n,r)=>n+Number(r.amount_cents),0);
  if(payments.length===1){data.c27=date(payments[0].paid_date);data.c28=decimal(payments[0].amount_cents);}
  await add("income",i.id,"Factura "+i.invoice_number,data,{kind:"invoice",id:i.id,label:i.invoice_number,paid,locked:["c06","c09","c10","c12","c16","c17","c19","c20","c21","c22","c23","c24","c27","c28"]},i.issue_date);
 }
 for(const e of ledger.expenses){
  const data=blank("expense");data.c19=e.supplier;data.c26=decimal(e.amount_cents);
  // The old generic expense date is not silently converted to a fiscal invoice date.
  const source_key=await sourceKey("expense","linked-expense-"+e.id,1,{});
  const linked=result.find(r=>r.book==="expense"&&r.notes?.includes("linked-expense:"+e.id));
  if(linked){linked.linked={kind:"expense",id:e.id,label:"Gasto vinculado",locked:[]};linked.yearHint=e.expense_date.slice(0,4);continue;}
  const prior=result.find(r=>r.source_key===source_key);
  if(prior){prior.linked={kind:"expense",id:e.id,label:"Gasto registrado",locked:[]};prior.yearHint=e.expense_date.slice(0,4);continue;}
  const possible=result.some(r=>r.book==="expense"&&normalize(party(r))===normalize(e.supplier)&&amount(r)===Number(e.amount_cents)&&rowDate(r)===date(e.expense_date));
  result.push({id:e.id,book:"expense",data,source_key,source_name:"Gasto registrado · "+e.expense_date,source_row:1,notes:"",virtual:true,yearHint:e.expense_date.slice(0,4),possible,linked:{kind:"expense",id:e.id,label:"Gasto registrado",locked:[]}});
 }
 for(const e of ledger.income.filter(r=>!r.voided_at)){
  if(knownInvoiceRefs.has(normalize(e.external_reference)))continue;
  const data=blank("income");data.c36=e.external_reference;data.c27=date(e.received_date);data.c28=decimal(e.amount_cents);
  if(e.payment_method==="bank_transfer")data.c29="01";
  if(["bizum","cash","card","other"].includes(e.payment_method))data.c29="04";
  if(e.external_reference&&result.some(r=>r.book==="income"&&ref(r)===normalize(e.external_reference)))continue;
  await add("income",e.id,"Cobro registrado · "+e.external_reference,data,{kind:"income",id:e.id,label:e.external_reference,paid:Number(e.amount_cents),locked:["c27","c28","c29","c36"]},e.received_date);
 }
 return result;
}
export function groups(book:BookKind):{title:string;keys:string[];advanced?:boolean}[]{
 const range=(a:number,b:number)=>Array.from({length:b-a+1},(_,i)=>"c"+String(a+i).padStart(2,"0"));
 if(book==="income")return[{title:"Documento",keys:["c01","c02","c06","c09","c10","c11","c12"]},{title:"Cliente o destinatario",keys:range(14,17)},{title:"Importes e impuestos",keys:["c03","c04","c05","c07","c08",...range(18,24),"c31","c32"]},{title:"Cobro",keys:range(27,30)},{title:"Más campos AEAT",keys:["c13","c25","c26",...range(33,36)],advanced:true}];
 if(book==="expense")return[{title:"Documento",keys:["c01","c02","c06",...range(9,14)]},{title:"Proveedor",keys:range(16,19)},{title:"Importes e impuestos",keys:["c03","c04","c05","c07","c08",...range(26,30),"c37","c38"]},{title:"Pago",keys:range(33,36)},{title:"Más campos AEAT",keys:["c15",...range(20,25),"c31","c32",...range(39,42)],advanced:true}];
 return[{title:"Identificación del bien",keys:range(1,9)},{title:"Valor y amortización",keys:range(10,17)},{title:"Factura y proveedor",keys:range(18,26)},{title:"Más campos AEAT",keys:range(27,42),advanced:true}];
}
