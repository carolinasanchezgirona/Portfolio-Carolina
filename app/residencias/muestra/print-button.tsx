"use client";

export default function PrintSampleButton(){
  return <button type="button" className="editorial-btn editorial-btn-primary res-print-action" onClick={()=>window.print()}>
    Imprimir o guardar como PDF <span aria-hidden="true">↗</span>
  </button>;
}
