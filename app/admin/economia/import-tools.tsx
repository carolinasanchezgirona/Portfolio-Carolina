"use client";

import { useEffect, useMemo, useState } from "react";
import { amountCents, categoryFrom, createReviewRows, dateISO, expenseIssue, fingerprint, guessColumns, parseCSV, type Category, type ColMap, type ExpenseDraft, type ReviewRow } from "./import-utils";
import { readXlsxLocally } from "./xlsx-reader";

type Bridge = {
  existing: () => ExpenseDraft[];
  stageExpense: (row: ExpenseDraft) => void;
  importExpenses: (rows: ExpenseDraft[]) => Promise<number>;
};
declare global { interface Window { DememoriaEconBridge?: Bridge; } }
const categories: {value: Category; name: string}[] = [
  {value:"rent",name:"Alquiler"},{value:"utilities",name:"Suministros"},
  {value:"software",name:"Programas"},{value:"materials",name:"Materiales"},
  {value:"marketing",name:"Publicidad"},{value:"training",name:"Formación"},
  {value:"professional",name:"Servicios profesionales"},{value:"other",name:"Otros"}
];
const money = (cents:number) => (cents/100).toFixed(2).replace(".",",");
const targets:{key:keyof ColMap;name:string}[]=[
  {key:"date",name:"Fecha"},{key:"supplier",name:"Proveedor"},{key:"concept",name:"Concepto"},
  {key:"amount",name:"Importe total"},{key:"category",name:"Categoría (opcional)"}
];
const MAX_XLSX=5_000_000, MAX_CSV=1_500_000, MAX_OCR=8_000_000;

function guessInvoice(text:string):ExpenseDraft {
  const lines=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,120);
  const header=lines.slice(0,14).find(s=>s.length>=3&&s.length<=120&&!/^(factura|invoice|nif|cif|tel|www|http|fecha|numero|núm|serie|direcci[oó]n|cliente|destinatario)/i.test(s)) || "";
  const labeledDate = text.match(/(?:fecha(?:\s+de\s+(?:factura|emisi[oó]n))?)\s*[:\s#-]+\s*(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{4}|\d{4}-\d{2}-\d{2})/i)?.[1];
  const anyDate = text.match(/\b(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{4}|\d{4}-\d{2}-\d{2})\b/)?.[1];
  const totals=lines.filter(s=>/total\s*(?:a\s*pagar|factura)?|importe\s+total/i.test(s)).reverse();
  const amountPattern=/(\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})|\d+(?:[.,]\d{2}))\s*(?:€|EUR)?/gi;
  let total=0;
  for(const line of totals){const numbers=[...line.matchAll(amountPattern)].map(m=>amountCents(m[1])).filter(n=>n>0);
    if(numbers.length){ total=numbers[numbers.length-1]; break; }
  }
  const conceptLine=lines.find(line=>/(servicios|concepto|descripci[oó]n|material|suscripci[oó]n)/i.test(line)&&line.length<170) || "Factura recibida: revisar concepto";
  return {expense_date:dateISO(labeledDate||anyDate),category:categoryFrom(conceptLine),
    supplier:header.slice(0,160),concept:conceptLine.slice(0,250),amount_cents:total};
}

export default function EconomyImportTools() {
  const [connected,setConnected]=useState(false);
  const [busy,setBusy]=useState("");
  const [message,setMessage]=useState("");
  const [ocr,setOcr]=useState<ExpenseDraft|null>(null);
  const [rawOcr,setRawOcr]=useState("");
  const [sheets,setSheets]=useState<{name:string;rows:unknown[][]}[]>([]);
  const [sheetIndex,setSheetIndex]=useState(0);
  const [map,setMap]=useState<ColMap>({date:-1,supplier:-1,concept:-1,amount:-1,category:-1});
  const [rows,setRows]=useState<ReviewRow[]>([]);
  const [fileName,setFileName]=useState("");
  const [confirmed,setConfirmed]=useState(false);
  const [existing,setExisting]=useState<ExpenseDraft[]>([]);
  useEffect(()=>{
    const update=()=>{const bridge=window.DememoriaEconBridge;if(bridge){setConnected(true);setExisting(bridge.existing());}};
    window.addEventListener("dememoria-econ-ready",update); update();
    return ()=>window.removeEventListener("dememoria-econ-ready",update);
  },[]);
  const duplicates=useMemo(()=>{
    const known=new Set(existing.map(fingerprint)),seen=new Set<string>();
    return rows.map(row=>{const key=fingerprint(row);const duplicate=known.has(key)||seen.has(key);seen.add(key);return duplicate;});
  },[rows,existing]);
  const selected=rows.filter((r,i)=>r.selected&&!r.issue&&!duplicates[i]);
  const invalid=rows.filter(r=>r.issue).length;
  const repeated=rows.filter((r,i)=>duplicates[i]).length;
  const hasSheet=sheets.length>0;

  async function scanInvoice(file:File|undefined){
    if(!file)return;
    if(!connected){setMessage("Inicia sesión como administradora.");return;}
    if(file.size>MAX_OCR || file.size===0){setMessage("La imagen debe ocupar menos de 8 MB.");return;}
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){
      setMessage("El OCR admite fotografías JPG, PNG y WebP. Para una factura PDF, exporta la página como imagen y revísala antes de registrarla.");
      return;
    }
    setOcr(null);setRawOcr("");setBusy("Reconociendo el texto de la factura en tu navegador…");setMessage("");
    let worker:Awaited<ReturnType<typeof import("tesseract.js")["createWorker"]>>|undefined;
    try{
      const { createWorker }=await import("tesseract.js");
      worker=await createWorker("spa");
      const result=await worker.recognize(file);
      const text=String(result.data.text||"").slice(0,18000);
      if(!text.trim())throw new Error("No se ha reconocido texto suficiente. Prueba con una imagen más nítida.");
      setRawOcr(text);setOcr(guessInvoice(text));
      setMessage("Lectura terminada. Comprueba proveedor, fecha, concepto e importe: el OCR puede equivocarse.");
    }catch(error){setMessage(error instanceof Error?error.message:"No se pudo leer la factura.");}
    finally{if(worker)await worker.terminate().catch(()=>{});setBusy("");}
  }
  async function openSpreadsheet(file:File|undefined){
    if(!file)return;
    if(!connected){setMessage("Inicia sesión como administradora.");return;}
    setRows([]);setSheets([]);setConfirmed(false);setFileName("");setBusy("Leyendo el archivo en este dispositivo…");setMessage("");
    try{
      let result:{name:string;rows:unknown[][]}[]=[];
      if(/\.xlsx$/i.test(file.name)){
        if(file.size>MAX_XLSX)throw new Error("El archivo .xlsx supera 5 MB.");
        result=await readXlsxLocally(file);
      }else if(/\.csv$/i.test(file.name)){
        if(file.size>MAX_CSV)throw new Error("El archivo CSV supera 1,5 MB.");
        result=[{name:"CSV",rows:parseCSV(await file.text())}];
      }else throw new Error("Admite Excel .xlsx o CSV. Los .xls antiguos deben guardarse como .xlsx.");
      if(!result.some(sheet=>sheet.rows.length>1))throw new Error("No se han encontrado filas de gastos.");
      setFileName(file.name);setSheets(result);setSheetIndex(0);
      const first=result[0].rows;
      const mapping=guessColumns(first[0]||[]);
      setMap(mapping);setRows(createReviewRows(first,mapping));
      setMessage("Antes de incorporar gastos, revisa columnas, fechas, categorías, importes y duplicados.");
    }catch(error){setMessage(error instanceof Error?error.message:"No ha sido posible abrir la hoja de cálculo.");}
    finally{setBusy("");}
  }
  function switchSheet(index:number){
    const sheet=sheets[index];if(!sheet)return;
    setSheetIndex(index);const next=guessColumns(sheet.rows[0]||[]);
    setMap(next);setRows(createReviewRows(sheet.rows,next));setConfirmed(false);
  }
  function mappingChange(key:keyof ColMap,index:number){
    const next={...map,[key]:index};
    setMap(next);setRows(createReviewRows(sheets[sheetIndex].rows,next));setConfirmed(false);
  }
  function changeRow(index:number,patch:Partial<ExpenseDraft>){
    setRows(old=>old.map((r,i)=>i===index?({...r,...patch,issue:expenseIssue({...r,...patch})}):r));
    setConfirmed(false);
  }
  async function importSelected(){
    const bridge=window.DememoriaEconBridge;
    if(!bridge||!connected||!confirmed||busy||!selected.length)return;
    setBusy("Guardando gastos revisados…");setMessage("");
    try{
      const count=await bridge.importExpenses(selected.map(({expense_date,category,supplier,concept,amount_cents})=>({expense_date,category,supplier,concept,amount_cents})));
      setExisting(bridge.existing());setRows([]);setSheets([]);setConfirmed(false);setFileName("");
      setMessage(count+" gastos incorporados. Se ha actualizado el resumen contable.");
    }catch(error){setMessage(error instanceof Error?error.message:"No se pudo guardar el lote. Revisa los datos.");}
    finally{setBusy("");}
  }

  return <section className="econ-import-tools" aria-label="Lector OCR y archivos de contabilidad">
    <div className="econ-import-title">
      <div><p className="econ-eyebrow">Entrada asistida y revisión</p><h3>Leer facturas e importar Excel</h3></div>
      <span className="econ-import-label">Revisión obligatoria</span>
    </div>
    <p className="econ-help">Los archivos se analizan en tu navegador. No se suben ni se guardan como adjuntos, y no se generan facturas emitidas. Los registros aprobados se incorporan únicamente al libro de gastos de esta consulta.</p>
    <div className="econ-import-columns">
      <div className="econ-import-panel">
        <h4>1. Leer factura recibida (OCR)</h4>
        <p>Fotografía o captura nítida en JPG, PNG o WebP. El lector propone datos, pero no los registra.</p>
        <label className="econ-upload-label">Seleccionar imagen de factura
          <input type="file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" disabled={!connected||!!busy}
            onChange={e=>{void scanInvoice(e.target.files?.[0]);e.target.value="";}}/>
        </label>
        {ocr&&<div className="econ-ocr-review">
          <h4>Verificar datos reconocidos</h4>
          <div className="econ-import-fields">
            <label>Fecha <input aria-label="Fecha OCR" type="date" value={ocr.expense_date} onChange={e=>setOcr({...ocr,expense_date:e.target.value})}/></label>
            <label>Proveedor <input aria-label="Proveedor OCR" maxLength={160} value={ocr.supplier} onChange={e=>setOcr({...ocr,supplier:e.target.value})}/></label>
            <label>Concepto <input aria-label="Concepto OCR" maxLength={250} value={ocr.concept} onChange={e=>setOcr({...ocr,concept:e.target.value})}/></label>
            <label>Importe total (€) <input aria-label="Importe OCR" inputMode="decimal" value={ocr.amount_cents?money(ocr.amount_cents):""}
              onChange={e=>setOcr({...ocr,amount_cents:amountCents(e.target.value)})}/></label>
            <label>Categoría <select aria-label="Categoría OCR" value={ocr.category} onChange={e=>setOcr({...ocr,category:e.target.value as Category})}>
              {categories.map(cat=><option key={cat.value} value={cat.value}>{cat.name}</option>)}</select></label>
          </div>
          {expenseIssue(ocr)&&<p role="alert" className="econ-import-error">{expenseIssue(ocr)}</p>}
          <button type="button" className="econ-outline" disabled={!!busy||!!expenseIssue(ocr)}
            onClick={()=>{window.DememoriaEconBridge?.stageExpense(ocr);setMessage("Datos pasados al formulario «Registrar gasto». Revisa y guarda cuando quieras.");}}>Pasar a formulario para guardar</button>
          <details><summary>Ver texto reconocido</summary><pre className="econ-ocr-raw">{rawOcr}</pre></details>
        </div>}
      </div>
      <div className="econ-import-panel">
        <h4>2. Importar gastos desde Excel</h4>
        <p>Archivos .xlsx y .csv, hasta 250 filas por importación. Previsualización y control de duplicados antes de guardar.</p>
        <label className="econ-upload-label">Seleccionar Excel o CSV
          <input type="file" accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" disabled={!connected||!!busy}
            onChange={e=>{void openSpreadsheet(e.target.files?.[0]);e.target.value="";}}/>
        </label>
        <p className="econ-import-small">Columnas recomendadas: Fecha, Categoría, Proveedor, Concepto, Importe EUR. La importación no altera facturas emitidas ni pagos.</p>
      </div>
    </div>
    {busy&&<p className="econ-import-busy" role="status">{busy}</p>}
    {message&&<p className="econ-import-message" role="status">{message}</p>}
    {hasSheet&&<div className="econ-import-review">
      <div className="econ-import-head">
        <div><h4>Vista previa de {fileName}</h4><p>Corrige filas y selecciona las que deseas incorporar. Los importes corresponden al total del gasto, no al IVA deducible.</p></div>
        {sheets.length>1&&<label>Hoja <select value={sheetIndex} onChange={e=>switchSheet(Number(e.target.value))}>
          {sheets.map((s,i)=><option key={i} value={i}>{s.name}</option>)}</select></label>}
      </div>
      <div className="econ-import-mapping">
        {targets.map(({key,name})=><label key={key}>{name}
          <select value={map[key]} onChange={e=>mappingChange(key,Number(e.target.value))}>
            <option value={-1}>No asignada</option>
            {(sheets[sheetIndex].rows[0]||[]).map((name,i)=><option key={i} value={i}>{String(name||"Columna "+(i+1)).slice(0,60)}</option>)}
          </select>
        </label>)}
      </div>
      <p className="econ-import-count">{rows.length} filas leídas · {invalid} con errores · {repeated} posibles duplicados · {selected.length} listas para importar</p>
      <div className="econ-import-scroll">
        <table className="econ-import-table"><thead><tr><th>Incluir</th><th>Fecha</th><th>Proveedor</th><th>Concepto</th><th>Categoría</th><th>Total (€)</th><th>Comprobación</th></tr></thead>
          <tbody>{rows.map((row,i)=><tr key={row.key} className={row.issue||duplicates[i]?"econ-import-attention":""}>
            <td><input type="checkbox" aria-label={"Incluir fila "+row.source} checked={row.selected} disabled={!!row.issue||duplicates[i]} onChange={e=>setRows(old=>old.map((r,n)=>n===i?{...r,selected:e.target.checked}:r))}/></td>
            <td><input type="date" aria-label={"Fecha fila "+row.source} value={row.expense_date} onChange={e=>changeRow(i,{expense_date:e.target.value})}/></td>
            <td><input aria-label={"Proveedor fila "+row.source} maxLength={160} value={row.supplier} onChange={e=>changeRow(i,{supplier:e.target.value})}/></td>
            <td><input aria-label={"Concepto fila "+row.source} maxLength={250} value={row.concept} onChange={e=>changeRow(i,{concept:e.target.value})}/></td>
            <td><select aria-label={"Categoría fila "+row.source} value={row.category} onChange={e=>changeRow(i,{category:e.target.value as Category})}>
              {categories.map(cat=><option key={cat.value} value={cat.value}>{cat.name}</option>)}</select></td>
            <td><input aria-label={"Importe fila "+row.source} type="text" inputMode="decimal" value={row.amount_cents?money(row.amount_cents):""} onChange={e=>changeRow(i,{amount_cents:amountCents(e.target.value)})}/></td>
            <td>{row.issue|| (duplicates[i]?"Posible duplicado":"Correcto")}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <label className="econ-import-confirm"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> He revisado las filas seleccionadas, los duplicados y el importe total. Confirmo que son gastos de esta consulta.</label>
      <button type="button" className="econ-button" disabled={!selected.length||!confirmed||!!busy} onClick={()=>void importSelected()}>
        Incorporar {selected.length} gastos revisados
      </button>
    </div>}
  </section>;
}
