"use client";
import {useEffect,useState} from "react";
import {schema,choices,detectHeader,detectMapping,mappedRows,errors,rowYear,sourceKey,cellValue,type BookKind,type BookData,type BookRow} from "./tax-book-utils";
import {parseCSV} from "./import-utils";
import {readXlsxLocally} from "./xlsx-reader";
import {makeWorkbook} from "./tax-book-xlsx";
type Bridge={list:()=>Promise<BookRow[]>;save:(r:BookRow[])=>Promise<void>;update:(id:string,data:BookData)=>Promise<void>;issuer:()=>{legal_name?:string;tax_id?:string}|null};
declare global{interface Window{DememoriaTaxBridge?:Bridge}}
type Sheet={name:string;rows:unknown[][];book:BookKind;header:number;mapping:Record<string,number>};
const title:Record<BookKind,string>={income:"Ventas e ingresos",expense:"Compras y gastos",investment:"Bienes de inversión"};
const source="https://sede.agenciatributaria.gob.es/Sede/iva/pre-303/nuevo-servicio-pre303-importacion-libros-electronico/plantilla-libros-soporte-electronico.html";
export default function TaxBooks(){
 const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const [book,setBook]=useState<BookKind>("income"),[year,setYear]=useState(String(new Date().getFullYear())),[mode,setMode]=useState<"IRPF"|"UNIFICADO">("IRPF");
 const [saved,setSaved]=useState<BookRow[]>([]),[preview,setPreview]=useState<BookRow[]>([]),[sheets,setSheets]=useState<Sheet[]>([]);
 const [name,setName]=useState(""),[sourceSheet,setSourceSheet]=useState(0),[page,setPage]=useState(0),[editor,setEditor]=useState<BookRow|null>(null);
 const [reviewed,setReviewed]=useState(false),[showOnlyPending,setShowOnlyPending]=useState(false);
 useEffect(()=>{let active=true;
  const update=()=>{const bridge=window.DememoriaTaxBridge;if(bridge){setReady(true);void bridge.list().then(rows=>{if(active)setSaved(rows);}).catch(e=>{if(active)setMessage(e.message);});}};
  update();window.addEventListener("dememoria-econ-ready",update);return()=>{active=false;window.removeEventListener("dememoria-econ-ready",update);};
 },[]);
 async function rebuild(all:Sheet[],fileName:string){
  const result:BookRow[]=[];
  for(const s of all)for(const r of mappedRows(s.book,s.rows,s.header,s.mapping)){
   result.push({id:crypto.randomUUID(),book:s.book,data:r.data,source_key:await sourceKey(s.book,s.name,r.source_row,r.data),source_name:fileName+" · "+s.name,source_row:r.source_row,notes:""});
  }
  if(result.length>10000)throw Error("El archivo contiene más de 10.000 filas. No se ha guardado ninguna.");
  if(!result.length)throw Error("No se han reconocido datos. Revisa la hoja, la fila de encabezados y las columnas.");
  setPreview(result);setPage(0);setReviewed(false);
 }
 async function open(file:File|undefined){
  if(!file)return;setBusy(true);setMessage("");setPreview([]);setSheets([]);setName(file.name);setReviewed(false);
  try{
   if(!file.size||file.size>5000000)throw Error("El archivo debe ocupar menos de 5 MB.");
   if(/\.csv$/i.test(file.name)&&file.size>1500000)throw Error("El CSV debe ocupar menos de 1,5 MB.");
   const raw=/\.xlsx$/i.test(file.name)?await readXlsxLocally(file,10034):/\.csv$/i.test(file.name)?[{name:"CSV",rows:parseCSV(await file.text(),10034)}]:null;
   if(!raw)throw Error("Admite .xlsx o .csv. Guarda los antiguos .xls como .xlsx.");
   const usable=raw.filter(s=>s.rows.length>1);
   const named=usable.filter(s=>/^(EXPEDIDAS_INGRESOS|RECIBIDAS_GASTOS|INGRESOS|GASTOS|BIENES.INVERSI[ÓO]N)$/i.test(s.name));
   const chosen=named.length?named:usable.slice(0,1);
   const next:Sheet[]=chosen.map(s=>{const kind:BookKind=/gastos|recibidas/i.test(s.name)?"expense":/bienes|inversi/i.test(s.name)?"investment":/ingresos|expedidas/i.test(s.name)?"income":book;const header=detectHeader(kind,s.rows);return {...s,book:kind,header,mapping:detectMapping(kind,s.rows,header)};});
   if(!next.length)throw Error("El archivo no contiene datos.");
   setSheets(next);setSourceSheet(0);setBook(next[0].book);await rebuild(next,file.name);
   setMessage("Datos reconocidos automáticamente. Los campos desconocidos siguen vacíos. Revisa los pendientes y guarda cuando quieras.");
  }catch(e){setMessage(e instanceof Error?e.message:"No se ha podido leer el archivo.");}finally{setBusy(false);}
 }
 async function configure(patch:Partial<Sheet>){
  const next=sheets.map((s,i)=>i===sourceSheet?{...s,...patch}:s);
  if(patch.header!==undefined||patch.book!==undefined){const s=next[sourceSheet];s.mapping=detectMapping(s.book,s.rows,s.header);}
  setSheets(next);setBusy(true);try{await rebuild(next,name);}catch(e){setMessage(e instanceof Error?e.message:"Revisa las columnas.");}finally{setBusy(false);}
 }
 const isPreview=preview.length>0;
 const known=new Set(saved.map(r=>r.source_key)),seen=new Set<string>();
 const duplicates=new Set(preview.filter(r=>{const repeated=known.has(r.source_key)||seen.has(r.source_key);seen.add(r.source_key);return repeated;}).map(r=>r.id));
 const annual=saved.filter(r=>rowYear(r)===year||!rowYear(r));
 const display=(isPreview?preview:annual).filter(r=>r.book===book&&(!showOnlyPending||errors(r.book,r.data,mode).length));
 const pending=annual.filter(r=>errors(r.book,r.data,mode).length).length;
 async function save(){
  if(busy)return;setBusy(true);setMessage("");
  try{const rows=preview.filter(r=>!duplicates.has(r.id));if(!rows.length)throw Error("Todas las filas ya están guardadas.");
   await window.DememoriaTaxBridge!.save(rows);setSaved(await window.DememoriaTaxBridge!.list());setPreview([]);setSheets([]);setReviewed(false);setPage(0);
   setMessage(rows.length+" registros guardados. Los datos ausentes siguen vacíos y se muestran como pendientes.");
  }catch(e){setMessage(e instanceof Error?e.message:"No se ha podido guardar.");}finally{setBusy(false);}
 }
 async function saveEditor(){
  if(!editor||busy)return;setBusy(true);
  try{
   if(isPreview)setPreview(rows=>rows.map(r=>r.id===editor.id?editor:r));
   else{await window.DememoriaTaxBridge!.update(editor.id,editor.data);setSaved(rows=>rows.map(r=>r.id===editor.id?editor:r));}
   setEditor(null);setReviewed(false);
  }catch(e){setMessage(e instanceof Error?e.message:"No se pudo guardar.");}finally{setBusy(false);}
 }
 async function download(draft:boolean){
  setBusy(true);setMessage("");
  try{
   if(!annual.length)throw Error("Todavía no hay registros guardados para este ejercicio.");
   const owner=window.DememoriaTaxBridge!.issuer(),nif=(owner?.tax_id||"").trim().toUpperCase();
   if(!draft&&(pending||!reviewed||!nif||!owner?.legal_name))throw Error("Completa los pendientes, los datos fiscales del titular y la revisión antes de exportar para presentar.");
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
 return <section className="econ-tax-books" aria-label="Libros registro AEAT">
  <div className="econ-section-heading"><div><p className="econ-eyebrow">Diseño AEAT · 2026</p><h2>Libros registro oficiales</h2><p>Importación automática, campos vacíos cuando falta información y edición posterior.</p></div>
   <label>Ejercicio <input type="number" min="2020" max="2100" value={year} onChange={e=>{setYear(e.target.value);setPage(0);setReviewed(false);}}/></label>
  </div>
  <div className="econ-card"><h3>Importar CSV o Excel</h3><p>Se detectan hojas y columnas. No se inventan NIF, números de factura, bases, IVA, retenciones ni importes deducibles. Puedes guardar registros incompletos.</p>
   <label>Seleccionar archivo <input type="file" accept=".xlsx,.csv" disabled={!ready||busy} onChange={e=>{void open(e.target.files?.[0]);e.target.value="";}}/></label>
   <p className="econ-help"><a href={source} target="_blank" rel="noreferrer">Plantilla y diseño oficial AEAT</a> · Los libros fiscales y los cobros/pagos se revisan por separado para no duplicar importes.</p>
   {sheets.length>0&&<details><summary>Revisar correspondencia de columnas</summary>
    <div className="econ-form-grid"><label>Hoja detectada <select value={sourceSheet} disabled={busy} onChange={e=>setSourceSheet(Number(e.target.value))}>{sheets.map((s,i)=><option key={i} value={i}>{s.name}</option>)}</select></label>
     <label>Libro de destino <select value={sheet.book} disabled={busy} onChange={e=>void configure({book:e.target.value as BookKind})}>{Object.entries(title).map(([k,t])=><option key={k} value={k}>{t}</option>)}</select></label>
     <label>Fila de encabezados <select value={sheet.header} disabled={busy} onChange={e=>void configure({header:Number(e.target.value)})}>{sheet.rows.slice(0,30).map((r,i)=><option key={i} value={i}>{i+1}: {r.map(String).join(" · ").slice(0,90)}</option>)}</select></label>
     {schema[sheet.book].columns.map(c=><label key={c.key}>{c.label}<select disabled={busy} value={sheet.mapping[c.key]??-1} onChange={e=>void configure({mapping:{...sheet.mapping,[c.key]:Number(e.target.value)}})}><option value={-1}>Vacío · sin dato reconocido</option>{Array.from(sheet.rows[sheet.header]||[],(v,i)=><option key={i} value={i}>{String(v||"Columna "+(i+1))}</option>)}</select></label>)}
    </div></details>}
  </div>
  {message&&<p role="status" className="econ-status">{message}</p>}{busy&&<p role="status">Procesando…</p>}
  <div className="econ-actions" role="group" aria-label="Elegir libro">{Object.entries(title).map(([k,t])=><button type="button" key={k} className={book===k?"econ-button":"econ-outline"} aria-pressed={book===k} onClick={()=>{setBook(k as BookKind);setPage(0);}}>{t}</button>)}</div>
  <div className="econ-section-heading"><h3>{isPreview?"Vista previa sin guardar":"Registros guardados"} · {title[book]}</h3><label><input type="checkbox" checked={showOnlyPending} onChange={e=>{setShowOnlyPending(e.target.checked);setPage(0);}}/>Solo pendientes</label></div>
  <p>{display.length} registros de este libro{isPreview?" · "+duplicates.size+" filas ya importadas en el archivo":""}. Los espacios vacíos significan que falta el dato, no que su importe sea cero.</p>
  <div className="econ-import-scroll"><table className="econ-import-table"><thead><tr><th>Registro / revisión</th>{schema[book].columns.map(c=><th key={c.key}>{c.label}</th>)}</tr></thead>
   <tbody>{display.slice(page*50,(page+1)*50).map((r,i)=>{const issues=errors(r.book,r.data,mode);return <tr key={r.id}><td><button type="button" className="econ-outline" disabled={busy} onClick={()=>setEditor({...r,data:{...r.data}})}>Editar {page*50+i+1}</button><p>{duplicates.has(r.id)?"Ya importado":issues.length?issues.length+" pendientes":"Sin errores básicos"}</p><details><summary>Ver revisión</summary>{issues.map((v,n)=><p key={n}>{v}</p>)}<p>{r.source_name} · fila {r.source_row}</p></details></td>{schema[r.book].columns.map(c=><td key={c.key}>{r.data[c.key]||""}</td>)}</tr>;})}</tbody>
  </table></div>
  <p className="econ-actions"><button type="button" className="econ-outline" disabled={page===0} onClick={()=>setPage(p=>p-1)}>Anterior</button>Página {page+1} de {Math.max(1,Math.ceil(display.length/50))}<button type="button" className="econ-outline" disabled={(page+1)*50>=display.length} onClick={()=>setPage(p=>p+1)}>Siguiente</button></p>
  {isPreview&&<div className="econ-actions"><button type="button" className="econ-button" disabled={busy||!ready||preview.length===duplicates.size} onClick={()=>void save()}>Guardar {preview.length-duplicates.size} registros, incluidos pendientes</button><button type="button" className="econ-outline" disabled={busy} onClick={()=>{setPreview([]);setSheets([]);setPage(0);}}>Descartar vista previa</button></div>}
  {editor&&<section className="econ-card"><h3>Completar registro · {title[editor.book]}</h3><div className="econ-form-grid">{schema[editor.book].columns.map(c=><label key={c.key}>{c.label}{choices[editor.book][c.key]?.length?<select value={editor.data[c.key]||""} disabled={busy} onChange={e=>setEditor({...editor,data:{...editor.data,[c.key]:e.target.value}})}><option value="">Sin dato · vacío</option>{editor.data[c.key]&&!choices[editor.book][c.key].some(o=>o.value===editor.data[c.key])&&<option value={editor.data[c.key]}>{editor.data[c.key]} · revisar</option>}{choices[editor.book][c.key].map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>:<input value={editor.data[c.key]||""} disabled={busy} placeholder="" onChange={e=>setEditor({...editor,data:{...editor.data,[c.key]:e.target.value}})} onBlur={e=>setEditor({...editor,data:{...editor.data,[c.key]:cellValue(editor.book,c.key,e.target.value)}})}/>}</label>)}</div><div className="econ-actions"><button type="button" className="econ-button" disabled={busy} onClick={()=>void saveEditor()}>Guardar cambios</button><button type="button" className="econ-outline" disabled={busy} onClick={()=>setEditor(null)}>Cancelar</button></div></section>}
  <section className="econ-card"><h3>Imprimir y preparar archivo para la AEAT</h3><p>{annual.length} registros del ejercicio · {pending} pendientes. El archivo incluye todos los libros del año seleccionado; no se fracciona por trimestre.</p>
   <label>Formato <select value={mode} onChange={e=>{setMode(e.target.value as typeof mode);setReviewed(false);}}><option value="IRPF">Libros IRPF · INGRESOS y GASTOS</option><option value="UNIFICADO">Libros unificados IRPF e IVA</option></select></label>
   <p className="econ-help">La comprobación detecta campos básicos incompletos y errores de formato. Las reglas fiscales que dependen de cada operación requieren revisión antes de presentar.</p>
   <label><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/>He revisado el ejercicio, los libros completos, la actividad, la imputación temporal y el tratamiento fiscal de cada operación.</label>
   <div className="econ-actions"><button type="button" className="econ-outline" disabled={busy||!annual.length} onClick={print}>Imprimir libro / Guardar PDF</button><button type="button" className="econ-outline" disabled={busy||!annual.length} onClick={()=>void download(true)}>Descargar borrador XLSX</button><button type="button" className="econ-button" disabled={busy||!annual.length||pending>0||!reviewed||isPreview} onClick={()=>void download(false)}>Descargar XLSX para AEAT</button><a className="econ-outline" href="https://sede.agenciatributaria.gob.es/Sede/irpf.html" target="_blank" rel="noreferrer">Abrir sede AEAT</a></div>
   <p className="econ-help">La descarga prepara el archivo; no presenta una declaración ni envía datos a la AEAT. Completa también los datos fiscales del titular en «Configuración fiscal».</p>
  </section>
 </section>;
}
