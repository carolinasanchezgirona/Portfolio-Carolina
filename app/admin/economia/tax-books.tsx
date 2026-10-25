"use client";
import {useEffect,useRef,useState} from "react";
import {schema,choices,normalize,detectHeader,detectMapping,mappedRows,errors,rowYear,sourceKey,cellValue,duplicateIds,type BookKind,type BookData,type BookRow} from "./tax-book-utils";
import {parseCSV,dateISO} from "./import-utils";
import {readXlsxLocally} from "./xlsx-reader";
import {makeWorkbook} from "./tax-book-xlsx";
import {workspaceRows,emptyLedger,groups,amount,rowDate,party,partyId,ref,yearOf,missing,type WorkspaceRow,type Ledger} from "./accounting-workspace";
type Bridge={list:()=>Promise<BookRow[]>;save:(r:BookRow[],upsert?:boolean)=>Promise<void>;update:(id:string,data:BookData)=>Promise<void>;issuer:()=>{legal_name?:string;tax_id?:string}|null;ledger?:()=>Ledger;navigate?:(tab:string)=>void};
declare global{interface Window{DememoriaTaxBridge?:Bridge}}
type Sheet={name:string;rows:unknown[][];book:BookKind;header:number;mapping:Record<string,number>};
const title:Record<BookKind,string>={income:"Ventas e ingresos",expense:"Compras y gastos",investment:"Bienes de inversión"};
const source="https://sede.agenciatributaria.gob.es/Sede/iva/pre-303/nuevo-servicio-pre303-importacion-libros-electronico/plantilla-libros-soporte-electronico.html";
export default function TaxBooks(){
 const [view,setView]=useState<"summary"|"registers"|BookKind>("summary");
 const [filter,setFilter]=useState<"all"|"pending"|"nif"|"invoice"|"amount"|"duplicates">("all");
 const [query,setQuery]=useState(""),[selected,setSelected]=useState<Set<string>>(new Set());
 const [importOpen,setImportOpen]=useState(false),[downloadsOpen,setDownloadsOpen]=useState(false),[step,setStep]=useState(1);
 const [batchOpen,setBatchOpen]=useState(false),[batchKey,setBatchKey]=useState("c03"),[batchValue,setBatchValue]=useState("");
 const [batchOnlyEmpty,setBatchOnlyEmpty]=useState(true),[linkTarget,setLinkTarget]=useState("");
 const importRef=useRef<HTMLElement>(null),editorRef=useRef<HTMLElement>(null),downloadRef=useRef<HTMLElement>(null);
 const [ledger,setLedger]=useState<Ledger>(emptyLedger),[workspace,setWorkspace]=useState<WorkspaceRow[]>([]);
 const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const [book,setBook]=useState<BookKind>("income"),[year,setYear]=useState(String(new Date().getFullYear())),[mode,setMode]=useState<"IRPF"|"UNIFICADO">("IRPF");
 const [saved,setSaved]=useState<BookRow[]>([]),[preview,setPreview]=useState<BookRow[]>([]),[sheets,setSheets]=useState<Sheet[]>([]);
 const [name,setName]=useState(""),[sourceSheet,setSourceSheet]=useState(0),[page,setPage]=useState(0),[editor,setEditor]=useState<WorkspaceRow|null>(null);
 const [reviewed,setReviewed]=useState(false);
 useEffect(()=>{let active=true;
  const update=()=>{const bridge=window.DememoriaTaxBridge;if(bridge){setReady(true);setLedger(bridge.ledger?.()||emptyLedger);void bridge.list().then(rows=>{if(active)setSaved(rows);}).catch(e=>{if(active)setMessage(e.message);});}};
  const navigate=(event:Event)=>{const next=(event as CustomEvent<string>).detail;if(["income","expense","investment"].includes(next)){setBook(next as BookKind);setView(next as BookKind);}else setView("summary");setFilter("all");setPage(0);setSelected(new Set());};
  const requested=new URL(window.location.href).searchParams.get("tab");if(requested&&["income","expense","investment"].includes(requested)){setBook(requested as BookKind);setView(requested as BookKind);}
  update();window.addEventListener("dememoria-econ-ready",update);window.addEventListener("dememoria-econ-updated",update);window.addEventListener("dememoria-tax-view",navigate);
  return()=>{active=false;window.removeEventListener("dememoria-econ-ready",update);window.removeEventListener("dememoria-econ-updated",update);window.removeEventListener("dememoria-tax-view",navigate);};
 },[]);
 useEffect(()=>{let active=true;void workspaceRows(saved,ledger).then(rows=>{if(active)setWorkspace(rows);}).catch(e=>setMessage(e.message));return()=>{active=false;};},[saved,ledger]);
 useEffect(()=>{if(editor)editorRef.current?.scrollIntoView?.({behavior:"smooth",block:"start"});},[editor?.id]);
 function go(next:BookKind|"summary"){setView(next);if(next!=="summary")setBook(next);setPage(0);setFilter("all");setSelected(new Set());window.DememoriaTaxBridge?.navigate?.(next==="summary"?"books":next);}
 function importAction(){setImportOpen(true);setDownloadsOpen(false);setStep(1);setTimeout(()=>importRef.current?.scrollIntoView?.({behavior:"smooth",block:"start"}),0);}
 function downloadAction(){setDownloadsOpen(true);setImportOpen(false);setTimeout(()=>downloadRef.current?.scrollIntoView?.({behavior:"smooth",block:"start"}),0);}
 function pendingFilter(next:typeof filter){setView("registers");setFilter(next);setQuery("");setPage(0);setSelected(new Set());}
 async function rebuild(all:Sheet[],fileName:string){
  const result:BookRow[]=[];
  const occurrences=new Map<string,number>();
  for(const s of all)for(const r of mappedRows(s.book,s.rows,s.header,s.mapping)){
   const signature=JSON.stringify([s.book,r.data]),occurrence=(occurrences.get(signature)||0)+1;occurrences.set(signature,occurrence);
   result.push({id:crypto.randomUUID(),book:s.book,data:r.data,source_key:await sourceKey(s.book,"registro",occurrence,r.data),source_name:fileName+" · "+s.name,source_row:r.source_row,notes:""});
  }
  if(result.length>10000)throw Error("El archivo contiene más de 10.000 filas. No se ha guardado ninguna.");
  if(!result.length)throw Error("No se han reconocido datos. Revisa la hoja, la fila de encabezados y las columnas.");
  setPreview(result);setPage(0);setReviewed(false);
 }
 async function open(file:File|undefined){
  if(!file)return;setBusy(true);setMessage("");setPreview([]);setSheets([]);setName(file.name);setReviewed(false);setQuery("");setSelected(new Set());
  try{
   if(!file.size||file.size>5000000)throw Error("El archivo debe ocupar menos de 5 MB.");
   if(/\.csv$/i.test(file.name)&&file.size>1500000)throw Error("El CSV debe ocupar menos de 1,5 MB.");
   const raw=/\.xlsx$/i.test(file.name)?await readXlsxLocally(file,10034):/\.csv$/i.test(file.name)?[{name:"CSV",rows:parseCSV(await file.text(),10034)}]:null;
   if(!raw)throw Error("Admite .xlsx o .csv. Guarda los antiguos .xls como .xlsx.");
   const usable=raw.filter(s=>s.rows.length>1);
   const candidates:Sheet[]=usable.map(s=>{
    const headerValues=s.rows.slice(0,5).flat().map(normalize);
    const kind:BookKind=/bienes|inversi[oó]n/i.test(s.name)||headerValues.some(v=>["valoradquisicion","metododeamortizacion","valoramortizable"].includes(v))?"investment":
      /gastos|recibidas/i.test(s.name)||headerValues.some(v=>["proveedor","expedidor","nombreexpedidor","nifexpedidor"].includes(v))?"expense":
      /ingresos|expedidas/i.test(s.name)||headerValues.some(v=>["cliente","destinatario","nombredestinatario","nifdestinatario"].includes(v))?"income":book;
    const header=detectHeader(kind,s.rows);return {...s,book:kind,header,mapping:detectMapping(kind,s.rows,header)};
   });
   const recognized=candidates.filter(s=>Object.values(s.mapping).filter(i=>i>=0).length>=2);
   const next=recognized.length?recognized:candidates.sort((a,b)=>Object.values(b.mapping).filter(i=>i>=0).length-Object.values(a.mapping).filter(i=>i>=0).length).slice(0,1);
   if(!next.length)throw Error("El archivo no contiene datos.");
   setSheets(next);setSourceSheet(0);setBook(next[0].book);await rebuild(next,file.name);
   setStep(2);setView(next[0].book);setFilter("all");
   window.DememoriaTaxBridge?.navigate?.(next[0].book);
   setMessage("Archivo reconocido. Revisa primero las filas que necesitan atención; puedes guardar también los registros incompletos.");
  }catch(e){setMessage(e instanceof Error?e.message:"No se ha podido leer el archivo.");}finally{setBusy(false);}
 }
 async function configure(patch:Partial<Sheet>){
  const next=sheets.map((s,i)=>i===sourceSheet?{...s,...patch}:s);
  if(patch.header!==undefined||patch.book!==undefined){const s=next[sourceSheet];s.mapping=detectMapping(s.book,s.rows,s.header);}
  setSheets(next);setBusy(true);try{await rebuild(next,name);}catch(e){setMessage(e instanceof Error?e.message:"Revisa las columnas.");}finally{setBusy(false);}
 }
 const isPreview=preview.length>0;
 const duplicates=duplicateIds(preview,workspace);
 const annual=workspace.filter(r=>yearOf(r)===year||!yearOf(r));
 const duplicateWarnings=new Set(annual.filter(r=>r.possible).map(r=>r.id));
 const sourceRows:WorkspaceRow[]=isPreview?preview:annual;
 const display=sourceRows.filter(r=>(view==="registers"||r.book===book)&&
  (filter==="all"||filter==="duplicates"?(filter==="all"||duplicates.has(r.id)||duplicateWarnings.has(r.id)):missing(r,filter,mode))&&
  (!query||normalize([party(r),partyId(r),ref(r),r.source_name].join(" ")).includes(normalize(query))))
  .sort((a,b)=>{
   // Sort the displayed date chronologically, independently of database return order.
   // Missing or invalid dates stay last; same-day references use natural numeric order.
   const dateA=dateISO(rowDate(a))||"9999-12-31",dateB=dateISO(rowDate(b))||"9999-12-31";
   return dateA.localeCompare(dateB)||ref(a).localeCompare(ref(b),"es",{numeric:true})||a.source_row-b.source_row;
  });
 const pending=annual.filter(r=>errors(r.book,r.data,mode).length).length;
 async function save(){
  if(busy)return;setBusy(true);setMessage("");
  try{const rows=preview.filter(r=>!duplicates.has(r.id));if(!rows.length)throw Error("Todas las filas ya están guardadas.");
   await window.DememoriaTaxBridge!.save(rows);setSaved(await window.DememoriaTaxBridge!.list());setPreview([]);setSheets([]);setReviewed(false);setPage(0);
   setStep(3);setSelected(new Set());setMessage(rows.length+" registros guardados. Los que necesitan datos están en «Pendientes de completar».");
  }catch(e){setMessage(e instanceof Error?e.message:"No se ha podido guardar.");}finally{setBusy(false);}
 }
 async function saveEditor(){
  if(!editor||busy)return;setBusy(true);
  try{
   if(isPreview)setPreview(rows=>rows.map(r=>r.id===editor.id?editor:r));
   else if(editor.virtual){await window.DememoriaTaxBridge!.save([editor]);setSaved(await window.DememoriaTaxBridge!.list());}
   else{await window.DememoriaTaxBridge!.update(editor.id,editor.data);setSaved(rows=>rows.map(r=>r.id===editor.id?editor:r));}
   setEditor(null);setReviewed(false);
  }catch(e){setMessage(e instanceof Error?e.message:"No se pudo guardar.");}finally{setBusy(false);}
 }
 function addRecord(){
  const kind=view==="expense"||view==="investment"?view:"income",data=Object.fromEntries(schema[kind].columns.map(c=>[c.key,""]));
  const id=crypto.randomUUID();void sourceKey(kind,"manual-"+id,1,data).then(source_key=>{setEditor({id,book:kind,data,source_key,source_name:"Registro manual",source_row:1,notes:"",virtual:true});setBook(kind);setView(kind);});
 }
 async function applyBatch(){
  if(!selected.size||busy||batchValue==="")return;setBusy(true);setMessage("");
  try{
   const targets=sourceRows.filter(r=>selected.has(r.id)&&(!batchOnlyEmpty||!r.data[batchKey]));
   if(!targets.length)throw Error("Los registros seleccionados ya tienen ese dato.");
   if(targets.some(r=>r.linked?.locked.includes(batchKey)))throw Error("Ese campo procede de una factura emitida y no puede modificarse por lotes.");
   const rows=targets.map(r=>({...r,data:{...r.data,[batchKey]:cellValue(r.book,batchKey,batchValue)}}));
   if(isPreview)setPreview(old=>old.map(r=>rows.find(n=>n.id===r.id)||r));
   else{await window.DememoriaTaxBridge!.save(rows,true);setSaved(await window.DememoriaTaxBridge!.list());}
   setSelected(new Set());setBatchOpen(false);setBatchValue("");setReviewed(false);setMessage(rows.length+" registros actualizados con el dato que has elegido.");
  }catch(e){setMessage(e instanceof Error?e.message:"No se ha podido completar el lote.");}finally{setBusy(false);}
 }
 async function linkExpense(){
  if(!editor?.linked||!linkTarget||busy)return;const target=saved.find(r=>r.id===linkTarget);if(!target)return;
  setBusy(true);try{await window.DememoriaTaxBridge!.save([{...target,notes:(target.notes||"")+"\nlinked-expense:"+editor.linked.id}],true);setSaved(await window.DememoriaTaxBridge!.list());setEditor(null);setMessage("Gasto vinculado al registro existente. No se ha añadido otro importe.");}catch(e){setMessage(e instanceof Error?e.message:"No se pudo vincular.");}finally{setBusy(false);}
 }
 async function download(draft:boolean){
  setBusy(true);setMessage("");
  try{
   if(!annual.length)throw Error("Todavía no hay registros guardados para este ejercicio.");
   const owner=window.DememoriaTaxBridge!.issuer(),nif=(owner?.tax_id||"").trim().toUpperCase();
   if(!draft&&(pending||duplicateWarnings.size||!reviewed||!nif||!owner?.legal_name))throw Error("Completa los pendientes, las coincidencias y los datos fiscales antes de exportar para presentar.");
   const blob=await makeWorkbook(annual,mode);if(!draft&&blob.size>4000000)throw Error("El XLSX supera el límite de 4 MB de la AEAT. No se ha generado un archivo de presentación.");
   const filename=(draft?"BORRADOR-":"")+year+(nif||"-NIF-PENDIENTE")+(mode==="IRPF"?"D":"T")+(owner?.legal_name||"TITULAR-PENDIENTE").replace(/[^\p{L}\p{N} ,.-]/gu,"")+".xlsx";
   const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
   setMessage(draft?"Borrador descargado; conserva los campos desconocidos vacíos.":"XLSX descargado con el diseño AEAT. Su presentación se realiza en la sede electrónica con tu identificación.");
  }catch(e){setMessage(e instanceof Error?e.message:"No se pudo exportar.");}finally{setBusy(false);}
 }
 function print(){
  const rows=annual.filter(r=>r.book===book);
  if(!rows.length){setMessage("No hay registros de este libro para imprimir.");return;}
  const popup=window.open("","_blank");if(!popup){setMessage("Permite abrir la ventana de impresión.");return;}
  const doc=popup.document;doc.title="Libro registro · "+title[book]+" · "+year;
  const style=doc.createElement("style");style.textContent="@page{size:A3 landscape;margin:10mm}body{font:10px Arial;color:#173A5E}table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:4px;vertical-align:top;overflow-wrap:anywhere}th{background:#eaf6fb}thead{display:table-header-group}tr{break-inside:avoid}@media print{button{display:none}}";doc.head.append(style);
  const h=doc.createElement("h1");h.textContent="Libro registro de "+title[book]+" · "+year;doc.body.append(h);
  const printPending=rows.filter(r=>errors(r.book,r.data,mode).length).length;
  const owner=window.DememoriaTaxBridge?.issuer();const info=doc.createElement("p");info.textContent=(owner?.legal_name||"Titular pendiente")+" · NIF: "+(owner?.tax_id||"pendiente")+" · "+(printPending?"BORRADOR: "+printPending+" registros pendientes de completar":"Revisión fiscal necesaria antes de presentar");doc.body.append(info);
  const button=doc.createElement("button");button.textContent="Imprimir / Guardar PDF";button.onclick=()=>popup.print();doc.body.append(button);
  // Divide the wide official register into numbered column blocks; no field is omitted or shrunk to illegibility.
  for(let offset=0;offset<schema[book].columns.length;offset+=10){
   const cols=schema[book].columns.slice(offset,offset+10),section=doc.createElement("h2");section.textContent="Columnas "+(offset+1)+"–"+Math.min(offset+10,schema[book].columns.length);doc.body.append(section);
   const table=doc.createElement("table"),head=doc.createElement("thead"),tr=doc.createElement("tr");
   ["Registro",...cols.map(c=>c.label)].forEach(t=>{const th=doc.createElement("th");th.textContent=t;tr.append(th);});head.append(tr);table.append(head);
   const body=doc.createElement("tbody");rows.forEach((r,i)=>{const row=doc.createElement("tr");[String(i+1),...cols.map(c=>r.data[c.key]||"")].forEach(t=>{const td=doc.createElement("td");td.textContent=t;row.append(td);});body.append(row);});table.append(body);doc.body.append(table);
  }
  popup.focus();
 }
 const sheet=sheets[sourceSheet];
 const money=(n:number|null)=>n===null?"Pendiente":new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(n/100);
 const total=(kind:BookKind)=>annual.filter(r=>r.book===kind&&!r.possible).reduce((s,r)=>s+(amount(r)??0),0);
 const count=(kind:"nif"|"invoice"|"amount"|"pending")=>annual.filter(r=>missing(r,kind,mode)).length;
 const selectedRows=sourceRows.filter(r=>selected.has(r.id));
 const batchKeys=["c01","c02","c03","c04","c05",...(selectedRows.every(r=>r.book===book)&&book!=="investment"?["c06","c07"]:[])];
 function field(k:string){
  if(!editor)return null;const c=schema[editor.book].columns.find(v=>v.key===k);if(!c)return null;
  const locked=editor.linked?.locked.includes(k)&&!!editor.data[k];
  return <label key={k}>{c.label}{choices[editor.book][k]?.length?<select value={editor.data[k]||""} disabled={busy||locked} onChange={e=>setEditor({...editor,data:{...editor.data,[k]:e.target.value}})}><option value="">Sin dato</option>{editor.data[k]&&!choices[editor.book][k].some(o=>o.value===editor.data[k])&&<option value={editor.data[k]}>{editor.data[k]} · revisar</option>}{choices[editor.book][k].map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>:<input value={editor.data[k]||""} disabled={busy||locked} onChange={e=>setEditor({...editor,data:{...editor.data,[k]:e.target.value}})} onBlur={e=>setEditor({...editor,data:{...editor.data,[k]:cellValue(editor.book,k,e.target.value)}})}/>}</label>;
 }
 return <section className="econ-tax-books" aria-label="Contabilidad de la consulta">
  <div className="econ-section-heading">
   <div><p className="econ-eyebrow">Tu consulta, en orden</p><h2>{view==="summary"?"Resumen del año":view==="registers"?"Pendientes de completar":title[view]}</h2></div>
   <label className="econ-inline-label">Ejercicio <input type="number" min="2020" max="2100" value={year} onChange={e=>{setYear(e.target.value);setPage(0);setReviewed(false);setSelected(new Set());}}/></label>
  </div>
  <div className="econ-primary-actions">
   <button type="button" className="econ-button" disabled={!ready||busy||!!editor} onClick={importAction}>Importar archivo</button>
   <button type="button" className="econ-outline" disabled={!ready||busy||isPreview||!!editor} onClick={addRecord}>Añadir registro</button>
   <button type="button" className="econ-outline" disabled={!ready||busy||!!editor} onClick={downloadAction}>Descargar</button>
  </div>
  {message&&<p role="status" className="econ-status">{message}</p>}{busy&&<p role="status">Procesando…</p>}
  {view==="summary"&&!isPreview&&<>
   <div className="econ-workspace-kpis">
    <button type="button" onClick={()=>go("income")}><span>Ingresos registrados</span><strong>{money(total("income"))}</strong><small>{annual.filter(r=>r.book==="income").length} operaciones</small></button>
    <button type="button" onClick={()=>go("expense")}><span>Gastos registrados</span><strong>{money(total("expense"))}</strong><small>{annual.filter(r=>r.book==="expense").length} operaciones</small></button>
    <button type="button" onClick={()=>window.DememoriaTaxBridge?.navigate?.("movements")}><span>Cobrado</span><strong>{money(ledger.receipts.filter(r=>r.paid_date.startsWith(year)).reduce((n,r)=>n+Number(r.amount_cents),0)+ledger.income.filter(r=>!r.voided_at&&r.received_date.startsWith(year)).reduce((n,r)=>n+Number(r.amount_cents),0))}</strong><small>Ver cobros y pagos</small></button>
    <button type="button" onClick={()=>pendingFilter("pending")}><span>Por completar</span><strong>{pending}</strong><small>{count("amount")} sin importe reconocido</small></button>
   </div>
   <p className="econ-help">Los totales suman los importes conocidos. Los datos ausentes siguen pendientes; facturar y cobrar se muestran por separado.</p>
   <section className="econ-card"><div className="econ-section-heading"><h3>Lo que queda por hacer</h3><button type="button" className="econ-outline" onClick={()=>pendingFilter("pending")}>Ver pendientes</button></div>
    <div className="econ-pending-grid">
     {([["nif","Sin NIF",count("nif")],["invoice","Sin número de factura",count("invoice")],["amount","Sin importe",count("amount")],["duplicates","Coincidencias por revisar",duplicateWarnings.size]] as const).map(([key,label,n])=><button type="button" key={key} onClick={()=>pendingFilter(key)}><strong>{n}</strong><span>{label}</span><span aria-hidden="true">→</span></button>)}
    </div>
    {annual.length===0&&<p className="econ-empty">Empieza importando tu Excel o añadiendo un registro. No se rellenará ningún dato que no se conozca.</p>}
   </section>
   <div className="econ-book-shortcuts">{Object.entries(title).map(([k,label])=><button type="button" key={k} className="econ-card" onClick={()=>go(k as BookKind)}><strong>{label}</strong><span>{annual.filter(r=>r.book===k).length} registros · abrir libro →</span></button>)}</div>
  </>}
  {importOpen&&<section ref={importRef} className="econ-card econ-import-flow" aria-label="Importación de contabilidad">
   <div className="econ-section-heading"><h3>Importar CSV o Excel</h3><button type="button" className="econ-outline" disabled={busy} onClick={()=>setImportOpen(false)}>Cerrar</button></div>
   <ol className="econ-import-steps" aria-label="Pasos de importación">{["Subir archivo","Revisar","Guardar"].map((s,i)=><li key={s} aria-current={step===i+1?"step":undefined} className={step>=i+1?"current":""}><span>{i+1}</span>{s}</li>)}</ol>
   {step===1&&<><p>Se detectan automáticamente las hojas y las columnas. Los campos que falten quedarán vacíos.</p><label className="econ-upload-label">Seleccionar CSV o Excel .xlsx <input type="file" accept=".xlsx,.csv" disabled={!ready||busy} onChange={e=>{void open(e.target.files?.[0]);e.target.value="";}}/></label>{isPreview&&<button type="button" className="econ-outline" onClick={()=>setStep(2)}>Volver a la vista previa actual</button>}</>}
   {step===2&&<><p><strong>{preview.length} registros reconocidos</strong> · {preview.filter(r=>errors(r.book,r.data,mode).length).length} incompletos · {duplicates.size} ya registrados</p>
    <p>Las filas que necesitan atención aparecen primero. Puedes completar los datos ahora o guardar y retomarlos después.</p>
    <div className="econ-actions">{Object.entries(title).filter(([k])=>preview.some(r=>r.book===k)).map(([k,t])=><button key={k} type="button" className={book===k?"econ-button":"econ-outline"} onClick={()=>{setBook(k as BookKind);setView(k as BookKind);setPage(0);}}>{t}</button>)}</div>
    {sheet&&<details className="econ-column-map"><summary>Ajustar columnas reconocidas</summary><div className="econ-form-grid">
     <label>Hoja <select value={sourceSheet} disabled={busy} onChange={e=>setSourceSheet(Number(e.target.value))}>{sheets.map((s,i)=><option key={i} value={i}>{s.name}</option>)}</select></label>
     <label>Libro de destino <select value={sheet.book} disabled={busy} onChange={e=>void configure({book:e.target.value as BookKind})}>{Object.entries(title).map(([k,t])=><option key={k} value={k}>{t}</option>)}</select></label>
     <label>Encabezados en la fila <select value={sheet.header} disabled={busy} onChange={e=>void configure({header:Number(e.target.value)})}>{sheet.rows.slice(0,30).map((r,i)=><option key={i} value={i}>{i+1}: {r.map(String).join(" · ").slice(0,70)}</option>)}</select></label>
     {schema[sheet.book].columns.map(c=><label key={c.key}>{c.label}<select disabled={busy} value={sheet.mapping[c.key]??-1} onChange={e=>void configure({mapping:{...sheet.mapping,[c.key]:Number(e.target.value)}})}><option value={-1}>Sin dato · dejar vacío</option>{Array.from(sheet.rows[sheet.header]||[],(v,i)=><option key={i} value={i}>{String(v||"Columna "+(i+1))}</option>)}</select></label>)}
    </div></details>}
   </>}
   {step===3&&<div className="econ-import-done"><strong>Importación guardada</strong><p>Los registros incompletos siguen disponibles en los pendientes.</p><div className="econ-actions"><button type="button" className="econ-button" onClick={()=>{setImportOpen(false);go("summary");}}>Volver al resumen</button><button type="button" className="econ-outline" onClick={()=>{setImportOpen(false);pendingFilter("pending");}}>Completar pendientes</button></div></div>}
  </section>}
  {(view!=="summary"||isPreview)&&<>
   <div className="econ-register-toolbar"><label>Buscar <input type="search" placeholder="Factura, nombre o NIF" value={query} onChange={e=>{setQuery(e.target.value);setPage(0);}}/></label>
    <label>Mostrar <select value={filter} onChange={e=>{setFilter(e.target.value as typeof filter);setPage(0);}}><option value="all">Todos</option><option value="pending">Pendientes de completar</option><option value="nif">Sin NIF</option><option value="invoice">Sin número de factura</option><option value="amount">Sin importe</option><option value="duplicates">Coincidencias por revisar</option></select></label>
    {view==="registers"&&<button type="button" className="econ-outline" onClick={()=>go("summary")}>Volver al resumen</button>}
   </div>
   <div className="econ-section-heading"><h3>{isPreview?"Vista previa sin guardar":view==="registers"?"Registros que requieren atención":title[book]}</h3><span>{display.length} registros</span></div>
   {selected.size>0&&<section className="econ-selection-bar"><strong>{selected.size} seleccionados</strong><button type="button" className="econ-outline" disabled={busy} onClick={()=>setBatchOpen(!batchOpen)}>Completar por lotes</button><button type="button" className="econ-outline" onClick={()=>setSelected(new Set())}>Quitar selección</button></section>}
   {batchOpen&&selected.size>0&&<section className="econ-card"><h3>Aplicar un dato común</h3><p>Se aplicará únicamente a los {selected.size} registros seleccionados.</p><div className="econ-form-grid"><label>Campo <select value={batchKey} onChange={e=>{setBatchKey(e.target.value);setBatchValue("");}}>{batchKeys.map(k=><option key={k} value={k}>{schema[book].columns.find(c=>c.key===k)?.label}</option>)}</select></label><label>Valor {choices[book][batchKey]?.length?<select value={batchValue} onChange={e=>setBatchValue(e.target.value)}><option value="">Seleccionar</option>{choices[book][batchKey].map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>:<input value={batchValue} onChange={e=>setBatchValue(e.target.value)}/>}</label></div><label><input type="checkbox" checked={batchOnlyEmpty} onChange={e=>setBatchOnlyEmpty(e.target.checked)}/>Solo rellenar los campos que estén vacíos</label><p><button type="button" className="econ-button" disabled={busy||!batchValue} onClick={()=>void applyBatch()}>Aplicar a los seleccionados</button></p></section>}
   <div className="econ-compact-scroll"><table className="econ-compact-table"><thead><tr><th><input type="checkbox" aria-label="Seleccionar filas visibles" checked={display.slice(page*25,(page+1)*25).length>0&&display.slice(page*25,(page+1)*25).every(r=>selected.has(r.id))} onChange={e=>{const next=new Set(selected);display.slice(page*25,(page+1)*25).forEach(r=>e.target.checked?next.add(r.id):next.delete(r.id));setSelected(next);}}/></th><th>Fecha</th><th>Factura / referencia</th><th>Cliente, proveedor o bien</th><th>Importe</th><th>Estado</th><th>Acción</th></tr></thead>
    <tbody>{display.slice(page*25,(page+1)*25).map(r=>{const issues=errors(r.book,r.data,mode);return <tr key={r.id}><td><input type="checkbox" aria-label={"Seleccionar "+(ref(r)||r.id)} checked={selected.has(r.id)} onChange={e=>{const next=new Set(selected);if(e.target.checked)next.add(r.id);else next.delete(r.id);setSelected(next);}}/></td><td>{rowDate(r)||"—"}</td><td>{r.book==="income"?(r.data.c11||"")+(r.data.c12||"")||r.data.c36||"Sin número":r.book==="expense"?r.data.c11||"Sin número":r.data.c07||"Sin identificador"}{view==="registers"&&<small>{title[r.book]}</small>}</td><td>{party(r)||"Pendiente"}<small>{partyId(r)}</small></td><td className="econ-amount-cell">{money(amount(r))}</td><td><span className={"econ-state "+(duplicates.has(r.id)||r.possible?"review":issues.length?"pending":"complete")}>{duplicates.has(r.id)?"Ya registrado":r.possible?"Revisar coincidencia":issues.length?"Incompleto · "+issues.length:"Completo"}</span>{r.linked&&<small>{r.linked.kind==="invoice"?"Factura vinculada":r.linked.label}{r.linked.paid!==undefined?" · Cobrado "+money(r.linked.paid):""}</small>}</td><td><button type="button" className="econ-outline" disabled={busy} onClick={()=>{setEditor({...r,data:{...r.data}});setLinkTarget("");}}>Editar</button></td></tr>;})}</tbody>
   </table></div>
   {display.length===0&&<p className="econ-empty">{query||filter!=="all"?"No hay registros con este filtro.":"Todavía no hay registros. Importa tu archivo o añade uno."}</p>}
   {display.length>25&&<p className="econ-actions"><button type="button" className="econ-outline" disabled={page===0} onClick={()=>setPage(p=>p-1)}>Anterior</button>Página {page+1} de {Math.max(1,Math.ceil(display.length/25))}<button type="button" className="econ-outline" disabled={(page+1)*25>=display.length} onClick={()=>setPage(p=>p+1)}>Siguiente</button></p>}
   {isPreview&&<div className="econ-import-save"><span>{preview.length-duplicates.size} registros para guardar · los incompletos se conservarán</span><div className="econ-actions"><button type="button" className="econ-button" disabled={busy||!ready||preview.length===duplicates.size} onClick={()=>void save()}>Guardar importación</button><button type="button" className="econ-outline" disabled={busy} onClick={()=>{setPreview([]);setSheets([]);setPage(0);setImportOpen(false);setSelected(new Set());}}>Descartar vista previa</button></div></div>}
  </>}
  {editor&&<section ref={editorRef} className="econ-card econ-record-editor" aria-label="Editar registro">
   <div className="econ-section-heading"><div><p className="econ-eyebrow">{title[editor.book]}</p><h3>{ref(editor)||"Completar registro"}</h3></div><button type="button" className="econ-outline" disabled={busy} onClick={()=>setEditor(null)}>Cerrar</button></div>
   {editor.linked?.kind==="invoice"&&<p className="econ-linked-note">Factura emitida vinculada · {editor.linked.label} · Cobrado {money(editor.linked.paid??0)}. Los datos de esa factura se conservan; aquí completas su registro fiscal.</p>}
   {editor.possible&&<div className="econ-linked-note"><p>Hay un gasto registrado con fecha, proveedor e importe coincidentes. Comprueba si corresponde a la misma operación.</p><label>Registro existente <select value={linkTarget} onChange={e=>setLinkTarget(e.target.value)}><option value="">Seleccionar</option>{saved.filter(r=>r.book==="expense").map(r=><option key={r.id} value={r.id}>{r.data.c11||"Sin número"} · {party(r)} · {money(amount(r))}</option>)}</select></label><button type="button" className="econ-outline" disabled={!linkTarget||busy} onClick={()=>void linkExpense()}>Es el mismo gasto: vincular</button><p><label><input type="checkbox" onChange={e=>{if(e.target.checked)setEditor({...editor,possible:false});}}/>He comprobado que es otra operación distinta</label></p></div>}
   {errors(editor.book,editor.data,mode).length>0&&<details className="econ-editor-pending"><summary>{errors(editor.book,editor.data,mode).length} datos por completar o revisar</summary><ul>{errors(editor.book,editor.data,mode).map((t,i)=><li key={i}>{t}</li>)}</ul></details>}
   {groups(editor.book).map(g=>g.advanced?<details key={g.title} className="econ-editor-group"><summary>{g.title}</summary><div className="econ-form-grid">{g.keys.map(field)}</div><a href={source} target="_blank" rel="noreferrer">Consultar diseño AEAT</a></details>:<section key={g.title} className="econ-editor-group"><h4>{g.title}</h4><div className="econ-form-grid">{g.keys.map(field)}</div></section>)}
   <div className="econ-actions"><button type="button" className="econ-button" disabled={busy||editor.possible} onClick={()=>void saveEditor()}>Guardar cambios</button><button type="button" className="econ-outline" disabled={busy} onClick={()=>setEditor(null)}>Cancelar</button></div>
  </section>}
  {downloadsOpen&&<section ref={downloadRef} className="econ-card econ-download-panel" aria-label="Descargar contabilidad"><div className="econ-section-heading"><h3>Descargar contabilidad · {year}</h3><button type="button" className="econ-outline" onClick={()=>setDownloadsOpen(false)}>Cerrar</button></div>
   <p>{annual.length} registros · {pending} incompletos · {duplicateWarnings.size} coincidencias por revisar</p>
   {(pending>0||duplicateWarnings.size>0)&&<button type="button" className="econ-outline" onClick={()=>{pendingFilter(duplicateWarnings.size?"duplicates":"pending");setDownloadsOpen(false);}}>Ir a los pendientes</button>}
   <div className="econ-download-options"><article><h4>PDF para imprimir o revisar</h4><label>Libro <select value={book} onChange={e=>setBook(e.target.value as BookKind)}>{Object.entries(title).map(([k,t])=><option key={k} value={k}>{t}</option>)}</select></label><button type="button" className="econ-outline" disabled={busy||!annual.length} onClick={print}>Imprimir / Guardar PDF</button></article>
    <article><h4>Excel editable</h4><p>Incluye los campos pendientes vacíos, para continuar trabajando.</p><button type="button" className="econ-outline" disabled={busy||!annual.length} onClick={()=>void download(true)}>Descargar Excel editable</button></article>
    <article><h4>XLSX para AEAT</h4><label>Formato <select value={mode} onChange={e=>{setMode(e.target.value as typeof mode);setReviewed(false);}}><option value="IRPF">IRPF · Ingresos y gastos</option><option value="UNIFICADO">Unificado IRPF e IVA</option></select></label><label><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/>He revisado los libros del año, la actividad y el tratamiento fiscal.</label><button type="button" className="econ-button" disabled={busy||!annual.length||pending>0||duplicateWarnings.size>0||!reviewed||isPreview} onClick={()=>void download(false)}>Descargar XLSX para AEAT</button></article>
   </div><p className="econ-help">La exportación conserva todas las columnas oficiales y el ejercicio completo. La presentación se realiza después en la sede electrónica. La comprobación automática es básica y no sustituye la revisión fiscal.</p>
  </section>}
 </section>;
}
