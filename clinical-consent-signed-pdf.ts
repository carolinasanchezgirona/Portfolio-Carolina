import { jsPDF } from "jspdf";
import { contents, CONSENT_VERSION, type ConsentKind } from "./clinical-consent-pdf";

export type ConsentSignedData = {
  patient_name: string;
  birth_date: string;
  national_id: string;
  place: string;
  declared_date: string;
  signer: "patient" | "representative";
  representative_name: string;
  representation: string;
  scope: string;
  signature_png: string;
  signing_method: "drawn_portal" | "typed_email_otp" | "drawn_onsite";
  typed_name: string;
  verified_email_code_at: string;
  accepted: true;
  signed_at: string;
  evidence_sha256: string;
  document_id: string;
};

export function signedConsentPdf(kind: ConsentKind, data: ConsentSignedData): Uint8Array {
  const doc = contents[kind];
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  pdf.setProperties({
    title: doc.title,
    author: "Carolina Sánchez Girona",
    subject: "Copia firmada electrónicamente de documento asistencial",
  });
  let y = 20;
  const left = 20;
  function check(n = 9) {
    if (y + n > 272) { pdf.addPage(); y = 20; }
  }
  function text(value: string, bold = false, space = 3, fontSize = 10) {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(fontSize);
    pdf.setTextColor(31, 48, 57);
    const rows = pdf.splitTextToSize(value, 170) as string[];
    for (const row of rows) { check(5); pdf.text(row, left, y); y += 5; }
    y += space;
  }
  text(doc.title, true, 6, 16);
  text("Versión "+CONSENT_VERSION+"  ·  Referencia "+data.document_id, false, 5, 9);
  text("Datos de la persona atendida", true);
  text("Nombre: "+data.patient_name);
  text("Nacimiento: "+(data.birth_date || "No consta")+"   Documento: "+(data.national_id || "No consta"));
  text("Profesional: Carolina Sánchez Girona, psicóloga y neuropsicóloga, COPC 24892.", false, 5);
  text("1. Finalidad", true);
  text(doc.lead+" Los procedimientos concretos se explicarán y acordarán antes de su realización.");
  text("2. Procedimientos e información", true);
  for (const item of doc.procedures) text("• "+item, false, 2);
  text("3. Beneficios, riesgos y alternativas", true);
  text("Se ha informado sobre el objeto, las alternativas, la no realización de la intervención y los límites previsibles.");
  text(doc.effects);
  text("4. Confidencialidad, protección de datos y autonomía", true);
  text("La información clínica queda sujeta a confidencialidad y a sus excepciones legales. Este documento no autoriza cesiones generales, grabaciones, publicidad ni investigación. La información y los derechos de protección de datos figuran en la política de privacidad de la consulta, versión 2026-11-09.");
  text("Puede formular dudas, rechazar procedimientos y retirar su consentimiento asistencial, sin perjuicio de las obligaciones legales de documentación clínica.");
  text("5. Declaración documentada", true);
  text(doc.scope);
  if (kind === "neuro_evaluacion") text("Actuación autorizada: evaluación neuropsicológica.", true);
  if (kind === "neuro_intervencion") text("Actuación autorizada: intervención o seguimiento neuropsicológico.", true);
  if (kind === "privacidad") text("Esta declaración es únicamente un acuse de recepción de información; no es un consentimiento general para tratar datos sanitarios.", true);
  text("Firmante: "+(data.signer === "representative" ? "representante legal acreditado (pendiente de verificación profesional)" : "persona atendida"));
  if (data.signer === "representative") {
    text("Nombre representante: "+data.representative_name);
    text("Vínculo / representación declarada: "+data.representation);
  }
  text("Lugar declarado: "+data.place+"   Fecha declarada: "+data.declared_date);
  text("Registrado en el servidor: "+data.signed_at);
  const methodLabels = { drawn_portal: "Firma manuscrita en Mi espacio", typed_email_otp: "Firma mediante nombre escrito y código de correo", drawn_onsite: "Firma presencial mediante enlace temporal generado por la profesional" };
  text("Modalidad: "+methodLabels[data.signing_method], true);
  if(data.verified_email_code_at) text("Código de un solo uso verificado en servidor: "+data.verified_email_code_at);
  check(data.signing_method === "typed_email_otp" ? 35 : 55);
  if (data.signing_method === "typed_email_otp") {
    text("Nombre escrito como firma: "+data.typed_name, true);
    text("Declaración afirmativa confirmada mediante código temporal enviado al correo de la ficha.", false, 5);
  } else {
    text("Firma manuscrita dibujada en pantalla", true);
    pdf.addImage(data.signature_png, "PNG", left, y, 110, 31);
    y += 37;
  }
  text("Evidencia SHA-256: "+data.evidence_sha256, false, 3, 8);
  text("Firma electrónica simple, incluso cuando se utiliza un código de un solo uso. Pendiente de cotejo de identidad, capacidad y representación por la profesional. No equivale automáticamente a firma electrónica avanzada o cualificada.", false, 4, 9);
  const total = pdf.getNumberOfPages();
  for (let index = 1; index <= total; index++) {
    pdf.setPage(index);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(99, 114, 121);
    pdf.text("Documento recibido para revisión profesional  ·  "+CONSENT_VERSION, left, 286);
    pdf.text(String(index)+" / "+String(total), 181, 286);
  }
  return new Uint8Array(pdf.output("arraybuffer"));
}
