import type { Metadata } from "next";
import LegalDocument from "../components/legal-document";

export const metadata: Metadata = {
  title: "Consentimientos e información para pacientes | Carolina Sánchez Girona",
  description: "Documentación informativa de psicología sanitaria y neuropsicología, y protección de datos.",
  robots: { index: false, follow: true },
};

export default function PatientConsentsPage() {
  return <LegalDocument title="Información y consentimientos clínicos" updatedAt="9 de noviembre de 2026">
    <section>
      <h2>Antes de comenzar la atención</h2>
      <p>Estos documentos permiten conocer con antelación el proceso asistencial. Puedes leerlos, cumplimentar los campos y dibujar tu firma desde el móvil o el ordenador. Después podrás guardarlos como PDF mediante la opción de impresión. La información se revisará con la profesional y el documento firmado deberá entregarse por el canal acordado para incorporarlo a la historia clínica.</p>
      <p><strong>Leer un documento en la web o pedir cita no equivale a prestar consentimiento clínico.</strong> Tampoco se exige aceptar comunicaciones comerciales, cookies analíticas ni otras autorizaciones voluntarias para recibir asistencia.</p>
    </section>
    <section>
      <h2>Documentos disponibles</h2>
      <div className="legal-consent-links">
        <a href="/consentimiento-psicologico/"><strong>Atención psicológica sanitaria</strong><span>Evaluación inicial, intervención, límites de confidencialidad y formulario de firma en pantalla.</span></a>
        <a href="/consentimiento-neuropsicologico/"><strong>Atención neuropsicológica</strong><span>Evaluación, intervención, alcance autorizado y formulario de firma en pantalla.</span></a>
        <a href="/privacidad/"><strong>Política de protección de datos</strong><span>Responsable, finalidades, bases jurídicas, conservación, ejercicio de derechos y acuse de recepción firmable (no es un consentimiento RGPD general).</span></a>
      </div>
    </section>
    <section>
      <h2>Autorizaciones que se gestionan por separado</h2>
      <p>La entrega de informes a terceros, el contacto con informantes, las grabaciones, la participación en investigación o la difusión de material identificable requieren información y, cuando proceda, autorización específica. No quedan incluidas por defecto en el consentimiento asistencial.</p>
      <p>En evaluaciones periciales, intervenciones con menores o situaciones de representación se concretarán la finalidad, la identidad de las personas legitimadas y los destinatarios antes de iniciar el procedimiento.</p>
    </section>
  </LegalDocument>;
}
