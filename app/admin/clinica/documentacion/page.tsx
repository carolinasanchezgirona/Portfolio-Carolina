import type { Metadata } from "next";
import AdminWorkspaceNav from "../../workspace-nav";
import "./documentacion.css";

export const metadata: Metadata = {
  title: "Documentación clínica | Gestión clínica",
  robots: { index: false, follow: false, nocache: true },
};

const documents = [
  ["00", "Guía maestra del protocolo", "Protocolo"],
  ["01", "Admisión y condiciones", "Admisión y consentimiento"],
  ["02", "Consentimiento asistencial", "Admisión y consentimiento"],
  ["03", "Privacidad y autorizaciones", "Admisión y consentimiento"],
  ["04", "Entrevista con progenitores", "Entrevistas y observación"],
  ["05", "Entrevista y observación del menor", "Entrevistas y observación"],
  ["06", "Formulario para informante escolar", "Entrevistas y observación"],
  ["07", "Selección y registro de pruebas", "Evaluación y diagnóstico"],
  ["08", "Matriz de integración diagnóstica", "Evaluación y diagnóstico"],
  ["09", "Informe clínico · 500 €", "Informes"],
  ["10", "Informe neuropsicológico ampliado · 700 €", "Informes"],
  ["11", "Devolución de resultados y plan", "Devolución"],
  ["12", "Checklist de control de calidad", "Protocolo"],
] as const;

export default function DocumentacionClinicaPage() {
 return <main className="clinic-documentation">
    <AdminWorkspaceNav active="biblioteca" />
    <header className="doc-head">
      <div><p className="doc-eyebrow">Gestión clínica · Biblioteca profesional</p>
      <h1>Documentación</h1>
      <p>Protocolos, entrevistas, formularios e informes para uso profesional.</p></div>
      <a href="/admin/clinica/?panel=1">Volver a Gestión Clínica</a>
    </header>
    <section className="doc-panel" style={{marginBottom:20}}><div className="doc-panel-heading"><div><p className="doc-eyebrow">Informes psicológicos y neuropsicológicos</p><h2>Informes y valoraciones</h2><p>Modalidades, criterios de admisión, checklist y estructuras de informe para uso profesional. Sin duplicar las evaluaciones existentes.</p></div><a href="/admin/clinica/informes/">Abrir espacio de informes →</a></div></section>
    <section className="doc-panel" style={{marginBottom:20}}><div className="doc-panel-heading"><div><p className="doc-eyebrow">Evaluación neuropsicológica</p><h2>Protocolos clínicos completos</h2><p>Infantojuvenil (6–17 años) y adultos (18+) · almacenados en la biblioteca profesional.</p></div><a href="/admin/clinica/protocolos/">Abrir protocolos →</a></div></section>
    <section className="doc-panel">
      <div className="doc-panel-heading"><div><p className="doc-eyebrow">TDAH infantil y adolescente</p><h2>Protocolo de evaluación</h2><p>Modalidad clínica: 500 € · Neuropsicológica ampliada: 700 €</p></div><span>13 documentos</span></div>
      <p className="doc-notice">Catálogo preparado. Los archivos Word/PDF están pendientes de incorporarse al almacenamiento privado de la aplicación. No se ofrecen enlaces de descarga hasta que estén cargados y protegidos. La documentación clínica de menores debe mantenerse fuera de las áreas públicas.</p>
      <div className="doc-rows">
       {documents.map(([number,title,category])=><article key={number} className="doc-row">
          <span className="doc-number">{number}</span>
          <div><strong>{title}</strong><small>{category}</small></div>
          <span className="doc-pending">Archivo pendiente</span>
       </article>)}
      </div>
    </section>
  </main>;
}
