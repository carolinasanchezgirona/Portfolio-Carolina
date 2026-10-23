import {jsPDF} from 'jspdf';
import type {ExportDocument} from './export-model';

export const pdfFontPath='/fonts/residence-sans.ttf';
let fontPromise:Promise<string>|undefined;
async function fontData(){
 if(!fontPromise)fontPromise=fetch(pdfFontPath).then(async response=>{
  if(!response.ok)throw Error('No se ha podido cargar la tipografía del PDF. Reintenta con conexión.');
  const bytes=new Uint8Array(await response.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(binary);
 }).catch(error=>{fontPromise=undefined;throw error;});
 return fontPromise;
}
export async function buildPdf(source:ExportDocument,embeddedFont?:string){
 const doc=new jsPDF({unit:'mm',format:'a4',compress:true,putOnlyUsedFonts:true});
 doc.addFileToVFS('residence.ttf',embeddedFont||await fontData());doc.addFont('residence.ttf','Residence','normal');doc.setFont('Residence');
 doc.setProperties({title:source.title,author:'Carolina Sánchez Girona',subject:source.subtitle});
 const left=18,width=174,bottom=274;let y=30,current='';const contexts=new Map<number,string>();
 const page=()=>{doc.addPage();contexts.set(doc.getNumberOfPages(),current);y=30;};
 function text(value:string,size=10,gap=3){
  doc.setFontSize(size);doc.setTextColor(23,58,94);
  const lines=doc.splitTextToSize(value.replaceAll('\t','    '),width) as string[],lineHeight=size*.47;
  for(const line of lines){if(y+lineHeight>bottom)page();doc.text(line,left,y);y+=lineHeight;}y+=gap;
 }
 text(source.title,23,5);text(source.subtitle,12,5);
 text('Generado: '+new Date(source.createdAt).toLocaleString('es-ES',{timeZone:'Europe/Madrid'}),9,6);
 for(let i=0;i<source.blocks.length;i++){
  const b=source.blocks[i];
  if(b.type==='title'){current=b.text;if(b.page)page();text(b.text,19,5);}
  else if(b.type==='heading'){if(y+24>bottom)page();y+=3;text(b.text,12,3);}
  else if(b.type==='image'){
   if(!b.value)continue;
   try{const props=doc.getImageProperties(b.value),w=Math.min(width,140),h=Math.min(150,w*props.height/props.width),scaledW=h*props.width/props.height;if(y+h+12>bottom)page();text(b.text,10,3);doc.addImage(b.value,props.fileType,left,y,scaledW,h,undefined,'FAST');y+=h+6;}
   catch{throw Error('No se ha podido incorporar una imagen registrada ('+b.text+'). El volcado no se ha descargado para evitar que quede incompleto.');}
  }else text(b.text);
  if(i%100===99)await new Promise<void>(resolve=>setTimeout(resolve,0));
 }
 const total=doc.getNumberOfPages();
 for(let i=1;i<=total;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(90,105,120);doc.text('MI CLÍNICA · RESIDENCIA',left,15);const context=contexts.get(i);if(context)doc.text(context.length>60?context.slice(0,57)+'…':context,192,15,{align:'right'});doc.setDrawColor(213,226,233);doc.line(left,20,192,20);doc.text('Carolina Sánchez Girona · Documento clínico',left,286);doc.text(i+' / '+total,192,286,{align:'right'});}
 return doc;
}
export async function downloadPdf(source:ExportDocument){const doc=await buildPdf(source);doc.save(source.filename);}
