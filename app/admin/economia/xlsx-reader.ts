/**
 * XLSX reader intentionally uses only browser built-ins.
 * No invoice or spreadsheet bytes are uploaded or sent to third-party parsers.
 * This is a bounded OOXML reader for standard .xlsx workbooks, not legacy .xls.
 */
const MAX_FILE = 5_000_000;
const MAX_XML = 7_000_000;
const MAX_SHEETS = 8;
const textDecoder = new TextDecoder("utf-8", {fatal:false});
function u16(view:DataView,n:number){return view.getUint16(n,true);}
function u32(view:DataView,n:number){return view.getUint32(n,true);}
function parseXml(value:string):Document{
  const xml=new DOMParser().parseFromString(value,"application/xml");
  if(xml.querySelector("parsererror"))throw Error("El Excel contiene XML no válido.");
  return xml;
}
function byLocal(tag:Element,local:string):Element[]{
  return Array.from(tag.getElementsByTagName("*")).filter(el=>el.localName===local);
}
export async function readXlsxLocally(file:File):Promise<{name:string;rows:unknown[][]}[]> {
  if(!/\.xlsx$/i.test(file.name))throw Error("Se admite Excel .xlsx. Los antiguos .xls deben guardarse primero como .xlsx.");
  if(!file.size||file.size>MAX_FILE)throw Error("El archivo Excel debe tener menos de 5 MB.");
  if(typeof DecompressionStream==="undefined")throw Error("Este navegador no permite descomprimir Excel localmente. Puedes exportarlo a CSV.");
  const bytes=new Uint8Array(await file.arrayBuffer());
  const view=new DataView(bytes.buffer);
  let eocd=-1;
  for(let p=bytes.length-22;p>=Math.max(0,bytes.length-66000);p--){if(u32(view,p)===0x06054b50){eocd=p;break;}}
  if(eocd<0)throw Error("El Excel no tiene una estructura ZIP válida.");
  const count=u16(view,eocd+10),offset=u32(view,eocd+16);
  if(count>450)throw Error("El Excel contiene demasiados archivos internos.");
  let at=offset;
  const entries=new Map<string,{start:number;size:number;method:number}>();
  for(let i=0;i<count;i++){
    if(at+46>bytes.length||u32(view,at)!==0x02014b50)throw Error("Índice del Excel no válido.");
    const method=u16(view,at+10),size=u32(view,at+20), nameLength=u16(view,at+28);
    const extraLength=u16(view,at+30),commentLength=u16(view,at+32),local=u32(view,at+42);
    if(at+46+nameLength>bytes.length)throw Error("Nombre interno de Excel corrupto.");
    const name=textDecoder.decode(bytes.subarray(at+46,at+46+nameLength)).replace(/\\/g,"/");
    if(size>MAX_XML)throw Error("Un recurso del Excel es demasiado grande.");
    if(!name.includes("..")&& !name.startsWith("/")&& /^[A-Za-z0-9_.\/-]+$/.test(name))entries.set(name,{start:local,size,method});
    at+=46+nameLength+extraLength+commentLength;
  }
  async function fileText(name:string):Promise<string>{
    const entry=entries.get(name);
    if(!entry)return "";
    if(entry.start+30>bytes.length||u32(view,entry.start)!==0x04034b50)throw Error("Recurso ZIP inválido.");
    const localNameLength=u16(view,entry.start+26), localExtraLength=u16(view,entry.start+28);
    const start=entry.start+30+localNameLength+localExtraLength;
    if(start+entry.size>bytes.length)throw Error("Recurso ZIP truncado.");
    const source=new Uint8Array(bytes.subarray(start,start+entry.size));
    if(entry.method===0)return textDecoder.decode(source);
    if(entry.method!==8)throw Error("Excel con compresión no compatible.");
    const stream=new Blob([source]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    const reader=stream.getReader();
    let chunks:Uint8Array[]=[],length=0;
    try{
      while(true){const {done,value}=await reader.read();if(done)break;
        length+=value.byteLength;if(length>MAX_XML)throw Error("El Excel supera el límite de seguridad.");
        chunks.push(value);
      }
    }finally{reader.releaseLock();}
    const content=new Uint8Array(length);let cursor=0;
    for(const chunk of chunks){content.set(chunk,cursor);cursor+=chunk.length;}
    return textDecoder.decode(content);
  }
  const sheetPaths=Array.from(entries.keys()).filter(name=>/^xl\/worksheets\/sheet\d+\.xml$/.test(name))
    .sort((a,b)=>Number(a.match(/sheet(\d+)/)?.[1]||0)-Number(b.match(/sheet(\d+)/)?.[1]||0)).slice(0,MAX_SHEETS);
  if(!sheetPaths.length)throw Error("No se encuentran hojas de cálculo compatibles.");
  let shared:string[]=[];
  const strings=await fileText("xl/sharedStrings.xml");
  if(strings){
    const xml=parseXml(strings);
    shared=byLocal(xml.documentElement,"si").slice(0,50000).map(si=>byLocal(si,"t").map(x=>x.textContent||"").join(""));
  }
  const all=[];
  for(const path of sheetPaths){
    const xml=parseXml(await fileText(path));
    const rows:unknown[][]=[];
    const xrows=byLocal(xml.documentElement,"row").slice(0,255);
    for(const row of xrows){
      const array:unknown[]=[];
      for(const cell of Array.from(row.children).filter(el=>el.localName==="c")){
        const address=cell.getAttribute("r")||"";
        const colLetters=/^([A-Z]{1,3})\d+$/.exec(address)?.[1];
        if(!colLetters)continue;
        const col=[...colLetters].reduce((acc,ch)=>acc*26+ch.charCodeAt(0)-64,0)-1;
        if(col<0||col>=35)continue;
        const t=cell.getAttribute("t"), val=Array.from(cell.children).find(e=>e.localName==="v")?.textContent || "";
        const inline=Array.from(cell.children).find(e=>e.localName==="is");
        let value:unknown=val;
        if(t==="s")value=shared[Number(val)]||"";
        else if(t==="inlineStr" && inline)value=byLocal(inline,"t").map(e=>e.textContent||"").join("");
        else if(t==="n"||(!t&&val))value=Number(val);
        else if(t==="b")value=val==="1";
        array[col]=value;
      }
      if(array.some(x=>x!==undefined&&x!=="")) rows.push(array);
    }
    all.push({name:path.split("/").pop()?.replace(".xml","")||path,rows});
  }
  return all;
}
