"use client";

import { useEffect } from "react";
import { jsPDF } from "jspdf";

type PdfSection = { title: string; text: string };
type PdfData = { title: string; patient: string; code: string; recipient?: string; purpose?: string; date: string; sections: PdfSection[] };
declare global { interface Window { ClinicPdfExport?: { download: (data: PdfData) => void } } }

export default function ClinicalPdfExporter() {
  useEffect(() => {
    window.ClinicPdfExport = {
      download(data) {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
        const left = 22, right = 188, pageBottom = 268;
        let y = 25;
        const newPage = () => { doc.addPage(); y = 24; };
        const ensure = (height: number) => { if (y + height > pageBottom) newPage(); };
        const paragraph = (value: string, fontSize = 10.5, bold = false) => {
          doc.setFont("helvetica", bold ? "bold" : "normal");
          doc.setFontSize(fontSize);
          doc.setTextColor(45, 58, 66);
          for (const block of String(value || "").split(/\n/)) {
            const lines = doc.splitTextToSize(block || " ", right - left) as string[];
            for (const line of lines) { ensure(5.4); doc.text(line, left, y); y += 5.4; }
          }
        };
        doc.setDrawColor(112, 135, 147);
        doc.setLineWidth(0.6);
        doc.line(left, 18, right, 18);
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(69, 89, 101);
        doc.text("Carolina Sánchez Girona", left, y); y += 5;
        doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
        doc.text("Psicóloga General Sanitaria y Neuropsicóloga · Col. 24892", left, y); y += 11;
        paragraph(data.title || "Informe clínico", 16, true); y += 5;
        paragraph("Paciente: " + data.patient + "   |   Código: " + data.code, 9);
        if (data.recipient) paragraph("Destinatario: " + data.recipient, 9);
        if (data.purpose) paragraph("Finalidad: " + data.purpose, 9);
        paragraph("Fecha de emisión: " + data.date, 9); y += 7;
        for (const section of data.sections) {
          if (!section.text?.trim()) continue;
          ensure(15);
          doc.setTextColor(69, 89, 101);
          paragraph(section.title, 11.5, true); y += 2;
          paragraph(section.text); y += 8;
        }
        ensure(24); y += 9;
        paragraph("Carolina Sánchez Girona", 10, true);
        paragraph("Documento confidencial. Contiene información de salud.", 8);
        const count = doc.getNumberOfPages();
        for (let page = 1; page <= count; page++) {
          doc.setPage(page); doc.setFont("helvetica", "normal"); doc.setTextColor(107, 118, 125); doc.setFontSize(8);
          doc.text("Página " + page + " / " + count, right, 286, { align: "right" });
        }
        const name = (data.patient + "_" + data.title).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 100);
        doc.save((name || "informe_clinico") + ".pdf");
      }
    };
    return () => { delete window.ClinicPdfExport; };
  }, []);
  return null;
}
