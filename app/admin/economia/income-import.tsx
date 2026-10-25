"use client";
import { useEffect, useState } from "react";
import { amountCents, dateISO, parseCSV } from "./import-utils";
import { readXlsxLocally } from "./xlsx-reader";

type Income = { received_date:string; concept:string; external_reference:string; amount_cents:number; payment_method:string; source:string };
type Review = Income & { selected:boolean; reviewed:boolean };
type Snapshot = { references:string[]; payments:{date:string; amount:number}[] };
declare global { interface Window { DememoriaIncomeBridge?: { snapshot:()=>Snapshot; importRows:(rows:Income[])=>Promise<number> }; } }
const norm=(v:unknown)=>String(v??"").trim().toLowerCase();
const flat=(v:unknown)=>norm(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");
const fields = [
  ["date","Fecha de cobro",["fecha","fechadecobro","fechacobro","fechaoperacion","fechadeoperacion","date"]],
  ["amount","Importe recibido",["importe","importeeur","ingreso","ingresos","total","totaleur","amount"]],
  ["reference","Factura o referencia",["factura","numerofactura","numerodefactura","nºfactura","referencia","referenciaunica","operacion"]],
  ["method","Medio de pago",["metodo","metododepago","mediodepago","formadepago","pago"]],
] as const;
type Mapping = Record<string,number>;
const euros=(n:number)=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(n/100);
function method(v:unknown){ const s=flat(v); return s.includes("bizum")?"bizum":s.includes("efectivo")?"cash":s.includes("tarjeta")?"card":s.includes("transfer")?"bank_transfer":"other"; }
function issue(r:Income){
  if(!dateISO(r.received_date))return "Revisar fecha";
  if(!Number.isSafeInteger(r.amount_cents)||r.amount_cents<1||r.amount_cents>10000000)return "Revisar importe";
  if(r.external_reference.trim().length<3||r.external_reference.length>100)return "Falta referencia única (factura u operación)";
  if(r.concept.trim().length<5||r.concept.length>200)return "Revisar concepto";
  return "";
}
export default function IncomeImport(){
  const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
  const [sheets,setSheets]=useState<{name:string;rows:unknown[][]}[]>([]),[sheet,setSheet]=useState(0),[header,setHeader]=useState(0);
  const [mapping,setMapping]=useState<Mapping>({}),[rows,setRows]=useState<Review[]>([]),[confirmed,setConfirmed]=useState(false);
  const [snapshot,setSnapshot]=useState<Snapshot>({references:[],payments:[]});
  const [page,setPage]=useState(0);
  useEffect(()=>{const update=()=>{const b=window.DememoriaIncomeBridge;if(b){setReady(true);setSnapshot(b.snapshot());}};
    update();window.addEventListener("dememoria-econ-ready",update);return ()=>window.removeEventListener("dememoria-econ-ready",update);},[]);
  function build(matrix:unknown[][],h:number,map:Mapping){
    const data=matrix.slice(h+1);
    if(data.length>10000)throw Error("Máximo 10.000 filas. Divide el archivo; no se ha importado ninguna.");
    setPage(0);setRows(data.filter(r=>r.some(v=>v!==""&&v!=null)).map(r=>({
      received_date:dateISO(r[map.date]),amount_cents:amountCents(r[map.amount]),external_reference:String(r[map.reference]??"").trim(),
      payment_method:method(r[map.method]),source:"other_documented",concept:"Ingreso profesional documentado",selected:true,reviewed:false
    })));setConfirmed(false);
  }
  function configure(all:typeof sheets,index:number,h:number){
    const matrix=all[index].rows;
    const map=Object.fromEntries(fields.map(([key,,aliases])=>[key,(matrix[h]||[]).findIndex(v=>aliases.some(a=>flat(a)===flat(v)))]));
    setSheet(index);setHeader(h);setMapping(map);build(matrix,h,map);
  }
  async function open(file:File|undefined){
    if(!file)return;setBusy(true);setMessage("");setSheets([]);setRows([]);setConfirmed(false);
    try {
      if(!file.size||file.size>5000000)throw Error("El archivo debe ocupar menos de 5 MB.");
      if(/\.csv$/i.test(file.name)&&file.size>1500000)throw Error("El CSV supera 1,5 MB. Divide el archivo.");
      const all=/\.xlsx$/i.test(file.name)?await readXlsxLocally(file,10031):/\.csv$/i.test(file.name)?[{name:"CSV",rows:parseCSV(await file.text(),10031)}]:null;
      if(!all)throw Error("Selecciona .xlsx o .csv. Si tienes .xls, guárdalo como .xlsx en Excel.");
      const first=all.findIndex(s=>s.rows.length>1);if(first<0)throw Error("No hay filas para importar.");
      setSheets(all);configure(all,first,0);setSnapshot(window.DememoriaIncomeBridge!.snapshot());
      setMessage("Revisa las columnas y referencias. Los abonos negativos, subtotales y filas incompletas quedan excluidos.");
    }catch(e){setMessage(e instanceof Error?e.message:"No se pudo leer el archivo.");}finally{setBusy(false);}
  }
  function change(i:number,patch:Partial<Review>){setRows(old=>old.map((r,n)=>n===i?{...r,...patch}:r));setConfirmed(false);}
  const seen=new Set<string>();
  const knownReferences=new Set(snapshot.references);
  const knownPayments=new Set(snapshot.payments.map(p=>p.date+"|"+p.amount));
  const checks=rows.map(r=>{
    const ref=norm(r.external_reference);
    const duplicate=ref&&(knownReferences.has(ref)||seen.has(ref));seen.add(ref);
    const possible=knownPayments.has(r.received_date+"|"+r.amount_cents);
    return {error:issue(r)||(duplicate?"Referencia ya registrada":""),possible};
  });
  const selected=rows.filter((r,i)=>r.selected&&!checks[i].error&&(!checks[i].possible||r.reviewed));
  async function save(){
    if(busy||!confirmed||!selected.length)return;setBusy(true);setMessage("");
    try{
      const count=await window.DememoriaIncomeBridge!.importRows(selected.map(({selected:_,reviewed:__,...r})=>r));
      setRows([]);setSheets([]);setConfirmed(false);setSnapshot(window.DememoriaIncomeBridge!.snapshot());
      setMessage(count+" ingresos incorporados. El resumen y los movimientos se han actualizado.");
    }catch(e){setMessage(e instanceof Error?e.message:"No se pudo guardar el lote.");}finally{setBusy(false);}
  }
  return <details className="econ-expense-register">
    <summary>Importar ingresos desde Excel</summary>
    <section className="econ-card">
      <h3>Actualizar ingresos del año</h3>
      <p>Sube un Excel .xlsx o CSV con fecha de cobro, importe, referencia de factura u operación y medio de pago. Hasta 10.000 filas. Se analiza en este dispositivo.</p>
      <p>No genera ni renumera facturas. Usa conceptos administrativos sin nombres ni datos clínicos. Los cobros ya registrados se deben excluir.</p>
      <label>Seleccionar Excel o CSV <input type="file" accept=".xlsx,.csv" disabled={!ready||busy} onChange={e=>{void open(e.target.files?.[0]);e.target.value="";}} /></label>
      {message&&<p role="status">{message}</p>}
      {busy&&<p role="status">Procesando…</p>}
      {!!sheets.length&&<fieldset disabled={busy}>
        <legend>Revisar importación</legend>
        <div className="econ-form-grid">
          <label>Hoja <select value={sheet} onChange={e=>configure(sheets,Number(e.target.value),0)}>{sheets.map((s,i)=><option key={i} value={i}>{s.name}</option>)}</select></label>
          <label>Fila de encabezados <select value={header} onChange={e=>configure(sheets,sheet,Number(e.target.value))}>{sheets[sheet].rows.slice(0,30).map((r,i)=><option key={i} value={i}>{i+1}: {r.map(String).join(" · ").slice(0,100)}</option>)}</select></label>
          {fields.map(([key,label])=><label key={key}>{label}<select value={mapping[key]??-1} onChange={e=>{const m={...mapping,[key]:Number(e.target.value)};setMapping(m);build(sheets[sheet].rows,header,m);}}>
            <option value={-1}>Sin asignar</option>{Array.from(sheets[sheet].rows[header]||[],(v,i)=><option key={i} value={i}>{String(v??"Columna "+(i+1))}</option>)}
          </select></label>)}
        </div>
        <p>{rows.length} filas · {selected.length} seleccionadas válidas · Total: <strong>{euros(selected.reduce((s,r)=>s+r.amount_cents,0))}</strong></p>
        <div className="econ-import-scroll"><table className="econ-import-table">
          <thead><tr><th>Incluir</th><th>Fecha cobro</th><th>Referencia</th><th>Importe (€)</th><th>Medio</th><th>Origen</th><th>Comprobación</th></tr></thead>
          <tbody>{rows.slice(page*100,(page+1)*100).map((r,n)=>{const i=page*100+n;return <tr key={i}>
            <td><input aria-label={"Incluir ingreso "+(i+1)} type="checkbox" checked={r.selected} disabled={!!checks[i].error} onChange={e=>change(i,{selected:e.target.checked})}/></td>
            <td><input aria-label={"Fecha ingreso "+(i+1)} type="date" value={r.received_date} onChange={e=>change(i,{received_date:e.target.value,reviewed:false})}/></td>
            <td><input aria-label={"Referencia ingreso "+(i+1)} maxLength={100} value={r.external_reference} onChange={e=>change(i,{external_reference:e.target.value})}/></td>
            <td><input aria-label={"Importe ingreso "+(i+1)} inputMode="decimal" defaultValue={r.amount_cents?(r.amount_cents/100).toFixed(2):""} key={sheet+"-"+header+"-"+mapping.amount+"-"+i+"-"+r.amount_cents} onBlur={e=>change(i,{amount_cents:amountCents(e.target.value),reviewed:false})}/></td>
            <td><select aria-label={"Medio ingreso "+(i+1)} value={r.payment_method} onChange={e=>change(i,{payment_method:e.target.value})}>{[["bizum","Bizum"],["bank_transfer","Transferencia"],["cash","Efectivo"],["card","Tarjeta"],["other","Otro"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></td>
            <td><select aria-label={"Origen ingreso "+(i+1)} value={r.source} onChange={e=>change(i,{source:e.target.value})}><option value="other_documented">Otro ingreso documentado</option><option value="external_invoice">Factura externa</option></select></td>
            <td>{checks[i].error|| (checks[i].possible?<label><input type="checkbox" checked={r.reviewed} onChange={e=>change(i,{reviewed:e.target.checked})}/>Misma fecha e importe: he comprobado que es otro cobro</label>:"Correcto")}</td>
          </tr>;})}</tbody></table></div>
        <p><button type="button" className="econ-outline" disabled={page===0} onClick={()=>setPage(p=>p-1)}>Anterior</button> Página {page+1} de {Math.max(1,Math.ceil(rows.length/100))} <button type="button" className="econ-outline" disabled={(page+1)*100>=rows.length} onClick={()=>setPage(p=>p+1)}>Siguiente</button></p>
        <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>He revisado las filas y el total. Son ingresos profesionales documentados y no duplican otros cobros.</label>
        <p><button type="button" className="econ-button" disabled={!confirmed||!selected.length||busy} onClick={()=>void save()}>Incorporar {selected.length} ingresos · {euros(selected.reduce((s,r)=>s+r.amount_cents,0))}</button></p>
      </fieldset>}
    </section>
  </details>;
}
