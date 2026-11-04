(()=>{
"use strict";
const HOST="https://grgyvdxkjdstdyumdfyg.supabase.co";
const KEY="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const BUCKET="clinical-test-library";
const labels={diva5:"DIVA-5",asrs:"ASRS-v1.1",wfirs:"WFIRS-S",phq9:"PHQ-9",gad7:"GAD-7",d2r:"d2-R",fdt:"FDT",tavec:"TAVEC",tesen:"TESEN",tmt:"TMT A/B",cpt3:"CPT-3",working_memory:"Memoria de trabajo",other:"Otra prueba",anamnesis:"Anamnesis clínica propia",differential:"Diagnóstico diferencial propio"};
const base=["diva5","asrs","wfirs","phq9","gad7","anamnesis","differential"];
const extended=["d2r","fdt","tavec","tesen","tmt","cpt3","working_memory","other"];
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const $=(q,r=document)=>r.querySelector(q);
function el(tag,text,cls){const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x;}
function button(text,fn){const b=el("button",text,"adhd-pdf-btn");b.type="button";b.addEventListener("click",fn);return b;}
const token=()=>{try{return JSON.parse(sessionStorage.getItem("dememoria_admin_session")||"null")?.access_token||"";}catch{return ""}};
function headers(){const t=token();if(!t)throw Error("Vuelve a iniciar sesión profesional.");return {apikey:KEY,Authorization:"Bearer "+t};}
async function getOriginals(){
 const r=await fetch(HOST+"/rest/v1/clinical_test_library?select=*&scope=eq.original&order=uploaded_at.desc",
 {cache:"no-store",headers:headers()});
 if(!r.ok)throw Error("No se pudo consultar la biblioteca privada ("+r.status+").");
 return r.json();
}
async function storeIndex(data){
 const r=await fetch(HOST+"/rest/v1/clinical_test_library",{method:"POST",headers:{...headers(),"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(data)});
 if(!r.ok)throw Error("No se pudo registrar el original ("+r.status+").");
 return r.json();
}
const objectPath=p=>p.split("/").map(encodeURIComponent).join("/");
let root=null,panel=null,body=null,notice=null,assessment="",modality="",originals=[],seq=0,busy=false,pending=null;
function status(t,error=false){if(!notice)return;notice.textContent=t;notice.classList.toggle("error",error);}
function init(){
 const parent=$("#adhd-assessment-module");if(!parent||root===parent)return;
 root=parent;panel=el("section",undefined,"adhd-pdf-library");panel.hidden=true;panel.id="adhd-pdf-library";
 const details=el("details",undefined,"adhd-pdf-management");
 details.append(el("summary","Biblioteca privada de PDFs originales"));
 details.append(el("p","Puedes cargar una vez tus copias originales autorizadas. Después, desde la pestaña de cada test, se abrirán directamente para consultarlos, imprimirlos o descargarlos. No se almacenan los PDFs cumplimentados en esta fase.","adhd-pdf-summary"));
 notice=el("p",undefined,"adhd-pdf-status");notice.setAttribute("role","status");body=el("div");
 details.append(notice,body);panel.append(details);
 const editor=$(".adhd-editor",parent);if(editor)parent.insertBefore(panel,editor);else parent.append(panel);
 parent.addEventListener("adhd:assessment",sync);
 parent.addEventListener("adhd:open-pdf",e=>handleRequest(e.detail));
 parent.addEventListener("adhd:pdf-open-request",e=>handleRequest(e.detail));
 new MutationObserver(sync).observe(parent,{attributes:true,attributeFilter:["data-assessment-id","data-assessment-modality"]});
 sync();
}
function sync(){
 if(!root)return;
 const a=root.dataset.assessmentId||"",m=root.dataset.assessmentModality||"";
 if(!uuid.test(a)){assessment="";modality="";panel.hidden=true;seq++;return;}
 panel.hidden=false;
 if(assessment!==a||modality!==m){assessment=a;modality=m;load();}
}
async function load(){
 const n=++seq;status("Cargando PDFs privados…");
 try{
   const rows=await getOriginals();if(n!==seq)return;
   originals=Array.isArray(rows)?rows:[];draw();status("");
   if(pending){const key=pending;pending=null;openKey(key);}
 }catch(e){status(e.message,true);pending=null;}
}
function draw(){
 body.replaceChildren();
 for(const key of [...base,...(modality==="expanded"?extended:[])]){
   const pdf=originals.find(x=>x.test_key===key);
   const row=el("div",undefined,"adhd-pdf-row");
   const label=el("div");label.append(el("strong",labels[key]),el("small",pdf?"Original disponible: "+pdf.original_filename:"Original pendiente de incorporar"));
   const ops=el("div",undefined,"adhd-pdf-row-actions");
   if(pdf){ops.append(button("Abrir / imprimir",()=>view(pdf)),button("Descargar PDF",()=>download(pdf)),button("Sustituir modelo de referencia",()=>selectOriginal(key)));}
   else ops.append(button("Subir PDF original",()=>selectOriginal(key)));
   row.append(label,ops);body.append(row);
 }
}
function handleRequest(detail){
 const key=detail?.testKey;
 if(!labels[key]||!assessment||detail.assessmentId!==assessment)return;
 if(!originals.length&&seq){pending=key;load();return;}
 openKey(key);
}
function openKey(key){
 const found=originals.find(x=>x.test_key===key);
 if(found){view(found);return;}
 panel.querySelector("details")?.setAttribute("open","");
 status("El original de "+labels[key]+" todavía no está cargado. Selecciona tu PDF autorizado para incorporarlo.",false);
 selectOriginal(key);
}
function selectOriginal(key){
 if(busy)return;
 const input=document.createElement("input");
 input.type="file";input.accept=".pdf,application/pdf";input.hidden=true;document.body.append(input);
 input.addEventListener("change",async()=>{const file=input.files?.[0];input.remove();if(file)await upload(key,file);},{once:true});
 input.click();
}
async function upload(key,file){
 if(!labels[key])return;
 if(file.size<10||file.size>12582912||await file.slice(0,5).text()!=="%PDF-"){
   status("Selecciona un PDF válido de hasta 12 MB.",true);return;
 }
 if(!confirm("¿Confirmas que tienes autorización para almacenar este PDF original en tu biblioteca privada profesional?"))return;
 busy=true;status("Guardando original en almacenamiento privado…");
 try{
   const path="originals/"+key+"/"+crypto.randomUUID()+".pdf";
   const upload=await fetch(HOST+"/storage/v1/object/"+BUCKET+"/"+objectPath(path),{
     method:"POST",headers:{...headers(),"Content-Type":"application/pdf","x-upsert":"false"},body:file
   });
   if(!upload.ok)throw Error("No se pudo subir el PDF ("+upload.status+").");
   await storeIndex({test_key:key,label:labels[key],scope:"original",object_path:path,original_filename:file.name.slice(0,240),byte_size:file.size});
   await load();status("Original guardado. Ahora puedes abrirlo desde la pestaña de su test.");
 }catch(e){status(e.message,true);}
 finally{busy=false;}
}
async function getBlob(record){
 const r=await fetch(HOST+"/storage/v1/object/authenticated/"+BUCKET+"/"+objectPath(record.object_path),{cache:"no-store",headers:headers()});
 if(!r.ok)throw Error("No se pudo recuperar el PDF protegido ("+r.status+").");
 return r.blob();
}
async function view(record){
 const popup=window.open("","_blank");
 try{
   const blob=await getBlob(record);
   const url=URL.createObjectURL(new Blob([blob],{type:"application/pdf"}));
   if(popup&&!popup.closed)popup.location.replace(url);
   else{const a=el("a");a.href=url;a.target="_blank";a.rel="noopener";a.click();}
   setTimeout(()=>URL.revokeObjectURL(url),600000);
   status("PDF abierto. Imprime o descarga desde tu visor.");
 }catch(e){if(popup&&!popup.closed)popup.close();status(e.message,true);}
}
async function download(record){
 try{
   const blob=await getBlob(record);
   const url=URL.createObjectURL(new Blob([blob],{type:"application/pdf"}));
   const a=el("a");a.href=url;a.download=record.original_filename||"prueba.pdf";document.body.append(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),120000);status("PDF descargado.");
 }catch(e){status(e.message,true);}
}
function start(){init();if(root)return;const observer=new MutationObserver(()=>{init();if(root)observer.disconnect()});observer.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();