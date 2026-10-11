"use client";

export default function PrintDossierAction() {
  return (
    <button type="button" className="editorial-btn editorial-btn-primary" onClick={() => window.print()}>
      Imprimir o guardar como PDF
    </button>
  );
}
