import { jsPDF } from "jspdf";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
const navy = [48, 71, 80], slate = [112, 135, 147], mist = [128, 157, 168], stone = [160, 160, 160], ivory = [242, 239, 231], pearl = [237, 237, 237];
const ink = () => doc.setTextColor(...navy);
const muted = () => doc.setTextColor(...slate);
const t = (text, x, y, size = 11, bold = false, color = navy) => {
  doc.setFont("helvetica", bold ? "bold" : "normal");
  doc.setFontSize(size); doc.setTextColor(...color); doc.text(text, x, y);
};
const h = (text, x, y, size = 20) => {
  doc.setFont("times", "bold"); doc.setFontSize(size); ink(); doc.text(text, x, y);
};
const rule = (y) => { doc.setDrawColor(...pearl); doc.setLineWidth(0.9); doc.line(45, y, 550, y); };
const price = (label, amount, y, sub) => {
  t(label, 62, y, 11, false);
  doc.setFont("helvetica", "bold"); doc.setFontSize(16); ink(); doc.text(amount, 532, y, { align: "right" });
  if (sub) t(sub, 62, y + 17, 8.6, false, slate);
  rule(y + 29);
};

doc.setDrawColor(...mist); doc.setLineWidth(2.4); doc.line(45, 47, 72, 47);
t("CAROLINA SÁNCHEZ GIRONA", 84, 52, 14, true);
t("Psicóloga General Sanitaria · Neuropsicóloga", 45, 77, 10.3, false, stone);
h("Tarifas de consultoría", 45, 119, 26);
h("neuropsicológica", 45, 148, 26);
doc.setFillColor(...ivory); doc.roundedRect(45, 163, 330, 24, 8, 8, "F");
t("Para particulares y profesionales · Noviembre 2026", 56, 179, 9.4, true, slate);
rule(205);

t("01  /  CLIENTES PARTICULARES", 45, 239, 10.5, true, slate);
h("Valoración neuropsicológica en el ámbito jurídico", 45, 266, 18);
t("Evaluación especializada con alcance definido según el caso, la documentación", 45, 290, 10.2);
t("y las actuaciones necesarias.", 45, 306, 10.2);
doc.setFillColor(...pearl); doc.roundedRect(45, 321, 505, 56, 8, 8, "F");
t("DESDE", 61, 344, 9.6, true, slate);
t("907,50 €  ·  IVA incluido", 61, 365, 17.5, true);
t("El presupuesto definitivo y las actuaciones adicionales se acuerdan previamente.", 45, 397, 9.1, false, slate);

t("02  /  PROFESIONALES", 45, 429, 10.5, true, slate);
h("Consultoría neuropsicológica preliminar", 45, 454, 18);
t("Revisión técnica documental y conclusiones orientativas (1–2 páginas).", 45, 474, 9.8);
price("Expediente breve", "181,50 €", 503, "Hasta 15 páginas · Base imponible: 150 €");
price("Expediente medio", "242 €", 558, "Más de 15 y hasta 40 páginas · Base imponible: 200 €");
price("Expediente complejo", "302,50–363 €", 613, "Historial extenso y múltiples informes · Base imponible: 250–300 €");

doc.setFillColor(...ivory); doc.roundedRect(45, 652, 505, 77, 8, 8, "F");
t("QUÉ INCLUYE LA REVISIÓN PRELIMINAR", 60, 675, 10, true, slate);
t("Revisión documental y análisis clínico-funcional, indicadores relevantes,", 60, 695, 9.6);
t("orientación sobre viabilidad pericial y recomendaciones por escrito.", 60, 712, 9.6);
t("CONDICIONES", 45, 753, 9.7, true, slate);
t("Pago anticipado. Entrega estimada en 3–5 días hábiles desde la recepción", 45, 771, 9.2);
t("completa de la documentación. No constituye un informe pericial judicial.", 45, 787, 9.2);
rule(802);
t("carolinasanchezgirona.com", 45, 820, 9.7, true);
doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); muted();
doc.text("Todos los importes incluyen el 21 % de IVA", 550, 820, { align: "right" });

const path = join(process.cwd(), "public", "tarifas-consultoria-neuropsicologica.pdf");
mkdirSync(join(process.cwd(), "public"), { recursive: true });
writeFileSync(path, Buffer.from(doc.output("arraybuffer")));
console.log("Created " + path);
