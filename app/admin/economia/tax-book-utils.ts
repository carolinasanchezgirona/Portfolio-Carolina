import { schema, choices, type BookKind } from "./tax-book-schema";
import { dateISO } from "./import-utils";
export { schema, choices }; export type { BookKind };
export type BookData = Record<string,string>;
export type BookRow = {id:string;book:BookKind;data:BookData;source_key:string;source_name:string;source_row:number;notes:string;created_at?:string};
export const normalize=(v:unknown)=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
export const blank=(book:BookKind):BookData=>Object.fromEntries(schema[book].columns.map(c=>[c.key,""]));
const key=(n:number)=>"c"+String(n).padStart(2,"0");
export function decimal(value:unknown):string {
  if(value===null||value===undefined||String(value).trim()==="")return "";
  if(typeof value==="number")return Number.isFinite(value)?value.toFixed(2).replace(".",","):"";
  let v=String(value).trim().replace(/\s|€|EUR/gi,"");
  if(!/^-?\d[\d.,]*$/.test(v))return String(value).trim();
  if(v.includes(",")&&v.includes("."))v=v.lastIndexOf(",")>v.lastIndexOf(".")?v.replace(/\./g,"").replace(",","."):v.replace(/,/g,"");
  else if(v.includes(","))v=v.replace(",",".");
  if(!/^-?\d+(\.\d{1,2})?$/.test(v))return String(value).trim();
  return Number(v).toFixed(2).replace(".",",");
}
export function cellValue(book:BookKind,k:string,value:unknown):string{
  if(value==null||String(value).trim()==="")return "";
  const col=schema[book].columns.find(c=>c.key===k)!;
  const option=choices[book][k]?.find(o=>normalize(o.label)===normalize(value)||o.value===String(value)||(typeof value==="number"&&/^\d+$/.test(o.value)&&Number(o.value)===value));
  if(option)return option.value;
  if(col.kind==="date"){const iso=dateISO(value);return iso?iso.split("-").reverse().join("/"):String(value).trim();}
  if(col.kind==="number")return /\(4,0\)/.test(col.format)?String(value).trim():decimal(value);
  // Never truncate source identifiers or names: long values stay visible and are flagged for review.
  return String(value).trim();
}
const common:Record<string,string[]> = {
 c01:["ejercicio","añofiscal","ano"],c02:["periodo","trimestre"],
 c03:["codigoactividad"],c04:["tipoactividad"],c05:["iae","epigrafe","epigrafeiae"],
 c06:["tipofactura"],c07:["conceptofiscal","conceptoirpf"],
 c08:["ingresocomputable","gastodeducible"],
 c09:["fechaexpedicion","fechaemision","fechafactura"],c10:["fechaoperacion","fechaprestacion"],
};
const income:Record<string,string[]>={
 c12:["factura","numerofactura","nºfactura","numerodefactura"],c11:["serie","seriefactura"],
 c16:["nif","nifcliente","nifdestinatario","dninif","cif","nifnie"],c17:["cliente","destinatario","nombrecliente","nombredestinatario","paciente","nombre","nombreyapellidos"],
 c21:["totalfactura","importetotal","total","importe"],c22:["base","baseimponible"],c23:["tipoiva","iva","porcentajeiva"],c24:["cuotaiva","ivaeuros","cuotaivarepercutida"],
 c27:["fechacobro","fechadecobro"],c28:["importecobrado","cobrado"],c29:["mediodepago","metododepago","formadepago","medio"],
 c31:["tiporetencion","retencionporcentaje","irpfporcentaje"],c32:["importeretencion","importeretenido","retencioneuros","retencion"],
 c36:["referencia","referenciaexterna","referenciaoperacion","idoperacion"],
};
const expense:Record<string,string[]>={
 c11:["factura","numerofactura","nºfactura","numerodefactura","serienumero"],c18:["nif","nifproveedor","nifexpedidor","cif"],
 c19:["proveedor","expedidor","nombreproveedor"],c26:["totalfactura","importetotal","total","importe"],c27:["base","baseimponible"],
 c28:["tipoiva","porcentajeiva"],c29:["cuotaiva","cuotaivasoportado"],c30:["ivadeducible","cuotadeducible"],
 c33:["fechapago"],c34:["importepagado","pagado"],c35:["mediodepago","metododepago","formadepago"],
 c37:["tiporetencion","irpfporcentaje"],c38:["importeretencion","importeretenido","retencioneuros"],c42:["referencia","referenciaexterna"],
};
const investment:Record<string,string[]>={
 c06:["tipobien"],c07:["identificador","idbien"],c08:["descripcion","descripcionbien","bien"],
 c09:["fechainicioutilizacion","fechaalta"],c10:["valoradquisicion"],c11:["valoramortizable"],
 c12:["metodoamortizacion"],c13:["porcentajeamortizacion"],c14:["amortizacionacumuladainicio"],
 c15:["cuotaamortizacion","amortizacionanual"],c16:["amortizacionacumuladafinal"],c17:["amortizacionpendiente"],
 c18:["fechaexpedicion","fechafactura"],c19:["factura","numerofactura"],c25:["nif","nifproveedor"],c26:["proveedor"],c42:["referenciaexterna","referencia"],
};
export function detectMapping(book:BookKind,matrix:unknown[][],header:number):Record<string,number>{
 const headers=matrix[header]||[];
 const official=schema[book].columns.length===headers.length&&normalize(headers[0])==="autoliquidacion"&&normalize(headers[2])==="actividad";
 if(official)return Object.fromEntries(schema[book].columns.map((c,i)=>[c.key,i]));
 const aliases={...common,...(book==="income"?income:book==="expense"?expense:investment)};
 const result=Object.fromEntries(schema[book].columns.map(c=>{
   const names=[normalize(c.label),...(aliases[c.key]||[]).map(normalize)];
   const hits=headers.map((v,i)=>names.includes(normalize(v))?i:-1).filter(i=>i>=0);
   return [c.key,hits.length===1?hits[0]:-1];
 }));
 const bank=book!=="investment"&&(headers.some(v=>["fechavalor","saldo"].includes(normalize(v)))||matrix.slice(header+1,header+6).some(r=>r.some(v=>/bizum recibido|bizum enviado/i.test(String(v)))));
 if(bank){
  // Bank money is a payment, not the taxable base or gross invoice amount.
  const dateIndex=headers.findIndex(v=>["fecha","fechaoperacion","fechadeoperacion"].includes(normalize(v)));
  const amountIndex=headers.findIndex(v=>["importe","importeoperacion","importeeur"].includes(normalize(v)));
  result[book==="income"?"c27":"c33"]=dateIndex;result[book==="income"?"c28":"c34"]=amountIndex;
  result.c10=-1;result[book==="income"?"c21":"c26"]=-1;
 }
 return result;
}
export function detectHeader(book:BookKind,matrix:unknown[][]):number{
 let best=0,score=0;
 matrix.slice(0,30).forEach((_,i)=>{const n=Object.values(detectMapping(book,matrix,i)).filter(x=>x>=0).length;if(n>score){score=n;best=i;}});
 return best;
}
export function mappedRows(book:BookKind,matrix:unknown[][],header:number,map:Record<string,number>):{data:BookData;source_row:number}[]{
 const official=normalize(matrix[header]?.[0])==="autoliquidacion";
 let start=header+(official?2:1);
 if(String(matrix[start]?.[0]||"").startsWith("Decimal"))start++;
 if(matrix.length-start>10000)throw Error("Máximo 10.000 filas por archivo. No se ha guardado ninguna fila.");
 return matrix.slice(start).map((r,i)=>{
  const data=blank(book);for(const col of schema[book].columns){const at=map[col.key];if(at>=0)data[col.key]=cellValue(book,col.key,r[at]);}
  // A bare 'Fecha' is ambiguous: it is not promoted to invoice, operation or payment date.
  // No inferred fiscal codes, VAT exemption, deductibility, counterparty or invoice number.
  const payKey=book==="income"?"c29":book==="expense"?"c35":"";
  if(payKey&&data[payKey]){const m=normalize(data[payKey]);data[payKey]=/^(0[1-5])$/.test(data[payKey])?data[payKey]:m.includes("transfer")?"01":m.includes("cheque")?"02":m.includes("domicili")?"05":["bizum","tarjeta","efectivo","cash"].includes(m)?"04":data[payKey];}
  return {data,source_row:start+i+1};
 }).filter((r,i)=>Object.values(r.data).some(v=>v!=="")&&!/^(?:total(?:es)?|subtotal)(?:\s|$)/i.test(String(matrix[start+i]?.[0]||"").trim()));
}
export function errors(book:BookKind,data:BookData,mode:"IRPF"|"UNIFICADO"="IRPF"):string[]{
 const e:string[]=[];
 const required=book==="investment"?[1,2,3,4,5,6,7,8,9,10,11,12,13,15]:[1,2,3,4,5,6,7,8,9,book==="income"?12:11];
 for(const n of required){const k=key(n);if(!data[k])e.push("Falta "+schema[book].columns[n-1].label);}
 if(data.c01&&!/^20\d{2}$/.test(data.c01))e.push("Ejercicio inválido");
 if(data.c02&&!(book==="investment"?["4T","0A"]:["1T","2T","3T","4T"]).includes(data.c02))e.push("Periodo inválido");
 if(data.c03&&!["A","B","C","D"].includes(data.c03))e.push("Código de actividad inválido");
 if(["A","B"].includes(data.c03)&&data.c04&&!/^0[1-6]$/.test(data.c04))e.push("Tipo de actividad inválido");
 if(data.c05&&data.c05.length>4)e.push("Epígrafe IAE: máximo 4 caracteres");
 for(const col of schema[book].columns){
  const v=data[col.key];if(!v)continue;
  if(col.kind==="date"&&!dateISO(v))e.push(col.label+": fecha inválida");
  if(col.kind==="number"&&!(/\(4,0\)/.test(col.format)?/^\d{4}$/:/^-?\d{1,10},\d{2}$/).test(v))e.push(col.label+": formato numérico inválido");
  const max=/Alfanumérico\s*\((\d+)\)/i.exec(col.format)?.[1];
  if(max&&v.length>Number(max))e.push(col.label+": supera "+max+" caracteres");
  if(choices[book][col.key]?.length&&!choices[book][col.key].some(o=>o.value===v))e.push(col.label+": código no reconocido");
 }
 if(book!=="investment"){
  const ref=data[book==="income"?"c16":"c18"],name=data[book==="income"?"c17":"c19"],type=data.c06;
  const noParty=type==="SF"&&(book==="income"?["I06"]:["G02","GY8","G38","G39"]).includes(data.c07);
  if(!noParty&&type!=="F2"&&type!=="F4"&&(!ref||!name))e.push("Falta identificación o nombre de la contraparte");
  if(data.c07&&!(book==="income"?/^I0[1-9]$/:/^G(?:\d{2}|Y[0-9])$/).test(data.c07))e.push("Concepto fiscal no reconocido");
  if(type&&!["F1","F2","F3","F4","F5","F6","R1","R2","R3","R4","R5","SF","LC","DV","AJ"].includes(type))e.push("Tipo de factura no reconocido");
  if(mode==="UNIFICADO"&&book==="income"&&type==="SF")e.push("SF no es válido en el libro de facturas expedidas del IVA");
  if(mode==="UNIFICADO"){
   for(const n of book==="income"?[18,21,22]:[13,20,26,27,28,29,30])if(!data[key(n)])e.push("Falta "+schema[book].columns[n-1].label+" para el libro unificado");
   if(book==="income"){
    if(!data.c19&&!data.c20)e.push("Falta calificación de la operación o causa de exención");
    if(data.c19&&data.c20)e.push("Indica calificación de la operación o causa de exención, no ambas");
    if(data.c19==="S1"&&(!data.c23||!data.c24))e.push("Faltan tipo y cuota de IVA para S1");
   }
  }
 }
 return e;
}
export function rowYear(r:BookRow):string{return r.data.c01||((r.data[r.book==="investment"?"c18":"c09"]||"").split("/")[2])||"";}
export async function sourceKey(book:BookKind,sheet:string,row:number,data:BookData):Promise<string>{
 const bytes=new TextEncoder().encode(JSON.stringify([book,sheet,row,data]));
 return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",bytes)),b=>b.toString(16).padStart(2,"0")).join("");
}
