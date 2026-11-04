(()=>{
"use strict";
const HOST="https://grgyvdxkjdstdyumdfyg.supabase.co";
const KEY="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const BUCKET="clinical-test-library";
const labels={diva5:"DIVA-5",asrs:"ASRS-v1.1",wfirs:"WFIRS-S",phq9:"PHQ-9",gad7:"GAD-7",d2r:"d2-R",fdt:"FDT",tavec:"TAVEC",tesen:"TESEN",tmt:"TMT A/B",cpt3:"CPT-3",working_memory:"Memoria de trabajo",other:"Otra prueba",anamnesis:"Anamnesis clínica propia",differential:"Diagnóstico diferencial propio"};
const basic=["diva5","asrs","wfirs","phq9","gad7","anamnesis","differential"];
const extras=["d2r","fdt","tavec","tesen","tmt","cpt3","working_memory","other"];
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const $=(q,root=document)=>root.querySelector(q);
function el(tag,text,cls){const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x;}
function action(label,fn,cls){const b=el("button",label,"adhd-pdf-btn "+(cls||""));b.type="button";b.addEventListener("click",fn);return b;}
function token(){try{return JSON.parse(sessionStorage.getItem("dememoria_admin_session")||"null")?.access_token||"";}catch{return "";}}
function auth(){const t=token();if(!t)throw Error("Inicia sesión profesional de nuevo.");return {apikey:KEY,Authorization:"Bearer "+t};}
async function list(path){const r=await fetch(HOST+"/rest/v1/"+path,{cache:"no-store",headers:auth()});if(!r.ok)throw Error("No se puede consultar la biblioteca: "+r.status);return r.json();}
const objectUrl=path=>HOST+"/storage/v1/object/authenticated/"+BUCKET+"/"+path.split("/").map(encodeURIComponent).join("/");
let root=null,panel=null,result=null,notice=null,patient="",assessment="",modality="",originals=[],completed=[],request=0;
function feedback(t,error){if(notice){notice.textContent=t;notice.classList.toggle("error",Boolean(error));}}
function init(){
const p=$("#adhd-assessment-module");if(!p||root===p)return;root=p;
panel=el("section",undefined,"adhd-pdf-library");panel.id="adhd-pdf-library";panel.hidden=true;
panel.append(el("p","BIBLIOTECA PRIVADA DE PRUEBAS","adhd-pdf-kicker"),el("h3","PDF originales y cumplimentados"),el("p","Abre, imprime o descarga el PDF original. Guarda una nueva copia rellenada en el expediente sin reemplazar el documento en blanco.","adhd-pdf-summary"));
notice=el("p",undefined,"adhd-pdf-status");notice.setAttribute("role","status");result=el("div");panel.append(notice,result);
const before=$(".adhd-editor",p);if(before)p.insertBefore(panel,before);else p.append(panel);
p.addEventListener("adhd:assessment",sync);
p.addEventListener("adhd:open-pdf",e=>{if(!labels[e.detail?.testKey])return;panel.scrollIntoView({behavior:"smooth",block:"start"});$('[data-pdf-key="'+e.detail.testKey+'"]',panel)?.scrollIntoView({behavior:"smooth",block:"nearest"});});
new MutationObserver(sync).observe(p,{attributes:true,attributeFilter:["data-assessment-id","data-assessment-patient-id","data-assessment-modality"]});
sync();
}
function sync(){
if(!root)return;
const a=root.dataset.assessmentId||"",p=root.dataset.assessmentPatientId||"",m=root.dataset.assessmentModality||"";
if(!uuid.test(a)||!uuid.test(p)){assessment="";patient="";modality="";panel.hidden=true;request++;return;}
panel.hidden=false;if(a!==assessment||p!==patient||m!==modality){assessment=a;patient=p;modality=m;refresh();}
}
async function refresh(){
if(!assessment)return;const seq=++request,id=assessment;feedback("Cargando biblioteca privada…");
try{
const a=await Promise.all([list("clinical_test_library?select=*&scope=eq.original&order=uploaded_at.desc"),list("clinical_test_library?select=*&scope=eq.completed&assessment_id=eq."+id+"&order=uploaded_at.desc")]);
if(seq!==request||id!==assessment)return;originals=a[0];completed=a[1];render();feedback("");
}catch(e){feedback(e.message,true);}
}
function render(){
result.replaceChildren();
result.append(el("p","Para rellenar un PDF, utiliza los campos editables del visor o sus herramientas de anotación, guarda el PDF modificado y después pulsa «Guardar cumplimentado». Este paso es necesario para que la copia quede archivada en la historia.","adhd-pdf-instructions"));
for(const key of [...basic,...(modality==="expanded"?extras:[])]){
const original=originals.find(x=>x.test_key===key);const saved=completed.filter(x=>x.test_key===key);const row=el("div",undefined,"adhd-pdf-row");row.dataset.pdfKey=key;
const info=el("div");info.append(el("strong",labels[key]),el("small",original?"PDF original cargado · "+original.original_filename:"PDF original aún no disponible en el panel"));
if(saved.length)info.append(el("small",saved.length+" copia(s) cumplimentada(s) guardada(s)"));
const ops=el("div",undefined,"adhd-pdf-row-actions");
if(original){ops.append(action("Abrir / imprimir",()=>open(original)),action("Descargar",()=>download(original)),action("Actualizar original",()=>choose("original",key)));}
else ops.append(action("Subir original",()=>choose("original",key)));
ops.append(action("Guardar cumplimentado",()=>choose("completed",key)));
if(saved[0])ops.append(action("Ver completado",()=>open(saved[0])));
row.append(info,ops);result.append(row);
}
if(completed.length){
const detail=el("details",undefined,"adhd-pdf-history");detail.append(el("summary","Historial de documentos completados ("+completed.length+")"));
for(const x of completed){
const line=el("div",undefined,"adhd-pdf-history-row");
line.append(el("span",labels[x.test_key]+" · "+new Date(x.uploaded_at).toLocaleString("es-ES")),action("Abrir",()=>open(x)),action("Descargar",()=>download(x)));
detail.append(line);
}result.append(detail);
}
}
function choose(scope,key){
const input=document.createElement("input");input.type="file";input.accept=".pdf,application/pdf";input.hidden=true;document.body.append(input);
input.onchange=async()=>{const file=input.files?.[0];input.remove();if(file)await upload(scope,key,file);};
input.click();
}
async function upload(scope,key,file){
if(file.size>12582912||file.size<8||await file.slice(0,5).text()!=="%PDF-"){feedback("Selecciona un PDF válido de hasta 12 MB.",true);return;}
if(scope==="original"&&!confirm("¿Confirmas que puedes almacenar esta copia original para tu uso profesional, según su licencia?"))return;
const path=(scope==="original"?"originals/"+key:"completed/"+assessment+"/"+key)+"/"+crypto.randomUUID()+".pdf";
feedback("Guardando PDF privado…");
try{
const up=await fetch(HOST+"/storage/v1/object/"+BUCKET+"/"+path,{method:"POST",headers:{...auth(),"Content-Type":"application/pdf","x-upsert":"false"},body:file});
if(!up.ok)throw Error("No se pudo cargar el documento: "+up.status);
const record={test_key:key,label:labels[key],scope,object_path:path,original_filename:file.name.slice(0,240),byte_size:file.size};
if(scope==="completed"){record.assessment_id=assessment;record.patient_id=patient;}
const meta=await fetch(HOST+"/rest/v1/clinical_test_library",{method:"POST",headers:{...auth(),"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(record)});
if(!meta.ok)throw Error("PDF subido, pero falló el registro: "+meta.status);
await refresh();feedback(scope==="original"?"Original privado guardado.":"PDF cumplimentado archivado en esta evaluación.");
}catch(e){feedback(e.message,true);}
}
async function blobFor(file){
const r=await fetch(objectUrl(file.object_path),{cache:"no-store",headers:auth()});
if(!r.ok)throw Error("No se pudo acceder al archivo protegido: "+r.status);
return r.blob();
}
async function open(file){
const pop=window.open("","_blank");
try{const blob=await blobFor(file);const url=URL.createObjectURL(new Blob([blob],{type:"application/pdf"}));
if(pop&&!pop.closed)pop.location.href=url;
else{const link=el("a");link.href=url;link.target="_blank";link.rel="noopener";link.click();}
setTimeout(()=>URL.revokeObjectURL(url),600000);feedback("El PDF se ha abierto en tu visor. Puedes imprimirlo allí.");
}catch(e){if(pop&&!pop.closed)pop.close();feedback(e.message,true);}
}
async function download(file){
try{const blob=await blobFor(file);const url=URL.createObjectURL(new Blob([blob],{type:"application/pdf"}));const a=el("a");a.href=url;a.download=file.original_filename||"documento.pdf";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),120000);feedback("Descarga preparada.");}
catch(e){feedback(e.message,true);}
}
function start(){init();if(root)return;const o=new MutationObserver(()=>{init();if(root)o.disconnect()});o.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();