"use client";

export default function PrintLegal() {
  return <button type="button" className="legal-print" onClick={() => window.print()}>
    Imprimir o guardar como PDF
  </button>;
}
