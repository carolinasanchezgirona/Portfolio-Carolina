import {schema,type BookKind,type BookRow} from "./tax-book-utils";
const xml=(v:string)=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]!)).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,"");
const letter=(n:number):string=>n<26?String.fromCharCode(65+n):letter(Math.floor(n/26)-1)+String.fromCharCode(65+n%26);
function crc32(bytes:Uint8Array){let crc=-1;for(const b of bytes){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return(crc^-1)>>>0;}
/** Minimal local OOXML writer: all fiscal values are explicit strings, never executable formulas. */
export async function makeWorkbook(rows:BookRow[],mode:"IRPF"|"UNIFICADO"):Promise<Blob>{
 const files:{name:string;body:string}[]=[];
 const books:BookKind[]=["income","expense",...(rows.some(r=>r.book==="investment")?["investment" as const]:[])];
 const names=books.map(b=>mode==="IRPF"?(b==="income"?"INGRESOS":b==="expense"?"GASTOS":"BIENES-INVERSIÓN"):schema[b].sheet);
 books.forEach((book,i)=>{
  const s=schema[book];
  // AEAT's separate IRPF books leave IVA-only cells empty; originals remain intact in the editable register.
  const ivaOnly=mode==="IRPF"?(book==="income"?[18,19,20,33]:book==="expense"?[13,20,21,22,23,24,25,39]:[27,28,29,30,31,32,33,39]):[];
  const data=[...s.headers,...rows.filter(r=>r.book===book).map(r=>s.columns.map((c,n)=>ivaOnly.includes(n+1)?"":r.data[c.key]||""))];
  const body=data.map((row,n)=>'<row r="'+(n+1)+'">'+row.map((v,col)=>v===""?"":'<c r="'+letter(col)+(n+1)+'" t="inlineStr"><is><t xml:space="preserve">'+xml(v)+'</t></is></c>').join("")+"</row>").join("");
  files.push({name:"xl/worksheets/sheet"+(i+1)+".xml",body:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>'+s.columns.map((c,n)=>'<col min="'+(n+1)+'" max="'+(n+1)+'" width="'+(c.kind==="date"?15:24)+'" customWidth="1"/>').join("")+'</cols><sheetData>'+body+'</sheetData><pageSetup paperSize="8" orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>'});
 });
 files.push({name:"xl/workbook.xml",body:'<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+names.map((n,i)=>'<sheet name="'+xml(n)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>').join("")+'</sheets></workbook>'});
 files.push({name:"xl/_rels/workbook.xml.rels",body:'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+books.map((_,i)=>'<Relationship Id="rId'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join("")+'</Relationships>'});
 files.push({name:"_rels/.rels",body:'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'});
 files.push({name:"[Content_Types].xml",body:'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+books.map((_,i)=>'<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join("")+'</Types>'});
 const out:Uint8Array[]=[],directory:Uint8Array[]=[];let offset=0;
 for(const f of files){
  const name=new TextEncoder().encode(f.name),raw=new TextEncoder().encode(f.body);
  let data:Uint8Array=raw,method=0;
  try{const stream=new Blob([raw]).stream().pipeThrough(new CompressionStream("deflate-raw"));data=new Uint8Array(await new Response(stream).arrayBuffer());method=8;}catch{/* Stored ZIP remains valid on older browsers. */}
  const crc=crc32(raw),local=new Uint8Array(30+name.length),v=new DataView(local.buffer);
  v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(8,method,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,raw.length,true);v.setUint16(26,name.length,true);local.set(name,30);
  const central=new Uint8Array(46+name.length),c=new DataView(central.buffer);
  c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(10,method,true);c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,raw.length,true);c.setUint16(28,name.length,true);c.setUint32(42,offset,true);central.set(name,46);
  out.push(local,data);directory.push(central);offset+=local.length+data.length;
 }
 const size=directory.reduce((n,v)=>n+v.length,0),end=new Uint8Array(22),v=new DataView(end.buffer);
 v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);v.setUint32(12,size,true);v.setUint32(16,offset,true);
 return new Blob([...out,...directory,end] as BlobPart[],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
}
