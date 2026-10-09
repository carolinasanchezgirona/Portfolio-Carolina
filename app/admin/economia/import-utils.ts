export type Category = "rent" | "utilities" | "software" | "materials" | "marketing" | "training" | "professional" | "other";
export type ExpenseDraft = { expense_date: string; category: Category; supplier: string; concept: string; amount_cents: number };
export type ReviewRow = ExpenseDraft & { key: string; selected: boolean; issue: string; source: number };
export type ColMap = { date: number; supplier: number; concept: number; amount: number; category: number };
const norm = (value: unknown) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const flat = (value: unknown) => norm(value).replace(/[^a-z0-9]/g, "");
const categories: Record<string, Category> = {
  alquiler:"rent",rent:"rent",suministros:"utilities",electricidad:"utilities",agua:"utilities",gas:"utilities",utilities:"utilities",
  programa:"software",software:"software",suscripcion:"software",suscripciones:"software",informatica:"software",
  material:"materials",materiales:"materials",materials:"materials",papeleria:"materials",
  publicidad:"marketing",marketing:"marketing",anuncios:"marketing",
  formacion:"training",training:"training",curso:"training",cursos:"training",
  profesional:"professional",profesionales:"professional",gestoria:"professional",asesoria:"professional",
  other:"other",otros:"other",otro:"other"
};
export const categoryFrom = (value: unknown): Category => categories[flat(value)] || "other";
export function dateISO(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0,10);
  if (typeof value === "number" && Number.isFinite(value) && value >= 20000 && value <= 80000) {
    return new Date(Date.UTC(1899, 11, 30) + Math.floor(value) * 86400000).toISOString().slice(0,10);
  }
  const str = String(value ?? "").trim();
  const m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/.exec(str);
  const iso = m ? m[3] + "-" + m[2].padStart(2,"0") + "-" + m[1].padStart(2,"0") : /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : "";
  if (!iso) return "";
  const [y,mo,d] = iso.split("-").map(Number);
  const time = new Date(Date.UTC(y,mo-1,d));
  return time.getUTCFullYear()===y && time.getUTCMonth()===mo-1 && time.getUTCDate()===d && y>=2020 && y<=2100 ? iso:"";
}
export function amountCents(value: unknown): number {
  if (typeof value === "number") {
    const cents=Math.round(value*100);
    return Number.isFinite(value)&& value>0 && value<=100000 && Math.abs(value*100-cents)<0.00001 ? cents : 0;
  }
  const raw=String(value ?? "").trim().replace(/\s/g,"").replace(/[€$]/g,"");
  if(!raw || !/^\d[\d.,]*$/.test(raw)) return 0;
  let dec=raw;
  const lastComma=dec.lastIndexOf(","),lastDot=dec.lastIndexOf(".");
  if(lastComma>=0 && lastDot>=0) {
    const decimal=lastComma>lastDot ? "," : ".";
    dec=dec.replace(decimal==="," ? /\./g : /,/g,"").replace(decimal,".");
  } else if(lastComma>=0) {
    dec=dec.replace(/\./g,"").replace(",",".");
  } else if((dec.match(/\./g)||[]).length>1) dec=dec.replace(/\./g,"");
  if(!/^\d+(\.\d{1,2})?$/.test(dec)) return 0;
  const result=Math.round(Number(dec)*100);
  return result>=1 && result<=10000000 ? result:0;
}
const aliases:Record<keyof ColMap,string[]> = {
 date:["fecha","fechagasto","fechafactura","fechaoperacion","date","dia","fechaemision"],
 supplier:["proveedor","emisor","comercio","establecimiento","beneficiario","supplier","tercero"],
 concept:["concepto","descripcion","detalle","descripcions","producto","servicio","observaciones","description"],
 amount:["importe","importeeur","importetotal","total","totaleur","importeconiva","cantidad","amount","monto","importegasto","totalfactura"],
 category:["categoria","tipo","clase","category","grupogasto"]
};
export function guessColumns(row: unknown[]): ColMap {
  const result: ColMap = {date:-1,supplier:-1,concept:-1,amount:-1,category:-1};
  for(const field of Object.keys(result) as (keyof ColMap)[]){
    const idx=row.findIndex(value=> aliases[field].includes(flat(value)));
    result[field]=idx;
  }
  return result;
}
export function createReviewRows(matrix: unknown[][], columns: ColMap): ReviewRow[] {
  return matrix.slice(1,251).map((row,index)=>{
    const cell=(column:number)=>column>=0?row[column]:"";
    const supplier=String(cell(columns.supplier)??"").trim().slice(0,160);
    const concept=String(cell(columns.concept)??"").trim().slice(0,250);
    const draft:ExpenseDraft={
      expense_date:dateISO(cell(columns.date)),category:categoryFrom(cell(columns.category)),
      supplier,concept,amount_cents:amountCents(cell(columns.amount))
    };
    return {...draft, key:String(index+2), source:index+2, selected:true,issue:expenseIssue(draft)};
  }).filter(row=>row.expense_date||row.supplier||row.concept||row.amount_cents);
}
export function expenseIssue(row:ExpenseDraft):string {
  if(!dateISO(row.expense_date))return "Revisar fecha";
  if(row.supplier.trim().length<2)return "Falta proveedor";
  if(row.concept.trim().length<2)return "Falta concepto";
  if(!Number.isSafeInteger(row.amount_cents)||row.amount_cents<1||row.amount_cents>10000000)return "Importe inválido";
  if(row.supplier.length>160||row.concept.length>250)return "Texto demasiado largo";
  if(!["rent","utilities","software","materials","marketing","training","professional","other"].includes(row.category))return "Categoría inválida";
  return "";
}
export function fingerprint(row:ExpenseDraft):string {
 return [row.expense_date,flat(row.supplier),flat(row.concept),String(row.amount_cents)].join("|");
}
export function parseCSV(content:string):string[][] {
 const text=content.replace(/^\uFEFF/,"").slice(0,1500000);
 const first=text.split(/\r?\n/)[0]||"";
 const options=[";",",","\t"];
 const delim=options.sort((a,b)=>first.split(b).length-first.split(a).length)[0];
 let rows:string[][]=[], row:string[]=[], value="",quoted=false;
 for(let i=0;i<text.length;i++){
  const ch=text[i];
  if(ch==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}
  else if(ch===delim&&!quoted){row.push(value);value="";}
  else if((ch==="\r"||ch==="\n")&&!quoted){if(ch==="\r"&&text[i+1]==="\n")i++;row.push(value);if(row.some(x=>x.trim()))rows.push(row);row=[];value="";if(rows.length>251)break;}
  else value+=ch;
 }
 if(quoted)throw new Error("CSV con comillas sin cerrar.");
 if(row.length||value){row.push(value);if(row.some(x=>x.trim()))rows.push(row);}
 return rows;
}
