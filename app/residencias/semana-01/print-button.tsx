"use client";
export default function PrintWeekButton({label="Imprimir o guardar como PDF"}:{label?:string}) {
  return <button className="vaweek-print" type="button" onClick={()=>window.print()}>{label}</button>;
}